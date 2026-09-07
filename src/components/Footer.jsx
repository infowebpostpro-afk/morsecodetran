import React from 'react';
import { Radio, ShieldCheck } from 'lucide-react';

export function Footer({ setActiveTab }) {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          <Radio size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>MorsePro Translator</span>
        </div>

        <ul className="footer-links">
          <li><a href="#translator" onClick={() => setActiveTab('translator')}>Translator</a></li>
          <li><a href="#morse-code-decoder" onClick={() => setActiveTab('morsedecoder')}>Morse Decoder</a></li>
          <li><a href="#decoder" onClick={() => setActiveTab('decoder')}>Image & Audio Decoder</a></li>
          <li><a href="#keyer" onClick={() => setActiveTab('keyer')}>Telegraph Keyer</a></li>
          <li><a href="#alphabet" onClick={() => setActiveTab('alphabet')}>Morse Alphabet</a></li>
          <li><a href="#numbers" onClick={() => setActiveTab('numbers')}>Morse Numbers</a></li>
          <li><a href="#morse-to-english" onClick={() => setActiveTab('morse2english')}>Morse to English</a></li>
          <li><a href="#english-to-morse" onClick={() => setActiveTab('english2morse')}>English to Morse</a></li>
          <li><a href="#learn" onClick={() => setActiveTab('learn')}>Learn Morse</a></li>
        </ul>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.85rem', borderRadius: '999px', margin: '0.5rem 0 1rem' }}>
          <ShieldCheck size={14} /> 100% Client-Side Privacy Guarantee — No server logs or data collection
        </div>

        <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
          Strictly compliant with International Telecommunication Union Standard ITU-R M.1677-1. Designed for students, ham radio CW operators, audio engineers, and Morse code learners.
        </p>
      </div>
    </footer>
  );
}
