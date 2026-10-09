import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Square, RotateCcw, Check, X, Award, Flame, Zap, Volume2, Sliders,
  HelpCircle, BookOpen, ShieldCheck, CheckCircle, AlertTriangle, ChevronDown,
  ChevronUp, Radio, ArrowRight, Copy, Target, Activity, RefreshCw, Eye, EyeOff,
  ExternalLink, Sparkles
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';
import { spanishMorseEngine } from '../engine/spanishMorse.js';

const CHARACTER_SETS = {
  starter: {
    name: '8 Iniciales (E, T, A, N, I, M, S, O)',
    desc: 'Ritmos elementales de 1 a 3 elementos. Ideal para principiantes que inician entrenamiento auditivo.',
    items: ['E', 'T', 'A', 'N', 'I', 'M', 'S', 'O']
  },
  letters: {
    name: 'Alfabeto Completo (A–Z + Ñ)',
    desc: 'Las 27 letras del alfabeto en español con sus ritmos internacionales y la letra Ñ (--.--).',
    items: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  },
  numbers: {
    name: 'Números (0–9)',
    desc: 'Los 10 numerales de 5 elementos estándar con cadencia progresiva.',
    items: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  },
  words: {
    name: 'Palabras Cortas en Español (2–4 Letras)',
    desc: 'Términos breves y comunes en español para entrenar la separación entre caracteres.',
    items: ['HOLA', 'SOL', 'MAR', 'LUZ', 'PAZ', 'PAN', 'VOZ', 'REY', 'RIO', 'GAS', 'SOS', 'CQ', '73']
  },
  prosigns: {
    name: 'Signos y Códigos de Procedimiento',
    desc: 'Signos de puntuación esenciales y códigos operativos de radioafición.',
    items: ['.', ',', '?', '¿', '!', '¡', '/', 'SOS', 'CQ', '73']
  }
};

