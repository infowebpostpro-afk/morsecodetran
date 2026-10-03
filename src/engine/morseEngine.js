import { MORSE_CODE_MAP, REVERSE_MORSE_MAP } from './morseMap.js';

/**
 * Robust Input Type Heuristic
 * Determines if an input string is Morse Code or Normal Text.
 */
export function detectInputType(input) {
  if (!input || !input.trim()) return 'text';

  const clean = input.trim();
  
  // Count morse-specific symbols vs normal text symbols
  let morseCharCount = 0;
  let textCharCount = 0;
  let hasLettersOrNumbers = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (char === '.' || char === '-' || char === '/' || char === ' ' || char === '•' || char === '—') {
      morseCharCount++;
    } else {
      textCharCount++;
      if (/[a-zA-Z0-9]/.test(char)) {
        hasLettersOrNumbers = true;
      }
    }
  }

  // If there are letters/numbers (like 'H', 'E', 'L', 'L', 'O'), it's text
  if (hasLettersOrNumbers) {
    return 'text';
  }

  const ratio = morseCharCount / clean.length;
  // If > 80% dots, dashes, slashes, and spaces, it's Morse
  if (ratio > 0.8) {
    return 'morse';
  }

  return 'text';
}

/**
 * Text to Morse Translation
 * Supports prosigns <SOS>, <AR>, etc. and full Unicode/emojis cleanly without breaking surrogate pairs.
 */
export function translateTextToMorse(text) {
  if (!text) return '';

  const lines = text.split(/\r?\n/);
  const morseLines = lines.map(line => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const morseWords = words.map(word => {
      const tokens = word.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];
      const wordMorse = [];

      for (const token of tokens) {
        const upper = token.toUpperCase();
        if (MORSE_CODE_MAP[upper]) {
          wordMorse.push(MORSE_CODE_MAP[upper].morse);
        } else {
          wordMorse.push('?');
        }
      }
      return wordMorse.join(' ');
    });
    return morseWords.join(' / ');
  });

  return morseLines.join('\n');
}

/**
 * Detailed English to Morse Encoding with Unsupported Character Tracking
 */
