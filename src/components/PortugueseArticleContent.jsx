import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQS_PT = [
  {
    q: "Como se traduz o código Morse?",
    a: "Insira uma sequência em código Morse no tradutor. A ferramenta compara os padrões de pontos e traços com a tabela oficial de caracteres e retorna o texto legível correspondente. Da mesma forma, você pode digitar texto normal em português para gerar o código Morse correspondente instantaneamente."
  },
  {
    q: "É possível traduzir código Morse para português?",
    a: "Sim. O tradutor decodifica sequências de Código Morse Internacional em letras de A a Z, números de 0 a 9 e todos os sinais de pontuação e símbolos normatizados pela UIT."
  },
  {
    q: "O que significa SOS em código Morse?",
    a: "SOS é transmitido como ... --- ... ou seja, três sinais curtos (pontos), três sinais longos (traços) e três sinais curtos. O SOS foi escolhido historicamente pela sua facilidade inconfundível de reconhecimento em transmissões marítimas de emergência, e não como uma sigla de palavras em inglês."
  },
  {
    q: "Qual é a diferença exata entre um ponto e um traço?",
    a: "Um ponto (dit) é a unidade temporal básica (1 unidade de tempo). Um traço (dah) tem duração exatamente três vezes superior à de um ponto (3 unidades de tempo). As combinações rítmicas desses dois elementos formam cada caractere."
  },
  {
    q: "O código Morse ainda é utilizado hoje em dia?",
    a: "Sim. O código Morse permanece vibrante e ativo na comunidade global de radioamadores (modalidade CW - Continuous Wave), na instrução militar especializada, no ensino escolar de representação binária de dados, em projetos STEM e na criação de enigmas e escape rooms."
  },
  {
    q: "Como aprender a ler código Morse com fluidez?",
    a: "A técnica comprovada consiste em treinar a audição para identificar o ritmo musical completo de cada caractere em vez de memorizar visualmente pontinhos no papel. Também é essencial respeitar os intervalos de silêncio entre elementos, letras e palavras."
  },
  {
    q: "Como escrever mensagens em código Morse corretamente?",
    a: "Converta cada caractere no seu padrão oficial da norma ITU-R M.1677-1. Separe as letras com um espaço simples e as palavras completas com uma barra diagonal (/) ou três espaços. Um tradutor online elimina equívocos manuais de transcrição."
  },
  {
    q: "O código Morse é difícil de aprender?",
    a: "Não. Com sessões curtas e consistentes de 10 a 15 minutos diários, a maioria dos iniciantes memoriza o alfabeto básico em duas a três semanas. O segredo é praticar ouvindo os sons desde o primeiro dia."
  },
  {
    q: "O que é o Código Morse Internacional?",
    a: "É a norma técnica padronizada mundialmente pela União Internacional de Telecomunicações (Recomendação ITU-R M.1677-1) para comunicações telegráficas, diferenciando-se do antigo código Morse americano terrestre de Samuel Morse."
  },
  {
    q: "O que significa a sigla WPM no código Morse?",
    a: "WPM significa 'Words Per Minute' (palavras por minuto). É a métrica internacional padrão para mensurar a velocidade de transmissão telegráfica, calculada com base na palavra de referência padrão PARIS."
  },
  {
    q: "O que é o espaçamento pedagógico Farnsworth?",
    a: "O método Farnsworth transmite os caracteres individuais numa velocidade mais alta (por exemplo, 18 ou 20 WPM), mas amplia os intervalos de silêncio entre letras e palavras. Isso treina o cérebro a reconhecer a musicalidade rápida das letras sem sobrecarregar o aprendiz."
  },
  {
    q: "Posso aprender código Morse usando este tradutor?",
    a: "Sim. Você pode utilizar a ferramenta para verificar transcrições, escutar o áudio de cada caractere em tempo real e treinar a sua percepção auditiva. O exercício ideal é cobrir a tela, ouvir o sinal e tentar transcrever o que ouviu."
  },
  {
    q: "Por que a minha tradução em Morse parece errada?",
    a: "Os motivos mais frequentes são: 1. Ausência de espaços entre as letras; 2. Confusão entre pontos e traços; 3. Caracteres acentuados não suportados que precisam de normalização; 4. Utilização de símbolos Unicode exóticos em vez de pontos e traços convencionais; 5. Áudio de baixa qualidade ou gravação ruidosa."
  },
  {
    q: "O código Morse pode ser transmitido como som?",
    a: "Sim. A forma mais clássica e eficaz de transmissão é o áudio sinusoidal (tons de telegrafia CW). A reprodução acústica é a maneira mais autêntica e rápida de assimilar o código."
  },
  {
    q: "O código Morse pode ser transmitido por sinais de luz?",
    a: "Sim. Luzes piscantes, lanternas navais e faróis ópticos utilizam lampejos breves para pontos e lampejos prolongados para traços, permitindo comunicação visual a longas distâncias sem rádio."
  },
  {
    q: "O código Morse pode ser emitido por vibração?",
    a: "Sim. Dispositivos táteis, smartphones e relógios inteligentes podem gerar impulsos vibratórios curtos e longos, servindo como uma tecnologia assistiva crucial de acessibilidade e comunicação silenciosa."
  }
];

