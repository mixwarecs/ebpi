---
name: canon-bible-viewer
description: Renders any CANON Pipeline JSON record (v1.1.0+) as a full interactive React application with a horizontal scroll timeline, character popup cards, and a tabbed book-info panel. Use this skill whenever a user asks to visualize, display, render, or build an app from a CANON Pipeline JSON — even if they just say "run the pipeline on [book]" after generating a record, or "show me the timeline for [book]". Always use this skill when a CANON JSON is present in the conversation and the user wants any kind of visual or interactive output.
---

# CANON Bible Viewer

Renders CANON Pipeline JSON records (v1.1.0+) as a full-featured interactive React application. Produces a `.jsx` artifact that runs directly in Claude's artifact renderer.

## When to use

- User uploads or pastes a CANON Pipeline JSON and asks to visualize it
- User says "render", "show", "build an app", "make interactive" after running the pipeline
- User asks for "the timeline" or "the viewer" for any Bible book
- Any combination of CANON JSON + visual/interactive intent

## What it produces

A single-file React `.jsx` artifact with:

1. **Header** — Book title (large), Hebrew/Greek original, transliteration, tagline, metadata badges
2. **Era legend** — Color-coded era bands keyed to the timeline
3. **Book Info Panel** — 6 tabbed sections (see below)
4. **Horizontal timeline** — Drag-scrollable, 50 chapter markers, era bands, character nodes with stems
5. **Chapter tooltips** — Hover any chapter dot for title + description + key verse
6. **Character popups** — Click any character node for full biographical and theological detail
7. **Systematic theology panel** — Interactive category selector with passages + Reformed distinctive per category

### 6 Info Panel Tabs

| Tab | Content drawn from JSON |
|-----|------------------------|
| VISIÓN GENERAL | `titulo`, `tituloOriginal`, `transliteracion`, `significado`, `autor`, `año`, `idiomaOriginal`, `genero`, `division`, `aportacionAlCanon` |
| TEOLOGÍA | `teologiaSistematica[]` (interactive — each category button reveals `resumen`, `pasajes`, `ensenanza`, Reformed distinctive) + `anclasConfesionales` |
| PROPÓSITO | `proposito`, `destinatario` |
| CONTEXTO CANÓNICO | `historiaRedentora` (epoch flow diagram, `enfoqueCristologico`, `tiposYSombras`) |
| VERSÍCULOS CLAVE | `versiculosClave` with text + significance |
| FUENTES | `fuentes[]` |

---

## Design System (non-negotiable)

Read `references/design-tokens.md` before writing any code. These tokens define the exact look and feel that must be preserved across all 66 books.

**Summary of locked values:**
- Background: `#0F1A30` (lapis deep)
- Primary: `#1B2A4A` (lapis)
- Accent: `#C9A84C` (gold)
- Danger/type accent: `#8B3A2A` (sienna)
- Text: `#F2E8D0` (parchment)
- Typography: Georgia serif stack (no external font imports — use `'Georgia', serif`)
- Border radius: 2–4px maximum
- All borders: `rgba(201,168,76,X)` variants

---

## Build Process

### Step 1 — Parse the JSON

Extract these fields (all have sensible fallbacks if missing):

```
titulo.es / titulo.en          → header title
tituloOriginal                 → Hebrew/Greek display
transliteracion + significado  → subtitle line
autor.nombre + año.display.es  → metadata badges
division + ordenCanon          → metadata badges
historiaRedentora.epoca        → which era bands to highlight
teologiaSistematica[]          → theology tab (MUST be v1.1.0 objects, not strings)
personajes[]                   → character nodes on timeline
resumenCapitulos[]             → chapter tooltip content
versiculosClave[]              → key verses tab
fuentes[]                      → sources tab
anclasConfesionales[]          → WCF anchors in theology tab
distintivasReformadas.es       → used in theology tab fallback
historiaRedentora.tiposYSombras → canon context tab
historiaRedentora.enfoqueCristologico.es → canon context tab
aportacionAlCanon.es           → overview tab
proposito.es + destinatario.es → purpose tab
```

