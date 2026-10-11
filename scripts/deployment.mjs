export function getDeployment(env) {
  const [owner, repo] = (env.GITHUB_REPOSITORY || '').split('/');
  const site = env.SITE_URL || (owner ? `https://${owner}.github.io` : undefined);
  const base = env.BASE_PATH ?? (owner && repo && repo.toLowerCase() !== `${owner.toLowerCase()}.github.io` ? `/${repo}` : '/');
  return { ...(site ? { site } : {}), base: `/${base.replace(/^\/+|\/+$/g, '')}` };
}
