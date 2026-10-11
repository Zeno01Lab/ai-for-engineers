import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import {conceptSchema,resourceSchema,unitSchema,pathSchema,eventSchema} from './lib/schema/knowledge.mjs';
import registry from './data/knowledge/resources.json';
import units from './data/learning/units.json';
const resourceById=new Map(registry.map(r=>[r.id,r]));
const conceptData=conceptSchema.transform(data=>({...data,references:data.referenceIds.map(id=>{const r=resourceById.get(id);if(!r)throw Error('Unknown resource '+id);return{title:r.title,url:r.url};})}));
import { z } from 'astro/zod';

const base = z.object({
  title: z.string(), description: z.string(), date: z.coerce.date(),
  updated: z.coerce.date().optional(), tags: z.array(z.string()),
  difficulty: z.enum(['入门', '进阶']), estimatedReadingTime: z.number().positive(),
  prerequisites: z.array(z.string()),
  references: z.array(z.object({ title: z.string(), url: z.url() })).min(1),
  draft: z.boolean().default(true),
});
export const collections = {
  concepts:defineCollection({loader:glob({base:'./src/content',pattern:['algorithms/**/*.md','concepts/**/*.md'],generateId:({entry})=>entry.split('/').at(-1)!.replace(/\.md$/,'')}),schema:conceptData}),
  learningUnits:defineCollection({loader:file('./src/data/learning/units.json'),schema:unitSchema}),
  learningPaths:defineCollection({loader:file('./src/data/learning/paths.json'),schema:pathSchema}),
  resourceRegistry:defineCollection({loader:file('./src/data/knowledge/resources.json'),schema:resourceSchema}),
  historicalEvents:defineCollection({loader:file('./src/data/history/raw/nodes.json'),schema:eventSchema}),
  articles: defineCollection({
    loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
    schema: base.extend({ kind: z.enum(['guide', 'journal']) }),
  }),
  algorithms: defineCollection({
    loader: glob({ base: './src/content/algorithms', pattern: '**/*.{md,mdx}' }),
    schema: conceptData,
  }),
  resources: defineCollection({
    loader: glob({ base: './src/content/resources', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(), provider: z.string(), resourceId:z.string(), description: z.string(),
      category: z.string(), difficulty: z.enum(['入门', '进阶']), language: z.string(),
      prerequisites: z.string(), start: z.string(), verified: z.string(), draft: z.boolean().default(false),
      format: z.string(), programming: z.string(), math: z.string(), exercises: z.string(),
      audience: z.string(), skip: z.string(), editorial: z.string(),
      experience: z.enum(['未记录亲学体验', '作者亲学记录']).default('未记录亲学体验'),
      coding: z.enum(['optional', 'required', 'varies']),
      media: z.array(z.enum(['text', 'video', 'navigation'])).min(1),
      videoResourceId: z.string().optional(),
      videoAccess: z.enum(['public','login-required']).optional(),
      videoEdition: z.string().optional(),
      unitIds: z.array(z.string()).default([]),
    }).transform(data=>{const resource=resourceById.get(data.resourceId);if(!resource)throw Error('Unknown resource '+data.resourceId);const video=data.videoResourceId?resourceById.get(data.videoResourceId):undefined;if(data.videoResourceId&&!video)throw Error('Unknown video '+data.videoResourceId);if(video&&(!data.videoAccess||!data.videoEdition))throw Error('Video access and edition required');for(const id of data.unitIds)if(!units.some(u=>u.id===id))throw Error('Unknown unit '+id);return{...data,url:resource.url,videoUrl:video?.url};}),
  }),
};
