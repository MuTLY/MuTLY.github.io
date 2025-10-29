<!-- Short, focused guidance for AI coding agents working on this repo -->

# Copilot / AI agent instructions — MuTLY.github.io

This is a small, static personal website (single-page) built with plain HTML, hand-written JavaScript, and Sass (SCSS). The guidance below highlights project structure, conventions, and actionable patterns discovered in the repository so an AI agent can be immediately productive.

Quick facts

- Static site: single `index.html` that loads `css/default.css` and `default.js`.
- Source SCSS lives in `scss/` and is compiled to `css/` (see `package.json` script).
- Build step: `npm run build` runs `sass --watch scss:css` (dev watch). There is no JS bundler or server.

How to modify styles

- Edit `scss/default.scss` (source). The file uses variables (e.g. `$white`, `$orange`) and nested rules. Keep consistent naming and simple nesting.
- To compile locally use the repository's npm script: `npm install` then `npm run build`. For quick one-off compilation: `npx sass scss:css`.

How to modify behavior (JS)

- Main script: `default.js`. It's plain, browser-side ES5/ES6 compatible code. Changes should preserve the top-level functions and the console-based UX (console.image, showInfo).
- Prefer small, well-scoped edits. Examples of patterns to follow:
  - DOM selection uses `document.querySelector` and `querySelectorAll` (see `externalLinks()` in `default.js`).
  - Feature-detection style checks (user-agent and matchMedia) are used to toggle classes and UI (`body.unsupported`).

Conventions and patterns

- No build/test pipeline beyond Sass. Do not add heavy toolchains without explicit request.
- Keep vanilla JS (no new frameworks). If adding small utilities, keep them dependency-free and compatible with plain script inclusion in `index.html`.
- Accessibility/security: external links use `rel="noopener noreferrer"` and `target="_blank"` (see `externalLinks()`); preserve this pattern when creating new external anchors.

Integration points and assets

- Images and icons live under `images/` and are referenced directly in HTML and JS (console.image uses a remote URL `https://mutly.github.io/images/...`). When changing images update both `images/` files and references in `index.html` and `default.js`.
- There is no server-side code. All integration is client-side and static (links, mailto, social URLs).

Developer workflows and useful commands

- Install dependencies: `npm ci` or `npm install` (project only depends on `sass`).
- Dev Sass watch: `npm run build` (runs `sass --watch scss:css`). This runs in watch mode — stop with Ctrl+C.
- One-off compile: `npx sass scss:css` or `npx sass scss/default.scss css/default.css`.

Edge cases and constraints

- Keep CSS units consistent with existing patterns (vw-based font sizing and percentage layout). Avoid globally changing the layout model.
- JS targets browsers — avoid using Node-only APIs or build-step-only language features unless you add a bundler/transpiler and update `index.html` accordingly.

Files to reference when making edits

- `index.html` — single page template, meta tags, asset links.
- `default.js` — main JS behavior, console image/display logic, UA detection.
- `scss/default.scss` — source styles, variables, responsive rules.
- `package.json` — clarifies the build command and dependency on `sass`.

When in doubt

- Make minimal, incremental changes with clear commit messages. If a change affects visuals, include before/after screenshots in the PR description.
- Ask the repo owner if you plan to introduce a new tool (bundler, test runner) — this repo intentionally stays light-weight.

If you update these instructions, preserve the short Quick facts and Developer workflows sections.
