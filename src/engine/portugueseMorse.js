/**
 * Brazilian Portuguese Morse Code Engine & Normalization Policy
 *
 * Adheres strictly to ITU-R M.1677-1 international Morse code standard while implementing
 * an explicit diacritic normalization and character handling policy for Brazilian Portuguese.
 */

import { MORSE_CODE_MAP, REVERSE_MORSE_MAP } from './morseMap.js';

// Approved preset examples from specifications
export const PORTUGUESE_EXAMPLES = [
  { label: 'OI', text: 'OI', morse: '--- ..', desc: 'Saudação curta em português' },
  { label: 'OLA MUNDO', text: 'OLA MUNDO', morse: '--- .-.. .- / -- ..- -. -.. ---', desc: 'Clássico "Olá Mundo" de programação' },
  { label: 'SOS', text: 'SOS', morse: '... --- ...', desc: 'Sinal internacional de socorro (... --- ...)' },
  { label: 'AJUDA', text: 'AJUDA', morse: '.- .--- ..- -.. .-', desc: 'Pedido de auxílio' },
  { label: 'OBRIGADO', text: 'OBRIGADO', morse: '--- -... .-. .. --. .- -.. ---', desc: 'Agradecimento cordial' },
  { label: 'EU TE AMO', text: 'EU TE AMO', morse: '. ..- / - . / .- -- ---', desc: 'Declaração de afeto em três palavras' }
];

// Mapping of Portuguese accented and special characters to base Latin letters
export const PORTUGUESE_NORMALIZATION_MAP = {
  'á': 'A', 'à': 'A', 'â': 'A', 'ã': 'A', 'ä': 'A',
  'Á': 'A', 'À': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A',
  'é': 'E', 'ê': 'E', 'è': 'E', 'ë': 'E',
  'É': 'E', 'Ê': 'E', 'È': 'E', 'Ë': 'E',
  'í': 'I', 'ì': 'I', 'î': 'I', 'ï': 'I',
  'Í': 'I', 'Ì': 'I', 'Î': 'I', 'Ï': 'I',
  'ó': 'O', 'ò': 'O', 'ô': 'O', 'õ': 'O', 'ö': 'O',
  'Ó': 'O', 'Ò': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
  'ú': 'U', 'ù': 'U', 'û': 'U', 'ü': 'U',
  'Ú': 'U', 'Ù': 'U', 'Û': 'U', 'Ü': 'U',
  'ç': 'C',
  'Ç': 'C'
};

/**
 * Normalize string to uppercase base letters according to Brazilian Portuguese normalization policy.
 * Handles both precomposed characters and decomposed Unicode combining marks consistently.
 */
export function normalizePortugueseText(str) {
  if (!str) return { normalized: '', hasNormalization: false, normalizedChars: [] };

  // First convert to canonical precomposed form (NFC) so combining accents unify with base letters
  const canonical = str.normalize('NFC');
  let hasNormalization = false;
  const normalizedChars = [];

  const chars = Array.from(canonical);
  const result = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    // Check direct precomposed mapping
    if (PORTUGUESE_NORMALIZATION_MAP[ch]) {
      const base = PORTUGUESE_NORMALIZATION_MAP[ch];
      result.push(base);
      hasNormalization = true;
      normalizedChars.push({ original: ch, replaced: base });
      continue;
    }

    // Check if character with decomposed combining mark
    const decomposed = ch.normalize('NFD');
    if (decomposed.length > 1) {
      const baseChar = decomposed[0].toUpperCase();
      if (/[A-Z]/.test(baseChar)) {
        result.push(baseChar);
        hasNormalization = true;
        normalizedChars.push({ original: ch, replaced: baseChar });
        continue;
      }
    }

    // Default uppercase
    const upper = ch.toLocaleUpperCase('pt-BR');
    result.push(upper);
  }

  const finalNormalized = result.join('').replace(/[\u0300-\u036f]/g, '');

  return {
    normalized: finalNormalized,
    hasNormalization,
    normalizedChars
  };
}

/**
 * Translate Portuguese text to Morse Code.
 * Follows the explicit normalization policy:
 * - Lowercase converted to uppercase
 * - Accented Portuguese letters normalized to base letters (á/à/â/ã → A, é/ê → E, í → I, ó/ô/õ → O, ú/ü → U, ç → C)
 * - Word boundaries preserved (spaces → /)
 * - Unsupported characters identified without silent omission or fake mappings
 */
