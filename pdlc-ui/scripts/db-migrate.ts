import { migrate, migrationStatus } from "../src/storage/migrate";

const applied = migrate();
const status = migrationStatus();
if (applied.length === 0) {
  console.log(
    `No pending migrations. ${status.applied.length} already applied.`,
  );
} else {
  console.log(
    `Applied ${applied.length} migration(s):`,
    applied.map((m) => `${m.version}_${m.name}`).join(", "),
  );
}
