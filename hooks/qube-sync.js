#!/usr/bin/env node
/**
 * Qube Sync Hook
 * Syncs conversation context with https://github.com/SrijanAI/Qube
 *
 * SessionStart: pulls latest from remote
 * Stop: commits and pushes any new/updated context files
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const QUBE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, 'Qube');
const EVENT = process.env.CLAUDE_HOOK_EVENT || process.argv[2] || '';

function run(cmd) {
  try {
    return execSync(cmd, { cwd: QUBE_DIR, encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return null;
  }
}

function hasChanges() {
  const status = run('git status --porcelain');
  return status && status.trim().length > 0;
}

if (!fs.existsSync(QUBE_DIR)) {
  process.exit(0);
}

if (EVENT === 'SessionStart') {
  run('git pull --rebase origin main');
} else if (EVENT === 'Stop') {
  if (hasChanges()) {
    const date = new Date().toISOString().split('T')[0];
    run('git add -A');
    run(`git commit -m "context: update conversation context ${date}"`);
    run('git push origin main');
  }
}
