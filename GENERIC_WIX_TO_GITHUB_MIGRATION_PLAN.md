# Generic Migration Plan: Wix Site to GitHub Pages

Use this plan to migrate a mostly static Wix website to a local editable repository and then to GitHub Pages.

## Inputs

Fill these in before starting:

- Wix site URL: `https://example.com/`
- Intended custom domain: `www.example.com`
- GitHub owner/account: `github-owner`
- GitHub repository name: `example.com`
- Local project directory: `/path/to/project`
- DNS manager: Wix, registrar, Cloudflare, or other
- Email provider: unknown, Google Workspace, Microsoft 365, Wix mailbox, or other

## Feasibility Check

The site is a good static-site migration candidate if it mostly contains pages, text, images, files, publication lists, profiles, contact details, blog-like content, or galleries.

Escalate the plan before using GitHub Pages if the Wix site depends on authentication, ecommerce, user accounts, dynamic forms, paid member areas, database-backed workflows, scheduling, or Wix apps that cannot be replaced statically.

## Target Architecture

- Use Astro or another static site generator.
- Store editable content separately from layout code.
- Store local images in the repository and optimize them during build.
- Preserve original URLs where practical.
- Keep an `extracted/` archive for audit.
- Use GitHub Actions to build and deploy to GitHub Pages.
- Set the final `site` URL before generating sitemap, canonical URLs, OpenGraph URLs, or citation metadata.
- Publish only after the user has edited and approved the local site.

Recommended repository layout:

```text
.
├── README.md
├── MIGRATION_PLAN.md
├── package.json
├── package-lock.json
├── .nvmrc
├── astro.config.mjs
├── data/
│   └── site-map.json
├── extracted/
│   ├── raw/
│   ├── content/
│   ├── assets/
│   ├── text-manifest.json
│   ├── image-manifest.json
│   ├── text-verification.md
│   └── image-verification.md
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── scripts/
    ├── extract-wix-content.mjs
    ├── download-assets.mjs
    ├── validate-extraction.mjs
    └── validate-links.mjs
```

## Phase 1: Crawl, Extract, and Verify

### Task 1: Create a URL Inventory

**Description:** Crawl the visible Wix site and inspect the Wix sitemap.

**Acceptance criteria:**

- [ ] `data/site-map.json` lists every intended migrated page.
- [ ] Each page records source URL, target path, title, language, priority, and migration status.
- [ ] Hidden, duplicate, redirected, and retired pages are documented.
- [ ] The Wix sitemap is checked directly, usually at `/sitemap.xml`.
- [ ] Domain, DNS, and email ownership are documented before deployment work begins.

**Verification:**

- [ ] Compare the inventory with the live Wix navigation.
- [ ] Check footer links, menus, buttons, and sitemap entries.

### Task 2: Extract Text

**Description:** Use browser automation, not plain HTML fetches alone, because Wix often lazy-loads rendered content.

**Acceptance criteria:**

- [ ] Fully rendered HTML snapshots are stored in `extracted/raw/`.
- [ ] Clean Markdown or JSON content is stored in `extracted/content/`.
- [ ] `extracted/text-manifest.json` records title, headings, paragraphs, links, source URL, target path, and extraction timestamp.
- [ ] Each page is scrolled before extraction.
- [ ] Important content is preserved: headings, body text, links, lists, contact details, image captions, and multilingual text.

**Verification:**

- [ ] `extracted/text-verification.md` records pass/fail status per page.
- [ ] Manually review high-value pages.
- [ ] Record any missing, duplicated, or ambiguous content.

### Task 3: Extract Images and Files

**Description:** Download local copies of Wix-hosted images and files, preferring original-resolution media URLs over transformed thumbnails.

**Acceptance criteria:**

- [ ] Assets are stored in `extracted/assets/`.
- [ ] `extracted/image-manifest.json` records source URL, local filename, page reference, alt text, caption, byte size, and dimensions.
- [ ] `extracted/asset-errors.json` records failed downloads and uncertain assets.
- [ ] Gallery images are downloaded into a local folder that the user can add to before publication.
- [ ] Downloadable PDFs or files are copied into `public/files/` or another explicit passthrough folder.

**Verification:**

- [ ] `extracted/image-verification.md` records pass/fail status per page.
- [ ] No required image is zero bytes or unreadable.
- [ ] Sample images are opened locally.
- [ ] Gallery counts are checked against the Wix gallery or accepted user-provided image folder.

