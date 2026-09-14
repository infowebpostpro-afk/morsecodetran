import React, { useState } from 'react';
import {
  AlertTriangle, Play, Square, Copy, Check, Radio, Volume2, ShieldCheck,
  ChevronDown, ChevronUp, Zap, HelpCircle, Flashlight, History, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const TIMELINE = [
  { year: '1905', title: 'German Radio Regulations', desc: 'Germany introduced the 3-dot, 3-dash, 3-dot distress sequence in national radio regulations.' },
  { year: '1906', title: 'Berlin Radiotelegraph Convention', desc: 'International Radiotelegraph Convention officially adopted SOS as the global maritime distress signal.' },
  { year: '1908', title: 'International Effective Date', desc: 'The Berlin convention agreement took effect globally on July 1, 1908.' },
  { year: '1912', title: 'Titanic Sinking', desc: 'Titanic wireless operators transmitted both CQD and SOS signals during the disaster on April 15, 1912.' },
  { year: '1999', title: 'GMDSS Replacement', desc: 'Global Maritime Distress and Safety System officially replaced Morse code for maritime distress.' }
];

const COMPARISON_TABLE = [
  { signal: 'SOS', type: 'Continuous Morse Prosign', use: 'International Morse Distress Signal (...---...)', era: '1908–Present' },
  { signal: 'CQD', type: 'Formatted Morse Text', use: 'Early Marconi Wireless Distress Signal', era: '1904–1910s' },
  { signal: 'Mayday', type: 'Spoken Voice Procedure', use: 'Aviation & Voice Radio Emergency Signal', era: '1923–Present' }
];

const FAQS = [
  {
    q: 'What is SOS in Morse code?',
    a: 'SOS is ...---... — three dots, three dashes, and three dots sent as one continuous distress signal.'
  },
  {
    q: 'What does SOS stand for?',
    a: 'SOS does not originally stand for "Save Our Souls" or "Save Our Ship." Those phrases were created later as backronyms. The signal was selected purely for its distinctive 3-3-3 Morse rhythm.'
  },
  {
    q: 'How do you write SOS in Morse code?',
    a: 'For easy reading, it is written as "... --- ...". For official distress transmission, it is sent as one continuous sequence without letter gaps (...---...).'
  },
  {
    q: 'How do you flash SOS with a light?',
    a: 'Flash three short bursts (dots), three longer held bursts (dashes), and three short bursts (dots). Repeat the pattern continuously.'
  },
  {
    q: 'Can you tap SOS on a surface?',
    a: 'Yes. Use three quick taps, three longer taps, and three quick taps.'
  },
  {
    q: 'Did the Titanic use SOS?',
    a: 'Yes. Titanic wireless operators transmitted both CQD and SOS during the distress call on April 15, 1912.'
  },
  {
    q: 'Is SOS still used today?',
    a: 'SOS remains a globally recognized distress signal for survival and signaling. However, modern maritime emergency communication uses the Global Maritime Distress and Safety System (GMDSS) rather than Morse code.'
  }
];

export function SosMorseCodePage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const sosMorseContinuous = '...---...';
  const sosMorseSpaced = '... --- ...';
  const sosText = 'SOS';

  const handlePlay = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const breakdown = getCharacterBreakdown(sosText, sosMorseSpaced);
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast('SOS Morse code copied to clipboard ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast('Flashing SOS emergency light signal...');
    setTimeout(() => setIsFlashing(false), 4500);
  };

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ef4444',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.35s infinite alternate'
        }}>
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', padding: '1rem' }}>
            🚨 EMERGENCY SIGNAL: SOS (...---...)
          </div>
        </div>
      )}

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-danger, #ef4444)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
          <AlertTriangle size={16} /> International Distress Signal Guide
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          SOS in Morse Code: Pattern, Meaning, History & How to Send It
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          The exact Morse code pattern for <strong>SOS</strong> is <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>...---...</code>. It represents three short dots, three long dashes, and three short dots.
        </p>
      </header>

      {/* Main Interactive SOS Tool Module */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem 2rem', borderRadius: '20px', border: '2px solid var(--accent-danger, #ef4444)', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-danger, #ef4444)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          DISTRESS SIGNAL PATTERN
        </div>

        <div style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, color: 'var(--accent-danger, #ef4444)', fontFamily: 'monospace', letterSpacing: '6px', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
          {sosMorseContinuous}
        </div>

        <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '1.5rem' }}>
          Readable Notation: {sosMorseSpaced}
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontWeight: 600 }}>
          3 short (dits) • 3 long (dahs) • 3 short (dits)
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: isPlaying ? 'var(--accent-danger, #ef4444)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Stop Audio Loop' : 'Play Loop Audio'}
          </button>

          <button
            onClick={() => handleCopy(sosMorseContinuous)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="var(--accent-success)" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy SOS Signal'}
          </button>

          <button
            onClick={handleFlashSignal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            <Flashlight size={18} color="#ef4444" /> Flash Signal
          </button>

          <button
            onClick={() => setActiveTab('translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            Open Translator <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Prosign vs Readability Technical Distinction */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Why Is SOS Sent as One Continuous Signal?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Normal Morse code uses timing gaps to separate letters (3 units between letters). However, the distress signal is a <strong>prosign</strong> transmitted as one continuous sequence:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Continuous Distress Prosign</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>...---...</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>No inter-letter gaps. Transmitted rapidly as an uninterrupted 9-element rhythm.</p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Readable Text Notation</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>... --- ...</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Displayed with spaces online to make the S, O, and S characters easy for humans to read.</p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          The 1906 International Radiotelegraph Convention specified the distress call as a continuous sequence so it could not be confused with normal message traffic.
        </p>
      </section>

      {/* Myth Buster: What Does SOS Mean? */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          What Does SOS Mean?
        </h2>
        <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-danger)', marginBottom: '0.75rem' }}>
            Myth Buster: SOS Does NOT Mean "Save Our Souls" or "Save Our Ship"
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            Phrases like "Save Our Souls" or "Save Our Ship" are <strong>backronyms</strong> created after SOS was selected.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            The letters S-O-S were chosen purely because three dots, three dashes, and three dots create an unmistakable, highly recognizable rhythm that is easy to transmit and impossible to mistake even in heavy radio static.
          </p>
        </div>
      </section>

      {/* How to Send SOS */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Send SOS in Morse Code
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔦 Flashlight</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              3 short flashes, 3 long flashes (held 3x longer), 3 short flashes. Pause 5 seconds and repeat.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔊 Whistle / Sound</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              3 short sound blasts, 3 long sustained blasts, 3 short sound blasts.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>👉 Tapping</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              3 quick taps, 3 slower firm taps, 3 quick taps on a pipe, wall, or metallic surface.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🪨 Ground Marks</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Arrange rocks, snow, or logs into large visible marks: 3 dots, 3 lines, 3 dots.
            </p>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={22} color="var(--primary)" /> How SOS Became the International Distress Signal
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {TIMELINE.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-card)', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.95rem', flexShrink: 0 }}>
                {item.year}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOS vs CQD vs Mayday */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          SOS vs. CQD vs. Mayday
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Signal</th>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Type</th>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Primary Use</th>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Era</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--accent-danger)' }}>{row.signal}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{row.type}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.use}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.era}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Mistakes */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Common SOS Mistakes
        </h2>
        <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li><strong>Thinking SOS means "Save Our Souls":</strong> False. It was chosen for its 3-3-3 Morse rhythm.</li>
            <li><strong>Thinking 3 dots alone mean SOS:</strong> 3 dots are simply the letter <strong>S</strong>.</li>
            <li><strong>Adding normal letter gaps:</strong> The distress call is transmitted as one continuous prosign (<code>...---...</code>).</li>
            <li><strong>Assuming Titanic invented SOS:</strong> SOS was adopted internationally in 1906, four years before the Titanic disaster.</li>
            <li><strong>Treating Morse SOS as today's main maritime emergency system:</strong> GMDSS replaced Morse code for maritime distress in 1999.</li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--primary)" /> Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '1.25rem', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Takeaway */}
      <section style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(134, 59, 255, 0.1) 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--accent-danger)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Final Takeaway
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          <strong>SOS in Morse code is <code style={{ color: 'var(--accent-danger)', fontWeight: 900 }}>...---...</code> — three dots, three dashes, and three dots.</strong> The signal became the global distress standard because its rhythm was simple and distinct.
        </p>
        <button
          onClick={() => setActiveTab('translator')}
          style={{ padding: '0.85rem 1.75rem', background: 'var(--accent-danger)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
        >
          Translate Any Morse Code Message Now
        </button>
      </section>
    </div>
  );
}

export default SosMorseCodePage;
