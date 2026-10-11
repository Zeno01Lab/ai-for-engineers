# Content workflow · 内容维护

Edit authoritative records, then run `npm run verify`. `sync:data` runs before dev, check and build; generated compatibility data is never edited manually. Existing content bodies and old URLs are preserved.

| Add/edit | Single authoritative file | Notes |
| --- | --- | --- |
| Algorithm | `src/content/algorithms/<stable-id>.md` | Metadata and authored Markdown body together; `atlas: true`. An existing example is `bayesian-optimization.md`. |
| Navigation concept | `src/content/concepts/<stable-id>.md` | Same metadata schema, `atlas: false`; mark incomplete items as drafts. Short navigation descriptions do not claim to be complete tutorials. |
| Resource | `src/data/knowledge/resources.json` | One unique URL per stable resource ID. Change a course URL here once; units and guides resolve it automatically. Keep verification dates honest. |
| Learning unit | `src/data/learning/units.json` | Bilingual task title, concept IDs, resource selections/scopes, minutes, outcomes, checkpoint and prerequisite unit IDs. |
| Curated path | `src/data/learning/paths.json` | Reference 5–8 unit IDs in an order consistent with dependencies; declare parallel groups and optional units. Do not copy algorithm explanations. |
| New historical event | A reviewed new history input plus `src/data/history/editorial.json` | The imported v0.1 `raw/` files are immutable evidence snapshots. New evidence requires a documented adapter/migration and provenance update; do not overwrite original verification fields. |

For an existing algorithm's explanation, only edit its Markdown file. Map summaries, Atlas metadata and learning-card concept descriptions resolve that same record. Map sidebar idea/assumption/limitation/example sections are extracted from the same authored body. The legacy `algorithms` Content Collection is a route adapter over those files, not a second content source.

Required concept frontmatter is schema-checked in `src/lib/schema/knowledge.mjs`: existing title/English/description/date/tags/difficulty fields, `shortEnglish`, group and map order, foundation concept references, detail concept ID, optional lesson ID, explicit history IDs, resource reference IDs and Atlas visibility. Copy an existing file as the starting format. A new public concept also needs a mapped learning unit and a graph layout check; adding semantic relationships or putting it on a path is a separate editorial choice using IDs.

Resource selections belong to a learning task: the scope may differ even when two tasks use the same resource ID. Do not call editorial reading estimates official course duration. Guide Markdown under `src/content/resources` keeps guide advice and a `resourceId`; its URL comes from the registry.

Learning prerequisites refer only to units. Historical influence, comparisons and parallel work are event relationships, never converted into educational requirements. Foundation concept references are background guidance; they are not drawn as learning edges in the knowledge graph.

When replacing prerequisite requirements, existing completion records remain stored but can become pending until new prerequisites are explicitly covered. This release changes BO and multi-objective preparation from Gradient Descent to Experiment Design; the new task is not silently marked known. Users may complete its check or explicitly declare existing knowledge.

Public examples stay generic. Personal goals and completion files are local browser state; do not add them to the repository or static build inputs. No private research profile is required to use a path.

Run `npm run verify` before review. For routing changes, also run `GITHUB_REPOSITORY=Zeno01Lab/guide PREVIEW_DRAFTS=true npm run verify` in a separate validation copy. Browser acceptance must cover Safari/mobile, keyboard, zoom/minimap and progress-file transfer; automated data checks do not substitute for that.
