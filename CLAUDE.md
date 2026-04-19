# CLAUDE.md — No-Signal AI

> Lis ce fichier entièrement avant de toucher quoi que ce soit.

---

## Ce qu'est ce projet

No-Signal AI est une plateforme de roleplay IA communautaire.
L'objectif : donner aux gens un espace pour interagir avec des personnages fictifs créés par la communauté, sans barrière d'âge arbitraire, avec des modèles gratuits.

C'est un projet solo, développé par un développeur de 15 ans. Le code est intentionnel et réfléchi. Ne le réécris pas sans raison valable.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js (ESM), Express |
| Base de données | Supabase (PostgreSQL + Auth + Storage) |
| Frontend | HTML/CSS/JS vanilla |
| AI | Multi-modèles via registre configurable (OpenAI-compatible) |
| Mémoire | RAG avec embeddings vectoriels (pgvector) |
| Paiements | Stripe (optionnel) |
| Déploiement | Railway |

---

## Structure du projet

```
/
├── backend/
│   ├── server.js          # Point d'entrée — toute la logique backend
│   ├── package.json
│   └── public/            # Frontend statique servi par Express
│       ├── index.html     # Interface principale de chat
│       ├── app.js         # Logique frontend principale (74K — complexe)
│       ├── auth.html/js   # Authentification
│       ├── characters.html/js  # Gestion des personnages
│       ├── subscribe.html # Page d'abonnement Stripe
│       ├── config.js      # Config frontend
│       └── style.css      # Styles globaux
├── docs/                  # Documentation interne (gitignorée)
├── CLAUDE.md              # Ce fichier
├── README.md
└── LICENSE
```

---

## Architecture backend — points clés

### Modèles AI
Les modèles sont définis dans `.private/ai-config.json` (jamais committé).
Le registre est abstrait — n'importe quelle API OpenAI-compatible fonctionne (Gemini, Groq, etc.).
`getModel(key)` résout le modèle depuis `MODEL_REGISTRY`.

### Auth
`requireAuth` middleware — vérifie le JWT Supabase sur chaque route protégée.
`getUserClient(req)` — client Supabase avec le token user pour respecter les RLS policies.

### Mémoire (RAG)
- `embedText(text)` — génère un embedding via API configurable
- `searchMemories(userId, embedding)` — recherche vectorielle dans `memory_vectors`
- `storeMemory(...)` — stocke un échange en mémoire vectorielle
- `buildSystemPrompt(character, summary, userPersona, ragContext)` — construit le prompt système

### Streaming
Le chat utilise SSE (Server-Sent Events) via `/chat` POST.
Le frontend lit le stream token par token.

### Personnages
Actuellement **privés** — liés à `creator_id`.
**Priorité v2 : rendre publics et partageables.**

---

## Ce qui manque (backlog v2)

### Priorité haute
- [ ] Personnages publics — colonne `is_public` + route de découverte
- [ ] Catégories de personnages — colonne `category` + filtres
- [ ] System prompt amélioré — `buildSystemPrompt` est basique, c'est le cœur du produit
- [ ] Modération minimale — signalement de personnages

### Priorité moyenne
- [ ] Page de découverte communautaire
- [ ] Profils utilisateurs publics
- [ ] Statistiques de personnages (nb de chats)

### Plus tard
- [ ] Migration TypeScript (après v1.0 stable)
- [ ] Tests automatisés

---

## Conventions de code

- ESM uniquement (`import/export`) — pas de `require()`
- Pas de frameworks frontend — HTML/CSS/JS vanilla
- Toujours valider les inputs côté backend avant Supabase
- Toujours vérifier `creator_id === req.user.id` avant toute mutation
- Les clés API ne transitent jamais vers le frontend

---

## Variables d'environnement requises

```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
AI_CONFIG_JSON         # ou AI_CONFIG_PATH vers le fichier
ALLOWED_ORIGIN         # origines CORS autorisées
STRIPE_SECRET_KEY      # optionnel
STRIPE_PRICE_ID        # optionnel
DEV_EMAILS             # emails avec accès dev
DEV_BADGE_CONFIG       # JSON badges par email
```

---

## Règles absolues

1. **Ne jamais exposer les clés API au frontend**
2. **Ne jamais bypass requireAuth sur une route qui mute des données**
3. **Ne jamais écrire dans la DB sans vérifier l'ownership**
4. **Tester localement avant de proposer un déploiement**
5. **Un seul fichier modifié à la fois sur les gros fichiers (server.js, app.js)**

<!-- GSD:project-start source:PROJECT.md -->
## Project

**No-Signal AI — v2 Alpha Community**

No-Signal AI est une plateforme de roleplay IA communautaire où les utilisateurs interagissent avec des personnages fictifs créés par la communauté. La v2 ouvre la plateforme au public : découverte de personnages sans compte, chat invité via localStorage, et outils créateurs améliorés. Cible : n'importe qui voulant du roleplay IA sans barrière d'entrée.

**Core Value:** Un visiteur non connecté doit pouvoir découvrir des personnages publics et démarrer un chat immédiatement, sans inscription.

### Constraints

- **Stack** : Node.js ESM + Express + HTML/CSS/JS vanilla — pas de framework, pas de TypeScript
- **Taille fichiers** : `server.js` et `app.js` sont gros — modifier un seul à la fois
- **Auth** : Ne jamais bypass `requireAuth` sur une route qui mute des données
- **Sécurité** : Les clés API ne transitent jamais vers le frontend
- **Déploiement** : Railway auto-deploy depuis GitHub `main` — tester localement avant push
- **Timeline** : Plan 5 jours pour Alpha
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
