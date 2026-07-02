---
name: canon-bible-viewer
description: Integrates a completed CANON Pipeline JSON record into the live viewer app (CanonShelf.jsx). Covers every file that must be touched — book JSON placement, books-manifest.json, personas-display.json, and ERA_COLORS — so the book appears in the shelf, loads on click, and renders correctly in the timeline with proper era bands and character nodes.
---

# CANON Bible Viewer — App Integration

After generating a CANON JSON with the `canon-pipeline` skill, this skill wires it into the live app so it appears in the shelf and renders in the viewer.

## When to use

- A CANON JSON has been generated (and validated) and needs to display in the app
- A book shows "aún no generado" in the division tour but the JSON exists
- Character nodes are missing, showing fallback colors, or positioned at wrong chapters
- Era bands on the timeline are wrong for a newly added book

---

## Architecture Overview

```
canon/public/data/
  books-manifest.json        ← registry: all 66 books, disponible flag, dataFile pointer
  [book].json                ← generated CANON JSON for each ready book
  personas-display.json      ← character display config: color, Hebrew initials, xCh, side, badge
  canon-global.json          ← global redemptive-history epoch data (used in Canon tab)

canon/src/
  CanonShelf.jsx             ← root app: navigation state, data fetching, renders BookViewer
  constants.js               ← UI strings, color tokens, TABS, DIVISIONS (read-only reference)
  adapters/canonToViewer.js  ← pure adapter functions: JSON → component shapes
                                also owns ERA_COLORS (era name → hex color)
  components/
    BookViewer.jsx           ← book content display: calls all adapt* functions, renders tabs
    book/
      Timeline.jsx           ← drag-scrollable chapter/character timeline
      TheologyTab.jsx        ← systematic theology + WCF anchors tab
      SourcesTab.jsx         ← scholarly sources grid + detail modal
```

Data flow on book open:
1. `books-manifest.json` → `adaptManifestBook()` → shelf rail entries
2. Click / VER → → `openBook()` → `fetch(/data/[dataFile])` → `bookDataCache[id]`
3. `bookDataCache[id]` + `personasDisplay` → `BookViewer` → all adapt* calls
4. `adaptCapitulos(resumenCapitulos)` uses `eraColor(era)` → chapter dot colors + era bands

---

## Integration Steps

### Step 1 — Place the book JSON

Copy the validated file to:
```
canon/public/data/[book-lowercase].json
```
Examples: `genesis.json`, `exodus.json`, `leviticus.json`

Naming convention: lowercase English book name, no spaces, `.json`.

---

### Step 2 — Update `books-manifest.json`

File: `canon/public/data/books-manifest.json`

Find the book entry by `id` (= `ordenCanon` in the CANON JSON). Set two fields:

```json
{
  "id": 3,
  "disponible": true,
  "dataFile": "leviticus.json",
  ...rest unchanged...
}
```

**`disponible: false`** → book shows as locked in the rail and division tour (VER → disabled).  
**`disponible: true` + `dataFile`** → book is live; clicking loads `[dataFile]` via fetch.

Do not add or remove any other fields from the manifest entry — they are used for the shelf display and division grouping.

---

### Step 3 — Add characters to `personas-display.json`

File: `canon/public/data/personas-display.json`

This file is a flat name-keyed map. The key **must exactly match** `personajes[].nombre.es` in the CANON JSON.

For each character in the new book's `personajes[]`:

1. Check if the character is already in the file (e.g. "Dios · YHWH" is shared across all books — do not duplicate it).
2. For new characters, add an entry:

```json
"Nombre en español": {
  "id":    "shortlowercase",
  "color": "#XXXXXX",
  "init":  "XX",
  "xCh":   N,
  "side":  "above",
  "badge": {
    "es": "ETIQUETA EN ESPAÑOL",
    "en": "ENGLISH LABEL",
    "pt": "ETIQUETA EM PORTUGUÊS"
  }
}
```

| Field | Value |
|---|---|
| `id` | Short lowercase slug, no spaces (e.g. `"moises"`, `"aaron"`) |
| `color` | Hex color for the character's node, name, and popup accent |
| `init` | 2-character Hebrew (OT) or Greek (NT) initials shown inside the avatar circle |
| `xCh` | Chapter number where the character node is anchored on the timeline — pick the chapter where they first appear prominently |
| `side` | `"above"` or `"below"` the spine — alternate to avoid collisions with adjacent characters |
| `badge` | Short role label in all 3 languages, ALL CAPS, 2–4 words |

