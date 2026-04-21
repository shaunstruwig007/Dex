import { NextResponse } from "next/server";
import { lifecycleSchema } from "@/schema/initiative";
import { ensureStorageReady } from "@/storage/init";
import { createInitiative, listInitiatives } from "@/storage/repository";
import { createInitiativeBody } from "./schemas";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureStorageReady();
  const url = new URL(request.url);
  const lifecycleParam = url.searchParams.get("lifecycle");
  const lifecycle = lifecycleParam
    ? lifecycleSchema.safeParse(lifecycleParam)
    : null;
  if (lifecycle && !lifecycle.success) {
    return NextResponse.json({ error: "invalid_lifecycle" }, { status: 400 });
  }
  const initiatives = listInitiatives({
    lifecycle: lifecycle?.success ? lifecycle.data : undefined,
  });
  return NextResponse.json({ initiatives });
}

export async function POST(request: Request) {
  await ensureStorageReady();
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = createInitiativeBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    const initiative = createInitiative(parsed.data);
    return NextResponse.json({ initiative }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "title_required") {
      return NextResponse.json({ error: "title_required" }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "create_failed" },
      { status: 500 },
    );
  }
}
