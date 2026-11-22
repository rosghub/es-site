// Rules every page in this folder follows. The es-site repo checks them with
// `npm run check`, and the estimate-sync monorepo's docs pipeline imports them,
// so a page that passes here also passes the monorepo build.
import * as yaml from "js-yaml";

export const REQUIRED_FRONTMATTER_FIELDS = ["title", "intended URL"];

// Routes the EstimateSync web app serves. In production a built page wins over
// the app, so a page at one of these routes would replace the app's page. A
// "prefix" entry also covers every route below it.
export const RESERVED_ROUTES = [
  { path: "/", match: "exact", owner: "the web app's entry page" },
  { path: "/paint-estimate-app", match: "exact", owner: "the landing page" },
  { path: "/landing", match: "prefix", owner: "the landing page redirect" },
  { path: "/work", match: "prefix", owner: "work orders" },
  { path: "/invoice", match: "prefix", owner: "invoices" },
  { path: "/estimate", match: "prefix", owner: "estimates" },
  { path: "/invite", match: "prefix", owner: "team invites" },
  { path: "/login", match: "prefix", owner: "sign-in" },
  { path: "/console", match: "prefix", owner: "the account console" },
  { path: "/privacy", match: "prefix", owner: "the privacy policy" },
  { path: "/delete-account", match: "prefix", owner: "account deletion" },
  { path: "/assets", match: "prefix", owner: "built scripts and styles" },
  { path: "/.well-known", match: "prefix", owner: "app link files" },
  { path: "/404", match: "exact", owner: "the not-found page" },
];

function normalizeRoute(route) {
  return (route.replace(/\/+$/, "") || "/").toLowerCase();
}

// Returns the reserved route that covers `route`, or undefined. Matching
// ignores case because the app's router does.
export function findReservedRoute(route) {
  const normalized = normalizeRoute(route);
  return RESERVED_ROUTES.find(({ path, match }) =>
    match === "exact"
      ? normalized === path
      : normalized === path || normalized.startsWith(`${path}/`),
  );
}

// Maps a page route to its Markdown file, relative to this folder.
// "/pricing" is "pricing.md" and "/compare/acme" is "compare/acme.md".
export function routeToContentPath(route) {
  if (typeof route !== "string" || !route.startsWith("/")) {
    throw new Error(`intended URL must start with "/": ${route}`);
  }

  const reserved = findReservedRoute(route);
  if (reserved) {
    throw new Error(`intended URL ${route} is reserved for ${reserved.owner} (${reserved.path})`);
  }

  const normalized = route.replace(/\/+$/, "");
  if (!/^(\/[a-z0-9]+(-[a-z0-9]+)*)+$/.test(normalized)) {
    throw new Error(
      `intended URL ${route} must use lowercase letters, numbers and single hyphens between slashes`,
    );
  }
  if (normalized.endsWith("/index")) {
    throw new Error(`intended URL ${route} must not end in /index`);
  }

  return `${normalized.slice(1)}.md`;
}

export const BANNED_BODY_PATTERNS = [
  { label: "evidence tag", pattern: /\bEvidence:/i },
  { label: "generated draft label", pattern: /\bGenerated Docs Draft\b/i },
  { label: "packet metadata heading", pattern: /\bPacket Metadata\b/i },
  { label: "source inputs heading", pattern: /\bSource Inputs\b/i },
  { label: "excluded assumptions heading", pattern: /\bExcluded Assumptions\b/i },
  { label: "capability map heading", pattern: /\bCapability Map\b/i },
  { label: "docs outline candidate heading", pattern: /\bDocs Outline Candidates\b/i },
  { label: "industry alignment note", pattern: /\bIndustry Alignment Notes\b/i },
  { label: "packet validation heading", pattern: /\bPacket Validation\b/i },
  { label: "review notes heading", pattern: /\bReview Notes\b/i },
  { label: "inspected-source wording", pattern: /\binspected source\b/i },
  { label: "source-code wording", pattern: /\bsource code\b/i },
  { label: "backend implementation wording", pattern: /\bbackend\b/i },
  { label: "callable implementation wording", pattern: /\bcallable\b/i },
  { label: "handler implementation wording", pattern: /\bhandler\b/i },
  { label: "repository implementation wording", pattern: /\brepository\b/i },
  { label: "Firestore implementation wording", pattern: /\bFirestore\b/i },
  { label: "function implementation wording", pattern: /\bfunction\b/i },
  { label: "test file reference", pattern: /\btest\.cjs\b/i },
  { label: "Dart source reference", pattern: /\.dart\b/i },
  { label: "TSX source reference", pattern: /\.tsx\b/i },
  { label: "implementation field name", pattern: /\bflatCost\b/ },
  { label: "PaintScout-only claim", pattern: /\bPaintScout\b/i },
  { label: "author-facing instruction", pattern: /\bauthor-facing\b/i },
  { label: "editorial draft instruction", pattern: /\bdo not publish\b/i },
];

export function parseMarkdownDocument(markdown, sourcePath = "document.md") {
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return {
      sourcePath,
      frontmatter: {},
      body: markdown,
      rawFrontmatter: "",
      errors: ["missing frontmatter"],
    };
  }

  const rawFrontmatter = frontmatterMatch[1];
  let frontmatter = {};
  const errors = [];

  try {
    const parsedFrontmatter = yaml.load(rawFrontmatter) ?? {};

    if (
      typeof parsedFrontmatter !== "object" ||
      Array.isArray(parsedFrontmatter)
    ) {
      errors.push("frontmatter must be a YAML mapping");
    } else {
      frontmatter = parsedFrontmatter;
    }
  } catch (error) {
    errors.push(`unparseable frontmatter: ${error.message}`);
  }

  return {
    sourcePath,
    frontmatter,
    body: markdown.slice(frontmatterMatch[0].length),
    rawFrontmatter,
    errors,
  };
}

function bodyLineNumber(body, matchIndex) {
  return body.slice(0, matchIndex).split(/\r?\n/).length;
}

export function lintMarkdown(markdown, sourcePath = "document.md") {
  const parsed = parseMarkdownDocument(markdown, sourcePath);
  const violations = parsed.errors.map((message) => ({
    sourcePath,
    line: 1,
    label: "frontmatter",
    message,
  }));

  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!parsed.frontmatter[field]) {
      violations.push({
        sourcePath,
        line: 1,
        label: "frontmatter",
        message: `missing required field: ${field}`,
      });
    }
  }

  for (const { label, pattern } of BANNED_BODY_PATTERNS) {
    const match = parsed.body.match(pattern);
    if (match && typeof match.index === "number") {
      violations.push({
        sourcePath,
        line: bodyLineNumber(parsed.body, match.index),
        label,
        message: `banned public-docs language matched ${pattern}`,
      });
    }
  }

  return violations;
}

// Lints one page: frontmatter, banned words, and a route that is free and
// matches the file's path. `relativePath` is relative to this folder.
export function lintPage(markdown, relativePath) {
  const violations = lintMarkdown(markdown, relativePath);
  const route = parseMarkdownDocument(markdown, relativePath).frontmatter["intended URL"];
  if (typeof route !== "string") {
    return violations;
  }

  try {
    const expectedPath = routeToContentPath(route);
    if (expectedPath !== relativePath.replaceAll("\\", "/")) {
      violations.push({
        sourcePath: relativePath,
        line: 1,
        label: "route",
        message: `intended URL ${route} belongs in ${expectedPath}`,
      });
    }
  } catch (error) {
    violations.push({ sourcePath: relativePath, line: 1, label: "route", message: error.message });
  }

  return violations;
}
