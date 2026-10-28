import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeftRight, Copy, Play, Square, X, Volume2, Sparkles, AlertCircle, Settings, Check, Command, Share2, ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Download, HelpCircle, ExternalLink
} from 'lucide-react';
import { audioEngine } from '../engine/audioEngine.js';
import {
  translatePortugueseToMorse,
  getPortugueseCharacterBreakdown
} from '../engine/portugueseMorse.js';
import { calculateStatistics } from '../engine/morseEngine.js';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';

export function PortugueseEnglishToMorsePage({
  wpm: initialWpm = 20,
  setWpm: setGlobalWpm,
  frequency: initialFreq = 600,
  volume: initialVol = 0.5,
  showToast,
  setActiveTab
}) {
  const [textInput, setTextInput] = useState('OLA MUNDO');

  // Audio Engine Local Controls
  const [wpm, setWpm] = useState(initialWpm);
  const [farnsworthWpm, setFarnsworthWpm] = useState(initialWpm);
  const [frequency, setFrequency] = useState(initialFreq);
  const [volume, setVolume] = useState(initialVol);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);

  // Copy Feedback State
  const [copiedType, setCopiedType] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

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

  // Real-time Portuguese -> Morse encoding
  const { morseOutput, normalizedList } = useMemo(() => {
    if (!textInput.trim()) return { morseOutput: '', normalizedList: [] };
    const res = translatePortugueseToMorse(textInput);
    return { morseOutput: res.morseText, normalizedList: res.normalizedList || [] };
  }, [textInput]);

  // Character breakdown for playback visualization
  const breakdown = useMemo(() => {
    if (!textInput.trim()) return [];
    return getPortugueseCharacterBreakdown(textInput);
  }, [textInput]);

  const stats = useMemo(() => {
    return calculateStatistics(textInput, morseOutput, wpm, farnsworthWpm);
  }, [textInput, morseOutput, wpm, farnsworthWpm]);

  const handleWpmChange = (newWpm) => {
    setWpm(newWpm);
    if (setGlobalWpm) setGlobalWpm(newWpm);
  };

  const handlePlayAudio = () => {
    if (!breakdown || breakdown.length === 0) return;
    setIsPlaying(true);
    setActiveCharIndex(-1);

    audioEngine.playSequence({
      breakdown,
      wpm,
      farnsworthWpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveCharIndex(-1);
          return;
        }
        if (typeof idx === 'number') {
          setActiveCharIndex(idx);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveCharIndex(-1);
  };

  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Código Morse' : 'Texto'} copiado com sucesso! ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Erro ao copiar para a área de transferência.');
    }
  };

  const handleDownloadWav = () => {
    if (!morseOutput) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: morseOutput, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `texto-para-morse-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Arquivo de áudio WAV descarregado com sucesso! ✓');
    } catch {
      if (showToast) showToast('Erro ao gerar arquivo WAV.');
    }
  };

  const sampleTexts = [
    { label: 'OLÁ MUNDO', text: 'OLA MUNDO' },
    { label: 'SOS (Socorro)', text: 'SOS' },
    { label: 'BOM DIA', text: 'BOM DIA' },
    { label: 'TE AMO', text: 'TE AMO' },
    { label: 'OBRIGADO', text: 'OBRIGADO' },
    { label: 'SAUDADES', text: 'SAUDADES' },
    { label: 'PARABÉNS', text: 'PARABENS' },
    { label: 'BRASIL', text: 'BRASIL' },
    { label: 'PORTUGAL', text: 'PORTUGAL' }
  ];

  const faqs = [
    {
      q: 'Como o conversor traduz as letras do português para o código Morse?',
      a: 'Cada caractere alfanumérico digitado é processado de acordo com a norma internacional da União Internacional de Telecomunicações (ITU-R M.1677-1). As letras de A a Z são mapeadas para as suas respectivas combinações de pontos (.) e traços (-). Entre cada letra gerada, é introduzido um espaço simples (equivalente a 3 unidades de tempo), e entre palavras distintas é inserida uma barra diagonal "/" delimitada por espaços.'
    },
    {
      q: 'O que acontece com os acentos gráficos (Á, É, Í, Ó, Ú, Â, Ê) e com a cedilha (Ç)?',
      a: 'Nas comunicações radiotelegráficas internacionais e nas recomendações oficiais da LABRE e da REP, os caracteres acentuados são transparentemente normalizados para a sua vogal-base correspondente (Á→A, É→E, Í→I, Ó→O, Ú→U, Ç→C). O nosso conversor realiza essa adaptação de forma automática e instantânea, assegurando 100% de legibilidade e interoperabilidade com qualquer operador telegráfico ao redor do globo.'
    },
    {
      q: 'Posso ouvir o som do código Morse gerado em tempo real?',
      a: 'Sim! Ao clicar no botão "Ouvir em Código Morse", a Web Audio API sintetiza o sinal acústico oficial em tempo real, sem a necessidade de baixar nenhum plugin ou arquivo externo. Você pode inclusive acompanhar o caractere ativo sendo iluminado na tela conforme o som é emitido.'
    },
    {
      q: 'Posso ajustar a velocidade da telegrafia em WPM e o tom em Hertz?',
      a: 'Sim. Você pode regular a velocidade em Palavras Por Minuto (WPM) de 5 até 45 WPM e a frequência sonora de 400 Hz até 1000 Hz (sendo 600 Hz a tonalidade mais agradável e padrão no radioamadorismo). Além disso, oferecemos suporte ao espaçamento Farnsworth, que permite ampliar as pausas entre letras para facilitar o treino de ouvidos iniciantes.'
    },
    {
      q: 'Como os algarismos numéricos são codificados?',
      a: 'Todos os números de 0 a 9 possuem códigos rigorosamente uniformes com 5 elementos cada. O 1 é .----, o 2 é ..---, o 5 é ..... e o 0 é -----. Consulte a nossa página de Números em Código Morse para acessar a tabela completa e curiosidades mnemônicas.'
    },
    {
      q: 'É possível baixar o áudio do código Morse em arquivo WAV?',
      a: 'Sim. Clicando no botão "Baixar Áudio WAV", um arquivo de áudio PCM de alta fidelidade é gerado e baixado diretamente para o seu dispositivo, perfeito para trilhas sonoras, aulas de física, desafios de escape room ou toques de celular.'
    },
    {
      q: 'Qual é a regra de temporização PARIS e como ela se aplica?',
      a: 'O padrão internacional de calibração PARIS estipula que a palavra "PARIS" contém exatamente 50 unidades elementares de tempo. Dessa forma, a duração de 1 ponto (dit) a uma dada velocidade em WPM é calculada pela fórmula matemática exata: Duração (ms) = 1200 / WPM. A 20 WPM, cada ponto dura exatamente 60 milissegundos.'
    },
    {
      q: 'Como posso ter certeza de que o código gerado está correto?',
      a: 'Recomendamos o teste de validação cruzada (round-trip test): copie o código Morse obtido e cole-o no nosso Tradutor de Código Morse para Texto. Se a decodificação resultar exatamente na mesma frase em português, a sua mensagem está 100% precisa.'
    },
    {
      q: 'Existe diferença entre o código Morse Internacional e o código Morse Americano?',
      a: 'Sim. O código Morse Americano original de 1844 (criado para linhas de telégrafo com fio nos Estados Unidos) utilizava traços de durações desiguais e pausas internas dentro de letras como C e R. O Código Morse Internacional, criado na Europa e formalizado pela ITU em 1865, eliminou essas ambiguidades e é o único padrão mundial em operação hoje.'
    },
    {
      q: 'Como os sinais de pontuação são representados?',
      a: 'Os sinais de pontuação mais frequentes possuem códigos específicos de 6 elementos: o ponto final (.) é .-.-.-, a vírgula (,) é --..-- e o ponto de interrogação (?) é ..--... Caracteres não suportados no padrão internacional são sinalizados para não corromper o texto.'
    },
    {
      q: 'É possível converter textos longos ou parágrafos inteiros para código Morse?',
      a: 'Sim. O conversor processa múltiplos parágrafos, quebras de linha e textos extensos instantaneamente. Cada quebra de linha ou espaço entre palavras é convertido na barra delimitadora / correspondente ao intervalo de 7 unidades regulamentar.'
    },
    {
      q: 'Como criar designs de joias, pulseiras e tatuagens em código Morse?',
      a: 'Digite as palavras desejadas (como nomes de entes queridos, datas de nascimento ou lemas de vida) no conversor para obter a sequência exata de pontos e traços. Utilize miçangas redondas para os pontos e miçangas compridas para os traços, intercalando nós ou contas menores como espaçadores de letras.'
    },
    {
      q: 'Por que o áudio do código Morse usa uma frequência de 600 Hz por padrão?',
      a: 'A frequência de 600 Hz a 700 Hz situa-se no centro da faixa de máxima sensibilidade auditiva do ouvido humano e coincide com o padrão sonoro adotado na maioria dos rádios transceptores de ondas curtas (HF) no modo CW (Continuous Wave), reduzindo a fadiga auditiva em escutas prolongadas.'
    },
    {
      q: 'O que é o método Koch para aprender código Morse?',
      a: 'Criado pelo psicólogo alemão Ludwig Koch em 1936, o método preconiza aprender os caracteres em velocidade operacional plena (20 WPM) desde a primeira sessão, adicionando uma letra de cada vez apenas quando o aluno atingir 90% de acerto na recepção auditiva.'
    },
    {
      q: 'O código Morse ainda é obrigatório para obter licença de radioamador no Brasil e em Portugal?',
      a: 'Nas últimas décadas, a UIT retirou a exigência compulsória de telegrafia para a emissão de licenças básicas de radioamadorismo. No entanto, o código Morse (modo CW) continua sendo uma das modalidades mais vibrantes e ativas nas faixas de radioamador (LABRE e REP) devido à sua incomparável capacidade de perfurar ruídos e alcançar distâncias intercontinentais com baixa potência (QRP).'
    },
    {
      q: 'Quais normas regulatórias oficiais regem este conversor?',
      a: 'O conversor é integralmente fundamentado na Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações e nas convenções da International Amateur Radio Union (IARU).'
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/pt/" onClick={(e) => handleNav(e, 'portuguese', '/pt/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Início</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Texto para Código Morse</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Norma Oficial Internacional ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Tradutor de Texto para Código Morse: Converta Letras em Pontos e Traços
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '840px', margin: '0 auto', lineHeight: 1.6 }}>
          Digite ou cole qualquer texto em português para codificá-lo instantaneamente em código Morse internacional. Reproduza o áudio telegráfico sintetizado em tempo real, ajuste a velocidade em WPM e faça o download do áudio em arquivo WAV de alta fidelidade.
        </p>
      </div>

      {/* Interactive Tool Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        {/* Tool Header Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Codificador de Texto em Tempo Real</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
              title="Configurar velocidade e frequência sonora"
            >
              <Settings size={14} />
              <span>Configurações de Áudio</span>
            </button>
            <button
              onClick={() => setTextInput('')}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Painel Expansível de Ajustes de Áudio */}
        {showAudioSettings && (
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Velocidade: <strong>{wpm} WPM</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max="45"
                  value={wpm}
                  onChange={(e) => handleWpmChange(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Espaçamento Farnsworth: <strong>{farnsworthWpm} WPM</strong>
                </label>
                <input
                  type="range"
                  min="5"
                  max={wpm}
                  value={farnsworthWpm}
                  onChange={(e) => setFarnsworthWpm(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Frequência Sonora: <strong>{frequency} Hz</strong>
                </label>
                <input
                  type="range"
                  min="400"
                  max="1000"
                  step="50"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Volume: <strong>{Math.round(volume * 100)}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Input & Output Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.25rem' }}>
          {/* Text Input Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="pt-text-input" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Texto de Entrada (Português):
              </label>
              <button
                onClick={() => handleCopy(textInput, 'text')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'text' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'text' ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              id="pt-text-input"
              ref={inputRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Digite sua frase ou palavra em português aqui..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'var(--text-primary)',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Caracteres: <strong>{textInput.length}</strong></span>
              <span>Palavras: <strong>{textInput.trim() ? textInput.trim().split(/\s+/).length : 0}</strong></span>
            </div>
          </div>

          {/* Morse Output Column */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="pt-morse-output" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Código Morse Resultante:
              </label>
              <button
                onClick={() => handleCopy(morseOutput, 'morse')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'morse' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'morse' ? 'Copiado!' : 'Copiar Código Morse'}</span>
              </button>
            </div>
            <textarea
              id="pt-morse-output"
              readOnly
              value={morseOutput}
              placeholder="O código Morse gerado surgirá aqui automaticamente..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                letterSpacing: '2px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: 'var(--accent-warning)',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Pontos e traços: <strong>{morseOutput.replace(/[\s\/]/g, '').length}</strong></span>
              <span>Duração estimada: <strong>{stats ? `${(stats.durationMs / 1000).toFixed(1)}s` : '0s'}</strong></span>
            </div>
          </div>
        </div>

        {/* Visualização da Decomposição de Caracteres */}
        {breakdown && breakdown.length > 0 && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Decomposição Visual com Iluminação em Tempo Real:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {breakdown.map((item, idx) => {
                const isActive = isPlaying && activeCharIndex === idx;
                if (item.isSpace) {
                  return (
                    <span key={idx} style={{ padding: '0.2rem 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
                      /
                    </span>
                  );
                }
                return (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      background: isActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? '#000000' : 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <strong style={{ fontSize: '0.9rem' }}>{item.char}</strong>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isActive ? '#000' : 'var(--accent-warning)' }}>
                      {item.morse}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!morseOutput}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--accent-primary)', color: '#000', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Play size={16} />
                <span>Ouvir em Código Morse</span>
              </button>
            ) : (
              <button
                onClick={handleStopAudio}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', color: 'var(--accent-danger, #ef4444)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
              >
                <Square size={16} />
                <span>Parar Áudio</span>
              </button>
            )}

            <button
              onClick={handleDownloadWav}
              disabled={!morseOutput}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <Download size={16} />
              <span>Baixar Áudio WAV</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Total: <strong>{textInput.length} caracteres</strong> • Velocidade: <strong>{wpm} WPM</strong>
          </div>
        </div>
      </div>

      {/* Preset Example Cards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Exemplos Rápidos em Português (Clique para Carregar)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {sampleTexts.map((sample, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => setTextInput(sample.text)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-color)'
              }}
              title="Clique para carregar esta frase no codificador"
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                {sample.label}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {sample.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CONTEÚDO EDITORIAL COMPLETO E APROFUNDADO (PARIDADE INTEGRAL COM O GUIA)
          ========================================================================= */}

      {/* 1. Resposta Rápida: Conversão de Texto para Código Morse */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Resposta Rápida: Conversão de Texto para Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          A <strong>conversão de texto para código Morse</strong> é o processo telegráfico de tradução sistemática de letras, números e sinais ortográficos da língua portuguesa em padrões normalizados de impulsos curtos (pontos, <code>.</code>) e impulsos longos (traços, <code>-</code>), de acordo com a norma internacional <strong>ITU-R M.1677-1</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Cada caractere possui uma assinatura unívoca de pulsos. Por exemplo, a palavra <strong>OLÁ</strong> converte-se em <code style={{ color: 'var(--accent-warning)', fontFamily: 'monospace', letterSpacing: '2px' }}>--- .-.. .-</code>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Na escrita telegráfica convencional em tela ou papel, as letras individuais são separadas por um espaço em branco, enquanto palavras distintas são separadas formalmente por uma barra inclinada (<code>/</code>) delimitada por espaços: <strong>OLÁ MUNDO</strong> codifica-se como <code style={{ color: 'var(--accent-warning)', fontFamily: 'monospace' }}>--- .-.. .- / -- ..- -. -.. ---</code>.
        </p>
      </section>

      {/* 2. Como Converter Texto para Código Morse Passo a Passo */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Como Converter Texto em Código Morse Passo a Passo
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Para codificar qualquer palavra ou documento manualmente sem recorrer a softwares automatizados, os radiotelegrafistas seguem uma metodologia sequencial em 4 etapas:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>1. Decomposição de Caracteres</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Isole as palavras da frase e divida cada termo nas suas letras constitutivas individuais (ex.: <code>S - O - S</code>).
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>2. Consulta à Tabela Internacional</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Localize o código de cada letra na tabela da ITU: S = <code>...</code>, O = <code>---</code>, S = <code>...</code>.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>3. Aplicação do Espaçamento</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Insira um espaço simples entre cada letra e uma barra inclinada <code>/</code> entre palavras independentes.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>4. Verificação Auditiva</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Reproduza a sonoridade do sinal gerado para conferir a métrica rítmica e garantir a ausência de ambiguidades.
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '1.25rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Exemplo Prático: BOM DIA</strong>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
            B (<code>-...</code>) + O (<code>---</code>) + M (<code>--</code>) = <code style={{ color: 'var(--accent-warning)' }}>-... --- --</code><br />
            D (<code>-..</code>) + I (<code>..</code>) + A (<code>.-</code>) = <code style={{ color: 'var(--accent-warning)' }}>-.. .. .-</code><br />
            Resultado montado com barra de palavra: <code style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>-... --- -- / -.. .. .-</code>
          </p>
        </div>
      </section>

      {/* 3. Normalização de Acentos e Diacríticos do Português */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Normalização de Acentos e Diacríticos da Língua Portuguesa
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          A língua portuguesa possui uma rica variedade de sinais diacríticos: acento agudo (Á, É, Í, Ó, Ú), acento circunflexo (Â, Ê, Ô), til (Ã, Õ), acento grave (À) e a cedilha (Ç). Contudo, nas telecomunicações telegráficas mundiais regidas pela norma <strong>ITU-R M.1677-1</strong> e seguidas pela <strong>LABRE</strong> no Brasil e pela <strong>REP</strong> em Portugal, as mensagens são transmitidas com base no alfabeto latino desacentuado de 26 letras.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          O nosso codificador aplica um algoritmo de normalização fonética inteligente e transparente:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>Vogais com agudo ou circunflexo (Á, Â, É, Ê, Í, Ó, Ô, Ú):</strong> convertem-se diretamente nas suas vogais fundamentais (A, E, I, O, U).</li>
          <li><strong>Vogais nasais com til (Ã, Õ):</strong> convertem-se em A e O simples.</li>
          <li><strong>Consoante com cedilha (Ç):</strong> converte-se no caractere latino base C (<code>-.-.</code>).</li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Essa prática centenária evita falhas de recepção entre operadores de países diferentes e garante que o seu código seja decodificado com perfeição em qualquer rádio transceptor de ondas curtas no planeta.
        </p>
      </section>

      {/* 4. Tabela de Mapeamento Completo de Caracteres e Ritmo */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Tabela Completa de Conversão: Letras, Ritmo Dit-Dah e Fonética ICAO
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Consulte o padrão telegráfico exato de cada letra, o seu som rítmico oral e a palavra-código do alfabeto fonético da aviação e marinha:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Caractere</th>
                <th style={{ padding: '0.85rem 1rem' }}>Código Morse</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ritmo Mnemônico</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nome Fonético Internacional</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(MORSE_CODE_MAP).filter(([_, d]) => d.type === 'letter').map(([char, data]) => (
                <tr key={char} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{char}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--accent-warning)' }}>{data.morse}</td>
                  <td style={{ padding: '0.85rem 1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{data.ditDah}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)' }}>{data.phonetic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Temporização e Padrão PARIS */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Temporização Rigorosa e o Padrão de Calibração PARIS
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Para que a velocidade de transmissão em Palavras Por Minuto (<strong>WPM</strong>) seja exata e padronizada em nível global, a indústria de telecomunicações adotou a palavra convencional <strong>PARIS</strong> como unidade de aferição métrica.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          A palavra <code>PARIS</code>, juntamente com a sua pausa inter-palavras de 7 unidades, totaliza precisamente <strong>50 unidades elementares de tempo</strong>:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><strong>P</strong> (<code>.--.</code>) = 1 + 1 + 3 + 1 + 3 + 1 + 1 = 11 unidades (com pausas internas)</li>
          <li><strong>A</strong> (<code>.-</code>) = 1 + 1 + 3 = 5 unidades</li>
          <li><strong>R</strong> (<code>.-.</code>) = 1 + 1 + 3 + 1 + 1 = 7 unidades</li>
          <li><strong>I</strong> (<code>..</code>) = 1 + 1 + 1 = 3 unidades</li>
          <li><strong>S</strong> (<code>...</code>) = 1 + 1 + 1 + 1 + 1 = 5 unidades</li>
          <li>Pausas de 3 unidades entre as 5 letras = 4 × 3 = 12 unidades</li>
          <li>Pausa de palavra final = 7 unidades</li>
          <li><strong>Total acumulado:</strong> 11 + 5 + 7 + 3 + 5 + 12 + 7 = <strong>50 unidades</strong>.</li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Portanto, para calcular a duração exata de um ponto (dit) em milissegundos a qualquer velocidade WPM, aplica-se a fórmula matemática: <code style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Duração (ms) = 1200 / WPM</code>. A 20 WPM, cada ponto dura exatos 60 ms e cada traço dura 180 ms.
        </p>
      </section>

      {/* 6. Código Morse Americano vs. Código Morse Internacional */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Código Morse Americano vs. Código Morse Internacional
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          O código Morse original, idealizado por Samuel Morse e Alfred Vail em 1844 para as ferrovias dos Estados Unidos, possuía inconsistências acústicas: usava traços de durações variáveis e pausas internas dentro de letras simples (a letra C, por exemplo, era transmitida como dois pontos separados por uma pausa curta).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Para solucionar esses impasses em linhas telegráficas transnacionais europeias, o engenheiro Friedrich Clemens Gerke reformulou o sistema em 1848, eliminando as pausas intra-letras e uniformizando a duração de todos os traços em 3 unidades. Essa versão aprimorada foi formalizada na Conferência de Paris em 1865 como o <strong>Código Morse Internacional</strong>, o único padrão legal adotado atualmente na aviação, marinha, defesa civil e no radioamadorismo contemporâneo.
        </p>
      </section>

      {/* 7. Casos de Uso Contemporâneos e Aplicações Práticas */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Casos de Uso Contemporâneos da Conversão de Texto para Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Embora as telecomunicações por satélite e fibra óptica tenham substituído o telégrafo elétrico comercial, a conversão de texto para código Morse desempenha papéis vitais no século XXI:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Radioamadorismo Operacional (CW)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              O modo telegráfico CW possui uma largura de banda ultraconcentrada (apenas 100 a 300 Hz contra 3000 Hz da voz em SSB). Essa eficiência permite que um operador com apenas 5 Watts de potência atravesse oceanos e continentes mesmo sob tempestades solares intensas.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#f59e0b', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Arte, Joalheria e Tatuagens</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Pulseiras com miçangas, colares com nós e anéis gravados utilizam a sequência de pontos e traços para incorporar mensagens afetivas secretas ("TE AMO", "RESILIÊNCIA", nomes de filhos) de maneira discreta, elegante e permanente.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#10b981', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Salas de Escape e Gamificação</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Quebra-cabeças em jogos de escape room, gincanas escolares de física e desafios de segurança cibernética (CTF) empregam pistas telegráficas em áudio ou luz estroboscópica para testar o raciocínio dedutivo dos participantes.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: '#a855f7', margin: '0 0 0.5rem', fontSize: '0.95rem' }}>Acessibilidade e Tecnologia Assistiva</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              Pessoas com deficiências motoras severas ou paralisia cerebral utilizam pulsadores simples acionados com a respiração ou movimento palpebral para introduzir pontos e traços, que softwares de síntese de voz convertem instantaneamente em fala audível.
            </p>
          </div>
        </div>
      </section>

      {/* 8. Física da Modulação e Áudio Web */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Engenharia Sonora: Modulação OOK e Prevenção de Estalidos (Anti-Clipping)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Quando você clica em "Ouvir em Código Morse", a <strong>Web Audio API</strong> do seu navegador web instancia um oscilador senoidal puro na frequência selecionada (por padrão 600 Hz).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Em sistemas telegráficos digitais descuidados, cortar abruptamente uma onda senoidal de 600 Hz de 100% de amplitude para 0% em zero milissegundos produz um artefato acústico indesejado chamado <em>key click</em> (estalido mecânico), causado pela geração de harmônicos espúrios de alta frequência.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Nosso motor de áudio implementa uma curva de ganho com envelope trapezoidal e rampa de subida e descida de 5 milissegundos (<em>attack/decay shaping</em>), em perfeita conformidade com as recomendações técnicas da ARRL e da UIT. O resultado é um timbre aveludado, cristalino e perfeitamente legível, sem ruídos parasitas ou distorções no alto-falante.
        </p>
      </section>

      {/* 9. Perguntas Frequentes (FAQs) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Perguntas Frecuentes sobre a Conversão de Texto para Código Morse
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
                  <span>{faq.q}</span>
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

      {/* Rodapé e Links Internos */}
      <footer style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Conheça Outras Ferramentas e Recursos de Código Morse
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Explore nosso ecossistema de telegrafia digital com tabela completa de caracteres, tradutor reverso de pontos e traços para texto e decodificador com diagnósticos visuais:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/pt/codigo-morse-para-texto/"
            onClick={(e) => handleNav(e, 'pt-morse2text', '/pt/codigo-morse-para-texto/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Tradutor de Morse para Texto <ArrowRight size={16} />
          </a>
          <a
            href="/pt/alfabeto-morse/"
            onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Alfabeto Morse Completo
          </a>
          <a
            href="/pt/numeros-em-codigo-morse/"
            onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Números em Código Morse
          </a>
          <a
            href="/pt/decodificador-codigo-morse/"
            onClick={(e) => handleNav(e, 'pt-decoder', '/pt/decodificador-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', fontWeight: 700, textDecoration: 'none' }}
          >
            Decodificador com Diagnóstico
          </a>
        </div>
      </footer>
    </div>
  );
}
