import { NextResponse } from "next/server";
import { ensureStorageReady } from "@/storage/init";
import { transitionInitiative } from "@/storage/repository";
import { transitionInitiativeBody } from "../../schemas";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * S2 stage transition endpoint. Response contract:
 *   200 { initiative }
 *   400 { error: "invalid_body" | "invalid_json", issues? }
 *   404 { error: "not_found" }
 *   409 { error: "revision_conflict", current }
 *   422 { error: "brief_required" | "parked_requires_intent_and_reason"
 *               | "illegal_transition" | "same_lifecycle", current }
 * 422 is used for policy rejections (the lifecycle machine said no); 409 is
 * used only for stale revisions. Keeping them distinct lets the UI refresh
 * on 409 and render a tooltip on 422 without a string match.
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

  const parsed = transitionInitiativeBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = transitionInitiative({ id, ...parsed.data });
  if (result.ok) {
    return NextResponse.json({ initiative: result.initiative });
  }
  if (result.reason === "not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (result.reason === "revision_conflict") {
    return NextResponse.json(
      { error: "revision_conflict", current: result.current },
      { status: 409 },
    );
  }
  return NextResponse.json(
    { error: result.reason, current: result.current },
    { status: 422 },
  );
}
