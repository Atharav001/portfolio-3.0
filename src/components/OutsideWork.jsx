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
        In my free time, I like playing <strong>badminton</strong>. I make <strong>small apps</strong> for problems I run into every day. Some moments from hackathons and developer meetups are below.
      </motion.p>

      <div className="outside-work-cards">
        <motion.div
          className="outside-work-card outside-badminton"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
        >
          <span className="outside-card-kicker">OFF THE CLOCK · BADMINTON</span>
          <span className="outside-card-word">PLAY<span className="outside-card-asterisk">✳</span></span>
          <p>A way to reset, move, and spend time away from a screen.</p>
        </motion.div>
        <motion.a
          href="#builds"
          className="outside-work-card outside-small-apps"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          <span className="outside-card-kicker">ON THE SIDE · SMALL APPS</span>
          <span className="outside-card-word">BUILD<ArrowUpRight size={36} strokeWidth={1.8} /></span>
          <p>Little tools for the small frictions that show up in daily life.</p>
        </motion.a>
      </div>

      <MomentsStrip />
    </section>
  );
}
