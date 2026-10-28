import {
  Languages, Type, FileText, Activity, Image,
  GraduationCap, BookOpen, Hash, Radio, Bookmark, Volume2
} from 'lucide-react';

export const ROUTE_PAIRS = [
  { en: '/', tr: '/tr/', es: '/es/', pt: '/pt/', enTab: 'translator', trTab: 'turkish', esTab: 'spanish', ptTab: 'portuguese' },
  { en: '/morse-code-alphabet/', tr: '/tr/morse-code-alphabet/', es: '/es/morse-code-alphabet/', pt: '/pt/alfabeto-morse/', enTab: 'alphabet', trTab: 'tr-alphabet', esTab: 'es-alphabet', ptTab: 'pt-alphabet' },
  { en: '/morse-code-numbers/', tr: '/tr/morse-code-numbers/', es: '/es/morse-code-numbers/', pt: '/pt/numeros-em-codigo-morse/', enTab: 'numbers', trTab: 'tr-numbers', esTab: 'es-numbers', ptTab: 'pt-numbers' },
  { en: '/morse-code-to-english/', tr: '/tr/morse-code-to-english/', es: '/es/morse-code-to-english/', pt: '/pt/codigo-morse-para-texto/', enTab: 'morse2english', trTab: 'tr-morse2english', esTab: 'es-morse2english', ptTab: 'pt-morse2english' },
  { en: '/english-to-morse-code/', tr: '/tr/english-to-morse-code/', es: '/es/english-to-morse-code/', pt: '/pt/texto-para-codigo-morse/', enTab: 'english2morse', trTab: 'tr-english2morse', esTab: 'es-english2morse', ptTab: 'pt-english2morse' },
  { en: '/morse-code-decoder/', tr: '/tr/morse-code-decoder/', es: '/es/morse-code-decoder/', pt: '/pt/decodificador-codigo-morse/', enTab: 'morsedecoder', trTab: 'tr-morsedecoder', esTab: 'es-morsedecoder', ptTab: 'pt-morsedecoder' },
  { en: '/morse-code-audio-translator/', tr: '/tr/morse-code-audio-translator/', es: '/es/morse-code-audio-translator/', enTab: 'audiotranslator', trTab: 'tr-audiotranslator', esTab: 'es-audiotranslator' },
  { en: '/learn-morse-code/', tr: '/tr/learn-morse-code/', es: '/es/learn-morse-code/', enTab: 'learn', trTab: 'tr-learn', esTab: 'es-learn' },
  { en: '/how-to-read-morse-code/', tr: '/tr/how-to-read-morse-code/', es: '/es/how-to-read-morse-code/', enTab: 'howtoread', trTab: 'tr-howtoread', esTab: 'es-howtoread' },
  { en: '/morse-code-symbols/', tr: '/tr/morse-code-symbols/', es: '/es/morse-code-symbols/', enTab: 'symbols', trTab: 'tr-symbols', esTab: 'es-symbols' },
  { en: '/morse-code-phrases/', tr: '/tr/morse-code-phrases/', es: '/es/morse-code-phrases/', enTab: 'phrases', trTab: 'tr-phrases', esTab: 'es-phrases' },
  { en: '/sos-in-morse-code/', tr: '/tr/sos-in-morse-code/', es: '/es/sos-in-morse-code/', enTab: 'sos', trTab: 'tr-sos', esTab: 'es-sos' },
  { en: '/i-love-you-in-morse-code/', tr: '/tr/i-love-you-in-morse-code/', es: '/es/i-love-you-in-morse-code/', enTab: 'iloveyou', trTab: 'tr-iloveyou', esTab: 'es-iloveyou' },
  { en: '/what-is-morse-code/', tr: '/tr/what-is-morse-code/', es: '/es/what-is-morse-code/', enTab: 'whatismorse', trTab: 'tr-whatismorse', esTab: 'es-whatismorse' },
  { en: '/history-of-morse-code/', tr: '/tr/history-of-morse-code/', es: '/es/history-of-morse-code/', enTab: 'history', trTab: 'tr-history', esTab: 'es-history' },
  { en: '/morse-code-amateur-radio/', tr: '/tr/morse-code-amateur-radio/', es: '/es/morse-code-amateur-radio/', enTab: 'amateurradio', trTab: 'tr-amateurradio', esTab: 'es-amateurradio' },
  { en: '/morse-code-keyer/', tr: '/tr/morse-code-keyer/', es: '/es/morse-code-keyer/', enTab: 'keyer', trTab: 'tr-keyer', esTab: 'es-keyer' },
  { en: '/morse-code-image-decoder/', tr: '/tr/morse-code-image-decoder/', es: '/es/morse-code-image-decoder/', enTab: 'imagedecoder', trTab: 'tr-imagedecoder', esTab: 'es-imagedecoder' },
  { en: '/morse-code-practice/', tr: '/tr/morse-code-practice/', es: '/es/morse-code-practice/', enTab: 'practice', trTab: 'tr-practice', esTab: 'es-practice' },
  { en: '/privacy-policy/', tr: '/tr/privacy-policy/', es: '/es/privacy-policy/', enTab: 'privacy', trTab: 'tr-privacy', esTab: 'es-privacy' }
];

