import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, X, ArrowUpRight, FileText } from 'lucide-react';
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

  // Lock scroll when mobile menu is open
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

  // Keyboard Escape listener to dismiss mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const handleResumeClick = () => {
    setIsMobileMenuOpen(false);
  };

  const drawerVariants = {
    closed: {
      opacity: 0,
      y: '-100%',
      transition: {
        duration: 0.35,
        ease: [0.32, 0, 0.67, 0],
      },
    },
    open: {
      opacity: 1,
      y: '0%',
      transition: {
        type: 'spring',
        stiffness: 280,
        damping: 28,
        staggerChildren: 0.06,
        delayChildren: 0.12,
      },
    },
  };

  const linkItemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      filter: 'blur(4px)',
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 25,
      },
    },
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

          {/* Actions: Live Clock, Theme Toggle & Mobile Menu Button */}
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

      {/* Overhauled Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu-nav"
            className="mobile-menu-overlay"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsMobileMenuOpen(false);
              }
            }}
          >
            <div className="mobile-menu-container">
              {/* Top Header Row with Brand & Dedicated Animated Close Button */}
              <div className="mobile-menu-header">
                <div className="mobile-brand">
                  <span className="logo-indicator" />
                  <span className="mobile-brand-title">ATHARAV NARANG</span>
                </div>
                <button
                  className="mobile-close-btn interactive-tag"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Live Location / Status Clock Row */}
              <div className="mobile-clock-row">
                <LiveLocationClock locationLabel="MANIPAL / BLR, IN" />
              </div>

              {/* Numbered Staggered Navigation Links */}
              <nav className="mobile-nav-links" aria-label="Mobile Navigation">
                {links.map((link, index) => {
                  const isActive = activeTab === link;
                  return (
                    <motion.a
                      key={link}
                      href={`#${link === 'Home' ? 'home' : link.toLowerCase()}`}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => scrollToSection(e, link)}
                      variants={linkItemVariants}
                    >
                      <div className="mobile-nav-link-left">
                        <span className="mobile-nav-num">0{index + 1}</span>
                        <span className="mobile-nav-text">{link}</span>
                      </div>
                      <div className="mobile-nav-link-right">
                        {isActive && <span className="mobile-active-dot" />}
                        <ArrowUpRight size={18} className="mobile-nav-arrow" />
                      </div>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Quick Action Footer */}
              <motion.div className="mobile-drawer-footer" variants={linkItemVariants}>
                <div className="mobile-footer-title">QUICK ACTIONS</div>
                <div className="mobile-quick-actions">
                  <a
                    href="/Atharav Narang.pdf"
                    className="mobile-quick-btn mobile-resume-btn"
                    onClick={handleResumeClick}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={15} />
                    <span>Resume</span>
                  </a>
                  <a
                    href="https://github.com/Atharav001"
                    target="_blank"
                    rel="noreferrer"
                    className="mobile-quick-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/atharav-narang-132b74273/"
                    target="_blank"
                    rel="noreferrer"
                    className="mobile-quick-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