export function translatePortugueseToMorse(text) {
  if (!text) {
    return {
      morseText: '',
      normalizedText: '',
      hasNormalization: false,
      hasNormalizedDiacritics: false,
      hasUnsupported: false,
      unsupportedChars: [],
      error: null
    };
  }

  const { normalized, hasNormalization, normalizedChars } = normalizePortugueseText(text);
  const unsupportedSet = new Set();
  const lines = text.split(/\r?\n/);

  const morseLines = lines.map(line => {
    // Preserve words separated by whitespace
    const words = line.trim().split(/\s+/).filter(Boolean);
    const morseWords = words.map(word => {
      // Tokenize for prosigns <SOS> or individual characters (including unicode surrogate pairs)
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

        // Apply Portuguese normalization
        let charToEncode = token;
        if (PORTUGUESE_NORMALIZATION_MAP[token]) {
          charToEncode = PORTUGUESE_NORMALIZATION_MAP[token];
        } else {
          // Check decomposed form
          const decomposed = token.normalize('NFD');
          if (decomposed.length > 1 && /[A-Za-z]/.test(decomposed[0])) {
            charToEncode = decomposed[0].toUpperCase();
          } else {
            charToEncode = token.toUpperCase();
          }
        }

        if (MORSE_CODE_MAP[charToEncode]) {
          wordMorse.push(MORSE_CODE_MAP[charToEncode].morse);
        } else {
          wordMorse.push('?');
          unsupportedSet.add(token);
        }
      }

      return wordMorse.join(' ');
    });

    return morseWords.join(' / ');
  });

  const unsupportedChars = Array.from(unsupportedSet);
  let error = null;
  if (unsupportedChars.length > 0) {
    error = `Caracteres não compatíveis: ${unsupportedChars.join(', ')}. Remova ou substitua esses caracteres para concluir a conversão.`;
  }

  return {
    morseText: morseLines.join('\n'),
    normalizedText: normalized,
    hasNormalization,
    hasNormalizedDiacritics: hasNormalization,
    normalizedChars,
    hasUnsupported: unsupportedChars.length > 0,
    unsupportedChars,
    error
  };
}

/**
 * Decode Morse Code into Portuguese Text.
 * - Checks for unrecognized sequences
 * - Validates character and word boundary separation
 * - Returns structured error messages if boundaries or sequences are invalid
 */
export function translateMorseToPortuguese(morse) {
  if (!morse) {
    return {
      text: '',
      unrecognizedSequences: [],
      hasUnrecognizedMorse: false,
      lacksBoundaries: false,
      hasAmbiguousLetters: false,
      error: null
    };
  }

  // Normalize common dot and dash variants
  const cleaned = morse
    .replace(/[•·⋅・●]/g, '.')
    .replace(/[—–−―]/g, '-');

  const lines = cleaned.split(/\r?\n/);
  const unrecognizedSet = new Set();
  let lacksBoundaries = false;

  const decodedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Split words by slash or 3+ spaces
    const morseWords = trimmed.split(/\s*\/\s*|\s{3,}/).filter(Boolean);

    const decodedWords = morseWords.map(word => {
      // Split characters by spaces
      const morseChars = word.trim().split(/\s+/).filter(Boolean);

      return morseChars.map(code => {
        if (!code) return '';

        // If an uninterrupted code of dots and dashes is > 6 symbols, it lacks character spacing boundaries
        if (code.length > 6 && /^[.-]+$/.test(code)) {
          lacksBoundaries = true;
          unrecognizedSet.add(code);
          return '?';
        }

        // Check if token matches standard reverse morse map or prosign
        if (REVERSE_MORSE_MAP[code]) {
          return REVERSE_MORSE_MAP[code].char;
        }

        unrecognizedSet.add(code);
        return '?';
      }).join('');
    });

    return decodedWords.join(' ');
  });

  const unrecognizedSequences = Array.from(unrecognizedSet);
  let error = null;

  if (lacksBoundaries) {
    error = 'Não foi possível identificar todas as letras. Separe cada caractere Morse com um espaço e cada palavra com /.';
  } else if (unrecognizedSequences.length > 0) {
    error = `Sequência Morse não reconhecida: ${unrecognizedSequences.join(', ')}. Confira os pontos, traços e espaços.`;
  }

  return {
    text: decodedLines.join('\n'),
    unrecognizedSequences,
    hasUnrecognizedMorse: unrecognizedSequences.length > 0,
    lacksBoundaries,
    hasAmbiguousLetters: lacksBoundaries,
    error
  };
}

