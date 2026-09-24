import puppeteer from 'puppeteer-core';

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  
  // Desktop view
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const figures = await page.$$('.article-figure');
  console.log(`Found ${figures.length} figures on page`);
  
  if (figures[0]) {
    await figures[0].scrollIntoView();
    await page.screenshot({ path: 'public/images/verify_desktop_fig1.png' });
  }
  if (figures[1]) {
    await figures[1].scrollIntoView();
    await page.screenshot({ path: 'public/images/verify_desktop_fig2.png' });
  }
  if (figures[2]) {
    await figures[2].scrollIntoView();
    await page.screenshot({ path: 'public/images/verify_desktop_fig3.png' });
  }

  // Mobile view
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 500));
  if (figures[0]) {
    await figures[0].scrollIntoView();
    await page.screenshot({ path: 'public/images/verify_mobile_fig1.png' });
  }

  await browser.close();
  console.log('Verification screenshots captured!');
}

verify().catch(console.error);
