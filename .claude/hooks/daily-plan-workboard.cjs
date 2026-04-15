#!/usr/bin/env node
/**
 * After /daily-plan: merge Tasks.md → work-items.json and regenerate index.html.
 * Does not start workboard_server.py or open a browser — open http://127.0.0.1:8765/ manually if needed.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const vaultRoot = process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, '../..');
const workboardDir = path.join(vaultRoot, 'Dex_System/workboard');

if (!fs.existsSync(path.join(workboardDir, 'build_index.py'))) {
  process.exit(0);
}

const sync = spawnSync('python3', ['sync_tasks_to_workboard.py', '--no-build'], {
  cwd: workboardDir,
  encoding: 'utf8',
});
if (sync.status !== 0) {
  console.error(
    'daily-plan-workboard: sync_tasks_to_workboard.py failed',
    sync.stderr || sync.stdout || ''
  );
}

const build = spawnSync('python3', ['build_index.py'], {
  cwd: workboardDir,
  encoding: 'utf8',
});
if (build.status !== 0) {
  console.error('daily-plan-workboard: build_index.py failed', build.stderr || build.stdout);
  process.exit(1);
}

console.log(
  'Workboard: index refreshed (sync + build_index). Open manually: http://127.0.0.1:8765/ if server is running.'
);
process.exit(0);
