import { readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const SITE = "https://www.butteryai.com";
const SSR_DIR = "dist-ssr";

const PAGES = [
  {
    path: "/download",
    file: "download.html",
    title: "Download for Mac – ButteryAI",
    ogTitle: "Download ButteryAI for Mac",
    description:
      "Download ButteryAI for Mac and build AI specialists on your Mac. Requires a Mac with Apple silicon and macOS 15 or later.",
  },
  {
    path: "/pricing",
    file: "pricing.html",
    title: "Pricing – ButteryAI",
    ogTitle: "ButteryAI pricing",
    description:
      "Compare ButteryAI plans for individuals, teams and enterprises. Local-first inference is free and unlimited on every plan.",
  },
  {
    path: "/waiting-list",
    file: "waiting-list.html",
    title: "Request access – ButteryAI",
    ogTitle: "Request access to ButteryAI",
    description: "Request access to ButteryAI. Tell us a bit about you, your team and what you want to build.",
  },
  {
    path: "/about",
    file: "about.html",
    title: "About – ButteryAI",
    ogTitle: "About ButteryAI",
    description:
      "ButteryAI is the operating system for AI specialists. Build, deploy and share your own AI specialists on almost any model.",
  },
  {
    path: "/evaluation-metrics",
    file: "evaluation-metrics.html",
    title: "Evaluation metrics – ButteryAI",
    ogTitle: "Understanding evaluation metrics in ButteryAI",
    description:
      "How ButteryAI scores every response for value, trust and accuracy, and why the scores are calibrated the way they are.",
  },
];

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const replaceOnce = (html, pattern, replacement) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: ${pattern} not found in dist/index.html`);
  }
  return html.replace(pattern, () => replacement);
};

const setMeta = (html, attr, key, value) =>
  replaceOnce(
    html,
    new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/>`),
    `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`,
  );

await build({
  logLevel: "warn",
  build: {
    ssr: "src/prerender.tsx",
    outDir: SSR_DIR,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "prerender.js" } },
  },
});

try {
  const { render } = await import(pathToFileURL(resolve(SSR_DIR, "prerender.js")).href);
  const shell = await readFile("dist/index.html", "utf8");

  for (const page of PAGES) {
    let html = replaceOnce(shell, /<div id="root"><\/div>/, `<div id="root">${render(page.path)}</div>`);
    html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
    html = setMeta(html, "name", "description", page.description);
    html = setMeta(html, "property", "og:title", page.ogTitle);
    html = setMeta(html, "property", "og:description", page.description);
    html = setMeta(html, "property", "og:url", `${SITE}${page.path}`);
    await writeFile(`dist/${page.file}`, html);
    console.log(`prerender: wrote dist/${page.file}`);
  }
} finally {
  await rm(SSR_DIR, { recursive: true, force: true });
}
