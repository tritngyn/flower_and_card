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
const popupStyles = await readFile(path.join(dist, "assets", "popup-card.css"), "utf8");
const flowerStyles = await readFile(path.join(dist, "assets", "flower.css"));

for (const id of ["flowerScene", "cardScene", "cardShell", "cardTitle", "replay"]) {
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
for (const className of ["scene", "greeting", "card", "shadow", "page", "cover", "front", "inside"]) {
  assert.match(html, new RegExp(`class=["'][^"']*\\b${className}\\b`), `Missing source card class: ${className}`);
}
assert.doesNotMatch(html, /class=["'][^"']*\bpop\b/, "The center pop-up heart must be removed");
assert.match(popupStyles, /\.greeting\s*{[^}]*--open:\s*-96deg;[^}]*--view:\s*40deg;[^}]*--x0:\s*calc\(14 \* var\(--u\)\);[^}]*--pop:\s*0;[^}]*--shift:\s*calc\(-34 \* var\(--u\)\)/s, "Source card defaults changed");
assert.match(popupStyles, /\.greeting:hover,\s*\.greeting:focus-visible\s*{[^}]*--open:\s*-166deg;[^}]*--view:\s*24deg;[^}]*--x0:\s*calc\(2 \* var\(--u\)\);[^}]*--pop:\s*1;[^}]*--shift:\s*0px/s, "Source card opening state changed");
assert.match(popupStyles, /\.pop\s*{[^}]*width:\s*calc\(28 \* var\(--u\)\);[^}]*height:\s*calc\(48 \* var\(--u\)\);[^}]*translate3d\(var\(--x0\), 0, calc\(16 \* var\(--u\)\)\)/s, "Source right heart geometry changed");
assert.match(popupStyles, /\.pop-left\s*{[^}]*translate3d\(var\(--x0\), 0, calc\(-16 \* var\(--u\)\)\) rotateY\(180deg\)/s, "Source left heart geometry changed");
assert.match(styles, /\.scene\s*{[^}]*--u:\s*0\.46vmin/s, "Card view must be enlarged");
assert.match(styles, /\.greeting\.is-open\s*{[^}]*--open:\s*-180deg;[^}]*--view:\s*0deg/s, "Opened pages must face the viewer in parallel");
assert.match(styles, /\.greeting\.is-open \.card\s*{[^}]*rotateX\(0deg\)[^}]*rotateY\(var\(--view\)\)/s, "Opened card must finish front-on");
assert.match(script, /cardShell\.classList\.add\(["']is-open["']\)/, "Script must start the card opening animation");
assert.doesNotMatch(script, /prefers-reduced-motion|return\s+reducedMotion\.matches\s*\?\s*0/, "Core animation timing must not be disabled by the OS motion setting");
assert.doesNotMatch(styles, /animation-duration:\s*0\.001ms|transition-duration:\s*0\.001ms/, "Core CSS animation must not be collapsed by the OS motion setting");
assert.match(styles, /\.flower-leaving \.flower-scene/, "Missing flower fade-out state");
assert.match(styles, /\.card-visible \.card-scene/, "Missing card fade-in state");
assert.doesNotMatch(html, /<audio\b[^>]*\bautoplay\b/i, "Audio must not autoplay");
assert.doesNotMatch(html, /(?:src|href)=["']https?:/i, "Runtime assets must stay local");

const localAssets = [...html.matchAll(/(?:src|href)=["']\.\/([^"']+)["']/g)].map((match) => match[1].split("?")[0]);
for (const asset of localAssets) await access(path.join(dist, asset));

await access(path.join(dist, "licenses", "Flower-animation-MIT.txt"));
await access(path.join(dist, "licenses", "CSS-3D-Lab-MIT.txt"));
console.log(`Verified ${localAssets.length} local assets, original flower movement, and source popup-card geometry.`);
