import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureStorageReady } from "@/storage/init";
import { seedBriefForTesting } from "@/storage/repository";

export const dynamic = "force-dynamic";

const body = z.object({ id: z.string().min(1) });

/**
 * Test-only helper: writes a **minimum viable completed brief** (`brief.complete
 * === true`) so Playwright can exercise `idea → discovery` via the normal
 * transition endpoint without running the full wizard. Still used post-S3 for
 * the forward-chain swim test. Gated by `PDLC_ALLOW_TEST_HELPERS=1`.
 */
export async function POST(request: Request) {
  if (process.env.PDLC_ALLOW_TEST_HELPERS !== "1") {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }
  await ensureStorageReady();
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const initiative = seedBriefForTesting(parsed.data.id);
  if (!initiative) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ initiative });
}
