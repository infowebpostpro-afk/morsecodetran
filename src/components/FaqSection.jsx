import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS = [
  {
    q: "How do you translate Morse code?",
    a: "Enter a Morse sequence into the translator. The tool matches supported Morse patterns with their corresponding characters and returns readable text. You can also enter normal text to generate Morse code."
  },
  {
    q: "Can you translate Morse code to English?",
    a: "Yes. Supported International Morse sequences can be converted into readable letters, numbers, and supported punctuation."
  },
  {
    q: "What is SOS in Morse code?",
    a: "SOS is ... --- ... consisting of three short signals, three long signals, and three short signals. SOS is a distinctive Morse distress signal and should not be treated as an acronym."
  },
  {
    q: "What is the difference between a dot and a dash?",
    a: "A dot is a short Morse signal. A dash is a longer Morse signal. Their combinations create different characters."
  },
  {
    q: "Is Morse code still used today?",
    a: "Yes. Morse remains active in amateur radio and is also used for education, practice, puzzles, and other signaling applications."
  },
  {
    q: "How do you read Morse code?",
    a: "Learn the character patterns and practice recognizing them by sound. Also learn the spacing between signals, characters, and words."
  },
  {
    q: "How do you write Morse code?",
    a: "Convert each character into its International Morse pattern. Separate characters and words correctly. A translator can automate this process."
  },
  {
    q: "Is Morse code hard to learn?",
    a: "The basics are manageable with regular practice. Start with a small group of characters, practice listening, then gradually increase the number of characters and the speed."
  },
  {
    q: "What is International Morse Code?",
    a: "International Morse Code is a standardized Morse system used for international communication applications. The ITU maintains Recommendation M.1677-1 for International Morse Code."
  },
  {
    q: "What does WPM mean in Morse code?",
    a: "WPM means words per minute. It is commonly used to describe Morse speed."
  },
  {
    q: "What is Farnsworth timing?",
    a: "Farnsworth timing sends individual characters at a faster character speed while adding more space between characters and words. It is commonly used as a Morse learning technique."
  },
  {
    q: "Can I learn Morse code with a translator?",
    a: "Yes. Use the translator to check answers, listen to characters, and study patterns. For stronger skills, practice receiving Morse without looking at written symbols."
  },
  {
    q: "Why does my Morse code translation look wrong?",
    a: "Check: 1. The dots and dashes, 2. Character spacing, 3. Word spacing, 4. Unsupported characters, 5. Unicode look-alike symbols, 6. The Morse standard, 7. Audio or image quality."
  },
  {
    q: "Can Morse code be sent as sound?",
    a: "Yes. Morse can be represented using short and long audio signals. Audio playback is also useful for learning Morse by sound."
  },
  {
    q: "Can Morse code be sent with light?",
    a: "Yes. Morse signals can be represented using short and long flashes."
  },
  {
    q: "Can Morse code be sent through vibration?",
    a: "Yes. Dots and dashes can be represented using different vibration durations. This is another way to represent the same basic signal structure."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="breakdown-section" id="faq">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div className="section-title">
          <HelpCircle className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2>Frequently Asked Questions About Morse Code</h2>
        </div>
        <p className="section-desc">
          Answers to common questions about translating, reading, writing, listening to, and learning International Morse Code.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'inherit' }}>{faq.q}</h3>
                {openIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {openIndex === idx && (
                <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
