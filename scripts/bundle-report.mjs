import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const outPath = path.join(distDir, "bundle-report.md");
const manifestPath = path.join(projectRoot, "dist", "public", ".vite", "manifest.json");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

function gzipSize(buffer) {
  return zlib.gzipSync(buffer).byteLength;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Bundle report: manifest not found at ${manifestPath}`);
  process.exit(1);
}

const manifest = readJson(manifestPath);

const assets = [];
for (const entry of Object.values(manifest)) {
  if (!entry || typeof entry !== "object") continue;
  if (!("file" in entry) || typeof entry.file !== "string") continue;

  const file = entry.file;
  const files = [file, ...(Array.isArray(entry.css) ? entry.css : [])];
  for (const f of files) {
    const abs = path.join(projectRoot, "dist", "public", f);
    if (!fs.existsSync(abs)) continue;
    const buf = fs.readFileSync(abs);
    assets.push({
      file: f,
      bytes: buf.byteLength,
      gzipBytes: gzipSize(buf),
    });
  }
}

// Deduplicate by file path (manifest can reference same css multiple times).
const byFile = new Map();
for (const a of assets) {
  const prev = byFile.get(a.file);
  if (!prev || a.bytes < prev.bytes) byFile.set(a.file, a);
}

const uniqueAssets = Array.from(byFile.values()).sort((a, b) => b.bytes - a.bytes);

const totalBytes = uniqueAssets.reduce((sum, a) => sum + a.bytes, 0);
const totalGzipBytes = uniqueAssets.reduce((sum, a) => sum + a.gzipBytes, 0);

const top = uniqueAssets.slice(0, 30);

const lines = [];
lines.push("# Bundle report");
lines.push("");
lines.push(`Manifest: \`${path.relative(projectRoot, manifestPath)}\``);
lines.push("");
lines.push(`Total assets (unique): **${uniqueAssets.length}**`);
lines.push(`Total size: **${formatBytes(totalBytes)}** (gzip **${formatBytes(totalGzipBytes)}**)`);
lines.push("");
lines.push("## Top assets");
lines.push("");
lines.push("| File | Size | Gzip |");
lines.push("| --- | ---: | ---: |");
for (const a of top) {
  lines.push(`| \`${a.file}\` | ${formatBytes(a.bytes)} | ${formatBytes(a.gzipBytes)} |`);
}
lines.push("");
lines.push("## Notes");
lines.push("");
lines.push("- Sizes are based on built assets in `dist/public` (raw bytes + gzip estimate).");
lines.push("- This report is intended as a lightweight CI signal; use a full visualizer when needed.");
lines.push("");

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`Wrote ${path.relative(projectRoot, outPath)}`);
