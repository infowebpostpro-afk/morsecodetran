import React, { useState, useMemo } from 'react';
import {
  MessageSquare, Play, Square, Copy, Check, Radio, Volume2,
  ChevronDown, ChevronUp, BookOpen, Sparkles, Filter, ShieldCheck,
  HelpCircle, ArrowRight, Search
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getSpanishCharacterBreakdown, spanishMorseEngine } from '../engine/spanishMorse.js';

export const MASTER_SPANISH_PHRASES = [
  // Saludos y Cortesía
  { text: 'HOLA', morse: '.... --- .-.. .-', category: 'Saludos', use: 'Saludo amistoso universal' },
  { text: 'BUENOS DIAS', morse: '-... ..- . -. --- ... / -.. .. .- ...', category: 'Saludos', use: 'Saludo matutino formal o informal' },
  { text: 'BUENAS NOCHES', morse: '-... ..- . -. .- ... / -. --- -.-. .... . ...', category: 'Saludos', use: 'Despedida o saludo nocturno' },
  { text: 'ADIOS', morse: '.- -.. .. --- ...', category: 'Saludos', use: 'Despedida estándar' },
  { text: 'HASTA PRONTO', morse: '.... .- ... - .- / .--. .-. --- -. - ---', category: 'Saludos', use: 'Despedida afectuosa' },
  { text: 'GRACIAS', morse: '--. .-. .- -.-. .. .- ...', category: 'Saludos', use: 'Expresión de agradecimiento sincero' },
  { text: 'POR FAVOR', morse: '.--. --- .-. / ..-. .- ...- --- .-.', category: 'Saludos', use: 'Petición cortés' },
  { text: 'PERDON', morse: '.--. . .-. -.. --- -.', category: 'Saludos', use: 'Disculpa y cortesía' },

  // Amor y Afecto
  { text: 'TE AMO', morse: '- . / .- -- ---', category: 'Amor y Afecto', use: 'Declaración romántica clásica para pulseras y anillos' },
  { text: 'TE QUIERO', morse: '- . / --.- ..- .. . .-. ---', category: 'Amor y Afecto', use: 'Expresión entrañable de cariño en español' },
  { text: 'MI AMOR', morse: '-- .. / .- -- --- .-.', category: 'Amor y Afecto', use: 'Trato cariñoso íntimo' },
  { text: 'TE EXTRAÑO', morse: '- . / . -..- - .-. .- --.-- ---', category: 'Amor y Afecto', use: 'Mensaje de nostalgia con la letra Ñ (--.--)' },
  { text: 'ERES MI VIDA', morse: '. .-. . ... / -- .. / ...- .. -.. .-', category: 'Amor y Afecto', use: 'Promesa y dedicatoria romántica profunda' },
  { text: 'SIEMPRE JUNTOS', morse: '... .. . -- .--. .-. . / .--- ..- -. - --- ...', category: 'Amor y Afecto', use: 'Frase para regalos de aniversario' },
  { text: 'BESAME', morse: '-... . ... .- -- .', category: 'Amor y Afecto', use: 'Petición romántica' },
  { text: 'PARA SIEMPRE', morse: '.--. .- .-. .- / ... .. . -- .--. .-. .', category: 'Amor y Afecto', use: 'Vínculo afectivo duradero' },

  // Emergencia y Socorro
  { text: 'SOS', morse: '... --- ...', category: 'Emergencia', use: 'Prosign internacional continuo de socorro (...---...)' },
  { text: 'AYUDA', morse: '.- -.-- ..- -.. .-', category: 'Emergencia', use: 'Petición directa de auxilio' },
  { text: 'SOCORRO', morse: '... --- -.-. --- .-. .-. ---', category: 'Emergencia', use: 'Llamada de peligro grave o inminente' },
  { text: 'PELIGRO', morse: '.--. . .-.. .. --. .-. ---', category: 'Emergencia', use: 'Alerta de riesgo o amenaza' },
  { text: 'ENVIEN AYUDA', morse: '. -. ...- .. . -. / .- -.-- ..- -.. .-', category: 'Emergencia', use: 'Mensaje urgente de rescate' },
  { text: 'EMERGENCIA', morse: '. -- . .-. --. . -. -.-. .. .-', category: 'Emergencia', use: 'Aviso crítico para transmisiones' },

  // Celebraciones y Buenos Deseos
  { text: 'FELIZ CUMPLEAÑOS', morse: '..-. . .-.. .. --.. / -.-. ..- -- .--. .-.. . --.-- --- ...', category: 'Celebraciones', use: 'Felicitación festiva con la letra Ñ (--.--)' },
  { text: 'FELICIDADES', morse: '..-. . .-.. .. -.-. .. -.. .- -.. . ...', category: 'Celebraciones', use: 'Enhorabuena por un logro o evento' },
  { text: 'BUENA SUERTE', morse: '-... ..- . -. .- / ... ..- . .-. - .', category: 'Celebraciones', use: 'Deseo sincero de éxito y fortuna' },
  { text: 'BIENVENIDO', morse: '-... .. . -. ...- . -. .. -.. ---', category: 'Celebraciones', use: 'Cálida bienvenida' },
  { text: 'FELIZ AÑO NUEVO', morse: '..-. . .-.. .. --.. / .- --.-- --- / -. ..- . ...- ---', category: 'Celebraciones', use: 'Saludo de fin de año con Ñ' },

  // Respuestas y Conversación Básica
  { text: 'SI', morse: '... ..', category: 'Básicos', use: 'Respuesta afirmativa' },
  { text: 'NO', morse: '-. ---', category: 'Básicos', use: 'Respuesta negativa directa' },
  { text: 'OK', morse: '--- -.-', category: 'Básicos', use: 'Confirmación y conformidad' },
  { text: 'HASTA LUEGO', morse: '.... .- ... - .- / .-.. ..- . --. ---', category: 'Básicos', use: 'Despedida temporal' },
  { text: 'TRANQUILO', morse: '- .-. .- -. --.- ..- .. .-.. ---', category: 'Básicos', use: 'Mensaje de calma y serenidad' },

  // Radioafición CW y Códigos Operativos
  { text: 'CQ', morse: '-.-. --.-', category: 'Radioafición CW', use: 'Llamada general abierta a cualquier estación' },
  { text: 'QTH', morse: '--.- - ....', category: 'Radioafición CW', use: 'Código Q: Mi ubicación o ciudad es...' },
  { text: 'QSL', morse: '--.- ... .-..', category: 'Radioafición CW', use: 'Código Q: Confirmo recepción del mensaje' },
  { text: '73', morse: '--... ...--', category: 'Radioafición CW', use: 'Saludos cordiales y mejores deseos al despedir' },
  { text: '88', morse: '---.. ---..', category: 'Radioafición CW', use: 'Amor y besos (despedida afectuosa en radio)' },
  { text: 'DE', morse: '-.. .', category: 'Radioafición CW', use: 'Palabra de enlace: "De" (indica mi estación)' },
  { text: 'K', morse: '-.-', category: 'Radioafición CW', use: 'Pase de transmisión: "Adelante, cambio"' },
  { text: 'AR', morse: '.-.-.', category: 'Radioafición CW', use: 'Prosign: Fin de la transmisión del mensaje' },
  { text: 'SK', morse: '...-.-', category: 'Radioafición CW', use: 'Prosign: Fin de contacto o cierre definitivo de sesión' }
];

