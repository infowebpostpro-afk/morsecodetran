/**
 * Central Route Registry
 * Single source of truth for routes, metadata, canonicals, sitemap, and structured data.
 */

import { ROUTE_PAIRS, isTurkishRoute, getEquivalentRoute } from './i18n/navigation.js';

export const SITE_URL = 'https://morsecodetranslatr.io';
export const SITE_NAME = 'MorseCodeTranslatr';
export const LOGO_URL = `${SITE_URL}/images/logo.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/morse-code-translator-interface.png`;

export { ROUTE_PAIRS, isTurkishRoute, getEquivalentRoute };

export const ROUTES = [
  // 1. Home / Translator
  {
    path: '/',
    tab: 'translator',
    title: 'Morse Code Translator – Translate Morse to Text & More',
    description: 'Use our free Morse Code Translator to convert text to Morse or Morse to text instantly. Play audio, copy results, and learn Morse code.',
    h1: 'Morse Code Translator',
    canonical: `${SITE_URL}/`,
    isArticle: false,
    priority: '1.0',
    changefreq: 'daily',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/',
    tab: 'turkish',
    title: 'Mors Alfabesi Çeviri – Mors Kodu Çevirici & Sesli Dinleme',
    description: 'Türkçe Mors alfabesi çeviri aracı ile metni Mors koduna, Mors kodunu metne anında dönüştürün. Sesli dinleyin, kopyalayın ve Türkçe karakter kurallarını öğrenin.',
    h1: 'Mors Alfabesi Çeviri & Mors Kodu Çevirici',
    canonical: `${SITE_URL}/tr/`,
    isArticle: false,
    priority: '1.0',
    changefreq: 'daily',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 2. Alphabet
  {
    path: '/morse-code-alphabet/',
    tab: 'alphabet',
    title: 'Morse Code Alphabet: A–Z Letters, Numbers & Symbols',
    description: 'Explore the full Morse Code Alphabet from A–Z, numbers, and symbols. Listen to audio signals, learn timing rules, and master Morse code.',
    h1: 'Morse Code Alphabet: A–Z Letters, Numbers & Symbols',
    canonical: `${SITE_URL}/morse-code-alphabet/`,
    isArticle: true,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-alphabet/',
    tab: 'tr-alphabet',
    title: 'Mors Alfabesi Harfleri: A–Z Harf Tablosu, Sayılar ve Sesler',
    description: 'Mors alfabesi A–Z harf tablosunu inceleyin, her harfin Mors kodu karşılığını ve sesini dinleyin. Türkçe karakter kurallarını ve zamanlama oranlarını öğrenin.',
    h1: 'Mors Alfabesi Harfleri: A–Z Harf Tablosu ve Sesli Dinleme',
    canonical: `${SITE_URL}/tr/morse-code-alphabet/`,
    isArticle: true,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 3. Numbers
  {
    path: '/morse-code-numbers/',
    tab: 'numbers',
    title: 'Morse Code Numbers: 0–9 Converter, Sound & Decoding Chart',
    description: 'Convert numbers 0–9 to Morse code, hear each signal, and decode Morse numbers instantly with our complete interactive chart and drills.',
    h1: 'Morse Code Numbers 0–9: Complete Chart, Patterns & How to Read Them',
    canonical: `${SITE_URL}/morse-code-numbers/`,
    isArticle: true,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-numbers/',
    tab: 'tr-numbers',
    title: 'Mors Kodu Sayılar: 0–9 Rakam Tablosu, Sesler ve Alıştırmalar',
    description: '0–9 arası rakamların Mors alfabesi karşılıklarını öğrenin, sesli dinleyin ve merdiven kuralı ile Mors sayılarını kolayca ezberleyin.',
    h1: 'Mors Kodu Sayılar: 0–9 Rakam Tablosu ve Sesli Rehber',
    canonical: `${SITE_URL}/tr/morse-code-numbers/`,
    isArticle: true,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 4. Morse to English (Preserves English-decoding intent in Turkish)
  {
    path: '/morse-code-to-english/',
    tab: 'morse2english',
    title: 'Morse Code to English Converter - Instant Morse Decoder',
    description: 'Convert Morse code to English text instantly. Accurate client-side decoding, live audio playback, character breakdown, and reverse translation.',
    h1: 'Morse Code to English Translator',
    canonical: `${SITE_URL}/morse-code-to-english/`,
    isArticle: false,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-to-english/',
    tab: 'tr-morse2english',
    title: 'Mors Kodundan İngilizceye Çeviri - Mors Çözücü Aracı',
    description: 'Mors kodunu anında İngilizce metne dönüştürün. Nokta ve çizgileri girin, harf ayrımı ve sesli dinleme ile İngilizceye hatasız çevirin.',
    h1: 'Mors Kodundan İngilizceye Çeviri Aracı',
    canonical: `${SITE_URL}/tr/morse-code-to-english/`,
    isArticle: false,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 5. English to Morse (Preserves English-text encoding intent in Turkish)
  {
    path: '/english-to-morse-code/',
    tab: 'english2morse',
    title: 'English to Morse Code Translator - Instant Morse Generator',
    description: 'Convert English text to International Morse Code instantly. Real-time encoding, audio playback, character breakdown, and speed controls.',
    h1: 'English to Morse Code: How to Convert Text to Morse Code',
    canonical: `${SITE_URL}/english-to-morse-code/`,
    isArticle: false,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/english-to-morse-code/',
    tab: 'tr-english2morse',
    title: 'İngilizceden Mors Koduna Çeviri - Mors Kodu Oluşturucu',
    description: 'İngilizce metinleri anında Uluslararası Mors alfabesine dönüştürün. Sesli dinleyin, hızını (WPM) ayarlayın ve WAV ses dosyası olarak indirin.',
    h1: 'İngilizceden Mors Koduna Çeviri Aracı',
    canonical: `${SITE_URL}/tr/english-to-morse-code/`,
    isArticle: false,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 6. Morse Decoder
  {
    path: '/morse-code-decoder/',
    tab: 'morsedecoder',
    title: 'Morse Code Decoder - Decode Morse to Text Online',
    description: 'Decode Morse code into readable text instantly. Paste dots and dashes, inspect character mappings, verify spacing, and listen to Morse signals.',
    h1: 'Morse Code Decoder',
    canonical: `${SITE_URL}/morse-code-decoder/`,
    isArticle: false,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-decoder/',
    tab: 'tr-morsedecoder',
    title: 'Mors Kodu Çözücü - Mors Kodunu Metne Dönüştürme',
    description: 'Karışık veya boşluksuz Mors kodlarını anında metne dönüştürün. Belirsizlikleri, harf boşluklarını analiz edin ve doğrulanmış metni dinleyin.',
    h1: 'Mors Kodu Çözücü ve Deşifre Aracı',
    canonical: `${SITE_URL}/tr/morse-code-decoder/`,
    isArticle: false,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 7. Audio Translator
  {
    path: '/morse-code-audio-translator/',
    tab: 'audiotranslator',
    title: 'Morse Code Audio Translator - Sound Generator & Player',
    description: 'Convert text and Morse code into audio playback with customizable pitch and WPM speed. Download WAV sound files or practice listening.',
    h1: 'Morse Code Audio Translator',
    canonical: `${SITE_URL}/morse-code-audio-translator/`,
    isArticle: false,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-audio-translator/',
    tab: 'tr-audiotranslator',
    title: 'Mors Kodu Sesli Çeviri - Ses Oluşturucu ve Dinleme Aracı',
    description: 'Metin veya Mors kodunu özelleştirilebilir ton (Hz) ve WPM hızında sese dönüştürün. Mors seslerini dinleyin veya WAV dosyası olarak kaydedin.',
    h1: 'Mors Kodu Sesli Çeviri ve Ses Sentezleyici',
    canonical: `${SITE_URL}/tr/morse-code-audio-translator/`,
    isArticle: false,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 8. Learn Morse Code
  {
    path: '/learn-morse-code/',
    tab: 'learn',
    title: "How to Learn Morse Code: Beginner's Practical Guide",
    description: 'Learn Morse code step by step with sound-based training, Koch and Farnsworth methods, daily practice advice, and common pitfalls to avoid.',
    h1: 'How to Learn Morse Code: A Beginner’s Guide',
    canonical: `${SITE_URL}/learn-morse-code/`,
    isArticle: true,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/learn-morse-code/',
    tab: 'tr-learn',
    title: 'Mors Alfabesi Nasıl Öğrenilir? Başlangıç Rehberi ve Yöntemler',
    description: 'Mors alfabesini Koch ve Farnsworth yöntemleriyle sıfırdan adım adım öğrenin. Kulaktan tanıma egzersizleri ve günlük pratik tavsiyeleri.',
    h1: 'Mors Alfabesi Nasıl Öğrenilir: Adım Adım Başlangıç Rehberi',
    canonical: `${SITE_URL}/tr/learn-morse-code/`,
    isArticle: true,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 9. How to Read Morse Code
  {
    path: '/how-to-read-morse-code/',
    tab: 'howtoread',
    title: 'How to Read Morse Code: A Beginner’s Guide',
    description: 'Learn how to read Morse code by sight and sound. Understand dots, dashes, spacing, timing, examples, common mistakes, and practice methods.',
    h1: 'How to Read Morse Code',
    canonical: `${SITE_URL}/how-to-read-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/how-to-read-morse-code/',
    tab: 'tr-howtoread',
    title: 'Mors Kodu Nasıl Okunur? Gözle ve Kulakla Okuma Rehberi',
    description: 'Mors kodunu gözle görsel olarak ve kulakla sesli olarak nasıl okuyacağınızı öğrenin. Nokta, çizgi, harf ve kelime boşluklarının kuralları.',
    h1: 'Mors Kodu Nasıl Okunur: Görsel ve İşitsel Okuma Kılavuzu',
    canonical: `${SITE_URL}/tr/how-to-read-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 10. Symbols
  {
    path: '/morse-code-symbols/',
    tab: 'symbols',
    title: 'Morse Code Symbols: Complete Chart & Meanings',
    description: 'Explore Morse code symbols with a complete chart of punctuation, special signs, meanings, and official International Morse references.',
    h1: 'Morse Code Symbols: Complete Chart, Punctuation & Special Signs',
    canonical: `${SITE_URL}/morse-code-symbols/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-symbols/',
    tab: 'tr-symbols',
    title: 'Mors Alfabesi Sembolleri: Noktalama İşaretleri ve Özel Kodlar',
    description: 'Mors alfabesindeki tüm noktalama işaretleri, matematiksel semboller ve uluslararası prosign (prosedür sinyali) tablosu ve sesleri.',
    h1: 'Mors Alfabesi Sembolleri ve Noktalama İşaretleri Tablosu',
    canonical: `${SITE_URL}/tr/morse-code-symbols/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 11. Phrases
  {
    path: '/morse-code-phrases/',
    tab: 'phrases',
    title: 'Morse Code Phrases: Common Expressions, Greetings & Sound',
    description: 'Discover essential Morse code phrases for daily greetings, romantic messages, emergency calls, and ham radio expressions with audio.',
    h1: 'Morse Code Phrases: Common Words, Messages & Meanings',
    canonical: `${SITE_URL}/morse-code-phrases/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-phrases/',
    tab: 'tr-phrases',
    title: 'Yaygın Mors Kodu İfadeleri: Selamlaşma, Kısaltmalar ve Sesler',
    description: 'Günlük hayatta ve amatör telsizde en çok kullanılan Mors kodu ifadeleri, Türkçe ve İngilizce örnekler, kısaltmalar ve sesli dinleme.',
    h1: 'Yaygın Mors Kodu İfadeleri ve Telgraf Kısaltmaları',
    canonical: `${SITE_URL}/tr/morse-code-phrases/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 12. SOS
  {
    path: '/sos-in-morse-code/',
    tab: 'sos',
    title: 'SOS in Morse Code: Distress Signal Meaning, Pattern & Sound',
    description: 'Learn the SOS Morse code distress signal (... --- ...), its history, continuous prosign timing, flashlight transmission, and myths.',
    h1: 'SOS in Morse Code: Pattern, Meaning, History & How to Send It',
    canonical: `${SITE_URL}/sos-in-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/sos-in-morse-code/',
    tab: 'tr-sos',
    title: 'Mors Kodu ile SOS: (... --- ...) Acil Durum Sinyali ve Anlamı',
    description: 'Mors kodunda SOS sinyalinin (... --- ...) yazılışı, sesli çalınışı, fenerle iletimi, tarihçesi ve kesintisiz prosign kuralları.',
    h1: 'Mors Kodu ile SOS (... --- ...) Acil Durum Çağrısı',
    canonical: `${SITE_URL}/tr/sos-in-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 13. I Love You
  {
    path: '/i-love-you-in-morse-code/',
    tab: 'iloveyou',
    title: 'I Love You in Morse Code: Sound, Breakdown & Copy',
    description: 'Learn how to write and speak I Love You in Morse code. Listen to sound playback, copy the pattern for gifts, jewelry, or hidden messages.',
    h1: 'I Love You in Morse Code: Copy, Hear & Send It',
    canonical: `${SITE_URL}/i-love-you-in-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/i-love-you-in-morse-code/',
    tab: 'tr-iloveyou',
    title: 'Mors Kodu ile Seni Seviyorum: Yazılışı, Sesi ve Kopyalama',
    description: 'Mors alfabesiyle Seni Seviyorum ve I Love You nasıl yazılır? Sesli dinleyin, harf dökümünü inceleyin, bileklik ve mesajlar için kopyalayın.',
    h1: 'Mors Kodu ile Seni Seviyorum (Yazılış, Ses ve Harf Analizi)',
    canonical: `${SITE_URL}/tr/i-love-you-in-morse-code/`,
    isArticle: true,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 14. What is Morse Code
  {
    path: '/what-is-morse-code/',
    tab: 'whatismorse',
    title: 'What Is Morse Code? How It Works & Why It Matters',
    description: 'What is Morse code? Learn how dots, dashes, timing, and spacing work, where Morse came from, and how it is still used today.',
    h1: 'What Is Morse Code? How It Works, History & Modern Uses',
    canonical: `${SITE_URL}/what-is-morse-code/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/what-is-morse-code/',
    tab: 'tr-whatismorse',
    title: 'Mors Alfabesi Nedir? Nasıl Çalışır ve Nerelerde Kullanılır?',
    description: 'Mors alfabesi nedir? Noktalar ve çizgiler nasıl sese ve harfe dönüşür? Zamanlama oranları, Paris standardı ve günümüzdeki kullanım alanları.',
    h1: 'Mors Alfabesi Nedir? Çalışma Prensipleri ve Önemi',
    canonical: `${SITE_URL}/tr/what-is-morse-code/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 15. History of Morse Code
  {
    path: '/history-of-morse-code/',
    tab: 'history',
    title: 'History of Morse Code: From Telegraph to Modern Radio',
    description: 'Discover the history of Morse code: Samuel Morse, Alfred Vail, the electric telegraph, International Morse evolution, SOS, and modern ham radio.',
    h1: 'History of Morse Code: From Telegraph to Modern Radio',
    canonical: `${SITE_URL}/history-of-morse-code/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/history-of-morse-code/',
    tab: 'tr-history',
    title: 'Mors Alfabesinin Tarihi: Telgraftan Modern Telsiz İletişimine',
    description: 'Mors alfabesinin tarihi: Samuel Morse, Alfred Vail, ilk telgraf hattı, Titanic faciası ve modern amatör telsizciliğe uzanan gelişim süreci.',
    h1: 'Mors Alfabesinin Tarihi: İcat, Evrim ve Miras',
    canonical: `${SITE_URL}/tr/history-of-morse-code/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 16. Amateur Radio
  {
    path: '/morse-code-amateur-radio/',
    tab: 'amateurradio',
    title: 'Morse Code Amateur Radio: CW, QSO & Getting Started',
    description: 'Learn how Morse code works in amateur radio, what CW means, which equipment you need, common Q-codes, and how to make your first QSO.',
    h1: 'Morse Code in Amateur Radio: CW, QSO, Equipment & Getting Started',
    canonical: `${SITE_URL}/morse-code-amateur-radio/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-amateur-radio/',
    tab: 'tr-amateurradio',
    title: 'Amatör Telsizde Mors Kodu (CW): QSO Rehberi ve Q Kodları',
    description: 'Amatör telsizcilikte Mors kodu (CW) işletimi: İlk QSO görüşmesi nasıl yapılır, en çok kullanılan Q kodları, RST raporu ve Türkiye düzenlemeleri.',
    h1: 'Amatör Telsizde Mors Kodu (CW İşletim Rehberi)',
    canonical: `${SITE_URL}/tr/morse-code-amateur-radio/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 17. Keyer
  {
    path: '/morse-code-keyer/',
    tab: 'keyer',
    title: 'Morse Code Keyer – Practice Telegraph Key Online',
    description: 'Interactive Morse telegraph keyer. Practice keying dits and dahs with mouse, touch, or keyboard to test your speed and timing.',
    h1: 'Interactive Morse Telegraph Keyer',
    canonical: `${SITE_URL}/morse-code-keyer/`,
    isArticle: false,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-keyer/',
    tab: 'tr-keyer',
    title: 'Mors Kodu Maniple Simülatörü – Çevrimiçi Telgraf Tuşu',
    description: 'İnteraktif Mors maniple simülatörü ile telgraf tuşlaması yapın. Klavye, fare veya dokunmatik ekranla nokta ve çizgileri kendi hızınızda çalın.',
    h1: 'İnteraktif Mors Maniple Simülatörü & CW Tuşlayıcı',
    canonical: `${SITE_URL}/tr/morse-code-keyer/`,
    isArticle: false,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 18. Image Decoder
  {
    path: '/morse-code-image-decoder/',
    tab: 'imagedecoder',
    title: 'Morse Code Image Decoder: Decode Pictures to Text',
    description: 'Decode Morse code from images, photos, and screenshots. Upload an image, inspect detected dots and dashes, convert to text, and troubleshoot.',
    h1: 'Morse Code Image Decoder: Decode Morse from Pictures, Photos & Screenshots',
    canonical: `${SITE_URL}/morse-code-image-decoder/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-image-decoder/',
    tab: 'tr-imagedecoder',
    title: 'Görselden Mors Kodu Çözücü: Resim ve Fotoğrafları Metne Çevir',
    description: 'Fotoğraf, ekran görüntüsü veya çizimlerdeki Mors kodlarını yükleyin ve metne dönüştürün. Görsel analiz ve harf ayrımı ile hızlı deşifre.',
    h1: 'Görselden Mors Kodu Çözücü (Resim & Fotoğraf Tarayıcı)',
    canonical: `${SITE_URL}/tr/morse-code-image-decoder/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 19. Practice
  {
    path: '/morse-code-practice/',
    tab: 'practice',
    title: 'Morse Code Practice: Free Online Trainer & Drills',
    description: 'Practice Morse code online with listening drills, WPM controls, feedback, and focused exercises for letters, words, and real CW skills.',
    h1: 'Morse Code Practice: Listen, Type, Improve',
    canonical: `${SITE_URL}/morse-code-practice/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-09-24',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/morse-code-practice/',
    tab: 'tr-practice',
    title: 'Mors Kodu Pratik Eğitimi: Çevrimiçi Alıştırma ve Dinleme Aracı',
    description: 'Mors alfabesi dinleme ve anlama becerinizi geliştirin. Hız (WPM) ve ton ayarlı interaktif alıştırmalarla harfleri ve kelimeleri kulaktan tanıyın.',
    h1: 'Mors Kodu Pratik Eğitimi ve İşitsel Alıştırma Aracı',
    canonical: `${SITE_URL}/tr/morse-code-practice/`,
    isArticle: true,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: '2026-10-03',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // Privacy Policy
  {
    path: '/privacy-policy/',
    tab: 'privacy',
    title: 'Privacy Policy – MorseCodeTranslatr.io',
    description: 'Our Privacy Policy details our 100% client-side processing, zero data collection policy, and Chrome Web Store extension compliance guarantees.',
    h1: 'Privacy Policy',
    canonical: `${SITE_URL}/privacy-policy/`,
    isArticle: true,
    priority: '0.4',
    changefreq: 'monthly',
    lastmod: '2026-10-04',
    isIndexable: true,
    inLanguage: 'en-US',
  },
  {
    path: '/tr/privacy-policy/',
    tab: 'tr-privacy',
    title: 'Gizlilik Politikası – MorseCodeTranslatr.io',
    description: 'MorseCodeTranslatr gizlilik politikası: %100 tarayıcı içi yerel işlem, sıfır veri kaydı ve Chrome Web Mağazası eklenti uyumluluk ilkelerimiz.',
    h1: 'Gizlilik Politikası',
    canonical: `${SITE_URL}/tr/privacy-policy/`,
    isArticle: true,
    priority: '0.4',
    changefreq: 'monthly',
    lastmod: '2026-10-04',
    isIndexable: true,
    inLanguage: 'tr-TR',
  },

  // 404
  {
    path: '/404.html',
    tab: 'notfound',
    title: 'Page Not Found (404) – Morse Code Translator',
    description: 'The requested page could not be found. Return to the Morse Code Translator or explore our Morse alphabet, numbers, and learning guides.',
    h1: '404 - Page Not Found',
    canonical: `${SITE_URL}/`,
    isArticle: false,
    priority: '0.0',
    changefreq: 'never',
    lastmod: '2026-09-24',
    isIndexable: false,
    inLanguage: 'en-US',
  }
];

export const TAB_TO_PATH = ROUTES.reduce((acc, r) => {
  if (r.tab) acc[r.tab] = r.path;
  return acc;
}, {});

export function navigateTo(e, tab, setActiveTab) {
  if (e) e.preventDefault();
  if (setActiveTab) setActiveTab(tab);
  const path = TAB_TO_PATH[tab] || '/';
  if (typeof window !== 'undefined' && window.location.pathname !== path) {
    window.history.pushState({ tab }, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function getRouteByPath(pathname) {
  let normalized = pathname;
  if (!normalized.endsWith('/') && !normalized.includes('.')) {
    normalized += '/';
  }
  return ROUTES.find(r => r.path === normalized) || null;
}

export function getRouteByTab(tab) {
  return ROUTES.find(r => r.tab === tab) || ROUTES[0];
}

export function generateStructuredData(route) {
  const isHome = route.path === '/' || route.path === '/tr/';
  const isTurkish = isTurkishRoute(route);
  const pageName = route.title.split('–')[0].split('-')[0].split(':')[0].trim();
  const mainEntityId = route.isArticle ? `${route.canonical}#article` : `${route.canonical}#application`;
  const language = isTurkish ? 'tr-TR' : 'en-US';

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": `${SITE_URL}/`,
      "name": SITE_NAME,
      "alternateName": isTurkish ? "Mors Alfabesi Çeviri" : "Morse Code Translator",
      "description": isTurkish
        ? "Metin ve Mors kodunu anında dönüştüren, sesli dinleme ve Türkçe karakter desteği sunan ücretsiz çevrimiçi Mors alfabesi çeviri aracı."
        : "Free online Morse Code Translator for converting text to Morse Code, decoding Morse Code to text, playing Morse audio, and learning International Morse Code.",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "inLanguage": language
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": SITE_NAME,
      "url": `${SITE_URL}/`,
      "logo": {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        "url": LOGO_URL,
        "contentUrl": LOGO_URL,
        "width": 1024,
        "height": 1024
      }
    },
    {
      "@type": "WebPage",
      "@id": `${route.canonical}#webpage`,
      "url": route.canonical,
      "name": route.title,
      "headline": route.h1 || pageName,
      "description": route.description,
      "isPartOf": {
        "@id": `${SITE_URL}/#website`
      },
      "about": {
        "@id": mainEntityId
      },
      "mainEntity": {
        "@id": mainEntityId
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "inLanguage": language
    }
  ];

  if (route.isArticle) {
    graph.push({
      "@type": "Article",
      "@id": `${route.canonical}#article`,
      "url": route.canonical,
      "headline": route.title,
      "description": route.description,
      "inLanguage": language,
      "isPartOf": {
        "@id": `${route.canonical}#webpage`
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "mainEntityOfPage": {
        "@id": `${route.canonical}#webpage`
      }
    });
  } else if (route.isIndexable) {
    const featureList = isTurkish ? [
      "Metinden Mors koduna anlık çeviri",
      "Mors kodundan metne anlık çözümleme",
      "Türkçe karakter desteği ve sadeleştirme (Ç, Ğ, İ, Ö, Ş, Ü)",
      "Mors kodu sesli çalma ve WPM hız kontrolü",
      "Farnsworth zamanlama ayarı",
      "Harf harf görselleştirme ve sesli önizleme",
      "WAV ses dosyası indirme",
      "Tek tıkla panoya kopyalama ve paylaşma",
      "Türkçe Mors alfabesi tablosu"
    ] : [
      "Morse Code to text conversion",
      "Text to Morse Code conversion",
      "Automatic direction detection",
      "Morse Code audio playback",
      "WPM speed control",
      "Farnsworth timing",
      "Character breakdown",
      "Copy and share results",
      "Morse Code learning resources",
      "Morse Code alphabet reference",
      "Morse Code numbers reference"
    ];

    graph.push({
      "@type": "WebApplication",
      "@id": `${route.canonical}#application`,
      "name": isTurkish ? (route.h1 || "Mors Alfabesi Çeviri & Mors Kodu Çevirici") : pageName,
      "alternateName": isTurkish ? "Mors Çevirici" : SITE_NAME,
      "url": route.canonical,
      "description": route.description,
      "applicationCategory": "EducationalApplication",
      "applicationSubCategory": isTurkish ? "Mors Alfabesi Çevirici" : "Morse Code Translator",
      "operatingSystem": "Any",
      "browserRequirements": isTurkish ? "JavaScript etkin modern bir web tarayıcısı gerektirir." : "Requires a modern web browser with JavaScript enabled.",
      "availableOnDevice": ["Desktop", "Mobile", "Tablet"],
      "countriesSupported": "Worldwide",
      "inLanguage": language,
      "isAccessibleForFree": true,
      "featureList": featureList,
      "softwareHelp": {
        "@type": "WebPage",
        "url": isTurkish ? `${SITE_URL}/tr/` : `${SITE_URL}/learn-morse-code/`
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "mainEntityOfPage": {
        "@id": `${route.canonical}#webpage`
      }
    });
  }

  if (route.tab === 'turkish') {
    graph.push({
      "@type": "FAQPage",
      "@id": `${route.canonical}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Mors alfabesinde Türkçe karakterler (Ç, Ğ, İ, Ö, Ş, Ü) nasıl çevrilir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Uluslararası Telekomünikasyon Birliği (ITU-R M.1677-1) standardı gereğince Türkçe karakterler en yakın Latin karşılığına sadeleştirilir (Ç→C, Ğ→G, İ/ı→I, Ö→O, Ş→S, Ü→U). Ayrıca Türk amatör telsizcilik geleneğindeki genişletilmiş Mors kodları da desteklenmektedir."
          }
        },
        {
          "@type": "Question",
          "name": "Mors kodunda harfler ve kelimeler arasındaki boşluklar nasıl bırakılır?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mors kodunda harf içi semboller arasında 1 birim, harfler arasında 3 birim (1 boşluk), kelimeler arasında ise 7 birim (/ veya 3 boşluk) bırakılır."
          }
        },
        {
          "@type": "Question",
          "name": "Boşluk bırakılmadan yazılan Mors kodu neden doğru çevrilemez?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Mors değişken uzunluklu bir kodlama olduğundan, harfler arasına boşluk konulmadığında aynı nokta-tire dizilimi birden fazla harf kombinasyonuna karşılık gelerek anlam belirsizliğine (ambiguity) yol açar."
          }
        },
        {
          "@type": "Question",
          "name": "\"SOS\" ile kesintisiz acil durum sinyali (<SOS>) arasındaki fark nedir?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ayrı harflerle yazılan \"S O S\" aralarında harf boşluğu barındırırken (... --- ...), uluslararası acil durum çağrısı olan <SOS> kesintisiz tek bir prosign (...---...) olarak gönderilir."
          }
        },
        {
          "@type": "Question",
          "name": "Mors kodunu ses dosyası (WAV) olarak indirebilir miyim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Evet, çevirici üzerindeki Ses İndir (WAV) düğmesine tıklayarak oluşturulan Mors sesini doğrudan bilgisayarınıza veya telefonunuza kaydedebilirsiniz."
          }
        },
        {
          "@type": "Question",
          "name": "WPM ve Farnsworth ayarı ne işe yarar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WPM (dakikadaki kelime sayısı) iletim hızını belirler. Farnsworth ayarı ise harf içi hızı koruyup harf arası boşlukları uzatarak Mors öğrenmeyi kolaylaştırır."
          }
        }
      ]
    });
  }

  if (route.isIndexable) {
    const breadcrumbs = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": isTurkish ? "Ana Sayfa" : "Home",
        "item": isTurkish ? `${SITE_URL}/tr/` : `${SITE_URL}/`
      }
    ];

    if (!isHome) {
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": route.h1 || pageName,
        "item": route.canonical
      });
    }

    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${route.canonical}#breadcrumb`,
      "itemListElement": breadcrumbs
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
