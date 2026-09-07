/**
 * Canonical International Morse Code Data Structure
 * Adheres to ITU-R M.1677-1 standard.
 */

export const MORSE_CODE_MAP = {
  // Letters
  'A': { morse: '.-', name: 'A', type: 'letter', phonetic: 'Alpha', ditDah: 'di-dah' },
  'B': { morse: '-...', name: 'B', type: 'letter', phonetic: 'Bravo', ditDah: 'dah-di-di-dit' },
  'C': { morse: '-.-.', name: 'C', type: 'letter', phonetic: 'Charlie', ditDah: 'dah-di-dah-dit' },
  'D': { morse: '-..', name: 'D', type: 'letter', phonetic: 'Delta', ditDah: 'dah-di-dit' },
  'E': { morse: '.', name: 'E', type: 'letter', phonetic: 'Echo', ditDah: 'dit' },
  'F': { morse: '..-.', name: 'F', type: 'letter', phonetic: 'Foxtrot', ditDah: 'di-di-dah-dit' },
  'G': { morse: '--.', name: 'G', type: 'letter', phonetic: 'Golf', ditDah: 'dah-dah-dit' },
  'H': { morse: '....', name: 'H', type: 'letter', phonetic: 'Hotel', ditDah: 'di-di-di-dit' },
  'I': { morse: '..', name: 'I', type: 'letter', phonetic: 'India', ditDah: 'di-dit' },
  'J': { morse: '.---', name: 'J', type: 'letter', phonetic: 'Juliett', ditDah: 'di-dah-dah-dah' },
  'K': { morse: '-.-', name: 'K', type: 'letter', phonetic: 'Kilo', ditDah: 'dah-di-dah' },
  'L': { morse: '.-..', name: 'L', type: 'letter', phonetic: 'Lima', ditDah: 'di-dah-di-dit' },
  'M': { morse: '--', name: 'M', type: 'letter', phonetic: 'Mike', ditDah: 'dah-dah' },
  'N': { morse: '-.', name: 'N', type: 'letter', phonetic: 'November', ditDah: 'dah-dit' },
  'O': { morse: '---', name: 'O', type: 'letter', phonetic: 'Oscar', ditDah: 'dah-dah-dah' },
  'P': { morse: '.--.', name: 'P', type: 'letter', phonetic: 'Papa', ditDah: 'di-dah-dah-dit' },
  'Q': { morse: '--.-', name: 'Q', type: 'letter', phonetic: 'Quebec', ditDah: 'dah-dah-di-dah' },
  'R': { morse: '.-.', name: 'R', type: 'letter', phonetic: 'Romeo', ditDah: 'di-dah-dit' },
  'S': { morse: '...', name: 'S', type: 'letter', phonetic: 'Sierra', ditDah: 'di-di-dit' },
  'T': { morse: '-', name: 'T', type: 'letter', phonetic: 'Tango', ditDah: 'dah' },
  'U': { morse: '..-', name: 'U', type: 'letter', phonetic: 'Uniform', ditDah: 'di-di-dah' },
  'V': { morse: '...-', name: 'V', type: 'letter', phonetic: 'Victor', ditDah: 'di-di-di-dah' },
  'W': { morse: '.--', name: 'W', type: 'letter', phonetic: 'Whiskey', ditDah: 'di-dah-dah' },
  'X': { morse: '-..-', name: 'X', type: 'letter', phonetic: 'X-ray', ditDah: 'dah-di-di-dah' },
  'Y': { morse: '-.--', name: 'Y', type: 'letter', phonetic: 'Yankee', ditDah: 'dah-di-dah-dah' },
  'Z': { morse: '--..', name: 'Z', type: 'letter', phonetic: 'Zulu', ditDah: 'dah-dah-di-dit' },

  // Numbers
  '0': { morse: '-----', name: '0', type: 'number', phonetic: 'Zero', ditDah: 'dah-dah-dah-dah-dah' },
  '1': { morse: '.----', name: '1', type: 'number', phonetic: 'One', ditDah: 'di-dah-dah-dah-dah' },
  '2': { morse: '..---', name: '2', type: 'number', phonetic: 'Two', ditDah: 'di-di-dah-dah-dah' },
  '3': { morse: '...--', name: '3', type: 'number', phonetic: 'Three', ditDah: 'di-di-di-dah-dah' },
  '4': { morse: '....-', name: '4', type: 'number', phonetic: 'Four', ditDah: 'di-di-di-di-dah' },
  '5': { morse: '.....', name: '5', type: 'number', phonetic: 'Five', ditDah: 'di-di-di-di-dit' },
  '6': { morse: '-....', name: '6', type: 'number', phonetic: 'Six', ditDah: 'dah-di-di-di-dit' },
  '7': { morse: '--...', name: '7', type: 'number', phonetic: 'Seven', ditDah: 'dah-dah-di-di-dit' },
  '8': { morse: '---..', name: '8', type: 'number', phonetic: 'Eight', ditDah: 'dah-dah-dah-di-dit' },
  '9': { morse: '----.', name: '9', type: 'number', phonetic: 'Nine', ditDah: 'dah-dah-dah-dah-dit' },

  // Punctuation
  '.': { morse: '.-.-.-', name: 'Period (.)', type: 'punctuation', ditDah: 'di-dah-di-dah-di-dah' },
  ',': { morse: '--..--', name: 'Comma (,)', type: 'punctuation', ditDah: 'dah-dah-di-di-dah-dah' },
  '?': { morse: '..--..', name: 'Question (?)', type: 'punctuation', ditDah: 'di-di-dah-dah-di-dit' },
  "'": { morse: '.----.', name: 'Apostrophe (\')', type: 'punctuation', ditDah: 'di-dah-dah-dah-dah-dit' },
  '/': { morse: '-..-.', name: 'Slash (/)', type: 'punctuation', ditDah: 'dah-di-di-dah-dit' },
  '(': { morse: '-.--.', name: 'Open Paren (', type: 'punctuation', ditDah: 'dah-di-dah-dah-dit' },
  ')': { morse: '-.--.-', name: 'Close Paren )', type: 'punctuation', ditDah: 'dah-di-dah-dah-di-dah' },
  ':': { morse: '---...', name: 'Colon (:)', type: 'punctuation', ditDah: 'dah-dah-dah-di-di-dit' },
  ';': { morse: '-.-.-.', name: 'Semicolon (;)', type: 'punctuation', ditDah: 'dah-di-dah-di-dah-dit' },
  '-': { morse: '-....-', name: 'Hyphen (-)', type: 'punctuation', ditDah: 'dah-di-di-di-di-dah' },
  '+': { morse: '.-.-.', name: 'Plus (+)', type: 'punctuation', ditDah: 'di-dah-di-dah-dit' },
  '=': { morse: '-...-', name: 'Equals (=)', type: 'punctuation', ditDah: 'dah-di-di-di-dah' },
  '@': { morse: '.--.-.', name: 'At Symbol (@)', type: 'punctuation', ditDah: 'di-dah-dah-di-dah-dit' },
  '"': { morse: '.-..-.', name: 'Quote (")', type: 'punctuation', ditDah: 'di-dah-di-di-dah-dit' },
  '!': { morse: '-.-.--', name: 'Exclamation (!)', type: 'punctuation', ditDah: 'dah-di-dah-di-dah-dah' },
  '&': { morse: '.-...', name: 'Ampersand (&)', type: 'punctuation', ditDah: 'di-dah-di-di-dit' },
  '_': { morse: '..--.-', name: 'Underscore (_)', type: 'punctuation', ditDah: 'di-di-dah-dah-di-dah' },
  '$': { morse: '...-..-', name: 'Dollar ($)', type: 'punctuation', ditDah: 'di-di-di-dah-di-di-dah' },

  // Special Prosigns
  '<AR>': { morse: '.-.-.', name: 'AR (End of Message)', type: 'prosign', ditDah: 'di-dah-di-dah-dit' },
  '<BT>': { morse: '-...-', name: 'BT (New Paragraph)', type: 'prosign', ditDah: 'dah-di-di-di-dah' },
  '<SK>': { morse: '...-.-', name: 'SK (End of Work)', type: 'prosign', ditDah: 'di-di-di-dah-di-dah' },
  '<KN>': { morse: '-.--.', name: 'KN (Go Ahead Named)', type: 'prosign', ditDah: 'dah-di-dah-dah-dit' },
  '<AS>': { morse: '.-...', name: 'AS (Wait)', type: 'prosign', ditDah: 'di-dah-di-di-dit' },
  '<SOS>': { morse: '...---...', name: 'SOS (Distress Call)', type: 'prosign', ditDah: 'di-di-di-dah-dah-dah-di-di-dit' },
};

// Reverse map: morse -> character info
export const REVERSE_MORSE_MAP = {};
Object.entries(MORSE_CODE_MAP).forEach(([char, data]) => {
  REVERSE_MORSE_MAP[data.morse] = { char, ...data };
});

export const QUICK_EXAMPLES = [
  { label: 'SOS', text: 'SOS', description: 'Universal distress signal' },
  { label: 'HELLO', text: 'HELLO', description: 'Standard greeting' },
  { label: 'HI', text: 'HI', description: 'Short Morse greeting' },
  { label: 'HELP', text: 'HELP', description: 'Urgent assistance call' },
  { label: 'THANK YOU', text: 'THANK YOU', description: 'Expression of gratitude' },
  { label: 'I LOVE YOU', text: 'I LOVE YOU', description: 'Affectionate message' },
];
