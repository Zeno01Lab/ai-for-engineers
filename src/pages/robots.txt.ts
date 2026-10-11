import type { APIContext } from 'astro';
import { href } from '../lib/content';
export function GET({ site }: APIContext) { return new Response(`User-agent: *\nAllow: /\n${site ? `Sitemap: ${new URL(href('sitemap.xml'),site).href}\n` : ''}`,{headers:{'Content-Type':'text/plain'}}); }
