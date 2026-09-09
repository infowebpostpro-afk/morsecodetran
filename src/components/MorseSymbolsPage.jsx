import React, { useState } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, BookOpen, Hash, Type, HelpCircle, FileText
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { audioEngine } from '../engine/audioEngine.js';

// Specific dataset of Morse Code Symbols (ITU-R M.1677-1 + Common Conventions)
const MORSE_SYMBOLS_DATA = [
  { symbol: '.', name: 'Period / Full stop', morse: '.-.-.-', ditDah: 'di-dah-di-dah-di-dah', category: 'punctuation', status: 'Official ITU', usage: 'End of a sentence' },
  { symbol: ',', name: 'Comma', morse: '--..--', ditDah: 'dah-dah-di-di-dah-dah', category: 'punctuation', status: 'Official ITU', usage: 'Separate parts of a sentence' },
  { symbol: ':', name: 'Colon', morse: '---...', ditDah: 'dah-dah-dah-di-di-dit', category: 'punctuation', status: 'Official ITU', usage: 'Introduce list or quote' },
  { symbol: '?', name: 'Question mark', morse: '..--..', ditDah: 'di-di-dah-dah-di-dit', category: 'punctuation', status: 'Official ITU', usage: 'Question / repetition request' },
  { symbol: "'", name: 'Apostrophe', morse: '.----.', ditDah: 'di-dah-dah-dah-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Contractions and possessives' },
  { symbol: '-', name: 'Hyphen / Dash', morse: '-....-', ditDah: 'dah-di-di-di-di-dah', category: 'punctuation', status: 'Official ITU', usage: 'Compound words & breaks' },
  { symbol: '/', name: 'Fraction bar / Slash', morse: '-..-.', ditDah: 'dah-di-di-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Slash punctuation (also word divider in text)' },
  { symbol: '(', name: 'Left parenthesis', morse: '-.--.', ditDah: 'dah-di-dah-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Opening parenthesis' },
  { symbol: ')', name: 'Right parenthesis', morse: '-.--.-', ditDah: 'dah-di-dah-dah-di-dah', category: 'punctuation', status: 'Official ITU', usage: 'Closing parenthesis' },
  { symbol: '"', name: 'Quotation marks', morse: '.-..-.', ditDah: 'di-dah-di-di-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Direct speech & quotes' },
  { symbol: '=', name: 'Equals / Double hyphen', morse: '-...-', ditDah: 'dah-di-di-di-dah', category: 'punctuation', status: 'Official ITU', usage: 'Transmission separator (<BT>)' },
  { symbol: '+', name: 'Cross / Addition sign', morse: '.-.-.', ditDah: 'di-dah-di-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Addition sign / End of Work (<AR>)' },
  { symbol: '@', name: 'Commercial at', morse: '.--.-.', ditDah: 'di-dah-dah-di-dah-dit', category: 'punctuation', status: 'Official ITU', usage: 'Email addresses & AC symbol' },
  { symbol: '—', name: 'Understood', morse: '...-.', ditDah: 'di-di-di-dah-dit', category: 'operational', status: 'Official ITU', usage: 'Signal for understood message' },
  { symbol: '—', name: 'Error', morse: '........', ditDah: 'di-di-di-di-di-di-di-dit', category: 'operational', status: 'Official ITU', usage: '8 dots error signal (backspace)' },
  { symbol: '—', name: 'Invitation to transmit', morse: '-.-', ditDah: 'dah-di-dah', category: 'operational', status: 'Official ITU', usage: 'Go ahead signal (K)' },
  { symbol: '—', name: 'Wait', morse: '.-...', ditDah: 'di-dah-di-di-dit', category: 'operational', status: 'Official ITU', usage: 'Pause signal (<AS>)' },
  { symbol: '—', name: 'End of work', morse: '...-.-', ditDah: 'di-di-di-dah-di-dah', category: 'operational', status: 'Official ITU', usage: 'Signing off signal (<SK>)' },
  { symbol: '—', name: 'Starting signal', morse: '-.-.-', ditDah: 'dah-di-dah-di-dah', category: 'operational', status: 'Official ITU', usage: 'Commence transmission signal (<CT>)' },
  { symbol: '×', name: 'Multiplication sign', morse: '-..-', ditDah: 'dah-di-di-dah', category: 'punctuation', status: 'Official ITU', usage: 'Multiplication (transmitted using X)' },
  { symbol: '!', name: 'Exclamation mark', morse: '-.-.--', ditDah: 'dah-di-dah-di-dah-dah', category: 'punctuation', status: 'Conventional', usage: 'Exclamation (widely used convention)' },
  { symbol: ';', name: 'Semicolon', morse: '-.-.-.', ditDah: 'dah-di-dah-di-dah-dit', category: 'punctuation', status: 'Conventional', usage: 'Semicolon punctuation' },
  { symbol: '&', name: 'Ampersand', morse: '.-...', ditDah: 'di-dah-di-di-dit', category: 'punctuation', status: 'Conventional', usage: 'And symbol (same pattern as Wait <AS>)' },
  { symbol: '_', name: 'Underscore', morse: '..--.-', ditDah: 'di-di-dah-dah-di-dah', category: 'punctuation', status: 'Conventional', usage: 'Underline / underscore' },
  { symbol: '$', name: 'Dollar sign', morse: '...-..-', ditDah: 'di-di-di-dah-di-di-dah', category: 'punctuation', status: 'Conventional', usage: 'US Currency symbol' },
];

