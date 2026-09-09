import React, { useState } from 'react';
import {
  ShieldCheck, Volume2, Play, Square, Eye, EyeOff, RotateCcw,
  Sparkles, CheckCircle, AlertTriangle, BookOpen, Clock, Radio, Headphones,
  Copy, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Check, ArrowRight
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function HowToReadMorseCodePage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  // Practice Drill state
  const [drillLevel, setDrillLevel] = useState('written'); // 'written' | 'audio' | 'words'
  const [targetDrill, setTargetDrill] = useState({ text: 'SOS', morse: '... --- ...', type: 'word' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [copiedMorse, setCopiedMorse] = useState(null);

  // Drill Datasets
  const writtenDrills = [
    { text: 'SOS', morse: '... --- ...' },
    { text: 'HI', morse: '.... ..' },
    { text: 'CAT', morse: '-.-. .- -' },
    { text: 'CODE', morse: '-.-. --- -.. .' },
    { text: 'DAY', morse: '-.. .- -.--' }
  ];

  const audioDrills = [
    { text: 'E', morse: '.' },
    { text: 'T', morse: '-' },
    { text: 'A', morse: '.-' },
    { text: 'N', morse: '-.' },
    { text: 'S', morse: '...' },
    { text: 'O', morse: '---' },
    { text: 'R', morse: '.-.' },
    { text: 'K', morse: '-.-' }
  ];

  const phraseDrills = [
    { text: 'HELLO WORLD', morse: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' },
    { text: 'CQ CQ CQ', morse: '-.-. --.- / -.-. --.- / -.-. --.-' },
    { text: 'GOOD DAY', morse: '--. --- --- -.. / -.. .- -.--' },
    { text: 'LOVE', morse: '.-.. --- ...- .' }
  ];

  const getActiveDrillSet = () => {
    if (drillLevel === 'audio') return audioDrills;
    if (drillLevel === 'words') return phraseDrills;
    return writtenDrills;
  };

  const handleNextDrill = () => {
    const set = getActiveDrillSet();
    let next;
    do {
      next = set[Math.floor(Math.random() * set.length)];
    } while (set.length > 1 && next.text === targetDrill.text);

    setTargetDrill(next);
    setIsRevealed(false);
    setUserGuess('');
    setFeedback(null);
    if (drillLevel === 'audio') {
      handlePlayMorseAudio(next.text);
    }
  };

  const handlePlayMorseAudio = (textToPlay = targetDrill.text) => {
    audioEngine.stop();
    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    if (userGuess.trim().toUpperCase() === targetDrill.text.toUpperCase()) {
      setFeedback('correct');
      setIsRevealed(true);
      if (showToast) showToast('Correct reading! Excellent work.');
    } else {
      setFeedback('incorrect');
      if (showToast) showToast('Not quite. Review the Morse pattern and try again.');
    }
  };

  const handleCopyText = (text, label = 'Morse code') => {
    navigator.clipboard.writeText(text);
    setCopiedMorse(text);
    if (showToast) showToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedMorse(null), 2500);
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How do you read Morse code?",
      a: "Separate the Morse into character groups, identify each dot-dash pattern, and match each group to its corresponding character. For audio Morse, learn to recognize each pattern as a rhythm rather than counting individual signals."
    },
    {
      q: "What do the dots and dashes mean?",
      a: "A dot (dit) is a short signal and a dash (dah) is a longer signal. In International Morse timing, a dot is 1 unit of time and a dash is 3 units of time. The gaps between signals determine character (3 units) and word (7 units) boundaries according to ITU-R M.1677-1."
    },
    {
      q: "How do you know where one Morse letter ends?",
      a: "In written Morse, a space normally separates character groups. In transmitted Morse audio, a 3-unit silence gap separates individual letters."
    },
    {
      q: "What does / mean in Morse code?",
      a: "A slash (/) is commonly used in written Morse notation to represent a word separator. It corresponds to the 7-unit silence gap used in transmitted Morse code."
    },
    {
      q: "Can you read Morse code without spaces?",
      a: "Not reliably in every case. Without character boundaries, a continuous dot-dash sequence can have multiple valid interpretations. For example, ...---... can be read as SOS, but without spaces could also be broken down into VEE or SMB."
    },
    {
      q: "Is it better to read Morse by sight or by sound?",
      a: "Sight is useful for learning written patterns. If your goal is to understand transmitted Morse (such as amateur radio CW or audio signals), you should practice recognizing characters by sound rhythms directly."
    }
  ];

  return (
    <div className="alphabet-page-container">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">How to Read Morse Code</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="hero-title">How to Read Morse Code</h1>
        <p className="hero-subtitle">
          Learn to decode Morse code by sight and sound using simple patterns, timing rules, worked examples, and practical reading drills.
        </p>
      </section>

      {/* QUICK SUMMARY BOX */}
      <div className="callout-box" style={{ margin: '1.5rem 0', background: 'var(--bg-card)', borderLeft: '4px solid var(--accent-primary)', padding: '1.25rem', borderRadius: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} className="text-primary" /> The Core Secret to Reading Morse Code
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          To read Morse code, <strong>separate each character using its gaps</strong>, match the dot-dash pattern to a letter, and gradually learn each pattern as a <strong>rhythm rather than counting individual dots and dashes</strong>.
        </p>
      </div>

      {/* INTERACTIVE READING DRILL MODULE */}
      <section className="glass-panel interactive-drill-card" style={{ marginBottom: '3rem' }}>
        <div className="drill-header">
          <div className="drill-title">
            <Headphones size={22} className="text-primary" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Interactive Morse Reading Practice Drill</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Test your decoding skills. Read the written Morse code or play the audio rhythm, then check your answer.
              </p>
            </div>
          </div>

          <div className="drill-level-selector">
            <button
              className={`btn-pill ${drillLevel === 'written' ? 'active' : ''}`}
              onClick={() => { setDrillLevel('written'); setIsRevealed(false); setFeedback(null); }}
            >
              Written Morse
            </button>
            <button
              className={`btn-pill ${drillLevel === 'audio' ? 'active' : ''}`}
              onClick={() => { setDrillLevel('audio'); setIsRevealed(false); setFeedback(null); }}
            >
              Ear / Audio
            </button>
            <button
              className={`btn-pill ${drillLevel === 'words' ? 'active' : ''}`}
              onClick={() => { setDrillLevel('words'); setIsRevealed(false); setFeedback(null); }}
            >
              Words & Phrases
            </button>
          </div>
        </div>

        <div className="drill-body">
          <div className="sound-card-display">
            <div className="sound-visual-indicator" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1.5rem', textAlign: 'center' }}>
              <span className="morse-font" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.15em', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1.25rem', borderRadius: '0.5rem' }}>
                {targetDrill.morse}
              </span>
              <span className="sound-status-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {isPlaying ? 'Playing Audio Signal...' : 'Inspect Morse Code or Play Audio'}
              </span>
            </div>

            <div className="drill-actions">
              <button className="btn-primary" onClick={() => isPlaying ? handleStopAudio() : handlePlayMorseAudio()}>
                {isPlaying ? <Square size={18} /> : <Play size={18} />}
                {isPlaying ? 'Stop Audio' : 'Play Sound'}
              </button>

              <button className="btn-secondary" onClick={() => setIsRevealed(!isRevealed)}>
                {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                {isRevealed ? 'Hide Character' : 'Reveal Answer'}
              </button>

              <button className="btn-secondary" onClick={handleNextDrill}>
                <RotateCcw size={18} /> Next Drill
              </button>
            </div>
          </div>

          <div className="answer-reveal-area">
            {isRevealed ? (
              <div className="revealed-box">
                <span className="revealed-char">{targetDrill.text}</span>
                <span className="revealed-morse">{targetDrill.morse}</span>
              </div>
            ) : (
              <div className="hidden-box">
                <span className="question-mark">?</span>
                <span className="hint-text">Decode the Morse above & type your answer</span>
              </div>
            )}

            <form onSubmit={handleCheckAnswer} className="drill-input-group">
              <input
                type="text"
                className="drill-input"
                placeholder="Type decoded text (e.g. SOS)..."
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                maxLength={20}
              />
              <button type="submit" className="btn-primary btn-sm">Check Answer</button>
            </form>

            {feedback === 'correct' && (
              <div className="feedback-badge feedback-success">
                <CheckCircle size={16} /> Correct! Excellent reading precision.
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="feedback-badge feedback-error">
                <AlertTriangle size={16} /> Incorrect reading. Compare the Morse pattern again.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT LAYER */}
      <article className="article-content">
        <section className="content-section">
          <p>
            Reading Morse code is easier when you understand one important idea: the code is not just dots and dashes. The <strong>spaces and timing between signals also carry meaning</strong>. Once you know how those patterns are grouped, you can read simple Morse messages letter by letter.
          </p>
          <p>
            For written Morse, you can start by separating each group and matching it to the alphabet. For audio Morse, the goal is different. You want to hear each character as a rhythm instead of counting every dot and dash.
          </p>
        </section>

        {/* SECTION: HOW MORSE CODE WORKS */}
        <section className="content-section">
          <h2>How Morse Code Works: Dots, Dashes, and Gaps</h2>
          <p>
            International Morse Code uses two basic signals:
          </p>
          <ul>
            <li><strong>Dot (dit):</strong> a short signal duration</li>
            <li><strong>Dash (dah):</strong> a longer signal duration</li>
          </ul>
          <p>
            A dash is three times the duration of a dot under the standard timing system. International Morse timing is defined by International Telecommunication Union Standard <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer">ITU-R Recommendation M.1677-1</a>.
          </p>
          <p>
            However, the signals are only part of the system. The gaps tell you how the signals are grouped:
          </p>

          <div className="table-responsive">
            <table className="alphabet-table">
              <thead>
                <tr>
                  <th>Part of Morse</th>
                  <th>Standard Timing</th>
                  <th>Description & Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dot (dit)</strong></td>
                  <td><code>1 unit</code></td>
                  <td>Short basic unit of Morse signal duration.</td>
                </tr>
                <tr>
                  <td><strong>Dash (dah)</strong></td>
                  <td><code>3 units</code></td>
                  <td>Long signal duration (3× dot duration).</td>
                </tr>
                <tr>
                  <td><strong>Gap inside character</strong></td>
                  <td><code>1 unit</code></td>
                  <td>Silence between dots and dashes in the same letter.</td>
                </tr>
                <tr>
                  <td><strong>Gap between letters</strong></td>
                  <td><code>3 units</code></td>
                  <td>Silence separating one character group from the next.</td>
                </tr>
                <tr>
                  <td><strong>Gap between words</strong></td>
                  <td><code>7 units</code></td>
                  <td>Silence separating complete words.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            For example, the letter <strong>A</strong> is <code className="morse-font">.-</code>. There is a short 1-unit internal gap between its dot and dash. A longer 3-unit gap tells you that the next character has started.
          </p>
          <p>
            That is why spacing matters so much when you read Morse code.
          </p>
        </section>

        {/* SECTION: STEP BY STEP */}
        <section className="content-section">
          <h2>How to Read Morse Code Step by Step</h2>

          <h3>1. Separate Each Morse Character</h3>
          <p>
            Start by looking for the spaces between character groups.
          </p>
          <p>
            For example: <code className="morse-font">.... . .-.. .-.. ---</code>
          </p>
          <p>
            Break it into distinct character blocks:
          </p>
          <p style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <code className="morse-font" style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-card)', borderRadius: '0.25rem' }}>....</code>
            <code className="morse-font" style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-card)', borderRadius: '0.25rem' }}>.</code>
            <code className="morse-font" style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-card)', borderRadius: '0.25rem' }}>.-..</code>
            <code className="morse-font" style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-card)', borderRadius: '0.25rem' }}>.-..</code>
            <code className="morse-font" style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-card)', borderRadius: '0.25rem' }}>---</code>
          </p>
          <p>
            Each group represents one letter.
          </p>

          <h3>2. Match the Pattern to a Letter</h3>
          <p>
            Now compare each group with a Morse Code alphabet reference:
          </p>
          <ul>
            <li><code className="morse-font">....</code> = H</li>
            <li><code className="morse-font">.</code> = E</li>
            <li><code className="morse-font">.-..</code> = L</li>
            <li><code className="morse-font">.-..</code> = L</li>
            <li><code className="morse-font">---</code> = O</li>
          </ul>
          <p>
            The result is: <strong>HELLO</strong>
          </p>
          <p>
            You can use our dedicated <a href="/morse-code-alphabet/" onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }}>Morse Code Alphabet</a> reference while you are learning.
          </p>

          <h3>3. Keep Track of Word Boundaries</h3>
          <p>
            A word separator is commonly written as <code className="morse-font">/</code>.
          </p>
          <p>
            For example: <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code>
          </p>
          <p>
            becomes: <strong>HELLO WORLD</strong>
          </p>
          <p>
            Do not treat the slash as a letter. It represents a word boundary in written Morse notation.
          </p>
        </section>

        {/* SECTION: TIMING */}
        <section className="content-section">
          <h2>How Morse Code Timing Helps You Read</h2>
          <p>
            Timing becomes especially important when Morse is transmitted as sound, light, or another physical signal.
          </p>

          <h3>Dot and Dash Timing</h3>
          <p>
            A dot lasts one time unit. A dash lasts three time units. Inside a single character, the gap between signals is one unit.
          </p>
          <p>
            For example, <strong>A</strong> is <code className="morse-font">.-</code>. You hear a short signal, a short internal pause, then a longer signal.
          </p>

          <h3>Letter and Word Gaps</h3>
          <p>
            A three-unit gap separates letters. A seven-unit gap separates words.
          </p>
          <p>
            This means the silence is part of the information. Morse learning resources consistently emphasize that beginners often struggle not with the dots and dashes themselves, but with recognizing where characters and words end.
          </p>
        </section>

        {/* SECTION: WRITTEN MORSE */}
        <section className="content-section">
          <h2>How to Read Written Morse Code</h2>
          <p>
            Written Morse is the easiest place to start. Use this simple process:
          </p>
          <ol>
            <li>Read from left to right.</li>
            <li>Separate characters at the spaces.</li>
            <li>Match each pattern to a letter or number.</li>
            <li>Watch for <code>/</code> between words.</li>
            <li>Write the result as normal text.</li>
          </ol>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Example 1: SOS</h4>
              <p className="morse-font" style={{ fontSize: '1.3rem', color: 'var(--accent-primary)', fontWeight: 700 }}>... --- ...</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <code>...</code> (S) + <code>---</code> (O) + <code>...</code> (S) = <strong>SOS</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="btn-secondary btn-sm" onClick={() => handlePlayMorseAudio('SOS')}>
                  <Play size={14} /> Play
                </button>
                <button className="btn-secondary btn-sm" onClick={() => handleCopyText('... --- ...', 'SOS Morse')}>
                  {copiedMorse === '... --- ...' ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Example 2: HI</h4>
              <p className="morse-font" style={{ fontSize: '1.3rem', color: 'var(--accent-primary)', fontWeight: 700 }}>.... ..</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <code>....</code> (H) + <code>..</code> (I) = <strong>HI</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button className="btn-secondary btn-sm" onClick={() => handlePlayMorseAudio('HI')}>
                  <Play size={14} /> Play
                </button>
                <button className="btn-secondary btn-sm" onClick={() => handleCopyText('.... ..', 'HI Morse')}>
                  {copiedMorse === '.... ..' ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
            </div>
          </div>

          <p>
            If you are still learning the alphabet, keep the chart nearby. The goal is to need it less often as your recognition improves.
          </p>
        </section>

        {/* SECTION: READING BY EAR */}
        <section className="content-section">
          <h2>How to Read Morse Code by Ear</h2>
          <p>
            Reading Morse by ear is a different skill from reading it on a screen.
          </p>
          <p>
            When you hear Morse, the signal disappears as soon as it is played. You cannot stop and inspect it like written text. The best long-term goal is to recognize the <strong>rhythm of a complete character</strong>.
          </p>
          <ul>
            <li><strong>A</strong> = <code className="morse-font">.-</code> &rarr; dit-dah</li>
            <li><strong>N</strong> = <code className="morse-font">-.</code> &rarr; dah-dit</li>
            <li><strong>S</strong> = <code className="morse-font">...</code> &rarr; dit-dit-dit</li>
            <li><strong>O</strong> = <code className="morse-font">---</code> &rarr; dah-dah-dah</li>
          </ul>
          <p>
            Try not to think: <em>dot &rarr; dash &rarr; A</em>. Instead, work toward: <em>di-dah &rarr; A</em>. This removes an extra mental translation step.
          </p>

          <h3>Hear the Rhythm, Not the Count</h3>
          <p>
            Counting individual dots and dashes can work for slow written practice. It becomes much harder when Morse arrives quickly. Instead, listen for the shape of the whole character. Learn <code className="morse-font">.-</code> as one sound pattern rather than two separate symbols.
          </p>

          <h3>Start With Simple Characters</h3>
          <p>
            Useful starting characters include: <strong>E</strong> (<code>.</code>), <strong>T</strong> (<code>-</code>), <strong>I</strong> (<code>..</code>), <strong>M</strong> (<code>--</code>), <strong>S</strong> (<code>...</code>), <strong>O</strong> (<code>---</code>), <strong>A</strong> (<code>.-</code>), and <strong>N</strong> (<code>-.</code>). These short patterns help you become familiar with Morse rhythm before moving to longer characters.
          </p>

          <h3>Move From Letters to Words</h3>
          <p>
            Once individual characters become easier, practice short words. Do not stay on isolated letters forever. Reading real words helps your brain use context while still improving character recognition.
          </p>
        </section>

        {/* SECTION: WORKED EXAMPLES */}
        <section className="content-section">
          <h2>Worked Morse Code Reading Examples</h2>

          <h3>E, T, A, N, S, and O Rhythm Reference</h3>
          <div className="table-responsive">
            <table className="alphabet-table">
              <thead>
                <tr>
                  <th>Letter</th>
                  <th>Morse</th>
                  <th>Rhythm Sound</th>
                  <th>Audio Preview</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { text: 'E', morse: '.', rhythm: 'dit' },
                  { text: 'T', morse: '-', rhythm: 'dah' },
                  { text: 'A', morse: '.-', rhythm: 'dit-dah' },
                  { text: 'N', morse: '-.', rhythm: 'dah-dit' },
                  { text: 'S', morse: '...', rhythm: 'dit-dit-dit' },
                  { text: 'O', morse: '---', rhythm: 'dah-dah-dah' }
                ].map((item) => (
                  <tr key={item.text}>
                    <td><strong>{item.text}</strong></td>
                    <td><code className="morse-font">{item.morse}</code></td>
                    <td><code>{item.rhythm}</code></td>
                    <td>
                      <button className="btn-secondary btn-sm" onClick={() => handlePlayMorseAudio(item.text)}>
                        <Play size={14} /> Listen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Worked Breakdowns</h3>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-primary)' }}>SOS Breakdown</h4>
            <p className="morse-font" style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>... --- ...</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Read each separated group: <strong>S + O + S = SOS</strong>. The spaces are important. Without them, the same sequence of nine signals would not tell you how the characters were intended to be grouped.
            </p>
            <button className="btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => handlePlayMorseAudio('SOS')}>
              <Play size={14} /> Hear SOS
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-primary)' }}>HELLO Breakdown</h4>
            <p className="morse-font" style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>.... . .-.. .-.. ---</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Read it as: <code>....</code> (H) + <code>.</code> (E) + <code>.-..</code> (L) + <code>.-..</code> (L) + <code>---</code> (O) = <strong>HELLO</strong>.
            </p>
            <button className="btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => handlePlayMorseAudio('HELLO')}>
              <Play size={14} /> Hear HELLO
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            <h4 style={{ fontWeight: 800, color: 'var(--text-primary)' }}>HELLO WORLD Breakdown</h4>
            <p className="morse-font" style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              The <code>/</code> marks the word boundary. Read: (H-E-L-L-O) [word gap] (W-O-R-L-D) = <strong>HELLO WORLD</strong>.
            </p>
            <button className="btn-secondary btn-sm" style={{ marginTop: '0.5rem' }} onClick={() => handlePlayMorseAudio('HELLO WORLD')}>
              <Play size={14} /> Hear HELLO WORLD
            </button>
          </div>
        </section>

        {/* SECTION: WITHOUT SPACES */}
        <section className="content-section">
          <h2>How to Read Morse Code Without Spaces</h2>
          <p>
            This is where reading Morse becomes difficult. Consider continuous unspaced Morse:
          </p>
          <p className="morse-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'inline-block' }}>
            ...---...
          </p>
          <p>
            People commonly recognize this as <strong>SOS</strong>, but arbitrary Morse without character boundaries can be ambiguous.
          </p>
          <p>
            Why? Because the decoder does not know where one character ends and another begins. A continuous stream of dots and dashes can often be divided into multiple valid character sequences.
          </p>
          <p>
            Therefore, do not assume that an unspaced Morse message has only one possible interpretation. If you are decoding a real message, look for:
          </p>
          <ul>
            <li>Original transmission timing</li>
            <li>Visible spaces or line breaks</li>
            <li>Word separators (like slashes)</li>
            <li>Surrounding context</li>
            <li>Repeated patterns</li>
            <li>A known source or message type</li>
          </ul>
          <p>
            If you need to decode typed Morse, our <a href="/morse-code-decoder/" onClick={(e) => { e.preventDefault(); setActiveTab('morsedecoder'); }}>Morse Code Decoder</a> can help verify a properly separated message.
          </p>
        </section>

        {/* SECTION: COMMON MISTAKES */}
        <section className="content-section">
          <h2>Common Mistakes When Reading Morse Code</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>1. Counting Every Dot and Dash</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                Counting can help while learning the chart. However, it becomes too slow when receiving Morse by ear. Practice recognizing complete character rhythms instead.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>2. Ignoring Letter Gaps</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                The gap between letters is not decoration. It tells you where one character ends and the next begins. Always respect the 3-unit letter gap.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>3. Missing Word Separators</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                A longer pause (7 units) separates words in transmitted Morse. In written Morse, <code>/</code> is commonly used to show that boundary.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>4. Guessing Unknown Patterns</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                If a Morse group does not match a known character, do not invent an answer. Check if you missed a dot, added a dash, or misidentified character boundaries.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: FASTER READING */}
        <section className="content-section">
          <h2>How to Read Morse Code Faster</h2>
          <p>
            Speed comes from automatic recognition. A useful progression is:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.05rem' }}>
            letters &rarr; short groups &rarr; words &rarr; sentences &rarr; real audio
          </p>
          <p>
            Do not measure progress only by how many characters you can memorize. Instead, ask yourself: <em>"Can I recognize the character without mentally translating every dot and dash?"</em>
          </p>
          <p>
            If yes, your reading skill is developing. If you repeatedly get stuck on one pair of characters (e.g. <code>A</code> vs <code>N</code>), practice those sounds together. Contrast practice makes subtle differences easier to hear.
          </p>
        </section>

        {/* SECTION: PRACTICE ROUTINE */}
        <section className="content-section">
          <h2>A Simple Morse Code Reading Practice Routine</h2>
          <p>
            You do not need a long session. Try this daily 15-minute routine:
          </p>

          <div className="table-responsive">
            <table className="alphabet-table">
              <thead>
                <tr>
                  <th>Practice Task</th>
                  <th>Suggested Time</th>
                  <th>Focus Goal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Review characters</strong></td>
                  <td><code>2 minutes</code></td>
                  <td>Quick visual chart check.</td>
                </tr>
                <tr>
                  <td><strong>Listen to individual characters</strong></td>
                  <td><code>5 minutes</code></td>
                  <td>Acoustic rhythm recognition.</td>
                </tr>
                <tr>
                  <td><strong>Read short words</strong></td>
                  <td><code>5 minutes</code></td>
                  <td>Connecting 2–4 letter groups.</td>
                </tr>
                <tr>
                  <td><strong>Decode a short message</strong></td>
                  <td><code>3 minutes</code></td>
                  <td>Real-time decoding & check.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Keep sessions consistent. If training by ear, use audio rather than watching written Morse at the same time. That forces your brain to recognize sound instead of visual patterns.
          </p>
          <p>
            Your <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Morse Code Translator</a> can help you generate Morse audio from normal text and check what you heard. For structured learning methodologies, our <a href="/learn-morse-code/" onClick={(e) => { e.preventDefault(); setActiveTab('learn'); }}>Learn Morse Code</a> guide covers Koch and Farnsworth methods.
          </p>
        </section>

        {/* SECTION: VERIFICATION */}
        <section className="content-section">
          <h2>How to Check If You Read Morse Correctly</h2>
          <p>
            When you manually decode a message, use these three verification checks:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>1. Character Boundaries</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Make sure each group represents exactly one valid character in the ITU Morse alphabet.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>2. Text Plausibility</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Ask whether the result forms a plausible word or sentence. Context can help spot a typo.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>3. Re-Encode & Compare</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Convert your decoded text back into Morse and compare it with the original source.
              </p>
            </div>
          </div>

          <p>
            For example, if you decode <code className="morse-font">.... . .-.. .-.. ---</code> as <strong>HELLO</strong>, re-encoding <strong>HELLO</strong> back to Morse should produce <code className="morse-font">.... . .-.. .-.. ---</code>. If it matches, your reading is verified!
          </p>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="content-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-accordion" style={{ margin: '1.5rem 0' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    marginBottom: '0.75rem',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* AUTHORITATIVE EXTERNAL REFERENCES */}
        <section className="content-section">
          <h3>Authoritative Standards & References</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                ITU-R M.1677-1 International Morse Code Standard <ExternalLink size={14} />
              </a>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Official International Telecommunication Union specification defining signal elements, character timings, and spacing.</span>
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <a href="https://www.arrl.org/learning-morse-code" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                ARRL Morse Code Learning Resources <ExternalLink size={14} />
              </a>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)' }}>American Radio Relay League guides and audio practice resources for amateur radio CW operators.</span>
            </li>
          </ul>
        </section>

        {/* PRIVACY GUARANTEE BANNER */}
        <div style={{ margin: '2.5rem 0 1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ShieldCheck size={32} style={{ color: 'var(--accent-success)', flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>100% Client-Side Privacy Guarantee</h4>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              All Morse translation, audio synthesis, and interactive practice drills execute entirely in your browser using local Web Audio APIs. Zero network calls, telemetry, or server logs.
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
