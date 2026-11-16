## Portfolio Website Architecture & Tech Stack (portfolio-3.0)

Atharav's portfolio is a responsive React application that pairs project case studies with an optional WebGL background and a project Q&A assistant. It provides a static background on mobile and for visitors who prefer reduced motion.

### Key Technologies & Stack Components:
- **Frontend Framework**: React 19 with Vite 8. Case study code loads when a visitor opens one.
- **Styling System**: Modular CSS with shared color and spacing tokens, two themes, and responsive layouts.
- **Icons & Visual Components**: Lucide React (`lucide-react`) for clean SVG icons, Framer Motion for smooth micro-animations, and Lenis (`lenis`) for smooth scrolling transitions across sections.
- **Interactive Thinking Indicator**: `thinking-orbs` library powering the dynamic animated canvas orb while the AI assistant composes responses.
- **Web Analytics**: `@vercel/analytics` for privacy-friendly user interaction tracking.

## "Ask About Atharav AI" — Scope-Locked RAG Chatbot System Architecture

The hero section features an embedded RAG (Retrieval-Augmented Generation) assistant called **"Ask About Atharav AI"**.

### RAG Architecture & Infrastructure:
1. **Serverless API Endpoint**: Built as a Vercel Serverless Function (`/api/chat.js`), handling user requests securely with CORS validation, input sanitization (max 500 characters), and session tracking.
2. **Vector Database & Search**: Supabase with `pgvector` extension (`knowledge_chunks` table). Custom stored procedure `match_knowledge_chunks` executes cosine vector similarity search to retrieve relevant context passages.
3. **Embeddings Model**: Google Gemini Embedding API (`gemini-embedding-001`) generating 768-dimensional dense vector embeddings for both knowledge chunks during ingestion and incoming user queries at runtime.
4. **LLM Generation Engine**: Google Gemini API (`@google/genai`) with configured fallback models when the primary model is unavailable. Response time depends on the model and retrieval services.
5. **Rate-Limiting & Cost Protection**: Shared Redis-backed fixed-window limits when available (8 requests per 5 minutes per IP, 20 requests per 24 hours per session). Per-instance in-memory limits provide a fallback during Redis outages, though they are weaker across multiple instances.
6. **Scope-Locking & Prompt Engineering**: Two-pass AI pipeline. Pass 1 evaluates topic relevance (allowing questions about Atharav, his work, skills, and portfolio site architecture while blocking unrelated general knowledge trivia or DAN prompt injection attempts). Pass 2 grounds the LLM response strictly in retrieved knowledge while allowing natural LLM reasoning.
