import React, { useState } from 'react';
import { BookOpen, Search, Volume2 } from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { audioEngine } from '../engine/audioEngine.js';

export function AlphabetGrid({ wpm, frequency, volume }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const entries = Object.entries(MORSE_CODE_MAP);

  const filtered = entries.filter(([char, data]) => {
    if (filterType !== 'all' && data.type !== filterType) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      char.toLowerCase().includes(q) ||
      data.name.toLowerCase().includes(q) ||
      data.morse.includes(q) ||
      (data.ditDah && data.ditDah.toLowerCase().includes(q))
    );
  });

  const handlePlay = (char, morse) => {
    audioEngine.playSequence({
      breakdown: [{ char, morse, isSpace: false }],
      wpm,
      frequency,
      volume
    });
  };

  return (
    <section className="breakdown-section" id="alphabet">
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="section-title">
          <BookOpen className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>International Morse Code Alphabet Reference</span>
        </div>
        <p className="section-desc">
          Canonical International Morse Code dictionary based on ITU-R M.1677-1 standard. Search any character or click to listen to its sound.
        </p>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1rem 0' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search letter, number, symbol or morse (e.g. A, ..., sos)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['all', 'letter', 'number', 'punctuation', 'prosign'].map((type) => (
              <button
                key={type}
                className={`dir-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', textTransform: 'capitalize' }}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        <div className="breakdown-grid">
          {filtered.map(([char, data]) => (
            <div
              key={char}
              className="char-card"
              onClick={() => handlePlay(char, data.morse)}
              title={`Listen to Morse sound for ${data.name}`}
            >
              <div className="card-char">
                {char.startsWith('<') ? char.replace(/^<|>/g, '') : char}
              </div>
              <div className="card-morse">
                {data.morse}
              </div>
              <div className="card-phonetic">
                {data.ditDah}
              </div>
              <div style={{ marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                <Volume2 size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
