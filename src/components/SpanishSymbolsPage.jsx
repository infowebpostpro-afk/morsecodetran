import React, { useState } from 'react';
import {
  Search, Volume2, Copy, Play, Square, ExternalLink,
  ArrowRight, ShieldCheck, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, BookOpen, Hash, Type, HelpCircle, FileText, Sparkles
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';

// Dataset oficial y convencional de Símbolos en Código Morse (ITU-R M.1677-1 + Convenciones Modernas)
const MORSE_SYMBOLS_DATA_ES = [
  { symbol: '.', name: 'Punto (Full stop / Period)', morse: '.-.-.-', ditDah: 'di-dah-di-dah-di-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Final de oración o bloque telegráfico' },
  { symbol: ',', name: 'Coma (Comma)', morse: '--..--', ditDah: 'dah-dah-di-di-dah-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Separación de cláusulas u oraciones' },
  { symbol: ':', name: 'Dos puntos (Colon)', morse: '---...', ditDah: 'dah-dah-dah-di-di-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Introduce lista, cita o formato horario' },
  { symbol: '?', name: 'Signo de interrogación (Question mark)', morse: '..--..', ditDah: 'di-di-dah-dah-di-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Cierre de pregunta y solicitud de repetición en radio' },
  { symbol: "'", name: 'Apóstrofo (Apostrophe)', morse: '.----.', ditDah: 'di-dah-dah-dah-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Contracciones, posesivos o citas simples' },
  { symbol: '-', name: 'Guion / Menos (Hyphen / Dash)', morse: '-....-', ditDah: 'dah-di-di-di-di-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Palabras compuestas o signo matemático de resta' },
  { symbol: '/', name: 'Barra inclinada (Slash / Fraction bar)', morse: '-..-.', ditDah: 'dah-di-di-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Fracciones y fechas (también separador visual de palabras en texto escrito)' },
  { symbol: '(', name: 'Paréntesis de apertura (Left parenthesis)', morse: '-.--.', ditDah: 'dah-di-dah-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Apertura de texto aclaratorio o inciso' },
  { symbol: ')', name: 'Paréntesis de cierre (Right parenthesis)', morse: '-.--.-', ditDah: 'dah-di-dah-dah-di-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Cierre de texto aclaratorio o inciso' },
  { symbol: '"', name: 'Comillas (Quotation marks)', morse: '.-..-.', ditDah: 'di-dah-di-di-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Citas textuales y discurso directo' },
  { symbol: '=', name: 'Signo igual / Doble guion (Equals / BT)', morse: '-...-', ditDah: 'dah-di-di-di-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Igualdad matemática y separador de secciones en radiogramas (<BT>)' },
  { symbol: '+', name: 'Signo más / Cruz (Plus sign / AR)', morse: '.-.-.', ditDah: 'di-dah-di-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Adición matemática y señal de Fin de Mensaje (<AR>)' },
  { symbol: '@', name: 'Arroba comercial (At sign)', morse: '.--.-.', ditDah: 'di-dah-dah-di-dah-dit', category: 'punctuation', status: 'Oficial ITU', usage: 'Correos electrónicos; incorporado oficialmente en 2004 por la UIT' },
  { symbol: '—', name: 'Comprendido / Recibido (Understood)', morse: '...-.', ditDah: 'di-di-di-dah-dit', category: 'operational', status: 'Oficial ITU', usage: 'Confirmación de mensaje recibido y entendido (<SN>)' },
  { symbol: '—', name: 'Señal de Error (8 puntos)', morse: '........', ditDah: 'di-di-di-di-di-di-di-dit', category: 'operational', status: 'Oficial ITU', usage: '8 dits consecutivos que anulan la última palabra transmitida erróneamente' },
  { symbol: '—', name: 'Invitación a transmitir (Go ahead)', morse: '-.-', ditDah: 'dah-di-dah', category: 'operational', status: 'Oficial ITU', usage: 'Pase de transmisión a la otra estación (K)' },
  { symbol: '—', name: 'Espera (Wait)', morse: '.-...', ditDah: 'di-dah-di-di-dit', category: 'operational', status: 'Oficial ITU', usage: 'Petición de pausa momentánea en la frecuencia (<AS>)' },
  { symbol: '—', name: 'Fin de trabajo / Fin de contacto', morse: '...-.-', ditDah: 'di-di-di-dah-di-dah', category: 'operational', status: 'Oficial ITU', usage: 'Desconexión final y cierre de estación (<SK>)' },
  { symbol: '—', name: 'Comienzo de transmisión (Start)', morse: '-.-.-', ditDah: 'dah-di-dah-di-dah', category: 'operational', status: 'Oficial ITU', usage: 'Señal previa al envío de un despacho formal (<CT>)' },
  { symbol: '×', name: 'Signo de multiplicación', morse: '-..-', ditDah: 'dah-di-di-dah', category: 'punctuation', status: 'Oficial ITU', usage: 'Multiplicación (transmitida usando la letra X reglamentaria)' },
  { symbol: '!', name: 'Signo de exclamación (Exclamation)', morse: '-.-.--', ditDah: 'dah-di-dah-di-dah-dah', category: 'punctuation', status: 'Convencional', usage: 'Énfasis, sorpresa o alerta (ampliamente extendido en software)' },
  { symbol: ';', name: 'Punto y coma (Semicolon)', morse: '-.-.-.', ditDah: 'dah-di-dah-di-dah-dit', category: 'punctuation', status: 'Convencional', usage: 'Pausa sintáctica intermedia' },
  { symbol: '&', name: 'Ampersand (Et / And)', morse: '.-...', ditDah: 'di-dah-di-di-dit', category: 'punctuation', status: 'Convencional', usage: 'Signo & (posee el mismo patrón sonoro que el prosign de Espera <AS>)' },
  { symbol: '_', name: 'Guion bajo (Underscore)', morse: '..--.-', ditDah: 'di-di-dah-dah-di-dah', category: 'punctuation', status: 'Convencional', usage: 'Subrayado o espaciado de nombres técnicos' },
  { symbol: '$', name: 'Signo de dólar (Dollar)', morse: '...-..-', ditDah: 'di-di-di-dah-di-di-dah', category: 'punctuation', status: 'Convencional', usage: 'Signo de moneda internacional (SX sin espacios)' }
];

export function SpanishSymbolsPage({ wpm = 20, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // all, punctuation, operational, official, conventional
  const [playingSymbol, setPlayingSymbol] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtrado de símbolos
  const filteredSymbols = MORSE_SYMBOLS_DATA_ES.filter(item => {
    if (filterCategory === 'punctuation' && item.category !== 'punctuation') return false;
    if (filterCategory === 'operational' && item.category !== 'operational') return false;
    if (filterCategory === 'official' && item.status !== 'Oficial ITU') return false;
    if (filterCategory === 'conventional' && item.status !== 'Convencional') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      item.morse.includes(q) ||
      item.ditDah.toLowerCase().includes(q) ||
      item.usage.toLowerCase().includes(q)
    );
  });

  // Reproducir audio
  const handlePlaySymbol = (item) => {
    setPlayingSymbol(item.name);
    audioEngine.playSequence({
      breakdown: [{ char: item.symbol === '—' ? '?' : item.symbol, morse: item.morse, isSpace: false }],
      wpm: wpm || 20,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingSymbol(null);
      }
    });
  };

  // Copiar código al portapapeles
  const handleCopyMorse = async (morse, name) => {
    try {
      await navigator.clipboard.writeText(morse);
      if (showToast) showToast(`¡Código Morse de ${name} (${morse}) copiado con éxito! ✓`);
    } catch (e) {
      if (showToast) showToast('Error al copiar. Por favor copia manualmente.');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const faqData = [
    {
      q: '¿Cuáles son los signos y símbolos oficiales en código Morse?',
      a: 'El estándar universal de la Unión Internacional de Telecomunicaciones (ITU-R M.1677-1) define caracteres exactos de puntuación y señales de servicio: el punto (.-.-.-), la coma (--..--), el signo de interrogación (..--..), el apóstrofo (.----.), el guion (-....-), la barra inclinada (-..-.), el signo igual (-...-), el signo más (.-.-.), la arroba (.--.-.) y señales operativas críticas como Error (8 puntos) y Fin de Trabajo (<SK>).'
    },
    {
      q: '¿Cómo se transmite el signo de interrogación (?) en código Morse?',
      a: 'Se envía como ..--.. (di-di-dah-dah-di-dit). En el protocolo de radiocomunicación en español e internacional, también se transmite de manera aislada para solicitar la repetición de una palabra o de una cifra que no fue recibida con claridad.'
    },
    {
      q: '¿Por qué no existen signos invertidos de apertura (¿, ¡) en código Morse?',
      a: 'El código Morse internacional fue concebido para la telegrafía transnacional, regulada primordialmente en inglés y francés diplomático. En la práctica telegráfica de los países de habla hispana, los signos de apertura invertidos se suprimen sistemáticamente: únicamente se telegrafía el signo de interrogación (..--..) o el de exclamación (-.-.--) al final de la frase.'
    },
    {
      q: '¿Cuál es el código Morse de la arroba (@) y cuándo se aprobó?',
      a: 'La arroba se transmite como .--.-. (di-dah-dah-di-dah-dit), una combinación continua de las letras A (.-) y C (-.-.) sin intervalo entre ellas. Fue ratificada formalmente por la UIT en mayo de 2004 para facilitar el envío de correos electrónicos en radiotelegrafía marina y de emergencia.'
    },
    {
      q: '¿Qué significa la señal de ocho puntos consecutivos (........) en Morse?',
      a: 'Ocho puntos seguidos (........) conforman la señal oficial de Error (prosign <HH>). Al emitirla, el operador transmisor informa que la última palabra enviada contenía una equivocación y que procederá a repetirla correctamente desde el principio.'
    },
    {
      q: '¿Cuál es la diferencia entre un signo de puntuación y un prosign (señal de procedimiento)?',
      a: 'Un signo de puntuación representa un carácter ortográfico del texto (como el punto o la coma). En contraste, un prosign (señal de procedimiento) es una combinación de dos o más caracteres telegrafiada como un único bloque continuo sin el espacio estándar de 3 dits entre letras. Por ejemplo, <AR> (.-.-.) señala el Fin de Mensaje, mientras que <BT> (-...-) marca la separación entre párrafos.'
    },
    {
      q: '¿Cómo se transmiten los símbolos que no tienen un código Morse propio como el porcentaje (%) o la multiplicación (×)?',
      a: 'El reglamento UIT-R M.1677-1 establece métodos específicos: la multiplicación (×) se telegrafía empleando la letra X (-..-); el signo de porcentaje (%) se envía como la secuencia 0-0/0 (por ejemplo, 5% se transmite como 5-0/0); y por mil (‰) se envía como 0/00.'
    },
    {
      q: '¿Es el signo de exclamación (!) un símbolo oficial de la ITU?',
      a: 'En la recomendación escrita estricta de ITU-R M.1677-1 no figura un carácter ortográfico para la exclamación. Sin embargo, en el software telegráfico, aplicaciones modernas y radioafición se utiliza universalmente la secuencia -.-.-- (dah-di-dah-di-dah-dah) como estándar de facto.'
    }
  ];

  return (
    <div className="symbols-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem' }}>
      
      {/* NAVEGACIÓN SUPERIOR / BREADCRUMB */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Símbolos y Puntuación en Morse</span>
      </nav>

      {/* SECCIÓN HERO / ENCABEZADO */}
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem 2rem', background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0) 100%)', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <ShieldCheck size={16} /> Estándar Internacional Oficial ITU-R M.1677-1
        </div>
        
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Símbolos y Signos de Puntuación en Código Morse: Tabla Completa y Prosigns
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '820px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          El código Morse abarca mucho más que letras y números. Descubre la tabla definitiva con todos los signos de puntuación, señales de procedimiento (prosigns), símbolos especiales de la Unión Internacional de Telecomunicaciones y convenciones en español.
        </p>

        {/* Botones de navegación interna rápida */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
          <a 
            href="/es/alfabeto-codigo-morse/"
            onClick={(e) => handleNav(e, 'alphabet', '/es/alfabeto-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Type size={15} /> Alfabeto Morse (A–Z y Ñ)
          </a>
          <a 
            href="/es/numeros-codigo-morse/"
            onClick={(e) => handleNav(e, 'numbers', '/es/numeros-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}>
            <Hash size={15} /> Números Morse (0–9)
          </a>
          <a 
            href="/es/decodificador-codigo-morse/"
            onClick={(e) => handleNav(e, 'morsedecoder', '/es/decodificador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.45rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s' }}>
            <FileText size={15} /> Decodificador Morse
          </a>
        </div>
      </div>

      {/* TABLA INTERACTIVA CON BÚSQUEDA Y FILTRADO */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Tabla Interactiva de Símbolos en Morse
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>
              Filtra por categoría o busca cualquier signo, nombre o patrón sonoro di-dah.
            </p>
          </div>

          {/* Campo de búsqueda */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar símbolo (ej. ?, punto, .-.-.-)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-card)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {/* Pestañas de filtrado */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { id: 'all', label: 'Todos los Símbolos' },
            { id: 'official', label: 'Estándar Oficial ITU' },
            { id: 'punctuation', label: 'Signos de Puntuación' },
            { id: 'operational', label: 'Señales Operativas ITU' },
            { id: 'conventional', label: 'Convenciones de Software' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: filterCategory === tab.id ? 'var(--accent-primary)' : 'var(--border-color)',
                background: filterCategory === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-card)',
                color: filterCategory === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rejilla de tabla con scroll horizontal en móviles */}
        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Símbolo</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nombre y Función</th>
                <th style={{ padding: '0.85rem 1rem' }}>Código Morse</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ritmo Dit-Dah</th>
                <th style={{ padding: '0.85rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSymbols.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron símbolos que coincidan con "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredSymbols.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                      {item.symbol}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.usage}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--accent-warning)' }}>
                      {item.morse}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {item.ditDah}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: item.status === 'Oficial ITU' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: item.status === 'Oficial ITU' ? 'var(--accent-success)' : 'var(--accent-warning)',
                        border: `1px solid ${item.status === 'Oficial ITU' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handlePlaySymbol(item)}
                          title="Escuchar señal Morse"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.4rem',
                            border: '1px solid var(--border-color)',
                            background: playingSymbol === item.name ? 'var(--accent-primary)' : 'var(--surface-hover)',
                            color: playingSymbol === item.name ? '#000' : 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Volume2 size={14} /> Oír
                        </button>
                        <button
                          onClick={() => handleCopyMorse(item.morse, item.name)}
                          title="Copiar código Morse"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '0.4rem',
                            border: '1px solid var(--border-color)',
                            background: 'var(--surface-hover)',
                            color: 'var(--text-primary)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <Copy size={14} /> Copiar
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

      {/* PROFUNDIDAD EDITORIAL Y TÉCNICA */}

      {/* 1. Marco Normativo Oficial ITU-R M.1677-1 */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck style={{ color: 'var(--accent-primary)' }} />
          Símbolos Oficiales en Morse: Lo que Define la Recomendación UIT-R M.1677-1
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          En Internet abundan las tablas de código Morse que clasifican cualquier carácter como "oficial". Sin embargo, en el ámbito técnico y operativo, la única especificación vinculante globalmente es la recomendación <strong>ITU-R M.1677-1</strong> de la Unión Internacional de Telecomunicaciones (UIT/ITU), catalogada como <em>En vigor (Principal)</em>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          El anexo técnico de este documento homologa las letras, cifras numéricas, signos de puntuación, señales de servicio y las reglas exactas de temporización. Además, delimita claramente qué caracteres son reglamentarios y cuáles responden a adaptaciones locales o de software.
        </p>

        <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-primary)', margin: '1.25rem 0' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            Alcance del Estándar UIT-R M.1677-1
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            El catálogo reglamentario de la UIT comprende los signos ortográficos: punto (<code>.-.-.-</code>), coma (<code>--..--</code>), interrogación (<code>..--..</code>), apóstrofo (<code>.----.</code>), guion (<code>-....-</code>), barra de fracción (<code>-..-.</code>), paréntesis, comillas, signo más y arroba comercial (<code>.--.-.</code>). También incluye señales de servicio como <strong>Error</strong> (8 puntos continuos), <strong>Espera</strong> (<code>.-...</code>), <strong>Invitación a transmitir</strong> (<code>-.-</code>) y <strong>Fin de transmisión</strong> (<code>...-.-</code>).
          </p>
        </div>
      </section>

      {/* 2. Puntuación y Reglas de Temporización Universal */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Reglas de Temporización en la Emisión de Símbolos
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          A diferencia de las letras cortas (como la E con 1 dit o la T con 1 dah), los símbolos de puntuación suelen estar compuestos por secuencias de 5 o 6 elementos. Por ello, mantener la cadencia matemática del estándar PARIS es vital para evitar que el receptor confunda un signo largo con varias letras consecutivas:
        </p>

        {/* Cuadrícula visual de proporciones */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1 Unidad</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Duración del punto (dit)</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-warning)' }}>3 Unidades</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Duración de la raya (dah)</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>1 Unidad</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Pausa intra-carácter</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3 Unidades</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Pausa entre caracteres</div>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-success)' }}>7 Unidades</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Pausa entre palabras</div>
            </div>
          </div>
        </div>

        {/* Llamada de advertencia: Barra inclinada vs Separador */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <AlertTriangle size={24} style={{ color: 'var(--accent-warning)', flexShrink: 0, marginTop: '0.2rem' }} />
          <div>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700 }}>
              Atención Crítica: Barra Inclinada (/) vs Separador Visual de Palabras
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
              Al escribir código Morse en texto plano, la barra diagonal <code>/</code> se utiliza frecuentemente como convención visual para representar el espacio entre palabras (por ejemplo: <code>... --- ... / .- -.-- ..- -.. .-</code>). Sin embargo, en el éter radial, el código Morse real de la barra inclinada (<code>-..-.</code>) únicamente se transmite cuando el texto original contiene literalmente una barra ortográfica o una fracción.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Ejemplos Prácticos Paso a Paso con Símbolos */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Ejemplos Prácticos de Transmisión con Símbolos
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          {[
            { title: 'Pregunta en Español', symbol: '?', text: '¿HOLA?', morse: '.... --- .-.. .- / ..--..', note: 'Nota: En telegrafía se omite el signo de apertura ¿ y solo se emite el cierre ..--..' },
            { title: 'Punto Final de Oración', symbol: '.', text: 'LLEGAMOS.', morse: '.-.. .-.. . --. .- -- --- ... / .-.-.-', note: 'El grupo final .-.-.- indica el cierre inequívoco del mensaje.' },
            { title: 'Separación con Coma', symbol: ',', text: 'SI, CLARO', morse: '... .. / --..-- / -.-. .-.. .- .-. ---', note: 'La coma --..-- separa de forma precisa las dos cláusulas.' },
            { title: 'Dirección de Correo Electrónico', symbol: '@', text: 'INFO@RADIO', morse: '.. -. ..-. --- / .--.-. / .-. .- -.. .. ---', note: 'La secuencia .--.-. representa fielmente la arroba oficial internacional.' }
          ].map((ex, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                {ex.title}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {ex.text}
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)', fontSize: '0.95rem', letterSpacing: '1px', marginBottom: '0.65rem' }}>
                {ex.morse}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ex.note}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Errores Comunes al Emplear Símbolos */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Los 4 Errores Más Frecuentes al Usar Símbolos en Morse
        </h2>

        <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', display: 'grid', gap: '1.25rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 1. Intentar Telegrafiar ¿ y ¡
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              El código Morse universal carece de signos invertidos de apertura. Intentar inventar combinaciones confunde al receptor; en español siempre se transmite únicamente el cierre al final.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 2. Confundir la Barra (/) con el Espacio
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              En texto impreso la barra indica espacio entre palabras, pero en sonido el espacio es un silencio de 7 unidades. Nunca envíes <code>-..-.</code> a menos que la palabra contenga una barra real.
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 3. Descomponer Símbolos Largos
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Los signos de 6 elementos como la interrogación (<code>..--..</code>) exigen mantener la pausa intra-carácter de 1 unidad. Si te detienes a la mitad, el oyente decodificará dos letras: "IM" o "D".
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 4. Confundir Signo con Prosign
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              El signo más (<code>.-.-.</code>) representa adición en texto ordinario, pero en protocolo operativo significa Fin de Mensaje (<code>&lt;AR&gt;</code>). El contexto operativo define la intención.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Caracteres Especiales Sin Código Propio */}
      <section style={{ marginBottom: '3rem', background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Caracteres que Carecen de Código Morse Individual
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          A diferencia de los teclados modernos con códigos ASCII o Unicode que asignan números binarios a cientos de glifos, el código Morse internacional fue concebido para la telegrafía austera.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Para los caracteres no contemplados de forma aislada, la UIT estipuló reglas de transmisión formal:
        </p>

        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Signo de Multiplicación (×):</strong> Se transmite utilizando el código de la letra <code>X</code> (<code>-..-</code>).
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Signo de Porcentaje (%):</strong> Se telegrafía como la secuencia de cifra <code>0</code>, barra de fracción <code>/</code> y cifra <code>0</code> (por ejemplo, <code>5%</code> se telegrafía como <code>5-0/0</code>).
          </li>
          <li>
            <strong style={{ color: 'var(--text-primary)' }}>Signo de Por Mil (‰):</strong> Se transmite como la secuencia de cifra <code>0</code>, barra <code>/</code> y dos ceros <code>00</code> (<code>0/00</code>).
          </li>
        </ul>
      </section>

      {/* 6. Comparativa: Símbolos de Puntuación vs Prosigns */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Diferencia Técnica: Símbolos de Puntuación vs Prosigns
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Un <strong>signo de puntuación</strong> representa un carácter tipográfico en el cuerpo del texto. Un <strong>prosign</strong> (señal de procedimiento) es una orden operativa enviada sin pausas entre letras para guiar el flujo de la comunicación:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Tipo</th>
                <th style={{ padding: '0.85rem 1rem' }}>Símbolo / Señal</th>
                <th style={{ padding: '0.85rem 1rem' }}>Secuencia Sonora</th>
                <th style={{ padding: '0.85rem 1rem' }}>Significado Principal</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Puntuación</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Signo Más (+)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>.-.-.</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Signo de adición en fórmulas o balances</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-success)' }}>Prosign</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>&lt;AR&gt; (Fin de Mensaje)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>.-.-.</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Señala la conclusión formal de un despacho y cede el turno</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-primary)' }}>Puntuación</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Signo Igual (=)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>-...-</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Signo de igualdad matemática</td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--accent-success)' }}>Prosign</td>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>&lt;BT&gt; (Salto de Párrafo)</td>
                <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-warning)' }}>-...-</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Separador entre el encabezado telegráfico y el cuerpo del texto</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Preguntas Frecuentes (FAQ Accordion con Schema) */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} />
          Preguntas Frecuentes sobre Símbolos en Código Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqData.map((item, idx) => (
            <div key={idx} style={{ background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.1rem 1.25rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span>{item.q}</span>
                {openFaqIndex === idx ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
              </button>

              {openFaqIndex === idx && (
                <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.85rem' }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONCLUSIÓN Y ENLACES AUTORITATIVOS */}
      <section style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Herramientas y Referencias Oficiales
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Para traducir frases completas, transmitir señales o decodificar audios y fotos con signos de puntuación, utiliza nuestras herramientas interactivas:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <a
            href="/es/"
            onClick={(e) => handleNav(e, 'spanish', '/es/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, textDecoration: 'none' }}
          >
            Traductor Morse en Español <ArrowRight size={16} />
          </a>
          <a
            href="/es/decodificador-codigo-morse/"
            onClick={(e) => handleNav(e, 'morsedecoder', '/es/decodificador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', background: 'var(--surface-hover)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)', textDecoration: 'none' }}
          >
            Decodificador de Código Morse <ArrowRight size={16} />
          </a>
        </div>

        {/* Fuentes y normativas */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
          <span>
            Norma Reguladora Mundial:{' '}
            <a href="https://www.itu.int/rec/R-REC-M.1677-1-200910-I" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Recomendación UIT-R M.1677-1 Código Morse Internacional <ExternalLink size={12} />
            </a>
          </span>
          <span>
            Autoridad de Radioaficionados:{' '}
            <a href="https://www.arrl.org/code-characters" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              ARRL Code Characters &amp; Prosigns <ExternalLink size={12} />
            </a>
          </span>
        </div>
      </section>

    </div>
  );
}
