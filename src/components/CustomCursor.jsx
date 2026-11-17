import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

// Keep the native pointer and add a soft, high-contrast halo in light mode.
export default function CustomCursor() {
  const haloRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.remove('hide-native-cursor');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!finePointer.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (haloRef.current) {
          haloRef.current.style.transform = `translate3d(${x - 42}px, ${y - 42}px, 0)`;
          haloRef.current.classList.add('is-visible');
        }
        frame = 0;
      });
    };
    const hide = () => haloRef.current?.classList.remove('is-visible');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, []);

  return <div ref={haloRef} className="light-pointer-halo" aria-hidden="true" />;
}
