-- 001_initial.sql — Sprint 1 initiative persistence (ADR-0001).
-- Normalised columns for queryable fields; one JSON column `data` for the
-- remainder of the initiative contract (skill-owned stage objects, events,
-- attachments, sourceRefs, linkedPrdPath, strategyPillarIds, strategyWarning).

CREATE TABLE initiatives (
  id             TEXT    PRIMARY KEY,
  handle         TEXT    NOT NULL UNIQUE,
  title          TEXT    NOT NULL,
  body           TEXT    NOT NULL DEFAULT '',
  lifecycle      TEXT    NOT NULL DEFAULT 'idea',
  parked_intent  TEXT,
  parked_reason  TEXT,
  revision       INTEGER NOT NULL DEFAULT 1,
  created_at     TEXT    NOT NULL,
  updated_at     TEXT    NOT NULL,
  data           TEXT    NOT NULL DEFAULT '{}'   -- JSON blob (see repository.ts)
);

CREATE INDEX idx_initiatives_lifecycle ON initiatives (lifecycle);
CREATE INDEX idx_initiatives_created_at ON initiatives (created_at);
