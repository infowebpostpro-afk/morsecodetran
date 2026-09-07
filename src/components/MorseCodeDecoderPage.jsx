import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Settings, Command, X, Play, Square, Copy, Check, Share2, AlertTriangle, Info, Volume2, ShieldCheck, ArrowRight, ChevronUp, ChevronDown
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  decodeMorseDetailed,
  normalizeMorseInput,
  calculateStatistics,
  detectInputType
} from '../engine/morseEngine.js';

export function MorseCodeDecoderPage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
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

  // Keyboard Shortcuts (Ctrl/Cmd + K or Ctrl/Cmd + Enter to focus/decode, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key === 'Enter')) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (showToast) showToast('Focused Morse Decoder input');
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          setMorseInput('');
          if (showToast) showToast('Cleared Morse input');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  // Sync WPM changes with global WPM handler if provided
  const handleWpmChange = (newWpm) => {
    setWpm(newWpm);
    if (setGlobalWpm) setGlobalWpm(newWpm);
  };

  // Normalized Input String
  const normalizedInput = useMemo(() => {
    return normalizeMorseInput(morseInput);
  }, [morseInput]);

  // Real-Time Detailed Decoding Result
  const decodingResult = useMemo(() => {
    return decodeMorseDetailed(morseInput);
  }, [morseInput]);

  // Ambiguity & Input Type Validation Heuristics
  const isNonMorseInput = useMemo(() => {
    if (!morseInput.trim()) return false;
    return detectInputType(morseInput) === 'text' && /[a-zA-Z0-9]/.test(morseInput);
  }, [morseInput]);

  const isAmbiguousSpacing = useMemo(() => {
    if (!normalizedInput.trim()) return false;
    // Check if any contiguous sequence of dots and dashes exceeds 7 characters without space or slash
    return /[.-]{8,}/.test(normalizedInput);
  }, [normalizedInput]);

  // Transmission Statistics
  const stats = useMemo(() => {
    const calc = calculateStatistics(decodingResult.text, normalizedInput, wpm, farnsworthWpm);
    return {
      ...calc,
      unknownCount: decodingResult.invalidTokens.length
    };
  }, [decodingResult, normalizedInput, wpm, farnsworthWpm]);

  // Input Handlers
  const handleMorseInputChange = (e) => {
    const val = e.target.value;
    const normalizedVal = val.replace(/[•·]/g, '.').replace(/[—–−]/g, '-');
    setMorseInput(normalizedVal);
  };

  const handleClear = () => {
    setMorseInput('');
    setActiveTokenIdx(null);
    setHoveredTokenIdx(null);
    if (showToast) showToast('Cleared Morse input');
  };

  const handleDecodeClick = () => {
    if (inputRef.current) inputRef.current.focus();
    if (showToast) showToast('Morse Code decoded ✓');
  };

  const handlePresetSelect = (presetMorse, label) => {
    setMorseInput(presetMorse);
    setActiveTokenIdx(null);
    setHoveredTokenIdx(null);
    if (showToast) showToast(`Loaded preset "${label}"`);
  };

  // Copy Decoded Result
  const handleCopyText = async () => {
    if (!decodingResult.text) return;
    try {
      await navigator.clipboard.writeText(decodingResult.text);
      setCopiedSuccess(true);
      if (showToast) showToast('Decoded text copied to clipboard ✓');
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (_err) {
      if (showToast) showToast('Failed to copy text.');
    }
  };

  // Share URL Action
  const handleShareUrl = () => {
    if (!morseInput) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#msg=${encodeURIComponent(morseInput)}`;
    navigator.clipboard.writeText(shareUrl);
    if (showToast) showToast('Shareable link copied to clipboard ✓');
  };

  // Play Audio Sequence
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
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setPlaybackTokenIdx(-1);
          return;
        }
        setPlaybackTokenIdx(idx);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setPlaybackTokenIdx(-1);
  };

  // Single Character Audio Preview
  const handlePlaySingleCharSound = (token) => {
    if (!token || token.isSpace || !token.code || token.isInvalid) return;
    audioEngine.playSequence({
      breakdown: [{ char: token.char, morse: token.code, isSpace: false }],
      wpm,
      frequency,
      volume
    });
  };

  const presets = [
    { label: 'SOS', morse: '... --- ...' },
    { label: 'HELLO', morse: '.... . .-.. .-.. ---' },
    { label: 'HELP ME', morse: '.... . .-.. .--. / -- .' },
    { label: 'GOOD MORNING', morse: '--. --- --- -.. / -- --- .-. -. .. -. --.' },
    { label: 'I LOVE YOU', morse: '.. / .-.. --- ...- . / -.-- --- ..-' },
    { label: 'WELCOME', morse: '.-- . .-.. -.-. --- -- .' },
    { label: '12345', morse: '.---- ..--- ...-- ....- .....' }
  ];

  const faqs = [
    {
      q: "What is a Morse Code decoder?",
      a: "A Morse Code decoder converts Morse patterns made from dots and dashes into readable letters, numbers, punctuation, or supported procedural characters."
    },
    {
      q: "How do I decode Morse Code to text?",
      a: "Separate each Morse character correctly, then match its dot-and-dash pattern with the International Morse alphabet. A decoder automates this matching for you. For example: .... . .-.. .-.. --- decodes to HELLO."
    },
    {
      q: "Why is my Morse Code not decoding correctly?",
      a: "Check the spacing first. Common problems include missing letter gaps, missing word separators, incorrect dots or dashes, unsupported symbols, and formatting copied incorrectly from an image or another source."
    },
    {
      q: "Do I need spaces between Morse letters?",
      a: "For reliable written decoding, yes. Spaces make it possible to identify where one Morse character ends and the next begins. Without those boundaries, many sequences can become ambiguous."
    },
    {
      q: "What symbol should I use between Morse words?",
      a: "A slash (/) is commonly used in written Morse to show a word break. For example: .... . .-.. .-.. --- / .-- --- .-. .-.. -.. means HELLO WORLD."
    },
    {
      q: "Can a Morse Code decoder read numbers and punctuation?",
      a: "Yes, if the decoder supports those Morse characters. International Morse includes numbers and a range of punctuation and procedural signals (such as period, comma, question mark, and slash)."
    },
    {
      q: "How can I verify that a decoded Morse message is correct?",
      a: "Use three checks: First, make sure the Morse groups are valid. Second, check the character and word boundaries. Third, encode the decoded text back into Morse and compare it with the original input."
    },
    {
      q: "Can I decode Morse Code without spaces?",
      a: "Sometimes, but you cannot always determine the original message with certainty. A recognizable sequence such as ...---... can be identified as SOS, but arbitrary unspaced Morse can have multiple possible interpretations."
    },
    {
      q: "Is International Morse Code the same as American Morse Code?",
      a: "No. American Morse was used with early telegraph systems and differs from the International Morse used today. For general online Morse translation and decoding, International Morse is the appropriate standard."
    },
    {
      q: "Can I decode Morse Code from audio?",
      a: "Yes, but audio decoding requires identifying the timing of dots, dashes, character gaps, and word gaps. For clear audio, listening at a slower speed or using Farnsworth timing can make character rhythms easier to recognize."
    },
    {
      q: "What if my Morse Code contains an unknown character?",
      a: "Do not automatically replace it with a guessed letter. Check the original source first for transcription errors, unsupported punctuation, or incorrect spacing."
    },
    {
      q: "Is Morse Code a language?",
      a: "No. Morse Code is a method of representing information using short and long signals and timing between them. It does not have its own spoken vocabulary or grammar."
    },
    {
      q: "How do I know if a Morse Code decoder is giving me the right answer?",
      a: "Do not judge the result only by whether it forms a sensible word. Check the original Morse groups, confirm spacing, verify character mappings, and encode the decoded message back into Morse."
    }
  ];

  return (
    <div className="morse-decoder-page-container">

      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">Morse Code Decoder</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title">Morse Code Decoder</h1>
        <p className="alphabet-subtitle">
          Decode Morse code into readable text instantly. Paste dots and dashes to see the message, check each character, and listen to the Morse signal.
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
                  Interactive Morse Code Decoder
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Real-time client-side decoding (Space = char gap, <code>/</code> = word gap)
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
                <Command size={12} /> + Enter
              </span>
            </div>
          </div>

          {/* COLLAPSIBLE AUDIO CONTROLS */}
          {showAudioSettings && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Playback Speed: <strong>{wpm} WPM</strong>
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
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Timing gap between characters</span>
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

          {/* PRESET MESSAGES CHIPS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Preset Examples:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                className="btn-secondary-action"
                onClick={() => handlePresetSelect(p.morse, p.label)}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* MAIN DECODER GRID */}
          <div className="tool-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>

            {/* MORSE INPUT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label htmlFor="morse-decoder-input" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Morse Code Input
                </label>

                {morseInput && (
                  <button
                    className="search-clear-btn"
                    onClick={handleClear}
                    title="Clear input"
                    aria-label="Clear Morse Input"
                  >
                    <X size={14} /> Clear
                  </button>
                )}
              </div>

              <textarea
                id="morse-decoder-input"
                ref={inputRef}
                value={morseInput}
                onChange={handleMorseInputChange}
                placeholder="Paste Morse code here... (e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..)"
                rows={6}
                className="alphabet-search-input morse-font"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.25rem', minHeight: '140px', flex: 1, letterSpacing: '0.05em' }}
                aria-label="Morse Code Input Textarea"
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-seq-cta"
                    onClick={handleDecodeClick}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    <Sparkles size={14} /> Decode
                  </button>
                  <button
                    className="btn-secondary-action"
                    onClick={handleClear}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                  >
                    Clear
                  </button>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {morseInput.length} characters
                </span>
              </div>
            </div>

            {/* DECODED RESULT PANEL */}
            <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Decoded English Text
                </label>
                <span className="standard-badge" style={{ fontSize: '0.725rem' }}>
                  Instant Result
                </span>
              </div>

              {/* DISPLAY BOX WITH ARIA-LIVE & SYNCHRONIZED HIGHLIGHTING */}
              <div
                aria-live="polite"
                className="output-display-box"
                style={{
                  minHeight: '140px',
                  flex: 1,
                  padding: '1rem',
                  background: 'var(--surface-elevated)',
                  border: '1px dashed var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: decodingResult.text ? 'var(--text)' : 'var(--text-muted)',
                  wordBreak: 'break-word',
                  lineHeight: 1.6,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignContent: 'flex-start',
                  gap: '0.15rem'
                }}
              >
                {decodingResult.tokens.length > 0 ? (
                  decodingResult.tokens.map((token, idx) => {
                    const isHighlighted = activeTokenIdx === idx || hoveredTokenIdx === idx || playbackTokenIdx === idx;
                    
                    if (token.isSpace) {
                      return <span key={idx} style={{ padding: '0 0.25rem' }}> </span>;
                    }

                    return (
                      <span
                        key={idx}
                        onClick={() => setActiveTokenIdx(activeTokenIdx === idx ? null : idx)}
                        onMouseEnter={() => setHoveredTokenIdx(idx)}
                        onMouseLeave={() => setHoveredTokenIdx(null)}
                        style={{
                          padding: '0.1rem 0.3rem',
                          borderRadius: 'var(--radius-sm)',
                          background: isHighlighted ? 'var(--primary-glow)' : 'transparent',
                          color: token.isInvalid ? 'var(--danger)' : isHighlighted ? 'var(--primary-light)' : 'var(--text)',
                          border: isHighlighted ? '1px solid var(--primary)' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        title={`Morse: ${token.code}`}
                      >
                        {token.char}
                      </span>
                    );
                  })
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    Your decoded message will appear here...
                  </span>
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
                      <Play size={14} fill="currentColor" /> Play Morse Signal
                    </button>
                  )}

                  <button
                    className="btn-secondary-action"
                    onClick={handleCopyText}
                    aria-label="Copy Decoded Text"
                  >
                    {copiedSuccess ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                    {copiedSuccess ? 'Copied ✓' : 'Copy Result'}
                  </button>

                  <button
                    className="btn-secondary-action"
                    onClick={handleShareUrl}
                    aria-label="Share Link"
                  >
                    <Share2 size={13} /> Share
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* WARNING & VALIDATION BANNERS */}
          {isNonMorseInput && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Info size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Plain text detected:</strong> Please enter Morse code using dots (<code>.</code>) and dashes (<code>-</code>). If you need to convert English to Morse code, use the <a href="/english-to-morse-code/" onClick={(e) => { e.preventDefault(); setActiveTab('english2morse'); }} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>English to Morse Code tool</a>.
              </div>
            </div>
          )}

          {isAmbiguousSpacing && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Ambiguous Morse Spacing:</strong> Your input contains contiguous dots/dashes without spaces. Morse spacing may be ambiguous. Add spaces between characters for a more reliable decode.
              </div>
            </div>
          )}

          {decodingResult.hasErrors && (
            <div style={{ marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                <strong>Unknown Morse Character(s):</strong> Some Morse sequences could not be decoded. Unknown sequence(s):{' '}
                {decodingResult.invalidTokens.map((tok, i) => (
                  <code key={i} className="morse-font" style={{ color: 'var(--danger)', fontWeight: 700, marginRight: '0.35rem' }}>{tok}</code>
                ))}
              </div>
            </div>
          )}

          {/* CHARACTER BREAKDOWN & VERIFICATION GRID */}
          {decodingResult.tokens.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                  Character Breakdown & Verification
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.85rem' }}>
                  <span>Characters: <strong>{stats.characterCount}</strong></span>
                  <span>Words: <strong>{stats.wordCount}</strong></span>
                  <span>Morse Symbols: <strong>{stats.dotsCount + stats.dashesCount}</strong></span>
                  {stats.unknownCount > 0 && (
                    <span style={{ color: 'var(--danger)' }}>Unknown: <strong>{stats.unknownCount}</strong></span>
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
                        [/ → Word Space]
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
                      title={`Click to listen to ${token.code} (${token.char})`}
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

          {/* PRIVACY GUARANTEE NOTE */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} className="text-success" /> 100% Local Browser Privacy — Your Morse code is decoded locally in your browser.
            </span>
            <span>ITU-R M.1677-1 Standard Compliant</span>
          </div>

        </div>
      </section>

      {/* EDUCATIONAL & SUPPORTING ARTICLE CONTENT */}
      <article className="seo-article-container">
        <div className="article-body-content">

          {/* DECODE MORSE CODE TO TEXT */}
          <section className="content-section">
            <h2>Decode Morse Code to Text</h2>
            <p>
              A Morse Code decoder converts dots and dashes into readable text. For example, <code className="morse-font">.... . .-.. .-.. ---</code> decodes to <strong>HELLO</strong>.
            </p>
            <p>
              A longer message can use <code>/</code> as a written word separator: <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> decodes to <strong>HELLO WORLD</strong>.
            </p>
            <p>
              The decoder matches each Morse character with its corresponding letter, number, or supported punctuation mark. International Morse Code is the modern standard used for this type of decoding, and ITU-R Recommendation M.1677-1 is currently listed as in force.
            </p>
          </section>

          {/* HOW TO USE THE MORSE CODE DECODER */}
          <section className="content-section">
            <h2>How to Use the Morse Code Decoder</h2>
            <ol className="content-list" style={{ lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li>Enter or paste your Morse code.</li>
              <li>Use dots (<code>.</code>) and dashes (<code>-</code>) for each character.</li>
              <li>Separate letters with spaces.</li>
              <li>Use <code>/</code> between words when written word separation is needed.</li>
              <li>Check the decoded text.</li>
              <li>If the result looks wrong, check the spacing and individual Morse groups.</li>
            </ol>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.4rem' }}>SOS Example</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Input: <code className="morse-font">... --- ...</code><br />
                  Result: <strong>SOS</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.4rem' }}>MORSE CODE Example</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Input: <code className="morse-font">-- --- .-. ... . / -.-. --- -.. .</code><br />
                  Result: <strong>MORSE CODE</strong>
                </p>
              </div>
            </div>
          </section>

          {/* HOW MORSE CODE DECODING WORKS */}
          <section className="content-section">
            <h2>How Morse Code Decoding Works</h2>
            <p>The basic decoding process follows three steps:</p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>1. Read the Pattern</h3>
            <p>Identify dots and dashes in each group (e.g. <code className="morse-font">.-</code> = A, <code className="morse-font">-...</code> = B, <code className="morse-font">...</code> = S).</p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>2. Match the Character</h3>
            <p>Compare the pattern with the International Morse character table:</p>

            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Morse Pattern</th>
                    <th>Character</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code className="morse-font">.</code></td><td>E</td></tr>
                  <tr><td><code className="morse-font">-</code></td><td>T</td></tr>
                  <tr><td><code className="morse-font">.-</code></td><td>A</td></tr>
                  <tr><td><code className="morse-font">-...</code></td><td>B</td></tr>
                  <tr><td><code className="morse-font">-.-.</code></td><td>C</td></tr>
                  <tr><td><code className="morse-font">....</code></td><td>H</td></tr>
                  <tr><td><code className="morse-font">...</code></td><td>S</td></tr>
                  <tr><td><code className="morse-font">---</code></td><td>O</td></tr>
                  <tr><td><code className="morse-font">-----</code></td><td>0</td></tr>
                  <tr><td><code className="morse-font">.----</code></td><td>1</td></tr>
                  <tr><td><code className="morse-font">.....</code></td><td>5</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>3. Build the Message</h3>
            <p>Put characters together in order (<code className="morse-font">.... . .-.. .-.. ---</code> → <strong>HELLO</strong>).</p>
          </section>

          {/* WHY MORSE CODE SPACING MATTERS */}
          <section className="content-section">
            <h2>Why Morse Code Spacing Matters</h2>
            <p>
              Spacing is one of the most common reasons a Morse decoder produces an unexpected result. In actual Morse transmission, timing defines element, character, and word boundaries.
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Signal or Gap</th>
                    <th style={{ textAlign: 'right', width: '140px' }}>Standard Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Dot (dit)</td><td style={{ textAlign: 'right' }}><strong>1 unit</strong></td></tr>
                  <tr><td>Dash (dah)</td><td style={{ textAlign: 'right' }}><strong>3 units</strong></td></tr>
                  <tr><td>Gap between elements inside character</td><td style={{ textAlign: 'right' }}><strong>1 unit</strong></td></tr>
                  <tr><td>Gap between characters</td><td style={{ textAlign: 'right' }}><strong>3 units</strong></td></tr>
                  <tr><td>Gap between words</td><td style={{ textAlign: 'right' }}><strong>7 units</strong></td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>Missing Letter Spaces</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Compare <code className="morse-font">..</code> (represents <strong>I</strong>) with <code className="morse-font">. .</code> (represents <strong>E E</strong>). The signals are identical, but character boundaries change the entire decoded result.
              </p>
            </div>
          </section>

          {/* MORSE CODE TRANSLATOR WITHOUT SPACES */}
          <section className="content-section">
            <h2>Morse Code Translator Without Spaces</h2>
            <p>
              Morse Code without spaces is harder to decode because character boundaries are removed. For example, <code className="morse-font">...---...</code> is recognized as <strong>SOS</strong>, but arbitrary unspaced Morse sequences can produce multiple valid combinations.
            </p>
            <p>
              For written Morse, adding spaces between individual characters is often the most important correction you can make for an accurate decode.
            </p>
          </section>

          {/* COMMON EXAMPLES TABLE */}
          <section className="content-section">
            <h2>Common Morse Code Examples</h2>
            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Phrase / Word</th>
                    <th>Morse Pattern</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>SOS</strong></td><td><code className="morse-font">... --- ...</code></td><td>Distress signal</td></tr>
                  <tr><td><strong>HELLO</strong></td><td><code className="morse-font">.... . .-.. .-.. ---</code></td><td>5 letter word</td></tr>
                  <tr><td><strong>HELLO WORLD</strong></td><td><code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code></td><td>Multi-word with slash</td></tr>
                  <tr><td><strong>MORSE CODE</strong></td><td><code className="morse-font">-- --- .-. ... . / -.-. --- -.. .</code></td><td>Multi-word phrase</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* DECODER VS ENCODER VS WORD SEPARATOR */}
          <section className="content-section">
            <h2>Decoder vs Encoder vs Word Separator</h2>
            <ul className="content-list" style={{ lineHeight: 1.8 }}>
              <li><strong>Morse Code Decoder:</strong> Converts Morse patterns into readable text (<code className="morse-font">.... . .-.. .-.. ---</code> → <strong>HELLO</strong>).</li>
              <li><strong>Morse Code Encoder:</strong> Converts readable text into Morse (<strong>HELLO</strong> → <code className="morse-font">.... . .-.. .-.. ---</code>).</li>
              <li><strong>Word Separator:</strong> Shows where one word ends and another begins (using <code>/</code> or 7 timing units).</li>
            </ul>
          </section>

          {/* CONTEXTUAL INTERNAL NAVIGATION */}
          <section className="content-section">
            <h2>Related Morse Code Tools & Guides</h2>
            <p>Explore our complete suite of specialized Morse code utilities:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <a
                href="/morse-code-to-english/"
                onClick={(e) => { e.preventDefault(); setActiveTab('morse2english'); }}
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)' }}
              >
                <strong style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Morse Code to English <ArrowRight size={14} />
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reverse translator tool</span>
              </a>

              <a
                href="/english-to-morse-code/"
                onClick={(e) => { e.preventDefault(); setActiveTab('english2morse'); }}
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)' }}
              >
                <strong style={{ color: 'var(--signal-bright)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  English to Morse Code <ArrowRight size={14} />
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Convert text to Morse code</span>
              </a>

              <a
                href="/morse-code-numbers/"
                onClick={(e) => { e.preventDefault(); setActiveTab('numbers'); }}
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)' }}
              >
                <strong style={{ color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Morse Code Numbers <ArrowRight size={14} />
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>0–9 digit chart & drills</span>
              </a>

              <a
                href="/morse-code-alphabet/"
                onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }}
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)' }}
              >
                <strong style={{ color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  Morse Code Alphabet <ArrowRight size={14} />
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>A–Z audio reference</span>
              </a>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS */}
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

          {/* FINAL TAKEAWAY & EDITORIAL NOTE */}
          <section className="content-section cta-banner">
            <h2>Final Takeaway & Verification Standard</h2>
            <p>
              A good Morse Code decoder helps you understand why an answer was produced. Correct character boundaries, word separators, supported symbols, and the International Morse standard (ITU-R Recommendation M.1677-1) all matter when you want a result you can trust.
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