### Step 2 — Map chapter data

Build chapter color from `resumenCapitulos` ranges. If `teologiaSistematica` entries are plain strings (v1.0.0), show them as tags only (no interactive panel). If they are objects (v1.1.0+), render the full interactive selector.

### Step 3 — Place character nodes

For each entry in `personajes[]`:
- Use `capitulosActivo[0]` as the x-axis anchor chapter
- Alternate above/below based on index (even = above, odd = below)
- Use `nombre.es` as label, first 2 characters of Hebrew/Greek original as initials
- Color cycle: `["#C9A84C","#4A6741","#1B5E8B","#8B3A2A","#6B4A8B","#8B6A1B","#1B6B5E"]`

### Step 4 — Output

Output a **single `.jsx` file** using only:
- `useState` from React (import at top)
- Inline styles only (no CSS classes, no Tailwind, no external stylesheets)
- No external libraries beyond React itself

---

## Code Architecture

See `references/component-map.md` for the full component breakdown and state map.

The file has this top-level structure:

```jsx
// 1. Imports (useState only)
// 2. Design constants (GOLD, LAPIS, etc.)
// 3. Data constants (parsed from JSON: CHAPTERS_DATA, CHARACTERS, THEOLOGY_DATA, etc.)
// 4. Inline style object S{}
// 5. Default export component with:
//    - useState for: activeTab, activeChar, tooltip, activeTheology
//    - renderTab() switch for the 6 info panel tabs
//    - Timeline JSX with drag handlers
//    - Character popup overlay
//    - Chapter tooltip
```

---

## Critical Rules

1. **Never import fonts from Google Fonts** — use `'Georgia', serif` stack only
2. **Never use Tailwind classes** — all styling via inline `style={}`
3. **Never use localStorage** — all state in `useState`
4. **teologiaSistematica must be interactive** — if it's v1.1.0 objects, each category button must reveal its own `resumen` + `pasajes` + Reformed distinctive panel
5. **Timeline is always horizontal and drag-scrollable** — `onMouseDown/Move/Up` drag handlers on the wrapper div
6. **Character nodes alternate above/below the spine** — never stack them on the same side consecutively
7. **All text is in Spanish (es) by default** — use `.es` field of all trilingual objects unless user specifies otherwise
8. **The ornamental top bar** (3px gold-to-sienna gradient) is always present
9. **Era bands** — always derive from `resumenCapitulos` ranges, not hardcoded
10. **Output filename** — always `[book-name-lowercase]-timeline.jsx` (e.g. `genesis-timeline.jsx`, `exodo-timeline.jsx`)

---

## Fallback Handling

| Missing field | Fallback |
|---|---|
| `tituloOriginal` | Show empty — do not fabricate |
| `teologiaSistematica` strings (v1.0.0) | Render as tag pills, no interactive panel |
| `personajes` empty | Show timeline with no character nodes |
| `resumenCapitulos` missing ranges | Use chapter number as tooltip title |
| `versiculosClave` plain strings | Show as chips without significance text |
| `fuentes` empty | Show "Fuentes no disponibles" message |

---

## Reference Files

- `references/design-tokens.md` — Full color, typography, spacing, and component token system
- `references/component-map.md` — Component breakdown, state map, and annotated code patterns
---

# CANON Bible Viewer — Design Tokens

This file defines every visual decision in the CANON Bible Viewer. All values are locked. Do not substitute, approximate, or override them.

---

## Color Palette

```js
const GOLD        = "#C9A84C";   // Primary accent — borders, labels, active states, verse refs
const GOLD_BRIGHT = "#E8C56A";   // Hover highlight (rarely used)
const LAPIS       = "#1B2A4A";   // Card backgrounds, surface elements
const LAPIS_DEEP  = "#0F1A30";   // Page background, deepest layer
const PARCHMENT   = "#F2E8D0";   // Primary text, headings
const SIENNA      = "#8B3A2A";   // Danger accent, Reformed distinctive border, type callouts
const INK         = "#2C1810";   // Rarely used — deepest text shadow
```

