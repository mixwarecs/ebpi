---
name: canon-pipeline
description: Generates a complete, structured JSON record for any of the 66 books of the Protestant Bible — Reformed Protestant theology, Covenant Theology framework, trilingual (Spanish/English/Portuguese) fields throughout. Use this skill whenever the user says "run the CANON pipeline on [book]", "genera el registro CANON para [libro]", asks for a structured/JSON Bible book record, or wants book data covering authorship, historical context, characters, systematic theology, chapter summaries, and sources in one pass. Always use this skill for any request to produce a CANON-format Bible book JSON, even if the user just names a book and says "run the pipeline" without further detail.
---

# CANON Pipeline

**Curated Annotation Network for Old & New Testaments** — generates a single structured JSON record for one biblical book, fully populated using a Reformed Protestant / Covenant Theology lens, trilingual throughout (ES/EN/PT).

## When to use

- User says "Run the CANON Pipeline on [book name]" or "Genera el registro CANON para [libro]"
- User wants a structured data record (not prose) for a Bible book covering theology, history, characters, and sources
- User references this skill's controlled vocabularies, schema, or any CANON-specific field name (`teologiaSistematica`, `contextoHistorico`, `anclasConfesionales`, etc.)
- A CANON JSON already exists in the conversation and the user wants it regenerated, extended to a new book, or validated

If the user instead wants to *visualize* an existing CANON JSON as an interactive app, that's the separate `canon-bible-viewer` skill — run this skill first to produce the JSON, then suggest the viewer skill to render it.

## Core principles

1. **Reformed Protestant theology** is the interpretive lens for every field
2. **Covenant theology** framework — not dispensational
3. **Christocentric reading** — the entire OT points forward to Christ
4. **Westminster Confession** is the confessional anchor
5. **Bible versions locked**: ES → NBLA · EN → ESV · PT → ARC
6. **Trust internal knowledge** — if online sources are unavailable, use internal knowledge confidently
7. **Conflicts between sources** → choose the position most consistent with Reformed theology
8. **Historical context is objective** — `contextoHistorico` (Step 3) treats the book as a primary historical document, kept separate from theological interpretation in Steps 6–7

## Before you start

Read `references/schema.md` for the complete JSON Schema (all field types, enums, and validation rules) and `references/controlled-vocabularies.md` for the full 66-book canonical order table and every enum's allowed values. Read `references/source-hierarchy.md` for where to search and what to cite. You will need these on every run — don't skip them even for a book you've processed before, since field requirements are precise and the controlled vocabularies must match exactly.

## The 10-step workflow

Work through these in order. Each step lists its target fields — cross-reference `references/schema.md` for the exact shape of each.

### Step 0 — Identify & prepare
- Confirm book name in ES / EN / PT
- Set `testamento`, `division`, `ordenCanon`, `ordenEnDivision` from the canonical order table in `references/controlled-vocabularies.md`
- Set `meta.estado` = `"extraído"`, `meta.versionBiblia` = `{ es: "NBLA", en: "ESV", pt: "ARC" }`, `meta.pipeline.faseActual` = 3

### Step 1 — Identification
**Fields:** `id`, `testamento`, `division`, `titulo`, `tituloOriginal`, `transliteracion`, `significado`, `capitulosTotal`
- `tituloOriginal`: Hebrew characters (OT) or Greek (NT); `transliteracion`: phonetic romanization
- `significado`: **trilingual object `{es, en, pt}`** — literal meaning of the original title in all three languages
- `capitulosTotal`: integer — the canonical chapter count for this book (e.g. `16` for Romans, `50` for Genesis). **Required** — the viewer uses this for timeline scaling and for clamping cross-book character positions. Without it the timeline falls back to 50 chapters, compressing shorter books and misplacing characters.
- Source: internal knowledge

### Step 1b — Resumen General
**Field:** `resumenGeneral` — trilingual `{es, en, pt}`

Write 2–4 sentences per language describing the theological arc of the book — the movement from its opening to its close. This is NOT a purpose statement (that belongs in `proposito`) and NOT an author bio (that belongs in `autor`). Focus exclusively on:

