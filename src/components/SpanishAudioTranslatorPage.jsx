import React, { useState, useMemo } from 'react';
import {
  Volume2, Play, Square, Download, Copy, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, Sliders, Music, HelpCircle, Headphones, Mic, Radio, Check, Repeat
} from 'lucide-react';
import { translateSpanishToMorse, getSpanishCharacterBreakdown } from '../engine/spanishMorse.js';
import { audioEngine } from '../engine/audioEngine.js';
import { SpanishAudioDecoderModule } from './SpanishAudioDecoderModule.jsx';

export function SpanishAudioTranslatorPage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast,
  setActiveTab
}) {
  const [inputText, setInputText] = useState('CQ CQ CQ DE XE1');
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { morseCode } = useMemo(() => {
    if (!inputText.trim()) return { morseCode: '' };
    const res = translateSpanishToMorse(inputText, 'standard');
    return { morseCode: res.morseText };
  }, [inputText]);

  const breakdown = useMemo(() => {
    if (!inputText.trim()) return [];
    return getSpanishCharacterBreakdown(inputText, 'standard');
  }, [inputText]);

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      isLooping,
      onProgress: ({ isEnded }) => {
        if (isEnded && !isLooping) setIsPlaying(false);
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleDownloadWav = () => {
    if (!morseCode) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: morseCode, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audio-morse-${wpm}wpm-${frequency}hz.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Archivo de audio WAV descargado ✓');
    } catch {
      if (showToast) showToast('Error al generar archivo WAV.');
    }
  };

  const handleCopyMorse = async () => {
    if (!morseCode) return;
    try {
      await navigator.clipboard.writeText(morseCode);
      setCopied(true);
      if (showToast) showToast('Código Morse copiado al portapapeles ✓');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (showToast) showToast('Error al copiar al portapapeles.');
    }
  };

  const faqs = [
    {
      q: '¿Cuál es la diferencia entre generar audio Morse y decodificar audio de micrófono?',
      a: 'Generar audio es un proceso de síntesis: el texto se convierte en código Morse y la Web Audio API sintetiza ondas senoidales puras a la frecuencia y velocidad deseadas. Decodificar audio por micrófono es un proceso de reconocimiento acústico: analiza el sonido ambiental, aísla el tono de telegrafía con un filtro pasabanda, mide la duración de los pulsos y extrae el texto original.'
    },
    {
      q: '¿Qué frecuencia de tono (Hz) es la más recomendada para escuchar código Morse?',
      a: 'La mayoría de los radioaficionados y telegrafistas profesionales utilizan frecuencias de tono entre 500 Hz y 700 Hz (siendo 600 Hz o 700 Hz el estándar más habitual). Estos tonos medios reducen la fatiga auditiva durante sesiones prolongadas y coinciden con la zona de máxima sensibilidad del oído humano.'
    },
    {
      q: '¿Cómo funciona la separación Farnsworth en el audio?',
      a: 'El método Farnsworth mantiene la velocidad de los puntos y rayas individuales a un ritmo alto (por ejemplo, 20 WPM), pero amplía el espacio de silencio entre letras consecutivas (por ejemplo, equivalente a 12 WPM). Esto ayuda a que el oído reconozca el "ritmo musical" de cada letra sin que el principiante se sienta abrumado por la velocidad del flujo de texto.'
    },
    {
      q: '¿El archivo WAV generado es compatible con dispositivos móviles y reproductores?',
      a: 'Sí. El archivo de audio WAV se codifica en formato PCM estándar de 44.1 kHz, compatible universalmente con reproductores de Windows, Mac, iOS, Android, software de edición de audio y transceptores de radio.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Traductor de Audio en Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Traductor de Audio Morse: Generador de Sonido y Reproductor CW
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Convierte texto y código Morse a audio con tono (Hz) y velocidad (WPM) personalizables. Escucha la señal sintetizada, descárgala en formato WAV o decodifica tonos en vivo mediante micrófono.
        </p>
      </div>

      {/* Section 1: Audio Synthesizer Tool */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Music size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Generador de Audio y Sintetizador de Tonos Morse
          </h2>
        </div>

        {/* Text Input */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Texto a sintetizar en audio:
          </label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Introduce texto para generar audio Morse..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'rgba(0,0,0,0.25)',
              color: 'var(--text-primary)',
              fontSize: '1.1rem',
              fontWeight: 700
            }}
          />
        </div>

        {/* Morse Code Result Display */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Código Morse resultante:
            </span>
            <button
              onClick={handleCopyMorse}
              disabled={!morseCode}
              className="btn btn-secondary"
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontFamily: 'monospace',
              fontSize: '1.15rem',
              letterSpacing: '1px',
              color: 'var(--accent-primary)',
              minHeight: '42px',
              wordBreak: 'break-word'
            }}
          >
            {morseCode || 'Escribe texto para generar código Morse...'}
          </div>
        </div>

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>Velocidad (WPM):</span>
              <strong style={{ color: 'var(--text-primary)' }}>{wpm}</strong>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={wpm}
              onChange={(e) => {
                setWpm(Number(e.target.value));
                if (farnsworthWpm > Number(e.target.value)) setFarnsworthWpm(Number(e.target.value));
              }}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>Espaciado Farnsworth:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{farnsworthWpm} WPM</strong>
            </div>
            <input
              type="range"
              min="5"
              max={wpm}
              value={farnsworthWpm}
              onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>Frecuencia del tono:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{frequency} Hz</strong>
            </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              <span>Volumen:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{Math.round(volume * 100)}%</strong>
            </div>
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

        {/* Playback Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!morseCode}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
              >
                <Play size={16} />
                <span>Reproducir Señal Morse</span>
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
              onClick={() => setIsLooping(!isLooping)}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                backgroundColor: isLooping ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                borderColor: isLooping ? 'var(--accent-primary)' : 'var(--border-color)'
              }}
            >
              <Repeat size={16} />
              <span>{isLooping ? 'Bucle activado' : 'Repetir en bucle'}</span>
            </button>

            <button
              onClick={handleDownloadWav}
              disabled={!morseCode}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
            >
              <Download size={16} />
              <span>Descargar WAV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Audio Decoder Module (Microphone Listening) */}
      <SpanishAudioDecoderModule showToast={showToast} />

      {/* Educational Article Section */}
      <section className="article-section" style={{ marginTop: '3.5rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Fundamentos del Sonido en Código Morse: Tono, Ritmo y PARIS
        </h2>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          La recepción de telegrafía Morse en comunicaciones reales no se realiza por medios visuales, sino puramente a través del oído como señales continuas de radio CW (Continuous Wave). Dominar los aspectos acústicos de la señal es fundamental para una decodificación fluida.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
          El Estándar PARIS para el Cálculo de Velocidad (WPM)
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          La velocidad en código Morse se mide en <strong>Palabras Por Minuto (WPM)</strong>. Dado que distintas palabras tienen longitudes diferentes, el estándar internacional adopta la palabra <code>PARIS</code> como referencia métrica absoluta:
        </p>
        <div className="glass-panel" style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          P (14) + A (8) + R (10) + I (8) + S (10) = 50 unidades elementales de tiempo
        </div>
        <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          A 20 WPM, un operador transmite 20 palabras PARIS en 60 segundos (1,000 unidades de tiempo en 60,000 milisegundos), lo que fija la duración exacta de 1 punto (dit) en <strong>60 milisegundos</strong>.
        </p>

        {/* Cross-linking cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Entrenador de Práctica Auditiva
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Practica drills de audio progresivos para reconocer letras y palabras al oído sin traducir mentalmente.
            </p>
            <a
              href="/es/morse-code-practice/"
              onClick={(e) => handleNav(e, 'es-practice', '/es/morse-code-practice/')}
              style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Ir a la práctica de audio</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Manipulador Telegráfico
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Prueba la generación manual de tonos con llave telegráfica virtual interactiva.
            </p>
            <a
              href="/es/morse-code-keyer/"
              onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')}
              style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Abrir manipulador</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Radioafición CW
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Descubre cómo se aplican los tonos de audio en comunicaciones reales de onda continua (CW).
            </p>
            <a
              href="/es/morse-code-amateur-radio/"
              onClick={(e) => handleNav(e, 'es-amateurradio', '/es/morse-code-amateur-radio/')}
              style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>Ver guía de radio CW</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Preguntas Frecuentes sobre el Traductor de Audio Morse
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
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
                  <span>{faq.q}</span>
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
    </div>
  );
}
