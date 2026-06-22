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

---

## Reference Files

- `references/component-map.md` — Data flow, adapter functions, ERA_COLORS, and component architecture (read when debugging rendering issues)
