import React from 'react';
import { motion } from 'framer-motion';
import MomentsStrip from './MomentsStrip/MomentsStrip';
import './OutsideWork.css';

const sports = [
  { name: 'Table tennis', icon: '/assets/sports/table-tennis.svg' },
  { name: 'Badminton', icon: '/assets/sports/badminton.svg' },
  { name: 'Basketball', icon: '/assets/sports/basketball.svg' },
  { name: 'Gym', icon: '/assets/sports/weightlifting.svg' },
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
            {sports.map((sport) => <div className="outside-sport-tile" key={sport.name}>
              <img src={sport.icon} alt={sport.name} loading="lazy" />
            </div>)}
          </div>
          <div><h3>Always in motion.</h3><p>Four ways I reset, compete, and keep moving.</p></div>
        </motion.article>
        <motion.article className="outside-story outside-story-community" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08 }}>
          <img src="/assets/moments/cursor-roadshow-blr.jpg" alt="Stage and audience at the Cursor Roadshow in Bengaluru" loading="lazy" />
          <div className="outside-story-photo-shade" />
          <span className="outside-story-index">02 / WITH BUILDERS</span>
          <div><h3>Hackathons & meetups.</h3><p>Showing up, sharing what I build, and learning from other people.</p></div>
        </motion.article>
      </div>

      <MomentsStrip />
    </section>
  );
}
