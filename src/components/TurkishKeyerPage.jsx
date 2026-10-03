import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Radio, Volume2, Trash2, Undo2, Copy, Play, RefreshCw,
  HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight, Activity,
  Settings, CheckCircle2, Sliders, Target, Clock, Zap
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToText } from '../engine/morseEngine.js';

const PRESET_CATEGORIES = {
  beginner: [
    { label: 'E Harfi', text: 'E' },
    { label: 'T Harfi', text: 'T' },
    { label: 'A Harfi', text: 'A' },
    { label: 'N Harfi', text: 'N' },
    { label: 'S Harfi', text: 'S' },
    { label: 'O Harfi', text: 'O' }
  ],
  common: [
    { label: 'SOS', text: 'SOS' },
    { label: 'HELLO', text: 'HELLO' },
    { label: 'TEST', text: 'TEST' },
    { label: 'CQ', text: 'CQ' },
    { label: 'RADIO', text: 'RADIO' }
  ],
  phrases: [
    { label: 'HELLO WORLD', text: 'HELLO WORLD' },
    { label: 'GOOD MORNING', text: 'GOOD MORNING' },
    { label: 'THANK YOU', text: 'THANK YOU' },
    { label: '73 DE TA1', text: '73 DE TA1' }
  ]
};