- Where the book starts theologically
- How it moves (key structural turns, narrative reversals, argumentative build)
- Where it lands and what it leaves open or resolved

**Genre-specific arc language** — match framing to the book's genre:
- Narrative (Genesis–Joshua, Judges–Kings, Gospels, Acts): "narrative arc" — story movement, plot turns, crisis and resolution
- Epistle (all NT letters): "argument" — logical/theological progression, how the case builds section by section
- Prophetic (Isaiah–Malachi): "oracular arc" — judgment-to-salvation movement, structural divisions (e.g. Is 1–39 / 40–66)
- Wisdom (Job, Psalmos, Proverbios, Eclesiastés): "thematic arc" — organizing structure or framing device and movement within it
- Apocalyptic (Daniel, Revelation): "vision arc" — vision sequence, escalation, eschatological resolution
- Mixed-genre books: name both registers and trace the arc across the structural seam

Quality standard: the arc must cite specific chapter ranges and verse anchors (e.g. `Gn 12:1–3` in ES, `Gen 12:1–3` in EN, `Gn 12:1–3` in PT). A description that could apply to any book of the same genre fails the bar. The reader should finish the arc and feel oriented to read the book in a new way.

Do NOT repeat: author, occasion, date, purpose, or canonical contribution — those live in other fields already rendered in the viewer.

### Step 2 — Authorship & fecha de escritura
**Fields:** `autor`, `año`, `idiomaOriginal`, `escritoEn`
- Search Blue Letter Bible for book introduction, confirm with Bible Gateway
- **`autor.nombre` must be a trilingual object `{es, en, pt}`** — e.g. `{"es":"Moisés","en":"Moses","pt":"Moisés"}`. A flat Spanish string causes the author name to appear in Spanish regardless of the viewer's selected language.
- Debated authorship → `autor.tradicional = true` + populate `autor.nota`
- **`año.display.es` label must always read "Fecha de escritura"** — never "Datación" or other phrasing
- Dates: negative = B.C., positive = A.D. OT = Hebrew (except Daniel 2–7 and Ezra 4–7 = Aramaic), NT = Greek
- Conflict rule: choose the position consistent with Reformed tradition

### Step 3 — Contexto histórico
**Fields:** all `contextoHistorico` sub-fields (`periodoHistorico`, `geografia[]`, `civilizaciones[]`, `arqueologia`, `fuentesANE[]`, `controversiasHistoricas`, `cronologiaInterna`)

Treat the book strictly as a primary historical document, independent of theological interpretation — this is descriptive, not devotional.

- `periodoHistorico`: **trilingual object `{es,en,pt}`** — the broad historical era name in all three languages (e.g. `{"es":"Bronce Tardío (1550–1200 a.C.)","en":"Late Bronze Age (1550–1200 BC)","pt":"Bronze Tardio (1550–1200 a.C.)"}`)
- `geografia[]`: every key location mentioned. **`lugar` and `identificacionModerna` are trilingual objects `{es,en,pt}`** (place names differ by language). `significancia` is also trilingual
- `civilizaciones[]`: every people/empire that appears or provides background. **`nombre` is a trilingual object `{es,en,pt}`**. `rolEnElTexto` and `estadoArqueologico` are also trilingual
- `arqueologia`: objective summary of what archaeology confirms, illuminates, or complicates — note both confirmations and tensions
- `fuentesANE[]`: specific ancient Near Eastern texts/documents providing parallel context (e.g. Enuma Elish, Nuzi tablets, Mari archives) — minimum 1 entry for OT books. **`nombre` and `origen` are trilingual objects `{es,en,pt}`** (text names and provenance descriptions differ by language). `relevancia` is also trilingual
- `controversiasHistoricas`: where the book's historical record is debated; present both positions, then note the Reformed tradition's response
- `cronologiaInterna`: the book's own internal timeline, dated only from what the text itself implies — not external chronology
- For NT books, include Greco-Roman context (governors, emperors, cities, roads) in place of ANE sources
- Source priority: Bright, Currid, IVP Bible Background Commentary, Archaeological Study Bible, internal knowledge

