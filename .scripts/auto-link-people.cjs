#!/usr/bin/env node
/**
 * Auto-link known people names to Obsidian-style wiki links.
 * Scans 05-Areas/People/{Internal,External}/*.md (excl. README), longest match first.
 * Skips: YAML frontmatter, fenced code blocks, existing [[wiki links]], inline `code`.
 * Links unambiguous first names only (unique across registry).
 *
 * Usage:
 *   node .scripts/auto-link-people.cjs <file.md>
 *   node .scripts/auto-link-people.cjs --today
 *
 * Module: const { autoLinkContent, loadPeopleRegistry } = require('./.scripts/auto-link-people.cjs');
 */

const fs = require("fs");
const path = require("path");

const PEOPLE_SUBDIRS = ["Internal", "External"];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readDisplayName(filePath, stem) {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(/^#\s+(.+)$/m);
  if (m) return m[1].trim();
  return stem.replace(/_/g, " ");
}

function loadPeopleRegistry(vaultRoot) {
  const people = [];
  for (const sub of PEOPLE_SUBDIRS) {
    const dir = path.join(vaultRoot, "05-Areas", "People", sub);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".md") || name === "README.md") continue;
      const stem = name.slice(0, -3);
      const filePath = path.join(dir, name);
      const displayName = readDisplayName(filePath, stem);
      const relPath = path
        .join("05-Areas", "People", sub, stem)
        .replace(/\\/g, "/");
      people.push({
        stem,
        displayName,
        relPath,
        firstToken: displayName.split(/\s+/)[0],
      });
    }
  }

  const firstCounts = {};
  for (const p of people) {
    firstCounts[p.firstToken] = (firstCounts[p.firstToken] || 0) + 1;
  }
  for (const p of people) {
    p.firstNameUnique = firstCounts[p.firstToken] === 1;
  }

  people.sort((a, b) => b.displayName.length - a.displayName.length);
  return people;
}

/**
 * Link one line: skip if inside wiki link already handled by caller — we process segments.
 * @param {string} line
 * @param {ReturnType<loadPeopleRegistry>} people
 */
