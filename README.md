<div align="center">

# ⚡ Atharav Narang — Portfolio 3.0 & Cinematic AI Experience

**Next-Gen Cinematic Developer Portfolio featuring WebGL Cosmic Energy Rays, Sawad Obsidian/Lime Aesthetics, AyoolaDev Light Mode, Live Location Clock, and "Ask About Atharav AI" — an embedded, scope-locked Retrieval-Augmented Generation (RAG) assistant built with React 19, Supabase pgvector, and Google Gemini.**

[✨ Live Portfolio Demo](https://atharav001n.vercel.app) • [💼 LinkedIn](https://linkedin.com/in/atharav-narang-132b74273) • [🐙 GitHub](https://github.com/Atharav001)

---

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_Engine-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Supabase pgvector](https://img.shields.io/badge/Supabase-pgvector-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis_Rate_Limiter-00E599?style=for-the-badge&logo=redis&logoColor=black)](https://upstash.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

<br />

---

## 🌟 Overview

**Portfolio 3.0** is an ultra-premium, cinematic developer portfolio for **Atharav Narang** — a second-year Computer Science student at Manipal Institute of Technology (MAHE), Bengaluru, specializing in AI/ML pipeline engineering, Agentic RAG architectures, local inference systems, and full-stack software development.

### 🎨 Visual & Motion Innovations
- **WebGL Cosmic Energy Rays (*aelradi.engineer*)**: Procedural Three.js WebGL tube engine with interactive mouse physics and multi-palette color shifting.
- **Obsidian Dark Aesthetic (*sawad.framer.website*)**: Pitch black background (`#0a0a0a`), Sawad **Neon Lime** (`#c5ff41`) and **Coral Flame** (`#f46c38`) accents, inset surface reflections, and warm slate gray typography.
- **Crisp Light Theme (*ayooladev.vercel.app*)**: Clean high-contrast palette with signature multi-stop hero text gradients and View Transition circular corner-burst animation.
- **Floating Glass Capsule Navbar & Live Timezone Clock (*parthh.in*)**: Centered glass pill nav with a real-time `Asia/Kolkata` location clock (Bangalore / Manipal, IN) and pulsating LED indicator.
- **Cinematic Scroll Animations (*parthh.in* & Framer Motion)**: Smooth Lenis scroll choreography featuring rotating windmill badges that scrub and spin with spring physics as you scroll.
- **"Ask About Atharav AI" Assistant (*aaabadcode.com*)**: Embedded scope-locked chatbot with URL query synchronization (`/?query=...`), suggested inquiries, ThinkingOrb canvas animation, and clipboard copy feedback.

---

## 🧠 "Ask About Atharav AI" — System Architecture

The chatbot is built as a **Scope-Locked RAG System**, ensuring it accurately answers questions grounded strictly in Atharav's verified projects and personal knowledge base while gracefully handling technical inquiries and blocking prompt injections.

```
┌─────────────────┐       ┌────────────────────────┐       ┌───────────────────────┐
│                 │  POST │                        │ RPC   │                       │
│  User Query     ├──────►│ Vercel Serverless API  ├──────►│ Supabase pgvector     │
│  (Chat Widget)  │       │ (/api/chat.js)         │       │ (match_knowledge)     │
└─────────────────┘       └──────────┬─────────────┘       └──────────┬────────────┘
                                     │                                │
                                     ▼                                ▼
                          ┌────────────────────┐          ┌───────────────────────┐
                          │  Upstash Redis     │          │ Gemini embedding-001  │
                          │  Sliding-Window    │          │ (768-dim Vectors)     │
                          │  Rate-Limiter      │          └───────────────────────┘
                          └──────────┬─────────┘
                                     │
                                     ▼
                          ┌────────────────────┐
                          │  Google Gemini     │
                          │  Flash LLM         │──────► Synthesized Answer
                          │  (Reasoning Engine)│
                          └────────────────────┘
```

### Key RAG Pipeline Features:
- **Two-Pass Topic Classification**: Pass 1 evaluates topic intent (allowing portfolio tech stack, projects, education, skills, and greetings while filtering out off-topic queries). Pass 2 synthesizes grounded answers using LLM reasoning.
- **768-dim Vector Similarity Search**: Powered by Google Gemini `embedding-001` and Supabase `pgvector` stored procedures (`match_knowledge_chunks`).
- **Resilient Multi-Model Fallbacks**: Primary inference on `gemini-2.5-flash` with graceful failover to `gemini-2.5-flash-lite` and topic-aware offline fallbacks.
- **Dual Sliding-Window Rate Limiting**: Upstash Redis enforcing 8 requests / 5 minutes per IP and 20 requests / 24 hours per session to prevent abuse.

---

## 🛠️ Tech Stack & Engineering Highlights

| Layer | Technologies Used |
|---|---|
| **Core Frontend** | React 19, Vite 8, Vanilla CSS Design Tokens (Zero Tailwind) |
| **Motion & Graphics** | Three.js WebGL procedural engine, Framer Motion, Lenis Smooth Scroll |
| **Icons & Typography** | Lucide React, Inter Variable Font, SF Mono |
| **Serverless Backend** | Vercel Serverless Functions (`/api/chat.js`), Node.js |
| **Database & Vector** | Supabase PostgreSQL + `pgvector` extension |
| **AI Models & SDKs** | Google GenAI SDK (`@google/genai`), Gemini Flash, Gemini embedding-001 |
| **Cache & Security** | Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`), DOMPurify |
| **Analytics** | Vercel Web Analytics (`@vercel/analytics`) |

---

## 📂 Project Structure

```
├── api/
│   └── chat.js                    # Vercel serverless function with RAG pipeline
├── chatbot-data/
│   ├── atharav_knowledge_base.md   # Master knowledge base for embeddings
│   └── scripts/                    # Ingestion & embedding sync scripts
├── public/
│   ├── assets/                     # Optimized project images & certificates
│   └── vendor/                     # WebGL procedural tube engine
├── src/
│   ├── components/
│   │   ├── About.jsx               # Student narrative & tools cloud
│   │   ├── CaseStudyViewer.jsx     # Interactive case study viewer & architecture diagrams
│   │   ├── ChatWidget.jsx          # Embedded AI assistant with ThinkingOrb
│   │   ├── Contact.jsx             # Let's Collaborate display CTA & socials
│   │   ├── CosmicBackground.jsx    # Three.js procedural WebGL energy rays
│   │   ├── CustomCursor.jsx        # Velocity spring physics & particle trail
│   │   ├── Experience.jsx          # Journey timeline & certificate modals
│   │   ├── Hero.jsx                # Cybernetic text scramble & parallax scene
│   │   ├── LiveLocationClock.jsx   # Real-time Bangalore/Manipal timezone clock
│   │   ├── MomentsStrip/           # Photo scrapbook marquee gallery & lightbox
│   │   ├── Navbar.jsx              # Centered floating glass capsule navbar
│   │   ├── Projects.jsx            # 3D tilt cards with browser mockups
│   │   ├── RotatingWindmill.jsx    # Scroll-linked spring rotating windmill
│   │   └── ThinkingOrb.jsx         # 3D canvas particle sphere
│   ├── data/
│   │   ├── moments.js              # Event photos & captions
│   │   └── projects.js             # Detailed case studies & technical specs
│   ├── index.css                   # Global styles & glassmorphism utilities
│   ├── tokens.css                  # Unified design tokens & dual-theme variables
│   ├── App.jsx                     # Main application container
│   └── main.jsx                    # React 19 entrypoint
└── vite.config.js                  # Vite 8 config with multi-chunk code splitting
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Atharav001/portfolio-3.0.git
cd portfolio-3.0
npm install
```

### 2. Environment Variables Setup
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License & Credits

- Designed & engineered by **[Atharav Narang](https://github.com/Atharav001)**.
- Thinking Orb design inspired by **[Jakub Antalík](https://github.com/antalik/thinking-orbs)**.
- Code released under the **MIT License**.
