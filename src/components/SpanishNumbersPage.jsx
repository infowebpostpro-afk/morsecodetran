import React, { useState } from 'react';
import {
  Volume2, Copy, Play, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  Hash, Sparkles, HelpCircle, ArrowLeftRight, Check, CheckCircle, AlertTriangle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export const SPANISH_MORSE_NUMBERS = [
  { num: '0', morse: '-----', name: 'Cero', ditDah: 'dah-dah-dah-dah-dah', desc: '5 rayas. Espejo del 5 (5 puntos).' },
  { num: '1', morse: '.----', name: 'Uno', ditDah: 'di-dah-dah-dah-dah', desc: '1 punto + 4 rayas. Espejo del 9.' },
  { num: '2', morse: '..---', name: 'Dos', ditDah: 'di-di-dah-dah-dah', desc: '2 puntos + 3 rayas. Espejo del 8.' },
  { num: '3', morse: '...--', name: 'Tres', ditDah: 'di-di-di-dah-dah', desc: '3 puntos + 2 rayas. Espejo del 7.' },
  { num: '4', morse: '....-', name: 'Cuatro', ditDah: 'di-di-di-di-dah', desc: '4 puntos + 1 raya. Espejo del 6.' },
  { num: '5', morse: '.....', name: 'Cinco', ditDah: 'di-di-di-di-dit', desc: '5 puntos. Punto central de inflexión de la escala.' },
  { num: '6', morse: '-....', name: 'Seis', ditDah: 'dah-di-di-di-dit', desc: '1 raya + 4 puntos. Espejo del 4.' },
  { num: '7', morse: '--...', name: 'Siete', ditDah: 'dah-dah-di-di-dit', desc: '2 rayas + 3 puntos. Espejo del 3.' },
  { num: '8', morse: '---..', name: 'Ocho', ditDah: 'dah-dah-dah-di-dit', desc: '3 rayas + 2 puntos. Espejo del 2.' },
  { num: '9', morse: '----.', name: 'Nueve', ditDah: 'dah-dah-dah-dah-dit', desc: '4 rayas + 1 punto. Espejo del 1.' }
];

export const SPANISH_MIRROR_PAIRS = [
  { pair: '1 y 9', left: '1: .----', right: '9: ----.', desc: '1 punto + 4 rayas frente a 4 rayas + 1 punto' },
  { pair: '2 y 8', left: '2: ..---', right: '8: ---..', desc: '2 puntos + 3 rayas frente a 3 rayas + 2 puntos' },
  { pair: '3 y 7', left: '3: ...--', right: '7: --...', desc: '3 puntos + 2 rayas frente a 2 rayas + 3 puntos' },
  { pair: '4 y 6', left: '4: ....-', right: '6: -....', desc: '4 puntos + 1 raya frente a 1 raya + 4 puntos' },
  { pair: '5 y 0', left: '5: .....', right: '0: -----', desc: 'Todos puntos (5 dits) frente a todas rayas (5 dahs)' }
];

export const SPANISH_CUT_NUMBERS = [
  { num: '0', cut: 'T', morse: '-', standard: '-----', desc: 'Muy usado en concursos de radioafición y reportes RST (ej. 5NN por 599)' },
  { num: '1', cut: 'A', morse: '.-', standard: '.----', desc: 'Sustituye 4 rayas largas por un dit y un dah' },
  { num: '2', cut: 'U', morse: '..-', standard: '..---', desc: 'Abreviatura telegráfica' },
  { num: '3', cut: 'V', morse: '...-', standard: '...--', desc: 'Abreviatura estándar' },
  { num: '5', cut: 'E', morse: '.', standard: '.....', desc: 'Un solo dit para máxima velocidad' },
  { num: '7', cut: 'G', morse: '--.', standard: '--...', desc: 'Abreviatura alternativa' },
  { num: '8', cut: 'D', morse: '-..', standard: '---..', desc: 'Abreviatura de alta velocidad' },
  { num: '9', cut: 'N', morse: '-.', standard: '----.', desc: 'Extremadamente común en reportes RST (ej. 599 -> 5NN)' }
];

export function SpanishNumbersPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [inputNum, setInputNum] = useState('2026');
  const [playingKey, setPlayingKey] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Quiz state
  const [quizTab, setQuizTab] = useState('num2morse'); // 'num2morse' | 'morse2num'
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaySingle = (num, morse) => {
    setPlayingKey(num);
    audioEngine.playSequence({
      breakdown: [{ char: num, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingKey(null);
      }
    });
  };

  const handleCopy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      if (showToast) showToast(`${label} copiado ✓`);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  // Convert input numbers to Morse
  const convertedMorse = inputNum.split('').map(char => {
    const found = SPANISH_MORSE_NUMBERS.find(n => n.num === char);
    return found ? found.morse : (char === ' ' ? '/' : '?');
  }).join(' ');

  const handlePlayCustom = () => {
    const breakdown = inputNum.split('').map(char => {
      const found = SPANISH_MORSE_NUMBERS.find(n => n.num === char);
      return {
        char,
        morse: found ? found.morse : '/',
        isSpace: char === ' '
      };
    });

    audioEngine.playSequence({
      breakdown,
      wpm,
      frequency,
      volume
    });
  };

  // Quiz questions
  const numQuizQuestions = [
    { id: 'q1', q: '7', ans: '--...' },
    { id: 'q2', q: '3', ans: '...--' },
    { id: 'q3', q: '0', ans: '-----' },
    { id: 'q4', q: '9', ans: '----.' }
  ];

  const morseQuizQuestions = [
    { id: 'm1', q: '.....', ans: '5' },
    { id: 'm2', q: '-....', ans: '6' },
    { id: 'm3', q: '..---', ans: '2' },
    { id: 'm4', q: '.----', ans: '1' }
  ];

  const handleCheckAnswer = (id, correctAns) => {
    const userVal = (quizAnswers[id] || '').trim();
    if (userVal.toLowerCase() === correctAns.toLowerCase()) {
      setQuizFeedback(prev => ({ ...prev, [id]: 'correct' }));
    } else {
      setQuizFeedback(prev => ({ ...prev, [id]: 'incorrect' }));
    }
  };

  const faqs = [
    {
      q: '¿Por qué todos los números en código Morse tienen 5 elementos?',
      a: 'A diferencia de las letras (cuya longitud varía de 1 a 4 elementos según su frecuencia en el idioma), los números del 0 al 9 tienen una longitud fija de exactamente 5 elementos (puntos y rayas). Esta uniformidad permite a los operadores telegráficos detectar errores de transmisión inmediatamente si reciben un número con más o menos de 5 señales.'
    },
    {
      q: '¿Qué es la "regla de la escalera" para memorizar los números Morse?',
      a: 'La regla de la escalera describe el patrón simétrico del sistema: del 1 al 5, los números comienzan con puntos que van aumentando de 1 a 5 (1=.----, 2=..---, 3=...--, 4=....-, 5=.....). A partir del 6, el patrón se invierte comenzando con rayas que van aumentando de 1 a 5 hasta el 0 (6=-...., 7=--..., 8=---.., 9=----., 0=-----).'
    },
    {
      q: '¿Qué son los "números abreviados" o "cut numbers" en telegrafía?',
      a: 'En los concursos de radioafición (CW) y transmisiones de alta velocidad, enviar 5 rayas para el número 0 o 4 rayas para el 9 consume demasiado tiempo. Los operadores sustituyen números comunes por letras más cortas: el 0 se envía como "T" (-), el 9 como "N" (-.) y el 1 como "A" (.-). Por ejemplo, un reporte de señal estándar "599" se transmite habitualmente como "5NN".'
    },
    {
      q: '¿Cómo se separan los números al transmitir una fecha o número de teléfono?',
      a: 'Entre cada dígito dentro de una misma cifra se debe dejar un espacio estándar de 3 unidades de tiempo (un espacio en texto). Si se trata de grupos de números separados (como el prefijo de un número telefónico), se utiliza una barra inclinada "/" (-..-.) o un espacio triple de 7 unidades.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Números en Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Números en Código Morse 0–9: Tabla Completa, Reglas y Audio
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Aprende el código Morse para los dígitos del 0 al 9. Escucha el sonido de cada número, comprende la regla de la escalera simétrica y practica ejercicios interactivos.
        </p>
      </div>

      {/* Interactive Number Converter Tool */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Hash size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Convertidor Interactivo de Números a Morse
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Ingresa cualquier número (ej. fecha, año, teléfono):
            </label>
            <input
              type="text"
              value={inputNum}
              onChange={(e) => setInputNum(e.target.value.replace(/[^0-9\s]/g, ''))}
              placeholder="Ejemplo: 2026"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontWeight: 700
              }}
            />
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Código Morse generado:
            </label>
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                fontSize: '1.2rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                minHeight: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>{convertedMorse || 'Ingresa dígitos'}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handlePlayCustom}
                  disabled={!convertedMorse}
                  title="Reproducir audio de la cifra"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Play size={14} />
                  <span style={{ fontSize: '0.8rem' }}>Escuchar</span>
                </button>
                <button
                  onClick={() => handleCopy(convertedMorse, 'Código Morse')}
                  disabled={!convertedMorse}
                  title="Copiar código"
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.65rem' }}
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 0-9 Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Tabla Completa de Números en Código Morse (0–9)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem' }}>
          {SPANISH_MORSE_NUMBERS.map(item => {
            const isPlaying = playingKey === item.num;
            return (
              <div
                key={item.num}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isPlaying ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  backgroundColor: isPlaying ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.num}</span>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        onClick={() => handlePlaySingle(item.num, item.morse)}
                        title={`Escuchar señal del número ${item.num}`}
                        style={{ background: 'none', border: 'none', color: isPlaying ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Volume2 size={18} />
                      </button>
                      <button
                        onClick={() => handleCopy(item.morse, `Número ${item.num}`)}
                        title="Copiar Morse"
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                    {item.morse}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {item.ditDah}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                  {item.desc}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ladder Rule & Mirror Pairs Section */}
      <section className="article-section" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          La Regla de la Escalera Simétrica y Pares Especulares
        </h2>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          La estructura matemática de los números en código Morse es perfecta. Los números se organizan en pares simétricos cuya suma de puntos y rayas es idéntica en espejo:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {SPANISH_MIRROR_PAIRS.map((pair, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1rem' }}>Par {pair.pair}</span>
                <ArrowLeftRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <span>{pair.left}</span>
                <span>{pair.right}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {pair.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Cut Numbers in Amateur Radio */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Números Abreviados en Telegrafía (Cut Numbers)
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          En concursos internacionales de telegrafía y comunicados de radioaficionados (QSO), los operadores sustituyen los dígitos largos por letras de un solo elemento para transmitir con máxima rapidez:
        </p>

        <div className="table-wrapper" style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>Dígito</th>
                <th style={{ padding: '0.75rem' }}>Estándar ITU</th>
                <th style={{ padding: '0.75rem' }}>Letra Abreviada</th>
                <th style={{ padding: '0.75rem' }}>Código Abreviado</th>
                <th style={{ padding: '0.75rem' }}>Uso Típico</th>
              </tr>
            </thead>
            <tbody>
              {SPANISH_CUT_NUMBERS.map(c => (
                <tr key={c.num} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.num}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{c.standard}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{c.cut}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{c.morse}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.825rem' }}>{c.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Quiz / Practice Section */}
      <section className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Ejercicio Rápido: Practica los Números en Morse
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setQuizTab('num2morse')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: quizTab === 'num2morse' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: quizTab === 'num2morse' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Número a Morse
          </button>
          <button
            onClick={() => setQuizTab('morse2num')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: quizTab === 'morse2num' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: quizTab === 'morse2num' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Morse a Número
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {(quizTab === 'num2morse' ? numQuizQuestions : morseQuizQuestions).map(qItem => {
            const status = quizFeedback[qItem.id];
            const isRevealed = revealedQuiz[qItem.id];

            return (
              <div key={qItem.id} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  ¿Cuál es el código de: <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>{qItem.q}</strong>?
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder={quizTab === 'num2morse' ? 'ej. --...' : 'ej. 7'}
                    value={quizAnswers[qItem.id] || ''}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [qItem.id]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontFamily: quizTab === 'num2morse' ? 'monospace' : 'inherit'
                    }}
                  />
                  <button
                    onClick={() => handleCheckAnswer(qItem.id, qItem.ans)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Verificar
                  </button>
                </div>

                {status === 'correct' && (
                  <div style={{ color: 'var(--success, #10b981)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={14} /> ¡Correcto!
                  </div>
                )}
                {status === 'incorrect' && (
                  <div style={{ color: 'var(--danger, #ef4444)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Incorrecto. <button onClick={() => setRevealedQuiz({ ...revealedQuiz, [qItem.id]: true })} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Ver respuesta</button>
                  </div>
                )}
                {isRevealed && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Respuesta: <code style={{ color: 'var(--accent-primary)' }}>{qItem.ans}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive Educational Sections (Full Parity with English) */}
      <article className="seo-article-container" style={{ marginTop: '3rem' }}>
        <div className="article-body-content">

          {/* 1. ESTRUCTURA Y ANCLAS: LA REGLA DE LA ESCALERA SIMÉTRICA */}
          <section className="content-section">
            <h2>Estructura de los Dígitos: La Regla de la Escalera Simétrica</h2>
            <p>
              Aprender los números en código Morse es mucho más fácil y rápido que aprender las letras porque los diez dígitos siguen una regla geométrica continua. Cada dígito tiene <strong>exactamente cinco elementos</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fase 1: Los Puntos Aumentan (1 → 5)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>1</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>.----</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 punto + 4 rayas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>2</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>..---</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 puntos + 3 rayas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>3</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>...--</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 puntos + 2 rayas</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>4</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>....-</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 puntos + 1 raya</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>5 (Ancla Central)</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 800 }}>.....</code>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>5 puntos (Todo puntos)</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fase 2: Las Rayas Aumentan (6 → 0)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>6</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>-....</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 raya + 4 puntos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>7</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>--...</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 rayas + 3 puntos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>8</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>---..</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 rayas + 2 puntos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>9</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>----.</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 rayas + 1 punto</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>0 (Ancla Extrema)</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem', color: '#f59e0b', fontWeight: 800 }}>-----</code>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>5 rayas (Todo rayas)</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1.25rem', lineHeight: 1.6 }}>
              Memoriza primero los dos polos: el <strong>5 (<code className="morse-font">.....</code>)</strong> que son 5 puntos y el <strong>0 (<code className="morse-font">-----</code>)</strong> que son 5 rayas. Los números del 1 al 4 simplemente acumulan puntos desde la izquierda, y los números del 6 al 9 acumulan rayas desde la izquierda.
            </p>
          </section>

          {/* 2. LOS 5 PARES ESPEJO */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Los 5 Pares Espejo: Aprende la Mitad, Domina los Diez</h2>
            <p>
              Existe una relación de simetría invertida perfecta entre los números que suman diez o comparten posiciones opuestas:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center' }}>Número</th>
                    <th style={{ textAlign: 'center' }}>Morse</th>
                    <th style={{ textAlign: 'center' }}>Pareja Espejo</th>
                    <th style={{ textAlign: 'center' }}>Morse</th>
                    <th>Inversión de Patrón</th>
                  </tr>
                </thead>
                <tbody>
                  {SPANISH_MIRROR_PAIRS.map((pair, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontSize: '1.1rem' }}><strong>{pair.pair.split(' ')[0]}</strong></td>
                      <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>{pair.left.split(' ')[1]}</code></td>
                      <td style={{ textAlign: 'center', fontSize: '1.1rem' }}><strong>{pair.pair.split(' ')[2]}</strong></td>
                      <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: '#f59e0b' }}>{pair.right.split(' ')[1]}</code></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pair.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Por ejemplo, el <strong>2 (<code className="morse-font">..---</code>)</strong> y el <strong>8 (<code className="morse-font">---..</code>)</strong> son exactamente la misma secuencia leída al revés. Esta técnica de emparejamiento reduce la carga cognitiva a la mitad al memorizar.
            </p>
          </section>

          {/* 3. CÓMO ESCRIBIR NÚMEROS DE VARIOS DÍGITOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Escribir y Transmitir Cifras de Múltiples Dígitos</h2>
            <p>
              Una regla fundamental en telegrafía es: <strong>cada dígito se transmite como un carácter individual independiente</strong>. Jamás se crea una combinación especial para números completos como el 10, el 100 o el 2026.
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>Número</th>
                    <th>Representación en Código Morse</th>
                    <th>Desglose Dígito a Dígito</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>10</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.---- -----</code></td>
                    <td>1 (.----) + espacio + 0 (-----)</td>
                  </tr>
                  <tr>
                    <td><strong>25</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>..--- .....</code></td>
                    <td>2 (..---) + espacio + 5 (.....)</td>
                  </tr>
                  <tr>
                    <td><strong>42</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>....- ..---</code></td>
                    <td>4 (....-) + espacio + 2 (..---)</td>
                  </tr>
                  <tr>
                    <td><strong>911</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>----. .---- .----</code></td>
                    <td>9 (----.) + 1 (.----) + 1 (.----)</td>
                  </tr>
                  <tr>
                    <td><strong>2026</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>..--- ----- ..--- -....</code></td>
                    <td>2 (..---) + 0 (-----) + 2 (..---) + 6 (-....)</td>
                  </tr>
                  <tr>
                    <td><strong>12345</strong></td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.---- ..--- ...-- ....- .....</code></td>
                    <td>Secuencia continua del 1 al 5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>73 en Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  73 = --... ...--
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  En la comunidad internacional de radioaficionados, <strong>73</strong> es la despedida tradicional que significa <em>"saludos cordiales"</em>.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>911 en Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', color: '#f59e0b', fontWeight: 800, marginBottom: '0.5rem' }}>
                  911 = ----. .---- .----
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Cada dígito de emergencia se transmite por separado con un silencio de 3 unidades entre cada uno.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>2026 en Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', color: '#10b981', fontWeight: 800, marginBottom: '0.5rem' }}>
                  2026 = ..--- ----- ..--- -....
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Un excelente ejercicio práctico que combina dígitos con mayoría de puntos (2), todo rayas (0) y mayoría de rayas (6).
                </p>
              </div>
            </div>
          </section>

          {/* 4. NÚMEROS ABREVIADOS EN CONCURSOS (CUT NUMBERS) */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Números Abreviados (Cut Numbers) en Concursos de Radioafición</h2>
            <p>
              Transmitir cinco rayas para el cero (<code className="morse-font">-----</code>) toma 15 unidades de tiempo. En concursos internacionales de radioafición de alta velocidad (CW Contests), los operadores utilizan <strong>números cortados</strong> (cut numbers), reemplazando los dígitos largos por letras de código más breve:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Dígito</th>
                    <th>Letra Abreviada</th>
                    <th>Código Morse Corto</th>
                    <th>Código Estándar</th>
                    <th>Uso en Transmisión</th>
                  </tr>
                </thead>
                <tbody>
                  {SPANISH_CUT_NUMBERS.map(c => (
                    <tr key={c.num}>
                      <td><strong>{c.num}</strong></td>
                      <td><strong>{c.cut}</strong></td>
                      <td><code className="morse-font" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{c.morse}</code></td>
                      <td><code className="morse-font" style={{ color: 'var(--text-muted)' }}>{c.standard}</code></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              El ejemplo más célebre en radioafición es el reporte de señal <strong>599</strong> (señal perfecta): en lugar de transmitir <code className="morse-font">..... ----. ----.</code>, casi todos los operadores envían <strong>5NN</strong> (<code className="morse-font">..... -. -.</code>), reduciendo el tiempo de transmisión a menos de la mitad.
            </p>
          </section>

          {/* Cross-linking cards */}
          <section style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Alfabeto Morse A–Z y Ñ
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Explora las 26 letras del alfabeto latino internacional y la letra Ñ con síntesis de sonido en tiempo real.
                </p>
                <a
                  href="/es/morse-code-alphabet/"
                  onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ver alfabeto completo</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Traductor de Morse a Texto
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Decodifica puntos y rayas a texto comprensible al instante con análisis letra a letra y audio Web Audio API.
                </p>
                <a
                  href="/es/morse-code-to-english/"
                  onClick={(e) => handleNav(e, 'es-morse2english', '/es/morse-code-to-english/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Probar decodificador</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Radioafición CW y Códigos Q
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Aprende el uso real de los números en contactos QSO, códigos Q y reporte RST en las bandas de HF.
                </p>
                <a
                  href="/es/morse-code-amateur-radio/"
                  onClick={(e) => handleNav(e, 'es-amateurradio', '/es/morse-code-amateur-radio/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Leer guía de radioafición</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions (Comprehensive) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Preguntas Frecuentes sobre los Números en Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: '¿Qué son los números en código Morse?',
                  a: 'Son las representaciones oficiales mediante puntos y rayas de los dígitos del 0 al 9 en el Código Morse Internacional según la norma ITU-R M.1677-1. Cada dígito consta de exactamente cinco elementos.'
                },
                {
                  q: '¿Por qué todos los números en código Morse tienen 5 elementos?',
                  a: 'A diferencia de las letras (cuya longitud varía de 1 a 4 elementos según su frecuencia en el idioma), los números del 0 al 9 tienen una longitud fija de exactamente 5 elementos (puntos y rayas). Esta uniformidad permite a los operadores telegráficos detectar errores de transmisión inmediatamente si reciben un número con más o menos de 5 señales.'
                },
                {
                  q: '¿Qué es el número 0 en código Morse?',
                  a: 'El número 0 en código Morse son cinco rayas: ----- (dah-dah-dah-dah-dah). Es el código numérico más largo en tiempo de emisión.'
                },
                {
                  q: '¿Es el número 0 en Morse igual a la letra O?',
                  a: 'No. El número 0 son cinco rayas (-----), mientras que la letra O son solo tres rayas (---). Son caracteres completamente distintos en el estándar internacional.'
                },
                {
                  q: '¿Cómo se transmiten números de varios dígitos como un año o teléfono?',
                  a: 'Cada dígito se convierte de forma individual en su código Morse de 5 elementos, separados por una pausa de 3 unidades (un espacio en texto). El año 2026 se escribe como: ..--- ----- ..--- -....'
                },
                {
                  q: '¿Qué es la "regla de la escalera" para memorizar los números Morse?',
                  a: 'La regla de la escalera describe el patrón simétrico del sistema: del 1 al 5, los números comienzan con puntos que van aumentando de 1 a 5 (1=.----, 2=..---, 3=...--, 4=....-, 5=.....). A partir del 6, el patrón se invierte comenzando con rayas que van aumentando de 1 a 5 hasta el 0 (6=-...., 7=--..., 8=---.., 9=----., 0=-----).'
                },
                {
                  q: '¿Qué son los "números abreviados" o "cut numbers" en telegrafía?',
                  a: 'En los concursos de radioafición (CW) y transmisiones de alta velocidad, enviar 5 rayas para el número 0 o 4 rayas para el 9 consume demasiado tiempo. Los operadores sustituyen números comunes por letras más cortas: el 0 se envía como "T" (-), el 9 como "N" (-.) y el 1 como "A" (.-). Por ejemplo, un reporte de señal estándar "599" se transmite habitualmente como "5NN".'
                },
                {
                  q: '¿Son iguales los números en código Morse Americano y en Morse Internacional?',
                  a: 'No. El código Morse americano original (usado en ferrocarriles del siglo XIX) tenía números de longitud variable y espacios internos. El Código Morse Internacional regulado por la ITU estandarizó todos los números a 5 elementos continuos sin espacios internos.'
                },
                {
                  q: '¿Puedo escuchar el sonido de los números en esta página?',
                  a: 'Sí. Puedes hacer clic en cualquiera de las tarjetas de los números 0 al 9 o ingresar cualquier número en nuestro convertidor interactivo para reproducir su sonido real en Web Audio API con velocidad WPM y tono configurables.'
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
          <section className="content-section cta-banner" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-elevated, rgba(255,255,255,0.03))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Los Números en Código Morse al Alcance de Tu Mano
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Aprender los dígitos del 0 al 9 es la forma más rápida de familiarizarse con el código Morse. Utiliza nuestro traductor interactivo principal para convertir cualquier número, fecha o texto completo con audio en vivo.
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
                href="/es/morse-code-alphabet/"
                onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Ver Alfabeto Morse Completo</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
