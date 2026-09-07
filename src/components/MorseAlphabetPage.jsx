import React, { useState } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { audioEngine } from '../engine/audioEngine.js';

export function MorseAlphabetPage({ wpm, setWpm, frequency, volume, onTranslateCharacter, showToast, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('letter'); // letter, number, punctuation, prosign, all
  const [selectedChar, setSelectedChar] = useState(null);

  // Play A-Z Sequence State
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [playingCharKey, setPlayingCharKey] = useState(null);

  // Filter entries based on category & search query
  const entries = Object.entries(MORSE_CODE_MAP);

  const filteredEntries = entries.filter(([char, data]) => {
    // Category filter
    if (category !== 'all' && data.type !== category) {
      return false;
    }

    // Search query
    const q = search.toLowerCase().trim();
    if (!q) return true;

    const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;

    return (
      displayChar.toLowerCase().includes(q) ||
      data.name.toLowerCase().includes(q) ||
      data.morse.includes(q) ||
      (data.phonetic && data.phonetic.toLowerCase().includes(q)) ||
      (data.ditDah && data.ditDah.toLowerCase().includes(q))
    );
  });

  // Individual Character Audio Playback
  const handlePlaySingle = (char, morse) => {
    setPlayingCharKey(char);
    audioEngine.playSequence({
      breakdown: [{ char, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setPlayingCharKey(null);
        }
      }
    });
  };

  // Copy Morse code to clipboard
  const handleCopyMorse = async (morse, label) => {
    try {
      await navigator.clipboard.writeText(morse);
      showToast(`Copied ${label} Morse (${morse}) ✓`);
    } catch (e) {
      showToast('Copy failed. Please copy manually.');
    }
  };

  // Play A-Z Sequential Player
  const handlePlayAZSequence = () => {
    const letters = entries.filter(([_, d]) => d.type === 'letter');
    if (letters.length === 0) return;

    setIsPlayingSeq(true);
    setIsPausedSeq(false);

    const breakdownSequence = letters.map(([char, data]) => ({
      char,
      morse: data.morse,
      isSpace: false
    }));

    audioEngine.playSequence({
      breakdown: breakdownSequence,
      wpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex, isEnded }) => {
        if (isEnded) {
          setIsPlayingSeq(false);
          setIsPausedSeq(false);
          setPlayingCharKey(null);
          return;
        }

        if (activeCharIndex >= 0 && activeCharIndex < letters.length) {
          setPlayingCharKey(letters[activeCharIndex][0]);
        }
      }
    });
  };

  const handleStopSequence = () => {
    audioEngine.stop();
    setIsPlayingSeq(false);
    setIsPausedSeq(false);
    setPlayingCharKey(null);
  };

  // FAQs State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const alphabetFaqs = [
    {
      q: "What is the Morse code alphabet?",
      a: "The Morse code alphabet represents the basic English letters A–Z with combinations of dots and dashes. The wider International Morse Code system also includes digits, punctuation, and other signals."
    },
    {
      q: "What is A in Morse code?",
      a: "A is .- in Morse code. It is one dot followed by one dash."
    },
    {
      q: "What is B in Morse code?",
      a: "B is -... in Morse code. It is one dash followed by three dots."
    },
    {
      q: "What is C in Morse code?",
      a: "C is -.-. in Morse code. It contains four signal elements."
    },
    {
      q: "What is S in Morse code?",
      a: "S is ... in Morse code. It contains three dots."
    },
    {
      q: "What is SOS in Morse code?",
      a: "SOS is ...---... as a continuous distress signal. The signal contains three dots, three dashes, and three dots without character gaps between the three groups. SOS is a standardized distress signal. It is not an abbreviation for 'Save Our Souls' or 'Save Our Ship'."
    },
    {
      q: "What is the easiest Morse code letter to learn?",
      a: "E and T are the shortest Morse code letters. E is . and T is -. They are useful starting points for beginners."
    },
    {
      q: "How many letters are in the Morse code alphabet?",
      a: "The basic English Morse alphabet has 26 letters, from A to Z. The wider International Morse Code system also includes digits, punctuation, and additional characters."
    },
    {
      q: "Does Morse code have uppercase and lowercase letters?",
      a: "No. Morse code does not use separate patterns for uppercase and lowercase letters. For example: A = .- and a = .-."
    },
    {
      q: "What do dit and dah mean?",
      a: "Dit is the common spoken term for a Morse dot. Dah is the common spoken term for a Morse dash. A dah lasts three times as long as a dit under standard Morse timing."
    },
    {
      q: "How do you read Morse code?",
      a: "Learn the pattern for each character. Then practice recognizing those patterns by sight and sound. For audio Morse, focus on the complete rhythm instead of counting every dot and dash."
    },
    {
      q: "What is the Morse code timing rule?",
      a: "Standard Morse timing uses: Dot = 1 unit, Dash = 3 units, Element gap = 1 unit, Character gap = 3 units, Word gap = 7 units. These timing relationships are documented by ARRL."
    },
    {
      q: "What is the difference between a dot and a dash?",
      a: "A dot is the short Morse signal. A dash is three times as long as a dot under standard timing. The difference is based on duration, not simply volume."
    },
    {
      q: "What is Farnsworth Morse code?",
      a: "Farnsworth timing uses faster character timing with additional spacing between characters and words. It gives learners more time to recognize each character while keeping the individual characters at a useful speed."
    },
    {
      q: "Can I translate Morse code into English?",
      a: "Yes. A Morse code decoder can convert Morse patterns into readable text. For example: .... . .-.. .-.. --- becomes HELLO. Use the Morse Code Translator to decode complete messages."
    },
    {
      q: "Can I convert English into Morse code?",
      a: "Yes. A Morse code translator can convert English text into Morse code. For example: HELLO becomes .... . .-.. .-.. ---."
    },
    {
      q: "What is the Morse code for numbers?",
      a: "The ten Morse digits are: 0 = -----, 1 = .----, 2 = ..---, 3 = ...--, 4 = ....-, 5 = ....., 6 = -...., 7 = --..., 8 = ---.., 9 = ----.."
    },
    {
      q: "What is the Morse code for a space?",
      a: "A space between words is not represented by another dot or dash. Instead, standard Morse timing uses a 7-unit gap between words. In written Morse, a slash is often used to make word boundaries easier to see. For example: .... . .-.. .-.. --- / .-- --- .-. .-.. -.. means HELLO WORLD."
    },
    {
      q: "Where is Morse code still used?",
      a: "Morse code remains relevant in some radiocommunication services, including amateur and amateur-satellite communication. It is also used for training, education, hobbies, puzzles, and creative projects."
    },
    {
      q: "How long does it take to learn Morse code?",
      a: "There is no fixed learning time. You can learn the basic alphabet relatively quickly, but reliable audio recognition takes practice. Short, regular sessions are more useful than trying to memorize all 26 letters at once."
    },
    {
      q: "Should I learn Morse code by reading dots and dashes?",
      a: "Dots and dashes are useful for reference. If your goal is audio recognition, you should also practice listening. The long-term goal is to hear a character and recognize it without counting every signal."
    },
    {
      q: "Can I practice Morse code online?",
      a: "Yes. An online Morse code tool can help you convert text to Morse, decode Morse to text, hear Morse audio, adjust speed, practice individual characters, and check your answers. Our Morse Code Translator is designed for these tasks."
    },
    {
      q: "Is Morse code the same in every country?",
      a: "International Morse Code is intended for international use. Historical systems such as American Morse used different character assignments. This page uses International Morse Code as its primary reference."
    },
    {
      q: "Is Morse code a language?",
      a: "Morse code is better described as an encoding and signaling system. It represents letters, numbers, punctuation, and other signals through timed combinations of short and long elements."
    }
  ];

  return (
    <div className="alphabet-page-container">

      {/* BREADCRUMB */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">Morse Code Alphabet</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title">Morse Code Alphabet: A–Z Letters, Numbers & Symbols</h1>
        <p className="alphabet-subtitle">
          Learn Morse Code from A to Z with an interactive alphabet chart, audio signals, numbers, symbols, timing rules, and simple memorization tips.
        </p>
      </section>

      {/* INTERACTIVE ALPHABET TOOL CONTAINER */}
      <section className="alphabet-tool-card">

        {/* TOOL TOPBAR: Search, Category Tabs & Controls */}
        <div className="tool-controls-bar">

          {/* REAL-TIME SEARCH FIELD */}
          <div className="alphabet-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search letter, Morse (e.g. .-), NATO (e.g. Alpha), or rhythm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="alphabet-search-input"
            />
            {search && (
              <button className="search-clear-btn" onClick={() => setSearch('')} title="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* ACTION BUTTONS & WPM SELECTOR */}
          <div className="tool-actions-group">
            {/* Play A-Z Sequence Button */}
            {isPlayingSeq ? (
              <button className="btn-seq-cta playing" onClick={handleStopSequence}>
                <Square size={14} /> Stop A–Z
              </button>
            ) : (
              <button className="btn-seq-cta" onClick={handlePlayAZSequence}>
                <Play size={14} fill="currentColor" /> Play A–Z Audio
              </button>
            )}

            {/* WPM Speed Selector */}
            <div className="wpm-mini-selector">
              <span className="wpm-lbl">Speed:</span>
              <select
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
                className="wpm-select"
              >
                <option value={10}>10 WPM</option>
                <option value={15}>15 WPM</option>
                <option value={20}>20 WPM</option>
                <option value={25}>25 WPM</option>
                <option value={30}>30 WPM</option>
                <option value={35}>35 WPM</option>
                <option value={40}>40 WPM</option>
              </select>
            </div>
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="category-tabs">
          <button
            className={`cat-tab ${category === 'letter' ? 'active' : ''}`}
            onClick={() => setCategory('letter')}
          >
            Letters A–Z ({entries.filter(([_, d]) => d.type === 'letter').length})
          </button>
          <button
            className={`cat-tab ${category === 'number' ? 'active' : ''}`}
            onClick={() => setCategory('number')}
          >
            Numbers 0–9 ({entries.filter(([_, d]) => d.type === 'number').length})
          </button>
          <button
            className={`cat-tab ${category === 'punctuation' ? 'active' : ''}`}
            onClick={() => setCategory('punctuation')}
          >
            Punctuation ({entries.filter(([_, d]) => d.type === 'punctuation').length})
          </button>
          <button
            className={`cat-tab ${category === 'prosign' ? 'active' : ''}`}
            onClick={() => setCategory('prosign')}
          >
            Prosigns ({entries.filter(([_, d]) => d.type === 'prosign').length})
          </button>
          <button
            className={`cat-tab ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            All Characters ({entries.length})
          </button>
        </div>

        {/* CHARACTER CARDS GRID */}
        {filteredEntries.length > 0 ? (
          <div className="alphabet-cards-grid">
            {filteredEntries.map(([char, data]) => {
              const isPlayingThis = playingCharKey === char;
              const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;

              // Dot/Dash visual bar helper
              const visualBars = data.morse
                .replace(/\./g, '· ')
                .replace(/-/g, '━ ');

              return (
                <div
                  key={char}
                  className={`alphabet-card ${isPlayingThis ? 'playing-glow' : ''} ${selectedChar?.char === char ? 'selected' : ''}`}
                  onClick={() => setSelectedChar({ char, data })}
                >
                  <div className="card-top">
                    <span className="char-badge">{displayChar}</span>
                    {data.phonetic && <span className="nato-tag">{data.phonetic}</span>}
                  </div>

                  <div className="card-morse-code morse-font">
                    {data.morse}
                  </div>

                  <div className="card-visual-bars">
                    {visualBars}
                  </div>

                  <div className="card-rhythm">
                    {data.ditDah}
                  </div>

                  <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="card-btn btn-play"
                      onClick={() => handlePlaySingle(char, data.morse)}
                      title={`Play Morse sound for ${data.name}`}
                    >
                      <Volume2 size={14} className={isPlayingThis ? 'anim-pulse' : ''} />
                    </button>
                    <button
                      className="card-btn btn-copy"
                      onClick={() => handleCopyMorse(data.morse, displayChar)}
                      title={`Copy Morse code for ${displayChar}`}
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-results-box">
            <p>No matching Morse character found for "<strong>{search}</strong>".</p>
            <button className="btn-secondary-action" onClick={() => setSearch('')}>
              Clear Search Filter
            </button>
          </div>
        )}

      </section>

      {/* CHARACTER DETAIL DRAWER / MODAL */}
      {selectedChar && (
        <div className="detail-modal-overlay" onClick={() => setSelectedChar(null)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedChar(null)} title="Close detail view">
              <X size={18} />
            </button>

            <div className="modal-header">
              <div className="modal-char-avatar">
                {selectedChar.char.startsWith('<') ? selectedChar.char.replace(/^<|>/g, '') : selectedChar.char}
              </div>
              <div>
                <h3 className="modal-title">{selectedChar.data.name}</h3>
                {selectedChar.data.phonetic && (
                  <span className="modal-subtitle">NATO Phonetic: <strong>{selectedChar.data.phonetic}</strong></span>
                )}
              </div>
            </div>

            <div className="modal-body-grid">
              <div className="detail-metric-card">
                <span className="metric-label">Morse Pattern</span>
                <span className="metric-val morse-font">{selectedChar.data.morse}</span>
              </div>
              <div className="detail-metric-card">
                <span className="metric-label">Visual Bars</span>
                <span className="metric-val">{selectedChar.data.morse.replace(/\./g, '· ').replace(/-/g, '━ ')}</span>
              </div>
              <div className="detail-metric-card">
                <span className="metric-label">Spoken Rhythm</span>
                <span className="metric-val" style={{ fontSize: '1rem', fontStyle: 'italic' }}>{selectedChar.data.ditDah}</span>
              </div>
              <div className="detail-metric-card">
                <span className="metric-label">Character Standard</span>
                <span className="metric-val" style={{ fontSize: '0.85rem' }}>ITU-R M.1677-1</span>
              </div>
            </div>

            <div className="modal-actions-bar">
              <button
                className="btn-primary-cta"
                onClick={() => handlePlaySingle(selectedChar.char, selectedChar.data.morse)}
              >
                <Volume2 size={15} /> Play Sound
              </button>
              <button
                className="btn-secondary-action"
                onClick={() => handleCopyMorse(selectedChar.data.morse, selectedChar.char)}
              >
                <Copy size={14} /> Copy Morse
              </button>
              <button
                className="btn-secondary-action"
                onClick={() => {
                  const targetChar = selectedChar.char.startsWith('<') ? selectedChar.char.replace(/^<|>/g, '') : selectedChar.char;
                  onTranslateCharacter(targetChar);
                  setSelectedChar(null);
                }}
                style={{ borderColor: 'var(--primary)', color: 'var(--signal-bright)' }}
              >
                <ArrowRight size={14} /> Translate "{selectedChar.char}"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATIONAL SEO CONTENT SECTION */}
      <article className="seo-article-container">
        <div className="article-body-content">

          <p>
            You may know that Morse code uses dots and dashes, but finding the correct pattern for one letter can still be frustrating. A search for “A in Morse code” or “Morse code alphabet” often gives you a basic chart without explaining how to hear the pattern, remember it, or use it in a real message. Similar patterns such as <strong>A <code className="morse-font">.-</code></strong> and <strong>N <code className="morse-font">-.</code></strong> can also be easy to mix up when you are learning.
          </p>

          <p>
            That is why this Morse Code Alphabet guide is built as a practical reference for our <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Morse Code Translator</a>. It brings the A–Z alphabet, numbers, symbols, timing rules, learning patterns, and examples together in one place. You can use it to find a character quickly, understand how Morse works, and practice until the patterns become familiar.
          </p>

          {/* H2: Explore the International Morse Code Alphabet */}
          <section className="content-section">
            <h2>Explore the International Morse Code Alphabet</h2>
            <p>
              The <strong>Morse code alphabet</strong> represents the 26 basic English letters with combinations of dots and dashes. The wider International Morse Code system also includes numbers, punctuation, and other signals.
            </p>

            <p>Here is the complete A–Z reference:</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Letter</th>
                    <th>Morse Code</th>
                    <th>Letter</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td><code className="morse-font">.-</code></td><td>N</td><td><code className="morse-font">-.</code></td></tr>
                  <tr><td>B</td><td><code className="morse-font">-...</code></td><td>O</td><td><code className="morse-font">---</code></td></tr>
                  <tr><td>C</td><td><code className="morse-font">-.-.</code></td><td>P</td><td><code className="morse-font">.--.</code></td></tr>
                  <tr><td>D</td><td><code className="morse-font">-..</code></td><td>Q</td><td><code className="morse-font">--.-</code></td></tr>
                  <tr><td>E</td><td><code className="morse-font">.</code></td><td>R</td><td><code className="morse-font">.-.</code></td></tr>
                  <tr><td>F</td><td><code className="morse-font">..-.</code></td><td>S</td><td><code className="morse-font">...</code></td></tr>
                  <tr><td>G</td><td><code className="morse-font">--.</code></td><td>T</td><td><code className="morse-font">-</code></td></tr>
                  <tr><td>H</td><td><code className="morse-font">....</code></td><td>U</td><td><code className="morse-font">..-</code></td></tr>
                  <tr><td>I</td><td><code className="morse-font">..</code></td><td>V</td><td><code className="morse-font">...-</code></td></tr>
                  <tr><td>J</td><td><code className="morse-font">.---</code></td><td>W</td><td><code className="morse-font">.--</code></td></tr>
                  <tr><td>K</td><td><code className="morse-font">-.-</code></td><td>X</td><td><code className="morse-font">-..-</code></td></tr>
                  <tr><td>L</td><td><code className="morse-font">.-..</code></td><td>Y</td><td><code className="morse-font">-.--</code></td></tr>
                  <tr><td>M</td><td><code className="morse-font">--</code></td><td>Z</td><td><code className="morse-font">--..</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>
              These character mappings follow International Morse Code as specified by the International Telecommunication Union (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">ITU-R Recommendation M.1677-1 <ExternalLink size={12} /></a>).
            </p>

            <p>
              If you only need one letter, use the table as a quick reference. If you are learning Morse code, listen to each character and practice recognizing its complete rhythm.
            </p>

            <p>For example:</p>
            <ul className="content-list">
              <li><strong>A</strong> = <code className="morse-font">.-</code></li>
              <li><strong>B</strong> = <code className="morse-font">-...</code></li>
              <li><strong>C</strong> = <code className="morse-font">-.-.</code></li>
              <li><strong>S</strong> = <code className="morse-font">...</code></li>
              <li><strong>T</strong> = <code className="morse-font">-</code></li>
            </ul>

            <p>
              You can also enter a Morse pattern into a translator to find the character it represents. For example, <code className="morse-font">.-..</code> is <strong>L</strong>.
            </p>
          </section>

          {/* H2: The Morse Code Alphabet (A–Z) */}
          <section className="content-section">
            <h2>The Morse Code Alphabet (A–Z)</h2>
            <p>Morse code does not use the same number of signals for every letter.</p>

            <p>Some characters are very short:</p>
            <ul className="content-list">
              <li>E = <code className="morse-font">.</code></li>
              <li>T = <code className="morse-font">-</code></li>
              <li>I = <code className="morse-font">..</code></li>
              <li>M = <code className="morse-font">--</code></li>
            </ul>

            <p>Others contain longer patterns:</p>
            <ul className="content-list">
              <li>H = <code className="morse-font">....</code></li>
              <li>J = <code className="morse-font">.---</code></li>
              <li>Q = <code className="morse-font">--.-</code></li>
              <li>Z = <code className="morse-font">--..</code></li>
            </ul>

            <p>This structure gives you useful patterns to remember instead of treating all 26 letters as unrelated codes.</p>

            <p>
              Morse code also does not have separate patterns for uppercase and lowercase letters. <strong>A</strong> and <strong>a</strong> use the same Morse code: <code className="morse-font">.-</code>
            </p>

            <p>The basic relationship is:</p>
            <p className="code-example-box">
              <strong>Letter → Morse pattern → sound</strong>
            </p>

            <p>For example:</p>
            <ul className="content-list">
              <li><strong>A → <code className="morse-font">.-</code></strong></li>
              <li><strong>N → <code className="morse-font">-.</code></strong></li>
            </ul>

            <p>These two characters use the same two elements in reverse order.</p>
          </section>

          {/* FIGURE 1: TRANSLATOR INTERFACE SCREENSHOT */}
          <figure className="article-figure">
            <img
              src="/images/morse-code-translator-interface.webp"
              alt="Live Morse Code Translator user interface showing text to Morse translation and interactive character playback"
              className="article-img"
              loading="lazy"
            />
            <figcaption className="article-figcaption">
              Figure 1: Live Morse Code Translator interface showing real-time text to Morse code translation and instant audio controls.
            </figcaption>
          </figure>

          {/* H2: How the Morse Code Alphabet Works */}
          <section className="content-section">
            <h2>How the Morse Code Alphabet Works</h2>
            <p>Morse code represents characters with short and long signals.</p>

            <p>A <strong>dot</strong> is the short signal.</p>
            <p>A <strong>dash</strong> is the long signal.</p>

            <p>
              In spoken Morse terminology, a dot is commonly called a <strong>dit</strong>, while a dash is called a <strong>dah</strong>. A dash lasts three times as long as a dot under standard timing. It is not a louder signal. It is a longer signal.
            </p>

            <p>
              Morse code can be sent through sound, light, or other timed signals. It is best described as an encoding and signaling system rather than a spoken language.
            </p>

            {/* H3: Dots and dashes use fixed timing units */}
            <h3>Dots and dashes use fixed timing units</h3>
            <p>Timing is an essential part of Morse code.</p>

            <p>Under standard Morse timing:</p>
            <ul className="content-list">
              <li>A dot lasts <strong>1 unit</strong>.</li>
              <li>A dash lasts <strong>3 units</strong>.</li>
              <li>The gap between elements inside one character is <strong>1 unit</strong>.</li>
              <li>The gap between characters is <strong>3 units</strong>.</li>
              <li>The gap between words is <strong>7 units</strong>.</li>
            </ul>

            <p>
              <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">ARRL <ExternalLink size={12} /></a> documents this 1-3-1-3-7 timing structure and uses the standard PARIS word for Morse speed calculations.
            </p>

            <p>For example: <code className="morse-font">.-</code> represents <strong>A</strong>.</p>
            <p>The dot and dash are separated by a one-unit gap. That gap is part of the timing pattern.</p>
            <p>Morse code therefore uses both <strong>signals and silence</strong>. The pauses help the listener separate elements, letters, and words.</p>

            {/* H3: Hear each character as one rhythm */}
            <h3>Hear each character as one rhythm</h3>
            <p>A common beginner mistake is to count every dot and dash.</p>
            <p>That can help when checking a written chart, but it is not the best long-term way to recognize Morse by sound.</p>

            <p>For example: <code className="morse-font">...</code> should eventually sound like <strong>S</strong> without requiring you to think: <em>dot + dot + dot = S</em>.</p>
            <p>The goal is to hear the complete character as one rhythm.</p>
            <p>This becomes more important as Morse speed increases. ARRL learning material emphasizes sound-based character recognition rather than relying only on visual dots and dashes.</p>
            <p>
              If your goal is to learn Morse for listening, use the audio controls in your <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Morse Code Translator</a> and practice recognizing characters before looking at the answer.
            </p>

            {/* H3: Letters and words need longer gaps */}
            <h3>Letters and words need longer gaps</h3>
            <p>Morse code uses different lengths of silence to separate its parts.</p>
            <p>Consider: <code className="morse-font">... --- ...</code></p>
            <p>This contains three characters:</p>
            <ul className="content-list">
              <li><code className="morse-font">...</code> = S</li>
              <li><code className="morse-font">---</code> = O</li>
              <li><code className="morse-font">...</code> = S</li>
            </ul>
            <p>The gap inside one character is short.</p>
            <p>The gap between letters is longer.</p>
            <p>The gap between words is longer still.</p>
            <p>This timing is part of the code. If the spacing is wrong, separate characters can run together and become difficult to recognize.</p>
          </section>

          {/* H2: Numbers 0–9 */}
          <section className="content-section">
            <h2>Numbers 0–9</h2>
            <p>International Morse Code also includes ten digits.</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right' }}>Number</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ textAlign: 'right' }}>0</td><td><code className="morse-font">-----</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>1</td><td><code className="morse-font">.----</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>2</td><td><code className="morse-font">..---</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>3</td><td><code className="morse-font">...--</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>4</td><td><code className="morse-font">....-</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>5</td><td><code className="morse-font">.....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>6</td><td><code className="morse-font">-....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>7</td><td><code className="morse-font">--...</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>8</td><td><code className="morse-font">---..</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>9</td><td><code className="morse-font">----.</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>The numbers have a useful pattern.</p>
            <p>Start with: <strong>5 = <code className="morse-font">.....</code></strong></p>
            <p>Moving toward 0 adds dashes:</p>
            <ul className="content-list">
              <li>4 = <code className="morse-font">....-</code></li>
              <li>3 = <code className="morse-font">...--</code></li>
              <li>2 = <code className="morse-font">..---</code></li>
              <li>1 = <code className="morse-font">.----</code></li>
              <li>0 = <code className="morse-font">-----</code></li>
            </ul>

            <p>The pattern then continues from 5 toward 9:</p>
            <ul className="content-list">
              <li>6 = <code className="morse-font">-....</code></li>
              <li>7 = <code className="morse-font">--...</code></li>
              <li>8 = <code className="morse-font">---..</code></li>
              <li>9 = <code className="morse-font">----.</code></li>
            </ul>

            <p>This makes the digits easier to learn as a group.</p>
            <p>
              For a dedicated reference, see <a href="/morse-code-numbers/" onClick={(e) => { e.preventDefault(); setCategory('number'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Morse Code Numbers</a>.
            </p>
          </section>

          {/* H2: Punctuation & Prosigns */}
          <section className="content-section">
            <h2>Punctuation & Prosigns</h2>
            <p>Morse code is not limited to letters and numbers. International Morse Code also defines punctuation and other signals.</p>

            <p>Common punctuation includes:</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Period <code>.</code></td><td><code className="morse-font">.-.-.-</code></td></tr>
                  <tr><td>Comma <code>,</code></td><td><code className="morse-font">--..--</code></td></tr>
                  <tr><td>Question mark <code>?</code></td><td><code className="morse-font">..--..</code></td></tr>
                  <tr><td>Apostrophe <code>'</code></td><td><code className="morse-font">.----.</code></td></tr>
                  <tr><td>Exclamation mark <code>!</code></td><td><code className="morse-font">-.-.--</code></td></tr>
                  <tr><td>Slash <code>/</code></td><td><code className="morse-font">-..-.</code></td></tr>
                  <tr><td>Left parenthesis <code>(</code></td><td><code className="morse-font">-.--.</code></td></tr>
                  <tr><td>Right parenthesis <code>)</code></td><td><code className="morse-font">-.--.-</code></td></tr>
                  <tr><td>Ampersand <code>&</code></td><td><code className="morse-font">.-...</code></td></tr>
                  <tr><td>Colon <code>:</code></td><td><code className="morse-font">---...</code></td></tr>
                  <tr><td>Semicolon <code>;</code></td><td><code className="morse-font">-.-.-.</code></td></tr>
                  <tr><td>Hyphen <code>-</code></td><td><code className="morse-font">-....-</code></td></tr>
                  <tr><td>Underscore <code>_</code></td><td><code className="morse-font">..--.-</code></td></tr>
                  <tr><td>Plus <code>+</code></td><td><code className="morse-font">.-.-.</code></td></tr>
                  <tr><td>Equals <code>=</code></td><td><code className="morse-font">-...-</code></td></tr>
                  <tr><td>Quotation mark <code>"</code></td><td><code className="morse-font">.-..-.</code></td></tr>
                  <tr><td>Dollar sign <code>$</code></td><td><code className="morse-font">...-..-</code></td></tr>
                  <tr><td>At sign <code>@</code></td><td><code className="morse-font">.--.-.</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>
              A <strong>prosign</strong> is a special Morse signal used as one operational unit. It can represent a procedure or communication instruction rather than an ordinary letter.
            </p>
            <p>For example, <strong>AR</strong> is commonly represented as: <code className="morse-font">.-.-.</code></p>
            <p>The exact use of special signals depends on the communication context. The ITU specification provides the formal International Morse character and operational provisions.</p>
            <p>
              For a broader reference, see <a href="/morse-code-symbols/" onClick={(e) => { e.preventDefault(); setCategory('punctuation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Morse Code Symbols</a>.
            </p>
          </section>

          {/* H2: Useful Patterns in Letters and Numbers */}
          <section className="content-section">
            <h2>Useful Patterns in Letters and Numbers</h2>
            <p>You do not need to memorize all 26 letters as unrelated codes. Morse code has several patterns that make learning easier.</p>

            {/* H3: E and T are the roots */}
            <h3>E and T are the roots</h3>
            <p>The two shortest Morse letters are:</p>
            <ul className="content-list">
              <li><strong>E = <code className="morse-font">.</code></strong></li>
              <li><strong>T = <code className="morse-font">-</code></strong></li>
            </ul>
            <p>These provide a simple starting point for understanding other characters.</p>

            <p>For example:</p>
            <p><strong>Dot family</strong></p>
            <ul className="content-list">
              <li>E = <code className="morse-font">.</code></li>
              <li>I = <code className="morse-font">..</code></li>
              <li>S = <code className="morse-font">...</code></li>
              <li>H = <code className="morse-font">....</code></li>
            </ul>

            <p><strong>Dash family</strong></p>
            <ul className="content-list">
              <li>T = <code className="morse-font">-</code></li>
              <li>M = <code className="morse-font">--</code></li>
              <li>O = <code className="morse-font">---</code></li>
            </ul>

            <p>Other characters branch from these basic patterns. This gives you a logical way to learn the alphabet instead of memorizing 26 separate facts.</p>

            {/* H3: Numbers progress in order */}
            <h3>Numbers progress in order</h3>
            <p>The number pattern is easiest to learn from 5: <strong>5 = <code className="morse-font">.....</code></strong></p>
            <p>Then: 4 = <code className="morse-font">....-</code>, 3 = <code className="morse-font">...--</code>, 2 = <code className="morse-font">..---</code>, 1 = <code className="morse-font">.----</code>, 0 = <code className="morse-font">-----</code>.</p>
            <p>The other side is: 6 = <code className="morse-font">-....</code>, 7 = <code className="morse-font">--...</code>, 8 = <code className="morse-font">---..</code>, 9 = <code className="morse-font">----.</code>.</p>
            <p>Once 5 is familiar, the other digits become easier to reconstruct.</p>

            {/* H3: Six through nine reverse the balance */}
            <h3>Six through nine reverse the balance</h3>
            <p>The digits 6 through 9 begin with an increasing number of dashes.</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right' }}>Number</th>
                    <th>Morse</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ textAlign: 'right' }}>5</td><td><code className="morse-font">.....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>6</td><td><code className="morse-font">-....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>7</td><td><code className="morse-font">--...</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>8</td><td><code className="morse-font">---..</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>9</td><td><code className="morse-font">----.</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>0</td><td><code className="morse-font">-----</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>This creates a simple visual and audio pattern.</p>
          </section>

          {/* FIGURE 2: CHARACTER BREAKDOWN SCREENSHOT */}
          <figure className="article-figure">
            <img
              src="/images/morse-code-translator-character-breakdown.webp"
              alt="Interactive character breakdown view showing detailed dot-dash visual bars and spoken rhythm"
              className="article-img"
              loading="lazy"
            />
            <figcaption className="article-figcaption">
              Figure 2: Interactive character breakdown view displaying dot-dash visual bars and audio rhythm recognition.
            </figcaption>
          </figure>

          {/* H2: Why Some Letters Are Shorter Than Others */}
          <section className="content-section">
            <h2>Why Some Letters Are Shorter Than Others</h2>
            <p>Morse characters have different lengths.</p>
            <p>For example: <strong>E = <code className="morse-font">.</code></strong> contains one signal element.</p>
            <p><strong>J = <code className="morse-font">.---</code></strong> contains four signal elements.</p>
            <p>
              Under standard timing, J, Q, and Y are among the longest English letters by total signal duration. Their four elements contain a combination of dots, dashes, and internal gaps that makes them longer to transmit than short characters such as E or T.
            </p>
            <p>
              The important learning point is that you should eventually recognize a character as a complete rhythm instead of calculating its individual elements.
            </p>
            <p>
              It is also important not to assume that Morse character length follows a perfect modern English-frequency ranking. Historical Morse systems developed over time, and International Morse differs from the earliest American Morse assignments.
            </p>

            {/* H3: Practical consequence */}
            <h3>Practical consequence</h3>
            <p>When you first learn Morse code, you may see <code className="morse-font">.-</code> and think: <em>dot + dash = A</em>.</p>
            <p>With practice, you want to hear the pattern and immediately recognize: <strong>A</strong>.</p>
            <p>That is why audio practice is important. It helps you move from visual decoding to direct sound recognition.</p>
          </section>

          {/* H2: How to Learn the Morse Code Alphabet */}
          <section className="content-section">
            <h2>How to Learn the Morse Code Alphabet</h2>
            <p>Learning all 26 letters at once can feel difficult. A better approach is to learn small groups and build connections between them.</p>

            <p className="code-example-box">
              <strong>Listen → Identify → Check → Repeat</strong>
            </p>

            <p>Use the chart when you need a reference. Use audio when you want to build real recognition.</p>

            {/* H3: Learn by sound, never by sight */}
            <h3>Learn by sound, never by sight</h3>
            <p>A written chart is useful, but visual recognition is different from hearing Morse code.</p>
            <p>If your goal is to understand Morse by sound, spend time listening to individual characters. For example, learn <code className="morse-font">.-</code> as the sound of <strong>A</strong>.</p>
            <p>Then try to identify A without looking at the answer. Do the same with other characters. The long-term goal is direct recognition rather than counting individual dots and dashes.</p>

            {/* H3: Start with E, T, A and N */}
            <h3>Start with E, T, A and N</h3>
            <p>A simple starting group is:</p>
            <ul className="content-list">
              <li>E = <code className="morse-font">.</code></li>
              <li>T = <code className="morse-font">-</code></li>
              <li>A = <code className="morse-font">.-</code></li>
              <li>N = <code className="morse-font">-.</code></li>
            </ul>

            <p>A and N are useful because they are mirror patterns: <strong>A = <code className="morse-font">.-</code></strong> and <strong>N = <code className="morse-font">-.</code></strong>.</p>
            <p>You can also learn other useful mirror pairs:</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A / N</td><td><code className="morse-font">.-</code> / <code className="morse-font">-.</code></td></tr>
                  <tr><td>D / U</td><td><code className="morse-font">-..</code> / <code className="morse-font">..-</code></td></tr>
                  <tr><td>B / V</td><td><code className="morse-font">-...</code> / <code className="morse-font">...-</code></td></tr>
                  <tr><td>G / W</td><td><code className="morse-font">--.</code> / <code className="morse-font">.--</code></td></tr>
                  <tr><td>K / R</td><td><code className="morse-font">-.-</code> / <code className="morse-font">.-.</code></td></tr>
                  <tr><td>Y / Q</td><td><code className="morse-font">-.--</code> / <code className="morse-font">--.-</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>Learning related pairs can make the alphabet easier to organize in memory.</p>

            {/* H3: Add letters in small groups and drill to instant recognition */}
            <h3>Add letters in small groups and drill to instant recognition</h3>
            <p>Do not try to master all 26 letters in one session. Start with a small group. Listen to the characters in random order. Identify each one. Then check your answer.</p>

            <p>A simple practice cycle is:</p>
            <ol className="content-list" style={{ paddingLeft: '1.25rem' }}>
              <li>Listen to a character.</li>
              <li>Identify the letter.</li>
              <li>Check the answer.</li>
              <li>Repeat missed characters.</li>
              <li>Add a few new characters.</li>
            </ol>
            <p>The goal is quick recognition rather than slow counting. The same principle is used in established Morse learning methods: introduce characters gradually and build fast recognition through repeated listening.</p>

            {/* H3: Use rhythm mnemonics only as a temporary crutch */}
            <h3>Use rhythm mnemonics only as a temporary crutch</h3>
            <p>Mnemonics can help you remember difficult characters, but they should not replace direct recognition. If you always translate a sound into a memory phrase before identifying the letter, your recognition may remain slow.</p>
            <p>Use a mnemonic when needed. Then work toward recognizing the actual Morse rhythm.</p>

            {/* H3: Practice sending as well as receiving */}
            <h3>Practice sending as well as receiving</h3>
            <p><strong>Receiving</strong> means listening to Morse and identifying the characters.</p>
            <p><strong>Sending</strong> means producing the correct dots, dashes, and spaces.</p>
            <p>Sending practice helps you understand timing. You learn how long a dot should last and how a dash differs from a dot. You also become more aware of the spaces between elements, letters, and words.</p>

            {/* H3: Keep sessions short and daily */}
            <h3>Keep sessions short and daily</h3>
            <p>Regular practice is easier to maintain than occasional long sessions.</p>
            <p>A short session can include:</p>
            <ul className="content-list">
              <li>Review a small character group.</li>
              <li>Listen to random characters.</li>
              <li>Identify them.</li>
              <li>Send the same characters.</li>
              <li>Review mistakes.</li>
              <li>Repeat the next day.</li>
            </ul>
            <p>Measure progress by recognition speed and accuracy, not just by how many codes you can memorize.</p>
          </section>

          {/* H2: Practicing Timing Across the Whole Alphabet */}
          <section className="content-section">
            <h2>Practicing Timing Across the Whole Alphabet</h2>
            <p>Once you know the characters, timing becomes an important part of practical Morse skills.</p>

            <p>Standard timing uses:</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th style={{ textAlign: 'right' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Dot</td><td style={{ textAlign: 'right' }}>1 unit</td></tr>
                  <tr><td>Dash</td><td style={{ textAlign: 'right' }}>3 units</td></tr>
                  <tr><td>Gap inside a character</td><td style={{ textAlign: 'right' }}>1 unit</td></tr>
                  <tr><td>Gap between characters</td><td style={{ textAlign: 'right' }}>3 units</td></tr>
                  <tr><td>Gap between words</td><td style={{ textAlign: 'right' }}>7 units</td></tr>
                </tbody>
              </table>
            </div>

            <p>
              <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">ARRL <ExternalLink size={12} /></a> documents this timing structure and uses the PARIS standard for Morse speed calculations.
            </p>

            <p>The approximate duration of one timing unit can be calculated as: <strong>1.2 ÷ WPM</strong></p>

            <p>At 20 WPM: <strong>1.2 ÷ 20 = 0.06 seconds</strong></p>
            <p>So a standard-timing dot is 60 milliseconds.</p>
            <p>A dash is 180 milliseconds.</p>
            <p>The gap between characters is also 180 milliseconds.</p>
            <p>The gap between words is 420 milliseconds.</p>
            <p>These values assume standard timing. Training systems can change the spacing while keeping the individual character timing faster.</p>

            {/* H3: Farnsworth timing */}
            <h3>Farnsworth timing</h3>
            <p>Farnsworth timing is designed to make Morse learning easier.</p>
            <p>Characters are sent at a faster character speed, while additional space is added between characters and words.</p>
            <p>This gives the learner more time to identify each character.</p>
            <p>ARRL describes Farnsworth timing as faster character timing combined with additional spacing to produce a slower overall rate.</p>
            <p>For example, a learner can practice characters at a faster speed while using extra spacing between them. The exact settings can vary between training tools.</p>
          </section>

          {/* FIGURE 3: TIMING CHART SCREENSHOT */}
          <figure className="article-figure">
            <img
              src="/images/international-morse-code-timing-chart.webp"
              alt="International Morse Code standard element duration and spacing rules diagram"
              className="article-img"
              loading="lazy"
            />
            <figcaption className="article-figcaption">
              Figure 3: International Morse Code timing chart illustrating dot, dash, character gap, and word gap ratios (1-3-1-3-7).
            </figcaption>
          </figure>

          {/* H2: Putting the Alphabet Together */}
          <section className="content-section">
            <h2>Putting the Alphabet Together</h2>
            <p>Once you know individual letters, start combining them into words.</p>

            <p>For example:</p>
            <ul className="content-list">
              <li><strong>HI</strong> → <code className="morse-font">.... ..</code></li>
              <li><strong>OK</strong> → <code className="morse-font">--- -.-</code></li>
              <li><strong>SOS</strong> → <code className="morse-font">... --- ...</code></li>
              <li><strong>HELLO</strong> → <code className="morse-font">.... . .-.. .-.. ---</code></li>
              <li><strong>MORSE</strong> → <code className="morse-font">-- --- .-. ... .</code></li>
              <li><strong>CODE</strong> → <code className="morse-font">-.-. --- -.. .</code></li>
            </ul>

            <p>Each letter has its own pattern. The spaces separate the characters. Longer spaces separate words.</p>
            <p>For written Morse, keep the elements of each character together. For example: <code className="morse-font">....</code> means H. Writing it as <code className="morse-font">. . . .</code> could be interpreted as four separate E characters.</p>
            <p>When writing complete messages, use spaces between letters and a clear word separator between words. A slash is often used as a written word separator:</p>
            <p className="code-example-box">
              <code className="morse-font">-- --- .-. ... . / -.-. --- -.. .</code>
            </p>
            <p>This reads: <strong>MORSE CODE</strong></p>

            {/* H3: Reverse lookup */}
            <h3>Reverse lookup</h3>
            <p>Morse code is not always entered as normal text. Sometimes you already have a pattern and need to identify it.</p>
            <p>For example: <code className="morse-font">.-..</code> means <strong>L</strong>. Likewise: <code className="morse-font">-.-</code> means <strong>K</strong>.</p>
            <p>A reverse Morse lookup is useful for puzzles, radio practice, notes, and any situation where the Morse pattern is already available.</p>
            <p>
              You can paste a complete Morse message into the <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Morse Code Translator</a> to decode it into readable text.
            </p>
          </section>

          {/* H2: Why Learn the Alphabet Rather Than a Few Words */}
          <section className="content-section">
            <h2>Why Learn the Alphabet Rather Than a Few Words</h2>
            <p>Memorizing a few Morse phrases can be useful, but learning the alphabet gives you a much wider skill.</p>
            <p>If you know only SOS, you can recognize SOS. If you know the alphabet, you can decode words you have never seen before.</p>

            {/* H3: It is the only way to read anything unfamiliar */}
            <h3>It is the only way to read anything unfamiliar</h3>
            <p>Consider: <code className="morse-font">.... . .-.. .-.. ---</code></p>
            <p>You can decode it one character at a time:</p>
            <ul className="content-list">
              <li><code className="morse-font">....</code> = H</li>
              <li><code className="morse-font">.</code> = E</li>
              <li><code className="morse-font">.-..</code> = L</li>
              <li><code className="morse-font">.-..</code> = L</li>
              <li><code className="morse-font">---</code> = O</li>
            </ul>
            <p>The result is: <strong>HELLO</strong>. You did not need to memorize the entire message. You only needed to know the alphabet.</p>

            {/* H3: It was a licensing requirement for most of a century */}
            <h3>It was a licensing requirement for most of a century</h3>
            <p>Morse code played an important role in radio communication for many decades. In the United States, Morse proficiency was once required for certain amateur radio license classes.</p>
            <p>
              The FCC ended the Morse examination requirement for US amateur radio licenses on <strong>February 23, 2007</strong>. Morse remains an active operating mode in amateur radio (<a href="https://www.arrl.org/w1awbulletinsissue?code=ARLB005&issue=2007-01-24" target="_blank" rel="noopener noreferrer">arrl.org <ExternalLink size={12} /></a>).
            </p>

            {/* H3: It trains auditory pattern recognition */}
            <h3>It trains auditory pattern recognition</h3>
            <p>Morse can be written as dots and dashes, but audio practice trains you to recognize characters by their rhythm.</p>
            <p>For example: <code className="morse-font">...</code> can eventually become an immediate sound pattern for <strong>S</strong>. This changes the task from counting signals to recognizing a character. That is why audio practice is useful for learners who want to move beyond a visual Morse chart.</p>
          </section>

          {/* H2: Where the Alphabet Is Actually Used Today */}
          <section className="content-section">
            <h2>Where the Alphabet Is Actually Used Today</h2>
            <p>Morse code is not the main communication system it once was. Modern digital systems handle most communication needs. Morse code still has a place in amateur radio and other specialized contexts.</p>
            <p>The ITU states that International Morse code continues to be used in some radiocommunication services, including amateur and amateur-satellite services.</p>

            <p>Today, people may use or study Morse code for:</p>
            <ul className="content-list">
              <li>Amateur radio</li>
              <li>CW communication</li>
              <li>Amateur-satellite activities</li>
              <li>Morse code training</li>
              <li>Educational projects</li>
              <li>Historical communication study</li>
              <li>Scouting and hobby activities</li>
              <li>Puzzles and games</li>
              <li>Creative messages</li>
              <li>Light and sound signaling projects</li>
            </ul>

            <p>For most beginners today, Morse is a skill to learn and practice rather than a replacement for modern digital communication. It is also important not to overstate modern use. Morse code should not be presented as the standard communication system for today's military, aviation, or maritime services.</p>
          </section>

          {/* H2: How This Page Is Verified */}
          <section className="content-section">
            <h2>How This Page Is Verified</h2>
            <p>Accuracy matters when a page is used as a Morse code reference.</p>
            <p>The letter and number mappings on this page follow <strong>International Morse Code</strong>. The primary technical reference is <strong>ITU-R Recommendation M.1677-1: International Morse code</strong>, which the ITU currently lists as an in-force recommendation.</p>
            <p>The timing information is cross-checked against established ARRL Morse timing guidance.</p>
            <p>That guidance defines:</p>
            <ul className="content-list">
              <li>One unit for a dot</li>
              <li>Three units for a dash</li>
              <li>One unit between elements</li>
              <li>Three units between characters</li>
              <li>Seven units between words</li>
            </ul>
            <p>It also documents the PARIS timing standard and Farnsworth timing.</p>
            <p>This page uses <strong>International Morse Code</strong> for its primary A–Z reference. That distinction matters because historical Morse systems, including American Morse, used different character assignments.</p>
            <p>The purpose of this page is to provide a clear reference for people who want to find, learn, hear, practice, or translate International Morse code.</p>
          </section>

          {/* H2: Complete Morse Code Alphabet Chart */}
          <section className="content-section">
            <h2>Complete Morse Code Alphabet Chart</h2>
            <p>Use these tables when you need a quick Morse code reference.</p>

            {/* H3: Letters in Morse Code */}
            <h3>Letters in Morse Code</h3>
            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Letter</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td><code className="morse-font">.-</code></td></tr>
                  <tr><td>B</td><td><code className="morse-font">-...</code></td></tr>
                  <tr><td>C</td><td><code className="morse-font">-.-.</code></td></tr>
                  <tr><td>D</td><td><code className="morse-font">-..</code></td></tr>
                  <tr><td>E</td><td><code className="morse-font">.</code></td></tr>
                  <tr><td>F</td><td><code className="morse-font">..-.</code></td></tr>
                  <tr><td>G</td><td><code className="morse-font">--.</code></td></tr>
                  <tr><td>H</td><td><code className="morse-font">....</code></td></tr>
                  <tr><td>I</td><td><code className="morse-font">..</code></td></tr>
                  <tr><td>J</td><td><code className="morse-font">.---</code></td></tr>
                  <tr><td>K</td><td><code className="morse-font">-.-</code></td></tr>
                  <tr><td>L</td><td><code className="morse-font">.-..</code></td></tr>
                  <tr><td>M</td><td><code className="morse-font">--</code></td></tr>
                  <tr><td>N</td><td><code className="morse-font">-.</code></td></tr>
                  <tr><td>O</td><td><code className="morse-font">---</code></td></tr>
                  <tr><td>P</td><td><code className="morse-font">.--.</code></td></tr>
                  <tr><td>Q</td><td><code className="morse-font">--.-</code></td></tr>
                  <tr><td>R</td><td><code className="morse-font">.-.</code></td></tr>
                  <tr><td>S</td><td><code className="morse-font">...</code></td></tr>
                  <tr><td>T</td><td><code className="morse-font">-</code></td></tr>
                  <tr><td>U</td><td><code className="morse-font">..-</code></td></tr>
                  <tr><td>V</td><td><code className="morse-font">...-</code></td></tr>
                  <tr><td>W</td><td><code className="morse-font">.--</code></td></tr>
                  <tr><td>X</td><td><code className="morse-font">-..-</code></td></tr>
                  <tr><td>Y</td><td><code className="morse-font">-.--</code></td></tr>
                  <tr><td>Z</td><td><code className="morse-font">--..</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>These are the 26 basic English letters represented in International Morse Code.</p>
            <p>Some useful quick references are:</p>
            <ul className="content-list">
              <li><strong>A</strong> = <code className="morse-font">.-</code></li>
              <li><strong>J</strong> = <code className="morse-font">.---</code></li>
              <li><strong>L</strong> = <code className="morse-font">.-..</code></li>
              <li><strong>S</strong> = <code className="morse-font">...</code></li>
              <li><strong>T</strong> = <code className="morse-font">-</code></li>
              <li><strong>Z</strong> = <code className="morse-font">--..</code></li>
            </ul>
            <p>
              If you want to hear a character, use the audio function in the <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Morse Code Translator</a>.
            </p>

            {/* H3: Numbers in Morse Code */}
            <h3>Numbers in Morse Code</h3>
            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right' }}>Number</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ textAlign: 'right' }}>0</td><td><code className="morse-font">-----</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>1</td><td><code className="morse-font">.----</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>2</td><td><code className="morse-font">..---</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>3</td><td><code className="morse-font">...--</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>4</td><td><code className="morse-font">....-</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>5</td><td><code className="morse-font">.....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>6</td><td><code className="morse-font">-....</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>7</td><td><code className="morse-font">--...</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>8</td><td><code className="morse-font">---..</code></td></tr>
                  <tr><td style={{ textAlign: 'right' }}>9</td><td><code className="morse-font">----.</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>Start with <strong>5 = <code className="morse-font">.....</code></strong> when learning the number pattern. Then build toward 0 and 9.</p>
            <p>
              For the complete digit guide, see <a href="/morse-code-numbers/" onClick={(e) => { e.preventDefault(); setCategory('number'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Morse Code Numbers</a>.
            </p>

            {/* H3: Punctuation in Morse Code */}
            <h3>Punctuation in Morse Code</h3>
            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Morse Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Period <code>.</code></td><td><code className="morse-font">.-.-.-</code></td></tr>
                  <tr><td>Comma <code>,</code></td><td><code className="morse-font">--..--</code></td></tr>
                  <tr><td>Question mark <code>?</code></td><td><code className="morse-font">..--..</code></td></tr>
                  <tr><td>Apostrophe <code>'</code></td><td><code className="morse-font">.----.</code></td></tr>
                  <tr><td>Exclamation mark <code>!</code></td><td><code className="morse-font">-.-.--</code></td></tr>
                  <tr><td>Slash <code>/</code></td><td><code className="morse-font">-..-.</code></td></tr>
                  <tr><td>Left parenthesis <code>(</code></td><td><code className="morse-font">-.--.</code></td></tr>
                  <tr><td>Right parenthesis <code>)</code></td><td><code className="morse-font">-.--.-</code></td></tr>
                  <tr><td>Ampersand <code>&</code></td><td><code className="morse-font">.-...</code></td></tr>
                  <tr><td>Colon <code>:</code></td><td><code className="morse-font">---...</code></td></tr>
                  <tr><td>Semicolon <code>;</code></td><td><code className="morse-font">-.-.-.</code></td></tr>
                  <tr><td>Hyphen <code>-</code></td><td><code className="morse-font">-....-</code></td></tr>
                  <tr><td>Underscore <code>_</code></td><td><code className="morse-font">..--.-</code></td></tr>
                  <tr><td>Plus <code>+</code></td><td><code className="morse-font">.-.-.</code></td></tr>
                  <tr><td>Equals <code>=</code></td><td><code className="morse-font">-...-</code></td></tr>
                  <tr><td>Quotation mark <code>"</code></td><td><code className="morse-font">.-..-.</code></td></tr>
                  <tr><td>Dollar sign <code>$</code></td><td><code className="morse-font">...-..-</code></td></tr>
                  <tr><td>At sign <code>@</code></td><td><code className="morse-font">.--.-.</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>International Morse includes additional characters and operational signals. For specialized communication, use the applicable ITU specification rather than relying on a generic online chart.</p>
            <p>
              For more punctuation and symbol information, see <a href="/morse-code-symbols/" onClick={(e) => { e.preventDefault(); setCategory('punctuation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Morse Code Symbols</a>.
            </p>
          </section>

          {/* H2: Frequently Asked Questions */}
          <section className="content-section">
            <h2>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              {alphabetFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-elevated)',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text)',
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
                    {openFaqIdx === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {openFaqIdx === idx && (
                    <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* H2: A Complete Morse Code Reference */}
          <section className="content-section cta-banner">
            <h2>A Complete Morse Code Reference</h2>
            <p>
              The most useful way to learn Morse code is to combine <strong>pattern, sound, and timing</strong>.
            </p>
            <p>
              Start with simple characters such as <strong>E <code className="morse-font">.</code></strong>, <strong>T <code className="morse-font">-</code></strong>, <strong>A <code className="morse-font">.-</code></strong>, and <strong>N <code className="morse-font">-.</code></strong>. Then build your knowledge through related patterns, numbers, punctuation, and audio practice. The chart gives you a reliable reference, but practice helps turn those patterns into fast recognition.
            </p>
            <p>
              In building and maintaining this Morse Code Translator resource, the focus is on making Morse code useful in practice, not just listing dots and dashes. The character mappings are checked against International Morse documentation from the ITU, while timing guidance is cross-checked with established ARRL material.
            </p>
            <p>
              When you are ready to work with complete messages, use the <strong>Morse Code Translator</strong> to convert English to Morse, decode Morse into text, listen to characters, and practice what you have learned.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button
                className="btn-primary-cta"
                onClick={() => setActiveTab('translator')}
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                Open Morse Code Translator <ArrowRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}

