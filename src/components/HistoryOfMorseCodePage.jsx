import React, { useState } from 'react';
import {
  Clock, BookOpen, ShieldCheck, Zap, Award, ExternalLink, Radio,
  ChevronDown, ChevronUp, Play, Square, Volume2, Copy, Check, ArrowRight,
  Sparkles, Compass, AlertCircle, FileText, Globe, Anchor
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function HistoryOfMorseCodePage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Audio playback helper
  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  // Copy helper
  const handleCopy = (id, textToCopy, label = 'Copied!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Navigation helper
  const handleNav = (e, tab) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const timelineEvents = [
    { year: '1830s', title: 'Telegraph & Code Concepts', desc: 'Samuel Morse begins experimenting with electromagnetic telecommunication ideas.' },
    { year: '1837', title: 'Morse & Vail Collaboration', desc: 'Samuel Morse partners with Alfred Vail and Leonard Gale to design practical apparatus.' },
    { year: '1838', title: 'First Public Demonstration & Alpha Code', desc: 'Morse and Vail demonstrate electrical pulses over wires; Vail designs a flexible alphabetic code.' },
    { year: '1844', title: 'Historic First Telegraph Transmission', desc: 'Samuel Morse sends "What hath God wrought?" from Washington Capitol to Alfred Vail in Baltimore.' },
    { year: '1850s', title: 'Rapid Telegraph Network Expansion', desc: 'Telegraph lines spread across America and Europe, revolutionizing news and business.' },
    { year: '1858', title: 'First Transatlantic Telegraph Cable', desc: 'First underwater telegraph cable connects North America and Europe, proving ocean-spanning telegraphy.' },
    { year: '1865', title: 'International Standardization (ITU)', desc: 'European nations convene in Paris to establish Continental (International) Morse Code.' },
    { year: '1866', title: 'Permanent Transatlantic Cable', desc: 'A durable, high-capacity transatlantic cable begins permanent intercontinental service.' },
    { year: 'Late 1890s', title: 'Marconi & Wireless Telegraphy', desc: 'Guglielmo Marconi proves radio waves can transmit Morse code wirelessly through the air.' },
    { year: '1906', title: 'SOS Adopted as Universal Distress Signal', desc: 'The Berlin Wireless Telegraph Convention establishes SOS (... --- ...) for international maritime safety.' },
    { year: '1912', title: 'Titanic Sinking & Maritime Radio Laws', desc: 'Titanic transmits CQD and SOS signals, leading to mandatory 24/7 radio watch requirements on ships.' },
    { year: '20th Century', title: 'Military & Aviation Reliance', desc: 'Morse code serves as vital strategic signaling during World Wars I and II and early aviation.' },
    { year: '1999', title: 'GMDSS Satellite Shift', desc: 'Global Maritime Distress and Safety System officially replaces mandatory commercial Morse maritime distress watching.' },
    { year: 'Today', title: 'Amateur Radio (CW) & Technical Standardization', desc: 'Morse code remains actively used by ham radio operators (CW) and maintained by ITU Recommendation M.1677-1.' }
  ];

  const faqs = [
    {
      q: 'Who invented Morse code?',
      a: 'Samuel F. B. Morse was the central figure associated with the electric telegraph and the system that bears his name. However, Alfred Vail made major contributions to the telegraph machinery and the alphabetic code. Smithsonian archival records specifically document Vail\'s important role in developing the simpler alphabetic system.'
    },
    {
      q: 'When was Morse code invented?',
      a: 'Morse code developed during the 1830s and 1840s as part of the development of the electric telegraph. Early versions existed before the famous 1844 Washington–Baltimore transmission.'
    },
    {
      q: 'What was the first Morse code message?',
      a: 'The first official telegraph message sent by Samuel Morse over the Washington–Baltimore line on May 24, 1844, was "What hath God wrought?" The Library of Congress preserves the historic record.'
    },
    {
      q: 'Was Morse code always the same?',
      a: 'No. The early American system and modern International Morse are not identical. The original American system evolved, and an international form was developed and standardized for broader use at the 1865 Paris conference.'
    },
    {
      q: 'What did Alfred Vail contribute to Morse code?',
      a: 'Vail made important mechanical improvements to the telegraph recording apparatus and developed a simpler alphabetic code that replaced Morse\'s earlier numerical dictionary approach. His contribution is documented in Smithsonian archival records.'
    },
    {
      q: 'Is Morse code still used today?',
      a: 'Yes. It is no longer the dominant system for commercial telegraphy or maritime distress communication, but it remains in active use in amateur radio (CW operations) and other specialized settings. The ITU continues to maintain an in-force recommendation (ITU-R M.1677-1) for International Morse Code.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header Badge & Title */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Clock size={16} /> Historical Timeline & Development Reference
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          History of Morse Code: From Telegraph to Modern Radio
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Discover the complete history of Morse code: Samuel Morse, Alfred Vail, the 1844 message, International Morse standardization, SOS, Titanic, and modern ham radio.
        </p>
      </header>

      {/* Answer-First Executive Summary Box */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Executive Summary
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          <strong>Morse code</strong> began during the development of the electric telegraph in the <strong>1830s and 1840s</strong>. It gave telegraph operators a practical way to represent letters and numbers as combinations of short and long electrical signals. Samuel F. B. Morse was central to the telegraph project, while Alfred Vail made major contributions to the code and the machinery that made the system practical.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Smithsonian Institution Archives]
          </a>
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          The history of Morse code is the story of a communication problem, an evolving telegraph system, international standardization, wireless radio, maritime signaling, and the shift to digital communication. The version most people use today is <strong>International Morse Code</strong>, which evolved from the original American system.{' '}
          <a href="https://www.loc.gov/collections/samuel-morse-papers/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Library of Congress Morse Papers]
          </a>
        </p>
      </div>

      {/* Section 1: Why Morse Code Was Created */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> Why Morse Code Was Created
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Before the electric telegraph, long-distance messages depended on physical transportation. News and personal messages could travel only as fast as a horse, train, or ship could move. Visual signaling systems such as optical semaphores could transmit information faster in certain conditions, but they required direct line-of-sight towers and were useless in fog or darkness.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          The electric telegraph offered a radical breakthrough: information could travel through a metallic wire near the speed of light as electrical pulses.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          However, sending an electric pulse was only half the solution. Engineers needed a practical system to represent written human language through on/off electrical signals. That is where Samuel Morse and his collaborators created their historic encoding system.{' '}
          <a href="https://www.itu.int/en/history/Pages/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            [ITU Historical Records]
          </a>
        </p>
      </section>

      {/* Section 2: Samuel Morse and Alfred Vail */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award style={{ color: 'var(--accent-primary)' }} /> Samuel Morse and Alfred Vail
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Samuel Finley Breese Morse is the primary figure associated with Morse code. Originally a prominent portrait painter, Morse became fascinated by electromagnetism in the early 1830s.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          However, Morse did not work in isolation. In 1837, Morse partnered with <strong>Alfred Vail</strong> and <strong>Leonard Gale</strong>. Alfred Vail was an exceptionally talented machinist and mechanical engineer whose contributions were pivotal.
        </p>

        {/* Smithsonian Historical Evidence Card */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Primary Source Historical Evidence</div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
            Smithsonian archival records document Alfred Vail's major contributions to both the physical telegraph recording key and the design of the simpler alphabetic code. Vail surveyed local print shops to count letter type frequency, assigning the shortest dot signals to the most frequent English letters like <strong>E (<code>.</code>)</strong> and <strong>T (<code>-</code>)</strong>.{' '}
            <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>
              [Smithsonian Institution Archives]
            </a>
          </p>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          It is therefore most accurate to recognize Samuel Morse as the visionary leader and promoter of the telegraph project, while acknowledging Alfred Vail's foundational engineering role in refining the code into a practical system.
        </p>
      </section>

      {/* Section 3: The Early Morse Code System */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText style={{ color: 'var(--accent-primary)' }} /> The Early Morse Code System
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          The initial concept Morse envisioned in the 1830s was a numerical dictionary system. Electrical pulses would transmit numbers corresponding to full words listed in a master dictionary codebook.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          This dictionary method proved cumbersome because operators had to search a heavy index for every word. Vail helped shift the design toward an alphabetic code where individual letters were represented directly.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The alphabetic approach allowed operators to spell any word, proper noun, or number dynamically without relying on predefined codebooks.{' '}
          <a href="https://www.loc.gov/item/mcc.019/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            [Library of Congress Morse Records]
          </a>
        </p>
      </section>

      {/* Section 4: The 1844 Historic Message */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> The First Official Telegraph Message (1844)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          The most celebrated milestone in Morse code history occurred on <strong>May 24, 1844</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Samuel Morse transmitted the official inaugural message over the newly constructed experimental line funded by Congress between Washington, D.C., and Baltimore, Maryland:
        </p>

        {/* Famous First Message Interactive Card */}
        <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            Historic Transmission • May 24, 1844
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "What hath God wrought?"
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
            Sent from the Supreme Court Chamber inside the U.S. Capitol in Washington, D.C., to Alfred Vail at the B&O Railroad Depot in Baltimore.{' '}
            <a href="https://history.house.gov/Historical-Highlights/1800-1850/The-first-telegraphic-message-sent-from-the-Capitol/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              [U.S. House Archives]
            </a>
          </p>

          <button
            onClick={() => handlePlayMorse('first-message-demo', 'WHAT HATH GOD WROUGHT')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              background: playingId === 'first-message-demo' ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {playingId === 'first-message-demo' ? <Square size={16} /> : <Play size={16} />}
            {playingId === 'first-message-demo' ? 'Stop Historic Audio' : 'Listen to 1844 Message in Morse'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          This transmission proved that electrical communications could deliver instant, accurate human text across substantial physical distances, initiating the telecommunications age.
        </p>
      </section>

      {/* Section 5: American Morse Code vs International Morse Code */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe style={{ color: 'var(--accent-primary)' }} /> American Morse vs. International Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          The early system used across 19th-century American telegraph and railroad lines became known as <strong>American Morse Code</strong> (or Railroad Morse).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          American Morse differed from today's code: it contained internal variable pauses inside certain characters (like <code>C</code>, <code>O</code>, <code>R</code>) and dashes of varying lengths.
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>The 1865 International Standardization</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            To eliminate ambiguous internal pauses across European international telegraph boundaries, <strong>Friedrich Clemens Gerke</strong> modified the code. At the <strong>1865 International Telegraph Conference in Paris</strong>, European nations adopted Continental (International) Morse Code. This conference also established the International Telegraph Union, which later became the International Telecommunication Union (ITU).{' '}
            <a href="https://www.itu.int/en/history/Pages/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
              [ITU History]
            </a>
          </p>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          For modern translation and learning, International Morse Code is the universal standard used worldwide. For character details, consult our{' '}
          <a href="#alphabet" onClick={(e) => handleNav(e, 'alphabet')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Morse Code Alphabet guide
          </a>.
        </p>
      </section>

      {/* Section 6: Transatlantic & Wireless Radio Era */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> From Wires to Wireless Radio
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          In 1858 and 1866, underwater telegraph cables connected North America and Europe across the Atlantic Ocean, reducing message transit time between continents from weeks to minutes.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          In the late 1890s and early 1900s, <strong>Guglielmo Marconi</strong> demonstrated wireless radio telegraphy. Radio allowed Morse signals to be transmitted through the air without physical copper wires.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Wireless Morse (known as Continuous Wave or CW) liberated communication for ships at sea, aircraft, coastal radio stations, and military forces.
        </p>
      </section>

      {/* Section 7: Maritime SOS and the Titanic */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Anchor style={{ color: 'var(--accent-primary)' }} /> Maritime SOS and the Titanic (1912)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Morse code became essential for maritime safety. At the <strong>1906 Berlin International Wireless Telegraph Convention</strong>, the signal <strong>SOS (<code>... --- ...</code>)</strong> was officially adopted as the universal international distress call.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          During the sinking of the <strong>RMS Titanic in April 1912</strong>, Marconi radio operators transmitted both CQD and SOS distress signals, summoning the RMS Carpathia and saving over 700 survivors. The disaster led directly to mandatory 24-hour maritime radio watch regulations.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          For full details on distress signaling, see our guide on{' '}
          <a href="#sos" onClick={(e) => handleNav(e, 'sos')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            SOS in Morse Code
          </a>.
        </p>
      </section>

      {/* Section 8: Decline & Modern Survival */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> Commercial Decline & Modern Survival
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          During the late 20th century, digital satellite systems, automated telex, and fiber-optic networks gradually replaced commercial telegraphy. In <strong>1999</strong>, the Global Maritime Distress and Safety System (GMDSS) officially replaced mandatory Morse code listening watches on commercial ships.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          However, Morse code remains far from dead. It continues as a thriving mode in <strong>Amateur Radio (CW)</strong>, aviation navigation beacons, emergency visual signaling, and assistive accessibility switches.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          The International Telecommunication Union maintains Recommendation{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            ITU-R M.1677-1: International Morse code
          </a>
          , listed as currently in force for radiocommunication services. Learn more in our{' '}
          <a href="#amateur-radio" onClick={(e) => handleNav(e, 'amateurradio')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            Morse Code Amateur Radio guide
          </a>.
        </p>
      </section>

      {/* Section 9: Interactive Timeline Table */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> Chronological Milestones Timeline
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {timelineEvents.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '100px', padding: '0.4rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '6px', fontWeight: 800, textAlign: 'center', fontSize: '1rem' }}>
                {item.year}
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)', flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 10: Frequently Asked Questions (Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 11: Final Takeaway & CTAs */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Experience Morse Code Today
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convert text to Morse code or decode dits and dahs back to readable text with real-time sound audio synthesis.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="#translator"
            onClick={(e) => handleNav(e, 'translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Launch Morse Translator Tool <ArrowRight size={18} />
          </a>
          <a
            href="#alphabet"
            onClick={(e) => handleNav(e, 'alphabet')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Explore Morse Alphabet Reference
          </a>
        </div>
      </footer>
    </div>
  );
}

