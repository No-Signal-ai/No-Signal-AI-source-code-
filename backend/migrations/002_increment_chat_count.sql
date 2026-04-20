-- Migration 002: Fonction RPC increment_chat_count
-- Phase 2: Discovery & Guest Experience (STAT-01)
-- À appliquer via le Supabase SQL Editor (Dashboard > SQL Editor)
-- IDEMPOTENT : CREATE OR REPLACE safe à réappliquer
--
-- Note: chat_count est la colonne créée en migration 001 (NOT interactions).
-- Cette fonction est appelée côté serveur (server.js) après chaque chat invité,
-- en fire-and-forget, uniquement si is_public = true (sécurité additionnelle).
-- Elle ne lève pas d'erreur si char_id est inconnu (UPDATE silencieux).

CREATE OR REPLACE FUNCTION increment_chat_count(char_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE characters SET chat_count = chat_count + 1 WHERE id = char_id AND is_public = true;
$$;
