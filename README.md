# NO-SIGNAL — AI Roleplay Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A lightweight, open-source AI roleplay platform with character persistence, hybrid memory, and a pluggable AI backend.

**Live demo:** https://no-signal-ai-source-code-production.up.railway.app

---

## Features

- **Real-time chat** — SSE streaming from Groq / Google Gemini
- **Character system** — Create, customize, and share AI personas with avatars
- **Hybrid memory** — Short-term context + long-term summarization + RAG (pgvector embeddings)
- **Session management** — Rename, archive, and delete conversations
- **File uploads** — Send images and files in chat (stored in Supabase Storage)
- **Auth** — Email/password login via Supabase Auth
- **Dark UI** — Discord-inspired minimal interface, no framework
- **Rate limiting** — Built-in per-route rate limiting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML / CSS / Vanilla JS (no framework, no bundler) |
| Backend | Node.js + Express (ES modules) |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| File storage | Supabase Storage |
| AI providers | Groq, Google Gemini (configurable) |
| Embeddings | HuggingFace Inference API (optional, for RAG) |
| Payments | Stripe (optional) |
| Deploy | Railway |

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Yugos06/No-Signa-AI-source-code-
cd No-Signa-AI-source-code-/backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run the following tables:

```sql
-- Required tables (run in Supabase SQL editor)
create table profiles (id uuid references auth.users primary key, display_name text, persona text);
create table characters (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users, name text, personality text, tone text, lore text, avatar_url text, is_public boolean default false, tags text[]);
create table chat_sessions (id uuid default gen_random_uuid() primary key, user_id uuid references auth.users, character_id uuid references characters, character_snapshot jsonb, summary text, last_message_at timestamptz);
create table chat_messages (id uuid default gen_random_uuid() primary key, session_id uuid references chat_sessions, role text, content text, file_url text, file_type text, created_at timestamptz default now());
create table announcements (id uuid default gen_random_uuid() primary key, content text, created_at timestamptz default now());
-- Optional: for RAG memory search
create extension if not exists vector;
create table memory_vectors (id uuid default gen_random_uuid() primary key, session_id uuid references chat_sessions, content text, embedding vector(384), created_at timestamptz default now());
create or replace function search_memories(query_embedding vector(384), match_session_id uuid, match_count int)
returns table(content text, similarity float) language sql as $$
  select content, 1 - (embedding <=> query_embedding) as similarity
  from memory_vectors
  where session_id = match_session_id
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

### 4. Configure AI models

Copy the example config and fill in your model details:

```bash
cp .private/ai-config.json.example .private/ai-config.json  # if provided
# Or set AI_CONFIG_JSON env var with your model configuration
```

### 5. Run

```bash
npm run dev   # development (auto-reload)
npm start     # production
```

Open http://localhost:3000

---

## Environment Variables

See [`backend/.env.example`](backend/.env.example) for the full list. Key variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `AI_CONFIG_PATH` | Yes* | Path to AI model config JSON |
| `AI_CONFIG_JSON` | Yes* | Inline AI model config (alternative to file) |
| `HF_API_KEY` | No | HuggingFace API key — enables RAG memory search |
| `STRIPE_SECRET_KEY` | No | Stripe secret key — enables subscription page |
| `DEV_EMAILS` | No | Comma-separated dev account emails |
| `DEV_BADGE_CONFIG` | No | JSON map of email → badge roles |
| `ALLOWED_ORIGIN` | No | Restrict CORS to specific origin |

*One of `AI_CONFIG_PATH` or `AI_CONFIG_JSON` is required.

---

## Architecture

```
Browser (HTML/CSS/JS)
        │
        ▼
backend/server.js  (Express, Node.js ES modules)
        │
        ├── /chat           → AI streaming (SSE)
        ├── /api/characters → Character CRUD
        ├── /api/sessions   → Session management
        ├── /api/upload     → File uploads (multer → Supabase Storage)
        └── /api/*          → Auth, profiles, announcements
        │
        ├── Groq / Google Gemini  (AI inference)
        ├── HuggingFace           (embeddings, optional)
        └── Supabase              (DB, auth, storage)
```

**Chat flow:** JWT validated → character snapshot loaded → RAG memory searched → old messages summarized if >20 → system prompt built → AI called with SSE streaming → response streamed to browser → messages + embeddings stored asynchronously.

---

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

Keep it simple: no TypeScript, no bundler, no framework.

---

## License

[MIT](LICENSE) — © 2026 Yugos06
