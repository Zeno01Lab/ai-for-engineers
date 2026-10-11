import { articles, algorithms, href } from '../lib/content';
import type { APIContext } from 'astro';
import learningPaths from '../data/learning/paths.json';
import { historyNodes } from '../lib/history';
export async function GET({ site }: APIContext) {
  const paths = ['', 'start/', 'map/', 'map/history/', 'map/sources/', 'tutorials/', 'learn/', 'learn/personalize/', 'resources/courses/', 'atlas/', 'notes/', 'resources/', 'about/', ...learningPaths.map(p=>`learn/${p.id}/`), ...historyNodes.map(n=>`map/history/${n.id}/`), ...(await algorithms()).map(e=>`atlas/${e.id}/`), ...(await articles()).map(e=>`notes/${e.id}/`)];
  const escape = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const urls = site ? paths.map(p=>`<url><loc>${escape(new URL(href(p),site).href)}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,{headers:{'Content-Type':'application/xml'}});
}
