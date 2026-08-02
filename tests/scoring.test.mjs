import assert from "node:assert/strict";
import test from "node:test";

const sbti = await import("../lib/sbti.ts");

test("all 27 personality types are configured and reachable", () => {
  assert.equal(sbti.personalityTypes.length, 27);
  const reached = new Set();
  for (const type of sbti.personalityTypes) {
    const result = sbti.scoreAnswers(sbti.answersForType(type));
    reached.add(result.type.code);
    assert.equal(result.type.code, type.code, `${type.code} should score to itself`);
  }
  assert.equal(reached.size, 27);
});

test("scoring is deterministic and tie-breaks consistently", () => {
  const neutral = Object.fromEntries(sbti.questions.map((question) => [question.id, 4]));
  const first = sbti.scoreAnswers(neutral);
  const second = sbti.scoreAnswers(neutral);
  assert.deepEqual(first.scores, second.scores);
  assert.equal(first.type.code, second.type.code);
});

test("translations and safe wording cover the required locales", () => {
  for (const type of sbti.personalityTypes) {
    for (const locale of sbti.locales) {
      assert.ok(type.titles[locale], `${type.code} title missing ${locale}`);
      assert.ok(type.short[locale], `${type.code} short missing ${locale}`);
      assert.ok(type.characterAsset.altText[locale], `${type.code} alt missing ${locale}`);
    }
  }
  const safe = Object.fromEntries(sbti.personalityTypes.map((type) => [type.code, type.safeCode]));
  assert.equal(safe.FUCK, "WILD");
  assert.equal(safe.SHIT, "SALTY");
  assert.equal(safe.DRUNK, "PARTY");
  assert.equal(safe.SEXY, "CHARM");
});

test("question model covers 32 active questions and 15 dimensions", () => {
  assert.equal(sbti.questions.filter((question) => question.active).length, 32);
  assert.equal(sbti.dimensions.length, 15);
  const measured = new Set(sbti.questions.map((question) => question.dimension));
  for (const dimension of sbti.dimensions) assert.ok(measured.has(dimension), `${dimension} has no question`);
});