### Step 4 — Canonical context
**Fields:** `ordenEnDivision`, `ordenCanon`, `historiaRedentora`, `aportacionAlCanon`

Epoch assignment: Genesis 1–11 → Creación y Caída · Genesis 12–Deuteronomy → Promesa/Ley · Joshua–Malachi → Promesa/Ley/Anticipación Profética · Gospels+Acts → Cumplimiento · Epistles → Aplicación · Revelation → Consumación.

- `enfoqueCristologico`: how this book reveals or prefigures Christ — use the Vos biblical-theology framework
- `tiposYSombras`: **each entry is a trilingual object `{es,en,pt}`** — describe the type in each language and embed the Scripture cross-reference inside the prose, e.g. `"en": "The burning bush as a type of Christ's divine-human union (Ex 3:2–4)"`
- `aportacionAlCanon`: what does ONLY this book contribute to the whole canon?
- Source: internal knowledge (Vos, Grudem, Sproul) + Monergism.com

### Step 5 — Literary fields
**Fields:** `genero`, `palabraClave`, `destinatario`, `proposito`
- `destinatario`: be specific — not "Israel" but "the nation of Israel during the wilderness period"
- `proposito`: state both historical purpose AND theological purpose separately

### Step 6 — Characters
**Fields:** all `personajes[]` fields — classification, `biografiaBiblica`, `biografiaHistorica`, theological fields

For each named character with a significant narrative role:
- **`hebreo`**: include the Hebrew (OT) or Greek (NT) name characters when they are textually significant (e.g. `"יְהוָה"`, `"מֹשֶׁה"`). Omit for NT characters where the Greek form adds nothing distinctive
- **Biblical biography**: from canonical text ONLY, no extra-biblical traditions, cite exact verses
- **Historical biography**: search Blue Letter Bible + internal knowledge (Bright, Currid, NICOT/NICNT). `nivelEvidencia` enum: `alto` (named in external records) · `medio` (cultural context confirmed) · `bajo` (minimal evidence) · `especulativo` (no external evidence)
- **Theological fields**: `significadoTeologico`, `tipo` (does this character function as a type of Christ?), `caracterMoral`, `enElNuevoTestamento`

### Step 7 — Theology
**Fields:** `teologiaSistematica[]`, `anclasConfesionales`, `versiculosClave`, `distintivasReformadas`

`teologiaSistematica` is an array of OBJECTS (not strings). Each entry needs:
- `categoria`: **trilingual object `{es,en,pt}`** — the doctrine category name in all three languages (e.g. `{"es":"Elección","en":"Election","pt":"Eleição"}`). Use one of the controlled vocabulary values as the Spanish key, then translate it.
- `resumen`: 2–4 sentences on what THIS book teaches about this doctrine (trilingual)
- `pasajes`: 2–6 verse refs from THIS book only
- `ensenanza`: one-sentence gloss per passage, entries separated by ` · ` in the same order as `pasajes` (trilingual). **Do NOT include the verse reference in the gloss text** — the verse ref is already shown separately from the `pasajes` array. Write only the explanatory gloss, e.g. `"God reveals his eternal name 'I AM'"` not `"Ex 3:14 — God reveals his eternal name"`.
- `distintivaReformada`: **trilingual object `{es,en,pt}`** — 1–2 sentences on what the Reformed/covenant theology tradition specifically emphasizes about this doctrine as found in this book

Rules: only include categories actually prominent in this book; minimum 3 entries.

**`anclasConfesionales`** — each entry is a **full trilingual object**, not a plain string. Required shape:
```json
{
  "cap": "Cap. 4",
  "titulo":   { "es": "De la Creación", "en": "Of Creation", "pt": "Da Criação" },
  "doctrinas": ["Creación", "Antropología"],
  "resumen":  { "es": "2–4 sentence summary", "en": "...", "pt": "..." },
  "genesis":  ["Ex 20:11", "Ex 31:17"],
  "url": "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-4"
}
```

