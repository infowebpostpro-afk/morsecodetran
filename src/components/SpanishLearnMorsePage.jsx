import React, { useState } from 'react';
import {
  ShieldCheck, Volume2, Play, Square, Eye, EyeOff, RotateCcw,
  Sparkles, Zap, Award, ArrowRight, ChevronDown, ChevronUp,
  CheckCircle, AlertTriangle, BookOpen, Clock, Radio, Headphones, Target, HelpCircle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { translateTextToMorse, getCharacterBreakdown } from '../engine/morseEngine.js';

export function SpanishLearnMorsePage({ wpm = 20, setWpm, frequency = 600, volume = 0.5, showToast, setActiveTab }) {
  // Estado del simulador interactivo de práctica acústica
  const [farnsworthWpm, setFarnsworthWpm] = useState(12);
  const [currentLevel, setCurrentLevel] = useState('beginner'); // beginner, koch, words
  const [targetChar, setTargetChar] = useState({ text: 'E', morse: '.' });
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Sets de ejercicios acústicos
  const beginnerSet = [
    { text: 'E', morse: '.' },
    { text: 'T', morse: '-' },
    { text: 'A', morse: '.-' },
    { text: 'N', morse: '-.' },
    { text: 'M', morse: '--' },
    { text: 'I', morse: '..' },
    { text: 'S', morse: '...' },
    { text: 'O', morse: '---' }
  ];

  const kochSet = [
    { text: 'K', morse: '-.-' },
    { text: 'M', morse: '--' },
    { text: 'R', morse: '.-.' },
    { text: 'S', morse: '...' },
    { text: 'U', morse: '..-' },
    { text: 'A', morse: '.-' },
    { text: 'P', morse: '.--.' },
    { text: 'T', morse: '-' },
    { text: 'L', morse: '.-..' },
    { text: 'O', morse: '---' }
  ];

  const wordSet = [
    { text: 'SOS', morse: '... --- ...' },
    { text: 'HOLA', morse: '.... --- .-.. .-' },
    { text: 'SOL', morse: '... --- .-..' },
    { text: 'PAN', morse: '.--. .- -.' },
    { text: 'MAR', morse: '-- .- .-.' },
    { text: 'LUZ', morse: '.-.. ..- --..' }
  ];

  const getActiveSet = () => {
    if (currentLevel === 'koch') return kochSet;
    if (currentLevel === 'words') return wordSet;
    return beginnerSet;
  };

  const handleNextDrill = () => {
    const set = getActiveSet();
    let next;
    do {
      next = set[Math.floor(Math.random() * set.length)];
    } while (set.length > 1 && next.text === targetChar.text);

    setTargetChar(next);
    setIsRevealed(false);
    setUserGuess('');
    setFeedback(null);
    handlePlayAudio(next.text);
  };

  const handlePlayAudio = (textToPlay = targetChar.text) => {
    audioEngine.stop();
    const morse = translateTextToMorse(textToPlay);
    const breakdown = getCharacterBreakdown(textToPlay, morse);

    setIsPlaying(true);
    audioEngine.playSequence({
      breakdown,
      wpm: Math.max(wpm, 18), // ritmo sonoro rápido desde el primer día
      farnsworthWpm: farnsworthWpm,
      frequency: frequency || 600,
      volume: volume || 0.5,
      onProgress: ({ isEnded }) => {
        if (isEnded) setIsPlaying(false);
      }
    });
  };

  const handleCheckAnswer = (e) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    if (userGuess.trim().toUpperCase() === targetChar.text.toUpperCase()) {
      setFeedback('correct');
      setIsRevealed(true);
      if (showToast) showToast('¡Correcto! Excelente reconocimiento auditivo ✓');
    } else {
      setFeedback('incorrect');
      if (showToast) showToast('Casi. Vuelve a escuchar la melodía e inténtalo.');
    }
  };

  const handleNav = (e, tab, path) => {
    e.preventDefault();
    if (setActiveTab) setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({ tab }, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: '¿Cuál es la forma más rápida y eficaz de aprender código Morse?',
      a: 'Para la gran mayoría de principiantes, aprender los caracteres por su ritmo auditivo (di-dah) y practicar de 10 a 15 minutos diarios es el método con mayor tasa de éxito. La combinación del Método Koch (incorporación progresiva de letras) y la temporización Farnsworth (caracteres rápidos con silencios más anchos) permite interiorizar reflejos automáticos sin estancarse.'
    },
    {
      q: '¿Por qué no se debe aprender código Morse mirando tablas de puntos y rayas?',
      a: 'El código Morse no es un alfabeto visual; es un ritmo sonoro acústico. Si memorizas visualmente "A = punto y raya", cuando escuches una señal tu cerebro intentará primero imaginar los puntos, luego contarlos y por último buscar la letra. Ese proceso de triple traducción mental colapsa inevitablemente a velocidades superiores a 5 WPM. Aprender de oído permite que el sonido "di-dah" evoque inmediatamente la letra A.'
    },
    {
      q: '¿Cuántos minutos al día se deben practicar?',
      a: 'La clave es la frecuencia, no la duración. Dos sesiones breves de 10 a 15 minutos al día son infinitamente más provechosas que una sesión maratoniana de 2 horas los fines de semana. Las sesiones cortas previenen la fatiga mental y consolidan la memoria auditiva a largo plazo.'
    },
    {
      q: '¿En qué consiste el Método Koch para aprender Morse?',
      a: 'Diseñado por el psicólogo Ludwig Koch, consiste en aprender los caracteres a la velocidad final de destino (20 WPM), pero comenzando con solo dos letras (habitualmente K y M). Una vez que el alumno alcanza el 90% de aciertos en ejercicios de recepción auditiva, se añade una tercera letra, y así sucesivamente. De este modo, nunca se tiene que desaprender una velocidad lenta.'
    },
    {
      q: '¿Qué es el espaciado o temporización Farnsworth?',
      a: 'Ideado por Donald Farnsworth, este método reproduce cada letra con la cadencia sonora de una velocidad alta (por ejemplo, 18 a 20 WPM), pero alarga las pausas de silencio entre letras (equivalente a 10 o 12 WPM). El cerebro asimila la melodía intacta de la letra y dispone del tiempo necesario para identificarla antes del siguiente carácter.'
    },
    {
      q: '¿Cuánto tiempo se tarda en dominar el código Morse con fluidez?',
      a: 'No existe un plazo fijo milagroso. Con práctica diaria de 15 minutos, la mayoría de los estudiantes domina el reconocimiento auditivo de las 26 letras básicas y números a 12-15 WPM en unas 4 a 6 semanas. Alcanzar la soltura de un radioaficionado fluido (20+ WPM) suele requerir entre 2 y 4 meses de entrenamiento regular.'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/es/" onClick={(e) => handleNav(e, 'spanish', '/es/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Inicio</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Cómo Aprender Código Morse</span>
      </nav>

      {/* Hero Header */}
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Estándar Internacional UIT-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Cómo Aprender Código Morse: Guía Definitiva para Principiantes
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
          Guía práctica para aprender código Morse de oído, desarrollar reflejos acústicos inmediatos y entrenar a un ritmo constante con los métodos Koch y Farnsworth.
        </p>
      </header>

      {/* SIMULADOR INTERACTIVO DE ENTRENAMIENTO AUDITIVO */}
      <section className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-md)', marginBottom: '3rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Headphones size={26} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Simulador Interactivo de Reconocimiento Acústico
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                Entrena tu oído primero: escucha el ritmo sonoro antes de revelar el carácter.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'beginner', label: 'Básico (E, T, A...)' },
              { id: 'koch', label: 'Orden Koch (K, M...)' },
              { id: 'words', label: 'Palabras Cortas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setCurrentLevel(tab.id); setIsRevealed(false); setFeedback(null); }}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '999px',
                  border: '1px solid',
                  borderColor: currentLevel === tab.id ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: currentLevel === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: currentLevel === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo del Ejercicio */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Radio size={48} style={{ color: isPlaying ? 'var(--accent-primary)' : 'var(--text-muted)', animation: isPlaying ? 'pulse 1s infinite' : 'none' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {isPlaying ? 'Reproduciendo señal telegráfica...' : 'Haz clic en Reproducir Sonido para escuchar'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePlayAudio()}
                disabled={isPlaying}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              >
                <Play size={16} /> Reproducir Sonido
              </button>
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              >
                {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                {isRevealed ? 'Ocultar' : 'Revelar Respuesta'}
              </button>
              <button
                onClick={handleNextDrill}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              >
                <RotateCcw size={16} /> Siguiente
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)' }}>
            {isRevealed ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{targetChar.text}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', color: 'var(--accent-warning)', letterSpacing: '3px' }}>{targetChar.morse}</div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-muted)' }}>?</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Escucha el ritmo y adivina el carácter</div>
              </div>
            )}

            <form onSubmit={handleCheckAnswer} style={{ display: 'flex', gap: '0.5rem', maxWidth: '280px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Escribe la letra o palabra..."
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                maxLength={10}
                style={{ flex: 1, padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                style={{ padding: '0.5rem 1rem', fontWeight: 700, background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
              >
                Comprobar
              </button>
            </form>

            {feedback === 'correct' && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} /> ¡Correcto! Reconocimiento auditivo automático.
              </div>
            )}
            {feedback === 'incorrect' && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                <AlertTriangle size={16} /> No coincide. Vuelve a reproducir y siente la cadencia.
              </div>
            )}
          </div>
        </div>

        {/* Sliders de Velocidad y Espaciado Farnsworth */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Velocidad de Carácter: <strong style={{ color: 'var(--accent-primary)' }}>{Math.max(wpm, 18)} WPM</strong> (Rápida para asimilar el sonido)
            </label>
            <input
              type="range"
              min="15"
              max="35"
              value={Math.max(wpm, 18)}
              onChange={(e) => setWpm && setWpm(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Espaciado Farnsworth: <strong style={{ color: 'var(--accent-warning)' }}>{farnsworthWpm} WPM</strong> (Pausa amplia entre letras para pensar)
            </label>
            <input
              type="range"
              min="5"
              max="25"
              value={farnsworthWpm}
              onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </section>

      {/* ARTÍCULO DIDÁCTICO COMPLETO */}

      {/* 1. Aprende por Sonido, No por la Vista */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Aprende Código Morse por el Oído, Nunca por la Vista
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Una tabla visual de código Morse es excelente como documento de consulta, pero <strong>nunca debe ser tu herramienta primaria de aprendizaje</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Si memorizas visualmente que la letra <strong>A es <code>.-</code></strong>, cuando escuches una transmisión en la radio tu mente intentará ejecutar este proceso lento:
        </p>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', textAlign: 'center', fontFamily: 'monospace', color: 'var(--accent-danger)', margin: '1rem 0' }}>
          Sonido ➔ Imaginar Puntos y Rayas ➔ Contar los Elementos ➔ Buscar la Letra A
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Ese proceso colapsa en cuanto la velocidad supera los 5 WPM. El objetivo primordial de la formación moderna es lograr el reflejo directo e instantáneo:
        </p>
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', textAlign: 'center', fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700, margin: '1rem 0' }}>
          Sonido Acústico "di-dah" ➔ Reconocimiento Inmediato de la Letra A
        </div>
      </section>

      {/* 2. El Método Koch Explicado */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          El Método Koch: Asimilación Progresiva a Velocidad Real
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Diseñado en 1936 por el psicólogo Ludwig Koch, este método revolucionó la pedagogía de la telegrafía.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          En lugar de intentar memorizar las 26 letras simultáneamente a ritmo lento, Koch propone comenzar con únicamente <strong>dos caracteres</strong> (habitualmente K y M por su acusado contraste sonoro: <code>-.-</code> frente a <code>--</code>), emitidos a la velocidad final completa de 20 WPM.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Cuando el alumno alcanza el <strong>90% de precisión</strong> en la identificación de esas dos letras, se añade una tercera letra (por ejemplo, R). De esta manera, cada carácter se aprende con su melodía definitiva intacta y nunca se produce el temido "muro de los 10 WPM".
        </p>
      </section>

      {/* 3. Temporización Farnsworth */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Cómo el Espaciado Farnsworth Facilita el Entrenamiento
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Los principiantes se enfrentan a una paradoja: a velocidades muy lentas (5 WPM) el cerebro cuenta los puntos; a velocidades altas (20 WPM) no da tiempo a pensar qué letra acaba de sonar.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          La técnica desarrollada por Donald Farnsworth resuelve esto con elegancia: <strong>mantiene la velocidad de cada letra a 18–20 WPM, pero expande los silencios entre letras a un ritmo equivalente a 8–10 WPM</strong>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
          <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Método Koch:</strong> Gestiona la progresión de qué letras aprendes y en qué orden secuencial.
          </div>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <strong style={{ color: 'var(--accent-warning)' }}>Espaciado Farnsworth:</strong> Gestiona la separación temporal y te otorga tiempo de reflexión entre caracteres.
          </div>
        </div>
      </section>

      {/* 4. Rutina Diaria de Práctica de 15 Minutos */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Rutina Diaria de Entrenamiento de 15 Minutos
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          No necesitas sesiones agotadoras. Una rutina breve y metódica de 15 minutos al día garantiza un progreso constante:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Fase de Entrenamiento</th>
                <th style={{ padding: '0.85rem 1rem' }}>Tiempo Asignado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Objetivo Concreto</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>1. Calentamiento</td>
                <td style={{ padding: '0.85rem 1rem' }}>2 minutos</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Escuchar y repasar caracteres ya asimilados para afinar el oído.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>2. Reconocimiento Activo</td>
                <td style={{ padding: '0.85rem 1rem' }}>8 minutos</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Pruebas de recepción al azar con el juego activo de letras Koch.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>3. Palabras Cortas</td>
                <td style={{ padding: '0.85rem 1rem' }}>3 minutos</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Copiar vocablos breves en español (SOL, MAR, PAN, RED) para pasar de letras aisladas a bloques.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>4. Transmisión Opcional</td>
                <td style={{ padding: '0.85rem 1rem' }}>2 minutos</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Emitir con el manipulador interactivo para afianzar el ritmo muscular.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Regla de Oro en la Recepción de Señales */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          La Regla Fundamental al Recibir Código Morse
        </h2>
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-danger)', marginBottom: '1rem' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700 }}>
            Nunca te detengas a perseguir un carácter perdido
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Si una letra no te viene a la mente de forma instantánea, <strong>déjala ir de inmediato</strong>. Si te quedas pensando <em>"¿qué letra era esa?"</em>, te perderás las dos o tres letras siguientes que ya están sonando. En telegrafía real, los operadores experimentados simplemente dejan un guion o espacio mental y continúan copiando el resto del mensaje.
          </p>
        </div>
      </section>

      {/* 6. Cuándo Incorporar Cifras Numéricas */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Cuándo Añadir Números y Signos de Puntuación
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Domina primero el abecedario básico. Una vez consolidada la recepción de las letras, incorporar los números resulta sumamente sencillo gracias a su estructura matemática perfecta de 5 elementos:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {[
            { num: '1', morse: '.----' },
            { num: '2', morse: '..---' },
            { num: '3', morse: '...--' },
            { num: '4', morse: '....-' },
            { num: '5', morse: '.....' },
            { num: '6', morse: '-....' },
            { num: '7', morse: '--...' },
            { num: '8', morse: '---..' },
            { num: '9', morse: '----.' },
            { num: '0', morse: '-----' }
          ].map(d => (
            <div key={d.num} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.65rem', borderRadius: '0.5rem', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{d.num}</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--accent-warning)', marginTop: '0.2rem' }}>{d.morse}</div>
            </div>
          ))}
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Para profundizar en la simetría de las cifras, revisa nuestra guía completa de{' '}
          <a href="/es/numeros-codigo-morse/" onClick={(e) => handleNav(e, 'numbers', '/es/numeros-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>
            Números en Código Morse
          </a>.
        </p>
      </section>

      {/* 7. Los 6 Errores Más Frecuentes de los Principiantes */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Los 6 Errores que Frenan el Avance de los Principiantes
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 1. Contar dits y dahs
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Es el principal obstáculo mental. Intenta captar el ritmo global como si fuera una canción en lugar de sumar puntos.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 2. Mirar la tabla mientras escuchas
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Utiliza la tabla visual únicamente para verificar tus aciertos al final, nunca como apoyo de lectura en vivo.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 3. Entrenar a velocidad demasiado lenta
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Configurar los caracteres a menos de 15 WPM enseña un ritmo deformado que tendrás que desaprender después.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 4. Practicar solo los fines de semana
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              La memoria neuro-acústica exige repetición constante. Quince minutos diarios rinden mucho más que dos horas esporádicas.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 5. Obsesionarse con el 100% perfecto
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Alcanzar el 90% de fiabilidad en una etapa es suficiente para avanzar a la siguiente letra sin estancarse.
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} /> 6. Intentar transmitir antes de saber recibir
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Cualquiera puede accionar una llave telegráfica; la habilidad de alto valor radica en decodificar de oído con soltura.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Hoja de Ruta de Progreso Realista en 7 Pasos */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Hoja de Ruta de Progreso Realista en 7 Pasos
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { step: '1', title: 'Reconocer caracteres individuales de oído sin ver tablas.' },
            { step: '2', title: 'Identificar letras instantáneamente sin contar dits y dahs.' },
            { step: '3', title: 'Copiar secuencias aleatorias de 3 a 5 letras seguidas.' },
            { step: '4', title: 'Reconocer palabras comunes completas de golpe (head copy).' },
            { step: '5', title: 'Copiar frases sencillas en español a velocidad moderada.' },
            { step: '6', title: 'Reducir el espaciado Farnsworth hacia la velocidad estándar.' },
            { step: '7', title: 'Operar en el éter radial y realizar tu primer comunicado QSO en CW.' }
          ].map(s => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                {s.step}
              </div>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Preguntas Frecuentes (FAQ Accordion) */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HelpCircle style={{ color: 'var(--accent-primary)' }} />
          Preguntas Frecuentes sobre el Aprendizaje de Morse
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-card)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.25rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Enlaces y Conclusión */}
      <footer style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Herramientas Complementarias para tu Aprendizaje
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Pon a prueba tu recepción con nuestro decodificador interactivo o practica la manipulación con sonido realista:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/es/decodificador-codigo-morse/"
            onClick={(e) => handleNav(e, 'morsedecoder', '/es/decodificador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Decodificador de Código Morse <ArrowRight size={16} />
          </a>
          <a
            href="/es/manipulador-codigo-morse/"
            onClick={(e) => handleNav(e, 'keyer', '/es/manipulador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Manipulador Telegráfico Interactivo
          </a>
        </div>
      </footer>
    </div>
  );
}

export default SpanishLearnMorsePage;
