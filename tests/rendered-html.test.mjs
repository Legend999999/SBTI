import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/en") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the localized SBTI product instead of the starter", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /MischiefType/);
  assert.match(html, /Not serious\. Suspiciously accurate\./);
  assert.match(html, /Find the personality type/);
  assert.match(html, /For entertainment and self-reflection only/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders Kurdish and Arabic routes", async () => {
  const [ckb, ar] = await Promise.all([render("/ckb"), render("/ar")]);
  assert.equal(ckb.status, 200);
  assert.equal(ar.status, 200);
  assert.match(await ckb.text(), /کوردی|گروپی چات/);
  assert.match(await ar.text(), /العربية|اكتشف النوع/);
});