## Phase 2: Build the Local Site

### Task 4: Scaffold the Static Project

**Description:** Create a local Astro project with pinned dependencies and repeatable commands.

**Acceptance criteria:**

- [ ] `npm install` succeeds.
- [ ] `npm run dev` starts a local preview.
- [ ] `npm run build` creates `dist/`.
- [ ] `.nvmrc` pins Node.
- [ ] `package-lock.json` is committed.
- [ ] `astro.config.mjs` uses the final intended custom domain in `site`.
- [ ] `@astrojs/sitemap` is installed if using Astro.

**Verification:**

- [ ] Open the local preview in a browser.
- [ ] Confirm no critical console errors.

### Task 5: Rebuild Layout and Visual Identity

**Description:** Transfer useful Wix design signals while building a cleaner static site.

**Acceptance criteria:**

- [ ] Header, logo, masthead, banner artwork, colors, and footer elements are evaluated for reuse.
- [ ] The site has a centered readable max-width, clean spacing, and responsive typography.
- [ ] Navigation contains only approved live pages.
- [ ] Duplicate page titles below the navigation are removed unless useful.
- [ ] Footer contains approved contact and social links.
- [ ] Multilingual or bidirectional content uses `lang`, `dir`, `dir="auto"`, or `unicode-bidi: isolate` where needed.
- [ ] Text and UI do not overlap at mobile or desktop widths.

**Verification:**

- [ ] Browser check at desktop and mobile viewports.
- [ ] Check navigation, footer, image bands, and typography.

### Task 6: Convert Pages and Content

**Description:** Convert extracted content into editable source files and route templates.

**Acceptance criteria:**

- [ ] Each approved page renders at its target URL.
- [ ] Retired Wix pages are hidden, redirected, or archived according to user approval.
- [ ] User copy edits are preserved and not overwritten by regeneration.
- [ ] Images are placed intentionally, not simply dumped in extraction order.
- [ ] Contact forms are replaced with mail links or a selected static form provider.
- [ ] Structured content is used for repeatable records such as people, publications, products, events, or gallery items.

**Verification:**

- [ ] Compare local pages with extracted source material.
- [ ] Run link validation.
- [ ] User reviews pages locally and requests repairs before publication.

### Task 7: Build Gallery and Media Pages

**Description:** Create responsive gallery rendering for mixed image sizes and orientations.

**Acceptance criteria:**

- [ ] Gallery images render from a local project folder or committed content collection.
- [ ] The user can add images locally and refresh the gallery without re-crawling Wix.
- [ ] Individual images can be excluded without deleting the original source file.
- [ ] Images are lazy-loaded and optimized.
- [ ] Alt text or captions are included where available.

**Verification:**

- [ ] Add a new image and confirm it appears.
- [ ] Exclude a selected image and confirm it disappears.
- [ ] Browser-check the gallery for balance, loading, and overflow.

### Task 8: Add Site Polish and Indexing

**Description:** Add production details before public deployment.

**Acceptance criteria:**

- [ ] Sitemap is generated.
- [ ] `robots.txt` points to the final sitemap URL.
- [ ] Favicon is present.
- [ ] 404 page exists.
- [ ] Canonical URLs and OpenGraph metadata are present.
- [ ] Static files such as `CNAME`, PDFs, and downloads are in `public/`.
- [ ] No `.nojekyll` file is needed when deploying through GitHub Actions artifact upload.

**Verification:**

- [ ] `npm run build` succeeds.
- [ ] Inspect generated `dist/` for sitemap, robots, 404, favicon, and optimized assets.

## Phase 3: User Editing and Local Acceptance

### Task 9: Hand Off the Local Site

**Description:** Pause publication work and let the user edit, run, and review the local site.

**Acceptance criteria:**

- [ ] `README.md` explains how to run, edit, build, and validate locally.
- [ ] The user knows which files contain normal content edits.
- [ ] The user can add or remove gallery images.
- [ ] The user reviews all major pages in a local browser.
- [ ] No GitHub repository is created and no deployment is configured before explicit approval.

**Verification:**

- [ ] User runs `npm run dev`.
- [ ] User or tooling runs `npm run build`.
- [ ] User explicitly approves publication to GitHub.

## Phase 4: GitHub Repository and Pages Deployment

### Task 10: Prepare Git

**Acceptance criteria:**

