import React, { useState } from 'react';
import {
  Clock, BookOpen, ShieldCheck, Zap, Award, ExternalLink, Radio,
  ChevronDown, ChevronUp, Play, Square, Volume2, Copy, Check, ArrowRight,
  Sparkles, Compass, AlertCircle, FileText, Globe, Anchor
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function SpanishHistoryPage({ setActiveTab, showToast, wpm = 20, frequency = 600, volume = 0.5 }) {
  const [playingId, setPlayingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Reproductor de fragmentos de audio
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

  const timelineEvents = [
    { year: 'Década 1830', title: 'Concepción del Telégrafo y el Código', desc: 'Samuel Morse inicia sus experimentos tras quedar fascinado por el electromagnetismo y la necesidad de comunicar noticias a larga distancia.' },
    { year: '1837', title: 'Alianza entre Morse, Vail y Gale', desc: 'Morse se asocia con el talentoso mecánico Alfred Vail y el profesor Leonard Gale para construir aparatos telegráficos viables.' },
    { year: '1838', title: 'Primera Demostración y Código Alfabético', desc: 'Morse y Vail demuestran la transmisión eléctrica por cables; Vail diseña el sistema alfabético basado en la frecuencia de las letras en una imprenta.' },
    { year: '1844', title: 'Histórico Primer Despacho Telegráfico', desc: 'Samuel Morse emite "What hath God wrought?" desde el Capitolio de Washington D.C. hasta Alfred Vail en Baltimore el 24 de mayo.' },
    { year: '1848', title: 'Revisión Continental de Gerke', desc: 'Friedrich Clemens Gerke perfecciona el código en Alemania, eliminando las pausas internas dentro de los caracteres para facilitar la recepción de oído.' },
    { year: 'Década 1850', title: 'Expansión Fulgurante de Redes', desc: 'Miles de kilómetros de líneas telegráficas unen las principales ciudades de Europa y América, revolucionando el comercio y la prensa.' },
    { year: '1858', title: 'Primer Cable Submarino Transatlántico', desc: 'Se tiende el primer cable submarino que enlaza Irlanda con Terranova, reduciendo las noticias de semanas a minutos antes de sufrir fallos técnicos.' },
    { year: '1865', title: 'Estandarización Internacional y Nacimiento de la ITU', desc: 'Veinte naciones se reúnen en París para adoptar el Código Morse Internacional y fundar la Unión Telegráfica Internacional (hoy UIT/ITU).' },
    { year: '1866', title: 'Cable Transatlántico Permanente', desc: 'El buque SS Great Eastern completa con éxito un cable transatlántico robusto que inaugura el servicio intercontinental ininterrumpido.' },
    { year: '1895–1901', title: 'Marconi y la Telegrafía Sin Hilos (Radio)', desc: 'Guglielmo Marconi demuestra la transmisión de Morse por ondas electromagnéticas en el éter, culminando en el enlace transatlántico de 1901.' },
    { year: '1906', title: 'Adopción del SOS como Socorro Universal', desc: 'La Conferencia de Berlín estandariza el prosign continuo "... --- ..." para la seguridad marítima internacional, superando al código Marconi CQD.' },
    { year: '1912', title: 'Catástrofe del Titanic y Leyes de Radio', desc: 'El Titanic emite socorro por radio y salva 700 vidas. La catástrofe desencadena leyes mundiales que exigen guardias de radio 24 horas a bordo de buques.' },
    { year: 'Siglo XX', title: 'Rol Estratégico Militar y Aviación', desc: 'El código Morse resulta vital en las dos Guerras Mundiales, la resistencia contra la ocupación y la radionavegación aérea.' },
    { year: '1999', title: 'Transición al Sistema Satelital GMDSS', desc: 'La Organización Marítima Internacional sustituye el Morse obligatorio en buques mercantes por el sistema satelital automatizado GMDSS.' },
    { year: 'Actualidad', title: 'Vigencia en Radioafición (CW) y Defensa', desc: 'Más de 3 millones de radioaficionados en el mundo utilizan telegrafía CW a diario, y la UIT mantiene en vigor la Recomendación ITU-R M.1677-1.' }
  ];

  const faqs = [
    {
      q: '¿Quién inventó realmente el código Morse?',
      a: 'Samuel F. B. Morse concibió la idea general del telégrafo eléctrico y lideró su financiación e implantación comercial. Sin embargo, su socio Alfred Vail desempeñó un papel técnico fundamental: diseñó el mecanismo de grabación sobre cinta y creó el sistema de asignación alfabética de puntos y rayas, tras contabilizar cuántas veces aparecía cada letra en las cajas de tipos de imprenta de Nueva Jersey. Los archivos del Instituto Smithsonian reconocen formalmente la contribución determinante de Vail.'
    },
    {
      q: '¿Cuándo se inventó el código Morse?',
      a: 'El sistema fue gestándose de forma progresiva a lo largo de las décadas de 1830 y 1840. Aunque las primeras patentes y prototipos se presentaron entre 1837 y 1838, su consagración pública definitiva tuvo lugar el 24 de mayo de 1844 con la inauguración de la línea entre Washington D.C. y Baltimore.'
    },
    {
      q: '¿Cuál fue el primer mensaje oficial transmitido en código Morse?',
      a: 'El primer despacho telegráfico oficial fue la frase en inglés: "What hath God wrought?" («¿Qué no habrá hecho Dios?», extraída del Libro de Números 23:23). Samuel Morse la transmitió desde el Capitolio de Washington D.C. y Alfred Vail la recibió en la estación ferroviaria de Baltimore. La cinta de papel perforada original se preserva en la Biblioteca del Congreso de EE. UU.'
    },
    {
      q: '¿Por qué el código Morse original (americano) era diferente del internacional?',
      a: 'El código original desarrollado por Samuel Morse y Alfred Vail (conocido como American Morse o Railroad Morse) contenía espacios internos dentro de una misma letra (como en la letra C, que se emitía ". .", o en la O, ". .") y rayas de distinta longitud. Cuando la telegrafía llegó a Europa en 1848, el ingeniero Friedrich Clemens Gerke rediseñó el abecedario para que las letras fueran continuas y perfectamente comprensibles al oído sin depender de cintas de papel. Esa versión revisada fue adoptada por la UIT en París en 1865 como el Código Morse Internacional.'
    },
    {
      q: '¿Qué papel desempeñó el código Morse en el hundimiento del Titanic?',
      a: 'En la trágica noche del 14 al 15 de abril de 1912, los radiotelegrafistas del Titanic, Jack Phillips y Harold Bride, transmitieron repetidamente las señales de socorro "CQD" y el nuevo "SOS" vía telegrafía inalámbrica Marconi. La señal fue captada por el buque RMS Carpathia a 58 millas de distancia, lo que permitió rescatar a más de 700 supervivientes de los botes salvavidas. El desastre obligó a regular la radioescucha ininterrumpida las 24 horas en todos los barcos de alta mar.'
    },
    {
      q: '¿Sigue utilizándose el código Morse en la actualidad?',
      a: 'Sí. Aunque en 1999 la marina mercante abandonó la telegrafía obligatoria en favor de satélites GMDSS y en 2007 la FCC y otras agencias eliminaron el requisito de Morse para obtener licencias de radioaficionado, la modalidad CW sigue sumamente activa. Cientos de miles de operadores transmiten a diario en bandas de onda corta porque el Morse atraviesa ruidos y tormentas solares donde la voz humana resulta incomprensible.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Navegación Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Historia del Código Morse</span>
      </nav>

      {/* Cabecera y Título */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Clock size={16} /> Cronología Histórica y Evolución Tecnológica
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Historia del Código Morse: Del Telégrafo a la Radio Moderna
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Descubre la historia completa del código Morse: Samuel Morse, Alfred Vail, el primer telegrama de 1844, la estandarización de la UIT, el Titanic, los cables transatlánticos y su vigencia en la radioafición.
        </p>
      </header>

      {/* Resumen Ejecutivo Destacado (Answer-First) */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Resumen Ejecutivo
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          El <strong>código Morse</strong> nació ligado a la invención del telégrafo electromagnético durante las <strong>décadas de 1830 y 1840</strong>. Proporcionó a los operadores la primera solución práctica de la historia para transmitir letras y cifras mediante impulsos eléctricos discretos. Samuel F. B. Morse lideró el proyecto y su financiación, mientras que Alfred Vail ideó el código alfabético optimizado y la maquinaria mecánica.{' '}
          <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Archivos del Instituto Smithsonian]
          </a>
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          La historia del código Morse narra la transformación de las telecomunicaciones globales: desde los primeros tendidos de cobre hasta los cables transatlánticos submarinos, la radio de Marconi, el auxilio del Titanic y la estandarización continental por parte de la UIT en 1865.{' '}
          <a href="https://www.loc.gov/collections/samuel-morse-papers/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Colección de Manuscritos de la Biblioteca del Congreso de EE. UU.]
          </a>
        </p>
      </div>

      {/* Sección 1: Por Qué se Creó el Código Morse */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> ¿Por Qué se Creó el Código Morse?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Antes de la invención del telégrafo eléctrico, las noticias a larga distancia viajaban a lomos de caballo, en diligencia o en barco de vela. Un mensaje urgente entre dos continentes tardaba semanas en llegar a destino. Los semáforos ópticos mecánicos construidos en colinas aceleraban la transmisión en buenas condiciones, pero quedaban inutilizados durante la noche, en días de niebla o con tormenta.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El telégrafo eléctrico abrió un horizonte revolucionario: transmitir información física a través de cables metálicos prácticamente a la velocidad de la luz.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          No obstante, conectar un cable con corriente solo resolvía la mitad del problema. Se requería un código universal que codificara los caracteres del lenguaje humano mediante encendido y apagado de corriente. Esa necesidad fue resuelta magistralmente por Samuel Morse y sus colaboradores.{' '}
          <a href="https://www.itu.int/en/history/Pages/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            [Registros Históricos de la UIT]
          </a>
        </p>
      </section>

      {/* Sección 2: Samuel Morse y Alfred Vail */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award style={{ color: 'var(--accent-primary)' }} /> Samuel Morse y Alfred Vail: La Alianza Decisiva
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Samuel Finley Breese Morse era un reputado pintor retratista en Estados Unidos. En 1825, mientras pintaba un retrato del Marqués de Lafayette en Washington, su esposa enfermó de gravedad en New Haven. Debido a la lentitud del correo a caballo, la carta avisándole tardó días en llegar; cuando Morse arribó a su casa, su esposa ya había fallecido y recibido sepultura. Aquella tragedia personal lo obsesionó con la idea de comunicar mensajes instantáneamente.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En 1837, Morse selló una alianza histórica con el joven maquinista e ingeniero mecánico <strong>Alfred Vail</strong> y el profesor <strong>Leonard Gale</strong> en las forjas de Speedwell Ironworks en Morristown, Nueva Jersey.
        </p>

        {/* Tarjeta de Evidencia Documental del Instituto Smithsonian */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Evidencia Histórica Documentada en Archivos Primarios</div>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
            Los archivos del Instituto Smithsonian atestiguan la colosal contribución de Alfred Vail tanto al manipulador mecánico como a la creación del alfabeto telegráfico. Vail visitó talleres locales de imprenta para cuantificar la frecuencia de aparición de cada letra en el alfabeto, otorgando los patrones más cortos y rápidos de telegrafiar a las letras más comunes, como <strong>E (<code>.</code>)</strong> y <strong>T (<code>-</code>)</strong>.{' '}
            <a href="https://siarchives.si.edu/collections/siris_sic_13782" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>
              [Archivos del Instituto Smithsonian]
            </a>
          </p>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          El veredicto de la historiografía científica contemporánea es claro: Samuel Morse fue el visionario, promotor y estratega del proyecto, mientras que Alfred Vail fue el genio de la ingeniería aplicada que hizo factible el sistema.
        </p>
      </section>

      {/* Sección 3: El Sistema Inicial de Diccionario Numérico */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText style={{ color: 'var(--accent-primary)' }} /> El Sistema Primitivo: Del Diccionario Numérico al Abecedario Directo
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El concepto primitivo ideado inicialmente por Morse a principios de los años 1830 no codificaba letras individuales. Concebía un sistema de diccionario numérico en el que las descargas eléctricas representaban números, y cada número correspondía a una palabra completa registrada en un libro de códigos.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Ese método resultaba lento e ineficiente: los telegrafistas debían buscar continuamente cada término en voluminosos diccionarios.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Fue Alfred Vail quien propuso sustituir los números de diccionario por una codificación directa de caracteres alfabéticos, permitiendo redactar al vuelo cualquier palabra, nombre propio o término técnico sin libros auxiliares.{' '}
          <a href="https://www.loc.gov/item/mcc.019/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
            [Biblioteca del Congreso de EE. UU.]
          </a>
        </p>
      </section>

      {/* Sección 4: El Primer Despacho Oficial de 1844 */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> El Primer Telegrama Oficial de la Historia (1844)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El hito fundacional de las telecomunicaciones electrónicas se produjo el <strong>24 de mayo de 1844</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Samuel Morse transmitió el mensaje inaugural sobre la primera línea telegráfica interurbana experimental financiada por el Congreso de EE. UU. entre Washington, D.C., y Baltimore, Maryland:
        </p>

        {/* Tarjeta Interactiva del Primer Telegrama con Audio */}
        <div style={{ background: 'var(--bg-input)', padding: '1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
            Transmisión Histórica Inaugural • 24 de Mayo de 1844
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
            "What hath God wrought?" («¿Qué no habrá hecho Dios?»)
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
            Transmitido desde la sala de la Corte Suprema en el Capitolio de Washington D.C. hasta Alfred Vail en la terminal ferroviaria de Baltimore.{' '}
            <a href="https://history.house.gov/Historical-Highlights/1800-1850/The-first-telegraphic-message-sent-from-the-Capitol/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
              [Archivos Históricos del Capitolio de EE. UU.]
            </a>
          </p>

          <button
            onClick={() => handlePlayMorse('first-message-demo', 'WHAT HATH GOD WROUGHT')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              background: playingId === 'first-message-demo' ? 'var(--accent-danger, #ef4444)' : 'var(--accent-primary)',
              color: '#000000',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {playingId === 'first-message-demo' ? <Square size={16} /> : <Play size={16} />}
            {playingId === 'first-message-demo' ? 'Detener Reproducción' : 'Escuchar el Telegrama Histórico de 1844 en Morse'}
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Este suceso demostró al mundo que el pensamiento humano podía viajar instantáneamente a través de distancias geográficas inmensas.
        </p>
      </section>

      {/* Sección 5: Código Morse Americano vs Código Morse Internacional */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe style={{ color: 'var(--accent-primary)' }} /> Código Morse Americano vs. Código Morse Internacional
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El sistema utilizado a lo largo del siglo XIX en las redes ferroviarias y telegráficas estadounidenses se conoció como <strong>American Morse Code</strong> (o Railroad Morse).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Ese código presentaba ambigüedades acústicas: incorporaba pausas internas dentro de caracteres individuales (por ejemplo, la letra <code>C</code> se componía de dos puntos separados por una pausa interna: <code>. .</code>) y utilizaba rayas de longitud variable (la raya de la letra <code>L</code> duraba el doble que una raya normal).
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>La Estandarización de 1865 en París</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
            Para eliminar estas irregularidades en las redes europeas, el inspector alemán <strong>Friedrich Clemens Gerke</strong> reformuló el código en 1848 eliminando las pausas internas. En la <strong>Conferencia Telegráfica Internacional de París en 1865</strong>, veinte estados adoptaron unánimemente el Código Morse Continental (Internacional) y fundaron la Unión Telegráfica Internacional (precursora de la actual UIT).{' '}
            <a href="https://www.itu.int/en/history/Pages/Default.aspx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
              [Historia de la UIT]
            </a>
          </p>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Este estándar internacional unificado es el que se enseña y utiliza hoy en todo el mundo. Para consultar la correspondencia completa de caracteres, revisa nuestra guía del{' '}
          <a href="/es/alfabeto-codigo-morse/" onClick={(e) => handleNav(e, 'alphabet', '/es/alfabeto-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            alfabeto Morse
          </a>.
        </p>
      </section>

      {/* Sección 6: De los Cables a la Telegrafía Sin Hilos (Radio) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> De los Cables Submarinos a la Radio de Marconi
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En 1858 y 1866, el tendido de cables telegráficos submarinos en el lecho del Atlántico unió Europa y América, acortando el desfase informativo entre continentes a cuestión de segundos.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          A finales de la década de 1890, <strong>Guglielmo Marconi</strong> revolucionó la tecnología al demostrar que los pulsos Morse podían radiarse por el aire mediante ondas electromagnéticas hertzianas, sin necesidad de conductores físicos. En diciembre de 1901, Marconi logró la primera transmisión transatlántica sin cables de la historia (la letra <code>S</code>: <code>...</code>) entre Cornualles (Reino Unido) y San Juan de Terranova.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          La telegrafía por onda continua (CW) liberó a los buques mercantes y flotas navales de su aislamiento en alta mar.
        </p>
      </section>

      {/* Sección 7: SOS Marítimo y la Catástrofe del Titanic (1912) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Anchor style={{ color: 'var(--accent-primary)' }} /> El SOS Marítimo y la Catástrofe del Titanic (1912)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En la <strong>Convención Radiotelegráfica Internacional de Berlín de 1906</strong>, se ratificó oficialmente la secuencia <strong>SOS (<code>... --- ...</code>)</strong> como señal de socorro obligatoria en el mar, relevando a la señal privada Marconi "CQD".
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Durante la fatídica noche del hundimiento del <strong>RMS Titanic en abril de 1912</strong>, los operadores telegrafiaron intensamente tanto CQD como SOS. La llamada fue interceptada por el RMS Carpathia a 58 millas náuticas, permitiendo acudir al rescate y salvar a más de 700 supervivientes.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          La tragedia impulsó la promulgación de la Ley de Radio de 1912 y acuerdos mundiales SOLAS, estableciendo guardias de escucha radiotelegráfica obligatorias las 24 horas a bordo de todos los buques comerciales de ultramar. Consulta nuestra guía sobre{' '}
          <a href="/es/sos-en-codigo-morse/" onClick={(e) => handleNav(e, 'sos', '/es/sos-en-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            SOS en código Morse
          </a>.
        </p>
      </section>

      {/* Sección 8: Declive Comercial y Supervivencia Moderna */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> Declive Comercial y Resiliencia en el Siglo XXI
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En las últimas décadas del siglo XX, las redes telex automatizadas, satélites de comunicación y cables de fibra óptica arrinconaron progresivamente a la telegrafía comercial. En <strong>1999</strong>, la Organización Marítima Internacional (OMI) retiró el código Morse como requisito de socorro en la marina mercante, sustituyéndolo por el sistema satelital GMDSS. En 2007, la FCC en EE. UU. y las administraciones de telecomunicaciones europeas suprimieron el examen obligatorio de telegrafía para licencias de radioaficionado.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Lejos de extinguirse, el código Morse floreció como una afición técnica apasionante y un método de comunicación indestructible. Hoy es practicado con entusiasmo en la <strong>Radioafición (CW)</strong>, en la radionavegación aeronáutica (VOR/NDB) y en protocolos de respaldo militar y de defensa civil ante eventuales colapsos electromagnéticos o ciberataques.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          La Unión Internacional de Telecomunicaciones conserva en vigor la recomendación{' '}
          <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            Recomendación UIT-R M.1677-1: Código Morse Internacional
          </a>
          . Para descubrir su aplicación en bandas de aficionados, consulta nuestra guía de{' '}
          <a href="/es/radioaficionados-codigo-morse/" onClick={(e) => handleNav(e, 'amateurradio', '/es/radioaficionados-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            código Morse para radioaficionados
          </a>.
        </p>
      </section>

      {/* Sección 9: Cronología Completa de Hitos Históricos */}
      <section style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> Cronología Histórica del Código Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {timelineEvents.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div style={{ minWidth: '115px', padding: '0.4rem 0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '6px', fontWeight: 800, textAlign: 'center', fontSize: '0.95rem' }}>
                {item.year}
              </div>
              <div style={{ background: 'var(--bg-input)', padding: '1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)', flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 10: Preguntas Frecuentes (FAQ Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Preguntas Frecuentes sobre la Historia del Morse
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

      {/* Sección 11: Conclusión y Herramientas */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Experimenta la Telegrafía en Tiempo Real
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convierte textos modernos a código Morse o decodifica señales con sonido acústico sintetizado en tiempo real.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' }}
          >
            Lanzar Traductor Morse en Español <ArrowRight size={18} />
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
