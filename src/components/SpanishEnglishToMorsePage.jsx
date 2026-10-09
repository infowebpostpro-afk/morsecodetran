import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeftRight, Copy, Play, Square, X, Volume2, Sparkles, AlertCircle, Settings, Check, Command, Share2, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Download, HelpCircle, ExternalLink
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  translateSpanishToMorse,
  getSpanishCharacterBreakdown
} from '../engine/spanishMorse.js';
import { calculateStatistics } from '../engine/morseEngine.js';

export function SpanishEnglishToMorsePage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
  const [textInput, setTextInput] = useState('HOLA MUNDO');
  const [charMode, setCharMode] = useState('standard'); // 'standard' (ITU) | 'extended' (Spanish Ñ)

  // Audio Engine Local Controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Copy Feedback State
  const [copiedType, setCopiedType] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const inputRef = useRef(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Real-time Spanish -> Morse encoding
  const { morseOutput, normalizedList } = useMemo(() => {
    if (!textInput.trim()) return { morseOutput: '', normalizedList: [] };
    const res = translateSpanishToMorse(textInput, charMode);
    return { morseOutput: res.morseText, normalizedList: res.normalizedList };
  }, [textInput, charMode]);

  // Character breakdown for playback visualization
  const breakdown = useMemo(() => {
    if (!textInput.trim()) return [];
    return getSpanishCharacterBreakdown(textInput, charMode);
  }, [textInput, charMode]);

  const stats = useMemo(() => {
    return calculateStatistics(textInput, morseOutput, wpm, farnsworthWpm);
  }, [textInput, morseOutput, wpm, farnsworthWpm]);

  const handleWpmChange = (newWpm) => {
    setWpm(newWpm);
    if (setGlobalWpm) setGlobalWpm(newWpm);
  };

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    setActiveCharIndex(-1);

    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveCharIndex(-1);
          return;
        }
        if (typeof idx === 'number') {
          setActiveCharIndex(idx);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Código Morse' : 'Texto en español'} copiado ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  const handleDownloadWav = () => {
    if (!morseOutput) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: morseOutput, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `texto-morse-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Archivo de audio WAV descargado ✓');
    } catch {
      if (showToast) showToast('Error al generar archivo WAV.');
    }
  };

  const sampleTexts = [
    'HOLA MUNDO',
    'BUENOS DIAS',
    'TE AMO',
    'FELIZ CUMPLEAÑOS',
    'SOS AUXILIO',
    '73 CORDIALES SALUDOS'
  ];

  const faqs = [
    {
      q: '¿Cómo convierte el traductor las letras del español al código Morse?',
      a: 'Cada carácter alfanumérico se procesa según la especificación de la Unión Internacional de Telecomunicaciones (ITU-R M.1677-1). Las letras A–Z se asignan a sus correspondientes combinaciones de puntos y rayas. Entre cada letra se genera un espacio de 3 unidades, y entre palabras distintas se inserta una barra diagonal "/" delimitada por espacios.'
    },
    {
      q: '¿Qué sucede con los acentos ortográficos (Á, É, Í, Ó, Ú) y la diéresis (Ü)?',
      a: 'En las comunicaciones radiotelegráficas internacionales, los caracteres acentuados se normalizan a su vocal base correspondiente (Á→A, É→E, Í→I, Ó→O, Ú→U, Ü→U). Nuestro traductor realiza esta normalización de forma transparente, notificándote qué caracteres fueron adaptados para garantizar un 100% de compatibilidad con cualquier receptor Morse del mundo.'
    },
    {
      q: '¿Cómo se maneja la letra Ñ?',
      a: 'Puedes seleccionar entre dos modalidades: el modo Estándar ITU (donde la Ñ se normaliza convencionalmente a N, "-.") o el modo Español con Ñ (donde se utiliza la extensión histórica española "--.--"). Ambos modos son totalmente funcionales y se reflejan en el sonido y en el texto resultante.'
    },
    {
      q: '¿Puedo ajustar la velocidad de transmisión de los puntos y rayas?',
      a: 'Sí. Puedes regular la velocidad en Palabras Por Minuto (WPM) desde 5 hasta 45 WPM, así como modificar la frecuencia de tono en Hertz (Hz) para obtener un sonido más grave o más agudo. También dispones del ajuste Farnsworth para alargar las pausas entre letras sin ralentizar los caracteres individuales.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Traductor de Texto a Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Traductor de Texto a Código Morse: Generador Instantáneo
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Convierte texto en español a código Morse internacional en tiempo real. Escucha la señal sonora sintetizada, controla la velocidad WPM y descarga el audio en formato WAV.
        </p>
      </div>

      {/* Main Tool Container */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        {/* Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tratamiento de la Ñ:</span>
            <button
              onClick={() => setCharMode('standard')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: charMode === 'standard' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: charMode === 'standard' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Estándar ITU (Ñ → N)
            </button>
            <button
              onClick={() => setCharMode('extended')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: charMode === 'extended' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: charMode === 'extended' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Extensión Española (Ñ = --.--)
            </button>
          </div>

          <button
            onClick={() => setShowAudioSettings(!showAudioSettings)}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Settings size={14} />
            <span>{showAudioSettings ? 'Ocultar Ajustes' : 'Ajustes de Sonido'}</span>
          </button>
        </div>

        {/* Collapsible Audio Settings */}
        {showAudioSettings && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Velocidad: <strong>{wpm} WPM</strong>
              </label>
              <input
                type="range"
                min="5"
                max="45"
                value={wpm}
                onChange={(e) => handleWpmChange(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Frecuencia de tono: <strong>{frequency} Hz</strong>
              </label>
              <input
                type="range"
                min="300"
                max="1000"
                step="25"
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Volumen: <strong>{Math.round(volume * 100)}%</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Text Input Section */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Texto en español a convertir:
            </label>
            <button
              onClick={() => setTextInput('')}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={12} /> Limpiar
            </button>
          </div>
          <textarea
            ref={inputRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Escribe o pega texto en español aquí..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              lineHeight: 1.5,
              resize: 'vertical'
            }}
          />

          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Ejemplos:</span>
            {sampleTexts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setTextInput(sample)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Morse Output Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Código Morse generado:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleCopy(morseOutput, 'morse')}
                disabled={!morseOutput}
                className="btn btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'morse' ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                <span>{copiedType === 'morse' ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              minHeight: '80px',
              fontSize: '1.25rem',
              fontFamily: 'monospace',
              letterSpacing: '1.5px',
              color: morseOutput ? 'var(--accent-primary)' : 'var(--text-muted)',
              lineHeight: 1.6,
              wordBreak: 'break-word'
            }}
          >
            {morseOutput || 'El código Morse traducido aparecerá aquí automáticamente...'}
          </div>

          {/* Normalization notice */}
          {normalizedList && normalizedList.length > 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} color="var(--warning, #f59e0b)" />
              <span>Caracteres adaptados a estándar internacional: {normalizedList.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Character Breakdown Visualizer */}
        {breakdown.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Desglose interactivo letra por letra:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)' }}>
              {breakdown.map((item, idx) => {
                const isActive = activeCharIndex === idx;
                if (item.isSpace) {
                  return (
                    <div key={idx} style={{ width: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      /
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-xs, 4px)',
                      border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.03)',
                      textAlign: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.char}</div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{item.morse}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!morseOutput}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
              >
                <Play size={16} />
                <span>Reproducir Señal de Audio</span>
              </button>
            ) : (
              <button
                onClick={handleStopAudio}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--danger)' }}
              >
                <Square size={16} />
                <span>Detener Sonido</span>
              </button>
            )}

            <button
              onClick={handleDownloadWav}
              disabled={!morseOutput}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Download size={16} />
              <span>Descargar Audio WAV</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total: <strong>{stats.characterCount} caracteres</strong> • Duración estimada: <strong>{stats.durationSeconds} s</strong>
          </div>
        </div>
      </div>

      {/* Comprehensive Educational Sections (Full Parity with English) */}
      <article className="seo-article-container" style={{ marginTop: '3.5rem' }}>
        <div className="article-body-content">

          {/* RESPUESTA RÁPIDA: TEXTO A CÓDIGO MORSE */}
          <section className="content-section">
            <h2>Respuesta Rápida: Conversión de Texto a Código Morse</h2>
            <p>
              La <strong>conversión de texto a código Morse</strong> es el procedimiento mediante el cual las letras del abecedario, los números y los signos ortográficos se transforman en secuencias normalizadas de puntos (<code>.</code>) y rayas (<code>-</code>) pertenecientes al <strong>Código Morse Internacional</strong>.
            </p>
            <p>
              Cada carácter posee una combinación fija de impulsos elementales. Por ejemplo, la palabra <strong>HOLA</strong> se convierte en <code className="morse-font">.... --- .-.. .-</code>.
            </p>
            <p>
              En la escritura telegráfica sobre papel o pantalla, las letras individuales se separan mediante un espacio en blanco, y las palabras completas se separan con una barra diagonal (<code>/</code>) delimitada por espacios: <strong>HOLA MUNDO</strong> se codifica como <code className="morse-font">.... --- .-.. .- / -- ..- -. -.. ---</code>.
            </p>
          </section>

          {/* CÓMO CONVERTIR TEXTO EN ESPAÑOL A CÓDIGO MORSE */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Convertir Texto a Código Morse Paso a Paso</h2>
            <p>
              Existen dos formas principales de traducir texto a código Morse: consultando una tabla de caracteres manualmente o utilizando nuestro traductor en tiempo real.
            </p>
            <p>El flujo operativo estándar es: <strong>Texto en español → División en letras → Asignación de patrones Morse → Ensamblado con silencios y barras</strong>.</p>

            <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginTop: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Ejemplo Práctico Desarrollado: SOL</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                1. Separa las letras del término: <code>S - O - L</code>.<br />
                2. Busca la correspondencia de cada letra en el estándar:<br />
                • S → <code className="morse-font">...</code> (3 puntos)<br />
                • O → <code className="morse-font">---</code> (3 rayas)<br />
                • L → <code className="morse-font">.-..</code> (punto, raya, dos puntos)<br />
                3. Une los códigos separándolos con un espacio: <code className="morse-font" style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.05rem' }}>... --- .-..</code>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>BUENOS DÍAS</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  B (<code>-...</code>) U (<code>..-</code>) E (<code>.</code>) N (<code>-.</code>) O (<code>---</code>) S (<code>...</code>)<br />
                  Resultado: <code className="morse-font" style={{ color: '#10b981' }}>-... ..- . -. --- ... / -.. .. .- ...</code>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem' }}>TE AMO</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Las palabras se separan formalmente mediante una barra (<code>/</code>).<br />
                  Resultado: <code className="morse-font" style={{ color: '#f59e0b' }}>- . / .- -- ---</code>
                </p>
              </div>
            </div>
          </section>

          {/* CÓMO FUNCIONA EL MOTOR DE CODIFICACIÓN */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Funciona el Traductor y Mapeo Oficial ITU-R M.1677-1</h2>
            <p>
              Nuestro conversor aplica un algoritmo de sustitución determinista basado en la recomendación internacional <a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">ITU-R M.1677-1 <ExternalLink size={12} /></a> y las normas telegráficas de los países hispanohablantes:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Carácter de Entrada</th>
                    <th>Patrón Morse Internacional</th>
                    <th>Ritmo Fonético Acústico</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>A</td><td><code className="morse-font">.-</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-dah</td></tr>
                  <tr><td>B</td><td><code className="morse-font">-...</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-di-dit</td></tr>
                  <tr><td>C</td><td><code className="morse-font">-.-.</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dah-dit</td></tr>
                  <tr><td>D</td><td><code className="morse-font">-..</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-di-dit</td></tr>
                  <tr><td>E</td><td><code className="morse-font">.</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dit</td></tr>
                  <tr><td><strong>Ñ</strong> (Español)</td><td><code className="morse-font">--.--</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-dah-di-dah-dah</td></tr>
                  <tr><td>H</td><td><code className="morse-font">....</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-di-dit</td></tr>
                  <tr><td>O</td><td><code className="morse-font">---</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-dah-dah</td></tr>
                  <tr><td>S</td><td><code className="morse-font">...</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>di-di-dit</td></tr>
                  <tr><td>T</td><td><code className="morse-font">-</code></td><td style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginTop: '1.25rem' }}>
              <strong>Ejemplo Completo Desarrollado: AYUDA</strong><br />
              A (<code>.-</code>) + Y (<code>-.--</code>) + U (<code>..-</code>) + D (<code>-..</code>) + A (<code>.-</code>) = <code className="morse-font" style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>.- -.-- ..- -.. .-</code>
            </div>
          </section>

          {/* TABLA DE EJEMPLOS COMUNES EN ESPAÑOL */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Ejemplos Comunes de Texto Traducido a Código Morse</h2>
            <p>Consulta las frases y palabras más habituales convertidas a código Morse:</p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Texto Original</th>
                    <th>Código Morse Resultante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>E</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.</code></td></tr>
                  <tr><td><strong>T</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>-</code></td></tr>
                  <tr><td><strong>A</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.-</code></td></tr>
                  <tr><td><strong>Ñ</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>--.--</code></td></tr>
                  <tr><td><strong>SOS</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>... --- ...</code></td></tr>
                  <tr><td><strong>HOLA</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.... --- .-.. .-</code></td></tr>
                  <tr><td><strong>GRACIAS</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>--. .-. .- -.-. .. .- ...</code></td></tr>
                  <tr><td><strong>TE AMO</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>- . / .- -- ---</code></td></tr>
                  <tr><td><strong>FELIZ CUMPLEAÑOS</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>..-. . .-.. .. --.. / -.-. ..- -- .--. .-.. . --.-- --- ...</code></td></tr>
                  <tr><td><strong>HOLA MUNDO</strong></td><td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.... --- .-.. .- / -- ..- -. -.. ---</code></td></tr>
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Para consultar el catálogo completo de las 27 letras y su fonética sonora, visita nuestra página del <a href="/es/morse-code-alphabet/" onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}>Alfabeto en Código Morse</a>.
            </p>
          </section>

          {/* TEMPORIZACIÓN Y NÚMEROS EN LA CODIFICACIÓN */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Temporización de Emisión y Números en el Mensaje</h2>
            <p>
              Cuando un texto incluye cifras (por ejemplo <strong>HOLA 2026</strong>), los números se codifican según el estándar de 5 elementos. El <code>2</code> se convierte en <code className="morse-font">..---</code>, el <code>0</code> en <code className="morse-font">-----</code> y el <code>6</code> en <code className="morse-font">-....</code>:
            </p>
            <div className="code-example-box">
              <strong>HOLA 2026</strong> = <code className="morse-font">.... --- .-.. .- / ..--- ----- ..--- -....</code>
            </div>

            <h3>Espaciado Escrito frente a Temporización Acústica (Estándar PARIS)</h3>
            <p>
              En la reproducción de audio generada por Web Audio API en este sitio web, los tiempos cumplen rigurosamente la regla <strong>1-3-1-3-7</strong> recomendada por la ARRL:
            </p>
            
            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Elemento Acústico o Silencio</th>
                    <th style={{ textAlign: 'right', width: '150px' }}>Duración Oficial</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Punto (dit)</td><td style={{ textAlign: 'right' }}><strong>1 unidad</strong></td></tr>
                  <tr><td>Raya (dah)</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td></tr>
                  <tr><td>Silencio entre elementos de una letra</td><td style={{ textAlign: 'right' }}><strong>1 unidad</strong></td></tr>
                  <tr><td>Silencio entre letras consecutivas</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td></tr>
                  <tr><td>Silencio entre palabras distintas (barra <code>/</code>)</td><td style={{ textAlign: 'right' }}><strong>7 unidades</strong></td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* VELOCIDAD WPM, TONO Y MÉTODO FARNSWORTH */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Velocidad WPM, Tono en Hertz y Espaciado Farnsworth</h2>
            <p>
              La velocidad telegráfica se mide en palabras por minuto (<strong>WPM</strong>) utilizando la palabra de calibración PARIS (50 unidades elementales).
            </p>
            <p>
              Para estudiantes principiantes, nuestra herramienta incorpora el <strong>espaciado Farnsworth</strong>: los caracteres individuales se emiten a una velocidad mayor (por ejemplo, 18 WPM) para habituar el oído al ritmo real de la letra, pero se introducen silencios más prolongados entre caracteres para dar tiempo a procesar mentalmente la letra antes de escuchar la siguiente.
            </p>
            <p>
              Si dispones de código Morse y necesitas traducirlo a texto legible en español, utiliza nuestra herramienta inversa: <a href="/es/morse-code-to-english/" onClick={(e) => handleNav(e, 'es-morse2english', '/es/morse-code-to-english/')}>Traductor de Morse a Texto</a>.
            </p>
          </section>

          {/* CÓDIGO MORSE AMERICANO VS INTERNACIONAL */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Código Morse Americano vs. Código Morse Internacional</h2>
            <p>
              El código Morse americano original (diseñado para los telégrafos de ferrocarril del siglo XIX en Estados Unidos) utilizaba rayas de diferentes longitudes y pausas internas dentro de letras individuales como la C o la R.
            </p>
            <p>
              Todas las telecomunicaciones modernas, los servicios marítimos, la radioafición y las herramientas de este portal utilizan exclusivamente el <strong>Código Morse Internacional</strong> (formalizado en París en 1865 y actualizado bajo la Recomendación ITU-R M.1677-1), el cual eliminó los espacios internos entre puntos de una misma letra y fijó una duración uniforme para la raya.
            </p>
          </section>

          {/* CASOS DE USO Y BENEFICIOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Aplicaciones Prácticas y Usos Comunes</h2>
            <ul className="content-list" style={{ lineHeight: 1.8 }}>
              <li><strong>Educación y Memoria:</strong> Escribe cualquier texto y comprueba inmediatamente cómo se compone en puntos y rayas con soporte visual interactivo.</li>
              <li><strong>Juegos de Escape y Enigmas:</strong> Crea pistas cifradas para escape rooms, gincanas escolares y juegos de rol ARG.</li>
              <li><strong>Mensajes Personales y Joyería:</strong> Diseña patrones de puntos y rayas para pulseras con cuentas, collares, tarjetas de felicitación o grabados artísticos.</li>
              <li><strong>Radioafición (CW):</strong> Prepara textos para comunicados de radio en onda corta y entrena el oído a diferentes velocidades WPM.</li>
              <li><strong>Generación de Audio WAV:</strong> Descarga clips de sonido telegráfico libres de derechos para vídeos, podcasts o proyectos escolares.</li>
            </ul>
          </section>

          {/* Cross-linking cards */}
          <section style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Traductor de Morse a Texto
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Traduce código Morse en dirección contraria para decodificar puntos y rayas a texto comprensible.
                </p>
                <a
                  href="/es/morse-code-to-english/"
                  onClick={(e) => handleNav(e, 'es-morse2english', '/es/morse-code-to-english/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ir a Morse a Texto</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Traductor de Audio Morse
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Sintetizador especializado de audio CW con control de tono, decodificador de micrófono y ecualizador.
                </p>
                <a
                  href="/es/morse-code-audio-translator/"
                  onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ver traductor de audio</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Manipulador Telegráfico
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Simulador interactivo de llave telegráfica virtual para practicar el envío de puntos y rayas con teclado.
                </p>
                <a
                  href="/es/morse-code-keyer/"
                  onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Abrir simulador de llave</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions (Comprehensive 10+ Questions) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Preguntas Frecuentes sobre la Conversión de Texto a Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: '¿Cómo convierte el traductor las letras del español al código Morse?',
                  a: 'Cada carácter alfanumérico se procesa según la especificación de la Unión Internacional de Telecomunicaciones (ITU-R M.1677-1). Las letras A–Z se asignan a sus correspondientes combinaciones de puntos y rayas. Entre cada letra se genera un espacio de 3 unidades, y entre palabras distintas se inserta una barra diagonal "/" delimitada por espacios.'
                },
                {
                  q: '¿Qué sucede con los acentos ortográficos (Á, É, Í, Ó, Ú) y la diéresis (Ü)?',
                  a: 'En las comunicaciones radiotelegráficas internacionales, los caracteres acentuados se normalizan a su vocal base correspondiente (Á→A, É→E, Í→I, Ó→O, Ú→U, Ü→U). Nuestro traductor realiza esta normalización de forma transparente, notificándote qué caracteres fueron adaptados para garantizar un 100% de compatibilidad con cualquier receptor Morse del mundo.'
                },
                {
                  q: '¿Cómo se maneja la letra Ñ?',
                  a: 'Puedes seleccionar entre dos modalidades: el modo Estándar ITU (donde la Ñ se normaliza convencionalmente a N, "-.") o el modo Español con Ñ (donde se utiliza la extensión histórica española "--.--"). Ambos modos son totalmente funcionales y se reflejan en el sonido y en el texto resultante.'
                },
                {
                  q: '¿Puedo escuchar el sonido del código Morse generado?',
                  a: 'Sí. El botón de reproducción sintetiza la melodía exacta de puntos y rayas mediante Web Audio API en tiempo real sin requerir plugins ni descargas.'
                },
                {
                  q: '¿Puedo ajustar la velocidad de transmisión de los puntos y rayas?',
                  a: 'Sí. Puedes regular la velocidad en Palabras Por Minuto (WPM) desde 5 hasta 45 WPM, así como modificar la frecuencia de tono en Hertz (Hz) para obtener un sonido más grave o más agudo. También dispones del ajuste Farnsworth para alargar las pausas entre letras sin ralentizar los caracteres individuales.'
                },
                {
                  q: '¿Cómo se representan los números al traducir texto?',
                  a: 'Todos los números del 0 al 9 se traducen a sus códigos oficiales de 5 elementos (por ejemplo, 1 = .----, 5 = ....., 0 = -----).'
                },
                {
                  q: '¿Qué ocurre con los signos de puntuación no compatibles?',
                  a: 'Los signos de puntuación estándar (punto, coma, interrogación, barra, comillas, guión, arroba) se traducen con su código oficial. Los caracteres especiales no definidos en el estándar ITU se marcan como signos de advertencia visual para mantener la fidelidad del mensaje.'
                },
                {
                  q: '¿Puedo descargar un archivo de audio WAV de la traducción?',
                  a: 'Sí. Puedes hacer clic en el botón "Descargar Audio WAV" para guardar un archivo de audio PCM sin compresión directamente en tu dispositivo, ideal para proyectos escolares o avisos de radio.'
                },
                {
                  q: '¿Cómo compruebo si mi traducción a código Morse es 100% exacta?',
                  a: 'El método infalible es la verificación de ida y vuelta (round-trip test): copia el código Morse resultante y pégalo en nuestro decodificador de Morse a texto. Si el texto descifrado coincide exactamente con el original, la conversión es totalmente correcta.'
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
              Traductor Verificado de Texto a Código Morse
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Diseñado y mantenido de conformidad con las especificaciones de la ITU y los estándares de radioafición de la ARRL. Utiliza nuestra biblioteca completa para aprender, decodificar y practicar telegrafía moderna.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/es/"
                onClick={(e) => handleNav(e, 'spanish', '/es/')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Abrir Traductor Principal</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/es/morse-code-alphabet/"
                onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Ver Alfabeto Completo</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
