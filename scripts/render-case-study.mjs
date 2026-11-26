const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

const plain = (value = '') => String(value)
  .replace(/<\/(?:p|div|li|h[1-6]|figure|figcaption)>/gi, ' ')
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\*\*/g, '')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;/gi, "'")
  .replace(/\s+/g, ' ')
  .trim();

const blocks = (value = '') => String(value)
  .replace(/<br\s*\/?\s*>\s*<br\s*\/?\s*>/gi, '</p><p>')
  .split(/<\/p>|<p(?:\s[^>]*)?>/gi)
  .map(plain)
  .filter(Boolean);

const excerpt = (value = '', max = 320) => {
  const text = plain(value);
  if (text.length <= max) return text;
  const short = text.slice(0, max);
  return `${short.slice(0, short.lastIndexOf(' '))}…`;
};

const projectPath = (project) => `/projects/${project.slug}.html`;
const jsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const displayTitles = {
  'debiased-multimodal-pipeline': 'Two-Step Claim Review',
  'hybrid-multimodal-whatsapp-router': 'WhatsApp Message Router',
  'deep-research': 'Agentic Deep Research',
  'ai-support-triage': 'AI Support Triage',
  'scrollers-dashboard': 'Scroller’s Dashboard',
  'portfolio-v3': 'Portfolio 3.0',
  tabvault: 'TabVault',
  precicast: 'PreciCast',
};

const visualCaptions = {
  'debiased-multimodal-pipeline': 'Architecture and evaluation artifact from a batch claim-review pipeline. No graphical application was built.',
  'hybrid-multimodal-whatsapp-router': 'Routing logic and measured outcomes from a Python batch pipeline. No graphical application was built.',
  'deep-research': 'Research pipeline artifact from a local command-line system. No graphical application was built.',
};

const curatedProblemPoints = {
  precicast: [
    'One rainfall total hides how the two models and their ensembles differ.',
    'A disagreement badge provides context; it is not a validated warning or a forecast skill score.',
    'ERA5 offers historical context, but it is reanalysis rather than independent gauge truth.',
  ],
};

const sectionHead = (id, number, title, summary) => `
  <header class="chapter-head" id="${id}">
    <div><span class="chapter-index">${number} / CASE STUDY</span><h2>${title}</h2></div>
    <p>${escapeHtml(summary)}</p>
  </header>`;

const imagePanel = (src, alt, caption, extraClass = '') => `
  <figure class="case-visual ${extraClass}">
    <div class="case-visual-field"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async"></div>
    ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ''}
  </figure>`;

export function renderCaseStudy(project, allProjects, site) {
  const detail = project.caseStudyDetails || {};
  const url = `${site}${projectPath(project)}`;
  const title = `${project.title} | Atharav Narang`;
  const description = excerpt(project.description, 160);
  const image = new URL(project.image, site).href;
  const codeUrl = project.repoLink || project.liveLink;
  const hasLiveApp = Boolean(project.repoLink && project.liveLink);
  const titleShort = displayTitles[project.slug] || project.title;
  const features = Array.isArray(detail.features) ? detail.features : [];
  const steps = Array.isArray(detail.pipeline) ? detail.pipeline : [];
  const metrics = Array.isArray(detail.metrics) ? detail.metrics.filter((item) => item?.label && item?.value) : [];
  const problemPoints = curatedProblemPoints[project.slug] || blocks(detail.problemText).slice(0, 4);
  const supportPoints = problemPoints.slice(1);
  const heroOutcome = metrics.length
    ? `${metrics[0].label}: ${metrics[0].value}. ${plain(detail.resultsNote || '')}`
    : plain(detail.resultsNote || detail.closingQuote || project.description);
  const decisionCopy = excerpt(blocks(detail.solutionText)[0] || detail.solutionTitle || project.description, 340);
  const principalImage = features.find((feature) => feature.image && feature.image !== project.image);
  const keyFlows = features.slice(0, 4);
  const otherProjects = allProjects.filter((item) => item.slug !== project.slug).slice(0, 3);
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
<meta name="theme-color" content="#0c0e0d"><link rel="icon" type="image/svg+xml" href="/favicon.svg">
<script>try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light-theme')}catch(e){}</script>
<link rel="stylesheet" href="/seo.css">
<link rel="stylesheet" href="/case-study.css">
<meta property="og:type" content="article"><meta property="og:site_name" content="Atharav Narang">
<meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(project.title)} project preview">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}">
<script type="application/ld+json">${jsonLd(schema)}</script>
</head><body class="seo-article project-${escapeHtml(project.slug)}">
<a class="skip" href="#content">Skip to content</a>
<nav class="case-nav" aria-label="Case study navigation">
  <a class="nav-back" href="/#projects"><span aria-hidden="true">←</span> All work</a>
  <span class="nav-divider" aria-hidden="true"></span>
  <a class="nav-name" href="/">Atharav Narang</a>
  <span class="nav-divider nav-detail" aria-hidden="true"></span>
  <div class="nav-sections"><a href="#problem">Problem</a><a href="#decision">Decision</a><a href="#process">How it works</a><a href="#impact">Impact</a></div>
  <button class="case-theme" type="button" aria-label="Toggle light and dark theme" title="Toggle theme">◐</button>
