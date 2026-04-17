#!/usr/bin/env node
/** One-time: prepend Steerco YAML frontmatter to PRDs (plan 2026-04-17). Updated 2026-04-17 renames. */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../06-Resources/PRDs");

const essentialDone = new Set([
  "communication_service",
  "Feed",
  "Groups",
  "Login_Account_Activation",
  "Messaging_Ops_Urgent_Alerts",
  "Notifications",
  "Payslip_PDF",
  "Posts",
  "Profile_Users",
  "Tenant_Management",
  "Theming",
  "User_Importer",
  "User_Management",
]);

const specReady = new Set([
  "Elevated_Auth_Remote_App",
  "Explorer",
  "Page_Builder",
  "Product_Analytics",
  "Scheduled_Content",
  "Smart_HR_Whatsapp",
]);

const discovery = new Set([
  "Employee_Chat_and_Groups",
  "AI_Assistant_FAQ",
  "Integrations_floatpays",
]);

function slug(filename) {
  return filename
    .replace(/\.md$/, "")
    .toLowerCase()
    .replace(/_/g, "-");
}

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith(".md") || f === "README.md") continue;
  const p = path.join(dir, f);
  let body = fs.readFileSync(p, "utf8");
  if (body.startsWith("---\n")) {
    console.log("already has frontmatter:", f);
    continue;
  }
  const base = f.replace(/\.md$/, "");
  let lifecycle = "spec_ready";
  let source = "legacy_upgrade";
  let extra = "";

  if (f === "PRD_Product_Map.md") {
    extra = "document_type: integration_map\n";
    lifecycle = "done";
  } else if (base === "Requirements") {
    extra = "document_type: prd_index\n";
    lifecycle = "done";
  } else if (essentialDone.has(base)) {
    lifecycle = "done";
  } else if (specReady.has(base)) {
    lifecycle = "spec_ready";
  } else if (discovery.has(base)) {
    lifecycle = "discovery";
  }

  const prd_id = slug(f);
  const fm =
    `---\nprd_id: ${prd_id}\nlifecycle: ${lifecycle}\nlast_status_update: 2026-04-17\nsource: ${source}\n${extra}` +
    `---\n\n`;

  fs.writeFileSync(p, fm + body, "utf8");
  console.log("frontmatter:", f, lifecycle);
}
