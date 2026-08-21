import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import './index.css';

// Components
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import CosmicBackground from './components/CosmicBackground';
import GrainOverlay from './components/GrainOverlay';
import RotatingWindmill from './components/RotatingWindmill';

// Reusable cinematic animated section divider with rotating windmill badge
const SectionDivider = () => (
  <div
    style={{
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 'var(--z-base)',
    }}
  >
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      style={{
        flex: 1,
        originX: 1,
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, var(--border-light) 100%)',
      }}
    />
    <div style={{ padding: '0 1rem' }}>
      <RotatingWindmill size={28} />
    </div>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-40px' }}
      style={{
        flex: 1,
        originX: 0,
        height: '1px',
        background: 'linear-gradient(90deg, var(--border-light) 0%, transparent 100%)',
      }}
    />
  </div>
);

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.theme || 'dark';
    }
    return 'dark';
  });

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 1.8,
      anchors: true,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [shouldReduceMotion]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: '0%',
          background: 'var(--hero-gradient)',
          height: '3px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-max)',
          boxShadow: '0 0 10px var(--accent-lime)',
        }}
      />

      {/* Cosmic Procedural Rays & Aurora Background */}
      <CosmicBackground theme={theme} />
      <GrainOverlay />
      <CustomCursor />
      <Navbar activeTheme={theme} onThemeChange={setTheme} />

      <main id="main-content">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Contact />
      </main>

      <Analytics />
    </>
  );
}

export default App;