export function isTurkishRoute(tabOrPath) {
  if (!tabOrPath) return false;
  if (typeof tabOrPath === 'string') {
    return tabOrPath === '/tr/' || tabOrPath.startsWith('/tr/') || tabOrPath.startsWith('tr-') || tabOrPath === 'turkish';
  }
  if (typeof tabOrPath === 'object') {
    return tabOrPath.inLanguage === 'tr-TR' || tabOrPath.path === '/tr/' || tabOrPath.path?.startsWith('/tr/') || tabOrPath.tab?.startsWith('tr-') || tabOrPath.tab === 'turkish';
  }
  return false;
}

export function isSpanishRoute(tabOrPath) {
  if (!tabOrPath) return false;
  if (typeof tabOrPath === 'string') {
    return tabOrPath === '/es/' || tabOrPath.startsWith('/es/') || tabOrPath.startsWith('es-') || tabOrPath === 'spanish';
  }
  if (typeof tabOrPath === 'object') {
    return tabOrPath.inLanguage === 'es-ES' || tabOrPath.path === '/es/' || tabOrPath.path?.startsWith('/es/') || tabOrPath.tab?.startsWith('es-') || tabOrPath.tab === 'spanish';
  }
  return false;
}

export function isPortugueseRoute(tabOrPath) {
  if (!tabOrPath) return false;
  if (typeof tabOrPath === 'string') {
    return tabOrPath === '/pt/' || tabOrPath.startsWith('/pt/') || tabOrPath.startsWith('pt-') || tabOrPath === 'portuguese' || tabOrPath === 'pt';
  }
  if (typeof tabOrPath === 'object') {
    return tabOrPath.inLanguage === 'pt-BR' || tabOrPath.path === '/pt/' || tabOrPath.path?.startsWith('/pt/') || tabOrPath.tab?.startsWith('pt-') || tabOrPath.tab === 'portuguese';
  }
  return false;
}

export function getEquivalentRoute(tabOrPath, targetLang = 'en') {
  if (!tabOrPath) {
    if (targetLang === 'tr') return { path: '/tr/', tab: 'turkish' };
    if (targetLang === 'es') return { path: '/es/', tab: 'spanish' };
    if (targetLang === 'pt') return { path: '/pt/', tab: 'portuguese' };
    return { path: '/', tab: 'translator' };
  }

  const pair = ROUTE_PAIRS.find(p =>
    p.en === tabOrPath ||
    p.tr === tabOrPath ||
    p.es === tabOrPath ||
    p.pt === tabOrPath ||
    p.enTab === tabOrPath ||
    p.trTab === tabOrPath ||
    p.esTab === tabOrPath ||
    p.ptTab === tabOrPath
  );

  if (pair) {
    if (targetLang === 'tr') return { path: pair.tr, tab: pair.trTab };
    if (targetLang === 'es') return { path: pair.es, tab: pair.esTab };
    if (targetLang === 'pt') return pair.pt ? { path: pair.pt, tab: pair.ptTab } : { path: '/pt/', tab: 'portuguese' };
    return { path: pair.en, tab: pair.enTab };
  }

  if (targetLang === 'tr') return { path: '/tr/', tab: 'turkish' };
  if (targetLang === 'es') return { path: '/es/', tab: 'spanish' };
  if (targetLang === 'pt') return { path: '/pt/', tab: 'portuguese' };
  return { path: '/', tab: 'translator' };
}

