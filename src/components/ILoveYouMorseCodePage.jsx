import React, { useState } from 'react';
import {
  Heart, Play, Square, Copy, Check, Volume2, Sparkles, BookOpen,
  ChevronDown, ChevronUp, Flashlight, ShieldCheck, HelpCircle, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const ROMANTIC_PHRASES = [
  { phrase: 'Love', morse: '.-.. --- ...- .' },
  { phrase: 'My Love', morse: '-- -.-- / .-.. --- ...- .' },
  { phrase: 'I Miss You', morse: '.. / -- .. ... ... / -.-- --- ..-' },
  { phrase: 'Be Mine', morse: '-... . / -- .. -. .' },
  { phrase: 'Kiss Me', morse: '-.- .. ... ... / -- .' }
];

const FAQS = [
  {
    q: 'How do you write "I love you" in Morse code?',
    a: 'Write it as ".. / .-.. --- ...- . / -.-- --- ..-". Spaces separate individual letters, while slashes (/) represent the spaces between words.'
  },
  {
    q: 'What is "love" in Morse code?',
    a: 'The word LOVE is ".-.. --- ...- .". It contains four letters: L (.-..), O (---), V (...-), and E (.).'
  },
  {
    q: 'Can I send "I love you" with a flashlight?',
    a: 'Yes! Use short flashes for dots and longer flashes (3x dot duration) for dashes. Maintain consistent pauses between elements, letters, and words.'
  },
  {
    q: 'Can I use Morse code for a bracelet or tattoo?',
    a: 'Yes, Morse code makes a discreet, elegant design for bracelets and tattoos. However, always verify the exact dot/dash patterns and character spacing before making any design permanent.'
  },
  {
    q: 'Is 143 the Morse code for "I love you"?',
    a: 'No. 143 is a numeric shorthand based on letter count (I=1, LOVE=4, YOU=3). It is not the International Morse Code representation of the phrase.'
  },
  {
    q: 'How many letters are in "I love you" in Morse code?',
    a: 'The phrase contains 8 letters: I, L, O, V, E, Y, O, and U. Together, they create 24 individual signal elements (12 dots and 12 dashes).'
  }
];

export function ILoveYouMorseCodePage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState(null);

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

  const handlePlayPhrase = (item, index) => {
    if (playingPhraseIndex === index) {
      audioEngine.stop();
      setPlayingPhraseIndex(null);
      return;
    }
    const itemBreakdown = getCharacterBreakdown(item.phrase.toUpperCase(), item.morse);
    setPlayingPhraseIndex(index);
    audioEngine.playSequence({
      breakdown: itemBreakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingPhraseIndex(null);
      }
    });
  };

  const handleCopy = (text, label = 'Morse code') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast(`Copied ${label} to clipboard ✓`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast('Flashing "I LOVE YOU" light signal...');
    setTimeout(() => setIsFlashing(false), 4000);
  };

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ffffff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.4s infinite alternate'
        }}>
          <div style={{ color: '#000', fontWeight: 900, fontSize: '2rem' }}>
            ⚡ FLASHING MORSE SIGNAL: I LOVE YOU
          </div>
        </div>
      )}

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.12)', color: 'var(--accent-pink, #ec4899)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Heart size={16} fill="var(--accent-pink, #ec4899)" /> Romantic Morse Code Expression
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          I Love You in Morse Code: Copy, Hear & Send It
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Sometimes a simple message means more when it is hidden. <strong>"I love you" in Morse code</strong> turns three familiar words into a private pattern of dots and dashes.
        </p>
      </header>

      {/* Main Interactive Tool Card */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem 2rem', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-pink, #ec4899)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          EXACT MORSE CODE PATTERN
        </div>
        <div style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '4px', wordBreak: 'break-all', marginBottom: '1.75rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px stroke var(--border-color)' }}>
          {phraseMorse}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handlePlay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: isPlaying ? 'var(--accent-danger, #ef4444)' : 'linear-gradient(135deg, #ec4899 0%, #863bff 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', shadow: '0 4px 14px rgba(236,72,153,0.3)' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Stop Audio' : 'Hear Audio Sound'}
          </button>

          <button
            onClick={() => handleCopy(phraseMorse, '"I LOVE YOU" Morse pattern')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="var(--accent-success)" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Morse Code'}
          </button>

          <button
            onClick={handleFlashSignal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            <Flashlight size={18} color="#f59e0b" /> Flash Light
          </button>

          <button
            onClick={() => setActiveTab('translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            Open Translator <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Letter-by-Letter Breakdown */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Letter-by-Letter Breakdown
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Breaking the phrase into individual letters makes it easier to learn, memorize, and verify for crafts or tattoos. The phrase contains <strong>8 letters and 24 signal elements</strong> (12 dots and 12 dashes):
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {breakdown.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-card)', padding: '1.25rem 1rem', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>{item.char}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>{item.morse}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(134, 59, 255, 0.08)', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--primary)', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
          <strong>ITU Standard Note:</strong> The International Telecommunication Union's official recommendation is <strong>ITU-R M.1677-1</strong>, which defines the global standard dot/dash ratios.
        </div>
      </section>

      {/* Spacing & Timing Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How Morse Code Spacing Works
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Spacing is one of the easiest parts of Morse code to get wrong. In written notation, spaces separate letters, while a slash (<code>/</code>) denotes a <strong>word boundary</strong>:
        </p>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
          .. / .-.. --- ...- . / -.-- --- ..-
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Under standard International Morse timing (ITU-R M.1677-1):
        </p>

        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li><strong>Dot (•):</strong> 1 time unit</li>
          <li><strong>Dash (—):</strong> 3 time units</li>
          <li><strong>Gap between elements:</strong> 1 time unit</li>
          <li><strong>Gap between letters:</strong> 3 time units</li>
          <li><strong>Gap between words:</strong> 7 time units</li>
        </ul>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          This distinction is crucial for jewelry and tattoos. Putting every dot and dash together without clear letter spacing makes the phrase unreadable to experienced operators.
        </p>
      </section>

      {/* How to Send Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Send "I Love You" in Morse Code
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>⌨️ Type It</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enter text into the <a href="#translator" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }} style={{ color: 'var(--primary)' }}>Morse Code Translator</a> for instant conversion and copyable output.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>👉 Tap It</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Tap on a table or surface: short tap = dot, longer tap = dash. Pause briefly between letters and longer between words.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔦 Flash It</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Use a phone flashlight: short light burst for dots, longer flash for dashes. Two quick flashes represent letter <strong>I</strong> (..).
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🎧 Hear It</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Listen to the auditory rhythm above. Audio training helps you recognize Morse code by sound rather than visual symbols.
            </p>
          </div>
        </div>
      </section>

      {/* Jewelry & Tattoo Verification Checklist */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          I Love You in Morse Code for Bracelets, Tattoos & Jewelry
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Morse code is extremely popular for personal jewelry, bracelets, and tattoos because it creates a meaningful message hidden in minimalist dots and lines.
        </p>

        <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-success)" /> Verification Checklist Before Making Design Permanent:
          </h3>
          <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>Start with the exact text: <strong>I LOVE YOU</strong>.</li>
            <li>Verify all eight individual letter patterns.</li>
            <li>Confirm both <strong>O</strong> characters are three dashes (<code>---</code>).</li>
            <li>Confirm <strong>Y</strong> is <code>-.--</code> and <strong>U</strong> is <code>..-</code>.</li>
            <li>Confirm word spaces are clearly demarcated (larger gaps or spacer beads).</li>
            <li>Compare your final artwork or bracelet draft against the verified pattern: <code>.. / .-.. --- ...- . / -.-- --- ..-</code>.</li>
          </ol>
        </div>
      </section>

      {/* What Does 143 Mean? */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          What Does 143 Mean?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          You may see <strong>143</strong> associated with "I love you". However, <strong>143 is not the Morse code for "I love you".</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          It is a numeric shorthand based on the number of letters in each word:
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>I = 1 letter</div>
          <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>LOVE = 4 letters</div>
          <div style={{ background: 'var(--bg-input)', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 700, color: 'var(--text-primary)' }}>YOU = 3 letters</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          If you encode the numbers 143 into Morse code, you get digit signals (<code>.---- ....- ...--</code>), which is completely different from the actual phrase Morse pattern.
        </p>
      </section>

      {/* More Romantic Phrases */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          More Romantic Phrases in Morse Code
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Phrase</th>
                <th style={{ padding: '1rem', color: 'var(--text-primary)' }}>Morse Code</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-primary)' }}>Audio</th>
              </tr>
            </thead>
            <tbody>
              {ROMANTIC_PHRASES.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.phrase}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{item.morse}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handlePlayPhrase(item, idx)}
                      style={{ padding: '0.4rem 0.85rem', background: playingPhraseIndex === idx ? 'var(--accent-danger)' : 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      {playingPhraseIndex === idx ? <Square size={14} /> : <Play size={14} />} {playingPhraseIndex === idx ? 'Stop' : 'Play'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
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
      <section style={{ background: 'linear-gradient(135deg, rgba(134, 59, 255, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--primary)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Final Takeaway
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          The exact Morse code for <strong>"I love you"</strong> is: <code style={{ color: 'var(--primary)', fontWeight: 800 }}>.. / .-.. --- ...- . / -.-- --- ..-</code>. Spacing and accuracy matter whether you are tapping a secret signal or designing a custom bracelet.
        </p>
        <button
          onClick={() => setActiveTab('translator')}
          style={{ padding: '0.85rem 1.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
        >
          Translate Any Romantic Message Now
        </button>
      </section>
    </div>
  );
}

export default ILoveYouMorseCodePage;
