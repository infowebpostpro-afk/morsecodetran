import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle, Play, Square, Copy, Check, Radio, Volume2, ShieldCheck,
  ChevronDown, ChevronUp, Zap, HelpCircle, Flashlight, History, ArrowRight, Sun, Flame
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

const TIMELINE = [
  { year: '1905', title: 'Regulaciones de Radio en Alemania', desc: 'Alemania introdujo por primera vez la secuencia de 3 puntos, 3 rayas y 3 puntos en sus normas nacionales de telegrafía.' },
  { year: '1906', title: 'Convención Radiotelegráfica de Berlín', desc: 'La Convención Internacional de Berlín adoptó oficialmente el código SOS como la señal marítima internacional de socorro.' },
  { year: '1908', title: 'Entrada en Vigor Internacional', desc: 'El acuerdo de la convención de Berlín comenzó a regir formalmente a escala global el 1 de julio de 1908.' },
  { year: '1912', title: 'Hundimiento del Titanic', desc: 'Los radiotelegrafistas del Titanic (Jack Phillips y Harold Bride) transmitieron tanto la señal antigua CQD como la nueva señal SOS en la madrugada del 15 de abril.' },
  { year: '1999', title: 'Sustitución por el Sistema SMSSM (GMDSS)', desc: 'El Sistema Mundial de Socorro y Seguridad Marítima (SMSSM/GMDSS) sustituyó oficialmente al código Morse como canal obligatorio en alta mar.' }
];

const COMPARISON_TABLE = [
  { signal: 'SOS', type: 'Prosign Continuo en Morse', use: 'Señal internacional de socorro radiotelegráfico (...---...)', era: '1908–Presente' },
  { signal: 'CQD', type: 'Texto Formateado en Morse', use: 'Primer distintivo de auxilio de la compañía Marconi Wireless', era: '1904–1912' },
  { signal: 'Mayday', type: 'Procedimiento Vocal Hablado', use: 'Señal de socorro en radiotelefonía y aviación civil', era: '1923–Presente' }
];

const FAQS = [
  {
    q: '¿Qué es SOS en código Morse y cuál es su patrón?',
    a: 'SOS en código Morse se representa como ...---... — tres puntos, tres rayas y tres puntos. Se transmite como un solo grupo de socorro, sin las pausas normales entre letras, pero con una breve pausa entre cada punto y cada raya.'
  },
  {
    q: '¿Qué significan realmente las letras SOS?',
    a: 'SOS es una señal internacional de socorro. Expresiones en inglés como "Save Our Souls" y "Save Our Ship" se popularizaron como formas de recordarla, pero no son una traducción oficial de las letras. Su patrón de tres señales cortas, tres largas y tres cortas es fácil de reconocer y repetir.'
  },
  {
    q: '¿Cómo se escribe correctamente SOS en código Morse?',
    a: 'Para lectura visual en pantalla o papel, también se suele escribir con espacios como "... --- ..." para mostrar las letras por separado. En transmisiones reales de socorro, se emite como un solo grupo continuo (...---...), sin las pausas normales entre letras.'
  },
  {
    q: '¿Cómo se transmite la señal SOS utilizando una linterna o espejo?',
    a: 'Con una linterna, emite tres destellos cortos, tres largos y tres cortos. Mantén una pausa breve entre cada destello y repite el grupo cuando sea necesario. Los destellos largos deben durar aproximadamente tres veces lo que duran los cortos.'
  },
  {
    q: '¿Es posible golpear la señal SOS sobre una pared o tubería?',
    a: 'Si solo puedes golpear una superficie, intenta repetir tres señales breves, tres más prolongadas y tres breves. En superficies donde no puedas mantener un golpe largo, haz el patrón lo más claro y repetible posible.'
  },
  {
    q: '¿Utilizó el Titanic la señal SOS la noche de su hundimiento?',
    a: 'Sí. Los operadores del Titanic transmitieron tanto la señal tradicional CQD como la nueva llamada de socorro SOS durante la madrugada del 15 de abril de 1912.'
  },
  {
    q: '¿Sigue utilizándose el código Morse SOS en la navegación moderna?',
    a: 'SOS sigue siendo una señal universal de auxilio reconocida en todo el mundo. En la navegación comercial marítima regular, el sistema GMDSS/SMSSM reemplazó la telegrafía obligatoria en 1999.'
  }
];

