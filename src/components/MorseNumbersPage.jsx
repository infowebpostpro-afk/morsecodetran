import React, { useState, useMemo } from 'react';
import {
  Volume2, Copy, Play, Square,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, X,
  Printer, ArrowLeftRight, Sparkles, HelpCircle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, translateMorseToText, getCharacterBreakdown } from '../engine/morseEngine.js';

export const MORSE_NUMBERS = [
  { num: '0', morse: '-----', name: 'Zero', ditDah: 'dah-dah-dah-dah-dah', patternType: 'all-dashes', note: '5 dashes', description: 'Zero contains five dashes. Spoken rhythm is dah-dah-dah-dah-dah.' },
  { num: '1', morse: '.----', name: 'One', ditDah: 'di-dah-dah-dah-dah', patternType: 'dot-inc', note: '1 dot + 4 dashes', description: 'One contains one dot followed by four dashes.' },
  { num: '2', morse: '..---', name: 'Two', ditDah: 'di-di-dah-dah-dah', patternType: 'dot-inc', note: '2 dots + 3 dashes', description: 'Two contains two dots followed by three dashes.' },
  { num: '3', morse: '...--', name: 'Three', ditDah: 'di-di-di-dah-dah', patternType: 'dot-inc', note: '3 dots + 2 dashes', description: 'Three contains three dots followed by two dashes.' },
  { num: '4', morse: '....-', name: 'Four', ditDah: 'di-di-di-di-dah', patternType: 'dot-inc', note: '4 dots + 1 dash', description: 'Four contains four dots followed by one dash.' },
  { num: '5', morse: '.....', name: 'Five', ditDah: 'di-di-di-di-dit', patternType: 'pivot', note: '5 dots (Pivot)', description: 'Five contains five dots. It is the midpoint pivot.' },
  { num: '6', morse: '-....', name: 'Six', ditDah: 'dah-di-di-di-dit', patternType: 'dash-inc', note: '1 dash + 4 dots', description: 'Six contains one dash followed by four dots.' },
  { num: '7', morse: '--...', name: 'Seven', ditDah: 'dah-dah-di-di-dit', patternType: 'dash-inc', note: '2 dashes + 3 dots', description: 'Seven contains two dashes followed by three dots.' },
  { num: '8', morse: '---..', name: 'Eight', ditDah: 'dah-dah-dah-di-dit', patternType: 'dash-inc', note: '3 dashes + 2 dots', description: 'Eight contains three dashes followed by two dots.' },
  { num: '9', morse: '----.', name: 'Nine', ditDah: 'dah-dah-dah-dah-dit', patternType: 'dash-inc', note: '4 dashes + 1 dot', description: 'Nine contains four dashes followed by one dot.' },
];

export const MIRROR_PAIRS = [
  { leftNum: '1', leftMorse: '.----', rightNum: '9', rightMorse: '----.', desc: '1 dot + 4 dashes vs 4 dashes + 1 dot' },
  { leftNum: '2', leftMorse: '..---', rightNum: '8', rightMorse: '---..', desc: '2 dots + 3 dashes vs 3 dashes + 2 dots' },
  { leftNum: '3', leftMorse: '...--', rightNum: '7', rightMorse: '--...', desc: '3 dots + 2 dashes vs 2 dashes + 3 dots' },
  { leftNum: '4', leftMorse: '....-', rightNum: '6', rightMorse: '-....', desc: '4 dots + 1 dash vs 1 dash + 4 dots' },
  { leftNum: '5', leftMorse: '.....', rightNum: '0', rightMorse: '-----', desc: '5 dots (all dots) vs 5 dashes (all dashes)' },
];

export const COMMON_EXAMPLES = [
  { num: '0', morse: '-----', desc: 'Single digit zero' },
  { num: '10', morse: '.---- -----', desc: 'Ten' },
  { num: '25', morse: '..--- .....', desc: 'Twenty-five' },
  { num: '42', morse: '....- ..---', desc: 'Forty-two' },
  { num: '73', morse: '--... ...--', desc: 'Ham radio closing meaning "best regards"' },
  { num: '88', morse: '---.. ---..', desc: 'Ham radio abbreviation for "love and kisses"' },
  { num: '911', morse: '----. .---- .----', desc: 'Emergency sequence transmitted digit by digit' },
  { num: '2024', morse: '..--- ----- ..--- ....-', desc: 'Year 2024' },
  { num: '2026', morse: '..--- ----- ..--- -....', desc: 'Four-digit year with dot & dash balance' },
  { num: '12345', morse: '.---- ..--- ...-- ....- .....', desc: 'Sequential numbers 1 through 5' },
];

