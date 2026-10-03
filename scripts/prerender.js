import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

async function runPrerender() {
  console.log('🚀 Starting Static Build & Prerender for MorseCodeTranslatr...');

  // 1. Build Client Bundle
  console.log('📦 Step 1: Building Client Assets with Vite...');
  await build({
    root: rootDir,
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    }
  });

  // 2. Build Server Bundle for SSR
  console.log('⚙️ Step 2: Compiling SSR Bundle...');
  await build({
    root: rootDir,
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
    }
  });

  // 3. Load SSR Bundle and Route Registry
  const ssrEntryPath = path.resolve(distSsrDir, 'entry-server.js');
  const { render } = await import(`file://${ssrEntryPath.replace(/\\/g, '/')}`);
  const { ROUTES, ROUTE_PAIRS } = await import(`file://${path.resolve(rootDir, 'src/routeRegistry.js').replace(/\\/g, '/')}`);

  // 4. Read base client index.html
  const baseHtmlTemplate = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8');

  console.log(`📄 Step 3: Prerendering ${ROUTES.length} routes...`);

  for (const route of ROUTES) {
    const { appHtml, schema } = render(route.path);
    let html = baseHtmlTemplate;

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);

    // Replace Meta Description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    // Replace Canonical Link
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );

    // Handle html lang attribute
    const isTurkish = route.path.startsWith('/tr/') || route.inLanguage === 'tr-TR' || (route.tab && route.tab.startsWith('tr-')) || route.tab === 'turkish';
    const htmlLang = isTurkish ? 'tr' : 'en';
    html = html.replace(/<html[^>]*lang=["'][^"']*["']/i, `<html lang="${htmlLang}"`);

    // Handle reciprocal hreflang for English and Turkish equivalent pages
    const pair = ROUTE_PAIRS.find(p => p.en === route.path || p.tr === route.path);
    if (pair && route.isIndexable) {
      const enUrl = `https://morsecodetranslatr.io${pair.en}`;
      const trUrl = `https://morsecodetranslatr.io${pair.tr}`;
      const hreflangTags = `  <link rel="alternate" hreflang="en" href="${enUrl}" />\n  <link rel="alternate" hreflang="tr" href="${trUrl}" />\n  <link rel="alternate" hreflang="x-default" href="${enUrl}" />\n`;
      html = html.replace('</head>', `${hreflangTags}</head>`);
    }

    // Replace Open Graph Tags
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
      `<meta property="og:url" content="${route.canonical}" />`
    );

    // Replace Twitter Tags
    if (html.includes('twitter:title')) {
      html = html.replace(
        /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
        `<meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />`
      );
    } else {
      html = html.replace('</head>', `  <meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />\n</head>`);
    }

    if (html.includes('twitter:description')) {
      html = html.replace(
        /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
        `<meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />`
      );
    } else {
      html = html.replace('</head>', `  <meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />\n</head>`);
    }

    // Special robots handling for 404
    if (route.tab === 'notfound' || !route.isIndexable) {
      html = html.replace(
        /<meta\s+name=["']robots["'][\s\S]*?\/?>/i,
        `<meta name="robots" content="noindex, follow" />`
      );
    }

    // Replace Structured Data Schema
    const schemaJson = JSON.stringify(schema, null, 2);
    html = html.replace(
      /<script\s+id=["']json-ld-schema["']\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
      `<script id="json-ld-schema" type="application/ld+json">\n${schemaJson}\n    </script>`
    );

    // Inject prerendered markup into root
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    // Determine target file location
    let targetFilePath;
    if (route.path === '/') {
      targetFilePath = path.resolve(distDir, 'index.html');
    } else if (route.path === '/404.html') {
      targetFilePath = path.resolve(distDir, '404.html');
    } else {
      const subDir = path.resolve(distDir, route.path.replace(/^\/|\/$/g, ''));
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir, { recursive: true });
      }
      targetFilePath = path.resolve(subDir, 'index.html');
    }

    fs.writeFileSync(targetFilePath, html, 'utf-8');
    console.log(`  ✓ Generated: ${route.path} -> ${path.relative(rootDir, targetFilePath)}`);
  }

  // 5. Generate Canonical Sitemap
  console.log('🗺️ Step 4: Generating Canonical sitemap.xml...');
  const indexableRoutes = ROUTES.filter(r => r.isIndexable);
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes.map(r => `  <url>
    <loc>${r.canonical}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml.trim() + '\n', 'utf-8');
  fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemapXml.trim() + '\n', 'utf-8');
  console.log(`  ✓ Generated sitemap with ${indexableRoutes.length} canonical routes`);

  // 6. Generate robots.txt
  console.log('🤖 Step 5: Generating robots.txt...');
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://morsecodetranslatr.io/sitemap.xml
`;
  fs.writeFileSync(path.resolve(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('  ✓ Generated robots.txt');

  // 7. Clean up temporary dist-ssr directory
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }

  console.log('✅ Static Prerendering and Build Completed Successfully!');
}

runPrerender().catch(err => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