**`versiculosClave`** — 2–5 entries, prioritize verses cited in the NT or in Grudem. Each entry is an **object**:
```json
{
  "ref":  "Ex 3:14",
  "es":   "NBLA verse text",
  "en":   "ESV verse text",
  "pt":   "ARC verse text",
  "nota": { "es": "2–4 sentence theological significance", "en": "...", "pt": "..." }
}
```

### Step 8 — Chapter summaries
**Fields:** all `resumenCapitulos[]` fields
- Group into natural narrative/thematic units — no gaps allowed across the whole book
- Each unit: `titulo` (3–6 words), `descripcion`, `eventoClave`, `versiculoClave`
- **`descripcion` quality standard** — **3–5 sentences, 350–600 characters per language**. Must include inline verse references (e.g. `Gn 1:3`, `Gen 3:15–16`, `Rm 1:17`) using the book's standard abbreviation per language. Connect explicitly to Covenant Theology and/or redemptive history. Name specific characters, events, and theological themes. A one- or two-sentence description does not meet the bar.
- **`eventoClave`** — 1–2 sentences (150–250 chars per language) identifying the single most theologically significant event or turning point in the unit, from a Reformed/Covenant Theology perspective.
- **`era` is required on every unit** — use the `historiaRedentora.epoca` value for this book (e.g. `"Ley"` for Exodus–Deuteronomy). If `era` is missing or empty the viewer silently falls back to Genesis era bands, which is the wrong display for every other book.
- **`referenciasRelacionadas` — add when a unit has clear cross-testament connections or explicit NT citations of an OT passage.** Omit entirely when none apply — do NOT force entries. Each item requires:
  - `ref`: ES abbreviation (same convention as `versiculoClave`, e.g. `"Ro 5:14"`, `"He 7:1–3"`)
  - `tipo`: one of `"cumplimiento"` · `"tipología"` · `"paralelo"` · `"doctrinal"` · `"cita"` · `"alusión"` — choose the most specific that applies
  - `nota` (optional): trilingual `{es, en, pt}` 1–2 sentences when `tipo` alone doesn't explain the connection
  - **Scope constraint**: every entry must be relevant to the **specific content of this chapter range**, not the book generally. A cross-reference that fits Genesis 22 does not belong on the Genesis 1–2 unit.
  - **Priority targets**: OT chapters with protoevangelium / type-antitype material; chapters quoted verbatim in NT; NT books pointing back to the OT passage being fulfilled
  - **Limit**: 1–4 entries per unit — most theologically significant only
- Always connect to the redemptive-historical flow

### Step 8b — Clasificación de Temas Bíblico-Teológicos
**Field:** `temasBiblicoteologicos` on each `resumenCapitulos[]` entry

This is a **separate focused pass** that runs after Step 8 is fully complete. Step 8 writes `part6-chapters.json`; Step 8b reads it, annotates each entry with themes, and overwrites it in place. No new part file — the merge script is unchanged.

**How to run Step 8b:**
1. Read `part6-chapters.json` from the scratchpad
2. For each chapter unit, apply the 7-step identification method:
   - Identify vocabulary indicators present in the unit's `descripcion` and `eventoClave`
   - Locate the unit in the redemptive-historical arc (creation → fall → redemption → consummation)
   - Detect echoes/allusions to earlier canonical texts
   - Match against the controlled vocabulary in `references/controlled-vocabularies.md → Temas Bíblico-Teológicos`
   - Select `principal` — the **single dominant theme** governing this unit's movement (every unit requires one)
   - Add up to 3 `secundarios` only for themes that are **genuinely prominent** in this unit, not merely mentioned
   - Before finalizing, scan all units together and ensure the `principal` assignments tell a coherent thematic arc across the book
3. Write the annotated array back to `part6-chapters.json` (overwrite)