### Opacity variants (always used as rgba, never as hex+opacity)

| Usage | Value |
|-------|-------|
| Border default | `rgba(201,168,76, 0.15)` |
| Border subtle | `rgba(201,168,76, 0.10)` |
| Border emphasis | `rgba(201,168,76, 0.35)` |
| Border active | `rgba(201,168,76, 0.40)` — full gold border |
| Text muted | `rgba(242,232,208, 0.55)` |
| Text body | `rgba(242,232,208, 0.80)` |
| Text strong | `rgba(242,232,208, 0.95)` = PARCHMENT |
| Gold label | `rgba(201,168,76, 0.55)` |
| Gold active | GOLD = `#C9A84C` |
| Surface card | `rgba(27,42,74, 0.40)` |
| Surface deep | `rgba(15,26,48, 0.50)` |
| Sienna bg | `rgba(139,58,42, 0.12)` |

### Era colors (used for chapter dots, era bands, character node borders)

```js
const ERA_COLORS = {
  "Creación y Caída":      "#4A6741",
  "Juicio / Diluvio":      "#8B3A2A",
  "Pacto Abrahánico":      "#1B5E8B",
  "Patriarcas / Isaac":    "#6B4A8B",
  "Patriarcas / Jacob":    "#8B6A1B",
  "Providencia / José":    "#1B6B5E",
};
```

### Character node color cycle (rotate through for each character)

```js
const CHAR_COLORS = [
  "#C9A84C",  // gold — for God/YHWH always
  "#4A6741",  // olive green
  "#1B5E8B",  // deep blue
  "#8B3A2A",  // sienna
  "#6B4A8B",  // purple
  "#8B6A1B",  // amber
  "#1B6B5E",  // teal
];
```

---

## Typography

**No external font imports.** Use Georgia serif stack exclusively.

```js
const FONT_DISPLAY = "'Georgia', 'Times New Roman', serif";
const FONT_BODY    = "'Georgia', 'Times New Roman', serif";
```

### Type scale

| Role | Size | Weight | Letter-spacing | Color |
|------|------|--------|---------------|-------|
| Book title (h1) | `clamp(44px, 7vw, 88px)` | 900 | `-1px` | PARCHMENT |
| Hebrew/Greek | `clamp(20px, 3.5vw, 36px)` | 400 | `8px` | GOLD at 70% |
| Tab button | `10px` | 400 | `3px` | GOLD 45% → GOLD on active |
| Section label (eyebrow) | `9px` | 400 | `3–4px` | `rgba(201,168,76, 0.55)` |
| Card title | `9–10px` | 400 | `3px` | GOLD |
| Body prose | `15–17px` | 400 | `0` | rgba parchment 0.80 |
| Verse reference | `12–13px` | 700 | `0.5–1px` | GOLD |
| Verse text (italic) | `17–18px` | 400 italic | `0` | PARCHMENT |
| Meta value | `15–16px` | 400 | `0` | PARCHMENT |
| Badge | `10px` | 400 | `3px` | GOLD |
| Chapter dot label | `8px` | 400 | `1px` | parchment 35% |
| Character name tag | `9px` | 400 | `2px` | character color |
| Popup character name | `26px` | 700 | `0.5px` | PARCHMENT |

---

## Spacing

- Page padding (timeline): `52px 40px 100px`
- Panel padding: `28px 32px 32px`
- Tab panel padding: `28px 32px 32px`
- Card padding: `18–24px`
- Badge padding: `5px 12px`
- Section gap: `16–24px`
- Inline gap (flex): `8–16px`

---

## Border Radius

- Cards, panels: `3px`
- Badges: `2px`
- Popup card: `4px`
- Character avatar (circle): `50%`
- Avatar in popup (portrait): `3px`
- Buttons (tab, theology): `2px`

---

## Shadows

