import { articles, algorithms, resources, href } from '../lib/content';
import { knowledgeMap } from '../lib/global-map';
import steps from '../data/learning-path.json';
import paths from '../data/learning/paths.json';
import { historyNodes } from '../lib/history';
export async function GET() {
  const [notes, atlas, links] = await Promise.all([articles(), algorithms(), resources()]);
  const items = [
    {title:'University video courses · 名校视频课',description:'Stanford、MIT、Berkeley 公开课程与观看版本',url:href('resources/courses/'),kind:'导航',tags:['video','视频','课程']},
    {title:'Personalize a learning path · 定制学习路径',description:'匿名输入、源码与 Skill 下载、Codex 生成和校验步骤',url:href('learn/personalize/'),kind:'导航',tags:['个性化','Skill','路径']},
    {title:'开始学习',description:'五分钟起步关卡与可选入门实验',url:href('start/'),kind:'导航',tags:['入门','学习路线']},
    {title:'知识地图',description:'展开机器学习、深度学习与其他方法之间的关系',url:href('map/'),kind:'导航',tags:['地图','概览']},
    {title:'教程与实践',description:'基础教程、演示与方法图鉴',url:href('tutorials/'),kind:'导航',tags:['教程','Python','实践']},
    {title:'Learning Path · 学习路径',description:'外部课程选读、前置关系与平级分支，完成关卡点亮地图',url:href('learn/'),kind:'导航',tags:['路径','进阶']},
    ...paths.map(p=>({title:p.title.en+' · '+p.title.zh,description:p.description,url:href(`learn/${p.id}/`),kind:'学习路径',tags:[p.goal,'路径']})),
    ...steps.map(s=>({title:s.title,description:s.materials[0].scope,url:href(`learn/#level-${s.id}`),kind:'学习关卡',tags:[s.camp,s.materials[0].label]})),
    ...notes.map(e => ({title:e.data.title,description:e.data.description,url:href(`notes/${e.id}/`),kind:'文章',tags:e.data.tags})),
    ...knowledgeMap.nodes.map(n=>({title:n.fullLabel||n.label,description:n.description,url:href(`map/?view=structure&node=${n.id}#view-structure`),kind:'地图概念',tags:[n.group,n.subtitle]})),
    ...historyNodes.map(n=>({title:`${n.year} · ${n.title.en} · ${n.title.zh}`,description:`${n.title.en} · ${n.problem_or_motivation_zh}`,url:href(`map/history/${n.id}/`),kind:'历史节点',tags:[n.trackLabel,n.subjectLabel,n.title.en,String(n.year)]})),
    ...atlas.map(e => ({title:e.data.english+' · '+e.data.title,description:`${e.data.english} · ${e.data.description}`,url:href(`atlas/${e.id}/`),kind:'算法',tags:e.data.tags})),
    ...links.map(e => ({title:e.data.title,description:e.data.description,url:href(`resources/#${e.id}`),kind:'资源',tags:[e.data.category,e.data.provider]})),
  ];
  return new Response(JSON.stringify(items), {headers:{'Content-Type':'application/json; charset=utf-8'}});
}
