import fs from 'fs';
import path from 'path';
import { ROUTES, ROUTE_PAIRS } from '../src/routeRegistry.js';

const distDir = path.resolve('dist');

console.log(`=== VALIDATING ALL ${ROUTES.length} GENERATED PRODUCTION FILES ===`);

const results = [];
let allPassed = true;

for (const route of ROUTES) {
  let filePath;
  if (route.path === '/') {
    filePath = path.join(distDir, 'index.html');
  } else if (route.path === '/404.html') {
    filePath = path.join(distDir, '404.html');
  } else {
    filePath = path.join(distDir, route.path.replace(/^\/|\/$/g, ''), 'index.html');
  }

  const exists = fs.existsSync(filePath);
  if (!exists) {
    console.error(`FAIL: File does not exist for ${route.path} -> ${filePath}`);
    allPassed = false;
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf-8');

  // Title check
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleMatches = title === route.title;

  // Description check
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const desc = descMatch ? descMatch[1].trim().replace(/&quot;/g, '"') : '';
  const descMatches = desc === route.description;

  // Canonical check
  const canonMatches = [...html.matchAll(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']\s*\/?>/gi)];
  const canonicalCount = canonMatches.length;
  const canonical = canonMatches[0] ? canonMatches[0][1] : '';
  const canonicalMatches = (canonicalCount === 1) && (canonical === route.canonical);

  // OG URL check
  const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const ogUrl = ogUrlMatch ? ogUrlMatch[1] : '';
  const ogMatches = ogUrl === route.canonical;

  // H1 check
  const h1Matches = [...html.matchAll(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1Matches.length;
  const h1Text = h1Matches[0] ? h1Matches[0][1].replace(/<[^>]+>/g, '').trim() : '';

  // HTML Lang check
  const isTr = route.path.startsWith('/tr/');
  const isEs = route.path.startsWith('/es/');
  const expectedLang = isTr ? 'tr' : (isEs ? 'es' : 'en');
  const langMatch = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  const actualLang = langMatch ? langMatch[1] : '';
  const langOk = actualLang === expectedLang;

  // Hreflang reciprocal check
  let hreflangOk = true;
  const pair = ROUTE_PAIRS.find(p => p.en === route.path || p.tr === route.path || p.es === route.path);
  if (pair && route.isIndexable) {
    const enUrl = `https://morsecodetranslatr.io${pair.en}`;
    const trUrl = `https://morsecodetranslatr.io${pair.tr}`;
    const esUrl = `https://morsecodetranslatr.io${pair.es}`;
    const hasEnHreflang = html.includes(`hreflang="en" href="${enUrl}"`);
    const hasTrHreflang = html.includes(`hreflang="tr" href="${trUrl}"`);
    const hasEsHreflang = html.includes(`hreflang="es" href="${esUrl}"`);
    const hasXDefault = html.includes(`hreflang="x-default" href="${enUrl}"`);
    hreflangOk = hasEnHreflang && hasTrHreflang && hasEsHreflang && hasXDefault;
  } else {
    // 404 or non-indexable routes should NOT have hreflang
    hreflangOk = !html.includes('hreflang="tr"') && !html.includes('hreflang="en"') && !html.includes('hreflang="es"');
  }

  // Robots check
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const robots = robotsMatch ? robotsMatch[1] : '';
  let robotsOk = false;
  if (route.isIndexable) {
    robotsOk = robots.includes('index') && !robots.includes('noindex');
  } else {
    robotsOk = robots.includes('noindex');
  }

  // Schema check
  const schemaMatch = html.match(/<script\s+id=["']json-ld-schema["']\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  let schemaOk = false;
  let schemaType = '';
  if (schemaMatch) {
    try {
      const parsed = JSON.parse(schemaMatch[1]);
      schemaType = parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).join(', ') : 'unknown';
      schemaOk = true;
    } catch {
      schemaOk = false;
    }
  }

  // Meaningful content in #root check
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<\/body>/i);
  const hasContent = rootMatch && rootMatch[1].trim().length > 500;

  const passed = titleMatches && descMatches && canonicalMatches && ogMatches && (h1Count === 1) && robotsOk && schemaOk && hasContent && langOk && hreflangOk;

  if (!passed) {
    allPassed = false;
    if (!titleMatches) console.error(`  [Title Error]: ${route.path} -> expected "${route.title}", got "${title}"`);
    if (!descMatches) console.error(`  [Desc Error]: ${route.path}`);
    if (!canonicalMatches) console.error(`  [Canonical Error]: ${route.path} -> expected "${route.canonical}", got "${canonical}" (count: ${canonicalCount})`);
    if (h1Count !== 1) console.error(`  [H1 Error]: ${route.path} -> count: ${h1Count}`);
    if (!langOk) console.error(`  [Lang Error]: ${route.path} -> expected ${expectedLang}, got ${actualLang}`);
    if (!hreflangOk) console.error(`  [Hreflang Error]: ${route.path} -> hreflang check failed`);
    if (!hasContent) console.error(`  [Content Error]: ${route.path} -> insufficient prerendered content`);
  }

  results.push({
    path: route.path,
    exists,
    title,
    titleLen: title.length,
    canonical,
    canonicalCount,
    h1Count,
    h1Text,
    robots,
    schemaType,
    hasContent,
    langOk,
    hreflangOk,
    passed
  });

  console.log(`${passed ? 'PASS' : 'FAIL'}: ${route.path} | H1(${h1Count}): "${h1Text}" | Lang: ${actualLang} | Canonical: ${canonical} | Schema: [${schemaType}]`);
}

// Sitemap validation
const sitemapPath = path.join(distDir, 'sitemap.xml');
let sitemapOk = false;
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const indexableRoutes = ROUTES.filter(r => r.isIndexable);
  const missingInSitemap = indexableRoutes.filter(r => !sitemapContent.includes(`<loc>${r.canonical}</loc>`));
  if (missingInSitemap.length === 0) {
    sitemapOk = true;
    console.log(`\nSitemap Check: PASS (all ${indexableRoutes.length} canonical routes present in sitemap.xml)`);
  } else {
    sitemapOk = false;
    console.error(`\nSitemap Check: FAIL (${missingInSitemap.length} routes missing from sitemap.xml: ${missingInSitemap.map(r => r.canonical).join(', ')})`);
  }
} else {
  console.error('\nSitemap Check: FAIL (sitemap.xml not found)');
}

if (!sitemapOk) allPassed = false;

console.log(`\nOverall File Validation: ${allPassed ? `ALL ${ROUTES.length} ROUTES PASSED` : 'SOME ROUTES FAILED'}`);

if (!allPassed) process.exit(1);
