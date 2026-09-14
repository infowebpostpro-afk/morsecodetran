import React, { useState, useMemo } from 'react';
import {
  MessageSquare, Play, Square, Copy, Check, Radio, Volume2,
  ChevronDown, ChevronUp, BookOpen, Sparkles, Filter, ShieldCheck,
  HelpCircle, ArrowRight, Search
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const MASTER_PHRASES = [
  { text: 'HI', morse: '.... ..', category: 'Greetings', use: 'Casual greeting' },
  { text: 'HELLO', morse: '.... . .-.. .-.. ---', category: 'Greetings', use: 'Standard friendly greeting' },
  { text: 'GOOD MORNING', morse: '--. --- --- -.. / -- --- .-. -. .. -. --.', category: 'Greetings', use: 'Morning greeting' },
  { text: 'GOOD NIGHT', morse: '--. --- --- -.. / -. .. --. .... -', category: 'Greetings', use: 'Evening farewell' },
  { text: 'GOODBYE', morse: '--. --- --- -.. -... -.-- .', category: 'Greetings', use: 'Farewell' },
  { text: 'THANK YOU', morse: '- .... .- -. -.- / -.-- --- ..-', category: 'Greetings', use: 'Express gratitude' },
  { text: 'PLEASE', morse: '.--. .-.. . .- ... .', category: 'Greetings', use: 'Polite request' },
  { text: 'SORRY', morse: '... --- .-. .-. -.--', category: 'Greetings', use: 'Apology' },

  { text: 'I LOVE YOU', morse: '.. / .-.. --- ...- . / -.-- --- ..-', category: 'Love & Affection', use: 'Romantic declaration' },
  { text: 'I MISS YOU', morse: '.. / -- .. ... ... / -.-- --- ..-', category: 'Love & Affection', use: 'Personal expression' },
  { text: 'BE MINE', morse: '-... . / -- .. -. .', category: 'Love & Affection', use: 'Romantic proposal' },
  { text: 'FOREVER', morse: '..-. --- .-. . ...- . .-.', category: 'Love & Affection', use: 'Endless affection' },
  { text: 'CALL ME', morse: '-.-. .- .-.. .-.. / -- .', category: 'Love & Affection', use: 'Personal request' },

  { text: 'HELP', morse: '.... . .-.. .--.', category: 'Emergency', use: 'Request assistance' },
  { text: 'HELP ME', morse: '.... . .-.. .--. / -- .', category: 'Emergency', use: 'Urgent assistance' },
  { text: 'DANGER', morse: '-.. .- -. --. . .-.', category: 'Emergency', use: 'Hazard warning' },
  { text: 'I NEED HELP', morse: '.. / -. . . -.. / .... . .-.. .--.', category: 'Emergency', use: 'Urgent call' },
  { text: 'SEND HELP', morse: '... . -. -.. / .... . .-.. .--.', category: 'Emergency', use: 'Distress request' },
  { text: 'SOS', morse: '... --- ...', category: 'Emergency', use: 'Universal Morse distress prosign' },

  { text: 'HAPPY BIRTHDAY', morse: '.... .- .--. .--. -.-- / -... .. .-. - .... -.. .- -.--', category: 'Celebrations', use: 'Birthday greeting' },
  { text: 'CONGRATULATIONS', morse: '-.-. --- -. --. .-. .- - ..- .-.. .- - .. --- -. ...', category: 'Celebrations', use: 'Celebrate success' },
  { text: 'GOOD LUCK', morse: '--. --- --- -.. / .-.. ..- -.-. -.-', category: 'Celebrations', use: 'Encouragement' },
  { text: 'WELCOME', morse: '.-- . .-.. -.-. --- -- .', category: 'Celebrations', use: 'Warm welcome' },

  { text: 'YES', morse: '-.-- . ...', category: 'Basics', use: 'Affirmative response' },
  { text: 'NO', morse: '-. ---', category: 'Basics', use: 'Negative response' },
  { text: 'OK', morse: '--- -.-', category: 'Basics', use: 'Confirmation' },
  { text: 'SEE YOU SOON', morse: '... . . / -.-- --- ..- / ... --- --- -.', category: 'Basics', use: 'Parting message' },
  { text: 'STAY CALM', morse: '... - .- -.-- / -.-. .- .-.. --', category: 'Basics', use: 'Reassurance' },

  { text: 'CQ', morse: '-.-. --.-', category: 'Radio (CW & Q-Codes)', use: 'Calling any station' },
  { text: 'QTH', morse: '--.- - ....', category: 'Radio (CW & Q-Codes)', use: 'My location is...' },
  { text: 'QSL', morse: '--.- ... .-..', category: 'Radio (CW & Q-Codes)', use: 'Acknowledge receipt' },
  { text: '73', morse: '--... ...--', category: 'Radio (CW & Q-Codes)', use: 'Best regards (sign-off)' },
  { text: '88', morse: '---.. ---..', category: 'Radio (CW & Q-Codes)', use: 'Love and kisses' },
  { text: 'DE', morse: '-.. .', category: 'Radio (CW & Q-Codes)', use: 'From (station identifier)' },
  { text: 'K', morse: '-.-', category: 'Radio (CW & Q-Codes)', use: 'Go ahead (over)' },
  { text: 'AR', morse: '.-.-.', category: 'Radio (CW & Q-Codes)', use: 'End of transmission prosign' },
  { text: 'SK', morse: '...-.-', category: 'Radio (CW & Q-Codes)', use: 'End of contact prosign' }
];

const FAQS = [
  {
    q: 'What are the most common Morse code phrases?',
    a: 'Popular examples include SOS, HELLO, HI, HELP, THANK YOU, GOOD MORNING, GOOD NIGHT, I LOVE YOU, I MISS YOU, YES, NO, and HAPPY BIRTHDAY. Amateur radio operators also frequently use shorthand such as CQ, QTH, QSL, and 73.'
  },
  {
    q: 'How do you write a phrase in Morse code?',
    a: 'Encode each letter separately, put a space between letter groups, and use a written slash (/) between words to show the word boundary.'
  },
  {
    q: 'What is HELLO in Morse code?',
    a: 'HELLO is ".... . .-.. .-.. ---". It contains five letter groups separated by spaces.'
  },
  {
    q: 'What is I LOVE YOU in Morse code?',
    a: 'I LOVE YOU is ".. / .-.. --- ...- . / -.-- --- ..-". Slashes show the word spaces between I, LOVE, and YOU.'
  },
  {
    q: 'What is HELP in Morse code?',
    a: 'HELP is ".... . .-.. .--.". Note that in a real emergency, SOS (...---...) is the recognized distress signal rather than transmitting the word HELP.'
  },
  {
    q: 'Can I use Morse code phrases for tattoos or bracelets?',
    a: 'Yes! Short Morse phrases make discrete, elegant designs for jewelry and tattoos. However, always verify the exact letter patterns, element counts, and word breaks before making any design permanent.'
  }
];

export function MorsePhrasesPage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [playingText, setPlayingText] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = ['All', 'Greetings', 'Love & Affection', 'Emergency', 'Celebrations', 'Basics', 'Radio (CW & Q-Codes)'];

  const filteredPhrases = useMemo(() => {
    return MASTER_PHRASES.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.morse.includes(searchQuery) ||
        item.use.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePlaySound = (item) => {
    if (playingText === item.text) {
      audioEngine.stop();
      setPlayingText(null);
      return;
    }
    setPlayingText(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingText(null);
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
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem' }}>
          <MessageSquare size={16} /> Reference & Discovery Hub
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Morse Code Phrases: Common Words, Messages & Meanings
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore a practical collection of common Morse code phrases, organized by purpose. Learn notation, audio rhythms, spacing rules, and tattoo/jewelry verification workflows.
        </p>
      </header>

      {/* Filter & Search Bar */}
      <section style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search phrases (e.g. HELLO, I LOVE YOU, 73)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-input)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-primary)',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Phrases Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {filteredPhrases.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No Morse code phrases found matching "{searchQuery}". Try a different keyword or category.
            </div>
          ) : (
            filteredPhrases.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.text}</span>
                    <span style={{ fontSize: '0.725rem', padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'rgba(134, 59, 255, 0.1)', color: 'var(--primary)', fontWeight: 600 }}>{item.category}</span>
                  </div>

                  <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', wordBreak: 'break-all', marginBottom: '0.5rem', background: 'var(--bg-input)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    {item.morse}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {item.use}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handlePlaySound(item)}
                    style={{ flex: 1, padding: '0.5rem', background: playingText === item.text ? 'var(--accent-danger, #ef4444)' : 'var(--bg-input)', color: playingText === item.text ? '#fff' : 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    {playingText === item.text ? <Square size={14} /> : <Play size={14} />}
                    {playingText === item.text ? 'Stop' : 'Listen'}
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
            ))
          )}
        </div>
      </section>

      {/* How to Read Morse Code Phrases */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Read Morse Code Phrases
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Morse code represents individual letters and numbers with dots (dits) and dashes (dahs). A space separates individual letter groups, while a slash (<code>/</code>) is used in written Morse to denote a <strong>word boundary</strong>.
        </p>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '1.25rem' }}>
          HELLO = .... . .-.. .-.. ---<br />
          I LOVE YOU = .. / .-.. --- ...- . / -.-- --- ..-
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <em>Note:</em> The slash is a written convention for visual readability. In actual Morse audio or radiotelegraphy transmission, word boundaries are created by a 7-unit silent pause rather than transmitting a literal slash.
        </p>
      </section>

      {/* Phrase vs Prosign vs Q-Code Technical Taxonomy */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Phrase vs. Prosign vs. Q-Code
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>💬 Standard Phrase</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Ordinary English text converted letter by letter into Morse code. Example: <code>THANK YOU</code> (<code>- .... .- -. -.- / -.-- --- ..-</code>).
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>⚡ Prosign</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Procedural signals transmitted as a single continuous character pattern without letter gaps. Example: <code>SOS</code> (<code>...---...</code>) or <code>SK</code> (<code>...-.-</code>).
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>📻 Q-Code & Shorthand</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Standardized 3-letter radio codes beginning with Q (e.g. <code>QTH</code> = location, <code>QSL</code> = confirm) or numeric shorthand (<code>73</code> = best regards).
            </p>
          </div>
        </div>
      </section>

      {/* Verification Workflow */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Verification Checklist for Tattoos & Jewelry
        </h2>
        <div style={{ background: 'var(--bg-card)', padding: '1.75rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--accent-success)" /> 8-Step Accuracy Checklist Before Making Design Permanent:
          </h3>
          <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>Write the target English phrase clearly.</li>
            <li>Translate each letter using International Morse Code standards (ITU-R M.1677-1).</li>
            <li>Verify every dot and dash count.</li>
            <li>Verify spaces between individual letters.</li>
            <li>Confirm distinct word boundaries (larger beads or visual gaps).</li>
            <li>Play the phrase as audio to verify the rhythm.</li>
            <li>Decode the final dot/dash artwork back into English text.</li>
            <li>Only then send the pattern to your jeweler or tattoo artist.</li>
          </ol>
        </div>
      </section>

      {/* Custom Phrase CTA */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Create & Translate Your Own Custom Morse Phrase
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
          Need a phrase that isn't listed above? Use our real-time translator to instantly generate, listen to, and copy any custom English message in International Morse Code.
        </p>
        <button
          onClick={() => setActiveTab('translator')}
          style={{ padding: '0.85rem 1.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Open Morse Code Translator <ArrowRight size={18} />
        </button>
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
      <section style={{ background: 'linear-gradient(135deg, rgba(134, 59, 255, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--primary)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Final Takeaway
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          Morse code phrases become much easier to use when you understand letter spacing, word boundaries, and audio rhythms. Use the reference table above for instant lookup or create a custom phrase anytime.
        </p>
        <button
          onClick={() => setActiveTab('translator')}
          style={{ padding: '0.85rem 1.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
        >
          Translate & Listen to Any Phrase
        </button>
      </section>
    </div>
  );
}

export default MorsePhrasesPage;