export function TurkishKeyerPage({
  wpm = 20,
  frequency = 600,
  setFrequency,
  volume = 0.5,
  setVolume,
  showToast,
  setActiveTab
}) {
  const [keyedMorse, setKeyedMorse] = useState('');
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [lastSymbol, setLastSymbol] = useState(null);
  const [recentSignals, setRecentSignals] = useState([]);
  
  // Audio & Settings
  const [keySoundEnabled, setKeySoundEnabled] = useState(true);
  const [dashThreshold, setDashThreshold] = useState(160); // ms
  const [showSettings, setShowSettings] = useState(false);
  const [keyFrequency, setKeyFrequency] = useState(frequency || 600);
  const [keyVolume, setKeyVolume] = useState(volume || 0.5);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Practice Modes
  const [practiceMode, setPracticeMode] = useState('free'); // 'free', 'guided'
  const [targetCategory, setTargetCategory] = useState('beginner');
  const [targetText, setTargetText] = useState('E');

  // Session Stats
  const [totalDots, setTotalDots] = useState(0);
  const [totalDashes, setTotalDashes] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionDurationSec, setSessionDurationSec] = useState(0);

  const pressStartTime = useRef(0);
  const activeOscillator = useRef(null);
  const timerIntervalRef = useRef(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const decodedText = useMemo(() => {
    return translateMorseToText(keyedMorse);
  }, [keyedMorse]);

  // Session Timer
  useEffect(() => {
    if (sessionStartTime) {
      timerIntervalRef.current = setInterval(() => {
        setSessionDurationSec(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [sessionStartTime]);

  const startKeySound = () => {
    if (!keySoundEnabled) return;
    try {
      const ctx = audioEngine.getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(keyFrequency, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(keyVolume, ctx.currentTime + 0.005);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      activeOscillator.current = { osc, gain };
    } catch {}
  };

  const stopKeySound = () => {
    if (activeOscillator.current) {
      try {
        const { osc, gain } = activeOscillator.current;
        const ctx = audioEngine.getAudioContext();
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        }, 15);
      } catch {}
      activeOscillator.current = null;
    }
  };

  const handlePressDown = () => {
    if (isKeyDown) return;
    if (!sessionStartTime) setSessionStartTime(Date.now());
    setIsKeyDown(true);
    pressStartTime.current = performance.now();
    startKeySound();
  };

  const handlePressUp = () => {
    if (!isKeyDown) return;
    setIsKeyDown(false);
    stopKeySound();

    const duration = Math.round(performance.now() - pressStartTime.current);
    if (duration < 25) return; // ignore micro jitter

    const isDash = duration >= dashThreshold;
    const symbol = isDash ? '-' : '.';

    if (isDash) setTotalDashes(prev => prev + 1);
    else setTotalDots(prev => prev + 1);

    const newSignal = { type: isDash ? 'dah' : 'dit', duration };
    setLastSymbol(newSignal);
    setRecentSignals(prev => [newSignal, ...prev.slice(0, 7)]);
    setKeyedMorse(prev => prev + symbol);
  };

  // Keyboard Spacebar Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault();
        handlePressDown();
      }
    };
    const handleGlobalKeyUp = (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault();
        handlePressUp();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [isKeyDown, dashThreshold, keyFrequency, keyVolume, keySoundEnabled]);

  const handleAddSpace = () => setKeyedMorse(prev => prev + ' ');
  const handleAddSlash = () => setKeyedMorse(prev => prev + ' / ');
  const handleUndo = () => {
    setKeyedMorse(prev => prev.slice(0, -1));
  };
  const handleClear = () => {
    setKeyedMorse('');
    setLastSymbol(null);
    setRecentSignals([]);
    if (showToast) showToast('Maniple girişi temizlendi');
  };

  const handleCopyMorse = async () => {
    if (!keyedMorse) return;
    try {
      await navigator.clipboard.writeText(keyedMorse);
      if (showToast) showToast('Mors kodu kopyalandı ✓');
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  const handleCopyText = async () => {
    if (!decodedText) return;
    try {
      await navigator.clipboard.writeText(decodedText);
      if (showToast) showToast('Çözümlenen metin kopyalandı ✓');
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  const faqs = [
    {
      q: "Mors manipülatörü (Keyer / Maniple) nedir?",
      a: "Mors manipülatörü, operatörün nokta ve çizgi sinyallerini manuel veya yarı otomatik olarak üretmesini sağlayan fiziksel veya yazılımsal telgraf tuşudur. Tarayıcı simülatörümüz klavyenizi veya dokunmatik ekranınızı gerçek bir düz maniple (straight key) gibi kullanmanızı sağlar."
    },
    {
      q: "Sanal manipülatör nasıl kullanılır?",
      a: "Masaüstünde klavyenizin 'Boşluk' (Spacebar) tuşuna veya ekrandaki büyük dairesel butona kısa süre basıp bırakırsanız nokta (.), uzun süre basılı tutarsanız çizgi (-) üretilir. Harfler arasına boşluk bırakmak için 'Harf Boşluğu' butonunu kullanabilirsiniz."
    },
    {
      q: "Nokta ile çizgi arasındaki süre farkı nedir?",
      a: "Uluslararası ITU-R M.1677-1 standardına göre bir çizgi, noktanın tam 3 katı uzunluğundadır (1:3 oranı). Bu simülatörde çizgi eşiği varsayılan olarak 160 milisaniyedir; basma sürenize göre ayarları özelleştirebilirsiniz."
    },
    {
      q: "Düz maniple (Straight Key) ile Iambic maniple (Paddle) arasındaki fark nedir?",
      a: "Düz maniple tek bir manivelaya sahiptir; hem noktaların hem çizgilerin süresini operatör el becerisiyle belirler. Iambic maniplelerde ise sol ve sağ kollar bulunur ve elektronik devreye bağlanarak kusursuz zamanlamalı noktaları ve çizgileri otomatik üretir."
    },
    {
      q: "Amatör telsizcilikte 'CW' ne anlama gelir?",
      a: "CW, 'Continuous Wave' (Sürekli Dalga) ifadesinin kısaltmasıdır. Mors kodunun radyo taşıyıcı dalgasının kesintili olarak açılıp kapatılmasıyla iletildiği haberleşme modunu ifade eder."
    },
    {
      q: "Maniple ile Mors iletim hızımı nasıl geliştirebilirim?",
      a: "Öncelikle hıza (WPM) değil, ritmin temizliğine odaklanın. Günlük 10–15 dakikalık düzenli pratik yapmak, harfleri tek tek saymak yerine birer müzikal ses kalıbı olarak hissetmenizi sağlar."
    },
    {
      q: "Simülatör bastığım Mors kodunu anında metne çeviriyor mu?",
      a: "Evet. Dahili gerçek zamanlı çözücümüz bastığınız nokta ve çizgileri anlık olarak Latin harflerine çevirir. Böylece hedeflediğiniz harfi doğru basıp basmadığınızı hemen teyit edebilirsiniz."
    }
  ];

  return (
    <div className="keyer-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* BREADCRUMB NAVIGATION */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Maniple Simülatörü</li>
        </ol>
      </nav>

      {/* HERO SECTION */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Maniple Simülatörü & CW Tuşlayıcı
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Klavye boşluk tuşu (Spacebar), fare veya dokunmatik ekranınızla sanal telgraf tuşunu çalın. Gerçek zamanlı ses tonu dinleyin, milisaniye cinsinden basma sürelerinizi analiz edin ve iletiminizi anlık metin olarak görün.
        </p>
      </header>

      {/* INTERACTIVE WORKSPACE CARD */}
      <div className="glass-panel" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
        
        {/* TOP STATUS BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Çalışma Modu:</span>
            <button
              onClick={() => setPracticeMode('free')}
              style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: practiceMode === 'free' ? 'var(--primary)' : 'var(--surface)', color: practiceMode === 'free' ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Serbest Tuşlama
            </button>
            <button
              onClick={() => setPracticeMode('guided')}
              style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: practiceMode === 'guided' ? 'var(--primary)' : 'var(--surface)', color: practiceMode === 'guided' ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Rehberli Hedef Pratiği
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              <Sliders size={14} /> Ayarlar ({dashThreshold}ms)
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Süre: <strong>{sessionDurationSec}s</strong> | Nokta: <strong>{totalDots}</strong> | Çizgi: <strong>{totalDashes}</strong>
            </span>
          </div>
        </div>

        {/* SETTINGS PANEL */}
        {showSettings && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Çizgi Eşiği: <strong>{dashThreshold} ms</strong>
                </label>
                <input
                  type="range"
                  min="80"
                  max="300"
                  step="10"
                  value={dashThreshold}
                  onChange={(e) => setDashThreshold(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Bu sürenin altı nokta, üstü çizgi sayılır</span>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Ton Frekansı: <strong>{keyFrequency} Hz</strong>
                </label>
                <input
                  type="range"
                  min="300"
                  max="1000"
                  step="50"
                  value={keyFrequency}
                  onChange={(e) => setKeyFrequency(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Ses Seviyesi: <strong>{Math.round(keyVolume * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={keyVolume}
                  onChange={(e) => setKeyVolume(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* GUIDED TARGET ROW */}
        {practiceMode === 'guided' && (
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>Hedef İfade:</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--signal-bright)', letterSpacing: '2px' }}>{targetText}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {PRESET_CATEGORIES[targetCategory].map((p) => (
                  <button
                    key={p.text}
                    onClick={() => { setTargetText(p.text); handleClear(); }}
                    style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', background: targetText === p.text ? 'var(--primary)' : 'var(--surface)', color: targetText === p.text ? '#fff' : 'var(--text)', border: '1px solid var(--border)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {decodedText.trim().toUpperCase() === targetText.trim().toUpperCase() && (
              <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> Tebrikler! Hedef ifadeyi başarıyla bastınız!
              </div>
            )}
          </div>
        )}

        {/* TELEGRAPH KEY LEVER BUTTON */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onMouseDown={handlePressDown}
            onMouseUp={handlePressUp}
            onTouchStart={(e) => { e.preventDefault(); handlePressDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); handlePressUp(); }}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: isKeyDown ? 'radial-gradient(circle, var(--primary) 0%, rgba(56, 189, 248, 0.4) 100%)' : 'var(--surface-sunken)',
              border: isKeyDown ? '4px solid var(--primary)' : '4px solid var(--border)',
              color: isKeyDown ? '#ffffff' : 'var(--text)',
              fontSize: '1.1rem',
              fontWeight: 800,
              cursor: 'pointer',
              userSelect: 'none',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: isKeyDown ? '0 0 35px rgba(56, 189, 248, 0.6)' : 'var(--shadow-md)',
              transform: isKeyDown ? 'scale(0.97)' : 'scale(1)',
              transition: 'transform 0.05s ease, box-shadow 0.1s ease'
            }}
          >
            <Radio size={40} />
            <span>{isKeyDown ? 'İLETİLİYOR' : 'BASIN (SPACE)'}</span>
          </button>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Klavyeden <strong>BOŞLUK (Spacebar)</strong> tuşunu da basılı tutabilirsiniz.
          </div>
        </div>

        {/* LIVE OUTPUT DISPLAYS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Basılan Mors Kodu:</span>
              {keyedMorse && (
                <button onClick={handleCopyMorse} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Copy size={12} /> Kopyala
                </button>
              )}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--signal-bright)', minHeight: '40px', wordBreak: 'break-word' }}>
              {keyedMorse || '—'}
            </div>
          </div>

          <div style={{ background: 'var(--surface-sunken)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anlık Çözümlenen Metin:</span>
              {decodedText && (
                <button onClick={handleCopyText} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Copy size={12} /> Kopyala
                </button>
              )}
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', minHeight: '40px', wordBreak: 'break-word' }}>
              {decodedText || '—'}
            </div>
          </div>
        </div>

        {/* TIMING FEEDBACK BAR */}
        {lastSymbol && (
          <div style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <span>Son Sinyal: <strong style={{ color: lastSymbol.type === 'dah' ? 'var(--accent-amber)' : 'var(--signal-bright)' }}>{lastSymbol.type === 'dah' ? 'Çizgi (-)' : 'Nokta (.)'}</strong></span>
            <span>Süre: <strong>{lastSymbol.duration} ms</strong></span>
            <span>Eşik: <strong>{dashThreshold} ms</strong></span>
          </div>
        )}

        {/* ACTION BUTTON CONTROLS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
          <button
            onClick={handleAddSpace}
            style={{ padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Harf Boşluğu (Boşluk)
          </button>
          <button
            onClick={handleAddSlash}
            style={{ padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            Kelime Ayracı ( / )
          </button>
          <button
            onClick={handleUndo}
            style={{ padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
          >
            <Undo2 size={14} /> Geri Al
          </button>
          <button
            onClick={handleClear}
            style={{ padding: '0.55rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--danger)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
          >
            <Trash2 size={14} /> Temizle
          </button>
        </div>

      </div>

      {/* EDUCATIONAL GUIDE */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* 1. 4 STEPS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
              Mors Manipülatörü ile Tuşlama Adımları
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.35rem' }}>1. Tuşa Basın</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Masaüstünde klavyenizin Boşluk (Space) tuşunu, mobil cihazlarda ise ekrandaki butonu basılı tutun.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.35rem' }}>2. Nokta & Çizgi Üretin</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Kısa bir dokunuş nokta (.), eşik süresinden uzun basış ise çizgi (-) sinyali üretir.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.35rem' }}>3. Ritmi Koruyun</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Harfler arasında kısa bekleme, kelimeler arasında ise daha uzun aralık verin.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.35rem' }}>4. Çözümü Doğrulayın</div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Anlık metin kutusundan tuşladığınız kodun hangi harfe karşılık geldiğini teyit edin.</p>
              </div>
            </div>
          </section>

          {/* 2. HOW IT WORKS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Mors Manipülatörü Nasıl Çalışır?
            </h2>
            <p>
              Telgraf manipülatörü özünde bir elektrik anahtarıdır (switch). Operatör, tuşa basarak elektrik devresini kapatır ve sinyalin iletilmesini sağlar; bıraktığında ise sinyal kesilir. Klasik <strong>düz maniple (straight key)</strong> tek bir mekanik koldan oluşur ve sinyal süresini tamamen operatörün el kas hafızası belirler.
            </p>
            <p>
              Uluslararası Telekomünikasyon Birliği'nin <strong>ITU-R M.1677-1</strong> standardına göre Mors sinyalleri katı matematiksel zamanlama oranlarına sahiptir:
            </p>

            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Mors Bileşeni</th>
                    <th style={{ padding: '0.75rem' }}>Standart Süre</th>
                    <th style={{ padding: '0.75rem' }}>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Nokta (dit)</td><td style={{ padding: '0.75rem' }}>1 birim</td><td style={{ padding: '0.75rem' }}>Temel zamanlama birimi</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Çizgi (dah)</td><td style={{ padding: '0.75rem' }}>3 birim</td><td style={{ padding: '0.75rem' }}>Nokta süresinin tam üç katı</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harf içi eleman boşluğu</td><td style={{ padding: '0.75rem' }}>1 birim</td><td style={{ padding: '0.75rem' }}>Aynı harfin noktaları/çizgileri arası sessizlik</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harfler arası boşluk</td><td style={{ padding: '0.75rem' }}>3 birim</td><td style={{ padding: '0.75rem' }}>Farklı harfleri ayıran sessizlik süresi</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Kelimeler arası boşluk</td><td style={{ padding: '0.75rem' }}>7 birim</td><td style={{ padding: '0.75rem' }}>Kelimeler arası uzun sessizlik aralığı</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. HARDWARE COMPARISON */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Düz Maniple vs. Iambic Paddle vs. Elektronik Keyer
            </h2>
            <ul className="content-list" style={{ paddingLeft: '1.5rem', lineHeight: 1.8 }}>
              <li>
                <strong style={{ color: 'var(--text)' }}>Düz Maniple (Straight Key):</strong> Tek bir yaylı manivela koluna sahiptir. Hem noktaların hem çizgilerin süresini operatör kendi parmak/bilek hareketiyle tayin eder. Bu simülatör temel olarak düz maniple tecrübesi sunar.
              </li>
              <li>
                <strong style={{ color: 'var(--text)' }}>Iambic Paddle (Çift Kollu Maniple):</strong> Biri noktalar diğeri çizgiler için iki ayrı kola sahiptir. Yüksek hızlarda parmak yorgunluğunu önler.
              </li>
              <li>
                <strong style={{ color: 'var(--text)' }}>Elektronik Keyer:</strong> Paddle kollarından gelen sinyalleri alıp milisaniyesi kusursuz oranda nokta ve çizgiler üreten mikrodenetleyici devredir.
              </li>
            </ul>
          </section>

          {/* 4. COMMON MISTAKES */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
              Mors Tuşlamada En Sık Yapılan Hatalar
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '0.35rem' }}>1. Tuşu Fazla Basılı Tutmak</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Nokta basmak isterken tuşu gereğinden uzun tutmak çizgi olarak algılanmasına yol açar. Noktalar hafif ve seri olmalıdır.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '0.35rem' }}>2. Çizgileri Çok Kısa Kesmek</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Çizgiler noktanın 3 katı uzunluğunda olmalıdır. Çok kısa çizgiler alıcı tarafından nokta zannedilebilir.</p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '0.35rem' }}>3. Harf Boşluklarını Unutmak</strong>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Harfler arasında duraklama yapılmadığında arka arkaya gelen noktalar birleşir ve anlam tamamen bozulur.</p>
              </div>
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Mors Harflerinin Seslerini Dinlemek İster misiniz?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Tüm harflerin akustik dit-dah ritimlerini incelemek ve sesli dinleme pratiği yapmak için interaktif alfabe tablomuzu ziyaret edin.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Alfabesi Harf Tablosu <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'tr-practice', '/tr/morse-code-practice/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Mors Kodu Dinleme Pratiği
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