```js
// Character avatar node
boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 0 3px ${charColor}20`

// Popup card
boxShadow: "0 20px 60px rgba(0,0,0,0.7)"

// Chapter tooltip
boxShadow: "0 8px 30px rgba(0,0,0,0.6)"

// H1 text glow
textShadow: "0 0 60px rgba(201,168,76,0.3)"
```

---

## Component Tokens

### Top ornamental bar
```js
// Always rendered as the very first element in the app
height: 3,
background: `linear-gradient(90deg, transparent, ${GOLD}, ${SIENNA}, ${GOLD}, transparent)`
```

### Timeline spine
```js
position: "absolute", top: "50%", left: 0, right: 0,
height: 2,
background: `linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 2%, ${GOLD} 20%, ${GOLD} 80%, rgba(201,168,76,0.3) 98%, transparent)`,
transform: "translateY(-50%)"
```

### Character stem (above → below direction)
```js
// Above variant: avatar on top, stem going down to spine
background: `linear-gradient(180deg, ${charColor}20, ${charColor}80)`

// Below variant: spine to avatar going down
background: `linear-gradient(180deg, ${charColor}80, ${charColor}20)`
```

### Tab button (active vs inactive)
```js
// Active
{ color: GOLD, borderBottom: `2px solid ${GOLD}`, background: "none", border: "none" }

// Inactive
{ color: "rgba(201,168,76,0.4)", borderBottom: "2px solid transparent", background: "none", border: "none" }
```

### Theology category button (left sidebar)
```js
// Active
{
  border: `1px solid ${GOLD}`,
  borderLeft: `3px solid ${GOLD}`,
  background: "rgba(201,168,76,0.10)",
  color: GOLD,
}

// Inactive
{
  border: "1px solid rgba(201,168,76,0.15)",
  borderLeft: "3px solid transparent",
  background: "rgba(27,42,74,0.25)",
  color: "rgba(242,232,208,0.55)",
}
```

### Reformed distinctive callout box
```js
{
  background: "linear-gradient(90deg, rgba(139,58,42,0.12), rgba(139,58,42,0.02))",
  borderLeft: `3px solid ${SIENNA}`,
  padding: "13px 16px",
  borderRadius: "0 3px 3px 0",
}
```

### Meta info block (left-bordered label+value)
```js
{
  borderLeft: `2px solid rgba(201,168,76,0.25)`,
  paddingLeft: 14,
}
```

### Popup overlay backdrop
```js
{
  position: "fixed", inset: 0,
  background: "rgba(10,16,30,0.88)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
  // opacity controlled by open state: open ? 1 : 0
  // pointerEvents: open ? "all" : "none"
  transition: "opacity 0.25s"
}
```

### Era band (behind timeline)
```js
{
  position: "absolute", top: 0, height: "100%",
  background: `linear-gradient(90deg, ${eraColor}10, ${eraColor}1e)`,
  borderRight: "1px dashed rgba(201,168,76,0.1)",
}
```

---

## Page Background

The body/root background is always `LAPIS_DEEP` (`#0F1A30`).

The header has:
```js
background: "linear-gradient(180deg, rgba(15,26,48,0.9), rgba(27,42,74,0.6))"
```

The info panel has:
```js
background: "linear-gradient(180deg, rgba(15,26,48,0.97), rgba(10,16,30,0.99))"
```

---

## Hebrew / Greek text direction

- Hebrew (OT): `direction: "rtl"` on the display element, rendered right-to-left
- Greek (NT): `direction: "ltr"`, no special treatment needed
- Always color: GOLD at 70% opacity (`rgba(201,168,76,0.7)`)
- Always letter-spacing: `8px`
---

# CANON Bible Viewer — Component Map

Architecture reference for building the viewer from a CANON JSON record.

---

## State

```js
const [activeTab, setActiveTab]           // string: "overview" | "theology" | "purpose" | "canon" | "verses" | "sources"
const [activeChar, setActiveChar]         // object | null — the personaje being shown in the popup
const [tooltip, setTooltip]               // { data: chapterObj, x: number, y: number } | null
const [activeTheology, setActiveTheology] // object | null — the teologiaSistematica entry being shown
```

