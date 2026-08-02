import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("Kurdish Sarchia Qaisy font is bundled and applied only for ckb locale", async () => {
  await access(new URL("../public/fonts/72_Sarchia_Qaisy.ttf", import.meta.url));
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /font-family:\s*"Sarchia Qaisy"/);
  assert.match(css, /html\[lang="ckb"\]\s+body/);
  assert.match(css, /\/fonts\/72_Sarchia_Qaisy\.ttf/);
  assert.match(css, /\/SBTI\/fonts\/72_Sarchia_Qaisy\.ttf/);
});