**Color selection** — pick a color that does not clash with adjacent characters. Current palette in use:
- Gold `#C9A84C` — reserved for Dios · YHWH
- Olive `#4A6741` — Adán, Moisés
- Deep blue `#1B5E8B` — Abraham, Miriam
- Sienna `#8B3A2A` — Faraón
- Purple `#6B4A8B` — Isaac, Aarón
- Amber `#8B6A1B` — Jacob
- Teal `#1B6B5E` — José

Avoid reusing the same color for characters that appear in the same book.

---

### Step 4 — Verify era fields are present and colored

**This is the most common integration mistake.** If the `era` field is missing or absent from any `resumenCapitulos` entry, the timeline silently falls back to hardcoded Genesis era bands ("CREACIÓN Y CAÍDA · Gn 1–11", "PACTO ABRAHÁNICO", etc.) — wrong labels, wrong colors, wrong for every non-Genesis book.

**Check first — run this before anything else:**
```bash
python3 -c "
import json
d = json.load(open('canon/public/data/YOURBOOK.json'))
eras = {c.get('era', 'MISSING') for c in d['resumenCapitulos']}
print('Eras found:', eras)
"
```
If the output contains `'MISSING'` or `''`, the era field must be added before the book will display correctly.

**Fix — patch all units to the correct era:**
```bash
python3 - <<'EOF'
import json
path = 'canon/public/data/YOURBOOK.json'
d = json.load(open(path))
for c in d['resumenCapitulos']:
    c['era'] = 'Ley'   # replace with correct era for this book
with open(path, 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
EOF
```

Once the era field is present and non-empty, the timeline derives bands dynamically from the data rather than falling back to Genesis. The era value must also match a key in `ERA_COLORS` (via `String.includes()`):

**Supported era values:**

| Era name (in JSON) | Color | Books |
|---|---|---|
| `"Primordial"` | `#6B7F5E` | Genesis 1–11 |
| `"Patriarcal"` | `#7A6B4F` | Genesis 12–50 |
| `"Ley"` | `#8B6914` | Exodus–Deuteronomy |
| `"Éxodo"` | `#8B6914` | Exodus (alias for Ley) |
| `"Conquista"` | `#5A7A5A` | Joshua–Judges |
| `"Monarquía"` | `#4A6B8A` | Samuel–Chronicles |
| `"Exilio"` | `#7A4A6B` | Ezekiel, Daniel |
| `"Post-exilio"` | `#5A7A6B` | Ezra, Nehemiah, Haggai, Zechariah, Malachi |
| `"Intertestamental"` | `#8A8A8A` | — |
| `"Ministerio"` | `#C9A84C` | Gospels |
| `"Iglesia"` | `#6B5B95` | Acts–Epistles |
| `"Consumación"` | `#8B0000` | Revelation |

If the book uses an era not in this table, add it to `ERA_COLORS` in `canonToViewer.js`.

---

### Step 5 — Verify in the browser

1. Open the app and navigate to the book's division
2. Confirm the book card shows the title (not "aún no generado")
3. Click VER → — confirm it loads the correct book (not Genesis or blank)
4. Check the timeline: chapters should span the correct total count, era bands should match the book's era
5. Click a character node — confirm the popup shows this book's character data, not a fallback

---

## Quick Reference — Files to Touch

| File | What to change |
|---|---|
| `canon/public/data/[book].json` | Place the generated + validated CANON JSON |
| `canon/public/data/books-manifest.json` | `disponible: true` + `dataFile: "[book].json"` |
| `canon/public/data/personas-display.json` | Add entries for new characters only |
| `canon/src/adapters/canonToViewer.js` | Add to `ERA_COLORS` only if the book uses a new era value |

`CanonShelf.jsx` and `canonToViewer.js` require **no changes** for a standard book integration — all behavior is driven by data.

---

## Chapter Summary Cross-References (`referenciasRelacionadas`)

Chapter summary cards automatically display an inline cross-reference trigger chip and popup whenever a `resumenCapitulos` entry contains a `referenciasRelacionadas` array (added in pipeline schema v1.4.0). No integration step is required — the feature activates automatically from the JSON data.

### How it works

`ChapterSummaries.jsx` reads `rawChapters` directly from `bookData.resumenCapitulos` (the raw JSON, not the adapted output). It renders:

1. **Trigger chip** — a purple `↔ N` badge that appears inline beside the `versiculoClave` chip. Clicking it opens the popup (`e.stopPropagation()` prevents row highlighting).
2. **Portal popup** — follows the same `GS.overlay + GS.popupCard + GS.closeBtn` pattern used by the character popup in `BookViewer.jsx`. Rendered via `createPortal` to `document.body`. Dismisses on X click or backdrop click.

Each cross-reference entry in the popup shows:
- A colored **tipo badge** (type label, colored per hermeneutical category)
- The **ref** as a `VerseLink` that opens BibleGateway in a new tab
- An optional **nota** text (italic, 1–2 sentences) when present in the JSON

### Tipo badge colors

| `tipo` value | Color | UI label (es / en / pt) |
|---|---|---|
| `cumplimiento` | `#1E4A7A` (blue) | CUMPLIMIENTO / FULFILLMENT / CUMPRIMENTO |
| `tipología` | `#8A6420` (amber) | TIPOLOGÍA / TYPOLOGY / TIPOLOGIA |
| `paralelo` | `#1E6858` (teal) | PARALELO / PARALLEL / PARALELO |
| `doctrinal` | `#4A2E8A` (purple) | DOCTRINAL / DOCTRINAL / DOUTRINAL |
| `cita` | `#8A1A1A` (dark red) | CITA / QUOTATION / CITAÇÃO |
| `alusión` | `#5A3E1A` (brown) | ALUSIÓN / ALLUSION / ALUSÃO |

### UI label source

`crossRefLabels` in `constants.js → UI[lang]` provides the popup section header and all tipo translations. This is the only place these strings live — do not hardcode tipo labels in the component.

### Data requirement

The trigger chip only appears when `c.referenciasRelacionadas?.length > 0`. If the array key is absent (most books for now — the field is optional), the chapter card renders as before with no chip. No adapter changes are needed.

---

## Chapter Summary Themes (`temasBiblicoteologicos`)

Chapter summary cards automatically display a themed trigger button and popup whenever a `resumenCapitulos` entry contains a `temasBiblicoteologicos` object (added in pipeline schema v1.5.0). No integration step is required — the feature activates automatically from the JSON data.

### How it works

`ChapterSummaries.jsx` reads `temasBiblicoteologicos` directly from the raw chapter unit. It renders:

1. **Trigger button** — a `✦ N Temas` button aligned to the **lower right** of the chapter card, above the audio player. The button's color (background, border, text) is derived from the `principal` theme's category using `CATEGORIA_COLORS`. Clicking opens the popup (`e.stopPropagation()` prevents row highlighting).
2. **Portal popup** — follows the same `GS.overlay + GS.popupCard + GS.closeBtn` pattern as the cross-reference popup. Rendered via `createPortal` to `document.body`. Dismisses on X click or backdrop click.

Each theme entry in the popup shows:
- A **category badge** — small, color-coded by the theme's category (e.g. green for CREACIÓN Y HUMANIDAD, blue for PACTO Y RELACIÓN)
- The **theme name** — bold for `principal`, normal weight for `secundarios`
- A **role label** — "TEMA PRINCIPAL" or "TEMA SECUNDARIO" (localized via `temasLabels`)
- An optional **nota** text — the reason this theme was identified in the unit (italic, 1 sentence in Spanish). Rendered when the nota value is non-empty.

### 11-category color system

The component owns two lookup constants — `TEMA_CATEGORIA` (maps each of the 53 theme strings to its category) and `CATEGORIA_COLORS` (maps each category to `{ bg, border, text }`):

| Category | Button/badge color |
|---|---|
| CREACIÓN Y HUMANIDAD | Green `#1E6E1E` |
| PACTO Y RELACIÓN | Blue `#1E4A7A` |
| REINO Y GOBIERNO | Violet `#5A2D8C` |
| REDENCIÓN Y SALVACIÓN | Red `#8A1A1A` |
| ADORACIÓN Y ESPACIO SAGRADO | Amber `#8A6A10` |
| PECADO Y JUICIO | Slate `#3C3C50` |
| PUEBLO DE DIOS | Teal `#14786E` |
| SABIDURÍA Y PALABRA | Orange `#B45A14` |
| ESPÍRITU Y TRANSFORMACIÓN | Sky `#1464A0` |
| ESCATOLOGÍA | Indigo `#323296` |
| TEMAS CENTRADOS EN CRISTO | Rose `#A02850` |

If a `principal` value is not found in `TEMA_CATEGORIA` (e.g. a typo in the JSON), the button falls back to a warm brown `#645028` — a visible signal that the value is out of vocabulary.

