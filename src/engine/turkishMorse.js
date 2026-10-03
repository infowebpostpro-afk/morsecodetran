/**
 * Turkish Morse Code Engine & Extensions
 * Adheres strictly to ITU-R M.1677-1 international standard while offering
 * documented Turkish telegraph extensions and explicit diacritic normalization.
 */

import { MORSE_CODE_MAP, REVERSE_MORSE_MAP } from './morseMap.js';

// Turkish specific characters
export const TURKISH_SPECIAL_CHARS = ['Ç', 'ç', 'Ğ', 'ğ', 'I', 'ı', 'İ', 'i', 'Ö', 'ö', 'Ş', 'ş', 'Ü', 'ü'];

// Documented Turkish Telegraph / Radio Extension Mappings
export const TURKISH_EXTENDED_MAP = {
  'Ç': { morse: '-.-..', name: 'Ç', type: 'turkish-extension', phonetic: 'Çankırı (Genişletilmiş)', ditDah: 'dah-di-dah-di-dit' },
  'Ğ': { morse: '--.-.', name: 'Ğ', type: 'turkish-extension', phonetic: 'Yumuşak G (Genişletilmiş)', ditDah: 'dah-dah-di-dah-dit' },
  'Ö': { morse: '---.', name: 'Ö', type: 'turkish-extension', phonetic: 'Ödemiş (Genişletilmiş)', ditDah: 'dah-dah-dah-dit' },
  'Ş': { morse: '----', name: 'Ş', type: 'turkish-extension', phonetic: 'Şırnak (Genişletilmiş)', ditDah: 'dah-dah-dah-dah' },
  'Ü': { morse: '..--', name: 'Ü', type: 'turkish-extension', phonetic: 'Ünye (Genişletilmiş)', ditDah: 'di-di-dah-dah' },
  'İ': { morse: '..', name: 'İ', type: 'letter', phonetic: 'İzmir', ditDah: 'di-dit' },
  'ı': { morse: '..', name: 'I', type: 'letter', phonetic: 'Isparta', ditDah: 'di-dit' }
};

// Documented ITU Standard Normalization (Sadeleştirme)
export const TURKISH_NORMALIZATION_MAP = {
  'Ç': 'C', 'ç': 'C',
  'Ğ': 'G', 'ğ': 'G',
  'İ': 'I', 'i': 'I',
  'ı': 'I',
  'Ö': 'O', 'ö': 'O',
  'Ş': 'S', 'ş': 'S',
  'Ü': 'U', 'ü': 'U'
};

// Turkish quick examples showcasing both standard greetings and Turkish characters
export const TURKISH_QUICK_EXAMPLES = [
  { label: 'MERHABA', text: 'MERHABA', desc: 'Genel Türkçe selamlama' },
  { label: 'SENİ SEVİYORUM', text: 'SENİ SEVİYORUM', desc: 'Sevgi ve bağlılık mesajı' },
  { label: 'SOS', text: 'SOS', desc: 'Uluslararası acil durum çağrısı (... --- ...)' },
  { label: 'GÜNAYDIN', text: 'GÜNAYDIN', desc: 'Türkçe karakter içeren selamlama (Ü)' },
  { label: 'TEŞEKKÜRLER', text: 'TEŞEKKÜRLER', desc: 'Ş harfi içeren teşekkür mesajı' },
  { label: 'TÜRKİYE', text: 'TÜRKİYE', desc: 'Ü ve İ harfleri içeren örnek' }
];

/**
 * Convert string to uppercase using Turkish locale rules.
 * Handles 'i' -> 'İ' and 'ı' -> 'I' accurately.
 */
export function toTurkishUpper(str) {
  if (!str) return '';
  return str.toLocaleUpperCase('tr-TR');
}

/**
 * Detect whether input text contains special Turkish characters.
 */
export function detectTurkishCharacters(text) {
  if (!text) return [];
  const found = new Set();
  for (const char of text) {
    if (['ç', 'Ç', 'ğ', 'Ğ', 'ı', 'İ', 'ö', 'Ö', 'ş', 'Ş', 'ü', 'Ü'].includes(char)) {
      found.add(char);
    }
  }
  return Array.from(found);
}

/**
 * Translate Turkish text to Morse Code.
 * @param {string} text - Input text
 * @param {string} mode - 'standard' (ITU-R M.1677-1 with normalization) or 'extended' (Turkish extensions)
 */
