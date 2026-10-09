import React, { useState } from 'react';
import {
  AlertTriangle, Play, Square, Copy, Check, Radio, Volume2, ShieldCheck,
  ChevronDown, ChevronUp, Zap, HelpCircle, Flashlight, History, ArrowRight, Sun, Flame
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getCharacterBreakdown } from '../engine/morseEngine.js';

const TIMELINE = [
  { year: '1905', title: 'Regulaciones de Radio en Alemania', desc: 'Alemania introdujo por primera vez la secuencia de 3 puntos, 3 rayas y 3 puntos en sus normas nacionales de telegrafía.' },
  { year: '1906', title: 'Convención Radiotelegráfica de Berlín', desc: 'La Convención Internacional de Berlín adoptó oficialmente el código SOS como la señal marítima internacional de socorro.' },
  { year: '1908', title: 'Entrada en Vigor Internacional', desc: 'El acuerdo de la convención de Berlín comenzó a regir formalmente a escala global el 1 de julio de 1908.' },
  { year: '1912', title: 'Hundimiento del Titanic', desc: 'Los radiotelegrafistas del Titanic (Jack Phillips y Harold Bride) transmitieron tanto la señal antigua CQD como la nueva señal SOS en la madrugada del 15 de abril.' },
  { year: '1999', title: 'Sustitución por el Sistema SMSSM (GMDSS)', desc: 'El Sistema Mundial de Socorro y Seguridad Marítima (SMSSM/GMDSS) vía satélite sustituyó oficialmente al código Morse como canal obligatorio en alta mar.' }
];

const COMPARISON_TABLE = [
  { signal: 'SOS', type: 'Prosign Continuo en Morse', use: 'Señal internacional de socorro radiotelegráfico (...---...)', era: '1908–Presente' },
  { signal: 'CQD', type: 'Texto Formateado en Morse', use: 'Primer distintivo de auxilio de la compañía Marconi Wireless', era: '1904–1912' },
  { signal: 'Mayday', type: 'Procedimiento Vocal Hablado', use: 'Señal de socorro en radiotelefonía y aviación civil', era: '1923–Presente' }
];

const FAQS = [
  {
    q: '¿Qué es SOS en código Morse y cuál es su patrón?',
    a: 'SOS en código Morse es ...---... — tres puntos, tres rayas y tres puntos emitidos como una señal continua e ininterrumpida de socorro sin pausas entre caracteres.'
  },
  {
    q: '¿Qué significan realmente las letras SOS?',
    a: 'SOS no significa originalmente nada; no son las siglas de "Save Our Souls" ("Salven nuestras almas") ni de "Save Our Ship" ("Salven nuestro barco"). Esas frases fueron creadas posteriormente como retroacrónimos populares. La combinación fue seleccionada por la Conferencia de Berlín de 1906 debido a su inconfundible ritmo acústico simétrico de 3-3-3, que resalta con claridad a través de la estática atmosférica.'
  },
  {
    q: '¿Cómo se escribe correctamente SOS en código Morse?',
    a: 'Para lectura visual en pantalla o papel, se suele escribir con espacios separadores como "... --- ...". No obstante, para la transmisión técnica y reglamentaria de emergencia, se emite como un único prosign continuo sin espacios entre letras (...---...).'
  },
  {
    q: '¿Cómo se transmite la señal SOS utilizando una linterna o espejo?',
    a: 'Emite tres destellos cortos y rápidos (puntos), tres destellos largos y sostenidos (rayas, con una duración 3 veces mayor que los cortos), y tres destellos cortos y rápidos (puntos). Mantén una pausa de 3 a 5 segundos de oscuridad y repite el ciclo continuamente hasta ser avistado.'
  },
  {
    q: '¿Es posible golpear la señal SOS sobre una pared o tubería?',
    a: 'Sí. Golpea con firmeza: tres golpes rápidos y seguidos, tres golpes espaciados más lentos o firmes, y tres golpes rápidos. Este método de señalización acústica por percusión es un protocolo estándar de rescate para personas atrapadas bajo escombros o en minas subterráneas.'
  },
  {
    q: '¿Utilizó el Titanic la señal SOS la noche de su hundimiento?',
    a: 'Sí. Los operadores de radio del Titanic comenzaron transmitiendo la señal tradicional de la empresa Marconi, "CQD", y luego alternaron con la nueva llamada de socorro internacional "SOS" para asegurar que cualquier estación receptora cercana comprendiera la gravedad del naufragio.'
  },
  {
    q: '¿Sigue utilizándose el código Morse SOS en la navegación moderna?',
    a: 'SOS sigue siendo universalmente reconocido por rescatistas, excursionistas, militares y supervivientes en todo el mundo. Sin embargo, para la navegación comercial obligatoria, la Organización Marítima Internacional (OMI) reemplazó la telegrafía en 1999 por el Sistema Mundial de Socorro y Seguridad Marítima (SMSSM/GMDSS), basado en satélites y llamadas selectivas digitales.'
  }
];

