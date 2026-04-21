-- 002_deleted_events.sql — audit trail for hard-deleted initiatives.
-- S1 Bar A ships hard-delete; this table keeps the `{ at, by, kind, payload }`
-- event from schema-initiative-v0.md §6 after the initiative row is removed.

CREATE TABLE deleted_initiative_events (
  at       TEXT NOT NULL,
  by       TEXT NOT NULL,
  kind     TEXT NOT NULL,
  payload  TEXT NOT NULL           -- JSON
);

CREATE INDEX idx_deleted_events_at ON deleted_initiative_events (at);
