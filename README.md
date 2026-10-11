# AI for Engineers

English-first AI knowledge maps, university video courses and prerequisite-based learning paths, with Chinese support. Built with Astro and static files.

**ONE KNOWLEDGE BASE · MULTIPLE LEARNING PATHS · PERSONALIZED LEARNING PROGRESS**

- Knowledge Map: 39 concepts; AI History: 34 events and 24 typed relationships with original evidence retained.
- Learning Paths: 33 shared units and two generic curated paths; prerequisites and parallel branches are separate from history and concept connections.
- University Video Courses: seven public Stanford, MIT and Berkeley course entries; 20 units include selected video excerpts. The checked CMU archival recordings require login. Durations describe unit excerpts/tasks, not entire courses.
- Personalization: anonymous browser-memory intake prepares profile.json and a Codex request. The downloadable kit includes public source, an unchanged personalization Skill, templates and validators. No online AI generation or personal-path import is currently provided.
- Local progress: explicit checkpoints, known-unit declarations, shared progress, undo, safe export/import; no account, server, tracking or cloud sync.

## Run locally

Requires Node.js >=24 and npm. Skill tooling also requires Python 3 and Git.

```bash
npm ci
npm run dev
npm run verify
```

`npm run verify` checks canonical IDs, schemas, prerequisites, graph/progress rules, original historical evidence, anonymous intake validation, types, production builds, internal links, drafts and targeted privacy patterns. `npm run drafts` is local review only; production builds exclude draft pages.

Website: https://zeno01lab.github.io/ai-for-engineers/ (available after successful Pages deployment).

## Personalize privately

Open `/ai-for-engineers/learn/personalize/` on the public website (or `/learn/personalize/` locally), fill your goal, completion criterion, background, available time and resource preferences. Download the kit, anonymous profile and generated Codex request. Follow the kit README and `skills/personalize-ai-learning-path/SKILL.md` inside it. The same unmodified Skill is also available in this repository under `skills/personalize-ai-learning-path/`. Keep all profiles, personal plans, private excerpts and progress exports OUTSIDE this repository. The strict current path schema permits 5–8 units including every transitive prerequisite; longer goals require an explicitly labelled first stage and remaining-unit backlog. Generating a plan does not mark progress complete. Cloud AI can receive any inputs you submit even if files are saved locally.

## GitHub Pages

The `.github/workflows/deploy.yml` workflow runs the actual verification/build and deploys the static result. In repository Settings → Pages select **GitHub Actions** as the source. Pushes to `main` then trigger checks and deployment. No access token is stored in this source; the workflow uses GitHub's short-lived job authorization.

The personal-homepage repository `<username>.github.io` deploys at `/`; a project repository deploys at `/<repository-name>`. `scripts/deployment.mjs` supports both. `actions/configure-pages` resolves Pages origin/base; optional repository variables SITE_URL and BASE_PATH override them for custom domains.

## Maintain the single knowledge base

- Concepts: `src/content/algorithms/` and `src/content/concepts/`.
- Shared URLs/provenance: `src/data/knowledge/resources.json`.
- Units/prerequisites/checkpoints: `src/data/learning/units.json`.
- Curated generic paths: `src/data/learning/paths.json`.
- Resource editorial entries: `src/content/resources/`.
- Historical evidence: `src/data/history/raw/` (preserve original records).

`npm run sync:data` generates compatibility views; do not edit generated data directly. Keep new private learning profiles outside source. The GitHub publication and private preview derive from the same canonical project; this release directory is a publishing snapshot, not a second independently authored knowledge base.

See CONTENT_GUIDE.md, CONTRIBUTING.md, MAINTAINING.md and docs/VIDEO_AND_PERSONALIZATION.md for editing rules. Course videos are linked, not copied. Attribution and evidence limitations remain in the historical source data and website source pages. The original website code is licensed under the MIT license selected by the repository owner (see LICENSE). Third-party materials remain subject to their original licenses; this project does not relicense referenced papers, course videos or external datasets.

## Verification limits

Course pages/links were checked on 2026-10-10; every lecture's playback has not been certified. Browser layout, Safari fullscreen/touch, clipboard and downloads still require real-browser QA. Public publication is complete only after the GitHub remote Actions run and live Pages URL are verified; preparing this source is not a deployment.
