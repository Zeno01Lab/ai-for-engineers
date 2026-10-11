# Inputs and Privacy · 输入与隐私

## Required public materials

| Local material | Purpose |
| --- | --- |
| `src/content/algorithms/*.md`, `src/content/concepts/*.md` | Canonical concepts and English/Chinese titles |
| `src/data/knowledge/resources.json` | Resource IDs, URLs, providers, language, verification history |
| `src/data/learning/units.json` | Concept/resource bindings, prerequisites, scope, duration, checkpoint |
| `src/data/learning/paths.json` | Generic path examples |
| `src/lib/schema/knowledge.mjs`, `src/lib/knowledge/validate.mjs` | Current schema and graph rules |
| `src/lib/storage/progress.mjs` | Progress format and import rules |
| `AGENTS.md`, content/provenance documents | Maintenance, attribution, draft filtering and privacy |

`concepts.generated.json` and `learning-path.json` are generated views, not independent authoring sources. Rebuild them using the repository's sync command when needed. Historical records provide context, not study prerequisites.

No full PDF/course download is required to generate a path from curated units. Adding materials is a separate editorial workflow: inspect selected excerpts, verify metadata and licensing, propose concept/resource/unit additions, review them, then update canonical records. A folder of PDFs is not automatically a validated knowledge base.

## Minimal personal intake

Use `assets/profile.template.json`. Empty strings mean unknown, not zero ability. Ask in one compact intake when possible:

1. **Learning Goal · 学习目标**: desired ability and one observable success criterion.
2. **Prior Knowledge · 已有基础**: math, coding and domain background; exact unit IDs the learner explicitly confirms, if available. Self-report is not a measured exam result.
3. **Time Budget · 时间预算**: minutes per week, maximum session duration, first-session duration; approximate deadline only if relevant.
4. **Language & Resources · 语言与资源**: English reading comfort, Chinese support, free-only/existing paid access, preferred formats.
5. **Environment · 使用环境**: available tools, device/installation constraints and topics to avoid.

Optional: website progress export, redacted syllabus, selected notes, public project brief, private excerpt explicitly chosen by the learner. Record the scope used. Do not require real name, email, school, supervisor, passwords, original experiments or unpublished manuscript.

## Storage and transmission

Use separate sibling directories, resolved on the actual machine:

- `/Users/learner/Projects/ai-for-engineers-site`: canonical public checkout.
- `/Users/learner/AI-Learning/private-inputs`: profile and chosen materials.
- `/Users/learner/AI-Learning/private-output`: plans and manifest.
- `/Users/learner/AI-Learning/local-preview`: disposable generated view.

Do not put personal data under `src`, `public`, the website Git checkout or hosting output. Ignoring a file does not remove a previously committed version. Browser progress is specific to its browser/origin.

Local storage differs from local inference. An online AI agent may receive supplied content. For strictly offline processing, use an appropriately configured local model and local scripts. This Skill does not guarantee offline execution or privacy. All public examples must be synthetic; no real identifying details belong in this Skill.
