import React, { useState } from 'react';
import {
  Radio, Volume2, Play, Square, Award, ArrowRight, ChevronDown, ChevronUp,
  ShieldCheck, Zap, BookOpen, Clock, Activity, Headphones, CheckCircle, ExternalLink,
  Sparkles, Compass, AlertCircle, FileText, Globe, Anchor, Copy, Check, Layers
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function SpanishAmateurRadioPage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [playingItem, setPlayingItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Abreviaturas, códigos Q y prosigns de radioaficionados
  const prosignsAndAbbrs = [
    { text: 'CQ', morse: '-.-. --.-', category: 'General', meaning: 'Llamada general a cualquier estación en escucha' },
    { text: 'DE', morse: '-.. .', category: 'General', meaning: 'De / Transmite (antecede al distintivo de llamada)' },
    { text: 'QTH', morse: '--.- - ....', category: 'Código Q', meaning: 'Ubicación geográfica / Mi ciudad o estación es...' },
    { text: 'QSL', morse: '--.- ... .-..', category: 'Código Q', meaning: 'Confirmación de recepción / Confirmación mediante tarjeta QSL' },
    { text: 'RST', morse: '.-. ... -', category: 'Señal', meaning: 'Reporte de señal (Readability, Signal Strength, Tone: ej. 599)' },
    { text: '73', morse: '--... ...--', category: 'Saludo', meaning: 'Saludos cordiales / Despedida afectuosa entre colegas' },
    { text: '88', morse: '---.. ---..', category: 'Saludo', meaning: 'Besos y abrazos (usado tradicionalmente con operadoras)' },
    { text: 'OM', morse: '--- --', category: 'Jerga', meaning: 'Old Man (Colega / Operador masculino)' },
    { text: 'YL', morse: '-.-- .-..', category: 'Jerga', meaning: 'Young Lady (Colega u operadora femenina)' },
    { text: 'RIG', morse: '.-. .. --.', category: 'Equipo', meaning: 'Equipo de radio / Transceptor transmisor-receptor' },
    { text: 'ANT', morse: '.- -. -', category: 'Equipo', meaning: 'Antena de transmisión' },
    { text: 'PSE', morse: '.--. ... .', category: 'General', meaning: 'Por favor (Please)' },
    { text: 'TU', morse: '- ..-', category: 'General', meaning: 'Muchas gracias (Thank you)' },
    { text: 'FB', morse: '..-. -...', category: 'Jerga', meaning: 'Fine Business (Excelente trabajo / Muy bien)' },
    { text: 'ES', morse: '. ...', category: 'General', meaning: 'Y (Conjunción copulativa / And)' },
    { text: 'BK', morse: '-... -.-', category: 'Prosign', meaning: 'Cambio rápido / Interrupción de transmisión (Break)' },
    { text: 'KN', morse: '-.- -. ', category: 'Prosign', meaning: 'Pase exclusivo: solo responde la estación nombrada' },
    { text: 'AR', morse: '.-.-.', category: 'Prosign', meaning: 'Fin de mensaje formal (transmitido como carácter continuo)' },
    { text: 'SK', morse: '...-.-', category: 'Prosign', meaning: 'Fin definitivo de contacto / Silent Key' },
    { text: 'BT', morse: '-...-', category: 'Prosign', meaning: 'Separador de párrafos (Signo igual =)' },
    { text: 'HW?', morse: '.... .-- ..--..', category: 'Pregunta', meaning: '¿Cómo me copias? ¿Cómo recibes mi señal?' }
  ];

  const handlePlaySound = (item) => {
    audioEngine.stop();
    if (playingItem === item.text) {
      setPlayingItem(null);
      return;
    }

    setPlayingItem(item.text);
    const breakdown = getCharacterBreakdown(item.text, item.morse);

    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18),
      farnsworthWpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      loop: false,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setPlayingItem(null);
        }
      }
    });
  };

  const handleCopy = (id, textToCopy, label = '¡Copiado!') => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    if (showToast) showToast(label);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (path && typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: '¿Se sigue utilizando el código Morse en la radioafición?',
      a: 'Sí, de manera sumamente activa. En radioafición, el modo telegráfico se denomina CW (Continuous Wave). Organizaciones mundiales como IARU, ARRL y las federaciones de radioaficionados de España (URE) y México (FMRE) promueven la telegrafía, que cuenta con segmentos exclusivos en todas las bandas de HF y eventos multitudinarios como concursos mundiales y el Straight Key Night.'
    },
    {
      q: '¿Es obligatorio saber código Morse para obtener una licencia de radioaficionado hoy en día?',
      a: 'No. En 2003, la Conferencia Mundial de Radiocomunicaciones (CMR-03) de la UIT modificó el Artículo 25 del Reglamento de Radiocomunicaciones, facultando a cada país para suprimir el examen obligatorio de Morse. En España, México, EE. UU. y casi toda Latinoamérica, la telegrafía dejó de ser un requisito legal obligatorio, convirtiéndose en una modalidad voluntaria muy apreciada.'
    },
    {
      q: '¿Qué significa exactamente CW en la radio?',
      a: 'CW significa "Continuous Wave" (Onda Continua). Hace referencia a una onda de radiofrecuencia pura y no modulada generada por el transmisor, cuya emisión se activa y corta rítmicamente mediante el manipulador telegráfico para generar los puntos y rayas del código Morse.'
    },
    {
      q: '¿Qué es un QSO telegráfico?',
      a: 'Un QSO es un comunicado o contacto bilateral entre dos estaciones de radio. Puede ser un intercambio breve y formal de reportes de señal y distintivos de llamada durante un concurso, o una conversación distendida ("ragchew") sobre la climatología, la antena y el equipo transmisor.'
    },
    {
      q: '¿Qué significa llamar "CQ" en Morse?',
      a: 'CQ es la llamada general internacional empleada por un operador que busca establecer contacto con cualquier estación que esté escuchando en esa frecuencia. Una secuencia habitual es "CQ CQ CQ DE XE1ABC K".'
    },
    {
      q: '¿Qué significa el reporte RST y por qué se envía 599 o 5NN?',
      a: 'El reporte RST califica la calidad técnica de la señal en tres parámetros: Readability (Inteligibilidad de 1 a 5), Signal Strength (Fuerza de 1 a 9) y Tone (Calidad del tono de 1 a 9). Un reporte 599 indica señal óptima. En concursos y telegrafía rápida, el número 9 se abrevia frecuentemente con la letra N (-.), por lo que "599" se transmite velozmente como "5NN".'
    },
    {
      q: '¿Necesito un manipulador vertical clásico para operar en CW?',
      a: 'No. Puedes emplear un manipulador vertical clásico (straight key), una paleta doble iámbica con manipulador electrónico automático (iambic paddle), un manipulador semiautomático mecánico ("bug") o interfaces de software por ordenador. La elección depende de tus preferencias y velocidad de transmisión.'
    }
  ];

  return (
    <div className="article-page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Navegación Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Radioafición CW</span>
      </nav>

      {/* Hero Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Radio size={16} /> Guía de Referencia y Operación en Onda Continua (CW)
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Código Morse en Radioafición: CW, QSO, Equipos y Códigos Q
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          Aprende cómo opera el código Morse en la radioafición moderna: qué es el modo CW, qué equipos necesitas, los códigos Q indispensables y cómo realizar tu primer contacto QSO.
        </p>
      </header>

      {/* Resumen Ejecutivo Directo */}
      <div style={{ background: 'var(--bg-card)', padding: '1.75rem 2rem', borderRadius: '16px', border: '1px solid var(--accent-primary)', marginBottom: '2.5rem', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={18} /> Respuesta Directa
        </div>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '0.75rem', fontWeight: 500 }}>
          En la radioafición, el código Morse se denomina habitualmente <strong>CW (Continuous Wave u Onda Continua)</strong>. El operador utiliza una llave telegráfica o manipulador electrónico para conmutar la portadora de radiofrecuencia en los patrones proporcionales del Código Morse Internacional.
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
          La IARU y las asociaciones nacionales definen el CW como radiotelegrafía pura. Todos los transceptores modernos de HF integran filtros de CW. Aunque el examen de telegrafía dejó de ser obligatorio para obtener la licencia de radioaficionado en la década del 2000, el modo CW experimenta un auge continuo por su insuperable rendimiento en enlaces intercontinentales con potencias mínimas.{' '}
          <a href="https://www.arrl.org/cw-mode" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Guía Oficial de CW de ARRL]
          </a>
        </p>
      </div>

      {/* Sección 1: ¿Qué es el Código Morse en Radioafición? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap style={{ color: 'var(--accent-primary)' }} /> ¿Qué es el Código Morse en Radioafición?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En el servicio de radioaficionados, el código Morse es el procedimiento para transmitir caracteres mediante la manipulación directa de una señal de radiofrecuencia no modulada con arreglo a la norma internacional UIT-R M.1677-1.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          El operador emite los puntos y rayas accionando un manipulador. El transmisor propaga los impulsos por el espacio y, en el extremo receptor, otro radioaficionado sintoniza la señal convertida en un tono audible limpio (sidetone de 600–700 Hz) para decodificar los caracteres.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          El Morse no es un idioma independiente: es el vehículo electromagnético para intercambiar mensajes en español, inglés u otros idiomas mediante abreviaturas internacionales.
        </p>
      </section>

      {/* Sección 2: ¿Qué Significa CW? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio style={{ color: 'var(--accent-primary)' }} /> ¿Qué Significa CW?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>CW</strong> es la sigla técnica universal que los radioaficionados utilizan para referirse a la radiotelegrafía en código Morse.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Proviene del inglés <strong>Continuous Wave</strong> (Onda Continua). En los albores de la radio, los transmisores de chispa generaban ondas amortiguadas ruidosas que saturaban todo el dial. Los transmisores posteriores de onda continua producían una portadora limpia y pura en una única frecuencia exacta, encendida y apagada nítidamente por la llave telegráfica.
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Frases Habituales en las Bandas de HF</div>
          <ul style={{ color: 'var(--text-primary)', lineHeight: 1.7, margin: 0, paddingLeft: '1.25rem', fontSize: '0.95rem' }}>
            <li><em>"Opere en CW."</em> — Opero y me comunico mediante código Morse por radio.</li>
            <li><em>"Hice un QSO en CW."</em> — Completé un contacto bilateral de telegrafía con otra estación.</li>
            <li><em>"¿A qué velocidad copias?"</em> — ¿A cuántas palabras por minuto (WPM) recibes de oído con soltura?</li>
          </ul>
        </div>
      </section>

      {/* Sección 3: Flujo de Señal en Telegrafía */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ color: 'var(--accent-primary)' }} /> Cómo Funciona la Señal Telegráfica en Radioafición
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          El trayecto completo de una emisión en CW recorre cinco etapas coordinadas:
        </p>

        {/* Diagrama de Flujo */}
        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Manipulador / Llave</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Transmisor HF</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Señal RF Portadora</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Receptor BFO</span>
            <span>➔</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '0.4rem 0.8rem', borderRadius: '6px', color: 'var(--accent-primary)' }}>Tono Acústico</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          En el receptor, el oscilador de batido (BFO) heterodina la portadora entrante para generar el tono musical limpio en los auriculares. El radioaficionado escucha la cadencia rítmica e interpreta el texto.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Los operadores experimentados practican la <strong>copia mental directa ("head copy")</strong>: reconocen las palabras directamente en su mente sin necesidad de anotar letra por letra en un papel.
        </p>
      </section>

      {/* Sección 4: ¿Por Qué Sigue Siendo Tan Popular el CW? */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} /> ¿Por Qué los Radioaficionados Prefieren Operar en CW?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A pesar de contar con canales de fonía en banda lateral única (SSB), satélites y modos digitales por ordenador (FT8), el CW mantiene ventajas técnicas inigualables:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} style={{ color: 'var(--accent-primary)' }} /> Ancho de Banda Ultraestrecho
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Una señal CW ocupa apenas entre 100 y 500 Hz en el espectro electromagnético, frente a los 2,400 Hz de la voz en SSB. Esta impresionante concentración permite que decenas de estaciones operen sin molestarse en un mismo fragmento de banda.{' '}
              <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                [Norma UIT-R M.1677-1]
              </a>
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} style={{ color: 'var(--accent-primary)' }} /> Baja Potencia (QRP) y Contactos DX
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Al concentrarse toda la energía del transmisor en un ancho tan diminuto, un equipo portátil emitiendo con solo 5 vatios (QRP) puede cruzar océanos y establecer contactos intercontinentales (DX) imposibles de lograr con la voz humana.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Award size={16} style={{ color: 'var(--accent-primary)' }} /> Destreza Mental y Comunidad
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Operar telegrafía exige concentración, ritmo musical y reflejos. Entidades internacionales como CW Academy y FISTS Club mantienen viva una comunidad activa de formación y confraternización.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 5: Requisitos de Licencia y Exámenes */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle style={{ color: 'var(--accent-primary)' }} /> ¿Es Obligatorio el Código Morse para Obtener Licencia de Radioaficionado?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          <strong>Rotundamente no.</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Tanto en España (Ministerio para la Transformación Digital), México (IFT) como en Estados Unidos (FCC, Orden 06-178 en febrero de 2007) y el resto del mundo hispanohablante, los exámenes oficiales para obtener los certificados de radioaficionado ya no exigen superar pruebas de telegrafía Morse.{' '}
          <a href="https://docs.fcc.gov/public/attachments/FCC-06-178A1.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 500 }}>
            [Resolución FCC 06-178]
          </a>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Puedes obtener tu licencia y acceder a todas las bandas de HF sin saber telegrafía. El aprendizaje del código Morse hoy en día es una elección 100% voluntaria, motivada por el disfrute de la disciplina y su alta eficiencia operativa.
        </p>
      </section>

      {/* Sección 6: Equipos Necesarios para Operar CW */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers style={{ color: 'var(--accent-primary)' }} /> ¿Qué Equipamiento se Necesita para Operar en CW?
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Configurar una estación de radioafición para operar en telegrafía requiere elementos muy sencillos:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Llave Vertical (Straight Key)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Un pulsador mecánico basculante donde el operador controla a pulso la duración exacta de cada punto y raya. Es la herramienta clásica e ideal para consolidar la cadencia inicial.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Paleta Iámbica y Keyer Electrónico</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Un manipulador de doble paleta conectado a un circuito electrónico. Presionar la paleta izquierda genera automáticamente una ráfaga perfecta de puntos; la derecha genera rayas. Permite operar a más de 25 WPM sin fatiga muscular.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Transceptor de HF y Antena</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Cualquier transceptor de HF que admita modo CW (con filtro estrecho de 250 a 500 Hz), conectado a un dipolo o antena vertical y auriculares de alta fidelidad.
            </p>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Puedes entrenar tu técnica de manipulación directamente en el navegador con nuestro{' '}
          <a href="/es/manipulador-codigo-morse/" onClick={(e) => handleNav(e, 'keyer', '/es/manipulador-codigo-morse/')} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'underline' }}>
            manipulador telegráfico interactivo
          </a>.
        </p>
      </section>

      {/* Sección 7: Tabla de Códigos Q, Abreviaturas y Prosigns */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 style={{ color: 'var(--accent-primary)' }} /> Códigos Q, Abreviaturas y Prosigns Fundamentales
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Haz clic en cualquier término para reproducir su cadencia sonora en telegrafía a tu velocidad activa ({wpm} WPM):
        </p>

        {/* Tabla Interactiva de Prosigns */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Término / Código</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Código Morse</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Categoría</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Significado Operativo</th>
                <th style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', textAlign: 'right' }}>Audio Demostrativo</th>
              </tr>
            </thead>
            <tbody>
              {prosignsAndAbbrs.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: idx < prosignsAndAbbrs.length - 1 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'transparent' : 'var(--bg-input-subtle, rgba(255,255,255,0.02))' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>{item.text}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1.15rem', letterSpacing: '0.1em' }}>{item.morse}</td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.meaning}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handlePlaySound(item)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        background: playingItem === item.text ? 'var(--accent-danger, #ef4444)' : 'rgba(59, 130, 246, 0.1)',
                        color: playingItem === item.text ? '#ffffff' : 'var(--accent-primary)',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {playingItem === item.text ? <Square size={13} /> : <Play size={13} />}
                      {playingItem === item.text ? 'Detener' : 'Escuchar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección 8: Estructura de un QSO en 5 Pasos */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock style={{ color: 'var(--accent-primary)' }} /> Estructura de un Contacto Telegráfico (QSO Estándar en 5 Pasos)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Un <strong>QSO</strong> formal en telegrafía sigue un protocolo internacional perfectamente estructurado:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>1. Escucha Previa:</strong> Antes de transmitir, comprueba que la frecuencia no esté ocupada emitiendo la pregunta <code>QRL?</code> (¿está ocupada esta frecuencia?).</li>
          <li><strong>2. Llamada CQ o Respuesta:</strong> Emite la llamada general: <code>CQ CQ CQ DE XE1ABC XE1ABC K</code>, o responde al CQ de otra estación.</li>
          <li><strong>3. Intercambio de Distintivos:</strong> Confirma con nitidez los indicativos de ambas estaciones para el libro de guardia.</li>
          <li><strong>4. Intercambio de Reporte e Información:</strong> Intercambia el reporte RST (ej. 579 o 5NN), el nombre del operador (OP) y la ciudad (QTH).</li>
          <li><strong>5. Cierre y Saludo Final:</strong> Concluye con agradecimientos y los saludos cordiales tradicionales: <code>73 TU EE SK</code>.</li>
        </ol>
      </section>

      {/* Sección 9: Diálogo Realista de Contacto QSO */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText style={{ color: 'var(--accent-primary)' }} /> Ejemplo de Diálogo Realista en un Contacto QSO
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A continuación se presenta un contacto telegráfico auténtico entre la Estación A (<code>XE1ABC</code> en Ciudad de México) y la Estación B (<code>EA4XYZ</code> en Madrid):
        </p>

        <div style={{ background: 'var(--bg-input)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>ESTACIÓN A • XE1ABC (Llamada CQ)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              CQ CQ CQ DE XE1ABC XE1ABC K
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>ESTACIÓN B • EA4XYZ (Respuesta a la Llamada)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              XE1ABC DE EA4XYZ EA4XYZ K
            </div>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>ESTACIÓN A • XE1ABC (Reporte RST, Nombre y QTH)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              EA4XYZ DE XE1ABC GM UR RST 579 579 QTH MEXICO NAME RAUL K
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>ESTACIÓN B • EA4XYZ (Confirmación y Despedida)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              XE1ABC DE EA4XYZ R UR RST 599 5NN QTH MADRID NAME JUAN 73 TU SK EE
            </div>
          </div>
        </div>
      </section>

      {/* Sección 10: Cómo Aprender Morse para Radioafición */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Cómo Aprender Código Morse para Radioaficionados
        </h2>
        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.25rem' }}>
          <li><strong>Aprende de Oído desde el Primer Día:</strong> Configura la velocidad de los caracteres a 18–20 WPM y utiliza el espaciado Farnsworth para dar tiempo al cerebro.</li>
          <li><strong>Entrena la Copia Mental (Head Copy):</strong> Acostúmbrate a identificar el ritmo sonoro de las letras completas en tu cabeza sin escribir.</li>
          <li><strong>Practica la Transmisión con Paleta Iámbica:</strong> Ajusta un manipulador electrónico para mantener la proporción exacta 1:3:7 entre puntos, rayas y espacios.</li>
          <li><strong>Escucha Bandas Reales de HF:</strong> Sintoniza las frecuencias de telegrafía en 40 metros (7.000–7.040 MHz) o 20 metros (14.000–14.070 MHz) para familiarizarte con el sonido de los comunicados reales.</li>
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
            href="/es/manipulador-codigo-morse/"
            onClick={(e) => handleNav(e, 'keyer', '/es/manipulador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Practicar con el Manipulador Telegráfico
          </a>
        </div>
      </section>

      {/* Sección 11: Actividades Más Allá del Primer QSO */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass style={{ color: 'var(--accent-primary)' }} /> Actividades y Especialidades en CW
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Una vez dominado el intercambio básico, la telegrafía abre un abanico apasionante de actividades en la radio:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>DXing Intercontinental:</strong> Caza de estaciones remotas en islas y países exóticos en bandas de alta frecuencia.
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>POTA y SOTA:</strong> Activación de estaciones portátiles ligeras de baja potencia en Parques Naturales o Cumbres de Montaña.
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Concursos (Contesting):</strong> Competiciones internacionales de alta velocidad donde se registran cientos de contactos por hora.
          </div>
        </div>
      </section>

      {/* Sección 12: Preguntas Frecuentes (FAQ Accordion) */}
      <section style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen style={{ color: 'var(--accent-primary)' }} /> Preguntas Frecuentes sobre CW y Radioafición
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

      {/* Sección 13: Conclusión y Herramientas */}
      <footer style={{ background: 'var(--bg-card)', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          ¿Listo para Practicar Telegrafía de Radioaficionado?
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Convierte distintivos de llamada y mensajes a código Morse o entrena tu velocidad auditiva con síntesis de audio en tiempo real.
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
            Consultar Alfabeto Morse
          </a>
        </div>
      </footer>
    </div>
  );
}
