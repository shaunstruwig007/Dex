-- 003_sort_order.sql — Sprint 2 user-controlled lane ordering (carry-over from
-- the S1 Slice log: Kanban sort order is drag-to-reorder, NOT an updatedAt
-- heuristic). Nullable so existing rows migrate without a default write; lists
-- order by `sort_order NULLS LAST, created_at DESC` so new cards appear at the
-- top of a lane until a human reorders them.

ALTER TABLE initiatives ADD COLUMN sort_order INTEGER;

CREATE INDEX idx_initiatives_lifecycle_sort
  ON initiatives (lifecycle, sort_order, created_at);