**Data shape** — each theme is a single-key object: the key is the theme name (exact controlled-vocabulary string), the value is a **trilingual `{es, en, pt}` nota** explaining why that theme was identified in this unit, with verse citations:
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
        "es": "Cristo promete no dejar a los suyos como huérfanos y que el Padre y el Hijo vendrán a morar con quien le ame (Jn 14:18,23).",
        "en": "Christ promises not to leave his disciples as orphans and that the Father and Son will come and make their home with the one who loves him (John 14:18,23).",
        "pt": "Cristo promete não deixar os seus como órfãos e que o Pai e o Filho virão habitar com quem o ama (Jo 14:18,23)."
      }
    }
  ]
}
```

**Nota quality standard** — each nota must:
- Cite at least one specific verse from the chapter range (ES abbreviations in `es`, EN in `en`, PT in `pt`)
- State the textual evidence for the theme, not just assert it — explain *why* the text points to this theme
- Be 1–2 sentences, 120–250 characters per language

**Failing** nota: `"es": "Este capítulo trata sobre el Espíritu Santo."` — asserts without evidence  
**Passing** nota: `"es": "El Espíritu Santo es prometido como Consolador permanente (Jn 14:16–17) que morará con los discípulos (Jn 14:26)."` — cites verses and explains the connection

**Rules:**
- `principal` is **required** on every unit — never omit it
- `secundarios` is optional — omit the key entirely when only `principal` applies (never write `"secundarios": []`)
- No duplicates between `principal` and `secundarios`
- All theme-name keys must be exact strings from the controlled vocabulary — no paraphrasing, no inventing new themes
- Do not force secondary themes; one dominant theme per unit is often sufficient

### Step 9 — Sources registry
**Fields:** all `fuentes[]` fields, including the `popup` sub-object

Always include these five defaults: ESV Study Bible (Crossway, 2008, Tier 1, EN) · Reformation Study Bible (Sproul/Ligonier, 2015, Tier 1, EN) · Biblia de Estudio de la Reforma NBLA (Tier 1, ES) · Systematic Theology (Grudem, Zondervan, 1994, Tier 2, EN) · Biblical Theology (Vos, Banner of Truth, 1948, Tier 2, EN).

For `contextoHistorico` also add: IVP Bible Background Commentary, Archaeological Study Bible, A History of Israel (Bright), Ancient Egypt and the OT (Currid, Pentateuch only).

**Every `fuentes[]` entry needs a `popup` sub-object** (added v1.2.0) — this powers an interactive author card in the viewer:
- `bio`: trilingual object `{es,en,pt}` — 2–3 sentences per language: who the author is, institution, standing in the Reformed world
- `metodo`: trilingual object `{es,en,pt}` — 2–3 sentences per language: their method and approach
- `aportacion`: trilingual object `{es,en,pt}` — 1–2 sentences per language: their SPECIFIC contribution to THIS book's record, not generic
- `obras`: plain string array — 3–5 key works (title + year); these are titles, no translation needed
- `url`: stable trusted link. Preference order: Theopedia → Ligonier → The Gospel Coalition → publisher page → Monergism → Wikipedia (last resort)

### Step 10 — Metadata
**Fields:** all `meta` fields
- `meta.estado` = `"validado"` if all required fields populated, else `"extraído"`
- `meta.confianza` starts at 1.0, subtract: −0.05 per field sourced from internal knowledge only · −0.10 per empty field · −0.15 per character with `nivelEvidencia = "especulativo"` · −0.10 if `contextoHistorico.arqueologia` is empty
- Record every judgment call in `meta.camposMarcados` with a clear `razon`

## Verse reference format (applies to every step)

Every inline verse reference must use the **canonical abbreviation for its language**. The viewer regex only linkifies known forms — unlisted abbreviations produce dead (unlinked) text.

- In `es` fields → use ES abbreviations (`Gn`, `Nm`, `Jn`, `He`, `Ap`, …)
- In `en` fields → use EN abbreviations (`Gen`, `Num`, `John`, `Heb`, `Rev`, …)
- In `pt` fields → use PT abbreviations (`Gn`, `Nm`, `Jo`, `Hb`, `Ap`, …)
- In `ref` key fields (language-neutral: `versiculosClave[].ref`, `pasajes[]`, `versiculoClave`, `anclasConfesionales[].genesis[]`) → always use the **ES** abbreviation
- Range: en-dash `–` → `Nm 6:24–26`
- Multi-verse: comma → `Lc 24:27,44`
- **Chapter-only and chapter-range references are valid** — omit the colon+verse when citing an entire chapter or span of chapters: `Nm 16`, `Nm 22–24`. These link correctly.
- **Every reference in a semicolon list must be fully qualified** — never omit the book prefix after `;`. Write `He 3:1–6; He 8:6`, not `He 3:1–6; 8:6`. Write `Nm 1; Nm 26`, not `Nm 1; 26`.

Full canonical table per language: see `references/controlled-vocabularies.md` → **Canonical verse reference abbreviations**.

## Quality checklist

Before outputting the final JSON, verify every item:
- [ ] `capitulosTotal` is present and correct (integer, canonical chapter count — e.g. `16` for Romans)
- [ ] `autor.nombre` is a **trilingual `{es,en,pt}` object**, not a flat Spanish string
- [ ] All trilingual fields have ES, EN, and PT populated — this includes `tiposYSombras[]`, `anclasConfesionales[].titulo/resumen`, `versiculosClave[].nota`, `fuentes[].popup.bio/metodo/aportacion`, `contextoHistorico.geografia[].lugar/identificacionModerna`, `civilizaciones[].nombre`, `fuentesANE[].nombre/origen`
- [ ] `contextoHistorico.periodoHistorico` is a **trilingual `{es,en,pt}` object**, not a flat string
- [ ] Every `teologiaSistematica[].categoria` is a **trilingual `{es,en,pt}` object** (not a flat Spanish string from the controlled vocabulary)
- [ ] Every `teologiaSistematica[]` entry has a `distintivaReformada` trilingual field
- [ ] All verse refs in `es` text use ES abbreviations, `en` text use EN abbreviations, `pt` text use PT abbreviations (see canonical table in `references/controlled-vocabularies.md`)
- [ ] All enum fields use only controlled values (check against `references/controlled-vocabularies.md`)
- [ ] `contextoHistorico` is populated with all 6 sub-fields, `geografia` has ≥3 entries, `fuentesANE` has ≥1 entry (OT books)
- [ ] Every character has both `biografiaBiblica` and `biografiaHistorica`, each citing at least one verse
- [ ] `tiposYSombras` has at least one entry for OT books and each item is a `{es,en,pt}` object (not a plain string)
- [ ] `versiculosClave` has 2–5 entries and each is a `{ref, es, en, pt, nota}` object (not a bare string)
- [ ] `anclasConfesionales` entries are full WCF objects (not plain `"WCF Cap. N — Title"` strings)
- [ ] `fuentes[].camposUtilizados` is a `{es:[],en:[],pt:[]}` trilingualArray (not a flat string array)
- [ ] `teologiaSistematica` has ≥3 entries, each complete with `categoria`/`resumen`/`pasajes`/`ensenanza`
- [ ] No `ensenanza` gloss starts with a verse reference — each gloss is pure explanatory text (the ref is already in `pasajes`)
- [ ] `resumenCapitulos` covers every chapter with no gaps
- [ ] Every `resumenCapitulos[]` entry has a non-empty `era` field matching `historiaRedentora.epoca`
- [ ] `referenciasRelacionadas` entries (when present) each have `ref` (ES abbreviation) and `tipo` from the controlled enum; `nota` is trilingual `{es,en,pt}` if present
- [ ] Every `resumenCapitulos[]` entry has `temasBiblicoteologicos.principal` set to an exact controlled-vocabulary string; `secundarios` (if present) has ≤ 3 entries with no duplicates of `principal`
- [ ] `resumenGeneral` is present with `{es, en, pt}` populated; cites specific chapter ranges and verse anchors; reads as a narrative/argumentative arc appropriate to the book's genre; does not repeat `proposito` or author information
- [ ] `meta.confianza` is calculated, not left at default
- [ ] `fuentes` lists ≥3 sources, each with a complete `popup` block (bio/metodo/aportacion are trilingual objects)

## Conflict resolution rules

1. **Authorship** → Reformed tradition wins (Mosaic authorship of Pentateuch, Pauline authorship of Pastorals, Petrine authorship of 2 Peter)
2. **Dating** → choose the earlier/conservative date consistent with the Reformed position
3. **Theology** → Westminster Confession and covenant theology take precedence
4. **Historical conflicts** → document both positions in `contextoHistorico.controversiasHistoricas` AND the relevant character's `biografiaHistorica.concordanciaConTexto`
5. **Character role** → follow the canonical text's own presentation
6. **ANE parallels** → acknowledge literary parallels without conceding dependence; the biblical text subverts, not derives from, ANE sources

## Output — split-and-merge approach (required)

Bible book records are large. Writing the entire record as one JSON block risks hitting output token limits and makes errors hard to isolate. **Always split the output into part files, then merge with a script.** Never attempt to produce the final JSON in a single write.

### Part file naming

Write one file per pipeline step, using the scratchpad directory:

| File | Steps |
|---|---|
| `[book]-part1-identification.json` | Steps 0–2: `id`, `testamento`, `division`, `titulo`, `autor`, `año`, `idiomaOriginal`, `escritoEn`, `resumenGeneral` |
| `[book]-part2-historical.json` | Step 3: entire `contextoHistorico` object |
| `[book]-part3-canonical-literary.json` | Steps 4–5: `historiaRedentora`, `aportacionAlCanon`, `genero`, `palabraClave`, `destinatario`, `proposito` |
| `[book]-part4-characters.json` | Step 6: `personajes` array |
| `[book]-part5-theology.json` | Step 7: `teologiaSistematica`, `anclasConfesionales`, `versiculosClave`, `distintivasReformadas` |
| `[book]-part6-chapters.json` | Step 8: `resumenCapitulos` array · Step 8b: overwrites in place adding `temasBiblicoteologicos` |
| `[book]-part7-sources.json` | Step 9: `fuentes` array |
| `[book]-part8-meta.json` | Step 10: `meta` object |

Each part file must be a valid JSON object containing only the top-level keys for that step — not a complete record.

### Merge script

After all 8 parts are written, create and run a merge script in the scratchpad:

```js
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const BOOK = 'Exodus'; // change per book

