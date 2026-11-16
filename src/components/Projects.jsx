import React, { useState, useRef, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, X, Eye } from 'lucide-react';
import TiltCard from './TiltCard';
import './Projects.css';
import { projectsData } from '../data/projects';
import { useModalFocus } from '../hooks/useModalFocus';

const CaseStudyViewer = lazy(() => import('./CaseStudyViewer'));
const featuredSlugs = new Set([
  'debiased-multimodal-pipeline',
  'hybrid-multimodal-whatsapp-router',
  'deep-research',
]);

const CaseStudySkeleton = () => (
  <div className="case-study-skeleton" role="status" aria-label="Loading case study">
    <div className="skeleton-line skeleton-title" />
    <div className="skeleton-line skeleton-meta" />
    <div className="skeleton-image" />
    <div className="skeleton-line" />
    <div className="skeleton-line short" />
    <span className="sr-only">Loading case study content…</span>
  </div>
);

const ProjectCard = ({ project, setSelectedImage, setSelectedCaseStudy }) => {
  const imgBase = project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '');

  return (
    <div className="project-card-wrapper">
      <div className="project-card-inner-container">
        <TiltCard className="project-card interactive-tag">
          <button
            type="button"
            className="project-image-container group"
            onClick={() => setSelectedImage(project.image)}
            aria-label={`Expand preview of ${project.title}`}
          >
            <span className="browser-header">
              <span className="browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </span>
              <span className="browser-url-bar">{project.urlBar}</span>
              <span className="browser-tab"><Eye size={12} className="mr-1" /> {project.tabTag}</span>
            </span>
            <span className="browser-content">
              <picture>
                <source
                  srcSet={`/assets/optimized/${imgBase}-mobile.webp 800w, /assets/optimized/${imgBase}.webp 1600w`}
                  sizes="(max-width: 768px) 90vw, 45vw"
                  type="image/webp"
                />
                <img src={`/assets/optimized/${imgBase}.jpg`} alt={project.title} className="project-img" loading="lazy" />
              </picture>
              <span className="image-hover-overlay">
                <span className="click-to-view-badge">
                  <Eye size={20} className="mb-2" />
                  <span>Click to view</span>
                </span>
              </span>
            </span>
          </button>

          <div className="project-info-container">
            <h3 className="project-title">{project.title}</h3>
            <div className="project-meta-row">
              <p className="project-date">{project.date}</p>
              {project.statusTag && (
                <span className="project-status-meta">{project.statusTag}</span>
              )}
            </div>

            <p className="project-description">
              {project.description}
            </p>

            <div className="technologies-section">
              <h4 className="tech-heading">TECHNOLOGIES</h4>
              <div className="tech-tags">
                {project.technologies.map(tech => (
                  <span key={tech} className="tech-badge focus-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-actions">
              <a href={project.liveLink} target="_blank" rel="noreferrer" className="action-btn primary interactive-tag">
                <ExternalLink size={16} /> GitHub <ArrowRight size={16} className="ml-1" />
              </a>
              <button onClick={() => setSelectedCaseStudy(project)} className="action-btn secondary interactive-tag">
                <Eye size={16} /> Case Study <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

const Projects = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
  const imageDialogRef = useRef(null);
  useModalFocus(imageDialogRef, Boolean(selectedImage), () => setSelectedImage(null));
  const featuredProjects = projectsData.filter((project) => featuredSlugs.has(project.slug));
  const moreProjects = projectsData.filter((project) => !featuredSlugs.has(project.slug));

  return (
    <section id="projects" className="projects-section py-32 px-6 lg:px-16 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="section-heading mb-16">
          <div className="section-heading-label">
            <span className="section-number-inline">03</span>
            <span className="about-label-text">Projects</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
            Featured <span className="text-accent underline-effect">Projects</span>.
          </h2>
          <p className="text-secondary text-sm font-mono uppercase tracking-widest max-w-2xl">
            Selected engineering work, with the problem, approach, and evidence behind each project.
          </p>
        </div>

        <div className="projects-list flex flex-col gap-8 md:gap-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: Math.min(index * 0.08, 0.32),
              }}
            >
              <ProjectCard
                project={project}
                setSelectedImage={setSelectedImage}
                setSelectedCaseStudy={setSelectedCaseStudy}
              />
            </motion.div>
          ))}
        </div>

        <div className="more-projects-heading">
          <span className="section-number-inline">EXPLORE MORE</span>
          <h3>More things I have built</h3>
        </div>
        <div className="more-projects-grid">
          {moreProjects.map((project) => (
            <article key={project.id} className="more-project-card">
              <span className="more-project-category">{project.tabTag} · {project.date}</span>
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <div className="more-project-actions">
                <button type="button" onClick={() => setSelectedCaseStudy(project)}>Read case study <ArrowRight size={15} /></button>
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}><ExternalLink size={17} /></a>
              </div>
            </article>
          ))}
        </div>
      </motion.div>

      {createPortal(<AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fullscreen-modal"
            ref={imageDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded project preview"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="modal-close-btn"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <picture style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <source
                srcSet={`/assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                sizes="90vw"
                type="image/webp"
              />
              <motion.img
                src={`/assets/optimized/${selectedImage.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                alt="Fullscreen expanded project"
                className="fullscreen-img"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>, document.body)}

      <AnimatePresence>
        {selectedCaseStudy && (
          <Suspense fallback={<CaseStudySkeleton />}>
            <CaseStudyViewer
              project={selectedCaseStudy}
              onClose={() => setSelectedCaseStudy(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