const FAQS = [
  {
    q: '¿Cuáles son las frases más utilizadas en código Morse en español?',
    a: 'Las expresiones más populares incluyen SOS, HOLA, GRACIAS, BUENOS DÍAS, TE AMO, TE QUIERO, FELIZ CUMPLEAÑOS, SÍ, NO y BUENA SUERTE. Entre los operadores de radioaficionados, las expresiones más difundidas son abreviaturas de telegrafía CW como CQ (llamada general), QTH (ubicación), QSL (confirmación) y 73 (saludos cordiales).'
  },
  {
    q: '¿Cómo se separan las letras y palabras al escribir una frase en Morse?',
    a: 'En la notación escrita estándar, se deja un espacio simple entre cada letra (equivalente a 3 unidades de silencio). Para separar palabras distintas, se coloca una barra diagonal separada por espacios (" / "), que representa el intervalo reglamentario de 7 unidades de tiempo del estándar internacional PARIS.'
  },
  {
    q: '¿Cómo se codifica la letra Ñ en frases como "FELIZ CUMPLEAÑOS"?',
    a: 'En español, la letra Ñ posee su propio código oficial reglamentado: dos rayas, un punto y dos rayas (--.-- = dah-dah-di-dah-dah). En frases como "FELIZ CUMPLEAÑOS" o "TE EXTRAÑO", la letra Ñ se transmite con esta secuencia de 5 elementos sin necesidad de sustituirla por una N simple.'
  },
  {
    q: '¿Por qué la frase "73" es tan importante en las comunicaciones por radio?',
    a: 'El número 73 es una de las abreviaturas históricas más antiguas de la telegrafía eléctrica, originada en el Código 92 de Western Union en 1859. Significa universalmente "saludos cordiales" o "mis mejores deseos". Es la forma protocolaria y respetuosa obligada para concluir cualquier comunicado telegráfico entre radioaficionados.'
  },
  {
    q: '¿Qué significa el saludo "88" en las frases telegráficas?',
    a: 'En la tradición de la radioafición, "88" (---.. ---..) significa "amor y besos" (Love and Kisses). Es una despedida más afectuosa e íntima que el formal "73", empleada habitualmente entre parejas, cónyuges o familiares que operan estaciones de radio en HF.'
  },
  {
    q: '¿Se puede transmitir "AYUDA" en una emergencia real?',
    a: 'Aunque la palabra AYUDA (.- -.-- ..- -.. .-) es inteligible, en una emergencia marítima, aérea o de supervivencia nunca se debe telegrafiar una palabra larga. El protocolo oficial de rescate exige emitir únicamente el prosign continuo SOS (...---...), ya que todos los servicios de búsqueda y rescate están entrenados para identificar este ritmo simétrico de inmediato.'
  },
  {
    q: '¿Cómo diseñar una joya o pulsera con una frase en código Morse?',
    a: 'Selecciona cuentas redondas (esferas) para los puntos y cuentas alargadas (cilindros o tubos) para las rayas. Coloca cuentas pequeñas o nudos simples para separar las letras, y utiliza una cuenta de color contrastante o un nudo doble para separar las palabras completas. Esto garantiza que la frase oculta sea legible para cualquier persona que conozca el código.'
  }
];

