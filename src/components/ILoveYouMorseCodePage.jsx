import React, { useState } from 'react';
import {
  Heart, Play, Square, Copy, Check, Volume2, Sparkles, BookOpen, ChevronDown, ChevronUp
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

export function ILoveYouMorseCodePage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const phraseText = 'I LOVE YOU';
  const phraseMorse = '.. / .-.. --- ...- . / -.-- --- ..-';
  const breakdown = getCharacterBreakdown(phraseText, phraseMorse);

  const handlePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(phraseMorse);
    setCopied(true);
    if (showToast) showToast('Copied "I LOVE YOU" Morse code to clipboard ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-pink, #ec4899)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Heart size={16} /> Romantic Morse Code Expression
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          "I Love You" in Morse Code: Sound, Breakdown & Copy
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Learn how to write and speak "I Love You" in Morse code. Listen to the audio sound, copy the pattern for gifts, jewelry, or hidden messages.
        </p>
      </header>

      {/* Main Banner */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-pink, #ec4899)', marginBottom: '0.5rem' }}>
          I LOVE YOU
        </div>
        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '4px', wordBreak: 'break-all', marginBottom: '1.5rem' }}>
          {phraseMorse}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: isPlaying ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Stop Audio' : 'Hear Audio Sound'}
          </button>
          <button
            onClick={handleCopy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="var(--accent-success)" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Morse Code'}
          </button>
        </div>
      </section>

      {/* Breakdown Grid */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Letter-by-Letter Breakdown
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '1rem' }}>
          {breakdown.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.char}</div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>{item.morse}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