function linkLinePlain(line, people) {
  let out = "";
  let pos = 0;
  while (pos < line.length) {
    if (line[pos] === "`") {
      const end = line.indexOf("`", pos + 1);
      if (end === -1) {
        out += line.slice(pos);
        break;
      }
      out += line.slice(pos, end + 1);
      pos = end + 1;
      continue;
    }

    let matched = false;
    for (const p of people) {
      const dn = p.displayName;
      if (!line.startsWith(dn, pos)) continue;
      const before = pos > 0 ? line[pos - 1] : "";
      const after = line[pos + dn.length] || "";
      const beforeOk =
        !before || /[\s([{<'"—–-]/.test(before);
      const afterOk =
        !after || /[\s.,;:!?)\]}>'"''’]/.test(after);
      if (beforeOk && afterOk) {
        out += `[[${p.relPath}|${p.displayName}]]`;
        pos += dn.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    for (const p of people) {
      if (!p.firstNameUnique) continue;
      const fn = p.firstToken;
      if (!line.startsWith(fn, pos)) continue;
      const after = line[pos + fn.length] || "";
      if (/^[a-zA-Z]/.test(after)) continue;
      const before = pos > 0 ? line[pos - 1] : "";
      const beforeOk =
        !before || /[\s([{<'"—–-]/.test(before);
      const afterOk =
        !after || /[\s.,;:!?)\]}'"''’]/.test(after);
      if (beforeOk && afterOk) {
        out += `[[${p.relPath}|${p.displayName}]]`;
        pos += fn.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    out += line[pos];
    pos++;
  }
  return out;
}

/**
 * Split line by existing [[...]] (non-greedy inner), link only outside spans.
 */
function linkLineRespectingWiki(line, people) {
  const parts = [];
  let i = 0;
  while (i < line.length) {
    const start = line.indexOf("[[", i);
    if (start === -1) {
      parts.push({ wiki: false, text: line.slice(i) });
      break;
    }
    if (start > i) {
      parts.push({ wiki: false, text: line.slice(i, start) });
    }
    const afterOpen = start + 2;
    const close = line.indexOf("]]", afterOpen);
    if (close === -1) {
      parts.push({ wiki: false, text: line.slice(start) });
      break;
    }
    parts.push({ wiki: true, text: line.slice(start, close + 2) });
    i = close + 2;
  }
  return parts
    .map((p) => (p.wiki ? p.text : linkLinePlain(p.text, people)))
    .join("");
}

/**
 * @param {string} text
 * @param {ReturnType<loadPeopleRegistry>} people
 * @returns {string}
 */
function autoLinkContent(text, people) {
  const lines = text.split(/\n/);
  let fmDash = 0;
  let inFence = false;
  const out = [];
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const isDelim = line.trim() === "---";
    if (isDelim && fmDash < 2) {
      fmDash++;
      out.push(line);
      continue;
    }
    if (fmDash === 1 && !inFence) {
      out.push(line);
      continue;
    }
    if (line.startsWith("```")) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence) {
      out.push(line);
      continue;
    }
    out.push(linkLineRespectingWiki(line, people));
  }
  return out.join("\n");
}

function processFile(vaultRoot, filePath) {
  const abs = path.isAbsolute(filePath)
    ? filePath
    : path.join(vaultRoot, filePath);
  const raw = fs.readFileSync(abs, "utf8");
  const people = loadPeopleRegistry(vaultRoot);
  const next = autoLinkContent(raw, people);
  if (next !== raw) {
    fs.writeFileSync(abs, next, "utf8");
    console.log("Updated:", path.relative(vaultRoot, abs));
  } else {
    console.log("No changes:", path.relative(vaultRoot, abs));
  }
}

function findVaultRoot() {
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "05-Areas", "People"))) return dir;
    dir = path.dirname(dir);
  }
  return process.cwd();
}

function todayFiles(vaultRoot) {
  const today = new Date().toISOString().slice(0, 10);
  const out = [];
  const tasks = path.join(vaultRoot, "03-Tasks", "Tasks.md");
  if (fs.existsSync(tasks)) out.push(tasks);
  const wp = path.join(vaultRoot, "02-Week_Priorities", "Week_Priorities.md");
  if (fs.existsSync(wp)) out.push(wp);
  const inboxMeet = path.join(vaultRoot, "00-Inbox", "Meetings");
  if (fs.existsSync(inboxMeet)) {
    for (const f of fs.readdirSync(inboxMeet)) {
      if (f.startsWith(today) && f.endsWith(".md")) {
        out.push(path.join(inboxMeet, f));
      }
    }
  }
  const plans = path.join(vaultRoot, "07-Archives", "Plans");
  if (fs.existsSync(plans)) {
    for (const f of fs.readdirSync(plans)) {
      if (f.includes(today) && f.endsWith(".md")) {
        out.push(path.join(plans, f));
      }
    }
  }
  return [...new Set(out)];
}

function main() {
  const vaultRoot = findVaultRoot();
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    console.log(`Usage: node .scripts/auto-link-people.cjs <file.md> | --today`);
    process.exit(args.length === 0 ? 1 : 0);
  }
  if (args.includes("--today")) {
    const files = todayFiles(vaultRoot);
    if (files.length === 0) {
      console.log("No files matched for --today");
      return;
    }
    for (const f of files) processFile(vaultRoot, f);
    return;
  }
  const fileArg = args.find((a) => !a.startsWith("-"));
  if (!fileArg) {
    console.error("Missing file path");
    process.exit(1);
  }
  processFile(vaultRoot, fileArg);
}

if (require.main === module) {
  main();
}

module.exports = { autoLinkContent, loadPeopleRegistry, processFile, findVaultRoot };
