import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Settings, Command, X, Play, Square, Copy, Check, Share2, AlertTriangle, Info, Volume2, ShieldCheck, ArrowRight, ChevronUp, ChevronDown, Download
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  decodeMorseDetailed,
  normalizeMorseInput,
  calculateStatistics,
  detectInputType
} from '../engine/morseEngine.js';

export function TurkishDecoderPage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
  // Primary Input State (Morse Code)
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');

  // Synchronized Highlighting State
  const [activeTokenIdx, setActiveTokenIdx] = useState(null);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState(null);

  // Audio Engine Local Controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTokenIdx, setPlaybackTokenIdx] = useState(-1);

  // Feedback & Accordion State
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Textarea Ref for Keyboard Focus
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
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key === 'Enter')) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (showToast) showToast('Mors Çözücü giriş alanına odaklanıldı');
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          setMorseInput('');
          if (showToast) showToast('Giriş temizlendi');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  const handleWpmChange = (newWpm) => {
    setWpm(newWpm);
    if (setGlobalWpm) setGlobalWpm(newWpm);
  };

  const normalizedInput = useMemo(() => {
    return normalizeMorseInput(morseInput);
  }, [morseInput]);

  const decodingResult = useMemo(() => {
    return decodeMorseDetailed(morseInput);
  }, [morseInput]);

  const isNonMorseInput = useMemo(() => {
    if (!morseInput.trim()) return false;
    return detectInputType(morseInput) === 'text' && /[a-zA-Z0-9]/.test(morseInput);
  }, [morseInput]);

  const isAmbiguousSpacing = useMemo(() => {
    if (!normalizedInput.trim()) return false;
    return /[.-]{8,}/.test(normalizedInput);
  }, [normalizedInput]);

  const stats = useMemo(() => {
    const calc = calculateStatistics(decodingResult.text, normalizedInput, wpm, farnsworthWpm);
    return {
      ...calc,
      unknownCount: decodingResult.invalidTokens.length
    };
  }, [decodingResult, normalizedInput, wpm, farnsworthWpm]);

  const handleMorseInputChange = (e) => {
    const val = e.target.value;
    const normalizedVal = val.replace(/[•·]/g, '.').replace(/[—–−]/g, '-');
    setMorseInput(normalizedVal);
  };

  const handleClear = () => {
    setMorseInput('');
    setActiveTokenIdx(null);
    setHoveredTokenIdx(null);
    if (showToast) showToast('Giriş temizlendi');
  };

  const handlePresetSelect = (presetMorse, label) => {
    setMorseInput(presetMorse);
    setActiveTokenIdx(null);
    setHoveredTokenIdx(null);
    if (showToast) showToast(`"${label}" örneği yüklendi`);
  };

  const handleCopyText = async () => {
    if (!decodingResult.text) return;
    try {
      await navigator.clipboard.writeText(decodingResult.text);
      setCopiedSuccess(true);
      if (showToast) showToast('Çözümlenen metin panoya kopyalandı ✓');
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch {
      if (showToast) showToast('Kopyalama başarısız oldu.');
    }
  };

  const handleShareUrl = () => {
    if (!morseInput) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#morse=${encodeURIComponent(morseInput)}`;
    navigator.clipboard.writeText(shareUrl);
    if (showToast) showToast('Paylaşılabilir bağlantı kopyalandı ✓');
  };

  const handlePlayAudio = () => {
    if (!decodingResult.tokens || decodingResult.tokens.length === 0) return;

    const breakdownForAudio = decodingResult.tokens.map((t, idx) => ({
      char: t.char,
      morse: t.code,
      isSpace: t.isSpace,
      originalIndex: idx
    }));

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown: breakdownForAudio,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setPlaybackTokenIdx(-1);
          return;
        }
        setPlaybackTokenIdx(activeCharIndex);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setPlaybackTokenIdx(-1);
  };

  const handlePlaySingleCharSound = (token) => {
    if (!token || token.isSpace || !token.code) return;
    audioEngine.playSequence({
      breakdown: [{ char: token.char, morse: token.code, isSpace: false }],
      wpm,
      frequency,
      volume
    });
  };

  const handleDownloadWav = () => {
    if (!normalizedInput) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: normalizedInput, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `decoded-morse-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('WAV ses dosyası indirildi ✓');
    } catch {
      if (showToast) showToast('Ses dosyası oluşturulamadı.');
    }
  };

  const faqs = [
    {
      q: "Mors Kodu Çözücü (Decoder) nedir?",
      a: "Mors Kodu Çözücü, nokta (dit) ve çizgilerden (dah) oluşan sinyal dizilerini anında insan tarafından okunabilir harflere, rakamlara ve noktalama işaretlerine dönüştüren araçtır."
    },
    {
      q: "Mors kodunu metne nasıl dönüştürürüm?",
      a: "Her Mors harfinin arasına bir boşluk, kelimeler arasına ise '/' koyarak giriş alanına yapıştırın. Çözücü her kodu Uluslararası Mors Alfabesi tablosuyla eşleştirip kelimeleri oluşturur. Örneğin '.... . .-.. .-.. ---' ifadesi 'HELLO' olarak çözülür."
    },
    {
      q: "Mors kodum neden yanlış çözülüyor?",
      a: "En yaygın sebep harf boşluklarının unutulmasıdır. Bitişik yazılan noktalar farklı harfler gibi algılanır. Ayrıca eksik nokta, fazla çizgi, desteklenmeyen karakterler veya ekran görüntüsünden kopyalanan hatalı tire sembolleri (— yerine - kullanılmalı) çözümü bozar."
    },
    {
      q: "Mors harfleri arasında boşluk bırakmak zorunlu mudur?",
      a: "Evet. Yazılı Mors kodunda boşluk bırakılmazsa bir harfin nerede bitip diğerinin nerede başladığı anlaşılamaz ve tek bir dizi onlarca farklı kelimeye karşılık gelebilir."
    },
    {
      q: "Kelimeler arasında hangi sembol kullanılmalıdır?",
      a: "Yazılı Mors alfabesinde kelime sınırını belirtmek için eğik çizgi ('/') kullanılır. Örneğin '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' ifadesi 'HELLO WORLD' anlamına gelir."
    },
    {
      q: "Mors çözücü rakamları ve noktalama işaretlerini tanır mı?",
      a: "Evet. ITU-R standardındaki tüm 0–9 rakamları (5 birimli kodlar) ile nokta (.-.-.-), virgül (--..--), soru işareti (..--..) gibi yaygın noktalama işaretleri eksiksiz çözülür."
    },
    {
      q: "Çözümlenen mesajın doğruluğunu nasıl teyit edebilirim?",
      a: "Üç adım izleyin: 1) Harf boşluklarının doğru olduğundan emin olun. 2) Bilinmeyen karakter uyarısı olup olmadığını kontrol edin. 3) Çıkan metni İngilizce → Mors çeviricisine yapıştırıp orijinal kod ile eşleştiğini karşılaştırın (çift yönlü teyit)."
    },
    {
      q: "Boşluksuz Mors kodu çözülebilir mi?",
      a: "Yalnızca '...---...' gibi dünyaca bilinen standart kalıplar (SOS) doğrudan çözülebilir. Rastgele bir metinde boşluklar yoksa onlarca farklı alternatif ortaya çıkar ve kesin sonuç verilemez."
    },
    {
      q: "Uluslararası Mors Alfabesi ile Amerikan Mors Alfabesi aynı mıdır?",
      a: "Hayır. Amerikan Mors Alfabesi 1840'larda demiryolu telgrafı için tasarlanmıştı ve farklı uzunluklarda çizgiler içeriyordu. Günümüzde internette, amatör telsizde ve denizcilikte kullanılan küresel standart Uluslararası Mors Alfabesidir (ITU-R M.1677-1)."
    },
    {
      q: "Ses kaydından Mors kodu çözülebilir mi?",
      a: "Evet; ancak ses çözümlemesi için sinyallerin milisaniye cinsinden süreleri ve aralarındaki sessizlik aralıkları analiz edilir. Bunun için 'Mors Kodu Sesli Çeviri' sayfamızı kullanabilirsiniz."
    },
    {
      q: "Girdimde '?' veya bilinmeyen karakter çıkarsa ne yapmalıyım?",
      a: "Rastgele tahmin yapmak yerine orijinal kaynağı kontrol edin. Muhtemelen bir harf aralığı unutulmuş, fazladan bir nokta konulmuş ya da klavyeden standart dışı bir sembol girilmiştir."
    },
    {
      q: "Mors kodu kendi başına bir dil midir?",
      a: "Hayır. Mors kodu harfleri ve sayıları temsil eden bir aktarım protokolüdür. Kendine ait grameri veya kelime dağarcığı yoktur; mevcut dillerdeki (Türkçe, İngilizce vb.) metinleri sinyale döker."
    },
    {
      q: "Çözücünün verdiği sonucun kesin doğru olduğunu nasıl anlarım?",
      a: "Sonucun sadece mantıklı bir kelime oluşturmasına bakmayın. Karakter analiz tablosundaki her simgeyi kontrol edin ve çift yönlü teyit işlemi uygulayın."
    }
  ];

  return (
    <div className="morse-decoder-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: '0.5rem', color: 'var(--text-muted)' }}>
          <li><a href="/tr/" onClick={(e) => handleNav(e, 'turkish', '/tr/')} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Ana Sayfa</a></li>
          <li>/</li>
          <li style={{ color: 'var(--text)' }}>Mors Kodu Çözücü</li>
        </ol>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="standard-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-card)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          <ShieldCheck size={14} className="text-primary" />
          <span>Uluslararası Standart ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Mors Kodu Çözücü: Nokta ve Çizgileri Metne Dönüştürün
        </h1>
        <p className="alphabet-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Nokta ve çizgilerle yazılmış Mors kodlarını anında okunabilir metne dönüştürün. Hatalı dizilimleri otomatik tespit edin, harf dökümünü inceleyin ve sesli dinleyin.
        </p>
      </section>

      {/* MAIN DECODER TOOL CARD */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="tool-card" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
          
          {/* TOOL HEADER ROW */}
          <div className="tool-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary-light)', display: 'flex' }}>
                <Sparkles size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  Etkileşimli Mors Kodu Çözücü
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Gerçek zamanlı çözümleme (Boşluk = harf ayracı, <code>/</code> = kelime ayracı)
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

          {/* AUDIO CONTROLS PANEL */}
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
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Frekans: <strong>{frequency} Hz</strong>
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

          {/* PRESET CHIPS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Örnekler:</span>
            {[
              { label: 'HELLO WORLD', code: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' },
              { label: 'SOS', code: '... --- ...' },
              { label: 'MORSE CODE', code: '-- --- .-. ... . / -.-. --- -.. .' },
              { label: 'PARIS 50', code: '.--. .- .-. .. ... / ..... -----' }
            ].map((preset) => (
              <button
                key={preset.label}
                className="btn-secondary-action"
                onClick={() => handlePresetSelect(preset.code, preset.label)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* IO GRID */}
          <div className="tool-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            
            {/* INPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label htmlFor="morse-decoder-input" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Giriş: Mors Kodu (. ve -)
                </label>
                {morseInput && (
                  <button
                    onClick={handleClear}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <X size={14} /> Temizle
                  </button>
                )}
              </div>

              <textarea
                id="morse-decoder-input"
                ref={inputRef}
                value={morseInput}
                onChange={handleMorseInputChange}
                placeholder="Mors kodunu buraya yapıştırın... (örn: .... . .-.. .-.. ---)"
                rows={6}
                className="morse-font"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.2rem', minHeight: '140px', flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--primary)', boxSizing: 'border-box' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Harfler arası boşluk, kelimeler arası <code>/</code></span>
                <span>{morseInput.length} simge</span>
              </div>
            </div>

            {/* OUTPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Çıktı: Çözümlenen Metin
                </label>
                <span className="standard-badge" style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  Anlık Sonuç
                </span>
              </div>

              <div
                className="output-display-box"
                style={{
                  minHeight: '140px',
                  flex: 1,
                  padding: '1rem',
                  background: 'var(--surface-elevated)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text)',
                  wordBreak: 'break-word',
                  lineHeight: 1.6
                }}
              >
                {decodingResult.text ? decodingResult.text : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Çözümlenen metin burada görüntülenecektir...</span>}
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {!isPlaying ? (
                    <button className="btn-seq-cta" onClick={handlePlayAudio} style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Play size={14} fill="currentColor" /> Sesi Dinle
                    </button>
                  ) : (
                    <button className="btn-seq-cta playing" onClick={handleStopAudio} style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--danger)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      <Square size={14} /> Durdur
                    </button>
                  )}

                  <button
                    className="btn-secondary-action"
                    onClick={handleCopyText}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                  >
                    {copiedSuccess ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                    {copiedSuccess ? 'Kopyalandı ✓' : 'Kopyala'}
                  </button>

                  <button
                    className="btn-secondary-action"
                    onClick={handleDownloadWav}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                  >
                    <Download size={13} /> WAV
                  </button>

                  <button
                    className="btn-secondary-action"
                    onClick={handleShareUrl}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-sm)', background: 'var(--surface-elevated)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
                  >
                    <Share2 size={13} /> Paylaş
                  </button>
                </div>

                <button
                  className="search-clear-btn"
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  <X size={14} /> Temizle
                </button>
              </div>

            </div>

          </div>

          {/* WARNING BANNERS */}
          {isNonMorseInput && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Info size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Düz metin tespit edildi:</strong> Bu araç Mors kodunu metne çözer. Metni Mors koduna çevirmek istiyorsanız <a href="/tr/english-to-morse-code/" onClick={(e) => handleNav(e, 'tr-english2morse', '/tr/english-to-morse-code/')} style={{ color: 'var(--primary)', fontWeight: 700 }}>İngilizceden Mors Koduna Çeviri</a> sayfasını kullanabilirsiniz.
              </div>
            </div>
          )}

          {isAmbiguousSpacing && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Belirsiz Boşluk Uyarısı:</strong> Girdinizde boşluksuz art arda gelen çok sayıda nokta ve çizgi bulundu. Doğru bir çözümleme için lütfen harfler arasına boşluk ekleyin.
              </div>
            </div>
          )}

          {decodingResult.hasErrors && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Bilinmeyen Mors Karakterleri:</strong> Bazı semboller ITU tablosunda bulunamadı:{' '}
                {decodingResult.invalidTokens.map((tok, i) => (
                  <code key={i} className="morse-font" style={{ color: 'var(--danger)', fontWeight: 700, marginRight: '0.35rem' }}>{tok}</code>
                ))}
              </div>
            </div>
          )}

          {/* CHARACTER BREAKDOWN GRID */}
          {decodingResult.tokens.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  Karakter Ayrıştırma ve Doğrulama
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                  <span>Karakter: <strong>{stats.characterCount}</strong></span>
                  <span>Kelime: <strong>{stats.wordCount}</strong></span>
                  <span>Mors Sinyali: <strong>{stats.dotsCount + stats.dashesCount}</strong></span>
                  {stats.unknownCount > 0 && (
                    <span style={{ color: 'var(--danger)' }}>Geçersiz: <strong>{stats.unknownCount}</strong></span>
                  )}
                </div>
              </div>

              <div className="breakdown-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {decodingResult.tokens.map((token, idx) => {
                  if (token.isSpace) {
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
                        [/ → Kelime Boşluğu]
                      </div>
                    );
                  }

                  const isTileHighlighted = activeTokenIdx === idx || hoveredTokenIdx === idx || playbackTokenIdx === idx;

                  return (
                    <div
                      key={idx}
                      onClick={() => handlePlaySingleCharSound(token)}
                      onMouseEnter={() => setHoveredTokenIdx(idx)}
                      onMouseLeave={() => setHoveredTokenIdx(null)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        background: isTileHighlighted ? 'var(--primary-glow)' : 'var(--surface)',
                        border: isTileHighlighted ? '1px solid var(--primary)' : '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease'
                      }}
                      title={`${token.code} (${token.char}) dinlemek için tıklayın`}
                    >
                      <code className="morse-font" style={{ fontSize: '0.9rem', color: token.isInvalid ? 'var(--danger)' : 'var(--signal-bright)', fontWeight: 800 }}>{token.code}</code>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>→</span>
                      <strong style={{ fontSize: '1rem', color: token.isInvalid ? 'var(--danger)' : 'var(--text)' }}>{token.char}</strong>
                      {!token.isInvalid && <Volume2 size={12} style={{ opacity: 0.6 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} className="text-success" /> Tarayıcıda Yerel Güvenlik — Mors kodlarınız hiçbir sunucuya iletilmeden doğrudan cihazınızda çözülür.
            </span>
            <span>ITU-R M.1677-1 Standardına Uygun</span>
          </div>

        </div>
      </section>

      {/* EDUCATIONAL ARTICLE CONTAINER */}
      <article className="seo-article-container" style={{ maxWidth: '900px', margin: '0 auto', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
        <div className="article-body-content">

          {/* DECODE MORSE CODE TO TEXT */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodunu Metne Çözümleme</h2>
            <p>
              Mors kodu çözücü, nokta ve çizgilerden oluşan şifreli dizilimleri okunabilir insan diline çevirir. Örneğin <code className="morse-font">.... . .-.. .-.. ---</code> dizilimi <strong>HELLO</strong> olarak çözülür.
            </p>
            <p>
              Birden fazla kelime içeren mesajlarda yazılı kelime ayracı olarak <code>/</code> kullanılır: <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> ifadesi <strong>HELLO WORLD</strong> metnine karşılık gelir.
            </p>
            <p>
              Çözücü her bir Mors karakterini resmi Uluslararası Mors Alfabesi (ITU-R M.1677-1 tavsiyesi) tablosundaki harf, rakam veya noktalama işaretiyle eşleştirir.
            </p>
          </section>

          {/* HOW TO USE */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodu Çözücü Nasıl Kullanılır?</h2>
            <ol className="content-list" style={{ lineHeight: 1.8, paddingLeft: '1.5rem' }}>
              <li>Mors kodunu üstteki giriş kutusuna yazın veya yapıştırın.</li>
              <li>Noktalar için <code>.</code>, çizgiler için <code>-</code> kullanın.</li>
              <li>Harfler arasına tek bir boşluk bırakın.</li>
              <li>Kelimeler arasına <code>/</code> veya 3 boşluk koyun.</li>
              <li>Çözümlenen metni inceleyin ve gerekiyorsa ses butonuna basarak dinleyin.</li>
              <li>Beklenmeyen bir sonuç varsa harf boşluklarını kontrol edin.</li>
            </ol>
          </section>

          {/* HOW IT WORKS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodunun Çözülme Aşamaları</h2>
            <p>Temel çözümleme algoritması şu üç adımı takip eder:</p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginTop: '1.25rem', marginBottom: '0.4rem' }}>1. Şablonu Okuma</h3>
            <p>Her bir gruptaki nokta ve çizgi sayısını tespit eder (örn. <code className="morse-font">.-</code> = A, <code className="morse-font">-...</code> = B, <code className="morse-font">...</code> = S).</p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginTop: '1.25rem', marginBottom: '0.4rem' }}>2. Karakterle Eşleştirme</h3>
            <p>Elde edilen şablonu Uluslararası Mors Alfabesi arama tablosunda sorgular.</p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', marginTop: '1.25rem', marginBottom: '0.4rem' }}>3. Mesajı İnşa Etme</h3>
            <p>Eşleşen tüm harfleri sırasıyla birleştirerek kelimeleri ve tam cümleyi oluşturur.</p>
          </section>

          {/* TIMING STANDARDS */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Mors Kodunda Zamanlama ve Boşlukların Önemi</h2>
            <p>
              Boşluklar, Mors çözücünün doğru sonuç vermesindeki en belirleyici etkendir. ITU standartlarına göre zamanlama oranları:
            </p>

            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Öğe</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Standart Süre</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Nokta (dit)</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Çizgi (dah)</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harf içi elemanlar arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>1 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Harfler arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>3 birim</strong></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}>Kelimeler arası boşluk</td><td style={{ padding: '0.75rem', textAlign: 'right' }}><strong>7 birim</strong></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* COMMON EXAMPLES */}
          <section className="content-section" style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>Sık Kullanılan Mors Kodu Örnekleri</h2>
            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Kelime / İfade</th>
                    <th style={{ padding: '0.75rem' }}>Mors Şablonu</th>
                    <th style={{ padding: '0.75rem' }}>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>SOS</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font">... --- ...</code></td><td style={{ padding: '0.75rem' }}>Uluslararası acil imdat çağrısı</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>HELLO</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font">.... . .-.. .-.. ---</code></td><td style={{ padding: '0.75rem' }}>5 harfli selamlama kelimesi</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>HELLO WORLD</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code></td><td style={{ padding: '0.75rem' }}>Eğik çizgili iki kelimelik ifade</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '0.75rem' }}><strong>MORSE CODE</strong></td><td style={{ padding: '0.75rem' }}><code className="morse-font">-- --- .-. ... . / -.-. --- -.. .</code></td><td style={{ padding: '0.75rem' }}>Mors kodu tam ifadesi</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS */}
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
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>Farklı Bir Mors Aracına mı İhtiyacınız Var?</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.25rem', fontSize: '0.95rem' }}>
              Mors alfabesini öğrenmek, sesli çeviri yapmak veya mors manipülatörü ile pratik yapmak için diğer araçlarımıza göz atın.
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
