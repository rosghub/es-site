# Working on the EstimateSync website

This file is for editors working in the `rosghub/es-site` repository. If you
are working in the `estimate-sync` monorepo, where this folder is
`apps/web/content/`, ignore this file and follow the monorepo's `AGENTS.md`.

Read this whole file before you change anything.

This repository is the public docs and marketing site at estimatesync.com,
built with VitePress. You may edit pages, add images, create new pages at new
routes, and build new components and page types. Keep using the existing
stack: Markdown pages with frontmatter, Vue components for anything a page
can't do in Markdown, and CSS files scoped to a page type. Don't add raw HTML
pages, React, or another framework.

## Working with the user

The person asking for changes runs this repository in a GitHub codespace and
isn't a developer. They don't read code or run commands, so you do all of it.

- Explain what you did in plain language: which page changed and what a
  reader now sees there. Don't paste code or command output unless they ask.
- Don't ask them to run commands, edit files, or use git. If you need
  something only they can give, such as an image or a choice between two
  wordings, ask for it in plain words.
- When a request is unclear, ask one short question before you start.
- After every change to the site, make sure the preview is running and give
  the user a link to each page you changed. See "Showing the user a preview"
  below.

Each request gets its own branch and pull request:

1. Start from an up-to-date `main`: run `git switch main`, then `git pull`.
   If there are uncommitted changes, ask the user whether they belong to an
   earlier request before you touch them.
2. Create a branch named for the request, such as
   `git switch -c ui/estimating-apps-page`.
3. Make the change, then follow "Before you open the pull request" below.
4. Push the branch and open the pull request with `gh pr create`. Give the
   user its link and one sentence on what it changes.
5. Follow-up changes to the same request go on the same branch. Commit and
   push them, and the pull request updates itself.

Never merge a pull request, push to `main`, or force-push. The site owner
reviews every pull request. Merging doesn't put a change on the live site.
The owner publishes merged changes later. Tell the user this the first time
you give them a pull request link.

## Showing the user a preview

Do this after every change to the site, before you report back:

1. Check whether the dev server is running:
   `curl -s -o /dev/null http://localhost:5173`. If the check fails, start
   the server in the background with
   `nohup npm run dev -- --port 5173 --strictPort > /tmp/site-preview.log 2>&1 &`,
   then repeat the check until it succeeds. If it still fails after about 30
   seconds, read `/tmp/site-preview.log` and fix the problem.
2. Build the link. In a codespace, run
   `echo "https://$CODESPACE_NAME-5173.$GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN"`
   and add the page's route, such as `/docs/guide/glossary`. Outside a
   codespace, the link starts with `http://localhost:5173`.
3. Give the user one link per changed or new page. Tell them the preview
   updates by itself, so they can keep the tab open while you make more
   changes.

## How the site is put together

- **Pages** are Markdown files. A page's file path is its route:
  `pricing.md` is `estimatesync.com/pricing`, and
  `paint-estimate-app/teams.md` is `estimatesync.com/paint-estimate-app/teams`.
- **`.vitepress/config.ts`** holds the site settings: the top navigation
  (`nav`), the sidebars (`sidebar`), and the head tags every page gets.
- **`.vitepress/theme/`** holds the Vue components and the CSS.
  `theme/index.ts` registers each component and imports each CSS file.
  `theme/Layout.vue` wraps every page.
- **`public/`** holds images, served from the site root.
- **`scripts/`** holds the page checks (`npm run check`) and the image script.

The current page types:

- **Product pages** use `layout: page` and `pageClass: product-page`. The
  body is only `<ProductShowcase />`, which renders the `product:`
  frontmatter. `theme/product-showcase.css` styles them. Example:
  `paint-estimate-app/teams.md`.
- **Articles** use `layout: doc` and `pageClass: article-page`, with
  `<ArticleByline />`, `<ArticleBanner>`, `<ArticleScreenshot>`,
  `<ArticleQuote>`, and `<ArticleCta />` in the body. `theme/article.css`
  styles them. Example: `paint-estimate-app/how-to-price-a-painting-job.md`.
- **Guides and reference pages** use the default doc layout with a sidebar.
  Examples: `docs/guide/` and `docs/reference/`.

## Routes you can't use

The EstimateSync web app serves some routes from the same domain. In
production, a site page replaces the app at the same route, so a page there
would break the app. These are off limits:

- `/` and `/paint-estimate-app` themselves. Pages below
  `/paint-estimate-app/` are fine.
