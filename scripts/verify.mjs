import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const html = await readFile(path.join(dist, "index.html"), "utf8");
const script = await readFile(path.join(dist, "assets", "card.js"), "utf8");

for (const id of ["flowerScene", "openCard", "cardScene", "cardShell", "replay"]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
  assert.match(script, new RegExp(id), `card.js does not reference #${id}`);
}

assert.doesNotMatch(html, /<audio\b[^>]*\bautoplay\b/i, "Audio must not autoplay");
assert.doesNotMatch(html, /(?:src|href)=["']https?:/i, "Runtime assets must stay local");

const localAssets = [...html.matchAll(/(?:src|href)=["']\.\/([^"']+)["']/g)].map((match) => match[1]);
for (const asset of localAssets) await access(path.join(dist, asset));

await access(path.join(dist, "licenses", "Flower-animation-MIT.txt"));
console.log(`Verified ${localAssets.length} local assets and the interactive card contract.`);
