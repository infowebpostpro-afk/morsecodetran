import React from 'react';
import { HelpCircle, CheckCircle, Radio, Sparkles, Award } from 'lucide-react';

export function LearnSection() {
  return (
    <section className="breakdown-section" id="learn">
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div className="section-title">
          <Award className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>Understanding Morse Code & Technical Standards</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
              What Is Morse Code?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Morse Code is a character encoding scheme that represents text characters as standardized sequences of two different signal durations: short signals called <strong>dits (.)</strong> and long signals called <strong>dashes (-)</strong>. Invented by Samuel Morse and Alfred Vail in the 1830s for telegraphy, it remains widely used in aviation, maritime communications, and amateur CW radio.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '1.5rem 0 0.5rem', color: 'var(--accent-primary)' }}>
              International Standard (ITU-R M.1677-1)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Our translator adheres strictly to the official International Telecommunication Union standard (ITU-R M.1677-1). Under this standard:
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li>1 Dash (-) equals exactly 3 Dits (.) in length.</li>
              <li>Spacing between dits and dashes inside a letter = 1 Dit duration.</li>
              <li>Spacing between letters within a word = 3 Dits duration.</li>
              <li>Spacing between complete words = 7 Dits duration (indicated by / slash).</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
              What Is Farnsworth Timing?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Developed by Donald R. Farnsworth, the Farnsworth method keeps character tones playing at high speed (e.g. 20 WPM) while inserting extra spacing between characters and words. This prevents beginners from counting dots and dashes in their head and instead trains the brain to recognize the natural musical rhythm of whole letters.
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '1.5rem 0 0.5rem', color: 'var(--accent-primary)' }}>
              How to Use the Translator
            </h3>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <li><strong>Enter Text or Morse:</strong> Type English text or paste Morse dots and dashes.</li>
              <li><strong>Auto Detection:</strong> The system automatically recognizes your input direction.</li>
              <li><strong>Listen & Breakdown:</strong> Play synchronized audio or click character cards.</li>
              <li><strong>Copy & Export:</strong> Copy results or download custom WAV audio files.</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