---

## Top-Level JSX Structure

```jsx
<div style={S.app}>                          // Root: LAPIS_DEEP bg, full min-height

  <div style={S.topBar} />                   // 3px ornamental gradient bar

  <header style={S.header}>                  // Book title, Hebrew, tagline, badges
    ...
  </header>

  <div style={S.eraLegend}>                  // Era color dots + labels
    ...
  </div>

  <div style={S.infoPanel}>                  // Tabbed book info panel
    <nav style={S.tabNav}>                   // 6 tab buttons
      ...
    </nav>
    <div style={S.tabPanels}>
      {renderTab()}                          // Switch on activeTab
    </div>
  </div>

  <div style={S.instructions}>              // "← Arrastra para explorar..."
    ...
  </div>

  <div style={S.timelineWrap}               // Drag-scrollable horizontal timeline
       onMouseDown={...} onMouseUp={...} onMouseLeave={...} onMouseMove={...}>
    <div style={S.timelineInner}>           // width: chapters * PX_PER_CHAPTER

      {/* Era bands */}
      {ERA_BANDS.map(...)}

      {/* Spine */}
      <div style={S.spine} />

      {/* Chapter dots */}
      {CHAPTERS_DATA.map(d => (
        <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
          <div style={chapterDot} />
          <div style={chapterLabel}>{d.ch}</div>
        </div>
      ))}

      {/* Character nodes */}
      {CHARACTERS.map(c => (
        <div onClick={() => setActiveChar(c)}>
          <div style={avatarCircle}>{c.initials}</div>
          <div style={stem} />
          <div style={nameTag}>{c.name}</div>
        </div>
      ))}

    </div>
  </div>

  {/* Chapter tooltip (fixed position, pointer-events none) */}
  {tooltip && <div style={S.chTooltip}>...</div>}

  {/* Character popup overlay */}
  {activeChar && (
    <div style={S.overlay(!!activeChar)} onClick={closeOnBackdrop}>
      <div style={S.popupCard}>
        <button onClick={() => setActiveChar(null)}>✕</button>
        <div style={S.popupHeader}>        // Avatar + name + role badge + desc
          ...
        </div>
        <div style={S.popupBody}>          // Actions, theology, christType, NT refs, verses
          ...
        </div>
      </div>
    </div>
  )}

</div>
```

---

## Data Preparation (from JSON)

### CHAPTERS_DATA

Build from `resumenCapitulos[]`. Each `rangoInicio`→`rangoFin` block maps to individual chapters:

```js
const CHAPTERS_DATA = [];
for (const block of json.resumenCapitulos) {
  for (let ch = block.rangoInicio; ch <= block.rangoFin; ch++) {
    CHAPTERS_DATA.push({
      ch,
      color: eraColorForChapter(ch),
      title: block.titulo.es,
      desc: block.descripcion.es,
      verse: block.versiculoClave,
    });
  }
}
```

If `resumenCapitulos` is missing, generate 1–N chapters with minimal data.

### CHARACTERS

Map `personajes[]` to character nodes:

```js
const CHARACTERS = json.personajes.map((p, i) => ({
  id: i,
  name: p.nombre.es,
  heb: p.nombre.es,             // use tituloOriginal if available on character
  ch: p.capitulosActivo,
  xCh: p.capitulosActivo[0],    // anchor chapter for x position
  side: i % 2 === 0 ? "above" : "below",
  color: CHAR_COLORS[i % CHAR_COLORS.length],
  init: p.nombre.es.slice(0,2).toUpperCase(),
  badge: p.rol.toUpperCase(),
  desc: p.descripcion.es,
  actions: p.acciones.es,
  theology: p.significadoTeologico.es,
  christType: p.tipo.es,
  ntRefs: p.enElNuevoTestamento.es,
  verses: p.biografiaBiblica.versiculosClave,
}));
```

