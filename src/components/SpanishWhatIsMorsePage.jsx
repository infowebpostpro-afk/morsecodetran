import React, { useState } from 'react';
import {
  HelpCircle, BookOpen, Clock, Activity, Zap, CheckCircle, ShieldCheck,
  ArrowRight, Play, Square, Volume2, Copy, Check, ExternalLink, Radio,
  ChevronDown, ChevronUp, AlertCircle, FileText, Sparkles, Compass, Lightbulb,
  Layers, Lock
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function SpanishWhatIsMorsePage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Reproducción de fragmentos de audio en Morse
  const handlePlayMorse = (id, textToPlay) => {
    audioEngine.stop();
    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setPlayingId(id);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingId(null);
      }
    });
  };

  // Copiado al portapapeles
  const handleCopy = (id, textToCopy, label = '¡Copiado al portapapeles!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Enrutamiento y navegación interna
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

  const sampleCharacters = [
    { char: 'E', code: '.', desc: 'Un solo punto (la señal más breve del código)' },
    { char: 'T', code: '-', desc: 'Una sola raya (3 unidades de tiempo)' },
    { char: 'A', code: '.-', desc: 'Punto-raya (di-dah)' },
    { char: 'S', code: '...', desc: 'Tres puntos (di-di-dit)' },
    { char: 'O', code: '---', desc: 'Tres rayas (dah-dah-dah)' },
    { char: 'SOS', code: '... --- ...', desc: 'Señal universal de socorro y auxilio' }
  ];

  const faqs = [
    {
      q: '¿Qué es el código Morse en palabras sencillas?',
      a: 'El código Morse es un método para representar letras, números y signos ortográficos mediante señales acústicas, ópticas o eléctricas cortas y largas, denominadas habitualmente puntos y rayas. Permite transmitir mensajes completos mediante encendido y apagado de una señal sin necesidad de cables de datos modernos.'
    },
    {
      q: '¿El código Morse es un idioma independiente?',
      a: 'No. El código Morse es un sistema de codificación de caracteres, no un idioma. Carece de vocabulario, gramática o sintaxis propios. Se limita a transcribir los caracteres de idiomas naturales (como español, inglés o francés) en un formato binario sonoro o visual.'
    },
    {
      q: '¿Quién inventó el código Morse?',
      a: 'Fue desarrollado en las décadas de 1830 y 1840 por el inventor y pintor Samuel F. B. Morse junto a su socio mecánico Alfred Vail. Aunque la patente llevó el nombre de Morse, los archivos históricos del Instituto Smithsonian acreditan a Alfred Vail el diseño del alfabeto telegráfico optimizado por frecuencias de imprenta y el perfeccionamiento del manipulador electroimán.'
    },
    {
      q: '¿Cómo funciona el código Morse y cuáles son sus proporciones?',
      a: 'El código Morse funciona según una proporción temporal fija estandarizada por la recomendación UIT-R M.1677-1: el punto dura 1 unidad, la raya dura exactamente 3 unidades, la pausa entre elementos de una misma letra es de 1 unidad, el espacio entre letras es de 3 unidades y el espacio entre palabras completas es de 7 unidades.'
    },
    {
      q: '¿Sigue utilizándose el código Morse en la actualidad?',
      a: 'Sí. Permanece en uso activo en radioafición (CW), radionavegación aeronáutica y marítima (radiobalizas VOR y NDB que transmiten identificadores en Morse), señalización de emergencia en defensa y rescate, y en aplicaciones de accesibilidad motriz para personas con discapacidad severa.'
    },
    {
      q: '¿Qué significa exactamente SOS en código Morse?',
      a: 'SOS se emite como "... --- ...". Es una señal internacional de socorro adoptada en 1906 en Berlín. Contrariamente a la creencia popular, no es un acrónimo de "Save Our Souls" ni de "Save Our Ship"; se eligió exclusivamente por su cadencia rítmica inconfundible y fácil de distinguir en condiciones de ruido extremo.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Navegación de migas de pan */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>¿Qué es el Código Morse?</span>
      </nav>

      {/* Cabecera y Título Principal */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <HelpCircle size={16} /> Guía de Referencia y Fundamentos Técnicos
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          ¿Qué es el Código Morse? Principios, Funcionamiento, Historia y Usos
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Guía exhaustiva para comprender los puntos, rayas, reglas matemáticas de temporización ITU, la historia de Samuel Morse y Alfred Vail, el mito de SOS y sus aplicaciones en el siglo XXI.
        </p>
      </header>

      {/* Cuadro de Respuesta Directa Ejecutiva (Featured Snippet) */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Respuesta Directa
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          El <strong>código Morse</strong> es un sistema de codificación que transforma caracteres de texto en secuencias de señales intermitentes breves y prolongadas, representadas universalmente como <strong>puntos (<code>.</code>) y rayas (<code>-</code>)</strong>. Un punto es una señal de corta duración y una raya dura exactamente tres veces más. Estas combinaciones codifican el abecedario, cifras numéricas, signos de puntuación y comandos telegráficos.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          Fue ideado paralelamente al telégrafo eléctrico en los decenios de 1830 y 1840 por Samuel Morse y Alfred Vail. Transformó para siempre las telecomunicaciones mundiales al permitir la transmisión instantánea de datos mediante impulsos electromagnéticos en lugar del transporte físico de cartas y mensajes.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Archivos del Instituto Smithsonian]
          </a>
        </p>
      </div>

      {/* Sección 1: ¿Qué es el Código Morse? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> ¿Qué es el Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          El código Morse es un <strong>sistema de codificación de longitud variable</strong> que convierte caracteres ortográficos en patrones acústicos, luminosos o eléctricos.
        </p>

        {/* Tabla de Matriz de Caracteres con Audio */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Carácter</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Representación Morse</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Descripción Sonora</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'right' }}>Audio Demostrativo</th>
              </tr>
            </thead>
            <tbody>
              {sampleCharacters.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: idx < sampleCharacters.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-input-subtle, rgba(255,255,255,0.02))' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.char}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.2rem', letterSpacing: '0.1em' }}>{item.code}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handlePlayMorse(`sample-${idx}`, item.char)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        background: playingId === `sample-${idx}` ? 'var(--accent-danger, #ef4444)' : 'rgba(59, 130, 246, 0.1)',
                        color: playingId === `sample-${idx}` ? '#ffffff' : 'var(--accent-primary)',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {playingId === `sample-${idx}` ? <Square size={13} /> : <Play size={13} />}
                      {playingId === `sample-${idx}` ? 'Detener' : 'Escuchar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          La misma secuencia puede transmitirse mediante múltiples canales físicos: como pitidos sonoros, clics telegráficos, destellos ópticos mediante linterna o heliógrafo, impulsos de corriente eléctrica sobre un par de hilos de cobre, o golpes mecánicos sobre una pared.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          El aspecto cardinal es que el código Morse no está atado a ningún dispositivo físico específico. Lo que transmite el mensaje es <strong>el patrón temporal y la relación proporcional de las duraciones</strong>.
        </p>
      </section>

      {/* Sección 2: ¿El Código Morse es un Idioma? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: 'var(--accent-primary)' }} /> ¿El Código Morse es un Idioma?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          No. <strong>El código Morse es un sistema de codificación, no una lengua ni un idioma.</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Una lengua natural posee su propio lexicón, morfología, gramática y sintaxis para generar significado. El código Morse carece de todo ello: simplemente mapea los caracteres de un idioma ya existente hacia una representación binaria en el dominio del tiempo.
        </p>

        {/* Tarjeta Demostrativa de HOLA */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ejemplo de Codificación en Español</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '1.25rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--text-primary)' }}>Español: <strong>HOLA</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>➔</span>
            <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>.... --- .-.. .-</span>
            <button
              onClick={() => handlePlayMorse('hola-demo', 'HOLA')}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                background: playingId === 'hola-demo' ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {playingId === 'hola-demo' ? <Square size={14} /> : <Play size={14} />}
              {playingId === 'hola-demo' ? 'Detener Audio' : 'Oír HOLA'}
            </button>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          La palabra "HOLA" conserva su significado, vocabulario y semántica en español; únicamente ha variado el vehículo físico empleado para transmitirla.
        </p>
      </section>

      {/* Sección 3: Cómo Funciona el Código Morse y Reglas de Temporización */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> ¿Cómo Funciona el Código Morse? (Reglas de Temporización UIT)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          El código descansa sobre dos elementos fundamentales de emisión:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>Punto (dit):</strong> El pulso elemental breve de referencia.</li>
          <li><strong>Raya (dah):</strong> Un pulso sostenido cuya duración equivale exactamente a tres puntos continuos.</li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Sin embargo, el Morse no consiste solo en sonidos activos. <strong>Los silencios y pausas entre elementos transmiten tanta información estructural como los tonos mismos.</strong>
        </p>

        {/* Rejilla de Proporciones UIT-R M.1677-1 */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Relaciones de Temporización Estándar según UIT-R M.1677-1
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Punto (dit)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unidad</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>La unidad base fundamental de tiempo.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Raya (dah)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Unidades</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Exactamente el triple de un punto.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pausa Intra-carácter</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unidad</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Silencio entre dits/dahs dentro de 1 letra.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pausa entre Caracteres</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Unidades</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Silencio entre letras consecutivas.</p>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Pausa entre Palabras</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>7 Unidades</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', margin: 0 }}>Silencio entre palabras independientes.</p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Estas proporciones cronométricas están ratificadas internacionalmente en el documento oficial{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            Recomendación UIT-R M.1677-1: Código Morse Internacional
          </a>
          , catalogada como normativa en vigor.
        </p>
      </section>

      {/* Sección 4: Cómo se Construye un Mensaje en Morse */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> ¿Cómo se Construye un Mensaje en Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Supongamos que deseas transmitir la palabra en español <strong>SOL</strong>. Cada letra se convierte a su patrón Morse correspondiente:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {[
            { l: 'S', m: '...' },
            { l: 'O', m: '---' },
            { l: 'L', m: '.-..' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.l}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '0.25rem' }}>{item.m}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          El mensaje codificado completo se presenta con espacios de 3 unidades entre caracteres:
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>
            ... --- .-..
          </span>
          <button
            onClick={() => handleCopy('sol-morse', '... --- .-..', '¡Código Morse de SOL copiado!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
          >
            {copiedId === 'sol-morse' ? <Check size={14} /> : <Copy size={14} />}
            {copiedId === 'sol-morse' ? '¡Copiado!' : 'Copiar Código'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Las pausas de 3 unidades permiten al operador receptor identificar inequívocamente el final de una letra y el inicio de la siguiente. Para separar palabras distintas, se emplea la pausa más prolongada de 7 unidades.
        </p>
      </section>

      {/* Sección 5: ¿Qué Significan "Dit" y "Dah"? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 style={{ color: 'var(--accent-primary)' }} /> ¿Qué Significan "Dit" y "Dah"?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>Dit</strong> y <strong>dah</strong> son las onomatopeyas fonéticas empleadas universalmente por telegrafistas para vocalizar los pulsos elementales del código.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Un punto se pronuncia <strong>dit</strong> debido a su carácter abrupto y seco. Una raya se vocaliza <strong>dah</strong> por su tono prolongado. Cuando un punto aparece en medio de un carácter se acorta fonéticamente a "di-", reservando "dit" para el último punto del grupo.
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Ejemplos de Pronunciación Rítmica</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letra A (<code>.-</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>di-dah</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letra B (<code>-...</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>dah-di-di-dit</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letra S (<code>...</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>di-di-dit</span>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Letra O (<code>---</code>):</span>{' '}
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>dah-dah-dah</span>
            </div>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Los operadores experimentados nunca cuentan puntos y rayas visualmente. En su lugar, entrenan el oído para reconocer de manera instantánea el ritmo musical "di-dah" como una unidad acústica global.
        </p>
      </section>

      {/* Sección 6: Breve Historia del Código Morse */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> Breve Historia del Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El código Morse nació ligado a la invención del telégrafo electromagnético durante las décadas de 1830 y 1840.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Samuel F. B. Morse concibió la idea general del telégrafo, pero fue Alfred Vail, su socio y mecánico de precisión, quien revolucionó el proyecto. Documentos de los archivos del Instituto Smithsonian demuestran que Vail diseñó el alfabeto telegráfico optimizado tras analizar las frecuencias de letras en los tipos de imprenta de Nueva Jersey.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Colecciones del Instituto Smithsonian]
          </a>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          El <strong>24 de mayo de 1844</strong>, Samuel Morse transmitió el histórico primer telegrama público interurbano:
        </p>

        {/* Tarjeta del Primer Mensaje Histórico */}
        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Primer Despacho Telegráfico Público (1844)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "What Hath God Wrought?" («¿Qué ha hecho Dios?»)
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Transmitido desde la sala de la Corte Suprema en el Capitolio de Washington D.C. hasta Alfred Vail en la estación de ferrocarril de Baltimore, Maryland.{' '}
            <a href="https://www.loc.gov/item/mcc.019/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              [Registro Primario de la Biblioteca del Congreso de EE. UU.]
            </a>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Con el tiempo surgieron variantes. El código Morse americano original utilizaba pausas internas y rayas de diferente longitud. En 1865, las naciones europeas crearon el Código Morse Internacional (Continental), eliminando las pausas internas y unificando el protocolo mundial.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Para profundizar en esta cronología, consulta nuestra guía completa sobre la{' '}
          <a href="/es/historia-del-codigo-morse/" onClick={(e) => handleNav(e, 'history', '/es/historia-del-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            historia del código Morse
          </a>.
        </p>
      </section>

      {/* Sección 7: ¿Qué es el Código Morse Internacional? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> ¿Qué es el Código Morse Internacional?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El <strong>Código Morse Internacional</strong> es el estándar técnico moderno utilizado en la radiocomunicación marítima, aeronáutica y de radioaficionados en los cinco continentes.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Homologa las combinaciones de puntos y rayas para las 26 letras latinas básicas (A–Z), los dígitos arábigos (0–9), signos de puntuación fundamentales y prosigns operativos. En los países hispanohablantes, se integra además la letra reglamentaria <strong>Ñ</strong> (<code>--.--</code>).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Este reglamento está publicado formalmente por la Unión Internacional de Telecomunicaciones como la{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            Recomendación UIT-R M.1677-1
          </a>. Para consultar todas las letras y signos, accede a nuestra tabla del{' '}
          <a href="/es/alfabeto-codigo-morse/" onClick={(e) => handleNav(e, 'alphabet', '/es/alfabeto-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            alfabeto Morse completo
          </a>.
        </p>
      </section>

      {/* Sección 8: ¿Qué Significa SOS en Morse? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle style={{ color: 'var(--accent-primary)' }} /> ¿Qué es SOS en Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          La señal de socorro SOS se escribe en código Morse de la siguiente forma:
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-danger, #ef4444)', letterSpacing: '0.2em' }}>
              ... --- ...
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Tres puntos, tres rayas, tres puntos (transmitidos de forma continua como un solo prosign)</div>
          </div>
          <button
            onClick={() => handlePlayMorse('sos-demo', 'SOS')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '6px', background: playingId === 'sos-demo' ? 'var(--accent-danger, #ef4444)' : 'rgba(239, 68, 68, 0.1)', color: playingId === 'sos-demo' ? '#ffffff' : 'var(--accent-danger, #ef4444)', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {playingId === 'sos-demo' ? <Square size={14} /> : <Play size={14} />}
            {playingId === 'sos-demo' ? 'Detener' : 'Escuchar SOS'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          SOS fue ratificada oficialmente en la Convención Radiotelegráfica Internacional de Berlín de 1906, reemplazando a la antigua señal británica Marconi CQD.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>El mito de los acrónimos:</strong> A pesar de las leyendas urbanas, SOS <em>no</em> significa "Save Our Souls" ni "Socorro Oh Socorro". Son retroacrónimos inventados a posteriori. La secuencia <code>... --- ...</code> fue seleccionada exclusivamente porque resulta matemáticamente inconfundible, rápida de emitir sin errores y fácil de distinguir entre interferencias atmosféricas.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Descubre los detalles completos en nuestro artículo sobre{' '}
          <a href="/es/sos-en-codigo-morse/" onClick={(e) => handleNav(e, 'sos', '/es/sos-en-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            SOS en código Morse
          </a>.
        </p>
      </section>

      {/* Sección 9: Dónde se Utiliza el Código Morse Hoy en Día */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> ¿Dónde se Utiliza el Código Morse en la Actualidad?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Aunque los grandes cables telegráficos comerciales fueron relevados por satélites e Internet de fibra óptica, el código Morse se mantiene vigente en múltiples ámbitos técnicos:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Radio size={16} style={{ color: 'var(--accent-primary)' }} /> Radioafición (CW)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Cientos de miles de radioaficionados en España y Latinoamérica practican diariamente telegrafía (onda continua / CW). Las señales telegráficas atraviesan el ruido y el desvanecimiento ionosférico con mucha mayor eficacia que la voz. Conoce más en nuestra guía de{' '}
              <a href="/es/radioaficionados-codigo-morse/" onClick={(e) => handleNav(e, 'amateurradio', '/es/radioaficionados-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                código Morse para radioaficionados
              </a>.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} style={{ color: 'var(--accent-primary)' }} /> Aeronavegación y Balizas
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Las radiobalizas aeronáuticas VOR, ILS y NDB emiten repetidamente sus identificadores de 2 a 3 letras en código Morse para que los pilotos verifiquen la sintonía en cabina. Las cartas náuticas oficiales de faros y balizas también catalogan las frecuencias Morse correspondientes.{' '}
              <a href="https://navcen.uscg.gov/sites/default/files/pdf/msi/LightList_V6_2024.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                [Registro de Faros y Balizas Náuticas]
              </a>
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--accent-primary)' }} /> Señales de Emergencia y Rescate
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Al no requerir computadoras complejas ni interfaces gráficas, los destellos de espejo, las linternas o los golpes en estructuras metálicas permiten emitir pedidos de auxilio vitales cuando los equipos electrónicos fallan o se inundan.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} style={{ color: 'var(--accent-primary)' }} /> Accesibilidad y Ayudas Técnicas
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Conmutadores adaptados de código Morse permiten a personas con discapacidades motoras graves o afecciones neuromusculares (como ELA) comunicarse velozmente mediante leves pulsaciones de dos botones o soplos.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 10: ¿Por Qué Sigue Siendo Importante? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lightbulb style={{ color: 'var(--accent-primary)' }} /> ¿Por Qué Sigue Siendo Importante el Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El código Morse resolvió un desafío colosal de la ingeniería de telecomunicaciones con una elegancia deslumbrante.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En lugar de exigir receptores mecánicos de sincronismo complejo o canales analógicos de voz de alta fidelidad, el texto se comprime en impulsos discretos de encendido y apagado (On/Off Keying). Esta extrema eficiencia posibilita enlaces mundiales con transmisores del tamaño de una caja de fósforos que operan con menos de 5 vatios de potencia.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Asimismo, constituye el pilar conceptual de la teoría moderna de la información: demostró por vez primera que cualquier pensamiento humano puede modularse mediante <strong>tiempo, secuencia y cadencia binaria</strong>.
        </p>
      </section>

      {/* Sección 11: Código Morse vs Código Binario */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} /> Código Morse vs Código Binario
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          A menudo se compara al código Morse con el código binario digital porque ambos emplean dos estados físicos elementales: señal activa (ON) y señal inactiva (OFF).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Sin embargo, <strong>el código Morse no es idéntico al sistema binario informático moderno</strong>. La computación actual utiliza tramas de bits sincrónicos de longitud fija (por ejemplo, bytes ASCII de 8 bits). En cambio, el Morse es un protocolo asincrónico de longitud variable donde la duración de la emisión (1 dit frente a 3 dits) y la duración de los silencios forman parte indisoluble de la información.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Sin pausas temporales, una secuencia de tres rayas <code>---</code> resultaría indistinguible: podría significar una sola letra <strong>O</strong>, o tres letras <strong>T</strong> consecutivas.
        </p>
      </section>

      {/* Sección 12: ¿Cómo Empezar a Aprender Código Morse? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> ¿Cómo Empezar a Aprender Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Para dominar el código Morse con soltura y evitar estancamientos, enfócate en el ritmo acústico en lugar de memorizar tablas visuales impresas:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.75rem', paddingLeft: '1.25rem' }}>
          <li><strong>Empieza por el oído:</strong> Aprende de 2 a 3 caracteres escuchando su cadencia sonora a alta velocidad (18–20 WPM).</li>
          <li><strong>Evita contar puntos:</strong> Entrena a tu cerebro para reconocer "di-dah" de forma instantánea como la letra <strong>A</strong>.</li>
          <li><strong>Aplica el método Farnsworth:</strong> Mantén los sonidos rápidos mientras amplías los silencios entre letras para dar tiempo al cerebro.</li>
          <li><strong>Practica a diario:</strong> Dedica entre 10 y 15 minutos diarios a sesiones breves de audición activa.</li>
          <li><strong>Avanza progresivamente:</strong> Incorpora nuevos caracteres mediante el método Koch al alcanzar el 90% de precisión.</li>
          <li><strong>Utiliza traductores interactivos:</strong> Convierte oraciones cotidianas con nuestro traductor en tiempo real.</li>
        </ol>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <a
            href="/es/aprender-codigo-morse/"
            onClick={(e) => handleNav(e, 'learn', '/es/aprender-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Ir a la Guía para Aprender Morse <ArrowRight size={16} />
          </a>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Abrir Traductor Morse en Español
          </a>
        </div>
      </section>

      {/* Sección 13: Preguntas Frecuentes (FAQ Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} /> Preguntas Frecuentes sobre el Código Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-input)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-secondary)' }} />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sección 14: Conclusión y Llamada a la Acción */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          ¿Listo para Empezar a Traducir Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convierte texto a código Morse o decodifica puntos y rayas a texto instantáneamente con síntesis de audio en tiempo real.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Lanzar Traductor Morse <ArrowRight size={18} />
          </a>
          <a
            href="/es/alfabeto-codigo-morse/"
            onClick={(e) => handleNav(e, 'alphabet', '/es/alfabeto-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Explorar Alfabeto en Código Morse
          </a>
        </div>
      </footer>
    </div>
  );
}
