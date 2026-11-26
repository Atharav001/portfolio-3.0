import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projects.js';
import { renderCaseStudy } from './render-case-study.mjs';

const site = 'https://atharav001.vercel.app';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const projectDir = join(dist, 'projects');
const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const plain = (value = '') => clean(String(value)
  .replace(/<\/(?:p|div|li|h[1-6]|figure|figcaption)>/gi, ' ')
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'"));
const seoPath = (project) => `/projects/${project.slug}.html`;

const homepageFallback = `<div id="root"><div class="seo-fallback">
  <header><a href="/">Atharav Narang</a><nav aria-label="Portfolio sections"><a href="#projects">Projects</a><a href="mailto:atharavnarang05@gmail.com">Contact</a></nav></header>
  <main id="main-content"><p class="eyebrow">Software engineering portfolio</p><h1>Atharav Narang</h1>
  <p>Second-year B.Tech Computer Science student at Manipal Institute of Technology, Bengaluru. I build and evaluate software, AI pipelines, Android apps, and web tools.</p>
  <section id="projects"><h2>Projects and case studies</h2><p>Explore what I built, how it works, and the limits of each result.</p>
  <div class="seo-fallback-grid">${projectsData.map((project) => `<article><h3><a href="${seoPath(project)}">${escapeHtml(project.title)}</a></h3><p>${escapeHtml(project.description)}</p></article>`).join('')}</div></section>
  <p><a href="https://github.com/Atharav001">GitHub</a> · <a href="https://www.linkedin.com/in/atharav-narang-132b74273/">LinkedIn</a> · <a href="mailto:atharavnarang05@gmail.com">Email Atharav</a></p>
  </main></div></div>`;

const projectPage = (project) => renderCaseStudy(project, projectsData, site);

await mkdir(projectDir, { recursive: true });
const indexPath = join(dist, 'index.html');
let index = await readFile(indexPath, 'utf8');
if (!index.includes('<div id="root"></div>')) throw new Error('Expected Vite root marker missing');
index = index.replace('<div id="root"></div>', homepageFallback);
index = index.replace('</head>', '    <link rel="stylesheet" href="/seo.css" />\n  </head>');
await writeFile(indexPath, index);

for (const project of projectsData) {
  if (!/^[a-z0-9-]+$/.test(project.slug)) throw new Error(`Invalid project slug: ${project.slug}`);
  await writeFile(join(projectDir, `${project.slug}.html`), projectPage(project));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[`${site}/`, ...projectsData.map((project) => `${site}${seoPath(project)}`)].map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
const llms = `# Atharav Narang\n\n> Software engineering portfolio by Atharav Narang, a B.Tech Computer Science student at Manipal Institute of Technology, Bengaluru.\n\nThe site contains original project case studies. Results and limitations should be read together; prototype metrics are not production guarantees.\n\n## Project case studies\n\n${projectsData.map((project) => `- [${project.title}](${site}${seoPath(project)}): ${plain(project.description)}`).join('\n')}\n\n## Contact and profiles\n\n- [Portfolio](${site}/)\n- [GitHub](https://github.com/Atharav001)\n- [LinkedIn](https://www.linkedin.com/in/atharav-narang-132b74273/)\n`;
await writeFile(join(dist, 'llms.txt'), llms);
console.log(`SEO output: homepage fallback, ${projectsData.length} project pages, sitemap.xml, llms.txt`);
