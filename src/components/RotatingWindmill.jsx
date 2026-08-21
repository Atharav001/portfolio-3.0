import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * RotatingWindmill
 * 
 * Inspired by parthh.in scroll interaction.
 * Uses Framer Motion's useScroll and useTransform with spring smoothing
 * to rotate blades organically as the user scrolls past.
 */
export default function RotatingWindmill({ size = 36, className = '' }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotation = useSpring(rawRotation, { stiffness: 60, damping: 20, restDelta: 0.001 });

  return (
    <div
      ref={containerRef}
      className={`rotating-windmill-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem',
      }}
      aria-hidden="true"
    >
      <motion.svg
        style={{ rotate: shouldReduceMotion ? 0 : rotation }}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="windmill-svg"
        style={{
          rotate: shouldReduceMotion ? 0 : rotation,
          color: 'var(--accent-lime)',
          filter: 'drop-shadow(0 0 8px rgba(197, 255, 65, 0.4))',
        }}
      >
        {/* Windmill blades */}
        <path d="M12 12L12 2C13.5 2 15 3.5 15 5C15 6.5 13.5 8 12 12Z" fill="currentColor" />
        <path d="M12 12L22 12C22 13.5 20.5 15 19 15C17.5 15 16 13.5 12 12Z" fill="currentColor" />
        <path d="M12 12L12 22C10.5 22 9 20.5 9 19C9 17.5 10.5 16 12 12Z" fill="currentColor" />
        <path d="M12 12L2 12C2 10.5 3.5 9 5 9C6.5 9 8 10.5 12 12Z" fill="currentColor" />
        <circle cx="12" cy="12" r="2.5" fill="var(--bg-primary, #0a0a0a)" stroke="currentColor" strokeWidth="1.5" />
      </motion.svg>
    </div>
  );
}