export function SpanishSosPage({ wpm = 16, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const sosMorseContinuous = '...---...';
  const sosMorseSpaced = '... --- ...';
  const sosText = 'SOS';

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
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const breakdown = getCharacterBreakdown(sosText, sosMorseSpaced);
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 16,
      farnsworthWpm: wpm || 16,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: true,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) showToast('Señal SOS copiada al portapapeles ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast('Emitiendo señal visual SOS de emergencia...');
    setTimeout(() => setIsFlashing(false), 4500);
  };

  return (
    <article className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ef4444',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.35s infinite alternate'
        }}>
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '2.5rem', textAlign: 'center', padding: '1rem' }}>
            🚨 SEÑAL DE SOCORRO: SOS (...---...)
          </div>
        </div>
      )}

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
          <AlertTriangle size={16} /> Guía Oficial de la Señal Internacional de Socorro
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          SOS en Código Morse: Patrón (... --- ...), Significado, Historia y Cómo Emitirlo
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          La secuencia exacta en código Morse para <strong>SOS</strong> es <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>...---...</code>.
          Representa tres pulsos cortos (puntos), tres pulsos largos (rayas) y tres pulsos cortos emitidos como una señal continua.
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

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', fontWeight: 600 }}>
          3 cortos (di-di-dit) • 3 largos (dah-dah-dah) • 3 cortos (di-di-dit)
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePlay}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: isPlaying ? '#ef4444' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Detener Sonido en Bucle' : 'Reproducir Tono en Bucle'}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(sosMorseContinuous)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            {copied ? '¡Copiado!' : 'Copiar Señal SOS'}
          </button>

          <button
            type="button"
            onClick={handleFlashSignal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            <Flashlight size={18} color="#ef4444" /> Destello Visual de Emergencia
          </button>

          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Abrir Traductor <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Prosign vs Readability Technical Distinction */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Por Qué la Señal SOS se Transmite como un Prosign Continuo?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          En el código Morse convencional existen pausas obligatorias entre letras (3 unidades de tiempo). Sin embargo,
          la llamada de socorro es un <strong>prosign</strong> (signo de procedimiento) radiotelegráfico emitido
          como un único bloque ininterrumpido sin intervalos entre letras:
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
              Sin pausas entre letras. Emitido como una cadencia veloz de 9 elementos indivisibles que resalta sobre cualquier ruido de radio.
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
            Frases populares en inglés como <em>"Save Our Souls"</em> (Salven nuestras almas) o <em>"Save Our Ship"</em> (Salven nuestro barco),
            así como en español <em>"Socorro O Salvadnos"</em>, son <strong>retroacrónimos</strong> populares inventados años después de su adopción oficial.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Las letras S-O-S fueron elegidas estrictamente por su acústica: tres pulsos cortos, tres largos y tres cortos
            conforman un ritmo inconfundible, extremadamente simétrico y veloz de transmitir con una llave telegráfica manual,
            imposible de malinterpretar incluso a través de tormentas eléctricas y señales débiles.
          </p>
        </div>
      </section>

      {/* How to Send SOS */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Emitir la Señal SOS en una Emergencia Real
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>🔦 Linterna o Flash</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              3 destellos cortos y rápidos, 3 destellos largos sostenidos (3 veces más largos), 3 destellos cortos. Pausa de 3 a 5 segundos y repetir.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>🔊 Silbato o Bocina</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              3 pitidos breves, 3 pitidos largos y potentes, 3 pitidos breves. Dejar 5 segundos de silencio y repetir el patrón sonoro.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>👉 Golpes en Tuberías</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              3 golpes rápidos, 3 golpes más pausados y contundentes, 3 golpes rápidos. Ideal para personas atrapadas en estructuras o minas.
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
            <li><strong>Creer que SOS significa "Save Our Souls":</strong> Falso. Es un retroacrónimo. Fue seleccionada estrictamente por su ritmo matemático 3-3-3.</li>
            <li><strong>Pensar que 3 puntos representan SOS:</strong> 3 puntos aislados representan únicamente la letra <strong>S</strong>. Para formar SOS se requieren los 9 elementos completos.</li>
            <li><strong>Añadir pausas largas entre letras:</strong> La transmisión oficial de socorro se efectúa como un prosign continuo (<code style={{ color: '#ef4444' }}>...---...</code>) sin silencios intermedios.</li>
            <li><strong>Asumir que el Titanic inventó la señal SOS:</strong> La señal fue reglamentada en la Conferencia de Berlín de 1906, cuatro años antes de la tragedia del Titanic.</li>
            <li><strong>Creer que el código Morse sigue siendo el canal principal en alta mar:</strong> El sistema satelital GMDSS/SMSSM reemplazó la telegrafía en barcos comerciales en 1999.</li>
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

      {/* Final Takeaway */}
      <section style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Conclusión Principal
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          <strong>SOS en código Morse es <code style={{ color: '#ef4444', fontWeight: 900 }}>...---...</code> — tres puntos, tres rayas y tres puntos.</strong>
          Se convirtió en el estándar mundial de auxilio porque su cadencia simétrica es imposible de confundir en situaciones de supervivencia.
        </p>
        <a
          href="/es/"
          onClick={(e) => handleNav(e, 'spanish', '/es/')}
          style={{ display: 'inline-block', padding: '0.85rem 1.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
        >
          Traducir Cualquier Mensaje en Código Morse Ahora
        </a>
      </section>
    </article>
  );
}

export default SpanishSosPage;
