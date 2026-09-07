import React, { useState, useRef, useEffect } from 'react';
import { Radio, Trash2, Volume2, Sparkles } from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToText } from '../engine/morseEngine.js';

export function MorseKeyerModule({ showToast }) {
  const [keyedMorse, setKeyedMorse] = useState('');
  const [isKeyDown, setIsKeyDown] = useState(false);
  const pressStartTime = useRef(0);
  const activeOscillator = useRef(null);

  const startKeySound = () => {
    try {
      const ctx = audioEngine.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      activeOscillator.current = { osc, gain };
    } catch (e) {}
  };

  const stopKeySound = () => {
    if (activeOscillator.current) {
      try {
        activeOscillator.current.osc.stop();
        activeOscillator.current.osc.disconnect();
      } catch (e) {}
      activeOscillator.current = null;
    }
  };

  const handleKeyDown = () => {
    if (isKeyDown) return;
    setIsKeyDown(true);
    pressStartTime.current = performance.now();
    startKeySound();
  };

  const handleKeyUp = () => {
    if (!isKeyDown) return;
    setIsKeyDown(false);
    stopKeySound();

    const duration = performance.now() - pressStartTime.current;
    const symbol = duration > 160 ? '-' : '.';
    setKeyedMorse((prev) => prev + symbol);
  };

  const addSpace = () => {
    setKeyedMorse((prev) => prev + ' ');
  };

  const addWordBreak = () => {
    setKeyedMorse((prev) => prev + ' / ');
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleKeyDown();
      }
    };
    const handleGlobalKeyUp = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleKeyUp();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    window.addEventListener('keyup', handleGlobalKeyUp);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [isKeyDown]);

  const decodedText = translateMorseToText(keyedMorse);

  return (
    <section className="breakdown-section" id="keyer">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="section-title">
          <Radio className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>Interactive Morse Telegraph Keyer (Level 3 Practice Tool)</span>
        </div>
        <p className="section-desc">
          Practice sending Morse manually using the telegraph key below or by holding the <strong>SPACEBAR</strong> on your keyboard. Short tap = Dit (.), Long press (&gt;160ms) = Dah (-).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
          {/* Keyer Pad */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button
              onMouseDown={handleKeyDown}
              onMouseUp={handleKeyUp}
              onTouchStart={(e) => { e.preventDefault(); handleKeyDown(); }}
              onTouchEnd={(e) => { e.preventDefault(); handleKeyUp(); }}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: isKeyDown ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                border: '4px solid var(--accent-primary)',
                boxShadow: isKeyDown ? '0 0 30px var(--morse-highlight)' : 'var(--shadow-lg)',
                color: isKeyDown ? '#ffffff' : 'var(--text-primary)',
                fontSize: '1.2rem',
                fontWeight: 800,
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.05s ease'
              }}
            >
              <Radio size={32} />
              <span>{isKeyDown ? 'TRANSMITTING' : 'TAP KEY'}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(or Spacebar)</span>
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button className="btn-secondary" onClick={addSpace}>+ Char Space</button>
              <button className="btn-secondary" onClick={addWordBreak}>+ Word Space (/)</button>
              <button className="btn-secondary" onClick={() => setKeyedMorse('')} title="Clear Keyer">
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          {/* Keyed Morse & Decoded Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Your Keyed Morse Code Sequence
              </span>

              <div className="morse-font" style={{ minHeight: '60px', fontSize: '1.25rem', color: 'var(--accent-primary)', marginTop: '0.5rem', wordBreak: 'break-all' }}>
                {keyedMorse || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Keyed dots and dashes will appear here...</span>}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Live Decoded Text
              </span>

              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                {decodedText || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.95rem' }}>Translated text output...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
