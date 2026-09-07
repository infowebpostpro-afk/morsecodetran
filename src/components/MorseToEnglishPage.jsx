import React, { useState } from 'react';
import {
  ShieldCheck, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import { MorseToEnglishTool } from './MorseToEnglishTool.jsx';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';

export function MorseToEnglishPage({ wpm, setWpm, frequency, volume, showToast, setActiveTab }) {
  // FAQ Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // A-Z Morse Map Entries
  const alphabetEntries = Object.entries(MORSE_CODE_MAP).filter(([_, data]) => data.type === 'letter');

  const faqs = [
    {
      q: "How do I translate Morse code into English?",
      a: "Paste the Morse code into a Morse Code to English translator. In written Morse, use spaces to separate characters and / to show word breaks. The translator matches each Morse pattern with its corresponding character."
    },
    {
      q: "What does .... . .-.. .-.. --- mean?",
      a: "It means HELLO. The five groups represent H (....), E (.), L (.-..), L (.-..), and O (---)."
    },
    {
      q: "What does ... --- ... mean?",
      a: "It represents SOS, the internationally recognized Morse distress signal. The signal is commonly transmitted continuously as ...---..."
    },
    {
      q: "Can I decode Morse code without spaces?",
      a: "Not reliably in every case. Morse depends on character boundaries. If those boundaries are removed, a sequence of dots and dashes may have multiple possible interpretations. SOS is a special case because its distress signal is conventionally transmitted as one continuous sequence."
    },
    {
      q: "What does / mean in Morse code?",
      a: "In written Morse, / is commonly used to show a word break. For example: .... .. / - .... . .-. . means HI THERE. It represents a word boundary in written Morse. It is not a separate signal inserted into an actual Morse transmission."
    },
    {
      q: "Why is my Morse translation wrong?",
      a: "Check the character spacing first. Then check for missing dots, extra dashes, incorrect word separators, unsupported characters, and incorrect dash characters. If the Morse came from an image, compare the transcription with the original image."
    },
    {
      q: "Can Morse code be translated from audio?",
      a: "Audio Morse requires timing analysis. A text decoder works with dots, dashes, and written separators, while an audio decoder must first identify the short and long signals and their timing gaps. For audio-specific decoding, use the dedicated Morse Code Audio Translator."
    },
    {
      q: "Can Morse code be translated from an image?",
      a: "Yes, if the dots, dashes, and boundaries can be identified. For a clear image, transcribe the Morse first and then decode it. If automatic image recognition is used, check the detected Morse against the original image because image quality can affect dots, dashes, and spacing."
    },
    {
      q: "Is Morse code a language?",
      a: "No. Morse code is a system for representing characters as signals. It can represent letters, numbers, punctuation, and other characters, but it is not a spoken language."
    },
    {
      q: "Is Morse code the same everywhere?",
      a: "No. This translator uses International Morse Code. American Morse and other Morse-based systems use different conventions. International Morse is covered by ITU-R Recommendation M.1677-1, which the ITU currently lists as in force."
    },
    {
      q: "What is the difference between a Morse translator and a Morse decoder?",
      a: "The terms often overlap. A Morse decoder usually means a tool that converts Morse into readable text. A Morse translator can refer to conversion in either direction, such as Morse to text or text to Morse."
    },
    {
      q: "Can a Morse translator decode numbers?",
      a: "Yes. International Morse includes codes for the digits 0 through 9 (e.g. ----- = 0, .---- = 1, ..--- = 2, ...-- = 3, ....- = 4, ..... = 5, -.... = 6, --... = 7, ---.. = 8, ----. = 9). For the complete number reference, use the Morse Code Numbers page."
    },
    {
      q: "Can Morse code represent punctuation?",
      a: "Yes. International Morse includes punctuation and other characters in addition to the basic alphabet and digits. ARRL's Morse reference includes common characters such as the period, comma, question mark, and slash. Use the Morse Code Symbols page for a complete reference."
    },
    {
      q: "What are Morse code prosigns?",
      a: "Prosigns are special procedural signals used in some Morse communications. They are not always ordinary letters or punctuation. They are especially relevant in amateur radio and operational Morse use. If a message contains a special procedural signal, check whether the translator supports it before treating it as a normal character."
    },
    {
      q: "Why does Morse code need spaces?",
      a: "In written Morse, spaces show where one character ends and another begins. Without those boundaries, a decoder may not know how to divide the dots and dashes into letters. In actual transmission, these boundaries are created by timing gaps rather than literal spaces."
    },
    {
      q: "Can I learn Morse code using a translator?",
      a: "Yes. Try to identify the character yourself first, then use the translator to check your answer. This gives you immediate feedback while you build recognition. For structured practice, use the Learn Morse Code guide."
    },
    {
      q: "What standard does this Morse Code Translator use?",
      a: "This translator is designed around International Morse Code. The International Telecommunication Union lists Recommendation M.1677-1 as the current in-force recommendation for International Morse Code."
    }
  ];

  return (
    <div className="morse-to-english-page-container">

      {/* BREADCRUMB */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumb">
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('translator'); }}>Home</a>
        <span className="separator">/</span>
        <span className="current">Morse Code to English</span>
      </nav>

      {/* HERO SECTION */}
      <section className="alphabet-hero">
        <div className="standard-badge">
          <ShieldCheck size={14} className="text-primary" />
          <span>International Standard ITU-R M.1677-1</span>
        </div>
        <h1 className="alphabet-title">Morse Code to English Translator</h1>
        <p className="alphabet-subtitle">
          Have you ever copied a string of dots and dashes into a translator and received a strange or incomplete result? A missing space, an extra dash, or a character copied incorrectly can change the decoded message.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
          While building and testing this Morse Code to English tool, we found that <strong>character spacing and input quality are two of the most common causes of decoding problems</strong>. This guide explains how to decode written Morse, how character and word boundaries work, and how to check an unexpected result.
        </p>
      </section>

      {/* EMBEDDED INTERACTIVE TOOL (TOP OF PAGE) */}
      <section style={{ marginBottom: '2.5rem' }}>
        <MorseToEnglishTool showToast={showToast} />
      </section>

      {/* EDUCATIONAL ARTICLE CONTAINER */}
      <article className="seo-article-container">
        <div className="article-body-content">

          {/* QUICK ANSWER */}
          <section className="content-section">
            <h2>Quick Answer: Morse Code to English</h2>
            <p>
              To translate Morse code into English, each group of dots and dashes is matched with its corresponding character.
            </p>
            <p>For example:</p>
            <ul className="content-list" style={{ fontFamily: 'var(--font-mono)' }}>
              <li><code>....</code> = H</li>
              <li><code>.</code> = E</li>
              <li><code>.-..</code> = L</li>
              <li><code>.-..</code> = L</li>
              <li><code>---</code> = O</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              So: <code className="morse-font">.... . .-.. .-.. ---</code> becomes <strong>HELLO</strong>.
            </p>
            <p>
              For multiple words, written Morse commonly uses <code>/</code> to show a word break:
            </p>
            <p style={{ fontFamily: 'var(--font-mono)' }}>
              <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> becomes <strong>HELLO WORLD</strong>.
            </p>
            <p>
              The important part is the character boundary. In written Morse, the dots and dashes belonging to one character are normally written together. A space commonly separates characters, and <code>/</code> commonly separates words.
            </p>
            <p>
              These written separators represent the timing gaps used in actual Morse transmission: standard timing uses one unit between elements inside a character, three units between characters, and seven units between words.
            </p>
          </section>

          {/* HOW TO DECODE MORSE CODE TO ENGLISH & A-Z TABLE */}
          <section className="content-section">
            <h2>How to Decode Morse Code to English</h2>
            <p>
              Morse code represents characters with two basic signals: Dot (<code>.</code>) and Dash (<code>-</code>). Each letter has its own pattern:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Letter</th>
                    <th>Morse Code</th>
                    <th>Spoken Rhythm</th>
                    <th>Phonetic Name</th>
                  </tr>
                </thead>
                <tbody>
                  {alphabetEntries.map(([char, data]) => (
                    <tr key={char}>
                      <td><strong>{char}</strong></td>
                      <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>{data.morse}</code></td>
                      <td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{data.ditDah}</td>
                      <td>{data.phonetic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1.25rem' }}>
              To decode a written message, separate it into character groups. For example: <code className="morse-font">-.-- --- ..-</code> becomes:
            </p>
            <ul className="content-list" style={{ fontFamily: 'var(--font-mono)' }}>
              <li><code>-.--</code> → Y</li>
              <li><code>---</code> → O</li>
              <li><code>..-</code> → U</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              The result is <strong>YOU</strong>. A Morse Code to English translator performs this character matching automatically. For the complete A–Z reference, use the{' '}
              <a href="/morse-code-alphabet/" onClick={(e) => { e.preventDefault(); setActiveTab('alphabet'); }}>Morse Code Alphabet</a> page.
            </p>
          </section>

          {/* HOW IT WORKS */}
          <section className="content-section">
            <h2>How it works</h2>
            <p>
              A Morse Code to English translator uses a mapping between Morse patterns and characters. For example, <code className="morse-font">...</code> → S, <code className="morse-font">---</code> → O, <code className="morse-font">...</code> → S.
            </p>
            <p>
              The translator reads <code className="morse-font">... --- ...</code>, identifies three character groups, and converts each group into its corresponding character. The result is <strong>SOS</strong>.
            </p>
            <p>
              For a longer message like <code className="morse-font">.... . .-.. .-.. ---</code>, the translator reads:
            </p>
            <ol className="content-list" style={{ paddingLeft: '1.25rem' }}>
              <li><code>....</code> → H</li>
              <li><code>.</code> → E</li>
              <li><code>.-..</code> → L</li>
              <li><code>.-..</code> → L</li>
              <li><code>---</code> → O</li>
            </ol>
            <p style={{ marginTop: '0.75rem' }}>
              The final result is <strong>HELLO</strong>. The boundary between characters is essential so the decoder knows which dots and dashes belong together.
            </p>
          </section>

          {/* HOW TO READ MORSE CODE */}
          <section className="content-section">
            <h2>How to read Morse code</h2>
            <p>
              Reading Morse code means recognizing each group of dots and dashes as a character. Start with short patterns:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', margin: '1rem 0' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <code>.</code> = E | <code>-</code> = T
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <code>..</code> = I | <code>.-</code> = A
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <code>-.</code> = N | <code>--</code> = M
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                <code>...</code> = S | <code>---</code> = O
              </div>
            </div>
            <p>
              Then learn longer patterns. When reading written Morse, look for spaces between character groups: <code className="morse-font">.... . .-.. .-.. ---</code> is read as <code>....</code> | <code>.</code> | <code>.-..</code> | <code>.-..</code> | <code>---</code>, giving <strong>H E L L O</strong>.
            </p>
            <p>
              When learning audio Morse, try to recognize the rhythm of the complete character instead of counting every dot and dash.
            </p>
          </section>

          {/* HOW MORSE SPACING WORKS */}
          <section className="content-section">
            <h2>How Morse Spacing Works</h2>
            <p>
              Spacing is one of the most important parts of Morse code. Actual Morse transmission uses timing gaps rather than literal spaces.
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Signal or Gap</th>
                    <th style={{ textAlign: 'right', width: '150px' }}>Standard Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Dot (dit)</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>1 unit</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Dash (dah)</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>3 units</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Gap inside character</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>1 unit</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Gap between characters</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>3 units</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Gap between words</strong></td>
                    <td style={{ textAlign: 'right' }}><strong>7 units</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Written Morse represents these timing gaps with separators. For example, <code className="morse-font">.-..</code> is one character (L). To write <strong>L E</strong>, use <code className="morse-font">.-.. .</code>. The space shows that L and E are separate characters. For two words, use <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code>.
            </p>
          </section>

          {/* WHY SPACES MATTER MORE THAN DOTS */}
          <section className="content-section">
            <h2>Why the spaces matter more than the dots</h2>
            <p>
              A missing dot can change one character. Missing character boundaries can affect an entire message.
            </p>
            <p>
              Consider <code className="morse-font">...</code> (This is <strong>S</strong>). But <code className="morse-font">. . .</code> represents <strong>E E E</strong>. The dots did not change—the grouping changed!
            </p>
            <p>
              This is why a Morse decoder needs both the Morse elements and their boundaries. <code className="morse-font">... --- ...</code> has three clear character groups (<strong>SOS</strong>), whereas <code className="morse-font">...---...</code> does not show written boundaries.
            </p>

            <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.5rem' }}>SOS is a special case</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                The SOS distress signal is commonly transmitted as one continuous signal (<code className="morse-font">...---...</code>). It is often written as <code className="morse-font">... --- ...</code> for readability. You should not use the SOS signal as evidence that normal Morse messages can always be decoded without character spacing. For ordinary written Morse, preserving character boundaries is essential.
              </p>
            </div>
          </section>

          {/* READING DOTS AND DASHES: COMMON CONFUSIONS */}
          <section className="content-section">
            <h2>Reading Dots and Dashes: Common Confusions</h2>
            <p>
              Morse input errors are often small. A single missing dot or extra dash changes the result:
            </p>
            <ul className="content-list" style={{ fontFamily: 'var(--font-mono)' }}>
              <li><code>..</code> = I | <code>...</code> = S | <code>....</code> = H (One extra dot changes the character)</li>
              <li><code>-</code> = T | <code>--</code> = M | <code>---</code> = O (One extra dash changes the character)</li>
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.4rem' }}>Spaces inside a character</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  H is <code className="morse-font">....</code>. It should not be written as <code className="morse-font">. . . .</code> (which represents four separate E characters: <strong>E E E E</strong>).
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--signal-bright)', marginBottom: '0.4rem' }}>Wrong dash character</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Standard written Morse uses <code>.</code> for dot and <code>-</code> for dash. Text copied from other apps may contain em-dashes (<code>—</code>). Our translator normalizes them automatically.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.4rem' }}>Incorrect word separators</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  A slash (<code>/</code>) is commonly used to represent a word break (e.g. <code className="morse-font">.... .. / - .... . .-. .</code> = <strong>HI THERE</strong>).
                </p>
              </div>

            </div>
          </section>

          {/* WORD SEPARATOR RULES */}
          <section className="content-section">
            <h2>Word Separator Rules</h2>
            <p>
              A word separator shows where one word ends and another begins. In written Morse, <code>/</code> is commonly used for this purpose.
            </p>
            <p>
              For example: <code className="morse-font">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> means <strong>HELLO WORLD</strong>.
            </p>
            <p>
              The slash is a written separator. It is not an additional signal inserted into an actual Morse transmission. During actual transmission, the word boundary is represented by a 7-unit timing gap. Using <code>/</code> for word breaks is standard for clear written Morse.
            </p>
          </section>

          {/* COMMON MORSE -> ENGLISH TABLE */}
          <section className="content-section">
            <h2>Common Morse → English</h2>
            <p>Here are some common Morse messages:</p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Morse Code</th>
                    <th>English Text</th>
                    <th>Character Groups</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>... --- ...</code></td><td><strong>SOS</strong></td><td>S → O → S</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.... . .-.. .-.. ---</code></td><td><strong>HELLO</strong></td><td>H → E → L → L → O</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-.-- . ...</code></td><td><strong>YES</strong></td><td>Y → E → S</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-. ---</code></td><td><strong>NO</strong></td><td>N → O</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>--. --- --- -..</code></td><td><strong>GOOD</strong></td><td>G → O → O → D</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>-... -.-- .</code></td><td><strong>BYE</strong></td><td>B → Y → E</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-.. --- ...- .</code></td><td><strong>LOVE</strong></td><td>L → O → V → E</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>- .... .- -. -.- ...</code></td><td><strong>THANKS</strong></td><td>T → H → A → N → K → S</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-- .- - . .-.</code></td><td><strong>WATER</strong></td><td>W → A → T → E → R</td></tr>
                  <tr><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--signal-bright)' }}>.-.. . .- .-. -.</code></td><td><strong>LEARN</strong></td><td>L → E → A → R → N</td></tr>
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              For complete digit and symbol references, use the dedicated <a href="/morse-code-numbers/" onClick={(e) => { e.preventDefault(); setActiveTab('numbers'); }}>Morse Code Numbers</a> and Morse Code Symbols pages.
            </p>
          </section>

          {/* A WORKED EXAMPLE */}
          <section className="content-section">
            <h2>A worked example</h2>
            <p>Suppose you receive this Morse message:</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-sm)', color: 'var(--signal-bright)', margin: '0.75rem 0 1.25rem' }}>
              .-- . .-.. -.-. --- -- . / - --- / -- --- .-. ... .
            </div>
            <p>First, identify the word breaks (three words separated by <code>/</code>):</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-light)', margin: '0 0 0.5rem' }}>1. First Word: .-- . .-.. -.-. --- -- .</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  .-- → W | . → E | .-.. → L | -.-. → C<br />
                  --- → O | -- → M | . → E<br />
                  <strong>Result: WELCOME</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--signal-bright)', margin: '0 0 0.5rem' }}>2. Second Word: - ---</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  - → T | --- → O<br /><br />
                  <strong>Result: TO</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', margin: '0 0 0.5rem' }}>3. Third Word: -- --- .-. ... .</h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', margin: 0, lineHeight: 1.6 }}>
                  -- → M | --- → O | .-. → R | ... → S | . → E<br /><br />
                  <strong>Result: MORSE</strong>
                </p>
              </div>
            </div>

            <p style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '1.1rem' }}>
              The complete message is: <span style={{ color: 'var(--signal-bright)' }}>WELCOME TO MORSE</span>
            </p>
          </section>

          {/* TIPS FOR DECODING BY EAR */}
          <section className="content-section">
            <h2>Tips for decoding by ear</h2>
            <p>
              Written Morse and audio Morse are different input formats. With written Morse, you can see the dots, dashes, and boundaries. With audio Morse, you hear short (1 unit) and long (3 unit) signals.
            </p>
            <p>
              For audio learning, focus on recognizing the rhythm of the complete character (e.g. E = <code>.</code>, T = <code>-</code>, A = <code>.-</code>, N = <code>-.</code>, S = <code>...</code>, O = <code>---</code>). ARRL learning guidance recommends recognizing characters as complete acoustic sounds rather than counting dots and dashes.
            </p>
          </section>

          {/* DECODING MORSE YOU CAN SEE, NOT HEAR */}
          <section className="content-section">
            <h2>Decoding morse you can see, not hear</h2>
            <p>
              Morse code appears in visual forms such as tattoos, bracelets, jewelry, escape-room puzzles, screenshots, and artwork. Follow this 6-step visual decoding process:
            </p>
            <ol className="content-list" style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li>Identify each dot.</li>
              <li>Identify each dash.</li>
              <li>Preserve the gaps between characters.</li>
              <li>Identify the word breaks.</li>
              <li>Enter the transcription into the translator.</li>
              <li>Check the result against the original image.</li>
            </ol>
            <p style={{ marginTop: '0.75rem' }}>
              For example, a Morse bracelet with <code className="morse-font">.. / .-.. --- ...- . / -.-- --- ..-</code> decodes as <strong>I LOVE YOU</strong>.
            </p>
          </section>

          {/* DECODE EMOTIONAL AND EVERYDAY MESSAGES */}
          <section className="content-section">
            <h2>Decode emotional and everyday messages</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>I LOVE YOU</strong><br />
                <code className="morse-font" style={{ fontSize: '0.9rem', color: 'var(--signal-bright)' }}>.. / .-.. --- ...- . / -.-- --- ..-</code>
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>I MISS YOU</strong><br />
                <code className="morse-font" style={{ fontSize: '0.9rem', color: 'var(--signal-bright)' }}>.. / -- .. ... ... / -.-- --- ..-</code>
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>THANK YOU</strong><br />
                <code className="morse-font" style={{ fontSize: '0.9rem', color: 'var(--signal-bright)' }}>- .... .- -. -.- / -.-- --- ..-</code>
              </div>
              <div style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                <strong>GOOD NIGHT</strong><br />
                <code className="morse-font" style={{ fontSize: '0.9rem', color: 'var(--signal-bright)' }}>--. --- --- -.. / -. .. --. .... -</code>
              </div>
            </div>
          </section>

          {/* SPEED TIPS & THE SOS PATTERN */}
          <section className="content-section">
            <h2>The SOS Pattern as a Reference Point</h2>
            <p>
              SOS is one of the best-known Morse signals: <code className="morse-font">... --- ...</code> (3 dots, 3 dashes, 3 dots).
            </p>
            <p>
              The actual distress signal is transmitted as the continuous sequence <code className="morse-font">...---...</code>. It is an internationally recognized distress signal and was not officially an acronym for "Save Our Souls" or "Save Our Ship". Those phrases were associated later.
            </p>
          </section>

          {/* DECODE ANY SIGNAL (5 STEPS & SCOPE) */}
          <section className="content-section">
            <h2>Decode any signal</h2>
            <ol className="content-list" style={{ paddingLeft: '1.25rem', lineHeight: 1.7 }}>
              <li><strong>Enter the Morse code:</strong> Paste or type dots and dashes.</li>
              <li><strong>Check character spaces:</strong> Ensure clear spaces between character groups.</li>
              <li><strong>Check word breaks:</strong> Use <code>/</code> where a new word starts.</li>
              <li><strong>Read the English output:</strong> The translator performs character matching automatically.</li>
              <li><strong>Check unclear results:</strong> Look for missing dots/dashes, wrong dash characters, or bad spacing. Perform <strong>round-trip verification</strong> by converting the English back to Morse to verify.</li>
            </ol>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Note: This tool uses <strong>International Morse Code</strong> (ITU-R Recommendation M.1677-1). Historical American Morse and Wabun telegraph codes use different conventions.
            </p>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="content-section">
            <h2>People Also Ask</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              {faqs.map((faq, idx) => (
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

          {/* ABOUT THE AUTHOR & CLOSING SUMMARY */}
          <section className="content-section cta-banner">
            <h2>About the Author & Reliability Standard</h2>
            <p>
              This guide is maintained as part of the <strong>Morse Code Translator</strong> reference library. Technical information is checked against authoritative references, including ITU Recommendation M.1677-1 and established Morse training material from ARRL. If a translation looks unexpected, check character boundaries and perform round-trip verification to ensure accuracy.
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
