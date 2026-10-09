/**
 * Spanish Morse Code Engine & Extensions
 * Adheres strictly to ITU-R M.1677-1 international standard while offering
 * documented Spanish telegraph extensions and explicit diacritic normalization.
 */

import { MORSE_CODE_MAP, REVERSE_MORSE_MAP } from './morseMap.js';

// Spanish specific characters
export const SPANISH_SPECIAL_CHARS = ['Ñ', 'ñ', 'Á', 'á', 'É', 'é', 'Í', 'í', 'Ó', 'ó', 'Ú', 'ú', 'Ü', 'ü', '¿', '¡'];

// Documented Spanish Telegraph / Radio Extension Mappings
// Ñ is the most cross-referenced extension (--.-- based on Wikipedia/Gerke-era conventions)
// ¿ (..-.-) and ¡ (--...-) are documented Spanish inverted punctuation extensions
export const SPANISH_EXTENDED_MAP = {
  'Ñ': { morse: '--.--', name: 'Ñ', type: 'spanish-extension', phonetic: 'Eñe (Extensión)', ditDah: 'dah-dah-dit-dah-dah' },
  'ñ': { morse: '--.--', name: 'Ñ', type: 'spanish-extension', phonetic: 'Eñe (Extensión)', ditDah: 'dah-dah-dit-dah-dah' },
  '¿': { morse: '..-.-', name: '¿', type: 'spanish-extension', phonetic: 'Signo de interrogación abierto (Extensión)', ditDah: 'di-di-dah-di-dah' },
  '¡': { morse: '--...-', name: '¡', type: 'spanish-extension', phonetic: 'Signo de exclamación abierto (Extensión)', ditDah: 'dah-dah-di-di-di-dah' }
};

// Documented ITU Standard Normalization (Simplificación)
// Only É is officially defined in ITU-R M.1677-1 as "accented e" (..-..)
// Other accented vowels and characters are normalized to base letters
export const SPANISH_NORMALIZATION_MAP = {
  'Ñ': 'N', 'ñ': 'N',
  'Á': 'A', 'á': 'A',
  'É': 'E', 'é': 'E',
  'Í': 'I', 'í': 'I',
  'Ó': 'O', 'ó': 'O',
  'Ú': 'U', 'ú': 'U',
  'Ü': 'U', 'ü': 'U',
  '¿': '?',
  '¡': '!'
};

// Spanish quick examples showcasing common Spanish phrases
export const SPANISH_QUICK_EXAMPLES = [
  { label: 'HOLA', text: 'HOLA', desc: 'Saludo común en español' },
  { label: 'HOLA MUNDO', text: 'HOLA MUNDO', desc: 'Saludo tradicional de programación' },
  { label: 'TE AMO', text: 'TE AMO', desc: 'Mensaje de amor y afecto' },
  { label: 'SOS', text: 'SOS', desc: 'Señal internacional de socorro (... --- ...)' },
  { label: 'AÑO', text: 'AÑO', desc: 'Ejemplo con letra Ñ' },
  { label: 'CORAZÓN', text: 'CORAZÓN', desc: 'Palabra con acento (normalizada a O)' }
];

/**
 * Convert string to uppercase using Spanish locale rules.
 * Handles accented characters correctly.
 */
export function toSpanishUpper(str) {
  if (!str) return '';
  return str.toLocaleUpperCase('es-ES');
}

/**
 * Detect whether input text contains special Spanish characters.
 */
export function detectSpanishCharacters(text) {
  if (!text) return [];
  const found = new Set();
  for (const char of text) {
    if (['ñ', 'Ñ', 'á', 'Á', 'é', 'É', 'í', 'Í', 'ó', 'Ó', 'ú', 'Ú', 'ü', 'Ü', '¿', '¡'].includes(char)) {
      found.add(char);
    }
  }
  return Array.from(found);
}

/**
 * Translate Spanish text to Morse Code.
 * @param {string} text - Input text
 * @param {string} mode - 'standard' (ITU-R M.1677-1 with normalization) or 'extended' (Spanish extensions)
 */
export function translateSpanishToMorse(text, mode = 'standard') {
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

        // Check if token is a Spanish character
        const isSpanish = ['ñ', 'Ñ', 'á', 'Á', 'é', 'É', 'í', 'Í', 'ó', 'Ó', 'ú', 'Ú', 'ü', 'Ü', '¿', '¡'].includes(token);

        // Check if token is in Spanish extended map (when in extended mode)
        if (mode === 'extended' && SPANISH_EXTENDED_MAP[token]) {
          wordMorse.push(SPANISH_EXTENDED_MAP[token].morse);
          continue;
        }

        // Standard ITU mode or fallback for accents
        if (isSpanish) {
          const normalized = SPANISH_NORMALIZATION_MAP[token] || toSpanishUpper(token);
          if (normalized !== token) {
            normalizedList.push({ original: token, replaced: normalized });
          }
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
 * Decode Morse Code into text with Spanish Extension support.
 * @param {string} morse - Input Morse
 * @param {string} mode - 'standard' or 'extended'
 */
export function translateMorseToSpanish(morse, mode = 'standard') {
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

        // In extended mode, check Spanish extended codes first
        if (mode === 'extended') {
          if (code === '--.--') return 'Ñ';
          if (code === '..-.-') return '¿';
          if (code === '--...-') return '¡';
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
 * Detailed Character Breakdown for Spanish
 */
export function getSpanishCharacterBreakdown(text, mode = 'standard') {
  if (!text) return [];

  const items = [];
  const tokens = text.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];

  tokens.forEach((token, i) => {
    if (token === ' ' || token === '\n' || token === '\t') {
      items.push({
        char: '[Espacio]',
        morse: '/',
        phonetic: 'Espacio entre palabras (7 unidades)',
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

    const isSpanish = ['ñ', 'Ñ', 'á', 'Á', 'é', 'É', 'í', 'Í', 'ó', 'Ó', 'ú', 'Ú', 'ü', 'Ü', '¿', '¡'].includes(token);

    if (mode === 'extended' && SPANISH_EXTENDED_MAP[token]) {
      const ext = SPANISH_EXTENDED_MAP[token];
      items.push({
        char: ext.name || token,
        morse: ext.morse,
        phonetic: ext.phonetic,
        ditDah: ext.ditDah,
        isSpace: false,
        isExtended: true,
        originalIndex: i
      });
      return;
    }

    if (isSpanish) {
      const norm = SPANISH_NORMALIZATION_MAP[token] || toSpanishUpper(token);
      const mapItem = MORSE_CODE_MAP[norm];
      items.push({
        char: `${token} → ${norm}`,
        morse: mapItem ? mapItem.morse : '?',
        phonetic: mapItem ? `${mapItem.phonetic} (Normalizado: ${token} → ${norm})` : 'No compatible',
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
        phonetic: 'Carácter no compatible',
        ditDah: '?',
        isSpace: false,
        isUnsupported: true,
        originalIndex: i
      });
    }
  });

  return items;
}

export const spanishMorseEngine = {
  textToMorse: (text, mode = 'extended') => translateSpanishToMorse(text, mode).morseText,
  morseToText: (morse, mode = 'extended') => translateMorseToSpanish(morse, mode),
  translateSpanishToMorse,
  translateMorseToSpanish,
  getSpanishCharacterBreakdown,
  detectSpanishCharacters,
  toSpanishUpper
};
