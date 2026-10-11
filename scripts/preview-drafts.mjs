import { spawn } from 'node:child_process';
const child = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', ...process.argv.slice(2)], { stdio:'inherit', env:{ ...process.env, PREVIEW_DRAFTS:'true' } });
child.on('exit', code=>process.exit(code ?? 1));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
