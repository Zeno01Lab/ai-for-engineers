# Planning Rules · 路径生成规则

## Four shared layers

- **Concept · 知识点**: one stable `conceptId` in the knowledge base.
- **Learning Unit · 学习单元**: concept/resource IDs, assigned resource scope, duration, checkpoint and `prerequisiteUnitIds`.
- **Learning Path · 学习路径**: selected ordered units, independent parallel groups and optional branches.
- **Learning Progress · 学习进度**: explicitly confirmed unit statuses; derive lit concepts through the existing engine.

Paths can share units and reuse their progress. Do not duplicate tutorials or create a concept ID merely for a personal application example.

## Selection procedure

1. Map the observable goal to existing concepts and target units. Label uncertain mappings and missing content.
2. Compute the full transitive prerequisite union with cycle detection. Keep already-known ancestors in the structure.
3. Topologically sort; use preferences only for independent choices. Prefer a 5–10 minute existing first task.
4. Mark parallel units only if none is an ancestor of another. Parallel means either order, not simultaneous work.
5. Make a unit optional only if no required unit depends on it.
6. Assign actual registered resources and scopes. Do not call a research paper a beginner course or claim a link checked today without doing so.
7. Split long units into sessions within the budget, keeping one canonical checkpoint/ID. Distinguish assigned excerpt estimates from full-course duration.
8. Run mechanical validation and actual repository checks; review educational fit separately.

## Current strict schema

```json
{
  "id": "local-experiment-intro",
  "title": {"en": "Experiment Optimization: First Stage", "zh": "实验优化：第一阶段"},
  "goal": "experiment-optimization-intro",
  "description": "A small first stage built from shared units.",
  "unitIds": ["first-step", "first-prediction", "basecamp", "chance", "experiment-design", "bo-route"],
  "parallelGroups": [["chance", "experiment-design"]],
  "optionalUnitIds": [],
  "entryConceptIds": []
}
```

Every ancestor must appear before its dependent. `entryConceptIds` does not exempt prerequisites; `already_known` does not change structural validation. Bounds: 5–8 units. For a goal such as AI Agents, calculate the actual closure. If it exceeds eight, generate an honestly labeled first stage plus a backlog. Later stages with externally satisfied prerequisites require a schema/UI extension. Arbitrary short chunks are not valid closed paths.

Keep visibility, intake and scheduling fields in the private envelope/documents, not the strict nested path object.

## Required plan document

Include goal, sources, assumptions, coverage and exclusions; English-first bilingual prerequisite/parallel/optional labels; every unit's bilingual title, concept IDs, time, real resource title/URL/scope, checkpoint and rationale; first session, weekly schedule, long-unit splits, explicit prior knowledge and backlog; source hash/commit and actual validation results. Use a 2D DAG when useful. Historical evolution arrows must never become prerequisites.

## Progress transfer

Current public import accepts exactly:

```json
{"schemaVersion":1,"unitStatus":{},"selectedPath":null,"updatedAt":"2026-10-10T00:00:00.000Z"}
```

Allowed statuses: `not_started`, `in_progress`, `completed`, `already_known`. Use canonical unit IDs only. The intake profile and path definition are not progress JSON.

A local preview knows its extra path ID; the public site does not. To return local progress to the public site, make a copy of the export, retain canonical unit statuses and timestamp, and set an unknown private `selectedPath` to `null`. Validate against destination IDs; report unavailable unit IDs rather than silently discarding them. Different origins need explicit export/import. Never create completed statuses merely to make a plan work.
