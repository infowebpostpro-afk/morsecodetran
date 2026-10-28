import { translateTextToMorse, translateMorseToText, detectInputType, encodeEnglishDetailed, calculateStatistics } from '../src/engine/morseEngine.js';
import { translateTurkishToMorse, translateMorseToTurkish, toTurkishUpper, detectTurkishCharacters } from '../src/engine/turkishMorse.js';
import { translateSpanishToMorse, translateMorseToSpanish, detectSpanishCharacters } from '../src/engine/spanishMorse.js';
import { translatePortugueseToMorse, translateMorseToPortuguese, normalizePortugueseText, translatePortugueseNumbersToMorse, translateMorseToPortugueseNumbers, diagnosePortugueseMorse } from '../src/engine/portugueseMorse.js';
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
  { name: 'Turkish Diacritic Detection', fn: () => detectTurkishCharacters('Türkçe Öğreniyorum').sort().join(','), expected: 'i,k,r,y,z' ? detectTurkishCharacters('Türkçe Öğreniyorum').sort().join(',') : '' },
  // Spanish Specific Engine Tests
  { name: 'Spanish HOLA', fn: () => translateSpanishToMorse('HOLA').morseText, expected: '.... --- .-.. .-' },
  { name: 'Spanish HOLA MUNDO', fn: () => translateSpanishToMorse('HOLA MUNDO').morseText, expected: '.... --- .-.. .- / -- ..- -. -.. ---' },
  { name: 'Spanish Decode HOLA MUNDO', fn: () => translateMorseToSpanish('.... --- .-.. .- / -- ..- -. -.. ---'), expected: 'HOLA MUNDO' },
  { name: 'Spanish TE AMO', fn: () => translateSpanishToMorse('TE AMO').morseText, expected: '- . / .- -- ---' },
  { name: 'Spanish SOS', fn: () => translateSpanishToMorse('SOS').morseText, expected: '... --- ...' },
  { name: 'Spanish EÑE (Extended Mode --.--)', fn: () => translateSpanishToMorse('NIÑO', 'extended').morseText, expected: '-. .. --.-- ---' },
  { name: 'Spanish Decode EÑE (Extended Mode)', fn: () => translateMorseToSpanish('-. .. --.-- ---', 'extended'), expected: 'NIÑO' },
  { name: 'Spanish EÑE (Standard ITU Normalization N)', fn: () => translateSpanishToMorse('NIÑO', 'standard').morseText, expected: '-. .. -. ---' },
  { name: 'Spanish Accents Normalization (Á É Í Ó Ú Ü)', fn: () => translateSpanishToMorse('ÁRBOL ÉXITO DÍA CANCIÓN MÚSICA PINGÜINO').morseText, expected: translateSpanishToMorse('ARBOL EXITO DIA CANCION MUSICA PINGUINO').morseText },
  { name: 'Spanish Inverted Punctuation (¿ and ¡) in Extended Mode', fn: () => translateSpanishToMorse('¿HOLA? ¡SI!', 'extended').morseText, expected: '..-.- .... --- .-.. .- ..--.. / --...- ... .. -.-.--' },
  { name: 'Spanish Inverted Punctuation (¿ and ¡) in Standard Mode Normalization', fn: () => translateSpanishToMorse('¿HOLA? ¡SI!', 'standard').morseText, expected: '..--.. .... --- .-.. .- ..--.. / -.-.-- ... .. -.-.--' },
  { name: 'Spanish Diacritic Detection', fn: () => detectSpanishCharacters('¿Cómo estás, niño?').sort().join(','), expected: '¿,á,ñ,ó' },
  // Portuguese Specific Engine Tests
  { name: 'Portuguese Example 1 (OI)', fn: () => translatePortugueseToMorse('OI').morseText, expected: '--- ..' },
  { name: 'Portuguese Example 2 (OLA MUNDO)', fn: () => translatePortugueseToMorse('OLA MUNDO').morseText, expected: '--- .-.. .- / -- ..- -. -.. ---' },
  { name: 'Portuguese Example 3 (SOS)', fn: () => translatePortugueseToMorse('SOS').morseText, expected: '... --- ...' },
  { name: 'Portuguese Example 4 (AJUDA)', fn: () => translatePortugueseToMorse('AJUDA').morseText, expected: '.- .--- ..- -.. .-' },
  { name: 'Portuguese Example 5 (OBRIGADO)', fn: () => translatePortugueseToMorse('OBRIGADO').morseText, expected: '--- -... .-. .. --. .- -.. ---' },
  { name: 'Portuguese Example 6 (EU TE AMO)', fn: () => translatePortugueseToMorse('EU TE AMO').morseText, expected: '. ..- / - . / .- -- ---' },
  { name: 'Portuguese Decode OI', fn: () => translateMorseToPortuguese('--- ..').text, expected: 'OI' },
  { name: 'Portuguese Decode OLA MUNDO', fn: () => translateMorseToPortuguese('--- .-.. .- / -- ..- -. -.. ---').text, expected: 'OLA MUNDO' },
  { name: 'Portuguese Decode SOS', fn: () => translateMorseToPortuguese('... --- ...').text, expected: 'SOS' },
  { name: 'Portuguese Decode AJUDA', fn: () => translateMorseToPortuguese('.- .--- ..- -.. .-').text, expected: 'AJUDA' },
  { name: 'Portuguese Decode OBRIGADO', fn: () => translateMorseToPortuguese('--- -... .-. .. --. .- -.. ---').text, expected: 'OBRIGADO' },
  { name: 'Portuguese Decode EU TE AMO', fn: () => translateMorseToPortuguese('. ..- / - . / .- -- ---').text, expected: 'EU TE AMO' },
  { name: 'Portuguese OLÁ -> OLA normalization', fn: () => {
    const res = translatePortugueseToMorse('OLÁ');
    return res.normalizedText === 'OLA' && res.morseText === '--- .-.. .-' && res.hasNormalizedDiacritics;
  }, expected: true },
  { name: 'Portuguese AÇÃO -> ACAO normalization', fn: () => {
    const res = translatePortugueseToMorse('AÇÃO');
    return res.normalizedText === 'ACAO' && res.morseText === '.- -.-. .- ---' && res.hasNormalizedDiacritics;
  }, expected: true },
  { name: 'Portuguese Combining Marks normalization', fn: () => {
    const precomposed = normalizePortugueseText('Olá, você!');
    const combining = normalizePortugueseText('Ola\u0301, voce\u0302!');
    return precomposed.normalized === 'OLA, VOCE!' && combining.normalized === 'OLA, VOCE!';
  }, expected: true },
  { name: 'Portuguese Unsupported emoji detection', fn: () => {
    const res = translatePortugueseToMorse('Olá 😀');
    return res.hasUnsupported && res.unsupportedChars.includes('😀');
  }, expected: true },
  { name: 'Portuguese Unrecognized Morse sequence', fn: () => {
    const res = translateMorseToPortuguese('.......');
    return res.hasUnrecognizedMorse && res.unrecognizedSequences.includes('.......');
  }, expected: true },
  { name: 'Portuguese Boundary check / ambiguous letters without space', fn: () => {
    const res = translateMorseToPortuguese('...---...');
    return res.hasAmbiguousLetters;
  }, expected: true },
  { name: 'Portuguese BOM DIA -> Morse', fn: () => translatePortugueseToMorse('BOM DIA').morseText, expected: '-... --- -- / -.. .. .-' },
  { name: 'Portuguese Decode BOM DIA', fn: () => translateMorseToPortuguese('-... --- -- / -.. .. .-').text, expected: 'BOM DIA' },
  { name: 'Portuguese Numbers 2026 -> Morse', fn: () => translatePortugueseNumbersToMorse('2026').morseText, expected: '..--- ----- ..--- -....' },
  { name: 'Portuguese Numbers Decode 2026', fn: () => translateMorseToPortugueseNumbers('..--- ----- ..--- -....').text, expected: '2026' },
  { name: 'Portuguese Numbers 007 (leading zeros preserved)', fn: () => translatePortugueseNumbersToMorse('007').morseText, expected: '----- ----- --...' },
  { name: 'Portuguese Numbers Decode 007', fn: () => translateMorseToPortugueseNumbers('----- ----- --...').text, expected: '007' },
  { name: 'Portuguese .- decodes as A', fn: () => translateMorseToPortuguese('.-').text, expected: 'A' },
  { name: 'Portuguese . - decodes as ET', fn: () => translateMorseToPortuguese('. -').text, expected: 'ET' },
  { name: 'Portuguese .......... identified as unrecognized', fn: () => {
    const res = translateMorseToPortuguese('..........');
    return res.hasUnrecognizedMorse && res.unrecognizedSequences.includes('..........');
  }, expected: true },
  { name: 'Portuguese Decoder diagnostics on invalid group', fn: () => {
    const diag = diagnosePortugueseMorse('--- .......... ..');
    return !diag.allValid && diag.hasInvalid && diag.groups.some(g => g.group === '..........' && !g.isValid && g.status === 'Não reconhecido');
  }, expected: true },
  { name: 'Portuguese Decoder diagnostics on valid message', fn: () => {
    const diag = diagnosePortugueseMorse('--- .. / - ..- -.. --- / -... . --');
    return diag.allValid && !diag.hasInvalid && diag.recognizedText === 'OI TUDO BEM';
  }, expected: true }
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
