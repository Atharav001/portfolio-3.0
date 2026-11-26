import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { projectsData } from '../data/projects';
import WorkflowVisual from './WorkflowVisual';
import { useModalFocus } from '../hooks/useModalFocus';
import './Projects.css';

const featuredSlugs = [
  'debiased-multimodal-pipeline',
  'hybrid-multimodal-whatsapp-router',
  'deep-research',
];

const showcase = {
  'debiased-multimodal-pipeline': {
    title: 'Two-Step Claim Review',
    source: 'Multimodal AI / Hackathon',
    role: 'Student developer',
    scope: 'Image + claim evaluation',
    outcome: '65% claim-status accuracy on the published set; 20% severity accuracy',
  },
  'hybrid-multimodal-whatsapp-router': {
    title: 'WhatsApp Message Router',
    source: 'Messaging / Applied AI',
    role: 'Student developer',
    scope: 'Text, image + voice routing',
    outcome: '30/30 correct actions on a labeled sample',
  },
  'deep-research': {
    title: 'Agentic Deep Research',
    source: 'Research / Local AI',
    role: 'Research engineering',
    scope: '374 papers, hybrid retrieval',
    outcome: 'Cited synthesis with parallel evaluation',
  },
};

const buildTitles = {
  'ai-support-triage': 'AI Support Triage',
  'scrollers-dashboard': 'Scroller’s Dashboard',
  'portfolio-v3': 'Portfolio 3.0',
  tabvault: 'TabVault',
  precicast: 'PreciCast',
};

const ProjectImage = ({ project, className = '' }) => {
  const base = project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '');
  return (
    <picture className={className}>
      <source
        srcSet={`/assets/optimized/${base}-mobile.webp 800w, /assets/optimized/${base}.webp 1600w`}
        sizes="(max-width: 720px) 90vw, 52vw"
        type="image/webp"
      />
      <img src={`/assets/optimized/${base}.jpg`} alt={`${project.title} project preview`} loading="lazy" />
    </picture>
  );
};

const SectionHeading = ({ eyebrow, title, description, id }) => (
  <header className="work-section-heading">
    <span className="work-section-eyebrow">{eyebrow}</span>
    <div className="work-section-heading-row">
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  </header>
);

const FeaturedCard = ({ project, index, onImage }) => {
  const detail = showcase[project.slug];
  return (
    <motion.article
      className={`work-showcase-card work-tone-${index + 1}`}
      style={{ '--stack-index': index }}
    >
      <div className="work-showcase-copy">
        <div className="work-showcase-topline">
          <span>{detail.source}</span>
          <span>{String(index + 1).padStart(2, '0')} / 03</span>
        </div>
        <h3><a className="work-project-title-link" href={`/projects/${project.slug}.html`}>{detail.title}</a></h3>
        <p className="work-showcase-description">{project.description}</p>
        <dl className="work-showcase-facts">
          <div><dt>Role</dt><dd>{detail.role}</dd></div>
          <div><dt>Scope</dt><dd>{detail.scope}</dd></div>
          <div className="work-fact-wide"><dt>Result</dt><dd>{detail.outcome}</dd></div>
        </dl>
        <div className="work-showcase-actions">
          <a className="work-case-study-link" href={`/projects/${project.slug}.html`}>
            <span className="work-round-arrow"><ArrowUpRight size={19} /></span>
            Read case study
          </a>
          <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="work-repo-link">
            GitHub <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
      <button
        type="button"
        className="work-showcase-visual"
        onClick={() => onImage(project)}
        aria-label={`Open original project artifact for ${project.title}`}
      >
        <span className="work-visual-orbit work-visual-orbit-one" aria-hidden="true" />
        <span className="work-visual-orbit work-visual-orbit-two" aria-hidden="true" />
        <span className="work-art-frame">
          <WorkflowVisual slug={project.slug} />
        </span>
        <span className="work-image-hint">View original artifact <ArrowUpRight size={16} /></span>
      </button>
    </motion.article>
  );
};

const BuildCard = ({ project, index }) => (
  <motion.article
    className={`work-build-card work-build-tone-${(index % 4) + 1} work-build-project-${project.slug}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.16 }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="work-build-topline">
      <span>{project.tabTag}</span>
      <span className="work-build-status"><i aria-hidden="true" /> Built</span>
    </div>
    <a
      className="work-build-visual"
      href={`/projects/${project.slug}.html`}
      aria-label={`Read ${project.title} case study`}
    >
      <span className="work-project-window work-build-window">
        <span className="work-project-window-bar" aria-hidden="true">
          <span className="work-window-controls"><i /><i /><i /></span>
          <span>{project.tabTag}</span>
          <span className="work-window-label">PROJECT SNAPSHOT</span>
        </span>
        <ProjectImage project={project} />
      </span>
    </a>
    <div className="work-build-bottom">
      <div>
        <h3><a className="work-project-title-link" href={`/projects/${project.slug}.html`}>{buildTitles[project.slug] || project.title}</a></h3>
        <p>{project.description}</p>
      </div>
      <a className="work-build-arrow" href={`/projects/${project.slug}.html`} aria-label={`Read ${project.title} case study`}>
        <ArrowUpRight size={20} />
      </a>
    </div>
    <div className="work-build-links">
      {project.repoLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="work-build-repo">Live app <ArrowUpRight size={15} /></a>}
      <a href={project.repoLink || project.liveLink} target="_blank" rel="noopener noreferrer" className="work-build-repo">
        View code on GitHub <ArrowRight size={15} />
      </a>
    </div>
  </motion.article>
);

export default function Projects() {
  const [selectedImage, setSelectedImage] = useState(null);
  const imageDialogRef = useRef(null);
  useModalFocus(imageDialogRef, Boolean(selectedImage), () => setSelectedImage(null));

  const featured = featuredSlugs.map((slug) => projectsData.find((project) => project.slug === slug)).filter(Boolean);
  const more = projectsData.filter((project) => !featuredSlugs.includes(project.slug));

  return (
    <section id="projects" className="projects-section" aria-labelledby="selected-work-title">
      <SectionHeading
        eyebrow="03 / PROJECTS"
        title="SELECTED WORK"
        id="selected-work-title"
        description="A closer look at the systems I’ve designed, built, and evaluated."
      />

      <div className="work-showcase-stack">
        {featured.map((project, index) => (
          <FeaturedCard
            key={project.id}
            project={project}
            index={index}
            onImage={setSelectedImage}
          />
        ))}
      </div>

      <div id="builds" className="work-builds" aria-labelledby="things-built-title">
        <SectionHeading
          eyebrow="MORE PROJECTS"
          title="THINGS I BUILT"
          id="things-built-title"
          description="Small tools, experiments, and apps made to solve practical problems."
        />
        <div className="work-build-grid">
          {more.map((project, index) => (
            <BuildCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fullscreen-modal"
              ref={imageDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedImage.title} preview`}
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
            >
              <button type="button" className="modal-close-btn" onClick={(event) => { event.stopPropagation(); setSelectedImage(null); }} aria-label="Close preview">
                <X size={24} />
              </button>
              <div className="fullscreen-image-frame" onClick={(event) => event.stopPropagation()}>
                <ProjectImage project={selectedImage} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
}