export const navigationEn = [
  {
    label: 'Translator',
    items: [
      { label: 'Morse Code Translator', desc: 'Translate Morse Code and text in both directions.', tab: 'translator', href: '/', icon: Languages },
      { label: 'Türkçe Mors Çeviri', desc: 'Türkçe Mors alfabesi çevirisi ve sesli dinleme.', tab: 'turkish', href: '/tr/', icon: Languages },
      { label: 'Traductor Español', desc: 'Traductor de código Morse en español con audio.', tab: 'spanish', href: '/es/', icon: Languages },
      { label: 'English to Morse', desc: 'Convert English text into International Morse Code.', tab: 'english2morse', href: '/english-to-morse-code/', icon: Type },
      { label: 'Morse to English', desc: 'Convert Morse Code into readable English text.', tab: 'morse2english', href: '/morse-code-to-english/', icon: FileText },
      { label: 'Morse Audio Translator', desc: 'Audio sound generator, WPM controls & audio decoder.', tab: 'audiotranslator', href: '/morse-code-audio-translator/', icon: Volume2 }
    ]
  },
  {
    label: 'Decode',
    items: [
      { label: 'Morse Code Decoder', desc: 'Decode dots and dashes into readable text.', tab: 'morsedecoder', href: '/morse-code-decoder/', icon: Activity },
      { label: 'Morse Code Image Decoder', desc: 'Decode Morse code from photos, screenshots & pictures.', tab: 'imagedecoder', href: '/morse-code-image-decoder/', icon: Image },
      { label: 'Telegraph Keyer', desc: 'Practice sending Morse Code with a telegraph key.', tab: 'keyer', href: '/morse-code-keyer/', icon: Radio }
    ]
  },
  {
    label: 'Learn',
    items: [
      { label: 'Learn Morse Code', desc: 'Learn Morse Code step by step with practical practice methods.', tab: 'learn', href: '/learn-morse-code/', icon: GraduationCap },
      { label: 'Morse Code Practice', desc: 'Interactive auditory listening trainer & drills.', tab: 'practice', href: '/morse-code-practice/', icon: GraduationCap },
      { label: 'How to Read Morse Code', desc: 'Learn how to decode Morse code by sight and sound.', tab: 'howtoread', href: '/how-to-read-morse-code/', icon: BookOpen },
      { label: 'What is Morse Code', desc: 'Definition, technical specs, timing ratios & applications.', tab: 'whatismorse', href: '/what-is-morse-code/', icon: BookOpen },
      { label: 'History of Morse Code', desc: 'Timeline from Samuel Morse to modern telecommunications.', tab: 'history', href: '/history-of-morse-code/', icon: BookOpen }
    ]
  },
  {
    label: 'Reference',
    items: [
      { label: 'Morse Code Alphabet', desc: 'Explore A–Z Morse Code letters and patterns.', tab: 'alphabet', href: '/morse-code-alphabet/', icon: Type },
      { label: 'Morse Code Numbers', desc: 'Learn and reference Morse Code numbers 0–9.', tab: 'numbers', href: '/morse-code-numbers/', icon: Hash },
      { label: 'Morse Code Symbols', desc: 'Reference Morse Code punctuation, special signs & ITU symbols.', tab: 'symbols', href: '/morse-code-symbols/', icon: Bookmark },
      { label: 'Morse Code Phrases', desc: 'Popular expressions, greetings, romantic & radio calls.', tab: 'phrases', href: '/morse-code-phrases/', icon: FileText },
      { label: 'SOS in Morse Code', desc: 'Distress signal pattern, history, flashlight transmission.', tab: 'sos', href: '/sos-in-morse-code/', icon: Bookmark },
      { label: 'I Love You in Morse', desc: 'Sound, letter breakdown & copyable pattern.', tab: 'iloveyou', href: '/i-love-you-in-morse-code/', icon: Bookmark },
      { label: 'Amateur Radio CW', desc: 'Continuous Wave ham radio guide, prosigns & Q-codes.', tab: 'amateurradio', href: '/morse-code-amateur-radio/', icon: Radio }
    ]
  }
];

