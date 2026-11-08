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
    if (item.isSpace || !item.morse || item.morse === '?' || item.isInvalid) return;

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
            className={`char-flow-card ${activeIndex === idx ? 'active-playing' : ''} ${item.isInvalid ? 'char-card-invalid' : ''}`}
            onClick={() => handlePlayChar(item)}
            title={
              item.isSpace
                ? 'Espaço entre palavras (7 unidades)'
                : item.isInvalid
                ? `Grupo não reconhecido: ${item.morse}`
                : `Ouvir sinal Morse de ${item.char}`
            }
            role="button"
            tabIndex={item.isSpace || item.isInvalid ? -1 : 0}
            style={item.isInvalid ? { borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)' } : {}}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePlayChar(item);
              }
            }}
          >
            <div className="flow-char" style={item.isInvalid ? { color: '#ef4444' } : {}}>
              {item.isSpace ? '␣' : item.char}
            </div>
            <div className="flow-morse" style={item.isInvalid ? { color: '#ef4444' } : {}}>
              {item.morse}
            </div>
            <div className="flow-ditdah" title={item.phonetic} style={item.isInvalid ? { color: 'var(--text-muted)' } : {}}>
              {item.ditDah || item.phonetic}
            </div>
            {!item.isSpace && !item.isInvalid && (
              <div style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                <Volume2 size={12} />
              </div>
            )}
            {item.isInvalid && (
              <div style={{ marginTop: '0.2rem', color: '#ef4444', fontSize: '0.7rem', fontWeight: 600 }}>
                Não reconhecido
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
