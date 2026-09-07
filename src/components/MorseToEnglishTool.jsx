import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeftRight, Copy, Play, Square, X, Volume2, Sparkles, AlertCircle, Settings, Check, Command
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  translateTextToMorse,
  decodeMorseDetailed,
  getCharacterBreakdown,
  calculateStatistics,
  normalizeMorseInput
} from '../engine/morseEngine.js';

export function MorseToEnglishTool({ showToast }) {
  // Tool Modes: 'morse2english' (default) or 'english2morse' (swapped)
  const [mode, setMode] = useState('morse2english');

  // Input & Output States
  const [morseInput, setMorseInput] = useState('.... . .-.. .-.. --- / .-- --- .-. .-.. -..');
  const [englishInput, setEnglishInput] = useState('HELLO WORLD');

  // Audio Engine Controls State
  const [wpm, setWpm] = useState(20);
  const [frequency, setFrequency] = useState(600);
  const [volume, setVolume] = useState(0.5);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Copy Feedback State
  const [copiedType, setCopiedType] = useState(null); // 'morse' or 'english'

  // Input Textarea Ref for Keyboard Shortcuts
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
          if (mode === 'morse2english') setMorseInput('');
          else setEnglishInput('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  // Real-Time Detailed Decoding for Morse -> English
  const morseDecodingResult = useMemo(() => {
    if (mode === 'morse2english') {
      return decodeMorseDetailed(morseInput);
    }
    return { text: '', tokens: [], invalidTokens: [], hasErrors: false };
  }, [morseInput, mode]);

  // Real-Time Encoding for English -> Morse
  const englishEncodingResult = useMemo(() => {
    if (mode === 'english2morse') {
      return translateTextToMorse(englishInput);
    }
    return '';
  }, [englishInput, mode]);

  // Current Active Input & Output Values
  const currentMorseValue = mode === 'morse2english' ? normalizeMorseInput(morseInput) : englishEncodingResult;
  const currentEnglishValue = mode === 'morse2english' ? morseDecodingResult.text : englishInput;

  // Character Breakdown List
  const breakdownList = useMemo(() => {
    if (!currentEnglishValue || !currentMorseValue) return [];
    return getCharacterBreakdown(currentEnglishValue, currentMorseValue);
  }, [currentEnglishValue, currentMorseValue]);

  // Statistics Metrics
  const stats = useMemo(() => {
    return calculateStatistics(currentEnglishValue, currentMorseValue, wpm, wpm);
  }, [currentEnglishValue, currentMorseValue, wpm]);

  // Handle Input Changes with Normalization
  const handleMorseInputChange = (e) => {
    const val = e.target.value;
    // Normalize alternate dashes and dots immediately
    const normalized = val.replace(/[•·]/g, '.').replace(/[—–−]/g, '-');
    setMorseInput(normalized);
  };

  const handleEnglishInputChange = (e) => {
    setEnglishInput(e.target.value);
  };

  // Swap Direction & Intelligently Transfer Values
  const handleSwap = () => {
    if (mode === 'morse2english') {
      setMode('english2morse');
      setEnglishInput(morseDecodingResult.text !== '[Unknown]' ? morseDecodingResult.text : 'HELLO');
      if (showToast) showToast('Swapped to English → Morse Mode ⇄');
    } else {
      setMode('morse2english');
      setMorseInput(englishEncodingResult || '.... . .-.. .-.. ---');
      if (showToast) showToast('Swapped to Morse → English Mode ⇄');
    }
  };

  // Handle Clear Action
  const handleClear = () => {
    setMorseInput('');
    setEnglishInput('');
    if (showToast) showToast('Cleared converter input & output');
  };

  // Handle Copy Actions
  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Morse Code' : 'English Text'} copied to clipboard ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (_err) {
      if (showToast) showToast('Failed to copy text.');
    }
  };

  // Example Chips Handler
  const handleSelectExample = (exObj) => {
    if (mode === 'morse2english') {
      const morseCode = translateTextToMorse(exObj.text);
      setMorseInput(morseCode);
    } else {
      setEnglishInput(exObj.text);
    }
    if (showToast) showToast(`Loaded example "${exObj.label}"`);
  };

  // Audio Playback Controls
  const handlePlayAudio = () => {
    if (!breakdownList || breakdownList.length === 0) return;

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown: breakdownList,
      wpm,
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

  // Play Single Character Audio
  const handlePlayCharacterSound = (charItem) => {
    if (!charItem || charItem.isSpace || !charItem.morse) return;
    audioEngine.playSequence({
      breakdown: [charItem],
      wpm,
      frequency,
      volume
    });
  };

  return (
    <div className="morse-to-english-tool-wrapper" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      
      {/* TOOL SAAS CARD CONTAINER */}
      <div className="tool-card" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
        
        {/* HEADER BAR */}
        <div className="tool-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', padding: '0.45rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary-light)', display: 'flex' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                {mode === 'morse2english' ? 'Morse Code → English Converter' : 'English → Morse Code Converter'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Instant client-side translation adhering to ITU-R M.1677-1 standard
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* WPM & Audio Settings Toggle */}
            <button
              className="btn-secondary-action"
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              title="Toggle Audio & Speed Settings"
              style={{ fontSize: '0.85rem' }}
            >
              <Settings size={14} /> Audio Options ({wpm} WPM)
            </button>

            {/* Keyboard Shortcut Hint Badge */}
            <span style={{ fontSize: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Command size={12} /> + K
            </span>
          </div>
        </div>

        {/* COLLAPSIBLE AUDIO SETTINGS PANEL */}
        {showAudioSettings && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                  Playback Speed: <strong>{wpm} WPM</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={wpm}
                  onChange={(e) => setWpm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
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

        {/* QUICK EXAMPLE CHIPS ROW */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Examples:</span>
          {[
            { label: 'HELLO', text: 'HELLO' },
            { label: 'SOS', text: 'SOS' },
            { label: 'HELLO WORLD', text: 'HELLO WORLD' },
            { label: '2026', text: '2026' }
          ].map((ex) => (
            <button
              key={ex.label}
              className="btn-secondary-action"
              onClick={() => handleSelectExample(ex)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* MAIN CONVERTER GRID (SIDE-BY-SIDE ON DESKTOP, STACKED ON MOBILE) */}
        <div className="tool-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', position: 'relative' }}>

          {/* INPUT PANEL */}
          <div className="io-panel" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label htmlFor="morse-tool-input" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {mode === 'morse2english' ? 'Morse Code Input' : 'English Text Input'}
              </label>
              
              {((mode === 'morse2english' && morseInput) || (mode === 'english2morse' && englishInput)) && (
                <button
                  className="search-clear-btn"
                  onClick={() => { setMorseInput(''); setEnglishInput(''); }}
                  title="Clear input"
                  aria-label="Clear input text"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {mode === 'morse2english' ? (
              <textarea
                id="morse-tool-input"
                ref={inputRef}
                value={morseInput}
                onChange={handleMorseInputChange}
                placeholder="Type or paste Morse code... (e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..)"
                rows={6}
                className="alphabet-search-input morse-font"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.2rem', minHeight: '140px', flex: 1 }}
                aria-label="Morse Code Input Area"
              />
            ) : (
              <textarea
                id="morse-tool-input"
                ref={inputRef}
                value={englishInput}
                onChange={handleEnglishInputChange}
                placeholder="Type or paste English text... (e.g. HELLO WORLD)"
                rows={6}
                className="alphabet-search-input"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.15rem', fontFamily: 'var(--font-sans)', minHeight: '140px', flex: 1 }}
                aria-label="English Text Input Area"
              />
            )}

            {/* INPUT FOOTER HELPER */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>
                {mode === 'morse2english'
                  ? 'Use spaces between letters and / between words'
                  : 'Case insensitive — A-Z, 0-9 & standard punctuation supported'}
              </span>
              <span>{mode === 'morse2english' ? `${morseInput.length} chars` : `${englishInput.length} chars`}</span>
            </div>
          </div>

          {/* CENTER SWAP CONTROL (EASILY ACCESSIBLE ON MOBILE & DESKTOP) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0' }}>
            <button
              className="btn-seq-cta"
              onClick={handleSwap}
              title="Swap Conversion Direction"
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
                {mode === 'morse2english' ? 'Decoded English Output' : 'Morse Code Output'}
              </label>
              <span className="standard-badge" style={{ fontSize: '0.725rem' }}>
                Instant
              </span>
            </div>

            {/* DISPLAY BOX WITH ARIA-LIVE FOR ACCESSIBILITY */}
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
              {mode === 'morse2english' ? (
                morseDecodingResult.text ? morseDecodingResult.text : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Decoded English output will appear here...</span>
              ) : (
                englishEncodingResult ? englishEncodingResult : <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Morse code output will appear here...</span>
              )}
            </div>

            {/* ACTION BUTTONS BAR */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {isPlaying ? (
                  <button className="btn-seq-cta playing" onClick={handleStopAudio} aria-label="Stop Morse audio playback">
                    <Square size={14} /> Stop
                  </button>
                ) : (
                  <button className="btn-seq-cta" onClick={handlePlayAudio} aria-label="Play Morse audio code">
                    <Play size={14} fill="currentColor" /> Play Morse
                  </button>
                )}

                {mode === 'morse2english' ? (
                  <button
                    className="btn-secondary-action"
                    onClick={() => handleCopy(morseDecodingResult.text, 'english')}
                    aria-label="Copy English Output"
                  >
                    {copiedType === 'english' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                    {copiedType === 'english' ? 'Copied!' : 'Copy English'}
                  </button>
                ) : (
                  <button
                    className="btn-secondary-action"
                    onClick={() => handleCopy(englishEncodingResult, 'morse')}
                    aria-label="Copy Morse Output"
                  >
                    {copiedType === 'morse' ? <Check size={14} className="text-success" /> : <Copy size={13} />}
                    {copiedType === 'morse' ? 'Copied!' : 'Copy Morse'}
                  </button>
                )}
              </div>

              <button
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear converter"
              >
                <X size={14} /> Clear All
              </button>
            </div>

          </div>

        </div>

        {/* NON-INTRUSIVE INVALID MORSE VALIDATION BANNER */}
        {mode === 'morse2english' && morseDecodingResult.hasErrors && (
          <div style={{ marginTop: '1.25rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
              <strong>Unknown Morse pattern detected:</strong>{' '}
              {morseDecodingResult.invalidTokens.map(tok => `'${tok}'`).join(', ')}.
              Check space boundaries between characters. Unrecognized tokens are rendered as <code>[Unknown]</code>.
            </div>
          </div>
        )}

        {/* CHARACTER BREAKDOWN AREA */}
        {breakdownList.length > 0 && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text)' }}>
                Character Breakdown ({stats.characterCount} Characters, {stats.wordCount} Words)
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click any tile to listen to sound
              </span>
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
                      [Space]
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

    </div>
  );
}
