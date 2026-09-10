import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, Menu, X, ChevronDown, 
  Languages, Type, FileText, Activity, Image, 
  GraduationCap, BookOpen, Hash, Radio, Bookmark, Volume2
} from 'lucide-react';

const navigationConfig = [
  {
    label: 'Translator',
    items: [
      { label: 'Morse Code Translator', desc: 'Translate Morse Code and text in both directions.', tab: 'translator', href: '#translator', icon: Languages },
      { label: 'English to Morse', desc: 'Convert English text into International Morse Code.', tab: 'english2morse', href: '#english-to-morse', icon: Type },
      { label: 'Morse to English', desc: 'Convert Morse Code into readable English text.', tab: 'morse2english', href: '#morse-to-english', icon: FileText },
      { label: 'Morse Audio Translator', desc: 'Audio sound generator, WPM controls & audio decoder.', tab: 'audiotranslator', href: '#audio-translator', icon: Volume2 }
    ]
  },
  {
    label: 'Decode',
    items: [
      { label: 'Morse Code Decoder', desc: 'Decode dots and dashes into readable text.', tab: 'morsedecoder', href: '#morse-code-decoder', icon: Activity },
      { label: 'Morse Code Image Decoder', desc: 'Decode Morse code from photos, screenshots & pictures.', tab: 'imagedecoder', href: '#morse-code-image-decoder', icon: Image },
      { label: 'Image & Audio Decoder', desc: 'Decode Morse Code from images or audio.', tab: 'decoder', href: '#decoder', icon: Image }
    ]
  },
  {
    label: 'Learn',
    items: [
      { label: 'Learn Morse Code', desc: 'Learn Morse Code step by step with practical practice methods.', tab: 'learn', href: '#learn', icon: GraduationCap },
      { label: 'Morse Code Practice', desc: 'Interactive auditory listening trainer & drills.', tab: 'practice', href: '#morse-code-practice', icon: GraduationCap },
      { label: 'How to Read Morse Code', desc: 'Learn how to decode Morse code by sight and sound.', tab: 'howtoread', href: '#how-to-read', icon: BookOpen },
      { label: 'What is Morse Code', desc: 'Definition, technical specs, timing ratios & applications.', tab: 'whatismorse', href: '#what-is-morse', icon: BookOpen },
      { label: 'History of Morse Code', desc: 'Timeline from Samuel Morse to modern telecommunications.', tab: 'history', href: '#history', icon: BookOpen }
    ]
  },
  {
    label: 'Reference',
    items: [
      { label: 'Morse Code Alphabet', desc: 'Explore A–Z Morse Code letters and patterns.', tab: 'alphabet', href: '#alphabet', icon: Type },
      { label: 'Morse Code Numbers', desc: 'Learn and reference Morse Code numbers 0–9.', tab: 'numbers', href: '#numbers', icon: Hash },
      { label: 'Morse Code Symbols', desc: 'Reference Morse Code punctuation, special signs & ITU symbols.', tab: 'symbols', href: '#symbols', icon: Bookmark },
      { label: 'Morse Code Phrases', desc: 'Popular expressions, greetings, romantic & radio calls.', tab: 'phrases', href: '#phrases', icon: FileText },
      { label: 'SOS in Morse Code', desc: 'Distress signal pattern, history, flashlight transmission.', tab: 'sos', href: '#sos', icon: Bookmark },
      { label: 'I Love You in Morse', desc: 'Sound, letter breakdown & copyable pattern.', tab: 'iloveyou', href: '#iloveyou', icon: Bookmark },
      { label: 'Amateur Radio CW', desc: 'Continuous Wave ham radio guide, prosigns & Q-codes.', tab: 'amateurradio', href: '#amateur-radio', icon: Radio }
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Telegraph Keyer', desc: 'Practice sending Morse Code with a telegraph key.', tab: 'keyer', href: '#keyer', icon: Radio }
    ]
  }
];

export function Header({ theme, toggleTheme, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpenSections, setMobileOpenSections] = useState({});
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleMobileSection = (label) => {
    setMobileOpenSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Helper to check if a category is active based on its children
  const isCategoryActive = (category) => {
    return category.items.some(item => item.tab === activeTab);
  };

  return (
    <header className="navbar" ref={headerRef}>
      <div className="nav-container">
        <a href="#translator" className="brand-logo" onClick={(e) => handleTabClick(e, 'translator')}>
          <div className="brand-logo-icon">
            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>◉</span>
          </div>
          <span>MorsePro</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="desktop-nav-list">
            {navigationConfig.map((category) => {
              const isActive = isCategoryActive(category);
              const isOpen = openDropdown === category.label;
              return (
                <li key={category.label} className="nav-item">
                  <button
                    className={`nav-button ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                    onClick={() => setOpenDropdown(isOpen ? null : category.label)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {category.label}
                    <ChevronDown size={14} className="dropdown-icon" />
                  </button>

                  {isOpen && (
                    <div className="dropdown-menu">
                      <ul>
                        {category.items.map((item) => {
                          const isItemActive = activeTab === item.tab;
                          const Icon = item.icon;
                          return (
                            <li key={item.tab}>
                              <a
                                href={item.href}
                                className={`dropdown-item ${isItemActive ? 'active' : ''}`}
                                onClick={(e) => handleTabClick(e, item.tab)}
                                aria-current={isItemActive ? 'page' : undefined}
                              >
                                <div className="dropdown-item-icon">
                                  <Icon size={18} />
                                </div>
                                <div className="dropdown-item-content">
                                  <span className="dropdown-item-title">{item.label}</span>
                                  <span className="dropdown-item-desc">{item.desc}</span>
                                </div>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className="btn-icon mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav" aria-label="Mobile Navigation">
            <ul className="mobile-nav-list">
              {navigationConfig.map((category) => {
                const isActive = isCategoryActive(category);
                const isOpen = mobileOpenSections[category.label];
                return (
                  <li key={category.label} className="mobile-nav-item">
                    <button
                      className={`mobile-nav-button ${isActive ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                      onClick={() => toggleMobileSection(category.label)}
                      aria-expanded={isOpen}
                    >
                      <span>{category.label}</span>
                      <ChevronDown size={16} className={`mobile-dropdown-icon ${isOpen ? 'open' : ''}`} />
                    </button>
                    
                    {isOpen && (
                      <ul className="mobile-dropdown-list">
                        {category.items.map((item) => {
                          const isItemActive = activeTab === item.tab;
                          return (
                            <li key={item.tab}>
                              <a
                                href={item.href}
                                className={`mobile-dropdown-item ${isItemActive ? 'active' : ''}`}
                                onClick={(e) => handleTabClick(e, item.tab)}
                                aria-current={isItemActive ? 'page' : undefined}
                              >
                                {item.label}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
