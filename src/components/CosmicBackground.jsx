import React, { useEffect, useRef, useState, useCallback } from 'react';
import './CosmicBackground.css';

// Palettes for interactive ray swapping
const PALETTES = [
  // 0: Sawad & Aelradi signature (Emerald + Lime + Coral)
  {
    tubes: ['#10b981', '#065f46', '#34d399'],
    lights: ['#c5ff41', '#10b981', '#f46c38', '#065f46'],
  },
  // 1: Cosmic Violet & Cyan
  {
    tubes: ['#6366f1', '#4338ca', '#818cf8'],
    lights: ['#06b6d4', '#a855f7', '#3b82f6', '#4338ca'],
  },
  // 2: Cyber Sunset (Coral + Amber + Rose)
  {
    tubes: ['#f46c38', '#c2410c', '#fb923c'],
    lights: ['#f43f5e', '#fbbf24', '#f97316', '#991b1b'],
  },
];

/**
 * CosmicBackground
 * 
 * High-performance WebGL procedural energy rays inspired by aelradi.engineer & Sawad aesthetics.
 * Uses WebGL canvas with interactive mouse tracking and color wave shifting.
 * Gracefully provides a fallback CSS aurora mesh on reduced motion or low-power environments.
 */
export default function CosmicBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);
  const [isWebGLReady, setIsWebGLReady] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const initTubesEffect = useCallback(async () => {
    if (!canvasRef.current) return;

    try {
      // Dynamic import from bundled vendor module
      const module = await import('../vendor/tubes1.js');
      const initTubes = module.default || module.initTubes;

      if (typeof initTubes === 'function' && canvasRef.current) {
        const activePalette = PALETTES[colorIndex % PALETTES.length];
        
        tubesInstance.current = initTubes(canvasRef.current, {
          tubes: {
            colors: activePalette.tubes,
            lights: {
              intensity: theme === 'dark' ? 220 : 120,
              colors: activePalette.lights,
            },
          },
        });
        setIsWebGLReady(true);
      }
    } catch (err) {
      // Fallback seamlessly to CSS Aurora
      console.warn('CosmicBackground WebGL fallback active:', err);
      setIsWebGLReady(false);
    }
  }, [theme, colorIndex]);

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

  const handleCanvasClick = () => {
    const nextIndex = (colorIndex + 1) % PALETTES.length;
    setColorIndex(nextIndex);

    if (tubesInstance.current && tubesInstance.current.tubes) {
      const nextPalette = PALETTES[nextIndex];
      if (typeof tubesInstance.current.tubes.setColors === 'function') {
        tubesInstance.current.tubes.setColors(nextPalette.tubes);
      }
      if (typeof tubesInstance.current.tubes.setLightsColors === 'function') {
        tubesInstance.current.tubes.setLightsColors(nextPalette.lights);
      }
    }
  };

  return (
    <div className="cosmic-background-wrapper" aria-hidden="true">
      {/* Dynamic Aurora Ambient Mesh */}
      <div className={`aurora-mesh ${theme === 'light' ? 'light-mode' : ''}`} />

      {/* Interactive WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`cosmic-canvas ${isWebGLReady ? 'ready' : 'hidden'}`}
        onClick={handleCanvasClick}
      />
    </div>
  );
}
