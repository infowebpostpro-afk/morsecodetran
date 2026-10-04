import {
  Languages, Type, FileText, Activity, Image,
  GraduationCap, BookOpen, Hash, Radio, Bookmark, Volume2
} from 'lucide-react';

export const ROUTE_PAIRS = [
  { en: '/', tr: '/tr/', enTab: 'translator', trTab: 'turkish' },
  { en: '/morse-code-alphabet/', tr: '/tr/morse-code-alphabet/', enTab: 'alphabet', trTab: 'tr-alphabet' },
  { en: '/morse-code-numbers/', tr: '/tr/morse-code-numbers/', enTab: 'numbers', trTab: 'tr-numbers' },
  { en: '/morse-code-to-english/', tr: '/tr/morse-code-to-english/', enTab: 'morse2english', trTab: 'tr-morse2english' },
  { en: '/english-to-morse-code/', tr: '/tr/english-to-morse-code/', enTab: 'english2morse', trTab: 'tr-english2morse' },
  { en: '/morse-code-decoder/', tr: '/tr/morse-code-decoder/', enTab: 'morsedecoder', trTab: 'tr-morsedecoder' },
  { en: '/morse-code-audio-translator/', tr: '/tr/morse-code-audio-translator/', enTab: 'audiotranslator', trTab: 'tr-audiotranslator' },
  { en: '/learn-morse-code/', tr: '/tr/learn-morse-code/', enTab: 'learn', trTab: 'tr-learn' },
  { en: '/how-to-read-morse-code/', tr: '/tr/how-to-read-morse-code/', enTab: 'howtoread', trTab: 'tr-howtoread' },
  { en: '/morse-code-symbols/', tr: '/tr/morse-code-symbols/', enTab: 'symbols', trTab: 'tr-symbols' },
  { en: '/morse-code-phrases/', tr: '/tr/morse-code-phrases/', enTab: 'phrases', trTab: 'tr-phrases' },
  { en: '/sos-in-morse-code/', tr: '/tr/sos-in-morse-code/', enTab: 'sos', trTab: 'tr-sos' },
  { en: '/i-love-you-in-morse-code/', tr: '/tr/i-love-you-in-morse-code/', enTab: 'iloveyou', trTab: 'tr-iloveyou' },
  { en: '/what-is-morse-code/', tr: '/tr/what-is-morse-code/', enTab: 'whatismorse', trTab: 'tr-whatismorse' },
  { en: '/history-of-morse-code/', tr: '/tr/history-of-morse-code/', enTab: 'history', trTab: 'tr-history' },
  { en: '/morse-code-amateur-radio/', tr: '/tr/morse-code-amateur-radio/', enTab: 'amateurradio', trTab: 'tr-amateurradio' },
  { en: '/morse-code-keyer/', tr: '/tr/morse-code-keyer/', enTab: 'keyer', trTab: 'tr-keyer' },
  { en: '/morse-code-image-decoder/', tr: '/tr/morse-code-image-decoder/', enTab: 'imagedecoder', trTab: 'tr-imagedecoder' },
  { en: '/morse-code-practice/', tr: '/tr/morse-code-practice/', enTab: 'practice', trTab: 'tr-practice' },
  { en: '/privacy-policy/', tr: '/tr/privacy-policy/', enTab: 'privacy', trTab: 'tr-privacy' }
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

export function getEquivalentRoute(tabOrPath, targetLang = 'en') {
  if (!tabOrPath) return targetLang === 'tr' ? '/tr/' : '/';

  const pair = ROUTE_PAIRS.find(p =>
    p.en === tabOrPath ||
    p.tr === tabOrPath ||
    p.enTab === tabOrPath ||
    p.trTab === tabOrPath
  );

  if (pair) {
    return targetLang === 'tr' ? { path: pair.tr, tab: pair.trTab } : { path: pair.en, tab: pair.enTab };
  }

  return targetLang === 'tr' ? { path: '/tr/', tab: 'turkish' } : { path: '/', tab: 'translator' };
}

export const navigationEn = [
  {
    label: 'Translator',
    items: [
      { label: 'Morse Code Translator', desc: 'Translate Morse Code and text in both directions.', tab: 'translator', href: '/', icon: Languages },
      { label: 'Türkçe Mors Çeviri', desc: 'Türkçe Mors alfabesi çevirisi ve sesli dinleme.', tab: 'turkish', href: '/tr/', icon: Languages },
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
  { label: 'Mors Alfabesi Çeviri (Türkçe)', tab: 'turkish', href: '/tr/' }
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
  { label: 'Morse Code Translator (English)', tab: 'translator', href: '/' }
];