- `/404`.
- Anything at or below `/landing`, `/work`, `/invoice`, `/estimate`,
  `/invite`, `/login`, `/console`, `/privacy`, `/delete-account`, `/assets`,
  or `/.well-known`. For example, `/invoice/how-to` is off limits, but
  `/invoicing-guide` is fine.

The matching ignores capital letters. `RESERVED_ROUTES` in
`scripts/page-rules.mjs` is the full list, and `npm run check` enforces it.
Never edit that list to make a route available. If a request needs one of
these routes, say so in the pull request.

Routes use lowercase letters, numbers, and single hyphens, with `/` between
levels, such as `/pricing` or `/compare/estimating-apps`. Never name a page
`index.md`.

## Creating a page

1. **Pick the route.** Any route outside the list above works. Group related
   pages under a shared first level, such as `/compare/...`. Check that no
   page already uses the route.
2. **Create the file at the matching path.** `/compare/estimating-apps`
   goes in `compare/estimating-apps.md`.
3. **Write the frontmatter.** `title` and `intended URL` are required, and
   `intended URL` must equal the route. Copy the layout fields from an
   existing page of the same type. For a guide-style page:

   ```yaml
   ---
   title: "Estimating Apps Compared"
   description: "One or two sentences for search results and link previews."
   "intended URL": "/compare/estimating-apps"
   ---
   ```

   Articles also set `author`, `date: "YYYY-MM-DD"`, `ogImage`, and the
   layout fields from the example article. Product pages also set
   `layout: page`, `sidebar: false`, `aside: false`,
   `pageClass: product-page`, and a `product:` block. New pages don't need
   `source packet`, `audience`, `review status`, `publish status`, or
   `source file`.
4. **Write the body.** Start guides, reference pages, and articles with a
   `# Heading` that matches `title`.
5. **Make it reachable.** Add a link to it from the `nav` or `sidebar` in
   `.vitepress/config.ts`, from a related page, or both. A sidebar is keyed by
   the route's first level, such as `"/compare/"`, and a new first level needs
   a new key there. Every internal link must point to a page that exists, or
   the build fails.

Don't rename, move, or delete existing pages unless the request asks for it.
Their routes are live, and search engines and other sites link to them. If a
request asks for it, update every link and nav entry that points to the old
route, and say in the pull request that the old route needs a redirect. A
developer adds redirects in the monorepo.

## Building components and page types

Creating new components and page types is expected when the existing ones
don't fit a request. Build on what's there:

- **A new block on a page**, like a pricing table or comparison grid: create
  `theme/PricingTable.vue`, register it in `theme/index.ts` with
  `app.component("PricingTable", PricingTable)`, and use it in Markdown as
  `<PricingTable />`. `theme/ArticleCta.vue` is a short example to copy.
  Pass content in through props so the text stays in the Markdown page.
- **A new page type**, like a comparison page: pick a new `pageClass` value,
  such as `compare-page`, and create `theme/compare-page.css`. Start every
  selector with `.compare-page` so it can't restyle other pages, and import
  the file in `theme/index.ts`. Use the layout fields and components the new
  pages need.
- **Changes to every page**, like the header, footer, or navigation, go in
  `theme/Layout.vue` or `.vitepress/config.ts`. Call these out in the pull
  request description.

Rules for code changes:

- Before you change an existing component or CSS file, search for every page
  that uses it. If only some pages should change, add a prop, a variant, or a
  new component.
- Use VitePress's CSS variables, such as `var(--vp-c-text-1)` and
  `var(--vp-c-brand-1)`, rather than fixed colors.
- Make every page work at phone and desktop widths.
- Never import anything from outside this repository.
- Don't add npm packages. If a request needs one, say so in the pull request.
- Never change these, which keep previews and the live site working:
  `.vitepress/google-tag-manager.ts`,
  `theme/docsSupportAssistantStub.ts`,
  `theme/DocsSupportAssistantIsland.vue`, and the `isStandalone`,
  `outDir`, `envDir`, `srcExclude`, `robots`, `transformHtml`, and
  `transformHead` parts of `.vitepress/config.ts`.

## Editing existing pages

- Change only what the request names. Leave other paragraphs, headings, and
  pages as they are, even if you would word them differently.
- Never rewrite a page from scratch or reorder its sections unless the
  request asks for it. An edit should produce a small diff.
- Keep the existing Markdown structure: heading levels, lists, and blank
  lines between blocks.
