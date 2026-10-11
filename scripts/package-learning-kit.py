#!/usr/bin/env python3
"""Package public source + a byte-identical copy of the existing personalization Skill.
Pass the installed Skill root explicitly. No Git metadata, hosting IDs, private inputs or dependencies.
"""
from pathlib import Path
import argparse, hashlib, json, zipfile
p=argparse.ArgumentParser();p.add_argument('--skill',type=Path,required=True);args=p.parse_args()
repo=Path(__file__).resolve().parents[1];skill=args.skill.resolve()
blocked={'.git','.openai','.github','.env','node_modules','dist','.astro','private','secrets','handoff','private-inputs','private-output','local-preview','research-private','__pycache__'}
top={'package.json','package-lock.json','astro.config.mjs','tsconfig.json','.gitignore','.node-version','AGENTS.md','README.md'}
files=[]
for base in ('src','public','scripts'):
 for f in (repo/base).rglob('*'):
  rel=f.relative_to(repo)
  if f.is_symlink() or not f.is_file() or any(s.lower() in blocked or s.lower().startswith('.env') for s in rel.parts):continue
  if rel.parts[:2]==('public','downloads'):continue
  files.append((f,'ai-for-engineers-site/'+rel.as_posix()))
for name in top:
 if (repo/name).is_file():files.append((repo/name,'ai-for-engineers-site/'+name))
for base in ('SKILL.md','references','scripts','assets','agents'):
 root=skill/base
 for f in ([root] if root.is_file() else root.rglob('*')):
  if not f.is_file() or f.is_symlink() or '__pycache__' in f.parts:continue
  files.append((f,'skills/personalize-ai-learning-path/'+f.relative_to(skill).as_posix()))
readme='''# AI for Engineers — local personalization kit

This is public learning content and an unchanged copy of the existing personalize-ai-learning-path Skill. It contains no personal plan or hosting credentials and does not include course videos themselves.

1. Copy the original downloaded ai-learning-kit.zip into ai-for-engineers-site/public/downloads/ai-learning-kit.zip (create the folder if needed). The archive excludes its own ZIP to avoid recursion; this restores the download link for build checks. Open ai-for-engineers-site in Codex. Requires Node >=24, npm, Python 3 and Git. Review AGENTS.md and the Skill's SKILL.md. Run npm ci and npm run verify. These package commands install/build website dependencies; the Skill validator itself uses Python standard library only.
2. The downloaded source has no Git metadata. After reviewing it, initialize local history inside ai-for-engineers-site: `git init`, `git add .`, then `git -c user.name="Local learner" -c user.email="local@example.invalid" commit -m "Local learning source"`. Do not add a remote or push. This baseline is required by the Skill's disposable preview command, which copies tracked files only.
3. Create a separate directory alongside the website, e.g. private-plan. Save the questionnaire's profile.json there, or copy skills/personalize-ai-learning-path/assets/profile.template.json and fill it anonymously. Never put it under the website's src/public directories. No name, school, email or login is needed.
4. Give Codex the questionnaire request and the bundled SKILL.md. It should generate profile.json, plan.json, plan.md and source-manifest.json in private-plan. Read the Skill and reference files for full requirements. The current schema permits 5–8 units including all prerequisites; longer goals require first-stage coverage plus a backlog.
5. From the kit root run: `python3 skills/personalize-ai-learning-path/scripts/path_tools.py validate --repo /absolute/ai-for-engineers-site --plan /absolute/private-plan/plan.json`.
6. For a local view: `python3 skills/personalize-ai-learning-path/scripts/path_tools.py preview --repo /absolute/ai-for-engineers-site --plan /absolute/private-plan/plan.json --output /absolute/new-personal-preview`. The output must be a new directory outside the website. Run npm ci and npm run verify there before opening npm run dev in your preferred local browser. The canonical website is unchanged. Do not publish the personal preview.

The questionnaire prepares inputs; it does not run online AI. Generating a plan never marks learning complete. The website's progress import accepts learning records, not plan.json. Reuse concept/resource/unit IDs and only unit prerequisites to impose order. If cloud AI is used, submitted profiles/excerpts can reach that service even when files are saved locally.

Video links were checked against official course pages on 2026-10-10; playback, network availability and every lecture have not been tested. Video selections refer to task excerpts, not full course durations. CMU archival recordings require login. No GitHub push or deployment is part of this kit.

To reduce archive size, this bundle excludes its own download ZIP from the copied website. To restore that download link when building this copy, copy the original ai-learning-kit.zip to ai-for-engineers-site/public/downloads/ai-learning-kit.zip before running npm run verify. Do not rebuild a kit from a personalized source tree.
'''
output=repo/'public/downloads/ai-learning-kit.zip';output.parent.mkdir(parents=True,exist_ok=True)
manifest={'bundleVersion':1,'scope':'public canonical source and unmodified Skill; no personal inputs','sha256':{name:hashlib.sha256(f.read_bytes()).hexdigest() for f,name in files}}
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
 for f,name in sorted(files,key=lambda pair:pair[1]):z.write(f,name)
 z.writestr('README.md',readme);z.writestr('bundle-manifest.json',json.dumps(manifest,indent=2))
print(json.dumps({'archive':str(output),'files':len(files)+2,'bytes':output.stat().st_size}))
