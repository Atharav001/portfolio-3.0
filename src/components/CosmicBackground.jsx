import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CosmicBackground.css';

// Rich palettes for interactive ray swapping inspired by aelradi.engineer
const DARK_PALETTES = [
  { tubes: ['#10b981', '#065f46', '#34d399'], lights: ['#c5ff41', '#10b981', '#34d399', '#065f46'] },
  { tubes: ['#84cc16', '#14532d', '#4ade80'], lights: ['#c5ff41', '#84cc16', '#10b981', '#34d399'] },
  { tubes: ['#14b8a6', '#115e59', '#2dd4bf'], lights: ['#c5ff41', '#10b981', '#14b8a6', '#34d399'] },
];

const LIGHT_PALETTES = [
  { tubes: ['#087a50', '#176b56', '#73a98b'], lights: ['#087a50', '#176b56', '#93b89b', '#bfd1ac'] },
  { tubes: ['#3f7859', '#769e76', '#a3b894'], lights: ['#087a50', '#4e8768', '#a3b894', '#bfd1ac'] },
];

export default function CosmicBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const colorIndexRef = useRef(0);
  const themeRef = useRef(theme);

  // Initialize tubes effect once on mount
  useEffect(() => {
    const useStaticBackground = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 768px), (pointer: coarse)').matches;
    if (useStaticBackground) return;

    let isCancelled = false;

    const initTubesEffect = async () => {
      if (!canvasRef.current) return;

      try {
        const module = await import('../vendor/tubes1.js');
        const initTubes = module.default || module.initTubes;

        if (typeof initTubes === 'function' && canvasRef.current && !isCancelled) {
          const currentPalettes = themeRef.current === 'light' ? LIGHT_PALETTES : DARK_PALETTES;
          const activePalette = currentPalettes[colorIndexRef.current % currentPalettes.length];

          tubesInstance.current = initTubes(canvasRef.current, {
            tubes: {
              colors: activePalette.tubes,
              lights: {
                intensity: themeRef.current === 'dark' ? 240 : 180,
                colors: activePalette.lights,
              },
            },
          });
          setIsWebGLReady(true);
        }
      } catch (err) {
        console.warn('CosmicBackground WebGL fallback active:', err);
        setIsWebGLReady(false);
      }
    };

    const timer = setTimeout(initTubesEffect, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (tubesInstance.current && typeof tubesInstance.current.dispose === 'function') {
        try {
          tubesInstance.current.dispose();
        } catch {
          // ignore
        }
        tubesInstance.current = null;
      }
    };
  }, []);

  // In-place update when theme changes without resetting the tubes/trail
  useEffect(() => {
    themeRef.current = theme;
    if (!tubesInstance.current?.tubes) return;

    const currentPalettes = theme === 'light' ? LIGHT_PALETTES : DARK_PALETTES;
    const activePalette = currentPalettes[colorIndexRef.current % currentPalettes.length];

    if (typeof tubesInstance.current.tubes.setColors === 'function') {
      tubesInstance.current.tubes.setColors(activePalette.tubes);
    }
    if (typeof tubesInstance.current.tubes.setLightsColors === 'function') {
      tubesInstance.current.tubes.setLightsColors(activePalette.lights);
    }
    if (typeof tubesInstance.current.tubes.setLightsIntensity === 'function') {
      tubesInstance.current.tubes.setLightsIntensity(theme === 'dark' ? 240 : 180);
    }
  }, [theme]);

  // Cycle palette function with in-place color update at current cursor position
  const cycleNextPalette = useCallback(() => {
    const currentPalettes = themeRef.current === 'light' ? LIGHT_PALETTES : DARK_PALETTES;
    colorIndexRef.current = (colorIndexRef.current + 1) % currentPalettes.length;
    const nextPalette = currentPalettes[colorIndexRef.current];

    if (tubesInstance.current && tubesInstance.current.tubes) {
      if (typeof tubesInstance.current.tubes.setColors === 'function') {
        tubesInstance.current.tubes.setColors(nextPalette.tubes);
      }
      if (typeof tubesInstance.current.tubes.setLightsColors === 'function') {
        tubesInstance.current.tubes.setLightsColors(nextPalette.lights);
      }
    }
  }, []);

  // Global click handler to cycle ray colors on empty area clicks (aelradi.engineer feature)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Exclude touch devices / mobile screen widths to prevent accidental palette swaps during tap/scroll
      const isTouchOrMobile = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;
      if (isTouchOrMobile) return;

      // Don't trigger color cycle if clicking interactive UI elements
      const target = e.target;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, .chat-card, .cert-modal-content, .fullscreen-modal, .timeline-item, .project-card, .interactive-tag, .mobile-menu-overlay, .skip-link'
      );
      if (interactive) return;

      cycleNextPalette();
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [cycleNextPalette]);

  return (
    <div className="cosmic-background-wrapper" aria-hidden="true">
      {/* Dynamic Aurora Ambient Mesh */}
      <div className={`aurora-mesh ${theme === 'light' ? 'light-mode' : ''}`} />

      {/* Interactive WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`cosmic-canvas ${isWebGLReady ? 'ready' : 'hidden'}`}
      />
    </div>
  );
}