### UI label source

`temasLabels` in `constants.js → UI[lang]` provides all localized strings — the popup section title, trigger button text, and PRINCIPAL/SECUNDARIO role labels. This is the only place these strings live — do not hardcode them in the component.

| Key | ES | EN | PT |
|---|---|---|---|
| `title` | TEMAS BÍBLICO-TEOLÓGICOS | BIBLICAL-THEOLOGICAL THEMES | TEMAS BÍBLICO-TEOLÓGICOS |
| `trigger(n)` | ✦ N Tema/Temas | ✦ N Theme/Themes | ✦ N Tema/Temas |
| `principal` | TEMA PRINCIPAL | MAIN THEME | TEMA PRINCIPAL |
| `secundario` | TEMA SECUNDARIO | SECONDARY THEME | TEMA SECUNDÁRIO |

### Data shape

```json
"temasBiblicoteologicos": {
  "principal": {
    "Espíritu Santo": {
      "es": "El Espíritu Santo es prometido como Consolador permanente (Jn 14:16–17) que morará con los discípulos y les enseñará todo lo que Jesús les dijo (Jn 14:26).",
      "en": "The Holy Spirit is promised as the permanent Comforter (John 14:16–17) who will dwell with the disciples and teach them everything Jesus said (John 14:26).",
      "pt": "O Espírito Santo é prometido como Consolador permanente (Jo 14:16–17) que permanecerá com os discípulos e os ensinará tudo o que Jesus disse (Jo 14:26)."
    }
  },
  "secundarios": [
    {
      "Presencia de Dios": {
        "es": "Cristo promete no dejar a los suyos como huérfanos (Jn 14:18,23).",
        "en": "Christ promises not to leave his disciples as orphans (John 14:18,23).",
        "pt": "Cristo promete não deixar os seus como órfãos (Jo 14:18,23)."
      }
    }
  ]
}
```

Each theme is a single-key object: the key is the theme name (controlled vocabulary string), the value is a **trilingual `{es, en, pt}` nota** — 1–2 sentences citing specific verses from the chapter range. The component extracts the theme name with `Object.keys(obj)[0]`, then picks the nota for the current language with `nota[lang] || nota.es`.

### Data requirement

The button only appears when `c.temasBiblicoteologicos` is present and truthy. If the field is absent (existing books without it), the chapter card renders as before with no button. `principal` is the only required sub-field; `secundarios` defaults to `[]` if omitted.

All theme-name keys must be exact strings from the 53-value controlled vocabulary in `references/controlled-vocabularies.md → Temas Bíblico-Teológicos`. Out-of-vocabulary keys will render with the fallback brown color. An empty string nota is valid — the nota block is only shown when non-empty.

No adapter changes are needed — `canonToViewer.js` is not involved.

---

## Common Errors

| Symptom | Cause | Fix |
|---|---|---|
| Book shows "aún no generado" | `disponible: false` or missing `dataFile` in manifest | Step 2 |
| VER → opens Genesis instead of the book | `dataFile` missing in manifest (old DivisionTour path) | Step 2 |
| Character nodes show `?` initials / grey color | Character `nombre.es` not found in `personas-display.json` | Step 3 |
| Timeline shows Genesis era bands ("CREACIÓN Y CAÍDA", "PACTO ABRAHÁNICO") on a non-Genesis book | `resumenCapitulos[].era` field is missing from the JSON entirely — the system falls back to hardcoded Genesis bands | Step 4 (patch era field first) |
| All chapter dots grey | `era` field is present but value not found in `ERA_COLORS` | Step 4 (add to ERA_COLORS) |
| Timeline squashed into left 80% | `capitulosTotal` wrong in manifest OR book has wrong chapter count | Check manifest |
| Chapters link to wrong book on BibleGateway | `titulo.en` wrong in CANON JSON | Fix in JSON |
| Themes button shows brown/fallback color | `temasBiblicoteologicos.principal` value is not in the 53-value controlled vocabulary (typo or invented string) | Fix the JSON value to match exactly the string in `controlled-vocabularies.md → Temas Bíblico-Teológicos` |
| Themes button does not appear | `temasBiblicoteologicos` field is absent from the chapter unit — field is optional, Step 8b was not run for this book | Re-run Step 8b in the pipeline for this book |

---

## Reference Files

- `references/component-map.md` — Data flow, adapter functions, ERA_COLORS, and component architecture (read when debugging rendering issues)