export function SpanishPhrasesPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingText, setPlayingText] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const categories = ['Todas', 'Saludos', 'Amor y Afecto', 'Emergencia', 'Celebraciones', 'Básicos', 'Radioafición CW'];

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

  const filteredPhrases = useMemo(() => {
    return MASTER_SPANISH_PHRASES.filter(item => {
      const matchCat = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.morse.includes(searchQuery) ||
        item.use.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePlaySound = (item) => {
    if (playingText === item.text) {
      audioEngine.stop();
      setPlayingText(null);
      return;
    }
    setPlayingText(item.text);
    const breakdown = getSpanishCharacterBreakdown(item.text, 'extended');
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 20,
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingText(null);
      }
    });
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    if (showToast) showToast(`Código de "${text}" copiado al portapapeles ✓`);
    setTimeout(() => setCopiedIndex(null), 2000);
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
            Frases en Código Morse
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary)', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <MessageSquare size={16} /> Repertorio Completo de Expresiones y Mensajes
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Frases en Código Morse: Saludos, Amor, Emergencia y Mensajes de Radio
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Explora la colección definitiva de frases en código Morse en español con reproducción de audio interactiva,
          patrones verificados de puntos y rayas, significado en telegrafía y botones para copiar con un solo clic.
        </p>
      </header>

      {/* Search and Filters Hub */}
      <section style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar frase, código Morse o significado..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {filteredPhrases.length} {filteredPhrases.length === 1 ? 'frase encontrada' : 'frases encontradas'}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: selectedCategory === cat ? 'var(--primary-glow)' : 'var(--surface)',
                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Master Phrases Table */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ overflowX: 'auto', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700 }}>Frase en Español</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700 }}>Código Morse</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700 }}>Categoría</th>
                <th style={{ padding: '1rem 1.25rem', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700 }}>Uso o Significado</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'var(--text)', fontSize: '0.9rem', fontWeight: 700 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPhrases.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron frases que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredPhrases.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                      {item.text}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>
                      {item.morse}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {item.use}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handlePlaySound(item)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            background: playingText === item.text ? '#ef4444' : 'var(--surface)',
                            color: playingText === item.text ? '#fff' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                          title={playingText === item.text ? 'Detener Sonido' : 'Reproducir Audio'}
                        >
                          {playingText === item.text ? <Square size={13} /> : <Play size={13} />}
                          <span>{playingText === item.text ? 'Parar' : 'Oír'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.morse, idx)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: copiedIndex === idx ? '#10b981' : 'var(--text)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: 600
                          }}
                          title="Copiar Código Morse"
                        >
                          {copiedIndex === idx ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Guide on How Morse Code Phrases Are Formed */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo se Construyen y Separan las Frases en Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Para que una frase sea legible tanto por el oído humano como por el software, es imprescindible
          respetar la jerarquía de tiempos fijada por la norma internacional <strong>ITU-R M.1677-1</strong>:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              1. Silencio Entre Elementos (1 Unidad)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              La pausa que separa dos puntos o una raya de un punto dentro de la misma letra mide exactamente 1 unidad elemental.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              2. Silencio Entre Letras (3 Unidades)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              En texto escrito se representa mediante un espacio simple. Si se omite, los símbolos se fusionan en letras erróneas.
            </p>
          </div>

          <div style={{ background: 'var(--surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.5rem' }}>
              3. Silencio Entre Palabras (7 Unidades)
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              En pantalla se utiliza una barra diagonal rodeada de espacios (<code> / </code>) para demarcar claramente el corte entre vocablos.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--primary)" /> Preguntas Frecuentes sobre Frases en Código Morse
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

      {/* Final Takeaway & Links */}
      <section style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          ¿Necesitas Traducir una Frase Personalizada?
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          Utiliza nuestro traductor bidireccional en línea para convertir cualquier texto, nombre propio, fecha o saludo a código Morse con descarga de audio WAV de alta fidelidad.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ padding: '0.85rem 1.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Abrir Traductor de Texto a Morse
          </a>
          <a
            href="/es/morse-code-i-love-you/"
            onClick={(e) => handleNav(e, 'es-iloveyou', '/es/morse-code-i-love-you/')}
            style={{ padding: '0.85rem 1.75rem', background: 'var(--surface-elevated)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
          >
            Ver Frases de Amor (Te Amo)
          </a>
        </div>
      </section>
    </article>
  );
}

export default SpanishPhrasesPage;
