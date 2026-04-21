import { NextResponse } from "next/server";

/** Stub — dependency checks (DB, migrations) land Sprint 1. */
export async function GET() {
  return NextResponse.json({ ready: true });
}
