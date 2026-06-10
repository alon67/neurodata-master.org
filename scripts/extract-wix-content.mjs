// Extract text content, links, and image references from raw Wix HTML snapshots.
// Output: extracted/content/<page>.json + extracted/text-manifest.json + extracted/image-manifest.json
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const RAW_DIR = 'extracted/raw';
const OUT_DIR = 'extracted/content';

const pages = readdirSync(RAW_DIR).filter(f => f.endsWith('.html'));
const textManifest = [];
const imageManifest = [];

for (const file of pages) {
  const name = file.replace(/\.html$/, '');
  const html = readFileSync(`${RAW_DIR}/${file}`, 'utf8');
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim();
  const container = $('#PAGES_CONTAINER');
  const scope = container.length ? container : $('body');

  // Collect content blocks in DOM order
  const blocks = [];
  scope.find('h1,h2,h3,h4,h5,h6,p,li,blockquote,a,button').each((_, el) => {
    const tag = el.tagName.toLowerCase();
    const $el = $(el);
    // skip elements that merely wrap other collected elements
    if (tag === 'a' || tag === 'button') {
      const text = $el.text().replace(/\s+/g, ' ').trim();
      const href = $el.attr('href') || '';
      if (text) blocks.push({ type: 'link', tag, text, href });
      return;
    }
    // avoid double-capture of nested p inside li etc.
    const text = $el.clone().find('a,button').remove().end().text().replace(/\s+/g, ' ').trim();
    const fullText = $el.text().replace(/\s+/g, ' ').trim();
    if (fullText) blocks.push({ type: 'text', tag, text: fullText, textWithoutLinks: text });
  });

  // Images: prefer wixstatic media URLs
  const images = [];
  scope.find('img').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || '';
    const alt = $el.attr('alt') || '';
    if (src) images.push({ src, alt });
  });
  // Background images in style attributes
  scope.find('[style*="background-image"]').each((_, el) => {
    const style = $(el).attr('style') || '';
    const m = style.match(/url\(["']?([^"')]+)["']?\)/);
    if (m) images.push({ src: m[1], alt: '', background: true });
  });

  const record = { page: name, title, extractedAt: new Date().toISOString(), blocks, images };
  writeFileSync(`${OUT_DIR}/${name}.json`, JSON.stringify(record, null, 2));
  textManifest.push({ page: name, title, blockCount: blocks.length, imageCount: images.length });
  for (const img of images) imageManifest.push({ page: name, ...img });
  console.log(`${name}: ${blocks.length} blocks, ${images.length} images`);
}

writeFileSync('extracted/text-manifest.json', JSON.stringify(textManifest, null, 2));
writeFileSync('extracted/image-manifest.json', JSON.stringify(imageManifest, null, 2));