export const navigationTr = [
  {
    label: 'Çevirici',
    items: [
      { label: 'Mors Alfabesi Çeviri', desc: 'Metin ve Mors kodunu karşılıklı dönüştürün.', tab: 'turkish', href: '/tr/', icon: Languages },
      { label: 'Mors Kodundan İngilizceye', desc: 'Mors kodunu İngilizce metne dönüştürün.', tab: 'tr-morse2english', href: '/tr/morse-code-to-english/', icon: FileText },
      { label: 'İngilizceden Mors Koduna', desc: 'İngilizce metni Uluslararası Mors koduna çevirin.', tab: 'tr-english2morse', href: '/tr/english-to-morse-code/', icon: Type },
      { label: 'Mors Kodu Sesli Çeviri', desc: 'Ses oluşturucu, WPM hız ayarı ve ses oynatıcı.', tab: 'tr-audiotranslator', href: '/tr/morse-code-audio-translator/', icon: Volume2 }
    ]
  },
  {
    label: 'Kod Çözücü',
    items: [
      { label: 'Mors Kodu Çözücü', desc: 'Nokta ve çizgileri çözün, harf aralıklarını doğrulayın.', tab: 'tr-morsedecoder', href: '/tr/morse-code-decoder/', icon: Activity },
      { label: 'Görselden Mors Çözücü', desc: 'Fotoğraf ve ekran görüntülerindeki Mors kodunu deşifre edin.', tab: 'tr-imagedecoder', href: '/tr/morse-code-image-decoder/', icon: Image },
      { label: 'Telgraf Manipulü', desc: 'Sanal Mors tuşu ile maniple tuşlama alıştırması yapın.', tab: 'tr-keyer', href: '/tr/morse-code-keyer/', icon: Radio }
    ]
  },
  {
    label: 'Öğren',
    items: [
      { label: 'Mors Alfabesi Nasıl Öğrenilir', desc: 'Adım adım öğrenme rehberi, Koch ve Farnsworth teknikleri.', tab: 'tr-learn', href: '/tr/learn-morse-code/', icon: GraduationCap },
      { label: 'Mors Kodu Pratik Eğitimi', desc: 'İşitsel dinleme alıştırmaları ve hız geliştirme.', tab: 'tr-practice', href: '/tr/morse-code-practice/', icon: GraduationCap },
      { label: 'Mors Kodu Nasıl Okunur', desc: 'Gözle ve kulakla Mors kodunu çözme kılavuzu.', tab: 'tr-howtoread', href: '/tr/how-to-read-morse-code/', icon: BookOpen },
      { label: 'Mors Alfabesi Nedir', desc: 'Tanım, çalışma prensipleri, zamanlama oranları ve önemi.', tab: 'tr-whatismorse', href: '/tr/what-is-morse-code/', icon: BookOpen },
      { label: 'Mors Alfabesinin Tarihi', desc: 'Samuel Morse\'dan modern radyo iletişimine kronoloji.', tab: 'tr-history', href: '/tr/history-of-morse-code/', icon: BookOpen }
    ]
  },
  {
    label: 'Rehber',
    items: [
      { label: 'Mors Alfabesi Harfleri', desc: 'A–Z harf tablosu, sesler ve Türkçe karakter kuralları.', tab: 'tr-alphabet', href: '/tr/morse-code-alphabet/', icon: Type },
      { label: 'Mors Kodu Sayılar', desc: '0–9 rakam tablosu, merdiven kuralı ve sesler.', tab: 'tr-numbers', href: '/tr/morse-code-numbers/', icon: Hash },
      { label: 'Noktalama & Semboller', desc: 'Noktalama işaretleri, özel simgeler ve ITU prosign tablosu.', tab: 'tr-symbols', href: '/tr/morse-code-symbols/', icon: Bookmark },
      { label: 'Yaygın Mors İfadeleri', desc: 'En çok kullanılan ifadeler, selamlar, aşk mesajları ve kısaltmalar.', tab: 'tr-phrases', href: '/tr/morse-code-phrases/', icon: FileText },
      { label: 'Mors Kodu ile SOS', desc: 'Acil durum sinyali (... --- ...), fener iletimi ve tarihçe.', tab: 'tr-sos', href: '/tr/sos-in-morse-code/', icon: Bookmark },
      { label: 'Seni Seviyorum Mors Kodu', desc: 'Yazılışı, sesi, harf dökümü ve hediye mesajları.', tab: 'tr-iloveyou', href: '/tr/i-love-you-in-morse-code/', icon: Bookmark },
      { label: 'Amatör Telsiz CW Rehberi', desc: 'Kesintisiz dalga (CW), Q kodları, QSO ve Türkiye rehberi.', tab: 'tr-amateurradio', href: '/tr/morse-code-amateur-radio/', icon: Radio }
    ]
  }
];

