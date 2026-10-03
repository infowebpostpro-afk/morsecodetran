import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Square, RotateCcw, Check, X, Award, Flame, Zap, Volume2, Sliders,
  HelpCircle, BookOpen, ShieldCheck, CheckCircle, AlertTriangle, ChevronDown,
  ChevronUp, Radio, ArrowRight, Copy, Target, Activity, RefreshCw, Eye, EyeOff,
  ExternalLink, Sparkles
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

const CHARACTER_SETS = {
  starter: {
    name: 'Başlangıç 8 (E, T, A, N, I, M, S, O)',
    desc: '1 ila 3 elemanlı en kolay ritimler. Yeni başlayanlar için ideal.',
    items: ['E', 'T', 'A', 'N', 'I', 'M', 'S', 'O']
  },
  letters: {
    name: 'Tüm Harfler (A–Z)',
    desc: '26 temel Latin alfabesi Mors harfi.',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  numbers: {
    name: 'Rakamlar (0–9)',
    desc: '5 elemanlı standart Mors rakam şablonları.',
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  words: {
    name: 'Kısa Kelimeler (2–4 Harf)',
    desc: 'Yaygın İngilizce kısa kelimeler ve telsiz terimleri.',
    items: ['THE', 'AND', 'FOR', 'NOT', 'YOU', 'ARE', 'DAY', 'HAM', 'SOS', 'CQ', 'RIG', 'CW', 'NEW', 'KEY', 'LOG']
  },
  prosigns: {
    name: 'İşaretler & Usul Kodları',
    desc: 'Noktalama işaretleri ve CW kısaltmaları.',
    items: ['.', ',', '?', '/', 'SOS', 'CQ', '73']
  }
};

export function TurkishPracticePage({ setActiveTab, showToast, wpm: globalWpm = 20, frequency: globalFreq = 600, volume: globalVol = 0.5 }) {
  const [selectedSetKey, setSelectedSetKey] = useState('starter');
  const [customCharWpm, setCustomCharWpm] = useState(globalWpm || 20);
  const [customFarnsworthWpm, setCustomFarnsworthWpm] = useState(12);
  const [customFreq, setCustomFreq] = useState(globalFreq || 600);

  const [currentTarget, setCurrentTarget] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  const [weakChars, setWeakChars] = useState({});
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const answerInputRef = useRef(null);

  const activePool = selectedSetKey === 'weak'
    ? (Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items)
    : CHARACTER_SETS[selectedSetKey].items;

  const nextRandomTarget = (pool = activePool, avoidCurrent = currentTarget) => {
    let choices = pool;
    if (pool.length > 1 && avoidCurrent) {
      choices = pool.filter(item => item !== avoidCurrent);
    }
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex] || pool[0];
  };

  const startNewPrompt = (newSetKey = selectedSetKey) => {
    let pool = CHARACTER_SETS[newSetKey] ? CHARACTER_SETS[newSetKey].items : activePool;
    if (newSetKey === 'weak') {
      pool = Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items;
    }
    const target = nextRandomTarget(pool, currentTarget);
    setCurrentTarget(target);
    setUserAnswer('');
    setFeedback(null);

    setTimeout(() => {
      playTargetAudio(target);
    }, 150);
  };

  useEffect(() => {
    startNewPrompt(selectedSetKey);
  }, [selectedSetKey]);

  const playTargetAudio = (textToPlay = currentTarget) => {
    if (!textToPlay) return;
    audioEngine.stop();
    setIsPlayingAudio(true);

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(customCharWpm, 18),
      farnsworthWpm: Math.min(customFarnsworthWpm, customCharWpm),
      frequency: customFreq || 600,
      volume: globalVol || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlayingAudio(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlayingAudio(false);
  };

  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    const cleanedUser = userAnswer.trim().toUpperCase();
    const cleanedTarget = currentTarget.trim().toUpperCase();
    const isCorrect = cleanedUser === cleanedTarget;

    setStats(prev => {
      const newAttempts = prev.attempts + 1;
      const newCorrect = isCorrect ? prev.correct + 1 : prev.correct;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      return {
        attempts: newAttempts,
        correct: newCorrect,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };
    });

    if (isCorrect) {
      setFeedback({ status: 'correct', showAnswer: true });
      if (showToast) showToast('Doğru bildiniz! Harika! ✓');
      setTimeout(() => {
        startNewPrompt();
      }, 900);
    } else {
      setFeedback({ status: 'wrong', showAnswer: true });
      setWeakChars(prev => ({
        ...prev,
        [cleanedTarget]: (prev[cleanedTarget] || 0) + 1
      }));
      if (showToast) showToast(`Yanlış! Doğru cevap: ${cleanedTarget}`);
    }
  };

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const accuracyRate = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  const faqs = [
    {
      q: "Mors kodu dinleme pratiği yaparken neden sesle başlanmalı?",
      a: "Mors kodu görsel nokta ve çizgileri sayarak değil, kulağın duyduğu melodik ritmi tanıyarak öğrenilir. Noktaları görsel olarak saymaya alışırsanız 10 WPM hız sınırında takılırsınız (Morse plateau). Sesle başlayarak harfleri doğrudan akustik bir bütün olarak zihne kodlarsınız."
    },
    {
      q: "Farnsworth zamanlaması nedir ve neden kullanılır?",
      a: "Farnsworth yöntemi, harflerin kendi içindeki nokta-çizgi hızını yüksek (örneğin 20 WPM) tutarken, harfler arasındaki duraklama boşluğunu genişletir (örneğin 12 WPM). Böylece harfin gerçek melodisini bozmadan beyninize düşünme payı bırakır."
    },
    {
      q: "Günde kaç dakika Mors pratiği yapmalıyım?",
      a: "Haftada bir gün 2 saat çalışmak yerine her gün 10–15 dakika düzenli dinleme pratiği yapmak çok daha etkilidir. Kısa ve sık seanslar beynin işitsel kas hafızasını canlı tutar."
    },
    {
      q: "Yanlış yaptığım harfleri nasıl düzeltebilirim?",
      a: "Bir harfi karıştırdığınızda (örneğin B '-...' ile V '...-'), o harfin sesini arka arkaya 3 kez dinleyin ve sesin ritmini zihninizde tekrarlayın. Eğitmenimizdeki 'Zayıf Karakterleri Çalıştır' havuzu kaçırdığınız sinyalleri otomatik olarak tekrar karşınıza çıkarır."
    },
    {
      q: "Dinleme (Receiving) ile Gönderme (Sending) arasındaki fark nedir?",
      a: "Dinleme, işitilen akustik ritmi zihinsel harfe çeviren bir algı sürecidir. Gönderme ise el ve bilek kaslarıyla maniple tuşlayarak ritim üretme sürecidir. Telsizcilik kuralı gereği dinleme yeteneği daima gönderme yeteneğinden önce geliştirilmelidir."
    },
    {
      q: "Kelime pratiğine ne zaman geçmeliyim?",
      a: "Tek harflerdeki dinleme doğruluk oranınız %90'ın üzerine çıktığında 'Kısa Kelimeler' havuzuna geçebilirsiniz. Bu aşamada harfleri tek tek kağıda yazmak yerine zihninizde birleştirip kelimeyi bir bütün olarak algılamayı (head copy) öğrenirsiniz."
    },
    {
      q: "Amatör telsizcilikte (CW) hangi hız hedeflenmelidir?",
      a: "Standart amatör telsiz görüşmeleri için 15–20 WPM ideal bir seviyedir. İlk başta 12 WPM Farnsworth boşluklarıyla başlayıp zamanla boşlukları daraltarak 20 WPM akıcılığına ulaşabilirsiniz."
    }
  ];

  return (
    <div className="practice-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Dinleme Pratiği</li>
        </ol>
      </nav>

      {/* HEADER SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <Radio size={16} />
          <span>İşitsel Mors Kodu Eğitmeni (Ear Training)</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Dinleme Pratiği &amp; CW Eğitmeni
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Noktaları gözle saymayı bırakın, Mors melodisini kulağınızla tanıyın. Farnsworth zamanlamalı işitsel alıştırmalarla reflekslerinizi geliştirin ve doğruluk yüzdenizi anlık takip edin.
        </p>
      </header>

      {/* INTERACTIVE TRAINER WORKSPACE */}
      <div className="glass-panel" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '3rem', boxShadow: 'var(--shadow-md)' }}>
        
        {/* POOL SELECTOR CHIPS */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
            Çalışma Havuzunu Seçin:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(CHARACTER_SETS).map(([key, data]) => (
              <button
                key={key}
                onClick={() => setSelectedSetKey(key)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: selectedSetKey === key ? 'var(--primary)' : 'var(--surface)',
                  color: selectedSetKey === key ? '#fff' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.825rem'
                }}
              >
                {data.name}
              </button>
            ))}

            {Object.keys(weakChars).length > 0 && (
              <button
                onClick={() => setSelectedSetKey('weak')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--accent-amber)',
                  background: selectedSetKey === 'weak' ? 'var(--accent-amber)' : 'var(--surface)',
                  color: selectedSetKey === 'weak' ? '#000' : 'var(--accent-amber)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.825rem'
                }}
              >
                Zayıf Karakterleri Çalıştır ({Object.keys(weakChars).length})
              </button>
            )}
          </div>
        </div>

        {/* METRICS & SCORE BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '1rem', background: 'var(--surface-sunken)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deneme</div>
            <strong style={{ fontSize: '1.25rem', color: 'var(--text)' }}>{stats.attempts}</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Doğruluk</div>
            <strong style={{ fontSize: '1.25rem', color: accuracyRate >= 80 ? 'var(--success)' : 'var(--text)' }}>%{accuracyRate}</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mevcut Seri</div>
            <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{stats.currentStreak} 🔥</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En İyi Seri</div>
            <strong style={{ fontSize: '1.25rem', color: 'var(--accent-amber)' }}>{stats.bestStreak} 🏆</strong>
          </div>
        </div>

        {/* AUDIO DRILL CARD */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => playTargetAudio(currentTarget)}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: isPlayingAudio ? 'var(--danger)' : 'var(--primary)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                boxShadow: 'var(--shadow-md)',
                fontSize: '0.9rem',
                fontWeight: 700
              }}
            >
              {isPlayingAudio ? <Square size={32} /> : <Play size={36} fill="currentColor" />}
              <span>{isPlayingAudio ? 'Durdur' : 'Sesi Çal'}</span>
            </button>
            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sinyali tekrar dinlemek için butona tıklayın.
            </div>
          </div>

          {/* ANSWER INPUT FORM */}
          <form onSubmit={handleSubmitAnswer} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              ref={answerInputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Duyduğunuz harfi yazın..."
              autoFocus
              style={{
                flex: 1,
                minWidth: '180px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                color: 'var(--text)',
                fontSize: '1.2rem',
                fontWeight: 700,
                textAlign: 'center',
                textTransform: 'uppercase',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              Cevapla
            </button>
          </form>

          {/* FEEDBACK ROW */}
          {feedback && (
            <div style={{ marginTop: '1.25rem', fontSize: '1rem', fontWeight: 700 }}>
              {feedback.status === 'correct' ? (
                <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={18} /> Doğru! "{currentTarget}" (<code className="morse-font">{translateTextToMorse(currentTarget)}</code>)
                </span>
              ) : (
                <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertTriangle size={18} /> Yanlış! Doğru cevap: <strong>{currentTarget}</strong> (<code className="morse-font">{translateTextToMorse(currentTarget)}</code>)
                </span>
              )}
            </div>
          )}

          {/* CONTROLS BAR */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => startNewPrompt()}
              style={{ padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Sonraki Harf →
            </button>
            <button
              onClick={() => setFeedback({ status: 'wrong', showAnswer: true })}
              style={{ padding: '0.45rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Cevabı Göster
            </button>
          </div>
        </div>

      </div>

      {/* EDUCATIONAL GUIDE */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* 1. 4 PRINCIPLES */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
              İşitsel Mors Kodu Öğrenme İlkeleri
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>1. Küçük Havuzla Başlayın</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>İlk gün 8 kolay harfle (E, T, A, N, I, M, S, O) başlayın. Ses ritimlerine tam hakim olmadan yeni harf eklemeyin.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>2. Bakmadan Dinleyin</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Önce sesi dinleyin; beyninizi harfin melodisini tanımaya zorlayın. Görsel tabloya hemen bakmayın.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>3. Hatalı Sinyali Tekrarlayın</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Yanlış bildiğiniz bir harfi en az 3 kez art arda dinleyerek doğru akustik hafızayı pekiştirin.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>4. Kelimelere İlerleyin</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Harf doğruluğunuz %90'ı aştığında kısa kelimelerle çalışarak harfleri zihinde tutma egzersizi yapın.</p>
              </div>
            </div>
          </section>

          {/* 2. CHARACTER SPEED VS FARNSWORTH */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Karakter Hızı (WPM) ile Farnsworth Zamanlaması Farkı
            </h2>
            <p>
              Yeni başlayanların yaptığı en büyük hata 5 WPM gibi yapay olarak yavaşlatılmış hızlarda çalışmaktır. Noktalar ve çizgiler aşırı yavaşlatıldığında harfin müzikal melodisi kaybolur ve kişi noktaları tek tek saymaya başlar.
            </p>

            <div className="table-responsive" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Ayar</th>
                    <th style={{ padding: '0.75rem' }}>Ne İşe Yarar?</th>
                    <th style={{ padding: '0.75rem' }}>Önerilen Seviye</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Karakter Hızı (WPM)</td><td style={{ padding: '0.75rem' }}>Harfin kendi içindeki nokta-çizgi çalınma hızı</td><td style={{ padding: '0.75rem' }}><strong>18 – 25 WPM</strong> (Otantik melodiyi korur)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Farnsworth Boşluğu</td><td style={{ padding: '0.75rem' }}>Harfler arasına eklenen düşünme payı süresi</td><td style={{ padding: '0.75rem' }}><strong>8 – 12 WPM</strong> (Zihne rahat algılama süresi tanır)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. 10-MINUTE ROUTINE TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              10 Dakikalık Günlük Çalışma Programı
            </h2>
            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Süre</th>
                    <th style={{ padding: '0.75rem' }}>Egzersiz Türü</th>
                    <th style={{ padding: '0.75rem' }}>Amaç</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700 }}>2 Dakika</td><td style={{ padding: '0.75rem' }}>Başlangıç 8 ile Isınma</td><td style={{ padding: '0.75rem' }}>Kulağı temel ritimlere alıştırmak (E, T, A, N, I, M, S, O).</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700 }}>4 Dakika</td><td style={{ padding: '0.75rem' }}>Aktif Havuz Dinleme</td><td style={{ padding: '0.75rem' }}>Tüm alfabeyi (A–Z) veya rakamları rasgele sırayla dinleyip çözmek.</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700 }}>2 Dakika</td><td style={{ padding: '0.75rem' }}>Zayıf Harfleri Tekrarlama</td><td style={{ padding: '0.75rem' }}>Günün seansında karıştırılan sinyalleri tekrar etmek.</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700 }}>1 Dakika</td><td style={{ padding: '0.75rem' }}>Kısa Kelime Pratiği</td><td style={{ padding: '0.75rem' }}>AND, FOR, SOS gibi 2-3 harfli kelimeleri tek parça olarak algılamak.</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700 }}>1 Dakika</td><td style={{ padding: '0.75rem' }}>Doğruluk Değerlendirmesi</td><td style={{ padding: '0.75rem' }}>Skoru incelemek; %90 üzerindeyse Farnsworth boşluğunu kısmak.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Sıkça Sorulan Sorular
            </h2>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Tuşlama (Gönderme) Pratiği Yapmak İster misiniz?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Sanal telgraf tuşumuzla el reflekslerinizi ve zamanlama oranlarınızı geliştirmek için manipülatör simülatörümüzü kullanabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-keyer', '/tr/morse-code-keyer/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Manipülatörü (Keyer) <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-learn', '/tr/learn-morse-code/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Mors Kodu Öğrenme Rehberi
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