- On product pages, the visible text is in the `product:` frontmatter. For
  long paragraphs, keep the `>-` style that the page already uses.
- When you edit an article, set `updated: "YYYY-MM-DD"` in its frontmatter
  to today's date.
- Leave these fields as they are on existing pages: `intended URL`,
  `source packet`, `audience`, `review status`, `publish status`,
  `source file`, `generated by`, `author`, and `date`.
- Some pages say `"generated by": "scripts/public-docs-pipeline.js"`. That
  script isn't in this repository. Ignore the note and edit the page
  directly.

## Adding images

Every image needs resized copies, because the pages ask the browser to pick a
width. `scripts/generate-screenshot-srcset.sh` makes them. It writes
`<name>.png` and copies named `<name>_288w.png`, `<name>_576w.png`,
`<name>_864w.png`, and `<name>_1152w.png`.

1. Get the source image as a file. If the user attached it in chat and you
   can't find it on disk, create an `incoming/` folder at the top of the
   repository. Ask the user to drag the image from their computer onto that
   folder in VS Code's file explorer.
2. Pick a new name of lowercase letters, numbers, `-`, and `_`, such as
   `estimate-review`. Never reuse a name that already exists in `public/`.
3. Run the script. It needs ImageMagick, which the codespace installs. If
   `magick` and `convert` are both missing, install it first with
   `sudo apt-get update && sudo apt-get install -y imagemagick`.
   - Phone screenshots:
     `bash scripts/generate-screenshot-srcset.sh <file> public/screenshots <name>`
   - Wide banners:
     `bash scripts/generate-screenshot-srcset.sh <file> public/banners <name>`
4. Commit `<name>.png` and every width copy the script wrote. Delete the
   source file and `incoming/` so they aren't committed.
5. Point the page at `/screenshots/<name>.png` or `/banners/<name>.png`,
   never at a width copy. The page adds the copies itself.
6. Write alt text that describes what the image shows: `imageAlt` in product
   page frontmatter, or `alt` on a component.

Where each kind of image goes:

- **Phone screenshots** go in `public/screenshots/` and must be at least
  1152 pixels wide. The existing ones are 1440 pixels wide. The pages always
  ask for all four width copies, and the script skips any width larger than
  the source, so a narrower image shows up broken. If the source is too
  narrow, stop and say so in the pull request.
- On product pages, a phone screenshot can be the `image` of `hero` or of an
  entry under `sections`.
- In articles, a phone screenshot goes in
  `<ArticleScreenshot src="/screenshots/<name>.png" alt="..." />`.
- **Article banners** go in `public/banners/` and use
  `<ArticleBanner src="/banners/<name>.png" alt="..." :width="W" :height="H" />`,
  where `W` and `H` are the source image's size in pixels. Get them with
  `magick identify -format "%w %h" <file>`.
- Wide images such as laptop or browser screenshots don't fit product page
  sections, which expect phone screenshots. Use a banner, or build a
  component that fits them.

Never edit, replace, or delete an existing image in `public/`. Other pages and
the app may use it.

## Words the live site rejects

The live site's build rejects a page whose body contains any of these, in any
capitalization:

- backend, callable, handler, repository, Firestore, function, source code,
  inspected source
- PaintScout
- Evidence:, author-facing, do not publish
- `.dart`, `.tsx`, `test.cjs`, `flatCost`

`npm run check` finds them. "Function" is the one most likely to slip in.
Write "purpose" or "role" instead.

## Files you never change

- `package.json`, `package-lock.json`, and `.gitignore`.
- `.public-docs-manifest.json`. The live site's build regenerates it.
- Anything in `scripts/`.
- `.devcontainer/` and `.claude/`, which set up the codespace and your
  permissions.
- This file.

## Before you open the pull request

1. Run `npm ci` if `node_modules` is missing, then `npm run check` and
   `npm run build`. Fix every problem they report. The build fails on links to
   pages that don't exist.
2. Never push to `main`. Work on a branch and open a pull request, as
   "Working with the user" describes.
3. Start the commit message with `ui:`, for example
   `ui: add the estimating apps comparison page`.
4. In the pull request description, list each page you changed or created
   with its route, and each component or CSS file you added or changed, with
   one sentence each on what changed. Call out any change to `Layout.vue`,
   `config.ts`, or a component other pages use.
5. Ask the user to open each changed or new page in the site preview, once in
   a full-width window and once in a narrow one, and to confirm it looks
   right. If the pull request shows a Cloudflare Pages preview link, give
   them that link too.