export const navigationEs = [
  {
    label: 'Traductor',
    items: [
      { label: 'Traductor de Código Morse', desc: 'Convierte texto a código Morse y Morse a texto.', tab: 'spanish', href: '/es/', icon: Languages },
      { label: 'Morse a Texto', desc: 'Decodifica puntos y rayas a texto en español.', tab: 'es-morse2english', href: '/es/morse-code-to-english/', icon: FileText },
      { label: 'Texto a Morse', desc: 'Genera código Morse internacional desde texto.', tab: 'es-english2morse', href: '/es/english-to-morse-code/', icon: Type },
      { label: 'Traductor de Audio', desc: 'Generador de sonido Morse, control de WPM y tono.', tab: 'es-audiotranslator', href: '/es/morse-code-audio-translator/', icon: Volume2 }
    ]
  },
  {
    label: 'Decodificar',
    items: [
      { label: 'Decodificador Morse', desc: 'Descifra código Morse, verifica espaciados y ritmos.', tab: 'es-morsedecoder', href: '/es/morse-code-decoder/', icon: Activity },
      { label: 'Decodificador de Imagen', desc: 'Descifra código Morse desde fotos y capturas.', tab: 'es-imagedecoder', href: '/es/morse-code-image-decoder/', icon: Image },
      { label: 'Manipulador Telegráfico', desc: 'Simulador interactivo de llave telegráfica virtual.', tab: 'es-keyer', href: '/es/morse-code-keyer/', icon: Radio }
    ]
  },
  {
    label: 'Aprender',
    items: [
      { label: 'Cómo Aprender Morse', desc: 'Métodos Koch y Farnsworth para dominar el sonido.', tab: 'es-learn', href: '/es/learn-morse-code/', icon: GraduationCap },
      { label: 'Práctica de Código Morse', desc: 'Entrenador auditivo interactivo con ejercicios diarios.', tab: 'es-practice', href: '/es/morse-code-practice/', icon: GraduationCap },
      { label: 'Cómo Leer Morse', desc: 'Guía práctica para descifrar Morse por vista y oído.', tab: 'es-howtoread', href: '/es/how-to-read-morse-code/', icon: BookOpen },
      { label: 'Qué es el Código Morse', desc: 'Definición, regla 1:3:7, tiempos PARIS y estándares.', tab: 'es-whatismorse', href: '/es/what-is-morse-code/', icon: BookOpen },
      { label: 'Historia del Código Morse', desc: 'Del telégrafo de 1844 al Titanic y la era moderna.', tab: 'es-history', href: '/es/history-of-morse-code/', icon: BookOpen }
    ]
  },
  {
    label: 'Referencia',
    items: [
      { label: 'Alfabeto Código Morse', desc: 'Tabla A–Z, letra Ñ, números y pronunciación.', tab: 'es-alphabet', href: '/es/morse-code-alphabet/', icon: Type },
      { label: 'Números en Código Morse', desc: 'Tabla 0–9, regla de escalera simétrica y audio.', tab: 'es-numbers', href: '/es/morse-code-numbers/', icon: Hash },
      { label: 'Símbolos y Puntuación', desc: 'Signos ortográficos, símbolos y prosigns ITU.', tab: 'es-symbols', href: '/es/morse-code-symbols/', icon: Bookmark },
      { label: 'Frases en Código Morse', desc: 'Saludos, mensajes comunes, afecto y abreviaturas.', tab: 'es-phrases', href: '/es/morse-code-phrases/', icon: FileText },
      { label: 'SOS en Código Morse', desc: 'Señal de auxilio (... --- ...), linterna y prosign <SOS>.', tab: 'es-sos', href: '/es/sos-in-morse-code/', icon: Bookmark },
      { label: 'Te Amo en Código Morse', desc: 'Patrón (- . / .- -- ---), audio y desglose de letras.', tab: 'es-iloveyou', href: '/es/i-love-you-in-morse-code/', icon: Bookmark },
      { label: 'Radioafición CW', desc: 'Guía de contactos QSO, códigos Q y reporte RST.', tab: 'es-amateurradio', href: '/es/morse-code-amateur-radio/', icon: Radio }
    ]
  }
];

