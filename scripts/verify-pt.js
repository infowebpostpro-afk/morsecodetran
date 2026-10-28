import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(path.resolve('dist/pt/index.html'), 'utf8');

const checks = [
  { name: 'HTML Lang pt-BR', pass: html.includes('<html lang="pt-BR"') },
  { name: 'Title match', pass: html.includes('<title>Tradutor de Código Morse: Texto e Áudio | MorsePro</title>') },
  { name: 'Meta Description', pass: html.includes('content="Converta texto em código Morse e Morse em texto. Ouça os sinais, copie o resultado e confira exemplos, letras e números."') },
  { name: 'Canonical self-link', pass: html.includes('<link rel="canonical" href="https://morsecodetranslatr.io/pt/" />') },
  { name: 'H1 Exact', pass: html.includes('<h1 class="hero-title">Tradutor de código Morse</h1>') },
  { name: 'Reciprocal hreflang en', pass: html.includes('<link rel="alternate" hreflang="en" href="https://morsecodetranslatr.io/" />') },
  { name: 'Reciprocal hreflang tr', pass: html.includes('<link rel="alternate" hreflang="tr" href="https://morsecodetranslatr.io/tr/" />') },
  { name: 'Reciprocal hreflang es', pass: html.includes('<link rel="alternate" hreflang="es" href="https://morsecodetranslatr.io/es/" />') },
  { name: 'Reciprocal hreflang pt-BR', pass: html.includes('<link rel="alternate" hreflang="pt-BR" href="https://morsecodetranslatr.io/pt/" />') },
  { name: 'Reciprocal hreflang x-default', pass: html.includes('<link rel="alternate" hreflang="x-default" href="https://morsecodetranslatr.io/" />') },
  { name: 'Hero description', pass: html.includes('Converta texto em pontos e traços ou decodifique código Morse em texto. Ouça os sinais, copie o resultado e confira cada caractere.') },
  { name: 'Conversion mode note', pass: html.includes('O tradutor converte caracteres. Ele não traduz o significado de uma mensagem entre idiomas.') },
  { name: 'Default input OLA MUNDO', pass: html.includes('OLA MUNDO') },
  { name: 'Default output --- .-.. .- / -- ..- -. -.. ---', pass: html.includes('--- .-.. .- / -- ..- -. -.. ---') },
  { name: 'All 6 examples present in table', pass: ['OI', 'OLA MUNDO', 'SOS', 'AJUDA', 'OBRIGADO', 'EU TE AMO'].every(ex => html.includes(ex)) },
  { name: 'Usar exemplo buttons', pass: html.includes('Usar exemplo') },
  { name: 'Tattoo/jewelry note', pass: html.includes('Antes de usar uma mensagem em uma tatuagem, joia ou material impresso, faça a conversão de volta para texto e compare o resultado.') },
  { name: 'Acentos e cedilha section', pass: html.includes('Acentos e cedilha: o que acontece com o português?') },
  { name: 'ITU Link', pass: html.includes('https://www.itu.int/rec/R-REC-M.1677-1-200910-I/en') },
  { name: 'Exact SOS code formatting in FAQ', pass: html.includes('As letras S, O e S são representadas por <code>... --- ...</code>.') },
  { name: 'FAQ 1 eu te amo', pass: html.includes('Como escrever “eu te amo” em código Morse?') },
  { name: 'FAQ 3 en-pt', pass: html.includes('O tradutor converte português para inglês?') },
  { name: 'FAQ 4 OLA', pass: html.includes('Por que OLÁ volta como OLA?') },
  { name: 'FAQ 5 sem espacos', pass: html.includes('Posso decodificar Morse sem espaços?') },
  { name: 'FAQ 6 criptografia', pass: html.includes('Código Morse é criptografia?') },
  { name: 'Semantic letters table A-Z', pass: html.includes('Letras (A–Z)') },
  { name: 'Semantic numbers table 0-9', pass: html.includes('Números (0–9)') },
  { name: 'Timing table 1/3/7 units', pass: html.includes('Pontos, traços e pausas') && html.includes('1 unidade') && html.includes('3 unidades') && html.includes('7 unidades') },
  { name: 'Language switcher Português (Brasil)', pass: html.includes('Português (Brasil)') },
  { name: 'No English deep pages given pt hreflang', pass: (() => {
    const enDeepHtml = fs.readFileSync(path.resolve('dist/morse-code-alphabet/index.html'), 'utf8');
    return !enDeepHtml.includes('hreflang="pt-BR"');
  })() },
  { name: 'English homepage has pt-BR hreflang', pass: (() => {
    const enHomeHtml = fs.readFileSync(path.resolve('dist/index.html'), 'utf8');
    return enHomeHtml.includes('hreflang="pt-BR" href="https://morsecodetranslatr.io/pt/"');
  })() },
  { name: 'Turkish homepage has pt-BR hreflang', pass: (() => {
    const trHomeHtml = fs.readFileSync(path.resolve('dist/tr/index.html'), 'utf8');
    return trHomeHtml.includes('hreflang="pt-BR" href="https://morsecodetranslatr.io/pt/"');
  })() },
  { name: 'Spanish homepage has pt-BR hreflang', pass: (() => {
    const esHomeHtml = fs.readFileSync(path.resolve('dist/es/index.html'), 'utf8');
    return esHomeHtml.includes('hreflang="pt-BR" href="https://morsecodetranslatr.io/pt/"');
  })() },
  { name: 'Sitemap contains /pt/', pass: (() => {
    const sitemap = fs.readFileSync(path.resolve('dist/sitemap.xml'), 'utf8');
    return sitemap.includes('<loc>https://morsecodetranslatr.io/pt/</loc>');
  })() }
];

console.log('=== VERIFYING PORTUGUESE HOMEPAGE & HREFLANG INTEGRITY ===');
let failed = 0;
for (const check of checks) {
  if (check.pass) {
    console.log(`  ✓ ${check.name}`);
  } else {
    console.error(`  ✗ FAIL: ${check.name}`);
    failed++;
  }
}

console.log(`\nVerification Complete: ${checks.length - failed}/${checks.length} passed.`);
if (failed > 0) process.exit(1);
