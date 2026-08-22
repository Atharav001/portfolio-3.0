import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CosmicBackground.css';

// Rich palettes for interactive ray swapping inspired by aelradi.engineer
const DARK_PALETTES = [
  // 0: Signature Cosmic Emerald & Lime (Sawad + Aelradi)
  {
    tubes: ['#10b981', '#065f46', '#34d399'],
    lights: ['#c5ff41', '#10b981', '#f46c38', '#065f46'],
  },
  // 1: Cosmic Violet & Electric Cyan
  {
    tubes: ['#6366f1', '#4338ca', '#818cf8'],
    lights: ['#06b6d4', '#a855f7', '#3b82f6', '#4338ca'],
  },
  // 2: Cyber Sunset (Coral + Amber + Rose)
  {
    tubes: ['#f46c38', '#c2410c', '#fb923c'],
    lights: ['#f43f5e', '#fbbf24', '#f97316', '#991b1b'],
  },
  // 3: Neon Toxic Lime & Emerald
  {
    tubes: ['#c5ff41', '#84cc16', '#10b981'],
    lights: ['#06b6d4', '#c5ff41', '#10b981', '#3b82f6'],
  },
  // 4: Royal Purple & Magenta
  {
    tubes: ['#ec4899', '#9333ea', '#3b82f6'],
    lights: ['#a855f7', '#ec4899', '#3b82f6', '#06b6d4'],
  },
];

const LIGHT_PALETTES = [
  // 0: Electric Violet & Sapphire Glow
  {
    tubes: ['#2e1065', '#1e1b4b', '#0369a1'],
    lights: ['#581c87', '#1d4ed8', '#0284c7', '#312e81'],
  },
  // 1: Vibrant Emerald & Spring Jade Glow
  {
    tubes: ['#064e3b', '#022c22', '#0f766e'],
    lights: ['#047857', '#065f46', '#14532d', '#0284c7'],
  },
  // 2: Radiant Sunset & Coral Amber Glow
  {
    tubes: ['#7c2d12', '#7f1d1d', '#713f12'],
    lights: ['#c2410c', '#b91c1c', '#991b1b', '#d97706'],
  },
  // 3: Deep Royal Indigo Glow
  {
    tubes: ['#1e3a8a', '#311b92', '#581c87'],
    lights: ['#1d4ed8', '#4338ca', '#6b21a8', '#1e1b4b'],
  },
  // 4: Cosmic Orchid & Magenta Cyan Glow
  {
    tubes: ['#701a75', '#831843', '#1e1b4b'],
    lights: ['#86198f', '#9d174d', '#4338ca', '#0284c7'],
  },
];

export default function CosmicBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const colorIndexRef = useRef(0);
  const themeRef = useRef(theme);
  const prevThemeRef = useRef(theme);

  // Initialize tubes effect once on mount
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

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
                intensity: themeRef.current === 'dark' ? 240 : 280,
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

  // In-place update when theme changes, with slight dynamic palette progression
  useEffect(() => {
    if (!tubesInstance.current?.tubes) {
      themeRef.current = theme;
      return;
    }

    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      themeRef.current = theme;
      const currentPalettes = theme === 'light' ? LIGHT_PALETTES : DARK_PALETTES;
      // Slightly change the background animation color on every theme toggle
      colorIndexRef.current = (colorIndexRef.current + 1) % currentPalettes.length;
    }

    const currentPalettes = theme === 'light' ? LIGHT_PALETTES : DARK_PALETTES;
    const activePalette = currentPalettes[colorIndexRef.current % currentPalettes.length];

    if (typeof tubesInstance.current.tubes.setColors === 'function') {
      tubesInstance.current.tubes.setColors(activePalette.tubes);
    }
    if (typeof tubesInstance.current.tubes.setLightsColors === 'function') {
      tubesInstance.current.tubes.setLightsColors(activePalette.lights);
    }
    if (typeof tubesInstance.current.tubes.setLightsIntensity === 'function') {
      tubesInstance.current.tubes.setLightsIntensity(theme === 'dark' ? 240 : 280);
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
