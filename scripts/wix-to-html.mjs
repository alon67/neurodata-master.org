// Convert raw Wix page HTML into clean, simplified HTML fragments.
// Walks the rendered page container in DOM order, keeping rich text
// (headings, paragraphs, lists, inline links/bold/italic), images, and
// button-like links, while dropping all Wix classes, wrappers, and chrome.
import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('extracted/clean', { recursive: true });

const KEEP_INLINE = new Set(['a', 'strong', 'b', 'em', 'i', 'u', 'br', 'span']);

function cleanRichText($, el, out) {
  // serialize h1-h6, p, ul, ol while keeping inline links and emphasis
  const walk = (node) => {
    if (node.type === 'text') return node.data;
    if (node.type !== 'tag') return '';
    const tag = node.tagName.toLowerCase();
    const inner = (node.children || []).map(walk).join('');
    if (tag === 'a') {
      const href = node.attribs?.href || '';
      return `<a href="${href}">${inner}</a>`;
    }
    if (tag === 'br') return '<br>';
    if (['strong', 'b'].includes(tag)) return `<strong>${inner}</strong>`;
    if (['em', 'i'].includes(tag)) return `<em>${inner}</em>`;
    if (tag === 'u') return `<u>${inner}</u>`;
    return inner; // spans and other wrappers: unwrap
  };
  $(el).children('h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote').addBack('h1,h2,h3,h4,h5,h6,p,ul,ol,blockquote').each((_, n) => {});
  const emit = (n) => {
    const tag = n.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag) || tag === 'p' || tag === 'blockquote') {
      const inner = (n.children || []).map(walk).join('').trim();
      out.push(`<${tag}>${inner || '&nbsp;'}</${tag}>`);
    } else if (tag === 'ul' || tag === 'ol') {
      const items = $(n).children('li').map((_, li) => {
        const inner = (li.children || []).map(walk).join('').trim()
          .replace(/^<p>/, '').replace(/<\/p>$/, '').replace(/<\/p>\s*<p>/g, '<br>');
        return `  <li>${inner}</li>`;
      }).get();
      out.push(`<${tag}>\n${items.join('\n')}\n</${tag}>`);
    }
  };
  // children of rich text root are the blocks
  $(el).children().each((_, n) => {
    if (n.type !== 'tag') return;
    const tag = n.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag) || ['p', 'ul', 'ol', 'blockquote'].includes(tag)) emit(n);
  });
}

const pages = process.argv.slice(2);
for (const name of pages) {
  const html = readFileSync(`extracted/raw/${name}.html`, 'utf8');
  const $ = cheerio.load(html);
  const out = [];
  const visited = new Set();

  $('#PAGES_CONTAINER').find('*').each((_, el) => {
    if (el.type !== 'tag') return;
    // skip anything inside an already-handled rich text block
    for (let p = el.parent; p; p = p.parent) if (visited.has(p)) return;
    const cls = el.attribs?.class || '';
    const tag = el.tagName.toLowerCase();
    if (cls.includes('wixui-rich-text') && tag === 'div') {
      visited.add(el);
      cleanRichText($, el, out);
    } else if (cls.includes('wixui-collapsible-text') && tag === 'div') {
      visited.add(el);
      // collapsible text: plain paragraphs separated by blank lines
      const raw = $(el).find('p').first().text();
      for (const para of raw.split(/\n\s*\n/)) {
        const t = para.trim().replace(/\n/g, '<br>');
        if (t) out.push(`<p>${t}</p>`);
      }
    } else if (tag === 'img') {
      const src = el.attribs?.src || '';
      const alt = el.attribs?.alt || '';
      const m = src.match(/media\/([A-Za-z0-9_~.-]+?\.(?:png|jpg|jpeg|gif|webp|svg))/);
      if (m) out.push(`<img data-wix="${m[1]}" alt="${alt}">`);
    } else if (tag === 'a' && (cls.includes('StylableButton') || cls.includes('wixui-button'))) {
      visited.add(el);
      const href = el.attribs?.href || '';
      const label = $(el).text().trim();
      out.push(`<a class="button" href="${href}">${label}</a>`);
    }
  });

  writeFileSync(`extracted/clean/${name}.html`, out.join('\n\n'));
  console.log(`${name}: ${out.length} blocks`);
}
