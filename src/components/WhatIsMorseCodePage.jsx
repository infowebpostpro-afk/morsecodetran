import React, { useState } from 'react';
import {
  HelpCircle, BookOpen, Clock, Activity, Zap, CheckCircle, ShieldCheck,
  ArrowRight, Play, Square, Volume2, Copy, Check, ExternalLink, Radio,
  ChevronDown, ChevronUp, AlertCircle, FileText, Sparkles, Compass, Lightbulb,
  Layers, Lock
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function WhatIsMorseCodePage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Helper for playing Morse audio snippets
  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  // Helper for copying text/morse snippets
  const handleCopy = (id, textToCopy, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Tab navigation helper
  const handleNav = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sampleCharacters = [
    { char: 'E', code: '.', desc: 'Single dot (shortest signal)' },
    { char: 'T', code: '-', desc: 'Single dash (3 units)' },
    { char: 'A', code: '.-', desc: 'Dot-dash (dit-dah)' },
    { char: 'S', code: '...', desc: 'Three dots (dit-dit-dit)' },
    { char: 'O', code: '---', desc: 'Three dashes (dah-dah-dah)' },
    { char: 'SOS', code: '... --- ...', desc: 'Universal distress signal' }
  ];

  const faqs = [
    {
      q: 'What is Morse code in simple words?',
      a: 'Morse code is a way to represent text using short and long signals called dots and dashes. The patterns can be transmitted through sound, light, electrical signals, or other on/off signaling methods.'
    },
    {
      q: 'Is Morse code a language?',
      a: 'No. Morse code is an encoding system. It represents characters from a language rather than having its own vocabulary and grammar.'
    },
    {
      q: 'Who invented Morse code?',
      a: 'Samuel F. B. Morse was a central figure in the development of the electric telegraph and the system associated with his name. Alfred Vail was also a major contributor and is credited by Smithsonian archival records with developing the alpha code used with the electromagnetic telegraph.'
    },
    {
      q: 'How does Morse code work?',
      a: 'Morse code represents characters with short and long signals. A standard dot is one timing unit, a dash is three units, and different gaps separate elements, letters, and words according to ITU-R M.1677-1 standards.'
    },
    {
      q: 'Is Morse code still used?',
      a: 'Yes. It remains in active use in areas including amateur radio (CW operations), navigation signaling, emergency signaling, accessibility applications, education, and hobbies. Its use today is narrower than during the telegraph era.'
    },
    {
      q: 'What does SOS mean in Morse code?',
      a: 'SOS is "... --- ...". It is an internationally recognized distress signal. The letters are not originally an abbreviation for "Save Our Souls" or "Save Our Ship".'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header Badge & Title */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <HelpCircle size={16} /> Beginner Reference & Overview Guide
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          What Is Morse Code? How It Works, History & Modern Uses
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          A complete beginner's guide to understanding dots, dashes, international timing standards, history, SOS, and modern applications.
        </p>
      </header>

      {/* Answer-First Executive Summary Box */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Direct Answer
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          <strong>Morse code</strong> is a system for representing text with short and long signals, commonly written as <strong>dots (<code>.</code>) and dashes (<code>-</code>)</strong>. A dot is a short signal, while a dash is a longer signal. These patterns represent letters, numbers, punctuation, and standardized signs.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          Morse code was developed alongside the electric telegraph in the 1830s and 1840s. Samuel Morse and Alfred Vail played major roles in its development. The system revolutionized long-distance telecommunications because information could be sent instantly as electrical pulses instead of being carried physically.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Smithsonian Institution Archives]
          </a>
        </p>
      </div>

      {/* Section 1: What Is Morse Code? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> What Is Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Morse code is an <strong>encoding system</strong> that converts text characters into patterns of short and long signals.
        </p>

        {/* Character Matrix Table */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Character</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Morse Representation</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Description</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'right' }}>Audio Demo</th>
              </tr>
            </thead>
            <tbody>
              {sampleCharacters.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: idx < sampleCharacters.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-input-subtle, rgba(255,255,255,0.02))' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.char}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>{item.code}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handlePlayMorse(`sample-${idx}`, item.char)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        background: playingId === `sample-${idx}` ? 'var(--accent-danger, #ef4444)' : 'rgba(59, 130, 246, 0.1)',
                        color: playingId === `sample-${idx}` ? '#ffffff' : 'var(--accent-primary)',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {playingId === `sample-${idx}` ? <Square size={13} /> : <Play size={13} />}
                      {playingId === `sample-${idx}` ? 'Stop' : 'Listen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The same code can be transmitted in many different ways. It can be heard as sound tones or telegraph clicks, shown as optical flashes of light, sent as electrical pulses over wires, or produced through physical tapping on a wall or tabletop.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The important concept is that Morse code does not depend on one single physical device. The <strong>pattern and timing</strong> carry the underlying information.
        </p>
      </section>

      {/* Section 2: Is Morse Code a Language? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: 'var(--accent-primary)' }} /> Is Morse Code a Language?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          No. <strong>Morse code is an encoding system, not a language.</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A natural language has its own vocabulary, grammar, syntax, and rules for constructing meaning. Morse code does not. Instead, it represents characters from an existing spoken/written language in an alternative acoustic or visual form.
        </p>

        {/* HELLO Example Card */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Example Translation</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--text-primary)' }}>English: <strong>HELLO</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>.... . .-.. .-.. ---</span>
            <button
              onClick={() => handlePlayMorse('hello-demo', 'HELLO')}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: playingId === 'hello-demo' ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {playingId === 'hello-demo' ? <Square size={14} /> : <Play size={14} />}
              {playingId === 'hello-demo' ? 'Stop Audio' : 'Play HELLO'}
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The underlying English word has not changed. Only its method of transmission has changed. This distinction is crucial because International Morse code can represent text in any language using Latin characters (or adapted national Morse alphabets for Cyrillic, Arabic, or Greek).
        </p>
      </section>

      {/* Section 3: How Does Morse Code Work & Timing Rules */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> How Does Morse Code Work? (Timing Rules)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Morse code relies on two primary signal elements:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>Dot (dit):</strong> A short signal element.</li>
          <li><strong>Dash (dah):</strong> A longer signal element, lasting three times the duration of a dot.</li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          However, the code is not only about dots and dashes. <strong>The spaces and silent gaps between signals carry equal information.</strong>
        </p>

        {/* Standard ITU Timing Grid */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          ITU-R M.1677-1 Standard Morse Timing Ratios
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Dot (dit)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unit</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>The fundamental duration unit.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Dash (dah)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Units</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Exactly 3× the duration of 1 dot.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Element Gap</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unit</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Pause between dots/dashes in 1 letter.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Letter Gap</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Units</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Pause between distinct letters.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Word Gap</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>7 Units</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Pause between distinct words.</p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          These timing proportions are maintained internationally in the International Telecommunication Union recommendation{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            ITU-R M.1677-1: International Morse code
          </a>
          , listed as currently in force.
        </p>
      </section>

      {/* Section 4: How a Simple Morse Code Message Is Built */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> How a Simple Morse Code Message Is Built
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Suppose you want to send the English word <strong>HELLO</strong>. Each letter is translated into its respective Morse pattern:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {[
            { l: 'H', m: '....' },
            { l: 'E', m: '.' },
            { l: 'L', m: '.-..' },
            { l: 'L', m: '.-..' },
            { l: 'O', m: '---' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.l}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>{item.m}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The complete encoded message is formatted with 3-unit spaces between letters:
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>
            .... . .-.. .-.. ---
          </span>
          <button
            onClick={() => handleCopy('hello-morse', '.... . .-.. .-.. ---', 'Copied HELLO Morse code!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {copiedId === 'hello-morse' ? <Check size={14} /> : <Copy size={14} />}
            {copiedId === 'hello-morse' ? 'Copied!' : 'Copy Morse'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The gaps between letter groups tell the receiver where one character ends and another begins. For multi-word messages, a longer 7-unit gap is used. This clear mathematical structure allows trained operators to distinguish individual letters seamlessly.
        </p>
      </section>

      {/* Section 5: What Do "Dit" and "Dah" Mean? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 style={{ color: 'var(--accent-primary)' }} /> What Do "Dit" and "Dah" Mean?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>Dit</strong> and <strong>dah</strong> are the spoken vocalizations for Morse code elements.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A dot is pronounced <strong>dit</strong> because it is short and crisp. A dash is pronounced <strong>dah</strong> because it lasts longer. When a dot appears at the very end of a character, it is pronounced "dit", whereas dots inside a character are shortened to "di-".
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Phonetic Pronunciation Examples</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letter A (<code>.-</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>di-dah</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letter B (<code>-...</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>dah-di-di-dit</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letter S (<code>...</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>di-di-dit</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letter O (<code>---</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>dah-dah-dah</span>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Experienced Morse operators do not count individual dots and dashes visually. Instead, they recognize the sound and rhythm of each character as a single auditory unit. This sound-based perception is why modern Morse training emphasizes listening practice.
        </p>
      </section>

      {/* Section 6: A Brief History of Morse Code */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> A Brief History of Morse Code
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Morse code was developed alongside the electrical telegraph during the 1830s and 1840s.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Samuel F. B. Morse was a central visionary in developing the telegraph system. Alfred Vail was his essential partner and mechanical engineer. Smithsonian archival records document Alfred Vail's major contributions in refining the recording apparatus and designing the alpha code used with the electromagnetic telegraph.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Smithsonian Institution Archives]
          </a>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          On <strong>May 24, 1844</strong>, Samuel Morse transmitted the famous first official telegraph message:
        </p>

        {/* Famous First Message Card */}
        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>First Public Telegraph Message (1844)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "What Hath God Wrought?"
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Transmitted from the U.S. Capitol in Washington, D.C., to Alfred Vail at the B&O Railroad Depot in Baltimore, Maryland.{' '}
            <a href="https://www.loc.gov/item/mcc.019/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              [Library of Congress Primary Record]
            </a>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Over time, different versions of Morse code emerged. The original American Morse code contained variable-length internal pauses. In 1865, European nations standardized Continental (International) Morse Code, which eliminated ambiguous internal pauses and remains the global standard today.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          For a detailed timeline, read our complete{' '}
          <a href="#history" onClick={(e) => handleNav(e, 'history')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Morse Code history guide
          </a>.
        </p>
      </section>

      {/* Section 7: What Is International Morse Code? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> What Is International Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>International Morse Code</strong> is the modern standardized form used across global aviation, radio communications, and telecommunications.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          It defines standardized dot-dash combinations for the 26 basic Latin letters (A–Z), Arabic digits (0–9), punctuation marks, and special procedural signals (prosigns).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The standard is officially published by the International Telecommunication Union as{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            Recommendation ITU-R M.1677-1
          </a>. To explore the entire character mapping, consult our complete{' '}
          <a href="#alphabet" onClick={(e) => handleNav(e, 'alphabet')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Morse Code Alphabet reference
          </a>.
        </p>
      </section>

      {/* Section 8: What Is SOS in Morse Code? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle style={{ color: 'var(--accent-primary)' }} /> What Is SOS in Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          SOS is written in Morse code as:
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-danger, #ef4444)', letterSpacing: '0.2em' }}>
              ... --- ...
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Three dits, three dahs, three dits (transmitted continuously as one prosign)</div>
          </div>
          <button
            onClick={() => handlePlayMorse('sos-demo', 'SOS')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '6px', background: playingId === 'sos-demo' ? 'var(--accent-danger, #ef4444)' : 'rgba(239, 68, 68, 0.1)', color: playingId === 'sos-demo' ? '#ffffff' : 'var(--accent-danger, #ef4444)', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {playingId === 'sos-demo' ? <Square size={14} /> : <Play size={14} />}
            {playingId === 'sos-demo' ? 'Stop' : 'Play SOS'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          SOS is internationally recognized as a maritime distress signal. It was officially adopted at the 1906 International Radiotelegraphic Convention in Berlin.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>Common Myth:</strong> Contrary to popular belief, SOS does <em>not</em> stand for "Save Our Souls" or "Save Our Ship". Those phrases are backronyms created after the signal was chosen. The pattern <code>... --- ...</code> was selected purely because it is unmistakably distinct, easy to send, and easy to recognize through noise.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          For the complete story, read our guide on{' '}
          <a href="#sos" onClick={(e) => handleNav(e, 'sos')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            SOS in Morse Code
          </a>.
        </p>
      </section>

      {/* Section 9: Where Is Morse Code Used Today? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> Where Is Morse Code Used Today?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Although commercial telegraph networks have been replaced by digital internet and satellite infrastructure, Morse code remains actively utilized across several specialized domains:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Radio size={16} style={{ color: 'var(--accent-primary)' }} /> Amateur Radio (CW)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Radio amateurs worldwide communicate daily using Morse code (known as Continuous Wave or CW). CW signals penetrate noise and fading far better than voice transmissions. Learn more in our{' '}
              <a href="#amateur-radio" onClick={(e) => handleNav(e, 'amateurradio')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                Morse Code Amateur Radio guide
              </a>.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} style={{ color: 'var(--accent-primary)' }} /> Aviation & Navigation
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Aviation VOR and NDB navigational beacons transmit continuous Morse code identifiers to help pilots verify station signals. The U.S. Coast Guard's Light List also documents Morse code characteristics for light beacons.{' '}
              <a href="https://navcen.uscg.gov/sites/default/files/pdf/msi/LightList_V6_2024.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                [US Coast Guard Light List]
              </a>
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--accent-primary)' }} /> Emergency Signaling
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Because Morse code requires no specialized decoding computer, optical light flashes or audible taps can send emergency signals when modern electronic gear fails.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} style={{ color: 'var(--accent-primary)' }} /> Assistive Accessibility
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Morse code switches allow individuals with severe motor disabilities or speech impairments to communicate effectively using simple binary input controls.
            </p>
          </div>
        </div>
      </section>

      {/* Section 10: Why Does Morse Code Still Matter? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb style={{ color: 'var(--accent-primary)' }} /> Why Does Morse Code Still Matter?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Morse code solved a monumental engineering challenge with remarkable simplicity.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Instead of requiring complex mechanical alphabets or high-bandwidth voice channels, text characters can be encoded using basic on/off pulses. This extreme efficiency makes Morse code functional over ultra-low-power radio transmitters and extreme distances.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          It also serves as a foundational study in information theory, demonstrating how data can be structured using <strong>time, sequence, and pattern</strong>.
        </p>
      </section>

      {/* Section 11: Morse Code vs Binary */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} /> Morse Code vs. Binary
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Morse code is often compared to computer binary because both rely on two physical signal states: signal ON and signal OFF.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          However, <strong>Morse code is not identical to computer binary</strong>. Modern computer binary uses fixed-length digital bit sequences (e.g., 8-bit ASCII bytes). In contrast, Morse code is a variable-length signaling system where signal durations (dots vs dashes) and silence durations (inter-element, letter, and word gaps) are essential structural elements.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Without timing gaps, a sequence of three dashes <code>---</code> could represent the single letter <strong>O</strong>, or three individual <strong>T</strong> characters.
        </p>
      </section>

      {/* Section 12: How Do You Start Learning Morse Code? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> How Do You Start Learning Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          To master Morse code efficiently, focus on character audio rhythms rather than memorizing visual dot-dash charts:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
          <li><strong>Start with sound:</strong> Learn 2–3 characters by listening to their auditory rhythm at 18–20 WPM.</li>
          <li><strong>Avoid counting:</strong> Train your brain to recognize "di-dah" immediately as <strong>A</strong> without counting.</li>
          <li><strong>Use Farnsworth timing:</strong> Keep character elements fast while extending spacing between letters.</li>
          <li><strong>Practice daily:</strong> Dedicate 10–15 minutes daily to short listening drills.</li>
          <li><strong>Progress gradually:</strong> Add new characters using the Koch method as accuracy reaches 90%.</li>
          <li><strong>Use practical tools:</strong> Convert custom sentences with our real-time translator.</li>
        </ol>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <a
            href="#learn"
            onClick={(e) => handleNav(e, 'learn')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}
          >
            Go to Learn Morse Code Guide <ArrowRight size={16} />
          </a>
          <a
            href="#translator"
            onClick={(e) => handleNav(e, 'translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Open Morse Translator Tool
          </a>
        </div>
      </section>

      {/* Section 13: Frequently Asked Questions (Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} /> Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 14: Final Takeaway & CTAs */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Ready to Start Translating Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convert text to Morse code or decode dits and dahs back to text instantly with real-time audio sound synthesis.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="#translator"
            onClick={(e) => handleNav(e, 'translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Launch Morse Translator Tool <ArrowRight size={18} />
          </a>
          <a
            href="#alphabet"
            onClick={(e) => handleNav(e, 'alphabet')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Explore Morse Code Alphabet
          </a>
        </div>
      </footer>
    </div>
  );
}