export function SpanishSosPage({ wpm = 16, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [activeSignalIndex, setActiveSignalIndex] = useState(-1);
  const [isSignalLit, setIsSignalLit] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const flashTimeoutsRef = useRef([]);

  const sosMorseContinuous = '...---...';
  const sosMorseSpaced = '... --- ...';
  const sosText = 'SOS';

  const stopAll = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setIsFlashing(false);
    setActiveSignalIndex(-1);
    setIsSignalLit(false);
    if (flashTimeoutsRef.current) {
      flashTimeoutsRef.current.forEach(t => clearTimeout(t));
      flashTimeoutsRef.current = [];
    }
  };

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const runVisualSequence = (loop = false) => {
    if (flashTimeoutsRef.current) {
      flashTimeoutsRef.current.forEach(t => clearTimeout(t));
      flashTimeoutsRef.current = [];
    }

    const effectiveWpm = wpm || 16;
    const unitMs = Math.round((1.2 / effectiveWpm) * 1000);
    const elements = sosMorseContinuous.split('');

    const scheduleCycle = () => {
      let elapsed = 0;

      elements.forEach((symbol, idx) => {
        const isDash = symbol === '-';
        const dur = isDash ? unitMs * 3 : unitMs;

        // Turn ON
        const onTimeout = setTimeout(() => {
          setActiveSignalIndex(idx);
          setIsSignalLit(true);
        }, elapsed);
        flashTimeoutsRef.current.push(onTimeout);

        elapsed += dur;

        // Turn OFF
        const offTimeout = setTimeout(() => {
          setIsSignalLit(false);
        }, elapsed);
        flashTimeoutsRef.current.push(offTimeout);

        // Gap between elements within signal (1 unit)
        if (idx < elements.length - 1) {
          elapsed += unitMs;
        }
      });

      // Clear gap between complete SOS repetitions (7 units)
      elapsed += 7 * unitMs;

      const cycleEndTimeout = setTimeout(() => {
        setActiveSignalIndex(-1);
        setIsSignalLit(false);
        if (loop) {
          scheduleCycle();
        } else {
          setIsFlashing(false);
          setIsPlaying(false);
        }
      }, elapsed);
      flashTimeoutsRef.current.push(cycleEndTimeout);
    };

    scheduleCycle();
  };

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

  const handlePlay = () => {
    if (isPlaying) {
      stopAll();
      return;
    }

    stopAll();
    setIsPlaying(true);

    // Continuous SOS breakdown: 1 item with all 9 elements, followed by a 7-unit spacing item
    const continuousBreakdown = [
      { char: 'SOS', morse: sosMorseContinuous, isSpace: false },
      { isSpace: true }
    ];

    audioEngine.playSequence({
      breakdown: continuousBreakdown,
      wpm: wpm || 16,
      farnsworthWpm: wpm || 16,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: true,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          stopAll();
        }
      }
    });

    runVisualSequence(true);
  };

  const handleCopy = (text) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    if (showToast) showToast('Señal SOS copiada al portapapeles ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    if (isFlashing) {
      stopAll();
      return;
    }
    stopAll();
    setIsFlashing(true);
    runVisualSequence(true);
  };

  return (
    <article className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Miga de pan" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)' }}>
          <li>
            <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
              Inicio
            </a>
          </li>
          <li aria-hidden="true" style={{ opacity: 0.5 }}>/</li>
          <li style={{ color: 'var(--primary)', fontWeight: 600 }} aria-current="page">
            SOS en Código Morse
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <AlertTriangle size={16} /> Guía de la señal internacional de socorro
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          SOS en código Morse: señal, sonido y significado
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          La señal SOS en código Morse se representa como <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>...---...</code>: tres puntos, tres rayas y tres puntos. Se transmite como un solo grupo, sin las pausas normales entre letras, pero con una breve pausa entre cada punto y cada raya.
        </p>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
          En texto también puedes encontrar <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>... --- ...</code> para mostrar las letras S, O y S por separado. Esa presentación facilita la lectura, aunque el ritmo no es el mismo que el de la señal continua.
        </p>
      </header>

      {/* Main Interactive SOS Tool Module */}
      <section style={{ background: 'var(--surface-elevated)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)', border: '2px solid #ef4444', boxShadow: '0 8px 30px rgba(239, 68, 68, 0.15)', textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ef4444', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          PATRÓN OFICIAL DE SOCORRO MARÍTIMO
        </div>

        <div style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', letterSpacing: '6px', wordBreak: 'break-all', marginBottom: '0.5rem' }}>
          {sosMorseContinuous}
        </div>

        <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '1.25rem' }}>
          Notación Legible en Texto: <strong>{sosMorseSpaced}</strong>
        </div>

        {/* Visual Beacon & Element Rhythm Display */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.15rem',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              backgroundColor: isSignalLit ? '#f59e0b' : 'var(--surface)',
              color: isSignalLit ? '#000000' : 'var(--text-secondary)',
              boxShadow: isSignalLit ? '0 0 18px rgba(245, 158, 11, 0.7)' : 'none',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}
            aria-live="polite"
          >
            <Flashlight size={16} />
            <span>{isSignalLit ? 'Destello Activo' : (isPlaying || isFlashing ? 'Pausa entre señales' : 'Señal luminosa inactiva')}</span>
          </div>

          {/* 9 Elements Breakdown Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            {sosMorseContinuous.split('').map((symbol, idx) => {
              const isDash = symbol === '-';
              const isActive = activeSignalIndex === idx && isSignalLit;
              return (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '26px',
                    width: isDash ? '44px' : '26px',
                    borderRadius: isDash ? '4px' : '999px',
                    backgroundColor: isActive ? '#f59e0b' : (activeSignalIndex === idx ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.08)'),
                    color: isActive ? '#000000' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 0 12px rgba(245, 158, 11, 0.85)' : 'none',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: '1rem'
                  }}
                  title={isDash ? `Raya ${idx + 1} (3 unidades)` : `Punto ${idx + 1} (1 unidad)`}
                >
                  {isDash ? '—' : '•'}
                </span>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontWeight: 600 }}>
          3 cortos (di-di-dit) • 3 largos (dah-dah-dah) • 3 cortos (di-di-dit)
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handlePlay}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.6rem',
              background: isPlaying ? 'var(--surface-hover)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: isPlaying ? 'var(--text)' : '#ffffff',
              border: isPlaying ? '1px solid var(--border)' : 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: isPlaying ? 'none' : '0 4px 14px rgba(239, 68, 68, 0.35)'
            }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Detener' : 'Escuchar SOS continuo'}
          </button>

          <button
            type="button"
            onClick={handleFlashSignal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              background: isFlashing ? 'var(--surface-hover)' : 'var(--surface)',
              color: 'var(--text)',
              border: isFlashing ? '1px solid #f59e0b' : '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {isFlashing ? <Square size={18} color="#f59e0b" /> : <Flashlight size={18} color="#ef4444" />}
            {isFlashing ? 'Detener' : 'Ver señal luminosa'}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(sosMorseContinuous)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              background: 'var(--surface)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            {copied ? '¡Copiado!' : 'Copiar señal SOS'}
          </button>

          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.5rem',
              background: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}
          >
            <span>traductor de código Morse</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '1.25rem', marginBottom: 0, lineHeight: 1.5 }}>
          El audio y la luz muestran SOS como una señal continua. El patrón con espacios <code>... --- ...</code> representa las letras por separado.
        </p>
      </section>

      {/* Prosign vs Readability Technical Distinction */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Por Qué la Señal SOS se Transmite como un Prosign Continuo?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          SOS se transmite como un solo grupo de nueve señales: <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>...---...</code>. Entre un punto y una raya hay una pausa breve. Lo que se omite son las pausas normales que separarían las letras S, O y S.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Cuando escribimos <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>... --- ...</code>, los espacios muestran tres letras individuales. Esa forma es útil para aprender o leer el patrón, pero una reproducción letra por letra introduce pausas más largas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Prosign Continuo Oficial (Norma UIT)
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text)' }}>
              ...---...
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0, lineHeight: 1.5 }}>
              Transmitido como un solo grupo de 9 señales sin las pausas normales entre letras, pero con pausas breves entre señales.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Notación Tipográfica en Texto
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text)' }}>
              ... --- ...
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0, lineHeight: 1.5 }}>
              Mostrado con espacios para facilitar a los humanos la lectura de los tres caracteres independientes (S, O, S).
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          La Conferencia Radiotelegráfica Internacional de Berlín de 1906 estipuló que la señal debía ser transmitida de forma continua
          para impedir que se confundiera con transmisiones comerciales ordinarias o telegramas de tráfico marítimo regular.
        </p>
      </section>

      {/* Myth Buster: What Does SOS Mean? */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Qué Significa Realmente SOS?
        </h2>
        <div style={{ background: 'var(--surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.75rem' }}>
            Desmintiendo el Mito: SOS NO Significa "Save Our Souls" ni "Save Our Ship"
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
            SOS es una señal internacional de socorro. Expresiones en inglés como “Save Our Souls” y “Save Our Ship” se popularizaron como formas de recordarla, pero no son una traducción oficial de las letras.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Su patrón de tres señales cortas, tres largas y tres cortas es fácil de reconocer y repetir. La claridad de una señal real también depende del medio, la distancia y las condiciones de recepción.
          </p>
        </div>
      </section>

      {/* How to Send SOS */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Emitir la Señal SOS en una Emergencia Real
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontWeight: 600 }}>
          Si hay una emergencia real y tienes acceso a un teléfono o radio, contacta a los servicios de emergencia correspondientes. Las señales son una forma adicional de pedir ayuda cuando puedan ser vistas u oídas.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>🔦 Linterna o Flash</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Con una linterna, emite tres destellos cortos, tres largos y tres cortos. Mantén una pausa breve entre cada destello y repite el grupo cuando sea necesario. Los destellos largos deben durar aproximadamente tres veces lo que duran los cortos.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>🔊 Silbato o Bocina</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Con un silbato o una bocina, produce tres sonidos cortos, tres largos y tres cortos. Deja una pausa breve entre señales y repite el grupo para ayudar a que otras personas lo identifiquen.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>👉 Golpes en Tuberías</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Si solo puedes golpear una superficie, intenta repetir tres señales breves, tres más prolongadas y tres breves. En superficies donde no puedas mantener un golpe largo, haz el patrón lo más claro y repetible posible.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>🪨 Señales en el Terreno</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Disponer rocas, troncos o zanjas en nieve formando la secuencia: 3 círculos pequeños, 3 líneas largas y 3 círculos pequeños.
            </p>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={22} color="var(--primary)" /> Cómo se Convirtió SOS en el Estándar Internacional
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {TIMELINE.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-elevated)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 900, fontSize: '0.95rem', flexShrink: 0 }}>
                {item.year}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOS vs CQD vs Mayday Comparison Table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Comparación Histórica: SOS vs. CQD vs. Mayday
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Señal de Auxilio</th>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Tipo de Protocolo</th>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Uso Primario y Formato</th>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Época Histórica</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#ef4444' }}>{row.signal}</td>
                  <td style={{ padding: '1rem', color: 'var(--text)' }}>{row.type}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{row.use}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{row.era}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Mistakes */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Errores Comunes Sobre la Señal SOS
        </h2>
        <div style={{ background: 'var(--surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem', margin: 0 }}>
            <li><strong>Creer que SOS significa "Save Our Souls":</strong> Falso. Es un retroacrónimo popular. Se eligió estrictamente por su ritmo simétrico y su facilidad de repetición.</li>
            <li><strong>Pensar que 3 puntos representan SOS:</strong> 3 puntos aislados representan únicamente la letra <strong>S</strong>. Para formar SOS se requieren los 9 elementos completos.</li>
            <li><strong>Añadir pausas largas entre letras:</strong> La transmisión de socorro se efectúa como un prosign continuo (<code style={{ color: '#ef4444' }}>...---...</code>) sin las pausas normales entre letras, pero con pausas breves entre señales.</li>
            <li><strong>Asumir que el Titanic inventó la señal SOS:</strong> La señal se adoptó en la conferencia radiotelegráfica de Berlín de 1906 y entró en vigor internacionalmente en 1908. El Titanic se hundió en 1912; sus operadores transmitieron tanto CQD como SOS.</li>
            <li><strong>Creer que el código Morse sigue siendo el canal principal en alta mar:</strong> El sistema GMDSS/SMSSM reemplazó la telegrafía obligatoria en barcos comerciales en 1999.</li>
          </ul>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--primary)" /> Preguntas Frecuentes sobre el Código SOS
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} style={{ background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  style={{ width: '100%', padding: '1.25rem', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Takeaway & Contextual Internal Links */}
      <section style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Conclusión Principal
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          <strong>SOS en código Morse es <code style={{ color: '#ef4444', fontWeight: 900 }}>...---...</code>: tres puntos, tres rayas y tres puntos.</strong>
          Se transmite como una señal continua sin pausas entre letras, manteniendo pausas breves entre cada señal.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-block', padding: '0.85rem 1.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Abrir traductor de código Morse
          </a>
          <a
            href="/es/morse-code-alphabet/"
            onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
            style={{ display: 'inline-block', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Consultar alfabeto Morse
          </a>
          <a
            href="/es/morse-code-symbols/"
            onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}
            style={{ display: 'inline-block', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Ver símbolos en código Morse
          </a>
        </div>
      </section>
    </article>
  );
}

export default SpanishSosPage;
