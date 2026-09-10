import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Square, RotateCcw, Check, X, Award, Flame, Zap, Volume2, Sliders,
  HelpCircle, BookOpen, ShieldCheck, CheckCircle, AlertTriangle, ChevronDown,
  ChevronUp, Radio, ArrowRight, Copy, Target, Activity, RefreshCw, Eye, EyeOff,
  ExternalLink, Sparkles
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

// Preset Character Sets for Practice Drills
const CHARACTER_SETS = {
  starter: {
    name: 'Starter 8 (E, T, A, N, I, M, S, O)',
    desc: 'Easiest 1 to 3 element rhythms. Perfect for absolute beginners.',
    items: ['E', 'T', 'A', 'N', 'I', 'M', 'S', 'O']
  },
  letters: {
    name: 'All Letters (A–Z)',
    desc: 'Full 26 English alphabetic Morse characters.',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  numbers: {
    name: 'Numbers (0–9)',
    desc: '5-element numeric Morse patterns.',
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  words: {
    name: 'Short Words (2–4 Letters)',
    desc: 'Common short English words & radio terms.',
    items: ['THE', 'AND', 'FOR', 'NOT', 'YOU', 'ARE', 'DAY', 'HAM', 'SOS', 'CQ', 'RIG', 'CW', 'NEW', 'KEY', 'LOG']
  },
  prosigns: {
    name: 'Punctuation & Radio Prosigns',
    desc: 'Common Morse symbols, punctuation, and CW shorthand.',
    items: ['.', ',', '?', '/', 'SOS', 'CQ', '73']
  }
};

export function MorseCodePracticePage({ setActiveTab, showToast, wpm: globalWpm = 20, frequency: globalFreq = 600, volume: globalVol = 0.5 }) {
  // Practice Trainer State
  const [selectedSetKey, setSelectedSetKey] = useState('starter');
  const [customCharWpm, setCustomCharWpm] = useState(globalWpm || 20);
  const [customFarnsworthWpm, setCustomFarnsworthWpm] = useState(12);
  const [customFreq, setCustomFreq] = useState(globalFreq || 600);

  const [currentTarget, setCurrentTarget] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // { status: 'correct'|'wrong', showAnswer: bool }
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Practice Metrics & Streak Tracking
  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  // Weak Characters Tracker (characters missed during session)
  const [weakChars, setWeakChars] = useState({});

  // UI Accordion & Navigation State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const answerInputRef = useRef(null);

  // Get active pool of practice items
  const activePool = selectedSetKey === 'weak'
    ? (Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items)
    : CHARACTER_SETS[selectedSetKey].items;

  // Pick a new random target item
  const nextRandomTarget = (pool = activePool, avoidCurrent = currentTarget) => {
    let choices = pool;
    if (pool.length > 1 && avoidCurrent) {
      choices = pool.filter(item => item !== avoidCurrent);
    }
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex] || pool[0];
  };

  // Start new practice prompt
  const startNewPrompt = (newSetKey = selectedSetKey) => {
    let pool = CHARACTER_SETS[newSetKey] ? CHARACTER_SETS[newSetKey].items : activePool;
    if (newSetKey === 'weak') {
      pool = Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items;
    }
    const target = nextRandomTarget(pool, currentTarget);
    setCurrentTarget(target);
    setUserAnswer('');
    setFeedback(null);

    // Automatically play audio for the new target after a short delay
    setTimeout(() => {
      playTargetAudio(target);
    }, 150);
  };

  // Initialize first target on mount or set change
  useEffect(() => {
    startNewPrompt(selectedSetKey);
  }, [selectedSetKey]);

  // Audio Playback for Target Signal
  const playTargetAudio = (textToPlay = currentTarget) => {
    if (!textToPlay) return;
    audioEngine.stop();
    setIsPlayingAudio(true);

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(customCharWpm, 18),
      farnsworthWpm: Math.min(customFarnsworthWpm, customCharWpm),
      frequency: customFreq || 600,
      volume: globalVol || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlayingAudio(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlayingAudio(false);
  };

  // Submit Answer Handler
  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    const cleanedUser = userAnswer.trim().toUpperCase();
    const cleanedTarget = currentTarget.trim().toUpperCase();
    const isCorrect = cleanedUser === cleanedTarget;

    setStats(prev => {
      const newAttempts = prev.attempts + 1;
      const newCorrect = isCorrect ? prev.correct + 1 : prev.correct;
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);
      return {
        attempts: newAttempts,
        correct: newCorrect,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      };
    });

    if (isCorrect) {
      setFeedback({ status: 'correct', showAnswer: true });
      if (showToast) showToast(`Correct! "${cleanedTarget}" ✓`);
      // Auto advance to next prompt after short pause
      setTimeout(() => {
        startNewPrompt(selectedSetKey);
      }, 1100);
    } else {
      setFeedback({ status: 'wrong', showAnswer: true });
      // Record weak character for weak-signals drill
      setWeakChars(prev => ({
        ...prev,
        [cleanedTarget]: (prev[cleanedTarget] || 0) + 1
      }));
      if (showToast) showToast(`Incorrect. Replay audio or try again.`);
    }
  };

  // Re-play Audio Snippets for Educational Samples
  const handlePlaySample = (id, textToPlay) => {
    audioEngine.stop();
    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(globalWpm, 18),
      farnsworthWpm: globalWpm,
      frequency: globalFreq || 600,
      volume: globalVol || 0.5,
      onProgress: () => {}
    });
  };

  // Clipboard Copy Helper
  const handleCopy = (id, textToCopy, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Tab Navigation Helper
  const handleNav = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const accuracyPct = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  const faqs = [
    {
      q: 'What is the best way to practice Morse code?',
      a: 'Practice by listening to Morse signals, answering without looking at a visual dot-and-dash chart, checking your answer, and repeating weak characters. Start with a small character set (like Starter 8) and gradually move to words, callsigns, and full sentences.'
    },
    {
      q: 'How many minutes a day should I practice Morse code?',
      a: 'A short, repeatable daily session of 10 to 15 minutes is much more effective than a single long session once a week. Short daily sessions prevent mental fatigue and build reliable auditory sound-recognition memory.'
    },
    {
      q: 'What WPM should a beginner use for Morse code practice?',
      a: 'Modern Morse training recommends using a relatively brisk character speed (18–20 WPM) combined with slower Farnsworth spacing (8–12 WPM). This ensures you learn each character as a single rhythmic sound unit rather than an artificially slow series of counted dots and dashes.'
    },
    {
      q: 'Should I learn Morse code by sound or by looking at dots and dashes?',
      a: 'For receiving practice, prioritize sound. Visual charts are helpful reference tools, but relying on visual dot/dash counting creates a mental bottleneck that prevents copying at higher speeds. ARRL specifically recommends sound-first learning for amateur radio CW.'
    },
    {
      q: 'What is the Koch method for Morse code?',
      a: 'The Koch method, developed by German psychologist Ludwig Koch, introduces characters one by one at full target speed (e.g., 20 WPM). You practice a 2-character set until reaching 90% accuracy, then add a 3rd character, gradually building the full alphabet at target speed.'
    },
    {
      q: 'What is Farnsworth timing?',
      a: 'Farnsworth timing preserves the fast internal dot-and-dash timing of individual characters while inserting extra spacing between characters and words. It gives beginners extra thinking time without forcing them to learn slow, distorted character rhythms.'
    },
    {
      q: 'Why can I recognize letters but not Morse words?',
      a: 'Word copying requires you to hold recognized letters in memory while simultaneously receiving the next incoming sound. Practice transitioning from single letters to 2-letter groups, then short 3-letter words (THE, AND, FOR), and finally full phrases.'
    },
    {
      q: 'Should I practice sending Morse code too?',
      a: 'Yes, if your goal includes transmitting Morse code on amateur radio. However, receiving and sending build different auditory and motor skills. Most instructors recommend building solid receiving recognition before spending heavy time on keyer sending practice.'
    }
  ];

  return (
    <article className="article-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* HEADER SECTION */}
      <header className="article-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '1rem' }}>
          <Target size={16} />
          <span>Interactive Auditory Listening Trainer</span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Morse Code Practice: Listen, Type, Improve
        </h1>

        <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Knowing the Morse code alphabet is only the beginning. The real skill is recognizing each character by sound without stopping to count dots and dashes. Use our interactive trainer to listen, type what you hear, get instant feedback, target weak characters, and build real CW speed.
        </p>

        {/* TRUST BADGES */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '0.85rem 1.15rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Sound-First Auditory Rhythm Training</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sliders size={16} style={{ color: 'var(--accent-success)' }} />
            <span>Farnsworth &amp; Character WPM Controls</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Flame size={16} style={{ color: 'var(--accent-warning)' }} />
            <span>Instant Accuracy &amp; Streak Tracking</span>
          </div>
        </div>
      </header>

      {/* ABOVE THE FOLD: INTERACTIVE PRACTICE TRAINER */}
      <section className="breakdown-section" id="practice-trainer" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          
          {/* TRAINER HEADER & MODE SELECTION */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', pb: '1rem', paddingBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity className="text-accent-primary" size={22} style={{ color: 'var(--accent-primary)' }} />
                <span>Interactive Listening Trainer</span>
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Listen to the Morse signal, type your answer, and check your recognition.
              </span>
            </div>

            {/* Character Set Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Drill Pool:</label>
              <select
                value={selectedSetKey}
                onChange={(e) => setSelectedSetKey(e.target.value)}
                style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {Object.entries(CHARACTER_SETS).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.name}</option>
                ))}
                {Object.keys(weakChars).length > 0 && (
                  <option value="weak">🎯 Target Weak Misses ({Object.keys(weakChars).length})</option>
                )}
              </select>
            </div>
          </div>

          {/* DASHBOARD METRICS BAR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: accuracyPct >= 80 ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
                {accuracyPct}%
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                <Flame size={13} style={{ color: 'var(--accent-warning)' }} /> Current Streak
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-warning)' }}>
                {stats.currentStreak}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Best Streak</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.bestStreak}
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attempts</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {stats.attempts}
              </div>
            </div>
          </div>

          {/* MAIN AUDIO PLAY & INPUT CONTROL CARD */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Step 1: Listen to Morse Audio Signal
              </span>
            </div>

            {/* Audio Trigger Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <button
                onClick={() => playTargetAudio(currentTarget)}
                style={{ fontSize: '1rem', fontWeight: 700, padding: '0.75rem 1.75rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.25)' }}
              >
                {isPlayingAudio ? <Square size={18} /> : <Play size={18} />}
                {isPlayingAudio ? 'Playing Signal...' : 'Play Morse Signal'}
              </button>

              <button
                onClick={() => playTargetAudio(currentTarget)}
                title="Replay Audio"
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Step 2: Type Answer Form */}
            <form onSubmit={handleSubmitAnswer} style={{ maxWidth: '400px', margin: '0 auto' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Step 2: Type What You Hear &amp; Submit
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  ref={answerInputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type letter or word..."
                  style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}
                  autoComplete="off"
                />

                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent-success)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Check size={16} />
                  Submit
                </button>
              </div>
            </form>

            {/* FEEDBACK DISPLAY & ANSWER REVEAL */}
            {feedback && (
              <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: feedback.status === 'correct' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${feedback.status === 'correct' ? 'var(--accent-success)' : 'var(--accent-warning)'}`, display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: feedback.status === 'correct' ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                  {feedback.status === 'correct' ? '✓ Correct Answer!' : '✗ Incorrect Answer'}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Signal was: <strong style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>"{currentTarget}"</strong> (<code className="morse-font" style={{ fontSize: '1.05rem' }}>{translateTextToMorse(currentTarget)}</code>)
                </span>
                <button
                  onClick={() => startNewPrompt(selectedSetKey)}
                  style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '4px', border: 'none', background: 'var(--accent-primary)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  Next Prompt <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* SKIP & SHOW ANSWER CONTROLS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => setFeedback({ status: 'revealed', showAnswer: true })}
                style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <Eye size={13} /> Reveal Solution
              </button>
              <button
                onClick={() => startNewPrompt(selectedSetKey)}
                style={{ fontSize: '0.8rem', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                Skip Signal <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* AUDIO SPEED & FREQUENCY CONTROLS */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={15} style={{ color: 'var(--accent-primary)' }} />
              <span>Trainer Audio Speed &amp; Farnsworth Controls</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Character Speed: <strong>{customCharWpm} WPM</strong>
                <input
                  type="range"
                  min="15"
                  max="35"
                  value={customCharWpm}
                  onChange={(e) => setCustomCharWpm(parseInt(e.target.value))}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                />
              </label>

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Farnsworth Spacing: <strong>{customFarnsworthWpm} WPM</strong>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={customFarnsworthWpm}
                  onChange={(e) => setCustomFarnsworthWpm(parseInt(e.target.value))}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                />
              </label>

              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Audio Pitch: <strong>{customFreq} Hz</strong>
                <input
                  type="range"
                  min="400"
                  max="900"
                  step="25"
                  value={customFreq}
                  onChange={(e) => setCustomFreq(parseInt(e.target.value))}
                  style={{ display: 'block', width: '100%', marginTop: '0.25rem' }}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PRACTICE MORSE CODE ONLINE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Practice Morse Code Online Effectively
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Knowing the Morse code alphabet on paper is only the beginning. The real hurdle is developing immediate auditory recognition—hearing a sound rhythm and identifying the letter instantly without mentally counting dots and dashes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>1. Start With Starter 8</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Begin with 8 simple characters (<code style={{ color: 'var(--accent-primary)' }}>E, T, A, N, I, M, S, O</code>). Master their unique sound rhythms before expanding your pool.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>2. Listen Before Looking</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Always play the audio signal first. Force your brain to identify the sound rhythm before checking a visual chart or revealing the text answer.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>3. Target Weak Misses</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              When you get a character wrong (e.g. confusing <code style={{ color: 'var(--accent-primary)' }}>B</code> and <code style={{ color: 'var(--accent-primary)' }}>V</code>), replay its audio signal 3 times to reinforce the correct sound pattern.
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>4. Progress to Short Words</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Once letter accuracy exceeds 90%, switch the drill pool to Short Words (<code style={{ color: 'var(--accent-primary)' }}>THE, AND, FOR, SOS</code>) to practice holding letters in memory.
            </p>
          </div>
        </div>
      </section>

      {/* CHARACTER SPEED VS FARNSWORTH SPEED EXPLAINED */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Understanding Character Speed vs. Farnsworth Speed
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          One of the biggest mistakes beginners make is practicing at artificially slow character speeds (e.g. 5 WPM). Slowing down the internal dot-and-dash timing alters the musical rhythm of the letter, forcing the learner to count dits and dahs visually.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Setting</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>What It Controls</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Recommended Beginner Range</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Character Speed (WPM)</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>The internal dot/dash timing within each individual letter.</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>18 – 25 WPM (Keeps natural acoustic rhythm)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Farnsworth Spacing</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>The extra pause inserted between separate letters and words.</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>8 – 12 WPM (Gives extra thinking time)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent-primary)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
            Why Farnsworth Timing Works
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Farnsworth timing lets you hear each character at a fast 20 WPM character speed while stretching out the gaps between letters. You get the extra processing time you need as a beginner without destroying the authentic 20 WPM sound pattern of the character.
          </p>
        </div>
      </section>

      {/* THE 10-MINUTE DAILY PRACTICE ROUTINE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          A Simple 10-Minute Daily Morse Code Routine
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Consistency beats intensity. Follow this 10-minute daily routine to build steady copying skills without mental burnout:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Time</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Exercise Focus</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Goal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>2 Minutes</td>
                <td style={{ padding: '0.75rem 1rem' }}>Warm-up with Starter 8</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Get your ear tuned into basic rhythms (<code style={{ color: 'var(--accent-primary)' }}>E T A N I M S O</code>).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>4 Minutes</td>
                <td style={{ padding: '0.75rem 1rem' }}>Active Pool Listening Drill</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Practice your current active set (e.g. All Letters A–Z or Numbers).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>2 Minutes</td>
                <td style={{ padding: '0.75rem 1rem' }}>Target Weak Characters</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Switch to "Target Weak Misses" pool to repeat signals missed during the session.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>1 Minute</td>
                <td style={{ padding: '0.75rem 1rem' }}>Short Word Recognition</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Practice 2–3 letter words (<code style={{ color: 'var(--accent-primary)' }}>AND, FOR, YOU</code>).</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>1 Minute</td>
                <td style={{ padding: '0.75rem 1rem' }}>Accuracy &amp; Progress Review</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Check your accuracy score. If &gt;90%, reduce Farnsworth spacing for tomorrow.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RECEIVING VS SENDING PRACTICE */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Practice Receiving vs. Sending Morse Code
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Receiving (copying) and sending (keying) develop two completely different neural pathways:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Receiving (Auditory Copying)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Requires converting incoming acoustic rhythms into visual or mental text characters.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Train by ear with listening drills and random character pools.</li>
              <li>Focus on head copy without writing down every symbol.</li>
              <li>Use the trainer on this page to build fast auditory recognition.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
              Sending (Telegraph Keying)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Requires motor muscle control to produce precise dot/dash durations and element spacing.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Train with a straight key, paddle, or virtual telegraph key.</li>
              <li>Maintain clean 1:3 dot-to-dash timing ratios.</li>
              <li>For sending drills, visit our <a href="#" onClick={(e) => handleNav(e, 'keyer')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Morse Code Keyer</a>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* EXTERNAL RESOURCES & ARRL CITATIONS */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Official Code Practice Resources &amp; W1AW Audio
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          In addition to web-based trainers, practicing with authentic radio transmissions and official code practice files is highly recommended for amateur radio learners.
        </p>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={18} style={{ color: 'var(--accent-primary)' }} />
            <a href="https://www.arrl.org/learning-morse-code/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              ARRL Learning Morse Code Resources
            </a>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            The American Radio Relay League (ARRL) provides official Morse code learning materials, sound-based training programs, and W1AW code practice schedules.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <ExternalLink size={18} style={{ color: 'var(--accent-primary)' }} />
            <a href="https://www.arrl.org/code-practice-files/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              ARRL W1AW Official Code Practice Files
            </a>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Download real MP3 code practice files transmitted by flagship station W1AW across speed tiers from 5 WPM up to 40 WPM.
          </p>
        </div>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Frequently Asked Questions About Morse Code Practice
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: 1.6, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA BAR */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Explore Other Morse Code Tools &amp; Resources
        </h3>
        <div style={{ display: 'flex', justifyCenter: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button
            onClick={(e) => handleNav(e, 'learn')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Learn Morse Code
          </button>
          <button
            onClick={(e) => handleNav(e, 'keyer')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Telegraph Keyer
          </button>
          <button
            onClick={(e) => handleNav(e, 'alphabet')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Morse Code Alphabet
          </button>
          <button
            onClick={(e) => handleNav(e, 'morsedecoder')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Morse Code Decoder
          </button>
          <button
            onClick={(e) => handleNav(e, 'amateurradio')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
          >
            Amateur Radio CW
          </button>
        </div>
      </footer>
    </article>
  );
}
