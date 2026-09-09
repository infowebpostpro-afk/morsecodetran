import React, { useState } from 'react';
import {
  AlertTriangle, Play, Square, Copy, Check, Radio, Volume2, ShieldCheck,
  ChevronDown, ChevronUp, Zap, HelpCircle, Flashlight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

export function SosMorseCodePage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const sosMorse = '... --- ...';
  const sosText = 'SOS';

  const handlePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const breakdown = getCharacterBreakdown(sosText, sosMorse);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 15,
      farnsworthWpm: wpm || 15,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: true,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sosMorse);
    setCopied(true);
    if (showToast) showToast('SOS Morse code copied to clipboard ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'Does SOS stand for "Save Our Souls" or "Save Our Ship"?',
      a: 'No. "Save Our Souls" and "Save Our Ship" are backronyms created after SOS was selected. SOS was chosen purely because three dits, three dahs, and three dits (...---...) create an unmistakable, continuous audio and visual pattern that is impossible to mistake for any other signal.'
    },
    {
      q: 'When was SOS officially adopted as the international distress signal?',
      a: 'SOS was adopted at the International Radiotelegraphic Convention in Berlin in 1906, officially replacing the older British distress code "CQD" on July 1, 1908.'
    },
    {
      q: 'How do you signal SOS with a flashlight or mirror?',
      a: 'Flash 3 fast short bursts (dots), followed by 3 longer held flashes (dashes), followed by 3 fast short bursts (dots). Pause for a moment and repeat continuously.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger, #ef4444)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <AlertTriangle size={16} /> International Distress Signal
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          SOS in Morse Code: Meaning, Signal & Audio
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Learn the exact Morse code representation of SOS (<code style={{ fontFamily: 'monospace', fontWeight: 700 }}>... --- ...</code>), how to transmit it via light or sound, its history, and common myths.
        </p>
      </header>

      {/* Main SOS Interactive Banner */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '2px solid var(--accent-danger, #ef4444)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Distress Signal Pattern
        </div>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-danger, #ef4444)', fontFamily: 'monospace', letterSpacing: '6px', marginBottom: '1rem' }}>
          {sosMorse}
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          3 short signals (dits) • 3 long signals (dahs) • 3 short signals (dits)
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', background: isPlaying ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Stop Loop' : 'Play Loop Audio'}
          </button>
          <button
            onClick={handleCopy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="var(--accent-success)" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy SOS Code'}
          </button>
        </div>
      </section>

      {/* Visual Timing Breakdown */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> SOS Element Spacing & Transmission
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Technically transmitted as a single continuous <strong>prosign</strong> without inter-letter pauses (<code style={{ fontFamily: 'monospace' }}>...---...</code>), ensuring it is distinctive even in heavy noise.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          SOS Morse Code FAQ
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaqIdx === idx && (
                <div style={{ padding: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
