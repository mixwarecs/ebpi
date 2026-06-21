# CANON Bible App — Handoff Package

## What's in this folder

| File | What it is |
|---|---|
| `canon-bible-shelf.jsx` | The working prototype: open-book UI, OT/NT tab rails (column-major, height-balanced), 10 classification "tour" pages, persistent contextual header, embedded full Génesis interactive viewer. This is your Phase 2-3 starting point. |
| `genesis-reference-app.jsx` | The standalone Génesis viewer (timeline, character popups, theology tabs) embedded inside the shelf. Same component, full source. |
| `CANON-Pipeline-Instructions-v1_1.md` | The content-generation spec. Tells Claude (or Claude Code) how to produce a full structured JSON record — authorship, theology, characters, chapter summaries, sources — for any of the 66 books, in the Reformed/Covenant framework, trilingual (ES/EN/PT). |
| `canon-bible-viewer-SKILL.md` | The rendering spec: how a CANON JSON record becomes the interactive viewer (design tokens, component structure, data mapping). |
| `design-tokens.md` | Locked color/typography/spacing values (lapis/gold/parchment palette) — keep these consistent across every book. |
| `component-map.md` | Component breakdown and state map for the viewer. |

## What's NOT in this folder yet

**A standalone `genesis.json`.** The Génesis data currently lives *inside* `genesis-reference-app.jsx` as presentation-shaped JS constants (`CHARACTERS`, `THEOLOGY_TAGS`, `CHAPTERS_INFO`, etc.) rather than as one clean object matching the CANON schema's 75 fields. Mapping it back into a faithful, complete `genesis.json` is real work — it deserves a careful pass with full file access rather than a guess. This is a good first task to hand Claude Code.

## Architecture decisions already made (bring these into Claude Code, don't re-litigate)

- **No backend.** Bundled JSON files, one per book, shipped inside a Capacitor app. Updating content = new app build, not live sync.
- **Trilingual-inside-the-file**, not separate files per language: `/data/genesis.json` contains `{titulo: {es, en, pt}, ...}` for every field, matching the pipeline's native output shape. Language switching = app-level state picking which key to render, not a refetch.
- **Two users** (you and your wife) — no auth, no review workflow, no multi-tenant concerns.
- **Phased plan:**
  1. Data contract & loader — extract Génesis into `genesis.json`, write the loader, wire the prototype to read from it instead of the hardcoded object.
  2. Language switcher — thread ES/EN/PT state through every hardcoded `.es` reference in the prototype.
  3. Capacitor wrap — bundle `/data` as static assets, get an installable build running.
  4. Content buildout — run the pipeline on the remaining 65 books.
  5. Phone layout — the two-page open-book spread needs a single-page variant for phone screens.

## Suggested first prompt to Claude Code

> I'm building a trilingual (ES/EN/PT) Bible study app — Capacitor-wrapped, for two users, no backend, bundled JSON data per book. I have a working React prototype (`canon-bible-shelf.jsx`), a content-generation spec (`CANON-Pipeline-Instructions-v1_1.md`), and a viewer-rendering spec (`canon-bible-viewer-SKILL.md` + `design-tokens.md` + `component-map.md`). The Génesis data currently lives inline inside `genesis-reference-app.jsx` as JS constants, not as a clean JSON file.
>
> Let's start Phase 1: extract the Génesis data into `/data/genesis.json` matching the CANON schema's 75 fields exactly (cross-reference the pipeline spec for field names), then wire `canon-bible-shelf.jsx` to load Génesis from that file instead of its current hardcoded object.

This gives Claude Code the architecture decisions up front and a concrete, scoped first task.
