import React, { useState, useMemo } from 'react';
import {
  Volume2, Copy, Play, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  HelpCircle, Download, Square, X, Check, Share2
} from 'lucide-react';
import { translateMorseToText, getCharacterBreakdown, calculateStatistics, normalizeMorseInput } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';

export function TurkishMorseToEnglishPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const alphabetEntries = Object.entries(MORSE_CODE_MAP).filter(([_, data]) => data.type === 'letter');

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Normalize and convert Morse to English text
  const normalizedMorse = useMemo(() => normalizeMorseInput(morseInput), [morseInput]);

  const englishOutput = useMemo(() => {
    if (!normalizedMorse.trim()) return '';
    return translateMorseToText(normalizedMorse);
  }, [normalizedMorse]);

  // Breakdown for audio playback and visualization
  const breakdown = useMemo(() => {
    if (!normalizedMorse.trim()) return [];
    return getCharacterBreakdown(englishOutput, normalizedMorse);
  }, [englishOutput, normalizedMorse]);

  const stats = useMemo(() => {
    return calculateStatistics(englishOutput, normalizedMorse, wpm, wpm);
  }, [englishOutput, normalizedMorse, wpm]);

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Mors kodu' : 'İngilizce metin'} kopyalandı ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  const handleDownloadWav = () => {
    if (!normalizedMorse) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: normalizedMorse, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-to-english-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('WAV ses dosyası indirildi ✓');
    } catch {
      if (showToast) showToast('Ses dosyası oluşturulamadı.');
    }
  };

  const handleShare = () => {
    if (!englishOutput) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#morse=${encodeURIComponent(normalizedMorse)}`;
    navigator.clipboard.writeText(shareUrl);
    if (showToast) showToast('Paylaşılabilir bağlantı panoya kopyalandı ✓');
  };

  const faqs = [
    {
      q: "Mors kodunu İngilizceye nasıl çevirebilirim?",
      a: "Mors kodunuzu yukarıdaki giriş kutusuna yapıştırın. Harfler arasında standart olarak 1 boşluk, kelimeler arasında ise '/' veya 3 boşluk kullanın. Çevirici, her Mors kombinasyonunu otomatik olarak Latin harfine dönüştürür."
    },
    {
      q: ".... . .-.. .-.. --- ne anlama gelir?",
      a: "Bu ifade HELLO (Merhaba) anlamına gelir. Sırasıyla H (....), E (.), L (.-..), L (.-..) ve O (---) harflerini temsil eder."
    },
    {
      q: "... --- ... ne anlama gelir?",
      a: "Bu ifade SOS anlamına gelir. Uluslararası alanda tanınan acil durum ve yardım çağrısıdır. Telsiz aktarımında genellikle kesintisiz olarak (...---...) tek parça halinde gönderilir."
    },
    {
      q: "Boşluk bırakılmayan bir Mors kodu çözülebilir mi?",
      a: "Güvenilir bir şekilde hayır. Mors kodu harf sınırlarına (boşluklara) dayanır. Harfler arasındaki boşluk kaldırıldığında tek bir nokta-çizgi dizisi onlarca farklı kelime kombinasyonuna çözülebilir. SOS sinyali istisnadır çünkü resmi olarak birleşik ve tek parça bir prosedür işareti (prosign) olarak iletilir."
    },
    {
      q: "Mors alfabesinde '/' işareti ne anlama gelir?",
      a: "Yazılı Mors kodunda '/' işareti kelime boşluğunu (word break) gösterir. Örneğin: '.... .. / - .... . .-. .' ifadesi 'HI THERE' demektir. Telsiz aktarımında eğik çizgi sesi çalınmaz; onun yerine 7 birimlik sessizlik (bekleme süresi) verilir."
    },
    {
      q: "Mors çevirim neden yanlış veya anlamsız çıktı?",
      a: "Öncelikle harf boşluklarını kontrol edin. Eksik bir nokta, fazladan bir çizgi, yanlış tire karakteri (örneğin uzun tire '—' yerine kısa tire '-') veya bitişik yazılmış harfler çeviriyi bozar. Girdiyi kontrol edip harfler arasına tek bir boşluk ekleyin."
    },
    {
      q: "Mors kodu ses kaydından çevrilebilir mi?",
      a: "Sesli Mors kodunun çözülmesi zamanlama analizine (kısa ve uzun sinyal sürelerinin tespiti) dayanır. Metin tabanlı çeviriciler yazılı simgelerle çalışırken, ses çözümlemesi için 'Mors Kodu Sesli Çeviri' modülümüz kullanılmalıdır."
    },
    {
      q: "Görsel veya fotoğraftaki Mors kodu çevrilebilir mi?",
      a: "Evet. Fotoğraftaki veya dövmedeki noktaları '.' ve çizgileri '-' olarak transkribe edip harfler arasına boşluk bırakarak bu araca yapıştırabilirsiniz. Ya da 'Görsel Mors Kodu Çözücü' aracımıza görseli yükleyebilirsiniz."
    },
    {
      q: "Mors kodu başlı başına bağımsız bir dil midir?",
      a: "Hayır. Mors kodu bir dil değil, karakterleri sinyallere dönüştüren bir kodlama (encoding) sistemidir. İngilizce, Türkçe, Fransızca gibi dillerdeki harfleri temsil eder."
    },
    {
      q: "Mors kodu dünyanın her yerinde aynı mıdır?",
      a: "Bu çeviricide ITU-R M.1677-1 standardı olan Uluslararası Mors Alfabesi (International Morse Code) kullanılır. Tarihsel Amerikan demiryolu Morsu veya Japon Wabun morsu farklı kurallara sahiptir; ancak günümüzde küresel olarak geçerli olan tek sistem Uluslararası Mors Alfabesidir."
    },
    {
      q: "Mors çevirici ile Mors çözücü arasındaki fark nedir?",
      a: "Bu terimler genellikle birbirinin yerine kullanılır. 'Mors çözücü' (decoder) genellikle Mors kodunu okunabilir metne dönüştüren araçları ifade eder. 'Mors çevirici' (translator) ise hem metinden Morsa hem de Morstan metne çift yönlü dönüşümü kapsar."
    },
    {
      q: "Mors çözücü rakamları da çevirebilir mi?",
      a: "Evet. Uluslararası Mors Alfabesinde 0–9 arasındaki tüm rakamlar tam 5 birimden oluşur (0 = -----, 1 = .----, 2 = ..---, 3 = ...--, 4 = ....-, 5 = ....., 6 = -...., 7 = --..., 8 = ---.., 9 = ----.)."
    },
    {
      q: "Mors kodunda noktalama işaretleri var mıdır?",
      a: "Evet. Nokta (.-.-.-), virgül (--..--), soru işareti (..--..), eğik çizgi (-..-.) ve eşitlik (-...-) gibi işaretler standart ITU tablosunda mevcuttur."
    },
    {
      q: "Mors usul işaretleri (prosigns) nelerdir?",
      a: "Prosign'lar, amatör telsizcilikte ve denizcilikte mesaj akışını yöneten birleşik komutlardır. Örneğin `<SOS>` (acil imdat), `<AR>` (mesaj sonu), `<AS>` (lütfen bekleyin), `<SK>` (görüşme sonu). Bu işaretlerde harfler arasında boşluk bırakılmadan tek bir harf gibi peş peşe iletilir."
    },
    {
      q: "Mors kodunda harfler arasına neden boşluk konulmalıdır?",
      a: "Yazılı Mors kodunda boşluk, bir harfin bitip diğerinin başladığı sınırı belirler. Boşluk olmadığında çözücü hangi noktaların bir harf oluşturduğunu bilemez. Telsiz aktarımında bu sınır 3 birimlik sessizlikle sağlanır."
    },
    {
      q: "Bu çeviriciyle Mors alfabesini öğrenebilir miyim?",
      a: "Evet. Bir Mors kodunu kendiniz çözmeye çalıştıktan sonra buraya yazarak doğruluğunu kontrol edebilirsiniz. Anında geri bildirim almak öğrenme sürecini hızlandırır."
    },
    {
      q: "Bu araç hangi resmi standardı kullanmaktadır?",
      a: "Araç, Uluslararası Telekomünikasyon Birliği'nin (ITU) resmi olarak yürürlükte tuttuğu ITU-R M.1677-1 tavsiye kararına tam uyumludur."
    }
  ];

  return (
    <div className="morse-to-english-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodundan İngilizceye Çeviri</li>
        </ol>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="standard-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <ShieldCheck size={14} className="text-primary" />
          <span>Uluslararası Standart ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodundan İngilizceye Çeviri ve Çözücü
        </h1>
        <p className="alphabet-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Nokta ve çizgilerle iletilen Uluslararası Mors kodlarını anında okunabilir İngilizce metne dönüştürün. Sinyalleri sesli dinleyin, harf çözümleme dökümünü inceleyin ve hatasız sonuçlar alın.
        </p>
      </section>

      {/* INTERACTIVE TOOL CARD */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Input Box: Morse Code */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                  Giriş: Mors Kodu (Nokta ve Çizgiler)
                </label>
                {morseInput && (
                  <button
                    onClick={() => setMorseInput('')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <X size={14} /> Temizle
                  </button>
                )}
              </div>
              <textarea
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                placeholder=".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
                rows={6}
                className="morse-font"
                style={{ width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 700, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <span>Harfler arası boşluk, kelimeler arası <code>/</code></span>
                <span>{morseInput.length} simge</span>
              </div>
            </div>

            {/* Output Box: English Text */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                  Çıktı: Çözümlenen İngilizce Metin
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleCopy(englishOutput, 'english')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {copiedType === 'english' ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    {copiedType === 'english' ? 'Kopyalandı ✓' : 'Kopyala'}
                  </button>
                </div>
              </div>
              <div
                style={{ width: '100%', minHeight: '150px', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.25rem', fontWeight: 600, wordBreak: 'break-word', overflowY: 'auto', boxSizing: 'border-box' }}
              >
                {englishOutput || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Mors kodu girdiğinizde İngilizce çeviri burada görünecektir...</span>}
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {!isPlaying ? (
                <button
                  onClick={handlePlayAudio}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', background: 'var(--primary)', color: '#fff', border: 'none' }}
                >
                  <Play size={16} fill="currentColor" /> Sesi Dinle
                </button>
              ) : (
                <button
                  onClick={handleStopAudio}
                  className="btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', background: 'var(--danger)', color: '#fff', border: 'none' }}
                >
                  <Square size={16} /> Durdur
                </button>
              )}

              <button
                onClick={handleDownloadWav}
                className="btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 500 }}
              >
                <Download size={16} /> WAV İndir
              </button>

              <button
                onClick={handleShare}
                className="btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 500 }}
              >
                <Share2 size={16} /> Paylaş
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Hız: <strong>{wpm} WPM</strong> | Karakter: <strong>{stats.characterCount}</strong> | Kelime: <strong>{stats.wordCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATIONAL ARTICLE CONTAINER */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* QUICK ANSWER */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Hızlı Cevap: Mors Kodundan İngilizceye Çeviri</h2>
            <p>
              Mors kodunu İngilizceye çevirmek için her bir nokta ve çizgi kümesi karşılık gelen Latin harfiyle eşleştirilir.
            </p>
            <p>Örneğin:</p>
            <ul className="content-list" style={{ fontFamily: 'var(--font-mono)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><code>....</code> = H</li>
              <li><code>.</code> = E</li>
              <li><code>.-..</code> = L</li>
              <li><code>.-..</code> = L</li>
              <li><code>---</code> = O</li>
            </ul>
            <p>
              Dolayısıyla: <code className="morse-font">.... . .-.. .-.. ---</code> dizilimi <strong>HELLO</strong> kelimesine dönüşür.
            </p>
            <p>
              Birden fazla kelime içeren metinlerde, yazılı Mors kodunda kelimeleri ayırmak için geleneksel olarak eğik çizgi (<code>/</code>) kullanılır:
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', background: 'var(--surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> → <strong>HELLO WORLD</strong>
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              En kritik unsur karakter sınırıdır. Harfler arasına tek bir boşluk, kelimeler arasına ise <code>/</code> konulması gerekir. Bu işaretler telsiz aktarımındaki sessizlik aralıklarını (zamanlama boşluklarını) temsil eder.
            </p>
          </section>

          {/* HOW TO DECODE MORSE CODE & A-Z TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Alfabesi Harf Eşleştirme Tablosu (A–Z)</h2>
            <p>
              Mors kodu tüm alfabeyi iki temel sinyalle ifade eder: Kısa Nokta (<code>.</code>) ve 3 kat uzunluğundaki Çizgi (<code>-</code>). 26 Latin harfinin tamamı aşağıda listelenmiştir:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Harf</th>
                    <th style={{ padding: '0.75rem' }}>Mors Kodu</th>
                    <th style={{ padding: '0.75rem' }}>Sözlü Ritim (Dit/Dah)</th>
                    <th style={{ padding: '0.75rem' }}>NATO Fonetiği</th>
                  </tr>
                </thead>
                <tbody>
                  {alphabetEntries.map(([char, data]) => (
                    <tr key={char} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}><strong>{char}</strong></td>
                      <td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>{data.morse}</code></td>
                      <td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{data.ditDah}</td>
                      <td style={{ padding: '0.75rem' }}>{data.phonetic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1.25rem' }}>
              Yazılı bir mesajı çözerken harf harf ilerleyin. Örneğin: <code className="morse-font">-.-- --- ..-</code> kodu için:
            </p>
            <ul className="content-list" style={{ fontFamily: 'var(--font-mono)', paddingLeft: '1.5rem' }}>
              <li><code>-.--</code> → Y</li>
              <li><code>---</code> → O</li>
              <li><code>..-</code> → U</li>
            </ul>
            <p>
              Sonuç: <strong>YOU</strong>. Bu araç tüm bu harf eşleştirmelerini anında sizin yerinize gerçekleştirir.
            </p>
          </section>

          {/* HOW MORSE SPACING WORKS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodunda Boşlukların Önemi ve Zamanlama</h2>
            <p>
              Boşluklar Mors kodunun en hayati parçasıdır. Gerçek telsiz aktarımında fiziksel boşluk tuşu yoktur; bunun yerine süre aralıkları (sessizlikler) kullanılır:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Sinyal veya Boşluk</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Standart Süre Oranı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>Nokta (dit)</strong></td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>Çizgi (dah)</strong></td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>Harf içi sinyaller arası boşluk</strong></td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>Harfler arası boşluk</strong></td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>Kelimeler arası boşluk</strong></td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>7 birim</strong></td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem' }}>
              <strong>Boşluklar Neden Noktalardan Daha Önemlidir?</strong><br />
              Örneğin üç adet nokta düşünün: <code className="morse-font">...</code>. Bu harf <strong>S</strong> harfidir. Ancak aralarına boşluk koyarsanız: <code className="morse-font">. . .</code> olur ve bu <strong>E E E</strong> (üç tane E) anlamına gelir. Noktalar değişmedi, sadece gruplama değişti! Bu nedenle harfler arasına boşluk bırakmak şarttır.
            </p>
          </section>

          {/* COMMON MORSE -> ENGLISH TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Sık Karşılaşılan Mors → İngilizce Kalıpları</h2>
            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Mors Kodu</th>
                    <th style={{ padding: '0.75rem' }}>İngilizce Karşılığı</th>
                    <th style={{ padding: '0.75rem' }}>Harf Ayrımı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>... --- ...</code></td><td style={{ padding: '0.75rem' }}><strong>SOS</strong></td><td style={{ padding: '0.75rem' }}>S → O → S</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. ---</code></td><td style={{ padding: '0.75rem' }}><strong>HELLO</strong></td><td style={{ padding: '0.75rem' }}>H → E → L → L → O</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-.-- . ...</code></td><td style={{ padding: '0.75rem' }}><strong>YES</strong></td><td style={{ padding: '0.75rem' }}>Y → E → S</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-. ---</code></td><td style={{ padding: '0.75rem' }}><strong>NO</strong></td><td style={{ padding: '0.75rem' }}>N → O</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>--. --- --- -..</code></td><td style={{ padding: '0.75rem' }}><strong>GOOD</strong></td><td style={{ padding: '0.75rem' }}>G → O → O → D</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-... -.-- .</code></td><td style={{ padding: '0.75rem' }}><strong>BYE</strong></td><td style={{ padding: '0.75rem' }}>B → Y → E</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-.. --- ...- .</code></td><td style={{ padding: '0.75rem' }}><strong>LOVE</strong></td><td style={{ padding: '0.75rem' }}>L → O → V → E</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>- .... .- -. -.- ...</code></td><td style={{ padding: '0.75rem' }}><strong>THANKS</strong></td><td style={{ padding: '0.75rem' }}>T → H → A → N → K → S</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* WORKED EXAMPLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Ayrıntılı Çözümlü Örnek</h2>
            <p>Elinize şu Mors kodu geçtiğinde:</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', color: 'var(--signal-bright)', margin: '0.75rem 0 1.25rem' }}>
              .-- . .-.. -.-. --- -- . / - --- / -- --- .-. ... .
            </div>
            <p>Adım adım çözümleme:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-light)', margin: '0 0 0.5rem' }}>1. Kelime: .-- . .-.. -.-. --- -- .</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  .-- → W | . → E | .-.. → L | -.-. → C<br />
                  --- → O | -- → M | . → E<br />
                  <strong>Sonuç: WELCOME</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--signal-bright)', margin: '0 0 0.5rem' }}>2. Kelime: - ---</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  - → T | --- → O<br /><br />
                  <strong>Sonuç: TO</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', margin: '0 0 0.5rem' }}>3. Kelime: -- --- .-. ... .</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  -- → M | --- → O | .-. → R | ... → S | . → E<br /><br />
                  <strong>Sonuç: MORSE</strong>
                </p>
              </div>
            </div>
            <p style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '1.1rem' }}>
              Tam Çözüm: <span style={{ color: 'var(--signal-bright)' }}>WELCOME TO MORSE</span> (Mors Koduna Hoş Geldiniz)
            </p>
          </section>

          {/* VISUAL DECODING */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Görsel Mors Kodunu Çözme Rehberi</h2>
            <p>
              Mors kodu dövmeler, bileklikler, kolyeler, kaçış oyunu bulmacaları ve ekran görüntülerinde sıkça yer alır. Görsel bir Mors kodunu çözmek için şu 6 adımı izleyin:
            </p>
            <ol className="content-list" style={{ paddingLeft: '1.5rem', lineHeight: 1.7 }}>
              <li>Her bir noktayı tespit edin (<code>.</code>).</li>
              <li>Her bir çizgiyi tespit edin (<code>-</code>).</li>
              <li>Harfler arasındaki görsel boşlukları koruyarak bir boşluk tuşu bırakın.</li>
              <li>Kelimeler arasındaki belirgin ayrımı <code>/</code> ile gösterin.</li>
              <li>Yazdığınız metni yukarıdaki çeviriciye yapıştırın.</li>
              <li>Elde edilen sonucu orijinal görsel ile karşılaştırarak teyit edin.</li>
            </ol>
            <p style={{ marginTop: '0.75rem' }}>
              Örneğin bir Mors bilekliğinde <code className="morse-font">.. / .-.. --- ...- . / -.-- --- ..-</code> yazıyorsa bu <strong>I LOVE YOU</strong> anlamına gelir.
            </p>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>Sıkça Sorulan Sorular</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-elevated)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'inherit' }}>{faq.q}</h3>
                    {openFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {openFaqIdx === idx && (
                    <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CTA BANNER */}
          <section className="content-section cta-banner" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>İngilizce Metni Mors Koduna Dönüştürmek mi İstiyorsunuz?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              İngilizce kelimeleri ve mesajları nokta ve çizgilere dönüştürmek için İngilizce → Mors Kodlayıcı aracımızı kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-english2morse', '/tr/english-to-morse-code/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                İngilizceden Mors Koduna Çeviri <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Mors Alfabesi Tablosu
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
