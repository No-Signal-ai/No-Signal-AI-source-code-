# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**NO-SIGNAL** is an AI roleplay platform with a pluggable AI backend. The project is in early MVP stage — currently only documentation exists; source code is being actively developed.

## Planned Tech Stack

- **Frontend:** HTML, CSS, JavaScript — served via GitHub Pages (`index.html` as entry point)
- **Backend:** Node.js / Cloudflare Workers
- **AI integrations:** Claude API, OpenAI, Ollama / vLLM (local models)
- **Storage:** JSON files (MVP) → database (future)

## Development Commands (once backend is scaffolded)

```bash
npm install
npm run dev
```

Frontend: open `index.html` directly in browser, or deploy via GitHub Pages.

## Architecture

Three-tier design:

```
Frontend (HTML/CSS/JS)
  └── Calls backend REST API

Backend API (Node.js / Cloudflare Workers)
  ├── /chat        — AI interaction endpoint
  ├── /memory      — context storage & retrieval
  └── /character   — character management

AI Engine (pluggable)
  ├── External: Claude API / OpenAI / Gemini
  └── Local: Ollama / vLLM
```

## Memory System

The platform uses a three-layer hybrid memory architecture:

| Layer | What it stores |
|---|---|
| Short-term | Last N conversation messages |
| Long-term | Summarized context injected into prompts |
| Character core | Structured personality (name, tone, lore, personality traits) |

All three layers are combined into the system prompt sent to the AI engine.

## Security Constraints

- API keys must be stored server-side only — never exposed to the client
- Request validation and rate limiting are planned for the backend
- No sensitive data should be present in frontend code or committed to the repo