export function MorseNumbersPage({ wpm, setWpm, frequency, volume, onTranslateCharacter, showToast, setActiveTab }) {
  // Main Converter State
  const [numInput, setNumInput] = useState('2026');
  const [morseInput, setMorseInput] = useState('..--- ----- ..--- -....');
  const [direction, setDirection] = useState('num2morse'); // num2morse or morse2num
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playingCard, setPlayingCard] = useState(null);
  const [selectedMirrorPair, setSelectedMirrorPair] = useState(null);

  // Quiz State
  const [quizTab, setQuizTab] = useState('num2morse'); // num2morse or morse2num
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});

  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Real-time Number -> Morse
  const translatedMorse = useMemo(() => {
    if (!numInput) return '';
    return translateTextToMorse(numInput);
  }, [numInput]);

  // Real-time Morse -> Number
  const translatedNum = useMemo(() => {
    if (!morseInput) return '';
    return translateMorseToText(morseInput);
  }, [morseInput]);

  // Dynamic Character Breakdown for multi-digit conversion
  const breakdownList = useMemo(() => {
    if (direction === 'num2morse') {
      return getCharacterBreakdown(numInput, translatedMorse);
    } else {
      return getCharacterBreakdown(translatedNum, morseInput);
    }
  }, [numInput, translatedMorse, morseInput, translatedNum, direction]);

  // Play Audio Tone for Main Converter
  const handlePlayMainAudio = () => {
    const textToPlay = direction === 'num2morse' ? numInput : translatedNum;
    const morseToPlay = direction === 'num2morse' ? translatedMorse : morseInput;
    if (!textToPlay || !morseToPlay) return;

    setIsPlayingAudio(true);

    const breakdownSequence = getCharacterBreakdown(textToPlay, morseToPlay);

    audioEngine.playSequence({
      breakdown: breakdownSequence,
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setIsPlayingAudio(false);
        }
      }
    });
  };

  const handleStopMainAudio = () => {
    audioEngine.stop();
    setIsPlayingAudio(false);
  };

  // Play Single Card Audio
  const handlePlayCardAudio = (num, morse) => {
    setPlayingCard(num);
    audioEngine.playSequence({
      breakdown: [{ char: num, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setPlayingCard(null);
        }
      }
    });
  };

  // Quick Preset Selection -> Populate Main Converter
  const handleSelectPreset = (numStr) => {
    setNumInput(numStr);
    const morse = translateTextToMorse(numStr);
    setMorseInput(morse);
    setDirection('num2morse');
    showToast(`Loaded "${numStr}" into converter`);
  };

  // Swap Direction
  const handleSwapDirection = () => {
    if (direction === 'num2morse') {
      setDirection('morse2num');
      setMorseInput(translatedMorse || '..--- ----- ..--- -....');
    } else {
      setDirection('num2morse');
      setNumInput(translatedNum || '2026');
    }
    showToast('Swapped conversion direction ⇄');
  };

  // Copy to Clipboard helper
  const handleCopyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label} ✓`);
    } catch (e) {
      showToast('Copy failed. Please copy manually.');
    }
  };

  // Quiz Handling
  const num2MorseQuiz = [
    { id: 'q_num_3', question: '3', answer: '...--', note: 'Three dots + two dashes' },
    { id: 'q_num_7', question: '7', answer: '--...', note: 'Two dashes + three dots' },
    { id: 'q_num_42', question: '42', answer: '....- ..---', note: '4 (....-) and 2 (..---)' },
    { id: 'q_num_2026', question: '2026', answer: '..--- ----- ..--- -....', note: '2026 multi-digit sequence' },
  ];

  const morse2NumQuiz = [
    { id: 'q_morse_3', question: '...--', answer: '3', note: '3 dots + 2 dashes' },
    { id: 'q_morse_74', question: '--... ....-', answer: '74', note: '7 (--...) and 4 (....-)' },
    { id: 'q_morse_2026', question: '..--- ----- ..--- -....', answer: '2026', note: '2026 decoded sequence' },
  ];

  const handleCheckQuizAnswer = (qId, expectedAnswer) => {
    const userVal = (quizAnswers[qId] || '').trim();
    if (!userVal) {
      setQuizFeedback(prev => ({ ...prev, [qId]: { type: 'error', msg: 'Please type an answer first.' } }));
      return;
    }

    const cleanUser = userVal.replace(/\s+/g, ' ');
    const cleanExpected = expectedAnswer.replace(/\s+/g, ' ');

    if (cleanUser.toLowerCase() === cleanExpected.toLowerCase()) {
      setQuizFeedback(prev => ({ ...prev, [qId]: { type: 'success', msg: 'Correct! Great job! 🎉' } }));
    } else {
      setQuizFeedback(prev => ({ ...prev, [qId]: { type: 'error', msg: `Not quite. Expected: ${expectedAnswer}` } }));
    }
  };

  const handleRevealQuizAnswer = (qId) => {
    setRevealedQuiz(prev => ({ ...prev, [qId]: true }));
  };

  // Print Chart Trigger
  const handlePrintChart = () => {
    window.print();
  };

  const numberFaqs = [
    {
      q: "What are Morse code numbers?",
      a: "Morse code numbers are the dot-and-dash representations of the digits 0 through 9. Each standard International Morse digit contains five dots or dashes."
    },
    {
      q: "What is 0 in Morse code?",
      a: "0 in Morse code is ----- (five dashes). Its spoken rhythm is 'dah-dah-dah-dah-dah'."
    },
    {
      q: "How do I write multi-digit numbers in Morse code?",
      a: "Convert each digit separately and keep the original order. Separate each digit's Morse code with a space. For example, 2026 is written as: ..--- ----- ..--- -...."
    },
    {
      q: "Are Morse code numbers always five symbols?",
      a: "Yes. The standard International Morse digits from 0 to 9 each contain five elements. Numbers 1 through 5 progress from one dot to five dots, while 6 through 0 progress toward five dashes."
    },
    {
      q: "How do I read Morse code numbers?",
      a: "Read each five-signal pattern as one digit. For example: ...-- = 3, ---.. = 8. With practice, you can learn to recognize the rhythm without counting every signal."
    },
    {
      q: "Can I listen to Morse code numbers?",
      a: "Yes. Listening is an effective part of Morse code practice. You can use the audio controls in the Morse Code Translator to hear individual digits or complete number sequences. ARRL also provides Morse code learning and practice resources based on listening and repetition."
    },
    {
      q: "Why do Morse code numbers use five signals?",
      a: "International Morse Code uses a regular five-element structure for digits to ensure distinct recognition and avoid confusion with shorter 1- to 4-element letters during transmission."
    },
    {
      q: "Is 0 in Morse code the same as the letter O?",
      a: "No. 0 is ----- (five dashes), whereas letter O is --- (three dashes). Zero is a digit and O is a letter; they have distinct Morse codes."
    },
    {
      q: "Are American and International Morse code numbers the same?",
      a: "No. International Morse Code is the modern standard referenced by the ITU (Recommendation M.1677-1). Historical American Morse (railroad telegraphy) used different codes. The International Morse standard is used on this page."
    }
  ];

  return (
    <div className="numbers-page-container">

      {/* BREADCRUMB */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">Morse Code Numbers</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title">Morse Code Numbers 0–9: Complete Chart, Patterns & How to Read Them</h1>
        <p className="alphabet-subtitle">
          Morse code numbers are made from dots and dashes. If you only need the code for a digit, a full chart gives you the answer in seconds. If you want to learn the numbers, there is an easier way: the digits follow a clear pattern.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
          This guide covers <strong>Morse Code Numbers 0–9</strong>, multi-digit numbers, audio practice, timing, decoding, and simple ways to remember the patterns. You can also use the Morse Code Translator to convert numbers into Morse code or decode Morse back into numbers.
        </p>
      </section>

      {/* TWO-WAY NUMBER ↔ MORSE CONVERTER TOOL */}
      <section className="alphabet-tool-card">
        <div className="tool-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={18} className="text-primary" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Number to Morse Code Converter</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-seq-cta" onClick={handleSwapDirection} title="Swap conversion direction">
              <ArrowLeftRight size={14} /> Swap ({direction === 'num2morse' ? 'Number → Morse' : 'Morse → Number'})
            </button>

            {/* WPM Speed Selector */}
            <div className="wpm-mini-selector">
              <span className="wpm-lbl">Speed:</span>
              <select
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
                className="wpm-select"
              >
                <option value={5}>5 WPM</option>
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

        {/* TWO-WAY INPUT / OUTPUT GRID */}
        <div className="translator-io-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

          {/* INPUT CARD */}
          <div className="io-panel" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {direction === 'num2morse' ? 'Number Input (0–9)' : 'Morse Code Input'}
              </label>
              {((direction === 'num2morse' && numInput) || (direction === 'morse2num' && morseInput)) && (
                <button
                  className="search-clear-btn"
                  onClick={() => { setNumInput(''); setMorseInput(''); }}
                  title="Clear input"
                >
                  <X size={14} /> Clear
                </button>
              )}
            </div>

            {direction === 'num2morse' ? (
              <textarea
                value={numInput}
                onChange={(e) => setNumInput(e.target.value)}
                placeholder="Type a number... (e.g. 2026)"
                rows={4}
                className="alphabet-search-input"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.1rem', fontFamily: 'var(--font-sans)' }}
              />
            ) : (
              <textarea
                value={morseInput}
                onChange={(e) => setMorseInput(e.target.value)}
                placeholder="Enter Morse code... (e.g. ..--- ----- ..--- -....)"
                rows={4}
                className="alphabet-search-input morse-font"
                style={{ width: '100%', resize: 'vertical', fontSize: '1.1rem' }}
              />
            )}
          </div>

          {/* OUTPUT CARD */}
          <div className="io-panel" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {direction === 'num2morse' ? 'Morse Code Output' : 'Decoded Number Output'}
              </label>
              <span className="standard-badge" style={{ fontSize: '0.75rem' }}>
                Real-Time
              </span>
            </div>

            <div
              className={`output-display-box ${direction === 'num2morse' ? 'morse-font' : ''}`}
              style={{
                minHeight: '104px',
                padding: '0.85rem',
                background: 'var(--surface)',
                border: '1px dashed var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--signal-bright)',
                wordBreak: 'break-word'
              }}
            >
              {direction === 'num2morse' ? (translatedMorse || '...') : (translatedNum || '...')}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {isPlayingAudio ? (
                <button className="btn-seq-cta playing" onClick={handleStopMainAudio}>
                  <Square size={14} /> Stop
                </button>
              ) : (
                <button className="btn-seq-cta" onClick={handlePlayMainAudio}>
                  <Play size={14} fill="currentColor" /> Play Audio
                </button>
              )}

              <button
                className="btn-secondary-action"
                onClick={() => handleCopyText(direction === 'num2morse' ? translatedMorse : translatedNum, 'Result')}
              >
                <Copy size={13} /> Copy Result
              </button>
            </div>
          </div>

        </div>

        {/* DIGIT-BY-DIGIT CONVERSION DEMO FOR 2026 */}
        <div style={{ marginTop: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>
            Example: Digit-by-Digit Conversion for 2026
          </div>
          <div className="table-responsive">
            <table className="seo-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Digit</th>
                  <th>Morse Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>2</strong></td>
                  <td><code className="morse-font">..---</code></td>
                  <td>2 dots + 3 dashes</td>
                </tr>
                <tr>
                  <td><strong>0</strong></td>
                  <td><code className="morse-font">-----</code></td>
                  <td>5 dashes</td>
                </tr>
                <tr>
                  <td><strong>2</strong></td>
                  <td><code className="morse-font">..---</code></td>
                  <td>2 dots + 3 dashes</td>
                </tr>
                <tr>
                  <td><strong>6</strong></td>
                  <td><code className="morse-font">-....</code></td>
                  <td>1 dash + 4 dots</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CHARACTER BREAKDOWN TABLE IF MULTI-DIGIT */}
        {breakdownList.length > 0 && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem' }}>
              Character Breakdown ({breakdownList.filter(b => !b.isSpace).length} Digits)
            </h3>
            <div className="table-responsive">
              <table className="seo-table" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    <th>Digit</th>
                    <th>Morse Code</th>
                    <th>Visual Bars</th>
                    <th>Spoken Rhythm</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownList.map((item, idx) => {
                    if (item.isSpace) {
                      return (
                        <tr key={idx} style={{ opacity: 0.6, background: 'rgba(255,255,255,0.02)' }}>
                          <td colSpan={4} style={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.8rem' }}>
                            [Word Space — 7 timing units]
                          </td>
                        </tr>
                      );
                    }
                    const numObj = MORSE_NUMBERS.find(n => n.num === item.char);
                    return (
                      <tr key={idx}>
                        <td><strong>{item.char}</strong></td>
                        <td><code className="morse-font">{item.morse}</code></td>
                        <td>{item.morse ? item.morse.replace(/\./g, '· ').replace(/-/g, '━ ') : '-'}</td>
                        <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                          {numObj ? numObj.ditDah : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 1. THE COMPLETE MORSE CODE NUMBERS CHART */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>The Complete Morse Code Numbers Chart</h2>
        <p>
          Here is the complete International Morse Code number chart:
        </p>

        <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'right', width: '120px' }}>Number</th>
                <th>Morse Code</th>
                <th>Spoken Rhythm</th>
                <th>Elements</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Audio</th>
              </tr>
            </thead>
            <tbody>
              {MORSE_NUMBERS.map((item) => (
                <tr key={item.num}>
                  <td style={{ textAlign: 'right' }}><strong>{item.num}</strong></td>
                  <td><code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--signal-bright)', fontWeight: 800 }}>{item.morse}</code></td>
                  <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{item.ditDah}</td>
                  <td>{item.note}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="card-btn btn-play"
                      onClick={() => handlePlayCardAudio(item.num, item.morse)}
                      title={`Listen to ${item.num}`}
                      style={{ margin: '0 auto' }}
                    >
                      <Volume2 size={14} className={playingCard === item.num ? 'anim-pulse' : ''} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
            <strong>Five-element standard:</strong> Every standard Morse digit from <strong>0 through 9 contains five dots or dashes</strong>. This is one of the most useful facts for learning Morse code numbers. The International Telecommunication Union (ITU) defines the International Morse Code in Recommendation M.1677-1, which is listed as in force.
          </p>
        </div>
      </section>

      {/* 2. HOW MORSE CODE NUMBERS WORK */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>How Morse Code Numbers Work</h2>
        <p>
          Morse code numbers are easier to learn when you look at their structure. Each standard digit contains five elements. Those elements can be dots, dashes, or a mixture of both.
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.5rem' }}>Five-symbol pattern</h3>
        <p>
          Every standard Morse number has exactly five signals.
        </p>
        <p>For example:</p>
        <ul className="content-list" style={{ fontFamily: 'var(--font-mono)' }}>
          <li><strong>1</strong> = <code className="morse-font">.----</code></li>
          <li><strong>5</strong> = <code className="morse-font">.....</code></li>
          <li><strong>0</strong> = <code className="morse-font">-----</code></li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The number of signals stays the same. The arrangement of dots and dashes changes. This also makes Morse digits different from Morse letters. Morse letters can contain different numbers of elements (from 1 to 4 elements). Standard Morse digits always contain five.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
          
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>1 to 5 add dots</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Numbers 1 through 5 follow a simple sequence. The number of dots at the beginning increases from one to five.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', background: 'var(--surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.7 }}>
              1 : .---- (one leading dot)<br />
              2 : ..--- (two leading dots)<br />
              3 : ...-- (three leading dots)<br />
              4 : ....- (four leading dots)<br />
              5 : ..... (five dots)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Number 5 is the midpoint pivot: <strong>5 = <code>.....</code></strong> (five dots, no dashes).
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>6 to 9 start with dashes</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              The second half follows the opposite pattern. The number of leading dashes increases from one to five.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', background: 'var(--surface)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.7 }}>
              6 : -.... (one leading dash)<br />
              7 : --... (two leading dashes)<br />
              8 : ---.. (three leading dashes)<br />
              9 : ----. (four leading dashes)<br />
              0 : ----- (five dashes)
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Number 0 completes the sequence: <strong>0 = <code>-----</code></strong> (five dashes).
            </p>
          </div>

        </div>
      </section>

      {/* 3. THE STAIRCASE: HOW MORSE NUMBERS ACTUALLY WORK */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>The Staircase: How Morse Numbers Actually Work</h2>
        <p>
          The full number sequence can be viewed as a simple staircase:
        </p>

        <div className="staircase-container" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginTop: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phase 1: Dots Increase (1 → 5)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>1</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>.----</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 dot</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>2</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>..---</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 dots</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>3</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>...--</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 dots</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>4</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>....-</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 dots</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--signal)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>5 (Anchor)</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)', fontWeight: 800 }}>.....</code>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--signal-bright)' }}>5 dots (All dots)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Phase 2: Dashes Increase (6 → 0)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>6</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>-....</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 dash</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>7</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>--...</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 dashes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>8</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>---..</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 dashes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>9</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem' }}>----.</code>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 dashes</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid var(--accent-amber)', borderRadius: 'var(--radius-sm)' }}>
                  <span><strong>0 (Anchor)</strong></span>
                  <code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-amber)', fontWeight: 800 }}>-----</code>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>5 dashes (All dashes)</span>
                </div>
              </div>
            </div>

          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1.25rem', marginBottom: 0, lineHeight: 1.6 }}>
            From <strong>1 to 5</strong>, dots increase while dashes decrease. From <strong>6 to 0</strong>, dashes increase while dots decrease. The two anchor points <strong>5 = <code>.....</code></strong> and <strong>0 = <code>-----</code></strong> make the sequence intuitive to recall.
          </p>
        </div>
      </section>

      {/* 4. THE 5 MIRROR PAIRS — LEARN HALF, KNOW ALL TEN */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>The 5 Mirror Pairs — Learn Half, Know All Ten</h2>
        <p>
          Morse numbers also form useful visual pairs:
        </p>

        <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Number</th>
                <th style={{ textAlign: 'center' }}>Morse</th>
                <th style={{ textAlign: 'center' }}>Mirror Pair</th>
                <th style={{ textAlign: 'center' }}>Morse</th>
                <th>Pattern Reversal</th>
              </tr>
            </thead>
            <tbody>
              {MIRROR_PAIRS.map((pair, idx) => {
                const isSelected = selectedMirrorPair === idx;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedMirrorPair(isSelected ? null : idx)}
                    style={{ cursor: 'pointer', background: isSelected ? 'rgba(139, 92, 246, 0.15)' : undefined }}
                  >
                    <td style={{ textAlign: 'center', fontSize: '1.1rem' }}><strong>{pair.leftNum}</strong></td>
                    <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--signal-bright)' }}>{pair.leftMorse}</code></td>
                    <td style={{ textAlign: 'center', fontSize: '1.1rem' }}><strong>{pair.rightNum}</strong></td>
                    <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--accent-amber)' }}>{pair.rightMorse}</code></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pair.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          The pairs show a reversal of the dot-and-dash pattern. For example: <strong>2 = <code>..---</code></strong> and <strong>8 = <code>---..</code></strong>. The signals are reversed in position. This is a useful visual memory aid. (Note: It does not mean that the two numbers have the same sound or meaning; they are separate Morse characters.)
        </p>
      </section>

      {/* 5. PRACTICE QUIZ — BOTH DIRECTIONS */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>Practice Quiz — Both Directions</h2>
        <p>
          Practice Morse numbers in both directions. Two-way practice is useful because sending and receiving Morse are different skills. A person may recognize a written pattern but struggle to identify it by sound.
        </p>

        <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginTop: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', pb: '0.75rem' }}>
            <button
              className={`tab-btn ${quizTab === 'num2morse' ? 'active' : ''}`}
              onClick={() => setQuizTab('num2morse')}
            >
              Number to Morse
            </button>
            <button
              className={`tab-btn ${quizTab === 'morse2num' ? 'active' : ''}`}
              onClick={() => setQuizTab('morse2num')}
            >
              Morse to Number
            </button>
          </div>

          {quizTab === 'num2morse' ? (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary-light)' }}>
                Try converting these numbers to Morse code:
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {num2MorseQuiz.map((item) => {
                  const fb = quizFeedback[item.id];
                  const isRevealed = revealedQuiz[item.id];

                  return (
                    <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                          Convert: <span className="text-primary" style={{ fontSize: '1.25rem' }}>{item.question}</span>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            className="card-btn btn-play"
                            onClick={() => audioEngine.playSequence({ breakdown: getCharacterBreakdown(item.question, item.answer), wpm, frequency, volume })}
                            title="Hear Audio Hint"
                          >
                            <Volume2 size={14} /> Audio Hint
                          </button>
                          <button
                            className="btn-secondary-action"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => handleRevealQuizAnswer(item.id)}
                          >
                            <HelpCircle size={12} /> Reveal Answer
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                        <input
                          type="text"
                          value={quizAnswers[item.id] || ''}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          placeholder="Type Morse code... (e.g. ...--)"
                          className="alphabet-search-input morse-font"
                          style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '1rem' }}
                        />
                        <button
                          className="btn-primary-cta"
                          onClick={() => handleCheckQuizAnswer(item.id, item.answer)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Check
                        </button>
                      </div>

                      {fb && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: fb.type === 'success' ? 'var(--signal-bright)' : 'var(--danger)' }}>
                          {fb.msg}
                        </div>
                      )}

                      {isRevealed && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                          Answer: <code className="morse-font" style={{ fontWeight: 800, color: 'var(--signal-bright)' }}>{item.answer}</code> ({item.note})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--accent-amber)' }}>
                Decode these Morse patterns into numbers:
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {morse2NumQuiz.map((item) => {
                  const fb = quizFeedback[item.id];
                  const isRevealed = revealedQuiz[item.id];

                  return (
                    <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                          Decode: <code className="morse-font text-primary" style={{ fontSize: '1.25rem' }}>{item.question}</code>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            className="card-btn btn-play"
                            onClick={() => audioEngine.playSequence({ breakdown: getCharacterBreakdown(item.answer, item.question), wpm, frequency, volume })}
                            title="Hear Audio Hint"
                          >
                            <Volume2 size={14} /> Audio Hint
                          </button>
                          <button
                            className="btn-secondary-action"
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                            onClick={() => handleRevealQuizAnswer(item.id)}
                          >
                            <HelpCircle size={12} /> Reveal Answer
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                        <input
                          type="text"
                          value={quizAnswers[item.id] || ''}
                          onChange={(e) => setQuizAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                          placeholder="Type digits... (e.g. 3)"
                          className="alphabet-search-input"
                          style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '1rem', fontFamily: 'var(--font-sans)' }}
                        />
                        <button
                          className="btn-primary-cta"
                          onClick={() => handleCheckQuizAnswer(item.id, item.answer)}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                          Check
                        </button>
                      </div>

                      {fb && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: fb.type === 'success' ? 'var(--signal-bright)' : 'var(--danger)' }}>
                          {fb.msg}
                        </div>
                      )}

                      {isRevealed && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '4px' }}>
                          Answer: <strong style={{ color: 'var(--accent-amber)' }}>{item.answer}</strong> ({item.note})
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 6. HOW TO LEARN THE NUMBERS FAST */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>How to Learn the Numbers Fast</h2>
        <p>
          You do not need to memorize ten random patterns. Learn the structure first. Then practice each number until the pattern becomes familiar.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
          
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Step 1: Learn 1, 5 and 0 first</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Start with three anchor digits:
            </p>
            <ul className="content-list" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              <li><strong>1</strong> = <code className="morse-font">.----</code> (begins first sequence)</li>
              <li><strong>5</strong> = <code className="morse-font">.....</code> (all dots)</li>
              <li><strong>0</strong> = <code className="morse-font">-----</code> (all dashes)</li>
            </ul>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              These three digits make the rest easier to organize.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.5rem' }}>Step 2: Fill in 2–4 and 6–9</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Now complete the two sequences:
            </p>
            <p style={{ fontSize: '0.85rem', margin: '0.4rem 0' }}>
              <strong>1–5:</strong> dots build up from 1 to 5.<br />
              <strong>6–0:</strong> dashes build up from 1 to 5.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Look for the change in the number of dots and dashes. Do not rely only on visual memorization—listen to each digit and learn its rhythm.
            </p>
          </div>

        </div>

        <div style={{ marginTop: '1.25rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Step 3: Practise with real numbers</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Once you know individual digits, practice with complete numbers. Click any preset number below to automatically load it into the converter:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            {['10', '25', '42', '73', '88', '911', '12345', '2026'].map((numStr) => (
              <button
                key={numStr}
                className="btn-secondary-action"
                onClick={() => handleSelectPreset(numStr)}
                style={{ fontSize: '0.9rem', padding: '0.5rem 0.9rem', fontWeight: 700 }}
              >
                {numStr} <code className="morse-font" style={{ fontSize: '0.75rem', opacity: 0.85, marginLeft: '4px' }}>({translateTextToMorse(numStr)})</code>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HOW TO READ AND WRITE NUMBERS IN MORSE CODE */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>How to Read and Write Numbers in Morse Code</h2>
        <p>
          Each digit is treated as a separate Morse character. For example, <code className="morse-font">..--- -----</code> means <strong>20</strong> (the first character is 2, the second is 0).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
          
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>Read one five-mark digit at a time</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every standard digit contains five signals. When reading a written number, identify each five-signal pattern separately. For example, <code className="morse-font">---..</code> is <strong>8</strong> and <code className="morse-font">----.</code> is <strong>9</strong>. With practice, you can recognize the complete rhythm without counting every individual signal.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.5rem' }}>Keep the original number order</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Keep digits in the same order when converting. For example, <strong>1234</strong> becomes <code className="morse-font">.---- ..--- ...-- ....-</code>. Do not reverse the number. Do not combine several digits into one Morse character. Each digit has its own code.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>Listen at a steady speed</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Morse code uses timing as well as dots and dashes. A dot lasts one basic time unit. A dash lasts three units. The spaces between signals are also important. Try to recognize the <strong>rhythm</strong> of a digit instead of mentally counting every dot and dash. ARRL recommends listening and repeated code practice as part of Morse learning.
            </p>
          </div>

        </div>
      </section>

      {/* 8. HOW TO WRITE MULTI-DIGIT NUMBERS */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>How to Write Multi-Digit Numbers</h2>
        <p>
          Write every digit as a separate Morse character. Spaces help show where one Morse character ends and the next begins.
        </p>

        <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Number</th>
                <th>Morse Code Representation</th>
                <th>Digit Breakdown</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>10</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.---- -----</code></td>
                <td>1 (.----) + 0 (-----)</td>
              </tr>
              <tr>
                <td><strong>25</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>..--- .....</code></td>
                <td>2 (..---) + 5 (.....)</td>
              </tr>
              <tr>
                <td><strong>42</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>....- ..---</code></td>
                <td>4 (....-) + 2 (..---)</td>
              </tr>
              <tr>
                <td><strong>911</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>----. .---- .----</code></td>
                <td>9 (----.) + 1 (.----) + 1 (.----)</td>
              </tr>
              <tr>
                <td><strong>2026</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>..--- ----- ..--- -....</code></td>
                <td>2 (..---) + 0 (-----) + 2 (..---) + 6 (-....)</td>
              </tr>
              <tr>
                <td><strong>12345</strong></td>
                <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.---- ..--- ...-- ....- .....</code></td>
                <td>1 + 2 + 3 + 4 + 5 in sequence</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--primary-light)' }}>
            The basic rule is: <strong>"One digit equals one Morse character."</strong> Do not create a new Morse pattern for an entire multi-digit number.
          </p>
        </div>
      </section>

      {/* 9. COMMON NUMBER EXAMPLES */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>Common Number Examples</h2>
        <p>
          The following examples are useful for practice:
        </p>

        <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'right', width: '120px' }}>Number</th>
                <th>Morse Code</th>
                <th>Description / Context</th>
              </tr>
            </thead>
            <tbody>
              {COMMON_EXAMPLES.map((ex) => (
                <tr key={ex.num}>
                  <td style={{ textAlign: 'right' }}><strong>{ex.num}</strong></td>
                  <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)', fontWeight: 700 }}>{ex.morse}</code></td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{ex.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETAILED FOCUS CARDS FOR 73, 911, 2026 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>73 in Morse Code</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--signal-bright)', fontWeight: 800, marginBottom: '0.5rem' }}>
              73 = --... ...--
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              In amateur radio, <strong>73</strong> is commonly used as a friendly closing meaning "best regards."
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>911 in Morse Code</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--signal-bright)', fontWeight: 800, marginBottom: '0.5rem' }}>
              911 = ----. .---- .----
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Each 9, 1, and 1 is transmitted as its own Morse character in sequence.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.5rem' }}>2026 in Morse Code</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', color: 'var(--signal-bright)', fontWeight: 800, marginBottom: '0.5rem' }}>
              2026 = ..--- ----- ..--- -....
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Useful for practicing a four-digit number because it contains repeated digits and both dot-heavy and dash-heavy patterns.
            </p>
          </div>

        </div>
      </section>

      {/* 10. MORSE CODE NUMBER TIMING */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>Morse Code Number Timing</h2>
        <p>
          Timing is a core part of Morse code. The standard timing relationship is:
        </p>

        <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
          <table className="seo-table">
            <thead>
              <tr>
                <th>Signal or Gap</th>
                <th style={{ textAlign: 'right', width: '150px' }}>Length (Units)</th>
                <th>Standard Definition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dot (dit)</strong></td>
                <td style={{ textAlign: 'right' }}><strong>1 unit</strong></td>
                <td>Basic unit of time duration</td>
              </tr>
              <tr>
                <td><strong>Dash (dah)</strong></td>
                <td style={{ textAlign: 'right' }}><strong>3 units</strong></td>
                <td>Three times longer than a dot</td>
              </tr>
              <tr>
                <td><strong>Gap between elements</strong></td>
                <td style={{ textAlign: 'right' }}><strong>1 unit</strong></td>
                <td>Silence between dots/dashes within a digit</td>
              </tr>
              <tr>
                <td><strong>Gap between characters</strong></td>
                <td style={{ textAlign: 'right' }}><strong>3 units</strong></td>
                <td>Silence between separate Morse digits/letters</td>
              </tr>
              <tr>
                <td><strong>Gap between words</strong></td>
                <td style={{ textAlign: 'right' }}><strong>7 units</strong></td>
                <td>Silence between complete word groups</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          This means a dash is three times longer than a dot. The dash is <strong>not louder</strong>—it is longer. The silence between signals is also meaningful. It helps the listener separate elements and characters. ARRL documents these standard Morse timing relationships in its code-speed guidance.
        </p>

        {/* CUT NUMBERS AND SHORTCUTS SUBSECTION */}
        <div style={{ marginTop: '1.5rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.5rem' }}>Cut numbers and other shortcuts</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Standard International Morse numbers use the full five-signal patterns shown in the chart. In amateur radio contests, you may encounter <strong>cut numbers</strong> (abbreviated forms like T for 0, A for 1, N for 9, E for 5). A cut number is not the same thing as the standard Morse digit. For general learning and translation, start with standard forms before studying radio shortcuts.
          </p>
        </div>
      </section>

      {/* 11. EXPLORE EACH NUMBER IN MORSE CODE (0–9) */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>Explore Each Number in Morse Code</h2>
        <p>
          Click any card below to listen to its individual signal, read its description, and inspect its rhythm:
        </p>

        <div className="quick-numbers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
          {MORSE_NUMBERS.map((item) => {
            const isPlayingThis = playingCard === item.num;

            return (
              <div
                key={item.num}
                className={`alphabet-card ${isPlayingThis ? 'playing-glow' : ''}`}
                onClick={() => handlePlayCardAudio(item.num, item.morse)}
                style={{ cursor: 'pointer', padding: '1.25rem 1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary-light)', lineHeight: 1 }}>
                    {item.num}
                  </span>
                  <span className="standard-badge" style={{ fontSize: '0.7rem' }}>
                    {item.name}
                  </span>
                </div>

                <div className="morse-font" style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--signal-bright)' }}>
                  {item.morse}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                  {item.ditDah}
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0.25rem 0 0.85rem' }}>
                  {item.description}
                </p>

                <div className="card-actions" onClick={(e) => e.stopPropagation()} style={{ justifyContent: 'center' }}>
                  <button
                    className="card-btn btn-play"
                    onClick={() => handlePlayCardAudio(item.num, item.morse)}
                    title={`Play audio for ${item.name}`}
                  >
                    <Volume2 size={14} className={isPlayingThis ? 'anim-pulse' : ''} /> Play Audio
                  </button>
                  <button
                    className="card-btn btn-copy"
                    onClick={() => handleCopyText(item.morse, `Number ${item.num} Morse`)}
                    title={`Copy Morse for ${item.num}`}
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. NUMBERS VS ALPHABET VS TRANSLATOR */}
      <section className="content-section" style={{ marginTop: '2.5rem' }}>
        <h2>Numbers vs Alphabet vs Translator</h2>
        <p>
          Morse code numbers are part of the wider International Morse Code system, which also includes letters, punctuation, and symbols. Choose the right tool for your learning goal:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
          
          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.4rem' }}>Morse Code Alphabet</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Use when you need A–Z letters, pronunciation guidance, and letter charts.
              </p>
            </div>
            <button
              className="btn-secondary-action"
              onClick={() => setActiveTab('alphabet')}
              style={{ marginTop: '1rem', fontSize: '0.85rem' }}
            >
              Open Alphabet Chart <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.4rem' }}>Morse Code Translator</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Use when you want to convert a complete number, word, sentence, or mixed message instantly.
              </p>
            </div>
            <button
              className="btn-secondary-action"
              onClick={() => setActiveTab('translator')}
              style={{ marginTop: '1rem', fontSize: '0.85rem' }}
            >
              Open Translator <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>Morse Code Decoder</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Use when you already have dots and dashes (or live audio/images) and need to decode their meaning.
              </p>
            </div>
            <button
              className="btn-secondary-action"
              onClick={() => setActiveTab('decoder')}
              style={{ marginTop: '1rem', fontSize: '0.85rem' }}
            >
              Open Decoder <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </section>

      {/* PRINTABLE / DOWNLOADABLE CHART ACTION BANNER */}
      <section className="content-section print-banner" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.75rem', marginTop: '2.5rem', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Printable Morse Code Numbers Chart</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '600px', margin: '0.5rem auto 1.25rem' }}>
          Need an offline reference for study, ham radio field days, or classroom practice? Print or save the complete 0–9 Morse code numbers reference chart.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary-cta" onClick={handlePrintChart} style={{ padding: '0.75rem 1.5rem' }}>
            <Printer size={16} /> Print / Save PDF Chart
          </button>
        </div>
      </section>

      {/* PRINT-ONLY STYLED CONTAINER */}
      <div className="print-only-chart" style={{ display: 'none' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 800 }}>INTERNATIONAL MORSE CODE NUMBERS CHART</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Standard ITU-R M.1677-1 Reference — morsecodetranslatr.io</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th style={{ padding: '8px' }}>Digit</th>
              <th style={{ padding: '8px' }}>Morse Code</th>
              <th style={{ padding: '8px' }}>Visual Elements</th>
              <th style={{ padding: '8px' }}>Spoken Rhythm</th>
            </tr>
          </thead>
          <tbody>
            {MORSE_NUMBERS.map(n => (
              <tr key={n.num} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{n.num} ({n.name})</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '16px' }}>{n.morse}</td>
                <td style={{ padding: '8px' }}>{n.morse.replace(/\./g, '· ').replace(/-/g, '━ ')}</td>
                <td style={{ padding: '8px', fontStyle: 'italic' }}>{n.ditDah}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDUCATIONAL SEO ARTICLE SECTION */}
      <article className="seo-article-container" style={{ marginTop: '3rem' }}>
        <div className="article-body-content">

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="content-section">
            <h2>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              {numberFaqs.map((faq, idx) => (
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

          {/* CLOSING SUMMARY & FINAL CTA BANNER */}
          <section className="content-section cta-banner">
            <h2>Morse Code Numbers Made Simple</h2>
            <p>
              Morse code numbers are easier to learn once you understand the pattern. Every standard digit uses five signals, with numbers 1–5 building from dots and 6–0 building from dashes. This gives you a simple system instead of ten unrelated codes. Use the chart for quick answers, then practice with the Morse Code Translator to convert complete numbers, hear their rhythm, and decode Morse back into digits.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button
                className="btn-primary-cta"
                onClick={() => setActiveTab('translator')}
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                Open Main Morse Code Translator <ArrowRight size={16} />
              </button>
            </div>
          </section>

        </div>
      </article>

    </div>
  );
}
