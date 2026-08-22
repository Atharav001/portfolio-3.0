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
  // 0: Vibrant Electric Violet & Sapphire
  {
    tubes: ['#7c3aed', '#2563eb', '#06b6d4'],
    lights: ['#9333ea', '#3b82f6', '#0284c7', '#6366f1'],
  },
  // 1: Emerald & Cyan Glow
  {
    tubes: ['#059669', '#0d9488', '#10b981'],
    lights: ['#10b981', '#047857', '#06b6d4', '#0f766e'],
  },
  // 2: Radiant Sunset & Warm Crimson
  {
    tubes: ['#ea580c', '#dc2626', '#f97316'],
    lights: ['#f97316', '#ef4444', '#f59e0b', '#b91c1c'],
  },
  // 3: Deep Royal Indigo
  {
    tubes: ['#2563eb', '#4f46e5', '#7c3aed'],
    lights: ['#3b82f6', '#6366f1', '#a855f7', '#1d4ed8'],
  },
];

export default function CosmicBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const palettes = theme === 'light' ? LIGHT_PALETTES : DARK_PALETTES;

  const initTubesEffect = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      const module = await import('../vendor/tubes1.js');
      const initTubes = module.default || module.initTubes;

      if (typeof initTubes === 'function' && canvasRef.current) {
        const activePalette = palettes[colorIndex % palettes.length];
        
        tubesInstance.current = initTubes(canvasRef.current, {
          tubes: {
            colors: activePalette.tubes,
            lights: {
              intensity: theme === 'dark' ? 240 : 180,
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
  }, [theme, colorIndex, palettes]);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const timer = setTimeout(() => {
      initTubesEffect();
    }, 150);

    return () => {
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
  }, [initTubesEffect]);

  // Cycle palette function with smooth color update
  const cycleNextPalette = useCallback(() => {
    setColorIndex((prev) => {
      const nextIndex = (prev + 1) % palettes.length;
      const nextPalette = palettes[nextIndex];

      if (tubesInstance.current && tubesInstance.current.tubes) {
        if (typeof tubesInstance.current.tubes.setColors === 'function') {
          tubesInstance.current.tubes.setColors(nextPalette.tubes);
        }
        if (typeof tubesInstance.current.tubes.setLightsColors === 'function') {
          tubesInstance.current.tubes.setLightsColors(nextPalette.lights);
        }
      }
      return nextIndex;
    });
  }, [palettes]);

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
