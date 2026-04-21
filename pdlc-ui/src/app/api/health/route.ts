import { NextResponse } from "next/server";
import pkg from "../../../../package.json";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    gitSha: process.env.GIT_SHA ?? "local",
    version: pkg.version,
    uptime: process.uptime(),
  });
}
