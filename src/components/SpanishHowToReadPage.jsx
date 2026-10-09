import React, { useState } from 'react';
import {
  BookOpen, Volume2, Play, Square, Eye, EyeOff, RotateCcw,
  Sparkles, CheckCircle, AlertTriangle, Clock, Radio, Headphones,
  Copy, ExternalLink, HelpCircle, ChevronDown, ChevronUp, Check, ArrowRight, ShieldCheck
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

export function SpanishHowToReadPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  // Practice Drill state
  const [drillLevel, setDrillLevel] = useState('written'); // 'written' | 'audio' | 'words'
  const [targetDrill, setTargetDrill] = useState({ text: 'SOS', morse: '... --- ...' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const writtenDrills = [
    { text: 'SOS', morse: '... --- ...' },
    { text: 'HOLA', morse: '.... --- .-.. .-' },
    { text: 'SOL', morse: '... --- .-..' },
    { text: 'RADIO', morse: '.-. .- -.. .. ---' },
    { text: 'AÑO', morse: '.- --.-- ---' }
  ];

  const audioDrills = [
    { text: 'E', morse: '.' },
    { text: 'T', morse: '-' },
    { text: 'A', morse: '.-' },
    { text: 'N', morse: '-.' },
    { text: 'S', morse: '...' },
    { text: 'O', morse: '---' },
    { text: 'R', morse: '.-.' },
    { text: 'K', morse: '-.-' }
  ];

  const wordDrills = [
    { text: 'HOLA MUNDO', morse: '.... --- .-.. .- / -- ..- -. -.. ---' },
    { text: 'TE AMO', morse: '- . / .- -- ---' },
    { text: '73 DE XE1', morse: '--... ...-- / -.. . / -..- . .----' },
    { text: 'BUENOS DIAS', morse: '-... ..- . -. --- ... / -.. .. .- ...' }
  ];

  const getActiveDrillSet = () => {
    if (drillLevel === 'audio') return audioDrills;
    if (drillLevel === 'words') return wordDrills;
    return writtenDrills;
  };

  const handleNextDrill = () => {
    const list = getActiveDrillSet();
    const nextItem = list[Math.floor(Math.random() * list.length)];
    setTargetDrill(nextItem);
    setIsRevealed(false);
    setUserGuess('');
    setFeedback(null);
  };

  const handleCheckAnswer = () => {
    if (userGuess.trim().toUpperCase() === targetDrill.text.toUpperCase()) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handlePlayDrillAudio = () => {
    setIsPlaying(true);
    const breakdown = targetDrill.text.split('').map((char, idx) => ({
      char,
      morse: targetDrill.morse.split(' ')[idx] || '.-',
      isSpace: char === ' '
    }));

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

  const faqs = [
    {
      q: '¿Cómo se lee el código Morse visualmente frente al auditivo?',
      a: 'La lectura visual implica escanear secuencias de puntos y rayas impresos separando mentalmente los espacios entre letras. La lectura auditiva, en cambio, consiste en reconocer el "contorno rítmico" de los pulsos acústicos (dits y dahs) como una sola palabra sonora sin contar mentalmente los elementos individuales.'
    },
    {
      q: '¿Cómo sé cuándo termina una letra y empieza otra?',
      a: 'En audio, el silencio entre elementos de una misma letra dura 1 unidad (la longitud de 1 punto), mientras que el silencio entre letras distintas dura 3 unidades (la longitud de 1 raya). Ese silencio tres veces más largo marca de forma inequívoca el final de un carácter.'
    },
    {
      q: '¿Por qué la barra inclinada (/) representa un espacio de palabra?',
      a: 'Al transcribir código Morse a mano o en un teclado de texto, dejar múltiples espacios en blanco puede resultar confuso visualmente. La barra diagonal (/) se utiliza universalmente como símbolo convencional para representar la pausa de 7 unidades entre palabras separadas.'
    },
    {
      q: '¿Qué letras causan mayor confusión al empezar a leer Morse?',
      a: 'Las confusiones más habituales ocurren entre pares especulares (letras con patrones inversos): D (-..) y B (-...), K (-.-) y R (.-.), y entre secuencias de sólo puntos como I (..) y S (...), o H (....) y 5 (.....). La solución es entrenar con el audio real para que cada letra tenga su propia identidad melódica.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Cómo Leer Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Cómo Leer Código Morse: Guía Visual y de Oído
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Aprende a descifrar código Morse a simple vista y a reconocer patrones sonoros al oído. Domina las reglas de espaciado, evita las trampas de lectura más comunes y practica con ejercicios interactivos.
        </p>
      </div>

      {/* Interactive Reading Practice Tool */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Entrenador Interactivo: Practica la Lectura de Morse
          </h2>
        </div>

        {/* Level Select */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setDrillLevel('written'); handleNextDrill(); }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: drillLevel === 'written' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: drillLevel === 'written' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Lectura Visual (Palabras Cortas)
          </button>
          <button
            onClick={() => { setDrillLevel('audio'); handleNextDrill(); }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: drillLevel === 'audio' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: drillLevel === 'audio' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Lectura Auditiva (Letras Sueltas)
          </button>
          <button
            onClick={() => { setDrillLevel('words'); handleNextDrill(); }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: drillLevel === 'words' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: drillLevel === 'words' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Mensajes y Frases Reales
          </button>
        </div>

        {/* Drill Exercise Card */}
        <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {drillLevel === 'audio' ? 'Escucha la señal e identifica la letra:' : 'Descifra el siguiente código Morse:'}
          </div>

          {/* Prompt Display */}
          <div style={{ fontSize: '2rem', fontFamily: 'monospace', fontWeight: 800, letterSpacing: '3px', color: 'var(--accent-primary)', marginBottom: '1rem', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {drillLevel === 'audio' ? '🔊 [Señal de Audio]' : targetDrill.morse}
          </div>

          {/* Audio Play Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button
              onClick={handlePlayDrillAudio}
              disabled={isPlaying}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem' }}
            >
              <Volume2 size={16} />
              <span>{isPlaying ? 'Reproduciendo...' : 'Reproducir Audio'}</span>
            </button>
          </div>

          {/* User Input & Verification */}
          <div style={{ display: 'flex', maxWidth: '380px', margin: '0 auto', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Escribe tu respuesta aquí..."
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCheckAnswer(); }}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                textAlign: 'center',
                textTransform: 'uppercase'
              }}
            />
            <button
              onClick={handleCheckAnswer}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1rem' }}
            >
              Comprobar
            </button>
          </div>

          {/* Feedback */}
          {feedback === 'correct' && (
            <div style={{ color: 'var(--success, #10b981)', fontSize: '0.9rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Check size={16} /> ¡Excelente! Respuesta correcta: <strong>{targetDrill.text}</strong>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div style={{ color: 'var(--danger, #ef4444)', fontSize: '0.9rem', marginTop: '0.75rem' }}>
              No es correcto. Inténtalo de nuevo o pulsa en revelar respuesta.
            </div>
          )}
          {isRevealed && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              Respuesta: <strong style={{ color: 'var(--accent-primary)' }}>{targetDrill.text}</strong> ({targetDrill.morse})
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              onClick={() => setIsRevealed(true)}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Revelar respuesta
            </button>
            <button
              onClick={handleNextDrill}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Siguiente ejercicio
            </button>
          </div>
        </div>
      </div>

      {/* Educational Article Section */}
      <section className="article-section" style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Técnicas Esenciales para Leer Código Morse sin Errores
        </h2>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Para leer código Morse con precisión se requiere dominar la relación de tiempos y evitar la traducción visual letra por letra. A continuación, se detallan las pautas metodológicas indispensables:
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
          1. Reconocimiento de Espacios y Delimitadores
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          El error número uno al leer código Morse por escrito es omitir los espacios entre letras. La secuencia <code>...</code> representa la letra S, pero si olvidas los espacios, <code>. . .</code> representa E E E. Comprueba siempre que entre cada carácter haya un espacio regular y entre palabras una barra inclinada <code>/</code>.
        </p>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
          2. Pares Especulares Problemáticos
        </h3>
        <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Muchas letras tienen estructuras inversas que se confunden fácilmente al leer:
        </p>
        <ul style={{ lineHeight: 1.8, fontSize: '0.925rem', color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
          <li><strong>A (.-) frente a N (-.):</strong> El punto precede a la raya en A, mientras que la raya precede al punto en N.</li>
          <li><strong>D (-..) frente a U (..-):</strong> Una raya y dos puntos frente a dos puntos y una raya.</li>
          <li><strong>B (-...) frente a V (...-):</strong> Una raya y tres puntos frente a tres puntos y una raya.</li>
          <li><strong>G (--.) frente a W (.--):</strong> Dos rayas y un punto frente a un punto y dos rayas.</li>
        </ul>
      </section>

      {/* Comprehensive Educational Article Section (Full Parity with English) */}
      <article className="seo-article-container" style={{ marginTop: '2.5rem' }}>
        <div className="article-body-content">

          {/* CÓMO LA TEMPORIZACIÓN AYUDA A LEER */}
          <section className="content-section">
            <h2>Cómo la Temporización Oficial Facilita la Lectura</h2>
            <p>
              El tiempo adquiere una importancia crítica cuando el código Morse se transmite mediante pulsos sonoros, destellos de luz o vibraciones físicas.
            </p>

            <h3>Duración de Puntos y Rayas</h3>
            <p>
              Un punto dura exactamente 1 unidad elemental de tiempo. Una raya dura 3 unidades. En el interior de un mismo carácter, la separación de silencio entre cada señal es de 1 unidad.
            </p>
            <p>
              Por ejemplo, en la letra <strong>A (<code className="morse-font">.-</code>)</strong> escuchas un pulso corto, una pausa breve y un pulso largo sostenido.
            </p>

            <h3>Silencios entre Letras y Palabras</h3>
            <p>
              Un silencio de 3 unidades separa letras consecutivas dentro de la misma palabra. Una pausa de 7 unidades separa palabras diferentes.
            </p>
            <p>
              El silencio forma parte activa del mensaje. Los instructores de telegrafía insisten en que los alumnos principiantes no suelen tropezar identificando puntos y rayas, sino detectando con precisión dónde termina una letra y dónde comienza la siguiente.
            </p>
          </section>

          {/* CÓMO LEER CÓDIGO MORSE ESCRITO */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Leer Código Morse Escrito sobre Papel o Pantalla</h2>
            <p>
              La lectura visual es el punto de inicio más accesible. Sigue esta pauta metódica:
            </p>
            <ol className="content-list" style={{ lineHeight: 1.8, paddingLeft: '1.25rem' }}>
              <li>Lee siempre de izquierda a derecha.</li>
              <li>Separa los caracteres tomando como referencia los espacios en blanco.</li>
              <li>Empareja cada combinación de puntos y rayas con su letra o número correspondiente.</li>
              <li>Presta atención a las barras <code>/</code> que marcan la separación entre palabras.</li>
              <li>Escribe las letras en orden para componer el mensaje en texto claro.</li>
            </ol>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Ejemplo 1: SOS</h4>
                <p className="morse-font" style={{ fontSize: '1.3rem', color: 'var(--accent-primary)', fontWeight: 700 }}>... --- ...</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <code>...</code> (S) + <code>---</code> (O) + <code>...</code> (S) = <strong>SOS</strong>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#10b981' }}>Ejemplo 2: HOLA</h4>
                <p className="morse-font" style={{ fontSize: '1.3rem', color: '#10b981', fontWeight: 700 }}>.... --- .-.. .-</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <code>....</code> (H) + <code>---</code> (O) + <code>.-..</code> (L) + <code>.-</code> (A) = <strong>HOLA</strong>
                </p>
              </div>
            </div>
          </section>

          {/* CÓMO LEER AL OÍDO */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Leer Código Morse al Oído (Recepción Auditiva)</h2>
            <p>
              Interpretar Morse auditivamente es una habilidad neurológica radicalmente distinta a leerlo en una pantalla.
            </p>
            <p>
              Cuando escuchas una señal telegráfica, el sonido se desvanece en cuanto se emite; no puedes detenerte a examinarlo como un texto estático. El objetivo de todo operador consiste en <strong>reconocer el ritmo indivisible de cada carácter</strong> como si fuera una sílaba hablada:
            </p>
            <ul className="content-list" style={{ fontSize: '0.95rem' }}>
              <li><strong>A</strong> = <code className="morse-font">.-</code> → <em>di-dah</em></li>
              <li><strong>N</strong> = <code className="morse-font">-.</code> → <em>dah-dit</em></li>
              <li><strong>S</strong> = <code className="morse-font">...</code> → <em>di-di-dit</em></li>
              <li><strong>O</strong> = <code className="morse-font">---</code> → <em>dah-dah-dah</em></li>
              <li><strong>Ñ</strong> = <code className="morse-font">--.--</code> → <em>dah-dah-di-dah-dah</em></li>
            </ul>
            <p>
              Evita el proceso mental: <em>"escucho un punto... luego una raya... eso es una A"</em>. En su lugar, entrena el oído para asociar directamente: <em>"di-dah" → <strong>A</strong></em>. Al eliminar la traducción visual intermedia, la velocidad de recepción se multiplica de inmediato.
            </p>

            <h3>Comienza con Caracteres de Raíz Sencilla</h3>
            <p>
              El grupo inicial recomendado para comenzar el entrenamiento incluye: <strong>E</strong> (<code>.</code>), <strong>T</strong> (<code>-</code>), <strong>I</strong> (<code>..</code>), <strong>M</strong> (<code>--</code>), <strong>S</strong> (<code>...</code>), <strong>O</strong> (<code>---</code>), <strong>A</strong> (<code>.-</code>) y <strong>N</strong> (<code>-.</code>). Estos patrones breves afianzan la memoria rítmica antes de abordar caracteres de mayor longitud como la J, la Q o la Ñ.
            </p>
          </section>

          {/* TABLA DE RITMOS SONOROS BÁSICOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Tabla de Ritmos Sonoros y Desgloses Desarrollados</h2>
            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Letra</th>
                    <th>Código Morse</th>
                    <th>Ritmo Acústico Fonético</th>
                    <th>Familia Rítmica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>E</strong></td><td><code className="morse-font">.</code></td><td>dit</td><td>Punto único</td></tr>
                  <tr><td><strong>T</strong></td><td><code className="morse-font">-</code></td><td>dah</td><td>Raya única</td></tr>
                  <tr><td><strong>A</strong></td><td><code className="morse-font">.-</code></td><td>di-dah</td><td>Punto inicial</td></tr>
                  <tr><td><strong>N</strong></td><td><code className="morse-font">-.</code></td><td>dah-dit</td><td>Raya inicial (Espejo de A)</td></tr>
                  <tr><td><strong>S</strong></td><td><code className="morse-font">...</code></td><td>di-di-dit</td><td>Trino de 3 puntos</td></tr>
                  <tr><td><strong>O</strong></td><td><code className="morse-font">---</code></td><td>dah-dah-dah</td><td>Trío de 3 rayas</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginTop: '1.5rem' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>Desglose de HOLA MUNDO</h4>
              <p className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>
                .... --- .-.. .- / -- ..- -. -.. ---
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                La barra <code>/</code> delimita las palabras. Lee: (H - O - L - A) [pausa de 7 unidades] (M - U - N - D - O) = <strong>HOLA MUNDO</strong>.
              </p>
            </div>
          </section>

          {/* CÓMO LEER MORSE SIN ESPACIOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Descifrar Código Morse Sin Espacios (Enigmas y Criptografía)</h2>
            <p>
              Cuando te encuentras con una cadena ininterrumpida de puntos y rayas como:
            </p>
            <p className="code-example-box" style={{ fontSize: '1.25rem', color: '#f59e0b', textAlign: 'center' }}>
              ...---...
            </p>
            <p>
              La memoria colectiva la reconoce de inmediato como <strong>SOS</strong>, pero desde el punto de vista matemático, cualquier secuencia sin silencios de separación presenta ambigüedades combinatorias. La secuencia anterior también podría segmentarse como <code>...-</code> (V) + <code>--</code> (M) + <code>...</code> (S) = <strong>VMS</strong>, o <code>.</code> (E) + <code>..</code> (I) + <code>---</code> (O) + <code>...</code> (S) = <strong>EIOS</strong>.
            </p>
            <p>
              Para descifrar mensajes sin espacios en juegos de escape, videojuegos o acertijos, aplica estas estrategias:
            </p>
            <ul className="content-list" style={{ fontSize: '0.9rem' }}>
              <li><strong>Contexto semántico:</strong> Comprueba qué partición forma palabras reales en español coherentes con el tema del juego.</li>
              <li><strong>Límite de 4 elementos por letra:</strong> En el alfabeto latino convencional las letras tienen un máximo de 4 elementos (a excepción de la Ñ que tiene 5), lo que restringe las combinaciones viables.</li>
              <li><strong>Identificación de anclas:</strong> Busca secuencias de 3 rayas seguidas (<code>---</code>) que casi siempre corresponden a la letra O, o series de 4 puntos (<code>....</code>) que indican la letra H.</li>
            </ul>
          </section>

          {/* LOS 4 ERRORES MÁS COMUNES */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Los 4 Errores Más Frecuentes al Leer Código Morse</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>1. Contar Puntos y Rayas uno a uno</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Contar mentalmente "un punto, dos puntos, tres puntos" satura la memoria de trabajo y crea un bloqueo insalvable a partir de 6 WPM. Acostúmbrate a percibir la cadencia rítmica global.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>2. Ignorar las Pausas Inter-Letra</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  El silencio entre letras no es una pausa pasiva: es la frontera que define el carácter. Sin el silencio de 3 unidades, dos letras separadas se fusionan en un signo irreconocible.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>3. Omitir los Separadores de Palabra</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  En texto escrito, la barra diagonal (<code>/</code>) cumple la función del espacio entre palabras. Si no la incluyes al escribir o descifrar, las oraciones se convierten en bloques continuos difíciles de interpretar.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>4. Adivinar Patrones Desconocidos</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Si una secuencia no concuerda con ninguna letra de la tabla, no inventes un carácter. Comprueba si se te escapó un punto, si alargaste una pausa o si dividiste erróneamente un carácter compuesto.
                </p>
              </div>
            </div>
          </section>

          {/* CÓMO LEER MÁS RÁPIDO Y RUTINA DE 15 MINUTOS */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Rutina Diaria de 15 Minutos para Leer Morse con Fluidez</h2>
            <p>
              La velocidad nace de la automatización refleja. La progresión óptima demostrada es:
            </p>
            <p className="code-example-box" style={{ textAlign: 'center', fontWeight: 700, color: 'var(--accent-primary)' }}>
              Letras individuales → Grupos cortos → Palabras comunes → Oraciones → Audio continuo
            </p>

            <div className="table-responsive" style={{ marginTop: '1.25rem' }}>
              <table className="seo-table">
                <thead>
                  <tr>
                    <th>Bloque de Entrenamiento</th>
                    <th>Tiempo Sugerido</th>
                    <th>Objetivo Operativo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Repaso de caracteres nuevos</strong></td><td>2 minutos</td><td>Reconocimiento visual en tabla.</td></tr>
                  <tr><td><strong>Escucha de letras individuales</strong></td><td>5 minutos</td><td>Asimilación de la melodía rítmica al oído.</td></tr>
                  <tr><td><strong>Lectura de palabras breves</strong></td><td>5 minutos</td><td>Unión de grupos de 2 a 4 caracteres.</td></tr>
                  <tr><td><strong>Descifrado de mensaje real</strong></td><td>3 minutos</td><td>Decodificación completa y verificación con traductor.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* TRES PASOS DE VERIFICACIÓN */}
          <section className="content-section" style={{ marginTop: '2.5rem' }}>
            <h2>Cómo Verificar si Has Leído el Código Correctamente</h2>
            <p>
              Cuando descifras un mensaje manualmente, aplica estas tres pruebas de verificación:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>1. Límites de Carácter</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Asegúrate de que cada grupo corresponda exactamente a una letra o número válido según la norma ITU-R M.1677-1.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>2. Coherencia Textual</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Comprueba si el texto resultante forma palabras lógicas y gramaticalmente correctas en español.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>3. Prueba de Ida y Vuelta</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Introduce el texto descifrado en el traductor para comprobar si regenera los puntos y rayas originales con total exactitud.
                </p>
              </div>
            </div>
          </section>

          {/* Cross-linking cards */}
          <section style={{ marginTop: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Decodificador Morse
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Inspecciona secuencias complejas con visualización de tokens y advertencia de espacios.
                </p>
                <a
                  href="/es/morse-code-decoder/"
                  onClick={(e) => handleNav(e, 'es-morsedecoder', '/es/morse-code-decoder/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Abrir decodificador</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Cómo Aprender Morse
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Guía completa con los métodos Koch y Farnsworth para interiorizar los ritmos al oído.
                </p>
                <a
                  href="/es/learn-morse-code/"
                  onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ver guía de estudio</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Tabla del Alfabeto
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Consulta las 26 letras, la letra Ñ y los números con reproducción de audio individual.
                </p>
                <a
                  href="/es/morse-code-alphabet/"
                  onClick={(e) => handleNav(e, 'es-alphabet', '/es/morse-code-alphabet/')}
                  style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ver tabla de letras</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions (Comprehensive 8 Questions) */}
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Preguntas Frecuentes sobre Cómo Leer Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: '¿Cómo se lee el código Morse visualmente frente al auditivo?',
                  a: 'La lectura visual implica escanear secuencias de puntos y rayas impresos separando mentalmente los espacios entre letras. La lectura auditiva, en cambio, consiste en reconocer el contorno rítmico de los pulsos acústicos (dits y dahs) como una sola palabra sonora sin contar mentalmente los elementos individuales.'
                },
                {
                  q: '¿Cómo sé cuándo termina una letra y empieza otra?',
                  a: 'En audio, el silencio entre elementos de una misma letra dura 1 unidad (la longitud de 1 punto), mientras que el silencio entre letras distintas dura 3 unidades (la longitud de 1 raya). Ese silencio tres veces más largo marca de forma inequívoca el final de un carácter.'
                },
                {
                  q: '¿Por qué la barra inclinada (/) representa un espacio de palabra?',
                  a: 'Al transcribir código Morse a mano o en un teclado de texto, dejar múltiples espacios en blanco puede resultar confuso visualmente. La barra diagonal (/) se utiliza universalmente como símbolo convencional para representar la pausa de 7 unidades entre palabras separadas.'
                },
                {
                  q: '¿Qué letras causan mayor confusión al empezar a leer Morse?',
                  a: 'Las confusiones más habituales ocurren entre pares especulares (letras con patrones inversos): D (-..) y U (..-), B (-...) y V (...-), G (--.) y W (.--), y K (-.-) con R (.-.). La solución es entrenar con el audio real para que cada letra tenga su propia identidad melódica.'
                },
                {
                  q: '¿Es mejor leer el código Morse por la vista o por el oído?',
                  a: 'La lectura visual es adecuada para descifrar notas escritas o enigmas. Sin embargo, si tu meta es comunicarte por radioafición CW o salvamento marítimo, la lectura al oído es imprescindible, ya que los sonidos en directo no pueden pausarse.'
                },
                {
                  q: '¿Cómo se lee la letra Ñ en código Morse?',
                  a: 'La letra Ñ se lee como dos rayas, un punto y dos rayas (--.--). Su sonido rítmico se pronuncia dah-dah-di-dah-dah.'
                },
                {
                  q: '¿Por qué no se debe memorizar contando puntos y rayas?',
                  a: 'Contar mentalmente obliga al cerebro a hacer una conversión matemática lenta que colapsa ante velocidades superiores a 6 WPM. Aprender la melodía global permite el reconocimiento instantáneo e inconsciente.'
                },
                {
                  q: '¿Cuánto tiempo se tarda en leer código Morse con soltura?',
                  a: 'Dedicando 15 a 20 minutos diarios con el método Koch y espaciado Farnsworth, la mayoría de los estudiantes pueden leer el alfabeto completo al oído a una velocidad de 12 a 15 WPM en aproximadamente 4 a 6 semanas.'
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

          {/* Privacy Notice */}
          <div style={{ margin: '2.5rem 0 1rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldCheck size={32} style={{ color: '#10b981', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>Aviso de Privacidad y Procesamiento en el Cliente</h4>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Toda la traducción, síntesis de audio Web Audio API y ejercicios de entrenamiento se procesan localmente en tu navegador sin enviar datos a servidores externos.
              </p>
            </div>
          </div>

          {/* CTA Banner */}
          <section className="content-section cta-banner" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-elevated, rgba(255,255,255,0.03))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Domina la Lectura de Código Morse Hoy Mismo
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Aplica lo aprendido en nuestra plataforma interactiva: traduce mensajes, comprueba tus lecturas y genera audios personalizados en tiempo real.
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
                href="/es/learn-morse-code/"
                onClick={(e) => handleNav(e, 'es-learn', '/es/learn-morse-code/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Guía para Aprender Morse</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

        </div>
      </article>
    </div>
  );
}