const parts = [
  `${BOOK.toLowerCase()}-part1-identification.json`,
  `${BOOK.toLowerCase()}-part2-historical.json`,
  `${BOOK.toLowerCase()}-part3-canonical-literary.json`,
  `${BOOK.toLowerCase()}-part4-characters.json`,
  `${BOOK.toLowerCase()}-part5-theology.json`,
  `${BOOK.toLowerCase()}-part6-chapters.json`,
  `${BOOK.toLowerCase()}-part7-sources.json`,
  `${BOOK.toLowerCase()}-part8-meta.json`,
];

let merged = {};
for (const file of parts) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  merged = { ...merged, ...data };
}

const out = path.join(DIR, `CANON-${BOOK}.json`);
fs.writeFileSync(out, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Written: ${out}`);
console.log(`Keys: ${Object.keys(merged).join(', ')}`);
```

Run it: `node merge-[book].js`

### Validate before delivering

Run the schema validator against the merged file:

```
python3 references/validate_schema.py references/canon-book.schema.json CANON-[BookName].json
```

Fix all reported errors before delivering. Common issues:
- `null` values in pipeline historial dates → replace with ISO 8601 strings
- Verse ref ranges in `genesis[]` fields (e.g. `Ex 21:1–23:19`) → use only single refs or the first verse of the range
- Missing required trilingual fields — check the quality checklist

Once the validator reports `✅ VALID`, copy the file to `canon/public/data/[book-lowercase].json` (the single data directory served by the app) and mention that the `canon-bible-viewer` skill can render it as an interactive app.

## Reference files

- `references/schema.md` — Complete JSON Schema: every field, type, and nesting structure
- `references/controlled-vocabularies.md` — Full 66-book canonical order table and every enum's allowed values
- `references/source-hierarchy.md` — Where to search online, what's always available internally, and citation tiering
- `references/canon-book.schema.json` — Formal JSON Schema (draft 2020-12) for automated validation
- `references/validate_schema.py` — Standalone Python validator; run `python3 validate_schema.py canon-book.schema.json YourBook.json` to check a finished record before delivering it
