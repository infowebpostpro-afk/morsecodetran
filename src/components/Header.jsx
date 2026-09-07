import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function Header({ theme, toggleTheme, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#translator" className="brand-logo" onClick={() => setActiveTab('translator')}>
          <div className="brand-logo-icon">
            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>◉</span>
          </div>
          <span>MorsePro</span>
        </a>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <a
              href="#translator"
              className={`nav-link ${activeTab === 'translator' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}
            >
              Translator
            </a>
          </li>
          <li>
            <a
              href="#morse-code-decoder"
              className={`nav-link ${activeTab === 'morsedecoder' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('morsedecoder'); }}
            >
              Morse Decoder
            </a>
          </li>
          <li>
            <a
              href="#decoder"
              className={`nav-link ${activeTab === 'decoder' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('decoder'); }}
            >
              Image/Audio Decoder
            </a>
          </li>
          <li>
            <a
              href="#keyer"
              className={`nav-link ${activeTab === 'keyer' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('keyer'); }}
            >
              Keyer
            </a>
          </li>
          <li>
            <a
              href="#alphabet"
              className={`nav-link ${activeTab === 'alphabet' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }}
            >
              Alphabet
            </a>
          </li>
          <li>
            <a
              href="#numbers"
              className={`nav-link ${activeTab === 'numbers' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('numbers'); }}
            >
              Numbers
            </a>
          </li>
          <li>
            <a
              href="#morse-to-english"
              className={`nav-link ${activeTab === 'morse2english' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('morse2english'); }}
            >
              Morse to English
            </a>
          </li>
          <li>
            <a
              href="#english-to-morse"
              className={`nav-link ${activeTab === 'english2morse' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('english2morse'); }}
            >
              English to Morse
            </a>
          </li>
          <li>
            <a
              href="#learn"
              className={`nav-link ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('learn'); }}
            >
              Learn
            </a>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none' }} // hidden on desktop via CSS or media query
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
