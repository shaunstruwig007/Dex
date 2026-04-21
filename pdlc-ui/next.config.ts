import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /** Monorepo: Dex root may contain another lockfile — trace only this app. */
  outputFileTracingRoot: path.join(__dirname),
  env: {
    GIT_SHA:
      process.env.GIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  },
};

export default nextConfig;
