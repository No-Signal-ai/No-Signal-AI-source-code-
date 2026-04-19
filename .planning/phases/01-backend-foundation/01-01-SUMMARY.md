---
phase: 01-backend-foundation
plan: "01"
subsystem: backend
tags: [system-prompt, database, migration, sql, persona-first]
dependency_graph:
  requires: []
  provides: [buildSystemPrompt-persona-first, migration-001-public-characters]
  affects: [backend/server.js, .planning/migrations/001_public_characters.sql]
tech_stack:
  added: []
  patterns: [persona-first-system-prompt, idempotent-sql-migration]
key_files:
  created:
    - .planning/migrations/001_public_characters.sql
  modified:
    - backend/server.js (buildSystemPrompt lignes 146-183)
decisions:
  - "Approche persona-first : 'You ARE {name}. This is not roleplay...' plutôt que 'You are a roleplay character'"
  - "Sections vides (personality/tone/style/lore) omises silencieusement via .trim()"
  - "Nouveau champ style injecté comme section dédiée 'Writing style:' séparée de tone"
  - "Migration SQL idempotente (IF NOT EXISTS) applicable manuellement via Supabase SQL editor"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-19T13:26:08Z"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 1
  files_created: 1
---

# Phase 1 Plan 01: Migration DB + buildSystemPrompt persona-first — Summary

**One-liner:** Réécriture persona-first de buildSystemPrompt avec support du champ style + script SQL idempotent ajoutant 4 colonnes (is_public, category, style, chat_count) à la table characters.

## Tâches Complétées

| Tâche | Nom | Commit | Fichiers |
|-------|-----|--------|----------|
| 1 | Réécrire buildSystemPrompt — persona-first | 80cc520 | backend/server.js (lignes 146-183) |
| 2 | Créer le script SQL de migration 001 | c60abe1 | .planning/migrations/001_public_characters.sql |

## Résultats

### Tâche 1 — buildSystemPrompt réécrit

**Lignes modifiées dans server.js :** 146-183 (anciennement 146-166)

La fonction est passée de 21 lignes à 38 lignes. Corps complet remplacé :

- **Avant :** `You are a roleplay character. Stay in character at all times. Never break character or mention you are an AI.` — approche générique
- **Après :** `You ARE ${char.name}. This is not roleplay — you are ${char.name}, speaking with your own voice.` — approche persona-first immersive

**Signature inchangée :**
```
function buildSystemPrompt(character, summary, userPersona, ragContext)
```
L'appel en ligne ~307 (`buildSystemPrompt(character, summary, userPersona, ragContext)`) n'a pas été touché.

**Comportements vérifiés :**
- Sections vides omises silencieusement (`.trim()` sur personality, tone, style, lore)
- Nouveau champ `style` injecté comme `Writing style: {style}` (séparé de `tone`)
- Clôture : `Speak naturally, as yourself. Never break this identity.` toujours présente

### Tâche 2 — Migration SQL 001

**Fichier créé :** `.planning/migrations/001_public_characters.sql`

4 colonnes ajoutées à la table `characters` :

| Colonne | Type | Default | Raison |
|---------|------|---------|--------|
| `is_public` | BOOLEAN NOT NULL | FALSE | Rétrocompatibilité — personnages existants restent privés |
| `category` | TEXT NOT NULL | 'autre' | Valeur neutre pour personnages sans catégorie |
| `style` | TEXT NOT NULL | '' | Fallback silencieux D-03 |
| `chat_count` | INTEGER NOT NULL | 0 | Compteur pour Phase 2 (STAT-01) |

Index partiel créé : `idx_characters_public_category ON characters (is_public, category, created_at DESC) WHERE is_public = TRUE`

## Ecarts par rapport au plan

Aucun — plan exécuté exactement tel que défini.

## Known Stubs

Aucun. Les deux livrables sont complets et fonctionnels en eux-mêmes :
- `buildSystemPrompt` utilisera `char.style` dès que la colonne `style` sera ajoutée en DB (via la migration) et que les routes POST/PUT `/api/characters` seront mises à jour (Plan 02).
- La migration SQL est prête à être appliquée manuellement.

## Threat Flags

Aucun nouveau surface de sécurité introduit au-delà du threat model documenté dans le plan.

| Flag | Fichier | Description |
|------|---------|-------------|
| T-01-01 (mitigate) | backend/server.js | `char.style?.trim()` — valeur vient de Supabase, validation length en Plan 02 |

## Requirements Couverts

- SYSP-01 : buildSystemPrompt persona-first immersif
- SYSP-02 : Support du champ `style` créateur dans le system prompt
- SYSP-03 : Fallback silencieux pour champs vides + rétrocompatibilité is_public=FALSE
- DB-01 : Script SQL de migration avec colonnes is_public, category, style, chat_count + index

## Self-Check: PASSED

- [x] `backend/server.js` existe et contient `You ARE ${char.name}` (ligne 151)
- [x] `.planning/migrations/001_public_characters.sql` existe avec 4 colonnes et 1 index
- [x] Commit `80cc520` : feat(01-01) buildSystemPrompt
- [x] Commit `c60abe1` : chore(01-01) migration SQL
