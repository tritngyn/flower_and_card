import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const html = await readFile(path.join(dist, "index.html"), "utf8");
const script = await readFile(path.join(dist, "assets", "card.js"), "utf8");
const flowerScript = await readFile(path.join(dist, "assets", "flower.js"), "utf8");
const styles = await readFile(path.join(dist, "assets", "card.css"), "utf8");
const flowerStyles = await readFile(path.join(dist, "assets", "flower.css"));

for (const id of ["flowerScene", "cardScene", "cardTitle", "replay"]) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id}`);
  assert.match(script, new RegExp(id), `card.js does not reference #${id}`);
}

for (const text of ["Hi Thư nhé", "Ảnh của Thư"]) {
  assert.match(html, new RegExp(text), `Missing required copy: ${text}`);
}

assert.doesNotMatch(html, /Ngày Phụ nữ Việt Nam|20\s*[·/]\s*10/i, "Visible date copy must be removed");
assert.doesNotMatch(html, /Chạm vào màn hình nhé|Mở thiệp của em|class=["'][^"']*teddy/i, "Visible CTA and teddy must be removed");
assert.match(script, /flowerScene\.addEventListener\(["']click["'], openCard\)/, "Full-screen click must open the card");
assert.match(script, /flowerScene\.addEventListener\(["']keydown["']/, "Keyboard opening must remain supported");
assert.match(flowerScript, /onload\s*=\s*\(\)\s*=>\s*{\s*document\.body\.classList\.remove\(["']container["']\);?\s*};?/s, "Flower-animation startup script changed");
assert.equal(createHash("sha256").update(flowerStyles).digest("hex"), "f2c2f4b41702fb6f7309b8a38e4050f11edc6aea1993b1ce3b086f7bf66334e2", "Flower-animation CSS must remain byte-for-byte identical");
for (const className of ["flower--1", "flower--2", "flower--3", "flower__g-long", "flower__g-front", "flower__g-fr", "long-g--7"]) {
  assert.match(html, new RegExp(className), `Missing original flower structure: ${className}`);
}
assert.match(html, /class=["']pop-heart["']/, "Missing right half of the pop-up heart");
assert.match(html, /class=["']pop-heart pop-heart--left["']/, "Missing left half of the pop-up heart");
assert.match(styles, /\.card-open \.greeting-card\s*{[^}]*--open:\s*-166deg/s, "Missing CSS 3D Lab opening state");
assert.match(styles, /\.pop-heart\s*{[^}]*mask:/s, "Missing scalable heart mask");
assert.match(styles, /\.flower-leaving \.flower-scene/, "Missing flower fade-out state");
assert.match(styles, /\.card-visible \.card-scene/, "Missing card fade-in state");
assert.doesNotMatch(html, /<audio\b[^>]*\bautoplay\b/i, "Audio must not autoplay");
assert.doesNotMatch(html, /(?:src|href)=["']https?:/i, "Runtime assets must stay local");

const localAssets = [...html.matchAll(/(?:src|href)=["']\.\/([^"']+)["']/g)].map((match) => match[1]);
for (const asset of localAssets) await access(path.join(dist, asset));

await access(path.join(dist, "licenses", "Flower-animation-MIT.txt"));
await access(path.join(dist, "licenses", "CSS-3D-Lab-MIT.txt"));
console.log(`Verified ${localAssets.length} local assets, original flower movement, and the pop-up card contract.`);
