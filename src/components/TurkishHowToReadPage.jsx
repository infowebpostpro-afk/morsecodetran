import React, { useState } from 'react';
import {
  BookOpen, Volume2, Play, Square, Eye, EyeOff, RotateCcw,
  Sparkles, CheckCircle, AlertTriangle, Clock, Radio, Headphones,
  Copy, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Check, ArrowRight, ShieldCheck
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export function TurkishHowToReadPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  // Practice Drill state
  const [drillLevel, setDrillLevel] = useState('written'); // 'written' | 'audio' | 'words'
  const [targetDrill, setTargetDrill] = useState({ text: 'SOS', morse: '... --- ...' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const writtenDrills = [
    { text: 'SOS', morse: '... --- ...' },
    { text: 'MERHABA', morse: '-- . .-. .... .- -... .-' },
    { text: 'TURK', morse: '- ..- .-. -.-' },
    { text: 'KOD', morse: '-.- --- -..' },
    { text: 'GÜN', morse: '--. ..-- -.' }
  ];

  const audioDrills = [
    { text: 'E', morse: '.' },
    { text: 'T', morse: '-' },
    { text: 'A', morse: '.-' },
    { text: 'N', morse: '-.' },
    { text: 'S', morse: '...' },
    { text: 'O', morse: '---' },
    { text: 'R', morse: '.-.' },
    { text: 'K', morse: '-.-' }
  ];

  const wordDrills = [
    { text: '73', morse: '--... ...--' },
    { text: 'CQ CQ', morse: '-.-. --.- / -.-. --.-' },
    { text: 'SENI SEVIYORUM', morse: '... . -. .. / ... . ...- .. -.-- --- .-. ..- --' },
    { text: 'SELAM', morse: '... . .-.. .- --' }
  ];

  const getActiveDrillSet = () => {
    if (drillLevel === 'audio') return audioDrills;
    if (drillLevel === 'words') return wordDrills;
    return writtenDrills;
  };

  const handleNextDrill = () => {
    const set = getActiveDrillSet();
    let next;
    do {
      next = set[Math.floor(Math.random() * set.length)];
    } while (set.length > 1 && next.text === targetDrill.text);

    setTargetDrill(next);
    setIsRevealed(false);
    setUserGuess('');
    setFeedback(null);
    if (drillLevel === 'audio') {
      handlePlayMorseAudio(next.morse);
    }
  };

  const handlePlayMorseAudio = (morseToPlay = targetDrill.morse) => {
    audioEngine.stop();
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown: [{ char: targetDrill.text, morse: morseToPlay, isSpace: false }],
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

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    if (userGuess.trim().toUpperCase() === targetDrill.text.toUpperCase()) {
      setFeedback('correct');
      setIsRevealed(true);
      if (showToast) showToast('Harika! Doğru okudunuz.');
    } else {
      setFeedback('incorrect');
      if (showToast) showToast('Yanlış tahmin. Deseni inceleyip tekrar deneyin.');
    }
  };

  const faqs = [
    {
      q: "Mors kodu yazılı olarak nasıl okunur?",
      a: "Yazılı Mors kodunu okumak için önce harfleri birbirinden ayıran 1 boşlukluk aralıkları tespit edin. Her nokta-çizgi grubunu Mors tablosundaki harfle eşleştirin. Kelime aralarında kullanılan '/' veya 3 boşlukluk ayracı görünce yeni kelimeye geçin."
    },
    {
      q: "Mors kodunda bir harfin bittiği nasıl anlaşılır?",
      a: "Yazılı Mors kodunda harfler arasında standart 1 boşluk bırakılır. Sesli Mors iletiminde ise aynı harf içindeki elemanlar arasında 1 birim sessizlik varken, harf bittiğinde 3 birimlik belirgin bir sessizlik (duraklama) duyulur."
    },
    {
      q: "Mors kodunda '/' işareti ne anlama gelir?",
      a: "Yazılı Mors notasyonunda eğik çizgi ('/'), iki kelime arasındaki sınırı temsil eder. Sesli iletimdeki 7 birimlik kelime arası sessizlik süresine karşılık gelir."
    },
    {
      q: "Boşluk bırakılmadan yazılan Mors kodu okunabilir mi?",
      a: "Hayır, güvenilir şekilde okunamaz. Boşluklar Mors alfabesinin ayrılmaz bir parçasıdır. Örneğin '...---...' aralıksız yazıldığında SOS anlamına gelir ancak boşluksuz bir dizilim VEE veya SMB olarak da yorumlanabilir. Boşluk olmadan karakter sınırları kaybolur."
    },
    {
      q: "Mors kodunu gözle okumakla kulakla okumak arasındaki fark nedir?",
      a: "Gözle okuma görsel nokta ve çizgileri harfe çevirme analizidir ve yazılı metinler için kullanılır. Kulakla okuma ise sesin ritmini bir kelime veya nota motifi gibi algılama refleksidir. Telsiz operatörlüğü için kulakla okuma esastır."
    },
    {
      q: "Nokta ve çizgi süreleri tam olarak ne kadardır?",
      a: "Uluslararası ITU-R M.1677-1 standardına göre 1 çizgi tam olarak 3 nokta süresine eşittir. Harf arası boşluk 3 nokta, kelime arası boşluk ise 7 nokta süresidir."
    }
  ];

  return (
    <div className="howtoread-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Nasıl Okunur</li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <BookOpen size={16} /> Görsel ve İşitsel Kod Çözüm Kılavuzu
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Nasıl Okunur: Görsel ve İşitsel Okuma Kılavuzu
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Nokta, çizgi ve boşlukların dilini deşifre edin. Yazılı Mors metinlerini gözle çözmenin püf noktalarını, telsiz seslerini kulakla tanımanın ritim kurallarını ve interaktif okuma alıştırmalarını keşfedin.
        </p>
      </header>

      {/* Core Principle Callout */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', border: '1px solid var(--border)', background: 'rgba(56, 189, 248, 0.05)' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ padding: '0.75rem', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--primary)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>
              Mors Okumanın Temel Sırrı: Boşluklar En Az Sesler Kadar Önemlidir!
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Mors kodunu okurken yapılan en büyük hata sadece nokta ve çizgilere odaklanmaktır. Gerçekte harfleri birbirinden ayıran <strong>3 birimlik boşluklar</strong> ve kelimeleri ayıran <strong>7 birimlik duraklamalar</strong> olmadan hiçbir Mors mesajı çözülemez.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Reading Practice Drill Module */}
      <section className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3.5rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
              İnteraktif Mors Okuma Antrenörü
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Yazılı deseni okuyun veya sesi dinleyip doğru harfi/kelimeyi tahmin edin.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'written', label: 'Yazılı Kod' },
              { id: 'audio', label: 'İşitsel / Kulak' },
              { id: 'words', label: 'Kelimeler' }
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => { setDrillLevel(lvl.id); setIsRevealed(false); setFeedback(null); }}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: drillLevel === lvl.id ? 700 : 500,
                  background: drillLevel === lvl.id ? 'var(--primary)' : 'var(--surface)',
                  color: drillLevel === lvl.id ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drill Display Card */}
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
          {drillLevel !== 'audio' ? (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Aşağıdaki Kodu Okuyun:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '3px', wordBreak: 'break-all' }}>
                {targetDrill.morse}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Sesi Dinleyin ve Karakteri Tahmin Edin:</div>
              <button
                onClick={() => handlePlayMorseAudio()}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <Volume2 size={20} /> Sesi Çal
              </button>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <form onSubmit={handleCheckAnswer} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: '480px', margin: '0 auto 1rem' }}>
          <input
            type="text"
            placeholder="Tahmininizi yazın (örn: SOS)..."
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            style={{ flex: '1 1 220px', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.1rem', textAlign: 'center', fontWeight: 700 }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}
          >
            Cevabı Kontrol Et
          </button>
          <button
            type="button"
            onClick={handleNextDrill}
            className="btn"
            style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
          >
            Sonraki Soru →
          </button>
        </form>

        {/* Feedback Display */}
        {feedback && (
          <div style={{ textAlign: 'center', marginTop: '1rem', fontWeight: 700, fontSize: '1.05rem', color: feedback === 'correct' ? 'var(--signal-bright)' : 'var(--danger)' }}>
            {feedback === 'correct' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle size={18} /> Tebrikler! Doğru cevap: <strong>{targetDrill.text}</strong>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={18} /> Henüz doğru değil. Tekrar deneyin veya cevaba bakın.
              </span>
            )}
          </div>
        )}

        {isRevealed && (
          <div style={{ textAlign: 'center', marginTop: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            Doğru Çözüm: <strong>{targetDrill.text}</strong> ({targetDrill.morse})
          </div>
        )}
      </section>

      {/* Comprehensive Reading Guide */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Step-by-Step Walkthrough */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Adım Adım Yazılı Mors Kodunu Okuma Yöntemi
          </h2>
          <p>
            Yazılı bir Mors mesajıyla karşılaştığınızda (örneğin bir bulmacada, teknik dökümanda veya mesajda), şu 4 adımlı algoritmayı takip edin:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.25rem 0' }}>
            {[
              {
                step: '1. Boşlukları ve Kelime Sınırlarını Belirleyin',
                desc: 'Metindeki boşlukları inceleyin. Tek boşluklar harfleri, "/" işareti veya 3 boşlukluk geniş aralıklar kelimeleri ayırır.'
              },
              {
                step: '2. Harf Gruplarını Teker Teker İzole Edin',
                desc: 'Kelimeleri harf harf parçalayın. Örneğin "... --- ..." diziliminde ilk grup "...", ikinci grup "---", üçüncü grup "..." şeklindedir.'
              },
              {
                step: '3. Nokta-Çizgi Desenini Harfe Dönüştürün',
                desc: 'Mors harf tablosunu kullanarak her grubu harfe çevirin: "..." = S, "---" = O, "..." = S.'
              },
              {
                step: '4. Kelimeleri Birleştirin ve Cümleyi Okuyun',
                desc: 'Tüm harfleri bir araya getirerek orijinal metni oluşturun: S + O + S = SOS.'
              }
            ].map((s, idx) => (
              <div key={idx} style={{ background: 'var(--surface-sunken)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {s.step}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Real Worked Examples */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Gerçek Örneklerle Mors Mesajı Çözümleme
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '1rem 0' }}>
            
            {/* Example 1 */}
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Örnek 1: Klasik Selamlaşma</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                .... . .-.. .-.. --- / .-- --- .-. .-.. -..
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li><code>....</code> = H, <code>.</code> = E, <code>.-..</code> = L, <code>.-..</code> = L, <code>---</code> = O → <strong>HELLO</strong></li>
                <li><code>/</code> = Kelime boşluğu</li>
                <li><code>.--</code> = W, <code>---</code> = O, <code>.-..</code> = R, <code>.-..</code> = L, <code>-..</code> = D → <strong>WORLD</strong></li>
                <li><strong>Sonuç:</strong> HELLO WORLD (Merhaba Dünya)</li>
              </ul>
            </div>

            {/* Example 2 */}
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--signal-bright)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Örnek 2: Telsiz Genel Çağrısı (CQ)</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                -.-. --.- / -.-. --.-
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <li><code>-.-.</code> = C, <code>--.-</code> = Q → <strong>CQ</strong></li>
                <li><code>/</code> = Kelime boşluğu</li>
                <li><code>-.-.</code> = C, <code>--.-</code> = Q → <strong>CQ</strong></li>
                <li><strong>Sonuç:</strong> CQ CQ (Tüm istasyonlara genel çağrı)</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Reading by Sound vs Reading by Sight */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Gözle Okuma ile Kulakla Okuma Arasındaki Temel Farklar
          </h2>
          <p>
            Yazılı Mors kodunu okumak statik bir analizdir; sayfaya bakarak geriye dönebilir, noktaları tekrar inceleyebilirsiniz. Telsizde kulakla okuma ise <strong>dinamik ve geri dönüşsüzdür</strong>:
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.8 }}>
            <li><strong>Kulakla Okumada Geri Alma Yoktur:</strong> Ses geçip gittikten sonra hafızanızda kalanı yazmak zorundasınız. Bu yüzden harfleri tek tek saymak imkansızdır; ritmin bütününe odaklanılmalıdır.</li>
            <li><strong>Zamanlama Algısı:</strong> Yazılı metinde boşluk genişliği gözle görülür. Sesli iletimde ise beyniniz milisaniyelik sessizlikleri ölçerek harf ve kelime sınırını algılar.</li>
          </ul>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Pratik Sayfaları</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/morse-code-decoder/" onClick={(e) => handleNav(e, 'tr-morsedecoder', '/tr/morse-code-decoder/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Otomatik Mors Kodu Çözücü →
            </a>
            <a href="/tr/morse-code-alphabet/" onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              A–Z Harf Referans Tablosu →
            </a>
            <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              İşitsel Dinleme Antrenörü →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Kodu Okuma Hakkında Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
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