export const navigationPt = [
  {
    label: 'Tradutor',
    items: [
      { label: 'Tradutor de código Morse', desc: 'Converta texto em código Morse e Morse em texto.', tab: 'portuguese', href: '/pt/', icon: Languages },
      { label: 'Texto para Código Morse', desc: 'Converta texto em código Morse com áudio e normalização.', tab: 'pt-english2morse', href: '/pt/texto-para-codigo-morse/', icon: Type },
      { label: 'Código Morse para Texto', desc: 'Converta código Morse em texto legível.', tab: 'pt-morse2english', href: '/pt/codigo-morse-para-texto/', icon: FileText },
      { label: 'Morse Code Translator (Inglês)', desc: 'Versão em inglês do tradutor Morse.', tab: 'translator', href: '/', icon: Languages },
      { label: 'Mors Alfabesi Çeviri (Turco)', desc: 'Versão em turco do tradutor Morse.', tab: 'turkish', href: '/tr/', icon: Languages },
      { label: 'Traductor de Código Morse (Espanhol)', desc: 'Versão em espanhol do tradutor Morse.', tab: 'spanish', href: '/es/', icon: Languages }
    ]
  },
  {
    label: 'Decodificar',
    items: [
      { label: 'Decodificador de Código Morse', desc: 'Decodifique pontos e traços e revise grupos.', tab: 'pt-morsedecoder', href: '/pt/decodificador-codigo-morse/', icon: Activity },
      { label: 'Decodificador de Imagem (Inglês)', desc: 'Decodifique código Morse de fotos e imagens (em inglês).', tab: 'imagedecoder', href: '/morse-code-image-decoder/', icon: Image },
      { label: 'Manipulador Morse (Inglês)', desc: 'Pratique o envio de sinais Morse com chave telegráfica virtual.', tab: 'keyer', href: '/morse-code-keyer/', icon: Radio }
    ]
  },
  {
    label: 'Aprender',
    items: [
      { label: 'Aprender Código Morse (Inglês)', desc: 'Guia passo a passo com métodos práticos de estudo (em inglês).', tab: 'learn', href: '/learn-morse-code/', icon: GraduationCap },
      { label: 'Prática de Código Morse (Inglês)', desc: 'Treinador auditivo interativo para reconhecimento de som.', tab: 'practice', href: '/morse-code-practice/', icon: GraduationCap },
      { label: 'Como Ler Código Morse (Inglês)', desc: 'Como decodificar sinais Morse por visão e audição (em inglês).', tab: 'howtoread', href: '/how-to-read-morse-code/', icon: BookOpen },
      { label: 'O Que É Código Morse (Inglês)', desc: 'História, definições e padrões internacionais (em inglês).', tab: 'whatismorse', href: '/what-is-morse-code/', icon: BookOpen },
      { label: 'História do Código Morse (Inglês)', desc: 'Do telégrafo de Samuel Morse às telecomunicações modernas.', tab: 'history', href: '/history-of-morse-code/', icon: BookOpen }
    ]
  },
  {
    label: 'Referência',
    items: [
      { label: 'Alfabeto Morse', desc: 'Tabela de letras de A a Z com áudio e cópia.', tab: 'pt-alphabet', href: '/pt/alfabeto-morse/', icon: Type },
      { label: 'Números em Código Morse', desc: 'Tabela e conversor de 0 a 9 em código Morse.', tab: 'pt-numbers', href: '/pt/numeros-em-codigo-morse/', icon: Hash },
      { label: 'Símbolos e Pontuação (Inglês)', desc: 'Pontuação, sinais de serviço e caracteres especiais ITU.', tab: 'symbols', href: '/morse-code-symbols/', icon: Bookmark },
      { label: 'Frases em Código Morse (Inglês)', desc: 'Expressões comuns, saudações e códigos de rádio.', tab: 'phrases', href: '/morse-code-phrases/', icon: FileText },
      { label: 'SOS em Código Morse (Inglês)', desc: 'Padrão de sinal de socorro (... --- ...), transmissão e história.', tab: 'sos', href: '/sos-in-morse-code/', icon: Bookmark },
      { label: 'Eu Te Amo em Morse (Inglês)', desc: 'Desdobramento, áudio e representação de carinho.', tab: 'iloveyou', href: '/i-love-you-in-morse-code/', icon: Bookmark },
      { label: 'Radioamadorismo CW (Inglês)', desc: 'Guia de rádio CW, códigos Q e contatos QSO.', tab: 'amateurradio', href: '/morse-code-amateur-radio/', icon: Radio }
    ]
  }
];

