-- Migration 001: Personnages publics + catégories + style + compteur de chats
-- Phase 1: Backend Foundation
-- À appliquer via le Supabase SQL editor (Dashboard > SQL Editor)
-- IDEMPOTENT : safe à réappliquer (IF NOT EXISTS sur colonnes et index)
--
-- Notes de rétrocompatibilité :
--   is_public DEFAULT FALSE   — tous les personnages existants restent privés (SYSP-03)
--   category  DEFAULT 'autre' — valeur neutre pour les personnages sans catégorie
--   style     DEFAULT ''      — champ vide pour les personnages existants (fallback silencieux D-03)
--   chat_count DEFAULT 0      — compteur créé maintenant, incrémenté en Phase 2 (STAT-01)
--
-- IMPORTANT : Appliquer cette migration AVANT de déployer le code serveur mis à jour

-- Colonnes
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS is_public   BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS category    TEXT    NOT NULL DEFAULT 'autre',
  ADD COLUMN IF NOT EXISTS style       TEXT    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS chat_count  INTEGER NOT NULL DEFAULT 0;

-- Index partiel pour la route GET /api/characters/public
-- Optimise les requêtes filtrées sur is_public=true (tri + filtre catégorie)
CREATE INDEX IF NOT EXISTS idx_characters_public_category
  ON characters (is_public, category, created_at DESC)
  WHERE is_public = TRUE;
