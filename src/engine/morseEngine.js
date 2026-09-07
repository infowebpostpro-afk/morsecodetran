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
 */
export function translateTextToMorse(text, options = {}) {
  if (!text) return '';

  const uppercase = text.toUpperCase();
  const words = uppercase.split(/\s+/);
  
  const morseWords = words.map(word => {
    let wordMorse = [];
    let i = 0;
    
    while (i < word.length) {
      // Check for prosigns enclosed in brackets like <SOS>, <AR>
      if (word[i] === '<') {
        const closeIdx = word.indexOf('>', i);
        if (closeIdx !== -1) {
          const prosign = word.substring(i, closeIdx + 1);
          if (MORSE_CODE_MAP[prosign]) {
            wordMorse.push(MORSE_CODE_MAP[prosign].morse);
            i = closeIdx + 1;
            continue;
          }
        }
      }

      const char = word[i];
      if (MORSE_CODE_MAP[char]) {
        wordMorse.push(MORSE_CODE_MAP[char].morse);
      } else {
        // Fallback or unmappable char
        wordMorse.push('?');
      }
      i++;
    }
    return wordMorse.join(' ');
  });

  return morseWords.join(' / ');
}

/**
 * Detailed English to Morse Encoding with Unsupported Character Tracking
 */
export function encodeEnglishDetailed(text) {
  if (!text) {
    return { morseText: '', unsupportedChars: [], hasUnsupported: false };
  }

  const uppercase = text.toUpperCase();
  const words = uppercase.split(/\s+/);
  const unsupportedSet = new Set();

  const morseWords = words.map(word => {
    let wordMorse = [];
    let i = 0;

    while (i < word.length) {
      if (word[i] === '<') {
        const closeIdx = word.indexOf('>', i);
        if (closeIdx !== -1) {
          const prosign = word.substring(i, closeIdx + 1);
          if (MORSE_CODE_MAP[prosign]) {
            wordMorse.push(MORSE_CODE_MAP[prosign].morse);
            i = closeIdx + 1;
            continue;
          }
        }
      }

      const char = word[i];
      if (MORSE_CODE_MAP[char]) {
        wordMorse.push(MORSE_CODE_MAP[char].morse);
      } else {
        wordMorse.push('?');
        unsupportedSet.add(char);
      }
      i++;
    }
    return wordMorse.join(' ');
  });

  const unsupportedChars = Array.from(unsupportedSet);

  return {
    morseText: morseWords.join(' / '),
    unsupportedChars,
    hasUnsupported: unsupportedChars.length > 0
  };
}

/**
 * Normalize Morse input dots and dashes
 */
export function normalizeMorseInput(input) {
  if (!input) return '';
  return input
    .replace(/[•·]/g, '.')
    .replace(/[—–−]/g, '-');
}

/**
 * Morse to Text Translation
 */
