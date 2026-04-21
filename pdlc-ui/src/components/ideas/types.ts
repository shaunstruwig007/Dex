import type { Initiative } from "@/schema/initiative";

export type IdeasApiError = {
  error: string;
  issues?: unknown;
  current?: Initiative;
};

export type CreateResponse = { initiative: Initiative };
export type UpdateResponse = { initiative: Initiative };
export type ListResponse = { initiatives: Initiative[] };
export type DeleteResponse = { deleted: { id: string; handle: string } };
