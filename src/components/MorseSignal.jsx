import React, { useState, useEffect } from 'react';

/**
 * Reusable MorseSignal Component
 * Animates dot and dash transmission signals
 */
export function MorseSignal({ sequence = '...---...', speedMs = 300, isPlaying = false }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!sequence) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % sequence.length);
    }, speedMs);
    return () => clearInterval(interval);
  }, [sequence, speedMs]);

  return (
    <div className="morse-signal-bar" aria-hidden="true">
      {sequence.split('').map((char, idx) => {
        const isActive = activeIdx === idx;
        return (
          <span
            key={idx}
            className={`signal-unit ${char === '-' ? 'dash' : 'dot'} ${isActive ? 'active' : ''}`}
          >
            {char === '-' ? '━━' : '●'}
          </span>
        );
      })}
    </div>
  );
}
