import React, { useState } from 'react';
import {
  MessageSquare, Play, Square, Copy, Check, Radio, Volume2,
  ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function MorsePhrasesPage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [playingPhrase, setPlayingPhrase] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const phrases = [
    { text: 'HELLO', morse: '.... . .-.. .-.. ---', category: 'Greetings', desc: 'Standard friendly greeting' },
    { text: 'THANK YOU', morse: '- .... .- -. -.- / -.-- --- ..-', category: 'Greetings', desc: 'Express gratitude' },
    { text: 'I LOVE YOU', morse: '.. / .-.. --- ...- . / -.-- --- ..-', category: 'Romantic', desc: 'Famous romantic declaration' },
    { text: 'SOS', morse: '... --- ...', category: 'Emergency', desc: 'Universal distress call' },
    { text: 'MAYDAY', morse: '-- .- -.-- -.. .- -.--', category: 'Emergency', desc: 'Voice/telegraph emergency signal' },
    { text: 'HELP', morse: '.... . .-.. .--.', category: 'Emergency', desc: 'Emergency request for assistance' },
    { text: 'CQ', morse: '-.-. --.-', category: 'Ham Radio', desc: 'Calling any radio station' },
    { text: '73', morse: '--... ...--', category: 'Ham Radio', desc: 'Best regards / Sign off' },
    { text: 'YES', morse: '-.-- . ...', category: 'Common', desc: 'Affirmative response' },
    { text: 'NO', morse: '-. ---', category: 'Common', desc: 'Negative response' },
    { text: 'GOOD MORNING', morse: '--. --- --- -.. / -- --- .-. -. .. -. --.', category: 'Greetings', desc: 'Morning greeting' },
    { text: 'GOOD NIGHT', morse: '--. --- --- -.. / -. .. --. .... -', category: 'Greetings', desc: 'Evening sign-off' }
  ];

  const handlePlaySound = (item) => {
    if (playingPhrase === item.text) {
      audioEngine.stop();
      setPlayingPhrase(null);
      return;
    }
    setPlayingPhrase(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingPhrase(null);
      }
    });
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    if (showToast) showToast(`Copied "${text}" to clipboard ✓`);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <MessageSquare size={16} /> Common Morse Code Expressions
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Popular Morse Code Phrases (with Sound & Copy)
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Discover essential Morse code phrases for emergency calls, daily greetings, romantic messages, and amateur radio CW transmissions.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {phrases.map((item, idx) => (
          <div key={idx} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.text}</span>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>{item.category}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '2px', wordBreak: 'break-all', marginBottom: '0.75rem' }}>
                {item.morse}
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {item.desc}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handlePlaySound(item)}
                style={{ flex: 1, padding: '0.5rem', background: playingPhrase === item.text ? 'var(--accent-danger, #ef4444)' : 'var(--bg-input)', color: playingPhrase === item.text ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
              >
                {playingPhrase === item.text ? <Square size={14} /> : <Play size={14} />}
                {playingPhrase === item.text ? 'Stop' : 'Listen'}
              </button>
              <button
                onClick={() => handleCopy(item.morse, idx)}
                style={{ padding: '0.5rem 0.75rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
              >
                {copiedIndex === idx ? <Check size={14} color="var(--accent-success)" /> : <Copy size={14} />}
                {copiedIndex === idx ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
