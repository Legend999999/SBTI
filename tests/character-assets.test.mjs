import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const characters = await import("../lib/characters.ts");
const sbti = await import("../lib/sbti.ts");
const repoRoot = new URL("../", import.meta.url);

function publicPath(assetPath) {
  return new URL(`public${assetPath}`, repoRoot);
}

test("character registry has exactly one record for every SBTI personality", async () => {
  assert.equal(characters.characterRegistry.length, 27);
  const typeCodes = new Set(sbti.personalityTypes.map((type) => type.code));
  const characterCodes = new Set(characters.characterRegistry.map((character) => character.code));
  assert.deepEqual(characterCodes, typeCodes);
});

test("all character variants exist and filenames match assigned type", async () => {
  for (const character of characters.characterRegistry) {
    const paths = [
      character.imageFull,
      character.imageCard,
      character.imagePoster,
      character.imageThumbnail,
    ];
    for (const assetPath of paths) {
      assert.match(assetPath, new RegExp(`^/characters/${character.code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/(full|card|poster|thumbnail)\\.webp$`));
      await access(publicPath(assetPath));
    }
  }
});

test("no two codes point at the same image file", () => {
  const allPaths = characters.characterRegistry.flatMap((character) => [
    character.imageFull,
    character.imageCard,
    character.imagePoster,
    character.imageThumbnail,
  ]);
  assert.equal(new Set(allPaths).size, allPaths.length);
});

test("all character records include multilingual alt text", () => {
  for (const character of characters.characterRegistry) {
    assert.ok(character.alt.en, `${character.code} missing English alt`);
    assert.ok(character.alt.ckb, `${character.code} missing Kurdish alt`);
    assert.ok(character.alt.ar, `${character.code} missing Arabic alt`);
  }
});

test("character artwork is never cropped with object-fit cover", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /object-fit:\s*cover/i);
  assert.match(css, /\.mascot-img[\s\S]*object-fit:\s*contain/i);
  assert.match(css, /\.audit-images img[\s\S]*object-fit:\s*contain/i);
});
