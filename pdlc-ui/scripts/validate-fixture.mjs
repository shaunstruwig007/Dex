#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const schemaPath = join(root, "src/schema/initiative.schema.json");
const fixturePath = join(
  root,
  "../plans/PDLC_UI/fixtures/initiative-example.json",
);

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const data = JSON.parse(readFileSync(fixturePath, "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const ok = validate(data);
if (!ok) {
  console.error("Fixture failed JSON Schema validation:", validate.errors);
  process.exit(1);
}
console.log("initiative-example.json validates against initiative.schema.json");
