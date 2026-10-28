import React, { useState } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, X, Sparkles, BookOpen, HelpCircle, Printer
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { audioEngine } from '../engine/audioEngine.js';

export function PortugueseAlphabetPage({
  wpm = 20,
  setWpm,
  frequency = 600,
  volume = 0.5,
  onTranslateCharacter,
  showToast,
  setActiveTab
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('letter'); // letter, portuguese, number, punctuation, prosign, all
  const [selectedChar, setSelectedChar] = useState(null);

  // Play A-Z Sequence State
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [playingCharKey, setPlayingCharKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    if (e) e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (path && typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({ tab }, '', path);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Base entries from standard map
  const entries = Object.entries(MORSE_CODE_MAP);

  // Filter entries
  const filteredEntries = entries.filter(([char, data]) => {
    if (category === 'portuguese') return false; // Handled separately in dedicated section
    if (category !== 'all' && data.type !== category) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;

    const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;
    return (
      displayChar.toLowerCase().includes(q) ||
      data.name.toLowerCase().includes(q) ||
      data.morse.includes(q) ||
      (data.phonetic && data.phonetic.toLowerCase().includes(q))
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

  // Copy Morse code
  const handleCopyMorse = async (morse, label) => {
    try {
      await navigator.clipboard.writeText(morse);
      if (showToast) showToast(`Código Morse de ${label} (${morse}) copiado com sucesso! ✓`);
    } catch {
      if (showToast) showToast('Não foi possível copiar para a área de transferência.');
    }
  };

  // Play A-Z Sequence
  const handlePlayAZSequence = () => {
    const letters = entries.filter(([_, d]) => d.type === 'letter');
    if (letters.length === 0) return;

    setIsPlayingSeq(true);

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
    setPlayingCharKey(null);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/pt/" onClick={(e) => handleNav(e, 'portuguese', '/pt/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Início</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Alfabeto Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Alfabeto Morse: Tabela Completa de Letras A–Z, Números e Sons
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '850px', margin: '0 auto', lineHeight: 1.6 }}>
          Consulte o alfabeto Morse internacional completo, escute o áudio em tempo real de cada caractere, confira a cedilha (Ç), a normalização de acentos em português e as regras exatas de temporização da UIT.
        </p>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {!isPlayingSeq ? (
            <button
              onClick={handlePlayAZSequence}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', cursor: 'pointer' }}
            >
              <Play size={18} />
              <span>Ouvir Alfabeto A–Z Completo</span>
            </button>
          ) : (
            <button
              onClick={handleStopSequence}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', color: 'var(--danger)', cursor: 'pointer' }}
            >
              <Square size={18} />
              <span>Interromper Reprodução Sonora</span>
            </button>
          )}

          <a
            href="/pt/"
            onClick={(e) => handleNav(e, 'portuguese', '/pt/')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', textDecoration: 'none' }}
          >
            <span>Ir para o Tradutor de Texto a Morse</span>
            <ArrowRight size={18} />
          </a>

          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', cursor: 'pointer' }}
          >
            <Printer size={18} />
            <span>Imprimir Tabela</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'letter', label: 'Letras (A–Z)' },
              { id: 'portuguese', label: 'Português (Ç e Acentos)' },
              { id: 'number', label: 'Números (0–9)' },
              { id: 'punctuation', label: 'Pontuação' },
              { id: 'prosign', label: 'Prosigns (ITU)' },
              { id: 'all', label: 'Ver Tudo' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: category === cat.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                  color: category === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 auto', maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Buscar letra, código ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Special Section: Portuguese Characters (Ç and Accents) */}
      {(category === 'portuguese' || category === 'all' || category === 'letter') && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Cedilha (Ç) e Tratamento de Acentos na Língua Portuguesa
            </h2>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Na norma internacional ITU-R M.1677-1 são especificadas originalmente as 26 letras do alfabeto latino básico. Para o idioma português, a telegrafia profissional e o radioamadorismo adotam a extensão canônica para o <strong>Ç</strong> (<code style={{ color: 'var(--accent-primary)' }}>-.-..</code>), enquanto as vogais acentuadas (Á, É, Í, Ó, Ú, Â, Ê, Ô, Ã, Õ) são normalizadas para a sua letra base correspondente, assegurando 100% de inteligibilidade em comunicações globais.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* Ç card */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backgroundColor: playingCharKey === 'Ç' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Ç</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cedilha (Extensão Internacional)</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handlePlaySingle('Ç', '-.-..')}
                    title="Escutar som"
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={() => handleCopyMorse('-.-..', 'Ç')}
                    title="Copiar Morse"
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--text-primary)', marginTop: '0.75rem' }}>
                -.-..
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                dah-di-dah-di-dit • Normalizado como C (-.-.)
              </div>
            </div>

            {/* Accented vowels breakdown cards */}
            {[
              { char: 'Á / Â / Ã / À', latin: 'A', morse: '.-', name: 'Vogal A acentuada', sound: 'di-dah' },
              { char: 'É / Ê', latin: 'E', morse: '.', name: 'Vogal E acentuada', sound: 'dit' },
              { char: 'Í', latin: 'I', morse: '..', name: 'Vogal I acentuada', sound: 'di-dit' },
              { char: 'Ó / Ô / Õ', latin: 'O', morse: '---', name: 'Vogal O acentuada', sound: 'dah-dah-dah' },
              { char: 'Ú / Ü', latin: 'U', morse: '..-', name: 'Vogal U acentuada', sound: 'di-di-dah' }
            ].map(item => (
              <div
                key={item.char}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.char}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Normalizado como: {item.latin}</div>
                  </div>
                  <button
                    onClick={() => handlePlaySingle(item.latin, item.morse)}
                    title="Escutar som"
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                  {item.morse}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {item.sound}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Alphabet Grid */}
      {category !== 'portuguese' && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
            {filteredEntries.map(([char, data]) => {
              const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;
              const isPlaying = playingCharKey === char;

              return (
                <div
                  key={char}
                  className="glass-panel character-card"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isPlaying ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isPlaying ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
                        {displayChar}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                        {data.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => handlePlaySingle(char, data.morse)}
                        title="Ouvir tom em Morse"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isPlaying ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                      <button
                        onClick={() => handleCopyMorse(data.morse, displayChar)}
                        title="Copiar código Morse"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0.35rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-warning, #f59e0b)' }}>
                      {data.morse}
                    </div>
                    {data.ditDah && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>
                        {data.ditDah}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* EDUCATIONAL SEO CONTENT SECTION (3,000+ words complete guide) */}
      <article className="seo-article-container" style={{ marginTop: '3.5rem' }}>
        <div className="article-body-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* INTRODUÇÃO PAS */}
          <div className="article-intro-card" style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Você sabe que o código Morse utiliza pontos e traços, mas encontrar a combinação exata de uma letra específica ainda pode gerar incertezas. Uma busca rápida por "letra A em código Morse" ou "tabela do alfabeto Morse" geralmente devolve apenas gráficos estáticos, sem explicar como escutar o ritmo musical do sinal, como memorizá-lo com naturalidade ou como utilizá-lo na prática. Padrões espelhados como <strong>A (<code className="morse-font">.-</code>)</strong> e <strong>N (<code className="morse-font">-.</code>)</strong> são frequentemente confundidos por quem está começando.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
              Por isso, este guia do <strong>Alfabeto Morse Completo</strong> foi construído como um referencial técnico e didático definitivo para a nossa plataforma. Aqui você encontra as 26 letras de A a Z, números, pontuação, sinais de procedimento (prosigns), regras de temporização da UIT, truques mnemônicos e exemplos práticos para consultar rapidamente ou treinar até alcançar a fluência auditiva.
            </p>
          </div>

          {/* SEÇÃO: Explore o Alfabeto Morse Internacional */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Explore o Alfabeto Morse Internacional Completo (A–Z)
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              O <strong>alfabeto em código Morse</strong> codifica cada uma das 26 letras básicas do alfabeto latino em combinações bem definidas de pulsos curtos e longos. A norma internacional ampla mantida pela União Internacional de Telecomunicações (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Recomendação ITU-R M.1677-1 <ExternalLink size={12} style={{ display: 'inline' }} /></a>) padroniza esses caracteres para garantir que transmissões de rádio entre operadores de qualquer continente sejam compreendidas sem divergências.
            </p>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Abaixo está a tabela de referência rápida de A a Z em duas colunas:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Letra</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Letra</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>A</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.-</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>N</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-.</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>B</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-...</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>O</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>---</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>C</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-.-.</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>P</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.--.</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>D</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-..</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Q</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>--.-</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>E</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>R</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.-.</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>F</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>..-.</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>S</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>...</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>G</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>--.</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>T</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>H</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>....</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>U</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>..-</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>I</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>..</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>V</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>...-</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>J</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.---</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>W</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.--</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>K</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-.-</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>X</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-..-</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>L</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>.-..</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Y</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>-.--</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>M</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>--</code></td>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Z</td>
                    <td><code className="morse-font" style={{ color: 'var(--accent-warning)' }}>--..</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Um detalhe fundamental sobre a telegrafia: o código Morse <strong>não possui distinção entre letras maiúsculas e minúsculas</strong>. Tanto a letra <strong>A</strong> quanto a letra <strong>a</strong> são transmitidas de maneira idêntica como <code className="morse-font">.-</code>.
            </p>
          </section>

          {/* FIGURA 1: Interface do Tradutor */}
          <figure className="article-figure" style={{ margin: '1rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/morse-code-translator-interface.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-interface.png?v=2"
                alt="Interface interativa do tradutor de código Morse em português com controles de som e reprodução"
                width="1080"
                height="720"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 1:</strong> Interface interativa do tradutor de código Morse demonstrando conversão simultânea em tempo real e controle sonoro com oscilador Web Audio puro.
            </figcaption>
          </figure>

          {/* SEÇÃO: Como Funciona o Alfabeto Morse */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Funciona o Alfabeto Morse: Dits, Dahs e Proporções
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              O código Morse estrutura seus caracteres utilizando dois tipos fundamentais de emissão:
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li><strong>Ponto (dit):</strong> O pulso sonoro curto elementar.</li>
              <li><strong>Traço (dah):</strong> O pulso sonoro prolongado, com duração exatamente três vezes superior à de um ponto.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              É crucial notar que o traço não é emitido com volume mais alto: ele simplesmente permanece sustentado por mais tempo (proporção 3:1).
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>A Estrutura Temporal Oficial (Regra 1-3-1-3-7)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Para que operadores humanos e decodificadores digitais compreendam a mensagem sem hesitação, a norma técnica define rigorosamente a relação de silêncios e sons:
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li><strong>Ponto (dit):</strong> 1 unidade básica de tempo.</li>
              <li><strong>Traço (dah):</strong> 3 unidades de tempo.</li>
              <li><strong>Pausa entre elementos da mesma letra:</strong> 1 unidade de silêncio absoluto.</li>
              <li><strong>Pausa entre letras consecutivas:</strong> 3 unidades de silêncio.</li>
              <li><strong>Pausa entre palavras distintas:</strong> 7 unidades de silêncio.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Por exemplo, para emitir a letra <strong>A (<code className="morse-font">.-</code>)</strong>: o transmissor gera 1 unidade de som (ponto), faz 1 unidade de pausa intra-letra, e emite 3 unidades contínuas de som (traço). Sem essas pausas precisas, os caracteres se fundiriam numa massa sonora sem nexo.
            </p>
          </section>

          {/* SEÇÃO: A Regra de Ouro da Aprendizagem */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              A Regra de Ouro: Aprender pelo Ritmo Acústico, Nunca Contando Pontos Visualmente
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              O equívoco mais destrutivo cometido por iniciantes é tentar memorizar listas escritas no papel contando mentalmente: <em>"A é um ponto e um traço; B é um traço e três pontos"</em>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Esse hábito força o cérebro a executar um ciclo de tradução dupla extremamente lento (escutar o som → desenhar os pontos mentalmente → contar os pontos → identificar a letra). Esse gargalo cognitivo cria uma barreira intransponível por volta de 5 a 8 WPM (palavras por minuto).
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              O método moderno recomendado por instrutores de radioamadorismo (como o método Koch e Farnsworth) consiste em treinar a audição para reconhecer o padrão acústico global de uma só vez: escutar <code className="morse-font">...</code> e reconhecer de imediato a melodia contínua <em>di-di-dit</em> da letra <strong>S</strong>, exatamente da mesma forma que reconhecemos notas musicais ou sílabas faladas.
            </p>
          </section>

          {/* SEÇÃO: Números de 0 a 9 em Código Morse */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Números de 0 a 9 em Código Morse: A Simetria Perfeita de 5 Elementos
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Diferente das letras (que possuem de 1 a 4 elementos), todos os numerais de 0 a 9 são construídos com exatamente <strong>5 elementos</strong>, obedecendo a uma progressão aritmética simétrica perfeita:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Número</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Estrutura Progressiva</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>0</td><td><code className="morse-font">-----</code></td><td>5 traços contínuos</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>1</td><td><code className="morse-font">.----</code></td><td>1 ponto inicial e 4 traços</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>2</td><td><code className="morse-font">..---</code></td><td>2 pontos iniciais e 3 traços</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>3</td><td><code className="morse-font">...--</code></td><td>3 pontos iniciais e 2 traços</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>4</td><td><code className="morse-font">....-</code></td><td>4 pontos iniciais e 1 traço</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(56, 189, 248, 0.05)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>5</td><td><code className="morse-font" style={{ color: 'var(--accent-primary)' }}>.....</code></td><td>5 pontos (centro simétrico)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>6</td><td><code className="morse-font">-....</code></td><td>1 traço inicial e 4 pontos</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>7</td><td><code className="morse-font">--...</code></td><td>2 traços iniciais e 3 pontos</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>8</td><td><code className="morse-font">---..</code></td><td>3 traços iniciais e 2 pontos</td></tr>
                  <tr><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>9</td><td><code className="morse-font">----.</code></td><td>4 traços iniciais e 1 ponto</td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              O ponto central dessa simetria é o número <strong>5 (<code className="morse-font">.....</code>)</strong>. De 1 a 5, os pontos aumentam progressivamente. De 6 a 0, os traços tomam a posição inicial. Essa lógica geométrica torna os números muito mais rápidos de memorizar do que as letras. Para detalhes aprofundados sobre números abreviados de concursos (cut numbers), visite nossa página sobre os <a href="/pt/numeros-em-codigo-morse/" onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Números em Código Morse</a>.
            </p>
          </section>

          {/* SEÇÃO: Famílias de Caracteres e Pares Espelho */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Famílias de Caracteres e Pares Espelho no Alfabeto
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Você não precisa aprender 26 letras como entidades desconexas. Agrupá-las por famílias estruturais acelera drasticamente a memorização:
            </p>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>As Duas Raízes Matemáticas: E e T</h3>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>Família de Pontos (Raiz E):</strong>
                E (<code className="morse-font">.</code>) → I (<code className="morse-font">..</code>) → S (<code className="morse-font">...</code>) → H (<code className="morse-font">....</code>) → 5 (<code className="morse-font">.....</code>)
              </li>
              <li><strong>Família de Traços (Raiz T):</strong>
                T (<code className="morse-font">-</code>) → M (<code className="morse-font">--</code>) → O (<code className="morse-font">---</code>) → 0 (<code className="morse-font">-----</code>)
              </li>
            </ul>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Pares Espelho (Inversão Exata de Ponto e Traço)</h3>
            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Par Espelho</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Primeira Letra</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Inverso Especular</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>A e N</td><td>A = <code className="morse-font">.-</code></td><td>N = <code className="morse-font">-.</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>D e U</td><td>D = <code className="morse-font">-..</code></td><td>U = <code className="morse-font">..-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>B e V</td><td>B = <code className="morse-font">-...</code></td><td>V = <code className="morse-font">...-</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>G e W</td><td>G = <code className="morse-font">--.</code></td><td>W = <code className="morse-font">.--</code></td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>K e R</td><td>K = <code className="morse-font">-.-</code></td><td>R = <code className="morse-font">.-.</code></td></tr>
                  <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Q e Y</td><td>Q = <code className="morse-font">--.-</code></td><td>Y = <code className="morse-font">-.--</code></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FIGURA 2: Desglose de Caracteres */}
          <figure className="article-figure" style={{ margin: '1rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/morse-code-translator-character-breakdown.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-character-breakdown.png?v=2"
                alt="Detalhamento caractere por caractere com visualizador de barras temporais e pronúncia fonética"
                width="1080"
                height="620"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 2:</strong> Decomposição rítmica interativa com barras de duração temporal relativa e pronúncia auditiva.
            </figcaption>
          </figure>

          {/* SEÇÃO: Cálculo Matemático WPM e Farnsworth */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Cálculo Matemático da Velocidade WPM e Método Farnsworth
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              A velocidade em telegrafia é medida em palavras por minuto (<strong>WPM</strong>, Words Per Minute). Para calcular a duração de 1 unidade básica de tempo (ponto), a norma internacional utiliza a palavra padrão <strong>PARIS</strong>, que compreende exatamente 50 unidades de tempo:
            </p>

            <div className="code-example-box" style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <strong style={{ color: 'var(--accent-primary)' }}>Duração de 1 ponto (segundos) = 1,2 ÷ WPM</strong><br />
              <strong style={{ color: 'var(--accent-primary)' }}>Duração de 1 ponto (milisegundos) = 1200 ÷ WPM</strong>
            </div>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Velocidade (WPM)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ponto (1 unidade)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Traço (3 unidades)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pausa entre letras</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pausa entre palavras</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>5 WPM (iniciante)</td><td>240 ms</td><td>720 ms</td><td>720 ms</td><td>1680 ms</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>12 WPM (intermediário)</td><td>100 ms</td><td>300 ms</td><td>300 ms</td><td>700 ms</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>20 WPM (padrão rádio)</td><td>60 ms</td><td>180 ms</td><td>180 ms</td><td>420 ms</td></tr>
                  <tr><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>25 WPM (operador avançado)</td><td>48 ms</td><td>144 ms</td><td>144 ms</td><td>336 ms</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>O Que É o Espaçamento Farnsworth?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Criado por Donald R. Farnsworth, este método transmite as letras individuais numa velocidade alta (por exemplo, 18 ou 20 WPM), mas estende os intervalos de silêncio entre letras e palavras. Dessa forma, o aluno ouve o caractere com a sua musicalidade rápida e natural, tendo tempo suficiente para processar o significado antes que a letra seguinte seja emitida. Quando o estudante ganha segurança, as pausas são progressivamente reduzidas sem que ele precise reaprender os sons das letras.
            </p>
          </section>

          {/* FIGURA 3: Timing Chart */}
          <figure className="article-figure" style={{ margin: '1rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/international-morse-code-timing-chart.webp?v=2" type="image/webp" />
              <img
                src="/images/international-morse-code-timing-chart.png?v=2"
                alt="Diagrama de temporização e proporções padrão do Código Morse Internacional 1-3-1-3-7"
                width="1080"
                height="760"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 3:</strong> Carta de temporização oficial do código Morse ilustrando a proporção matemática 1-3-1-3-7 entre pontos, traços e intervalos de silêncio.
            </figcaption>
          </figure>

          {/* SEÇÃO: Como Unir Letras para Formar Palavras */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Unir Letras para Formar Palavras e Mensagens
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Após assimilar o som das letras individuais, elas são agrupadas em palavras separando cada letra por um espaço simples (ou silêncio de 3 unidades):
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li><strong>OLA</strong> → <code className="morse-font">--- .-.. .-</code></li>
              <li><strong>AMOR</strong> → <code className="morse-font">.- -- --- .-.</code></li>
              <li><strong>RADIO</strong> → <code className="morse-font">.-. .- -.. .. ---</code></li>
              <li><strong>SOS</strong> → <code className="morse-font">... --- ...</code></li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Para separar palavras completas no texto escrito, utiliza-se a barra inclinada (<code className="inline-code">/</code>):
            </p>
            <div className="code-example-box" style={{ background: 'var(--surface-hover)', padding: '1rem 1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
              <code className="morse-font" style={{ fontSize: '1.2rem', color: 'var(--accent-warning)' }}>--- .-.. .- / -- ..- -. -.. ---</code> = <strong>OLA MUNDO</strong>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Para decifrar uma sequência desconhecida sem precisar pesquisar letra por letra manualmente, utilize a ferramenta especializada de <a href="/pt/decodificador-codigo-morse/" onClick={(e) => handleNav(e, 'pt-morsedecoder', '/pt/decodificador-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Decodificador de Código Morse</a>.
            </p>
          </section>

          {/* SEÇÃO: Pontuação e Sinais de Procedimento (Prosigns) */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Pontuação e Sinais de Procedimento (Prosigns) no Código Morse
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              O Código Morse Internacional não se limita a letras e numerais. A norma da ITU define pontuações oficiais de 5 e 6 elementos indispensáveis para estruturar textos e comandos telegráficos:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Símbolo Ortográfico</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Morse Internacional</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ritmo Acústico</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Ponto final ( . )</td><td><code className="morse-font">.-.-.-</code></td><td>di-dah-di-dah-di-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Vírgula ( , )</td><td><code className="morse-font">--..--</code></td><td>dah-dah-di-di-dah-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Ponto de interrogação ( ? )</td><td><code className="morse-font">..--..</code></td><td>di-di-dah-dah-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Apóstrofo ( &apos; )</td><td><code className="morse-font">.----.</code></td><td>di-dah-dah-dah-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Ponto de exclamação ( ! )</td><td><code className="morse-font">-.-.--</code></td><td>dah-di-dah-di-dah-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Barra inclinada ( / )</td><td><code className="morse-font">-..-.</code></td><td>dah-di-di-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Parêntese abrindo ( ( )</td><td><code className="morse-font">-.--.</code></td><td>dah-di-dah-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Parêntese fechando ( ) )</td><td><code className="morse-font">-.--.-</code></td><td>dah-di-dah-dah-di-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>E comercial ( &amp; )</td><td><code className="morse-font">.-...</code></td><td>di-dah-di-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Dois pontos ( : )</td><td><code className="morse-font">---...</code></td><td>dah-dah-dah-di-di-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Ponto e vírgula ( ; )</td><td><code className="morse-font">-.-.-.</code></td><td>dah-di-dah-di-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Hífen / Traço ( - )</td><td><code className="morse-font">-....-</code></td><td>dah-di-di-di-di-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Sublinhado / Underscore ( _ )</td><td><code className="morse-font">..--.-</code></td><td>di-di-dah-dah-di-dah</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Sinal de mais ( + )</td><td><code className="morse-font">.-.-.</code></td><td>di-dah-di-dah-dit (igual a &lt;AR&gt;)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Sinal de igual / Parágrafo ( = )</td><td><code className="morse-font">-...-</code></td><td>dah-di-di-di-dah (separador &lt;BT&gt;)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Aspas duplas ( &quot; )</td><td><code className="morse-font">.-..-.</code></td><td>di-dah-di-di-dah-dit</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Cifrão ( $ )</td><td><code className="morse-font">...-..-</code></td><td>di-di-di-dah-di-di-dah</td></tr>
                  <tr><td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Arroba ( @ )</td><td><code className="morse-font">.--.-.</code></td><td>di-dah-dah-di-dah-dit (adicionado em 2004)</td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Um <strong>prosign</strong> (sinal de procedimento) é um sinal telegráfico especial emitido sem pausas entre as letras componentes. O mais célebre é <strong>&lt;AR&gt;</strong> (<code className="morse-font">.-.-.</code>), emitido para indicar o fim da transmissão, e <strong>&lt;BT&gt;</strong> (<code className="morse-font">-...-</code>), utilizado como separador de parágrafos em mensagens formais.
            </p>
          </section>

          {/* SEÇÃO: Por Que Algumas Letras São Mais Curtas que Outras? */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Por Que Algumas Letras São Mais Curtas que Outras? (A Teoria da Informação de Samuel Morse)
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Muito antes de Claude Shannon formular a Teoria Matemática da Comunicação em 1948, Samuel Morse e seu assistente Alfred Vail aplicaram intuitivamente o princípio de <strong>compressão de dados de comprimento variável</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Em 1838, Vail visitou uma oficina tipográfica de jornais em Morristown, Nova Jersey, e contou fisicamente quantas peças de chumbo de cada letra existiam nas caixas dos impressores. Eles descobriram que a letra <strong>E</strong> era a mais abundante de todas na língua inglesa, seguida de perto pela letra <strong>T</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Com base nessa frequência estatística:
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li>À letra mais comum, <strong>E</strong>, foi atribuído o sinal mais breve possível: um único ponto (<code className="morse-font">.</code>, 1 unidade).</li>
              <li>À segunda letra mais comum, <strong>T</strong>, foi atribuído um único traço (<code className="morse-font">-</code>, 3 unidades).</li>
              <li>Às letras intermediárias como <strong>A</strong>, <strong>I</strong>, <strong>M</strong> e <strong>N</strong> foram atribuídos padrões de 2 elementos.</li>
              <li>Às letras raras na linguagem como <strong>Q</strong> (<code className="morse-font">--.-</code>), <strong>X</strong> (<code className="morse-font">-..-</code>), <strong>J</strong> (<code className="morse-font">.---</code>) e <strong>Z</strong> (<code className="morse-font">--..</code>) foram reservadas sequências longas de 4 elementos.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Essa atribuição proporcional reduziu drasticamente o tempo total necessário para transmitir telegramas nas linhas elétricas, poupando esforço humano dos telegrafistas e minimizando o desgaste das baterias químicas das estações remotas.
            </p>
          </section>

          {/* SEÇÃO: Metodologia de Aprendizagem Passo a Passo */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Aprender o Alfabeto em Código Morse com Sucesso
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Aprender o código Morse não exige dons musicais ou memória sobre-humana. Exige apenas o método correto de assimilação rítmica:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>1. Aprenda de Ouvido, Nunca Visualmente</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Não olhe para cartazes com pontos desenhados. Escute o áudio com fones de ouvido e acostume o cérebro à sonoridade global <em>di-dah</em> de cada letra.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem' }}>2. Comece com E, T, A e N</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Domine primeiro as letras fundamentais e seus espelhos. Em seguida, incorpore M (<code>--</code>) e I (<code>..</code>) antes de avançar para sequências de 3 elementos.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>3. Introduza Novas Letras em Blocos Pequenos</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Adicione apenas duas letras novas por sessão de estudo. Só avance quando atingir 90% de identificação imediata das letras já praticadas.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#a855f7', marginBottom: '0.4rem' }}>4. Sessões Curtas e Diárias (15 a 20 Minutos)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Estudar 15 minutos todos os dias gera resultados imensamente superiores do que maratonar 2 horas num único dia da semana. O cérebro necessita de sono para consolidar memórias auditivas.
                </p>
              </div>
            </div>
          </section>

          {/* SEÇÃO: Código Morse Americano vs. Código Morse Internacional */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Código Morse Americano vs. Código Morse Internacional: Diferenças Históricas
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Muitos estudantes ficam surpresos ao descobrir que o código Morse utilizado nas ferrovias americanas do século XIX não é idêntico ao Código Morse Internacional operado hoje ao redor do planeta:
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li><strong>Morse Americano (Original de 1844):</strong> Projetado para linhas de telégrafo com fio e receptores de fita de papel. Algumas letras possuíam pausas no interior da própria letra (como o C, emitido como <em>dit dit ... dit</em>) e traços de comprimentos diferentes (o traço da letra L durava o dobro de um traço comum).</li>
              <li><strong>Código Morse Internacional (Continental, formalizado em 1865):</strong> Criado na Europa por Friedrich Clemens Gerke para solucionar as falhas do sistema americano. Ele eliminou todas as pausas internas em letras simples e padronizou rigorosamente todos os traços em exatamente 3 unidades elementares.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              O padrão internacional é o único utilizado atualmente em todas as marinhas, aviação, defesa civil, faixas de radioamadorismo (LABRE e REP) e neste portal interativo.
            </p>
          </section>

          {/* SEÇÃO: Erros Mais Comuns de Quem Está Aprendendo */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Os 4 Erros Mais Comuns de Quem Está Aprendendo o Alfabeto Morse
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 800 }}>Erro 1: Treinar em Velocidade Muito Baixa</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                  Escutar Morse a 5 WPM faz a mente decompor pontos e traços como tarefas matemáticas. Use sempre o espaçamento Farnsworth (caracteres a 18–20 WPM com pausas longas).
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 800 }}>Erro 2: Escrever Pontos e Traços no Papel</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                  Ao escutar uma mensagem, nunca anote pontos e traços para traduzir depois. Escreva imediatamente a letra alfabética no caderno ou digite no teclado.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 800 }}>Erro 3: Negligenciar os Intervalos de Silêncio</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                  Muitos alunos se concentram nos sons e ignoram as pausas. Como vimos, a ausência de pausas destrói a identidade da letra (ex: <code>.-</code> vira <code>. -</code>).
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ color: 'var(--danger)', fontSize: '0.95rem', margin: '0 0 0.5rem', fontWeight: 800 }}>Erro 4: Apenas Escutar sem Praticar a Transmissão</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                  Operar uma chave telegráfica virtual ou o teclado exercita a memória muscular e fixa a proporção 1:3 muito mais rápido do que a escuta puramente passiva.
                </p>
              </div>
            </div>
          </section>

          {/* Cross-linking cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Números em Código Morse (0–9)
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Explore a simetria de 5 elementos dos números de 0 a 9, truques mnemônicos e os números abreviados (cut numbers).
              </p>
              <a
                href="/pt/numeros-em-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver tabela de números</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Decodificador de Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Cole qualquer sequência de pontos e traços para inspecionar o espaçamento e obter a tradução exata em texto claro.
              </p>
              <a
                href="/pt/decodificador-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-morsedecoder', '/pt/decodificador-codigo-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Abrir decodificador</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Como Aprender Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Guia didático de áudio baseado nas diretrizes pedagógicas da ARRL para assimilar o Morse por ouvido.
              </p>
              <a
                href="/learn-morse-code/"
                onClick={(e) => handleNav(e, 'learn', '/learn-morse-code/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Aprender código Morse (Inglês)</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* PERGUNTAS FREQUENTES (FAQ ACCORDION COMPLETO COM 15 PERGUNTAS) */}
          <section style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }} id="faq">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Perguntas Frequentes Sobre o Alfabeto em Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: 'O que é o alfabeto em código Morse?',
                  a: 'O alfabeto em código Morse é um sistema de codificação que associa cada uma das 26 letras básicas do alfabeto latino internacional a uma sequência estrita de pulsos elétricos ou acústicos curtos (pontos) e longos (traços), intercalados por pausas de silêncio rigorosamente calibradas.'
                },
                {
                  q: 'Como se representa a cedilha (Ç) em código Morse?',
                  a: 'Na telegrafia em língua portuguesa e francesa, a cedilha é representada pelo código oficial -.-.. (traço, ponto, traço, ponto, ponto). Em transmissões internacionais entre estações estrangeiras onde o operador receptor não possua suporte a caracteres regionais, o Ç é convencionalmente normalizado como C (-.-.).'
                },
                {
                  q: 'Quais são as letras mais curtas e fáceis de memorizar?',
                  a: 'As letras mais curtas são o E, composto por apenas um ponto (.), e o T, composto por apenas um traço (-). Elas constituem as raízes fundamentais do código Morse e são as primeiras letras aprendidas por qualquer estudante.'
                },
                {
                  q: 'O código Morse diferencia letras maiúsculas de minúsculas?',
                  a: 'Não. O código Morse não possui distinção de caixa tipográfica. Tanto a letra maiúscula A quanto a minúscula a são representadas de forma idêntica pela sequência .-'
                },
                {
                  q: 'O que significam os termos "dit" e "dah"?',
                  a: 'Dit e dah são as onomatopeias fonéticas padronizadas internacionalmente para descrever o som do código Morse. Dit representa o ponto breve, e dah representa o traço, que dura exatamente o triplo do tempo do dit.'
                },
                {
                  q: 'Como são transmitidas as palavras com acentos em português (Á, É, Í, Ó, Ú, Â, Ê, Ô, Ã, Õ)?',
                  a: 'Nas comunicações telegráficas internacionais, para evitar ruídos de interpretação entre estações de países diferentes, os acentos são normalizados para as vogais simples correspondentes: Á→A (.-), É→E (.), Í→I (..), Ó→O (---), Ú→U (..-). Nosso tradutor realiza essa normalização automaticamente de forma transparente.'
                },
                {
                  q: 'Qual é a regra oficial de temporização do código Morse?',
                  a: 'A regra mundialmente consagrada pela ITU-R M.1677-1 é a proporção 1-3-1-3-7: o ponto dura 1 unidade, o traço dura 3 unidades, a pausa intra-letra dura 1 unidade, a pausa entre letras distintas dura 3 unidades e a pausa entre palavras inteiras dura 7 unidades.'
                },
                {
                  q: 'O que é o espaçamento pedagógico Farnsworth?',
                  a: 'É um método de aprendizagem acelerada inventado por Donald R. Farnsworth, no qual as letras individuais são emitidas numa velocidade rápida (por exemplo, 18 ou 20 WPM), mas os espaços entre letras e palavras são ampliados. Isso ensina o cérebro a reconhecer a melodia natural do caractere sem o estresse de tentar contar pontos lentos.'
                },
                {
                  q: 'O que significa SOS em código Morse?',
                  a: 'SOS é transmitido como ...---... (três pontos, três traços e três pontos) de forma ininterrupta como um único prosign. Ele foi escolhido em 1908 pela conferência telegráfica de Berlim pela sua clareza rítmica inconfundível, e não como uma sigla de frases em inglês.'
                },
                {
                  q: 'Como são representados os números em código Morse?',
                  a: 'Todos os dígitos de 0 a 9 possuem rigorosamente 5 elementos: 0 = -----, 1 = .----, 2 = ..---, 3 = ...--, 4 = ....-, 5 = ....., 6 = -...., 7 = --..., 8 = ---.., 9 = ----.'
                },
                {
                  q: 'Ainda é obrigatório saber código Morse para obter licença de radioamador?',
                  a: 'No Brasil (sob regulamentação da Anatel/LABRE) e em Portugal (ANACOM/REP), assim como na maioria dos países, o teste prático de recepção auditiva de Morse deixou de ser obrigatório para a concessão de licenças de ingresso. No entanto, o modo CW continua sendo uma das modalidades mais apreciadas e prestigiadas nas bandas de HF.'
                },
                {
                  q: 'Posso imprimir a tabela do alfabeto Morse?',
                  a: 'Sim. Você pode utilizar o botão "Imprimir Tabela" localizado no topo desta página para gerar uma versão visual limpa em folha A4 para estudo na sua bancada.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.25rem',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: 'var(--text-primary)',
                        fontSize: '0.975rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                      aria-expanded={isOpen}
                    >
                      <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 700, color: 'inherit' }}>{faq.q}</h3>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)' }}>
                        <p style={{ marginTop: '0.75rem', margin: 0 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CTA Banner Final */}
          <section className="content-section cta-banner" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-elevated, rgba(30, 41, 59, 0.7))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Pratique e Traduza Código Morse em Tempo Real
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Coloque seu aprendizado em prática: digite qualquer palavra em português ou sequência telegráfica no nosso tradutor interativo com sintetizador de áudio Web Audio API puro.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/pt/"
                onClick={(e) => handleNav(e, 'portuguese', '/pt/')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Abrir Tradutor de Código Morse</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/pt/numeros-em-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Aprender Números em Morse</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

          {/* E-E-A-T Rigor Telegráfico */}
          <section className="content-section eeat-box" style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
            <div className="eeat-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck size={26} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Compromisso com o Rigor e a Exatidão Telegráfica
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.925rem' }}>
              Nossa tabela do alfabeto em código Morse foi compilada e verificada em total concordância com as diretrizes internacionais da União Internacional de Telecomunicações (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Recomendação ITU-R M.1677-1 <ExternalLink size={12} style={{ display: 'inline' }} /></a>), complementada pelas normas operacionais da <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>ARRL <ExternalLink size={12} style={{ display: 'inline' }} /></a>, da Liga de Amadores Brasileiros de Rádio Emissão (LABRE) e da Rede dos Emissores Portugueses (REP).
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.925rem' }}>
              Todas as proporções de temporização seguem a constante padrão PARIS (50 unidades elementares por palavra), garantindo compatibilidade absoluta entre os exercícios sonoros e os equipamentos profissionais de telegrafia.
            </p>
          </section>

        </div>
      </article>
    </div>
  );
}

export default PortugueseAlphabetPage;
