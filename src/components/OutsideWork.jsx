import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import MomentsStrip from './MomentsStrip/MomentsStrip';
import './OutsideWork.css';

export default function OutsideWork() {
  return (
    <section id="outside-work" className="outside-work-section" aria-labelledby="outside-work-title">
      <header className="outside-work-heading">
        <span className="outside-work-eyebrow">04 / PERSONAL</span>
        <div className="outside-work-heading-row">
          <h2 id="outside-work-title">OUTSIDE WORK</h2>
          <p>A little of life beyond the projects.</p>
        </div>
      </header>

      <motion.p
        className="outside-work-intro"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        A mix of <strong>court time</strong>, conversations with other builders, and <strong>small experiments</strong> sparked by everyday problems.
      </motion.p>

      <div className="outside-story-grid">
        <motion.article className="outside-story outside-story-badminton" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="outside-story-index">01 / ON THE COURT</span>
          <div className="outside-racket" aria-hidden="true"><span /><i /></div>
          <div><h3>Badminton is my reset.</h3><p>Fast rallies, a clear head, and time away from a screen.</p></div>
        </motion.article>
        <motion.article className="outside-story outside-story-community" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08 }}>
          <img src="/assets/moments/cursor-meetup.jpg" alt="Atharav at a developer meetup" loading="lazy" />
          <div className="outside-story-photo-shade" />
          <span className="outside-story-index">02 / WITH BUILDERS</span>
          <div><h3>Hackathons & meetups.</h3><p>Showing up, sharing what I build, and learning from other people.</p></div>
        </motion.article>
        <motion.a href="#builds" className="outside-story outside-story-projects" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .16 }}>
          <span className="outside-story-index">03 / SIDE PROJECTS <ArrowUpRight size={18} /></span>
          <div className="outside-mini-builds" aria-hidden="true"><span>TabVault</span><span>Scroller’s Dashboard</span><span>Portfolio 3.0</span></div>
          <div><h3>Small ideas, shipped.</h3><p>I build tools for the everyday problems I notice.</p></div>
        </motion.a>
      </div>

      <MomentsStrip />
    </section>
  );
}