/**
 * Character breakdown generator for Brazilian Portuguese interactive flow and auditory playback
 */
export function getPortugueseCharacterBreakdown(text) {
  if (!text) return [];

  const items = [];
  const tokens = text.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];

  tokens.forEach((token, i) => {
    if (token === ' ' || token === '\n' || token === '\t') {
      items.push({
        char: '[Espaço]',
        morse: '/',
        phonetic: 'Pausa entre palavras (7 unidades)',
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

    // Portuguese accented character check
    if (PORTUGUESE_NORMALIZATION_MAP[token]) {
      const norm = PORTUGUESE_NORMALIZATION_MAP[token];
      const mapping = MORSE_CODE_MAP[norm];
      items.push({
        char: `${token} → ${norm}`,
        morse: mapping ? mapping.morse : '?',
        phonetic: mapping ? `${mapping.phonetic || norm} (Normalizado: ${token} → ${norm})` : 'Não compatível',
        ditDah: mapping ? mapping.ditDah : '?',
        isSpace: false,
        isNormalized: true,
        originalIndex: i
      });
      return;
    }

    // Check decomposed combining mark
    const decomposed = token.normalize('NFD');
    if (decomposed.length > 1 && /[A-Za-z]/.test(decomposed[0])) {
      const norm = decomposed[0].toUpperCase();
      const mapping = MORSE_CODE_MAP[norm];
      items.push({
        char: `${token} → ${norm}`,
        morse: mapping ? mapping.morse : '?',
        phonetic: mapping ? `${mapping.phonetic || norm} (Normalizado: ${token} → ${norm})` : 'Não compatível',
        ditDah: mapping ? mapping.ditDah : '?',
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
        phonetic: 'Caractere não compatível',
        ditDah: '?',
        isSpace: false,
        isUnsupported: true,
        originalIndex: i
      });
    }
  });

  return items;
}

/**
 * Portuguese numbers to Morse conversion.
 * Strictly preserves leading zeros (string-based processing, no integer casting).
 * Rejects letters and non-supported characters with the specified error message.
 */
export function translatePortugueseNumbersToMorse(inputStr) {
  if (!inputStr) {
    return {
      morseText: '',
      hasInvalid: false,
      invalidChars: [],
      error: null
    };
  }

  const DIGIT_MAP = {
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.'
  };

  const invalidChars = [];
  const lines = inputStr.split(/\r?\n/);

  const morseLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Split words / number sequences by whitespace
    const words = trimmed.split(/\s+/).filter(Boolean);
    const morseWords = words.map(word => {
      const chars = Array.from(word);
      const wordMorse = [];

      for (const ch of chars) {
        if (DIGIT_MAP[ch]) {
          wordMorse.push(DIGIT_MAP[ch]);
        } else {
          wordMorse.push('?');
          if (!invalidChars.includes(ch)) {
            invalidChars.push(ch);
          }
        }
      }

      return wordMorse.join(' ');
    });

    return morseWords.join(' / ');
  });

  const hasInvalid = invalidChars.length > 0;
  let error = null;
  if (hasInvalid) {
    error = 'Este conversor aceita números de 0 a 9. Para letras e pontuação, use o tradutor completo.';
  }

  return {
    morseText: morseLines.join('\n'),
    hasInvalid,
    invalidChars,
    error
  };
}

/**
 * Decode Morse code strictly to numbers. Preserves leading zeros!
 */
