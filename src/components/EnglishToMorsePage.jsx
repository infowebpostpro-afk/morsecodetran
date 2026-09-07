import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeftRight, Copy, Play, Square, X, Volume2, Sparkles, AlertCircle, Settings, Check, Command, Share2, ShieldCheck, ArrowRight, ChevronDown, ChevronUp
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

export function EnglishToMorsePage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
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
      if (showToast) showToast('Swapped to Morse → English Mode ⇄');
    } else {
      setMode('english2morse');
      setEnglishInput(morseDecodingResult.text !== '[Unknown]' ? morseDecodingResult.text : 'HELLO');
      if (showToast) showToast('Swapped to English → Morse Mode ⇄');
    }
  };

  // Clear Action
  const handleClear = () => {
    setEnglishInput('');
    setMorseInput('');
    if (showToast) showToast('Cleared converter input');
  };

  // Copy Action
  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Morse Code' : 'English Text'} copied ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (_err) {
      if (showToast) showToast('Failed to copy text.');
    }
  };

  // Share Action
  const handleShare = () => {
    if (!currentEnglishValue) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#msg=${encodeURIComponent(currentEnglishValue)}`;
    navigator.clipboard.writeText(shareUrl);
    if (showToast) showToast('Shareable URL copied to clipboard ✓');
  };

  // Preset Chips Selection
  const handleSelectPreset = (presetText) => {
    if (mode === 'english2morse') {
      setEnglishInput(presetText);
    } else {
      setMorseInput(translateTextToMorse(presetText));
    }
    if (showToast) showToast(`Loaded "${presetText}" into converter`);
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

  const faqs = [
    {
      q: "How do I use the Morse Code Translator?",
      a: "Enter your English text into the English-to-Morse input. The tool converts each supported character into its International Morse Code pattern. You can then copy the Morse output or listen to it if audio playback is available."
    },
    {
      q: "How can I translate text to Morse code?",
      a: "Enter the text into an English to Morse Code translator. For example: HELLO becomes .... . .-.. .-.. ---. The translator performs the character lookup automatically."
    },
    {
      q: "What is the purpose of a Morse code encoder?",
      a: "A Morse Code encoder converts readable text into Morse Code. It replaces supported letters, numbers, and punctuation with their corresponding Morse patterns. This is useful for learning, puzzles, personal messages, radio practice, and other projects."
    },
    {
      q: "Can I listen to the Morse code audio?",
      a: "Yes. The audio represents dots and dashes as short and long signals. Timing between signals creates character and word boundaries. Listening helps learners become familiar with Morse rhythm."
    },
    {
      q: "Can I use an English to Morse code translator online?",
      a: "Yes. An online translator can convert English text into International Morse Code directly in your browser. For best results, use a tool that clearly identifies its Morse standard, handles word boundaries correctly, and lets you copy or verify the result."
    },
    {
      q: "How do spaces work in Morse Code?",
      a: "In written Morse, spaces commonly separate individual Morse characters. A slash (/) can be used to represent a space between words. For example: .... . .-.. .-.. --- / .-- --- .-. .-.. -.. means HELLO WORLD."
    },
    {
      q: "Can Morse Code represent numbers?",
      a: "Yes. International Morse Code has patterns for the digits 0 through 9. Each digit uses five Morse elements (e.g. 1 = .----, 5 = ....., 0 = -----). For the complete digit reference, see the Morse Code Numbers page."
    },
    {
      q: "Can Morse Code represent punctuation?",
      a: "Yes. International Morse Code includes several punctuation marks and additional symbols. However, not every modern character has a standard Morse representation. A translator should identify unsupported characters instead of creating an incorrect result."
    },
    {
      q: "How do I know if my Morse Code is correct?",
      a: "The easiest method is to decode the Morse back into English (round-trip check). If the original and decoded text match, the conversion has passed verification. For important messages, also check the original English text and each Morse character."
    }
  ];

  return (
    <div className="english-to-morse-page-container">

      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">English to Morse Code</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title">English to Morse Code: How to Convert Text to Morse Code</h1>
        <p className="alphabet-subtitle">
          Have you ever had an English message that you wanted to write in Morse Code, but did not know how to convert it correctly? Looking up every letter can take time. An English to Morse Code translator solves this problem by converting your text character by character instantly.
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
                  {mode === 'english2morse' ? 'English → Morse Code Generator' : 'Morse Code → English Decoder'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Real-time client-side conversion (Word separator: <code>/</code>)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="btn-secondary-action"
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                title="Toggle Audio & Speed Controls"
                style={{ fontSize: '0.85rem' }}
              >
                <Settings size={14} /> Audio Options ({wpm} WPM)
              </button>

              <span style={{ fontSize: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Command size={12} /> + K
              </span>
            </div>
          </div>

          {/* COLLAPSIBLE AUDIO CONTROLS */}
          {showAudioSettings && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Speed: <strong>{wpm} WPM</strong>
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
                    Farnsworth Speed: <strong>{farnsworthWpm} WPM</strong>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={farnsworthWpm}
                    onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Extra timing gap between characters</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Tone Frequency: <strong>{frequency} Hz</strong>
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
                    Volume: <strong>{Math.round(volume * 100)}%</strong>
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
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Examples:</span>
            {['HELLO WORLD', 'SOS', 'I LOVE YOU', 'THANK YOU', 'GOOD MORNING'].map((exText) => (
              <button
                key={exText}
                className="btn-secondary-action"
                onClick={() => handleSelectPreset(exText)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
              >
                {exText}
              </button>
            ))}
          </div>

          {/* MAIN CONVERTER GRID */}
          <div className="tool-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

            {/* INPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label htmlFor="english-tool-input" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {mode === 'english2morse' ? 'English Text Input' : 'Morse Code Input'}
                </label>

                {((mode === 'english2morse' && englishInput) || (mode === 'morse2english' && morseInput)) && (
                  <button
                    className="search-clear-btn"
                    onClick={() => { setEnglishInput(''); setMorseInput(''); }}
                    title="Clear input"
                    aria-label="Clear text input"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              {mode === 'english2morse' ? (
                <textarea
                  id="english-tool-input"
                  ref={inputRef}
                  value={englishInput}
                  onChange={handleEnglishChange}
                  placeholder="Type English text here... (e.g. HELLO WORLD)"
                  rows={6}
                  className="alphabet-search-input"
                  style={{ width: '100%', resize: 'vertical', fontSize: '1.15rem', fontFamily: 'var(--font-sans)', minHeight: '140px', flex: 1 }}
                  aria-label="English Text Input Area"
                />
              ) : (
                <textarea
                  id="english-tool-input"
                  ref={inputRef}
                  value={morseInput}
                  onChange={handleMorseChange}
                  placeholder="Type Morse code... (e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..)"
                  rows={6}
                  className="alphabet-search-input morse-font"
                  style={{ width: '100%', resize: 'vertical', fontSize: '1.2rem', minHeight: '140px', flex: 1 }}
                  aria-label="Morse Code Input Area"
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>{mode === 'english2morse' ? 'Letters A-Z, 0-9 & standard punctuation' : 'Spaces separate letters, / separates words'}</span>
                <span>{mode === 'english2morse' ? `${englishInput.length} chars` : `${morseInput.length} chars`}</span>
              </div>
            </div>

            {/* CENTER SWAP BUTTON */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0' }}>
              <button
                className="btn-seq-cta"
                onClick={handleSwap}
                title="Swap Direction"
                aria-label="Swap Conversion Direction"
                style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ArrowLeftRight size={18} />
              </button>
            </div>

            {/* OUTPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  {mode === 'english2morse' ? 'Generated Morse Code' : 'Decoded English Text'}
                </label>
                <span className="standard-badge" style={{ fontSize: '0.725rem' }}>
                  Real-Time
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
                  englishEncodingResult.morseText ? englishEncodingResult.morseText : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Morse code output will appear here...</span>
                ) : (
                  morseDecodingResult.text ? morseDecodingResult.text : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Decoded English output will appear here...</span>
                )}
              </div>

              {/* ACTION BUTTONS BAR */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {isPlaying ? (
                    <button className="btn-seq-cta playing" onClick={handleStopAudio} aria-label="Stop Morse audio">
                      <Square size={14} /> Stop
                    </button>
                  ) : (
                    <button className="btn-seq-cta" onClick={handlePlayAudio} aria-label="Play Morse audio">
                      <Play size={14} fill="currentColor" /> Play Morse
                    </button>
                  )}

                  {mode === 'english2morse' ? (
                    <button
                      className="btn-secondary-action"
                      onClick={() => handleCopy(englishEncodingResult.morseText, 'morse')}
                      aria-label="Copy Morse Output"
                    >
                      {copiedType === 'morse' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                      {copiedType === 'morse' ? 'Copied ✓' : 'Copy Morse'}
                    </button>
                  ) : (
                    <button
                      className="btn-secondary-action"
                      onClick={() => handleCopy(morseDecodingResult.text, 'english')}
                      aria-label="Copy English Output"
                    >
                      {copiedType === 'english' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                      {copiedType === 'english' ? 'Copied ✓' : 'Copy English'}
                    </button>
                  )}

                  <button
                    className="btn-secondary-action"
                    onClick={handleShare}
                    aria-label="Share Result"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>

                <button
                  className="search-clear-btn"
                  onClick={handleClear}
                  aria-label="Clear inputs"
                >
                  <X size={14} /> Clear
                </button>
              </div>

            </div>

          </div>

          {/* NON-INTRUSIVE UNSUPPORTED CHARACTER BANNER */}
          {mode === 'english2morse' && englishEncodingResult.hasUnsupported && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Unsupported character detected:</strong>{' '}
                {englishEncodingResult.unsupportedChars.map(c => `'${c}'`).join(', ')}.
                Unmappable symbols are represented as <code>?</code> in Morse code.
              </div>
            </div>
          )}

          {/* CHARACTER BREAKDOWN & STATISTICS METRICS */}
          {breakdownList.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  Character Breakdown & Metrics
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.85rem' }}>
                  <span>Characters: <strong>{stats.characterCount}</strong></span>
                  <span>Words: <strong>{stats.wordCount}</strong></span>
                  <span>Morse Symbols: <strong>{stats.dotsCount + stats.dashesCount}</strong></span>
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
                        [Space → /]
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
                      title={`Click to listen to ${item.char}`}
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
      <article className="seo-article-container">
        <div className="article-body-content">

          {/* QUICK ANSWER */}
          <section className="content-section">
            <h2>Quick Answer: English to Morse Code</h2>
            <p>
              <strong>English to Morse Code</strong> is the process of converting English letters, numbers, and supported punctuation into <strong>International Morse Code</strong>.
            </p>
            <p>
              Each character has a fixed pattern of dots (<code>.</code>) and dashes (<code>-</code>). For example, <strong>HELLO</strong> becomes <code className="morse-font">.... . .-.. .-.. ---</code>.
            </p>
            <p>
              In written Morse Code, spaces commonly separate characters. A slash (<code>/</code>) represents a space between words: <strong>HELLO WORLD</strong> becomes <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code>.
            </p>
          </section>

          {/* HOW TO CONVERT ENGLISH TO MORSE CODE */}
          <section className="content-section">
            <h2>How to Convert English to Morse Code</h2>
            <p>
              There are two main ways to convert English into Morse Code: manually looking up each character in a Morse Code chart, or using an online translator tool.
            </p>
            <p>The basic process is: <strong>English text → individual characters → Morse patterns → complete message</strong>.</p>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Worked Example: CAT</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                First, separate the characters: <code>C A T</code>.<br />
                Convert each character:<br />
                • C → <code>-.-.</code><br />
                • A → <code>.-</code><br />
                • T → <code>-</code><br />
                The final result is: <code className="morse-font" style={{ fontWeight: 800, color: 'var(--signal-bright)' }}>-.-. .- -</code>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.4rem' }}>GOOD MORNING</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  G (<code>--.</code>) O (<code>---</code>) O (<code>---</code>) D (<code>-..</code>)<br />
                  Result: <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>--. --- --- -.. / -- --- .-. -. .. -. --.</code>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>I LOVE YOU</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Word boundaries are represented by slashes (<code>/</code>).<br />
                  Result: <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>.. / .-.. --- ...- . / -.-- --- ..-</code>
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="content-section">
            <h2>How It Works</h2>
            <p>
              An English to Morse Code translator uses a fixed character mapping based on International Morse Code (ITU-R Recommendation M.1677-1).
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>English Character</th>
                    <th>Morse Code Pattern</th>
                    <th>Spoken Rhythm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td><code className="morse-font">.-</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-dah</td></tr>
                  <tr><td>B</td><td><code className="morse-font">-...</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-di-dit</td></tr>
                  <tr><td>C</td><td><code className="morse-font">-.-.</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dah-dit</td></tr>
                  <tr><td>D</td><td><code className="morse-font">-..</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dit</td></tr>
                  <tr><td>E</td><td><code className="morse-font">.</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dit</td></tr>
                  <tr><td>H</td><td><code className="morse-font">....</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-di-dit</td></tr>
                  <tr><td>O</td><td><code className="morse-font">---</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-dah-dah</td></tr>
                  <tr><td>S</td><td><code className="morse-font">...</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-dit</td></tr>
                  <tr><td>T</td><td><code className="morse-font">-</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1.25rem' }}>
              <strong>Worked Example: HELP</strong><br />
              H (<code>....</code>) + E (<code>.</code>) + L (<code>.-..</code>) + P (<code>.--.</code>) = <code className="morse-font" style={{ color: 'var(--signal-bright)' }}>.... . .-.. .--.</code>
            </div>
          </section>

          {/* COMMON EXAMPLES TABLE */}
          <section className="content-section">
            <h2>Common English to Morse Examples</h2>
            <p>The following examples show how common English text looks in Morse Code:</p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>English Text</th>
                    <th>Morse Code Output</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>E</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.</code></td></tr>
                  <tr><td><strong>T</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-</code></td></tr>
                  <tr><td><strong>A</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-</code></td></tr>
                  <tr><td><strong>H</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>....</code></td></tr>
                  <tr><td><strong>SOS</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>... --- ...</code></td></tr>
                  <tr><td><strong>HELLO</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. ---</code></td></tr>
                  <tr><td><strong>HELP</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .--.</code></td></tr>
                  <tr><td><strong>THANK YOU</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>- .... .- -. -.- / -.-- --- ..-</code></td></tr>
                  <tr><td><strong>I LOVE YOU</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.. / .-.. --- ...- . / -.-- --- ..-</code></td></tr>
                  <tr><td><strong>HELLO WORLD</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code></td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              For the complete A–Z reference, use the <a href="/morse-code-alphabet/" onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }}>Morse Code Alphabet</a> page.
            </p>
          </section>

          {/* MORSE CODE TRANSLATOR CHARACTERS & NUMBERS */}
          <section className="content-section">
            <h2>Morse Code Translator Characters & Timing</h2>
            <p>
              International Morse Code includes letters, numbers, punctuation, and special symbols. For example, <strong>HELLO 2026</strong> contains letters, spaces, and numbers.
            </p>
            <p>
              Number <code>2</code> is <code className="morse-font">..---</code> and <code>0</code> is <code className="morse-font">-----</code>. So <strong>2026</strong> becomes <code className="morse-font">..--- ----- ..--- -....</code>. For complete digit references, use the <a href="/morse-code-numbers/" onClick={(e) => { e.preventDefault(); setActiveTab('numbers'); }}>Morse Code Numbers</a> page.
            </p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.5rem' }}>Written Spacing vs Transmission Timing</h3>
            <p>
              Compare <code className="morse-font">.... . .-.. .-.. ---</code> (clear spaces) with unspaced <code className="morse-font">......-...-..---</code>. Without character spaces, it becomes ambiguous. During actual sound transmission, ARRL standards define timing as:
            </p>
            
            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Element or Gap</th>
                    <th style={{ textAlign: 'right', width: '150px' }}>Standard Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Dot (dit)</td><td style={{ textAlign: 'right' }}><strong>1 unit</strong></td></tr>
                  <tr><td>Dash (dah)</td><td style={{ textAlign: 'right' }}><strong>3 units</strong></td></tr>
                  <tr><td>Gap inside character</td><td style={{ textAlign: 'right' }}><strong>1 unit</strong></td></tr>
                  <tr><td>Gap between characters</td><td style={{ textAlign: 'right' }}><strong>3 units</strong></td></tr>
                  <tr><td>Gap between words</td><td style={{ textAlign: 'right' }}><strong>7 units</strong></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SPEED, TONE AND DECODING */}
          <section className="content-section">
            <h2>Speed, Tone, and Audio Practice</h2>
            <p>
              Morse speed is commonly measured in <strong>words per minute (WPM)</strong> using the standard PARIS method.
            </p>
            <p>
              For learners, <strong>Farnsworth timing</strong> adds longer spacing between characters while keeping character tone speed faster. This helps beginners recognize individual character acoustic rhythms without getting overwhelmed.
            </p>
            <p>
              If you have Morse code that you need to convert back into English, use the dedicated <a href="/morse-code-to-english/" onClick={(e) => { e.preventDefault(); setActiveTab('morse2english'); }}>Morse Code to English</a> tool.
            </p>
          </section>

          {/* AMERICAN VS INTERNATIONAL MORSE */}
          <section className="content-section">
            <h2>American Morse Code vs. International Morse</h2>
            <p>
              American Morse was used in historical U.S. railroad telegraphy systems. Modern communication and online tools use <strong>International Morse Code</strong> as defined in ITU-R Recommendation M.1677-1.
            </p>
          </section>

          {/* USAGE AND BENEFITS */}
          <section className="content-section">
            <h2>Usage and Benefits</h2>
            <ul className="content-list" style={{ lineHeight: 1.7 }}>
              <li><strong>Learning:</strong> Type English and see how each letter maps to dots and dashes.</li>
              <li><strong>Puzzles and Games:</strong> Convert clues for escape rooms, scavenger hunts, and games.</li>
              <li><strong>Personal Messages:</strong> Generate Morse for jewelry, tattoos, gifts, or secret notes.</li>
              <li><strong>Amateur Radio (CW):</strong> Prepare CW messages and practice listening to Morse signals.</li>
              <li><strong>Quick Text Conversion:</strong> Convert paragraphs instantly without manual lookup errors.</li>
            </ul>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="content-section">
            <h2>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
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

          {/* EDITORIAL NOTE & AUTHOR SUMMARY */}
          <section className="content-section cta-banner">
            <h2>Editorial Note & Verification Standard</h2>
            <p>
              This guide is maintained as part of the <strong>Morse Code Translator</strong> reference library. Technical information is checked against authoritative references, including ITU Recommendation M.1677-1 and ARRL code training guidance. Perform a round-trip check by decoding the generated Morse back to English to verify accuracy for important messages.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button
                className="btn-primary-cta"
                onClick={() => setActiveTab('translator')}
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                Open Main Morse Code Translator <ArrowRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
