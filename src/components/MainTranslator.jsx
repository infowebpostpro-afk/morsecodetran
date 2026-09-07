import React from 'react';
import {
  Copy, Play, Square, Repeat, Share2, Download,
  ArrowRightLeft, Trash2, Clipboard, Sparkles
} from 'lucide-react';
import { QUICK_EXAMPLES } from '../engine/morseMap.js';

export function MainTranslator({
  mode,
  setMode,
  detectedType,
  inputText,
  setInputText,
  outputText,
  isPlaying,
  isLooping,
  setIsLooping,
  onPlay,
  onStop,
  onSwap,
  onCopy,
  onDownloadWav,
  onShare,
  showToast
}) {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        showToast('Pasted content from clipboard');
      }
    } catch (err) {
      showToast('Please paste manually using Ctrl+V');
    }
  };

  const handleRandomExample = () => {
    const random = QUICK_EXAMPLES[Math.floor(Math.random() * QUICK_EXAMPLES.length)];
    setInputText(random.text);
    showToast(`Loaded example: ${random.label}`);
  };

  const effectiveDirection = mode === 'auto'
    ? (detectedType === 'morse' ? 'Morse → Text' : 'Text → Morse')
    : (mode === 'text2morse' ? 'Text → Morse' : 'Morse → Text');

  return (
    <section className="translator-container" id="translator">
      {/* CONNECTED APPLICATION WORKSPACE CARD */}
      <div className="workspace-card">
        {/* Topbar Mode Selector & Telemetry Status */}
        <div className="workspace-topbar">
          <div className="direction-selector">
            <button
              className={`dir-btn ${mode === 'auto' ? 'active' : ''}`}
              onClick={() => setMode('auto')}
            >
              Auto Detect
            </button>
            <button
              className={`dir-btn ${mode === 'text2morse' ? 'active' : ''}`}
              onClick={() => setMode('text2morse')}
            >
              Text → Morse
            </button>
            <button
              className={`dir-btn ${mode === 'morse2text' ? 'active' : ''}`}
              onClick={() => setMode('morse2text')}
            >
              Morse → Text
            </button>
          </div>

          <div className="telemetry-status">
            <span className="status-dot"></span>
            <span>{mode === 'auto' ? `Auto detected (${detectedType.toUpperCase()})` : effectiveDirection}</span>
          </div>
        </div>

        {/* Workspace Grid (Input vs Output) */}
        <div className="workspace-grid">
          {/* INPUT PANEL */}
          <div className="input-panel">
            <div className="panel-title">
              <span>INPUT ({mode === 'auto' ? (detectedType === 'morse' ? 'Morse' : 'Text') : (mode === 'text2morse' ? 'Text' : 'Morse')})</span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn-icon" onClick={handlePaste} title="Paste Clipboard">
                  <Clipboard size={14} />
                </button>
                {inputText && (
                  <button className="btn-icon" onClick={() => setInputText('')} title="Clear Input">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            <textarea
              className={`panel-textarea ${detectedType === 'morse' ? 'morse-font' : ''}`}
              placeholder={
                mode === 'auto'
                  ? "Type text or paste Morse code (e.g. HELLO WORLD or .... . .-.. .-.. ---)..."
                  : mode === 'text2morse'
                  ? "Enter English text..."
                  : "Enter Morse code (dots . and dashes -)..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              spellCheck="false"
            />
          </div>

          {/* CENTERED CIRCULAR SWAP BUTTON */}
          <div className="swap-wrapper">
            <button className="btn-swap-circle" onClick={onSwap} title="Swap Input ⇄ Output">
              <ArrowRightLeft size={18} />
            </button>
          </div>

          {/* OUTPUT PANEL */}
          <div className="output-panel">
            <div className="panel-title">
              <span>OUTPUT ({mode === 'auto' ? (detectedType === 'morse' ? 'Text' : 'Morse') : (mode === 'text2morse' ? 'Morse' : 'Text')})</span>
              <button
                className="btn-icon"
                onClick={() => setIsLooping(!isLooping)}
                title={isLooping ? "Looping Enabled" : "Loop Playback"}
                style={{ color: isLooping ? 'var(--primary)' : 'inherit' }}
              >
                <Repeat size={14} />
              </button>
            </div>

            <div
              className={`panel-textarea ${mode === 'text2morse' || (mode === 'auto' && detectedType === 'text') ? 'morse-font' : ''}`}
              style={{ overflowY: 'auto', userSelect: 'all' }}
            >
              {outputText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Translation output appears here in real-time...</span>}
            </div>
          </div>
        </div>

        {/* WORKSPACE ACTION BAR */}
        <div className="workspace-actionbar">
          <div className="counter-badge">
            {inputText.length} Chars in | {outputText.length} Chars out
          </div>

          <div className="action-group">
            {/* Primary Action Button: Play / Stop Audio */}
            {isPlaying ? (
              <button className="btn-primary-cta" onClick={onStop} style={{ background: '#ef4444' }}>
                <Square size={14} /> Stop
              </button>
            ) : (
              <button className="btn-primary-cta" onClick={onPlay} disabled={!outputText}>
                <Play size={14} fill="currentColor" /> Play Audio
                <div className={`waveform-bars ${isPlaying ? 'playing' : ''}`}>
                  <span></span><span></span><span></span><span></span>
                </div>
              </button>
            )}

            {/* Action Buttons */}
            <button className="btn-secondary-action" onClick={() => onCopy(outputText, 'Translation')} disabled={!outputText}>
              <Copy size={14} /> Copy Output
            </button>

            <button className="btn-secondary-action" onClick={() => onCopy(`${inputText}\n---\n${outputText}`, 'Both')} disabled={!outputText}>
              Copy Both
            </button>

            <button className="btn-secondary-action" onClick={onDownloadWav} disabled={!outputText} title="Export WAV Audio">
              <Download size={14} /> WAV
            </button>

            <button className="btn-secondary-action" onClick={onShare} disabled={!inputText} title="Share Translation URL">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* QUICK EXAMPLES CHIP BAR */}
      <div className="examples-bar">
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Try an example:</span>
        {QUICK_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            className="example-chip"
            onClick={() => {
              setInputText(ex.text);
              showToast(`Loaded example: ${ex.label}`);
            }}
          >
            {ex.label}
          </button>
        ))}
        <button className="example-chip" onClick={handleRandomExample} style={{ borderColor: 'var(--primary)' }}>
          <Sparkles size={12} style={{ color: 'var(--primary)', marginRight: '4px' }} /> Random
        </button>
      </div>
    </section>
  );
}
