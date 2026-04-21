import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { initiativeSchema } from "../src/schema/initiative";

const __dir = dirname(fileURLToPath(import.meta.url));
const out = join(__dir, "../src/schema/initiative.schema.json");

const jsonSchema = zodToJsonSchema(initiativeSchema, {
  name: "Initiative",
  $refStrategy: "none",
});

writeFileSync(out, JSON.stringify(jsonSchema, null, 2), "utf8");
console.log("Wrote", out);
