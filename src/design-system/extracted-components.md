# Extracted Portfolio Components & Feature Specifications

This document outlines the extracted visual elements, code structures, and math for all 5 reference websites.

---

## 1. Cosmic Energy Rays Background Cursor Effect (`aelradi.engineer`)
**Priority**: High Priority

### Tech Stack & Extraction Details
- **Library**: `tubes1.min.js` (Three.js WebGL procedural tube rendering engine)
- **Local Path**: [`public/vendor/tubes1.min.js`](file:///Users/atharavnarangmac/Desktop/Manipal%20CLG/Project/Antigravity/Profile2%20copy/public/vendor/tubes1.min.js)
- **Canvas Element**: Fullscreen fixed `<canvas>` overlay.

### React Integration Code
```jsx
import { useEffect, useRef } from "react";

export function CosmicCursorBackground({ onColorChange }) {
  const canvasRef = useRef(null);
  const tubesInstance = useRef(null);

  useEffect(() => {
    let timer = setTimeout(() => {
      import("/vendor/tubes1.min.js")
        .then((module) => {
          const initTubes = module.default;
          if (canvasRef.current) {
            const colors = ["#10b981", "#065f46", "#34d399"];
            const lightColors = ["#10b981", "#34d399", "#6ee7b7", "#065f46"];
            
            tubesInstance.current = initTubes(canvasRef.current, {
              tubes: {
                colors: colors,
                lights: {
                  intensity: 200,
                  colors: lightColors
                }
              }
            });

            if (onColorChange) onColorChange(colors[0]);
          }
        })
        .catch((err) => console.error("Failed to load TubesCursor:", err));
    }, 100);

    return () => {
      clearTimeout(timer);
      if (tubesInstance.current && typeof tubesInstance.current.dispose === "function") {
        tubesInstance.current.dispose();
      }
    };
  }, [onColorChange]);

  const handleRandomizeColors = () => {
    if (tubesInstance.current && tubesInstance.current.tubes) {
      const palette = ["#c5ff41", "#10b981", "#f46c38", "#3b82f6", "#a855f7"];
      tubesInstance.current.tubes.setColors(palette.slice(0, 3));
      tubesInstance.current.tubes.setLightsColors(palette);
    }
  };

  return (
    <div className="fixed inset-0 z-0 bg-[#030014] cursor-pointer" onClick={handleRandomizeColors}>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
    </div>
  );
}
```

---

## 2. Light Theme Color Palette & Typography (`ayooladev.vercel.app`)

### Colors & Gradients
- **Primary Background**: `#f3f3f3` / `#e5e7eb`
- **Card Background**: `#ffffff` with `border border-gray-200` & `shadow-sm`
- **Primary Text**: `#111827` (Slate 900)
- **Secondary Text**: `#4b5563` (Gray 700)
- **Hero Text Gradient**: `linear-gradient(to right, #a855f7, #ef4444, #f97316)`
- **Accent Pills**: Blue (`#2563eb`), Green (`#10b981`), Orange (`#f97316`), Purple (`#a855f7`)

---

## 3. Dark Theme & Scroll Animations (`parthh.in`)

### A. Rotating Windmill on Scroll
Extracted framer-motion scroll transform logic:

```jsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export function RotatingWindmill() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rawRotation = useTransform(scrollYProgress, [0, 1], [0, 720]);
  const rotation = useSpring(rawRotation, { stiffness: 50, damping: 20 });

  return (
    <div ref={containerRef} className="relative flex items-center justify-center p-8">
      <motion.svg
        style={{ rotate: rotation }}
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-emerald-400 dark:text-[#c5ff41]"
      >
        {/* Windmill Blades SVG */}
        <path d="M12 12L12 2C13.5 2 15 3.5 15 5C15 6.5 13.5 8 12 12Z" fill="currentColor" />
        <path d="M12 12L22 12C22 13.5 20.5 15 19 15C17.5 15 16 13.5 12 12Z" fill="currentColor" />
        <path d="M12 12L12 22C10.5 22 9 20.5 9 19C9 17.5 10.5 16 12 12Z" fill="currentColor" />
        <path d="M12 12L2 12C2 10.5 3.5 9 5 9C6.5 9 8 10.5 12 12Z" fill="currentColor" />
        <circle cx="12" cy="12" r="2" fill="white" />
      </motion.svg>
    </div>
  );
}
```

### B. Real-Time Location Clock Component
```jsx
import { useState, useEffect } from "react";

export function LiveLocationClock({ timezone = "Asia/Kolkata", label = "Manipal, IN" }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(now);
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-xs font-mono font-medium text-gray-300">{label}</span>
      <span className="text-xs font-mono font-bold text-white">{timeStr}</span>
    </div>
  );
}
```

### C. Floating Glass Header Navbar
```jsx
export function GlassNavbar({ activeSection, setActiveSection }) {
  const links = ["Home", "Projects", "Skills", "Experience", "Contact"];
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 rounded-full bg-[#121212]/75 backdrop-blur-xl border border-white/10 shadow-2xl">
      {links.map((link) => (
        <button
          key={link}
          onClick={() => setActiveSection(link.toLowerCase())}
          className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${
            activeSection === link.toLowerCase()
              ? "bg-white/15 text-white shadow-inner"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {link}
        </button>
      ))}
    </nav>
  );
}
```

---

## 4. RAG AI LLM "Ask Me Anything" Feature (`aaabadcode.com`)

### Chat UI & Backend Query Specs
- **URL Route Sync**: `/chat?query=What%20are%20your%20projects%3F`
- **Suggested Question Pills**:
  - `What are your projects? What are you working on right now?`
  - `What are your hard and soft skills?`
  - `How can I contact or hire you?`
- **Response Format**: Markdown structured response with embedded badges, technology tags, live project links, and interactive buttons.
- **RAG Architecture**: Vector similarity search (e.g. Pinecone / Supabase Vector / Local Embeddings) matched against portfolio resume + project metadata JSON.

---

## 5. High-End Dark Theme Aesthetics (`sawad.framer.website`)

### Design Token Palette
- **Background**: Deep Obsidian `#151312`
- **Primary Glow Accent**: Neon Lime `#c5ff41`
- **Secondary Flame Accent**: Coral Orange `#f46c38`
- **Muted Text**: Warm Slate Gray `#998f8f`
- **Borders & Dividers**: `rgba(182, 180, 189, 0.2)`
- **Card Surfaces**: `#111111` with inset glow `inset 0 1px 0 rgba(255,255,255,0.1)`
