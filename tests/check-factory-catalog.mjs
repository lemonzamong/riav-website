import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const root = new URL("../factories/", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const script = await readFile(new URL("catalog.js", root), "utf8");
const index = JSON.parse(await readFile(new URL("data/index.json", root), "utf8"));
const newRows = JSON.parse(await readFile(new URL("data/new.json", root), "utf8"));

assert.equal(index.total, 198157);
assert.equal(index.regions.length, 17);
assert.equal(index.categories.length, 12);
assert.match(html, /Iruvy/);
assert.match(html, /전국 제조기업/);
assert.match(html, /\/factories\/catalog\.js/);
assert.match(script, /\/factories\/data\/index\.json/);
assert.ok(Array.isArray(newRows.items));

let shardCount = 0;
for (const region of index.regions) {
  const files = await readdir(new URL(`data/${region.key}/`, root));
  shardCount += files.filter(file => file.endsWith(".json")).length;
}
assert.equal(shardCount, 17 * 12);
console.log(`factory catalog OK: ${index.total.toLocaleString()} rows, ${shardCount} shards`);
