# CANON Bible Viewer — Component Map

Architecture reference for building the viewer from a CANON JSON record.

---

## State

```js
const [activeTab, setActiveTab]           // string: "overview" | "theology" | "purpose" | "canon" | "history" | "verses" | "sources"
const [activeChar, setActiveChar]         // object | null — the personaje being shown in the popup
const [tooltip, setTooltip]               // { data: chapterObj, x: number, y: number } | null — chapter hover
const [charTooltip, setCharTooltip]       // { char: charObj, x: number, y: number } | null — character hover
const [activeTheology, setActiveTheology] // object | null — the teologiaSistematica entry being shown
const [activeWcf, setActiveWcf]           // object | null — the WCF anchor entry being shown (mutually exclusive with activeTheology)
const [activeSource, setActiveSource]     // object | null — the fuentes[] entry being shown in the source popup
const [hoveredMenu, setHoveredMenu]       // string | null — key of the hovered sidebar button (theology or WCF), for hover styling
```

Note: `activeTheology` and `activeWcf` share one sidebar (Theology tab) and one detail panel — clicking a Doctrinas button clears `activeWcf`, clicking a Confesiones de Fe button clears `activeTheology`. Exactly one of them renders in the right panel at a time, defaulting to the first theology category.

---

## Link Helper Functions (top of file, before component)

```js
const BOOK_MAP = { "Gn": "Genesis", "Ex": "Exodus", ... }; // all 66 books, ES abbrev → EN BibleGateway name

function verseUrl(ref) { /* "Gn 1:1" → "https://www.biblegateway.com/passage/?search=Genesis+1:1&version=NBLA" */ }
function VerseLink({ children, style }) { /* renders <a> if verseUrl resolves, else plain <span> */ }
function linkifyVerses(text) { /* scans prose for verse patterns, returns array of strings + <a> elements */ }
```

These three must be defined before the component and used for every single verse reference rendered anywhere in the app — standalone refs use `<VerseLink>`, refs embedded in prose use `linkifyVerses()`.

## Top-Level JSX Structure

```jsx
<div style={S.app}>                          // Root: LAPIS_DEEP bg, full min-height

  <div style={S.topBar} />                   // 3px ornamental gradient bar

  <header style={S.header}>                  // Book title, Hebrew, tagline, meta grid
    ...
  </header>

  <div style={S.eraLegend}>                  // Era color dots + labels
    ...
  </div>

  <div style={S.infoPanel}>                  // Tabbed book info panel
    <nav style={S.tabNav}>                   // 7 tab buttons, larger bold text (13px/600)
      ...
    </nav>
    <div style={S.tabPanels}>
      {renderTab()}                          // Switch on activeTab — 7 cases
    </div>
  </div>

  <div style={S.instructions}>              // "← Arrastra... Clic en capítulo → BibleGateway..."
    ...
  </div>

  <div style={S.timelineWrap}               // Drag-scrollable horizontal timeline
       onMouseDown={...} onMouseUp={...} onMouseLeave={...} onMouseMove={...}>
    <div style={S.timelineInner}>           // width: chapters * PX_PER_CHAPTER

      {/* Era bands */}
      {ERA_BANDS.map(...)}

      {/* Spine */}
      <div style={S.spine} />

      {/* Chapter circles — 48px, number inside, CLICKABLE link to BibleGateway */}
      {CHAPTERS_DATA.map(d => (
        <div onMouseEnter={showTooltip} onMouseLeave={hideTooltip}
             onClick={() => window.open(bibleGatewayChapterUrl(d.ch), "_blank", "noopener,noreferrer")}>
          <div style={chapterCircle}>{d.ch}</div>
        </div>
      ))}

      {/* Character nodes — name label transparent, no border, directly adjacent to circle */}
      {CHARACTERS.map(c => (
        <div onClick={() => setActiveChar(c)}
             onMouseEnter={() => setCharTooltip({char: c, x: e.clientX, y: e.clientY})}
             onMouseLeave={() => setCharTooltip(null)}>
          <div style={nameLabel}>{c.name}</div>   {/* 18px, no bg, no border */}
          <div style={avatarCircle}>{c.init}</div> {/* 72px */}
          <div style={stem} />
        </div>
      ))}

    </div>
  </div>

  {/* Chapter tooltip (fixed position, pointer-events none) */}
  {tooltip && <div style={S.chTooltip}>...</div>}

  {/* Character hover tooltip — brief description, shown before click */}
  {charTooltip && <div style={S.chTooltip}>mini avatar + badge + name + desc + "Clic para ver biografía"</div>}

  {/* Character popup overlay (click) */}
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

  {/* Source popup overlay (click) — MUST be guarded with activeSource && (...) */}
  {activeSource && (
    <div style={S.overlay(!!activeSource)} onClick={closeOnBackdrop}>
      <div style={{...S.popupCard, maxWidth:680}}>
        <button onClick={() => setActiveSource(null)}>✕</button>
        {/* tier/meta, title, author */}
        {/* campos tags */}
        {/* ✦ SOBRE EL AUTOR — popup.bio */}
        {/* ✦ MÉTODO Y ENFOQUE — popup.metodo */}
        {/* ✦ APORTACIÓN AL CANON PIPELINE — popup.aportacion (sienna banner) */}
        {/* ✦ OBRAS PRINCIPALES — popup.obras list */}
        {/* link to popup.url */}
      </div>
    </div>
  )}

</div>
```