export const footerLinksEn = [
  { label: 'Translator', tab: 'translator', href: '/' },
  { label: 'Morse to English', tab: 'morse2english', href: '/morse-code-to-english/' },
  { label: 'English to Morse', tab: 'english2morse', href: '/english-to-morse-code/' },
  { label: 'Morse Decoder', tab: 'morsedecoder', href: '/morse-code-decoder/' },
  { label: 'Audio Translator', tab: 'audiotranslator', href: '/morse-code-audio-translator/' },
  { label: 'Telegraph Keyer', tab: 'keyer', href: '/morse-code-keyer/' },
  { label: 'Image Decoder', tab: 'imagedecoder', href: '/morse-code-image-decoder/' },
  { label: 'Morse Alphabet', tab: 'alphabet', href: '/morse-code-alphabet/' },
  { label: 'Morse Numbers', tab: 'numbers', href: '/morse-code-numbers/' },
  { label: 'Morse Symbols', tab: 'symbols', href: '/morse-code-symbols/' },
  { label: 'Learn Morse', tab: 'learn', href: '/learn-morse-code/' },
  { label: 'Morse Practice', tab: 'practice', href: '/morse-code-practice/' },
  { label: 'How to Read Morse', tab: 'howtoread', href: '/how-to-read-morse-code/' },
  { label: 'Morse Phrases', tab: 'phrases', href: '/morse-code-phrases/' },
  { label: 'SOS in Morse', tab: 'sos', href: '/sos-in-morse-code/' },
  { label: 'I Love You in Morse', tab: 'iloveyou', href: '/i-love-you-in-morse-code/' },
  { label: 'What is Morse Code', tab: 'whatismorse', href: '/what-is-morse-code/' },
  { label: 'History of Morse', tab: 'history', href: '/history-of-morse-code/' },
  { label: 'Amateur Radio CW', tab: 'amateurradio', href: '/morse-code-amateur-radio/' },
  { label: 'Privacy Policy', tab: 'privacy', href: '/privacy-policy/' },
  { label: 'Mors Alfabesi Çeviri (Türkçe)', tab: 'turkish', href: '/tr/' },
  { label: 'Traductor Español', tab: 'spanish', href: '/es/' },
  { label: 'Tradutor de código Morse (Português)', tab: 'portuguese', href: '/pt/' }
];

export const footerLinksTr = [
  { label: 'Mors Alfabesi Çeviri', tab: 'turkish', href: '/tr/' },
  { label: 'Mors Kodundan İngilizceye', tab: 'tr-morse2english', href: '/tr/morse-code-to-english/' },
  { label: 'İngilizceden Mors Koduna', tab: 'tr-english2morse', href: '/tr/english-to-morse-code/' },
  { label: 'Mors Kodu Çözücü', tab: 'tr-morsedecoder', href: '/tr/morse-code-decoder/' },
  { label: 'Sesli Çevirici', tab: 'tr-audiotranslator', href: '/tr/morse-code-audio-translator/' },
  { label: 'Telgraf Manipulü', tab: 'tr-keyer', href: '/tr/morse-code-keyer/' },
  { label: 'Görselden Çözücü', tab: 'tr-imagedecoder', href: '/tr/morse-code-image-decoder/' },
  { label: 'Mors Alfabesi Harfleri', tab: 'tr-alphabet', href: '/tr/morse-code-alphabet/' },
  { label: 'Mors Kodu Sayılar', tab: 'tr-numbers', href: '/tr/morse-code-numbers/' },
  { label: 'Semboller ve Noktalama', tab: 'tr-symbols', href: '/tr/morse-code-symbols/' },
  { label: 'Mors Nasıl Öğrenilir', tab: 'tr-learn', href: '/tr/learn-morse-code/' },
  { label: 'Mors Pratik Eğitimi', tab: 'tr-practice', href: '/tr/morse-code-practice/' },
  { label: 'Mors Nasıl Okunur', tab: 'tr-howtoread', href: '/tr/how-to-read-morse-code/' },
  { label: 'Yaygın Mors İfadeleri', tab: 'tr-phrases', href: '/tr/morse-code-phrases/' },
  { label: 'Mors Kodu ile SOS', tab: 'tr-sos', href: '/tr/sos-in-morse-code/' },
  { label: 'Seni Seviyorum Mors Kodu', tab: 'tr-iloveyou', href: '/tr/i-love-you-in-morse-code/' },
  { label: 'Mors Alfabesi Nedir', tab: 'tr-whatismorse', href: '/tr/what-is-morse-code/' },
  { label: 'Mors Alfabesinin Tarihi', tab: 'tr-history', href: '/tr/history-of-morse-code/' },
  { label: 'Amatör Telsiz CW Rehberi', tab: 'tr-amateurradio', href: '/tr/morse-code-amateur-radio/' },
  { label: 'Gizlilik Politikası', tab: 'tr-privacy', href: '/tr/privacy-policy/' },
  { label: 'Morse Code Translator (English)', tab: 'translator', href: '/' },
  { label: 'Traductor Español', tab: 'spanish', href: '/es/' },
  { label: 'Tradutor Português (Brasil)', tab: 'portuguese', href: '/pt/' }
];

