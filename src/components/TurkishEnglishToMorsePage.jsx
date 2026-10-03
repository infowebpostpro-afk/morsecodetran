import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeftRight, Copy, Play, Square, X, Volume2, Sparkles, AlertCircle, Settings, Check, Command, Share2, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  translateTextToMorse,
  decodeMorseDetailed,
  encodeEnglishDetailed,
  getCharacterBreakdown,
  calculateStatistics,
  normalizeMorseInput
} from '../engine/morseEngine.js';

export function TurkishEnglishToMorsePage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
  // Mode: 'english2morse' (default primary) or 'morse2english' (swapped)
  const [mode, setMode] = useState('english2morse');

  // Input & Output States
  const [englishInput, setEnglishInput] = useState('HELLO WORLD');
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');

  // Audio Engine Local Controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Copy & Feedback State
  const [copiedType, setCopiedType] = useState(null);

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Textarea Ref for Keyboard Shortcuts
  const inputRef = useRef(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard Shortcuts (Ctrl/Cmd + K to focus, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          if (mode === 'english2morse') setEnglishInput('');
          else setMorseInput('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Sync WPM changes with global WPM handler if provided
  const handleWpmChange = (newWpm) => {
    setWpm(newWpm);
    if (setGlobalWpm) setGlobalWpm(newWpm);
  };

  // Real-Time Detailed English -> Morse Encoding
  const englishEncodingResult = useMemo(() => {
    if (mode === 'english2morse') {
      return encodeEnglishDetailed(englishInput);
    }
    return { morseText: '', unsupportedChars: [], hasUnsupported: false };
  }, [englishInput, mode]);

  // Real-Time Detailed Morse -> English Decoding
  const morseDecodingResult = useMemo(() => {
    if (mode === 'morse2english') {
      return decodeMorseDetailed(morseInput);
    }
    return { text: '', tokens: [], invalidTokens: [], hasErrors: false };
  }, [morseInput, mode]);

  // Computed Current Morse & English Values
  const currentMorseValue = mode === 'english2morse' ? englishEncodingResult.morseText : normalizeMorseInput(morseInput);
  const currentEnglishValue = mode === 'english2morse' ? englishInput : morseDecodingResult.text;

  // Character Breakdown List
  const breakdownList = useMemo(() => {
    if (!currentEnglishValue || !currentMorseValue) return [];
    return getCharacterBreakdown(currentEnglishValue, currentMorseValue);
  }, [currentEnglishValue, currentMorseValue]);

  // Metrics & Statistics
  const stats = useMemo(() => {
    return calculateStatistics(currentEnglishValue, currentMorseValue, wpm, farnsworthWpm);
  }, [currentEnglishValue, currentMorseValue, wpm, farnsworthWpm]);

  // Input Handlers
  const handleEnglishChange = (e) => {
    setEnglishInput(e.target.value);
  };

  const handleMorseChange = (e) => {
    const val = e.target.value;
    const normalized = val.replace(/[•·]/g, '.').replace(/[—–−]/g, '-');
    setMorseInput(normalized);
  };

  // Swap Direction
  const handleSwap = () => {
    if (mode === 'english2morse') {
      setMode('morse2english');
      setMorseInput(englishEncodingResult.morseText || '.... . .-.. .-.. ---');
      if (showToast) showToast('Mors → İngilizce moduna geçildi ⇄');
    } else {
      setMode('english2morse');
      setEnglishInput(morseDecodingResult.text !== '[Unknown]' ? morseDecodingResult.text : 'HELLO');
      if (showToast) showToast('İngilizce → Mors moduna geçildi ⇄');
    }
  };

  // Clear Action
  const handleClear = () => {
    setEnglishInput('');
    setMorseInput('');
    if (showToast) showToast('Giriş alanı temizlendi');
  };

  // Copy Action
  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Mors Kodu' : 'İngilizce Metin'} panoya kopyalandı ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Metin kopyalanamadı.');
    }
  };

  // Share Action
  const handleShare = () => {
    if (!currentEnglishValue) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#msg=${encodeURIComponent(currentEnglishValue)}`;
    navigator.clipboard.writeText(shareUrl);
    if (showToast) showToast('Paylaşılabilir bağlantı kopyalandı ✓');
  };

  // Preset Chips Selection
  const handleSelectPreset = (presetText) => {
    if (mode === 'english2morse') {
      setEnglishInput(presetText);
    } else {
      setMorseInput(translateTextToMorse(presetText));
    }
    if (showToast) showToast(`"${presetText}" çeviriciye yüklendi`);
  };

  // Audio Playback Controls
  const handlePlayAudio = () => {
    if (!breakdownList || breakdownList.length === 0) return;

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown: breakdownList,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveCharIndex(-1);
          return;
        }
        setActiveCharIndex(idx);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  // Single Character Sound Preview
  const handlePlayCharacterSound = (charItem) => {
    if (!charItem || charItem.isSpace || !charItem.morse) return;
    audioEngine.playSequence({
      breakdown: [charItem],
      wpm,
      frequency,
      volume
    });
  };

  const handleDownloadWav = () => {
    if (!currentMorseValue) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: currentMorseValue, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `english-to-morse-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('WAV ses dosyası indirildi ✓');
    } catch {
      if (showToast) showToast('Ses dosyası oluşturulamadı.');
    }
  };

  const faqs = [
    {
      q: "İngilizceden Mors Koduna Çeviri aracı nasıl kullanılır?",
      a: "İngilizce metninizi giriş kutusuna yazın. Araç, her harfi, rakamı ve desteklenen noktalama işaretini anında resmi Uluslararası Mors Alfabesi şablonuna çevirir. Çıkan Mors kodunu kopyalayabilir, dinleyebilir veya WAV formatında indirebilirsiniz."
    },
    {
      q: "Metin Mors koduna nasıl dönüştürülür?",
      a: "Metin girdiğinizde sistem her bir karakteri ITU-R M.1677-1 standardındaki nokta ve çizgi eşdeğeriyle değiştirir. Örneğin 'HELLO' kelimesi '.... . .-.. .-.. ---' şeklinde dönüştürülür. Kelimeler arasına ayırt edilebilirlik için '/' işareti eklenir."
    },
    {
      q: "Mors kodu kodlayıcısının (encoder) amacı nedir?",
      a: "Mors kodlayıcı, okunabilir metinleri nokta ve çizgi dizilerine dönüştürür. Bu araç; telsiz eğitimi, mors pratiği, kaçış odası ve bulmaca hazırlıkları, takı/dövme tasarımları ve amatör telsizcilik (CW) mesajlaşmaları için vazgeçilmezdir."
    },
    {
      q: "Mors kodunu sesli olarak dinleyebilir miyim?",
      a: "Evet. Dahili ses motoru noktaları (dit) kısa sinyal, çizgileri (dah) ise 3 kat uzun sinyal olarak çalar. Hız (WPM), ton frekansı (Hz) ve Farnsworth boşluk aralıklarını kişisel çalışma seviyenize göre ayarlayabilirsiniz."
    },
    {
      q: "Mors alfabesinde boşluklar nasıl çalışır?",
      a: "Yazılı Mors kodunda harfler arasında standart olarak bir boşluk bırakılır. Kelimeleri birbirinden ayırmak için ise eğik çizgi ('/') kullanılır. Örneğin 'HELLO WORLD' ifadesi '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' şeklinde yazılır."
    },
    {
      q: "Mors kodunda rakamlar ve özel semboller nasıl gösterilir?",
      a: "Uluslararası Mors Alfabesinde 0'dan 9'a kadar olan tüm rakamlar tam 5 sinyal uzunluğundadır (örn: 1 = .----, 5 = ....., 0 = -----). Ayrıca nokta (.-.-.-), virgül (--..--), soru işareti (..--..) gibi standart noktalama işaretleri de desteklenir."
    },
    {
      q: "Çevirimin doğru olduğunu nasıl teyit edebilirim?",
      a: "En güvenilir yöntem çift yönlü teyittir (round-trip check). Oluşturduğunuz Mors kodunu kopyalayıp Mors → İngilizce modunda yeniden çözdürerek orijinal metinle tam uyuştuğunu doğrulayabilirsiniz."
    },
    {
      q: "Amerikan Mors Alfabesi ile Uluslararası Mors Alfabesi arasındaki fark nedir?",
      a: "Samuel Morse'un 1840'larda demiryolu telgrafı için tasarladığı Amerikan Mors Alfabesi farklı uzunlukta çizgiler ve harf içi duraklamalar içeriyordu. Günümüzde radyo ve internette kullanılan standart ise Friedrich Gerke tarafından revize edilen ve ITU tarafından standartlaştırılan Uluslararası Mors Alfabesidir."
    },
    {
      q: "Farnsworth zamanlaması ne işe yarar?",
      a: "Farnsworth yöntemi, harflerin çalınma hızını yüksek tutarken (örneğin 20 WPM), harfler arasındaki bekleme boşluklarını genişletir. Bu sayede yeni başlayanlar noktaları tek tek saymak yerine harfin karakteristik ritmini bir bütün olarak işitmeyi öğrenir."
    }
  ];

  return (
    <div className="english-to-morse-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>İngilizceden Mors Koduna Çeviri</li>
        </ol>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="standard-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <ShieldCheck size={14} className="text-primary" />
          <span>Uluslararası Standart ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          İngilizceden Mors Koduna Çeviri Aracı
        </h1>
        <p className="alphabet-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          İngilizce mesajları, kelimeleri ve metinleri anında standart Uluslararası Mors koduna dönüştürün. Mors ritmini sesli dinleyin, WPM hızını ayarlayın ve ses dosyası olarak indirin.
        </p>
      </section>

      {/* MAIN CONVERTER SAAS TOOL CARD */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="tool-card" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
          
          {/* HEADER ROW */}
          <div className="tool-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary-light)', display: 'flex' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  {mode === 'english2morse' ? 'İngilizce → Mors Kodu Oluşturucu' : 'Mors Kodu → İngilizce Çözücü'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Gerçek zamanlı tarayıcı tabanlı dönüşüm (Kelime ayracı: <code>/</code>)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary-action"
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                title="Ses ve Hız Seçenekleri"
                style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              >
                <Settings size={14} /> Ses Seçenekleri ({wpm} WPM)
              </button>

              <span style={{ fontSize: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Command size={12} /> + K
              </span>
            </div>
          </div>

          {/* COLLAPSIBLE AUDIO CONTROLS */}
          {showAudioSettings && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Hız: <strong>{wpm} WPM</strong>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={wpm}
                    onChange={(e) => handleWpmChange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Farnsworth Hızı: <strong>{farnsworthWpm} WPM</strong>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={farnsworthWpm}
                    onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Harfler arası ekstra zaman boşluğu</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Ses Frekansı: <strong>{frequency} Hz</strong>
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="1000"
                    step="50"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Ses Seviyesi: <strong>{Math.round(volume * 100)}%</strong>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                </div>

              </div>
            </div>
          )}

          {/* EXAMPLE PRESET CHIPS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Örnekler:</span>
            {['HELLO WORLD', 'SOS', 'I LOVE YOU', 'THANK YOU', 'GOOD MORNING'].map((exText) => (
              <button
                key={exText}
                className="btn-secondary-action"
                onClick={() => handleSelectPreset(exText)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              >
                {exText}
              </button>
            ))}
          </div>

          {/* MAIN CONVERTER GRID */}
          <div className="tool-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>

            {/* INPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label htmlFor="english-tool-input" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {mode === 'english2morse' ? 'Giriş: İngilizce Metin' : 'Giriş: Mors Kodu'}
                </label>

                {((mode === 'english2morse' && englishInput) || (mode === 'morse2english' && morseInput)) && (
                  <button
                    className="search-clear-btn"
                    onClick={() => { setEnglishInput(''); setMorseInput(''); }}
                    title="Temizle"
                    aria-label="Girişi Temizle"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <X size={14} /> Temizle
                  </button>
                )}
              </div>

              {mode === 'english2morse' ? (
                <textarea
                  id="english-tool-input"
                  ref={inputRef}
                  value={englishInput}
                  onChange={handleEnglishChange}
                  placeholder="İngilizce metin yazın... (örn: HELLO WORLD)"
                  rows={6}
                  style={{ width: '100%', resize: 'vertical', fontSize: '1.15rem', fontFamily: 'var(--font-sans)', minHeight: '140px', flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', boxSizing: 'border-box' }}
                  aria-label="İngilizce Metin Giriş Alanı"
                />
              ) : (
                <textarea
                  id="english-tool-input"
                  ref={inputRef}
                  value={morseInput}
                  onChange={handleMorseChange}
                  placeholder="Mors kodu yazın... (örn: .... . .-.. .-.. --- / .-- --- .-. .-.. -..)"
                  rows={6}
                  className="morse-font"
                  style={{ width: '100%', resize: 'vertical', fontSize: '1.2rem', minHeight: '140px', flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--primary)', boxSizing: 'border-box' }}
                  aria-label="Mors Kodu Giriş Alanı"
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{mode === 'english2morse' ? 'A-Z harfleri, 0-9 rakamları ve standart noktalama işaretleri' : 'Harfler arası boşluk, kelimeler arası /'}</span>
                <span>{mode === 'english2morse' ? `${englishInput.length} karakter` : `${morseInput.length} sembol`}</span>
              </div>
            </div>

            {/* CENTER SWAP BUTTON */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0' }}>
              <button
                className="btn-seq-cta"
                onClick={handleSwap}
                title="Çeviri Yönünü Değiştir"
                aria-label="Çeviri Yönünü Değiştir"
                style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* OUTPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {mode === 'english2morse' ? 'Çıktı: Mors Kodu' : 'Çıktı: Çözümlenen İngilizce Metin'}
                </label>
                <span className="standard-badge" style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  Anlık Çeviri
                </span>
              </div>

              {/* DISPLAY BOX WITH ARIA-LIVE */}
              <div
                aria-live="polite"
                className={`output-display-box ${mode === 'english2morse' ? 'morse-font' : ''}`}
                style={{
                  minHeight: '140px',
                  flex: 1,
                  padding: '1rem',
                  background: 'var(--surface-elevated)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: mode === 'english2morse' ? '1.35rem' : '1.25rem',
                  fontWeight: 700,
                  color: mode === 'english2morse' ? 'var(--signal-bright)' : 'var(--text)',
                  wordBreak: 'break-word',
                  lineHeight: 1.6
                }}
              >
                {mode === 'english2morse' ? (
                  englishEncodingResult.morseText ? englishEncodingResult.morseText : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Mors kodu çıktısı burada görünecektir...</span>
                ) : (
                  morseDecodingResult.text ? morseDecodingResult.text : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Çözümlenen İngilizce metin burada görünecektir...</span>
                )}
              </div>

              {/* ACTION BUTTONS BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {isPlaying ? (
                    <button className="btn-seq-cta playing" onClick={handleStopAudio} aria-label="Mors Sesini Durdur" style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Square size={14} /> Durdur
                    </button>
                  ) : (
                    <button className="btn-seq-cta" onClick={handlePlayAudio} aria-label="Mors Kodunu Sesli Çal" style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Play size={14} fill="currentColor" /> Sesi Dinle
                    </button>
                  )}

                  {mode === 'english2morse' ? (
                    <button
                      className="btn-secondary-action"
                      onClick={() => handleCopy(englishEncodingResult.morseText, 'morse')}
                      aria-label="Mors Kodunu Kopyala"
                      style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                    >
                      {copiedType === 'morse' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                      {copiedType === 'morse' ? 'Kopyalandı ✓' : 'Kopyala'}
                    </button>
                  ) : (
                    <button
                      className="btn-secondary-action"
                      onClick={() => handleCopy(morseDecodingResult.text, 'english')}
                      aria-label="İngilizce Metni Kopyala"
                      style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                    >
                      {copiedType === 'english' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                      {copiedType === 'english' ? 'Kopyalandı ✓' : 'Kopyala'}
                    </button>
                  )}

                  <button
                    className="btn-secondary-action"
                    onClick={handleDownloadWav}
                    aria-label="WAV İndir"
                    style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                  >
                    <Download size={13} /> WAV
                  </button>

                  <button
                    className="btn-secondary-action"
                    onClick={handleShare}
                    aria-label="Sonucu Paylaş"
                    style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                  >
                    <Share2 size={13} /> Paylaş
                  </button>
                </div>

                <button
                  className="search-clear-btn"
                  onClick={handleClear}
                  aria-label="Tümünü Temizle"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  <X size={14} /> Temizle
                </button>
              </div>

            </div>

          </div>

          {/* UNSUPPORTED CHARACTER BANNER */}
          {mode === 'english2morse' && englishEncodingResult.hasUnsupported && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Desteklenmeyen karakter tespit edildi:</strong>{' '}
                {englishEncodingResult.unsupportedChars.map(c => `'${c}'`).join(', ')}.
                Standart dışı semboller Mors kodunda <code>?</code> ile gösterilir.
              </div>
            </div>
          )}

          {/* CHARACTER BREAKDOWN & STATISTICS METRICS */}
          {breakdownList.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  Karakter Analizi ve Sinyal İstatistikleri
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <span>Karakter: <strong>{stats.characterCount}</strong></span>
                  <span>Kelime: <strong>{stats.wordCount}</strong></span>
                  <span>Mors Sinyali: <strong>{stats.dotsCount + stats.dashesCount}</strong> ({stats.dotsCount} nokta, {stats.dashesCount} çizgi)</span>
                </div>
              </div>

              <div className="breakdown-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {breakdownList.map((item, idx) => {
                  if (item.isSpace) {
                    return (
                      <div
                        key={idx}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px dashed var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontStyle: 'italic',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        [Boşluk → /]
                      </div>
                    );
                  }

                  const isActiveChar = activeCharIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlayCharacterSound(item)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: isActiveChar ? 'var(--primary-glow)' : 'var(--surface)',
                        border: isActiveChar ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease'
                      }}
                      title={`${item.char} sesini dinlemek için tıklayın`}
                    >
                      <strong style={{ fontSize: '0.95rem', color: 'var(--primary-light)' }}>{item.char}</strong>
                      <code className="morse-font" style={{ fontSize: '0.85rem', color: 'var(--signal-bright)' }}>{item.morse}</code>
                      <Volume2 size={12} style={{ opacity: 0.6 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* EDUCATIONAL ARTICLE CONTAINER */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* QUICK ANSWER */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Hızlı Cevap: İngilizceden Mors Koduna Çeviri</h2>
            <p>
              <strong>İngilizceden Mors Koduna Çeviri</strong>, İngiliz alfabesindeki harflerin (A–Z), rakamların (0–9) ve standart noktalama işaretlerinin <strong>Uluslararası Mors Alfabesi</strong> (International Morse Code) kurallarına göre nokta ve çizgilere dönüştürülmesidir.
            </p>
            <p>
              Her bir karakter sabit bir nokta (<code>.</code>) ve çizgi (<code>-</code>) kombinasyonuna sahiptir. Örneğin <strong>HELLO</strong> kelimesi Mors kodunda <code className="morse-font">.... . .-.. .-.. ---</code> olur.
            </p>
            <p>
              Yazılı Mors alfabesinde harfleri birbirinden ayırmak için tek boşluk kullanılırken, kelimeleri ayırmak için eğik çizgi (<code>/</code>) konulur: <strong>HELLO WORLD</strong> metni Mors kodunda <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> olarak yazılır.
            </p>
          </section>

          {/* HOW TO CONVERT ENGLISH TO MORSE CODE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>İngilizce Metinleri Mors Koduna Dönüştürme Adımları</h2>
            <p>
              İngilizce bir ifadeyi Mors koduna dönüştürmenin iki temel yolu vardır: Mors alfabesi tablosundan harfleri tek tek bulmak veya yukarıdaki gerçek zamanlı çevirici aracımızı kullanmak.
            </p>
            <p>Temel dönüştürme döngüsü şu sırayı takip eder: <strong>İngilizce Metin → Harf Ayrıştırma → Mors Eşleştirmesi → Tam Mesaj</strong>.</p>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Çözümlü Örnek: CAT (Kedi)</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                1. Harfleri ayırın: <code>C - A - T</code>.<br />
                2. Her harfin kodunu bulun:<br />
                • C → <code>-.-.</code> (dah-di-dah-dit)<br />
                • A → <code>.-</code> (di-dah)<br />
                • T → <code>-</code> (dah)<br />
                3. Harfleri aralarına boşluk koyarak birleştirin: <code className="morse-font" style={{ fontWeight: 800, color: 'var(--signal-bright)' }}>-.-. .- -</code>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.4rem' }}>GOOD MORNING (Günaydın)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  G (<code>--.</code>) O (<code>---</code>) O (<code>---</code>) D (<code>-..</code>)<br />
                  Sonuç: <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>--. --- --- -.. / -- --- .-. -. .. -. --.</code>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>I LOVE YOU (Seni Seviyorum)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Kelime sınırları eğik çizgiyle (<code>/</code>) ayrılır.<br />
                  Sonuç: <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>.. / .-.. --- ...- . / -.-- --- ..-</code>
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Alfabesinin Çalışma Mantığı</h2>
            <p>
              Uluslararası Mors Alfabesi, ITU-R M.1677-1 tavsiyesine dayalı sabit bir harf eşleştirme standardı uygular. Alfabede en sık kullanılan harflere en kısa sinyaller atanmıştır:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>İngilizce Karakter</th>
                    <th style={{ padding: '0.75rem' }}>Mors Kodu Şablonu</th>
                    <th style={{ padding: '0.75rem' }}>Sözlü Ritim (Dit/Dah)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>A</td><td style={{ padding: '0.75rem' }}><code className="morse-font">.-</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>B</td><td style={{ padding: '0.75rem' }}><code className="morse-font">-...</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>C</td><td style={{ padding: '0.75rem' }}><code className="morse-font">-.-.</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>D</td><td style={{ padding: '0.75rem' }}><code className="morse-font">-..</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>E</td><td style={{ padding: '0.75rem' }}><code className="morse-font">.</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>H</td><td style={{ padding: '0.75rem' }}><code className="morse-font">....</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>O</td><td style={{ padding: '0.75rem' }}><code className="morse-font">---</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-dah-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>S</td><td style={{ padding: '0.75rem' }}><code className="morse-font">...</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>T</td><td style={{ padding: '0.75rem' }}><code className="morse-font">-</code></td><td style={{ padding: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1.25rem' }}>
              <strong>Çözümlü Örnek: HELP (Yardım)</strong><br />
              H (<code>....</code>) + E (<code>.</code>) + L (<code>.-..</code>) + P (<code>.--.</code>) = <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>.... . .-.. .--.</code>
            </div>
          </section>

          {/* COMMON EXAMPLES TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Sık Kullanılan İngilizce Mors İfadeleri</h2>
            <p>Aşağıdaki tabloda günlük konuşmada, acil durumlarda ve telsiz haberleşmelerinde en çok kullanılan Mors kalıplarını bulabilirsiniz:</p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>İngilizce İfade</th>
                    <th style={{ padding: '0.75rem' }}>Mors Kodu Çıktısı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>E</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>T</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>A</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>H</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>....</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>SOS</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>... --- ...</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>HELLO</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. ---</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>HELP</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .--.</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>THANK YOU</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>- .... .- -. -.- / -.-- --- ..-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>I LOVE YOU</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.. / .-.. --- ...- . / -.-- --- ..-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>HELLO WORLD</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code></td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              26 harfin tamamını ve seslerini incelemek için <a href="/tr/morse-code-alphabet/" onClick={(e) => handleNav(e, 'tr-alphabet', '/tr/morse-code-alphabet/')} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Mors Alfabesi Rehberi</a> sayfamızı ziyaret edin.
            </p>
          </section>

          {/* TIMING STANDARDS TABLE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodu Zamanlama Oranları ve Rakamlar</h2>
            <p>
              Mors kodunda hız sadece harflerin çalınmasıyla değil, aralarındaki sessizlik boşluklarıyla belirlenir. ITU-R standartlarına göre resmi zamanlama oranları şöyledir:
            </p>
            
            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Sinyal veya Boşluk Öğesi</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Standart Süre Oranı</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Nokta (dit)</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Çizgi (dah)</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim (3 × dit)</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harf içi öğeler arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harfler arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Kelimeler arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>7 birim</strong></td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem' }}>
              Örneğin <strong>2026</strong> yılını Mors koduna çevirmek isterseniz: 2 (<code className="morse-font">..---</code>), 0 (<code className="morse-font">-----</code>), 2 (<code className="morse-font">..---</code>), 6 (<code className="morse-font">-....</code>) şeklinde kodlanır. Tüm rakamların tam dökümü için <a href="/tr/morse-code-numbers/" onClick={(e) => handleNav(e, 'tr-numbers', '/tr/morse-code-numbers/')} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Mors Kodu Rakamları</a> sayfasını inceleyebilirsiniz.
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

          {/* EDITORIAL NOTE & CTA */}
          <section className="content-section cta-banner" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Ters Yönlü Çeviri veya Türkçe Mors Kodu mu Lazım?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Elinizdeki Mors kodunu İngilizceye çözmek için Mors → İngilizce aracımızı kullanabilir, Türkçe özel harfleri (Ç, Ğ, İ, Ö, Ş, Ü) içeren metinler için ise Türkçe Mors Kodu çeviricimizi açabilirsiniz.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn-primary-cta"
                onClick={(e) => handleNav(e, 'tr-morse2english', '/tr/morse-code-to-english/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                Mors Kodundan İngilizceye Çeviri <ArrowRight size={16} />
              </button>
              <button
                className="btn-secondary-action"
                onClick={(e) => handleNav(e, 'turkish', '/tr/')}
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
              >
                Türkçe Mors Ana Sayfası
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