**Critical structural note:** the component's final closing `</div> ); }` must come AFTER every conditionally-rendered block (tooltip, charTooltip, activeChar popup, activeSource popup) — never insert it between two popup blocks. This was the cause of a real "Unexpected token" parse error in production: the closing tags were accidentally placed before the source popup JSX, orphaning it outside the component function.

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
    case "theology":  return <TheologyContent data={THEOLOGY_DATA} wcf={WCF_ANCHORS} activeTheology={activeTheology} activeWcf={activeWcf} setActiveTheology={setActiveTheology} setActiveWcf={setActiveWcf} />;
    case "purpose":   return <PurposeContent json={json} />;
    case "canon":     return <CanonContent json={json} />;
    case "history":   return <HistoryContent data={HIST_DATA} />;  // new in v1.2.0
    case "verses":    return <VersesContent verses={VERSES_DATA} />;
    case "sources":   return <SourcesContent fuentes={json.fuentes} setActiveSource={setActiveSource} />;
    default: return null;
  }
};
```

In practice these are inline in the switch — no separate components needed for a single-file output. If `contextoHistorico` is absent from the source JSON, omit the `"history"` entry from `TABS` entirely (see Fallback Handling in SKILL.md).

---

## Theology Tab Layout (critical — always interactive for v1.1.0+, WCF interactive since v1.2.0)

```
┌──────────────────────────────────────────────────────┐
│ DOCTRINAS      │  ┌─────────────────────────────────┐ │
│ [Creación    ] │  │ TEOLOGÍA SISTEMÁTICA             │ │
│ [Antropología] │  │ Creación                         │ │
│ [Hamartiología│  ├─────────────────────────────────┤ │
│ [Pacto       ] │  │ LO QUE GÉNESIS ENSEÑA            │ │
│ [Elección    ] │  │ [resumen text 2-4 sentences]    │ │
│ [Soteriología] │  ├─────────────────────────────────┤ │
│ [Providencia ] │  │ PASAJES CLAVE EN GÉNESIS         │ │
│ [Cristología ] │  │ Gn 1:1  │ Creación absoluta...  │ │ ← VerseLink
│ [Teología    ] │  │ Gn 1:26 │ Imago Dei...          │ │
│  Propia        │  │ Gn 1:31 │ Bondad original...    │ │
│ [Angelología ] │  ├─────────────────────────────────┤ │
│                │  │ DISTINCTIVA REFORMADA [sienna]  │ │
│ CONFESIONES    │  │ [italic text about Reformed...]  │ │
│ DE FE          │  └─────────────────────────────────┘ │
│ [Cap. 4        │                                      │
│  De la         │  ── OR, if a WCF button is active: ──│
│  Creación]     │  ┌─────────────────────────────────┐ │
│ [Cap. 6 ...]   │  │ CONFESIÓN DE WESTMINSTER         │ │
│ [Cap. 7 ...]   │  │ Cap. 4 — De la Creación          │ │
│ [Cap. 3 ...]   │  ├─────────────────────────────────┤ │
│ [Cap. 5 ...]   │  │ doctrina tags │ resumen │ pasajes │ │
│                │  │ de Génesis que lo fundamentan    │ │
│                │  │ [LEER CAPÍTULO COMPLETO →]       │ │
└────────────────┴──────────────────────────────────────┘
```

The left sidebar is `minWidth: 175px, maxWidth: 180px` (wide enough for "CONFESIONES DE FE" on one line). Both Doctrinas and WCF buttons share the **same visual style**: 13px text, 6px/8px padding, 3px colored left border (gold for Doctrinas, sienna for WCF), with hover states that brighten before the active state takes over. The right panel takes `flex: 1, minWidth: 260px`. The outer container is `display: "flex", gap: 20, flexWrap: "wrap"`.

**Mutual exclusivity:** clicking a Doctrinas button sets `activeTheology` and clears `activeWcf` (and vice versa). The right panel renders the theology detail by default; only switches to the WCF detail when `activeWcf` is non-null.

**WCF data shape** — each entry in `WCF_ANCHORS` needs: `cap` (e.g. "Cap. 4"), `titulo`, `doctrinas` (array of related teologiaSistematica category names), `resumen` (what the chapter teaches, in prose), `genesis` (array of verse refs from this book that ground it — rendered as clickable chips), `url` (link to the confession text, e.g. Ligonier en español).

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
- [ ] All 7 tab buttons are rendered and clickable, text is 13px/600 weight with visible scroll-fade arrow indicator if they overflow
- [ ] Theology tab uses interactive sidebar if v1.1.0+ data is present, WCF anchors are equally interactive and styled consistently
- [ ] CONTEXTO HISTÓRICO tab present if `contextoHistorico` exists in source JSON, omitted entirely if not
- [ ] Timeline chapter count matches the book (not hardcoded to 50)
- [ ] Chapter circles are 48px with the number inside, and clicking one opens BibleGateway NBLA for that chapter
- [ ] Character nodes alternate above/below, name label is transparent/borderless and ~18px, avatar circle is 72px
- [ ] Chapter tooltip appears on hover; character hover tooltip (brief description) appears before the full popup on click
- [ ] Character popup opens on click with all 5 sections
- [ ] Source cards in FUENTES tab are clickable and open a popup with bio/método/aportación/obras/url, if `popup` data is present
- [ ] Drag-to-scroll works (mouseDown/Move/Up handlers present)
- [ ] Every verse reference anywhere in the app — chips, prose, tooltips — is a working BibleGateway NBLA hyperlink
- [ ] No external imports except `useState` from React
- [ ] No emoji in JSX text nodes, no raw HTML entities (`&nbsp;`), no backticks inside quoted string values
- [ ] Final bracket/brace/paren balance verified; closing `</div> ); }` confirmed to sit after every conditional popup block
- [ ] Output file named `[book]-timeline.jsx`
