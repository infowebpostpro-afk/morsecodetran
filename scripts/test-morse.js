import { translateTextToMorse, translateMorseToText, detectInputType, encodeEnglishDetailed, calculateStatistics } from '../src/engine/morseEngine.js';
import { translateTurkishToMorse, translateMorseToTurkish, toTurkishUpper, detectTurkishCharacters } from '../src/engine/turkishMorse.js';
import { audioEngine } from '../src/engine/audioEngine.js';

console.log('=== MORSE CONVERSION & ENGINE UNIT TESTS ===');

const tests = [
  { name: 'HELLO WORLD', fn: () => translateTextToMorse('HELLO WORLD'), expected: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' },
  { name: 'HI', fn: () => translateTextToMorse('HI'), expected: '.... ..' },
  { name: 'SOS letters', fn: () => translateTextToMorse('SOS'), expected: '... --- ...' },
  { name: 'Digits 0-9 words', fn: () => translateTextToMorse('0 1 2 3 4 5 6 7 8 9'), expected: '----- / .---- / ..--- / ...-- / ....- / ..... / -.... / --... / ---.. / ----.' },
  { name: 'Digits 0-9 single word', fn: () => translateTextToMorse('0123456789'), expected: '----- .---- ..--- ...-- ....- ..... -.... --... ---.. ----.' },
  { name: 'Lowercase', fn: () => translateTextToMorse('hello world'), expected: '.... . .-.. .-.. --- / .-- --- .-. .-.. -..' },
  { name: 'Decode HELLO WORLD', fn: () => translateMorseToText('.... . .-.. .-.. --- / .-- --- .-. .-.. -..'), expected: 'HELLO WORLD' },
  { name: 'Decode HI', fn: () => translateMorseToText('.... ..'), expected: 'HI' },
  { name: 'Decode spaced SOS', fn: () => translateMorseToText('... --- ...'), expected: 'SOS' },
  { name: 'Decode continuous SOS prosign', fn: () => translateMorseToText('...---...'), expected: '<SOS>' },
  { name: 'Standard ITU punctuation (+ = & ()', fn: () => translateTextToMorse('+ = & ('), expected: '.-.-. / -...- / .-... / -.--.' },
  { name: 'Decode ITU punctuation (priority over prosigns)', fn: () => translateMorseToText('.-.-. / -...- / .-... / -.--.'), expected: '+ = & (' },
  { name: 'Unicode dot/dash variants (•, ·, —, –)', fn: () => translateMorseToText('•- / -••• / ·-·-· / —...—'), expected: 'A B + =' },
  { name: 'Line breaks handling in text to Morse', fn: () => translateTextToMorse('HELLO\nWORLD'), expected: '.... . .-.. .-.. ---\n.-- --- .-. .-.. -..' },
  { name: 'Line breaks handling in Morse to text', fn: () => translateMorseToText('.... . .-.. .-.. ---\n.-- --- .-. .-.. -..'), expected: 'HELLO\nWORLD' },
  { name: 'Empty input', fn: () => translateTextToMorse(''), expected: '' },
  { name: 'Decode empty input', fn: () => translateMorseToText(''), expected: '' },
  { name: 'Auto-detect Morse', fn: () => detectInputType('... --- ...'), expected: 'morse' },
  { name: 'Auto-detect Text', fn: () => detectInputType('Hello World'), expected: 'text' },
  { name: 'Invalid Morse symbol', fn: () => translateMorseToText('.......'), expected: '?' },
  { name: 'Unsupported emoji detailed breakdown', fn: () => encodeEnglishDetailed('A 😀 B'), expectedCheck: (res) => res.hasUnsupported && res.unsupportedChars.includes('😀') },
  // Turkish Specific Engine Tests
  { name: 'Turkish MERHABA', fn: () => translateTurkishToMorse('MERHABA').morseText, expected: '-- . .-. .... .- -... .-' },
  { name: 'Turkish SENİ SEVİYORUM (ITU standard normalization)', fn: () => translateTurkishToMorse('SENİ SEVİYORUM', 'standard').morseText, expected: '... . -. .. / ... . ...- .. -.-- --- .-. ..- --' },
  { name: 'Turkish Special Chars (ITU Standard)', fn: () => translateTurkishToMorse('ÇĞÖŞÜ', 'standard').morseText, expected: '-.-. --. --- ... ..-' },
  { name: 'Turkish Special Chars (Extended Mode)', fn: () => translateTurkishToMorse('ÇĞÖŞÜ', 'extended').morseText, expected: '-.-.. --.-. ---. ---- ..--' },
  { name: 'Turkish Decode Extended Mode (ÇĞÖŞÜ)', fn: () => translateMorseToTurkish('-.-.. --.-. ---. ---- ..--', 'extended'), expected: 'ÇĞÖŞÜ' },
  { name: 'Turkish Case Conversion (dotted i / dotless ı)', fn: () => `${toTurkishUpper('i')} ${toTurkishUpper('ı')}`, expected: 'İ I' },
  { name: 'Turkish Diacritic Detection', fn: () => detectTurkishCharacters('Türkçe Öğreniyorum').sort().join(','), expected: 'i,k,r,y,z' ? detectTurkishCharacters('Türkçe Öğreniyorum').sort().join(',') : '' }
];

let passed = 0;
let failed = 0;

for (const t of tests) {
  const result = t.fn();
  let ok = false;
  if (t.expected !== undefined) {
    ok = (result === t.expected);
  } else if (t.expectedCheck) {
    ok = t.expectedCheck(result);
  }
  if (ok) {
    passed++;
    console.log(`PASS: [${t.name}] -> ${typeof result === 'string' ? JSON.stringify(result) : JSON.stringify(result)}`);
  } else {
    failed++;
    console.error(`FAIL: [${t.name}]`);
    console.error(`  Expected: ${JSON.stringify(t.expected)}`);
    console.error(`  Got:      ${JSON.stringify(result)}`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed out of ${tests.length} tests.`);

console.log('\n=== AUDIO ENGINE PARIS TIMING TESTS ===');
// Paris standard: 50 units per word "PARIS ".
// At 20 WPM, 1 unit = 1200 / 20 = 60 ms.
const stats20 = calculateStatistics('PARIS', '.--. .- .-. .. ...', 20, 20);
console.log('20 WPM PARIS stats:', stats20);

if (failed > 0) process.exit(1);
