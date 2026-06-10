// Generate Astro pages for the text-centric pages from extracted/clean fragments.
// Structured pages (home, people, partners, contact, online application) are
// hand-authored and not touched here.
import { readFileSync, writeFileSync } from 'node:fs';

const IMAGE_MAP = {
  'e38a64_d6c47ffaad3e4c7a9b5d13b98b3d2494~mv2.png': { src: '/images/mobility-structure.png', alt: 'Structure of program mobility' },
  'e38a64_c7206d93324541259532f5f56852cc9c~mv2.png': { src: '/images/summer-school-program.png', alt: 'Summer School Program' },
  'e38a64_f4d2d497e431422bac1109eded49e354~mv2.jpg': { src: '/images/programme-banner.jpg', alt: 'NeuroData programme' },
  'e38a64_ec7d147f6af249ee90364c2883ef55a2~mv2.png': { src: '/images/scholarship-costs-table.png', alt: 'Programme costs table (values in Euros)' },
  'e38a64_35aaa625ae4d469bb1513e4f57a7283b~mv2.jpg': { src: '/images/selection-process.jpg', alt: 'Selection process' },
};

const PAGES = [
  { slug: 'about', title: 'NeuroData | Graduate School', h: 'About' },
  { slug: 'programme', title: 'NeuroData | Graduate School', h: 'Programme' },
  { slug: 'programme-costs', title: 'NeuroData | Graduate School', h: 'Programme Costs' },
  { slug: 'application-requirments', title: 'Application Requirements | Graduate School', h: 'Application Requirements' },
  { slug: 'selection-process', title: 'Selection Process | Graduate School', h: 'Selection Process' },
  { slug: 'faq', title: 'Faq | Graduate School', h: 'FAQ' },
  { slug: 'general-8', title: 'Alumni | NeuroData', h: 'Alumni' },
];

const rewrite = (html) =>
  html
    // braces would be parsed as Astro/JSX expressions
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    // empty placeholder paragraphs from Wix (zero-width space)
    .replace(/<p>[​‌﻿​]*<\/p>\n?\n?/g, '')
    .replace(/<p>&nbsp;<\/p>\n?\n?/g, '')
    // internal links
    .replace(/https:\/\/www\.neurodata-master\.org\/_files\/ugd\/([A-Za-z0-9_]+\.pdf)/g, '/files/$1')
    .replace(/https:\/\/www\.neurodata-master\.org\/?(?=["#])/g, '/')
    .replace(/https:\/\/www\.neurodata-master\.org\/([a-z0-9-]+)/g, '/$1')
    // images
    .replace(/<img data-wix="([^"]+)" alt="([^"]*)">/g, (m, id, alt) => {
      const e = IMAGE_MAP[id];
      if (!e) return `<!-- unmapped image: ${id} -->`;
      return `<img src="${e.src}" alt="${alt || e.alt}" loading="lazy">`;
    });

for (const p of PAGES) {
  const frag = rewrite(readFileSync(`extracted/clean/${p.slug}.html`, 'utf8'));
  const out = `---
import Base from '../layouts/Base.astro';
---

<Base title="${p.title}" currentPath="/${p.slug}">
  <section class="page-section">
    <div class="container prose">
${frag.split('\n').map((l) => (l ? '      ' + l : '')).join('\n')}
    </div>
  </section>
</Base>
`;
  writeFileSync(`src/pages/${p.slug}.astro`, out);
  console.log(`wrote src/pages/${p.slug}.astro`);
}
