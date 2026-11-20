import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

// Keep the native pointer and add a soft ambient accent in light mode.
export default function CustomCursor() {
  const haloRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove('hide-native-cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    const move = (event) => {
      if (!haloRef.current) return;
      haloRef.current.style.transform = `translate3d(${event.clientX - 34}px, ${event.clientY - 34}px, 0)`;
      haloRef.current.classList.add('is-visible');
    };
    const hide = () => haloRef.current?.classList.remove('is-visible');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return <div ref={haloRef} className="light-pointer-halo" aria-hidden="true" />;
}
