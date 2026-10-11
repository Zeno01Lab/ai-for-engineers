# MVP acceptance · Local implementation

Local branch: `feature/unified-knowledge-paths`. Base commit: `49001f2`. No push, deployment or Pages setting change. The live preview is still the previous release.

| Requirement | Result |
| --- | --- |
| Keep current site | Existing Astro stack, old routes, map interactions, 15 Atlas bodies, 12 resource-guide bodies, three labs and draft filtering retained. |
| One knowledge source | 39 canonical concept records; metadata/body authored once. Existing views consume generated projections and the same Content Collection source files. |
| Separate relations | 16 concept connections, 24 original editorial history edges and 40 unit prerequisites; typed endpoints and schemas are independent. |
| Original evidence | Raw 34-event/24-relation bytes unchanged; original year/citation/verification fields retained, 15 JRC report checks / 0 CSV matches. |
| Multiple paths | General AI Foundations: 8 units (7 required + optional Logic); Engineering Optimization: 7 units (6 required + optional Multi-objective Optimization). Shared unit IDs retain progress. |
| External materials | All 33 units have registry-backed public links, scoped reading, expected time, outcomes and checkpoints; first task is 5 minutes. Estimates are editorial. |
| Local personalization | Four statuses, path selection, explicit checks, already-known declarations, undo, reset/restore, JSON merge/replace and old-key migration. No account/backend/tracking/sync. |
| Map illumination | Completed/already-known effective records light only explicit concept bindings; in-progress does not. Capability self-ratings stay independent. |
| Problem navigation | Existing 11 scenarios retained; candidate cards link to learning units. Expensive-experiment guidance considers variable type, dimension, noise, budget, gradient and constraints. |
| Automated checks | Canonical integrity, DAG/parallel/optional configuration, geometry/line routing, adversarial imports, actual storage adapter, old progress migration, internal links/search/sitemap, draft filtering, provenance and targeted privacy scanning. |

Actual commands: `npm ci --ignore-scripts --fetch-retries=0 --fetch-timeout=20000` succeeded in an isolated validation copy (406 packages). An earlier `npm ci --offline --ignore-scripts` failed because `zwitch` was not cached; it was followed by the successful normal locked installation. `npm run verify` passed for `/`, and `GITHUB_REPOSITORY=Zeno01Lab/guide PREVIEW_DRAFTS=true npm run verify` passed in that separate copy. Both checks returned exit code 0: 81 Astro files with 0 errors/warnings/hints, 66 HTML pages, 2,154 internal links/assets/fragments, 142 search entries and 5 excluded drafts. Targeted source/output scans passed (335 files in the Git workspace, 296 in the isolated source/build copy).

## Manual checks still required

- Actual Safari/Chrome/mobile rendering, touch/pinch, drag/minimap placement, full screen and keyboard focus behavior. No browser-control capability was available, so no screenshot or e2e pass is claimed.
- Export/import an actual file between browsers; automatic tests cover parser/engine/storage behavior, while the browser file picker/download action still needs manual verification.
- Confirm long bilingual labels and rich sidebar text at real viewport sizes. Responsive list and node-detail fallback are preserved in source and checked structurally.
- Full external-link sweep and a fresh reading of every historical paper were not performed. Existing references/verification boundaries are retained.
- Capability self-ratings are not included in the unit-progress JSON export. Public concept coverage is representative, not an exhaustive AI encyclopedia.

## Local preview and future release

From the project folder, run `npm ci`, then `npm run dev`. Open the printed local URL; inspect `/learn/`, both path pages and `/map/`. Run `npm run verify` before release. `npm run build` produces `dist`; `npm run preview` serves that built output.

Only after explicit authorization: review the local commits and browser acceptance, then merge/push the chosen GitHub repository and enable the existing GitHub Actions Pages workflow if appropriate. Ordinary repositories use `/repository-name`; the personal `username.github.io` repository uses `/`. The prepared workflow is not evidence of a successful remote deployment.

## UI simplification — 2026-10-10 (local, awaiting publication approval)

The default interface now prioritizes maps, the next reading task and checkpoints. Navigation has three destinations. The homepage offers an overview and a progress-aware next step; the learning hallway offers path selection and an immediately visible full curriculum graph; its course catalog is expandable. Map filters, additional node explanations, capability self-assessment, progress import/export and resource reading guides remain available through native disclosures. Both maps retain all nodes, links, relation explanations, minimaps, zoom, reset and full-screen controls. Article source bodies, canonical knowledge/resources/units/paths and historical evidence were not changed.

Incoming fragment links and same-page links open every enclosing disclosure. The actual disclosure module was exercised with nested DOM doubles, missing/malformed fragments and other-page targets. This is a logic check, not Safari/browser visual QA.

Root and GitHub repository-base `/guide` verification passed after the interface changes: 66 pages, 2025 internal links/assets/fragments, 142 search entries, five excluded drafts; type/schema/graph/progress/privacy checks passed. Browser appearance, native file import and Safari pointer/touch behavior remain unverified. No GitHub push or deployment is authorized by this local acceptance record.


### Function access refinement — 2026-10-10

The hallway now keeps its full 33-unit prerequisite graph, progress dashboard and next action outside collapsed sections. Course lists and explanations retain progressive disclosure. Focus-selected and quick-start actions are directly visible; Start, Complete, Already known and Undo stay in each expanded unit. Progress tool summaries explicitly name goals, backup and restore. Knowledge/history map search and filters remain reachable in full-screen mode. Opening a checkpoint from the full-screen curriculum exits full-screen before revealing all containing disclosures and focusing the task. Malformed learning fragments no longer interrupt the page script.

Canonical records, resource links, prerequisites, capability self-ratings and shared progress validation are unchanged. Root and repository-base verification plus generated-HTML accessibility checks are required for this saved revision; actual Safari visual, touch and native full-screen checks remain manual. No GitHub push or deployment is authorized.
