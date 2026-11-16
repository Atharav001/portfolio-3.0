import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
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
                I study Computer Science at <strong>Manipal Institute of Technology, Bengaluru</strong>. I learn by building systems that can be examined, measured, and improved.
              </p>
              <p>
                My recent work spans <strong>retrieval systems</strong>, <strong>multimodal evaluation</strong>, and useful software for the web and native platforms. The projects below show the design decisions and their limits.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
