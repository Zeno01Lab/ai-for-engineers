#!/usr/bin/env python3
"""Validate current AI for Engineers paths; generate unpublished static views.

Uses only Python's standard library. Never edits the canonical checkout, runs
package scripts, transmits inputs, starts a browser, or publishes a website.
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlsplit

ID = re.compile(r"^[a-z0-9][a-z0-9-]*$")
PATH_KEYS = {"id", "title", "goal", "description", "unitIds", "parallelGroups", "optionalUnitIds", "entryConceptIds"}
DATA_FILES = ["src/data/knowledge/concepts.generated.json", "src/data/knowledge/resources.json", "src/data/learning/units.json", "src/data/learning/paths.json", "src/lib/schema/knowledge.mjs"]
TOP_FILES = {"package.json", "package-lock.json", "astro.config.mjs", "tsconfig.json", ".gitignore", ".node-version", "AGENTS.md", "README.md", "CONTENT_GUIDE.md", "CONTRIBUTING.md", "MAINTAINING.md", "CURRICULUM_DESIGN.md"}
BLOCKED = {".git", ".openai", ".github", "node_modules", "dist", ".astro", "private", "secrets", "handoff", "research-private", "private-inputs", "private-output", "local-preview"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_json(path):
    require(path.is_file() and path.stat().st_size <= 5_000_000, "Missing or oversized JSON: " + str(path))
    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result, "Duplicate JSON key: " + key)
            result[key] = value
        return result
    return json.loads(path.read_text(encoding="utf-8"), object_pairs_hook=pairs)


def index(items, label):
    require(isinstance(items, list), label + " must be an array")
    result = {}
    for item in items:
        require(isinstance(item, dict) and isinstance(item.get("id"), str) and ID.fullmatch(item["id"]), "Invalid " + label + " ID")
        require(item["id"] not in result, "Duplicate " + label + " ID: " + item["id"])
        result[item["id"]] = item
    return result


def ids(value, label, minimum=0):
    require(isinstance(value, list) and len(value) >= minimum, label + " must be an array of IDs")
    require(all(isinstance(v, str) and ID.fullmatch(v) for v in value), "Invalid ID in " + label)
    require(len(set(value)) == len(value), "Duplicate IDs in " + label)
    return value


def load_data(repo):
    data = [read_json(repo / name) for name in DATA_FILES[:4]]
    concepts, resources, units, paths = [index(d, label) for d, label in zip(data, ["concept", "resource", "unit", "path"])]
    schema = (repo / DATA_FILES[4]).read_text(encoding="utf-8")
    require("unitIds:z.array(id).min(5).max(8)" in re.sub(r"\s+", "", schema), "Path schema changed; inspect it and update this tool before use")
    ancestors, visiting = {}, set()
    def before(unit_id):
        require(unit_id in units, "Unknown prerequisite unit: " + unit_id)
        require(unit_id not in visiting, "Prerequisite cycle: " + unit_id)
        if unit_id in ancestors:
            return ancestors[unit_id]
        visiting.add(unit_id)
        result = set()
        for parent in ids(units[unit_id].get("prerequisiteUnitIds"), "unit prerequisites"):
            result.add(parent)
            result.update(before(parent))
        visiting.remove(unit_id)
        ancestors[unit_id] = result
        return result
    for unit_id in units:
        before(unit_id)
    return concepts, resources, units, paths, ancestors


def validate_path(path, data):
    concepts, resources, units, _, ancestors = data
    require(isinstance(path, dict) and set(path) == PATH_KEYS, "Unknown or missing path fields")
    for field in ["id", "goal"]:
        require(isinstance(path[field], str) and ID.fullmatch(path[field]), "Invalid path " + field)
    require(isinstance(path["title"], dict) and set(path["title"]) == {"en", "zh"}, "Require English and Chinese titles")
    require(all(isinstance(v, str) and v.strip() for v in path["title"].values()), "Empty bilingual title")
    require(isinstance(path["description"], str) and path["description"].strip(), "Missing description")
    unit_ids = ids(path["unitIds"], "path units", 5)
    require(len(unit_ids) <= 8, "Current path schema allows at most eight units; report first-stage coverage")
    order = {unit_id: pos for pos, unit_id in enumerate(unit_ids)}
    for unit_id in unit_ids:
        require(unit_id in units, "Unknown path unit: " + unit_id)
        unit = units[unit_id]
        for ancestor in ancestors[unit_id]:
            require(ancestor in order and order[ancestor] < order[unit_id], "Missing or misordered prerequisite: " + ancestor + " -> " + unit_id)
        require(type(unit.get("minutes")) is int and unit["minutes"] > 0, "Invalid duration: " + unit_id)
        for concept_id in ids(unit.get("conceptIds"), "unit concepts", 1):
            require(concept_id in concepts and concepts[concept_id].get("draft") is False, "Unknown or draft concept: " + concept_id)
        require(isinstance(unit.get("resourceSelections"), list) and unit["resourceSelections"], "Missing resource selection: " + unit_id)
        for selection in unit["resourceSelections"]:
            require(isinstance(selection, dict) and set(selection) == {"resourceId", "scope"}, "Invalid resource selection")
            resource_id = selection["resourceId"]
            require(isinstance(resource_id, str) and resource_id in resources, "Unknown resource ID")
            require(isinstance(selection["scope"], str) and selection["scope"].strip(), "Missing reading scope")
            url = urlsplit(resources[resource_id].get("url", ""))
            require(url.scheme in ["http", "https"] and url.hostname, "Invalid public resource URL")
        require(isinstance(unit.get("checkpoint"), str) and unit["checkpoint"].strip(), "Missing checkpoint: " + unit_id)
    require(units[unit_ids[0]]["minutes"] <= 30, "First canonical unit must be at most 30 minutes")
    require(isinstance(path["parallelGroups"], list), "parallelGroups must be an array")
    for group in path["parallelGroups"]:
        ids(group, "parallel group", 2)
        for unit_id in group:
            require(unit_id in order, "Parallel unit outside path: " + unit_id)
            require(not any(other in ancestors[unit_id] for other in group), "Dependent units cannot be parallel")
    optional = set(ids(path["optionalUnitIds"], "optional units"))
    require(optional <= set(order), "Optional unit outside path")
    for unit_id in set(order) - optional:
        require(not optional.intersection(ancestors[unit_id]), "Required unit depends on optional unit")
    for concept_id in ids(path["entryConceptIds"], "entry concepts"):
        require(concept_id in concepts, "Unknown entry concept: " + concept_id)
    return {"pathId": path["id"], "unitCount": len(order), "requiredMinutes": sum(units[u]["minutes"] for u in order if u not in optional), "totalMinutes": sum(units[u]["minutes"] for u in order)}


def load_plan(repo, plan_file, data):
    require(not plan_file.is_relative_to(repo), "Personal plan must live outside the canonical website repository")
    envelope = read_json(plan_file)
    require(isinstance(envelope, dict) and set(envelope) == {"schemaVersion", "visibility", "coverage", "path"}, "Unknown or missing plan envelope fields")
    require(type(envelope["schemaVersion"]) is int and envelope["schemaVersion"] == 1, "Unsupported plan version")
    require(envelope["visibility"] == "local_only", "Personal plans must be local_only")
    require(envelope["coverage"] in ["first_stage", "full_goal"], "Invalid coverage label")
    summary = validate_path(envelope["path"], data)
    require(envelope["path"]["id"] not in data[3], "Personal path ID conflicts with a curated path")
    summary["coverage"] = envelope["coverage"]
    return envelope["path"], summary


def generate_view(repo, output, paths, mode):
    require(not output.exists(), "Output must be a new directory; existing files will not be overwritten")
    require(not output.is_relative_to(repo) and not repo.is_relative_to(output), "Output must be outside the canonical checkout and must not contain it")
    top = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "--show-toplevel"], text=True).strip()
    require(Path(top).resolve() == repo, "Use the root of the canonical Git checkout")
    tracked = subprocess.check_output(["git", "-C", str(repo), "ls-files", "-z"]).decode().split("\0")
    files = []
    for name in filter(None, tracked):
        relative = Path(name)
        require(not relative.is_absolute() and ".." not in relative.parts, "Invalid tracked filename")
        if any(part.lower() in BLOCKED or part.lower().startswith(".env") for part in relative.parts):
            continue
        if relative.parts[0] not in ["src", "public", "scripts"] and name not in TOP_FILES:
            continue
        source = repo / relative
        if any((repo / Path(*relative.parts[:i])).is_symlink() for i in range(1, len(relative.parts) + 1)) or not source.is_file() or not source.resolve().is_relative_to(repo):
            continue
        files.append(relative)
    require(all(Path(f) in files for f in ["package.json", "package-lock.json", "astro.config.mjs", "src/data/learning/paths.json"]), "Required tracked source files missing")
    output.mkdir(parents=True)
    for relative in files:
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(repo / relative, target)
    (output / "src/data/learning/paths.json").write_text(json.dumps(paths, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    commit = subprocess.check_output(["git", "-C", str(repo), "rev-parse", "HEAD"], text=True).strip()
    clean = not subprocess.check_output(["git", "-C", str(repo), "status", "--porcelain"], text=True).strip()
    manifest = {"mode": mode, "published": False, "sourceCommit": commit, "sourceTreeClean": clean, "sourceHashes": {name: hashlib.sha256((repo / name).read_bytes()).hexdigest() for name in DATA_FILES}, "pathIds": [path["id"] for path in paths], "copiedFiles": len(files), "limits": "No dependencies or browser QA. Review all source and build output before publishing; this is not a privacy sanitizer."}
    (output / "source-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    note = "LOCAL ONLY. Contains a personalized path. Do not publish this directory.\n" if mode == "personal-preview" else "UNPUBLISHED public release candidate. Requires actual build checks and owner approval.\n"
    (output / "VIEW_NOT_PUBLISHED.txt").write_text(note, encoding="utf-8")
    return {"output": str(output), "mode": mode, "pathCount": len(paths), "copiedFiles": len(files), "published": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for command in ["validate", "preview", "public"]:
        p = sub.add_parser(command)
        p.add_argument("--repo", type=Path, required=True)
        if command != "public":
            p.add_argument("--plan", type=Path, required=True)
        if command != "validate":
            p.add_argument("--output", type=Path, required=True)
        if command == "public":
            p.add_argument("--allow-path", action="append", required=True)
    args = parser.parse_args()
    try:
        repo = args.repo.resolve()
        data = load_data(repo)
        if args.command == "public":
            allowed = ids(args.allow_path, "allowed public paths", 1)
            require(all(path_id in data[3] for path_id in allowed), "Unknown allowed public path")
            paths = [data[3][path_id] for path_id in allowed]
            for path in paths:
                validate_path(path, data)
            result = generate_view(repo, args.output.resolve(), paths, "public-candidate")
        else:
            path, result = load_plan(repo, args.plan.resolve(), data)
            if args.command == "preview":
                result = generate_view(repo, args.output.resolve(), list(data[3].values()) + [path], "personal-preview")
        print(json.dumps({"ok": True, **result}, ensure_ascii=False, indent=2))
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, "ERROR: " + str(error) + "\n")


if __name__ == "__main__":
    main()