export function translateMorseToText(morse) {
  if (!morse) return '';

  // Normalize dots & dashes (support bullets, em-dash, en-dash, minus)
  const normalized = normalizeMorseInput(morse).trim();

  if (!normalized) return '';

  // Split by word boundaries ('/' or 3+ spaces)
  const morseWords = normalized.split(/\s*\/\s*|\s{3,}/);

  const decodedWords = morseWords.map(word => {
    // Split by character boundary (1 space)
    const morseChars = word.trim().split(/\s+/);
    return morseChars.map(code => {
      if (!code) return '';
      if (REVERSE_MORSE_MAP[code]) {
        return REVERSE_MORSE_MAP[code].char.replace(/^<|>$ /g, '');
      }
      return '[Unknown]';
    }).join('');
  });

  return decodedWords.join(' ');
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

  const morseWords = normalized.split(/\s*\/\s*|\s{3,}/);
  const tokens = [];
  const invalidTokens = [];
  const textWords = [];

  morseWords.forEach((wordStr, wordIdx) => {
    if (wordIdx > 0) {
      tokens.push({ code: '/', char: ' ', isSpace: true, isInvalid: false });
    }

    const morseChars = wordStr.trim().split(/\s+/);
    const wordDecoded = morseChars.map(code => {
      if (!code) return '';

      if (REVERSE_MORSE_MAP[code]) {
        const decodedChar = REVERSE_MORSE_MAP[code].char.replace(/^<|>$ /g, '');
        tokens.push({ code, char: decodedChar, isSpace: false, isInvalid: false });
        return decodedChar;
      } else {
        tokens.push({ code, char: '[Unknown]', isSpace: false, isInvalid: true });
        if (!invalidTokens.includes(code)) {
          invalidTokens.push(code);
        }
        return '[Unknown]';
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
  const uppercase = text.toUpperCase();
  
  for (let i = 0; i < uppercase.length; i++) {
    const char = uppercase[i];
    if (char === ' ') {
      items.push({
        char: '[Space]',
        morse: '/',
        phonetic: 'Word Space',
        ditDah: '—',
        isSpace: true,
        originalIndex: i
      });
      continue;
    }

    const mapping = MORSE_CODE_MAP[char];
    if (mapping) {
      items.push({
        char,
        morse: mapping.morse,
        phonetic: mapping.phonetic || mapping.name,
        ditDah: mapping.ditDah,
        isSpace: false,
        originalIndex: i
      });
    } else {
      items.push({
        char,
        morse: '?',
        phonetic: 'Unsupported',
        ditDah: '?',
        isSpace: false,
        originalIndex: i
      });
    }
  }

  return items;
}

/**
 * Transmission Metrics & Timing Statistics (Paris Standard)
 * Paris standard: "PARIS " = 50 dot units.
 * Dot unit length (T_dot in sec) = 1.2 / WPM.
 */
export function calculateStatistics(text, morse, wpm = 20, farnsworthWpm = 20) {
  const cleanText = text ? text.trim() : '';
  const cleanMorse = morse ? morse.trim() : '';

  let dotsCount = 0;
  let dashesCount = 0;
  let charSpaces = 0;
  let wordSpaces = 0;

  for (let i = 0; i < cleanMorse.length; i++) {
    const char = cleanMorse[i];
    if (char === '.') dotsCount++;
    else if (char === '-') dashesCount++;
    else if (char === ' ') charSpaces++;
    else if (char === '/') wordSpaces++;
  }

  const effectiveWpm = Math.min(wpm, farnsworthWpm || wpm);
  const useFarnsworth = farnsworthWpm < wpm;

  // Paris Formula unit timing:
  // Dot = 1 unit
  // Dash = 3 units
  // Space between symbols within char = 1 unit
  // Space between chars = 3 units (or scaled for Farnsworth)
  // Space between words = 7 units (or scaled for Farnsworth)

  const charSpeedUnit = 1.2 / wpm; // seconds per dot unit at char WPM
  const spacingSpeedUnit = useFarnsworth ? (1.2 / effectiveWpm) : charSpeedUnit;

  // Sound duration
  const toneUnits = (dotsCount * 1) + (dashesCount * 3);
  const toneDurationSec = toneUnits * charSpeedUnit;

  // Pause duration
  // Symbol space (1 unit) uses char speed
  // Char space (3 units) & Word space (7 units) use spacing speed
  const pauseDurationSec = (dotsCount + dashesCount > 0 ? (dotsCount + dashesCount - 1) * charSpeedUnit : 0)
    + (charSpaces * 3 * spacingSpeedUnit)
    + (wordSpaces * 7 * spacingSpeedUnit);

  const totalTimeSec = (toneDurationSec + pauseDurationSec).toFixed(1);

  const wordCount = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const characterCount = cleanText ? cleanText.length : 0;

  return {
    characterCount,
    wordCount,
    dotsCount,
    dashesCount,
    charSpaces,
    wordSpaces,
    transmissionTimeSec: parseFloat(totalTimeSec),
    dotDashRatio: dashesCount > 0 ? (dotsCount / dashesCount).toFixed(2) : dotsCount
  };
}
