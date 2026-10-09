import React, { useState } from 'react';
import {
  Heart, Play, Square, Copy, Check, Volume2, Sparkles, BookOpen,
  ChevronDown, ChevronUp, Flashlight, ShieldCheck, HelpCircle, ArrowRight, Gift
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { getSpanishCharacterBreakdown, spanishMorseEngine } from '../engine/spanishMorse.js';

const ROMANTIC_PHRASES_ES = [
  { phrase: 'Te Amo', morse: '- . / .- -- ---', desc: 'La declaración de amor clásica en español' },
  { phrase: 'Te Quiero', morse: '- . / --.- ..- .. . .-. ---', desc: 'Expresión de afecto común y sincera' },
  { phrase: 'Mi Amor', morse: '-- .. / .- -- --- .-.', desc: 'Trato cariñoso habitual' },
  { phrase: 'Te Extraño', morse: '- . / . -..- - .-. .- --.-- ---', desc: 'Con la letra Ñ (--.--) oficial' },
  { phrase: 'Bésame', morse: '-... . ... .- -- .', desc: 'Petición romántica' },
  { phrase: 'Para Siempre', morse: '.--. .- .-. .- / ... .. . -- .--. .-. .', desc: 'Promesa de amor eterno' },
  { phrase: 'Código 88 (CW)', morse: '---.. ---..', desc: 'Abreviatura tradicional de radio: "Amor y besos"' },
  { phrase: 'I Love You', morse: '.. / .-.. --- ...- . / -.-- --- ..-', desc: 'Versión internacional en inglés' }
];

const FAQS = [
  {
    q: '¿Cómo se escribe "Te amo" en código Morse?',
    a: 'Se escribe exactamente como "- . / .- -- ---". La palabra TE se compone de T (-) y E (.), separadas por un espacio regular. Entre TE y AMO se introduce una barra diagonal (" / ") que delimita la frontera entre palabras. La palabra AMO se compone de A (.-), M (--) y O (---).'
  },
  {
    q: '¿Cuál es la diferencia entre "Te amo" y "Te quiero" en código Morse?',
    a: '"Te amo" tiene un patrón más breve y simétrico (- . / .- -- ---, 5 letras y 9 elementos en total), lo que lo hace perfecto para anillos finos o pulseras minimalistas. "Te quiero" (- . / --.- ..- .. . .-. ---, 8 letras y 22 elementos) es más largo y detallado, ideal para collares o brazaletes de doble hilera.'
  },
  {
    q: '¿Cómo diseñar una pulsera o joya con "Te amo" en código Morse?',
    a: 'Utiliza cuentas esféricas para los puntos (•) y cuentas cilíndricas alargadas para las rayas (—). Para marcar el espacio entre letras, añade una cuenta neutra pequeña. Para marcar la separación entre las palabras "TE" y "AMO", coloca una cuenta más grande de color contrastante o haz un nudo decorativo doble. Esto asegura que cualquier persona que conozca el código pueda leerlo sin confusiones.'
  },
  {
    q: '¿Puedo enviar "Te amo" con la linterna del teléfono móvil?',
    a: '¡Sí! Emite destellos cortos para los puntos y destellos tres veces más largos para las rayas. Mantén una pequeña pausa entre cada letra y una pausa de 2 a 3 segundos entre las palabras "TE" y "AMO".'
  },
  {
    q: '¿Qué significa el código 143 y es código Morse?',
    a: 'No, 143 no es código Morse. Es una abreviatura numérica nacida en buscapersonas (pagers) basada en el recuento de letras de la frase en inglés: I (1 letra), LOVE (4 letras), YOU (3 letras). Si traduces "143" a números en código Morse (.---- ....- ...--), obtienes una secuencia completamente distinta a la frase Morse real.'
  },
  {
    q: '¿Qué significa el número "88" entre radioaficionados?',
    a: 'En la telegrafía CW de radioaficionados, el número 88 (---.. ---..) es el código de cortesía tradicional que significa "Amor y besos" (Love and Kisses). Se usa habitualmente para despedir comunicados entre cónyuges, parejas o familiares queridos.'
  },
  {
    q: '¿Cómo se maneja el acento en "Te amo" o "Bésame"?',
    a: 'En telegrafía y código Morse estándar, las vocales con tilde en español se normalizan comúnmente a sus letras base sin acento (É → E, Á → A). De este modo, "Bésame" se transmite como BESAME (-... . ... .- -- .), garantizando compatibilidad con cualquier transceptor del mundo.'
  }
];

export function SpanishILoveYouPage({ wpm = 18, frequency = 550, volume = 0.5, showToast, setActiveTab }) {
  const [activePhrase, setActivePhrase] = useState('te-amo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState(null);

  const phraseData = {
    'te-amo': {
      title: 'TE AMO',
      morse: '- . / .- -- ---',
      ditDah: 'dah dit / di-dah dah-dah dah-dah-dah',
      meaning: 'La declaración de amor clásica en idioma español',
      letters: [
        { char: 'T', morse: '-', sound: 'dah' },
        { char: 'E', morse: '.', sound: 'dit' },
        { char: '/', morse: '/', sound: '[espacio]' },
        { char: 'A', morse: '.-', sound: 'di-dah' },
        { char: 'M', morse: '--', sound: 'dah-dah' },
        { char: 'O', morse: '---', sound: 'dah-dah-dah' }
      ]
    },
    'te-quiero': {
      title: 'TE QUIERO',
      morse: '- . / --.- ..- .. . .-. ---',
      ditDah: 'dah dit / dah-dah-di-dah di-di-dah di-dit dit di-dah-dit dah-dah-dah',
      meaning: 'Expresión afectuosa profundamente arraigada en España y Latinoamérica',
      letters: [
        { char: 'T', morse: '-', sound: 'dah' },
        { char: 'E', morse: '.', sound: 'dit' },
        { char: '/', morse: '/', sound: '[espacio]' },
        { char: 'Q', morse: '--.-', sound: 'dah-dah-di-dah' },
        { char: 'U', morse: '..-', sound: 'di-di-dah' },
        { char: 'I', morse: '..', sound: 'di-dit' },
        { char: 'E', morse: '.', sound: 'dit' },
        { char: 'R', morse: '.-.', sound: 'di-dah-dit' },
        { char: 'O', morse: '---', sound: 'dah-dah-dah' }
      ]
    },
    'i-love-you': {
      title: 'I LOVE YOU',
      morse: '.. / .-.. --- ...- . / -.-- --- ..-',
      ditDah: 'di-dit / di-dah-di-dit dah-dah-dah di-di-di-dah dit / dah-di-dah-dah dah-dah-dah di-di-dah',
      meaning: 'La versión internacional en inglés (8 letras, 24 elementos)',
      letters: [
        { char: 'I', morse: '..', sound: 'di-dit' },
        { char: '/', morse: '/', sound: '[espacio]' },
        { char: 'L', morse: '.-..', sound: 'di-dah-di-dit' },
        { char: 'O', morse: '---', sound: 'dah-dah-dah' },
        { char: 'V', morse: '...-', sound: 'di-di-di-dah' },
        { char: 'E', morse: '.', sound: 'dit' },
        { char: '/', morse: '/', sound: '[espacio]' },
        { char: 'Y', morse: '-.--', sound: 'dah-di-dah-dah' },
        { char: 'O', morse: '---', sound: 'dah-dah-dah' },
        { char: 'U', morse: '..-', sound: 'di-di-dah' }
      ]
    }
  };

  const current = phraseData[activePhrase];

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

  const handlePlayCurrent = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    const breakdown = getSpanishCharacterBreakdown(current.title, 'standard');
    audioEngine.playSequence({
      breakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handlePlayPhrase = (item, index) => {
    if (playingPhraseIndex === index) {
      audioEngine.stop();
      setPlayingPhraseIndex(null);
      return;
    }
    const itemBreakdown = getSpanishCharacterBreakdown(item.phrase.toUpperCase(), 'standard');
    setPlayingPhraseIndex(index);
    audioEngine.playSequence({
      breakdown: itemBreakdown,
      wpm: wpm || 18,
      farnsworthWpm: wpm || 18,
      frequency: frequency || 550,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingPhraseIndex(null);
      }
    });
  };

  const handleCopy = (morse, label) => {
    navigator.clipboard.writeText(morse);
    setCopiedKey(label);
    if (showToast) showToast(`"${label}" copiado al portapapeles ✓`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFlashSignal = () => {
    setIsFlashing(true);
    if (showToast) showToast(`Emitiendo destello visual de "${current.title}"...`);
    setTimeout(() => setIsFlashing(false), 4000);
  };

  return (
    <article className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Light Flash Overlay when active */}
      {isFlashing && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: '#ffffff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'flashPulse 0.4s infinite alternate'
        }}>
          <div style={{ color: '#000', fontWeight: 900, fontSize: '2rem' }}>
            ⚡ SEÑAL VISUAL: {current.title} ({current.morse})
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
            Te Amo en Código Morse
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', padding: '0.4rem 1.1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
          <Heart size={16} fill="#ec4899" /> Mensajes de Amor y Frases Románticas en Código Morse
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Te Amo en Código Morse: Desglose, Audio, Pulseras y Tatuajes
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Transforma las palabras más íntimas en un código secreto y elegante de puntos y rayas.
          Aprende el patrón exacto de <strong>"Te amo"</strong> (<code style={{ fontFamily: 'monospace', fontWeight: 700 }}>- . / .- -- ---</code>),
          "Te quiero" e "I love you", con audio interactivo y consejos para grabados y joyería artesanal.
        </p>
      </header>

      {/* Phrase Switcher Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'te-amo', label: 'TE AMO (Español)' },
          { id: 'te-quiero', label: 'TE QUIERO (Español)' },
          { id: 'i-love-you', label: 'I LOVE YOU (Inglés)' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActivePhrase(tab.id); if (isPlaying) audioEngine.stop(); setIsPlaying(false); }}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 700,
              border: activePhrase === tab.id ? '1px solid #ec4899' : '1px solid var(--border)',
              cursor: 'pointer',
              backgroundColor: activePhrase === tab.id ? 'rgba(236, 72, 153, 0.15)' : 'var(--surface)',
              color: activePhrase === tab.id ? '#ec4899' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Love Card */}
      <section style={{
        background: 'var(--surface-elevated)',
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        boxShadow: '0 8px 30px rgba(236, 72, 153, 0.12)',
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', marginBottom: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>
          <Heart size={20} fill="#ec4899" />
          <span>{current.meaning}</span>
        </div>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 1rem 0' }}>
          {current.title}
        </h2>

        <div style={{
          fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
          fontWeight: 900,
          fontFamily: 'monospace',
          letterSpacing: '5px',
          color: 'var(--primary)',
          marginBottom: '1rem',
          wordBreak: 'break-word',
          padding: '1rem',
          background: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          {current.morse}
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Ritmo fonético: <em>{current.ditDah}</em>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePlayCurrent}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: isPlaying ? '#ef4444' : 'linear-gradient(135deg, #ec4899 0%, #863bff 100%)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 14px rgba(236,72,153,0.35)' }}
          >
            {isPlaying ? <Square size={18} /> : <Play size={18} />}
            {isPlaying ? 'Detener Audio' : 'Escuchar Tono de Audio'}
          </button>

          <button
            type="button"
            onClick={() => handleCopy(current.morse, current.title)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            {copiedKey === current.title ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            {copiedKey === current.title ? '¡Copiado!' : 'Copiar Patrón Morse'}
          </button>

          <button
            type="button"
            onClick={handleFlashSignal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.5rem', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            <Flashlight size={18} color="#f59e0b" /> Destello Visual
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

      {/* Letter-by-Letter Breakdown */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Desglose Carácter por Carácter: {current.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Analizar cada elemento por separado permite verificar con total precisión el grabado de anillos,
          pulseras artesanales o diseños permanentes de tatuajes:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {current.letters.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-elevated)', padding: '1.25rem 1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{item.char}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>{item.morse}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>{item.sound}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--surface-elevated)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <strong>Norma UIT-R M.1677-1:</strong> La Unión Internacional de Telecomunicaciones estipula que una raya equivale exactamente a 3 puntos, el silencio entre elementos es de 1 punto, entre letras es de 3 puntos y entre palabras completas es de 7 puntos.
        </div>
      </section>

      {/* Spacing & Timing Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Cómo Funciona el Espaciado en el Código Morse de Amor
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          El error más habitual al diseñar accesorios o tatuajes es amontonar los puntos y rayas sin respetar las separaciones.
          En notación tipográfica escrita, un espacio regular separa las letras, mientras que una barra diagonal (<code>/</code>) señala la separación entre palabras:
        </p>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--primary)', textAlign: 'center', marginBottom: '1.25rem' }}>
          {current.morse}
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Bajo la temporización canónica del código Morse internacional:
        </p>

        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li><strong>Punto (•):</strong> 1 unidad de tiempo elemental.</li>
          <li><strong>Raya (—):</strong> 3 unidades de tiempo (exactamente 3 veces la duración del punto).</li>
          <li><strong>Silencio entre elementos de la misma letra:</strong> 1 unidad de silencio.</li>
          <li><strong>Silencio entre letras consecutivas:</strong> 3 unidades de silencio.</li>
          <li><strong>Silencio entre palabras separadas:</strong> 7 unidades de silencio.</li>
        </ul>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Esta separación es fundamental: sin espacios definidos, los símbolos se fusionan en letras completamente distintas
          (por ejemplo, unir <code>T</code> y <code>E</code> sin pausa convierte <code>- .</code> en <code>N</code>).
        </p>
      </section>

      {/* Jewelry & Tattoo Verification Checklist */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Guía para Pulseras de Cuentas, Tatuajes y Joyería Romántica
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          El código Morse es sumamente apreciado en regalos románticos por su minimalismo y por resguardar un significado
          privado que solo tú y tu persona especial conocen.
        </p>

        <div style={{ background: 'var(--surface-elevated)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#10b981" /> Lista de Verificación Antes de Hacer el Diseño Permanente:
          </h3>
          <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.25rem', margin: 0 }}>
            <li>Verifica el texto exacto deseado: <strong>TE AMO</strong> (5 letras) o <strong>TE QUIERO</strong> (8 letras).</li>
            <li>Comprueba las letras críticas: la <strong>O</strong> debe tener tres rayas (<code>---</code>) y no dos ni cuatro.</li>
            <li>Asegúrate de que la <strong>M</strong> lleve dos rayas (<code>--</code>) y la <strong>A</strong> un punto y una raya (<code>.-</code>).</li>
            <li>Para pulseras: utiliza cuentas redondas para puntos, cuentas tubulares alargadas para rayas, y cuentas planas pequeñas para separar letras.</li>
            <li>Para tatuajes: exige a tu tatuador una separación visual clara entre palabras (mediante un espacio doble, un punto flotante o un guion).</li>
            <li>Compara tu plantilla final directamente con el patrón verificado en esta página: <code style={{ color: 'var(--primary)', fontWeight: 700 }}>- . / .- -- ---</code>.</li>
          </ol>
        </div>
      </section>

      {/* What Does 143 Mean? */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          ¿Qué Significa el Número 143 y Es Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          En redes sociales suele circular el número <strong>143</strong> asociado a "I love you". Sin embargo,
          <strong>143 no es código Morse.</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          Se trata de una abreviatura popular originada en la época de los beepers/buscapersonas, basada únicamente en la cantidad de letras por palabra en inglés:
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ background: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--text)', border: '1px solid var(--border)' }}>I = 1 letra</div>
          <div style={{ background: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--text)', border: '1px solid var(--border)' }}>LOVE = 4 letras</div>
          <div style={{ background: 'var(--surface)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700, color: 'var(--text)', border: '1px solid var(--border)' }}>YOU = 3 letras</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Si codificas el número 143 en código Morse, el resultado es una señal numérica (<code style={{ color: 'var(--primary)' }}>.---- ....- ...--</code>),
          la cual no coincide con la auténtica transmisión fonética de la frase.
        </p>
      </section>

      {/* More Romantic Phrases Table */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
          Más Frases Románticas y Afectuosas en Código Morse
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <thead>
              <tr style={{ background: 'var(--surface)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Frase Romántica</th>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Código Morse</th>
                <th style={{ padding: '1rem', color: 'var(--text)' }}>Descripción / Uso</th>
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text)' }}>Audio</th>
              </tr>
            </thead>
            <tbody>
              {ROMANTIC_PHRASES_ES.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--text)' }}>{item.phrase}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{item.morse}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.desc}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handlePlayPhrase(item, idx)}
                      style={{ padding: '0.4rem 0.85rem', background: playingPhraseIndex === idx ? '#ef4444' : 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      {playingPhraseIndex === idx ? <Square size={14} /> : <Play size={14} />} {playingPhraseIndex === idx ? 'Parar' : 'Oír'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle size={22} color="var(--primary)" /> Preguntas Frecuentes sobre "Te Amo" en Código Morse
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
      <section style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(134, 59, 255, 0.1) 100%)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(236, 72, 153, 0.3)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Conclusión Romántica
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
          El código exacto para <strong>"Te amo"</strong> es: <code style={{ color: 'var(--primary)', fontWeight: 800 }}>- . / .- -- ---</code>.
          La precisión en los silencios entre letras y palabras es la clave para que tu mensaje secreto conserve su belleza y legibilidad eternas.
        </p>
        <a
          href="/es/"
          onClick={(e) => handleNav(e, 'spanish', '/es/')}
          style={{ display: 'inline-block', padding: '0.85rem 1.75rem', background: 'linear-gradient(135deg, #ec4899 0%, #863bff 100%)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', textDecoration: 'none' }}
        >
          Traducir Cualquier Frase Romántica Personalizada
        </a>
      </section>
    </article>
  );
}

export default SpanishILoveYouPage;
