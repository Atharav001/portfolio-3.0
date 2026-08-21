import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import LiveLocationClock from './LiveLocationClock';
import './Navbar.css';

const Navbar = ({ onThemeChange }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.theme || 'dark';
    }
    return 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        const next = e.matches ? 'light' : 'dark';
        document.documentElement.classList.toggle('light-theme', next === 'light');
        document.documentElement.dataset.theme = next;
        setTheme(next);
        if (onThemeChange) onThemeChange(next);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [onThemeChange]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const applyTheme = () => {
      document.documentElement.classList.toggle('light-theme', next === 'light');
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      setTheme(next);
      if (onThemeChange) onThemeChange(next);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reducedMotion) {
      applyTheme();
      return;
    }

    // Corner Burst Transition
    const x = window.innerWidth;
    const y = 0;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyTheme);

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      const sections = ['home', 'about', 'experience', 'projects', 'contact'];
      let maxVisible = 0;
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          if (visibleHeight > maxVisible && visibleHeight > 0) {
            maxVisible = visibleHeight;
            current = section.charAt(0).toUpperCase() + section.slice(1);
          }
        }
      }

      if (current) {
        setActiveTab(current);
      }
    };

    const lenis = window.__lenis;
    if (lenis) {
      lenis.on('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    if (isMobileMenuOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const links = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

  const scrollToSection = (e, link) => {
    e.preventDefault();
    setActiveTab(link);
    setIsMobileMenuOpen(false);
    const targetId = link === 'Home' ? 'home' : link.toLowerCase();
    const element = document.getElementById(targetId);
    if (element) {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(`#${targetId}`, { offset: -40 });
      } else {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 70,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <header className="navbar-container">
      <a href="#about" className="skip-link">Skip to main content</a>
      
      <motion.div
        className="navbar-animator"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={`navbar-capsule ${scrolled ? 'scrolled' : ''}`}>
          {/* Logo / Brand */}
          <div className="navbar-brand-section">
            <a href="#home" className="navbar-logo interactive-tag" onClick={(e) => scrollToSection(e, 'Home')}>
              <span className="logo-indicator" />
              <span className="logo-full">Atharav Narang</span>
              <span className="logo-short">AN</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="navbar-links-section" aria-label="Primary navigation">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link === 'Home' ? 'home' : link.toLowerCase()}`}
                className={`nav-link interactive-tag ${activeTab === link ? 'active' : ''}`}
                onClick={(e) => scrollToSection(e, link)}
              >
                {link}
                {activeTab === link && (
                  <motion.div
                    className="nav-active-pill"
                    layoutId="activeNavIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Actions: Live Clock, Theme Toggle & Mobile Menu */}
          <div className="navbar-actions-section">
            <div className="clock-wrapper-desktop">
              <LiveLocationClock locationLabel="BLR, IN" />
            </div>

            {/* Target for custom cursor docking on leave */}
            <div id="cursor-dock" className="cursor-dock" aria-hidden="true" />

            <button
              className="theme-toggle-btn interactive-tag"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'light'}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-menu-btn interactive-tag"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-nav"
            >
              <div className={`burger-icon ${isMobileMenuOpen ? 'open' : ''}`}>
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-nav"
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-content">
              <div className="mobile-clock-row">
                <LiveLocationClock locationLabel="MANIPAL / BLR, IN" />
              </div>
              <nav className="mobile-nav-links">
                {links.map((link, index) => (
                  <a
                    key={link}
                    href={`#${link === 'Home' ? 'home' : link.toLowerCase()}`}
                    className={`mobile-nav-link ${activeTab === link ? 'active' : ''}`}
                    onClick={(e) => scrollToSection(e, link)}
                    style={{ '--stagger-index': index }}
                  >
                    <span className="mobile-nav-num">0{index + 1}</span>
                    <span className="mobile-nav-text">{link}</span>
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
