import React from 'react';
import { motion } from 'framer-motion';
import MomentsStrip from './MomentsStrip/MomentsStrip';
import './OutsideWork.css';

const sports = [
  { name: 'Table tennis', art: <><ellipse cx="25" cy="21" rx="12" ry="15" /><path d="m20 35-7 13m12-12-6 13" /><circle cx="48" cy="16" r="5" /></> },
  { name: 'Badminton', art: <><ellipse cx="25" cy="23" rx="14" ry="20" transform="rotate(-42 25 23)" /><path d="m36 37 15 16M11 22l28 3M16 10l18 27M29 5l3 32M14 29l26-5" /></> },
  { name: 'Basketball', art: <><circle cx="32" cy="32" r="23" /><path d="M9 32h46M32 9v46M17 14c18 11 18 25 0 36M47 14C29 25 29 39 47 50" /></> },
  { name: 'Gym', art: <><path d="M15 27v10m6-15v20m22-20v20m6-15v10M21 32h22M9 26h6v12H9zm40 0h6v12h-6z" /></> },
];

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
        When I step away from a screen, I stay <strong>in motion</strong> and spend time with other builders.
      </motion.p>

      <div className="outside-story-grid">
        <motion.article className="outside-story outside-story-sports" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="outside-story-index">01 / SPORTS</span>
          <div className="outside-sports-grid" aria-label="Table tennis, badminton, basketball, and gym">
            {sports.map((sport) => <div className="outside-sport-tile" key={sport.name} role="img" aria-label={sport.name}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{sport.art}</svg>
            </div>)}
          </div>
          <div><h3>Always in motion.</h3><p>Four ways I reset, compete, and keep moving.</p></div>
        </motion.article>
        <motion.article className="outside-story outside-story-community" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08 }}>
          <img src="/assets/moments/cursor-meetup.jpg" alt="Atharav at a developer meetup" loading="lazy" />
          <div className="outside-story-photo-shade" />
          <span className="outside-story-index">02 / WITH BUILDERS</span>
          <div><h3>Hackathons & meetups.</h3><p>Showing up, sharing what I build, and learning from other people.</p></div>
        </motion.article>
      </div>

      <MomentsStrip />
    </section>
  );
}
