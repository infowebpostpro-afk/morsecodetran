import React, { useState } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, X, Sparkles, BookOpen, HelpCircle
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { SPANISH_EXTENDED_MAP, SPANISH_NORMALIZATION_MAP } from '../engine/spanishMorse.js';
import { audioEngine } from '../engine/audioEngine.js';

export function SpanishAlphabetPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, onTranslateCharacter, showToast, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('letter'); // letter, number, punctuation, prosign, spanish, all
  const [selectedChar, setSelectedChar] = useState(null);

  // Play A-Z Sequence State
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [playingCharKey, setPlayingCharKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Base entries from standard map
  const entries = Object.entries(MORSE_CODE_MAP);

  // Filter entries
  const filteredEntries = entries.filter(([char, data]) => {
    if (category === 'spanish') return false; // Handled separately in custom section
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
      if (showToast) showToast(`Código Morse de ${label} (${morse}) copiado ✓`);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
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

  const faqs = [
    {
      q: '¿Cómo se representa la letra Ñ en código Morse?',
      a: 'La Unión Internacional de Telecomunicaciones (ITU-R M.1677-1) estandariza oficialmente el alfabeto latino básico (A–Z). En radiotelegrafía histórica de países hispanohablantes se adoptó la extensión oficial para la letra Ñ con el código --.-- (dos rayas, un punto, dos rayas). En transmisiones internacionales estándar donde el receptor no dispone de extensiones regionales, la Ñ se normaliza convencionalmente como N (-.). Nuestro traductor admite ambos modos.'
    },
    {
      q: '¿Cómo se transmiten las vocales con tilde (Á, É, Í, Ó, Ú) y la diéresis (Ü)?',
      a: 'En las comunicaciones telegráficas internacionales no existen signos oficiales independientes para las vocales acentuadas en español. Se aplica la norma de normalización fonética: Á→A (.-), É→E (.), Í→I (..), Ó→O (---), Ú→U (..-) y Ü→U (..-). Esto evita confusiones entre operadores de diferentes países y garantiza un 100% de inteligibilidad.'
    },
    {
      q: '¿Cuál es la proporción de tiempo exacta entre puntos y rayas en Morse?',
      a: 'La proporción oficial según el estándar internacional PARIS es 1:3:7. Un punto (dit) equivale a 1 unidad de tiempo. Una raya (dah) dura exactamente 3 unidades (la duración de 3 puntos). El silencio entre los elementos de una misma letra es de 1 unidad; la pausa entre letras consecutivas es de 3 unidades; y la separación entre dos palabras distintas es de 7 unidades.'
    },
    {
      q: '¿Por qué no se recomienda memorizar el alfabeto Morse contando puntos y rayas visualmente?',
      a: 'Aprender visualmente contando "un punto y una raya para la A" crea un cuello de botella mental que impide superar los 5 WPM. El método moderno recomendado por expertos en radioafición (método Koch) consiste en aprender el Morse como un ritmo melódico ("di-dah"), reconociendo el sonido global instantáneamente como si fuera una nota musical.'
    },
    {
      q: '¿Cómo se representan los signos de interrogación y exclamación del español (¿, ¡)?',
      a: 'El estándar Morse ITU solo define el signo de cierre para interrogación (? = ..--..). Los signos de apertura propios del español (¿, ¡) no existen en el código internacional; en la práctica telegráfica se omite el signo de apertura y se coloca únicamente el signo de cierre al final de la frase.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Alfabeto Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Alfabeto Código Morse: Tabla Completa de Letras A–Z, Ñ y Sonidos
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Consulta el alfabeto Morse internacional completo, escucha la pronunciación sonora de cada letra en tiempo real y aprende cómo se representan la letra Ñ y los caracteres en español.
        </p>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {!isPlayingSeq ? (
            <button
              onClick={handlePlayAZSequence}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <Play size={18} />
              <span>Escuchar Alfabeto A–Z Completo</span>
            </button>
          ) : (
            <button
              onClick={handleStopSequence}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', color: 'var(--danger)' }}
            >
              <Square size={18} />
              <span>Detener Reproducción Sonora</span>
            </button>
          )}

          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', textDecoration: 'none' }}
          >
            <span>Ir al Traductor de Texto a Morse</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'letter', label: 'Letras (A–Z)' },
              { id: 'spanish', label: 'Español (Ñ y Acentos)' },
              { id: 'number', label: 'Números (0–9)' },
              { id: 'punctuation', label: 'Puntuación' },
              { id: 'prosign', label: 'Prosigns (ITU)' },
              { id: 'all', label: 'Ver Todo' }
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
              placeholder="Buscar letra, código o nombre..."
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

      {/* Special Section: Spanish Characters (Ñ and Accents) */}
      {(category === 'spanish' || category === 'all' || category === 'letter') && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Letra Ñ y Adaptación de Caracteres Españoles
            </h2>
          </div>
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              En el estándar internacional ITU-R M.1677-1 solo se especifican las 26 letras latinas. En telegrafía en español se desarrolló la extensión histórica para la letra <strong>Ñ</strong> (<code style={{ color: 'var(--accent-primary)' }}>--.--</code>), mientras que las vocales acentuadas se transmiten con su letra base para compatibilidad internacional.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {/* Ñ card */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                backgroundColor: playingCharKey === 'Ñ' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Ñ</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Eñe (Extensión Española)</div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    onClick={() => handlePlaySingle('Ñ', '--.--')}
                    title="Escuchar sonido"
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Volume2 size={18} />
                  </button>
                  <button
                    onClick={() => handleCopyMorse('--.--', 'Ñ')}
                    title="Copiar Morse"
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--text-primary)', marginTop: '0.75rem' }}>
                --.--
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                dah-dah-di-dah-dah • ITU: N (-.)
              </div>
            </div>

            {/* Accented vowels breakdown cards */}
            {[
              { char: 'Á', latin: 'A', morse: '.-', name: 'A con tilde', sound: 'di-dah' },
              { char: 'É', latin: 'E', morse: '.', name: 'E con tilde', sound: 'dit' },
              { char: 'Í', latin: 'I', morse: '..', name: 'I con tilde', sound: 'di-dit' },
              { char: 'Ó', latin: 'O', morse: '---', name: 'O con tilde', sound: 'dah-dah-dah' },
              { char: 'Ú / Ü', latin: 'U', morse: '..-', name: 'U con tilde / diéresis', sound: 'di-di-dah' }
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
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.char}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Normalizado como: {item.latin}</div>
                  </div>
                  <button
                    onClick={() => handlePlaySingle(item.latin, item.morse)}
                    title="Escuchar sonido"
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
      {category !== 'spanish' && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
            {filteredEntries.map(([char, data]) => {
              const displayChar = char.startsWith('<') ? char.replace(/^<|>/g, '') : char;
              const isPlaying = playingCharKey === char;

              return (
                <div
                  key={char}
                  className="glass-panel"
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: isPlaying ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isPlaying ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {displayChar}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {data.phonetic || data.name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => handlePlaySingle(char, data.morse)}
                        title={`Escuchar señal de ${displayChar}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: isPlaying ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0.35rem'
                        }}
                      >
                        <Volume2 size={18} />
                      </button>
                      <button
                        onClick={() => handleCopyMorse(data.morse, displayChar)}
                        title="Copiar código Morse"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0.35rem'
                        }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-primary)' }}>
                      {data.morse}
                    </div>
                    {data.sound && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {data.sound}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Comprehensive In-Depth Educational Article Section (Full Parity with English) */}
      <article className="article-body" style={{ marginTop: '3.5rem' }}>
        <div className="content-container">

          {/* Quick Reference Table A-Z + Ñ */}
          <section className="content-section">
            <h2>Referencia Rápida del Alfabeto Morse (A–Z y Ñ)</h2>
            <p>
              El código Morse internacional representa cada letra del alfabeto latino mediante una combinación única de puntos (señales cortas) y rayas (señales largas). Utiliza esta tabla de referencia rápida para consultar al instante cualquier letra:
            </p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Letra</th>
                    <th>Código Morse</th>
                    <th>Letra</th>
                    <th>Código Morse</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td><code className="morse-font">.-</code></td><td>N</td><td><code className="morse-font">-.</code></td></tr>
                  <tr><td>B</td><td><code className="morse-font">-...</code></td><td><strong>Ñ</strong> (Español)</td><td><code className="morse-font">--.--</code></td></tr>
                  <tr><td>C</td><td><code className="morse-font">-.-.</code></td><td>O</td><td><code className="morse-font">---</code></td></tr>
                  <tr><td>D</td><td><code className="morse-font">-..</code></td><td>P</td><td><code className="morse-font">.--.</code></td></tr>
                  <tr><td>E</td><td><code className="morse-font">.</code></td><td>Q</td><td><code className="morse-font">--.-</code></td></tr>
                  <tr><td>F</td><td><code className="morse-font">..-.</code></td><td>R</td><td><code className="morse-font">.-.</code></td></tr>
                  <tr><td>G</td><td><code className="morse-font">--.</code></td><td>S</td><td><code className="morse-font">...</code></td></tr>
                  <tr><td>H</td><td><code className="morse-font">....</code></td><td>T</td><td><code className="morse-font">-</code></td></tr>
                  <tr><td>I</td><td><code className="morse-font">..</code></td><td>U</td><td><code className="morse-font">..-</code></td></tr>
                  <tr><td>J</td><td><code className="morse-font">.---</code></td><td>V</td><td><code className="morse-font">...-</code></td></tr>
                  <tr><td>K</td><td><code className="morse-font">-.-</code></td><td>W</td><td><code className="morse-font">.--</code></td></tr>
                  <tr><td>L</td><td><code className="morse-font">.-..</code></td><td>X</td><td><code className="morse-font">-..-</code></td></tr>
                  <tr><td>M</td><td><code className="morse-font">--</code></td><td>Y</td><td><code className="morse-font">-.--</code></td></tr>
                  <tr><td></td><td></td><td>Z</td><td><code className="morse-font">--..</code></td></tr>
                </tbody>
              </table>
            </div>

            <p>
              Estas asignaciones corresponden al Código Morse Internacional especificado por la Unión Internacional de Telecomunicaciones (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">Recomendación ITU-R M.1677-1 <ExternalLink size={12} /></a>), con la adición histórica oficial para el idioma español de la <strong>Ñ</strong> (<code className="morse-font">--.--</code>).
            </p>

            <p>
              Si solo necesitas descifrar una letra concreta, consulta la tabla anterior. Si tu objetivo es aprender código Morse para radiotelegrafía o recreación, te recomendamos escuchar el sonido de cada carácter y memorizar su patrón rítmico integral en lugar de contar puntos y rayas con los ojos.
            </p>

            <p>Ejemplos inmediatos:</p>
            <ul className="content-list">
              <li><strong>A</strong> = <code className="morse-font">.-</code> (un punto seguido de una raya)</li>
              <li><strong>B</strong> = <code className="morse-font">-...</code> (una raya seguida de tres puntos)</li>
              <li><strong>C</strong> = <code className="morse-font">-.-.</code> (cuatro elementos alternados)</li>
              <li><strong>S</strong> = <code className="morse-font">...</code> (tres puntos rítmicos)</li>
              <li><strong>T</strong> = <code className="morse-font">-</code> (una única raya sostenida)</li>
              <li><strong>Ñ</strong> = <code className="morse-font">--.--</code> (dos rayas, un punto y dos rayas)</li>
            </ul>
          </section>

          {/* Section: The Morse Code Alphabet Structure */}
          <section className="content-section">
            <h2>Estructura del Alfabeto Morse (A–Z y Ñ): Letras Cortas y Largas</h2>
            <p>
              A diferencia de las tipografías digitales donde todas las letras ocupan un ancho proporcional similar, el código Morse no emplea el mismo número de señales para cada carácter del alfabeto.
            </p>

            <p>Algunas letras son sumamente breves:</p>
            <ul className="content-list">
              <li><strong>E</strong> = <code className="morse-font">.</code> (1 elemento)</li>
              <li><strong>T</strong> = <code className="morse-font">-</code> (1 elemento)</li>
              <li><strong>I</strong> = <code className="morse-font">..</code> (2 elementos)</li>
              <li><strong>M</strong> = <code className="morse-font">--</code> (2 elementos)</li>
            </ul>

            <p>Otras contienen combinaciones de mayor longitud:</p>
            <ul className="content-list">
              <li><strong>H</strong> = <code className="morse-font">....</code> (4 elementos)</li>
              <li><strong>J</strong> = <code className="morse-font">.---</code> (4 elementos)</li>
              <li><strong>Q</strong> = <code className="morse-font">--.-</code> (4 elementos)</li>
              <li><strong>Z</strong> = <code className="morse-font">--..</code> (4 elementos)</li>
              <li><strong>Ñ</strong> = <code className="morse-font">--.--</code> (5 elementos)</li>
            </ul>

            <p>
              Esta diferencia arquitectónica no es arbitraria: Samuel Morse y Alfred Vail asignaron intencionadamente las combinaciones más cortas a las letras de mayor frecuencia de uso en los tipos móviles de imprenta (como la <strong>E</strong> y la <strong>T</strong>), optimizando así el tiempo global de transmisión telegráfica a través del cable.
            </p>

            <p>
              Un detalle esencial: el código Morse <strong>no distingue entre mayúsculas y minúsculas</strong>. Tanto la letra <strong>A</strong> como la <strong>a</strong> se codifican idénticamente como <code className="morse-font">.-</code>.
            </p>

            <div className="code-example-box">
              <strong>Letra → Patrón Morse → Ritmo Sonoro Acústico</strong>
            </div>

            <p>
              Por ejemplo, <strong>A (<code className="morse-font">.-</code>)</strong> y <strong>N (<code className="morse-font">-.</code>)</strong> son patrones simétricos especulares: utilizan exactamente los mismos dos elementos pero en orden inverso.
            </p>
          </section>

          {/* FIGURE 1: Translator Interface Screenshot */}
          <figure className="article-figure">
            <picture>
              <source srcSet="/images/morse-code-translator-interface.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-interface.png?v=2"
                alt="Interfaz interactiva del traductor de código Morse en español con reproducción sonora y desglose rítmico"
                className="article-img"
                width="1080"
                height="720"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              Figura 1: Interfaz interactiva del traductor de código Morse mostrando traducción en tiempo real entre texto y Morse con controles de audio.
            </figcaption>
          </figure>

          {/* Section: How Morse Alphabet Works */}
          <section className="content-section">
            <h2>Cómo Funciona el Alfabeto Morse: Dits, Dahs y Silencios</h2>
            <p>
              El código Morse codifica caracteres mediante dos tipos fundamentales de pulsos:
            </p>
            <ul className="content-list">
              <li>El <strong>punto</strong> (señal corta), conocido coloquialmente en la jerga telegráfica como <strong>dit</strong>.</li>
              <li>La <strong>raya</strong> (señal larga), conocida coloquialmente como <strong>dah</strong>.</li>
            </ul>
            <p>
              En la temporización oficial estándar, una raya dura exactamente el triple de tiempo que un punto (proporción 3:1). No se trata de un sonido más fuerte en volumen, sino de una emisión que se sostiene tres veces más en el tiempo.
            </p>

            <h3>Las Unidades de Tiempo Exactas (Regla 1-3-1-3-7)</h3>
            <p>
              El tiempo en el código Morse está rigurosamente normalizado. Tanto la Unión Internacional de Telecomunicaciones (ITU) como la American Radio Relay League (<a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer">ARRL <ExternalLink size={12} /></a>) definen la estructura <strong>1-3-1-3-7</strong>:
            </p>
            <ul className="content-list">
              <li><strong>Punto (dit):</strong> 1 unidad de tiempo elemental.</li>
              <li><strong>Raya (dah):</strong> 3 unidades de tiempo elementales.</li>
              <li><strong>Espacio entre elementos de un mismo carácter:</strong> 1 unidad de silencio.</li>
              <li><strong>Espacio entre letras consecutivas:</strong> 3 unidades de silencio.</li>
              <li><strong>Espacio entre palabras completas:</strong> 7 unidades de silencio.</li>
            </ul>

            <p>
              Por ejemplo, para transmitir la letra <strong>A (<code className="morse-font">.-</code>)</strong>:
              se emite 1 pulso de sonido (punto), 1 pulso de silencio (espacio intra-carácter), y 3 pulsos de sonido sostenido (raya). El silencio es tan importante como el sonido; sin las pausas adecuadas, los puntos y rayas se fusionarían de manera ininteligible.
            </p>

            <h3>La Regla de Oro: Aprender por Ritmo Acústico, Jamás Contando Visualmente</h3>
            <p>
              El error más destructivo que cometen los principiantes es memorizar visualmente listas escritas contando: <em>"A es un punto y una raya; B es una raya y tres puntos"</em>. Este proceso visual obliga al cerebro a traducir dos veces (sonido → imagen mental de puntos y rayas → letra), creando una barrera insalvable alrededor de los 5 a 8 WPM (palabras por minuto).
            </p>
            <p>
              Los operadores expertos reconocen la letra <strong>S (<code className="morse-font">...</code>)</strong> como un trino rítmico continuo (<em>di-di-dit</em>), no como una suma matemática de tres unidades. Escucha el ritmo en bloque, tal como reconoces las sílabas al hablar.
            </p>
          </section>

          {/* Section: Numbers 0-9 in Morse */}
          <section className="content-section">
            <h2>Números del 0 al 9 en Código Morse: Simetría de 5 Elementos</h2>
            <p>
              A diferencia de las letras (que poseen entre 1 y 4 elementos en inglés o 5 en la Ñ española), todos los dígitos del 0 al 9 están estructurados con exactamente <strong>5 elementos</strong>, siguiendo un patrón geométrico progresivo perfecto:
            </p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'right' }}>Número</th>
                    <th>Código Morse</th>
                    <th>Estructura Rítmica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ textAlign: 'right' }}>0</td><td><code className="morse-font">-----</code></td><td>5 rayas (dah-dah-dah-dah-dah)</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>1</td><td><code className="morse-font">.----</code></td><td>1 punto, 4 rayas</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>2</td><td><code className="morse-font">..---</code></td><td>2 puntos, 3 rayas</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>3</td><td><code className="morse-font">...--</code></td><td>3 puntos, 2 rayas</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>4</td><td><code className="morse-font">....-</code></td><td>4 puntos, 1 raya</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>5</td><td><code className="morse-font">.....</code></td><td>5 puntos (centro simétrico)</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>6</td><td><code className="morse-font">-....</code></td><td>1 raya, 4 puntos</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>7</td><td><code className="morse-font">--...</code></td><td>2 rayas, 3 puntos</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>8</td><td><code className="morse-font">---..</code></td><td>3 rayas, 2 puntos</td></tr>
                  <tr><td style={{ textAlign: 'right' }}>9</td><td><code className="morse-font">----.</code></td><td>4 rayas, 1 punto</td></tr>
                </tbody>
              </table>
            </div>

            <p>
              El punto de pivote es el <strong>5 (<code className="morse-font">.....</code>)</strong>. Hacia abajo (4, 3, 2, 1, 0) las rayas van reemplazando los puntos desde el final. Hacia arriba (6, 7, 8, 9, 0) las rayas van reemplazando los puntos desde el principio. Esta perfecta simetría hace que memorizar los números sea mucho más rápido que las letras.
            </p>
            <p>
              Para una guía completa sobre números abreviados en concursos y radiotelegrafía marina, consulta nuestra guía dedicada de <a href="/es/morse-code-numbers/" onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}>Números en Código Morse</a>.
            </p>
          </section>

          {/* Section: Punctuation & Prosigns */}
          <section className="content-section">
            <h2>Signos de Puntuación y Señales de Procedimiento (Prosigns)</h2>
            <p>
              El código Morse internacional define signos de puntuación de 5 o 6 elementos y señales operativas llamadas <strong>prosigns</strong> (signos de procedimiento transmitidos sin pausa entre caracteres):
            </p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Signo / Símbolo</th>
                    <th>Código Morse</th>
                    <th>Uso Telegráfico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Punto <code>.</code></td><td><code className="morse-font">.-.-.-</code></td><td>Fin de oración</td></tr>
                  <tr><td>Coma <code>,</code></td><td><code className="morse-font">--..--</code></td><td>Separador de cláusulas</td></tr>
                  <tr><td>Signo de interrogación <code>?</code></td><td><code className="morse-font">..--..</code></td><td>Pregunta / Petición de repetición</td></tr>
                  <tr><td>Apóstrofe <code>'</code></td><td><code className="morse-font">.----.</code></td><td>Contracciones</td></tr>
                  <tr><td>Signo de exclamación <code>!</code></td><td><code className="morse-font">-.-.--</code></td><td>Énfasis telegráfico</td></tr>
                  <tr><td>Barra / Separador <code>/</code></td><td><code className="morse-font">-..-.</code></td><td>Fracciones, indicativos (/MM, /P)</td></tr>
                  <tr><td>Paréntesis <code>( )</code></td><td><code className="morse-font">-.--.-</code></td><td>Apertura y cierre</td></tr>
                  <tr><td>Guión <code>-</code></td><td><code className="morse-font">-....-</code></td><td>Unión de términos</td></tr>
                  <tr><td>Dos puntos <code>:</code></td><td><code className="morse-font">---...</code></td><td>Introducción a listas</td></tr>
                  <tr><td>Punto y coma <code>;</code></td><td><code className="morse-font">-.-.-.</code></td><td>Pausa intermedia</td></tr>
                  <tr><td>Signo igual <code>=</code></td><td><code className="morse-font">-...-</code></td><td>Separador de párrafos (BT)</td></tr>
                  <tr><td>Arroba <code>@</code></td><td><code className="morse-font">.--.-.</code></td><td>Añadido oficialmente en 2004 para emails (AC)</td></tr>
                  <tr><td><strong>Fin de mensaje (AR)</strong></td><td><code className="morse-font">.-.-.</code></td><td>Prosign de término de transmisión</td></tr>
                  <tr><td><strong>Fin de contacto (SK)</strong></td><td><code className="morse-font">...-.-</code></td><td>Prosign "Silent Key" / Cierre de emisión</td></tr>
                  <tr><td><strong>Error telegráfico (HH)</strong></td><td><code className="morse-font">........</code></td><td>Ocho puntos rápidos para anular palabra previa</td></tr>
                </tbody>
              </table>
            </div>

            <p>
              Para conocer todos los símbolos matemáticos, monedas y abreviaturas operativas, visita <a href="/es/morse-code-symbols/" onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}>Símbolos en Código Morse</a>.
            </p>
          </section>

          {/* Section: Useful Patterns & Families */}
          <section className="content-section">
            <h2>Familias de Caracteres y Pares Espejo en el Alfabeto</h2>
            <p>
              No es necesario memorizar las 27 letras como elementos aislados. Agruparlas en familias según su raíz inicial simplifica drásticamente el proceso de asimilación:
            </p>

            <h3>Las Raíces E y T</h3>
            <p>
              Las dos letras más cortas son las raíces de todo el árbol dicotómico del código Morse:
            </p>
            <ul className="content-list">
              <li><strong>E (<code className="morse-font">.</code>)</strong> es la raíz de la familia de puntos:
                <ul>
                  <li>E = <code className="morse-font">.</code></li>
                  <li>I = <code className="morse-font">..</code></li>
                  <li>S = <code className="morse-font">...</code></li>
                  <li>H = <code className="morse-font">....</code></li>
                  <li>5 = <code className="morse-font">.....</code></li>
                </ul>
              </li>
              <li><strong>T (<code className="morse-font">-</code>)</strong> es la raíz de la familia de rayas:
                <ul>
                  <li>T = <code className="morse-font">-</code></li>
                  <li>M = <code className="morse-font">--</code></li>
                  <li>O = <code className="morse-font">---</code></li>
                  <li>0 = <code className="morse-font">-----</code></li>
                </ul>
              </li>
            </ul>

            <h3>Pares Espejo (Inversiones de Puntos y Rayas)</h3>
            <p>
              Muchas letras forman parejas especulares exactas donde se intercambian los puntos por rayas:
            </p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Pareja Espejo</th>
                    <th>Patrón Original</th>
                    <th>Patrón Invertido</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A y N</td><td>A = <code className="morse-font">.-</code></td><td>N = <code className="morse-font">-.</code></td></tr>
                  <tr><td>D y U</td><td>D = <code className="morse-font">-..</code></td><td>U = <code className="morse-font">..-</code></td></tr>
                  <tr><td>B y V</td><td>B = <code className="morse-font">-...</code></td><td>V = <code className="morse-font">...-</code></td></tr>
                  <tr><td>G y W</td><td>G = <code className="morse-font">--.</code></td><td>W = <code className="morse-font">.--</code></td></tr>
                  <tr><td>K y R</td><td>K = <code className="morse-font">-.-</code></td><td>R = <code className="morse-font">.-.</code></td></tr>
                  <tr><td>F y L</td><td>F = <code className="morse-font">..-.</code></td><td>L = <code className="morse-font">.-..</code></td></tr>
                  <tr><td>Q y Y</td><td>Q = <code className="morse-font">--.-</code></td><td>Y = <code className="morse-font">-.--</code></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FIGURE 2: Character Breakdown View */}
          <figure className="article-figure">
            <picture>
              <source srcSet="/images/morse-code-translator-character-breakdown.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-character-breakdown.png?v=2"
                alt="Vista de desglose de caracteres en código Morse con barras de duración de puntos y rayas y fonética dit-dah"
                className="article-img"
                width="1080"
                height="620"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              Figura 2: Desglose rítmico interactivo de caracteres mostrando barras de duración relativa y pronunciación sonora fonética.
            </figcaption>
          </figure>

          {/* Section: Timing Math & Farnsworth Method */}
          <section className="content-section">
            <h2>Cálculo Matemático de Velocidad WPM y Método Farnsworth</h2>
            <p>
              La velocidad en telegrafía se mide en palabras por minuto (<strong>WPM</strong>, Words Per Minute). Para calcular la duración exacta de 1 unidad de tiempo elemental (dit) se utiliza la constante estándar PARIS de 50 unidades:
            </p>

            <div className="code-example-box">
              <strong>Duración de 1 punto (segundos) = 1.2 ÷ WPM</strong><br />
              <strong>Duración de 1 punto (milisegundos) = 1200 ÷ WPM</strong>
            </div>

            <p>Aplicando esta fórmula a distintas velocidades estándar:</p>

            <div className="table-responsive">
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Velocidad (WPM)</th>
                    <th>Punto (1 unidad)</th>
                    <th>Raya (3 unidades)</th>
                    <th>Pausa entre letras</th>
                    <th>Pausa entre palabras</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>5 WPM</strong> (principiante)</td><td>240 ms</td><td>720 ms</td><td>720 ms</td><td>1680 ms</td></tr>
                  <tr><td><strong>12 WPM</strong> (intermedio)</td><td>100 ms</td><td>300 ms</td><td>300 ms</td><td>700 ms</td></tr>
                  <tr><td><strong>20 WPM</strong> (estándar radio)</td><td>60 ms</td><td>180 ms</td><td>180 ms</td><td>420 ms</td></tr>
                  <tr><td><strong>25 WPM</strong> (operador experto)</td><td>48 ms</td><td>144 ms</td><td>144 ms</td><td>336 ms</td></tr>
                </tbody>
              </table>
            </div>

            <h3>¿Qué es el Espaciado Farnsworth?</h3>
            <p>
              Inventado por Donald R. Farnsworth, este método envía cada letra individual a una velocidad alta (por ejemplo, 18 o 20 WPM), pero extiende generosamente los espacios de silencio entre letras y palabras. De este modo, el alumno escucha el carácter con su melodía natural e indivisible, disponiendo de varios segundos de pausa para identificar la letra antes de que llegue la siguiente. Cuando el estudiante progresa, simplemente se reducen los silencios inter-letra sin tener que reaprender los sonidos.
            </p>
          </section>

          {/* FIGURE 3: Timing Chart */}
          <figure className="article-figure">
            <picture>
              <source srcSet="/images/international-morse-code-timing-chart.webp?v=2" type="image/webp" />
              <img
                src="/images/international-morse-code-timing-chart.png?v=2"
                alt="Diagrama de temporización y proporciones estándar del Código Morse Internacional 1-3-1-3-7"
                className="article-img"
                width="1080"
                height="760"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="article-figcaption">
              Figura 3: Carta de temporización oficial del código Morse ilustrando la proporción 1-3-1-3-7 entre puntos, rayas, pausas intra-letra, pausas entre letras y silencios de palabra.
            </figcaption>
          </figure>

          {/* Section: Building Words & Reverse Decoding */}
          <section className="content-section">
            <h2>Cómo Unir Letras para Formar Palabras y Descifrado Inverso</h2>
            <p>
              Una vez memorizados los sonidos de las letras individuales, se combinan en palabras separando cada letra mediante un silencio de 3 unidades o un espacio visual en texto:
            </p>
            <ul className="content-list">
              <li><strong>HOLA</strong> → <code className="morse-font">.... --- .-.. .-</code></li>
              <li><strong>AMOR</strong> → <code className="morse-font">.- -- --- .-.</code></li>
              <li><strong>RADIO</strong> → <code className="morse-font">.-. .- -.. .. ---</code></li>
              <li><strong>SOS</strong> → <code className="morse-font">... --- ...</code></li>
            </ul>
            <p>
              Para separar palabras completas en texto escrito se utiliza convencionalmente una barra inclinada <code>/</code> rodeada de espacios:
            </p>
            <div className="code-example-box">
              <code className="morse-font">.... --- .-.. .- / -- ..- -. -.. ---</code> = <strong>HOLA MUNDO</strong>
            </div>

            <h3>Descifrado Inverso de Mensajes Desconocidos</h3>
            <p>
              Si tienes una secuencia de puntos y rayas y necesitas conocer su significado, no intentes adivinar letra por letra. Puedes introducir la cadena directamente en nuestro <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')}>Traductor de Código Morse</a> o utilizar nuestro módulo de <a href="/es/morse-code-decoder/" onClick={(e) => handleNav(e, 'es-decoder', '/es/morse-code-decoder/')}>Decodificador de Código Morse</a> para resolver automáticamente textos, audios o secuencias complejas.
            </p>
          </section>

          {/* Section: Modern Context & Licensing */}
          <section className="content-section">
            <h2>Uso Actual del Alfabeto Morse y Estado Regulatorio</h2>
            <p>
              Aunque los satélites digitales, la fibra óptica y los protocolos IP han sustituido al telégrafo en las redes comerciales de telecomunicación, el código Morse sigue estando plenamente vivo en múltiples áreas clave:
            </p>
            <ul className="content-list">
              <li><strong>Radioafición (Banda de Onda Corta / CW):</strong> Es el modo de comunicación analógica por excelencia para transmisiones de larga distancia (DX), ya que una señal de telegrafía de onda continua (CW) tiene un ancho de banda sumamente estrecho (500 Hz frente a los 2.700 Hz de la voz en SSB) y es capaz de atravesar condiciones severas de ruido y tormentas solares cuando las transmisiones de voz fracasan por completo.</li>
              <li><strong>Navegación Aeronáutica (Radiobalizas VOR e ILS):</strong> Las estaciones de navegación aérea continúan transmitiendo su identificador de 2 o 3 letras en código Morse sonoro repetitivo para que los pilotos puedan confirmar positivamente la frecuencia de la baliza.</li>
              <li><strong>Comunicaciones de Emergencia y Balizas de Salvamento:</strong> El patrón universal <code className="morse-font">... --- ...</code> se reconoce en cualquier medio físico (linternas, espejos, silbatos, golpes en cascos de embarcaciones).</li>
              <li><strong>Accesibilidad y Asistencia Motriz:</strong> Para personas con movilidad severamente reducida, interruptores de contacto único en código Morse permiten controlar ordenadores y comunicarse eficientemente con mínima fatiga física.</li>
            </ul>
            <p>
              En términos regulatorios, la Comisión Federal de Comunicaciones (FCC) de EE.UU. y los reguladores de telecomunicaciones de España y América Latina eliminaron progresivamente el examen obligatorio de telegrafía Morse para obtener licencias de radioaficionado entre 2003 y 2007, facilitando el acceso a las bandas. Lejos de extinguirse, esta desregulación revitalizó la afición: miles de radioaficionados aprenden voluntariamente el modo CW por el placer técnico y la eficiencia extrema que ofrece en las ondas hertzianas.
            </p>
          </section>

          {/* Cross-linking cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Números en Morse 0–9
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Descubre la regla de escalera simétrica que rige los números del 0 al 9, con 5 elementos exactos por dígito y números abreviados de concurso.
              </p>
              <a
                href="/es/morse-code-numbers/"
                onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver tabla de números</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Cómo Aprender Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Guía sistemática paso a paso con el método Koch y espaciado Farnsworth para dominar el Morse por oído sin contar puntos.
              </p>
              <a
                href="/es/learn-morse-code/"
                onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Leer guía de aprendizaje</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Símbolos y Puntuación
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Signos ortográficos, símbolos especiales, signos matemáticos y señales de procedimiento (prosigns).
              </p>
              <a
                href="/es/morse-code-symbols/"
                onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Consultar símbolos</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Frequently Asked Questions (Comprehensive 16 Questions) */}
          <section style={{ marginTop: '3.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Preguntas Frecuentes sobre el Alfabeto Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: '¿Qué es el alfabeto en código Morse?',
                  a: 'El alfabeto en código Morse es un sistema de codificación que asigna a cada una de las 26 letras básicas del alfabeto latino (y caracteres regionales como la Ñ) una secuencia estandarizada de pulsos cortos (puntos) y largos (rayas) separados por intervalos de silencio estandarizados.'
                },
                {
                  q: '¿Cómo se representa la letra Ñ en código Morse?',
                  a: 'En radiotelegrafía histórica de España y países hispanohablantes se adoptó la extensión oficial para la letra Ñ con el código --.-- (dos rayas, un punto, dos rayas). En transmisiones internacionales estándar donde el receptor no dispone de extensiones regionales, la Ñ se normaliza convencionalmente como N (-.). Nuestro traductor admite ambos modos.'
                },
                {
                  q: '¿Cuál es la letra más corta y fácil de aprender?',
                  a: 'Las letras más cortas son la E, representada por un único punto (.), y la T, representada por una única raya (-). Ambas constituyen las raíces básicas del código Morse y son las primeras que se recomiendan aprender.'
                },
                {
                  q: '¿Qué significa A en código Morse?',
                  a: 'La letra A se representa como .- (un punto seguido de una raya, pronunciado di-dah). Su inverso exacto es la letra N (-., una raya seguida de un punto).'
                },
                {
                  q: '¿Qué significa SOS en código Morse?',
                  a: 'SOS se transmite como ...---... (tres puntos, tres rayas, tres puntos) de forma continua sin pausas entre letras. Fue elegido en 1908 no por significar "Save Our Souls", sino por ser una señal rítmica inconfundible y fácil de distinguir en medio de estática e interferencias.'
                },
                {
                  q: '¿Distingue el código Morse entre mayúsculas y minúsculas?',
                  a: 'No. El código Morse no tiene distinciones de caja. Tanto la letra mayúscula A como la minúscula a se transmiten exactamente con el mismo código: .-'
                },
                {
                  q: '¿Qué significan las palabras "dit" y "dah"?',
                  a: 'Son los términos fonéticos oficiales utilizados por los operadores de radio para describir los puntos y las rayas. Un dit corresponde al punto (.) y un dah corresponde a la raya (-), que dura tres veces más.'
                },
                {
                  q: '¿Cuál es la regla exacta de temporización en código Morse?',
                  a: 'La regla oficial es la proporción 1-3-1-3-7: un punto dura 1 unidad de tiempo, una raya dura 3 unidades, el silencio entre elementos de una letra es de 1 unidad, la pausa entre letras es de 3 unidades, y la separación entre palabras es de 7 unidades.'
                },
                {
                  q: '¿Cómo se transmiten las vocales con tilde (Á, É, Í, Ó, Ú) y la diéresis (Ü)?',
                  a: 'En telegrafía internacional se aplica la regla de normalización estándar: Á→A (.-), É→E (.), Í→I (..), Ó→O (---), Ú→U (..-) y Ü→U (..-). Esto evita confusiones entre estaciones de diferentes países.'
                },
                {
                  q: '¿Cómo se representan los signos de interrogación y admiración en español (¿, ¡)?',
                  a: 'El estándar internacional ITU-R solo define el signo de cierre para interrogación (? = ..--..). En la práctica telegráfica en español se omite el signo de apertura (¿) y se coloca únicamente el signo (?) al final de la frase.'
                },
                {
                  q: '¿Por qué algunas letras son más largas que otras?',
                  a: 'Samuel Morse y Alfred Vail asignaron los códigos más cortos a las letras más frecuentes del idioma inglés basándose en el recuento de tipos móviles en talleres de imprenta. Por ello, la E (.) y la T (-) son muy breves, mientras que letras menos frecuentes como la Q (--.-) o la J (.---) tienen 4 elementos.'
                },
                {
                  q: '¿Qué es el espaciado Farnsworth?',
                  a: 'Es una técnica de entrenamiento donde los caracteres individuales se transmiten a una velocidad rápida (por ejemplo 18 o 20 WPM) para habituar el oído a su melodía natural, pero se insertan pausas más largas entre letras para darle tiempo al estudiante a reconocerlas sin estrés.'
                },
                {
                  q: '¿Cómo se representan los números en código Morse?',
                  a: 'Los diez dígitos (0 al 9) tienen exactamente 5 elementos cada uno: 0 = -----, 1 = .----, 2 = ..---, 3 = ...--, 4 = ....-, 5 = ....., 6 = -...., 7 = --..., 8 = ---.., 9 = ----.'
                },
                {
                  q: '¿Se requiere saber código Morse para obtener una licencia de radioaficionado hoy en día?',
                  a: 'En la gran mayoría de países (incluyendo España, México, Argentina, Colombia y EE.UU.), los exámenes de telegrafía Morse ya no son obligatorios para obtener la licencia. Sin embargo, el modo CW sigue siendo uno de los más populares y respetados en las frecuencias de radioafición.'
                },
                {
                  q: '¿Cómo puedo traducir un mensaje completo entre español y Morse?',
                  a: 'Puedes utilizar nuestro traductor interactivo en tiempo real, que convierte automáticamente texto en español a código Morse con sonido personalizable, o descifra secuencias de puntos y rayas a texto legible de inmediato.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
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

          {/* CTA Banner */}
          <section className="content-section cta-banner" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Practica y Traduce Código Morse en Vivo
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Pon a prueba lo aprendido: introduce cualquier texto o secuencia de puntos y rayas en nuestro traductor interactivo con síntesis de audio Web Audio API en tiempo real.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/es/"
                onClick={(e) => handleNav(e, 'spanish', '/es/')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Abrir Traductor de Código Morse</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/es/morse-code-numbers/"
                onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Aprender Números en Morse</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
