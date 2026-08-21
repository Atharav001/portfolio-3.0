import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  const tools = [
    "Python", "PyTorch", "Ollama", "FAISS", "BM25", "Reciprocal Rank Fusion",
    "React 19", "Vite", "Node.js", "Docker", "Linux", "Android SDK", "Room DB", "n8n", "Cursor IDE"
  ];

  return (
    <section id="about" className="about-section">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="about-wrapper">
          <div className="section-heading-label">
            <span className="section-number-inline">01</span>
            <span className="about-label-text">About Me</span>
          </div>

          <div className="about-content-layout">
            <motion.h2
              className="about-statement"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              Building intelligent systems as a{' '}
              <span className="about-statement-accent">CS engineer.</span>
            </motion.h2>

            <motion.div
              className="about-body"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <p>
                I am a second-year B.Tech Computer Science student at <strong>Manipal Institute of Technology (MAHE), Bengaluru</strong>. I learn by building—architecting local LLM pipelines, multimodal routing systems, Android wellness tools, and high-performance web applications.
              </p>
              <p>
                My work spans <strong>Agentic RAG systems</strong>, <strong>de-biased ML inference</strong>, and full-stack software. I prioritize code I can measure and stress-test: local models, clear accuracy benchmarks, zero-silent-failure gates, and production-ready architectures shipped openly on GitHub.
              </p>
            </motion.div>

            <div className="about-tools-container">
              <h3 className="tools-title">Technologies & Tools I Reach For Often</h3>
              <div className="tools-cloud">
                {tools.map((tool) => (
                  <span key={tool} className="tool-chip interactive-tag">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
