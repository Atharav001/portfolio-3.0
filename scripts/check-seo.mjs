import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projects.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const fail = (message) => { throw new Error(`SEO check failed: ${message}`); };
const exists = async (path) => { try { await access(path); return true; } catch { return false; } };
const read = async (path) => readFile(join(dist, path), 'utf8');
const urls = [...new Set((await read('sitemap.xml')).match(/<loc>([^<]+)<\/loc>/g)?.map((item) => item.slice(5, -6)) || [])];
if (urls.length !== projectsData.length + 1) fail(`Expected ${projectsData.length + 1} unique sitemap URLs, got ${urls.length}`);
const index = await read('index.html');
if (!/<h1>[^<]+<\/h1>/.test(index) || !index.includes('id="projects"')) fail('Homepage fallback content missing');
if (!index.includes('application/ld+json')) fail('Homepage structured data missing');
if (!(await read('robots.txt')).includes('Sitemap: https://atharav001.vercel.app/sitemap.xml')) fail('Sitemap not declared in robots.txt');

for (const project of projectsData) {
  const path = `projects/${project.slug}.html`;
  const url = `https://atharav001.vercel.app/${path}`;
  if (!urls.includes(url)) fail(`${path} absent from sitemap`);
  if (!index.includes(`href="/${path}"`)) fail(`${path} absent from homepage HTML`);
  const html = await read(path);
  if (!html.includes(`rel="canonical" href="${url}"`)) fail(`${path} canonical mismatch`);
  if (!html.includes('<h1>') || !html.includes('name="description"')) fail(`${path} missing heading or description`);
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!schema) fail(`${path} missing structured data`);
  JSON.parse(schema);
  for (const source of html.matchAll(/(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
    const target = source[1].slice(1);
    if (!target) continue;
    if (!(await exists(join(dist, target)))) fail(`${path} references missing ${target}`);
  }
}
console.log(`SEO check passed: ${urls.length} sitemap URLs, ${projectsData.length} project pages, canonicals, structured data, and local assets`);