</nav>
<main id="content" class="case-main"><article>
  <header class="case-hero">
    <p class="case-kicker">SELECTED WORK <span>/</span> ${escapeHtml(project.tabTag || 'Software')}</p>
    <h1>${escapeHtml(titleShort)}</h1>
    <div class="hero-intro"><p class="hero-type">${escapeHtml(detail.platform || 'Software project')}</p><p class="hero-summary">${escapeHtml(project.description)}</p></div>
    <div class="hero-outcome"><span>RESULT IN CONTEXT</span><p>${escapeHtml(excerpt(heroOutcome, 240))}</p></div>
    <dl class="hero-facts">
      <div><dt>Role</dt><dd>${escapeHtml(detail.role || 'Developer')}</dd></div>
      <div><dt>Project</dt><dd>${escapeHtml(project.tabTag || 'Software')}</dd></div>
      <div><dt>Platform</dt><dd>${escapeHtml(detail.platform || 'Software project')}</dd></div>
      <div><dt>When</dt><dd>${escapeHtml(project.date || '—')}</dd></div>
    </dl>
    <div class="hero-actions">
      ${hasLiveApp ? `<a href="${escapeHtml(project.liveLink)}" target="_blank" rel="noopener noreferrer">Open live app <span aria-hidden="true">↗</span></a>` : ''}
      <a href="${escapeHtml(codeUrl)}" target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a>
    </div>
  </header>
  ${imagePanel(project.image, `${project.title} project artifact`, visualCaptions[project.slug] || 'A visual from the working project.', 'hero-art')}

  <section class="case-chapter" aria-labelledby="problem-heading">
    ${sectionHead('problem', '01', '<span id="problem-heading">THE PROBLEM</span>', detail.problemLead || detail.problemTitle || project.description)}
    <div class="problem-stage">
      <div class="problem-stage-copy"><span class="stage-label">WHY THIS MATTERS</span><h3>${escapeHtml(detail.problemTitle || 'The challenge behind the project')}</h3></div>
      <div class="problem-stage-detail"><p>${escapeHtml(problemPoints[0] || detail.problemLead || project.description)}</p><span class="stage-mark" aria-hidden="true">↗</span></div>
    </div>
    ${supportPoints.length ? `<div class="problem-grid count-${supportPoints.length}">${supportPoints.map((point, index) => `
      <div class="problem-point"><span>${String(index + 1).padStart(2, '0')}</span><p>${escapeHtml(point)}</p></div>`).join('')}</div>
    ` : ''}
  </section>

  <section class="case-chapter">
    ${sectionHead('decision', '02', 'THE <em>DECISION</em>', detail.solutionTitle || 'The approach I chose')}
    <div class="decision-grid">
      <div class="decision-before"><span class="stage-label">THE CONSTRAINT</span><h3>${escapeHtml(detail.problemTitle || 'The original challenge')}</h3><p>${escapeHtml(excerpt(detail.problemLead || project.description, 240))}</p></div>
      <div class="decision-after"><span class="stage-label">THE APPROACH</span><h3>${escapeHtml(detail.solutionTitle || 'What I built')}</h3><p>${escapeHtml(decisionCopy)}</p></div>
    </div>
    <div class="decision-note"><span>DESIGN PRINCIPLE</span><p>${escapeHtml(excerpt(detail.designPhilosophy || detail.closingQuote || decisionCopy, 360))}</p></div>
  </section>

  <section class="case-chapter">
    ${sectionHead('process', '03', 'HOW IT <em>WORKS</em>', detail.technicalText ? excerpt(detail.technicalText, 220) : 'The main steps and decisions behind the working system.')}
    ${principalImage ? imagePanel(principalImage.image, principalImage.caption || principalImage.title, principalImage.caption || '', 'process-art') : ''}
    ${steps.length ? `<div class="step-grid">${steps.map((step, index) => `<div class="step"><span>${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}</span><p>${escapeHtml(step)}</p></div>`).join('')}</div>` : ''}
    <div class="build-detail"><span class="stage-label">BUILT WITH</span><p>${escapeHtml(detail.techStack || project.technologies?.join(', ') || '')}</p></div>
  </section>

  ${keyFlows.length ? `<section class="case-chapter">
    ${sectionHead('details', '04', 'KEY <em>DETAILS</em>', 'A closer look at the decisions that shaped the result.')}
    <div class="flow-list">${keyFlows.map((feature, index) => `
      <div class="flow-item"><div class="flow-heading"><span>${String(index + 1).padStart(2, '0')} / ${String(keyFlows.length).padStart(2, '0')}</span><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.text)}</p></div>
      ${feature.image && feature.image !== principalImage?.image && feature.image !== project.image ? imagePanel(feature.image, feature.caption || feature.title, feature.caption, 'flow-art') : ''}</div>`).join('')}</div>
  </section>` : ''}

  <section class="case-chapter impact-chapter">
    ${sectionHead('impact', '05', 'THE <em>IMPACT</em>', detail.resultsNote || 'What the available evidence shows, and where it stops.')}
    ${metrics.length ? `<div class="metric-grid">${metrics.map((metric, index) => `<div class="metric"><span>${String(index + 1).padStart(2, '0')} / RESULT</span><strong>${escapeHtml(metric.value)}</strong><p>${escapeHtml(metric.label)}</p></div>`).join('')}</div>` : ''}
    <div class="impact-note"><span class="stage-label">WHAT I LEARNED</span><p>${escapeHtml(plain(detail.designPhilosophy || detail.closingQuote || detail.resultsNote || 'This project is an experiment, with its outcomes and limitations documented in the source repository.'))}</p></div>
  </section>
</article>
<section class="next-work"><span>MORE CASE STUDIES</span><h2>KEEP EXPLORING<span aria-hidden="true">↗</span></h2><div>${otherProjects.map((item) => `<a href="${projectPath(item)}"><span>${escapeHtml(displayTitles[item.slug] || item.title)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
</main>
<footer class="case-footer"><a href="/">Atharav Narang</a><span>Built with care, documented with context.</span><a href="mailto:atharavnarang05@gmail.com">Get in touch ↗</a></footer>
<script>
document.querySelector('.case-theme').addEventListener('click', () => {
  const next = !document.documentElement.classList.contains('light-theme');
  document.documentElement.classList.toggle('light-theme', next);
  try { localStorage.setItem('theme', next ? 'light' : 'dark'); } catch(e) {}
});
</script>
</body></html>`;
}
