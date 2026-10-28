import React, { useState, useMemo } from 'react';
import {
  Volume2, Copy, Play, Square, Check, ChevronDown, ChevronUp,
  Hash, ArrowLeftRight, HelpCircle, ShieldCheck, ArrowRight, Sparkles, AlertTriangle
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  translatePortugueseNumbersToMorse,
  translateMorseToPortugueseNumbers
} from '../engine/portugueseMorse.js';

export const PORTUGUESE_MORSE_NUMBERS = [
  { num: '0', morse: '-----', name: 'Zero', ditDah: 'dah-dah-dah-dah-dah', desc: '5 traços. O espelho extremo do 5 (5 pontos).' },
  { num: '1', morse: '.----', name: 'Um', ditDah: 'di-dah-dah-dah-dah', desc: '1 ponto inicial seguido de 4 traços. Espelho do 9.' },
  { num: '2', morse: '..---', name: 'Dois', ditDah: 'di-di-dah-dah-dah', desc: '2 pontos iniciais seguidos de 3 traços. Espelho do 8.' },
  { num: '3', morse: '...--', name: 'Três', ditDah: 'di-di-di-dah-dah', desc: '3 pontos iniciais seguidos de 2 traços. Espelho do 7.' },
  { num: '4', morse: '....-', name: 'Quatro', ditDah: 'di-di-di-di-dah', desc: '4 pontos iniciais seguidos de 1 traço. Espelho do 6.' },
  { num: '5', morse: '.....', name: 'Cinco', ditDah: 'di-di-di-di-dit', desc: '5 pontos consecutivos. O ponto de inflexão e pivô central.' },
  { num: '6', morse: '-....', name: 'Seis', ditDah: 'dah-di-di-di-dit', desc: '1 traço inicial seguido de 4 pontos. Espelho do 4.' },
  { num: '7', morse: '--...', name: 'Sete', ditDah: 'dah-dah-di-di-dit', desc: '2 traços iniciais seguidos de 3 pontos. Espelho do 3.' },
  { num: '8', morse: '---..', name: 'Oito', ditDah: 'dah-dah-dah-di-dit', desc: '3 traços iniciais seguidos de 2 pontos. Espelho do 2.' },
  { num: '9', morse: '----.', name: 'Nove', ditDah: 'dah-dah-dah-dah-dit', desc: '4 traços iniciais seguidos de 1 ponto. Espelho do 1.' }
];

export const PORTUGUESE_MIRROR_PAIRS = [
  { pair: '1 e 9', left: '1: .----', right: '9: ----.', desc: '1 ponto + 4 traços contra 4 traços + 1 ponto' },
  { pair: '2 e 8', left: '2: ..---', right: '8: ---..', desc: '2 pontos + 3 traços contra 3 traços + 2 pontos' },
  { pair: '3 e 7', left: '3: ...--', right: '7: --...', desc: '3 pontos + 2 traços contra 2 traços + 3 pontos' },
  { pair: '4 e 6', left: '4: ....-', right: '6: -....', desc: '4 pontos + 1 traço contra 1 traço + 4 pontos' },
  { pair: '5 e 0', left: '5: .....', right: '0: -----', desc: 'Todos pontos (5 dits) contra todos traços (5 dahs)' }
];

export const PORTUGUESE_CUT_NUMBERS = [
  { num: '0', cut: 'T', morse: '-', standard: '-----', desc: 'Extremamente usado em concursos de radioamadorismo e no envio de relatórios RST (ex: 5NN em vez de 599)' },
  { num: '1', cut: 'A', morse: '.-', standard: '.----', desc: 'Substitui 4 traços longos por um dit e um dah rápidos' },
  { num: '2', cut: 'U', morse: '..-', standard: '..---', desc: 'Abreviatura telegráfica' },
  { num: '3', cut: 'V', morse: '...-', standard: '...--', desc: 'Abreviatura de alta velocidade' },
  { num: '5', cut: 'E', morse: '.', standard: '.....', desc: 'Apenas 1 dit para velocidade extrema' },
  { num: '7', cut: 'G', morse: '--.', standard: '--...', desc: 'Abreviatura telegráfica' },
  { num: '8', cut: 'D', morse: '-..', standard: '---..', desc: 'Abreviatura telegráfica' },
  { num: '9', cut: 'N', morse: '-.', standard: '----.', desc: 'Padrão universal em reportes RST (ex: 599 torna-se 5NN)' }
];

