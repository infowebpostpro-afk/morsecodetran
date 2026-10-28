import React, { useRef, useEffect } from 'react';
import { Volume2, Layers } from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export function PortugueseCharacterBreakdown({ breakdown, activeIndex, wpm, frequency, volume, waveform = 'sine' }) {
  const containerRef = useRef(null);

  // Auto-scroll active playing character into view
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeCard = containerRef.current.children[activeIndex];
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIndex]);

  if (!breakdown || breakdown.length === 0) return null;

  const handlePlayChar = (item) => {
    if (item.isSpace || !item.morse || item.morse === '?') return;

    audioEngine.playSequence({
      breakdown: [item],
      wpm,
      frequency,
      waveform,
      volume
    });
  };

  return (
    <section className="breakdown-section" aria-label="Caractere por caractere">
      <div className="section-title">
        <Layers className="text-primary" size={20} style={{ color: 'var(--primary)' }} />
        <span>Caractere por caractere</span>
      </div>
      <p className="section-desc">
        Toque em um caractere para ouvir seu sinal.
      </p>

      <div className="breakdown-flow" ref={containerRef}>
        {breakdown.map((item, idx) => (
          <div
            key={idx}
            className={`char-flow-card ${activeIndex === idx ? 'active-playing' : ''}`}
            onClick={() => handlePlayChar(item)}
            title={item.isSpace ? 'Espaço entre palavras (7 unidades)' : `Ouvir sinal Morse de ${item.char}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayChar(item);
              }
            }}
          >
            <div className="flow-char">
              {item.isSpace ? '␣' : item.char}
            </div>
            <div className="flow-morse">
              {item.morse}
            </div>
            <div className="flow-ditdah" title={item.phonetic}>
              {item.ditDah || item.phonetic}
            </div>
            {!item.isSpace && (
              <div style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                <Volume2 size={12} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
