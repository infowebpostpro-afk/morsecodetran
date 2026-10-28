import fs from 'fs';
import path from 'path';

const mappings = [
  { old: '/es/alfabeto-codigo-morse/', canonical: '/es/morse-code-alphabet/' },
  { old: '/es/aprender-codigo-morse/', canonical: '/es/learn-morse-code/' },
  { old: '/es/sos-en-codigo-morse/', canonical: '/es/sos-in-morse-code/' },
  { old: '/es/manipulador-codigo-morse/', canonical: '/es/morse-code-keyer/' },
  { old: '/es/numeros-codigo-morse/', canonical: '/es/morse-code-numbers/' },
  { old: '/es/morse-code-i-love-you/', canonical: '/es/i-love-you-in-morse-code/' },
  { old: '/es/radioaficionados-codigo-morse/', canonical: '/es/morse-code-amateur-radio/' },
  { old: '/es/decodificador-codigo-morse/', canonical: '/es/morse-code-decoder/' },
  { old: '/es/historia-del-codigo-morse/', canonical: '/es/history-of-morse-code/' }
];

console.log('=== VERIFYING SPANISH AUDIT FIXES ===\n');

// 1. Check all HTML in dist/
function walkHtml(dir) {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(walkHtml(full));
    } else if (full.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = walkHtml('dist');
let leakedInlinks = 0;
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const m of mappings) {
    if (content.includes(m.old)) {
      console.error(`❌ LEAKED OLD LINK in ${file}: ${m.old}`);
      leakedInlinks++;
    }
  }
}

if (leakedInlinks === 0) {
  console.log(`✅ [dist/ HTML Check]: 0 leaked old links across all ${htmlFiles.length} rendered HTML files.`);
} else {
  console.error(`❌ [dist/ HTML Check]: ${leakedInlinks} leaked links found!`);
}

// 2. Check each canonical destination file
console.log('\n--- Canonical Destinations Check ---');
for (const m of mappings) {
  const dirName = m.canonical.replace(/^\/|\/$/g, '');
  const htmlPath = path.join('dist', dirName, 'index.html');
  const exists = fs.existsSync(htmlPath);
  if (!exists) {
    console.error(`❌ Missing destination: ${htmlPath}`);
  } else {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const canonExpected = `https://morsecodetranslatr.io${m.canonical}`;
    const canonMatch = content.includes(`rel="canonical" href="${canonExpected}"`);
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';
    console.log(`✅ ${m.canonical} -> Exists: YES | Self-canonical: ${canonMatch ? 'PASS' : 'FAIL'} | Title: "${title.slice(0, 45)}..."`);
  }
}

// 3. Check Apache .htaccess
console.log('\n--- .htaccess Redirects Check ---');
const htaccess = fs.readFileSync('public/.htaccess', 'utf8');
let allHtaccessOk = true;
for (const m of mappings) {
  const stripped = m.old.replace(/^\/|\/$/g, '');
  const hasRule = htaccess.includes(`RewriteRule ^${stripped}/?$ ${m.canonical} [R=301,L]`);
  if (!hasRule) {
    console.error(`❌ Missing .htaccess rule for ${m.old}`);
    allHtaccessOk = false;
  }
}
if (allHtaccessOk) {
  console.log('✅ All 9 one-hop 301 RewriteRules verified in public/.htaccess.');
}

// 4. Check _redirects
console.log('\n--- _redirects Check ---');
const redirects = fs.readFileSync('public/_redirects', 'utf8');
let allRedirectsOk = true;
for (const m of mappings) {
  const stripped = m.old.replace(/\/$/, '');
  const reWithSlash = new RegExp(`^${m.old}\\s+${m.canonical}\\s+301!`, 'm');
  const reWithoutSlash = new RegExp(`^${stripped}\\s+${m.canonical}\\s+301!`, 'm');
  const hasWithSlash = reWithSlash.test(redirects);
  const hasWithoutSlash = reWithoutSlash.test(redirects);
  if (!hasWithSlash || !hasWithoutSlash) {
    console.error(`❌ Missing _redirects entry for ${m.old}`);
    allRedirectsOk = false;
  }
}
if (allRedirectsOk) {
  console.log('✅ All 9 one-hop 301 redirect rules verified in public/_redirects.');
}

// 5. Check sitemap
console.log('\n--- sitemap.xml Check ---');
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
let sitemapClean = true;
for (const m of mappings) {
  if (sitemap.includes(m.old)) {
    console.error(`❌ Sitemap contains old path: ${m.old}`);
    sitemapClean = false;
  }
  if (!sitemap.includes(`https://morsecodetranslatr.io${m.canonical}`)) {
    console.error(`❌ Sitemap missing canonical path: ${m.canonical}`);
    sitemapClean = false;
  }
}
if (sitemapClean) {
  console.log('✅ Sitemap lists all 9 canonical destinations and 0 old redirected paths.');
}
