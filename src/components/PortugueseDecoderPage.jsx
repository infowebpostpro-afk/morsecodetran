import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Volume2, Copy, Play, Square, Check, ChevronDown, ChevronUp,
  AlertCircle, AlertTriangle, CheckCircle2, Trash2, HelpCircle, ArrowRight,
  ShieldCheck, ExternalLink, Sparkles, Download, Info
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import { diagnosePortugueseMorse, translateMorseToPortuguese } from '../engine/portugueseMorse.js';
import { calculateStatistics } from '../engine/morseEngine.js';

export function PortugueseDecoderPage({
  wpm: initialWpm = 20,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast,
  setActiveTab
}) {
  const [morseInput, setMorseInput] = useState('--- .-.. .- / -- ..- -. -.. ---');
  const [selectedGroupIdx, setSelectedGroupIdx] = useState(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

  // Audio controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTokenIdx, setPlaybackTokenIdx] = useState(-1);

  const inputRef = useRef(null);

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

  // Diagnostic analysis of the typed Morse input
  const diagnostic = useMemo(() => {
    return diagnosePortugueseMorse(morseInput);
  }, [morseInput]);

  // Statistics calculation
  const stats = useMemo(() => {
    return calculateStatistics(diagnostic.recognizedText || '', morseInput, wpm, farnsworthWpm);
  }, [diagnostic.recognizedText, morseInput, wpm, farnsworthWpm]);

  // Playback sequence
  const playbackBreakdown = useMemo(() => {
    if (!diagnostic.groups || diagnostic.groups.length === 0) return [];
    return diagnostic.groups.map(group => ({
      char: group.char || '?',
      morse: group.raw || '',
      isSpace: group.raw === '/'
    }));
  }, [diagnostic.groups]);

  const handlePlayAudio = () => {
    if (!playbackBreakdown || playbackBreakdown.length === 0) return;
    setIsPlaying(true);
    setPlaybackTokenIdx(-1);

    audioEngine.playSequence({
      breakdown: playbackBreakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setPlaybackTokenIdx(-1);
          return;
        }
        if (typeof idx === 'number') {
          setPlaybackTokenIdx(idx);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setPlaybackTokenIdx(-1);
  };

  const handleCopy = async () => {
    if (!diagnostic.recognizedText) return;
    try {
      await navigator.clipboard.writeText(diagnostic.recognizedText);
      setCopiedSuccess(true);
      if (showToast) showToast('Texto decodificado copiado com sucesso! ✓');
      setTimeout(() => setCopiedSuccess(false), 1800);
    } catch {
      if (showToast) showToast('Não foi possível copiar para a área de transferência.');
    }
  };

  const handleClear = () => {
    setMorseInput('');
    setSelectedGroupIdx(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const presets = [
    {
      title: 'Mensagem válida',
      code: '--- .-.. .- / -- ..- -. -.. ---',
      desc: 'OLA MUNDO'
    },
    {
      title: 'Exemplo SOS',
      code: '... --- ...',
      desc: 'Sinal universal de socorro'
    },
    {
      title: 'Espaços que mudam a leitura (A)',
      code: '.-',
      desc: 'Equivale à letra A'
    },
    {
      title: 'Espaços que mudam a leitura (ET)',
      code: '. -',
      desc: 'Equivale a E e T separados'
    }
  ];

  const faqs = [
    {
      q: 'O que faz um decodificador de código Morse e como ele opera?',
      a: 'Ele converte sequências de pulsos gráficos formados por pontos (.) e traços (-) em letras, números e símbolos alfanuméricos legíveis, comparando cada agrupamento individual contra o padrão internacional ITU-R M.1677-1. Além disso, realiza análises diagnósticas de espaçamento para identificar se caracteres foram indevidamente aglutinados.'
    },
    {
      q: 'Se todos os grupos forem reconhecidos pelo decodificador, a mensagem está garantida?',
      a: 'Não necessariamente. Um erro na digitação de um único ponto ou traço pode transformar uma letra válida em outra letra igualmente válida (por exemplo: um único ponto "." é a letra E, mas se você acidentalmente digitou "..", o sistema decodificará perfeitamente a letra I). O decodificador atesta a validade telegráfica dos grupos, mas cabe ao operador humano revisar a coerência semântica da frase.'
    },
    {
      q: 'Por que aparece um caractere de interrogação (?) vermelho no resultado?',
      a: 'O ponto de interrogação vermelho surge quando aquela sequência específica de pontos e traços não existe no Código Morse Internacional. Isso ocorre na imensa maioria das vezes porque o operador esqueceu de inserir um espaço entre duas letras consecutivas, gerando uma cadeia inexistente de 5 ou 6 pulsos (como "......" ou "-.-.-").'
    },
    {
      q: 'Como decodificar uma mensagem que não possui nenhum espaço delimitador?',
      a: 'Sem espaços delimitadores, uma cadeia contínua de pontos e traços pode gerar centenas ou milhares de permutações combinatórias válidas (por exemplo, "..." pode ser S, EEE, EI ou IE). Nenhum software deve adivinhar palavras arbitrariamente sem contexto prévio. O método correto é resgatar o áudio ou imagem original para inspecionar os intervalos de silêncio de 3 unidades.'
    },
    {
      q: 'O decodificador reconhece a cedilha (Ç) e acentos da língua portuguesa?',
      a: 'Sim. A cedilha é oficialmente reconhecida pelo código telegráfico "-.-.." em nosso motor. Quanto às vogais acentuadas (Á, É, Í, Ó, Ú, Â, Ê, Ã, Õ), o sistema segue a praxe internacional das estações de rádio amador (LABRE e REP), normalizando-as para suas letras latinas básicas (A, E, I, O, U).'
    },
    {
      q: 'Como ouvir a sonoridade exata da mensagem decodificada?',
      a: 'Basta clicar no botão "Ouvir Áudio da Sequência". A Web Audio API sintetizará os tons puros de 600 Hz com temporização rigorosa em tempo real, destacando cada caractere ativo na tela sincronizadamente com o som.'
    },
    {
      q: 'Esta ferramenta decodifica código Morse a partir de fotos e arquivos de áudio?',
      a: 'Esta página é dedicada à decodificação avançada de texto e auditoria de digitação. Para processar fotos de tatuagens, quebra-cabeças ou capturas de tela, utilize o nosso módulo de Decodificador de Imagem acessível na página inicial.'
    },
    {
      q: 'Qual é a diferença entre um decodificador e um tradutor de código Morse?',
      a: 'Um tradutor atua bidirecionalmente (Texto ↔ Morse) para geração rápida de mensagens. Um decodificador é uma ferramenta analítica especializada no sentido inverso (Morse → Texto), oferecendo inspeção minuciosa de sintaxe, auditoria de tokens, contagem de elementos e alertas de espaçamento ambíguo.'
    },
    {
      q: 'O que é a Árvore Dicômica de busca em código Morse?',
      a: 'É a estrutura mental em árvore binária que telegrafistas experientes utilizam para reconhecer caracteres instantaneamente: a partir da raiz vazia, cada ponto (dit) desce para a esquerda e cada traço (dah) desce para a direita. Com apenas 4 níveis de profundidade, alcança-se qualquer letra do alfabeto latino em frações de segundo.'
    },
    {
      q: 'O que são códigos Q e como o decodificador os interpreta?',
      a: 'Códigos Q são abreviaturas internacionais padronizadas de três letras iniciadas pela letra Q (como QTH = localização, QSL = confirmação de contato, QRM = interferência). O decodificador transcreve as letras Q-R-M normalmente, cabendo ao operador reconhecer o significado do código no contexto do tráfego telegráfico.'
    },
    {
      q: 'Por que o sinal SOS é o único emitido sem pausas entre letras?',
      a: 'A convenção internacional de 1906 estipulou que SOS (...---...) deve ser emitido como um único prosign contínuo (sem os silêncios de 3 unidades entre S, O e S). Essa cadência contínua cria uma melodia rítmica singular impossível de ser confundida com qualquer outra palavra comum do idioma.'
    },
    {
      q: 'Qual velocidade WPM devo escolher para praticar a decodificação de ouvido?',
      a: 'Inicie com 18 a 20 WPM para os caracteres individuais com espaçamento Farnsworth amplo. Treinar em velocidades muito baixas (como 5 WPM puros) condiciona o cérebro a contar pontos mentalmente, um vício que impede o progresso para velocidades operacionais reais.'
    },
    {
      q: 'Posso copiar o texto decodificado com apenas um clique?',
      a: 'Sim. Clicando no botão "Copiar Texto", o resultado traduzido em português é transferido instantaneamente para a área de transferência do seu dispositivo.'
    },
    {
      q: 'Como a ferramenta trata barras duplas ou espaços extras?',
      a: 'Espaços múltiplos consecutivos e quebras de linha são automaticamente normalizados pelo algoritmo para evitar erros espúrios de parsing.'
    },
    {
      q: 'Quais normas regulatórias orientam a lógica deste decodificador?',
      a: 'O sistema baseia-se estritamente na Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações e nas diretrizes técnicas de radiotelegrafia da LABRE (Brasil), REP (Portugal) e IARU Região 2.'
    }
  ];

  return (
    <div className="page-container alphabet-page-container" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/pt/" onClick={(e) => handleNav(e, 'portuguese', '/pt/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Início</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Decodificador de Código Morse</span>
      </nav>

      {/* HEADER SECTION */}
      <header className="page-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Decodificador de Código Morse: Conferir Sinais e Texto
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '850px', margin: '0 auto', lineHeight: 1.6 }}>
          Decodifique pontos e traços em tempo real com auditoria diagnóstica completa. Identifique sequências inválidas, ausência de espaços entre letras e divergências de temporização conforme a norma internacional UIT.
        </p>
      </header>

      {/* PRIMARY DIAGNOSTIC TOOL */}
      <section className="translator-container" id="decoder-tool" aria-label="Decodificador de código Morse" style={{ marginBottom: '3rem' }}>
        <div className="workspace-card glass-panel" style={{ background: 'var(--surface-card)', borderRadius: '16px', border: '1px solid var(--border-color)', padding: '1.75rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
                Auditoria e Decodificação Morse
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
              >
                <Trash2 size={14} /> Limpar
              </button>
            </div>
          </div>

          {/* Preset Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Exemplos de teste:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => { setMorseInput(preset.code); setSelectedGroupIdx(null); }}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>

          {/* Morse Input Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="morse-input-field" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Insira o código Morse com espaços entre letras e / entre palavras:
            </label>
            <textarea
              id="morse-input-field"
              ref={inputRef}
              rows={4}
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              placeholder="Ex.: --- .-.. .- / -- ..- -. -.. ---"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1.2rem',
                fontFamily: 'monospace',
                letterSpacing: '2px',
                lineHeight: 1.5,
                resize: 'vertical'
              }}
            />
          </div>

          {/* Real-time Decoded Output */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Texto Decodificado em Português:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!diagnostic.recognizedText}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedSuccess ? 'var(--success, #10b981)' : 'var(--accent-primary)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {copiedSuccess ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSuccess ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <div style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-warning, #f59e0b)',
              fontSize: '1.25rem',
              fontWeight: 700,
              minHeight: '56px',
              display: 'flex',
              alignItems: 'center',
              wordBreak: 'break-word'
            }}>
              {diagnostic.recognizedText || <span style={{ color: 'var(--text-muted)' }}>Aguardando entrada telegráfica...</span>}
            </div>
          </div>

          {/* Token Breakdown Visualizer */}
          {diagnostic.groups && diagnostic.groups.length > 0 && (
            <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                Auditoria de Elementos e Caracteres Resolvidos:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {diagnostic.groups.map((grp, idx) => {
                  const isPlayback = playbackTokenIdx === idx;
                  const isInvalid = !grp.isValid && grp.raw !== '/';

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isPlayback ? 'rgba(56, 189, 248, 0.25)' : isInvalid ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.04)',
                        border: isPlayback ? '1px solid var(--accent-primary)' : isInvalid ? '1px solid var(--danger, #ef4444)' : '1px solid var(--border-color)',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: isInvalid ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {grp.char || (grp.raw === '/' ? '/' : '?')}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)', marginTop: '0.15rem' }}>
                        {grp.raw}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  disabled={!diagnostic.recognizedText}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', cursor: 'pointer' }}
                >
                  <Play size={16} />
                  <span>Ouvir Áudio da Sequência</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopAudio}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  <Square size={16} />
                  <span>Parar Áudio</span>
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Palavras: <strong>{stats.wordCount}</strong> • Letras: <strong>{stats.characterCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATIONAL SEO ARTICLE (Full 3,000+ words parity) */}
      <article className="seo-article-container">
        <div className="article-body-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* Como Descifrar Código Morse a Texto Legível */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Decifrar Código Morse para Texto Legível em Português
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Um decodificador de código Morse transforma sequências de pulsos gráficos ou sonoros formados por pontos (<code className="inline-code">.</code>) e traços (<code className="inline-code">-</code>) em palavras e mensagens alfanuméricas claras. Por exemplo, a sequência <code className="morse-font">--- .-.. .-</code> é decodificada instantaneamente como <strong>OLA</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Em mensagens mais longas que contêm múltiplas palavras, utiliza-se a barra inclinada <code className="inline-code">/</code> cercada de espaços como separador formal de palavras. Assim, a cadeia <code className="morse-font">--- .-.. .- / -- ..- -. -.. ---</code> traduz-se sem qualquer ambiguidade como <strong>OLA MUNDO</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Nosso motor decodificador compara cada agrupamento contra o dicionário oficial do Código Morse Internacional estabelecido pela União Internacional de Telecomunicações (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Recomendação ITU-R M.1677-1 <ExternalLink size={12} style={{ display: 'inline' }} /></a>), assegurando que letras, números, sinais de pontuação e caracteres específicos como a cedilha <strong>Ç</strong> (<code className="morse-font">-.-..</code>) sejam processados com rigor técnico.
            </p>
          </section>

          {/* Guia de Uso Passo a Passo */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Guia Passo a Passo para Decodificar Mensagens Morse
            </h2>
            <ol className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li><strong>Cole ou digite seu código Morse:</strong> Use pontos (<code className="inline-code">.</code>) para os dits e traços ou hifens (<code className="inline-code">-</code>) para os dahs;</li>
              <li><strong>Separe cada letra com um espaço simples:</strong> É estritamente obrigatório inserir um espaço entre as letras consecutivas (por exemplo: <code>.- -...</code> para AB);</li>
              <li><strong>Use a barra inclinada / entre palavras:</strong> Para assinalar o intervalo longo de 7 unidades entre duas palavras completas, insira uma barra com espaços (exemplo: <code>... / ---</code>);</li>
              <li><strong>Inspecione a auditoria em tempo real:</strong> A ferramenta destaca em vermelho qualquer grupo desconhecido ou mal formatado, permitindo que você localize erros sem perder o resto do texto;</li>
              <li><strong>Escute a verificação sonora:</strong> Reproduza o áudio sintetizado em Web Audio API para comprovar auditivamente a cadência da mensagem decodificada.</li>
            </ol>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.4rem' }}>Exemplo SOS</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Entrada: <code className="morse-font">... --- ...</code><br />
                  Resultado decodificado: <strong>SOS</strong> (Três letras distintas delimitadas)
                </p>
              </div>

              <div style={{ background: 'var(--surface-elevated, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981', marginBottom: '0.4rem' }}>Exemplo CÓDIGO MORSE</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                  Entrada: <code className="morse-font">-.-. --- -.. .. --. --- / -- --- .-. ... .</code><br />
                  Resultado decodificado: <strong>CODIGO MORSE</strong>
                </p>
              </div>
            </div>
          </section>

          {/* O Processo Algorítmico Interno */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Como Funciona o Processo Algorítmico de Decodificação
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              A decodificação técnica segue três etapas computacionais encadeadas:
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>1. Segmentação Léxica do Fluxo de Sinais</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              O analisador léxico divide o texto recebido utilizando a barra <code className="inline-code">/</code> ou quebras de linha como separadores de palavras. Em seguida, divide cada palavra pelos seus espaços em branco, isolando os blocos de pontos que formam cada caractere individual.
            </p>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>2. Consulta em Tabela Hash Inversa O(1)</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Cada sequência de pontos e traços é consultada em uma tabela de busca em tempo constante no padrão ITU-R M.1677-1:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Padrão em Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Caractere Resolvido</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Classificação</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">.</code></td><td><strong>E</strong></td><td>Letra elementar (1 ponto)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">-</code></td><td><strong>T</strong></td><td>Letra elementar (1 traço)</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">.-</code></td><td><strong>A</strong></td><td>Letra latina básica</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">-...</code></td><td><strong>B</strong></td><td>Letra latina básica</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">-.-..</code></td><td><strong>Ç</strong></td><td>Extensão oficial em português</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td><code className="morse-font">-----</code></td><td><strong>0</strong></td><td>Número (5 traços)</td></tr>
                  <tr><td><code className="morse-font">.-.-.-</code></td><td><strong>.</strong></td><td>Ponto final</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>3. Montagem do Texto e Tratamento de Erros</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              As letras decodificadas são concatenadas respeitando os espaços das palavras. Caso uma combinação de pontos não corresponda a nenhum símbolo oficial (ex: <code>......</code> ou <code>---.-</code>), a ferramenta a assinala com destaque visual para que o usuário saiba exatamente onde o erro de digitação ocorreu.
            </p>
          </section>

          {/* Por Que o Espaçamento É Crítico */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Por Que o Espaçamento Temporal Define a Decodificação
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              O código Morse não é um código de comprimento fixo como o ASCII binário de 8 bits. Uma letra pode durar de 1 unidade temporal (E = <code className="morse-font">.</code>) até 15 unidades temporais (0 = <code className="morse-font">-----</code>). Por este motivo, o silêncio é tão importante quanto o som:
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Elemento ou Intervalo de Silêncio</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Duração Relativa</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Função Delimitadora</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>Ponto (dit)</td><td style={{ textAlign: 'right' }}><strong>1 unidade</strong></td><td>Pulso sonoro breve</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>Traço (dah)</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td><td>Pulso sonoro sustentado</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>Pausa intra-caractere</td><td style={{ textAlign: 'right' }}><strong>1 unidade</strong></td><td>Silêncio entre pontos/traços da mesma letra</td></tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}><td>Pausa entre letras</td><td style={{ textAlign: 'right' }}><strong>3 unidades</strong></td><td>Silêncio que separa letras numa palavra</td></tr>
                  <tr><td>Pausa entre palavras</td><td style={{ textAlign: 'right' }}><strong>7 unidades</strong></td><td>Silêncio completo entre palavras (representado por /)</td></tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>O Dilema Clássico: Letra A ou Letras ET?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
              Observe a enorme diferença que um único espaço faz na decodificação:
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
              <li><code className="morse-font">.-</code> sem espaço representa a letra <strong>A</strong>.</li>
              <li><code className="morse-font">. -</code> com espaço representa duas letras separadas: <strong>E</strong> e <strong>T</strong>.</li>
              <li><code className="morse-font">... --- ...</code> com espaços representa <strong>SOS</strong>.</li>
              <li><code className="morse-font">...---...</code> sem espaços forma um único sinal especial ininterrupto (o prosign internacional de perigo).</li>
            </ul>
          </section>

          {/* Árvore Dicômica de Busca Mental */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              A Árvore Dicômica de Decodificação: Como os Telegrafistas Decodificam de Ouvido
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Na história da telegrafia pré-computacional, os operadores de rádio e telegrafistas de cabos submarinos aprendiam a decodificar através de um diagrama geométrico chamado <strong>Árvore Dicômica de Busca Binária</strong>.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              A partir de um ponto de partida central (a raiz):
            </p>
            <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
              <li>Se você escuta um <strong>ponto (.)</strong>, move-se para a ramificação esquerda: o primeiro nível é <strong>E</strong>; se vier outro ponto, desce-se para <strong>I</strong>; um terceiro ponto leva a <strong>S</strong>; e o quarto ponto atinge <strong>H</strong>.</li>
              <li>Se você escuta um <strong>traço (-)</strong>, move-se para a ramificação direita: o primeiro nível é <strong>T</strong>; outro traço leva a <strong>M</strong>; um terceiro leva a <strong>O</strong>.</li>
            </ul>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Essa árvore lógica demonstra com perfeição o gênio de Alfred Vail e Samuel Morse: as letras mais frequentes na linguagem (como E e T) estão nos ramos mais curtos e rápidos, minimizando o tempo e o consumo de energia no transmissor.
            </p>
          </section>

          {/* Códigos Q e Prosigns no Tráfego Telegráfico */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Códigos Q e Prosigns na Prática Telegráfica Real
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Ao decodificar mensagens de rádio marítimo, aviação ou faixas de radioamadorismo CW, você encontrará com grande frequência abreviaturas de três letras iniciadas pela letra Q, além de sinais de procedimento (prosigns):
            </p>

            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Código / Prosign</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Significado Oficial</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>QTH</td>
                    <td><code className="morse-font">--.- - ....</code></td>
                    <td>Qual é a sua localização geográfica? / Minha localização é...</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>QSL</td>
                    <td><code className="morse-font">--.- ... .-..</code></td>
                    <td>Confirmo a recepção da mensagem / Cartão de confirmação de contato</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>QRM</td>
                    <td><code className="morse-font">--.- .-. --</code></td>
                    <td>Sua transmissão está sofrendo interferência provocada por outras estações</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>QRN</td>
                    <td><code className="morse-font">--.- .-. -.</code></td>
                    <td>Estou enfrentando ruído atmosférico ou estática natural</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>QRZ</td>
                    <td><code className="morse-font">--.- .-. --..</code></td>
                    <td>Quem está chamando a minha estação?</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>&lt;AR&gt;</td>
                    <td><code className="morse-font">.-.-.</code></td>
                    <td>Fim de mensagem / término de transmissão formal</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>&lt;SK&gt;</td>
                    <td><code className="morse-font">...-.-</code></td>
                    <td>Encerramento definitivo de contato radiotelegráfico</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Checklist para uma Sequência que Não Decodifica */}
          <section className="content-section">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Checklist para Corrigir uma Sequência que Apresenta Erro
            </h2>
            <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Sintoma de Erro</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Causa Mais Provável</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Ação Corretiva</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700, color: 'var(--danger)' }}>Grupo não reconhecido (?)</td>
                    <td>Excesso ou falta de pontos/traços</td>
                    <td>Compare a sequência com a tabela do <a href="/pt/alfabeto-morse/" onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Alfabeto Morse</a></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Palavras coladas sem sentido</td>
                    <td>Falta da barra inclinada /</td>
                    <td>Insira uma barra / entre as palavras para criar a pausa de 7 unidades</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Letra completamente inesperada</td>
                    <td>Um ponto ou traço digitado por engano</td>
                    <td>Verifique se não trocou um dit por um dah acidentalmente</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>Caracteres copiados de foto</td>
                    <td>Pontos ornamentais em Unicode</td>
                    <td>Substitua os caracteres por pontos comuns (.) e hifens (-) do teclado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Cross-linking cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Alfabeto Morse A–Z
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Consulte todas as letras, números e cedilha (Ç) com sons interativos e tabela de temporização.
              </p>
              <a
                href="/pt/alfabeto-morse/"
                onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver tabela completa</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Texto para Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Escreva qualquer texto em português para codificar em pontos e traços com áudio imediato.
              </p>
              <a
                href="/pt/texto-para-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-text2morse', '/pt/texto-para-codigo-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Codificar texto</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Números em Código Morse
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                Entenda a lógica de 5 elementos dos dígitos de 0 a 9 e a regra da escada simétrica.
              </p>
              <a
                href="/pt/numeros-em-codigo-morse/"
                onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')}
                style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Ver números 0–9</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* PERGUNTAS FREQUENTES (15 FAQS COMPLETAS) */}
          <section style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }} id="faq">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Perguntas Frequentes Sobre Decodificação de Código Morse
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => {
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
                      {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-primary)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
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
              Decodifique Mensagens Telegráficas com Confiança
            </h2>
            <p style={{ maxWidth: '650px', margin: '0 auto 1.5rem', color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6 }}>
              Verifique qualquer sequência de pontos e traços com nossa ferramenta interativa e tire proveito dos recursos de áudio em tempo real e cópia com um clique.
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
                <span>Consultar Tabela A–Z</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </section>

          {/* E-E-A-T Rigor Telegráfico */}
          <section className="content-section eeat-box" style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
            <div className="eeat-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <ShieldCheck size={26} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Compromisso com o Rigor Diagnóstico e Telegrafia
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem', fontSize: '0.925rem' }}>
              Nosso sistema de auditoria diagnóstica de código Morse segue estritamente as especificações da Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações, respeitando a integridade dos intervalos e a precisão das tabelas históricas de radioamadorismo da LABRE e da REP.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.925rem' }}>
              Ao decodificar sequências para aplicações permanentes (como tatuagens ou joias), recomendamos sempre efetuar a verificação reversa cruzada para certificar a absoluta fidelidade do texto pretendido.
            </p>
          </section>

        </div>
      </article>
    </div>
  );
}

export default PortugueseDecoderPage;
