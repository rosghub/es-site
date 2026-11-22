// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("VitePress config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("adds the Google tag to production pages and leaves staging pages alone", async () => {
    const page = "<html><head></head></html>";

    vi.resetModules();
    const production = (await import("./config")).default;
    expect(await production.transformHtml?.(page, "", {} as never)).toContain("GTM-K7VZDH83");

    vi.stubEnv("PQP_DOCS_ENV", "staging");
    vi.resetModules();
    const staging = (await import("./config")).default;
    expect(await staging.transformHtml?.(page, "", {} as never)).toBe(page);
  });

  it("leaves pages alone in the docs build that npm run dev serves", async () => {
    const page = "<html><head></head></html>";
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"),
    );

    expect(packageJson.scripts.dev).toContain("PQP_DOCS_SKIP_GOOGLE_TAG=1 npm run docs:build");

    vi.stubEnv("PQP_DOCS_SKIP_GOOGLE_TAG", "1");
    vi.resetModules();
    const dev = (await import("./config")).default;
    expect(await dev.transformHtml?.(page, "", {} as never)).toBe(page);
  });

  it("hands off the Get started nav link to the React app with a full document navigation", () => {
    const configSource = fs.readFileSync(path.join(__dirname, "config.ts"), "utf8");

    expect(configSource).toContain(
      '{ text: "Get started", link: "/paint-estimate-app", target: "_self" }',
    );
  });

  it("points the top-left brand link to the React landing page", () => {
    const configSource = fs.readFileSync(path.join(__dirname, "config.ts"), "utf8");

    expect(configSource).toContain('const appLandingPath = "/paint-estimate-app";');
    expect(configSource).toContain('process.env.PQP_APP_ORIGIN ?? "http://127.0.0.1:5173"');
    expect(configSource).toContain("link: appLandingHref");
    expect(configSource).toContain('target: "_self"');
  });

  it("loads Vite env variables from the React app root for docs assistant Firebase config", () => {
    const configSource = fs.readFileSync(path.join(__dirname, "config.ts"), "utf8");

    expect(configSource).toContain('const projectRoot = path.resolve(__dirname, "../..");');
    expect(configSource).toContain("envDir: isStandalone ? undefined : projectRoot");
  });

  it("builds the monorepo site into dist-docs with the real support assistant", async () => {
    vi.resetModules();
    const config = (await import("./config")).default;

    expect(config.outDir).toBe("../dist-docs");
    expect(config.head).toContainEqual(["meta", { name: "robots", content: "index,follow" }]);
    expect(config.vite?.resolve?.alias).toEqual({
      "@docs-support-assistant": path.resolve(
        __dirname,
        "../../src/components/support/DocsSupportAssistantRoot.tsx",
      ),
    });
  });

  it("builds an unindexed preview without the tag or assistant when the app is absent", async () => {
    const existsSync = fs.existsSync;
    const assistantPath = path.resolve(
      __dirname,
      "../../src/components/support/DocsSupportAssistantRoot.tsx",
    );
    vi.spyOn(fs, "existsSync").mockImplementation((file) =>
      file === assistantPath ? false : existsSync(file),
    );
    const page = "<html><head></head></html>";

    vi.resetModules();
    const preview = (await import("./config")).default;

    expect(preview.outDir).toBe(".vitepress/dist");
    expect(preview.head).toContainEqual(["meta", { name: "robots", content: "noindex,nofollow" }]);
    expect(preview.vite?.resolve?.alias).toEqual({
      "@docs-support-assistant": path.join(__dirname, "theme/docsSupportAssistantStub.ts"),
    });
    expect(await preview.transformHtml?.(page, "", {} as never)).toBe(page);
  });

  it("lists the integrations walkthrough in the Guides sidebar", () => {
    const configSource = fs.readFileSync(path.join(__dirname, "config.ts"), "utf8");

    expect(configSource).toContain(
      '{ text: "Integrations", link: "/docs/guide/integrations" }',
    );
  });
});
