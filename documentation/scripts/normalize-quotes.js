'use strict';

/**
 * Normalize ASCII double quotes to Polish-style quotation marks „..." in Markdown files.
 *
 * Targets only uncommitted .md files (staged + unstaged + untracked) so contributors
 * can run this locally before committing.
 *
 * Rules (same as the original Python script):
 *  - Skips YAML frontmatter, fenced code blocks (```), inline code (`…`),
 *    HTML tags, bare URLs, and already-correct „…" pairs.
 *  - Converts "text" to „text" in prose lines only.
 *
 * Exit codes:
 *  0 – all files already normalized (or no uncommitted .md files found)
 *  1 – one or more files were fixed (run again to confirm clean state)
 */

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { execSync } = require('node:child_process');
const util = require('node:util');

const styleText = util.styleText;

const PLACEHOLDER = '\x00';
const RE_PLACEHOLDER = /\x00(\d+)\x00/g;

/** Patterns of spans to protect before quote replacement. */
const PROTECTED_PATTERNS = [
  /`[^`]+`/g,         // inline code: `…`
  /<[^>]+>/g,         // HTML tags: <img alt="…">
  /https?:\/\/\S+/g,  // bare URLs
  /„[^"]*"/g,         // already-correct Polish quote pairs „…"
];

/** The actual quote replacement: "text" → „text" */
const RE_ASCII_PAIR = /"([^"]*)"/g;

/**
 * Normalize a single prose line: protect special spans, replace ASCII pairs,
 * then restore the protected spans.
 *
 * @param {string} line
 * @returns {string}
 */
function normalizeLine(line) {
  const protected_ = [];

  function store(match) {
    const idx = protected_.length;
    protected_.push(match);
    return `${PLACEHOLDER}${idx}${PLACEHOLDER}`;
  }

  let out = line;
  for (const pattern of PROTECTED_PATTERNS) {
    out = out.replace(pattern, store);
  }

  // Replace ASCII pairs with Polish-style quotes
  out = out.replace(RE_ASCII_PAIR, '„$1"');

  // Restore protected spans
  out = out.replace(RE_PLACEHOLDER, (_, idx) => protected_[Number(idx)]);

  return out;
}

/**
 * Normalize all ASCII double-quote pairs in the prose sections of a Markdown
 * file's content string.
 *
 * @param {string} text – full file content
 * @returns {string} – normalized content
 */
function normalizeQuotes(text) {
  const lines = text.split('\n');
  const result = [];
  let inFrontmatter = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // YAML frontmatter (first line only opens it)
    if (i === 0 && line.trim() === '---') {
      inFrontmatter = true;
      result.push(line);
      continue;
    }
    if (inFrontmatter) {
      result.push(line);
      if (i > 0 && line.trim() === '---') inFrontmatter = false;
      continue;
    }

    // Fenced code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }
    if (inCodeBlock) {
      result.push(line);
      continue;
    }

    // Prose line
    result.push(normalizeLine(line));
  }

  return result.join('\n');
}

// ── File discovery ───────────────────────────────────────────────────────────

/**
 * Recursively collect all .md file paths under a directory (async).
 *
 * @param {string} dir – absolute path to the directory to scan
 * @returns {Promise<string[]>}
 */
async function getAllMdFiles(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return getAllMdFiles(fullPath);
      if (entry.isFile() && entry.name.endsWith('.md')) return [fullPath];
      return [];
    }),
  );
  return results.flat();
}

/**
 * Return the list of uncommitted .md file paths (absolute) using git.
 * Includes: staged, unstaged, and untracked files.
 *
 * execSync is intentional here: git queries are short-lived and must run
 * sequentially before any file I/O starts.
 *
 * @param {string} repoRoot – absolute path to the repository root
 * @returns {string[]}
 */
function getUncommittedMdFiles(repoRoot) {
  const run = (cmd) =>
    execSync(cmd, { cwd: repoRoot, encoding: 'utf-8' })
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

  const staged    = run('git diff --name-only --cached');
  const unstaged  = run('git diff --name-only');
  const untracked = run('git ls-files --others --exclude-standard');

  const unique = [...new Set([...staged, ...unstaged, ...untracked])];

  return unique
    .filter((f) => f.endsWith('.md'))
    .map((f) => path.resolve(repoRoot, f));
}

// ── Per-file processing ──────────────────────────────────────────────────────

/**
 * Read, normalize, and (if changed) write a single file.
 * Returns true if the file was modified.
 *
 * @param {string} filePath
 * @param {string} repoRoot
 * @returns {Promise<boolean>}
 */
async function processFile(filePath, repoRoot) {
  let original;
  try {
    original = await fsp.readFile(filePath, 'utf-8');
  } catch (err) {
    console.error(styleText('red', `❌ Cannot read ${filePath}:`), err.message);
    return false;
  }

  const normalized = normalizeQuotes(original);
  if (normalized === original) return false;

  try {
    await fsp.writeFile(filePath, normalized, 'utf-8');
    const rel = path.relative(repoRoot, filePath);
    console.log(styleText('green', `  ✔ fixed: ${rel}`));
    return true;
  } catch (err) {
    console.error(styleText('red', `❌ Cannot write ${filePath}:`), err.message);
    return false;
  }
}

// ── Entry point ──────────────────────────────────────────────────────────────

(async () => {
  // Resolve repo root (two levels up from documentation/scripts/)
  const repoRoot = path.resolve(__dirname, '..', '..');

  // Optional path argument: node scripts/normalize-quotes.js [<path>]
  const targetArg = process.argv[2];

  let files;
  let mode;

  if (targetArg) {
    const targetDir = path.resolve(targetArg);
    try {
      const stat = await fsp.stat(targetDir);
      if (!stat.isDirectory()) {
        console.error(styleText('red', `❌ Path is not a directory: ${targetDir}`));
        process.exit(1);
      }
    } catch {
      console.error(styleText('red', `❌ Path does not exist: ${targetDir}`));
      process.exit(1);
    }
    console.log(styleText('cyan', `📂 Scanning all .md files in: ${targetDir}`));
    files = await getAllMdFiles(targetDir);
    mode = 'path';
  } else {
    try {
      files = getUncommittedMdFiles(repoRoot);
    } catch (err) {
      console.error(styleText('red', '❌ Failed to list uncommitted files via git:'), err.message);
      process.exit(1);
    }
    // Filter out paths that no longer exist on disk (async)
    const exists = await Promise.all(
      files.map((f) => fsp.access(f).then(() => true).catch(() => false)),
    );
    files = files.filter((_, i) => exists[i]);
    mode = 'git';
  }

  if (files.length === 0) {
    const msg = mode === 'path'
      ? '⚠️  No .md files found in the specified path.'
      : '⚠️  No uncommitted .md files found.';
    console.log(styleText('yellow', msg));
    process.exit(0);
  }

  const results = await Promise.all(files.map((f) => processFile(f, repoRoot)));
  const fixedCount = results.filter(Boolean).length;

  if (fixedCount > 0) {
    console.log(
      styleText('yellow', `\n⚠️  Normalized quotes in ${fixedCount} file(s). Please review the changes and commit them.`),
    );
    process.exit(1);
  } else {
    console.log(styleText('green', `✅ All ${files.length} uncommitted .md file(s) already use correct Polish quotes.`));
    process.exit(0);
  }
})();
