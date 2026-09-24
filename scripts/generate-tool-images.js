import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const LOGO_PATH = path.resolve('public/images/logo.png');
const logoBase64 = fs.readFileSync(LOGO_PATH).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const OUTPUT_DIR = path.resolve('public/images');

async function run() {
  console.log('Launching Chrome to test real tool and generate screenshots...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-device-scale-factor=2',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1000, deviceScaleFactor: 2 });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // Helper to wrap element in an annotated showcase frame
  const applyShowcaseWrapper = async (elementSelector, meta) => {
    return await page.evaluate(({ selector, meta, logoUri }) => {
      // Remove any existing wrapper
      const oldWrap = document.getElementById('showcase-capture-wrapper');
      if (oldWrap) oldWrap.remove();

      const el = document.querySelector(selector);
      if (!el) return false;

      const wrapper = document.createElement('div');
      wrapper.id = 'showcase-capture-wrapper';
      wrapper.style.cssText = `
        background: linear-gradient(145deg, #0d111c 0%, #151c2e 50%, #0d111c 100%);
        border: 1px solid rgba(99, 102, 241, 0.35);
        border-radius: 20px;
        padding: 28px 32px 24px 32px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15);
        color: #f1f5f9;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        max-width: 1080px;
        margin: 20px auto;
        position: relative;
        box-sizing: border-box;
      `;

      // Header with badge, title, description, and feature pills
      const header = document.createElement('div');
      header.style.cssText = `
        margin-bottom: 22px;
        padding-bottom: 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      `;

      header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="
            background: linear-gradient(135deg, #6366f1, #a855f7);
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 4px 12px;
            border-radius: 9999px;
            display: inline-block;
          ">${meta.badge}</span>
          <span style="font-size: 12px; color: #94a3b8; font-weight: 500;">
            ${meta.category}
          </span>
        </div>
        <h2 style="
          margin: 6px 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          ${meta.title}
        </h2>
        <p style="
          margin: 0 0 14px 0;
          font-size: 14px;
          line-height: 1.5;
          color: #cbd5e1;
        ">
          ${meta.desc}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${meta.features.map(f => `
            <span style="
              background: rgba(255, 255, 255, 0.06);
              border: 1px solid rgba(255, 255, 255, 0.12);
              color: #e2e8f0;
              font-size: 12px;
              font-weight: 600;
              padding: 4px 10px;
              border-radius: 6px;
            ">${f}</span>
          `).join('')}
        </div>
      `;

      // Footer with Logo and domain
      const footer = document.createElement('div');
      footer.style.cssText = `
        margin-top: 22px;
        padding-top: 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;

      footer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${logoUri}" alt="MCT Logo" style="height: 38px; width: auto; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(99,102,241,0.4));" />
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #ffffff; letter-spacing: 0.02em;">MCT Morse Code Translator</div>
            <div style="font-size: 11px; color: #94a3b8;">morsecodetranslatr.io • ITU-R M.1677-1 Standard</div>
          </div>
        </div>
        <div style="
          font-size: 11px;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        ">
          Real Application Verification
        </div>
      `;

      // Insert wrapper right before target element and move element inside
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(header);
      wrapper.appendChild(el);
      wrapper.appendChild(footer);

      return true;
    }, { selector: elementSelector, meta, logoUri: logoDataUri });
  };

  // ----------------------------------------------------
  // IMAGE 1: Live Morse Code Translator Interface
  // ----------------------------------------------------
  console.log('Generating Image 1: Main Translator Interface...');
  await page.evaluate(() => {
    const textarea = document.querySelector('.input-box');
    if (textarea) {
      textarea.value = 'HELLO WORLD';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await applyShowcaseWrapper('.workspace-card', {
    badge: 'Step 1 • Core Translator',
    category: 'Bidirectional Live Engine',
    title: 'Real-Time Morse Code Translation & Audio Output',
    desc: 'Type English text or paste Morse dots and dashes. The engine auto-detects input type, calculates precise character timing, and generates authentic audio tones with full playback controls.',
    features: [
      '⚡ Auto-Detect Text & Morse',
      '🔊 Live CW Audio Synthesis',
      '💾 Instant WAV Audio Export',
      '📋 One-Click Copy System'
    ]
  });

  const wrap1 = await page.$('#showcase-capture-wrapper');
  const buffer1 = await wrap1.screenshot();

  await sharp(buffer1)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-translator-interface.png'));

  await sharp(buffer1)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-translator-interface.webp'));
  console.log('Saved Image 1 (PNG and WEBP)!');

  // Reload page to reset layout cleanly
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // ----------------------------------------------------
  // IMAGE 2: Character-by-Character Flow
  // ----------------------------------------------------
  console.log('Generating Image 2: Character-by-Character Breakdown...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.preset-btn'));
    const sosBtn = buttons.find(b => b.textContent.trim() === 'SOS');
    if (sosBtn) sosBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const cards = document.querySelectorAll('.char-flow-card');
    if (cards[1]) {
      cards[1].classList.add('active-playing');
      cards[1].style.border = '2px solid #38bdf8';
      cards[1].style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.6)';
    }
  });

  await applyShowcaseWrapper('.breakdown-section', {
    badge: 'Step 2 • Visual Learning',
    category: 'Character Analysis & Phonetics',
    title: 'Interactive Character-by-Character Morse Breakdown',
    desc: 'Inspect how each individual character maps to its dot-and-dash sequence. Understand the acoustic rhythm with phonetic dits and dahs, and click any card to hear its synthesized tone.',
    features: [
      '🔤 Exact Character Mapping',
      '🎵 Phonetic Rhythm (Dit & Dah)',
      '🔊 Individual Audio Tone Tester',
      '✨ Synchronized Real-Time Playback'
    ]
  });

  const wrap2 = await page.$('#showcase-capture-wrapper');
  const buffer2 = await wrap2.screenshot();

  await sharp(buffer2)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-translator-character-breakdown.png'));

  await sharp(buffer2)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-translator-character-breakdown.webp'));
  console.log('Saved Image 2 (PNG and WEBP)!');

  // Reload page to reset layout cleanly
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  // ----------------------------------------------------
  // IMAGE 3: Advanced Audio & Transmission Controls
  // ----------------------------------------------------
  console.log('Generating Image 3: Advanced Transmission Settings...');
  await page.evaluate(() => {
    const advSection = document.querySelector('.advanced-section');
    if (advSection) {
      const toggleBtn = advSection.querySelector('button');
      if (toggleBtn) toggleBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await applyShowcaseWrapper('.advanced-section', {
    badge: 'Step 3 • Transmission Tuning',
    category: 'High-Precision CW Settings',
    title: 'Advanced Audio Controls & Signal Transmission Metrics',
    desc: 'Fine-tune transmission speed (WPM), adjust Farnsworth character spacing, customize tone frequency pitch, and inspect real-time transmission duration and dot/dash pulse statistics.',
    features: [
      '⏱️ PARIS Standard Speed (5-60 WPM)',
      '📻 Custom Tone Frequency (400-1000 Hz)',
      '⚡ Farnsworth Timing Control',
      '📊 Live Pulse Duration & Ratio Metrics'
    ]
  });

  const wrap3 = await page.$('#showcase-capture-wrapper');
  const buffer3 = await wrap3.screenshot();

  await sharp(buffer3)
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-transmission-settings-timing.png'));

  await sharp(buffer3)
    .webp({ quality: 90 })
    .toFile(path.join(OUTPUT_DIR, 'morse-code-transmission-settings-timing.webp'));
  console.log('Saved Image 3 (PNG and WEBP)!');

  await browser.close();
  console.log('All 3 images successfully generated!');
}

run().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
