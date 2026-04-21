import { NextResponse } from "next/server";
import { ensureStorageReady } from "@/storage/init";
import { migrationStatus } from "@/storage/migrate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureStorageReady();
    const status = migrationStatus();
    const ready = status.pending.length === 0;
    return NextResponse.json(
      { ready, migrations: status },
      { status: ready ? 200 : 503 },
    );
  } catch (err) {
    return NextResponse.json(
      { ready: false, error: err instanceof Error ? err.message : "db_error" },
      { status: 503 },
    );
  }
}
