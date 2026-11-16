import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { moments } from '../../data/moments';
import MomentsLightbox from './MomentsLightbox';
import './MomentsStrip.css';

export default function MomentsStrip() {
  const viewportRef = useRef(null);
  const [activeMoment, setActiveMoment] = useState(null);

  const scrollGallery = (direction) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.scrollBy({
      left: direction * viewport.clientWidth * 0.75,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="moments-scrapbook-container">
      <div className="moments-header-row">
        <div>
          <h3 className="moments-section-title">MOMENTS</h3>
          <p className="moments-subheading">Hackathons, events, and the people along the way.</p>
        </div>
        <div className="moments-gallery-controls">
          <button type="button" onClick={() => scrollGallery(-1)} aria-label="Scroll photos left"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => scrollGallery(1)} aria-label="Scroll photos right"><ArrowRight size={18} /></button>
        </div>
      </div>

      <div className="moments-scrapbook-viewport" ref={viewportRef} aria-label="Moments photo gallery">
        <div className="moments-scrapbook-track">
          {moments.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="moments-polaroid-card"
              style={{ '--tilt-deg': `${Math.max(-3, Math.min(3, item.rotation || (index % 2 ? 2 : -2)))}deg` }}
              onClick={() => setActiveMoment(item)}
              aria-label={`View photo: ${item.label} (${item.date})`}
            >
              <span className="moments-paper-tape" aria-hidden="true" />
              <span className="moments-polaroid-photo-frame">
                <img src={item.src} alt={item.alt} loading="lazy" width="320" height="220" />
              </span>
              <span className="moments-polaroid-caption-area">
                <span className="moments-handwritten-caption">{item.label}</span>
                <span className="moments-polaroid-date">{item.date}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeMoment && <MomentsLightbox moment={activeMoment} onClose={() => setActiveMoment(null)} />}
    </div>
  );
}
