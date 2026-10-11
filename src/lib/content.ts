import { getCollection } from 'astro:content';

// Draft visibility cannot be enabled by a production-build environment variable.
export const draftPreview = import.meta.env.DEV && process.env.PREVIEW_DRAFTS === 'true';
export const visible = (entry: { data: { draft: boolean } }) => !entry.data.draft || draftPreview;
export const href = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const articles = async () => (await getCollection('articles', visible)).sort((a,b) => b.data.date.getTime()-a.data.date.getTime());
export const algorithms = async () => (await getCollection('algorithms', visible)).sort((a,b) => a.id.localeCompare(b.id));
export const resources = async () => getCollection('resources', visible);
export const dateLabel = (date: Date) => date.toISOString().slice(0,10);
