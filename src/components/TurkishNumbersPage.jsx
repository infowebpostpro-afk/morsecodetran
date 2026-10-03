import React, { useState } from 'react';
import {
  Volume2, Copy, Play, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  Hash, Sparkles, HelpCircle, ArrowLeftRight, Check, CheckCircle, AlertTriangle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export const TURKISH_MORSE_NUMBERS = [
  { num: '0', morse: '-----', name: 'Sıfır', ditDah: 'dah-dah-dah-dah-dah', desc: '5 çizgi. Ayna eşleniği 5 (5 nokta).' },
  { num: '1', morse: '.----', name: 'Bir', ditDah: 'di-dah-dah-dah-dah', desc: '1 nokta + 4 çizgi. Ayna eşleniği 9.' },
  { num: '2', morse: '..---', name: 'İki', ditDah: 'di-di-dah-dah-dah', desc: '2 nokta + 3 çizgi. Ayna eşleniği 8.' },
  { num: '3', morse: '...--', name: 'Üç', ditDah: 'di-di-di-dah-dah', desc: '3 nokta + 2 çizgi. Ayna eşleniği 7.' },
  { num: '4', morse: '....-', name: 'Dört', ditDah: 'di-di-di-di-dah', desc: '4 nokta + 1 çizgi. Ayna eşleniği 6.' },
  { num: '5', morse: '.....', name: 'Beş', ditDah: 'di-di-di-di-dit', desc: '5 nokta. Merdivenin tam orta pivot noktası.' },
  { num: '6', morse: '-....', name: 'Altı', ditDah: 'dah-di-di-di-dit', desc: '1 çizgi + 4 nokta. Ayna eşleniği 4.' },
  { num: '7', morse: '--...', name: 'Yedi', ditDah: 'dah-dah-di-di-dit', desc: '2 çizgi + 3 nokta. Ayna eşleniği 3.' },
  { num: '8', morse: '---..', name: 'Sekiz', ditDah: 'dah-dah-dah-di-dit', desc: '3 çizgi + 2 nokta. Ayna eşleniği 2.' },
  { num: '9', morse: '----.', name: 'Dokuz', ditDah: 'dah-dah-dah-dah-dit', desc: '4 çizgi + 1 nokta. Ayna eşleniği 1.' }
];

export const TURKISH_MIRROR_PAIRS = [
  { pair: '1 & 9', left: '1: .----', right: '9: ----.', desc: '1 nokta + 4 çizgiye karşılık 4 çizgi + 1 nokta' },
  { pair: '2 & 8', left: '2: ..---', right: '8: ---..', desc: '2 nokta + 3 çizgiye karşılık 3 çizgi + 2 nokta' },
  { pair: '3 & 7', left: '3: ...--', right: '7: --...', desc: '3 nokta + 2 çizgiye karşılık 2 çizgi + 3 nokta' },
  { pair: '4 & 6', left: '4: ....-', right: '6: -....', desc: '4 nokta + 1 çizgiye karşılık 1 çizgi + 4 nokta' },
  { pair: '5 & 0', left: '5: .....', right: '0: -----', desc: 'Tamamı nokta (5 dit) ile tamamı çizgi (5 dah)' }
];

export function TurkishNumbersPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [inputNum, setInputNum] = useState('2026');
  const [playingKey, setPlayingKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Quiz state
  const [quizTab, setQuizTab] = useState('num2morse'); // 'num2morse' | 'morse2num'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaySingle = (num, morse) => {
    setPlayingKey(num);
    audioEngine.playSequence({
      breakdown: [{ char: num, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingKey(null);
      }
    });
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      if (showToast) showToast(`${label} kopyalandı ✓`);
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  // Convert input numbers to Morse
  const convertedMorse = inputNum.split('').map(char => {
    const found = TURKISH_MORSE_NUMBERS.find(n => n.num === char);
    return found ? found.morse : (char === ' ' ? '/' : '?');
  }).join(' ');

  const handlePlayCustom = () => {
    const breakdown = inputNum.split('').map(char => {
      const found = TURKISH_MORSE_NUMBERS.find(n => n.num === char);
      return {
        char,
        morse: found ? found.morse : '/',
        isSpace: char === ' '
      };
    });

    audioEngine.playSequence({
      breakdown,
      wpm,
      frequency,
      volume
    });
  };

  // Quiz questions
  const numQuizQuestions = [
    { id: 'q1', q: '7', ans: '--...' },
    { id: 'q2', q: '3', ans: '...--' },
    { id: 'q3', q: '0', ans: '-----' },
    { id: 'q4', q: '9', ans: '----.' }
  ];

  const morseQuizQuestions = [
    { id: 'mq1', q: '..---', ans: '2' },
    { id: 'mq2', q: '-....', ans: '6' },
    { id: 'mq3', q: '.....', ans: '5' },
    { id: 'mq4', q: '.----', ans: '1' }
  ];

  const handleCheckQuiz = (id, expectedAns, isMorseToNum = false) => {
    const userVal = (quizAnswers[id] || '').trim();
    if (!userVal) return;
    const isCorrect = isMorseToNum
      ? userVal === expectedAns
      : userVal.replace(/\s+/g, '') === expectedAns.replace(/\s+/g, '');

    setQuizFeedback(prev => ({ ...prev, [id]: isCorrect ? 'correct' : 'wrong' }));
  };

  const numberFaqs = [
    {
      q: "Mors alfabesinde sayılar nasıl yazılır?",
      a: "Standart Uluslararası Mors alfabesinde her rakam (0–9) tam olarak 5 sinyal elemanından (nokta veya çizgi) oluşur. 1'den 5'e kadar noktaların sayısı artarken (1: .----, 2: ..---, 3: ...--, 4: ....-, 5: .....), 6'dan 0'a kadar çizgilerin sayısı artar (6: -...., 7: --..., 8: ---.., 9: ----., 0: -----)."
    },
    {
      q: "Mors alfabesinde sıfır (0) nedir?",
      a: "Mors alfabesinde sıfır beş adet çizgiden oluşur: '-----'. Sesli ritmi beş uzun 'dah-dah-dah-dah-dah' şeklindedir."
    },
    {
      q: "Mors kodunda sayılar harflerden nasıl ayırt edilir?",
      a: "Harfler 1 ile 4 arasında değişen sinyal sayısına sahipken (örn. E: tek nokta, Q: dört eleman), standart Mors rakamları istisnasız tam 5 elemandan oluşur. Bu 5 elemanlı sabit yapı kulaktan dinlerken sayının başladığını ve bittiğini kolayca anlamanızı sağlar."
    },
    {
      q: "Ayna (simetrik) sayı çiftleri kuralı nedir?",
      a: "Rakamlar birbirinin tam tersi ritimlere sahiptir: 1 (.----) ile 9 (----.), 2 (..---) ile 8 (---..), 3 (...--) ile 7 (--...), 4 (....-) ile 6 (-....), 5 (.....) ile 0 (-----). Bir tarafı bildiğinizde diğer tarafı ters çevirerek kolayca bulabilirsiniz."
    },
    {
      q: "Kısaltılmış sayılar (Cut Numbers) nedir?",
      a: "Amatör telsiz yarışmalarında (Contest) ve sinyal raporlarında (RST) zaman kazanmak için 5 elemanlı uzun sayılar tek veya çift elemanlı harflerle kısaltılır. En yaygın olanı 0 yerine 'T' (-) ve 9 yerine 'N' (-.) kullanılmasıdır. Örneğin mükemmel sinyal raporu olan 599, telsizde '5NN' olarak iletilir."
    },
    {
      q: "Mors kodunda ondalık sayılar ve virgül nasıl iletilir?",
      a: "Ondalık basamakları ayırmak için nokta '.-.-.-' veya doğrudan kesme işareti / eğik çizgi '-..-.' kullanılır. Örneğin 3.14 sayısı '...-- .-.-.- .---- ....-' şeklinde yazılır."
    },
    {
      q: "Mors kodunda kesirli sayılar nasıl yazılır?",
      a: "Kesirli sayılarda tam kısım ile kesir arasına tire işareti '-....-' konur, pay ile payda ise eğik çizgi '-..-.' ile ayrılır. Örneğin 1 1/2 sayısı '.---- -....- .---- -..-. ..---' olarak kodlanır."
    },
    {
      q: "Mors alfabesinde en kolay hatırlanan sayılar hangileridir?",
      a: "5 ve 0 en kolay hatırlanan iki pivot noktadır. 5 sayısı beş adet noktadan ('.....'), 0 sayısı ise beş adet çizgiden ('-----') oluşur."
    },
    {
      q: "Çok basamaklı büyük sayılar morsa nasıl çevrilir?",
      a: "Çok basamaklı sayılarda (örneğin 2026), her rakam 5 elemanlı Mors koduyla yazılır ve rakamlar arasına standart 3 birimlik harf boşluğu konur: '..--- ----- ..--- -....'. Sayılar arasında ekstra bir özel birleştirme işareti gerekmez."
    },
    {
      q: "Mors sayılarının tarihi kökeni nedir?",
      a: "İlk Amerikan Mors sisteminde sayılar için farklı uzunlukta çizgiler kullanılıyordu. 1848'de Friedrich Clemens Gerke, sayıları bugünkü 5 elemanlı simetrik merdiven düzenine getirdi. 1865 Paris Konferansı'nda bu sistem Uluslararası Mors Kodu standardı olarak kabul edildi."
    },
    {
      q: "Mors sayılarını kulaktan dinleyerek nasıl hızla tanıyabilirim?",
      a: "Nokta veya çizgileri teker teker saymak yerine, baştaki tonun dit mi dah mı başladığına ve ardından gelen sesin ağırlığına odaklanın. Nokta ile başlıyorsa 1–5 arası, çizgi ile başlıyorsa 6–0 arası bir sayıdır."
    },
    {
      q: "Telefon numaraları Mors kodu ile nasıl gönderilir?",
      a: "Telefon numaraları rakam rakam çevrilir. Alan kodları veya numaralar arasındaki boşluklar için 7 birimlik kelime boşluğu veya eğik çizgi ('/') kullanılır."
    }
  ];

  return (
    <div className="numbers-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Sayılar</li>
        </ol>
      </nav>

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Uluslararası Standart ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Rakamlar: 0–9 Sayı Tablosu, Sesler ve Merdiven Kuralı
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Mors alfabesinde 0'dan 9'a kadar tüm rakamların nokta-çizgi kodlarını, sesli ritimlerini ve 5 elemanlı simetrik merdiven düzenini öğrenin. İstediğiniz sayıyı yazıp anında dinleyin veya iki yönlü quizle pratik yapın.
        </p>
      </header>

      {/* Interactive Number Converter Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ flex: '1 1 260px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', marginBottom: '0.5rem' }}>
              Dönüştürülecek Sayıyı Girin:
            </label>
            <input
              type="text"
              value={inputNum}
              onChange={(e) => setInputNum(e.target.value.replace(/[^0-9\s]/g, ''))}
              placeholder="Örn: 2026, 73, 1923..."
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
            />
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Mors Kodu Çıktısı:</span>
              <button
                onClick={() => handleCopy(convertedMorse, 'Sayı Mors kodu')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Copy size={14} /> Kopyala
              </button>
            </div>
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '2px', wordBreak: 'break-all' }}>
              {convertedMorse || '---'}
            </div>
          </div>

          <div>
            <button
              onClick={handlePlayCustom}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', height: 'fit-content' }}
            >
              <Volume2 size={20} /> Sayıyı Sesli Dinle
            </button>
          </div>
        </div>
      </div>

      {/* 0-9 Interactive Digit Cards */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.5rem', textAlign: 'center' }}>
          0'dan 9'a Mors Rakam Kartları
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {TURKISH_MORSE_NUMBERS.map((item) => {
            const isPlayingThis = playingKey === item.num;
            return (
              <div
                key={item.num}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isPlayingThis ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isPlayingThis ? 'rgba(56, 189, 248, 0.08)' : 'var(--surface-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)' }}>{item.num}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.name}</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                    {item.morse}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    {item.ditDah}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                    {item.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handlePlaySingle(item.num, item.morse)}
                    className="btn"
                    style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.45rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                  >
                    <Volume2 size={16} /> Dinle
                  </button>
                  <button
                    onClick={() => handleCopy(item.morse, `Rakam ${item.num}`)}
                    className="btn"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}
                    title="Kopyala"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Editorial Guide */}
      <article className="prose" style={{ maxWidth: '960px', margin: '0 auto 3rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        
        {/* Section 1: How Numbers Work (5 Elements Rule) */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Kodu Rakamları Nasıl Çalışır? 5 Eleman Kuralı
          </h2>
          <p>
            Mors alfabesinde harfler 1 ila 4 sinyal arasında değişkenlik gösterirken (örneğin E tek bir nokta, C ise 4 sinyaldir), <strong>tüm standart rakamlar istisnasız tam 5 sinyal elemanından</strong> oluşur. Bu matematiksel simetri, telsiz operatörlerinin gelen sinyalin bir harf mi yoksa sayı mı olduğunu anında ayırt etmesini sağlar.
          </p>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', margin: '1rem 0' }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>
              <strong>5 Eleman Standardı (ITU-R M.1677-1):</strong> Rakamlar 5 elemanlı kapalı bir sistemdir. Her rakam noktalar ve çizgilerin belirli bir orandaki birleşiminden oluşur. Toplam eleman sayısı asla 5'ten az veya 5'ten fazla olamaz.
            </p>
          </div>
        </section>

        {/* Section 2: The Staircase Progression */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Mors Sayı Merdiveni: Noktadan Çizgiye Geçiş
          </h2>
          <p>
            Sayı dizilimi iki aşamalı bir merdiven şeklinde ilerler. Bu düzeni anladığınızda sayıları ezberlemenize gerek kalmaz, zihninizde anında inşa edebilirsiniz:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '1.5rem 0' }}>
            
            {/* Phase 1 */}
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--signal-bright)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Aşama: Noktalar Artar (1 → 5)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>1</strong></span> <code>.----</code> <span style={{ color: 'var(--text-muted)' }}>1 nokta, 4 çizgi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>2</strong></span> <code>..---</code> <span style={{ color: 'var(--text-muted)' }}>2 nokta, 3 çizgi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>3</strong></span> <code>...--</code> <span style={{ color: 'var(--text-muted)' }}>3 nokta, 2 çizgi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>4</strong></span> <code>....-</code> <span style={{ color: 'var(--text-muted)' }}>4 nokta, 1 çizgi</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--signal)', borderRadius: '4px' }}>
                  <span><strong>5 (Pivot)</strong></span> <code style={{ color: 'var(--signal-bright)', fontWeight: 800 }}>.....</code> <span style={{ color: 'var(--signal-bright)', fontWeight: 600 }}>5 nokta (Hepsi nokta)</span>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                2. Aşama: Çizgiler Artar (6 → 0)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>6</strong></span> <code>-....</code> <span style={{ color: 'var(--text-muted)' }}>1 çizgi, 4 nokta</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>7</strong></span> <code>--...</code> <span style={{ color: 'var(--text-muted)' }}>2 çizgi, 3 nokta</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>8</strong></span> <code>---..</code> <span style={{ color: 'var(--text-muted)' }}>3 çizgi, 2 nokta</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'var(--surface)', borderRadius: '4px' }}>
                  <span><strong>9</strong></span> <code>----.</code> <span style={{ color: 'var(--text-muted)' }}>4 çizgi, 1 nokta</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', borderRadius: '4px' }}>
                  <span><strong>0 (Kapanış)</strong></span> <code style={{ color: 'var(--accent-amber)', fontWeight: 800 }}>-----</code> <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>5 çizgi (Hepsi çizgi)</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: 5 Mirror Pairs Table */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            5 Ayna Çifti Kuralı (Yarısını Öğren, Hepsini Bil)
          </h2>
          <p>
            Mors sayılarının en pratik zihinsel tekniği simetrik ayna çiftleridir. Rakamların toplamı 10 eden çiftler (ve 5 ile 0 çifti) birbirinin ayna yansımasıdır:
          </p>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Rakam 1</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mors</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Ayna Eşleniği</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Mors</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Simetri Mantığı</th>
                </tr>
              </thead>
              <tbody>
                {TURKISH_MIRROR_PAIRS.map((pair, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{pair.left.split(':')[0]}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}><code>{pair.left.split(':')[1].trim()}</code></td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{pair.right.split(':')[0]}</td>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)' }}><code>{pair.right.split(':')[1].trim()}</code></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{pair.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Cut Numbers (Telsizde Kısaltılmış Sayılar) */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            Telsizcilikte Kısaltılmış Sayılar (Cut Numbers)
          </h2>
          <p>
            Amatör telsiz yarışmalarında (Contest) ve DX bağlantılarında yüksek hızlarda 5 elemanlı tam sayıları göndermek fazla zaman alır. Bu nedenle operatörler geleneksel olarak sayıları tek veya iki elemanlı harflerle kısaltır:
          </p>

          <div style={{ overflowX: 'auto', margin: '1rem 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <th style={{ padding: '0.65rem 1rem' }}>Sayı</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Tam Mors Kodu</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Kısaltma Harfi</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Kısaltılmış Mors</th>
                  <th style={{ padding: '0.65rem 1rem' }}>Kullanım Alanı</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['0', '-----', 'T', '-', 'Çok yaygın: Seri numaralarında 001 → TT1'],
                  ['1', '.----', 'A', '.-', 'Yarışma sıra numaralarında'],
                  ['2', '..---', 'U', '..-', 'Bölge ve seri bildirimlerinde'],
                  ['5', '.....', 'E', '.', 'Sinyal raporlarında'],
                  ['7', '--...', 'B', '-...', 'Yarışmalarda'],
                  ['8', '---..', 'D', '-..', 'Yarışmalarda'],
                  ['9', '----.', 'N', '-.', 'En yaygın: 599 sinyal raporu daima 5NN iletilir']
                ].map(([num, full, cut, cutM, use], idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700 }}>{num}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)' }}><code>{full}</code></td>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>{cut}</td>
                    <td style={{ padding: '0.65rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--signal-bright)' }}><code>{cutM}</code></td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Interactive Two-Way Practice Quiz */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
            İnteraktif Sayı Alıştırma Testi (İki Yönlü Quiz)
          </h2>
          <p>
            Mors sayılarında reflekslerinizi geliştirmek için iki yönlü pratik yapın. Rakamı morsa veya verilen Mors kodunu rakama çevirin:
          </p>

          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', margin: '1.25rem 0' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <button
                onClick={() => setQuizTab('num2morse')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: quizTab === 'num2morse' ? 'var(--primary)' : 'var(--surface)',
                  color: quizTab === 'num2morse' ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Rakamdan Morsa Çeviri
              </button>
              <button
                onClick={() => setQuizTab('morse2num')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: quizTab === 'morse2num' ? 'var(--primary)' : 'var(--surface)',
                  color: quizTab === 'morse2num' ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Morstan Rakama Çeviri
              </button>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(quizTab === 'num2morse' ? numQuizQuestions : morseQuizQuestions).map((item) => {
                const fb = quizFeedback[item.id];
                const isRev = revealedQuiz[item.id];

                return (
                  <div key={item.id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {quizTab === 'num2morse' ? 'Rakam:' : 'Mors:'} <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '1.3rem' }}>{item.q}</strong>
                      </span>
                      <input
                        type="text"
                        placeholder={quizTab === 'num2morse' ? 'Örn: --...' : 'Örn: 7'}
                        value={quizAnswers[item.id] || ''}
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, [item.id]: e.target.value })}
                        style={{ padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', width: '130px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleCheckQuiz(item.id, item.ans, quizTab === 'morse2num')}
                        className="btn btn-primary"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                      >
                        Kontrol Et
                      </button>
                      <button
                        onClick={() => setRevealedQuiz({ ...revealedQuiz, [item.id]: !isRev })}
                        className="btn"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {isRev ? 'Gizle' : 'Cevabı Gör'}
                      </button>
                      {fb === 'correct' && <CheckCircle size={20} style={{ color: 'var(--signal-bright)' }} />}
                      {fb === 'wrong' && <AlertTriangle size={20} style={{ color: 'var(--danger)' }} />}
                    </div>

                    {isRev && (
                      <div style={{ width: '100%', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>
                        Doğru Yanıt: <code>{item.ans}</code>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Links to Related Tools */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border)', marginTop: '2.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>İlgili Türkçe Mors Kaynakları</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <a href="/tr/morse-code-alphabet/" onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              A–Z Harf Tablosu →
            </a>
            <a href="/tr/morse-code-symbols/" onClick={(e) => handleNav(e, 'tr-symbols', '/tr/morse-code-symbols/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Noktalama İşaretleri ve Prosign'lar →
            </a>
            <a href="/tr/morse-code-practice/" onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')} className="btn" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600 }}>
              Rakam ve Harf Dinleme Alıştırması →
            </a>
          </div>
        </div>

      </article>

      {/* Comprehensive FAQ Section */}
      <section style={{ maxWidth: '960px', margin: '0 auto 4rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text)' }}>
          Mors Rakamları Hakkında Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {numberFaqs.map((faq, idx) => {
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