export const footerLinksEs = [
  { label: 'Traductor de Código Morse', tab: 'spanish', href: '/es/' },
  { label: 'Morse a Inglés', tab: 'es-morse2english', href: '/es/morse-code-to-english/' },
  { label: 'Inglés a Morse', tab: 'es-english2morse', href: '/es/english-to-morse-code/' },
  { label: 'Decodificador Morse', tab: 'es-morsedecoder', href: '/es/morse-code-decoder/' },
  { label: 'Traductor de Audio', tab: 'es-audiotranslator', href: '/es/morse-code-audio-translator/' },
  { label: 'Manipulador de Telégrafo', tab: 'es-keyer', href: '/es/morse-code-keyer/' },
  { label: 'Decodificador de Imagen', tab: 'es-imagedecoder', href: '/es/morse-code-image-decoder/' },
  { label: 'Alfabeto Morse', tab: 'es-alphabet', href: '/es/morse-code-alphabet/' },
  { label: 'Números Morse', tab: 'es-numbers', href: '/es/morse-code-numbers/' },
  { label: 'Símbolos y Puntuación', tab: 'es-symbols', href: '/es/morse-code-symbols/' },
  { label: 'Aprender Morse', tab: 'es-learn', href: '/es/learn-morse-code/' },
  { label: 'Práctica Morse', tab: 'es-practice', href: '/es/morse-code-practice/' },
  { label: 'Cómo Leer Morse', tab: 'es-howtoread', href: '/es/how-to-read-morse-code/' },
  { label: 'Frases Morse', tab: 'es-phrases', href: '/es/morse-code-phrases/' },
  { label: 'SOS en Morse', tab: 'es-sos', href: '/es/sos-in-morse-code/' },
  { label: 'Te Amo en Morse', tab: 'es-iloveyou', href: '/es/i-love-you-in-morse-code/' },
  { label: 'Qué es el Código Morse', tab: 'es-whatismorse', href: '/es/what-is-morse-code/' },
  { label: 'Historia del Código Morse', tab: 'es-history', href: '/es/history-of-morse-code/' },
  { label: 'Radioaficionado CW', tab: 'es-amateurradio', href: '/es/morse-code-amateur-radio/' },
  { label: 'Política de Privacidad', tab: 'es-privacy', href: '/es/privacy-policy/' },
  { label: 'Morse Code Translator (English)', tab: 'translator', href: '/' },
  { label: 'Mors Alfabesi Çeviri (Türkçe)', tab: 'turkish', href: '/tr/' },
  { label: 'Tradutor Português (Brasil)', tab: 'portuguese', href: '/pt/' }
];

export const footerLinksPt = [
  { label: 'Tradutor de código Morse', tab: 'portuguese', href: '/pt/' },
  { label: 'Alfabeto Morse', tab: 'pt-alphabet', href: '/pt/alfabeto-morse/' },
  { label: 'Números em Código Morse', tab: 'pt-numbers', href: '/pt/numeros-em-codigo-morse/' },
  { label: 'Texto para Código Morse', tab: 'pt-english2morse', href: '/pt/texto-para-codigo-morse/' },
  { label: 'Código Morse para Texto', tab: 'pt-morse2english', href: '/pt/codigo-morse-para-texto/' },
  { label: 'Decodificador de Código Morse', tab: 'pt-morsedecoder', href: '/pt/decodificador-codigo-morse/' },
  { label: 'Morse Code Translator (Inglês)', tab: 'translator', href: '/' },
  { label: 'Mors Alfabesi Çeviri (Turco)', tab: 'turkish', href: '/tr/' },
  { label: 'Traductor Español', tab: 'spanish', href: '/es/' },
  { label: 'Símbolos em Morse (Inglês)', tab: 'symbols', href: '/morse-code-symbols/' },
  { label: 'Aprender Morse (Inglês)', tab: 'learn', href: '/learn-morse-code/' },
  { label: 'Prática Morse (Inglês)', tab: 'practice', href: '/morse-code-practice/' },
  { label: 'Como Ler Morse (Inglês)', tab: 'howtoread', href: '/how-to-read-morse-code/' },
  { label: 'SOS em Morse (Inglês)', tab: 'sos', href: '/sos-in-morse-code/' },
  { label: 'Eu Te Amo em Morse (Inglês)', tab: 'iloveyou', href: '/i-love-you-in-morse-code/' },
  { label: 'O Que É Código Morse (Inglês)', tab: 'whatismorse', href: '/what-is-morse-code/' },
  { label: 'História do Código Morse (Inglês)', tab: 'history', href: '/history-of-morse-code/' },
  { label: 'Política de Privacidade (Inglês)', tab: 'privacy', href: '/privacy-policy/' }
];