- [ ] `.gitignore` excludes `node_modules/`, `dist/`, build caches, and local noise.
- [ ] Local git repository exists.
- [ ] Initial approved migration commit is created.
- [ ] `git status` is clean.

**Verification:**

- [ ] `npm run build` passes before commit.

### Task 11: Create the GitHub Repository

**Suggested command:**

```bash
gh repo create example.com --public --source=. --remote=origin --push
```

**Acceptance criteria:**

- [ ] Repository visibility is selected intentionally.
- [ ] `origin` remote is configured.
- [ ] Default branch is pushed.
- [ ] The pushed version matches the user-approved local build.

### Task 12: Configure GitHub Pages

**Acceptance criteria:**

- [ ] `.github/workflows/deploy.yml` builds and deploys `dist/`.
- [ ] GitHub Pages source is set to GitHub Actions.
- [ ] `public/CNAME` contains the final custom domain if using one.
- [ ] GitHub Pages custom domain is configured.
- [ ] First deployment succeeds.

**Verification:**

- [ ] GitHub Actions workflow is green.
- [ ] The GitHub Pages URL opens.
- [ ] Internal links and images work.

## Phase 5: DNS Cutover

### Task 13: Point DNS to GitHub Pages

For an apex/root domain:

```text
Type: A
Host: @ or example.com
Values:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional IPv6:

```text
Type: AAAA
Host: @ or example.com
Values:
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

For `www`:

```text
Type: CNAME
Host: www
Value: github-owner.github.io
```

**Acceptance criteria:**

- [ ] Do not change NS records unless intentionally moving DNS managers.
- [ ] Do not change MX/email records unless intentionally moving email.
- [ ] Old Wix A records are replaced by GitHub Pages A records.
- [ ] Old Wix `www` CNAME is replaced by `github-owner.github.io`.
- [ ] DNS checks return GitHub values.

**Verification:**

```bash
dig example.com A
dig www.example.com CNAME
```

### Task 14: Enable HTTPS

**Acceptance criteria:**

- [ ] GitHub certificate is approved for the custom domain and alternate name.
- [ ] HTTPS enforcement is enabled in GitHub Pages.
- [ ] Final site opens at `https://www.example.com/`.

**Verification:**

- [ ] Browser loads the HTTPS URL without certificate warnings.
- [ ] HTTP redirects to HTTPS.

## Phase 6: Wix Decommissioning

### Task 15: Decommission Wix Safely

**Description:** Shut down the old Wix website without disrupting domain, DNS, or email.

**Acceptance criteria:**

- [ ] Confirm whether Wix is still the DNS manager.
- [ ] Confirm whether Wix manages domain registration.
- [ ] Confirm whether any email or mailbox subscription depends on Wix.
- [ ] Unpublish the old Wix site first.
- [ ] Cancel only the Wix website plan after the GitHub site is live and stable.
- [ ] Keep domain, DNS, and email services active unless intentionally transferred.
- [ ] Remove obsolete Wix-only DNS records, such as mobile subdomain CNAMEs, only after confirming they are unused.

**Verification:**

- [ ] GitHub site remains live after Wix site unpublishing.
- [ ] Email still works.
- [ ] DNS still resolves to GitHub Pages.

## Final Definition of Done

- [ ] All approved public content is represented in the static project.
- [ ] All required images and files are local or intentionally external.
- [ ] Extraction verification reports exist for text and images.
- [ ] User has edited and approved the local site.
- [ ] Build, link validation, and browser checks pass.
- [ ] GitHub repository exists and is the source of truth.
- [ ] GitHub Pages deployment succeeds.
- [ ] DNS points to GitHub Pages.
- [ ] HTTPS is enforced.
- [ ] Wix website is unpublished or intentionally retained only as an archive/DNS/domain account.

## Common Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Wix lazy loading hides content from simple scraping | Missing content | Use browser automation and scroll pages before extraction |
| Wix image URLs are transformed thumbnails | Low-quality images | Normalize to original Wix media URLs where possible |
| Design is copied too literally | Cluttered static site | Transfer identity, not every layout artifact |
| User edits are overwritten by regeneration | Lost review work | Freeze generated content before manual review or preserve edits in structured content |
| GitHub Pages base path breaks links | Broken assets | Configure final custom domain and root paths before deployment |
| DNS cutover disrupts email | Email outage | Do not touch MX records unless migrating email |
| Wix cancellation removes DNS/domain services | Domain outage | Decommission website, domain, DNS, and email separately |
