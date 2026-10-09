import React, { useState } from 'react';
import {
  BookOpen, HelpCircle, Volume2, ShieldAlert,
  Radio, CheckCircle2, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';
import { SPANISH_EXTENDED_MAP } from '../engine/spanishMorse.js';
import { audioEngine } from '../engine/audioEngine.js';

export function SpanishArticleContent({ setActiveTab, wpm = 20, frequency = 600, volume = 0.5, onSelectExample }) {
  const [openFaq, setOpenFaq] = useState(null);

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

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const playCharSound = (char, morse) => {
    audioEngine.playSequence({
      breakdown: [{ char, morse }],
      wpm,
      frequency,
      volume
    });
  };

  // Full Spanish Alphabet list: A-Z + Ñ
  const alphabetItems = [
    { char: 'A', morse: '.-', name: 'Alpha', note: 'Estándar ITU' },
    { char: 'B', morse: '-...', name: 'Bravo', note: 'Estándar ITU' },
    { char: 'C', morse: '-.-.', name: 'Charlie', note: 'Estándar ITU' },
    { char: 'D', morse: '-..', name: 'Delta', note: 'Estándar ITU' },
    { char: 'E', morse: '.', name: 'Echo', note: 'Estándar ITU' },
    { char: 'F', morse: '..-.', name: 'Foxtrot', note: 'Estándar ITU' },
    { char: 'G', morse: '--.', name: 'Golf', note: 'Estándar ITU' },
    { char: 'H', morse: '....', name: 'Hotel', note: 'Estándar ITU' },
    { char: 'I', morse: '..', name: 'India', note: 'Estándar ITU' },
    { char: 'J', morse: '.---', name: 'Juliett', note: 'Estándar ITU' },
    { char: 'K', morse: '-.-', name: 'Kilo', note: 'Estándar ITU' },
    { char: 'L', morse: '.-..', name: 'Lima', note: 'Estándar ITU' },
    { char: 'M', morse: '--', name: 'Mike', note: 'Estándar ITU' },
    { char: 'N', morse: '-.', name: 'November', note: 'Estándar ITU' },
    { char: 'Ñ', morse: '--.--', name: 'Eñe', note: 'Extensión española / ITU normalización: N (-.)' },
    { char: 'O', morse: '---', name: 'Oscar', note: 'Estándar ITU' },
    { char: 'P', morse: '.--.', name: 'Papa', note: 'Estándar ITU' },
    { char: 'Q', morse: '--.-', name: 'Quebec', note: 'Estándar ITU' },
    { char: 'R', morse: '.-.', name: 'Romeo', note: 'Estándar ITU' },
    { char: 'S', morse: '...', name: 'Sierra', note: 'Estándar ITU' },
    { char: 'T', morse: '-', name: 'Tango', note: 'Estándar ITU' },
    { char: 'U', morse: '..-', name: 'Uniform', note: 'Estándar ITU' },
    { char: 'V', morse: '...-', name: 'Victor', note: 'Estándar ITU' },
    { char: 'W', morse: '.--', name: 'Whiskey', note: 'Estándar ITU' },
    { char: 'X', morse: '-..-', name: 'X-ray', note: 'Estándar ITU' },
    { char: 'Y', morse: '-.--', name: 'Yankee', note: 'Estándar ITU' },
    { char: 'Z', morse: '--..', name: 'Zulu', note: 'Estándar ITU' }
  ];

  // Numbers 0-9
  const numberItems = [
    { char: '0', morse: '-----' },
    { char: '1', morse: '.----' },
    { char: '2', morse: '..---' },
    { char: '3', morse: '...--' },
    { char: '4', morse: '....-' },
    { char: '5', morse: '.....' },
    { char: '6', morse: '-....' },
    { char: '7', morse: '--...' },
    { char: '8', morse: '---..' },
    { char: '9', morse: '----.' }
  ];

  // Common Punctuation
  const punctuationItems = [
    { char: 'Punto (.)', morse: '.-.-.-' },
    { char: 'Coma (,)', morse: '--..--' },
    { char: 'Signo de interrogación (?)', morse: '..--..' },
    { char: 'Barra inclinada (/)', morse: '-..-.' },
    { char: 'Guion (-)', morse: '-....-' },
    { char: 'Igual (=)', morse: '-...-' },
    { char: 'Signo de exclamación (!)', morse: '-.-.--' },
    { char: 'Señal de emergencia SOS (<SOS>)', morse: '...---...' }
  ];

  const faqs = [
    {
      q: '¿Cómo se traducen los caracteres españoles (Ñ, Á, É, Í, Ó, Ú) en código Morse?',
      a: 'La Unión Internacional de Telecomunicaciones (ITU-R M.1677-1) define oficialmente solo las 26 letras latinas básicas (A–Z). Por ello, en la comunicación Morse internacional, los caracteres especiales del español se normalizan generalmente a su equivalente latino más cercano (Á→A, É→E, Í→I, Ó→O, Ú→U, Ü→U, Ñ→N). Sin embargo, existe una convención de extensión para la letra Ñ con el código --.--, documentada en referencias de telegrafía histórica. Nuestro traductor admite ambos enfoques: normalización estándar ITU y extensión española para Ñ.'
    },
    {
      q: '¿Cómo se deben dejar los espacios entre letras y palabras en código Morse?',
      a: 'El código Morse sigue reglas de temporización estrictas: entre los símbolos dentro de una letra hay 1 unidad, entre dos letras diferentes hay 3 unidades (en texto: 1 espacio estándar), y entre dos palabras diferentes hay 7 unidades (en texto: barra "/" o 3 espacios). El código Morse escrito sin espacios provoca ambigüedad y no puede decodificarse correctamente.'
    },
    {
      q: '¿Por qué el código Morse sin espacios no se puede decodificar correctamente?',
      a: 'Porque el código Morse es un código de longitud variable. Por ejemplo, la secuencia "..." puede ser la letra "S" sola. Pero si no se dejan espacios entre letras, la misma secuencia podría interpretarse como "EEE" (tres letras E), "EI" o "IE". El decodificador necesita espacios entre letras para identificar los límites de cada carácter.'
    },
    {
      q: '¿Cuál es la diferencia entre "SOS" y la señal de emergencia continua (<SOS>)?',
      a: 'Cuando se escribe como letras separadas "S O S", hay espacios de 3 unidades entre ellas (... --- ...). Sin embargo, la señal internacional de emergencia marítima y de radio <SOS> se transmite como un solo símbolo continuo (prosign) sin espacios entre letras (...---...). Nuestro traductor reconoce ambos usos correctamente.'
    },
    {
      q: '¿Puedo descargar el código Morse como archivo de audio (WAV)?',
      a: 'Sí. Después de ingresar tu texto o código Morse, haz clic en el botón "Descargar WAV" en la barra de herramientas para descargar la señal Morse generada como un archivo de audio WAV estándar de 44.1 kHz directamente a tu computadora o teléfono.'
    },
    {
      q: '¿Para qué sirven los ajustes WPM y Farnsworth?',
      a: 'WPM (Words Per Minute) representa el número de palabras estándar transmitidas por minuto (estándar PARIS = 50 unidades de punto). El ajuste Farnsworth mantiene la velocidad interna de las letras alta mientras alarga el tiempo de espera entre letras y palabras. Este método ayuda a los principiantes a memorizar las letras auditivamente como una melodía en lugar de contar puntos y rayas.'
    }
  ];

  return (
    <div className="article-container" style={{ marginTop: '3.5rem' }}>
      {/* SECTION 1: How to use the tool */}
      <section className="article-section">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          ¿Cómo usar el traductor de código Morse?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Nuestro traductor de código Morse en línea utiliza la Web Audio API de tu navegador para ofrecer una experiencia de traducción bidireccional, instantánea y enfocada en la privacidad. Ningún texto que escribas se envía a un servidor externo; toda la codificación y generación de audio ocurre directamente en tu dispositivo.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              1. Convertir texto a código Morse
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Escribe o pega una frase en español u otro idioma en el cuadro de texto. El traductor convertirá instantáneamente los caracteres a puntos (.) y guiones (-) de Morse. Puedes copiar el resultado con un clic o escucharlo con el botón <strong>Reproducir audio</strong>.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--signal)' }}>
              2. Decodificar código Morse a texto
            </h3>
            <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              Pega tu secuencia de código Morse en el campo de entrada. Asegúrate de usar un espacio entre letras y <code>/</code> o 3 espacios entre palabras. La herramienta detectará automáticamente el código Morse y lo traducirá a texto español/latino.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Spanish Character Handling Rules */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          ¿Cómo se manejan los caracteres españoles (Ñ, Á, É, Í, Ó, Ú) en código Morse?
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          La pregunta más frecuente para quienes aprenden y usan el código Morse es cómo transmitir los caracteres especiales del español en el sistema internacional. La recomendación <strong>ITU-R M.1677-1</strong> de la Unión Internacional de Telecomunicaciones define el código Morse básico a través de las 26 letras latinas del inglés.
        </p>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldAlert size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>Norma ITU estándar (normalización):</strong>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                En comunicaciones Morse internacionales, las vocales con tilde se normalizan a su letra base (Á→A, É→E, Í→I, Ó→O, Ú→U, Ü→U). La letra Ñ se convierte a N. Esto garantiza que cualquier operador Morse del mundo pueda decodificar tu mensaje, pero pierde la ortografía original. La decodificación inversa no puede recuperar los acentos o la Ñ.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Radio size={20} style={{ color: 'var(--signal)', flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>Extensión española (modo extendido):</strong>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Existe una convención histórica documentada para la letra Ñ con el código <code>--.--</code>. Este modo usa ese código especial mientras las vocales con tilde siguen normalizadas al estándar ITU (ya que no tienen códigos únicos oficiales). Útil para comunicaciones en español donde ambos interlocutores reconocen la extensión.
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '1.25rem' }}>
          <strong>Nota importante:</strong> El código Morse internacional solo define oficialmente la letra E acentuada (É) como "accented e" con el código <code>..-..</code>. Los acentos en Á, Í, Ó, Ú no tienen códigos únicos oficiales y deben normalizarse. La �Ñ tiene una convención extendida pero no es parte del estándar ITU core.
        </p>
      </section>

      {/* SECTION 3: Alphabet Reference */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Alfabeto Morse español: letras A–Z y Ñ
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Tabla de referencia rápida del alfabeto Morse internacional con la letra �Ñ incluida. Haz clic en cualquier letra para escuchar su sonido.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {alphabetItems.map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onClick={() => playCharSound(item.char, item.morse)}
              title={`Reproducir sonido de ${item.char}`}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {item.char}
              </div>
              <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: 'var(--text)', marginBottom: '0.25rem' }}>
                {item.morse}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {item.note}
              </div>
              <div style={{ marginTop: '0.5rem', color: 'var(--accent-primary)' }}>
                <Volume2 size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Numbers Reference */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Números Morse: 0–9
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Los números en código Morse tienen exactamente 5 símbolos cada uno, siguiendo un patrón escalonado.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {numberItems.map((item) => (
            <div
              key={item.char}
              className="glass-panel"
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
              onClick={() => playCharSound(item.char, item.morse)}
              title={`Reproducir sonido de ${item.char}`}
            >
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {item.char}
              </div>
              <div style={{ fontSize: '1rem', fontFamily: 'monospace', color: 'var(--text)' }}>
                {item.morse}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4.5: Guías y Herramientas Especializadas en Español */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>
          Herramientas y Guías Especializadas de Código Morse en Español
        </h2>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Explora nuestra colección completa de herramientas interactivas, tablas oficiales y módulos de aprendizaje diseñados para hispanohablantes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <a
            href="/es/morse-code-alphabet/"
            onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Alfabeto Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Tabla auditiva de la A a la Z más la letra Ñ (--.--). Ejemplos mnemotécnicos y audio interactivo.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-numbers/"
            onClick={(e) => handleNav(e, 'es-numbers', '/es/morse-code-numbers/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Números en Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Reglas simétricas de 5 elementos del 0 al 9, números abreviados de concurso y ejercicios de audio.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-decoder/"
            onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Decodificador de Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Traduce puntos y rayas a texto español. Detección de ambigüedades y diagnóstico de espacios.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-audio-translator/"
            onClick={(e) => handleNav(e, 'es-audiotranslator', '/es/morse-code-audio-translator/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Traductor de Audio Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Genera tonos de audio personalizables y decodifica archivos de audio locales (WAV, MP3, OGG).
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-practice/"
            onClick={(e) => handleNav(e, 'es-practice', '/es/morse-code-practice/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Práctica Auditiva (Trainer)
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Entrena tu oído con velocidad de caracteres, espaciado Farnsworth, rachas y banco de errores.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-keyer/"
            onClick={(e) => handleNav(e, 'es-keyer', '/es/morse-code-keyer/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Manipulador Telegráfico (Keyer)
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Transmite con tu teclado o pantalla táctil usando manipulador manual o iámbico con temporizador.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-image-decoder/"
            onClick={(e) => handleNav(e, 'es-imagedecoder', '/es/morse-code-image-decoder/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Decodificador de Imagen
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Reconoce puntos y rayas visibles en capturas de pantalla o diagramas mediante Canvas en tu navegador.
              </p>
            </div>
          </a>

          <a
            href="/es/learn-morse-code/"
            onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Aprender Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Plan de estudio en 4 semanas basado en el método Koch y el espaciado Farnsworth.
              </p>
            </div>
          </a>

          <a
            href="/es/how-to-read-morse-code/"
            onClick={(e) => handleNav(e, 'es-howtoread', '/es/how-to-read-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Cómo Leer Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Aprende a interpretar señales escritas, destellos de luz intermitentes y sonidos telegráficos.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-symbols/"
            onClick={(e) => handleNav(e, 'es-symbols', '/es/morse-code-symbols/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Símbolos y Puntuación
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Guía completa de puntuación, signos de interrogación y exclamación, y prosigns de radioafición.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-phrases/"
            onClick={(e) => handleNav(e, 'es-phrases', '/es/morse-code-phrases/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Frases en Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Frases en español listas para copiar: Hola Mundo, Te Amo, Feliz Cumpleaños, Gracias y más.
              </p>
            </div>
          </a>

          <a
            href="/es/sos-in-morse-code/"
            onClick={(e) => handleNav(e, 'es-sos', '/es/sos-in-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                SOS en Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                La señal internacional de auxilio marítimo (...---...). Historia de la Convención de Berlín de 1906.
              </p>
            </div>
          </a>

          <a
            href="/es/i-love-you-in-morse-code/"
            onClick={(e) => handleNav(e, 'es-iloveyou', '/es/i-love-you-in-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Te Amo en Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Traducción directa de TE AMO (- . / .- -- ---) e I LOVE YOU, ideas para pulseras y regalos.
              </p>
            </div>
          </a>

          <a
            href="/es/what-is-morse-code/"
            onClick={(e) => handleNav(e, 'es-whatismorse', '/es/what-is-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                ¿Qué es el Código Morse?
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Fundamentos técnicos de la codificación binaria temprana, temporización y aplicaciones contemporáneas.
              </p>
            </div>
          </a>

          <a
            href="/es/history-of-morse-code/"
            onClick={(e) => handleNav(e, 'es-history', '/es/history-of-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Historia del Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                De Samuel Morse y Alfred Vail en 1844 al Titanic, la Segunda Guerra Mundial y el estándar ITU actual.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-amateur-radio/"
            onClick={(e) => handleNav(e, 'es-amateurradio', '/es/morse-code-amateur-radio/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Morse en Radioafición (CW)
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Guía de operaciones de onda continua (CW), código Q (QTH, QSL, QSO), RST y bandas HF para IARU R2.
              </p>
            </div>
          </a>

          <a
            href="/es/morse-code-to-english/"
            onClick={(e) => handleNav(e, 'es-morse2english', '/es/morse-code-to-english/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Morse a Texto / Español
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Traductor enfocado exclusivamente en decodificar código Morse recibido a texto legible.
              </p>
            </div>
          </a>

          <a
            href="/es/english-to-morse-code/"
            onClick={(e) => handleNav(e, 'es-english2morse', '/es/english-to-morse-code/')}
            style={{ textDecoration: 'none', color: 'inherit' }}
            className="glass-panel"
          >
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', height: '100%', border: '1px solid var(--border)' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--primary)', display: 'block', marginBottom: '0.35rem' }}>
                Texto a Código Morse
              </strong>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Traductor especializado en codificar texto en español a señales de puntos y rayas con audio.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
          Preguntas frecuentes sobre el código Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '1.25rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left'
                }}
                aria-expanded={openFaq === idx}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                  {faq.q}
                </span>
                {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {openFaq === idx && (
                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', paddingTop: '1rem' }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6: Privacy Note */}
      <section className="article-section" style={{ marginTop: '3.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--signal)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>Privacidad 100% del lado del cliente</strong>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Este traductor procesa todo el texto y genera el audio Morse directamente en tu navegador. No enviamos tu contenido a ningún servidor. Tu privacidad está protegida por diseño. Todas las funciones de traducción, audio y descarga funcionan completamente offline después de cargar la página.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
