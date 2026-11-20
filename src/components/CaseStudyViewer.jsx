/**
 * CaseStudyViewer.jsx
 *
 * Structured case study layout: Overview → Problem → Approach →
 * Architecture → Implementation → Results.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useModalFocus } from '../hooks/useModalFocus';
import './CaseStudyViewer.css';

const normalizeMetrics = (metrics) => {
  if (!metrics) return [];
  if (Array.isArray(metrics)) {
    return metrics.filter((item) => item?.label && item?.value);
  }
  return [
    metrics.accuracy && { label: 'Accuracy / Performance', value: metrics.accuracy },
    metrics.cost && { label: 'Cost', value: metrics.cost },
    metrics.scale && { label: 'Scale & Speed', value: metrics.scale },
  ].filter(Boolean);
};

const SectionBlock = ({ id, number, title, children }) => (
  <section id={id} className="case-study-section-block">
    <h2 className="case-study-section-label"><span>{number}</span> {title}</h2>
    {children}
  </section>
);

const ProseBlock = ({ html }) => (
  <div
    className="case-study-prose"
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((html || '')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')) }}
  />
);

const CaseStudyViewer = ({ project, onClose }) => {
  const [isImgZoomed, setIsImgZoomed] = useState(false);
  const dialogRef = useRef(null);
  const imageDialogRef = useRef(null);
  useModalFocus(dialogRef, Boolean(project) && !isImgZoomed, onClose);
  useModalFocus(imageDialogRef, isImgZoomed, () => setIsImgZoomed(false));

  useEffect(() => {
    if (!project) return;
    const lenis = window.__lenis;
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const originalHash = window.location.hash;
    window.history.replaceState(null, '', `#project-${project.id}`);

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
      window.history.replaceState(null, '', originalHash || '#projects');
    };
  }, [project]);

  const handleTocClick = (e, targetId) => {
    e.preventDefault();
    const element = dialogRef.current?.querySelector(`#${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!project) return null;

  const details = project.caseStudyDetails;
  const metricItems = details ? normalizeMetrics(details.metrics) : [];

  const tocItems = details
    ? [
        { id: 'overview', label: 'Overview' },
        { id: 'problem', label: 'Problem Statement' },
        { id: 'approach', label: 'Approach' },
        ...(details.features?.length ? [{ id: 'architecture', label: 'Architecture' }] : []),
        { id: 'implementation', label: 'Implementation' },
        ...(metricItems.length ? [{ id: 'results', label: 'Results' }] : []),
        ...(details.designPhilosophy ? [{ id: 'notes', label: 'Notes' }] : []),
      ]
    : [];

  return createPortal(
    <>
      <motion.div
        className="case-study-backdrop-animator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="case-study-backdrop" />
      </motion.div>
      <motion.div
        className="case-study-overlay"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        tabIndex={-1}
        data-lenis-prevent="true"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={onClose} className="case-study-close-btn" aria-label="Close Case Study">
          <X size={20} />
        </button>

        <div className="case-study-gradient-bg"></div>

        <nav className="case-study-nav">
          <button onClick={onClose} className="back-btn interactive-tag">
            <ArrowLeft size={18} className="mr-2" /> Back to Portfolio
          </button>

          <div className="case-study-external-links">
            {project.repoLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="view-live-btn interactive-tag">Live app <ExternalLink size={16} className="ml-1" /></a>}
            <a href={project.repoLink || project.liveLink} target="_blank" rel="noreferrer" className="view-live-btn interactive-tag">
              GitHub <ExternalLink size={16} className="ml-1" />
            </a>
          </div>
        </nav>

        <div className="case-study-layout">
          <main className="case-study-content">
            <header className="case-study-header">
              <span className="case-study-kicker">Case study <span>/{project.tabTag}</span></span>
              <h1 id="case-study-title" className="case-study-title">{project.title}</h1>
              <p className="case-study-dek">{details?.problemLead || project.description}</p>
              <div className="case-study-meta">
                <span>Designed & built by Atharav Narang</span>
                <span className="separator">/</span>
                <span>{project.date}</span>
              </div>
            </header>

            <article className="case-study-article">
              {details ? (
                <>
                  <SectionBlock id="overview" number="01" title="Overview">
                    <div className="case-study-overview-grid">
                      {project.image && (
                        <button
                          type="button"
                          className="overview-item image-overview-item interactive-tag"
                          onClick={() => setIsImgZoomed(true)}
                          aria-label={`Expand ${project.title} preview`}
                        >
                          <span className="overview-label">Project Preview</span>
                          <span className="overview-image-wrapper">
                            <picture style={{ display: 'block', width: '100%', height: '100%' }}>
                              <source
                                srcSet={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                                sizes="(max-width: 768px) 90vw, 45vw"
                                type="image/webp"
                              />
                              <img
                                src={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                                alt={project.title}
                                className="overview-thumbnail"
                              />
                            </picture>
                            <span className="overview-image-overlay">
                              <span className="view-text">Click to expand</span>
                            </span>
                          </span>
                        </button>
                      )}
                      <div className="overview-item">
                        <h4>My Role</h4>
                        <p>{details.role}</p>
                      </div>
                      <div className="overview-item">
                        <h4>Tech Stack</h4>
                        <p>{details.techStack}</p>
                      </div>
                      <div className="overview-item">
                        <h4>{details.localLLM ? 'Local LLM' : 'Platform'}</h4>
                        <p>{details.localLLM || details.platform}</p>
                      </div>
                    </div>
                  </SectionBlock>

                  <SectionBlock id="problem" number="02" title="Problem Statement">
                    <h3 className="case-study-subheading">{details.problemTitle}</h3>
                    <ProseBlock html={details.problemText} />
                  </SectionBlock>

                  <SectionBlock id="approach" number="03" title="Approach">
                    <h3 className="case-study-subheading">{details.solutionTitle}</h3>
                    <ProseBlock html={details.solutionText} />
                  </SectionBlock>

                  {details.features?.length > 0 && (
                    <SectionBlock id="architecture" number="04" title="Architecture & Components">
                      {details.features.map((feature, index) => (
                        <div key={index} className="feature-section">
                          <h3 className="feature-heading">
                            <span className="feature-index">{String(index + 1).padStart(2, '0')}</span>
                            {feature.title}
                          </h3>
                          <p>{feature.text}</p>
                          {feature.image && (
                            <figure className="case-study-img-container">
                              <picture>
                                <source
                                  srcSet={`/assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                                  sizes="(max-width: 768px) 90vw, 45vw"
                                  type="image/webp"
                                />
                                <img
                                  src={`/assets/optimized/${feature.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                                  alt={feature.caption || feature.title}
                                  loading="lazy"
                                />
                              </picture>
                              {feature.caption && <figcaption>{feature.caption}</figcaption>}
                            </figure>
                          )}
                        </div>
                      ))}
                    </SectionBlock>
                  )}

                  <SectionBlock id="implementation" number="05" title="Implementation">
                    <ProseBlock html={details.technicalText} />

                    {details.techHighlights?.length > 0 && (
                      <div className="tech-highlights">
                        {details.techHighlights.map((highlight, index) => (
                          <div key={index} className="tech-highlight-item">
                            <h4>{highlight.title}</h4>
                            <p>{highlight.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {details.pipeline?.length > 0 && (
                      <div className="pipeline-section">
                        <h4 className="pipeline-heading">Processing flow</h4>
                        <div className="pipeline-steps-vertical">
                          {details.pipeline.map((step, index) => (
                            <div key={index} className="pipeline-step">
                              <span className="step-number">{index + 1}</span>
                              <span className="step-text">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {details.deepIntegration?.length > 0 && (
                      <div className="deep-integration">
                        {details.deepIntegration.map((item, index) => (
                          <div key={index} className="integration-item">
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </SectionBlock>

                  {metricItems.length > 0 && (
                    <SectionBlock id="results" number="06" title="Results">
                      <div className="metrics-grid">
                        {metricItems.map((item, index) => (
                          <div key={index} className="metric-item">
                            <span className="metric-value">{item.value}</span>
                            <span className="metric-label">{item.label}</span>
                          </div>
                        ))}
                      </div>
                      {details.resultsNote && (
                        <p className="results-note">{details.resultsNote}</p>
                      )}
                    </SectionBlock>
                  )}

                  {details.designPhilosophy && (
                    <SectionBlock id="notes" number="07" title="Notes">
                      <ProseBlock html={details.designPhilosophy} />
                      {details.closingQuote && (
                        <p className="case-study-takeaway">{details.closingQuote}</p>
                      )}
                    </SectionBlock>
                  )}
                </>
              ) : (
                <div className="case-study-empty">
                  <p>Case study content coming soon. <a href={project.liveLink}>View the repository →</a></p>
                </div>
              )}

              <hr className="article-divider" />

              <div className="article-footer">
                <p>
                  Questions about this project? Reach out on{' '}
                  <a href="https://x.com/Atharav3602">Twitter</a> or{' '}
                  <a href="https://github.com/Atharav001">GitHub</a>.
                </p>
              </div>
            </article>
          </main>

          <aside className="case-study-sidebar">
            <div className="sticky-contents">
              <h4 className="contents-heading">Contents</h4>
              <ul className="contents-list">
                {tocItems.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`} onClick={(e) => handleTocClick(e, id)}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </motion.div>

      <AnimatePresence>
        {isImgZoomed && (
          <motion.div
            className="fullscreen-modal"
            ref={imageDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Expanded case study preview"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImgZoomed(false)}
            style={{ zIndex: 10001 }}
          >
            <button
              className="modal-close-btn"
              onClick={(e) => { e.stopPropagation(); setIsImgZoomed(false); }}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <picture style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <source
                srcSet={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}-mobile.webp 800w, /assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.webp 1600w`}
                sizes="90vw"
                type="image/webp"
              />
              <motion.img
                src={`/assets/optimized/${project.image.split('/').pop().replace(/\.(png|jpe?g)$/i, '')}.jpg`}
                alt="Fullscreen project preview"
                className="fullscreen-img"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

export default CaseStudyViewer;
