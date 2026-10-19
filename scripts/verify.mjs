import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const html = await readFile(path.join(dist, "index.html"), "utf8");
const script = await readFile(path.join(dist, "assets", "card.js"), "utf8");
const styles = await readFile(path.join(dist, "assets", "card.css"), "utf8");

for (const id of ["flowerScene", "cardScene", "cardTitle", "replay"]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
  assert.match(script, new RegExp(id), `card.js does not reference #${id}`);
}

for (const text of [
  "Chạm vào màn hình nhé",
  "Hi Thư nhé",
  "Ảnh của Thư",
]) {
  assert.match(html, new RegExp(text), `Missing required copy: ${text}`);
}

assert.doesNotMatch(html, /Ngày Phụ nữ Việt Nam|20\s*[·/]\s*10/i, "Visible date copy must be removed");
assert.doesNotMatch(html, /Mở thiệp của em|class=["'][^"']*teddy/i, "Old CTA and teddy must be removed");
assert.match(script, /flowerScene\.addEventListener\(["']click["'], openCard\)/, "Full-screen click must open the card");
assert.match(script, /flowerScene\.addEventListener\(["']keydown["']/, "Keyboard opening must remain supported");
assert.match(styles, /\.card-open \.book-cover\s*{[^}]*rotateY\(-180deg\)/s, "Missing 3D book opening state");
assert.match(styles, /\.flower-leaving \.flower-scene/, "Missing flower fade-out state");
assert.match(styles, /\.card-visible \.card-scene/, "Missing card fade-in state");
assert.doesNotMatch(html, /<audio\b[^>]*\bautoplay\b/i, "Audio must not autoplay");
assert.doesNotMatch(html, /(?:src|href)=["']https?:/i, "Runtime assets must stay local");

const localAssets = [...html.matchAll(/(?:src|href)=["']\.\/([^"']+)["']/g)].map((match) => match[1]);
for (const asset of localAssets) await access(path.join(dist, asset));

await access(path.join(dist, "licenses", "Flower-animation-MIT.txt"));
console.log(`Verified ${localAssets.length} local assets and the flower-to-book-card contract.`);
