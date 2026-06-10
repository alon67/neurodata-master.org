// Validate that every internal link, image, and file referenced in dist/ exists.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const htmlFiles = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(DIST);

let errors = 0;
const checked = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const refs = [
    ...html.matchAll(/(?:href|src|poster)="(\/[^"]*)"/g),
  ].map((m) => m[1]);
  for (const ref of refs) {
    const path = ref.split('#')[0].split('?')[0];
    if (!path || path === '/') continue;
    const key = path;
    if (checked.has(key)) continue;
    checked.add(key);
    const candidates = [
      join(DIST, path),
      join(DIST, path, 'index.html'),
      join(DIST, path.replace(/\/$/, '') + '.html'),
    ];
    if (!candidates.some((c) => existsSync(c) && statSync(c).isFile())) {
      console.log(`MISSING ${path}  (referenced in ${file})`);
      errors++;
    }
  }
}
console.log(`\nChecked ${checked.size} unique internal refs across ${htmlFiles.length} pages: ${errors} missing`);
process.exit(errors ? 1 : 0);
