import fs from 'fs';
import path from 'path';

const auditList = [
  { sourcePage: '/es/morse-code-amateur-radio/', anchor: 'Consultar Alfabeto Morse', dest: '/es/morse-code-alphabet/', file: 'src/components/SpanishAmateurRadioPage.jsx' },
  { sourcePage: '/es/what-is-morse-code/', anchor: 'historia del código Morse', dest: '/es/history-of-morse-code/', file: 'src/components/SpanishWhatIsMorsePage.jsx' },
  { sourcePage: '/es/morse-code-amateur-radio/', anchor: 'Practicar con el Manipulador Telegráfico', dest: '/es/morse-code-keyer/', file: 'src/components/SpanishAmateurRadioPage.jsx' },
  { sourcePage: '/es/what-is-morse-code/', anchor: 'SOS en código Morse', dest: '/es/sos-in-morse-code/', file: 'src/components/SpanishWhatIsMorsePage.jsx' },
  { sourcePage: '/es/history-of-morse-code/', anchor: 'SOS en código Morse', dest: '/es/sos-in-morse-code/', file: 'src/components/SpanishHistoryPage.jsx' },
  { sourcePage: '/es/morse-code-keyer/', anchor: 'Guía de Aprendizaje', dest: '/es/learn-morse-code/', file: 'src/components/SpanishKeyerPage.jsx' },
  { sourcePage: '/es/morse-code-to-english/', anchor: 'Tabla del Alfabeto Morse', dest: '/es/morse-code-alphabet/', file: 'src/components/SpanishMorseToEnglishPage.jsx' },
  { sourcePage: '/es/learn-morse-code/', anchor: 'Decodificador de Código Morse', dest: '/es/morse-code-decoder/', file: 'src/components/SpanishLearnMorsePage.jsx' },
  { sourcePage: '/es/history-of-morse-code/', anchor: 'código Morse para radioaficionados', dest: '/es/morse-code-amateur-radio/', file: 'src/components/SpanishHistoryPage.jsx' },
  { sourcePage: '/es/morse-code-symbols/', anchor: 'Decodificador de Código Morse', dest: '/es/morse-code-decoder/', file: 'src/components/SpanishSymbolsPage.jsx' },
  { sourcePage: '/es/learn-morse-code/', anchor: 'Manipulador Telegráfico Interactivo', dest: '/es/morse-code-keyer/', file: 'src/components/SpanishLearnMorsePage.jsx' },
  { sourcePage: '/es/what-is-morse-code/', anchor: 'código Morse para radioaficionados', dest: '/es/morse-code-amateur-radio/', file: 'src/components/SpanishWhatIsMorsePage.jsx' },
  { sourcePage: '/es/morse-code-symbols/', anchor: 'Números Morse (0–9)', dest: '/es/morse-code-numbers/', file: 'src/components/SpanishSymbolsPage.jsx' },
  { sourcePage: '/es/morse-code-amateur-radio/', anchor: 'Ir a la Guía para Aprender Morse', dest: '/es/learn-morse-code/', file: 'src/components/SpanishAmateurRadioPage.jsx' },
  { sourcePage: '/es/history-of-morse-code/', anchor: 'Explorar Alfabeto en Código Morse', dest: '/es/morse-code-alphabet/', file: 'src/components/SpanishHistoryPage.jsx' },
  { sourcePage: '/es/morse-code-phrases/', anchor: 'Ver Frases de Amor (Te Amo)', dest: '/es/i-love-you-in-morse-code/', file: 'src/components/SpanishPhrasesPage.jsx' },
  { sourcePage: '/es/learn-morse-code/', anchor: 'Números en Código Morse', dest: '/es/morse-code-numbers/', file: 'src/components/SpanishLearnMorsePage.jsx' },
  { sourcePage: '/es/what-is-morse-code/', anchor: 'Explorar Alfabeto en Código Morse', dest: '/es/morse-code-alphabet/', file: 'src/components/SpanishWhatIsMorsePage.jsx' },
  { sourcePage: '/es/morse-code-symbols/', anchor: 'Alfabeto Morse (A–Z y Ñ)', dest: '/es/morse-code-alphabet/', file: 'src/components/SpanishSymbolsPage.jsx' },
  { sourcePage: '/es/morse-code-keyer/', anchor: 'Decodificador Morse', dest: '/es/morse-code-decoder/', file: 'src/components/SpanishKeyerPage.jsx' },
  { sourcePage: '/es/', anchor: 'Te Amo en Código Morse', dest: '/es/i-love-you-in-morse-code/', file: 'src/components/SpanishArticleContent.jsx' },
  { sourcePage: '/es/what-is-morse-code/', anchor: 'Ir a la Guía para Aprender Morse', dest: '/es/learn-morse-code/', file: 'src/components/SpanishWhatIsMorsePage.jsx' }
];

console.log(`=== CHECKING EXACT 22 SOURCE-PAGE AND ANCHOR COMBINATIONS ===\n`);

let allPassed = true;
const results = [];

for (let i = 0; i < auditList.length; i++) {
  const item = auditList[i];
  const content = fs.readFileSync(item.file, 'utf8');

  const escapedAnchor = item.anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<a[^>]*href=["']${item.dest}["'][^>]*>[\\s\\S]*?${escapedAnchor}[\\s\\S]*?<\\/a>`, 'i');
  const match = regex.test(content);

  // Also check rendered HTML in dist/
  const distDirName = item.sourcePage === '/es/' ? 'es' : item.sourcePage.replace(/^\/|\/$/g, '');
  const distPath = path.join('dist', distDirName, 'index.html');
  let distMatch = false;
  if (fs.existsSync(distPath)) {
    const distContent = fs.readFileSync(distPath, 'utf8');
    distMatch = regex.test(distContent);
  }

  const passed = match && distMatch;
  if (!passed) allPassed = false;

  results.push({
    index: i + 1,
    sourcePage: item.sourcePage,
    anchor: item.anchor,
    dest: item.dest,
    sourceVerified: match,
    distVerified: distMatch,
    passed
  });

  console.log(`${passed ? '✅' : '❌'} #${i + 1}: [${item.sourcePage}] "${item.anchor}" -> ${item.dest} | Source: ${match ? 'PASS' : 'FAIL'} | Dist: ${distMatch ? 'PASS' : 'FAIL'}`);
}

console.log(`\nOverall Status: ${allPassed ? 'ALL 22 EXACT LINKS VERIFIED IN SOURCE AND DIST HTML' : 'SOME CHECKS FAILED'}`);
