#!/usr/bin/env node
/**
 * Merges *_acceptance_criteria.md into sibling feature PRD, then deletes AC file.
 */
const fs = require("fs");
const path = require("path");

const PRD_DIR = path.join(__dirname, "../06-Resources/PRDs");

function fixLinks(md) {
  return md
    .replace(/\]\(\.\.\/PRD_Product_Map\.md\)/g, "](./PRD_Product_Map.md)")
    .replace(/\]\(\.\/([A-Za-z0-9_]+)_acceptance_criteria\.md\)/g, "](./$1.md#acceptance-criteria-bdd)");
}

const files = fs.readdirSync(PRD_DIR).filter((f) => f.endsWith("_acceptance_criteria.md"));

for (const acFile of files) {
  const base = acFile.replace("_acceptance_criteria.md", ".md");
  const mainPath = path.join(PRD_DIR, base);
  const acPath = path.join(PRD_DIR, acFile);
  if (!fs.existsSync(mainPath)) {
    console.warn("No parent for", acFile);
    continue;
  }
  let acContent = fs.readFileSync(acPath, "utf8");
  acContent = fixLinks(acContent);
  // Drop redundant top title line (keep rest including Source PRD line for traceability)
  acContent = acContent.replace(/^# [^\n]+\n+/, "");

  let main = fs.readFileSync(mainPath, "utf8");
  if (/\n## Acceptance criteria \(BDD\)\n/.test(main)) {
    console.warn("Already merged:", base);
    fs.unlinkSync(acPath);
    continue;
  }
  main = main.replace(/\s*$/, "");
  main +=
    "\n\n---\n\n## Acceptance criteria (BDD)\n\n" +
    acContent.trim() +
    "\n";
  fs.writeFileSync(mainPath, main, "utf8");
  fs.unlinkSync(acPath);
  console.log("Merged:", acFile, "→", base);
}
