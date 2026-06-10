# Image / Asset Extraction Verification

Extraction date: 2026-06-10. All downloads verified non-zero size; `extracted/asset-errors.json` is empty (0 errors).
Originals (full resolution) are archived in `extracted/assets/`; web-optimized copies live in `public/images/`.

## Shared assets (header/footer)

| Asset | Local file | Status |
| --- | --- | --- |
| NeuroData logo | `public/images/neurodata-logo.png` | PASS |
| EU co-funded (Erasmus+) logo | `public/images/eu-cofunded-logo.png` | PASS |
| Favicon | `public/favicon.png` | PASS |
| 6 partner university logos | `public/images/partners/logo-*.png` | PASS |
| Social icons (FB, X/Twitter, LinkedIn, Instagram, YouTube) | `public/images/icons/*.png` | PASS |

## Page images

| Page | Image | Local file | Status |
| --- | --- | --- | --- |
| Home | Hero background video (720p) + poster | `public/video/hero-background.mp4`, `public/images/hero-poster.jpg` | PASS |
| About | Structure of program mobility | `public/images/mobility-structure.png` | PASS |
| Programme | Banner; Summer School Program table | `public/images/programme-banner.jpg`, `public/images/summer-school-program.png` | PASS |
| Programme Costs | Costs table (values in Euros) | `public/images/scholarship-costs-table.png` | PASS |
| Selection Process | Photo | `public/images/selection-process.jpg` | PASS |
| Contact | Office photo | `public/images/contact-photo.jpg` | PASS |
| The Partners | 7 photos (3 Zagreb, IST, Padua, VU, JYU) | `public/images/partners/*.jpg` | PASS |
| The People | 7 portraits | `public/images/people/*` | PASS |

## Files (PDFs)

12 PDFs downloaded from `/_files/ugd/` into `public/files/` keeping their original IDs, so content links
(`/files/<id>.pdf`) match the rewritten in-page links. Includes the summer-school programme PDF and both
student agreements (scholarship + self-funded). All non-zero size. PASS.

## Notes

- Wix image URLs were normalized to original media URLs (no thumbnail transformations).
- Oversized originals were downscaled for the web (e.g., programme banner 10077px → 2400px wide); originals kept in `extracted/assets/images/`.
- There is no separate Wix gallery page: the "Gallery" menu item points to a slug that redirects to About.