### SYSTEMATIC_THEOLOGY

Check if entries are objects (v1.1.0) or strings (v1.0.0):

```js
const isV110 = json.teologiaSistematica.length > 0
  && typeof json.teologiaSistematica[0] === "object";

const THEOLOGY_DATA = isV110
  ? json.teologiaSistematica.map(t => ({
      categoria: t.categoria,
      resumen: t.resumen.es,
      pasajes: parsePasajes(t.pasajes, t.ensenanza.es),
      // parsePasajes splits the ensenanza string by " · " and pairs with pasajes array
    }))
  : json.teologiaSistematica.map(s => ({ categoria: s, resumen: null, pasajes: [] }));
```

**Parsing `ensenanza`:** The `ensenanza.es` field is a single string with entries separated by ` · ` where each entry starts with the verse ref and a ` — `. Split on ` · ` to get one entry per passage:

```js
function parsePasajes(pasajesArray, ensenanzaString) {
  const parts = ensenanzaString.split(" · ");
  return pasajesArray.map((ref, i) => ({
    ref,
    nota: parts[i] ? parts[i].replace(/^Gn \S+\s*—\s*/, "") : "",
  }));
}
```

---

## Timeline Geometry

```js
const TOTAL_CHAPTERS = 50;  // Use json.resumenCapitulos last rangoFin for other books
const PX_PER_CHAPTER = 84;  // Fixed: produces readable spacing at 50 chapters
const TOTAL_WIDTH = TOTAL_CHAPTERS * PX_PER_CHAPTER;

// X position of chapter N (centered on N)
const xOf = (ch) => ((ch - 0.5) / TOTAL_CHAPTERS) * TOTAL_WIDTH;

// Timeline inner div
const TIMELINE_HEIGHT = 400;  // px — fixed
```

**For non-50-chapter books:** recalculate `TOTAL_CHAPTERS` from `json.resumenCapitulos` last `rangoFin`. Keep `PX_PER_CHAPTER = 84`.

---

## Drag-to-Scroll Pattern

```js
// Mutable ref object (not useState — no re-render needed)
const drag = { isDown: false, startX: 0, scrollLeft: 0 };

const onMouseDown = (e) => {
  drag.isDown = true;
  drag.startX = e.pageX - e.currentTarget.offsetLeft;
  drag.scrollLeft = e.currentTarget.scrollLeft;
  e.currentTarget.style.cursor = "grabbing";
};
const onMouseUp = (e) => { drag.isDown = false; e.currentTarget.style.cursor = "grab"; };
const onMouseLeave = (e) => { drag.isDown = false; e.currentTarget.style.cursor = "grab"; };
const onMouseMove = (e) => {
  if (!drag.isDown) return;
  e.preventDefault();
  const x = e.pageX - e.currentTarget.offsetLeft;
  e.currentTarget.scrollLeft = drag.scrollLeft - (x - drag.startX) * 1.5;
};
```

---

## renderTab() Switch

```js
const renderTab = () => {
  switch (activeTab) {
    case "overview":  return <OverviewContent json={json} />;
    case "theology":  return <TheologyContent data={THEOLOGY_DATA} active={activeTheology} setActive={setActiveTheology} />;
    case "purpose":   return <PurposeContent json={json} />;
    case "canon":     return <CanonContent json={json} />;
    case "verses":    return <VersesContent verses={VERSES_DATA} />;
    case "sources":   return <SourcesContent fuentes={json.fuentes} />;
    default: return null;
  }
};
```

In practice these are inline in the switch — no separate components needed for a single-file output.

---

## Theology Tab Layout (critical — always interactive for v1.1.0)

