// Render the Wix Gallery page with a real browser (the server 301-redirects
// /blank-1, but the Wix client-side router serves it when navigating in-app).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

// DNS already points to GitHub Pages; reach the still-published Wix origin
// directly by IP so the original gallery can be rendered.
const browser = await chromium.launch({
  args: ['--host-resolver-rules=MAP www.neurodata-master.org 185.230.63.171'],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  ignoreHTTPSErrors: true,
});

await page.goto('https://www.neurodata-master.org/', { waitUntil: 'load', timeout: 90000 });
await page.waitForTimeout(6000);

// Click the Gallery menu item to trigger client-side navigation
const galleryLink = page.locator('a[href*="blank-1"]').first();
await galleryLink.click({ force: true });
await page.waitForTimeout(5000);
console.log('url after click:', page.url());

// Scroll to force lazy-loading of all gallery items
for (let i = 0; i < 15; i++) {
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(600);
}
await page.waitForTimeout(2000);

const html = await page.content();
writeFileSync('extracted/raw/blank-1-rendered.html', html);

// collect pro-gallery image urls
const imgs = await page.evaluate(() =>
  [...document.querySelectorAll('#PAGES_CONTAINER img')].map((i) => ({
    src: i.currentSrc || i.src,
    alt: i.alt || '',
  }))
);
writeFileSync('extracted/raw/blank-1-images.json', JSON.stringify(imgs, null, 2));
console.log(imgs.length, 'images captured');
await page.screenshot({ path: 'extracted/raw/blank-1-screenshot.png', fullPage: true });
await browser.close();