export function translateMorseToPortugueseNumbers(morseStr) {
  if (!morseStr) {
    return {
      text: '',
      hasInvalid: false,
      invalidGroups: [],
      error: null
    };
  }

  const REVERSE_DIGIT_MAP = {
    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9'
  };

  const cleaned = morseStr
    .replace(/[•·⋅・●]/g, '.')
    .replace(/[—–−―]/g, '-');

  const invalidGroups = [];
  const lines = cleaned.split(/\r?\n/);

  const decodedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    const words = trimmed.split(/\s*\/\s*|\s{3,}/).filter(Boolean);
    const decodedWords = words.map(word => {
      const groups = word.trim().split(/\s+/).filter(Boolean);
      return groups.map(g => {
        if (REVERSE_DIGIT_MAP[g]) {
          return REVERSE_DIGIT_MAP[g];
        }
        invalidGroups.push(g);
        return '?';
      }).join('');
    });

    return decodedWords.join(' ');
  });

  const hasInvalid = invalidGroups.length > 0;
  let error = null;
  if (hasInvalid) {
    error = 'Há grupos que não correspondem a dígitos de 0 a 9. Confira os pontos e traços.';
  }

  return {
    text: decodedLines.join('\n'),
    hasInvalid,
    invalidGroups,
    error
  };
}

/**
 * Diagnostic decoder for Brazilian Portuguese Morse troubleshooting page.
 * Inspects every group, word separator, and invalid sequence.
 */
export function diagnosePortugueseMorse(morseStr) {
  if (!morseStr || !morseStr.trim()) {
    return {
      recognizedText: '',
      groups: [],
      allValid: true,
      hasInvalid: false,
      hasAmbiguous: false,
      summaryMessage: 'Digite uma mensagem para começar.'
    };
  }

  const cleaned = morseStr
    .replace(/[•·⋅・●]/g, '.')
    .replace(/[—–−―]/g, '-');

  // Tokenize preserving slashes, spaces, and character groups
  const rawTokens = cleaned.trim().split(/\s+/);
  const groups = [];
  const recognizedWords = [];
  let currentWord = [];
  let allValid = true;
  let hasAmbiguous = false;

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];

    if (token === '/') {
      groups.push({
        index: i,
        group: '/',
        result: ' ',
        status: 'Separador de palavra',
        isValid: true,
        isSeparator: true
      });
      if (currentWord.length > 0) {
        recognizedWords.push(currentWord.join(''));
        currentWord = [];
      }
      continue;
    }

    // Check for tokens that contain slash attached, e.g. ".-/-..."
    if (token.includes('/') && token !== '/') {
      const subTokens = token.split(/(\/)/);
      for (const sub of subTokens) {
        if (!sub) continue;
        if (sub === '/') {
          groups.push({
            index: groups.length,
            group: '/',
            result: ' ',
            status: 'Separador de palavra',
            isValid: true,
            isSeparator: true
          });
          if (currentWord.length > 0) {
            recognizedWords.push(currentWord.join(''));
            currentWord = [];
          }
        } else if (REVERSE_MORSE_MAP[sub]) {
          const char = REVERSE_MORSE_MAP[sub].char;
          groups.push({
            index: groups.length,
            group: sub,
            result: char,
            status: 'Reconhecido',
            isValid: true,
            isSeparator: false
          });
          currentWord.push(char);
        } else {
          allValid = false;
          if (sub.length > 6 && /^[.-]+$/.test(sub)) {
            hasAmbiguous = true;
          }
          groups.push({
            index: groups.length,
            group: sub,
            result: '?',
            status: 'Não reconhecido',
            isValid: false,
            isSeparator: false
          });
          currentWord.push('?');
        }
      }
      continue;
    }

    if (REVERSE_MORSE_MAP[token]) {
      const char = REVERSE_MORSE_MAP[token].char;
      groups.push({
        index: i,
        group: token,
        result: char,
        status: 'Reconhecido',
        isValid: true,
        isSeparator: false
      });
      currentWord.push(char);
    } else {
      allValid = false;
      if (token.length > 6 && /^[.-]+$/.test(token)) {
        hasAmbiguous = true;
      }
      groups.push({
        index: i,
        group: token,
        result: '?',
        status: 'Não reconhecido',
        isValid: false,
        isSeparator: false
      });
      currentWord.push('?');
    }
  }

  if (currentWord.length > 0) {
    recognizedWords.push(currentWord.join(''));
  }

  const recognizedText = recognizedWords.join(' ');
  const summaryMessage = allValid
    ? 'Todos os grupos foram reconhecidos. Confira se o espaçamento corresponde à mensagem original.'
    : 'Há grupos que precisam de revisão. O texto reconhecido ainda pode estar incompleto.';

  return {
    recognizedText,
    groups,
    allValid,
    hasInvalid: !allValid,
    hasAmbiguous,
    summaryMessage
  };
}
