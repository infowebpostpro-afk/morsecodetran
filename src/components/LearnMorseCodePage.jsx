import React, { useState } from 'react';
import {
  ShieldCheck, Volume2, Play, Square, Eye, EyeOff, RotateCcw,
  Sparkles, Zap, Award, ArrowRight, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, BookOpen, Clock, Radio, Headphones
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function LearnMorseCodePage({ wpm, setWpm, frequency, volume, showToast, setActiveTab }) {
  // Practice Drill state
  const [farnsworthWpm, setFarnsworthWpm] = useState(12);
  const [currentLevel, setCurrentLevel] = useState('beginner'); // beginner, koch, words
  const [targetChar, setTargetChar] = useState({ text: 'E', morse: '.' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Drill Datasets
  const beginnerSet = [
    { text: 'E', morse: '.' },
    { text: 'T', morse: '-' },
    { text: 'A', morse: '.-' },
    { text: 'N', morse: '-.' },
    { text: 'M', morse: '--' },
    { text: 'I', morse: '..' },
    { text: 'S', morse: '...' },
    { text: 'O', morse: '---' }
  ];

  const kochSet = [
    { text: 'K', morse: '-.-' },
    { text: 'M', morse: '--' },
    { text: 'R', morse: '.-.' },
    { text: 'S', morse: '...' },
    { text: 'U', morse: '..-' },
    { text: 'A', morse: '.-' },
    { text: 'P', morse: '.--.' },
    { text: 'T', morse: '-' },
    { text: 'L', morse: '.-..' },
    { text: 'O', morse: '---' }
  ];

  const wordSet = [
    { text: 'SOS', morse: '... --- ...' },
    { text: 'CQ', morse: '-.-. --.-' },
    { text: 'HI', morse: '.... ..' },
    { text: 'CAT', morse: '-.-. .- -' },
    { text: 'FOX', morse: '..-. --- -..-' },
    { text: 'HAM', morse: '.... .- --' }
  ];

  const getActiveSet = () => {
    if (currentLevel === 'koch') return kochSet;
    if (currentLevel === 'words') return wordSet;
    return beginnerSet;
  };

  // Pick Next Random Drill Item
  const handleNextDrill = () => {
    const set = getActiveSet();
    let next;
    do {
      next = set[Math.floor(Math.random() * set.length)];
    } while (set.length > 1 && next.text === targetChar.text);

    setTargetChar(next);
    setIsRevealed(false);
    setUserGuess('');
    setFeedback(null);
    handlePlayAudio(next.text);
  };

  // Play Sound for current item
  const handlePlayAudio = (textToPlay = targetChar.text) => {
    audioEngine.stop();
    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18), // keep character speed high (sound-first)
      farnsworthWpm: farnsworthWpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  // Check user guess
  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    if (userGuess.trim().toUpperCase() === targetChar.text.toUpperCase()) {
      setFeedback('correct');
      setIsRevealed(true);
      if (showToast) showToast('Correct! Great acoustic recognition ✓');
    } else {
      setFeedback('incorrect');
      if (showToast) showToast('Not quite. Listen again and check the pattern!');
    }
  };

  const faqs = [
    {
      q: "What is the best way to learn Morse code?",
      a: "For most beginners, learning characters as sounds and practicing regularly is a strong starting approach. Koch-style progression and Farnsworth spacing can make structured practice easier."
    },
    {
      q: "Should I learn Morse code by looking at dots and dashes?",
      a: "Use the dots and dashes as a reference, but focus your training on the sound of each character. ARRL specifically recommends learning the alphabet by how it sounds."
    },
    {
      q: "How many minutes a day should I practice Morse code?",
      a: "Start with a short session that you can repeat consistently. Ten to fifteen focused minutes can be a practical starting point, but the ideal amount depends on your goal and experience."
    },
    {
      q: "Is the Koch method good for beginners?",
      a: "Koch-style training is widely used for progressive Morse learning. It starts with a small character set and adds characters as recognition improves."
    },
    {
      q: "What is Farnsworth timing?",
      a: "Farnsworth timing keeps individual Morse characters relatively fast while increasing the spaces between them. This gives beginners more thinking time without teaching extremely slow character rhythms."
    },
    {
      q: "How long does it take to learn Morse code?",
      a: "There is no universal timeline. With consistent practice, beginners can gradually move from individual characters to words and sentences. Your required speed and intended use will determine how long advanced proficiency takes."
    }
  ];

  return (
    <div className="learn-morse-page-container">

      {/* BREADCRUMB NAVIGATION */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">Learn Morse Code</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="hero-title">How to Learn Morse Code: A Beginner's Guide</h1>
        <p className="hero-subtitle">
          A practical beginner's guide to learning Morse by sound, building recognition, and practicing at a steady pace.
        </p>
      </section>

      {/* INTERACTIVE SOUND RECOGNITION DRILL */}
      <section className="glass-panel interactive-drill-card">
        <div className="drill-header">
          <div className="drill-title">
            <Headphones size={22} className="text-primary" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Interactive Acoustic Practice Drill</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Test your sound-first recognition. Listen to the Morse rhythm before looking at the visual character.
              </p>
            </div>
          </div>

          <div className="drill-level-selector">
            <button
              className={`btn-pill ${currentLevel === 'beginner' ? 'active' : ''}`}
              onClick={() => { setCurrentLevel('beginner'); setIsRevealed(false); setFeedback(null); }}
            >
              Beginner Set
            </button>
            <button
              className={`btn-pill ${currentLevel === 'koch' ? 'active' : ''}`}
              onClick={() => { setCurrentLevel('koch'); setIsRevealed(false); setFeedback(null); }}
            >
              Koch Order
            </button>
            <button
              className={`btn-pill ${currentLevel === 'words' ? 'active' : ''}`}
              onClick={() => { setCurrentLevel('words'); setIsRevealed(false); setFeedback(null); }}
            >
              Short Words
            </button>
          </div>
        </div>

        <div className="drill-body">
          <div className="sound-card-display">
            <div className="sound-visual-indicator">
              <Radio size={42} className={`pulse-icon ${isPlaying ? 'playing' : ''}`} />
              <span className="sound-status-label">
                {isPlaying ? 'Playing Morse Tone...' : 'Click Play to Hear Sound'}
              </span>
            </div>

            <div className="drill-actions">
              <button className="btn-primary" onClick={() => handlePlayAudio()} disabled={isPlaying}>
                <Play size={18} /> Play Sound
              </button>

              <button className="btn-secondary" onClick={() => setIsRevealed(!isRevealed)}>
                {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                {isRevealed ? 'Hide Character' : 'Reveal Answer'}
              </button>

              <button className="btn-secondary" onClick={handleNextDrill}>
                <RotateCcw size={18} /> Next Sound
              </button>
            </div>
          </div>

          <div className="answer-reveal-area">
            {isRevealed ? (
              <div className="revealed-box">
                <span className="revealed-char">{targetChar.text}</span>
                <span className="revealed-morse">{targetChar.morse}</span>
              </div>
            ) : (
              <div className="hidden-box">
                <span className="question-mark">?</span>
                <span className="hint-text">Listen to the rhythm, guess below</span>
              </div>
            )}

            <form onSubmit={handleCheckAnswer} className="drill-input-group">
              <input
                type="text"
                className="drill-input"
                placeholder="Type letter/word..."
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                maxLength={10}
              />
              <button type="submit" className="btn-primary btn-sm">Check</button>
            </form>

            {feedback === 'correct' && (
              <div className="feedback-badge feedback-success">
                <CheckCircle size={16} /> Correct! Automatic auditory recognition.
              </div>
            )}
            {feedback === 'incorrect' && (
              <div className="feedback-badge feedback-error">
                <AlertTriangle size={16} /> Try again! Replay the tone and feel the rhythm.
              </div>
            )}
          </div>
        </div>

        <div className="drill-controls-footer">
          <div className="speed-slider-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Character Speed: <strong style={{ color: 'var(--primary-hover)' }}>{Math.max(wpm, 18)} WPM</strong> (Fast for sound-first)
            </label>
            <input
              type="range"
              min="15"
              max="35"
              value={Math.max(wpm, 18)}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="range-input"
            />
          </div>

          <div className="speed-slider-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Farnsworth Spacing: <strong style={{ color: 'var(--signal-bright)' }}>{farnsworthWpm} WPM</strong> (Extra gap between sounds)
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={farnsworthWpm}
              onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
              className="range-input"
            />
          </div>
        </div>
      </section>

      {/* MASTER ARTICLE CONTENT */}
      <article className="learn-article-container">

        {/* INTRODUCTORY PARAGRAPHS */}
        <section className="article-intro-box">
          <p>
            Learning Morse code is easier when you stop treating it like a chart to memorize. The real goal is to hear a Morse character and recognize it immediately. That means short, regular listening practice is more useful than staring at dots and dashes for hours.
          </p>
          <p>
            Start with sound, then build recognition step by step. The Koch method can help you introduce characters gradually, while Farnsworth timing gives you more space between characters without making each character unnaturally slow. ARRL also recommends learning Morse characters by their sounds rather than relying only on visual patterns.
          </p>
        </section>

        {/* SECTION 1: LEARN BY SOUND, NOT BY SIGHT */}
        <section className="article-section">
          <h2>Learn Morse Code by Sound, Not by Sight</h2>
          <p>
            A Morse chart is useful as a reference. It should not be your main learning method.
          </p>
          <p>
            For example, you can memorize that <strong>A = <code>.-</code></strong>. But when receiving Morse, you do not want to think:
          </p>
          <blockquote className="quote-callout">
            dot → dash → A
          </blockquote>
          <p>
            You want to hear the rhythm and recognize <strong>A</strong> directly.
          </p>
          <p>
            This is why listening practice matters. Play a character, identify it, and check your answer. Then repeat.
          </p>
          <div className="recognition-diagram">
            <div className="diagram-card goal-card">
              <span className="diagram-title">Long-term Goal (Sound-First)</span>
              <div className="diagram-flow">
                <span className="flow-step">Sound (Rhythm)</span>
                <ArrowRight size={16} />
                <span className="flow-step">Character</span>
                <ArrowRight size={16} />
                <span className="flow-step">Word</span>
              </div>
            </div>
            <div className="diagram-card flaw-card">
              <span className="diagram-title">Flawed Beginner Method (Visual)</span>
              <div className="diagram-flow">
                <span className="flow-step">Sound</span>
                <ArrowRight size={16} />
                <span className="flow-step">Dots & Dashes</span>
                <ArrowRight size={16} />
                <span className="flow-step">Character</span>
                <ArrowRight size={16} />
                <span className="flow-step">Word</span>
              </div>
            </div>
          </div>
          <p>
            The second process becomes slow as the code gets faster.
          </p>
        </section>

        {/* SECTION 2: THE KOCH METHOD */}
        <section className="article-section">
          <h2>The Koch Method for Learning Morse Code</h2>
          <p>
            The Koch method teaches Morse progressively.
          </p>
          <p>
            Instead of learning all 26 letters at once, begin with a small character set. Practice those characters at a realistic character speed. Once you can recognize them reliably, add another character.
          </p>
          <p>
            ARRL lists Koch-based training as one of the established ways to practice CW. Its description of G4FON's trainer, for example, uses two characters initially and adds more after reaching about 90% proficiency.
          </p>
          <p>
            The important idea is not memorizing a particular character order. It is learning each sound as an automatic pattern.
          </p>
          <p>
            If you hear a character and immediately know the answer, move forward. If you still have to count every dit and dah, keep practicing the current set.
          </p>
        </section>

        {/* SECTION 3: FARNSWORTH TIMING */}
        <section className="article-section">
          <h2>How Farnsworth Timing Makes Practice Easier</h2>
          <p>
            Beginners often have a problem with speed.
          </p>
          <p>
            Slow Morse gives you too much time to count individual signals. Fast Morse can feel impossible when you are starting.
          </p>
          <p>
            Farnsworth timing offers a middle ground.
          </p>
          <p>
            The characters can be played at a faster character speed while the gaps between characters are made longer. This gives you time to identify each character without changing the basic rhythm of the character itself.
          </p>
          <p>
            For example, you might practice characters at 18–20 WPM while using slower effective spacing. As your recognition improves, reduce the gaps.
          </p>
          <div className="comparison-box">
            <div className="comp-item">
              <strong className="text-primary">Koch Method</strong>
              <span>Controls character progression (what characters you learn and when).</span>
            </div>
            <div className="comp-item">
              <strong className="text-signal">Farnsworth Timing</strong>
              <span>Controls spacing and practice difficulty (character speed vs effective spacing).</span>
            </div>
          </div>
          <p>
            They are related, but they solve different problems.
          </p>
        </section>

        {/* SECTION 4: SIMPLE DAILY PRACTICE ROUTINE */}
        <section className="article-section">
          <h2>A Simple Daily Morse Code Practice Routine</h2>
          <p>
            You do not need marathon sessions. A short daily routine is easier to maintain.
          </p>
          <p>
            Try this structure:
          </p>

          <div className="table-responsive">
            <table className="routine-table">
              <thead>
                <tr>
                  <th>Practice Phase</th>
                  <th>Recommended Time</th>
                  <th>Core Goal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Warm-up</strong></td>
                  <td>2 minutes</td>
                  <td>Review familiar sounds</td>
                </tr>
                <tr>
                  <td><strong>Recognition</strong></td>
                  <td>8 minutes</td>
                  <td>Identify characters by ear</td>
                </tr>
                <tr>
                  <td><strong>Words</strong></td>
                  <td>3 minutes</td>
                  <td>Move from letters to real words</td>
                </tr>
                <tr>
                  <td><strong>Sending</strong></td>
                  <td>2 minutes</td>
                  <td>Reinforce character rhythms</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            Adjust the times to fit your level. The important part is consistency.
          </p>
          <p>
            Daily practice also gives you more chances to notice weak characters. If one sound repeatedly causes mistakes, spend extra time on it instead of restarting the entire alphabet.
          </p>
        </section>

        {/* SECTION 5: LEARN TO RECEIVE MORSE CODE */}
        <section className="article-section">
          <h2>Learn to Receive Morse Code</h2>
          <p>
            Receiving means understanding Morse that someone or something sends to you.
          </p>
          <p>
            This is the skill that needs the most attention if your goal is to understand real CW.
          </p>
          <p>
            Start with individual characters. Then move to short groups. After that, practice common words and simple sentences.
          </p>
          <div className="tip-alert-box">
            <Zap size={20} className="tip-icon" />
            <div>
              <strong>Crucial Receiving Rule:</strong> Do not panic when you miss one character. Keep listening. Trying to recover a missed character while the next characters are already arriving can cause you to miss even more. Current Morse training discussions commonly recommend continuing rather than stopping to chase a missed signal.
            </div>
          </div>
          <p>
            Over time, your brain becomes better at recognizing the rhythm automatically.
          </p>
        </section>

        {/* SECTION 6: LEARN TO SEND MORSE CODE */}
        <section className="article-section">
          <h2>Learn to Send Morse Code</h2>
          <p>
            Sending is useful because it reinforces what you hear.
          </p>
          <p>
            You can begin with simple tapping or a Morse key. Focus on making dots, dashes and spaces consistent.
          </p>
          <p>
            However, do not assume that being able to send a character means you can recognize it instantly when receiving it.
          </p>
          <p>
            Receiving and sending are related skills, but they are not identical. Good practice should eventually include both.
          </p>
        </section>

        {/* SECTION 7: WHEN TO ADD NUMBERS AND PUNCTUATION */}
        <section className="article-section">
          <h2>When to Add Numbers and Punctuation</h2>
          <p>
            Learn the letters first.
          </p>
          <p>
            Once the alphabet becomes comfortable, add numbers. Then introduce common punctuation and procedural signals as your goals require.
          </p>
          <p>
            You do not need every possible Morse character on your first day.
          </p>
          <p>
            For reference, the digits have a useful structure: each number contains five signals. For example:
          </p>
          <div className="digit-structure-grid">
            <div className="digit-pill"><span>1</span> <code>.----</code></div>
            <div className="digit-pill"><span>2</span> <code>..---</code></div>
            <div className="digit-pill"><span>3</span> <code>...--</code></div>
            <div className="digit-pill"><span>4</span> <code>....-</code></div>
            <div className="digit-pill"><span>5</span> <code>.....</code></div>
            <div className="digit-pill"><span>6</span> <code>-....</code></div>
            <div className="digit-pill"><span>7</span> <code>--...</code></div>
            <div className="digit-pill"><span>8</span> <code>---..</code></div>
            <div className="digit-pill"><span>9</span> <code>----.</code></div>
            <div className="digit-pill"><span>0</span> <code>-----</code></div>
          </div>
          <p>
            You can use our <a href="/morse-code-numbers/" onClick={(e) => { e.preventDefault(); setActiveTab('numbers'); }} className="internal-link">Morse Code Numbers</a> page when you are ready to practice them.
          </p>
          <p>
            For the alphabet, use the <a href="/morse-code-alphabet/" onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }} className="internal-link">Morse Code Alphabet</a> as a reference rather than trying to memorize the entire chart in one sitting.
          </p>
        </section>

        {/* SECTION 8: COMMON MISTAKES */}
        <section className="article-section">
          <h2>Common Mistakes That Slow Beginners Down</h2>
          <div className="mistakes-grid">
            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Counting every dot and dash</h3>
                <p>This is one of the biggest problems. Try to recognize the whole rhythm instead.</p>
              </div>
            </div>

            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Watching the chart while listening</h3>
                <p>Use the chart to check answers. Do not depend on it during every exercise.</p>
              </div>
            </div>

            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Practicing only when you have free time</h3>
                <p>Short daily sessions are easier to repeat consistently than long rare sessions.</p>
              </div>
            </div>

            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Trying to catch every missed character</h3>
                <p>Let a missed character go and continue immediately with the next one.</p>
              </div>
            </div>

            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Making the characters too slow</h3>
                <p>Keep character speed higher (18+ WPM) while using wider Farnsworth spacing for learning.</p>
              </div>
            </div>

            <div className="mistake-card">
              <AlertTriangle className="mistake-icon" size={22} />
              <div>
                <h3>Waiting for perfect accuracy</h3>
                <p>You need reliable recognition (~90%), not 100% perfection before every next step.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: HOW LONG DOES IT TAKE */}
        <section className="article-section">
          <h2>How Long Does It Take to Learn Morse Code?</h2>
          <p>
            There is no fixed number of days.
          </p>
          <p>
            Your progress depends on practice frequency, previous experience, learning method and your final goal. Someone who wants to recognize a few common signals needs much less training than someone preparing for fast amateur-radio CW.
          </p>
          <p>
            A better goal is to measure progress by ability:
          </p>
          <div className="roadmap-list">
            <div className="roadmap-step">
              <span className="step-num">1</span>
              <span>Recognize individual characters by ear.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">2</span>
              <span>Recognize characters without counting dots and dashes.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">3</span>
              <span>Copy short groups of characters.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">4</span>
              <span>Recognize common words instantly.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">5</span>
              <span>Copy complete sentences.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">6</span>
              <span>Increase speed gradually with Farnsworth reduction.</span>
            </div>
            <div className="roadmap-step">
              <span className="step-num">7</span>
              <span>Practice real CW on amateur radio when ready.</span>
            </div>
          </div>
          <p>
            This gives you a more useful target than a promise such as "learn Morse in seven days."
          </p>
        </section>

        {/* SECTION 10: PRACTICE TOOLS & RESOURCES */}
        <section className="article-section">
          <h2>Morse Code Practice Tools and Resources</h2>
          <p>
            Your practice setup should make listening and checking easy.
          </p>
          <p>
            A Morse Code translator can help you generate audio from text and verify what you heard. Our <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }} className="internal-link">Morse Code Translator</a> can be used for this type of practice. You can also test your decoding skills with our <a href="/morse-code-decoder/" onClick={(e) => { e.preventDefault(); setActiveTab('morsedecoder'); }} className="internal-link">Morse Code Decoder</a>, <a href="/morse-code-to-english/" onClick={(e) => { e.preventDefault(); setActiveTab('morse2english'); }} className="internal-link">Morse Code to English</a>, and <a href="/english-to-morse-code/" onClick={(e) => { e.preventDefault(); setActiveTab('english2morse'); }} className="internal-link">English to Morse Code</a> tools.
          </p>
          <p>
            For structured CW training, <a href="https://lcwo.net/" target="_blank" rel="noopener noreferrer" className="external-link">Learn CW Online (LCWO)</a> offers a Koch course, speed practice, plain-text training, callsign training and downloadable practice files.
          </p>
          <p>
            The <a href="https://www.arrl.org/learning-morse-code/" target="_blank" rel="noopener noreferrer" className="external-link">ARRL Learning Morse Code</a> resource also collects training programs, code-practice audio and learning resources, including Koch and Farnsworth-based tools.
          </p>
          <p>
            The key is not which tool has the most features. Choose one you will actually use regularly.
          </p>
        </section>

        {/* SECTION 11: FREQUENTLY ASKED QUESTIONS */}
        <section className="article-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-accordion">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </article>

    </div>
  );
}

export default LearnMorseCodePage;
