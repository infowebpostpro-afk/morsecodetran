import React, { useState, useEffect } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, X, Sparkles, BookOpen, HelpCircle, Check
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { TURKISH_EXTENDED_MAP, TURKISH_NORMALIZATION_MAP } from '../engine/turkishMorse.js';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishAlphabetPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, onTranslateCharacter, showToast, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('letter'); // letter, number, punctuation, prosign, turkish, all
  const [trCharMode, setTrCharMode] = useState('extended'); // 'extended' | 'standard'
  const [selectedChar, setSelectedChar] = useState(null);

  // Play A-Z Sequence State
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [playingCharKey, setPlayingCharKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [copiedChar, setCopiedChar] = useState(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState('');

  // Audio cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.stop();
    };
  }, []);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Base entries from standard map
  const entries = Object.entries(MORSE_CODE_MAP);

  // Turkish characters list
  const trEntries = Object.entries(TURKISH_EXTENDED_MAP);

  // Filter Turkish characters
  const filteredTrEntries = trEntries.filter(([char, data]) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const norm = TURKISH_NORMALIZATION_MAP[char] || char;
    return (
      char.toLowerCase().includes(q) ||
      norm.toLowerCase().includes(q) ||
      data.name.toLowerCase().includes(q) ||
      data.morse.includes(q) ||
      (data.phonetic && data.phonetic.toLowerCase().includes(q)) ||
      (data.ditDah && data.ditDah.toLowerCase().includes(q))
    );
  });

  // Turkish character display data based on active mode
  const getTrCharDisplayData = (char, data) => {
    if (trCharMode === 'extended') {
      const norm = TURKISH_NORMALIZATION_MAP[char] || char;
      return {
        char,
        morse: data.morse,
        ditDah: data.ditDah,
        badge: data.type === 'letter' ? 'Standart Eşleşme' : 'Genişletilmiş Kod',
        note: `ITU Sadeleştirmesi: ${char} → ${norm} (${MORSE_CODE_MAP[norm]?.morse || ''})`
      };
    } else {
      const norm = TURKISH_NORMALIZATION_MAP[char] || char;
      const normMorse = MORSE_CODE_MAP[norm]?.morse || '..';
      const normDitDah = MORSE_CODE_MAP[norm]?.ditDah || '';
      return {
        char,
        morse: normMorse,
        ditDah: normDitDah,
        badge: `Latin Sadeleştirmesi (${norm})`,
        note: `Sadeleştirme Kuralı: ${char} → ${norm} (${normMorse})`
      };
    }
  };

  // Filter standard entries
  const filteredEntries = entries.filter(([char, data]) => {
    if (category === 'turkish') return false; // Handled separately
    if (category !== 'all' && data.type !== category) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;

    const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;
    return (
      displayChar.toLowerCase().includes(q) ||
      data.name.toLowerCase().includes(q) ||
      data.morse.includes(q) ||
      (data.phonetic && data.phonetic.toLowerCase().includes(q))
    );
  });

  // Individual Character Audio Playback
  const handlePlaySingle = (char, morse) => {
    audioEngine.stop();
    if (playingCharKey === char) {
      setPlayingCharKey(null);
      setIsPlayingSeq(false);
      return;
    }
    setIsPlayingSeq(false);
    setPlayingCharKey(char);
    audioEngine.playSequence({
      breakdown: [{ char, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setPlayingCharKey(null);
        }
      }
    });
  };

  // Copy Morse code with fallback
  const handleCopyMorse = async (morse, label) => {
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(morse);
        success = true;
      }
    } catch {
      // Fallback
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = morse;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopiedChar(label);
      setCopyAnnouncement(`${label} Mors kodu (${morse}) başarıyla kopyalandı.`);
      if (showToast) showToast(`${label} Mors kodu (${morse}) kopyalandı ✓`);
      setTimeout(() => {
        setCopiedChar(null);
      }, 2000);
    } else {
      setCopyAnnouncement('Kopyalama başarısız oldu. Lütfen kodu manuel olarak seçip kopyalayın.');
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  // Play A-Z Sequence
  const handlePlayAZSequence = () => {
    audioEngine.stop();
    const letters = entries.filter(([_, d]) => d.type === 'letter');
    if (letters.length === 0) return;

    setIsPlayingSeq(true);

    const breakdownSequence = letters.map(([char, data]) => ({
      char,
      morse: data.morse,
      isSpace: false
    }));

    audioEngine.playSequence({
      breakdown: breakdownSequence,
      wpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex, isEnded }) => {
        if (isEnded) {
          setIsPlayingSeq(false);
          setPlayingCharKey(null);
          return;
        }
        if (activeCharIndex >= 0 && activeCharIndex < letters.length) {
          setPlayingCharKey(letters[activeCharIndex][0]);
        }
      }
    });
  };

  const handleStopSequence = () => {
    audioEngine.stop();
    setIsPlayingSeq(false);
    setPlayingCharKey(null);
  };

  const alphabetFaqs = [
    {
      q: "Mors alfabesi nedir ve nasıl çalışır?",
      a: "Mors alfabesi, temel metin karakterlerini (A–Z harfleri, 0–9 rakamları ve noktalama işaretleri) kısa (nokta / dit) ve uzun (çizgi / dah) elektrik, ses veya ışık darbeleriyle kodlayan uluslararası bir haberleşme sistemidir. Uluslararası standart ITU-R M.1677-1 tavsiye kararıyla yönetilir."
    },
    {
      q: "Mors alfabesinde A harfi nedir?",
      a: "Mors kodunda A harfi '.-' (bir nokta ve bir çizgi) olarak iletilir. Sesli ritmi 'di-dah' şeklindedir."
    },
    {
      q: "Mors alfabesinde B harfi nedir?",
      a: "B harfi '-...' (bir çizgi ve ardından üç nokta) şeklindedir. Sesli ritmi 'dah-di-di-dit'tir."
    },
    {
      q: "Mors alfabesinde C harfi nedir?",
      a: "C harfi '-.-.' (çizgi, nokta, çizgi, nokta) olmak üzere dört sinyal elemanından oluşur."
    },
    {
      q: "Mors alfabesinde S harfi nedir?",
      a: "S harfi '...' (üç ardışık nokta) olarak iletilir. Dit-dit-dit ritmiyle telgrafın en kolay tanınan harflerinden biridir."
    },
    {
      q: "Mors alfabesinde SOS sinyali nedir ve ne anlama gelir?",
      a: "SOS sinyali kesintisiz olarak '...---...' şeklinde iletilir (üç nokta, üç çizgi, üç nokta). Aralarında harf boşluğu bırakılmaz, tek bir prosign olarak gönderilir. 'Save Our Souls' veya 'Save Our Ship' kelimelerinin kısaltması değildir; ritmik olarak ayırt edilmesi en kolay kombinasyon olduğu için 1906 Berlin Uluslararası Telsiz Telgraf Konvansiyonu'nda seçilmiştir."
    },
    {
      q: "Öğrenilmesi en kolay Mors harfi hangisidir?",
      a: "E ve T harfleri Mors alfabesinin en kısa ve en kolay harfleridir. E harfi tek bir noktadan ('.'), T harfi ise tek bir çizgiden ('-') oluşur. İngilizce ve Latin dillerinde en sık kullanılan harfler oldukları için Samuel Morse ve Alfred Vail tarafından en kısa kodlarla eşleştirilmişlerdir."
    },
    {
      q: "Mors alfabesinde kaç harf vardır?",
      a: "Temel Uluslararası Mors alfabesinde A'dan Z'ye 26 standart Latin harfi bulunur. Genişletilmiş sistem ayrıca 10 rakam (0–9), 20'den fazla noktalama işareti ve prosedür sinyallerini (prosign) kapsar."
    },
    {
      q: "Mors kodunda büyük ve küçük harf ayrımı var mıdır?",
      a: "Hayır. Mors alfabesinde büyük ve küçük harfler için ayrı kodlar bulunmaz. Örneğin büyük 'A' ve küçük 'a' aynı şekilde '.-' olarak kodlanır ve iletilir."
    },
    {
      q: "Dit ve Dah ne anlama gelir?",
      a: "'Dit' (veya kelime sonunda 'di'), Mors kodundaki kısa nokta sinyalinin sesli telaffuzudur. 'Dah' ise noktanın tam üç katı süren uzun çizgi sinyalinin sesli ifadesidir. Operatörler morsu görsel noktalardan ziyade dit-dah ritimleriyle dinleyerek öğrenir."
    },
    {
      q: "Mors kodunda zamanlama kuralları nasıldır?",
      a: "Uluslararası standartlara göre: 1 nokta = 1 birim zaman, 1 çizgi = 3 birim zaman, aynı harf içindeki elemanlar arası boşluk = 1 birim, iki harf arası boşluk = 3 birim, iki kelime arası boşluk = 7 birim zamandır (1-3-1-3-7 kuralı)."
    },
    {
      q: "Türkçe karakterler (Ç, Ğ, İ, Ö, Ş, Ü) Mors kodunda nasıl yazılır?",
      a: "Uluslararası haberleşmede karışıklığı önlemek için standart ITU sadeleştirmesi kullanılır: Ç→C, Ğ→G, İ/ı→I, Ö→O, Ş→S, Ü→U. Türk telgraf ve amatör telsiz geleneğinde ise genişletilmiş özel kodlar bulunur (Ç: -.-.., Ğ: --.-., Ö: ---., Ş: ----, Ü: ..--)."
    },
    {
      q: "Mors alfabesini gözle mi yoksa kulakla mı öğrenmek gerekir?",
      a: "Mors alfabesini bir tabloya bakarak ezberlemek başlangıçta yardımcı olabilir, ancak Mors kodunu akıcı şekilde anlamak için kesinlikle 'kulakla sesli ritim' olarak öğrenmek gerekir. Nokta ve çizgileri tek tek saymak hız arttığında tıkanmaya neden olur."
    },
    {
      q: "Ayna (simetrik) Mors harfleri nelerdir?",
      a: "Mors kodunda birbirinin tam tersi olan ayna çiftleri öğrenmeyi çok kolaylaştırır: A (.-) ile N (-.), D (-..) ile U (..-), B (-...) ile V (...-), G (--.) ile W (.--), Y (-.--) ile Q (--.-)."
    },
    {
      q: "Mors hızında WPM ne demektir?",
      a: "WPM (Words Per Minute), dakikada iletilen kelime sayısıdır. Standart hız hesaplamalarında 50 birimlik zaman uzunluğuna sahip 'PARIS' kelimesi referans alınır. 20 WPM hızında dakikada 20 kez 'PARIS' iletilmiş olur."
    }
  ];

  const shouldShowTrSection = (category === 'turkish') ||
    ((category === 'letter' || category === 'all') && (!search.trim() || filteredTrEntries.length > 0));

  return (
    <div className="alphabet-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Alfabesi Harfleri</li>
        </ol>
      </nav>

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Uluslararası Standart ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Alfabesi Harfleri: A–Z Harf Tablosu ve Sesli Dinleme
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Uluslararası Mors alfabesindeki tüm A–Z harflerini, sayıları ve sembolleri interaktif olarak keşfedin. Her harfin nokta-çizgi ritmini canlı dinleyin, kopyalayın ve Türkçe karakter kurallarını öğrenin.
        </p>
      </header>

      {/* Screen Reader Live Region for Copy Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {copyAnnouncement}
      </div>

      {/* Interactive Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border)' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0, width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Harf, mors kodu veya okunuş ara (örn: A, .-, Alfa)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem 2.6rem 0.65rem 2.6rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.95rem' }}
          />
          {search && (
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); setSearch(''); }}
              onClick={() => setSearch('')}
              aria-label="Aramayı temizle"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'letter', label: 'Harfler (A–Z)' },
            { id: 'turkish', label: 'Türkçe Karakterler' },
            { id: 'number', label: 'Rakamlar (0–9)' },
            { id: 'punctuation', label: 'Noktalama' },
            { id: 'prosign', label: 'Prosign' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className="btn"
              aria-pressed={category === cat.id}
              style={{
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: category === cat.id ? 700 : 500,
                background: category === cat.id ? 'var(--primary)' : 'var(--surface)',
                color: category === cat.id ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sequential A-Z Playback Button */}
        <div>
          {!isPlayingSeq ? (
            <button
              type="button"
              onClick={handlePlayAZSequence}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
              aria-label="A'dan Z'ye tüm alfabeyi sırayla dinle"
            >
              <Play size={16} fill="currentColor" /> Tüm Alfabeyi Dinle (A–Z)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopSequence}
              className="btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', background: 'var(--danger)', color: '#fff', border: 'none' }}
              aria-label="Alfabeyi dinlemeyi durdur"
            >
              <Square size={16} fill="currentColor" /> Oynatmayı Durdur
            </button>
          )}
        </div>
      </div>

      {/* Turkish Diacritics Special View */}
      {shouldShowTrSection && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} className="text-primary" /> Türkçe Karakterler (Ç, Ğ, I, İ, Ö, Ş, Ü) Kuralları
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Uluslararası Mors alfabesinde (ITU) doğrudan Türkçe diyakritik karakterler yer almaz. Küresel haberleşmede alıcı karışıklıklarını önlemek için <strong>en yakın Latin harfine sadeleştirme (ITU standardı)</strong> tavsiye edilir. Türk telgraf ve telsiz geleneğinde ise <strong>genişletilmiş telgraf kodları</strong> kullanılır.
            </p>
          </div>

          {/* Character Mode Switcher & Active Indicator */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', background: 'var(--surface-sunken)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text)' }}>
                Karakter Modu Seçimi:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => setTrCharMode('extended')}
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.825rem',
                    fontWeight: trCharMode === 'extended' ? 700 : 500,
                    background: trCharMode === 'extended' ? 'var(--primary)' : 'var(--surface)',
                    color: trCharMode === 'extended' ? '#fff' : 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  aria-pressed={trCharMode === 'extended'}
                  aria-label="Türkçe genişletilmiş karakter modunu seç"
                >
                  Türkçe Genişletilmiş Mod
                </button>
                <button
                  type="button"
                  onClick={() => setTrCharMode('standard')}
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.825rem',
                    fontWeight: trCharMode === 'standard' ? 700 : 500,
                    background: trCharMode === 'standard' ? 'var(--primary)' : 'var(--surface)',
                    color: trCharMode === 'standard' ? '#fff' : 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer'
                  }}
                  aria-pressed={trCharMode === 'standard'}
                  aria-label="Temel Latin sadeleştirme modunu seç"
                >
                  Temel Latin (Sadeleştirme) Modu
                </button>
              </div>
            </div>

            <div className="active-mode-badge" style={{ fontSize: '0.8rem', padding: '0.25rem 0.7rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--primary)', fontWeight: 600 }}>
              Etkin Mod: {trCharMode === 'extended' ? 'Türkçe Genişletilmiş Mod' : 'Temel Latin (Sadeleştirme) Modu'}
            </div>
          </div>

          {/* Required Exact Explanatory Box Beside/Under Controls */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
              Türkçe karakterler nasıl gösterilir?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Ç, Ğ, İ, I, Ö, Ş ve Ü için gösterilen sonuç, seçilen karakter moduna bağlıdır. Temel Latin harflerine dönüştürme modunda araç, ilgili karakterleri dönüştürme kuralına göre sadeleştirebilir. Türkçe genişletilmiş mod kullanılıyorsa, araç o modda uygulanan kodları gösterir.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Bir mesajı başka biriyle paylaşmadan önce iki tarafın da aynı karakter tablosunu kullandığından emin olun.
            </p>
          </div>

          {/* Cards for Turkish Characters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filteredTrEntries.map(([char, data]) => {
              const display = getTrCharDisplayData(char, data);
              const isPlayingThis = playingCharKey === char;
              const isCopied = copiedChar === char;
              return (
                <div
                  key={char}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isPlayingThis ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: isPlayingThis ? 'rgba(56, 189, 248, 0.08)' : 'var(--surface-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{char}</span>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontWeight: 600 }}>
                        {display.badge}
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--text)', marginBottom: '0.4rem' }}>
                      {display.morse}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <strong>Sesli Ritim:</strong> {display.ditDah}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Kural:</strong> {display.note}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handlePlaySingle(char, display.morse)}
                      className="btn"
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.45rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: isPlayingThis ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface)', border: isPlayingThis ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', color: isPlayingThis ? 'var(--primary)' : 'var(--text)' }}
                      aria-label={isPlayingThis ? `${char} sesini durdur` : `${char} harfini Mors koduyla dinle`}
                      title={isPlayingThis ? "Durdur" : `${char} Sesini Dinle`}
                    >
                      {isPlayingThis ? <Square size={16} fill="currentColor" /> : <Volume2 size={16} />}
                      {isPlayingThis ? 'Durdur' : 'Dinle'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyMorse(display.morse, char)}
                      className="btn"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: isCopied ? '1px solid var(--accent-green, #10b981)' : '1px solid var(--border)', cursor: 'pointer', color: isCopied ? 'var(--accent-green, #10b981)' : 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      aria-label={`${char} Mors kodunu kopyala`}
                      title={isCopied ? "Kopyalandı!" : `${char} Mors Kodunu Kopyala`}
                    >
                      {isCopied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      {isCopied && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Kopyalandı</span>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Standard Character Grid */}
      {category !== 'turkish' && (
        <section style={{ marginBottom: '3rem' }}>
          {filteredEntries.length === 0 && (!search.trim() || filteredTrEntries.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1rem 0 2rem' }}>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                "{search}" için eşleşen karakter veya Mors kodu bulunamadı.
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                Aramayı Temizle
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.85rem' }}>
              {filteredEntries.map(([char, data]) => {
                const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;
                const isPlayingThis = playingCharKey === char;
                const isCopied = copiedChar === displayChar;
                return (
                  <div
                    key={char}
                    className="glass-panel"
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isPlayingThis ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isPlayingThis ? 'rgba(56, 189, 248, 0.08)' : 'var(--surface-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.2rem' }}>
                        {displayChar}
                      </div>
                      {data.phonetic && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {data.phonetic}
                        </div>
                      )}
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '1px', marginBottom: '0.35rem' }}>
                        {data.morse}
                      </div>
                      {data.ditDah && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          {data.ditDah}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handlePlaySingle(char, data.morse)}
                        className="btn"
                        style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', padding: '0.35rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', background: isPlayingThis ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface)', border: isPlayingThis ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', color: isPlayingThis ? 'var(--primary)' : 'var(--text)' }}
                        aria-label={isPlayingThis ? `${displayChar} sesini durdur` : `${displayChar} Mors sesini dinle`}
                        title={isPlayingThis ? "Durdur" : `${displayChar} Sesini Dinle`}
                      >
                        {isPlayingThis ? <Square size={14} fill="currentColor" /> : <Volume2 size={14} />}
                        {isPlayingThis ? 'Durdur' : 'Dinle'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyMorse(data.morse, displayChar)}
                        className="btn"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: isCopied ? '1px solid var(--accent-green, #10b981)' : '1px solid var(--border)', cursor: 'pointer', color: isCopied ? 'var(--accent-green, #10b981)' : 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                        aria-label={`${displayChar} Mors kodunu kopyala`}
                        title={isCopied ? "Kopyalandı!" : `${displayChar} Mors Kodunu Kopyala`}
                      >
                        {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Comprehensive Editorial Content & Reference Tables */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: Quick Reference A-Z Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Alfabesi Hızlı Referans Tablosu (A–Z)
          </h2>
          <p>
            Aşağıdaki tablo, Uluslararası Telekomünikasyon Birliği (ITU-R M.1677-1) standardına göre 26 temel Latin harfinin Mors kodu karşılıklarını ve havacılık/telsiz fonetik alfabe okunuşlarını özetlemektedir:
          </p>

          <div style={{ overflowX: 'auto', margin: '1.25rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Harf</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mors Kodu</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fonetik (NATO)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Harf</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mors Kodu</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fonetik (NATO)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A', '.-', 'Alfa', 'N', '-.', 'November'],
                  ['B', '-...', 'Bravo', 'O', '---', 'Oscar'],
                  ['C', '-.-.', 'Charlie', 'P', '.--.', 'Papa'],
                  ['D', '-..', 'Delta', 'Q', '--.-', 'Quebec'],
                  ['E', '.', 'Echo', 'R', '.-.', 'Romeo'],
                  ['F', '..-.', 'Foxtrot', 'S', '...', 'Sierra'],
                  ['G', '--.', 'Golf', 'T', '-', 'Tango'],
                  ['H', '....', 'Hotel', 'U', '..-', 'Uniform'],
                  ['I', '..', 'India', 'V', '...-', 'Victor'],
                  ['J', '.---', 'Juliett', 'W', '.--', 'Whiskey'],
                  ['K', '-.-', 'Kilo', 'X', '-..-', 'X-ray'],
                  ['L', '.-..', 'Lima', 'Y', '-.--', 'Yankee'],
                  ['M', '--', 'Mike', 'Z', '--..', 'Zulu']
                ].map(([l1, m1, p1, l2, m2, p2], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--surface)' : 'transparent' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{l1}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m1}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{p1}</td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{l2}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{m2}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{p2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual Showcase: Mobile Experience for Standard A-Z and Turkish Characters */}
          <div style={{ margin: '2rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            <figure style={{ margin: 0, background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-lg, 16px)', padding: '1rem', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
              <picture>
                <source srcSet="/images/mors-alfabesi-harf-tablosu-mobil.webp" type="image/webp" />
                <img
                  src="/images/mors-alfabesi-harf-tablosu-mobil.png"
                  alt="Mors Alfabesi A-Z harfleri ve sesli dinleme kontrolleri mobil görünümü"
                  loading="lazy"
                  decoding="async"
                  width={502}
                  height={1024}
                  style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
                />
              </picture>
              <figcaption style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', marginTop: '0.85rem', lineHeight: 1.5, fontWeight: 500 }}>
                <strong style={{ color: 'var(--text)' }}>Standart A–Z Harf Kartları:</strong> Mobil arayüzde her harfin dit-dah ritmi, NATO fonetik karşılığı ve bağımsız dinleme/kopyalama kontrolleri.
              </figcaption>
            </figure>

            <figure style={{ margin: 0, background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-lg, 16px)', padding: '1rem', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
              <picture>
                <source srcSet="/images/mors-alfabesi-turkce-karakterler-mobil.webp" type="image/webp" />
                <img
                  src="/images/mors-alfabesi-turkce-karakterler-mobil.png"
                  alt="Türkçe Mors alfabesi genişletilmiş karakter kartları mobil görünümü"
                  loading="lazy"
                  decoding="async"
                  width={502}
                  height={1024}
                  style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
                />
              </picture>
              <figcaption style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', marginTop: '0.85rem', lineHeight: 1.5, fontWeight: 500 }}>
                <strong style={{ color: 'var(--text)' }}>Türkçe Karakter Desteği:</strong> Ç, Ğ, Ö, Ş ve Ü harfleri için genişletilmiş telgraf kodları ve ITU standart sadeleştirme kuralları.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Section 2: How Morse Code Works & Timing Units */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Alfabesi Nasıl Çalışır? Standart Zamanlama Kuralları
          </h2>
          <p>
            Mors alfabesi sadece nokta ve çizgilerden ibaret değildir; sinyaller arasındaki sessizlik süreleri de en az sesler kadar belirleyicidir. Uluslararası standartlara (ITU-R M.1677-1) göre Mors zamanlaması sabit oranlara dayanır:
          </p>

          <div style={{ overflowX: 'auto', margin: '1.25rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Zamanlama Unsuru</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Süre Birimi</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>Nokta (Dit)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>1 Birim</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Temel zamanlama birimi. Hız (WPM) bu birimin milisaniyesini belirler.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>Çizgi (Dah)</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>3 Birim</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Tam olarak 3 nokta uzunluğundadır; daha yüksek ses değil, daha uzun süredir.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>Öğe İçi Boşluk</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>1 Birim</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Aynı harf içindeki nokta ve çizgiler arasındaki sessizlik süresi.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>Harf Arası Boşluk</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>3 Birim</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Kelimedeki ardışık harfler arasındaki sessizlik süresi (metin çevirisinde 1 boşluk).</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text)' }}>Kelime Arası Boşluk</td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}>7 Birim</td>
                  <td style={{ padding: '0.75rem 1rem' }}>İki kelime arasındaki sessizlik süresi (metin çevirisinde <code>/</code> veya 3 boşluk).</td>
                </tr>
              </tbody>
            </table>
          </div>

        </section>

        {/* Section 3: Useful Patterns (E & T Roots, Mirror Pairs) */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Öğrenmeyi Kolaylaştıran Örüntüler ve Ayna Harf Çiftleri
          </h2>
          <p>
            Harfleri tek tek incelemenin yanında, nokta ve çizgiler arasındaki örüntüleri karşılaştırmak benzer kodları ayırt etmenize yardımcı olabilir. Bu örüntüler bir başlangıç desteğidir; sesleri dinleyerek pratik yapmak da önemlidir.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
            1. E ve T Kök Harfleri (Nokta ve Çizgi Aileleri)
          </h3>
          <p>
            Tüm alfabe E (tek nokta) ve T (tek çizgi) ağaçlarından dallanır:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Nokta Ailesi (Sadece Noktalar)</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                <li><strong>E:</strong> <code>.</code> (1 nokta)</li>
                <li><strong>I:</strong> <code>..</code> (2 nokta)</li>
                <li><strong>S:</strong> <code>...</code> (3 nokta)</li>
                <li><strong>H:</strong> <code>....</code> (4 nokta)</li>
                <li><strong>5:</strong> <code>.....</code> (5 nokta)</li>
              </ul>
            </div>
            <div style={{ background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>Çizgi Ailesi (Sadece Çizgiler)</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 1.8 }}>
                <li><strong>T:</strong> <code>-</code> (1 çizgi)</li>
                <li><strong>M:</strong> <code>--</code> (2 çizgi)</li>
                <li><strong>O:</strong> <code>---</code> (3 çizgi)</li>
                <li><strong>0:</strong> <code>-----</code> (5 çizgi)</li>
              </ul>
            </div>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            2. Simetrik Ayna Çiftleri (Birini Öğren, Diğerini Bil)
          </h3>
          <p>
            Mors alfabesinde birçok harf birbirinin tam tersi ritme sahiptir. Bir çifti öğrendiğinizde iki harfi birden hafızanıza almış olursunuz:
          </p>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Harf 1</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Mors</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Harf 2</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Mors</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Simetri Açıklaması</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['A', '.-', 'N', '-.', 'Nokta-çizgi tersi'],
                  ['D', '-..', 'U', '..-', '1 çizgi 2 nokta vs 2 nokta 1 çizgi'],
                  ['B', '-...', 'V', '...-', '1 çizgi 3 nokta vs 3 nokta 1 çizgi'],
                  ['G', '--.', 'W', '.--', '2 çizgi 1 nokta vs 1 nokta 2 çizgi'],
                  ['Y', '-.--', 'Q', '--.-', 'Dört elemanlı simetri']
                ].map(([h1, m1, h2, m2, d], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{h1}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)' }}><code>{m1}</code></td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{h2}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)' }}><code>{m2}</code></td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            K ve R harflerini nasıl ayırt edebilirsiniz?
          </h3>
          <p>
            K harfi <code>-.-</code>, R harfi ise <code>.-.</code> olarak yazılır. Bu iki kod, noktalar ile çizgiler yer değiştirdiğinde birbirine dönüşür. Her iki desen de tersten okunduğunda değişmez; bu nedenle onları sıra bakımından birbirinin tersi olarak tanımlamak yerine nokta–çizgi karşılaştırmasıyla öğrenebilirsiniz.
          </p>
        </section>

        {/* Section 4: Numbers and Punctuation Overview */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Rakamlar ve Yaygın Noktalama İşaretleri
          </h2>
          <p>
            Mors kodunda rakamlar harflerden farklı olarak daima <strong>5 sinyal elemanından</strong> oluşur. 1'den 5'e kadar noktalar artarken (<code>.----</code>, <code>..---</code>, <code>...--</code>, <code>....-</code>, <code>.....</code>), 6'dan 0'a kadar çizgiler artar (<code>-....</code>, <code>--...</code>, <code>---..</code>, <code>----.</code>, <code>-----</code>).
          </p>
          <p>
            Daha kapsamlı rakam analizi, sesler ve interaktif merdiven görünümü için <a href="/tr/morse-code-numbers/" onClick={(e) => handleNav(e, 'tr-numbers', '/tr/morse-code-numbers/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Mors Kodu Rakamlar</a> sayfamızı inceleyebilirsiniz.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Temel Noktalama İşaretleri ve Özel Sinyaller
          </h3>
          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Sembol</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Mors Kodu</th>
                  <th scope="col" style={{ padding: '0.65rem 1rem' }}>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Nokta (.)', '.-.-.-', 'Cümle sonu işareti'],
                  ['Virgül (,)', '--..--', 'Ayırıcı virgül'],
                  ['Soru İşareti (?)', '..--..', 'Soru ve teyit işareti (telsizde tekrar isteme)'],
                  ['Eğik Çizgi (/)', '-..-.', 'Metindeki eğik çizgi karakteri. Yazılı Mors gösteriminde / işareti ayrıca kelimeleri ayırmak için de kullanılabilir; bu iki kullanım aynı şey değildir.'],
                  ['Eşittir (=)', '-...-', 'Paragraf başı veya bekleme ayracı'],
                  ['SOS (<SOS>)', '...---...', 'Uluslararası acil durum çağrısı (kesintisiz prosign)'],
                  ['AR (<AR>)', '.-.-.', 'Mesaj sonu / aktarım sonu prosedür sinyali']
                ].map(([s, m, d], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600, color: 'var(--text)' }}>{s}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}><code>{m}</code></td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-secondary)' }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            Eğik çizgi ile kelime ayırıcı arasındaki fark
          </h3>
          <p>
            Bu araçta yazılı Mors metnindeki <code>/</code> işareti, iki kelime arasında görsel ayırıcı olarak kullanılabilir. Metnin kendisindeki eğik çizgi karakterinin Mors karşılığı ise <code>-..-.</code> şeklindedir.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>Örnekler:</p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', lineHeight: 1.8 }}>
            <li><code>A B</code> → <code>.- / -...</code></li>
            <li><code>A/B</code> → <code>.- -..-. -...</code></li>
          </ul>
          <p>
            İlk örnekte <code>/</code> iki kelimeyi ayırır. İkinci örnekte <code>-..-.</code>, metindeki eğik çizgi karakterini temsil eder.
          </p>

          <p style={{ marginTop: '1.25rem' }}>
            Tüm özel semboller, matematik işaretleri ve prosign'lar için <a href="/tr/morse-code-symbols/" onClick={(e) => handleNav(e, 'tr-symbols', '/tr/morse-code-symbols/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>Mors Alfabesi Sembolleri</a> rehberimize göz atın.
          </p>
        </section>

        {/* Section 5: How to Learn Effectively */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Alfabesini Hızlı ve Kalıcı Öğrenme Yöntemi
          </h2>
          <p>
            Yazılı tablo, bir harfin kodunu kontrol etmek için yararlıdır. Dinleyerek öğrenirken ise her harfin nokta ve çizgilerini tek tek saymak yerine sinyalin bütün ritmini tanımaya çalışabilirsiniz. Kısa alıştırmalarla sesleri karşılaştırın ve gerektiğinde tabloya dönerek cevabınızı kontrol edin.
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Kulaktan Sesli Tanıma:</strong> Her harfi bir melodi veya ses motifi gibi dinleyin. Örneğin <code>...</code> duyduğunuzda 'üç nokta' değil doğrudan <strong>S</strong> harfi aklınıza gelmelidir.</li>
            <li><strong>Küçük Harf Grupları ile Başlayın (Koch Yöntemi):</strong> Önce E, T, A, N harfleriyle başlayın. %90 başarıya ulaştığınızda 1 yeni harf ekleyin.</li>
            <li><strong>Farnsworth Zamanlaması:</strong> Harflerin kendi içindeki hızını yüksek (18–20 WPM) tutun, harf aralarındaki boşluğu uzatın. Böylece yavaş kod dinleme alışkanlığından kurtulursunuz.</li>
            <li><strong>Günlük 10–15 Dakika Alıştırma:</strong> Haftada bir gün saatlerce çalışmak yerine, her gün 10 dakika kulaktan dinleme antrenmanı yapın.</li>
          </ul>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Türkçe Mors Araçları</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Çeviri Ana Sayfası →
            </a>
            <a href="/tr/morse-code-numbers/" onClick={(e) => handleNav(e, 'tr-numbers', '/tr/morse-code-numbers/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Mors Rakamları (0–9) →
            </a>
            <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Sesli Dinleme Alıştırması →
            </a>
            <a href="/tr/learn-morse-code/" onClick={(e) => handleNav(e, 'tr-learn', '/tr/learn-morse-code/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Adım Adım Öğrenme Rehberi →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Alfabesi Harfleri Hakkında Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {alphabetFaqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
