import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Radio, Volume2, Trash2, Undo2, Copy, Play, RefreshCw,
  HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight, Activity,
  Settings, CheckCircle2, Sliders, Target, Clock, Zap, BookOpen, Layers
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateMorseToSpanish } from '../engine/spanishMorse.js';

const PRESET_CATEGORIES = {
  beginner: [
    { label: 'Letra E', text: 'E' },
    { label: 'Letra T', text: 'T' },
    { label: 'Letra A', text: 'A' },
    { label: 'Letra N', text: 'N' },
    { label: 'Letra S', text: 'S' },
    { label: 'Letra O', text: 'O' }
  ],
  common: [
    { label: 'SOS', text: 'SOS' },
    { label: 'HOLA', text: 'HOLA' },
    { label: 'TEST', text: 'TEST' },
    { label: 'CQ', text: 'CQ' },
    { label: 'RADIO', text: 'RADIO' }
  ],
  phrases: [
    { label: 'HOLA MUNDO', text: 'HOLA MUNDO' },
    { label: 'BUENOS DIAS', text: 'BUENOS DIAS' },
    { label: 'GRACIAS', text: 'GRACIAS' },
    { label: '73 DE XE1', text: '73 DE XE1' }
  ]
};

export function SpanishKeyerPage({
  wpm = 20,
  frequency = 600,
  setFrequency,
  volume = 0.5,
  setVolume,
  showToast,
  setActiveTab
}) {
  const [keyedMorse, setKeyedMorse] = useState('');
  const [isKeyDown, setIsKeyDown] = useState(false);
  const [lastSymbol, setLastSymbol] = useState(null);
  const [recentSignals, setRecentSignals] = useState([]);

  // Audio & Settings
  const [keySoundEnabled, setKeySoundEnabled] = useState(true);
  const [dashThreshold, setDashThreshold] = useState(160); // ms
  const [showSettings, setShowSettings] = useState(false);
  const [keyFrequency, setKeyFrequency] = useState(frequency || 600);
  const [keyVolume, setKeyVolume] = useState(volume || 0.5);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Practice Modes
  const [practiceMode, setPracticeMode] = useState('free'); // 'free', 'guided'
  const [targetCategory, setTargetCategory] = useState('beginner');
  const [targetText, setTargetText] = useState('E');

  // Timers and Refs
  const keyDownTimeRef = useRef(0);
  const letterTimerRef = useRef(null);
  const wordTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Decode live keyed Morse
  const decodedText = useMemo(() => {
    if (!keyedMorse.trim()) return '';
    return translateMorseToSpanish(keyedMorse, 'extended');
  }, [keyedMorse]);

  // Audio tone generation for keyer press
  const startTone = () => {
    if (!keySoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const osc = audioContextRef.current.createOscillator();
      const gain = audioContextRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(keyFrequency, audioContextRef.current.currentTime);
      gain.gain.setValueAtTime(keyVolume, audioContextRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioContextRef.current.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // Audio fallback
    }
  };

  const stopTone = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch {
      // Audio fallback
    }
  };

  // Key press handlers
  const handleKeyStart = () => {
    if (isKeyDown) return;
    setIsKeyDown(true);
    keyDownTimeRef.current = Date.now();
    startTone();

    if (letterTimerRef.current) clearTimeout(letterTimerRef.current);
    if (wordTimerRef.current) clearTimeout(wordTimerRef.current);
  };

  const handleKeyEnd = () => {
    if (!isKeyDown) return;
    setIsKeyDown(false);
    stopTone();

    const duration = Date.now() - keyDownTimeRef.current;
    if (duration < 25) return; // descartar micro-rebotes involuntarios

    const symbol = duration >= dashThreshold ? '-' : '.';
    setLastSymbol({ symbol, duration, isDash: duration >= dashThreshold });

    setKeyedMorse(prev => prev + symbol);
    setRecentSignals(prev => [{ sym: symbol, dur: duration }, ...prev.slice(0, 8)]);

    // Separador automático de letras tras 450ms de pausa
    letterTimerRef.current = setTimeout(() => {
      setKeyedMorse(prev => prev.endsWith(' ') ? prev : prev + ' ');
      // Separador automático de palabras tras 1100ms
      wordTimerRef.current = setTimeout(() => {
        setKeyedMorse(prev => prev.endsWith(' / ') ? prev : prev.trimEnd() + ' / ');
      }, 650);
    }, 450);
  };

  // Enlace con la barra espaciadora
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleKeyStart();
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleKeyEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isKeyDown, dashThreshold, keyFrequency, keyVolume, keySoundEnabled]);

  const handleClear = () => {
    setKeyedMorse('');
    setRecentSignals([]);
    setLastSymbol(null);
  };

  const handleCopy = async () => {
    if (!keyedMorse) return;
    try {
      await navigator.clipboard.writeText(keyedMorse);
      if (showToast) showToast('Código Morse pulsado copiado al portapapeles ✓');
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  const faqs = [
    {
      q: '¿Qué es un manipulador de código Morse y para qué sirve?',
      a: 'Un manipulador telegráfico (keyer o llave telegráfica) es un dispositivo físico o software que actúa como interruptor para encender y apagar una señal de radiofrecuencia o sonido. Permite al operador transmitir caracteres en código Morse modulando la duración de cada contacto (puntos y rayas) y los silencios entre ellos.'
    },
    {
      q: '¿Cómo se utiliza este simulador de llave telegráfica?',
      a: 'Funciona simulando una llave recta tradicional (straight key). Mantén presionada la barra espaciadora del teclado, haz clic con el ratón o mantén pulsado el botón en pantalla táctil. Una pulsación breve (inferior a 160 ms) genera un punto (dit); una pulsación más prolongada genera una raya (dah). Las pausas breves separan letras y las pausas largas separan palabras.'
    },
    {
      q: '¿Puedo practicar la transmisión de código Morse sin un equipo de radio real?',
      a: 'Sí. Este manipulador virtual genera el sidetone sonoro en tiempo real a través de la Web Audio API y decodifica tu transmisión al instante. Te permite perfeccionar tu ritmo, sincronía muscular y cadencia antes de adquirir equipamiento físico de radioaficionado.'
    },
    {
      q: '¿Cuál es la proporción matemática exacta entre puntos, rayas y silencios?',
      a: 'El reglamento oficial de la Unión Internacional de Telecomunicaciones (UIT-R M.1677-1) estipula la fórmula matemática 1:3:1:3:7: el punto dura 1 unidad, la raya dura exactamente 3 unidades, la pausa entre elementos de una letra dura 1 unidad, la pausa entre letras dura 3 unidades y el espacio entre palabras completas dura 7 unidades.'
    },
    {
      q: '¿A qué velocidad debo comenzar a practicar la manipulación?',
      a: 'Comienza a una velocidad cómoda donde puedas controlar con total precisión la proporción de tus puntos y rayas. Es preferible transmitir de forma pausada pero matemáticamente perfecta a intentar acelerar cometiendo errores de sincronismo. La velocidad aumentará de manera natural con la práctica.'
    },
    {
      q: '¿Cuál es la diferencia entre una llave recta (straight key), una paleta iámbica y un keyer electrónico?',
      a: 'En una llave recta, el operador controla a pulso la duración exacta de cada punto, raya y espacio. En una paleta iámbica conectada a un keyer electrónico, la paleta izquierda genera automáticamente ráfagas perfectas de puntos y la derecha ráfagas de rayas a una velocidad constante, reduciendo drásticamente el cansancio en sesiones prolongadas.'
    },
    {
      q: '¿El simulador decodifica lo que transmito en tiempo real?',
      a: 'Sí. El motor léxico analiza tus pulsaciones y pausas en vivo, traduciendo tus puntos y rayas a texto en español al instante. Si notas que una letra se decodifica de forma incorrecta, podrás corregir inmediatamente tu tiempo de pulsación o la duración de tus silencios.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Manipulador de Telégrafo Online</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Radio size={16} /> Simulador de Llave Telegráfica ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Manipulador Telegráfico Interactivo (Simulador de Llave Morse)
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Practica la emisión manual de puntos y rayas con la barra espaciadora, el ratón o la pantalla táctil. Genera tonos de audio en tiempo real, entrena tu cadencia temporal y visualiza la decodificación en vivo.
        </p>
      </div>

      {/* INTERFAZ PRINCIPAL DEL MANIPULADOR VIRTUAL */}
      <div className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', textAlign: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-color)' }}>
        {/* Barra de Controles y Modos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setPracticeMode('free')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: practiceMode === 'free' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: practiceMode === 'free' ? '#000' : 'var(--text-secondary)'
              }}
            >
              Modo Libre
            </button>
            <button
              onClick={() => setPracticeMode('guided')}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: practiceMode === 'guided' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: practiceMode === 'guided' ? '#000' : 'var(--text-secondary)'
              }}
            >
              Práctica Guiada
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
            >
              <Settings size={14} />
              <span>{showSettings ? 'Ocultar Ajustes' : 'Ajustes'}</span>
            </button>
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
            >
              <Trash2 size={14} /> Limpiar
            </button>
          </div>
        </div>

        {/* Panel Desplegable de Configuración */}
        {showSettings && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'left', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', border: '1px solid var(--border-color)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Umbral raya/punto: <strong>{dashThreshold} ms</strong>
              </label>
              <input
                type="range"
                min="100"
                max="250"
                step="10"
                value={dashThreshold}
                onChange={(e) => setDashThreshold(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Frecuencia del tono: <strong>{keyFrequency} Hz</strong>
              </label>
              <input
                type="range"
                min="400"
                max="1000"
                step="25"
                value={keyFrequency}
                onChange={(e) => setKeyFrequency(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Volumen del sonido: <strong>{Math.round(keyVolume * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={keyVolume}
                onChange={(e) => setKeyVolume(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Práctica Guiada: Selector de Objetivos */}
        {practiceMode === 'guided' && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(56, 189, 248, 0.08)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Objetivo a transmitir: <strong style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{targetText}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {PRESET_CATEGORIES.beginner.concat(PRESET_CATEGORIES.common).map(item => (
                <button
                  key={item.text}
                  onClick={() => setTargetText(item.text)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-color)',
                    background: targetText === item.text ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                    color: targetText === item.text ? '#000' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EL BOTÓN VIRTUAL DEL MANIPULADOR */}
        <div style={{ margin: '2rem 0' }}>
          <button
            onMouseDown={handleKeyStart}
            onMouseUp={handleKeyEnd}
            onMouseLeave={handleKeyEnd}
            onTouchStart={(e) => { e.preventDefault(); handleKeyStart(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleKeyEnd(); }}
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: isKeyDown ? '4px solid var(--accent-primary)' : '4px solid var(--border-color)',
              background: isKeyDown
                ? 'radial-gradient(circle, var(--accent-primary) 0%, rgba(56, 189, 248, 0.2) 70%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 100%)',
              boxShadow: isKeyDown ? '0 0 35px var(--accent-primary)' : '0 8px 24px rgba(0,0,0,0.4)',
              transform: isKeyDown ? 'scale(0.96)' : 'scale(1)',
              transition: 'all 0.08s ease',
              cursor: 'pointer',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              userSelect: 'none',
              outline: 'none'
            }}
          >
            <Radio size={40} style={{ color: isKeyDown ? '#000' : 'var(--accent-primary)', marginBottom: '0.5rem' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: isKeyDown ? '#000' : 'var(--text-primary)' }}>
              {isKeyDown ? 'TRANSMITIENDO' : 'PULSAR LLAVE'}
            </span>
            <span style={{ fontSize: '0.75rem', color: isKeyDown ? '#000' : 'var(--text-muted)', marginTop: '0.2rem' }}>
              o presiona Espacio
            </span>
          </button>
        </div>

        {/* Historial de Señales Recientes */}
        <div style={{ minHeight: '36px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}>
          {recentSignals.map((sig, idx) => (
            <span
              key={idx}
              style={{
                fontFamily: 'monospace',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: sig.sym === '-' ? 'var(--accent-warning)' : 'var(--accent-primary)',
                background: 'rgba(0,0,0,0.3)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              {sig.sym} <small style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{sig.dur}ms</small>
            </span>
          ))}
        </div>

        {/* Pantalla de Salida: Morse Pulsado y Texto Decodificado */}
        <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Código Morse pulsado:
            </span>
            <button
              onClick={handleCopy}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <Copy size={13} /> Copiar
            </button>
          </div>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontFamily: 'monospace',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--accent-warning)',
              minHeight: '45px',
              wordBreak: 'break-all',
              letterSpacing: '2px'
            }}
          >
            {keyedMorse || 'Presiona la llave para comenzar a transmitir...'}
          </div>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginTop: '1rem', marginBottom: '0.35rem' }}>
            Texto decodificado en vivo:
          </span>
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--accent-primary)',
              minHeight: '45px',
              wordBreak: 'break-word'
            }}
          >
            {decodedText || 'El texto traducido aparecerá aquí...'}
          </div>
        </div>
      </div>

      {/* GUÍA DIDÁCTICA Y EDITORIAL EN PROFUNDIDAD */}

      {/* 1. Enviar Código Morse vs Leer Código */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Transmitir Código Morse vs. Leer Código
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Transmitir código Morse manualmente exige una habilidad motriz completamente distinta a la de consultar una tabla de puntos y rayas. Al operar una llave telegráfica, tú tienes el control absoluto de la <strong>duración de cada pulso y de los intervalos de silencio</strong> entre ellos.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Este simulador reproduce fielmente la experiencia de una <strong>llave recta tradicional (straight key)</strong>: una pulsación ligera produce un punto (dit), una pulsación sostenida produce una raya (dah) y el decodificador integrado transcribe tu mensaje en tiempo real para evaluar tu técnica objetivamente.
        </p>
      </section>

      {/* 2. Cómo Usar el Manipulador Telegráfico en 4 Pasos */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Cómo Usar el Manipulador Telegráfico en 4 Pasos
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.35rem' }}>1. Presiona la Llave</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              En ordenador, mantén presionada la <strong>Barra Espaciadora</strong> o haz clic con el ratón. En móviles y tablets, pulsa sobre el botón táctil central.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-warning)', marginBottom: '0.35rem' }}>2. Emite Dits y Dahs</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Una pulsación rápida (&lt;160 ms) genera un <strong>punto (.)</strong>. Mantener la tecla más tiempo genera una <strong>raya (-)</strong>.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-success)', marginBottom: '0.35rem' }}>3. Observa tu Morse</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Los pulsos se imprimen en secuencia en pantalla (por ejemplo: <code>.... --- .-.. .-</code>). Las pausas insertan espacios automáticamente.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>4. Verifica el Texto</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              El decodificador en tiempo real traduce tus caracteres a texto en español (ej. <strong>HOLA</strong>), confirmando la nitidez de tu ritmo.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Temporización Matemática del Código Morse (1:3:1:3:7) */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Temporización del Código Morse: Puntos, Rayas y Silencios
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          La belleza y eficacia del código Morse descansa sobre su proporción matemática estandarizada por la norma internacional <strong>UIT-R M.1677-1</strong>:
        </p>

        {/* Tabla de Temporización */}
        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Elemento o Intervalo</th>
                <th style={{ padding: '0.85rem 1rem' }}>Duración Estándar</th>
                <th style={{ padding: '0.85rem 1rem' }}>Función Estructural</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Punto (dit)</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>1 unidad</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>La unidad temporal base de referencia</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-warning)' }}>Raya (dah)</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>3 unidades</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Exactamente el triple de duración que un punto</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Pausa intra-carácter</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>1 unidad</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Silencio entre dits/dahs dentro de una misma letra</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Pausa entre letras</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>3 unidades</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Silencio que separa letras consecutivas</td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Pausa entre palabras</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>7 unidades</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Silencio prolongado entre términos independientes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Mantener esta proporción (1:3:1:3:7) es mucho más importante que intentar telegrafiar a gran velocidad. Una cadencia limpia garantiza que tus caracteres sean comprensibles por cualquier operador en el mundo.
        </p>
      </section>

      {/* 4. Letras Clave para Principiantes */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Caracteres Ideales para Comenzar a Practicar
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          La forma más rápida de ganar soltura al manipular es comenzar con letras breves de alta frecuencia:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { char: 'E', code: '.', desc: '1 punto breve' },
            { char: 'T', code: '-', desc: '1 raya sostenida' },
            { char: 'A', code: '.-', desc: '1 punto + 1 raya' },
            { char: 'N', code: '-.', desc: '1 raya + 1 punto' },
            { char: 'S', code: '...', desc: '3 puntos continuos' },
            { char: 'O', code: '---', desc: '3 rayas continuas' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', padding: '0.85rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', display: 'block' }}>{item.char}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', fontSize: '1.1rem' }}>{item.code}</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Los 4 Errores Más Frecuentes al Manipular */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Los 4 Errores Más Frecuentes al Manipular
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>1. Mantener el Punto Demasiado Tiempo</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Si dudas sobre la llave, el simulador interpretará el punto como una raya. Los toques de dit deben ser secos y decididos.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>2. Acortar Excesivamente las Rayas</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Una raya debe durar exactamente el triple que un punto. Si sueltas la llave demasiado pronto, la señal resulta ambigua.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>3. Olvidar las Pausas Entre Letras</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Tres dits juntos son <strong>S</strong>; tres dits separados por 3 unidades de pausa son <strong>E E E</strong>. Los silencios transmiten tanta información como los tonos.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '0.35rem' }}>4. Juntar Palabras Distintas</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              El espacio entre palabras requiere una pausa generosa de 7 unidades. Sin ella, las oraciones se funden en una cadena ininteligible.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Llave Recta vs Paleta Iámbica vs Keyer Electrónico */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Llave Recta vs. Paleta Iámbica vs. Keyer Electrónico
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En el mundo de la radiotelegrafía física existen tres modalidades instrumentales de manipulación:
        </p>

        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Llave Recta (Straight Key):</strong> Mecanismo de palanca vertical única. El operador controla enteramente a pulso la duración de puntos, rayas y espacios. Es la experiencia tradicional que recrea este simulador web.
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Paleta Iámbica (Iambic Paddle):</strong> Dispositivo con dos palancas laterales independientes (izquierda para puntos, derecha para rayas).
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Keyer Electrónico:</strong> Circuito microprocesador que genera ráfagas automáticas matemáticamente perfectas de puntos y rayas cuando el operador acciona las palancas laterales.
          </li>
        </ul>
      </section>

      {/* 7. Comparativa: Manipulador vs Traductor vs Decodificador */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Manipulador Morse vs. Traductor vs. Decodificador
        </h2>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Herramienta</th>
                <th style={{ padding: '0.85rem 1rem' }}>Propósito Principal</th>
                <th style={{ padding: '0.85rem 1rem' }}>Acción del Usuario</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Manipulador Morse</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Practicar la emisión manual y el ritmo muscular</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pulsar la tecla o barra espaciadora para enviar señales</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'inherit', textDecoration: 'underline' }}>Traductor de Código Morse</a>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Convertir texto a Morse o Morse a texto automáticamente</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Escribir frases completas en teclado</td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  <a href="/es/decodificador-codigo-morse/" onClick={(e) => handleNav(e, 'morsedecoder', '/es/decodificador-codigo-morse/')} style={{ color: 'inherit', textDecoration: 'underline' }}>Decodificador Morse</a>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analizar sintácticamente secuencias de puntos y rayas</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Pegar código para resolver inconsistencias de espacio</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Preguntas Frecuentes (FAQ Accordion) */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} />
          Preguntas Frecuentes sobre el Manipulador Telegráfico
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-card)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Enlaces y Conclusión con Citas Oficiales */}
      <footer style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Perfecciona tu Técnica de Transmisión
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          La forma definitiva de progresar en telegrafía es interiorizar la memoria muscular de los intervalos de silencio. Practica a diario y contrasta tus resultados con nuestras herramientas interactivas:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Traductor Morse en Español <ArrowRight size={16} />
          </a>
          <a
            href="/es/aprender-codigo-morse/"
            onClick={(e) => handleNav(e, 'learn', '/es/aprender-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--surface-hover)', color: 'var(--text-primary)', fontWeight: 700, border: '1px solid var(--border-color)', textDecoration: 'none' }}
          >
            Guía de Aprendizaje
          </a>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          <span>
            Norma Reguladora Mundial:{' '}
            <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              Recomendación UIT-R M.1677-1
            </a>
          </span>
          <span>
            Estándar de Temporización ARRL:{' '}
            <a href="https://www.arrl.org/files/file/Technology/x9004008.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              ARRL Morse Timing Standard
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
