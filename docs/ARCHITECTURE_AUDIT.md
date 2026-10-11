# Repository architecture audit

Audit: 2026-10-10 UTC / 2026-10-09 New York. Baseline: `49001f2`. The supplied handoff was read outside the repository. Source inspection is authoritative; no browser QA was available. This task is local only: no push, deployment, remote or Pages settings change.

| Decision | Existing implementation | Action |
| --- | --- | --- |
| Keep | Astro 7, TypeScript, MDX, static pages, `href()` root/subpath handling, five draft exclusions | Preserve stack, routes, styling and build configuration. |
| Keep | 39-node Knowledge Map, 34-event History Map, 24 typed historical edges, 16 concept connections | Preserve layouts, citations and distinct graph semantics. Uploaded historical JSON matches existing raw files byte for byte. |
| Keep | Map pan/zoom/reset, keyboard selection, node/relation details, movable translucent minimaps | Reuse these components; report browser verification limits explicitly. |
| Keep | Visible 32-node, 9-track curriculum DAG with 39 obstacle-avoiding prerequisite edges, external reading cards | Keep the current two-dimensional design and English-first bilingual terminology. The package's earlier mountain metaphor does not override the user's later preference. |
| Keep | 15 Atlas Markdown cards, three optional labs, 12 resource guides, engineering selector with 11 public problem scenarios | Keep authored bodies, URLs and transparent baseline-oriented advice. |
| Refactor | Concepts split between `knowledge-map.ts`, `knowledge-terms.ts` and Atlas frontmatter | Canonical concept Content Collection, retaining the 15 existing card files and adding metadata-only concept records. Generate compatibility projections rather than manually maintaining duplicate descriptions. |
| Refactor | Resource URLs repeated in `learning-path.json` and resource guides | URL registry with stable resource IDs; learning units store resource selections, not copied resource definitions. Historical citation URLs remain original evidence. |
| Extend | Single curriculum and flat `done` / `prior` browser records | Add two curated 5–8-unit paths, optional/parallel configuration and a versioned local profile with four statuses, validated import/export and undo/reset. Shared unit IDs preserve progress between paths. |
| Extend | Maps consume legacy course progress | Use the same effective completion selector for maps, path pages and exported state; preserve old manual self-assessment independently. |
| Extend | Validation split into graph, history and build scripts | Add canonical schema/reference/DAG/path validation, adversarial progress-import tests, migration checks and production privacy inspection. |
| Replace narrowly | Hand-maintained duplicate metadata/inline URL lookup, legacy progress writes | Replace with projections and a single browser storage adapter. Keep old keys read-only for migration; do not discard users' records. |

## Incremental implementation order

1. Schema-validate canonical concepts, resources, units and paths. Preserve stable IDs; adapt raw historical evidence explicitly. Keep old routes compiling through compatibility projections.
2. Add General AI Foundations and Optimization for Engineering Experiments as small curated paths; retain the full curriculum as an overview/library.
3. Add versioned local statuses, track selection, checkpoint completion, prior knowledge, undo/reset and JSON portability. Keep capability self-ratings independent.
4. Connect problem navigation and Atlas to canonical concepts and learning units. Validate old routes, both base paths, provenance and production privacy.
5. Document exact editing files, actual tests and unverified browser behavior. Stop before any push or deployment.

## Data ownership and migration

- Canonical concept metadata and authored content live in one Markdown file per concept; compatibility JSON/TypeScript outputs are generated and never edited manually.
- Resource URLs live in one registry. A learning unit owns only its task, selected resource scope and prerequisite unit IDs. Paths own only ordered references, parallel/optional choices and goals.
- History events and relations remain independent evidence entities. Their `year_basis`, original citation URLs, editorial interpretation flags, 15 JRC report comparisons and 0 CSV row matches must survive exactly.
- Browser state is excluded from public data and Git. No personal research context, account system, tracking, backend or synchronization claim is introduced.

## Validation limits

The source already supplies responsive lists, keyboard handlers and minimap controls. Static structure and pure-function tests can verify their contracts; actual Safari/mobile input and rendered label readability remain manual acceptance items, not assumed successes.