export function PortugueseNumbersPage({
  wpm = 20,
  frequency = 600,
  volume = 0.5,
  showToast,
  setActiveTab
}) {
  const [mode, setMode] = useState('num2morse'); // 'num2morse' | 'morse2num'
  const [inputVal, setInputVal] = useState('2026');
  const [playingKey, setPlayingKey] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Quiz state
  const [quizTab, setQuizTab] = useState('num2morse');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState({});
  const [revealedQuiz, setRevealedQuiz] = useState({});

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

  const conversionResult = useMemo(() => {
    if (mode === 'num2morse') {
      return translatePortugueseNumbersToMorse(inputVal);
    } else {
      return translateMorseToPortugueseNumbers(inputVal);
    }
  }, [inputVal, mode]);

  const outputVal = mode === 'num2morse' ? conversionResult.morseText : conversionResult.text;

  const handlePlayAudio = () => {
    const morseToPlay = mode === 'num2morse' ? conversionResult.morseText : inputVal;
    if (!morseToPlay || conversionResult.hasInvalid) return;

    setIsPlaying(true);
    audioEngine.playSequence({
      morse: morseToPlay,
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
  };

  const handleCopy = async () => {
    if (!outputVal || conversionResult.hasInvalid) return;
    try {
      await navigator.clipboard.writeText(outputVal);
      setCopiedKey('output');
      if (showToast) showToast('Copiado para a área de transferência! ✓');
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      if (showToast) showToast('Não foi possível copiar. Selecione o resultado manualmente.');
    }
  };

  const handlePlaySingle = (num, morse) => {
    setPlayingKey(num);
    audioEngine.playSequence({
      breakdown: [{ char: num, morse, isSpace: false }],
      wpm,
      frequency,
      volume,
      onProgress: ({ isEnded }) => {
        if (isEnded) setPlayingKey(null);
      }
    });
  };

  const numQuizQuestions = [
    { id: 'q1', q: '7', ans: '--...' },
    { id: 'q2', q: '3', ans: '...--' },
    { id: 'q3', q: '0', ans: '-----' },
    { id: 'q4', q: '5', ans: '.....' }
  ];

  const morseQuizQuestions = [
    { id: 'm1', q: '-....', ans: '6' },
    { id: 'm2', q: '..---', ans: '2' },
    { id: 'm3', q: '----.', ans: '9' },
    { id: 'm4', q: '.----', ans: '1' }
  ];

  const handleCheckAnswer = (qId, expected) => {
    const userVal = (quizAnswers[qId] || '').trim();
    if (userVal.toLowerCase() === expected.toLowerCase()) {
      setQuizFeedback({ ...quizFeedback, [qId]: 'correct' });
    } else {
      setQuizFeedback({ ...quizFeedback, [qId]: 'incorrect' });
    }
  };

  return (
    <div className="page-container page-numbers-container" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/pt/" onClick={(e) => handleNav(e, 'portuguese', '/pt/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Início</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Números em Código Morse</span>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Números em Código Morse: Tabela de 0 a 9 e Conversor
        </h1>
        <p className="hero-subtitle" style={{ maxWidth: '850px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Converta dígitos de 0 a 9 para código Morse instantaneamente, escute o áudio em tempo real e compreenda a regra da escada simétrica de 5 elementos que torna os números muito fáceis de memorizar.
        </p>
      </section>

      {/* Interactive Converter Box */}
      <section className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--surface-card)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Hash size={22} style={{ color: 'var(--accent-primary)' }} />
            Conversor Numérico Interativo
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { setMode('num2morse'); setInputVal('2026'); }}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'num2morse' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: mode === 'num2morse' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Número → Morse
            </button>
            <button
              onClick={() => { setMode('morse2num'); setInputVal('..--- ----- ..--- -....'); }}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: mode === 'morse2num' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                color: mode === 'morse2num' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              Morse → Número
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {mode === 'num2morse' ? 'Digite dígitos ou datas (ex: 2026):' : 'Cole pontos e traços numéricos:'}
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1.1rem',
                fontFamily: mode === 'morse2num' ? 'monospace' : 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Resultado:
            </label>
            <div style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-warning, #f59e0b)',
              fontSize: '1.15rem',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              wordBreak: 'break-all'
            }}>
              {outputVal || <span style={{ color: 'var(--text-muted)' }}>Aguardando entrada...</span>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {!isPlaying ? (
            <button
              onClick={handlePlayAudio}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', cursor: 'pointer' }}
            >
              <Play size={16} />
              <span>Ouvir Sequência</span>
            </button>
          ) : (
            <button
              onClick={handleStopAudio}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--danger)', cursor: 'pointer' }}
            >
              <Square size={16} />
              <span>Parar</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', cursor: 'pointer' }}
          >
            <Copy size={16} />
            <span>Copiar Resultado</span>
          </button>
        </div>
      </section>

      {/* Grid of Standard Digits 0-9 */}
      <section style={{ marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Tabela dos Dígitos Oficiais (0–9) com Reprodução de Áudio
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {PORTUGUESE_MORSE_NUMBERS.map(item => (
            <div
              key={item.num}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: playingKey === item.num ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                backgroundColor: playingKey === item.num ? 'rgba(56, 189, 248, 0.15)' : 'var(--surface-card)',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{item.num}</span>
                <button
                  onClick={() => handlePlaySingle(item.num, item.morse)}
                  title="Ouvir som"
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '2px', color: 'var(--accent-warning)', marginTop: '0.75rem' }}>
                {item.morse}
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                {item.ditDah}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Drills Quiz */}
      <section className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '3.5rem' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
          Treinamento Rápido de Fixação
        </h3>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Teste sua retenção mental antes de avançar para a teoria:
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setQuizTab('num2morse')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: quizTab === 'num2morse' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: quizTab === 'num2morse' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Número para Morse
          </button>
          <button
            onClick={() => setQuizTab('morse2num')}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: quizTab === 'morse2num' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
              color: quizTab === 'morse2num' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            Morse para Número
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {(quizTab === 'num2morse' ? numQuizQuestions : morseQuizQuestions).map(qItem => {
            const status = quizFeedback[qItem.id];
            const isRevealed = revealedQuiz[qItem.id];

            return (
              <div key={qItem.id} style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Qual é o código de: <strong style={{ color: 'var(--text-primary)', fontSize: '1.2rem' }}>{qItem.q}</strong>?
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder={quizTab === 'num2morse' ? 'ex: --...' : 'ex: 7'}
                    value={quizAnswers[qItem.id] || ''}
                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [qItem.id]: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'var(--text-primary)',
                      fontFamily: quizTab === 'num2morse' ? 'monospace' : 'inherit'
                    }}
                  />
                  <button
                    onClick={() => handleCheckAnswer(qItem.id, qItem.ans)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Verificar
                  </button>
                </div>

                {status === 'correct' && (
                  <div style={{ color: 'var(--success, #10b981)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={14} /> Correto!
                  </div>
                )}
                {status === 'incorrect' && (
                  <div style={{ color: 'var(--danger, #ef4444)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Incorreto. <button onClick={() => setRevealedQuiz({ ...revealedQuiz, [qItem.id]: true })} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Ver resposta</button>
                  </div>
                )}
                {isRevealed && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Resposta: <code style={{ color: 'var(--accent-primary)' }}>{qItem.ans}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* EDUCATIONAL SEO ARTICLE (Full 3,000+ words parity) */}
      <article className="seo-article-container">
        <div className="article-body-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* 1. Estrutura dos Dígitos: A Regra da Escada Simétrica */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Estrutura dos Dígitos: A Regra da Escada Simétrica
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Aprender os números em código Morse é muito mais simples e metódico do que memorizar as letras. Enquanto as letras variam entre 1 e 4 elementos conforme sua frequência no idioma, <strong>cada um dos dez algarismos (0 a 9) é formado por exatamente 5 elementos</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fase 1: Os Pontos Aumentam (1 → 5)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>1</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>.----</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 ponto + 4 traços</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>2</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>..---</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 pontos + 3 traços</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>3</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>...--</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 pontos + 2 traços</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>4</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>....-</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 pontos + 1 traço</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>5 (Âncora Central)</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem', color: '#10b981', fontWeight: 800 }}>.....</code>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>5 pontos (Tudo pontos)</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Fase 2: Os Traços Aumentam (6 → 0)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>6</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>-....</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 traço + 4 pontos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>7</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>--...</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 traços + 3 pontos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>8</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>---..</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3 traços + 2 pontos</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>9</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem' }}>----.</code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 traços + 1 ponto</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', borderRadius: 'var(--radius-sm)' }}>
                    <span><strong>0 (Âncora Extrema)</strong></span>
                    <code className="morse-font" style={{ fontSize: '1.1rem', color: '#f59e0b', fontWeight: 800 }}>-----</code>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>5 traços (Tudo traços)</span>
                  </div>
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '1.25rem', lineHeight: 1.6 }}>
              Fixe mentalmente os dois extremos: o <strong>5 (<code className="morse-font">.....</code>)</strong> que são 5 pontos e o <strong>0 (<code className="morse-font">-----</code>)</strong> que são 5 traços. Os números de 1 a 4 simplesmente preenchem pontos a partir da esquerda, e os de 6 a 9 preenchem traços a partir da esquerda.
            </p>
          </section>

          {/* 2. Os 5 Pares Espelho */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Os 5 Pares Espelho: Aprenda a Metade, Domine os Dez
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Existe uma relação de inversão geométrica exata entre os números que somam dez ou ocupam posições complementares na régua:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Número</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Morse</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Par Espelho</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Inversão do Padrão</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {PORTUGUESE_MIRROR_PAIRS.map((pair, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ textAlign: 'center', fontSize: '1.1rem', padding: '0.6rem 1rem' }}><strong>{pair.pair.split(' ')[0]}</strong></td>
                      <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--accent-primary)' }}>{pair.left.split(' ')[1]}</code></td>
                      <td style={{ textAlign: 'center', fontSize: '1.1rem' }}><strong>{pair.pair.split(' ')[2]}</strong></td>
                      <td style={{ textAlign: 'center' }}><code className="morse-font" style={{ fontSize: '1.15rem', color: '#f59e0b' }}>{pair.right.split(' ')[1]}</code></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pair.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Por exemplo, o <strong>2 (<code className="morse-font">..---</code>)</strong> e o <strong>8 (<code className="morse-font">---..</code>)</strong> são exatamente a mesma sequência invertida. Compreender essa lógica espelhada reduz o esforço de memorização pela metade.
            </p>
          </section>

          {/* 3. Como Escrever Números de Vários Dígitos */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Escrever e Transmitir Cifras de Múltiplos Dígitos
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Uma regra sagrada no código Morse: <strong>cada algarismo é transmitido de forma autônoma e individual</strong>. Nunca se inventa um código agrupado para números inteiros como 10, 100 ou 2026.
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ width: '120px', padding: '0.75rem 1rem' }}>Número</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Representação em Código Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Decomposição Dígito a Dígito</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>10</td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.---- -----</code></td>
                    <td>1 (.----) + espaço + 0 (-----)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>25</td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>..--- .....</code></td>
                    <td>2 (..---) + espaço + 5 (.....)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>190</td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.---- ----. -----</code></td>
                    <td>1 (.----) + 9 (----.) + 0 (-----)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>2026</td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>..--- ----- ..--- -....</code></td>
                    <td>2 (..---) + 0 (-----) + 2 (..---) + 6 (-....)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>12345</td>
                    <td><code className="morse-font" style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>.---- ..--- ...-- ....- .....</code></td>
                    <td>Sequência contínua do 1 ao 5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>73 em Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '0.5rem' }}>
                  73 = --... ...--
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Na comunidade de radioamadores do Brasil (LABRE) e de Portugal (REP), <strong>73</strong> é a despedida telegráfica clássica que significa <em>"saudações cordiais / forte abraço"</em>.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>190 / 112 em Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#f59e0b', fontWeight: 800, marginBottom: '0.5rem' }}>
                  190 = .---- ----. -----
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Números de emergência telefônica são transmitidos com pausas de 3 unidades entre cada dígito para garantir leitura inequívoca.
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.5rem' }}>2026 em Código Morse</h4>
                <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', color: '#10b981', fontWeight: 800, marginBottom: '0.5rem' }}>
                  2026 = ..--- ----- ..--- -....
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Um excelente exercício de cadência que mescla pontos iniciais (2), traços contínuos (0) e traço inicial seguido de pontos (6).
                </p>
              </div>
            </div>
          </section>

          {/* 4. Números Abreviados em Concursos (Cut Numbers) */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Números Abreviados (Cut Numbers) em Concursos de Radioamadorismo
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Transmitir cinco traços longos para o dígito zero (<code className="morse-font">-----</code>) consome 15 unidades de tempo. Em concursos internacionais de radioamadorismo de alta velocidade (CW Contests), os operadores utilizam <strong>números cortados</strong> (cut numbers), substituindo os dígitos por letras de código mais curto:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Dígito</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Letra Abreviada</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Curto</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Padrão</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Uso na Prática Telegráfica</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {PORTUGUESE_CUT_NUMBERS.map(c => (
                    <tr key={c.num} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>{c.num}</td>
                      <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>{c.cut}</td>
                      <td><code className="morse-font" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{c.morse}</code></td>
                      <td><code className="morse-font" style={{ color: 'var(--text-muted)' }}>{c.standard}</code></td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              O exemplo mais consagrado no rádio amador é o reporte de sinal <strong>599</strong> (sinal perfeito de recepção): em vez de enviar <code className="morse-font">..... ----. ----.</code>, praticamente todos os telegrafistas enviam <strong>5NN</strong> (<code className="morse-font">..... -. -.</code>), reduzindo o tempo de transmissão em mais de 60%.
            </p>
          </section>

          {/* 5. Aplicações de Números em Frequências, Coordenadas e Aviação */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Aplicações de Números em Frequências de Rádio, Coordenadas Náuticas e Aviação
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Na prática operacional do radioamadorismo, da radionavegação marítima e da aviação civil, os números representam os dados mais críticos de qualquer mensagem: frequências em megahertz (MHz), canais de transceptor, horários em tempo universal coordenado (UTC) e coordenadas de latitude e longitude.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Para garantir legibilidade absoluta em situações de ruído atmosférico ou sinal fraco, telegrafistas utilizam convenções universais:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>Frequências em Ondas Curtas (HF)</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  A frequência de chamada internacional dos 40 metros <strong>7030 kHz</strong> é transmitida como:<br />
                  <code className="morse-font" style={{ color: 'var(--accent-primary)', display: 'block', marginTop: '0.25rem' }}>--... ----- ...-- -----</code>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.4rem' }}>Horários em Formato UTC</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  O registro de hora e minuto <strong>1430 Z</strong> (14h30min) transmite-se com zeros e dígitos rigorosos:<br />
                  <code className="morse-font" style={{ color: '#f59e0b', display: 'block', marginTop: '0.25rem' }}>.---- ....- ...-- ----- / --..</code>
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>Coordenadas Geográficas Náuticas</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Graus, minutos e segundos são pontuados com a barra decimal (<code>-..-.</code>) ou ponto (<code>.-.-.-</code>):<br />
                  <code className="morse-font" style={{ color: '#10b981', display: 'block', marginTop: '0.25rem' }}>..--- ...-- / -.. . --.</code> (23 DEG)
                </p>
              </div>
            </div>
          </section>

          {/* 6. Tabela de Tempos de Transmissão Numérica em Milissegundos a Várias Velocidades WPM */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Tabela de Duração Numérica em Milissegundos (WPM e Padrão PARIS)
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Como cada algarismo possui 5 elementos com pausas internas, a duração física de um número varia conforme o número de traços (que duram 3 unidades contra 1 unidade do ponto). O dígito <strong>5</strong> (<code className="morse-font">.....</code>) possui 9 unidades no total (5 dits + 4 pausas internas), enquanto o dígito <strong>0</strong> (<code className="morse-font">-----</code>) possui 19 unidades no total (5 dahs de 3 unidades + 4 pausas internas).
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Número</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Morse</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Unidades</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Duração a 12 WPM</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Duração a 20 WPM</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Duração a 30 WPM</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>5 (Mais rápido)</td>
                    <td><code className="morse-font">.....</code></td>
                    <td style={{ textAlign: 'center' }}>9 u</td>
                    <td style={{ textAlign: 'right' }}>900 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>540 ms</td>
                    <td style={{ textAlign: 'right' }}>360 ms</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>4 e 6</td>
                    <td><code className="morse-font">....- / -....</code></td>
                    <td style={{ textAlign: 'center' }}>11 u</td>
                    <td style={{ textAlign: 'right' }}>1.100 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>660 ms</td>
                    <td style={{ textAlign: 'right' }}>440 ms</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>3 e 7</td>
                    <td><code className="morse-font">...-- / --...</code></td>
                    <td style={{ textAlign: 'center' }}>13 u</td>
                    <td style={{ textAlign: 'right' }}>1.300 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>780 ms</td>
                    <td style={{ textAlign: 'right' }}>520 ms</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>2 e 8</td>
                    <td><code className="morse-font">..--- / ---..</code></td>
                    <td style={{ textAlign: 'center' }}>15 u</td>
                    <td style={{ textAlign: 'right' }}>1.500 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>900 ms</td>
                    <td style={{ textAlign: 'right' }}>600 ms</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>1 e 9</td>
                    <td><code className="morse-font">.---- / ----.</code></td>
                    <td style={{ textAlign: 'center' }}>17 u</td>
                    <td style={{ textAlign: 'right' }}>1.700 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>1.020 ms</td>
                    <td style={{ textAlign: 'right' }}>680 ms</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>0 (Mais longo)</td>
                    <td><code className="morse-font">-----</code></td>
                    <td style={{ textAlign: 'center' }}>19 u</td>
                    <td style={{ textAlign: 'right' }}>1.900 ms</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--accent-primary)' }}>1.140 ms</td>
                    <td style={{ textAlign: 'right' }}>760 ms</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>
              Essa discrepância de 9 unidades (para o 5) contra 19 unidades (para o 0) explica matematicamente por que os <em>cut numbers</em> (números cortados como 0→T e 9→N) economizam tanto tempo em competições telegráficas.
            </p>
          </section>

          {/* Cross-linking cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Alfabeto Morse A–Z Completo
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Consulte todas as 26 letras, cedilha (Ç) e normalização de acentos com reprodução sonora interativa.
              </p>
              <a
                href="/pt/alfabeto-morse/"
                onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver alfabeto completo</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Código Morse para Texto
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Decodifique pontos e traços numéricos ou alfabéticos para texto em português com análise letra por letra.
              </p>
              <a
                href="/pt/codigo-morse-para-texto/"
                onClick={(e) => handleNav(e, 'pt-morse2english', '/pt/codigo-morse-para-texto/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Decodificar sequência</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Decodificador de Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Ferramenta especializada para auditar espaços, pausas e tempos de números e caracteres especiais.
              </p>
              <a
                href="/pt/decodificador-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-morsedecoder', '/pt/decodificador-codigo-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Abrir decodificador</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* PERGUNTAS FREQUENTES (FAQ COMPLETO COM 15 PERGUNTAS) */}
          <section style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }} id="faq">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Perguntas Frequentes Sobre os Números em Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                {
                  q: 'O que são os números em código Morse?',
                  a: 'São as representações padronizadas por pontos e traços para os algarismos de 0 a 9 no Código Morse Internacional segundo a norma ITU-R M.1677-1. Cada número possui rigorosamente cinco elementos.'
                },
                {
                  q: 'Por que todos os números em código Morse possuem exatamente 5 elementos?',
                  a: 'Ao contrário das letras (cuja extensão varia de 1 a 4 elementos conforme sua frequência no idioma), os números possuem comprimento fixo de 5 elementos. Essa uniformidade foi projetada para que os telegrafistas detectassem imediatamente falhas de recepção se um número chegasse com mais ou menos de 5 pulsos.'
                },
                {
                  q: 'Como é o número 0 em código Morse?',
                  a: 'O número 0 é composto por cinco traços contínuos: ----- (dah-dah-dah-dah-dah). É o caractere mais longo em tempo de transmissão de toda a tabela telegráfica.'
                },
                {
                  q: 'O número 0 é igual à letra O em código Morse?',
                  a: 'Não. O número 0 possui cinco traços (-----), enquanto a letra O possui apenas três traços (---). Eles nunca devem ser confundidos.'
                },
                {
                  q: 'Como transmitir números com vários algarismos, como datas ou telefones?',
                  a: 'Cada dígito é transmitido individualmente como um bloco de 5 elementos, separado por uma pausa de 3 unidades (um espaço no texto escrito). Por exemplo, o ano 2026 escreve-se: ..--- ----- ..--- -....'
                },
                {
                  q: 'O que é a "regra da escada" para memorizar os números em Morse?',
                  a: 'A regra da escada descreve o padrão simétrico: de 1 a 5, os números iniciam com pontos crescentes (1=.----, 2=..---, 3=...--, 4=....-, 5=.....). A partir do 6, o padrão se inverte começando com traços crescentes até o 0 (6=-...., 7=--..., 8=---.., 9=----., 0=-----).'
                },
                {
                  q: 'O que são números cortados (cut numbers) no radioamadorismo?',
                  a: 'Em concursos de alta velocidade (CW), enviar 5 traços para o zero ou 4 traços para o 9 consome tempo precioso. Os operadores substituem dígitos por letras de código mais curto: 0 vira T (-), 9 vira N (-.) e 1 vira A (.-). O relatório clássico 599 torna-se 5NN.'
                },
                {
                  q: 'Os números em Morse Americano eram iguais aos do Morse Internacional?',
                  a: 'Não. O antigo código Morse americano terrestre de ferrovias do século XIX possuía números de comprimentos desiguais e pausas internas. A União Internacional de Telecomunicações padronizou todos os números em 5 elementos contínuos na norma internacional moderna.'
                },
                {
                  q: 'Posso escutar o som dos números nesta página?',
                  a: 'Sim. Você pode clicar no ícone de alto-falante em qualquer uma das caixas dos números de 0 a 9 ou digitar qualquer cifra no conversor interativo superior para reproduzir o som puro em Web Audio API.'
                },
                {
                  q: 'Como são representados números decimais com vírgula ou ponto fracionário?',
                  a: 'Em transmissões internacionais, utiliza-se o ponto decimal (.-.-.-) ou a vírgula (--..--). Por exemplo, o número 3,14 transmite-se como: ...-- --..-- .---- ....-'
                },
                {
                  q: 'Como transmitir coordenadas GPS de latitude e longitude?',
                  a: 'Cada grupo de graus, minutos e segundos é enviado dígito a dígito, seguido pelas letras N (norte, -.), S (sul, ...), E (leste, .) ou W (oeste, .--). As divisões de unidade usam pausas de palavras ou a barra inclinada /.'
                },
                {
                  q: 'O que significa o número 73 e 88 no jargão telegráfico?',
                  a: 'No código telegráfico de radioamadores, 73 (--... ...--) significa "saudações cordiais / forte abraço", enquanto 88 (---.. ---..) significa "abraços e beijos / muito carinho", tradicionalmente enviado entre amigos íntimos e familiares.'
                },
                {
                  q: 'Existe algum número de 0 a 9 que comece e termine com traço?',
                  a: 'Sim, o número 0 (-----) que possui 5 traços. Já os números 1 a 4 começam com ponto e terminam com traço; e os números 6 a 9 começam com traço e terminam com ponto. O número 5 (.....) é composto exclusivamente de pontos.'
                },
                {
                  q: 'Como é calculada a velocidade WPM ao transmitir somente números?',
                  a: 'Como os números possuem 5 elementos (média de 15 a 17 unidades temporais por dígito), uma transmissão composta exclusivamente de dígitos leva cerca de 70% mais tempo do que um texto comum em palavras calibração PARIS. A fórmula 1200 / WPM milissegundos por ponto mantém-se inalterada.'
                },
                {
                  q: 'Quais normas regulatórias oficiais regem a escrita de números em Morse?',
                  a: 'Os números seguem com rigor a Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações e as diretrizes da LABRE (Brasil) e da REP (Portugal).'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}
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

          {/* CTA Banner */}
          <section className="content-section cta-banner" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'var(--surface-elevated, rgba(30, 41, 59, 0.7))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Os Números em Código Morse ao Seu Alcance
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Aprender os dígitos de 0 a 9 é o caminho mais rápido para desenvolver segurança na telegrafia. Utilize nosso tradutor interativo completo para converter qualquer número, data ou texto longo com áudio em tempo real.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href="/pt/"
                onClick={(e) => handleNav(e, 'portuguese', '/pt/')}
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Abrir Tradutor de Código Morse</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/pt/alfabeto-morse/"
                onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')}
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>Ver Alfabeto Morse Completo</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

          {/* E-E-A-T Rigor Telegráfico */}
          <section className="content-section eeat-box" style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
            <div className="eeat-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck size={26} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Compromisso com o Rigor e a Exatidão Numérica
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.925rem' }}>
              Nossos padrões numéricos e regras de temporização seguem com fidelidade matemática a Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações e as diretrizes operacionais da ARRL e da LABRE.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.925rem' }}>
              A preservação rigorosa de zeros à esquerda (ex: 007 não se torna 7) garante compatibilidade completa em telecomunicações, identificação de coordenadas geográficas e radionavegação.
            </p>
          </section>

        </div>
      </article>
    </div>
  );
}

export default PortugueseNumbersPage;