export function MorseSymbolsPage({ wpm, frequency, volume, showToast, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // all, punctuation, operational, official, conventional
  const [playingSymbol, setPlayingSymbol] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Filter symbols based on category & search
  const filteredSymbols = MORSE_SYMBOLS_DATA.filter(item => {
    // Category filter
    if (filterCategory === 'punctuation' && item.category !== 'punctuation') return false;
    if (filterCategory === 'operational' && item.category !== 'operational') return false;
    if (filterCategory === 'official' && item.status !== 'Official ITU') return false;
    if (filterCategory === 'conventional' && item.status !== 'Conventional') return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      item.morse.includes(q) ||
      item.ditDah.toLowerCase().includes(q) ||
      item.usage.toLowerCase().includes(q)
    );
  });

  // Play audio for a single symbol
  const handlePlaySymbol = (item) => {
    setPlayingSymbol(item.name);
    audioEngine.playSequence({
      breakdown: [{ char: item.symbol, morse: item.morse, isSpace: false }],
      wpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingSymbol(null);
      }
    });
  };

  // Copy Morse pattern to clipboard
  const handleCopyMorse = async (morse, name) => {
    try {
      await navigator.clipboard.writeText(morse);
      if (showToast) showToast(`Copied ${name} (${morse}) to clipboard! ✓`);
    } catch (e) {
      if (showToast) showToast('Copy failed. Please copy manually.');
    }
  };

  // Toggle FAQ accordion item
  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const faqData = [
    {
      q: 'What are the symbols in Morse code?',
      a: 'Morse code uses dots and dashes to represent letters, numbers, punctuation, and certain operational signals. The International Morse standard (ITU-R M.1677-1) defines special signs used during radio communications such as Period (.-.-.-), Comma (--..--), Question Mark (..--..), Error (8 dots), and End of Work.'
    },
    {
      q: 'What is ? in Morse code?',
      a: 'The question mark is sent as ..--.. (di-di-dah-dah-di-dit). It is one of the most useful Morse punctuation characters. In operational radio context, the question-mark signal is also sent to request a repetition of a message.'
    },
    {
      q: 'What is a period in Morse code?',
      a: 'A period (full stop) is sent as .-.-.- (di-dah-di-dah-di-dah). It is a six-element Morse pattern used at the end of sentences.'
    },
    {
      q: 'What is a slash in Morse code?',
      a: 'The slash character (/) is sent as -..-. (dah-di-di-dah-dit). Do not confuse this with / used as a visual word separator when Morse is written out in plain text.'
    },
    {
      q: 'What is the at sign (@) in Morse code?',
      a: 'The commercial at sign (@) is sent as .--.-. (di-dah-dah-di-dah-dit), which combines A (.-) and C (-.-.). It was formally added to International Morse Code in 2004 by the ITU.'
    },
    {
      q: 'Is the exclamation mark an official Morse symbol?',
      a: 'Be careful with this one. The exclamation mark is commonly represented as -.-.-- and supported by most Morse software tools. However, it is not explicitly listed among the written punctuation in ITU-R M.1677-1. Therefore, it is best described as a common conventional Morse representation.'
    },
    {
      q: 'What is ........ in Morse code?',
      a: 'Eight consecutive dots (........) are the official ITU Error signal. It indicates that the transmitting operator made a mistake and is about to resend or correct the affected word.'
    },
    {
      q: 'Does Morse code have symbols for every keyboard character?',
      a: 'No. Morse code does not provide a single-character signal for every modern keyboard symbol. The ITU standard provides specific procedures for transmitting signs that lack direct Morse characters, such as using "0-0/0" for percentage (%) or sending "X" for multiplication.'
    }
  ];

  return (
    <div className="symbols-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem' }}>
      
      {/* HERO / HEADER SECTION */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 2rem', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0) 100%)', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <ShieldCheck size={16} /> ITU-R M.1677-1 Standard Compliant Reference
        </div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Morse Code Symbols: Complete Chart, Punctuation & Special Signs
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Morse code is best known for dots and dashes, but it includes much more than letters and numbers. Explore punctuation marks, procedural signals (prosigns), and operational symbols defined in the International Morse standard.
        </p>

        {/* Quick Nav Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <button 
            onClick={() => setActiveTab('alphabet')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Type size={15} /> Morse Alphabet (A–Z)
          </button>
          <button 
            onClick={() => setActiveTab('numbers')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <Hash size={15} /> Morse Numbers (0–9)
          </button>
          <button 
            onClick={() => setActiveTab('morsedecoder')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <FileText size={15} /> Morse Decoder
          </button>
        </div>
      </div>

      {/* INTERACTIVE SYMBOL CHART & SEARCH */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Morse Code Symbols Chart
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
              Filter by category or search any symbol, name, or dot-dash pattern.
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search symbol (e.g. ?, period, .-.-.-)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-card)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'all', label: 'All Symbols' },
            { id: 'official', label: 'Official ITU Standard' },
            { id: 'punctuation', label: 'Punctuation Marks' },
            { id: 'operational', label: 'ITU Operational Signals' },
            { id: 'conventional', label: 'Conventional Software Signs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: filterCategory === tab.id ? 'var(--accent-primary)' : 'var(--border-color)',
                background: filterCategory === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-card)',
                color: filterCategory === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Symbols Table Grid */}
        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Symbol</th>
                <th style={{ padding: '0.85rem 1rem' }}>Name & Usage</th>
                <th style={{ padding: '0.85rem 1rem' }}>Morse Code</th>
                <th style={{ padding: '0.85rem 1rem' }}>Dit-Dah Pattern</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSymbols.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No symbols match your search "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredSymbols.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                      {item.symbol}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.usage}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--accent-warning)' }}>
                      {item.morse}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {item.ditDah}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: item.status === 'Official ITU' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.status === 'Official ITU' ? 'var(--accent-success)' : 'var(--accent-warning)',
                        border: `1px solid ${item.status === 'Official ITU' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handlePlaySymbol(item)}
                          title="Listen to Morse signal"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.4rem',
                            border: '1px solid var(--border-color)',
                            background: playingSymbol === item.name ? 'var(--accent-primary)' : 'var(--surface-hover)',
                            color: playingSymbol === item.name ? '#000' : 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Volume2 size={14} /> Play
                        </button>
                        <button
                          onClick={() => handleCopyMorse(item.morse, item.name)}
                          title="Copy Morse code"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.4rem',
                            border: '1px solid var(--border-color)',
                            background: 'var(--surface-hover)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Copy size={14} /> Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ARTICLE CONTENT SECTIONS */}

      {/* 1. Official ITU Standard Explanation */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} />
          Official Morse Code Symbols: What the ITU Standard Actually Defines
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Online Morse charts do not always agree. Some charts call every commonly supported punctuation mark an “official” International Morse character. Others separate standardized characters from conventions used by radio operators or software.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          For accuracy, the authoritative global specification is <strong>ITU-R M.1677-1</strong>, the International Telecommunication Union recommendation for International Morse code. Its annex lists letters, figures, punctuation, miscellaneous signs, spacing rules, and transmission procedures. The ITU lists this standard as <strong>In force (Main)</strong>.
        </p>

        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-primary)', margin: '1.25rem 0' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            Official ITU-R M.1677-1 Scope
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            The official ITU list includes written punctuation such as period (<code>.-.-.-</code>), comma (<code>--..--</code>), question mark (<code>..--..</code>), apostrophe (<code>.----.</code>), hyphen (<code>-....-</code>), slash (<code>-..-.</code>), parentheses, quotation marks, plus sign, and commercial at sign (<code>.--.-.</code>). It also includes operational signals like <strong>Error</strong> (8 dots), <strong>Wait</strong>, <strong>Invitation to transmit</strong>, and <strong>End of work</strong>.
          </p>
        </div>
      </section>

      {/* 2. Morse Code Punctuation */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Morse Code Punctuation
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Punctuation allows a Morse message to preserve the structure and meaning of written text. Below is the list of primary punctuation marks and their practical roles in Morse communications:
        </p>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', display: 'grid', gap: '1rem' }}>
          {[
            { char: '.', name: 'Period', morse: '.-.-.-', desc: 'Marks end of sentence. Sent as di-dah-di-dah-di-dah.' },
            { char: ',', name: 'Comma', morse: '--..--', desc: 'Separates sentence clauses. Sent as dah-dah-di-di-dah-dah.' },
            { char: '?', name: 'Question Mark', morse: '..--..', desc: 'Requests clarification or repetition. Sent as di-di-dah-dah-di-dit.' },
            { char: '/', name: 'Slash / Fraction Bar', morse: '-..-.', desc: 'Slash punctuation character. Also represents word spaces in text.' },
            { char: '@', name: 'Commercial At', morse: '.--.-.', desc: 'Used for email & modern addresses. Added to ITU standard in 2004.' },
            { char: '=', name: 'Equals / Double Hyphen', morse: '-...-', desc: 'Separates sections or paragraphs in transmission.' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{item.char}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.35rem', fontSize: '0.95rem' }}>{item.morse}</span>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How to Use Morse Symbols & Timing */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          How to Use Morse Code Symbols & Timing Rules
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Morse symbols are sent as individual characters with precise timing gaps between elements. International standard ITU-R M.1677-1 defines the mathematical timing structure:
        </p>

        {/* Visual Timing Card */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1 Unit</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Dot (dit) duration</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-warning)' }}>3 Units</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Dash (dah) duration</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unit</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Intra-character gap</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Units</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Inter-character gap</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-success)' }}>7 Units</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Word gap</div>
            </div>
          </div>
        </div>

        {/* Slash vs Word Separator Note */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <AlertTriangle size={24} style={{ color: 'var(--accent-warning)', flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700 }}>
              Slash (/) vs Word Separator Notation
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
              In typed Morse text, a slash <code>/</code> is frequently used as a visual separator between words (e.g. <code>.... . .-.. .-.. --- / .-- --- .-. .-.. -..</code> = HELLO WORLD). However, the actual Morse code for the slash character (<code>-..-.</code>) is transmitted only when a literal fraction bar or slash symbol is part of the message.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Worked Morse Code Examples */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Worked Morse Code Examples
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          {[
            { title: 'Question Mark Example', symbol: '?', text: 'LOVE?', morse: '.-.. --- ...- . / ..--..', note: 'The final group ..--.. represents the question mark.' },
            { title: 'Period Example', symbol: '.', text: 'HELLO.', morse: '.... . .-.. .-.. --- / .-.-.-', note: 'The final group .-.-.- represents the full stop.' },
            { title: 'Comma Example', symbol: ',', text: 'HELLO,', morse: '.... . .-.. .-.. --- / --..--', note: 'The final group --..-- represents the comma.' },
            { title: 'Commercial At Example', symbol: '@', text: 'INFO@SITE', morse: '.. -. ..-. --- / .--.-. / ... .. - .', note: 'The pattern .--.-. encodes the @ sign.' }
          ].map((ex, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                {ex.title}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {ex.text}
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', fontSize: '0.95rem', letterSpacing: '1px', marginBottom: '0.65rem' }}>
                {ex.morse}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ex.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Common Morse Symbol Mistakes */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Common Morse Code Symbol Mistakes
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 1. Slash vs Word Separator
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Confusing the slash punctuation mark (<code>-..-.</code>) with written space notation (<code>/</code>). Always evaluate whether the slash is part of the text or a separator.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 2. Unofficial Charts
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Assuming every symbol on informal web charts is ITU-standard. For example, exclamation mark (<code>-.-.--</code>) is a conventional software symbol, not an ITU written character.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 3. Ignoring Element Spacing
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              A Morse character is defined by its element gaps. <code>..--..</code> is a question mark when sent as a single unit, but splitting elements changes the character meaning.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 4. Punctuation vs Prosigns
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Confusing punctuation symbols with operational signals. <code>.-.-.</code> represents the plus sign in written text, but serves as <strong>End of Message</strong> (<code>&lt;AR&gt;</code>) in radio protocol.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Symbols Without Their Own Morse Code */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Symbols That Do Not Have Their Own Morse Code
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Not every keyboard symbol has a unique Morse character. This is an important distinction between modern digital keyboard character sets (such as ASCII or Unicode) and International Morse Code.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          The ITU-R M.1677-1 standard specifies official transmission rules for signs that lack standalone Morse signals:
        </p>

        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Multiplication Sign (×):</strong> Transmitted using the Morse signal for letter <code>X</code> (<code>-..-</code>).
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Percentage Sign (%):</strong> Transmitted as a sequence of <code>0</code>, fraction bar <code>/</code>, and <code>0</code> (e.g. <code>2%</code> is transmitted as <code>2-0/0</code>).
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Per Mille Sign (‰):</strong> Transmitted as a sequence of <code>0</code>, fraction bar <code>/</code>, and <code>00</code> (e.g. <code>0/00</code>).
          </li>
        </ul>
      </section>

      {/* 7. Morse Code Symbols vs Prosigns */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Morse Code Symbols vs Prosigns
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A <strong>punctuation symbol</strong> represents written text (such as periods or commas). A <strong>prosign</strong> (procedural signal) is an operational command sent without inter-character spacing to direct communication flow:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Symbol / Prosign</th>
                <th style={{ padding: '0.85rem 1rem' }}>Morse Signal</th>
                <th style={{ padding: '0.85rem 1rem' }}>Primary Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Punctuation</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Plus Sign (+)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>.-.-.</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Addition symbol in mathematical text</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-success)' }}>Prosign</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>&lt;AR&gt; (End of Message)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>.-.-.</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Signals conclusion of message block</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Punctuation</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Equals Sign (=)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>-...-</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Equality symbol in equations</td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-success)' }}>Prosign</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>&lt;BT&gt; (Paragraph Break)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>-...-</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>New paragraph separator signal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} />
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqData.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '1.1rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span>{item.q}</span>
                {openFaqIndex === idx ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
              </button>

              {openFaqIndex === idx && (
                <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.85rem' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL TAKEAWAY & AUTHORITATIVE CITATIONS */}
      <section style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Final Takeaway & Standard References
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Morse code symbols encompass punctuation, special signs, and operational signals. For reliable technical reference, rely on ITU-R M.1677-1 as the primary authority. Need to convert or decode full messages? Use our interactive tools below.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('translator')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Morse Code Translator <ArrowRight size={16} />
          </button>
          <button
            onClick={() => setActiveTab('morsedecoder')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', background: 'var(--surface-hover)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)', cursor: 'pointer' }}
          >
            Morse Code Decoder <ArrowRight size={16} />
          </button>
        </div>

        {/* External References */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          <span>
            Official Standard Source:{' '}
            <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              ITU-R M.1677-1 International Morse code <ExternalLink size={12} />
            </a>
          </span>
          <span>
            Amateur Radio Authority:{' '}
            <a href="https://www.arrl.org/code-characters" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              ARRL Code Characters <ExternalLink size={12} />
            </a>
          </span>
        </div>
      </section>

    </div>
  );
}
