// Checks every page in this folder against page-rules.mjs. Run it with
// `npm run check` before opening a pull request.
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { lintPage } from "./page-rules.mjs";

const contentRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIPPED_DIRECTORIES = new Set([".git", ".vitepress", "node_modules", "public", "scripts"]);
const SKIPPED_FILES = new Set(["CLAUDE.md"]);

async function listPages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const pages = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return SKIPPED_DIRECTORIES.has(entry.name) ? [] : listPages(entryPath);
      }
      return entry.isFile() && entry.name.endsWith(".md") && !SKIPPED_FILES.has(entry.name)
        ? [entryPath]
        : [];
    }),
  );
  return pages.flat().sort();
}

const pages = await listPages(contentRoot);
const violations = [];
for (const page of pages) {
  const relativePath = path.relative(contentRoot, page).split(path.sep).join("/");
  violations.push(...lintPage(await fs.readFile(page, "utf8"), relativePath));
}

for (const { sourcePath, line, label, message } of violations) {
  console.error(`${sourcePath}:${line} ${label}: ${message}`);
}

if (violations.length > 0) {
  console.error(`\n${violations.length} problem(s) in ${pages.length} page(s).`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} page(s). No problems found.`);
}
