import { NextResponse } from "next/server";
import { ensureStorageReady } from "@/storage/init";
import { reorderInitiative } from "@/storage/repository";
import { reorderInitiativeBody } from "../../schemas";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * S2 reorder endpoint. The client computes the midpoint sortOrder on drop
 * (see `src/components/ideas/swim-lane.tsx`) and posts it here. We keep this
 * handler lean: no lifecycle logic, just an optimistic-locked field edit that
 * the repository audits with a `field_edit` event.
 *
 *   200 { initiative }
 *   400 invalid_body / invalid_json
 *   404 not_found
 *   409 revision_conflict { current }
 */
export async function POST(request: Request, context: RouteContext) {
  await ensureStorageReady();
  const { id } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = reorderInitiativeBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = reorderInitiative({ id, ...parsed.data });
  if (result.ok) {
    return NextResponse.json({ initiative: result.initiative });
  }
  if (result.reason === "not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(
    { error: "revision_conflict", current: result.current },
    { status: 409 },
  );
}