```
┌──────────────────────────────────────────────────────┐
│ [Creación    ] │  ┌─────────────────────────────────┐ │
│ [Antropología] │  │ TEOLOGÍA SISTEMÁTICA             │ │
│ [Hamartiología│  │ Creación                         │ │
│ [Pacto       ] │  ├─────────────────────────────────┤ │
│ [Elección    ] │  │ LO QUE GÉNESIS ENSEÑA            │ │
│ [Soteriología] │  │ [resumen text 2-4 sentences]    │ │
│ [Providencia ] │  ├─────────────────────────────────┤ │
│ [Cristología ] │  │ PASAJES CLAVE EN GÉNESIS         │ │
│ [Teología    ] │  │ Gn 1:1  │ Creación absoluta...  │ │
│  Propia        │  │ Gn 1:26 │ Imago Dei...          │ │
│ [Angelología ] │  │ Gn 1:31 │ Bondad original...    │ │
│               │  ├─────────────────────────────────┤ │
│  ÁNCORAS WCF  │  │ DISTINCTIVA REFORMADA [sienna]  │ │
│  Cap. 4       │  │ [italic text about Reformed...]  │ │
│  Cap. 6       │  └─────────────────────────────────┘ │
│  Cap. 7       │                                      │
└──────────────────────────────────────────────────────┘
```

The left sidebar is `minWidth: 158px, flexShrink: 0`. The right panel takes `flex: 1, minWidth: 260px`. The outer container is `display: "flex", gap: 24, flexWrap: "wrap"`.

---

## Character Popup Layout

```
┌──────────────────────────────────────────────┐
│ [X]                                          │
│ ┌──────┐  [ROLE BADGE]                       │
│ │      │  Character Name                    │
│ │ init │  OriginalScript · Gn X–Y            │
│ │      │  italic description sentence        │
│ └──────┘                                     │
├──────────────────────────────────────────────┤
│ ✦ ACCIONES NARRATIVAS                        │
│ [prose text]                                 │
│                                              │
│ ✦ SIGNIFICADO TEOLÓGICO                      │
│ [prose text]                                 │
│                                              │
│ ✦ TIPO Y SOMBRA DE CRISTO          [sienna]  │
│ [italic text in sienna box]                  │
│                                              │
│ ✦ EN EL NUEVO TESTAMENTO           [box]     │
│ [text in dark bordered box]                  │
│                                              │
│ ✦ VERSÍCULOS CLAVE                           │
│ [Gn 1:1] [Gn 3:15] [Gn 15:6]               │
└──────────────────────────────────────────────┘
```

Popup is `max-width: 640px`, centered in overlay, `max-height: 90vh, overflowY: auto`.

---

## Chapter Tooltip

Fixed position, appears on `mouseEnter` of chapter dot. Contains:

```
GÉNESIS [N]        ← eyebrow in gold 9px
Chapter Title      ← 16px bold parchment
Description text   ← 13px muted
Gn N:V             ← verse ref 9px gold
```

Position: `left: Math.min(mouseX + 12, window.innerWidth - 300)`, `top: mouseY - 120`. `pointerEvents: "none"`.

---

## Book-Specific Adaptations

When rendering books other than Genesis:

| Book type | Adaptation |
|-----------|-----------|
| NT books | `direction: "ltr"` for Greek title; era colors from NT set |
| Short books (< 10 chapters) | Increase `PX_PER_CHAPTER` to maintain readable spacing |
| Long books (Psalms: 150 ch) | Reduce `PX_PER_CHAPTER` to ~40px |
| Books with few characters | Nodes may all be "above" — that's fine |
| Greek title | No RTL direction needed |

---

## Quality Checklist Before Output

- [ ] Header shows Hebrew/Greek in correct direction (RTL for OT, LTR for NT)
- [ ] All 6 tab buttons are rendered and clickable
- [ ] Theology tab uses interactive sidebar if v1.1.0 data is present
- [ ] Timeline chapter count matches the book (not hardcoded to 50)
- [ ] Character nodes alternate above/below
- [ ] Chapter tooltip appears on hover
- [ ] Character popup opens on click with all 5 sections
- [ ] Drag-to-scroll works (mouseDown/Move/Up handlers present)
- [ ] No external imports except `useState` from React
- [ ] Output file named `[book]-timeline.jsx`
