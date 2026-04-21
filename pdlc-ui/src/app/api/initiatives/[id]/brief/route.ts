import { NextResponse } from "next/server";
import { ensureStorageReady } from "@/storage/init";
import { saveBriefAndTransition } from "@/storage/repository";
import { saveBriefAndTransitionBody } from "../../schemas";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * S3 — atomic product brief save + `idea → discovery`.
 *
 *   200 { initiative }
 *   400 { error: "invalid_body" | "invalid_json", issues? }
 *   404 { error: "not_found" }
 *   409 { error: "revision_conflict", current }
 *   422 { error: "missing_required_fields", fields, current }
 *       | { error: CanTransitionReason, current } — policy (e.g. not in `idea`)
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

  const parsed = saveBriefAndTransitionBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = saveBriefAndTransition({
    id,
    expectedRevision: parsed.data.expectedRevision,
    answers: parsed.data.answers,
    now: parsed.data.now ? new Date(parsed.data.now) : undefined,
  });

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
  if (result.reason === "missing_required_fields") {
    return NextResponse.json(
      {
        error: "missing_required_fields",
        fields: result.fields,
        current: result.current,
      },
      { status: 422 },
    );
  }
  return NextResponse.json(
    { error: result.reason, current: result.current },
    { status: 422 },
  );
}
