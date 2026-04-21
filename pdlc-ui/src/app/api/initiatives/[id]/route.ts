import { NextResponse } from "next/server";
import { ensureStorageReady } from "@/storage/init";
import {
  deleteInitiative,
  getInitiative,
  updateInitiative,
} from "@/storage/repository";
import { deleteInitiativeBody, updateInitiativeBody } from "../schemas";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await ensureStorageReady();
  const { id } = await context.params;
  const initiative = getInitiative(id);
  if (!initiative) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ initiative });
}

export async function PATCH(request: Request, context: RouteContext) {
  await ensureStorageReady();
  const { id } = await context.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = updateInitiativeBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  try {
    const result = updateInitiative({ id, ...parsed.data });
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
  } catch (err) {
    if (err instanceof Error && err.message === "title_required") {
      return NextResponse.json({ error: "title_required" }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "update_failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  await ensureStorageReady();
  const { id } = await context.params;
  let json: unknown = {};
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const parsed = deleteInitiativeBody.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const result = deleteInitiative({ id, ...parsed.data });
  if (result.ok) {
    return NextResponse.json({ deleted: result.deleted });
  }
  if (result.reason === "not_found") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(
    { error: "revision_conflict", current: result.current },
    { status: 409 },
  );
}