export function PortugueseArticleContent({ setActiveTab, wpm = 20, frequency = 600, volume = 0.5, onSelectExample }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

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

  return (
    <article className="seo-article-container" style={{ maxWidth: '960px', margin: '3rem auto 0', padding: '0 1rem' }}>
      
      {/* INTRODUÇÃO PAS (2 parágrafos envolventes e autoritativos) */}
      <div className="article-intro-card" style={{ background: 'var(--surface-card, rgba(30, 41, 59, 0.7))', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color, rgba(255,255,255,0.1))', marginBottom: '3rem' }}>
        <p className="intro-paragraph" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
          Você já se deparou com uma mensagem composta por pontos e traços misteriosos e não teve ideia do que ela significava? O código Morse parece simples à primeira vista, mas um único ponto esquecido, um traço a mais ou um espaçamento ausente pode alterar drasticamente todo o sentido da transmissão. Conferir cada caractere manualmente consultando tabelas impressas exige tempo precioso e multiplica as chances de erros, especialmente quando você precisa de uma tradução rápida, precisa e confiável.
        </p>
        <p className="intro-paragraph" style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-secondary)', margin: 0 }}>
          É exatamente aí que o nosso <strong>Tradutor de Código Morse</strong> faz toda a diferença. Digite qualquer texto em português para gerar instantaneamente a sequência em código Morse correspondente, ou cole uma sequência de pontos e traços para decodificá-la em texto claro imediatamente. Inspecione cada caractere de forma individual, escute a cadência sonora em tempo real com áudio de alta fidelidade, exporte o áudio, copie o resultado com um clique e valide sua mensagem com total segurança antes de utilizá-la em comunicações, projetos escolares, tatuagens, joias, enigmas ou transmissões de rádio.
        </p>
      </div>

      <div className="article-body-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

        {/* SEÇÃO 1: O Que É um Tradutor de Código Morse? */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            O Que É um Tradutor de Código Morse?
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Um Tradutor de Código Morse é uma ferramenta bidirecional inteligente que converte texto escrito convencional em sinais de código Morse e traduz sequências de código Morse de volta para texto alfanumérico legível em português.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            O código Morse representa letras, números e sinais ortográficos por meio de impulsos sonoros, luminosos ou elétricos de curta e longa duração. Na representação tipográfica digital, esses impulsos são internacionalmente simbolizados por pontos (<code className="inline-code">.</code>) e traços (<code className="inline-code">-</code>).
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Veja um exemplo clássico e universal:
          </p>

          <div className="code-demo-box" style={{ background: 'var(--surface-hover, rgba(255,255,255,0.03))', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div className="demo-step" style={{ textAlign: 'center' }}>
              <span className="demo-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Texto Claro:</span>
              <strong className="demo-val" style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}>SOS</strong>
            </div>
            <div className="demo-arrow" style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.1rem' }}>→ transforma-se em: →</div>
            <div className="demo-step" style={{ textAlign: 'center' }}>
              <span className="demo-label" style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Código Morse:</span>
              <code className="demo-val morse-font" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-warning, #f59e0b)', letterSpacing: '2px' }}>... --- ...</code>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            A mesma sequência pode ser processada no sentido oposto para revelar imediatamente a palavra original: <strong>SOS</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Um tradutor de código Morse de alto padrão permite a você:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
            <li>Converter mensagens em português para código Morse de acordo com os padrões internacionais;</li>
            <li>Decodificar sequências de pontos e traços de volta para palavras e frases em português;</li>
            <li>Inspecionar e auditar a separação correta entre letras e palavras em transmissões telegráficas;</li>
            <li>Escutar a reprodução acústica com sintetizador Web Audio puro e tom ajustável em hertz;</li>
            <li>Aprender os ritmos musicais e a fonética telegráfica (dits e dahs) de cada caractere;</li>
            <li>Praticar telegrafia para radioamadorismo (CW) utilizando temporização padrão e espaçamento Farnsworth;</li>
            <li>Criar mensagens personalizadas para brincadeiras, desafios de escape room, enigmas e homenagens.</li>
          </ul>
        </section>

        {/* SEÇÃO 2: Como Usar Este Tradutor de Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Como Usar Este Tradutor de Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Você não precisa ter memorizado o alfabeto telegráfico antes de começar a explorar a ferramenta. Nossa interface intuitiva guia cada etapa do processo:
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Digite ou Cole Seu Texto</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Escreva qualquer texto, frase ou número na caixa de entrada principal. Por exemplo, ao digitar <strong>OLA MUNDO</strong>, o tradutor processa cada letra instantaneamente e produz a sequência correspondente: <code className="morse-font">--- .-.. .- / -- ..- -. -.. ---</code>.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Ou Digite Código Morse Diretamente</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Cole ou digite pontos (<code className="inline-code">.</code>) e traços (<code className="inline-code">-</code>). Mantenha sempre um espaço simples entre cada letra e utilize uma barra diagonal (<code className="inline-code">/</code>) para separar palavras. Por exemplo, a sequência <code className="morse-font">.... ..</code> é decodificada como <strong>HI</strong>, enquanto <code className="morse-font">--- ..</code> é decodificada como <strong>OI</strong>.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Detecção Automática Inteligente</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            A opção de Detecção Automática identifica por conta própria se o conteúdo inserido é texto alfanumérico ou se é uma sequência telegráfica. Caso esteja trabalhando com dados ambíguos, você pode fixar manualmente a direção clicando em <strong>Texto → Morse</strong> ou <strong>Morse → Texto</strong>.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>4. Conversão Instantânea em Tempo Real</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Cada caractere é traduzido à medida que você digita, sem necessidade de recarregar a página, enviar formulários ou aguardar processamento remoto em servidores externos.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>5. Ouça o Som do Código Morse</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            O código Morse nasceu para ser ouvido. Clique no botão de reprodução sonora para escutar as batidas dos pontos e traços em tempo real. As principais federações de radioamadores mundiais recomendam aprender Morse pelo som, assimilando o ritmo musical global de cada letra em vez de tentar contar pontos visualmente com os olhos.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>6. Copie ou Exporte o Resultado</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Copie o texto traduzido ou a cadeia de pontos e traços para a área de transferência com um único toque, ou faça o download do áudio sintetizado em formato WAV de alta qualidade para ouvir onde quiser.
          </p>

          <figure className="article-figure" style={{ margin: '2rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/morse-code-translator-interface.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-interface.png?v=2"
                alt="Interface do Tradutor de Código Morse convertendo texto em código Morse em tempo real com reprodução de áudio e cópia"
                width="1080"
                height="720"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 1:</strong> Interface interativa do Tradutor de Código Morse convertendo texto em tempo real conforme a norma ITU-R, com síntese de áudio, exportação WAV e ferramentas de cópia.
            </figcaption>
          </figure>
        </section>

        {/* SEÇÃO 3: Tradutor vs. Decodificador vs. Gerador */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Tradutor de Código Morse vs. Decodificador vs. Gerador
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Embora esses termos sejam frequentemente usados como sinônimos na internet, cada um cumpre uma função técnica distinta no universo das telecomunicações:
          </p>

          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>Ferramenta</th>
                  <th style={{ padding: '1rem' }}>Finalidade Principal</th>
                  <th style={{ padding: '1rem' }}>Formato de Entrada</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tradutor de Código Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Conversão bidirecional simultânea entre texto e Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Texto legível ou pontos e traços digitados</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Decodificador de Código Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Interpretação e leitura de sinais brutos em texto claro</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Sequências de pontos, áudio gravado ou fotografias</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gerador de Código Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Síntese de impulsos telegráficos a partir de mensagens</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Texto alfanumérico para áudio, luz ou impressão</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Decodificador de Áudio Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Extração e análise de tons telegráficos a partir de som</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Arquivos sonoros (WAV/MP3) ou microfone em tempo real</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Decodificador de Imagem Morse</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Visão computacional para identificar traços em imagens</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Fotos, capturas de tela e documentos digitalizados</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Um tradutor de texto trabalha com entradas tipográficas bem delimitadas. Já um decodificador de áudio ou de imagem precisa processar condições ambientais complexas, como ruído de fundo, ecos e variações de iluminação. Para uma ferramenta dedicada a decifrar sequências complexas, visite a nossa página especializada do <a href="/pt/decodificador-codigo-morse/" onClick={(e) => handleNav(e, 'pt-morsedecoder', '/pt/decodificador-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Decodificador de Código Morse</a>.
          </p>
        </section>

        {/* SEÇÃO 4: Como Funciona a Codificação em Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Como Funciona a Codificação em Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            O Código Morse associa cada caractere alfanumérico a uma combinação estruturada de sinais curtos e longos:
          </p>
          <ul className="code-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li><strong>Ponto (dit):</strong> O sinal mais breve, representando 1 unidade básica de tempo;</li>
            <li><strong>Traço (dah):</strong> O sinal prolongado, com duração correspondente a exatamente 3 unidades de tempo;</li>
            <li><strong>Letras mais comuns:</strong> Samuel Morse e Alfred Vail atribuíram sequências mais curtas às letras de maior frequência na língua inglesa e nas línguas ocidentais:
              <ul style={{ marginTop: '0.5rem' }}>
                <li><strong>E = .</strong> (apenas 1 ponto rápido)</li>
                <li><strong>T = -</strong> (apenas 1 traço)</li>
                <li><strong>A = .-</strong> (um ponto e um traço)</li>
                <li><strong>N = -.</strong> (um traço e um ponto)</li>
                <li><strong>S = ...</strong> (três pontos)</li>
                <li><strong>O = ---</strong> (três traços)</li>
              </ul>
            </li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            A ordem sequencial exata e os intervalos de silêncio entre os elementos são tão cruciais quanto os próprios sinais. Sem o espaçamento adequado, uma cadeia contínua de pontos e traços torna-se indecifrável.
          </p>
        </section>

        {/* SEÇÃO 5: Como Ler e Escrever Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Como Ler e Escrever Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Ler código Morse significa transformar padrões rítmicos de sinais em letras com significado. Escrever código Morse significa decompor pensamentos em sequências normatizadas de dits e dahs. Para orientações didáticas passo a passo, explore nosso guia de <a href="/how-to-read-morse-code/" onClick={(e) => handleNav(e, 'howtoread', '/how-to-read-morse-code/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>como ler código Morse (guia em inglês)</a>.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>O Processo de Decodificação: Lendo uma Mensagem</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            O primeiro passo na leitura manual consiste em separar cada agrupamento de pontos delimitado por um espaço simples:
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Por exemplo, dada a sequência: <code className="morse-font" style={{ fontSize: '1.15rem', color: 'var(--accent-warning)' }}>--- .-.. .-</code>
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li>Primeiro bloco: <code className="morse-font">---</code> corresponde à letra <strong>O</strong>;</li>
            <li>Segundo bloco: <code className="morse-font">.-..</code> corresponde à letra <strong>L</strong>;</li>
            <li>Terceiro bloco: <code className="morse-font">.-</code> corresponde à letra <strong>A</strong>.</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            O resultado final da mensagem decodificada é: <strong>OLA</strong>.
          </p>

          <figure className="article-figure" style={{ margin: '2rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/morse-code-translator-character-breakdown.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-translator-character-breakdown.png?v=2"
                alt="Detalhamento caractere por caractere mostrando mapeamento de letras, sequências de pontos e traços, fonética e áudio"
                width="1080"
                height="620"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 2:</strong> Decomposição interativa letra por letra mapeando dits e dahs fonéticos, tempos de resposta e reprodução de áudio isolada.
            </figcaption>
          </figure>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>O Processo de Codificação: Escrevendo Mensagens</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Para redigir uma mensagem, cada letra é convertida no seu código internacional e separada por um espaço. Por exemplo, a palavra <strong>SOL</strong> transforma-se em <code className="morse-font">... --- .-..</code>. Um tradutor online acelera esse trabalho e previne lapsos manuais na transcrição.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Domine o Ritmo: O Pulso Vital do Código Morse</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            O código Morse não é simplesmente uma sequência estática de símbolos gráficos. A verdadeira essência do sistema reside no ritmo das pausas e dos sons. Quando transmitido audivelmente, a alternância entre sinais e silêncios cria uma cadência melódica inconfundível, permitindo que operadores experientes reconheçam palavras inteiras instantaneamente pelo som.
          </p>
        </section>

        {/* SEÇÃO 6: Temporização Oficial no Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Temporização Oficial no Código Morse (Regra 1-3-1-3-7)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            A temporização matemática é a espinha dorsal de toda a telegrafia mundial. De acordo com a Recomendação ITU-R M.1677-1 da União Internacional de Telecomunicações, as proporções temporais são estritamente definidas:
          </p>

          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem' }}>Elemento Telegráfico</th>
                  <th style={{ padding: '1rem' }}>Duração Relativa</th>
                  <th style={{ padding: '1rem' }}>Papel na Comunicação</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Ponto (dit)</td>
                  <td style={{ padding: '0.9rem 1rem', color: 'var(--accent-primary)', fontWeight: 700 }}>1 unidade</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Unidade fundamental que calibra toda a velocidade da transmissão</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Traço (dah)</td>
                  <td style={{ padding: '0.9rem 1rem', color: 'var(--accent-warning)', fontWeight: 700 }}>3 unidades</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Equivale exatamente à duração de 3 pontos consecutivos</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pausa intra-caractere</td>
                  <td style={{ padding: '0.9rem 1rem' }}>1 unidade</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Silêncio entre os pontos e traços de uma mesma letra</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pausa entre letras</td>
                  <td style={{ padding: '0.9rem 1rem' }}>3 unidades</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Silêncio que separa letras distintas dentro de uma mesma palavra</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pausa entre palavras</td>
                  <td style={{ padding: '0.9rem 1rem' }}>7 unidades</td>
                  <td style={{ padding: '0.9rem 1rem' }}>Silêncio completo entre palavras sucessivas (representado por /)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <figure className="article-figure" style={{ margin: '2rem 0', textAlign: 'center' }}>
            <picture>
              <source srcSet="/images/morse-code-transmission-settings-timing.webp?v=2" type="image/webp" />
              <img
                src="/images/morse-code-transmission-settings-timing.png?v=2"
                alt="Painel de configurações de temporização e transmissão em código Morse exibindo WPM, Farnsworth e frequência"
                width="1080"
                height="760"
                loading="lazy"
                decoding="async"
                style={{ width: '100%', maxWidth: '850px', height: 'auto', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}
              />
            </picture>
            <figcaption className="article-figcaption" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              <strong>Figura 3:</strong> Painel de controle de transmissão com calibração de velocidade em WPM conforme a palavra padrão PARIS, espaçamento pedagógico Farnsworth e ajuste de frequência tonal em Hz.
            </figcaption>
          </figure>
        </section>

        {/* SEÇÃO 7: Tabela Completa do Alfabeto em Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Tabela Completa do Alfabeto em Código Morse (Norma ITU-R M.1677-1)
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            A União Internacional de Telecomunicações padroniza o alfabeto internacional. Para visualizar a tabela interativa dedicada com filtros e áudio individual de cada caractere, confira a nossa página do <a href="/pt/alfabeto-morse/" onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Alfabeto Morse</a>.
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Letras de A a Z</h3>
          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Letra</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Fonética Telegráfica</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>A</td><td><code className="morse-font">.-</code></td><td>di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>B</td><td><code className="morse-font">-...</code></td><td>dah-di-di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>C</td><td><code className="morse-font">-.-.</code></td><td>dah-di-dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>D</td><td><code className="morse-font">-..</code></td><td>dah-di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>E</td><td><code className="morse-font">.</code></td><td>dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>F</td><td><code className="morse-font">..-.</code></td><td>di-di-dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>G</td><td><code className="morse-font">--.</code></td><td>dah-dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>H</td><td><code className="morse-font">....</code></td><td>di-di-di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>I</td><td><code className="morse-font">..</code></td><td>di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>J</td><td><code className="morse-font">.---</code></td><td>di-dah-dah-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>K</td><td><code className="morse-font">-.-</code></td><td>dah-di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>L</td><td><code className="morse-font">.-..</code></td><td>di-dah-di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>M</td><td><code className="morse-font">--</code></td><td>dah-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>N</td><td><code className="morse-font">-.</code></td><td>dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>O</td><td><code className="morse-font">---</code></td><td>dah-dah-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>P</td><td><code className="morse-font">.--.</code></td><td>di-dah-dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Q</td><td><code className="morse-font">--.-</code></td><td>dah-dah-di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>R</td><td><code className="morse-font">.-.</code></td><td>di-dah-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>S</td><td><code className="morse-font">...</code></td><td>di-di-dit</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>T</td><td><code className="morse-font">-</code></td><td>dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>U</td><td><code className="morse-font">..-</code></td><td>di-di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>V</td><td><code className="morse-font">...-</code></td><td>di-di-di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>W</td><td><code className="morse-font">.--</code></td><td>di-dah-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>X</td><td><code className="morse-font">-..-</code></td><td>dah-di-di-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Y</td><td><code className="morse-font">-.--</code></td><td>dah-di-dah-dah</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Z</td><td><code className="morse-font">--..</code></td><td>dah-dah-di-dit</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Números de 0 a 9</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Cada número é composto por exatamente 5 elementos. Veja a nossa análise dedicada aos <a href="/pt/numeros-em-codigo-morse/" onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Números em Código Morse</a> para conhecer as formas abreviadas (cut numbers).
          </p>
          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Número</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Estrutura de 5 Elementos</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>0</td><td><code className="morse-font">-----</code></td><td>5 traços consecutivos</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>1</td><td><code className="morse-font">.----</code></td><td>1 ponto inicial e 4 traços</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>2</td><td><code className="morse-font">..---</code></td><td>2 pontos iniciais e 3 traços</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>3</td><td><code className="morse-font">...--</code></td><td>3 pontos iniciais e 2 traços</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>4</td><td><code className="morse-font">....-</code></td><td>4 pontos iniciais e 1 traço</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>5</td><td><code className="morse-font">.....</code></td><td>5 pontos consecutivos</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>6</td><td><code className="morse-font">-....</code></td><td>1 traço inicial e 4 pontos</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>7</td><td><code className="morse-font">--...</code></td><td>2 traços iniciais e 3 pontos</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>8</td><td><code className="morse-font">---..</code></td><td>3 traços iniciais e 2 pontos</td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>9</td><td><code className="morse-font">----.</code></td><td>4 traços iniciais e 1 ponto</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEÇÃO 8: Pontuação e Símbolos em Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Pontuação e Símbolos em Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            O Código Morse Internacional também suporta os principais sinais de pontuação normatizados. Para consultar mais de 25 caracteres especiais, visite a página de <a href="/morse-code-symbols/" onClick={(e) => handleNav(e, 'symbols', '/morse-code-symbols/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline', fontWeight: 600 }}>Símbolos em Código Morse (guia em inglês)</a>.
          </p>

          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Caractere</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Símbolo</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Código Morse Oficial</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Ponto final</td><td><code className="inline-code">.</code></td><td><code className="morse-font">.-.-.-</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Vírgula</td><td><code className="inline-code">,</code></td><td><code className="morse-font">--..--</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Ponto de interrogação</td><td><code className="inline-code">?</code></td><td><code className="morse-font">..--..</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Barra diagonal</td><td><code className="inline-code">/</code></td><td><code className="morse-font">-..-.</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Sinal de igual</td><td><code className="inline-code">=</code></td><td><code className="morse-font">-...-</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Sinal de adição</td><td><code className="inline-code">+</code></td><td><code className="morse-font">.-.-.</code></td></tr>
                <tr><td style={{ padding: '0.5rem 1rem', fontWeight: 700 }}>Arroba</td><td><code className="inline-code">@</code></td><td><code className="morse-font">.--.-.</code></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEÇÃO 9: Prosigns e Sinais Especiais */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Prosigns e Sinais Procedimentais em Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Na comunicação telegráfica prática de radioamadores (CW), certos sinais são concatenados sem intervalo interno entre as letras para indicar comandos operacionais, conhecidos como <em>prosigns</em> (sinais de procedimento):
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li><strong>SOS (<code className="morse-font">... --- ...</code>):</strong> Sinal mundial de perigo iminente e socorro marítimo;</li>
            <li><strong>AR (<code className="morse-font">.-.-.</code>):</strong> Fim de transmissão ou mensagem;</li>
            <li><strong>SK (<code className="morse-font">...-.-</code>):</strong> Fim definitivo de contato ('silent key');</li>
            <li><strong>BT (<code className="morse-font">-...-</code>):</strong> Separador de parágrafos ou pausa de raciocínio.</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Esses sinais especiais não devem ser lidos como letras separadas, mas como símbolos unificados com significado operacional específico no radioamadorismo.
          </p>
        </section>

        {/* SEÇÃO 10: Código Morse Internacional vs. Americano */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Código Morse Internacional vs. Código Morse Americano
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Muitas pessoas desconhecem que existem dois sistemas históricos distintos com o nome de Morse:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li><strong>Código Morse Americano (Original):</strong> Desenvolvido na década de 1840 para linhas telegráficas terrestres por fio. Utilizava traços de comprimentos diferentes e pausas internas dentro de uma mesma letra (como na letra C e na letra R).</li>
            <li><strong>Código Morse Internacional (Moderno):</strong> Desenvolvido por Friedrich Clemens Gerke em 1848 e posteriormente ratificado pela União Internacional de Telecomunicações (UIT). Eliminou as pausas internas irregulares e padronizou as relações temporais exatas que usamos até hoje.</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Nosso tradutor segue estritamente a norma contemporânea do <strong>Código Morse Internacional (ITU-R M.1677-1)</strong>, que é o padrão oficial aceito no mundo inteiro.
          </p>
        </section>

        {/* SEÇÃO 11: Sons do Código Morse e Cadência */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Sons do Código Morse: A Cadência e a Musicalidade da Comunicação
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Quando você observa o código Morse em um papel, você enxerga desenhos de pontos e riscos. No entanto, quando você o escuta pelos fones de ouvido, você percebe uma <strong>melodia rítmica contínua</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Assimilar essa musicalidade é a chave para o sucesso. Em vez de pensar conscientemente em "ponto, traço" para a letra <strong>A</strong>, o cérebro do operador aprende a reagir diretamente ao som musical <code className="morse-font">di-dah</code>, conectando-o de forma reflexa e instantânea à letra correspondente sem qualquer cálculo intermediário.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Recomenda-se começar ouvindo palavras curtas e familiares, como <strong>OI</strong>, <strong>SIM</strong> e <strong>SOS</strong>, ajustando a frequência tonal para um valor agradável aos seus ouvidos (geralmente entre 550 Hz e 650 Hz).
          </p>
        </section>

        {/* SEÇÃO 12: Como Obter o Máximo Proveito do Tradutor */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Como Obter o Máximo Proveito do Tradutor
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Nossa plataforma reúne controles avançados inspirados em transceptores de radioamadorismo para enriquecer seu treino:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li><strong>Velocidade WPM (Words Per Minute):</strong> Ajuste a velocidade de transmissão de 5 WPM (iniciante) até mais de 35 WPM (nível de alta velocidade), calculada pelo padrão PARIS;</li>
            <li><strong>Espaçamento Farnsworth:</strong> Permite que os caracteres soem numa velocidade rápida enquanto amplia os intervalos entre as letras, dando tempo para o cérebro processar a informação sem criar o vício de contar pontos lentos;</li>
            <li><strong>Frequência do Tom em Hertz:</strong> Modifique o tom sonoro para encontrar a altura mais relaxante para a sua audição;</li>
            <li><strong>Destaque Visual Durante a Reprodução:</strong> O tradutor ilumina a letra em sincronia exata com a emissão do tom acústico, fortalecendo a conexão sensorial entre som e texto;</li>
            <li><strong>Download WAV:</strong> Salve o áudio para praticar suas habilidades auditivas no carro, no celular ou em tocadores de música.</li>
          </ul>
        </section>

        {/* SEÇÃO 13: Precisão e Desafios de Decodificação */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Qual É o Grau de Precisão de um Tradutor de Código Morse?
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            A tradução de texto digital para código Morse é <strong>100% exata e determinística</strong>: cada letra do padrão oficial possui uma representação matemática invariável.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Por outro lado, o grande desafio técnico surge quando a entrada provém de fontes analógicas externas:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Em arquivos de áudio, ruído estático, chiados de radiofrequência ou velocidade humana irregular podem mascarar os pontos;</li>
            <li>Em imagens e capturas de tela, baixo contraste, fontes decorativas ou borrões exigem análise visual cuidadosa;</li>
            <li>Em textos com pontuações especiais ou emojis, caracteres não mapeados na norma ITU são sinalizados para manter a fidelidade da mensagem.</li>
          </ul>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Uma ferramenta de referência honesta deixa claros esses limites operacionais e fornece feedback imediato sobre qualquer caractere não suportado.
          </p>
        </section>

        {/* SEÇÃO 14: Por Que Sua Tradução Pode Parecer Errada */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Por Que Sua Tradução em Morse Pode Parecer Errada?
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Se uma decodificação retornar caracteres inesperados, antes de presumir uma falha do tradutor, verifique os seguintes fatores determinantes:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li><strong>Espaçamento Incorreto:</strong> A falta de espaço entre letras agrupa sinais distintos numa única letra inválida (por exemplo, <code className="morse-font">.... ..</code> significa <strong>HI</strong>, mas sem espaço transforma-se em seis pontos que não existem no alfabeto latino);</li>
            <li><strong>Ponto ou Traço Trocado:</strong> Um único ponto a mais transforma um <strong>E</strong> (<code className="morse-font">.</code>) em <strong>I</strong> (<code className="morse-font">..</code>) ou <strong>S</strong> (<code className="morse-font">...</code>);</li>
            <li><strong>Caracteres Unicode Semelhantes (Look-Alikes):</strong> Textos copiados da web podem conter pontos tipográficos ornamentais, travessões ou hifens não padronizados que nosso motor normaliza automaticamente;</li>
            <li><strong>Norma Divergente:</strong> Documentos históricos do século XIX podem ter sido gerados no antigo código Morse americano e não no Código Internacional moderno.</li>
          </ul>
        </section>

        {/* SEÇÃO 15: Como Verificar uma Mensagem em Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Como Verificar uma Mensagem em Código Morse Antes de Usar
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Antes de gravar código Morse em joias, alianças, placas comemorativas, tatuagens definitivas ou publicar um enigma, aplique o <strong>método de verificação reversa em 4 passos</strong>:
          </p>

          <div className="step-process" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="process-step" style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="step-num" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passo 1</span>
              <div><strong>Digite o Texto:</strong> Comece com o texto original em português (ex: OLA).</div>
            </div>
            <div className="process-step" style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="step-num" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passo 2</span>
              <div><strong>Codifique para Morse:</strong> Obtenha a sequência de pontos e traços (<code className="morse-font">--- .-.. .-</code>).</div>
            </div>
            <div className="process-step" style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="step-num" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passo 3</span>
              <div><strong>Decodifique Novamente:</strong> Cole a sequência no modo reverso (Morse → Texto).</div>
            </div>
            <div className="process-step" style={{ background: 'var(--surface-card)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span className="step-num" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Passo 4</span>
              <div><strong>Compare os Resultados:</strong> Se o texto decodificado coincidir com o original, a mensagem está 100% perfeita.</div>
            </div>
          </div>
        </section>

        {/* SEÇÃO 16: Decodificação em Texto, Áudio e Imagem */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Decodificação de Código Morse em Texto, Áudio e Imagem
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Diferentes origens de dados exigem abordagens tecnológicas especializadas:
          </p>

          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Formato do Dado</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Melhor Ferramenta Recomendada</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Comportamento Esperado</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Texto convencional</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Tradutor (Texto → Morse)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Conversão instantânea e precisa</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Pontos e traços digitados</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Decodificador de Texto (Morse → Texto)</td>
                  <td style={{ padding: '0.75rem 1rem' }}>Decodificação imediata letra a letra</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Gravação de áudio telegráfico</td>
                  <td style={{ padding: '0.75rem 1rem' }}><a href="/morse-code-audio-translator/" onClick={(e) => handleNav(e, 'audiotranslator', '/morse-code-audio-translator/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Tradutor de Áudio Morse (Inglês)</a></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Análise espectral e detecção de frequência</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Fotos ou capturas de tela</td>
                  <td style={{ padding: '0.75rem 1rem' }}><a href="/morse-code-image-decoder/" onClick={(e) => handleNav(e, 'imagedecoder', '/morse-code-image-decoder/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Decodificador de Imagem (Inglês)</a></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Binarização de pixels e leitura de padrões</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEÇÃO 17: Aprenda Código Morse com Áudio */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Aprenda Código Morse com Áudio: O Método Eficaz
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Uma tabela impressa do alfabeto telegráfico é uma excelente ferramenta de consulta rápida. No entanto, <strong>consultar não é o mesmo que aprender</strong>.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            O método mais rápido e prazeroso para dominar o código Morse consiste em educar a percepção auditiva. Em vez de ler visualmente "ponto, ponto, ponto" para a letra <strong>S</strong>, seu cérebro deve assimilar o padrão sonoro rítmico <code className="morse-font">di-di-dit</code> como uma única entidade acústica indivisível.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Utilize nosso gerador de áudio interativo para treinar com os olhos fechados, associando o tom à letra e conferindo a resposta apenas após tentar identificá-la.
          </p>
        </section>

        {/* SEÇÃO 18: Aprenda Código Morse Passo a Passo */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Aprenda Código Morse Passo a Passo
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            Você não precisa tentar memorizar todas as letras no mesmo dia. Siga este roteiro pedagógico comprovado:
          </p>
          <ol className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>
            <li><strong>Comece com as Letras Elementares E e T:</strong> O <strong>E</strong> é um único ponto (<code className="morse-font">.</code>) e o <strong>T</strong> é um único traço (<code className="morse-font">-</code>). Eles formam os dois blocos fundamentais da telegrafia;</li>
            <li><strong>Introduza Palavras Curtas e Frequentes:</strong> Pratique palavras familiares como <strong>OI</strong> (<code className="morse-font">--- ..</code>), <strong>SIM</strong> (<code className="morse-font">... .. --</code>), <strong>NAO</strong> (<code className="morse-font">-. .- ---</code>) e <strong>SOS</strong> (<code className="morse-font">... --- ...</code>);</li>
            <li><strong>Pratique Diariamente em Sessões Breves:</strong> 10 a 15 minutos diários de treino auditivo constante superam de longe uma maratona exaustiva de duas horas no final de semana;</li>
            <li><strong>Utilize Espaçamento Farnsworth:</strong> Mantenha a velocidade das letras em 18 ou 20 WPM e aumente o espaço entre as palavras para treinar seu cérebro a reconhecer sons rápidos sem desespero;</li>
            <li><strong>Teste-se Regularmente:</strong> Digite uma frase no tradutor, ouça o áudio sem olhar para o monitor, anote o que entendeu e compare os resultados.</li>
          </ol>
        </section>

        {/* SEÇÃO 19: Quando Utilizar Este Tradutor de Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Quando Utilizar Este Tradutor de Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
            O código Morse possui aplicações práticas, culturais e educacionais fascinantes em diversos cenários modernos:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li><strong>Comunicações de Emergência:</strong> O sinal <code className="morse-font">... --- ...</code> é o código de socorro mais reconhecido da história humana. Conhecer o básico permite sinalizar pedidos de ajuda com apitos, lanternas ou batidas em superfícies sólidas;</li>
            <li><strong>Radioamadorismo e Prática de CW:</strong> Milhares de operadores em todo o Brasil (sob orientação da LABRE) e em Portugal (REP) mantêm contatos diários de longa distância em código Morse;</li>
            <li><strong>Educação e Projetos STEM:</strong> Professores e estudantes utilizam o código Morse para demonstrar como computadores codificam informações em sistemas binários simples (0 e 1, ligar e desligar);</li>
            <li><strong>Joalheria, Artesanato e Tatuagens:</strong> Mensagens afetivas secretas, nomes de pessoas queridas ou datas especiais gravadas em código Morse em pulseiras, anéis e tatuagens com estética minimalista;</li>
            <li><strong>Salas de Escape Room e Jogos de Enigma:</strong> Pistas em código Morse são muito comuns em aventuras de raciocínio, jogos investigativos e gincanas intelectuais;</li>
            <li><strong>Acessibilidade e Tecnologia Assistiva:</strong> Pessoas com mobilidade severamente reduzida utilizam sensores de toque ou piscar de olhos calibrados em código Morse para operar computadores e se comunicar com o mundo.</li>
          </ul>
        </section>

        {/* SEÇÃO 20: Aplicações Modernas do Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Aplicações Modernas do Código Morse
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Embora o telégrafo comercial tenha sido substituído por fibras ópticas e satélites digitais, o código Morse continua insubstituível em nichos vitais:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
            <li><strong>Propagação em Condições Adversas:</strong> Por concentrar toda a energia de radiofrequência numa faixa de banda extremamente estreita (menos de 100 Hz), os sinais em Morse conseguem atravessar tempestades solares e ruídos atmosféricos que tornam a voz humana completamente inaudível;</li>
            <li><strong>Balizas de Navegação Aeronáutica:</strong> Equipamentos VOR, NDB e ILS transmitem seus prefixos de identificação em código Morse contínuo para que pilotos confirmem a estação de radionavegação correta;</li>
            <li><strong>Simplicidade Tecnológica Máxima:</strong> Um transmissor telegráfico pode ser montado com um punhado de componentes eletrônicos simples e alimentado por baterias de baixa potência, funcionando onde a internet falha.</li>
          </ul>
        </section>

        {/* SEÇÃO 21: Traduções Mais Comuns em Código Morse */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Frases e Mensagens Frequentes em Código Morse
          </h2>
          <div className="table-responsive" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table className="seo-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px', background: 'var(--surface-card)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Expressão</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Código Morse</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contexto de Uso</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--accent-primary)' }}>SOS</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">... --- ...</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Sinal universal de socorro e emergência marítima</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>OI</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">--- ..</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Saudação informal amigável em português</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>OLA MUNDO</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">--- .-.. .- / -- ..- -. -.. ---</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>O clássico teste de comunicação e programação</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>AJUDA</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">.- .--- ..- -.. .-</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Pedido direto de assistência</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>OBRIGADO</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">--- -... .-. .. --. .- -.. ---</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>Manifestação de cortesia e agradecimento</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>EU TE AMO</td>
                  <td style={{ padding: '0.75rem 1rem' }}><code className="morse-font">. ..- / - . / .- -- ---</code></td>
                  <td style={{ padding: '0.75rem 1rem' }}>A declaração romântica mais escolhida para gravações em alianças</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SEÇÃO 22: O Que Este Tradutor de Código Morse Abrange */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            O Que Este Tradutor de Código Morse Abrange
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Nossa plataforma reúne uma suíte técnica completa para entusiastas, estudantes e operadores:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
            <li>Tradução bidirecional instantânea entre texto em português e Código Morse Internacional;</li>
            <li>Conformidade com a norma oficial ITU-R M.1677-1 da União Internacional de Telecomunicações;</li>
            <li>Normalização automática de caracteres diacríticos do português para correspondências telegráficas limpas;</li>
            <li>Sintetizador Web Audio com oscilador puro, sem ruídos e com controle de frequência em hertz;</li>
            <li>Ajuste de velocidade em WPM baseado no padrão internacional PARIS;</li>
            <li>Modo de espaçamento pedagógico Farnsworth para treinamento auditivo acelerado;</li>
            <li>Exportação direta do áudio decodificado em arquivo WAV para uso offline;</li>
            <li>Processamento 100% no cliente, garantindo privacidade absoluta dos seus dados.</li>
          </ul>
        </section>

        {/* SEÇÃO 23: Quais Limitações Técnicas Você Deve Ter em Mente */}
        <section className="content-section">
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Quais Limitações Técnicas Você Deve Ter em Mente
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Uma ferramenta de referência honesta e profissional declara com total transparência os seus limites operacionais:
          </p>
          <ul className="content-list" style={{ color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '1.5rem', margin: 0 }}>
            <li>O tradutor de texto requer que as letras estejam devidamente delimitadas por espaços;</li>
            <li>Gravações de áudio com ruído ambiente severo exigem filtragem para que os picos telegráficos possam ser identificados;</li>
            <li>O reconhecimento em imagens depende da nitidez, da resolução e do contraste entre os pontos e o fundo da foto;</li>
            <li>Textos antigos podem ter sido transmitidos no antigo código Morse americano terrestre, que difere das convenções da norma internacional moderna.</li>
          </ul>
        </section>

        {/* SEÇÃO 24: Pronto para Traduzir Sua Mensagem? */}
        <section className="content-section cta-banner" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '2.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Pronto para Traduzir Sua Mensagem em Código Morse?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
            Digite seu texto ou cole sua sequência telegráfica na ferramenta interativa no topo da página. Experimente a opção <strong>Texto → Morse</strong> para codificar, ou <strong>Morse → Texto</strong> para decifrar. Ouça o áudio com oscilador puro, calibre a velocidade e copie o resultado com um único toque.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '750px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Para aprofundar seus conhecimentos, confira também nossas páginas especializadas: o <a href="/pt/alfabeto-morse/" onClick={(e) => handleNav(e, 'pt-alphabet', '/pt/alfabeto-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Alfabeto Morse Completo</a>, os <a href="/pt/numeros-em-codigo-morse/" onClick={(e) => handleNav(e, 'pt-numbers', '/pt/numeros-em-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Números em Código Morse</a>, o <a href="/pt/decodificador-codigo-morse/" onClick={(e) => handleNav(e, 'pt-morsedecoder', '/pt/decodificador-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Decodificador de Código Morse</a>, a ferramenta de <a href="/pt/codigo-morse-para-texto/" onClick={(e) => handleNav(e, 'pt-morse2english', '/pt/codigo-morse-para-texto/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Código Morse para Texto</a> e o conversor de <a href="/pt/texto-para-codigo-morse/" onClick={(e) => handleNav(e, 'pt-english2morse', '/pt/texto-para-codigo-morse/')} style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Texto para Código Morse</a>.
          </p>
          <div className="motto-box" style={{ display: 'inline-block', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '0.75rem 1.5rem', borderRadius: '2rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '1.05rem' }}>
            Traduza. Ouça. Compreenda. Domine.
          </div>
        </section>

        {/* SEÇÃO 25: Nosso Compromisso com o Rigor Telegráfico (E-E-A-T) */}
        <section className="content-section eeat-box" style={{ background: 'var(--surface-card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
          <div className="eeat-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldCheck size={26} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Nosso Compromisso com o Rigor e a Exatidão Telegráfica
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Ao projetar e verificar nossa plataforma, nosso compromisso foi muito além de apenas desenhar pontos e traços na tela. Nossa meta prioritária é oferecer um sistema rigoroso que respeite matematicamente as diretrizes internacionais de temporização da telegrafia, as regras da palavra padrão PARIS, a modulação limpa de áudio e a compatibilidade ortográfica da língua portuguesa.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Por este motivo, nossa arquitetura toma como base canônica as normas da União Internacional de Telecomunicações (<a href="https://www.itu.int/rec/R-REC-M.1677" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Recomendação ITU-R M.1677-1 <ExternalLink size={12} style={{ display: 'inline' }} /></a>), complementadas pelas melhores práticas de transmissão da <a href="https://www.arrl.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>American Radio Relay League (ARRL) <ExternalLink size={12} style={{ display: 'inline' }} /></a>, da Liga de Amadores Brasileiros de Rádio Emissão (LABRE) e da Rede dos Emissores Portugueses (REP).
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Recomendamos sempre efetuar a verificação cruzada de mensagens antes de utilizá-las em mídias permanentes ou gravações definitivas. Para o aprendizado, una a escuta auditiva atenta à leitura visual: essa sinergia sensorial é o caminho mais sólido e recompensador para dominar a telegrafia no mundo contemporâneo.
          </p>
        </section>

        {/* SEÇÃO 26: Perguntas Frequentes (FAQ Accordion com 16 Perguntas Completas) */}
        <section className="content-section faq-accordion-section" id="faq" style={{ marginBottom: '2rem' }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <HelpCircle size={26} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Perguntas Frequentes Sobre Código Morse
            </h2>
          </div>
          <p className="section-desc" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Respostas detalhadas às dúvidas mais comuns sobre traduzir, ler, escrever, escutar e aprender o Código Morse Internacional.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FAQS_PT.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.75rem',
                  background: 'var(--surface-card)',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.15rem 1.25rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'inherit' }}>{faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </button>

                {openFaqIndex === idx && (
                  <div style={{ padding: '0 1.25rem 1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </article>
  );
}

export default PortugueseArticleContent;
