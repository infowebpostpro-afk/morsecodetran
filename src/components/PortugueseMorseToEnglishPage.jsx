import React, { useState, useMemo, useRef } from 'react';
import {
  Volume2, Copy, Play, ArrowRight, ShieldCheck, ChevronDown, ChevronUp,
  HelpCircle, Download, Square, Check, BookOpen, AlertTriangle, Sparkles, ExternalLink
} from 'lucide-react';
import { translateMorseToPortuguese, getPortugueseCharacterBreakdown } from '../engine/portugueseMorse.js';
import { normalizeMorseInput, calculateStatistics } from '../engine/morseEngine.js';
import { audioEngine } from '../engine/audioEngine.js';
import { MORSE_CODE_MAP } from '../engine/morseMap.js';

export function PortugueseMorseToEnglishPage({
  wpm = 20,
  setWpm,
  frequency = 600,
  volume = 0.5,
  showToast,
  setActiveTab
}) {
  const [morseInput, setMorseInput] = useState('--- .-.. .- / -- ..- -. -.. ---');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTokenIdx, setActiveTokenIdx] = useState(-1);
  const [copiedType, setCopiedType] = useState(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);

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

  // Normalizar entrada Morse
  const normalizedMorse = useMemo(() => normalizeMorseInput(morseInput), [morseInput]);

  // Decodificar para texto em português
  const decodeResult = useMemo(() => {
    if (!normalizedMorse.trim()) return { text: '', hasUnrecognizedMorse: false };
    return translateMorseToPortuguese(normalizedMorse);
  }, [normalizedMorse]);

  const portugueseOutput = decodeResult.text;

  // Decomposição de caracteres para reprodução de áudio e visualização
  const breakdown = useMemo(() => {
    if (!portugueseOutput || decodeResult.hasUnrecognizedMorse) return [];
    return getPortugueseCharacterBreakdown(portugueseOutput);
  }, [portugueseOutput, decodeResult.hasUnrecognizedMorse]);

  const stats = useMemo(() => {
    return calculateStatistics(portugueseOutput, normalizedMorse, wpm, wpm);
  }, [portugueseOutput, normalizedMorse, wpm]);

  const handlePlayAudio = () => {
    if (!normalizedMorse.trim() || decodeResult.hasUnrecognizedMorse) return;
    setIsPlaying(true);
    setActiveTokenIdx(-1);

    audioEngine.playSequence({
      breakdown: breakdown.length > 0 ? breakdown : undefined,
      morse: breakdown.length > 0 ? undefined : normalizedMorse,
      wpm,
      frequency,
      volume,
      onProgress: ({ activeCharIndex: idx, isEnded }) => {
        if (isEnded) {
          setIsPlaying(false);
          setActiveTokenIdx(-1);
          return;
        }
        if (typeof idx === 'number') {
          setActiveTokenIdx(idx);
        }
      }
    });
  };

  const handleStopAudio = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setActiveTokenIdx(-1);
  };

  const handleCopy = async (text, typeLabel) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(typeLabel);
      if (showToast) showToast(`${typeLabel === 'morse' ? 'Código Morse' : 'Texto decodificado'} copiado com sucesso! ✓`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      if (showToast) showToast('Não foi possível copiar para a área de transferência.');
    }
  };

  const handleDownloadWav = () => {
    if (!normalizedMorse) return;
    try {
      const blob = audioEngine.generateWavBlob({ morse: normalizedMorse, wpm, frequency, volume });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `codigo-morse-audio-${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      if (showToast) showToast('Arquivo de áudio WAV descarregado com sucesso! ✓');
    } catch {
      if (showToast) showToast('Erro ao gerar arquivo de áudio WAV.');
    }
  };

  const handleAppendSymbol = (sym) => {
    setMorseInput(prev => prev + sym);
  };

  const handleClear = () => {
    setMorseInput('');
  };

  const examples = [
    { label: 'OLÁ', morse: '--- .-.. .-' },
    { label: 'OLÁ MUNDO', morse: '--- .-.. .- / -- ..- -. -.. ---' },
    { label: 'SOS (Socorro)', morse: '... --- ...' },
    { label: 'TE AMO', morse: '- . / .- -- ---' },
    { label: 'BOM DIA', morse: '-... --- -- / -.. .. .-' },
    { label: 'OBRIGADO', morse: '--- -... .-. .. --. .- -.. ---' },
    { label: 'SAUDADES', morse: '... .- ..- -.. .- -.. . ...' },
    { label: 'BRASIL', morse: '-... .-. .- ... .. .-..' },
    { label: 'PORTUGAL', morse: '.--. --- .-. - ..- --. .- .-..' }
  ];

  // Entradas do alfabeto para tabela didática
  const alphabetEntries = Object.entries(MORSE_CODE_MAP).filter(([_, data]) => data.type === 'letter');

  const faqs = [
    {
      q: "Como traduzir código Morse para texto em português?",
      a: "Basta colar ou digitar os pontos (.) e traços (-) no campo de entrada do decodificador. Na telegrafia escrita, utiliza-se um espaço simples entre cada letra e uma barra inclinada (/) ou três espaços para separar palavras. O decodificador analisa as sequências em tempo real e apresenta instantaneamente o caractere correspondente em português, de acordo com o padrão internacional ITU-R M.1677-1."
    },
    {
      q: "O que significa '--- .-.. .-' em código Morse?",
      a: "Significa a palavra 'OLÁ'. Os três grupos de impulsos representam: O (---), L (.-..) e A (.-). No código Morse internacional, as letras com acentos gráficos (como o acento agudo do Á) são transmitidas normalmente pelo seu caractere-base desacentuado para garantir total legibilidade."
    },
    {
      q: "O que significa '... --- ...' em código Morse?",
      a: "Representa a sigla SOS, o sinal internacional de socorro e emergência. Criado na Convenção Radiotelegráfica de Berlim em 1906, foi adotado devido à sua cadência sonora inconfundível: três dits curtos (...), três dahs longos (---) e três dits curtos (...). Em transmissões de rádio reais de emergência, emite-se de forma unificada e contínua (...---...) sem intervalos entre as letras."
    },
    {
      q: "É possível decodificar código Morse sem espaços entre as letras?",
      a: "Não de forma unívoca ou garantida. Como o código Morse é um código de comprimento variável (as letras possuem entre 1 e 4 impulsos), a remoção dos espaços delimitadores cria múltiplas ambiguidades matemáticas. Por exemplo, a sequência de três pontos '...' pode representar a letra 'S', mas também a combinação 'EEE', 'EI' ou 'IE'. Sem os intervalos de silêncio, uma única frase pode gerar milhares de permutações possíveis."
    },
    {
      q: "Para que serve a barra inclinada (/) no código Morse escrito?",
      a: "Na notação textual do código Morse, a barra inclinada (/) representa formalmente a separação entre duas palavras distintas (por exemplo: '--- .-.. .- / -- ..- -. -.. ---' traduz-se como 'OLÁ MUNDO'). Na transmissão auditiva ou luminosa, essa barra equivale ao silêncio regulamentar de 7 unidades de tempo estipulado pela ITU."
    },
    {
      q: "Por que a minha tradução de código Morse exibiu caracteres de interrogação (?)?",
      a: "Um ponto de interrogação (?) vermelho surge quando o decodificador encontra uma sequência de pontos e traços que não existe na tabela oficial da ITU. Isso ocorre com frequência se houver falta de espaços entre letras consecutivas (fazendo o sistema interpretar duas letras como uma sequência inválida de 5 ou 6 pulsos) ou caso tenha sido colado um caractere especial inválido."
    },
    {
      q: "Como o decodificador lida com acentos da língua portuguesa (Á, É, Í, Ó, Ú, Â, Ê, Ã, Õ)?",
      a: "No código Morse internacional padronizado pela ITU e adotado pela LABRE (Liga de Amadores Brasileiros de Rádio Emissão) e pela REP (Rede dos Emissores Portugueses), as comunicações telegráficas utilizam o alfabeto latino desacentuado (A–Z). Letras com diacríticos como 'ã', 'é', 'ó' ou 'ç' são decodificadas e mapeadas para seus equivalentes latinos diretos, assegurando total interoperabilidade em transmissões de ondas curtas ao redor do mundo."
    },
    {
      q: "É possível traduzir código Morse a partir de um arquivo de áudio gravado?",
      a: "Sim, porém isso requer análise espectrográfica de sinal com transformada rápida de Fourier (FFT) para identificar frequências em Hertz e medir a duração precisa dos pulsos sonoros e silêncios. Para essa finalidade, acesse a nossa ferramenta especializada de decodificação de áudio Morse."
    },
    {
      q: "Consigo decodificar código Morse a partir de fotos, imagens ou desenhos?",
      a: "Sim! Se você possui uma foto de um bilhete antigo, um quebra-cabeça de escape room ou uma tatuagem em Morse com bom contraste visual, nossa ferramenta de Decodificador de Imagem processa os pixels via Canvas e extrai automaticamente a sequência de pontos e traços para convertê-la em texto."
    },
    {
      q: "O código Morse é considerado um idioma ou uma cifra de codificação?",
      a: "O código Morse não é um idioma: ele não possui léxico, gramática ou vocabulário próprios. Trata-se de uma codificação de caracteres que mapeia os sinais ortográficos de línguas naturais existentes (como português, inglês, espanhol e francês) em impulsos sonoros, elétricos ou luminosos binários."
    },
    {
      q: "O código Morse utilizado no Brasil e em Portugal é o mesmo dos outros países?",
      a: "Sim. Tanto no Brasil (sob supervisão da Anatel e da LABRE) quanto em Portugal (sob supervisão da ANACOM e da REP), o padrão oficial vigente é o Código Morse Internacional regulamentado pela Recomendação ITU-R M.1677-1. O antigo Morse Americano de ferrovia entrou em desuso no início do século XX."
    },
    {
      q: "Qual é a velocidade recomendada em WPM para começar a aprender a decodificar?",
      a: "Para iniciantes na telegrafia auditiva, recomenda-se iniciar entre 15 e 20 WPM para o ritmo dos caracteres individuais, utilizando pausas ampliadas entre letras (o Método Farnsworth). Isso evita o vício nocivo de contar pontos mentalmente e treina o cérebro a reconhecer a melodia rítmica global de cada caractere."
    },
    {
      q: "Como são representados os algarismos de 0 a 9 em código Morse?",
      a: "Todos os números no padrão internacional possuem exatamente 5 elementos. Os algarismos de 1 a 5 iniciam com pontos crescentes seguidos de traços (1 = .----, 2 = ..---, 3 = ...--, 4 = ....-, 5 = .....), enquanto os algarismos de 6 a 0 iniciam com traços crescentes seguidos de pontos (6 = -...., 7 = --..., 8 = ---.., 9 = ----., 0 = -----)."
    },
    {
      q: "Quais são os principais sinais de pontuação no código Morse?",
      a: "Os sinais de pontuação mais comuns incluem o ponto final (.-.-.-), a vírgula (--..--), o ponto de interrogação (..--..), a barra de fração (-..-.) e o sinal de igual ou separador de parágrafo (-...-)."
    },
    {
      q: "O que são 'prosigns' ou sinais operacionais de telegrafia?",
      a: "Prosigns (sinais de procedimento) são combinações de duas letras enviadas em um único fluxo contínuo sem a pausa habitual entre caracteres, utilizadas para coordenar o tráfego radiotelegráfico. Exemplos incluem <AR> (.-.-., fim de transmissão), <SK> (...-.-, encerramento de contato) e <AS> (.-..., aguarde um momento)."
    },
    {
      q: "Posso baixar o áudio da mensagem decodificada em arquivo WAV?",
      a: "Sim. Após inserir a sequência de pontos e traços, clique no botão 'Baixar Áudio WAV' para salvar um arquivo sonoro PCM de alta definição diretamente em seu computador ou smartphone, ideal para treinos offline ou estudos."
    },
    {
      q: "Quais entidades oficiais regulam as diretrizes deste tradutor?",
      a: "Nossa aplicação baseia-se estritamente na Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações (Genebra, Suíça), alinhando-se aos manuais de radioamadorismo da LABRE, da REP e da International Amateur Radio Union (IARU)."
    }
  ];

  return (
    <div className="article-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Navegação Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <a href="/pt/" onClick={(e) => handleNav(e, 'portuguese', '/pt/')} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Início</a>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ color: 'var(--text-primary)' }}>Código Morse para Texto</span>
      </nav>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Norma Oficial Internacional ITU-R M.1677-1
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
          Tradutor de Código Morse para Texto: Decodifique Pontos e Traços
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '840px', margin: '0 auto', lineHeight: 1.6 }}>
          Cole ou digite sequências de pontos e traços para traduzir código Morse instantaneamente em texto claro em português. Reproduza a sonoridade do sinal com Web Audio API em tempo real, verifique diagnósticos de espaçamento e faça o download do áudio em arquivo WAV de alta fidelidade.
        </p>
      </div>

      {/* Painel Interativo Principal */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem' }}>
        {/* Barra superior de ações rápidas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <span>Decodificador Bidirecional com Detecção de Espaçamento</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleClear}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
            >
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* Grade de Entrada e Saída */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.25rem' }}>
          {/* Coluna de Entrada: Código Morse */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="morse-input-area" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Código Morse de Entrada:
              </label>
              <button
                onClick={() => handleCopy(morseInput, 'morse')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'morse' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'morse' ? 'Copiado!' : 'Copiar Morse'}</span>
              </button>
            </div>
            <textarea
              id="morse-input-area"
              value={morseInput}
              onChange={(e) => setMorseInput(e.target.value)}
              placeholder="Ex: --- .-.. .- / -- ..- -. -.. --- (use espaço entre letras e barra / entre palavras)..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                letterSpacing: '2px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: 'var(--accent-warning)',
                resize: 'vertical'
              }}
            />

            {/* Teclado Virtual com Botões de Inserção Rápida */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleAppendSymbol('.')}
                style={{ flex: 1, padding: '0.45rem', fontWeight: 800, fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Inserir ponto (.)"
              >
                • Ponto (.)
              </button>
              <button
                onClick={() => handleAppendSymbol('-')}
                style={{ flex: 1, padding: '0.45rem', fontWeight: 800, fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Inserir traço (-)"
              >
                — Traço (-)
              </button>
              <button
                onClick={() => handleAppendSymbol(' ')}
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Inserir espaço entre letras"
              >
                Espaço (Letra)
              </button>
              <button
                onClick={() => handleAppendSymbol(' / ')}
                style={{ flex: 1, padding: '0.45rem', fontSize: '0.85rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
                title="Inserir barra separadora de palavras"
              >
                / Palavra
              </button>
            </div>
          </div>

          {/* Coluna de Saída: Texto em Português */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="text-output-area" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Texto Decodificado em Português:
              </label>
              <button
                onClick={() => handleCopy(portugueseOutput, 'text')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                {copiedType === 'text' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedType === 'text' ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              id="text-output-area"
              readOnly
              value={portugueseOutput}
              placeholder="O texto decodificado surgirá aqui automaticamente em tempo real..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'var(--accent-primary)',
                resize: 'vertical'
              }}
            />

            {/* Estatísticas de Saída */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>Caracteres: <strong>{portugueseOutput.length}</strong></span>
              <span>Palavras: <strong>{portugueseOutput.trim() ? portugueseOutput.trim().split(/\s+/).length : 0}</strong></span>
              <span>Duração estimada: <strong>{stats ? `${(stats.durationMs / 1000).toFixed(1)}s` : '0s'}</strong></span>
            </div>
          </div>
        </div>

        {/* Alerta de Caracteres Não Reconhecidos */}
        {decodeResult.hasUnrecognizedMorse && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger, #ef4444)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.85rem' }}>
            <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span>
              Aviso: A sequência contém padrões Morse não catalogados na norma ITU-R M.1677-1 (marcados como <code>?</code>). Certifique-se de adicionar espaços entre as letras.
            </span>
          </div>
        )}

        {/* Visualização de Token Ativo durante a Reprodução */}
        {breakdown && breakdown.length > 0 && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Decomposição Fonética e Rítmica dos Caracteres:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {breakdown.map((item, idx) => {
                const isActive = isPlaying && activeTokenIdx === idx;
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

        {/* Barra de Controles de Áudio e Download */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!isPlaying ? (
              <button
                onClick={handlePlayAudio}
                disabled={!normalizedMorse.trim() || decodeResult.hasUnrecognizedMorse}
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
              disabled={!normalizedMorse.trim()}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--surface-hover)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            >
              <Download size={16} />
              <span>Baixar Áudio WAV</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Velocidade: <strong>{wpm} WPM</strong> • Frequência Sonora: <strong>{frequency} Hz</strong>
          </div>
        </div>
      </div>

      {/* Frases e Exemplos Pré-definidos */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Exemplos Prontos em Código Morse (Clique para Carregar)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {examples.map((ex, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => setMorseInput(ex.morse)}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-color)'
              }}
              title="Clique para carregar esta frase no decodificador"
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>
                {ex.label}
              </div>
              <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {ex.morse}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CONTEÚDO EDITORIAL COMPLETO E APROFUNDADO (PARIDADE INTEGRAL COM O GUIA)
          ========================================================================= */}

      {/* 1. Resposta Rápida: De Morse para Português */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Resposta Rápida: Como Traduzir Código Morse para Texto
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Para decodificar código Morse em texto legível em português, cada grupo discreto de pontos e traços é confrontado com seu caractere alfanumérico correspondente no alfabeto internacional regulamentado pela norma <strong>ITU-R M.1677-1</strong>:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'monospace', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><code>---</code> = O</li>
          <li><code>.-..</code> = L</li>
          <li><code>.-</code> = A</li>
        </ul>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.75rem' }}>
          Assim, a sequência: <code style={{ color: 'var(--accent-warning)', fontFamily: 'monospace', letterSpacing: '2px' }}>--- .-.. .-</code> traduz-se como <strong>OLÁ</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Para expressar frases com múltiplas palavras no formato escrito, utiliza-se convencionalmente uma barra inclinada <code>/</code> delimitada por espaços para indicar o intervalo entre termos:
        </p>
        <p style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: 'var(--accent-warning)', letterSpacing: '1px' }}>
          --- .-.. .- / -- ..- -. -.. --- ➔ <strong>OLÁ MUNDO</strong>
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          O elemento primordial para o sucesso da tradução está no <strong>espaçamento delimitador</strong>: os pontos e traços de uma mesma letra são agrupados sem espaços; um espaço simples separa duas letras consecutivas; e a barra <code>/</code> separa palavras independentes.
        </p>
      </section>

      {/* 2. Tabela de Referência A–Z e Caracteres */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Tabela de Referência do Alfabeto em Código Morse (A–Z)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Consulte o padrão de pontos e traços, a representação mnemônica di-dah e a palavra fonética internacional ICAO/OTAN adotada na radiotelegrafia marítima e aeronáutica:
        </p>

        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--surface-card)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Letra</th>
                <th style={{ padding: '0.85rem 1rem' }}>Código Morse</th>
                <th style={{ padding: '0.85rem 1rem' }}>Ritmo Falado</th>
                <th style={{ padding: '0.85rem 1rem' }}>Fonética Internacional (ICAO)</th>
              </tr>
            </thead>
            <tbody>
              {alphabetEntries.map(([char, data]) => (
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

      {/* 3. Regras de Espaçamento e Temporização Universal */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Como Funciona o Espaçamento Temporal no Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          O código Morse não se define apenas por pulsos de som ou luz, mas essencialmente pelas <strong>durações matemáticas dos silêncios</strong>. Toda a telegrafia mundial obedece à regra de proporção <strong>1 : 3 : 1 : 3 : 7</strong> estipulada pela Recomendação ITU-R M.1677-1:
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)' }}>Elemento de Transmissão ou Intervalo</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--text-primary)', textAlign: 'right' }}>Duração Relativa Oficial</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Ponto (dit)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>1 unidade de tempo (t)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Traço (dah)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>3 unidades de tempo (3t)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa intra-caractere (entre dits/dahs da mesma letra)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>1 unidade de tempo (1t)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa entre letras consecutivas</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>3 unidades de tempo (3t)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem 1rem' }}>Pausa entre palavras distintas (barra <code>/</code>)</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700 }}>7 unidades de tempo (7t)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Ao decodificar texto impresso, a pausa de 3 unidades é representada por um espaço simples e a de 7 unidades por uma barra inclinada <code>/</code> ou três espaços. A precisão desses delimitadores assegura que uma transmissão telegráfica nunca se degenere em um fluxo ininteligível.
        </p>
      </section>

      {/* 4. Por Que os Espaços Importam Mais que os Pontos */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Por Que os Espaços Importam Mais que os Pontos: A Matemática da Ambiguidade
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Em sistemas binários de comprimento fixo (como o código ASCII de 8 bits ou o UTF-8), o computador sabe com exatidão onde cada caractere começa e termina. Em contrapartida, o código Morse é um <strong>código de comprimento variável</strong>: a letra <code>E</code> possui apenas 1 elemento (<code>.</code>), enquanto a letra <code>Q</code> possui 4 elementos (<code>--.-</code>).
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Se você omitir os espaços entre caracteres, a sequência <code>...</code> torna-se matematicamente ambígua:
        </p>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
          <li><code>...</code> agrupado sem espaços = <strong>S</strong></li>
          <li><code>. . .</code> com três espaços = <strong>E E E</strong></li>
          <li><code>.. .</code> com um espaço = <strong>I E</strong></li>
          <li><code>. ..</code> com um espaço = <strong>E I</strong></li>
        </ul>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Dessa forma, os pontos e traços transmitem os elementos de informação, mas são <strong>os silêncios que criam o significado</strong>. Sem o espaçamento correto, uma mensagem com meros 20 pulsos pode ter mais de 100.000 interpretações lexicais possíveis.
        </p>

        <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: '4px solid var(--accent-warning)', marginTop: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1rem' }}>
            A Notável Exceção do Prosign SOS
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: 1.6 }}>
            O sinal de socorro marítimo <code>...---...</code> é a única exceção regulamentar à obrigatoriedade do espaço de 3 unidades entre caracteres. Ele foi concebido para ser transmitido de forma unificada e ininterrupta como um único símbolo sonoro contínuo, facilitando a sua identificação instantânea mesmo em meio a tempestades e estática atmosférica extrema.
          </p>
        </div>
      </section>

      {/* 5. Exemplo Prático Desmembrado Passo a Passo */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Guia Passo a Passo: Exemplo Prático de Decodificação
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Imagine que você interceptou a seguinte mensagem telegráfica em código Morse:
        </p>
        <div style={{ fontFamily: 'monospace', fontSize: '1.15rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', padding: '0.85rem 1.25rem', borderRadius: '0.5rem', color: 'var(--accent-warning)', letterSpacing: '1px', marginBottom: '1.25rem' }}>
          -... --- -- / -.. .. .-
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Para decodificar manualmente sem calculadora, execute o seguinte procedimento metódico:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', margin: '0 0 0.5rem', fontWeight: 700 }}>
              Passo 1: Identificar a Divisão de Palavras
            </h4>
            <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              A barra <code>/</code> divide a transmissão em duas palavras independentes: Grupo 1 (<code>-... --- --</code>) e Grupo 2 (<code>-.. .. .-</code>).
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-warning)', margin: '0 0 0.5rem', fontWeight: 700 }}>
              Passo 2: Decodificar a 1ª Palavra (-... --- --)
            </h4>
            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              • <code>-...</code> = B<br />
              • <code>---</code> = O<br />
              • <code>--</code> = M<br />
              <strong>Resultado: BOM</strong>
            </p>
          </div>

          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '0.5rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#10b981', margin: '0 0 0.5rem', fontWeight: 700 }}>
              Passo 3: Decodificar a 2ª Palavra (-.. .. .-)
            </h4>
            <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              • <code>-..</code> = D<br />
              • <code>..</code> = I<br />
              • <code>.-</code> = A<br />
              <strong>Resultado: DIA</strong>
            </p>
          </div>
        </div>

        <p style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Mensagem completa decodificada: <span style={{ color: 'var(--accent-primary)' }}>BOM DIA</span>
        </p>
      </section>

      {/* 6. Decodificação Visual em Tatuagens, Pulseiras e Enigmas */}
      <section style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Decodificação Visual em Objetos Cotidianos (Tatuagens, Pulseiras e Joias)
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          O código Morse ganhou enorme popularidade no design contemporâneo de joias artesanais, pulseiras com contas, colares com miçangas e tatuagens discretas. Para transcrever essas mensagens visuais sem equívocos, aplique o seguinte protocolo em 6 etapas:
        </p>

        <ol style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
          <li><strong>Identifique a orientação de leitura:</strong> No padrão ocidental, as mensagens são lidas da esquerda para a direita em superfícies planas ou no sentido horário em pulseiras circulares (geralmente a partir do fecho).</li>
          <li><strong>Diferencie as contas de pontos e traços:</strong> Miçangas redondas esféricas representam pontos (dits); miçangas tubulares alongadas ou canutilhos representam traços (dahs).</li>
          <li><strong>Localize os nós ou separadores de letras:</strong> Pequenas contas de cores neutras ou nós no cordão costumam indicar o espaço de 3 unidades entre caracteres.</li>
          <li><strong>Identifique o separador de palavras:</strong> Espaçadores maiores ou pingentes indicam o final de uma palavra (equivalente à barra <code>/</code>).</li>
          <li><strong>Transcreva para o decodificador:</strong> Digite os símbolos no nosso campo de entrada mantendo espaços simples entre as letras.</li>
          <li><strong>Validação bidirecional (Round-Trip Test):</strong> Copie a palavra em português resultante e converta de volta para código Morse para conferir visualmente a equivalência absoluta com a peça física.</li>
        </ol>
      </section>

      {/* 7. Mensagens Frequentes e Afetivas em Morse */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Mensagens Afetivas e Frases Frequentes em Código Morse
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Veja como expressões e saudações carinhosas do português são transmitidas em pontos e traços:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>TE AMO</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>- . / .- -- ---</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>SAUDADES</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>... .- ..- -.. .- -.. . ...</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>OBRIGADO</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>--- -... .-. .. --. .- -.. ---</code>
          </div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '0.5rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>BOA NOITE</strong><br />
            <code style={{ fontSize: '0.9rem', color: 'var(--accent-warning)', fontFamily: 'monospace' }}>-... --- .- / -. --- .. - .</code>
          </div>
        </div>
      </section>

      {/* 8. Perguntas Frequentes (17 FAQs completas) */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Perguntas Frequentes sobre a Decodificação de Código Morse para Texto
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

      {/* Links Internos e Rodapé */}
      <footer style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
          Explore Outras Ferramentas de Código Morse em Português
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
          Converta texto para código Morse com sintetizador de áudio, consulte a tabela completa do alfabeto ou pratique a decodificação com diagnóstico visual:
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <a
            href="/pt/texto-para-codigo-morse/"
            onClick={(e) => handleNav(e, 'pt-text2morse', '/pt/texto-para-codigo-morse/')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary)', color: '#000000', fontWeight: 700, textDecoration: 'none' }}
          >
            Tradutor de Texto para Morse <ArrowRight size={16} />
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
        </div>
      </footer>
    </div>
  );
}
