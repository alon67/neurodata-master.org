# NeuroData Master — Static Site

Static rebuild of [www.neurodata-master.org](https://www.neurodata-master.org) (migrated from Wix), built with [Astro](https://astro.build) and ready for GitHub Pages.

## Run locally

```bash
nvm use            # Node 24 (see .nvmrc); any Node >= 20 works
npm install
npm run dev        # local preview at http://localhost:4321
```

## Build and validate

```bash
npm run build            # outputs the production site to dist/
npm run validate:links   # checks every internal link/image/file in dist/
```

## Where to edit content

| What | File |
| --- | --- |
| Home page (hero, intro, videos) | `src/pages/index.astro` |
| About / Programme / Costs / Requirements / Selection / FAQ / Alumni | `src/pages/<slug>.astro` |
| The People (cards: photo, role, bio) | `src/pages/the-people.astro` (edit the `people` array) |
| The Partners | `src/pages/the-partners.astro` |
| Online Application (incl. countdown date) | `src/pages/online-application.astro` (`applicationOpens` constant) |
| Header, navigation menu, footer | `src/layouts/Base.astro` |
| Colors, fonts, spacing | `src/styles/global.css` |
| Images | `public/images/` |
| PDFs | `public/files/` (linked as `/files/<name>.pdf`) |

Pages keep the original Wix URLs (including the original `/application-requirments` spelling and the
`/general-8` Alumni slug) so existing links and search results keep working. `/blank-1` (the old
"Gallery" menu target) redirects to `/about`, same as on Wix.

## Notable migration decisions

- **Online Application button** links to the external registration system at
  `https://admin.neurodata-master.org/user/create_applicant` (that system was intentionally not migrated).
- **Videos:** the Wix-hosted players were replaced with YouTube embeds of the same official videos
  ("Why study a master in brain and data science?" `Sq-PjZSjAT0`, and the January 2024 info session
  `GVw1nRo51XI`). Swap the IDs in `src/pages/index.astro` if you prefer different uploads.
- **Hero background video** is served locally from `public/video/hero-background.mp4` (downloaded from Wix, 720p).
- **Events:** the Wix Events widget was replaced with a static "Upcoming Events — No events at the moment"
  strip (`src/pages/index.astro`). Past event registration pages were not migrated.
- **Countdown** on the Online Application page is a small script; set the next opening date in the
  `applicationOpens` constant.
- **Fonts:** Wix's licensed Proxima Nova was substituted with Source Sans 3 (Google Fonts).
- The full extraction archive (raw HTML snapshots, content JSON, original-resolution assets, and
  verification reports) is in `extracted/` for audit.

## Deployment (after you approve the local site)

1. Create a GitHub repository and push (e.g. `gh repo create neurodata-master.org --public --source=. --remote=origin --push`).
2. In the repo settings, set **Pages → Source → GitHub Actions**. The included workflow
   (`.github/workflows/deploy.yml`) builds and deploys `dist/` on every push to `main`.
3. `public/CNAME` already contains `www.neurodata-master.org`; set the same custom domain in the Pages settings.
4. DNS cutover (at your DNS manager — do **not** change MX/email records):
   - Apex `neurodata-master.org` → A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → CNAME `<github-owner>.github.io`
5. Enable **Enforce HTTPS** once the certificate is issued.
6. Only after the GitHub site is live and stable: unpublish the Wix site, then cancel the Wix website plan
   (keep domain/DNS/email services unless you intend to move them).

See `GENERIC_WIX_TO_GITHUB_MIGRATION_PLAN.md` for the full checklist.