export function translateTurkishToMorse(text, mode = 'standard') {
  if (!text) {
    return { morseText: '', normalizedList: [], unsupportedChars: [] };
  }

  const normalizedList = [];
  const unsupportedSet = new Set();
  const lines = text.split(/\r?\n/);

  const morseLines = lines.map(line => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const morseWords = words.map(word => {
      const tokens = word.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];
      const wordMorse = [];

      for (const token of tokens) {
        // Prosigns like <SOS>
        if (token.startsWith('<') && token.endsWith('>')) {
          const upperToken = token.toUpperCase();
          if (MORSE_CODE_MAP[upperToken]) {
            wordMorse.push(MORSE_CODE_MAP[upperToken].morse);
          } else {
            wordMorse.push('?');
            unsupportedSet.add(token);
          }
          continue;
        }

        // Check if token is a Turkish character
        const isTurkish = ['ç', 'Ç', 'ğ', 'Ğ', 'ı', 'İ', 'ö', 'Ö', 'ş', 'Ş', 'ü', 'Ü'].includes(token);

        if (mode === 'extended' && isTurkish) {
          const upperTr = toTurkishUpper(token);
          if (TURKISH_EXTENDED_MAP[upperTr]) {
            wordMorse.push(TURKISH_EXTENDED_MAP[upperTr].morse);
            continue;
          }
        }

        // Standard ITU mode or fallback
        if (isTurkish) {
          const normalized = TURKISH_NORMALIZATION_MAP[token] || toTurkishUpper(token);
          normalizedList.push({ original: token, replaced: normalized });
          if (MORSE_CODE_MAP[normalized]) {
            wordMorse.push(MORSE_CODE_MAP[normalized].morse);
          } else {
            wordMorse.push('?');
            unsupportedSet.add(token);
          }
          continue;
        }

        // Standard Latin / Digits / Punctuation
        const upper = token.toUpperCase();
        if (MORSE_CODE_MAP[upper]) {
          wordMorse.push(MORSE_CODE_MAP[upper].morse);
        } else {
          wordMorse.push('?');
          unsupportedSet.add(token);
        }
      }
      return wordMorse.join(' ');
    });
    return morseWords.join(' / ');
  });

  return {
    morseText: morseLines.join('\n'),
    normalizedList,
    unsupportedChars: Array.from(unsupportedSet)
  };
}

/**
 * Decode Morse Code into text with Turkish Extension support.
 * @param {string} morse - Input Morse
 * @param {string} mode - 'standard' or 'extended'
 */
export function translateMorseToTurkish(morse, mode = 'standard') {
  if (!morse) return '';

  const normalized = morse
    .replace(/[•·⋅・●]/g, '.')
    .replace(/[—–−―]/g, '-');

  const lines = normalized.split(/\r?\n/);

  const decodedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    const morseWords = trimmed.split(/\s*\/\s*|\s{3,}/).filter(Boolean);

    const decodedWords = morseWords.map(word => {
      const morseChars = word.trim().split(/\s+/).filter(Boolean);
      return morseChars.map(code => {
        if (!code) return '';

        // In extended mode, check Turkish extended codes first
        if (mode === 'extended') {
          if (code === '-.-..') return 'Ç';
          if (code === '--.-.') return 'Ğ';
          if (code === '---.') return 'Ö';
          if (code === '----') return 'Ş';
          if (code === '..--') return 'Ü';
        }

        // Check Reverse Morse Map
        if (REVERSE_MORSE_MAP[code]) {
          return REVERSE_MORSE_MAP[code].char;
        }

        return '?';
      }).join('');
    });

    return decodedWords.join(' ');
  });

  return decodedLines.join('\n');
}

/**
 * Detailed Character Breakdown for Turkish
 */
export function getTurkishCharacterBreakdown(text, mode = 'standard') {
  if (!text) return [];

  const items = [];
  const tokens = text.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];

  tokens.forEach((token, i) => {
    if (token === ' ' || token === '\n' || token === '\t') {
      items.push({
        char: '[Boşluk]',
        morse: '/',
        phonetic: 'Kelime Boşluğu (7 birim)',
        ditDah: '—',
        isSpace: true,
        originalIndex: i
      });
      return;
    }

    if (token.startsWith('<') && token.endsWith('>')) {
      const upper = token.toUpperCase();
      const mapping = MORSE_CODE_MAP[upper];
      if (mapping) {
        items.push({
          char: upper,
          morse: mapping.morse,
          phonetic: mapping.name,
          ditDah: mapping.ditDah,
          isSpace: false,
          originalIndex: i
        });
        return;
      }
    }

    const isTurkish = ['ç', 'Ç', 'ğ', 'Ğ', 'ı', 'İ', 'ö', 'Ö', 'ş', 'Ş', 'ü', 'Ü'].includes(token);

    if (mode === 'extended' && isTurkish) {
      const upperTr = toTurkishUpper(token);
      const ext = TURKISH_EXTENDED_MAP[upperTr];
      if (ext) {
        items.push({
          char: upperTr,
          morse: ext.morse,
          phonetic: ext.phonetic,
          ditDah: ext.ditDah,
          isSpace: false,
          isExtended: true,
          originalIndex: i
        });
        return;
      }
    }

    if (isTurkish) {
      const norm = TURKISH_NORMALIZATION_MAP[token] || toTurkishUpper(token);
      const mapItem = MORSE_CODE_MAP[norm];
      items.push({
        char: `${token} → ${norm}`,
        morse: mapItem ? mapItem.morse : '?',
        phonetic: mapItem ? `${mapItem.phonetic} (Sadeleştirildi: ${token} → ${norm})` : 'Desteklenmiyor',
        ditDah: mapItem ? mapItem.ditDah : '?',
        isSpace: false,
        isNormalized: true,
        originalIndex: i
      });
      return;
    }

    const upper = token.toUpperCase();
    const mapping = MORSE_CODE_MAP[upper];
    if (mapping) {
      items.push({
        char: upper,
        morse: mapping.morse,
        phonetic: mapping.phonetic || mapping.name,
        ditDah: mapping.ditDah,
        isSpace: false,
        originalIndex: i
      });
    } else {
      items.push({
        char: token,
        morse: '?',
        phonetic: 'Desteklenmeyen Karakter',
        ditDah: '?',
        isSpace: false,
        isUnsupported: true,
        originalIndex: i
      });
    }
  });

  return items;
}
