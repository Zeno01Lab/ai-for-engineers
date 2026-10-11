// Generated-data projection; names are authored once in canonical Markdown.
import concepts from './knowledge/concepts.generated.json' with {type:'json'};
export const knowledgeTerms:Record<string,{en:string;short:string;zh:string}>=Object.fromEntries(concepts.map(c=>[c.id,{en:c.english,short:c.shortEnglish,zh:c.title}]));
