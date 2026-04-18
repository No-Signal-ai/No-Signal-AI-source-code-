# Roadmap: No-Signal AI — v2 Alpha Community

## Overview

Three phases deliver the Alpha v1.0 launch: first, the backend foundation that makes characters public and the system prompt immersive; second, the visitor-facing experience (discovery page + guest chat) that is the core value of the platform; third, the deployment validation that confirms the Alpha is live and stable. Every phase delivers one coherent, verifiable capability before the next begins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Backend Foundation** - Schema migration, public character API, and immersive system prompt
- [ ] **Phase 2: Discovery & Guest Experience** - Discovery page UI, category filters, search, and guest chat via localStorage
- [ ] **Phase 3: Alpha Launch** - Railway deployment validation and Alpha v1.0 go-live

## Phase Details

### Phase 1: Backend Foundation
**Goal**: The database and API support public characters with categories, and all chats use an immersive system prompt
**Depends on**: Nothing (first phase)
**Requirements**: DB-01, DB-02, CHAR-01, CHAR-02, SYSP-01, SYSP-02, SYSP-03
**Success Criteria** (what must be TRUE):
  1. A creator can mark a character as public and assign it a category when creating or editing it
  2. `GET /api/characters/public` returns public characters without requiring authentication
  3. All characters respond with an immersive, narrative system prompt regardless of whether they had tone/style fields before
  4. A creator can set a custom tone and style on a character and the AI response reflects those settings
**Plans**: TBD
**UI hint**: yes

### Phase 2: Discovery & Guest Experience
**Goal**: A visitor without an account can discover public characters, filter and search them, and start chatting immediately
**Depends on**: Phase 1
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, CHAR-03, CHAR-04, GUEST-01, GUEST-02, GUEST-03, STAT-01
**Success Criteria** (what must be TRUE):
  1. Visitor lands on `discover.html` and sees a grid of public characters without logging in
  2. Visitor can filter characters by category and search by name; results update accordingly
  3. Visitor clicks "Demarrer un chat" on any character and a chat session opens immediately, no account required
  4. Guest chat history persists in the browser after a page refresh (localStorage) and disappears when storage is cleared
  5. Each public character card displays its total chat count
**Plans**: TBD
**UI hint**: yes

### Phase 3: Alpha Launch
**Goal**: The Alpha v1.0 is live on Railway, stable, and validated end-to-end
**Depends on**: Phase 2
**Requirements**: DEP-01
**Success Criteria** (what must be TRUE):
  1. `/health` endpoint returns 200 on the Railway deployment
  2. At least one public character exists on the live instance and a guest visitor can complete a full chat exchange without errors
  3. All required environment variables are confirmed set in the Railway dashboard
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend Foundation | 0/TBD | Not started | - |
| 2. Discovery & Guest Experience | 0/TBD | Not started | - |
| 3. Alpha Launch | 0/TBD | Not started | - |
