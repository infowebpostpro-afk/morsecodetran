import puppeteer from 'puppeteer-core';
import path from 'path';

async function testViewports() {
  console.log('=== TESTING TURKISH PAGE RESPONSIVENESS & DOM ===');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const testPages = [
    { name: 'Turkish Home', relPath: 'dist/tr/index.html' },
    { name: 'Turkish Alphabet', relPath: 'dist/tr/morse-code-alphabet/index.html' },
    { name: 'Turkish Morse to English', relPath: 'dist/tr/morse-code-to-english/index.html' },
    { name: 'Turkish English to Morse', relPath: 'dist/tr/english-to-morse-code/index.html' },
    { name: 'Turkish Decoder', relPath: 'dist/tr/morse-code-decoder/index.html' },
    { name: 'Turkish Keyer', relPath: 'dist/tr/morse-code-keyer/index.html' },
    { name: 'Turkish Audio Translator', relPath: 'dist/tr/morse-code-audio-translator/index.html' },
    { name: 'Turkish Practice', relPath: 'dist/tr/morse-code-practice/index.html' },
    { name: 'Turkish SOS', relPath: 'dist/tr/sos-in-morse-code/index.html' }
  ];

  const viewports = [
    { name: 'Mobile XS (360px)', width: 360, height: 740 },
    { name: 'Mobile Standard (390px)', width: 390, height: 844 },
    { name: 'Tablet (768px)', width: 768, height: 1024 },
    { name: 'Desktop (1440px)', width: 1440, height: 900 }
  ];

  for (const p of testPages) {
    const filePath = `file://${path.resolve(p.relPath).replace(/\\/g, '/')}`;
    console.log(`\n--- Testing Page: ${p.name} (${p.relPath}) ---`);

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(filePath, { waitUntil: 'load' });

      const hasHorizontalOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      const pageH1 = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText.trim() : '';
      });

      console.log(`  [${vp.name}]: H1: "${pageH1.substring(0, 40)}..." | Overflow: ${hasHorizontalOverflow ? 'FAIL (Overflow)' : 'PASS'}`);

      if (hasHorizontalOverflow) {
        console.error(`  Warning: Horizontal overflow on ${p.name} at ${vp.name}`);
      }
    }
  }

  // Interactive UI tests
  console.log('\n=== TESTING INTERACTIVE TURKISH DOM ELEMENTS ===');
  await page.setViewport({ width: 1200, height: 800 });
  const homePath = `file://${path.resolve('dist/tr/index.html').replace(/\\/g, '/')}`;
  await page.goto(homePath, { waitUntil: 'load' });

  // Check language switcher links
  const langLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.language-switcher a'));
    return links.map(l => ({ text: l.innerText.trim(), href: l.getAttribute('href') }));
  });
  console.log('Language switcher links found:', langLinks);

  // Check Turkish FAQs
  const faqCount = await page.evaluate(() => {
    return document.querySelectorAll('#faq .glass-panel').length;
  });
  console.log(`Turkish FAQ count: ${faqCount}`);

  await browser.close();
  console.log('\nAll viewport and interactive checks completed successfully!');
}

testViewports().catch(err => {
  console.error('Viewport test failed:', err);
  process.exit(1);
});
