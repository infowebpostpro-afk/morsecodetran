import React, { useState, useMemo } from 'react';
import {
  Volume2, Copy, Play, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  HelpCircle, Download, Square, X, Check, Share2, Sparkles, AlertTriangle, BookOpen, Layers
} from 'lucide-react';
import { translateMorseToSpanish, getSpanishCharacterBreakdown } from '../engine/spanishMorse.js';
import { normalizeMorseInput, calculateStatistics } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';

export function SpanishMorseToEnglishPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [morseInput, setMorseInput] = useState('.... --- .-.. .- / -- ..- -. -.. ---');
  const [charMode, setCharMode] = useState('standard'); // 'standard' (ITU) | 'extended' (Spanish Ñ)
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedType, setCopiedType] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Normalizar entrada Morse
  const normalizedMorse = useMemo(() => normalizeMorseInput(morseInput), [morseInput]);

  // Decodificar a texto en español
  const spanishOutput = useMemo(() => {
    if (!normalizedMorse.trim()) return '';
    return translateMorseToSpanish(normalizedMorse, charMode);
  }, [normalizedMorse, charMode]);

  // Desglose de caracteres para reproducción de audio
  const breakdown = useMemo(() => {
    if (!normalizedMorse.trim() || !spanishOutput) return [];
    return getSpanishCharacterBreakdown(spanishOutput, charMode);
  }, [spanishOutput, normalizedMorse, charMode]);

  const stats = useMemo(() => {
    return calculateStatistics(spanishOutput, normalizedMorse, wpm, wpm);
  }, [spanishOutput, normalizedMorse, wpm]);

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Código Morse' : 'Texto en español'} copiado con éxito ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  const handleDownloadWav = () => {
    if (!normalizedMorse) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: normalizedMorse, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `morse-audio-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Archivo de audio WAV descargado ✓');
    } catch {
      if (showToast) showToast('Error al generar archivo WAV.');
    }
  };

  const handleAppendSymbol = (sym) => {
    setMorseInput(prev => prev + sym);
  };

  const handleClear = () => {
    setMorseInput('');
  };

  const examples = [
    { label: 'HOLA', morse: '.... --- .-.. .-' },
    { label: 'HOLA MUNDO', morse: '.... --- .-.. .- / -- ..- -. -.. ---' },
    { label: 'SOS', morse: '... --- ...' },
    { label: 'TE AMO', morse: '- . / .- -- ---' },
    { label: 'BUENOS DIAS', morse: '-... ..- . -. --- ... / -.. .. .- ...' },
    { label: 'AÑO (con Ñ)', morse: '.- / --.-- / ---' }
  ];

  // Entradas del abecedario para la tabla didáctica
  const alphabetEntries = Object.entries(MORSE_CODE_MAP).filter(([_, data]) => data.type === 'letter');

  const faqs = [
    {
      q: "¿Cómo se traduce código Morse a texto o español?",
      a: "Pega o escribe los puntos y rayas en el decodificador. En Morse escrito, utiliza un espacio simple para separar las letras y una barra inclinada (/) o tres espacios para marcar la separación entre palabras. El decodificador identifica cada grupo de pulsos y lo empareja instantáneamente con su carácter alfabético correspondiente."
    },
    {
      q: "¿Qué significa .... . .-.. .-.. --- en código Morse?",
      a: "Significa HELLO (HOLA). Los cinco grupos representan: H (....), E (.), L (.-..), L (.-..) y O (---)."
    },
    {
      q: "¿Qué significa ... --- ...?",
      a: "Representa SOS, la señal internacional de socorro y emergencia en código Morse. En telegrafía real se emite de manera ininterrumpida como un único prosign continuo (...---...)."
    },
    {
      q: "¿Se puede decodificar código Morse sin espacios?",
      a: "No de forma fiable en todos los casos. El código Morse es un sistema de longitud variable (las letras tienen entre 1 y 4 elementos). Sin espacios delimitadores, una cadena como '...' puede significar 'S', pero también 'EEE', 'EI' o 'IE'. La ausencia de pausas genera millones de combinaciones ambiguas."
    },
    {
      q: "¿Qué significa la barra inclinada (/) en código Morse escrito?",
      a: "En el texto escrito, la barra diagonal (/) representa el espacio entre dos palabras diferentes (por ejemplo, .... --- .-.. .- / -- ..- -. -.. --- significa HOLA MUNDO). Es una notación visual conveniente que simboliza el silencio estándar de 7 unidades del éter radial."
    },
    {
      q: "¿Por qué mi traducción de código Morse arroja un resultado incorrecto?",
      a: "El 90% de los errores se deben al espaciado. Verifica: 1) Que exista un espacio entre cada letra. 2) Que no hayas insertado espacios por error dentro de una misma letra (por ejemplo, . . . . en lugar de ....). 3) Que no falten puntos ni sobren rayas. 4) Que los guiones largos (em-dash —) se hayan normalizado a guiones estándar (-)."
    },
    {
      q: "¿Se puede traducir código Morse a partir de un archivo de audio?",
      a: "Sí, pero requiere análisis espectral en el dominio del tiempo. Un decodificador de texto lee caracteres impresos, mientras que un decodificador de audio debe medir las duraciones exactas de tono y silencio mediante la Transformada Rápida de Fourier (FFT). Para procesar archivos de sonido, utiliza nuestro Traductor de Audio Morse."
    },
    {
      q: "¿Se puede traducir código Morse desde una fotografía o imagen?",
      a: "Sí, siempre que los puntos y rayas sean nítidos y contrastados. Nuestro Decodificador de Código Morse por Imágenes utiliza procesamiento visual por Canvas para identificar los segmentos de píxeles y transcribirlos automáticamente a texto."
    },
    {
      q: "¿El código Morse es un idioma independiente?",
      a: "No. El código Morse es un método de codificación de caracteres, no un idioma. No tiene gramática, sintaxis ni vocabulario propios; transcribe caracteres ortográficos de lenguas naturales existentes como español, inglés o francés."
    },
    {
      q: "¿El código Morse es idéntico en todos los países?",
      a: "El estándar mundial universal es el Código Morse Internacional, homologado por la recomendación UIT-R M.1677-1 de la Unión Internacional de Telecomunicaciones. Variantes históricas como el Morse Americano (de ferrocarriles) empleaban pausas internas diferentes."
    },
    {
      q: "¿Cuál es la diferencia entre un traductor Morse y un decodificador Morse?",
      a: "A menudo se usan como sinónimos. Estrictamente, un decodificador convierte señales Morse (puntos y rayas) a texto legible, mientras que un traductor suele operar de forma bidireccional: tanto de texto a Morse como de Morse a texto."
    },
    {
      q: "¿El decodificador puede traducir números en Morse?",
      a: "Sí. El estándar internacional define combinaciones exactas de 5 elementos para los números del 0 al 9 (por ejemplo, 1 = .----, 2 = ..---, 5 = ....., 0 = -----). Consulta nuestra página de Números en Código Morse para ver la tabla completa."
    },
    {
      q: "¿Cómo se representan los signos de puntuación en Morse?",
      a: "El código Morse internacional contempla signos de puntuación como el punto (.-.-.-), la coma (--..--), la interrogación (..--..) y la barra (-..-.). En español se omite el signo de apertura invertido (¿, ¡) y solo se transmite el de cierre."
    },
    {
      q: "¿Qué son los prosigns o señales de procedimiento?",
      a: "Son señales operativas formadas por dos o más letras emitidas sin pausas entre ellas, como <AR> (fin de mensaje: .-.-.) o <SK> (fin de transmisión: ...-.-). Se usan en radiotelegrafía marina y de aficionados para coordinar la frecuencia."
    },
    {
      q: "¿Por qué los silencios importan más que los puntos en Morse?",
      a: "Porque una variación en el silencio altera la estructura jerárquica del mensaje. Si unes los tres puntos de 'S' (...) con las tres rayas de 'O' (---) sin espacio, el receptor no sabrá si quisiste enviar una palabra o letras independientes. La cadencia temporal define el significado."
    },
    {
      q: "¿Se puede aprender código Morse utilizando este traductor?",
      a: "Sí. Una técnica de aprendizaje muy eficaz consiste en intentar descifrar el mensaje mentalmente primero y luego utilizar el decodificador para comprobar tu respuesta. Para un plan estructurado, visita nuestra Guía para Aprender Código Morse."
    },
    {
      q: "¿Qué normativa oficial rige este traductor?",
      a: "Se rige estrictamente por la Recomendación UIT-R M.1677-1 de la Unión Internacional de Telecomunicaciones, incorporando la extensión reglamentaria para la letra Ñ (--.--) del abecedario español."
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Migas de pan / Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Traductor de Morse a Texto</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Estándar Internacional Oficial UIT-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Traductor de Morse a Texto: Decodifica Código Morse al Instante
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '820px', margin: '0 auto', lineHeight: 1.6 }}>
          Pega o escribe puntos y rayas para descifrar código Morse a texto legible en español. Reproduce el audio sonoro en tiempo real, verifica el espaciado de letras y descarga la señal en audio WAV de alta fidelidad.
        </p>
      </div>

      {/* Herramienta Interactiva Principal */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        {/* Cabecera de controles de la herramienta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Juego de Caracteres:</span>
            <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.2)', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
              <button
                onClick={() => setCharMode('standard')}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  background: charMode === 'standard' ? 'var(--accent-primary)' : 'transparent',
                  color: charMode === 'standard' ? '#000000' : 'var(--text-secondary)'
                }}
              >
                Estándar UIT (A–Z)
              </button>
              <button
                onClick={() => setCharMode('extended')}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  background: charMode === 'extended' ? 'var(--accent-primary)' : 'transparent',
                  color: charMode === 'extended' ? '#000000' : 'var(--text-secondary)'
                }}
              >
                Español (Con letra Ñ)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={14} /> Limpiar
            </button>
          </div>
        </div>

        {/* Panel de Entrada (Morse) y Salida (Texto en Español) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Columna Entrada Morse */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Entrada en Código Morse:
              </label>
              <button
                onClick={() => handleCopy(morseInput, 'morse')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'morse' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'morse' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <textarea
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              placeholder="Introduce puntos y rayas separados por espacios (ej: .... --- .-.. .- / -- ..- -. -.. ---)..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: 'var(--accent-warning)',
                letterSpacing: '1px',
                resize: 'vertical'
              }}
            />
            {/* Botones de pulsación rápida */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleAppendSymbol('.')}
                style={{ flex: 1, padding: '0.4rem', fontWeight: 800, fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Añadir punto"
              >
                • Punto (.)
              </button>
              <button
                onClick={() => handleAppendSymbol('-')}
                style={{ flex: 1, padding: '0.4rem', fontWeight: 800, fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Añadir raya"
              >
                — Raya (-)
              </button>
              <button
                onClick={() => handleAppendSymbol(' ')}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Añadir espacio entre letras"
              >
                Espacio
              </button>
              <button
                onClick={() => handleAppendSymbol(' / ')}
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Añadir barra separadora de palabras"
              >
                / Palabra
              </button>
            </div>
          </div>

          {/* Columna Salida Texto */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Texto Decodificado en Español:
              </label>
              <button
                onClick={() => handleCopy(spanishOutput, 'text')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'text' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'text' ? 'Copiado' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={spanishOutput}
              placeholder="El texto decodificado aparecerá aquí automáticamente..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.15rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'var(--accent-primary)',
                resize: 'vertical'
              }}
            />
            {/* Estadísticas */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Caracteres: <strong>{spanishOutput.length}</strong></span>
              <span>Palabras: <strong>{spanishOutput.trim() ? spanishOutput.trim().split(/\s+/).length : 0}</strong></span>
              <span>Duración est.: <strong>{stats ? `${(stats.durationMs / 1000).toFixed(1)}s` : '0s'}</strong></span>
            </div>
          </div>
        </div>

        {/* Barra de Acciones y Reproducción */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!breakdown || breakdown.length === 0}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Play size={16} />
                <span>Escuchar en Morse</span>
              </button>
            ) : (
              <button
                onClick={handleStopAudio}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--accent-danger, #ef4444)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Square size={16} />
                <span>Detener Audio</span>
              </button>
            )}

            <button
              onClick={handleDownloadWav}
              disabled={!normalizedMorse}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <Download size={16} />
              <span>Descargar Audio WAV</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Velocidad: <strong>{wpm} WPM</strong> • Frecuencia: <strong>{frequency} Hz</strong>
          </div>
        </div>
      </div>

      {/* Ejemplos Predefinidos */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Ejemplos Comunes en Código Morse (Haz clic para cargar)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {examples.map((ex, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => setMorseInput(ex.morse)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid var(--border-color)'
              }}
              title="Haz clic para cargar este ejemplo en el decodificador"
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                {ex.label}
              </div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {ex.morse}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROFUNDIDAD EDITORIAL Y ARTÍCULOS COMPLETOS */}

      {/* 1. Respuesta Rápida: De Morse a Español */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Respuesta Rápida: Cómo Traducir Código Morse a Texto
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Para traducir código Morse a español, cada grupo discreto de puntos y rayas se compara con su correspondiente letra en el abecedario internacional:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'monospace', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><code>....</code> = H</li>
          <li><code>---</code> = O</li>
          <li><code>.-..</code> = L</li>
          <li><code>.-</code> = A</li>
        </ul>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.75rem' }}>
          Por consiguiente: <code style={{ color: 'var(--accent-warning)', fontFamily: 'monospace', letterSpacing: '2px' }}>.... --- .-.. .-</code> se traduce como <strong>HOLA</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Para varias palabras, en Morse escrito se utiliza convencionalmente una barra inclinada <code>/</code> para marcar el salto de término:
        </p>
        <p style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: 'var(--accent-warning)', letterSpacing: '1px' }}>
          .... --- .-.. .- / -- ..- -. -.. --- ➔ <strong>HOLA MUNDO</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          La clave radica en los espacios delimitadores: los puntos y rayas de una misma letra van juntos sin espacio; un espacio simple separa dos letras consecutivas; y la barra <code>/</code> separa palabras independientes.
        </p>
      </section>

      {/* 2. Tabla Didáctica A-Z + Ñ */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Tabla de Referencia de Letras en Código Morse (A–Z y Ñ)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Consulta el patrón de puntos y rayas, el ritmo acústico di-dah y el nombre fonético de cada letra:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Letra</th>
                <th style={{ padding: '0.85rem 1rem' }}>Código Morse</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ritmo Hablado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nombre Fonético ICAO</th>
              </tr>
            </thead>
            <tbody>
              {alphabetEntries.map(([char, data]) => (
                <tr key={char} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{char}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--accent-warning)' }}>{data.morse}</td>
                  <td style={{ padding: '0.85rem 1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{data.ditDah}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>{data.phonetic}</td>
                </tr>
              ))}
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(56, 189, 248, 0.04)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>Ñ</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--accent-warning)' }}>--.--</td>
                <td style={{ padding: '0.85rem 1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>dah-dah-di-dah-dah</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>Ñandú (Extensión Española)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Reglas de Temporización Universal */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Cómo Funciona el Espaciado Temporal en Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El código Morse se rige por la norma internacional <strong>ITU-R M.1677-1</strong>, basada en la duración matemática de una unidad elemental:
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Elemento o Intervalo de Silencio</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', textAlign: 'right' }}>Duración Estándar</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Punto (dit)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>1 unidad</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Raya (dah)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>3 unidades</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa intra-carácter (entre dits/dahs de 1 letra)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>1 unidad</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa entre letras consecutivas</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>3 unidades</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa entre palabras distintas</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>7 unidades</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          En el texto escrito, la pausa de 3 unidades se plasma como un espacio en blanco y la de 7 unidades como una barra inclinada <code>/</code>.
        </p>
      </section>

      {/* 4. Por Qué los Espacios Importan Más que los Puntos */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Por Qué los Espacios Importan Más que los Puntos
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Si omites un punto, alteras una sola letra. Pero si eliminas los espacios intermedios, <strong>destruyes la estructura completa del mensaje</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Considera la secuencia <code>...</code>: transmitida como un solo bloque representa la letra <strong>S</strong>. Pero si agregas espacios, <code>. . .</code> representa tres letras E independientes: <strong>E E E</strong>. Los puntos son idénticos; la agrupación temporal es la que determina el significado.
        </p>

        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-warning)', marginTop: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            El Caso Especial del Prosign SOS
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            La señal de socorro <code>...---...</code> es la única excepción reglamentaria: se emite deliberadamente de forma continua y unificada sin el espacio de 3 unidades entre caracteres para garantizar su reconocimiento inmediato en emergencias. En cualquier otro mensaje ordinario, los espacios entre caracteres son estrictamente obligatorios.
          </p>
        </div>
      </section>

      {/* 5. Ejemplo Práctico Desglosado Paso a Paso */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Ejemplo Práctico de Decodificación Paso a Paso
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Supongamos que recibes el siguiente mensaje en código Morse:
        </p>
        <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', color: 'var(--accent-warning)', letterSpacing: '1px', marginBottom: '1.25rem' }}>
          -.. .. .- / -... ..- . -. ---
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Primer paso: Identificar las dos palabras separadas por la barra <code>/</code>:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', margin: '0 0 0.5rem' }}>1. Primera Palabra: -.. .. .-</h4>
            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              -.. ➔ D | .. ➔ I | .- ➔ A<br />
              <strong>Resultado: DIA</strong>
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', margin: '0 0 0.5rem' }}>2. Segunda Palabra: -... ..- . -. ---</h4>
            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              -... ➔ B | ..- ➔ U | . ➔ E | -. ➔ N | --- ➔ O<br />
              <strong>Resultado: BUENO</strong>
            </p>
          </div>
        </div>

        <p style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Mensaje descifrado completo: <span style={{ color: 'var(--accent-primary)' }}>DIA BUENO</span>
        </p>
      </section>

      {/* 6. Decodificar Morse Visual (Tatuajes, Pulseras, Puzzles) */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Cómo Decodificar Código Morse Visual (Tatuajes, Pulseras y Puzzles)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El código Morse aparece con frecuencia en joyería artesanal, collares con cuentas redondas (puntos) y cilíndricas (rayas), tatuajes y salas de escape. Para transcribirlo con éxito, sigue esta metodología en 6 pasos:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
          <li><strong>Identifica el sentido de lectura:</strong> Por convención occidental, de izquierda a derecha o en el sentido de las agujas del reloj.</li>
          <li><strong>Distingue puntos y rayas:</strong> Las cuentas redondas o puntos cortos representan dits; las cuentas alargadas representan dahs.</li>
          <li><strong>Detecta los separadores de letras:</strong> Busca los nudos o cuentas de diferente color que señalan el espacio de 3 unidades entre caracteres.</li>
          <li><strong>Localiza el espacio de palabra:</strong> Si hay dos o más palabras, busca cuentas de separación más anchas (equivalentes a <code>/</code>).</li>
          <li><strong>Transcribe la secuencia:</strong> Escribe los caracteres en nuestro traductor con espacios simples entre letras.</li>
          <li><strong>Verificación inversa:</strong> Traduce el texto resultante de vuelta a Morse para confirmar que coincida al 100% con la pieza visual.</li>
        </ol>
      </section>

      {/* 7. Mensajes Cotidianos y Afectivos en Morse */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Mensajes Cotidianos y Afectivos Frecuentes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>TE AMO</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>- . / .- -- ---</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>TE EXTRAÑO</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>- . / . -..- - .-. .- --.-- ---</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>GRACIAS</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>--. .-. .- -.-. .. .- ...</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>BUENAS NOCHES</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>-... ..- . -. .- ... / -. --- -.-. .... . ...</code>
          </div>
        </div>
      </section>

      {/* 8. Preguntas Frecuentes (17 FAQs completas) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Preguntas Frecuentes sobre la Traducción de Morse a Texto
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
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
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
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

      {/* Enlaces y Conclusión */}
      <footer style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Explora Otras Herramientas de Código Morse
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convierte texto a Morse, decodifica archivos de audio o escanea fotos e imágenes al instante:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/es/english-to-morse-code/"
            onClick={(e) => handleNav(e, 'es-english2morse', '/es/english-to-morse-code/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Traductor de Texto a Morse <ArrowRight size={16} />
          </a>
          <a
            href="/es/alfabeto-codigo-morse/"
            onClick={(e) => handleNav(e, 'alphabet', '/es/alfabeto-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Tabla del Alfabeto Morse
          </a>
        </div>
      </footer>
    </div>
  );
}
