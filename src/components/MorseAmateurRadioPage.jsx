import React, { useState } from 'react';
import {
  Radio, Volume2, Play, Square, Award, ArrowRight, ChevronDown, ChevronUp,
  ShieldCheck, Zap, BookOpen, Clock, Activity, Headphones, CheckCircle, ExternalLink
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function MorseAmateurRadioPage({ wpm, setWpm, frequency, volume, showToast, setActiveTab }) {
  const [playingItem, setPlayingItem] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Ham Radio Morse Abbreviations & Prosigns
  const prosignsAndAbbrs = [
    { text: 'CQ', morse: '-.-. --.-', category: 'General', meaning: 'Calling any station (General Call)' },
    { text: 'DE', morse: '-.. .', category: 'General', meaning: 'From / This is (used before callsign)' },
    { text: 'QTH', morse: '--.- - ....', category: 'Q-Code', meaning: 'Location / My location is...' },
    { text: 'RST', morse: '.-. ... -', category: 'Signal', meaning: 'Signal Report (Readability, Signal Strength, Tone)' },
    { text: '73', morse: '--... ...--', category: 'Greeting', meaning: 'Best regards / Goodbye' },
    { text: '88', morse: '---.. ---..', category: 'Greeting', meaning: 'Love and kisses' },
    { text: 'OM', morse: '--- --', category: 'Jargon', meaning: 'Old Man (Friend / Male Operator)' },
    { text: 'YL', morse: '-.-- .-..', category: 'Jargon', meaning: 'Young Lady (Female Operator)' },
    { text: 'RIG', morse: '.-. .. --.', category: 'Equipment', meaning: 'Radio transmitter/receiver transceiver' },
    { text: 'ANT', morse: '.- -. -', category: 'Equipment', meaning: 'Antenna' },
    { text: 'PSE', morse: '.--. ... .', category: 'General', meaning: 'Please' },
    { text: 'TU', morse: '- ..-', category: 'General', meaning: 'Thank you' },
    { text: 'FB', morse: '..-. -...', category: 'Jargon', meaning: 'Fine Business (Excellent / Great)' },
    { text: 'ES', morse: '. ...', category: 'General', meaning: 'And' },
    { text: 'BK', morse: '-... -.-', category: 'Prosign', meaning: 'Break / Back to you (Over)' },
    { text: 'KN', morse: '-.- -. ', category: 'Prosign', meaning: 'Go ahead, specific station ONLY' },
    { text: 'AR', morse: '.-.-.', category: 'Prosign', meaning: 'End of message (transmitted as single character)' },
    { text: 'SK', morse: '...-.-', category: 'Prosign', meaning: 'End of contact / Silent Key' },
    { text: 'BT', morse: '-...-', category: 'Prosign', meaning: 'Break / Separator (Equals sign =)' },
    { text: 'HW?', morse: '.... .-- ..--..', category: 'Question', meaning: 'How copy? How do you receive me?' }
  ];

  const handlePlaySound = (item) => {
    if (playingItem === item.text) {
      audioEngine.stop();
      setPlayingItem(null);
      return;
    }

    setPlayingItem(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);

    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setPlayingItem(null);
        }
      }
    });
  };

  const faqs = [
    {
      q: 'What is CW in Amateur Radio?',
      a: 'CW stands for Continuous Wave. It refers to Morse code transmission in radio communications, where an unmodulated carrier wave is switched on and off to create dots and dashes.'
    },
    {
      q: 'Is Morse code still required for a Ham Radio license?',
      a: 'No. The FCC and international radio authorities removed the Morse code speed test requirement for amateur radio licenses in the mid-2000s. However, CW remains one of the most popular and efficient operational modes in ham radio today.'
    },
    {
      q: 'Why do ham radio operators still use CW?',
      a: 'CW signals cut through background noise and ionospheric interference much better than voice (SSB). A 5-watt CW transmitter can easily span continents on HF bands where a 100-watt voice signal would be unreadable.'
    },
    {
      q: 'What speed (WPM) do ham radio operators use?',
      a: 'Beginner CW QSOs typically run around 10–15 WPM with Farnsworth spacing. Experienced operators regularly operate between 20–35 WPM, while high-speed CW contesters can exceed 40+ WPM.'
    },
    {
      q: 'What are Q-Codes in ham radio?',
      a: 'Q-Codes are 3-letter codes starting with Q used to abbreviate common radio questions and statements. For example, QTH means location, QSL means confirmation/receipt, and QRM means man-made interference.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Radio size={16} /> Amateur Radio CW Reference
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Morse Code in Amateur Radio (CW Guide & Prosigns)
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Master Continuous Wave (CW) communications, standard ham radio prosigns, Q-codes, common abbreviations, and standard QSO contact procedures.
        </p>
      </header>

      {/* Quick Action Navigation Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button
          onClick={() => setActiveTab('keyer')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Radio size={18} /> Open Telegraph Keyer
        </button>
        <button
          onClick={() => setActiveTab('translator')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Activity size={18} /> Morse Translator
        </button>
        <button
          onClick={() => setActiveTab('learn')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <BookOpen size={18} /> Learn Morse Code
        </button>
      </div>

      {/* Section 1: Overview of CW in Ham Radio */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> Why Continuous Wave (CW) matters in Ham Radio
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Continuous Wave (CW) is the original digital radio mode. Rather than transmitting voice audio, CW operators switch an unmodulated RF carrier wave on and off according to International Morse Code timing.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>High Efficiency & Reach</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              CW concentrates all transmitter power into a narrow bandwidth (~150 Hz compared to 3,000 Hz for SSB voice), delivering massive signal-to-noise advantages over long distances.
            </p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Global Language</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Standard Q-codes and prosigns allow amateur radio operators who do not share a common language to complete full radio contacts smoothly.
            </p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Minimalist Equipment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              CW transceivers can be built with minimal components, making CW the preferred choice for QRP (low-power), portable, and emergency operations.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Prosigns & Abbreviation Audio Table */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Headphones style={{ color: 'var(--accent-primary)' }} /> CW Prosigns & Abbreviations Reference
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Click any audio button to hear the signal in real-time.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Abbr / Prosign</th>
                <th style={{ padding: '0.75rem 1rem' }}>Morse Code</th>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meaning / Usage</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Audio</th>
              </tr>
            </thead>
            <tbody>
              {prosignsAndAbbrs.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'monospace', fontSize: '1.1rem' }}>
                    {item.text}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-primary)' }}>
                    {item.morse}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                    {item.meaning}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handlePlaySound(item)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: playingItem === item.text ? 'var(--accent-danger, #ef4444)' : 'var(--bg-input)',
                        color: playingItem === item.text ? '#fff' : 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      {playingItem === item.text ? <Square size={14} /> : <Play size={14} />}
                      {playingItem === item.text ? 'Stop' : 'Hear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Anatomy of a Standard Ham Radio CW QSO */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} /> Anatomy of a Standard CW QSO (Radio Contact)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Here is how a standard Morse code exchange works on ham radio between Station 1 (K1ABC) and Station 2 (W2DEF):
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
              STEP 1: Calling CQ (Station 1)
            </div>
            <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              CQ CQ CQ DE K1ABC K1ABC K
            </code>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Meaning: "Calling any station, this is K1ABC, please respond (K)."
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-success, #10b981)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-success, #10b981)', marginBottom: '0.25rem' }}>
              STEP 2: Answering the Call (Station 2)
            </div>
            <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              K1ABC DE W2DEF W2DEF K
            </code>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Meaning: "K1ABC, this is W2DEF responding, go ahead."
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-warning, #f59e0b)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-warning, #f59e0b)', marginBottom: '0.25rem' }}>
              STEP 3: Information Exchange (Signal Report, Name, QTH)
            </div>
            <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              W2DEF DE K1ABC GA UR RST 599 599 QTH BOSTON MA OP JOHN BK
            </code>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Meaning: "Good afternoon, your signal report is 599 (perfect). My location is Boston MA, my name is John. Back to you (BK)."
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-danger, #ef4444)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-danger, #ef4444)', marginBottom: '0.25rem' }}>
              STEP 4: Sign-off & Goodbye
            </div>
            <code style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
              TU 73 CUL SK K1ABC DE W2DEF E E
            </code>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Meaning: "Thank you, 73 (best regards), see you later. End of contact (SK). Final two dits (dit dit)."
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ Section */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Frequently Asked Questions (Amateur Radio CW)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: 'var(--bg-input)', color: 'var(--text-primary)', fontWeight: 600, border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-card)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
