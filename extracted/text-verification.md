# Text Extraction Verification

Extraction date: 2026-06-10. Source: live Wix site (server-rendered HTML snapshots in `extracted/raw/`).
Method: DOM-order extraction of Wix rich-text and collapsible-text blocks (`scripts/wix-to-html.mjs`), preserving headings, paragraphs, lists, and inline links.

| Page | Source slug | Blocks | Status | Notes |
| --- | --- | --- | --- | --- |
| Home | `/` | 19 | PASS | Hero taglines, events strip, programme intro, video captions, contact line all present. |
| About | `/about` | 32 | PASS | Programme overview, four study tracks, mobility rules + examples list. |
| Programme | `/programme` | 148 | PASS | All course lists for BIU, Zagreb summer school, IST, UniPD, VUA, JYU, incl. inline course links and summer-school PDF link. |
| The Partners | `/the-partners` | 32 | PASS | Six partner sections with image captions/credits and Gonda social links. |
| The People | `/the-people` | 29 | PASS | 7 people with roles, names, profile links, bios. |
| Programme Costs | `/programme-costs` | 25 | PASS | Scholarship terms, covered costs, self-funded section, additional scholarships links, student-agreement PDFs. Costs table is an image on Wix (migrated as image). |
| Application Requirements | `/application-requirments` | 19 | PASS | Language requirements, exemptions, educational background. Original (misspelled) Wix slug kept so existing links keep working. |
| Selection Process | `/selection-process` | 8 | PASS | Selection stages list, appeals, results. |
| Online Application | `/online-application` | 13 | PASS | Call text, personal-data use, instructions checklist, Online Application button (external system), countdown caption. |
| Contact | `/contact` | 3 | PASS | Address block, phone, email, WhatsApp link. |
| FAQ | `/faq` | 109 | PASS | All Q&A pairs present. |
| Alumni | `/general-8` | 40 | PASS | All thesis titles + abstracts (Wix collapsible-text widgets). |
| Gallery | `/blank-1` | n/a | PASS (redirect) | Wix 301-redirects this slug to `/about`; reproduced as a static redirect. |

Known dynamic elements replaced statically:

- Home "Upcoming Events" Wix Events widget → static strip showing the current live text ("No events at the moment").
- Home Wix video player ("Why study brain and data science?") → YouTube embed of the same official video (`Sq-PjZSjAT0`); info-session video → YouTube embed `GVw1nRo51XI`. The Wix-hosted copies are not retrievable statically.
- Online Application countdown widget → small client-side countdown; opening date is a constant at the top of `src/pages/online-application.astro`.