export function SpanishPracticePage({ setActiveTab, showToast, wpm: globalWpm = 20, frequency: globalFreq = 600, volume: globalVol = 0.5 }) {
  const [selectedSetKey, setSelectedSetKey] = useState('starter');
  const [customCharWpm, setCustomCharWpm] = useState(globalWpm || 20);
  const [customFarnsworthWpm, setCustomFarnsworthWpm] = useState(12);
  const [customFreq, setCustomFreq] = useState(globalFreq || 600);

  const [currentTarget, setCurrentTarget] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [stats, setStats] = useState({
    attempts: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  const [weakChars, setWeakChars] = useState({});
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const answerInputRef = useRef(null);

  const activePool = selectedSetKey === 'weak'
    ? (Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items)
    : CHARACTER_SETS[selectedSetKey].items;

  const nextRandomTarget = (pool = activePool, avoidCurrent = currentTarget) => {
    let choices = pool;
    if (pool.length > 1 && avoidCurrent) {
      choices = pool.filter(item => item !== avoidCurrent);
    }
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex] || pool[0];
  };

  const startNewPrompt = (newSetKey = selectedSetKey) => {
    let pool = CHARACTER_SETS[newSetKey] ? CHARACTER_SETS[newSetKey].items : activePool;
    if (newSetKey === 'weak') {
      pool = Object.keys(weakChars).length > 0 ? Object.keys(weakChars) : CHARACTER_SETS.starter.items;
    }
    const target = nextRandomTarget(pool, currentTarget);
    setCurrentTarget(target);
    setUserAnswer('');
    setFeedback(null);

    setTimeout(() => {
      playTargetAudio(target);
    }, 150);
  };

  useEffect(() => {
    startNewPrompt(selectedSetKey);
  }, [selectedSetKey]);

  const playTargetAudio = (textToPlay = currentTarget) => {
    if (!textToPlay) return;
    audioEngine.stop();
    setIsPlayingAudio(true);

    const morse = spanishMorseEngine.textToMorse(textToPlay);
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

  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    const normalizedInput = userAnswer.trim().toUpperCase();
    const normalizedTarget = currentTarget.toUpperCase();
    const isCorrect = normalizedInput === normalizedTarget;

    setStats(prev => {
      const attempts = prev.attempts + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const currentStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, currentStreak);
      return { attempts, correct, currentStreak, bestStreak };
    });

    if (!isCorrect) {
      setWeakChars(prev => ({
        ...prev,
        [currentTarget]: (prev[currentTarget] || 0) + 1
      }));
    } else if (weakChars[currentTarget]) {
      setWeakChars(prev => {
        const updated = { ...prev };
        if (updated[currentTarget] <= 1) {
          delete updated[currentTarget];
        } else {
          updated[currentTarget] -= 1;
        }
        return updated;
      });
    }

    setFeedback({
      isCorrect,
      target: currentTarget,
      targetMorse: spanishMorseEngine.textToMorse(currentTarget),
      input: userAnswer.trim()
    });

    if (isCorrect) {
      if (showToast) showToast(`¡Correcto! Ritmo: ${spanishMorseEngine.textToMorse(currentTarget)}`, 'success');
      setTimeout(() => {
        startNewPrompt();
        if (answerInputRef.current) answerInputRef.current.focus();
      }, 1100);
    } else {
      if (showToast) showToast(`Incorrecto. Era "${currentTarget}" (${spanishMorseEngine.textToMorse(currentTarget)})`, 'error');
    }
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

  const accuracyPct = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  const faqs = [
    {
      q: "¿Cuál es la mejor manera de practicar código Morse en línea?",
      a: "La práctica más efectiva consiste en escuchar el tono del código Morse, formular mentalmente la respuesta sin consultar tablas visuales de puntos y rayas, ingresar la respuesta para recibir retroalimentación instantánea y repetir con insistencia los caracteres fallados. Inicia siempre con un grupo reducido de alta frecuencia (como los 8 Iniciales: E, T, A, N, I, M, S, O) y avanza progresivamente hacia palabras cortas, indicativos de radio y oraciones completas."
    },
    {
      q: "¿Cuántos minutos al día se recomienda dedicar a la práctica auditiva?",
      a: "Una sesión diaria estructurada de 10 a 15 minutos continuos es inmensamente más productiva que un bloque intensivo de dos horas una vez por semana. Las sesiones breves y frecuentes previenen la saturación cognitiva, evitan la fatiga de la memoria de trabajo y consolidan la memoria auditiva a largo plazo en los circuitos neuromusculares."
    },
    {
      q: "¿Qué velocidad (WPM) debe configurar un principiante en el entrenador?",
      a: "La pedagogía telegráfica moderna de la ARRL y la IARU recomienda configurar una velocidad de carácter ágil (18–20 WPM) combinada con un espaciado Farnsworth relajado (8–12 WPM). Esto garantiza que el oído reconozca cada letra como una melodía rítmica unificada ('di-dah'), impidiendo que el cerebro cometa el grave error de contar puntos y rayas individuales."
    },
    {
      q: "¿Debería aprender código Morse de oído o memorizando puntos y rayas en papel?",
      a: "Para la recepción telegráfica (copiado), es indispensable aprender por sonido desde el primer día. Las tablas visuales impresas son útiles como referencia estática para decodificación escrita, pero confiar en el conteo visual crea un cuello de botella cognitivo insuperable por encima de las 10 a 12 WPM. Las asociaciones directas sonido-letra son la única vía para decodificar telegrafía en tiempo real."
    },
    {
      q: "¿En qué consiste exactamente el Método Koch para aprender telegrafía?",
      a: "Desarrollado en la década de 1930 por el psicólogo alemán Ludwig Koch, el método entrena al estudiante introduciendo los caracteres uno a uno a la velocidad final de destino (por ejemplo, 20 WPM). Se inicia practicando un conjunto de solo 2 caracteres hasta superar el 90% de aciertos de forma consistente; únicamente entonces se agrega un tercer carácter, ampliando el repertorio sin reducir jamás la velocidad del tono."
    },
    {
      q: "¿Qué es el espaciado Farnsworth y por qué previene el estancamiento?",
      a: "El sistema formulado por Donald R. Farnsworth preserva la velocidad acústica interna de los puntos y rayas del carácter a velocidad real (ej. 20 WPM), pero extiende generosamente los intervalos de silencio entre caracteres y palabras. De este modo, el alumno principiante dispone de segundos adicionales para reflexionar sin que el patrón rítmico del sonido se desfigure."
    },
    {
      q: "¿Por qué logro identificar letras aisladas pero me bloqueo al escuchar palabras completas?",
      a: "El copiado de palabras completas exige una habilidad cognitiva superior: retener en la memoria auditiva inmediata las letras ya identificadas mientras el cerebro sigue procesando los nuevos tonos que continúan entrando por el receptor. Para superar este umbral, practica la transición de letras sueltas a grupos de dos letras, luego a palabras breves de tres letras (SOL, PAN, MAR, SOS) y finalmente a la lectura mental directa ('head copy') sin lápiz ni papel."
    },
    {
      q: "¿Cómo se integra la letra Ñ (--.--) en las sesiones de entrenamiento en español?",
      a: "Nuestra plataforma incluye la letra Ñ con su ritmo oficial internacional de 5 elementos: dah-dah-di-dah-dah (--.--). Al activar la modalidad 'Alfabeto Completo (A–Z + Ñ)', el entrenador genera secuencias auditivas que reflejan la distribución fonética real del idioma castellano, permitiéndote dominar este elemento distintivo de la telegrafía hispanohablante."
    },
    {
      q: "¿Es necesario practicar también la transmisión con manipulador telegráfico?",
      a: "Sí, si tu objetivo incluye operar como radioaficionado emitiendo señales CW en el éter. Sin embargo, la recepción auditiva y la transmisión manual activan vías neuronales distintas (reconocimiento acústico vs. control motriz de precisión). La recomendación de todos los instructores expertos es construir una base auditiva sólida de al menos 12 a 15 WPM antes de volcar horas intensivas en el manipulador manual o de paleta."
    }
  ];

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
            Práctica de Código Morse
          </li>
        </ol>
      </nav>

      {/* Header Banner */}
      <header style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.9rem',
          borderRadius: '999px',
          background: 'rgba(217, 119, 6, 0.12)',
          border: '1px solid rgba(217, 119, 6, 0.3)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          <Zap size={16} />
          <span>Entrenador Auditivo Profesional con Temporización Farnsworth</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1rem'
        }}>
          Práctica de Código Morse en Línea: Entrenamiento Auditivo Interactivo
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '820px' }}>
          Entrena tu oído para decodificar telegrafía en tiempo real con estándares internacionales ITU y radioafición CW.
          Escucha la cadencia sonora, escribe el carácter o término correspondiente y perfecciona tu reconocimiento auditivo
          instantáneo sin contar puntos ni rayas en tu mente.
        </p>
      </header>

      {/* Practice Interactive Trainer Tool Card */}
      <div style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '3rem'
      }}>
        {/* Set Selection Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Selecciona el Grupo de Ejercicios de Práctica:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(CHARACTER_SETS).map(([key, set]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedSetKey(key)}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: selectedSetKey === key ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedSetKey === key ? 'var(--primary-glow)' : 'var(--surface)',
                  color: selectedSetKey === key ? 'var(--primary)' : 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {set.name.split(' (')[0]}
              </button>
            ))}
            {Object.keys(weakChars).length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedSetKey('weak')}
                style={{
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: selectedSetKey === key ? '1px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.3)',
                  background: selectedSetKey === 'weak' ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface)',
                  color: selectedSetKey === 'weak' ? '#ef4444' : 'var(--text)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Target size={14} />
                <span>Repasar Fallos ({Object.keys(weakChars).length})</span>
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {CHARACTER_SETS[selectedSetKey]?.desc || 'Repite los caracteres en los que cometiste errores recientemente.'}
          </p>
        </div>

        {/* Audio Playback & Display Center */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem 1rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Paso 1: Escucha atentamente la señal acústica
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => isPlayingAudio ? handleStopAudio() : playTargetAudio()}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: isPlayingAudio ? '#ef4444' : 'var(--primary)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                transition: 'transform 0.15s ease'
              }}
              title={isPlayingAudio ? 'Detener Señal' : 'Reproducir Señal'}
            >
              {isPlayingAudio ? <Square size={24} /> : <Play size={26} style={{ marginLeft: '3px' }} />}
            </button>

            <button
              type="button"
              onClick={() => playTargetAudio()}
              title="Repetir Tono"
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface-elevated)',
                color: 'var(--text)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Answer Input Field */}
          <form onSubmit={handleSubmitAnswer} style={{ maxWidth: '380px', margin: '0 auto' }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Paso 2: Escribe lo que escuchas y presiona Enter
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                ref={answerInputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe la letra o palabra..."
                autoComplete="off"
                autoCapitalize="characters"
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-elevated)',
                  color: 'var(--text)'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Check size={16} />
                Comprobar
              </button>
            </div>
          </form>

          {/* Feedback Banner */}
          {feedback && (
            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${feedback.isCorrect ? '#10b981' : '#ef4444'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: feedback.isCorrect ? '#10b981' : '#ef4444' }}>
                {feedback.isCorrect ? '✓ ¡Respuesta Correcta!' : '✗ Respuesta Incorrecta'}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                Señal emitida: <strong style={{ color: 'var(--primary)' }}>"{feedback.target}"</strong> (<code className="morse-font" style={{ fontSize: '1.05rem' }}>{feedback.targetMorse}</code>)
              </span>
              <button
                type="button"
                onClick={() => startNewPrompt()}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                Siguiente Señal <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Reveal & Skip Shortcuts */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setFeedback({
                isCorrect: false,
                target: currentTarget,
                targetMorse: spanishMorseEngine.textToMorse(currentTarget),
                input: ''
              })}
              style={{
                fontSize: '0.8rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <Eye size={13} /> Revelar Solución
            </button>
            <button
              type="button"
              onClick={() => startNewPrompt()}
              style={{
                fontSize: '0.8rem',
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              Saltar Carácter <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Speed & Pitch Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          padding: '1rem',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Velocidad Carácter (WPM):</span>
              <strong style={{ color: 'var(--primary)' }}>{customCharWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="15"
              max="35"
              value={customCharWpm}
              onChange={(e) => setCustomCharWpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mantiene el sonido ágil para evitar contar puntos.</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Farnsworth (Espaciado):</span>
              <strong style={{ color: 'var(--primary)' }}>{customFarnsworthWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="5"
              max={customCharWpm}
              value={customFarnsworthWpm}
              onChange={(e) => setCustomFarnsworthWpm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Añade tiempo entre letras para procesar el sonido.</span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Tono / Frecuencia:</span>
              <strong style={{ color: 'var(--primary)' }}>{customFreq} Hz</strong>
            </div>
            <input
              type="range"
              min="400"
              max="900"
              step="50"
              value={customFreq}
              onChange={(e) => setCustomFreq(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Frecuencia acústica preferida (600–700 Hz estándar).</span>
          </div>
        </div>

        {/* Stats & Streak Counters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{stats.attempts}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intentos</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{accuracyPct}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Precisión</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Flame size={18} />
              <span>{stats.currentStreak}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Racha Actual</div>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
              <Award size={18} />
              <span>{stats.bestStreak}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mejor Racha</div>
          </div>
        </div>
      </div>

      {/* HOW TO PRACTICE MORSE CODE EFFECTIVELY */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Practicar Código Morse en Línea de Forma Eficaz
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Conocer la tabla de puntos y rayas sobre el papel es únicamente el primer paso. El auténtico desafío
          consiste en forjar el reconocimiento auditivo reflejo: escuchar una cadencia de sonido e identificar
          la letra de manera instantánea sin contar conscientemente los puntos y las rayas en tu mente.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              1. Empieza con los 8 Iniciales
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Inicia con 8 caracteres simples y fundamentales (<code style={{ color: 'var(--primary)' }}>E, T, A, N, I, M, S, O</code>).
              Domina sus melodías sonoras antes de expandir tu repertorio hacia letras de mayor longitud.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              2. Escucha Antes de Mirar
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Reproduce siempre el tono sonoro en primer lugar. Fuerza a tus circuitos auditivos a identificar la cadencia
              antes de buscar una chuleta visual o pulsar el botón de revelación.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              3. Entrena los Caracteres Difíciles
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Cuando cometas un error (por ejemplo, confundir <code style={{ color: 'var(--primary)' }}>B</code> y <code style={{ color: 'var(--primary)' }}>V</code>),
              repite el audio 3 veces para afianzar en tu cerebro la impronta sonora correcta.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.4rem' }}>
              4. Avanza a Palabras Cortas
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Una vez que tu precisión en letras aisladas supere el 90%, activa el grupo de Palabras Cortas
              (<code style={{ color: 'var(--primary)' }}>HOLA, SOL, MAR, SOS</code>) para entrenar la memoria de trabajo.
            </p>
          </div>
        </div>
      </section>

      {/* CHARACTER SPEED VS FARNSWORTH SPEED EXPLAINED */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Diferencia entre Velocidad de Carácter y Espaciado Farnsworth
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Uno de los errores más perjudiciales de los estudiantes autodidactas es practicar a velocidades de carácter
          artificialmente lentas (por ejemplo, a 5 WPM). Ralentizar la duración de los puntos y las rayas destruye la
          melodía musical de la letra, obligando al cerebro a contar puntos como un proceso aritmético.
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Parámetro</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Qué Controla en el Tono</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Rango Recomendado para Principiantes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Velocidad de Carácter (WPM)</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>La duración interna de cada punto (1 unidad) y raya (3 unidades) dentro de la letra.</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>18 – 25 WPM (Preserva el ritmo acústico natural)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>Espaciado Farnsworth</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>La pausa de silencio extendida entre caracteres y entre palabras sucesivas.</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>8 – 12 WPM (Brinda tiempo para procesar el carácter)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text)' }}>
            ¿Por Qué el Método Farnsworth Es Tan Efectivo?
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
            El sistema Farnsworth te permite escuchar cada letra a una velocidad ágil de 20 WPM mientras alarga los silencios
            entre ellas. De este modo, disfrutas del tiempo de reflexión que necesitas como principiante sin degradar el
            patrón rítmico auténtico con el que se comunican los radioaficionados en las bandas de HF.
          </p>
        </div>
      </section>

      {/* THE 10-MINUTE DAILY PRACTICE ROUTINE */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Rutina Diaria de 10 Minutos para Dominar el Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          La constancia diaria supera a las sesiones maratónicas esporádicas. Sigue este programa estructurado de 10 minutos
          para consolidar tu oído telegráfico sin sobrecargar tu mente:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Tiempo</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Enfoque del Ejercicio</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text)' }}>Objetivo Pedagógico</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>2 Minutos</td>
                <td style={{ padding: '0.75rem 1rem' }}>Calentamiento con los 8 Iniciales</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Sintonizar el oído con ritmos elementales (<code style={{ color: 'var(--primary)' }}>E, T, A, N, I, M, S, O</code>).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>4 Minutos</td>
                <td style={{ padding: '0.75rem 1rem' }}>Entrenamiento con Grupo Activo</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Practicar el grupo en estudio (Alfabeto A–Z + Ñ o Números 0–9).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>2 Minutos</td>
                <td style={{ padding: '0.75rem 1rem' }}>Repaso de Caracteres Fallados</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Cambiar al conjunto "Repasar Fallos" para repetir las señales erradas.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>1 Minuto</td>
                <td style={{ padding: '0.75rem 1rem' }}>Reconocimiento de Palabras Cortas</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Ejercitar palabras de 2 a 4 letras (<code style={{ color: 'var(--primary)' }}>HOLA, SOL, MAR, SOS</code>).</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--primary)' }}>1 Minuto</td>
                <td style={{ padding: '0.75rem 1rem' }}>Revisión de Precisión y Ajuste</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>Comprobar la precisión lograda. Si supera el 90%, acelerar el espaciado Farnsworth.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* RECEIVING VS SENDING PRACTICE */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Diferencias Clave: Práctica de Recepción vs. Transmisión
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          El copiado auditivo (recepción) y la manipulación telegráfica (transmisión) activan redes neuronales completamente distintas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Recepción (Copiado Auditivo)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Convierte secuencias acústicas entrantes en texto inteligible en tu mente.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Entrena el oído con grupos aleatorios y discriminación sonora.</li>
              <li>Fomenta la comprensión mental directa ("head copy") sin escribir cada letra.</li>
              <li>Utiliza el entrenador interactivo de esta página para agilizar tu memoria auditiva.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              Transmisión (Manipulación con Llave)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Requiere memoria motriz fina para generar duraciones de puntos y rayas con precisión temporal.
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              <li>Se practica con un manipulador vertical (straight key), de paleta (paddle) o virtual.</li>
              <li>Exige mantener una relación exacta de 1:3 entre puntos y rayas según la norma UIT.</li>
              <li>Para ejercitar la pulsación manual, explora nuestro <a href="/es/morse-code-keyer/" onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Manipulador de Código Morse</a>.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* RECURSOS OFICIALES Y FEDERACIONES DE RADIOAFICIONADOS */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Recursos Oficiales y Transmisiones de Práctica de Telegrafía
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Además de los entrenadores web, practicar con emisiones de radio reales y boletines telegráficos oficiales
          es el método preferido por radioaficionados de habla hispana en todo el mundo.
        </p>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ExternalLink size={18} style={{ color: 'var(--primary)' }} />
            <a href="https://www.ure.es/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
              Unión de Radioaficionados Españoles (URE) – Telegrafía y CW
            </a>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            La URE ofrece cursos de telegrafía CW, conferencias sobre código Morse y actividades para operadores
            en España y la Región 1 de la IARU.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <ExternalLink size={18} style={{ color: 'var(--primary)' }} />
            <a href="https://fmre.mx/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
              Federación Mexicana de Radioexperimentadores (FMRE)
            </a>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            La FMRE promueve la formación en código Morse para estaciones de radioaficionados en México, concursos nacionales y redes de emergencia.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <ExternalLink size={18} style={{ color: 'var(--primary)' }} />
            <a href="https://www.arrl.org/code-practice-files/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
              Archivos Oficiales de Práctica W1AW (ARRL)
            </a>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Descarga archivos de audio en MP3 transmitidos al aire por la estación W1AW en velocidades escalonadas desde 5 hasta 40 WPM.
          </p>
        </div>
      </section>

      {/* ACCORDION FAQ SECTION */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
          Preguntas Frecuentes sobre la Práctica de Código Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={18} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER CTA BAR */}
      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
          Explora Otras Herramientas y Guías de Código Morse en Español
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
          <a
            href="/es/learn-morse-code/"
            onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Aprender Código Morse
          </a>
          <a
            href="/es/morse-code-keyer/"
            onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Manipulador Telegráfico
          </a>
          <a
            href="/es/morse-code-alphabet/"
            onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Alfabeto Morse Completo
          </a>
          <a
            href="/es/morse-code-decoder/"
            onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Decodificador de Código Morse
          </a>
          <a
            href="/es/morse-code-amateur-radio/"
            onClick={(e) => handleNav(e, 'es-amateurradio', '/es/morse-code-amateur-radio/')}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}
          >
            Radioafición CW
          </a>
        </div>
      </footer>
    </article>
  );
}

export default SpanishPracticePage;