export function encodeEnglishDetailed(text) {
  if (!text) {
    return { morseText: '', unsupportedChars: [], hasUnsupported: false };
  }

  const lines = text.split(/\r?\n/);
  const unsupportedSet = new Set();

  const morseLines = lines.map(line => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const morseWords = words.map(word => {
      const tokens = word.match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];
      const wordMorse = [];

      for (const token of tokens) {
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

  const unsupportedChars = Array.from(unsupportedSet);

  return {
    morseText: morseLines.join('\n'),
    unsupportedChars,
    hasUnsupported: unsupportedChars.length > 0
  };
}

/**
 * Normalize Morse input dots and dashes explicitly.
 * Converts common typographical bullets and dashes while strictly preserving word delimiters.
 */
export function normalizeMorseInput(input) {
  if (!input) return '';
  return input
    .replace(/[•·⋅・●]/g, '.')
    .replace(/[—–−―]/g, '-');
}

/**
 * Morse to Text Translation
 */
export function translateMorseToText(morse) {
  if (!morse) return '';

  const normalized = normalizeMorseInput(morse);
  const lines = normalized.split(/\r?\n/);

  const decodedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';

    // Split by word boundaries ('/' or 3+ spaces)
    const morseWords = trimmed.split(/\s*\/\s*|\s{3,}/).filter(Boolean);

    const decodedWords = morseWords.map(word => {
      // Split by character boundary (1 space)
      const morseChars = word.trim().split(/\s+/).filter(Boolean);
      return morseChars.map(code => {
        if (!code) return '';
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
 * Detailed Morse Decoder with Validation Token Tracking
 */
export function decodeMorseDetailed(morse) {
  if (!morse) {
    return { text: '', tokens: [], invalidTokens: [], hasErrors: false };
  }

  const normalized = normalizeMorseInput(morse).trim();
  if (!normalized) {
    return { text: '', tokens: [], invalidTokens: [], hasErrors: false };
  }

  const morseWords = normalized.split(/\s*\/\s*|\s{3,}/).filter(Boolean);
  const tokens = [];
  const invalidTokens = [];
  const textWords = [];

  morseWords.forEach((wordStr, wordIdx) => {
    if (wordIdx > 0) {
      tokens.push({ code: '/', char: ' ', isSpace: true, isInvalid: false });
    }

    const morseChars = wordStr.trim().split(/\s+/).filter(Boolean);
    const wordDecoded = morseChars.map(code => {
      if (!code) return '';

      if (REVERSE_MORSE_MAP[code]) {
        const decodedChar = REVERSE_MORSE_MAP[code].char;
        tokens.push({ code, char: decodedChar, isSpace: false, isInvalid: false });
        return decodedChar;
      } else {
        tokens.push({ code, char: '?', isSpace: false, isInvalid: true });
        if (!invalidTokens.includes(code)) {
          invalidTokens.push(code);
        }
        return '?';
      }
    }).join('');

    textWords.push(wordDecoded);
  });

  return {
    text: textWords.join(' '),
    tokens,
    invalidTokens,
    hasErrors: invalidTokens.length > 0
  };
}

/**
 * Character-by-Character Breakdown
 */
export function getCharacterBreakdown(text, morse) {
  if (!text && !morse) return [];

  const items = [];
  const tokens = (text || '').match(/<[A-Za-z0-9]+>|[\s\S]/gu) || [];
  
  tokens.forEach((token, i) => {
    if (token === ' ' || token === '\n' || token === '\t') {
      items.push({
        char: '[Space]',
        morse: '/',
        phonetic: 'Word Space',
        ditDah: '—',
        isSpace: true,
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
        phonetic: 'Unsupported',
        ditDah: '?',
        isSpace: false,
        originalIndex: i
      });
    }
  });

  return items;
}

/**
 * Transmission Metrics & Timing Statistics (Paris Standard / ITU-R M.1677-1)
 * Standard word "PARIS " = 50 dot units.
 * Dot unit length (T_dot in sec) = 1.2 / WPM.
 */
export function calculateStatistics(text, morse, wpm = 20, farnsworthWpm = 20) {
  const cleanText = text ? text.trim() : '';
  const cleanMorse = morse ? morse.trim() : '';

  if (!cleanMorse) {
    return {
      characterCount: cleanText.length,
      wordCount: cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0,
      dotsCount: 0,
      dashesCount: 0,
      charSpaces: 0,
      wordSpaces: 0,
      transmissionTimeSec: 0,
      dotDashRatio: '0.00'
    };
  }

  const effectiveWpm = Math.min(wpm, farnsworthWpm || wpm);
  const useFarnsworth = farnsworthWpm < wpm;

  const charSpeedUnit = 1.2 / wpm; // seconds per dot unit at char WPM
  const spacingSpeedUnit = useFarnsworth ? (1.2 / effectiveWpm) : charSpeedUnit;

  const words = cleanMorse.split(/\s*\/\s*|\s{3,}/).filter(Boolean);
  let dotsCount = 0;
  let dashesCount = 0;
  let interElementSpaces = 0;
  let interCharSpaces = 0;
  let wordSpaces = words.length > 1 ? words.length - 1 : 0;

  words.forEach(word => {
    const chars = word.trim().split(/\s+/).filter(Boolean);
    if (chars.length > 1) {
      interCharSpaces += chars.length - 1;
    }
    chars.forEach(ch => {
      let elements = 0;
      for (const symbol of ch) {
        if (symbol === '.') {
          dotsCount++;
          elements++;
        } else if (symbol === '-') {
          dashesCount++;
          elements++;
        }
      }
      if (elements > 1) {
        interElementSpaces += elements - 1;
      }
    });
  });

  // Sound duration
  const toneDurationSec = (dotsCount * 1 + dashesCount * 3) * charSpeedUnit;

  // Pause duration (inter-element at char speed, inter-char and word at spacing speed)
  const pauseDurationSec = (interElementSpaces * 1 * charSpeedUnit)
    + (interCharSpaces * 3 * spacingSpeedUnit)
    + (wordSpaces * 7 * spacingSpeedUnit);

  const totalTimeSec = (toneDurationSec + pauseDurationSec).toFixed(2);
  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : words.length;
  const characterCount = cleanText ? cleanText.length : 0;

  return {
    characterCount,
    wordCount,
    dotsCount,
    dashesCount,
    charSpaces: interCharSpaces,
    wordSpaces,
    transmissionTimeSec: parseFloat(totalTimeSec),
    dotDashRatio: dashesCount > 0 ? (dotsCount / dashesCount).toFixed(2) : dotsCount.toString()
  };
}
