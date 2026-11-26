import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectsData } from '../src/data/projects.js';

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
const paragraph = (value) => value ? `<p>${escapeHtml(plain(value))}</p>` : '';
const seoPath = (project) => `/projects/${project.slug}.html`;
const metaDescription = (project) => {
  const description = plain(project.description);
  if (description.length <= 160) return description;
  const firstSentence = description.match(/^.*?[.!?](?=\s|$)/)?.[0];
  return firstSentence && firstSentence.length >= 80 && firstSentence.length <= 160
    ? firstSentence
    : `${description.slice(0, 157).replace(/\s+\S*$/, '')}…`;
};
const asJsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const homepageFallback = `<div id="root"><div class="seo-fallback">
  <header><a href="/">Atharav Narang</a><nav aria-label="Portfolio sections"><a href="#projects">Projects</a><a href="mailto:atharavnarang05@gmail.com">Contact</a></nav></header>
  <main id="main-content"><p class="eyebrow">Software engineering portfolio</p><h1>Atharav Narang</h1>
  <p>Second-year B.Tech Computer Science student at Manipal Institute of Technology, Bengaluru. I build and evaluate software, AI pipelines, Android apps, and web tools.</p>
  <section id="projects"><h2>Projects and case studies</h2><p>Explore what I built, how it works, and the limits of each result.</p>
  <div class="seo-fallback-grid">${projectsData.map((project) => `<article><h3><a href="${seoPath(project)}">${escapeHtml(project.title)}</a></h3><p>${escapeHtml(project.description)}</p></article>`).join('')}</div></section>
  <p><a href="https://github.com/Atharav001">GitHub</a> · <a href="https://www.linkedin.com/in/atharav-narang-132b74273/">LinkedIn</a> · <a href="mailto:atharavnarang05@gmail.com">Email Atharav</a></p>
  </main></div></div>`;

function projectPage(project) {
  const detail = project.caseStudyDetails || {};
  const url = `${site}${seoPath(project)}`;
  const title = `${project.title} | Atharav Narang`;
  const description = metaDescription(project);
  const image = new URL(project.image, site).href;
  const codeUrl = project.repoLink || project.liveLink;
  const liveLink = project.repoLink ? `<a class="action" href="${escapeHtml(project.liveLink)}" target="_blank" rel="noopener noreferrer">Open live app ↗</a>` : '';
  const features = (detail.features || []).map((feature) => `<section><h3>${escapeHtml(feature.title)}</h3>${paragraph(feature.text)}${feature.image ? `<img loading="lazy" decoding="async" src="${escapeHtml(feature.image)}" alt="${escapeHtml(feature.caption || feature.title)}">` : ''}${feature.caption ? `<p class="caption">${escapeHtml(feature.caption)}</p>` : ''}</section>`).join('');
  const metrics = Array.isArray(detail.metrics) ? detail.metrics.filter((item) => item?.label && item?.value) : [];
  const metricTable = metrics.length ? `<section><h2>Results</h2><table><tbody>${metrics.map((item) => `<tr><th scope="row">${escapeHtml(item.label)}</th><td>${escapeHtml(item.value)}</td></tr>`).join('')}</tbody></table>${paragraph(detail.resultsNote)}</section>` : '';
  const otherProjects = projectsData.filter((item) => item.slug !== project.slug).slice(0, 4);
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url, url, name: title, description, inLanguage: 'en', primaryImageOfPage: image },
      { '@type': 'SoftwareSourceCode', '@id': `${url}#project`, name: project.title, description, image, url, author: { '@type': 'Person', name: 'Atharav Narang', url: site }, ...(codeUrl?.includes('github.com') ? { codeRepository: codeUrl } : {}) },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${site}/#projects` },
        { '@type': 'ListItem', position: 3, name: project.title, item: url },
      ] },
    ],
  };
  return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}">
<meta name="robots" content="index,follow"><link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b1110"><link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script>try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light-theme')}catch(e){}</script>
<link rel="stylesheet" href="/seo.css">
<meta property="og:type" content="article"><meta property="og:site_name" content="Atharav Narang">
<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(project.title)} project preview">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}">
<script type="application/ld+json">${asJsonLd(schema)}</script>
</head><body class="seo-article project-${escapeHtml(project.slug)}"><a class="skip" href="#content">Skip to content</a>
<header class="site-header"><a class="brand" href="/">Atharav Narang</a><nav aria-label="Main navigation"><a href="/#projects">All projects</a><a href="mailto:atharavnarang05@gmail.com">Contact</a></nav></header>
<main id="content"><article>
<header class="article-head"><p class="eyebrow">Project case study <span>/ ${escapeHtml(project.tabTag || 'Software')}</span></p><h1>${escapeHtml(project.title)}</h1>
${paragraph(project.description)}<div class="article-meta"><span>Built by Atharav Narang</span>${project.date ? `<span>${escapeHtml(project.date)}</span>` : ''}</div>
<dl class="project-facts"><div><dt>Role</dt><dd>${escapeHtml(detail.role || 'Developer')}</dd></div><div><dt>Platform</dt><dd>${escapeHtml(detail.platform || 'Software project')}</dd></div></dl>
<div class="actions">${liveLink}<a class="action" href="${escapeHtml(codeUrl)}" target="_blank" rel="noopener noreferrer">View code on GitHub ↗</a></div></header>
<figure class="hero-image"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} project preview" width="1200" height="750" fetchpriority="high" decoding="async"><figcaption>${['debiased-multimodal-pipeline','hybrid-multimodal-whatsapp-router','deep-research'].includes(project.slug) ? 'Original architecture or evaluation artifact. This is a Python pipeline, not a graphical app.' : 'Project interface or portfolio visual.'}</figcaption></figure>
<div class="article-grid"><aside aria-label="Case study contents"><p>ON THIS PAGE</p><a href="#problem">The problem</a><a href="#solution">What I built</a><a href="#implementation">Implementation</a><a href="#results">Results and limits</a></aside>
<div class="article-body"><section id="problem"><p class="eyebrow">01 / Problem</p><h2>${escapeHtml(detail.problemTitle || 'The problem')}</h2>${paragraph(detail.problemText)}</section>
<section id="solution"><p class="eyebrow">02 / Approach</p><h2>${escapeHtml(detail.solutionTitle || 'What I built')}</h2>${paragraph(detail.solutionText)}${features}</section>
<section id="implementation"><p class="eyebrow">03 / Implementation</p><h2>How it works</h2>${paragraph(detail.technicalText)}${Array.isArray(detail.pipeline) && detail.pipeline.length ? `<ol>${detail.pipeline.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>` : ''}<p><strong>Tools:</strong> ${escapeHtml(detail.techStack || project.technologies?.join(', ') || '')}</p></section>
<div id="results">${metricTable}<section><p class="eyebrow">04 / Lessons</p><h2>What the evidence shows</h2>${paragraph(detail.designPhilosophy || detail.closingQuote || detail.resultsNote)}</section></div>
</div></div></article>
<section class="more-projects"><h2>Explore more projects</h2><div>${otherProjects.map((item) => `<a href="${seoPath(item)}">${escapeHtml(item.title)} <span>↗</span></a>`).join('')}</div></section></main>
<footer><a href="/">← Back to portfolio</a><span>© Atharav Narang</span></footer></body></html>`;
}

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
