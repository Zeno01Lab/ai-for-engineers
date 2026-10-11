# Public Release · 公开发布边界

| Public educational repository | Local learner workspace |
| --- | --- |
| General concepts, public resources and learning units | Anonymous profile and personal constraints |
| Explicitly allowed generic paths | Personalized path and schedule |
| Clean Skill, scripts, blank/synthetic templates | Selected private excerpts and progress exports |
| Generic contribution/provenance guidance | Personal generation context and private manifest |

The current website has two generic paths: General AI Foundations and Optimization for Engineering Experiments. Neither is a real personal plan. To offer only foundations on GitHub, allow only `engineering-ai-foundations`. General optimization concepts can remain in the knowledge map even when its curated path is omitted.

## Actual static site behavior

The current `paths.json` controls routes, navigation, search and client progress validation. There is no profile intake, resource upload, AI generator, private-path importer or public/private build switch. Hiding a card does not remove its route, sitemap/search records or bundled data.

The Skill's `public` command generates an **unpublished release candidate** with a path allowlist. Its `preview` command generates a **local-only view** with a personal path. Both reuse the same tracked public source, UI, IDs and history; they are disposable outputs, not independently maintained websites. The canonical repository remains unchanged.

Outputs exclude Git metadata, hosting configuration, dependencies, build caches, untracked inputs, private-named directories, symlinks and automatic deployment workflows. This is not a full privacy sanitizer. Use an already reviewed public source checkout and review textual content before publishing.

## Release procedure

1. Choose generic path IDs explicitly. Keep personal inputs outside the canonical checkout; ensure concepts/resources/units contain only public information.
2. Generate a fresh candidate with `path_tools.py public`, outside the source checkout. Keep public and personal output directories separate.
3. If sharing the personalization method, add only clean Skill files and blank/synthetic templates. Do not copy prior private runs. Review Git history as well as the current tree; `.gitignore` does not erase existing commits.
4. Run actual sync, schema/DAG tests, type checks and builds. For a GitHub repository subpath, use the project's deployment settings and verify base-prefixed links.
5. Inspect HTML, search, sitemap, JavaScript, JSON and public assets for excluded path IDs, identifying phrases and private filenames. Existing privacy checks are targeted scans, not proof of privacy.
6. Obtain explicit user permission before a GitHub push or deployment. An earlier private preview approval is not approval for public GitHub publication.

Users can clone public source, supply anonymous local inputs to the Skill, generate a private plan and optionally a local website view. A future browser path importer is a separate convenience feature; it must validate canonical IDs and reject executable content. Website-hosted AI generation requires its own inference and transmission design.
