import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const source = await readFile(new URL("../src/app/Download/release.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { MIN_VERSION, meetsMinimum, parseRelease } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

const SERVER = "https://server.butteryai.com/api/releases/download/butteryai";
const manifest = (version, url, extra = {}) => ({ version, platforms: { "macos-arm64": { url, ...extra } } });

test("floor is 1.1.0", () => {
  assert.equal(MIN_VERSION, "1.1.0");
});

test("compares numeric version parts", () => {
  for (const v of ["1.1.0", "1.1.1", "1.2.0", "1.10.0", "2.0.0", "10.0.0"]) assert.equal(meetsMinimum(v), true, v);
  for (const v of ["1.0.7", "1.0.12", "1.0.99", "0.9.9", "0.99.99"]) assert.equal(meetsMinimum(v), false, v);
});

test("rejects versions it can't compare", () => {
  for (const v of ["", "1.1", "v1.1.0", "1.1.0-beta.1", "1.1.0 ", "latest", "1.1.0.1"]) assert.equal(meetsMinimum(v), false, v);
});

test("below the floor returns null, whatever the URL", () => {
  assert.equal(parseRelease(manifest("1.0.7", `${SERVER}/1.0.7/macos-arm64`)), null);
  assert.equal(parseRelease(manifest("1.0.7", "https://evil.example/x")), null);
  assert.equal(parseRelease({ version: "1.0.7" }), null);
});

test("accepts the two hosts the server emits", () => {
  assert.deepEqual(parseRelease(manifest("1.1.0", `${SERVER}/1.1.0/macos-arm64`, { size: 52000000 })), {
    version: "1.1.0",
    url: `${SERVER}/1.1.0/macos-arm64`,
    size: 52000000,
  });
  const gcs = "https://storage.googleapis.com/buttery-releases/butteryai/1.2.0/ButteryAI.zip";
  assert.equal(parseRelease(manifest("1.2.0", gcs)).url, gcs);
});

test("rejects untrusted download URLs", () => {
  for (const url of [
    "https://evil.example/api/releases/download/butteryai/1.1.0/macos-arm64",
    "http://server.butteryai.com/api/releases/download/butteryai/1.1.0/macos-arm64",
    "https://server.butteryai.com/evil/1.1.0.zip",
    "https://server.butteryai.com/api/releases/download/../../evil",
    "https://server.butteryai.com.evil.example/api/releases/download/x",
    "https://user:pass@server.butteryai.com/api/releases/download/x",
    "https://server.butteryai.com:8443/api/releases/download/x",
    "https://storage.googleapis.com.evil.example/x",
    "javascript:alert(1)",
    "not a url",
  ]) {
    assert.throws(() => parseRelease(manifest("1.1.0", url)), undefined, url);
  }
});

test("rejects malformed responses", () => {
  for (const data of [null, "1.1.0", {}, { version: 110 }, { version: "1.1.0" }, { version: "1.1.0", platforms: {} }]) {
    assert.throws(() => parseRelease(data));
  }
});
