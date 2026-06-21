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

### Timeline node sizes (locked, v1.2.0)
```js
const CHAPTER_CIRCLE_SIZE = 48;  // px — chapter number rendered centered inside, no separate label below
const CHARACTER_AVATAR_SIZE = 72; // px
// Character name label: transparent background, no border, sits immediately above (if "above") or below (if "below") the avatar with no stem between name and avatar — the stem connects avatar to spine only
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
| Chapter number (inside circle) | `13px` | 700 | `0` | era color |
| Character name label | `18px` | 600 | `0.5px` | character color |
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
