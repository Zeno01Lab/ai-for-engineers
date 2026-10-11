# Provenance · 来源与迁移

The handoff package was unpacked outside the website repository. Its `history-nodes-v01.json` and `history-relationships-v01.json` match the existing raw files byte for byte. No handoff prompts, personal profile template or private research material was copied into production inputs.

| Original evidence | SHA-256 |
| --- | --- |
| `src/data/history/raw/nodes.json` | `6f8d76af2f8d11ff588397f40a25494634e6c8ff8df07207e6ffc1ac797faa95` |
| `src/data/history/raw/relationships.json` | `66d3ef0136b5c04b8ace5b6e924ced2c8c896ae29b5c1de02da3c1b1cb781074` |

34 events and 24 editorial historical relationships survive unchanged. `year_basis`, original citation URLs, every verification object and `relationship_is_editorial_interpretation` remain original. There are 15 JRC report comparisons and **0 JRC CSV row matches**. This implementation does not claim a fresh literature review or completion of any course. Dataset, conference and product events remain historical events rather than being relabeled as algorithms.

Concept/event associations are explicit adaptations of existing map bindings and editorial method IDs. They mean association with a concept, not proof that the event invented it. History edges now declare event endpoints/layer; concept edges declare concept endpoints/layer; unit prerequisite edges are built independently from unit IDs.

The 15 Atlas Markdown bodies and 12 resource-guide bodies were compared with baseline commit `49001f2` and preserved byte for byte. Metadata was normalized into canonical records. All original 39 concept IDs, 32 prior unit IDs and old page routes survive; the new Experiment Design unit has its own ID. Compatibility projections are generated from these records.

The URL registry deduplicates 85 existing public resource/citation URLs. A `retained-source` status with no date does not imply a new visit. Resource-guide checks keep their previous recorded dates. Original historical citation URLs remain immutable evidence even if future editorial resource destinations change.

The existing project and dependency licenses are unchanged. No third-party roadmap, game artwork or copied skill-tree code was introduced. Referenced papers and courses are linked, not redistributed. JRC source datasets have their own attribution/license requirements; do not treat a linked publication as granting reuse of all figures or text. The original raw research package's license and verification boundaries still apply.

Official technical references checked for this implementation:

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — file/glob loaders and schema validation.
- [Astro GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) — existing workflow matches `actions/checkout@v7`, `withastro/action@v6`, `actions/deploy-pages@v5`, Node 24 and root/repository base handling. No remote Actions execution or publishing was performed.

Targeted production/source scans check forbidden private paths, common credential patterns and accidental handoff inclusion. This is an auditable check, not a guarantee that every possible sensitive datum can be detected automatically.
