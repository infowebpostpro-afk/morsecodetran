import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles, Settings, Command, X, Play, Square, Copy, Check, Share2, AlertTriangle, Info, Volume2, ShieldCheck, ArrowRight, ChevronUp, ChevronDown, Download, HelpCircle, ExternalLink
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  decodeMorseDetailed,
  normalizeMorseInput,
  calculateStatistics,
  detectInputType
} from '../engine/morseEngine.js';
import { translateMorseToSpanish } from '../engine/spanishMorse.js';

export function SpanishDecoderPage({ wpm: initialWpm = 20, setWpm: setGlobalWpm, frequency: initialFreq = 600, volume: initialVol = 0.5, showToast, setActiveTab }) {
  const [morseInput, setMorseInput] = useState('.... --- .-.. .- / -- ..- -. -.. ---');

  // Synchronized Highlighting State
  const [activeTokenIdx, setActiveTokenIdx] = useState(null);
  const [hoveredTokenIdx, setHoveredTokenIdx] = useState(null);

  // Audio Engine Local Controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTokenIdx, setPlaybackTokenIdx] = useState(-1);

  // Feedback & Accordion State
  const [copiedSuccess, setCopiedSuccess] = useState(false);
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

  // Keyboard Shortcuts (Ctrl/Cmd + K to focus, Escape to clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'k' || e.key === 'Enter')) {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
        if (showToast) showToast('Campo de entrada enfocado');
      } else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          setMorseInput('');
          if (showToast) showToast('Entrada limpiada');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  // Real-Time Detailed Decoding
  const decodedResult = useMemo(() => {
    return decodeMorseDetailed(morseInput);
  }, [morseInput]);

  // Statistics
  const stats = useMemo(() => {
    return calculateStatistics(decodedResult.plainText, morseInput, wpm, farnsworthWpm);
  }, [decodedResult.plainText, morseInput, wpm, farnsworthWpm]);

  // Playback Sequence Construction
  const playbackBreakdown = useMemo(() => {
    if (!decodedResult.tokens || decodedResult.tokens.length === 0) return [];
    return decodedResult.tokens.map(token => ({
      char: token.resolvedChar || '?',
      morse: token.raw || '',
      isSpace: token.type === 'word_gap'
    }));
  }, [decodedResult.tokens]);

  const handlePlayAudio = () => {
    if (!playbackBreakdown || playbackBreakdown.length === 0) return;
    setIsPlaying(true);
    setPlaybackTokenIdx(-1);

    audioEngine.playSequence({
      breakdown: playbackBreakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setPlaybackTokenIdx(-1);
          return;
        }
        if (typeof idx === 'number') {
          setPlaybackTokenIdx(idx);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setPlaybackTokenIdx(-1);
  };

  const handleCopyText = async () => {
    if (!decodedResult.plainText) return;
    try {
      await navigator.clipboard.writeText(decodedResult.plainText);
      setCopiedSuccess(true);
      if (showToast) showToast('Texto descifrado copiado al portapapeles ✓');
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  const handleDownloadWav = () => {
    const normalized = normalizeMorseInput(morseInput);
    if (!normalized) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: normalized, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-decodificado-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Archivo de audio WAV descargado ✓');
    } catch {
      if (showToast) showToast('Error al generar archivo WAV.');
    }
  };

  const handleAppend = (sym) => {
    setMorseInput(prev => prev + sym);
  };

  const handleClear = () => {
    setMorseInput('');
    setActiveTokenIdx(null);
    setHoveredTokenIdx(null);
  };

  const sampleCodes = [
    { label: 'HOLA MUNDO', morse: '.... --- .-.. .- / -- ..- -. -.. ---' },
    { label: 'S.O.S. AUXILIO', morse: '... --- ... / .- ..- -..- .. .-.. .. ---' },
    { label: 'TE AMO', morse: '- . / .- -- ---' },
    { label: 'RADIO CW CQ', morse: '-.-. --.- / -.-. --.- / -.. . / -..- . .----' }
  ];

  const faqs = [
    {
      q: '¿Por qué el decodificador necesita espacios obligatorios entre letras?',
      a: 'El código Morse no es un código de longitud fija. Una letra puede estar formada por un solo dit ("E" = .) o por hasta cuatro o cinco elementos ("B" = -..., "0" = -----). Si los puntos y rayas se escriben sin pausas ("...---..."), la secuencia podría interpretarse como SOS, pero también como E E E T T T E E E, o V M B. El decodificador requiere espacios para determinar con exactitud los límites de cada carácter.'
    },
    {
      q: '¿Qué significan los caracteres con signo de interrogación [?] en el resultado?',
      a: 'Un signo de interrogación rojo en el texto descifrado indica que la secuencia de puntos y rayas ingresada no corresponde a ninguna letra, número ni signo del estándar internacional ITU-R M.1677-1. Verifica si olvidaste un espacio entre dos letras consecutivas o si cometiste un error tipográfico.'
    },
    {
      q: '¿Cómo identifica el decodificador el cambio de palabra?',
      a: 'El estándar de telegrafía define que entre palabras debe haber una pausa de 7 unidades elementales de tiempo. En texto escrito, esto se representa convencionalmente mediante una barra inclinada "/" rodeada de espacios (" / ") o mediante tres espacios consecutivos. El decodificador reconoce ambos formatos e inserta un espacio normal en el texto en español resultante.'
    },
    {
      q: '¿Se decodifica la letra Ñ española si está en el texto?',
      a: 'Sí. El decodificador reconoce la extensión regional española "--.--" y la traduce directamente a la letra Ñ. Si el código ingresado utiliza la convención de normalización internacional N ("-."), se mostrará como N.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Decodificador de Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Decodificador de Código Morse: Descifra Puntos y Rayas en Línea
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Descifra código Morse a texto legible al instante. Inspecciona los espacios entre letras, analiza errores sintácticos en tiempo real y escucha la señal sonora verificada.
        </p>
      </div>

      {/* Main Decoder Interface */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        {/* Top Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Muestras rápidas:</span>
            {sampleCodes.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setMorseInput(s.morse)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Settings size={14} />
              <span>{showAudioSettings ? 'Ocultar Ajustes' : 'Ajustes de Sonido'}</span>
            </button>
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={14} /> Limpiar
            </button>
          </div>
        </div>

        {/* Collapsible Audio Settings */}
        {showAudioSettings && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Velocidad WPM: <strong>{wpm}</strong>
              </label>
              <input
                type="range"
                min="5"
                max="45"
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Tono (Hz): <strong>{frequency} Hz</strong>
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

        {/* Morse Input Textarea */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Entrada de código Morse (separa letras con espacio y palabras con barra /):
          </label>
          <textarea
            ref={inputRef}
            value={morseInput}
            onChange={(e) => setMorseInput(e.target.value)}
            placeholder="Introduce puntos (.) y rayas (-) separados por espacios..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              letterSpacing: '1px',
              resize: 'vertical'
            }}
          />

          {/* Keypad Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Botones de inserción:</span>
            {[
              { label: 'Punto (.)', sym: '.' },
              { label: 'Raya (-)', sym: '-' },
              { label: 'Espacio', sym: ' ' },
              { label: 'Barra (/ )', sym: ' / ' }
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleAppend(btn.sym)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', fontFamily: 'monospace' }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Validation & Warning Notice */}
        {decodedResult.invalidCount > 0 && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger, #ef4444)' }}>
            <AlertTriangle size={18} />
            <span style={{ fontSize: '0.875rem' }}>
              Se detectaron {decodedResult.invalidCount} secuencias Morse no reconocidas. Comprueba si falta un espacio entre dos letras.
            </span>
          </div>
        )}

        {/* Decoded Output Display */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Texto descifrado en español:
            </label>
            <button
              onClick={handleCopyText}
              disabled={!decodedResult.plainText}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {copiedSuccess ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
              <span>{copiedSuccess ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              minHeight: '80px',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: decodedResult.plainText ? 'var(--text-primary)' : 'var(--text-muted)',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}
          >
            {decodedResult.plainText || 'El texto descifrado aparecerá aquí...'}
          </div>
        </div>

        {/* Synchronized Token Inspector */}
        {decodedResult.tokens && decodedResult.tokens.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Inspector de señales Morse por token (pasa el cursor para ver el carácter):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '160px', overflowY: 'auto', padding: '0.65rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)' }}>
              {decodedResult.tokens.map((token, idx) => {
                const isPlayback = playbackTokenIdx === idx;
                const isHovered = hoveredTokenIdx === idx;
                const isInvalid = token.isInvalid;

                if (token.type === 'word_gap') {
                  return (
                    <div key={idx} style={{ padding: '0.2rem 0.4rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                      /
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredTokenIdx(idx)}
                    onMouseLeave={() => setHoveredTokenIdx(null)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-xs, 4px)',
                      border: isPlayback
                        ? '1px solid var(--accent-primary)'
                        : isInvalid
                          ? '1px solid var(--danger, #ef4444)'
                          : isHovered
                            ? '1px solid var(--text-primary)'
                            : '1px solid var(--border-color)',
                      backgroundColor: isPlayback
                        ? 'rgba(59, 130, 246, 0.3)'
                        : isInvalid
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isInvalid ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {token.resolvedChar || '?'}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                      {token.raw}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!decodedResult.plainText}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
              >
                <Play size={16} />
                <span>Escuchar Señal Morse</span>
              </button>
            ) : (
              <button
                onClick={handleStopAudio}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--danger)' }}
              >
                <Square size={16} />
                <span>Detener Audio</span>
              </button>
            )}

            <button
              onClick={handleDownloadWav}
              disabled={!decodedResult.plainText}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Download size={16} />
              <span>Descargar WAV</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Palabras: <strong>{stats.wordCount}</strong> • Letras: <strong>{stats.characterCount}</strong>
          </div>
        </div>
      </div>

      {/* Comprehensive Educational Sections (Full Parity with English) */}
      <article className="seo-article-container" style={{ marginTop: '3.5rem' }}>
        <div className="article-body-content">

          {/* CÓMO DESCIFRAR CÓDIGO MORSE A TEXTO */}
          <section className="content-section">
            <h2>Cómo Descifrar Código Morse a Texto Legible</h2>
            <p>
              Un decodificador de código Morse transforma secuencias de pulsos acústicos o gráficos formados por puntos (<code>.</code>) y rayas (<code>-</code>) en texto inteligible. Por ejemplo, la secuencia <code className="morse-font">.... . .-.. .-.. ---</code> se descifra de inmediato como <strong>HELLO</strong> o <strong>HOLA</strong> en función de los caracteres individuales enviados.
            </p>
            <p>
              En mensajes extensos que constan de varias palabras, se utiliza la barra inclinada <code>/</code> como delimitador formal de separación entre palabras. Así, <code className="morse-font">.... --- .-.. .- / -- ..- -. -.. ---</code> se traduce inequívocamente como <strong>HOLA MUNDO</strong>.
            </p>
            <p>
              El motor de decodificación compara cada segmento de puntos y rayas contra la tabla oficial del Código Morse Internacional definida por la Unión Internacional de Telecomunicaciones (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer">Recomendación ITU-R M.1677-1 <ExternalLink size={12} /></a>), garantizando que las letras, números, signos de puntuación y la letra <strong>Ñ</strong> (<code className="morse-font">--.--</code>) se resuelvan con fidelidad absoluta.
            </p>
          </section>

          {/* GUÍA PASO A PASO: USO DEL DECODIFICADOR */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Guía de Uso del Decodificador de Código Morse</h2>
            <ol className="content-list" style={{ lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li><strong>Pega o introduce tu código Morse:</strong> Utiliza puntos (<code>.</code>) para los dits y guiones o rayas (<code>-</code>) para los dahs.</li>
              <li><strong>Separa cada letra con un espacio:</strong> Es imprescindible colocar un espacio entre los códigos de letras consecutivas (ejemplo: <code>.- -...</code> para AB).</li>
              <li><strong>Usa la barra <code>/</code> entre palabras:</strong> Para marcar la pausa de siete unidades entre dos palabras distintas, introduce una barra rodeada de espacios (ejemplo: <code>... / ---</code>).</li>
              <li><strong>Inspecciona el resultado en tiempo real:</strong> Nuestro motor analiza sintácticamente cada carácter mientras escribes, resaltando con marcas rojas cualquier secuencia no reconocida.</li>
              <li><strong>Escucha la verificación acústica:</strong> Haz clic en cualquier ficha de letra individual para comprobar su ritmo sonoro o pulsa "Reproducir Sonido" para escuchar la frase completa sintetizada con Web Audio API.</li>
            </ol>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>Ejemplo SOS</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Entrada: <code className="morse-font">... --- ...</code><br />
                  Resultado descifrado: <strong>SOS</strong> (Tres letras independientes)
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>Ejemplo CÓDIGO MORSE</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Entrada: <code className="morse-font">-.-. --- -.. .. --. --- / -- --- .-. ... .</code><br />
                  Resultado descifrado: <strong>CODIGO MORSE</strong>
                </p>
              </div>
            </div>
          </section>

          {/* CÓMO FUNCIONA EL PROCESO DE DECODIFICACIÓN INTERNO */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Funciona el Proceso de Decodificación Paso a Paso</h2>
            <p>
              El proceso algorítmico de descifrado sigue tres fases estructuradas:
            </p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>
              1. Segmentación Léxica de la Cadena
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              El analizador divide el texto de entrada tomando la barra inclinada <code>/</code> o los saltos de línea como separadores de palabras. A continuación, divide cada palabra por sus espacios en blanco simples, aislando los elementos que forman cada carácter individual.
            </p>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>
              2. Búsqueda y Emparejamiento en el Diccionario Inverso
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Cada secuencia de puntos y rayas se compara en una tabla hash de búsqueda de tiempo constante O(1) con el estándar ITU-R M.1677-1 y las extensiones en español:
            </p>

            <div className="table-responsive" style={{ marginTop: '0.75rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Patrón Morse</th>
                    <th>Carácter Resuelto</th>
                    <th>Tipo de Carácter</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><code className="morse-font">.</code></td><td>E</td><td>Letra simple (1 punto)</td></tr>
                  <tr><td><code className="morse-font">-</code></td><td>T</td><td>Letra simple (1 raya)</td></tr>
                  <tr><td><code className="morse-font">.-</code></td><td>A</td><td>Letra básica</td></tr>
                  <tr><td><code className="morse-font">-...</code></td><td>B</td><td>Letra básica</td></tr>
                  <tr><td><code className="morse-font">--.--</code></td><td>Ñ</td><td>Extensión española oficial</td></tr>
                  <tr><td><code className="morse-font">...</code></td><td>S</td><td>Letra corta (3 puntos)</td></tr>
                  <tr><td><code className="morse-font">---</code></td><td>O</td><td>Letra corta (3 rayas)</td></tr>
                  <tr><td><code className="morse-font">-----</code></td><td>0</td><td>Número (5 rayas)</td></tr>
                  <tr><td><code className="morse-font">.----</code></td><td>1</td><td>Número (5 elementos)</td></tr>
                  <tr><td><code className="morse-font">.-.-.-</code></td><td>.</td><td>Signo de puntuación (Punto)</td></tr>
                  <tr><td><code className="morse-font">..--..</code></td><td>?</td><td>Signo de interrogación</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '1.25rem', marginBottom: '0.4rem' }}>
              3. Ensamblado del Mensaje y Detección de Errores
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Las letras resueltas se ensamblan respetando los espacios inter-palabra. Si una secuencia de pulsos no existe en el estándar (por ejemplo, <code>......</code> o <code>---.-</code>), el motor la marca con un carácter de advertencia visual para que el usuario pueda corregirla sin perder el resto del mensaje.
            </p>
          </section>

          {/* POR QUÉ EL ESPACIADO ES CRÍTICO EN MORSE */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Por Qué el Espaciado Temporal Define la Decodificación</h2>
            <p>
              El código Morse no es un código de longitud fija como el ASCII binario de 8 bits. Un carácter puede durar desde 1 unidad de tiempo (E = <code>.</code>) hasta 15 unidades de tiempo (0 = <code>-----</code>). Por esta razón, el silencio es tan informativo como el propio sonido:
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Elemento Acústico o Silencio</th>
                    <th style={{ textAlign: 'right', width: '150px' }}>Duración Estándar</th>
                    <th>Función de Delimitación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Punto (dit)</td><td style={{ textAlign: 'right' }}><strong>1 unidad</strong></td><td>Pulso sonoro corto básico</td></tr>
                  <tr><td>Raya (dah)</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td><td>Pulso sonoro sostenido (3 dits)</td></tr>
                  <tr><td>Pausa intra-carácter</td><td style={{ textAlign: 'right' }}><strong>1 unidad</strong></td><td>Silencio entre puntos/rayas de una letra</td></tr>
                  <tr><td>Pausa inter-letra</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td><td>Silencio entre letras dentro de una palabra</td></tr>
                  <tr><td>Pausa inter-palabra</td><td style={{ textAlign: 'right' }}><strong>7 unidades</strong></td><td>Silencio entre palabras (representado por <code>/</code>)</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>El Problema Clásico de la Falta de Espacios</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Considera la secuencia continua <code className="morse-font">..</code>: si no hay espacio, representa la letra <strong>I</strong>. Pero si hay un espacio inter-letra (<code className="morse-font">. .</code>), representa dos letras <strong>E E</strong>. De forma análoga, <code className="morse-font">--</code> es <strong>M</strong>, mientras que <code className="morse-font">- -</code> son dos <strong>T T</strong>. Sin los espacios reglamentarios, el texto se vuelve geométricamente ambiguo.
              </p>
            </div>
          </section>

          {/* CÓMO RESOLVER CÓDIGO MORSE SIN ESPACIOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Descifrar Código Morse sin Espacios: Resolución de Ambigüedades</h2>
            <p>
              Cuando una persona recibe un mensaje sin espacios (por ejemplo, procedente de una película, un juego de rol o un enigma visual), se enfrenta a una cadena de opciones combinatorias múltiples.
            </p>
            <p>
              Por ejemplo, la cadena <code className="morse-font">...---...</code> se reconoce instantáneamente en todo el planeta como <strong>SOS</strong> porque es el prosign universal de socorro. Sin embargo, matemáticamente esa misma secuencia continua podría descomponerse como:
            </p>
            <ul className="content-list" style={{ fontSize: '0.9rem' }}>
              <li><code>...</code> + <code>---</code> + <code>...</code> = <strong>S O S</strong> (3 letras)</li>
              <li><code>.</code> + <code>..</code> + <code>---</code> + <code>...</code> = <strong>E I O S</strong> (4 letras)</li>
              <li><code>...-</code> + <code>--</code> + <code>...</code> = <strong>V M S</strong> (3 letras)</li>
              <li><code>...</code> + <code>---</code> + <code>.</code> + <code>..</code> = <strong>S O E I</strong> (4 letras)</li>
            </ul>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Para resolver enigmas sin espacios, el método consiste en introducir espacios estratégicos agrupando de 1 a 4 elementos por letra y comprobando qué combinación forma palabras válidas en español o inglés en el contexto de la frase.
            </p>
          </section>

          {/* TABLA DE EJEMPLOS COMUNES */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Ejemplos Comunes de Decodificación</h2>
            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Frase / Palabra</th>
                    <th>Patrón Morse Decodificable</th>
                    <th>Notas Operativas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>SOS</strong></td><td><code className="morse-font">... --- ...</code></td><td>Señal de socorro internacional</td></tr>
                  <tr><td><strong>HOLA</strong></td><td><code className="morse-font">.... --- .-.. .-</code></td><td>Saludo estándar de 4 letras</td></tr>
                  <tr><td><strong>HOLA MUNDO</strong></td><td><code className="morse-font">.... --- .-.. .- / -- ..- -. -.. ---</code></td><td>Frase de dos palabras con separador <code>/</code></td></tr>
                  <tr><td><strong>TE AMO</strong></td><td><code className="morse-font">- . / .- -- ---</code></td><td>Mensaje romántico popular en regalos y grabados</td></tr>
                  <tr><td><strong>73</strong></td><td><code className="morse-font">--... ...--</code></td><td>Saludos cordiales en jerga de radioafición</td></tr>
                  <tr><td><strong>CQ CQ CQ</strong></td><td><code className="morse-font">-.-. --.- / -.-. --.- / -.-. --.-</code></td><td>Llamada general de radioafición en telegrafía</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* DECODIFICADOR VS CODIFICADOR VS SEPARADOR */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Diferencias entre Decodificador, Codificador y Separador</h2>
            <ul className="content-list" style={{ lineHeight: 1.8 }}>
              <li><strong>Decodificador de Morse (esta herramienta):</strong> Convierte puntos y rayas entrantes en texto comprensible (<code className="morse-font">.... --- .-.. .-</code> → <strong>HOLA</strong>).</li>
              <li><strong>Codificador o Traductor a Morse:</strong> Convierte texto en español o inglés a secuencias de puntos y rayas con audio (<strong>HOLA</strong> → <code className="morse-font">.... --- .-.. .-</code>).</li>
              <li><strong>Separador de Palabras:</strong> Utiliza la barra <code>/</code> o pausas prolongadas de 7 unidades para evitar que las palabras se mezclen entre sí.</li>
            </ul>
          </section>

          {/* Cross-linking cards */}
          <section style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Decodificador desde Imagen
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Descifra código Morse visual directamente desde fotos, tatuajes o capturas con procesamiento OCR local.
                </p>
                <a
                  href="/es/morse-code-image-decoder/"
                  onClick={(e) => handleNav(e, 'es-imagedecoder', '/es/morse-code-image-decoder/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Decodificar imagen</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Cómo Leer Código Morse
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Guía completa con árbol dicotómico y ejercicios para leer código Morse por vista y por oído sin titubear.
                </p>
                <a
                  href="/es/how-to-read-morse-code/"
                  onClick={(e) => handleNav(e, 'es-howtoread', '/es/how-to-read-morse-code/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ver guía de lectura</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Alfabeto Morse A–Z y Ñ
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Consulta la tabla completa de 26 letras latinas, la letra Ñ y escucha el sonido de cada carácter individual.
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
            </div>
          </section>

          {/* Frequently Asked Questions (Comprehensive 10+ Questions) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Preguntas Frecuentes sobre el Decodificador Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: '¿Qué es un decodificador de código Morse?',
                  a: 'Un decodificador de código Morse es una herramienta especializada que convierte secuencias de puntos y rayas en texto legible (letras, números y signos de puntuación) de acuerdo con los estándares internacionales de telecomunicación.'
                },
                {
                  q: '¿Cómo descifro código Morse a texto?',
                  a: 'Introduce la secuencia de puntos (.) y rayas (-), asegurándote de separar cada letra con un espacio en blanco y cada palabra con una barra inclinada (/). La herramienta resolverá automáticamente cada combinación.'
                },
                {
                  q: '¿Por qué mi código Morse no se decodifica correctamente?',
                  a: 'La causa más habitual es la ausencia de espacios entre letras. Si escribes puntos y rayas consecutivos sin espacios, el sistema no puede determinar dónde termina un carácter y dónde empieza el siguiente. También verifica que no haya caracteres extraños o símbolos no admitidos.'
                },
                {
                  q: '¿Es obligatorio poner espacios entre las letras en Morse?',
                  a: 'Sí. Para una decodificación precisa en texto escrito, los espacios son imprescindibles. Sin ellos, secuencias idénticas pueden tener múltiples interpretaciones válidas (por ejemplo, .. puede ser I o dos letras E E).'
                },
                {
                  q: '¿Qué símbolo debo utilizar para separar palabras?',
                  a: 'La convención telegráfica estándar para texto escrito es la barra inclinada rodeada de espacios (" / "). También puedes emplear tres espacios consecutivos.'
                },
                {
                  q: '¿Puede el decodificador leer números y signos de puntuación?',
                  a: 'Sí. Reconoce los números del 0 al 9 (todos de 5 elementos), signos como punto (.-.-.-), coma (--..--), interrogación (..--..), arroba (.--.-.) y la letra Ñ (--.--).'
                },
                {
                  q: '¿Qué significa un signo de interrogación rojo [?] en el resultado?',
                  a: 'Indica que una combinación concreta de puntos y rayas no existe en la norma internacional ITU-R M.1677-1. Revisa si olvidaste un espacio o si cometiste un error de pulsación.'
                },
                {
                  q: '¿Se transmiten mis datos a algún servidor externo?',
                  a: 'No. Toda la decodificación se ejecuta al 100% en el navegador del usuario mediante JavaScript del lado del cliente, garantizando absoluta privacidad y confidencialidad.'
                },
                {
                  q: '¿Puedo descargar un archivo de audio con el código descifrado?',
                  a: 'Sí. Nuestro decodificador incluye la opción de exportar el audio correspondiente a un archivo WAV sin compresión, generado localmente a través de Web Audio API.'
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
              Decodificación Confiable y Verificación de Código Morse
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Un decodificador de código Morse de calidad no solo produce un texto, sino que te explica por qué se obtuvo cada resultado. Si deseas convertir texto en español a código Morse con controles de sonido avanzados, visita nuestro traductor principal.
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
                <span>Consultar Alfabeto Morse</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
