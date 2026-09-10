import React, { useState } from 'react';
import {
  Radio, Volume2, Play, Square, Award, ArrowRight, ChevronDown, ChevronUp,
  ShieldCheck, Zap, BookOpen, Clock, Activity, Headphones, CheckCircle, ExternalLink,
  Sparkles, Compass, AlertCircle, FileText, Globe, Anchor, Copy, Check, Layers
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function MorseAmateurRadioPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingItem, setPlayingItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Ham Radio Morse Abbreviations & Prosigns
  const prosignsAndAbbrs = [
    { text: 'CQ', morse: '-.-. --.-', category: 'General', meaning: 'Calling any station (General Call)' },
    { text: 'DE', morse: '-.. .', category: 'General', meaning: 'From / This is (used before callsign)' },
    { text: 'QTH', morse: '--.- - ....', category: 'Q-Code', meaning: 'Location / My location is...' },
    { text: 'QSL', morse: '--.- ... .-..', category: 'Q-Code', meaning: 'Acknowledge receipt / QSL card confirmation' },
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
    { text: 'AR', morse: '.-.-.', category: 'Prosign', meaning: 'End of message (sent as single character)' },
    { text: 'SK', morse: '...-.-', category: 'Prosign', meaning: 'End of contact / Silent Key' },
    { text: 'BT', morse: '-...-', category: 'Prosign', meaning: 'Break / Separator (Equals sign =)' },
    { text: 'HW?', morse: '.... .-- ..--..', category: 'Question', meaning: 'How copy? How do you receive me?' }
  ];

  const handlePlaySound = (item) => {
    audioEngine.stop();
    if (playingItem === item.text) {
      setPlayingItem(null);
      return;
    }

    setPlayingItem(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);

    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
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

  const handleCopy = (id, textToCopy, label = 'Copied!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleNav = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const faqs = [
    {
      q: 'Is Morse code still used in amateur radio?',
      a: 'Yes. Morse code remains an active amateur-radio operating mode, commonly called CW. ARRL continues to provide CW resources, and amateur operators continue making daily CW contacts, including during organized events such as Straight Key Night and international contests.'
    },
    {
      q: 'Is Morse code required for a U.S. ham-radio license?',
      a: 'No. The FCC eliminated the Morse-code examination requirement in 2007 (FCC Report and Order 06-178). You can become a U.S. amateur-radio operator without passing a Morse test.'
    },
    {
      q: 'What does CW mean in ham radio?',
      a: 'CW stands for Continuous Wave. In amateur radio, the term is commonly used for Morse-code telegraphy transmitted by keying a radio carrier wave on and off.'
    },
    {
      q: 'What is a QSO?',
      a: 'A QSO is a two-way amateur-radio contact between stations. It can be a short exchange of signal reports and callsigns or a longer conversation about equipment, location, and weather.'
    },
    {
      q: 'What is CQ in Morse code?',
      a: 'CQ is a general call used by an operator who is seeking another station to contact. A typical call includes "CQ CQ CQ DE [Callsign] K".'
    },
    {
      q: 'What does QTH mean?',
      a: 'QTH refers to a station\'s location. An operator can ask for another station\'s QTH ("QTH?") or give their own location ("QTH BOSTON").'
    },
    {
      q: 'Do I need a straight key to use CW?',
      a: 'No. You can use a straight key, paddle with an electronic keyer, bug, or computer software. The choice depends on your operating preference and speed goals.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Radio size={16} /> Amateur Radio CW Reference & Guide
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Morse Code in Amateur Radio: CW, QSO, Equipment & Getting Started
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Learn how Morse code works in amateur radio, what CW means, which equipment you need, common Q-codes, and how to make your first QSO.
        </p>
      </header>

      {/* Answer-First Executive Summary Box */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Direct Answer
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          In amateur radio, Morse code is usually called <strong>CW (continuous wave)</strong>. An operator uses a key or electronic keyer to switch a radio carrier wave on and off in the timing pattern of International Morse.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          ARRL defines CW as Morse-code telegraphy and explains that modern amateur transceivers support CW alongside voice, image, and digital modes. Furthermore, Morse proficiency is <strong>not required for a U.S. FCC ham license</strong> (eliminated in 2007), making CW a voluntary, highly popular operating mode.{' '}
          <a href="https://www.arrl.org/cw-mode" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [ARRL CW Mode Guide]
          </a>
        </p>
      </div>

      {/* Section 1: What Is Morse Code in Amateur Radio? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> What Is Morse Code in Amateur Radio?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          In amateur radio, Morse code is a way to send text by controlling an unmodulated radio-frequency signal in the pattern of International Morse.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          An operator creates dots and dashes with a telegraph key or electronic paddle keyer. The transmitter outputs the timed radio carrier signals, and at the receiving end, another ham operator hears those signals converted into audible sidetones and decodes the Morse characters.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Morse code is not a separate radio language; it is the physical signaling method used to transmit written language through electromagnetic waves.
        </p>
      </section>

      {/* Section 2: What Does CW Mean? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> What Does CW Mean?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>CW</strong> is the universally accepted abbreviation amateur-radio operators use for Morse-code telegraphy.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          CW stands for <strong>Continuous Wave</strong>. Historically, early spark-gap transmitters produced damped, noisy radio waves. Continuous-wave transmitters generated smooth, single-frequency carrier waves that could be turned on and off cleanly with a key.
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Common On-Air Phrases</div>
          <ul style={{ color: 'var(--text-primary)', lineHeight: 1.7, margin: 0, paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
            <li><em>"I operate CW."</em> — I communicate using Morse code radio mode.</li>
            <li><em>"I made a CW contact."</em> — I completed a 2-way Morse radio exchange (QSO).</li>
            <li><em>"What speed do you copy?"</em> — What WPM (words per minute) can you comfortably receive?</li>
          </ul>
        </div>
      </section>

      {/* Section 3: How Morse Code Works on Amateur Radio */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} /> How Morse Code Works on Amateur Radio
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          The complete CW signal flow operates through five connected steps:
        </p>

        {/* Signal Flow Diagram */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Telegraph Key</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Transmitter</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>RF Signal</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Receiver</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Audio Tone</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          At the receiving station, the radio converts incoming RF carrier pulses into a clean audio tone (typically 600 Hz). The receiving operator listens to the auditory rhythm and decodes the message.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Experienced operators practice <strong>head copy</strong>, understanding the Morse rhythms directly in their mind without having to write down every single letter on paper.
        </p>
      </section>

      {/* Section 4: Why Do Ham Radio Operators Still Use Morse Code? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> Why Do Ham Radio Operators Still Use Morse Code?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Even with voice, digital data, and satellite modes available, CW remains exceptionally popular among ham operators:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--accent-primary)' }} /> Narrowband Efficiency
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A CW signal requires only ~100–500 Hz of bandwidth, compared to ~2,400 Hz for SSB voice. This extreme spectral efficiency allows dozens of CW stations to operate inside a single band segment.{' '}
              <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                [ITU Recommendation M.1677-1]
              </a>
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} style={{ color: 'var(--accent-primary)' }} /> Low Power (QRP) & DX
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Because CW energy is concentrated in a tight bandwidth, low-power transmitters (5W or less) can achieve long-distance (DX) contacts around the globe through solar noise and fading.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} style={{ color: 'var(--accent-primary)' }} /> Skill & Culture
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Operating CW requires mental concentration, rhythm, and practice. Organizations like ARRL and CW Academy actively foster a vibrant training and operating community.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Do You Need Morse Code for an Amateur Radio License? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle style={{ color: 'var(--accent-primary)' }} /> Do You Need Morse Code for an Amateur Radio License?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>No.</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          In the United States, the Federal Communications Commission (FCC) officially eliminated all telegraphy examination requirements for all amateur radio license classes, with the rule change taking effect on <strong>February 23, 2007</strong>.{' '}
          <a href="https://docs.fcc.gov/public/attachments/FCC-06-178A1.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [FCC Report and Order 06-178]
          </a>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          You can earn your Technician, General, or Amateur Extra license without taking a Morse test. Learning CW today is completely voluntary—an enjoyable operating choice rather than a legal barrier.
        </p>
      </section>

      {/* Section 6: What Equipment Do You Need for CW? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: 'var(--accent-primary)' }} /> What Equipment Do You Need for CW?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Setting up a CW station requires simple core components:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Straight Key</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A mechanical up-and-down switch where the operator manually controls the exact duration of every dot and dash. Traditional and excellent for learning basic mechanics.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Paddle & Electronic Keyer</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A dual-lever paddle connected to an electronic keyer circuit. Pressing the right lever generates automated dashes; the left generates automated dots. Ideal for higher WPM speeds.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Radio Transceiver & Antenna</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              An HF amateur transceiver supporting CW mode, paired with a tuned dipole or vertical antenna and headphones for listening to weak sidetones.
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          You can practice keying skills online without a transmitter using our free{' '}
          <a href="#keyer" onClick={(e) => handleNav(e, 'keyer')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Telegraph Keyer tool
          </a>.
        </p>
      </section>

      {/* Section 7: Common CW Terms & Prosigns Matrix Table */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 style={{ color: 'var(--accent-primary)' }} /> Common CW Terms, Q-Codes & Prosigns
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Click any term below to hear its authentic Morse audio rhythm at your active speed settings ({wpm} WPM):
        </p>

        {/* Prosign Table */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Term / Code</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Morse Code</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Meaning</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'right' }}>Audio Demo</th>
              </tr>
            </thead>
            <tbody>
              {prosignsAndAbbrs.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: idx < prosignsAndAbbrs.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-input-subtle, rgba(255,255,255,0.02))' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{item.text}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.15rem', letterSpacing: '0.1em' }}>{item.morse}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.meaning}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handlePlaySound(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        background: playingItem === item.text ? 'var(--accent-danger, #ef4444)' : 'rgba(59, 130, 246, 0.1)',
                        color: playingItem === item.text ? '#ffffff' : 'var(--accent-primary)',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {playingItem === item.text ? <Square size={13} /> : <Play size={13} />}
                      {playingItem === item.text ? 'Stop' : 'Listen'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 8: How a Basic CW QSO Works */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> How a Basic CW QSO Works (5 Stages)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A <strong>QSO</strong> is a two-way radio contact. Every standard CW contact follows five logical stages:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>1. Listen First:</strong> Monitor the frequency before sending to ensure no ongoing contact is interrupted.</li>
          <li><strong>2. Call CQ or Answer:</strong> Send <code>CQ CQ CQ DE W1ABC W1ABC K</code> or respond to an existing CQ call.</li>
          <li><strong>3. Exchange Callsigns:</strong> Confirm both station callsign identifiers clearly.</li>
          <li><strong>4. Exchange Information:</strong> Swap RST signal reports (e.g. 579), operator name, and QTH location.</li>
          <li><strong>5. Close the Contact:</strong> Send closing greetings <code>73 DE W1ABC SK</code>.</li>
        </ol>
      </section>

      {/* Section 9: Realistic Example CW Contact */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText style={{ color: 'var(--accent-primary)' }} /> Example of a Simple CW Contact
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Here is a realistic dialogue between Station A (<code>W1ABC</code> in Boston) and Station B (<code>K2XYZ</code> in Denver):
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>STATION A (CQ Call)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              CQ CQ CQ DE W1ABC W1ABC K
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>STATION B (Response)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              W1ABC DE K2XYZ K
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>STATION A (Report & QTH)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              K2XYZ DE W1ABC GM UR RST 579 579 QTH BOSTON NAME JOHN K
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>STATION B (Receipt & Farewell)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              W1ABC DE K2XYZ R UR RST 599 599 QTH DENVER NAME MIKE 73 SK
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: How to Learn Morse Code for Amateur Radio */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> How to Learn Morse Code for Amateur Radio
        </h2>
        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>Learn by Sound:</strong> Train your ears at 18–20 WPM character speed using Farnsworth spacing.</li>
          <li><strong>Focus on Head Copy:</strong> Practice recognizing full character sounds directly in your mind.</li>
          <li><strong>Practice Sending:</strong> Use an electronic keyer to ensure precise 1:3 element timing ratios.</li>
          <li><strong>Listen to Live CW Bands:</strong> Tune to 40m or 20m CW band segments to practice copying real callsigns and RST reports.</li>
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
            href="#keyer"
            onClick={(e) => handleNav(e, 'keyer')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Practice with Telegraph Keyer
          </a>
        </div>
      </section>

      {/* Section 11: CW Operating Beyond Your First QSO */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass style={{ color: 'var(--accent-primary)' }} /> CW Operating Beyond Your First QSO
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Once comfortable with basic contacts, CW opens up active sub-hobbies in amateur radio:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>DXing:</strong> Contacting rare overseas stations on international HF bands.
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>POTA / SOTA:</strong> Operating portable stations from Parks or Summits on the Air.
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Contesting:</strong> High-speed competitive events testing contact volume and logging skill.
          </div>
        </div>
      </section>

      {/* Section 12: Frequently Asked Questions (Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Frequently Asked Questions
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

      {/* Section 13: Final Takeaway & CTAs */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Ready to Practice Amateur Radio CW?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convert callsigns and text to Morse code or practice your keying speed with real-time sound audio synthesis.
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
            Explore Morse Alphabet Reference
          </a>
        </div>
      </footer>
    </div>
  );
}
