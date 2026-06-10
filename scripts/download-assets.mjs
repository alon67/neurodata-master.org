// Download all Wix-hosted media (full resolution), PDFs, and hero video.
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

mkdirSync('extracted/assets/images', { recursive: true });
mkdirSync('extracted/assets/files', { recursive: true });
mkdirSync('extracted/assets/video', { recursive: true });

const errors = [];
const dl = (url, dest) => {
  try {
    execFileSync('curl', ['-sfL', '--retry', '2', url, '-o', dest]);
    const size = statSync(dest).size;
    if (size === 0) throw new Error('zero bytes');
    console.log(`ok  ${dest}  ${size}`);
  } catch (e) {
    errors.push({ url, dest, error: String(e.message || e) });
    console.log(`ERR ${url}`);
  }
};

// Images: strip transformation suffix to get original media file
const urls = readFileSync('extracted/all-media-urls.txt', 'utf8').trim().split('\n');
const seen = new Set();
for (const u of urls) {
  const m = u.match(/media\/([A-Za-z0-9_~.-]+?\.(?:png|jpg|jpeg|gif|webp|svg))/);
  if (!m) continue;
  const file = m[1];
  if (seen.has(file)) continue;
  seen.add(file);
  dl(`https://static.wixstatic.com/media/${file}`, `extracted/assets/images/${file}`);
}

// PDFs
const pdfs = [
  'e38a64_0ff221a721a04d5bb85c42a53fd0e76a.pdf',
  'e38a64_1e366d65fe674fc49e98fe43ce1fc3c7.pdf',
  'e38a64_22b18a3c2e8b48e39364727788b1c84c.pdf',
  'e38a64_49c7be6bf74c4295a6985ea3ccb10b10.pdf',
  'e38a64_69eee1851eed4708889e083fb148ef41.pdf',
  'e38a64_8598c068a44c4c2b939f79278f193e3e.pdf',
  'e38a64_91bb811a4e0f431f89a3547ff5d8870b.pdf',
  'e38a64_97571470b58c490b8ec726d9e75a2ad3.pdf',
  'e38a64_a8d4239f9bf3422b8b380100bafba8f4.pdf',
  'e38a64_c7673bf485994beabf03217c67841da8.pdf',
  'e38a64_ea0d245a10f44d38a43993f6de2bde5e.pdf',
  'e38a64_f0fc2e86f7664758b0e6565bf9fcc22e.pdf',
];
for (const f of pdfs) {
  dl(`https://www.neurodata-master.org/_files/ugd/${f}`, `extracted/assets/files/${f}`);
}

// Hero background video (720p is plenty for a background loop)
dl('https://video.wixstatic.com/video/e38a64_c6fd54ce687e4cd4a115efc715563226/720p/mp4/file.mp4',
   'extracted/assets/video/hero-background-720p.mp4');

writeFileSync('extracted/asset-errors.json', JSON.stringify(errors, null, 2));
console.log(`\n${errors.length} errors`);
