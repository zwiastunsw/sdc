'use strict';

/**
 * Validation orchestrator – runs all documentation validation tasks in sequence:
 *
 *   1. normalize-quotes  – fix Polish-style quotes in uncommitted .md files
 *   2. lint:md           – markdownlint on docs/**\/*.md
 *
 * Each task is spawned as a child process. If any task fails the overall
 * process exits with a non-zero code.
 *
 * Usage:
 *   node scripts/validate.js          (from the documentation/ directory)
 *   npm run validate
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const util = require('node:util');

const styleText = util.styleText;

const TASKS = [
  {
    name: 'Normalize quotes',
    cmd: 'node',
    args: [path.join(__dirname, 'normalize-quotes.js')],
  },
  {
    name: 'Markdown lint',
    cmd: 'npx',
    args: ['markdownlint', 'docs/**/*.md', '--config', '.markdownlint.json'],
  },
];

function runTask(task) {
  console.log(styleText('cyan', `\n▶ ${task.name}…`));

  const result = spawnSync(task.cmd, task.args, {
    stdio: 'inherit',
    shell: false,
    // Run relative to documentation/ (where package.json lives)
    cwd: path.resolve(__dirname, '..'),
  });

  if (result.error) {
    console.error(styleText('red', `❌ Failed to start "${task.name}":`), result.error.message);
    return false;
  }

  if (result.status !== 0) {
    console.error(styleText('red', `❌ "${task.name}" exited with code ${result.status}.`));
    return false;
  }

  console.log(styleText('green', `✅ ${task.name} passed.`));
  return true;
}

function main() {
  console.log(styleText('cyan', '🔍 Running validation tasks…'));

  const failures = [];

  for (const task of TASKS) {
    const passed = runTask(task);
    if (!passed) {
      failures.push(task.name);
    }
  }

  if (failures.length > 0) {
    console.error(
      styleText('red', `\n❌ Validation failed (${failures.length} task(s)): ${failures.join(', ')}`),
    );
    process.exit(1);
  }

  console.log(styleText('green', '\n✅ All validation tasks passed.'));
  process.exit(0);
}

main();
