import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

async function runBrowserTests() {
  console.log('🚀 Launching Chrome for Browser E2E Tests...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition, message) {
    if (condition) {
      testsPassed++;
      console.log(`  ✓ PASS: ${message}`);
    } else {
      testsFailed++;
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  try {
    // TEST 1: Homepage /es/
    console.log('\n--- 1. Testing Homepage (/es/) ---');
    await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle0' });

    const title = await page.title();
    assert(title.includes('Código Morse') || title.includes('Morse'), `Page title contains Morse: "${title}"`);

    const h1 = await page.$eval('h1', el => el.textContent.trim());
    assert(h1.length > 0, `H1 is rendered: "${h1}"`);

    // Translator Interaction: Type HOLA MUNDO
    const inputArea = await page.$('textarea');
    assert(!!inputArea, 'Found input textarea');

    await inputArea.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await inputArea.type('HOLA MUNDO');

    await page.waitForFunction(() => {
      const outputEl = document.querySelector('.output-panel .panel-textarea');
      return outputEl && outputEl.textContent.includes('.... --- .-.. .-');
    }, { timeout: 4000 });

    const outputVal = await page.$eval('.output-panel .panel-textarea', el => el.textContent.trim());
    assert(outputVal.includes('.... --- .-.. .- / -- ..- -. -.. ---'), `Morse output for "HOLA MUNDO" is correct: "${outputVal}"`);

    // Reverse test: Enter Morse -> Text
    await inputArea.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('A');
    await page.keyboard.up('Control');
    await page.keyboard.press('Backspace');
    await inputArea.type('.... --- .-.. .-');

    await page.waitForFunction(() => {
      const outputEl = document.querySelector('.output-panel .panel-textarea');
      return outputEl && outputEl.textContent.includes('HOLA');
    }, { timeout: 4000 });

    const reverseVal = await page.$eval('.output-panel .panel-textarea', el => el.textContent.trim());
    assert(reverseVal.includes('HOLA'), `Reverse output for ".... --- .-.. .-" is HOLA: "${reverseVal}"`);

    // TEST 2: Alphabet Page (/es/morse-code-alphabet/)
    console.log('\n--- 2. Testing Alphabet Page (/es/morse-code-alphabet/) ---');
    await page.goto(`${BASE_URL}/es/morse-code-alphabet/`, { waitUntil: 'networkidle0' });

    const alphabetH1 = await page.$eval('h1', el => el.textContent.trim());
    assert(alphabetH1.includes('Alfabeto'), `Alphabet H1 loaded: "${alphabetH1}"`);

    // Check that Ñ card is present
    const hasEnye = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes('Ñ') && bodyText.includes('--.--');
    });
    assert(hasEnye, 'Letter Ñ (--.--) is displayed in alphabet reference');

    // TEST 3: Practice Page (/es/morse-code-practice/)
    console.log('\n--- 3. Testing Practice Trainer Page (/es/morse-code-practice/) ---');
    await page.goto(`${BASE_URL}/es/morse-code-practice/`, { waitUntil: 'networkidle0' });

    const practiceH1 = await page.$eval('h1', el => el.textContent.trim());
    assert(practiceH1.includes('Práctica') || practiceH1.includes('Entrenamiento'), `Practice H1 loaded: "${practiceH1}"`);

    const hasPlayButton = await page.$('button[aria-label*="Reproducir"], button[aria-label*="sonido"], button[type="button"]');
    assert(!!hasPlayButton, 'Interactive audio playback button found on practice trainer');

    // TEST 4: Keyer Page (/es/morse-code-keyer/)
    console.log('\n--- 4. Testing Keyer Page (/es/morse-code-keyer/) ---');
    await page.goto(`${BASE_URL}/es/morse-code-keyer/`, { waitUntil: 'networkidle0' });

    const keyerH1 = await page.$eval('h1', el => el.textContent.trim());
    assert(keyerH1.includes('Manipulador') || keyerH1.includes('Llave'), `Keyer H1 loaded: "${keyerH1}"`);

    // TEST 5: Privacy Policy Page (/es/privacy-policy/)
    console.log('\n--- 5. Testing Privacy Policy (/es/privacy-policy/) ---');
    await page.goto(`${BASE_URL}/es/privacy-policy/`, { waitUntil: 'networkidle0' });

    const privacyH1 = await page.$eval('h1', el => el.textContent.trim());
    assert(privacyH1.includes('Privacidad'), `Privacy Policy H1 loaded: "${privacyH1}"`);

    const hasContactMail = await page.evaluate(() => document.body.innerText.includes('contact@morsecodetranslatr.io'));
    assert(hasContactMail, 'Contact email contact@morsecodetranslatr.io verified');

    // TEST 6: Check for Console Errors
    console.log('\n--- 6. Console Error Check ---');
    if (consoleErrors.length === 0) {
      assert(true, 'Zero JavaScript console errors encountered across all visited Spanish pages');
    } else {
      console.warn('Console errors caught:', consoleErrors);
      assert(consoleErrors.length === 0, `${consoleErrors.length} console errors detected`);
    }

  } catch (err) {
    console.error('Browser test error:', err);
    testsFailed++;
  } finally {
    await browser.close();
  }

  console.log(`\n==========================================`);
  console.log(`Browser Test Summary: ${testsPassed} passed, ${testsFailed} failed`);
  console.log(`==========================================\n`);

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runBrowserTests();
