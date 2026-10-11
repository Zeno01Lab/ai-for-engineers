# AI for Engineers

This repository builds a public educational website for engineering students.

- Keep the public site separate from private research plans, schedules, conversations and unpublished data.
- Use Astro, TypeScript, Content Collections and CSS; do not introduce a backend, analytics or paid services.
- Preserve draft filtering across routes, indexes, related content and sitemap. A production build must never expose draft pages, even when PREVIEW_DRAFTS=true.
- Use href() for site links in Astro; use relative internal links in Markdown. Support both root and repository-base deployment.
- Do not invent author credentials, experimental results, course completion or ratings.
- Before finalizing source changes, run npm run verify. For routing/config changes, verify a root deployment and a repository subpath.
- Browser checks may be unavailable: report this honestly, do not claim screenshot or interaction validation without it.
- Do not push to GitHub or change remote repository settings unless the user authorizes it.
- Document content edits and remaining verification limits in concise terms.
