# CANON Pipeline — Complete Reference File
**Curated Annotation Network for Old & New Testaments**
Version: 1.1.0 | Reformed Protestant | Covenant Theology | NBLA · ESV · NAA

---

## HOW TO USE THIS FILE

Upload this file to any Claude conversation and say:
> "Run the CANON Pipeline on [book name]"
> "Genera el registro CANON para [libro]"

Claude will read this file and fully populate a structured JSON record for any of the 66 books of the Protestant Bible using free online sources and internal Reformed scholarship knowledge.

---

## CORE PRINCIPLES

1. **Reformed Protestant theology** is the interpretive lens for every field
2. **Covenant theology** framework — not dispensational
3. **Christocentric reading** — the entire OT points forward to Christ
4. **Westminster Confession** is the confessional anchor
5. **Bible versions locked**: ES → NBLA · EN → ESV · PT → NAA
6. **Trust internal knowledge** — if online sources are unavailable, use internal knowledge confidently
7. **Conflicts between sources** → choose the position most consistent with Reformed theology

---

## SOURCE HIERARCHY

### Free Online Sources (search in this order)
| Priority | Source | URL | Best For |
|---|---|---|---|
| 1 | Bible Gateway | biblegateway.com | Book intros, chapter summaries, text |
| 1 | API.Bible | api.bible | ESV + NBLA text and metadata |
| 2 | Blue Letter Bible | blueletterbible.org | Author, date, word studies |
| 3 | Monergism | monergism.com | Reformed theology resources |
| 3 | Calvin's Commentaries | ccel.org | Purpose, themes, Reformed distinctives |

### Internal Knowledge Sources (always available)
- ESV Study Bible — all fields
- Reformation Study Bible (Sproul/Ligonier) — Reformed distinctives
- Systematic Theology — Wayne Grudem — theology tags
- Biblical Theology — Geerhardus Vos — redemptive history, typology
- Introduction to OT/NT — Longman & Dillard — author, date, genre
- NICOT / NICNT commentaries — character biographies
- A History of Israel — John Bright — historical biographies
- Ancient Egypt and the OT — John Currid — Pentateuch historical context

---

## CONTROLLED VOCABULARIES

### Testamento
`"Antiguo"` | `"Nuevo"`

### División (10 values)
`"Pentateuco"` | `"Histórico"` | `"Sabiduría y Poesía"` | `"Profetas Mayores"` | `"Profetas Menores"` | `"Evangelios"` | `"Historia"` | `"Epístolas Paulinas"` | `"Epístolas Generales"` | `"Profecía"`

### División — 66 Books Reference
| # | Book ES | Book EN | Testament | División |
|---|---|---|---|---|
| 1 | Génesis | Genesis | Antiguo | Pentateuco |
| 2 | Éxodo | Exodus | Antiguo | Pentateuco |
| 3 | Levítico | Leviticus | Antiguo | Pentateuco |
| 4 | Números | Numbers | Antiguo | Pentateuco |
| 5 | Deuteronomio | Deuteronomy | Antiguo | Pentateuco |
| 6 | Josué | Joshua | Antiguo | Histórico |
| 7 | Jueces | Judges | Antiguo | Histórico |
| 8 | Rut | Ruth | Antiguo | Histórico |
| 9 | 1 Samuel | 1 Samuel | Antiguo | Histórico |
| 10 | 2 Samuel | 2 Samuel | Antiguo | Histórico |
| 11 | 1 Reyes | 1 Kings | Antiguo | Histórico |
| 12 | 2 Reyes | 2 Kings | Antiguo | Histórico |
| 13 | 1 Crónicas | 1 Chronicles | Antiguo | Histórico |
| 14 | 2 Crónicas | 2 Chronicles | Antiguo | Histórico |
| 15 | Esdras | Ezra | Antiguo | Histórico |
| 16 | Nehemías | Nehemiah | Antiguo | Histórico |
| 17 | Ester | Esther | Antiguo | Histórico |
| 18 | Job | Job | Antiguo | Sabiduría y Poesía |
| 19 | Salmos | Psalms | Antiguo | Sabiduría y Poesía |
| 20 | Proverbios | Proverbs | Antiguo | Sabiduría y Poesía |
| 21 | Eclesiastés | Ecclesiastes | Antiguo | Sabiduría y Poesía |
| 22 | Cantares | Song of Solomon | Antiguo | Sabiduría y Poesía |
| 23 | Isaías | Isaiah | Antiguo | Profetas Mayores |
| 24 | Jeremías | Jeremiah | Antiguo | Profetas Mayores |
| 25 | Lamentaciones | Lamentations | Antiguo | Profetas Mayores |
| 26 | Ezequiel | Ezekiel | Antiguo | Profetas Mayores |
| 27 | Daniel | Daniel | Antiguo | Profetas Mayores |
| 28 | Oseas | Hosea | Antiguo | Profetas Menores |
| 29 | Joel | Joel | Antiguo | Profetas Menores |
| 30 | Amós | Amos | Antiguo | Profetas Menores |
| 31 | Abdías | Obadiah | Antiguo | Profetas Menores |
| 32 | Jonás | Jonah | Antiguo | Profetas Menores |
| 33 | Miqueas | Micah | Antiguo | Profetas Menores |
| 34 | Nahúm | Nahum | Antiguo | Profetas Menores |
| 35 | Habacuc | Habakkuk | Antiguo | Profetas Menores |
| 36 | Sofonías | Zephaniah | Antiguo | Profetas Menores |
| 37 | Hageo | Haggai | Antiguo | Profetas Menores |
| 38 | Zacarías | Zechariah | Antiguo | Profetas Menores |
| 39 | Malaquías | Malachi | Antiguo | Profetas Menores |
| 40 | Mateo | Matthew | Nuevo | Evangelios |
| 41 | Marcos | Mark | Nuevo | Evangelios |
| 42 | Lucas | Luke | Nuevo | Evangelios |
| 43 | Juan | John | Nuevo | Evangelios |
| 44 | Hechos | Acts | Nuevo | Historia |
| 45 | Romanos | Romans | Nuevo | Epístolas Paulinas |
| 46 | 1 Corintios | 1 Corinthians | Nuevo | Epístolas Paulinas |
| 47 | 2 Corintios | 2 Corinthians | Nuevo | Epístolas Paulinas |
| 48 | Gálatas | Galatians | Nuevo | Epístolas Paulinas |
| 49 | Efesios | Ephesians | Nuevo | Epístolas Paulinas |
| 50 | Filipenses | Philippians | Nuevo | Epístolas Paulinas |
| 51 | Colosenses | Colossians | Nuevo | Epístolas Paulinas |
| 52 | 1 Tesalonicenses | 1 Thessalonians | Nuevo | Epístolas Paulinas |
| 53 | 2 Tesalonicenses | 2 Thessalonians | Nuevo | Epístolas Paulinas |
| 54 | 1 Timoteo | 1 Timothy | Nuevo | Epístolas Paulinas |
| 55 | 2 Timoteo | 2 Timothy | Nuevo | Epístolas Paulinas |
| 56 | Tito | Titus | Nuevo | Epístolas Paulinas |
| 57 | Filemón | Philemon | Nuevo | Epístolas Paulinas |
| 58 | Hebreos | Hebrews | Nuevo | Epístolas Generales |
| 59 | Santiago | James | Nuevo | Epístolas Generales |
| 60 | 1 Pedro | 1 Peter | Nuevo | Epístolas Generales |
| 61 | 2 Pedro | 2 Peter | Nuevo | Epístolas Generales |
| 62 | 1 Juan | 1 John | Nuevo | Epístolas Generales |
| 63 | 2 Juan | 2 John | Nuevo | Epístolas Generales |
| 64 | 3 Juan | 3 John | Nuevo | Epístolas Generales |
| 65 | Judas | Jude | Nuevo | Epístolas Generales |
| 66 | Apocalipsis | Revelation | Nuevo | Profecía |

### Época Redentora (7 values)
`"Creación y Caída"` | `"Promesa"` | `"Ley"` | `"Anticipación Profética"` | `"Cumplimiento"` | `"Aplicación"` | `"Consumación"`

### Contexto de Pacto (6 values)
`"Adámico"` | `"Noáico"` | `"Abrahánico"` | `"Mosaico"` | `"Davídico"` | `"Nuevo"`

### Rol de Personaje
`"protagonista"` | `"antagonista"` | `"secundario"` | `"tipo"`

### Nivel de Evidencia Histórica
`"alto"` | `"medio"` | `"bajo"` | `"especulativo"`

### Estado del Pipeline
`"borrador"` | `"extraído"` | `"validado"` | `"publicado"`

### Teología Sistemática (controlled vocabulary)
`Bibliología` · `Teología Propia` · `Cristología` · `Pneumatología` · `Antropología` · `Hamartiología` · `Soteriología` · `Eclesiología` · `Escatología` · `Angelología` · `Creación` · `Providencia` · `Pacto` · `Elección` · `Santificación` · `Justificación` · `Ley`

---

## THE 9-STEP WORKFLOW

### STEP 0 — IDENTIFY & PREPARE
- Confirm book name in ES / EN / PT
- Set: `testamento`, `division`, `ordenCanon`, `ordenEnDivision` from the table above
- Set: `meta.estado` = `"extraído"`
- Set: `meta.versionBiblia` = `{ es: "NBLA", en: "ESV", pt: "NAA" }`
- Set: `meta.pipeline.faseActual` = 3

---

### STEP 1 — IDENTIFICATION
**Fields:** `id`, `testamento`, `division`, `titulo`, `tituloOriginal`, `transliteracion`, `significado`

- `id`: canonical order 1–66 from table above
- `tituloOriginal`: Hebrew characters (OT) or Greek (NT)
- `transliteracion`: phonetic romanization
- `significado`: literal meaning of the original title
- **Source:** Internal knowledge

---

### STEP 2 — AUTHORSHIP & DATING
**Fields:** `autor`, `año`, `idiomaOriginal`, `escritoEn`

- Search Blue Letter Bible → book introduction
- Confirm with Bible Gateway
- Debated authorship → `autor.tradicional` = `true` + populate `autor.nota`
- Dates: negative = B.C., positive = A.D.
- OT = Hebrew (except Daniel 2–7 and Ezra 4–7 = Aramaic), NT = Greek
- **Conflict rule:** Choose position consistent with Reformed tradition

---

### STEP 3 — CANONICAL CONTEXT
**Fields:** `ordenEnDivision`, `ordenCanon`, `historiaRedentora`, `aportacionAlCanon`

Epoch assignment rules:
- Genesis 1–11 → Creación y Caída
- Genesis 12 – Deuteronomy → Promesa / Ley
- Joshua – Malachi → Promesa / Ley / Anticipación Profética
- Gospels + Acts → Cumplimiento
- Epistles → Aplicación
- Revelation → Consumación

For `enfoqueCristologico`: how does this book reveal or prefigure Christ? Use Vos framework.
For `tiposYSombras`: list key types with Scripture cross-references.
For `aportacionAlCanon`: what does ONLY this book contribute to the whole canon?

- **Source:** Internal knowledge (Vos, Grudem, Sproul) + Monergism.com

---

### STEP 4 — LITERARY FIELDS
**Fields:** `genero`, `palabraClave`, `destinatario`, `proposito`

- Search Bible Gateway book introduction
- `destinatario`: be specific — not just "Israel" but "the nation of Israel during the wilderness period"
- `proposito`: state both historical purpose AND theological purpose

---

### STEP 5 — CHARACTERS
**Fields:** all `personajes[]` fields

For each named character with a significant narrative role:

**5a. Classify:** `principal`, `rol`, `capitulosActivo`

**5b. Biblical Biography (`biografiaBiblica`)**
- From canonical text ONLY — no extra-biblical traditions
- Complete narrative arc from Scripture
- Cite exact verse references
- `fuenteTexto` = `{ es: "NBLA", en: "ESV", pt: "NAA" }`

**5c. Historical Biography (`biografiaHistorica`)**
- Search Blue Letter Bible for historical/archaeological context
- Use internal knowledge: Bright, Currid, NICOT/NICNT
- `nivelEvidencia`:
  - `alto` — named in external records (Cyrus, Nebuchadnezzar)
  - `medio` — cultural context confirmed, not named externally
  - `bajo` — minimal external evidence
  - `especulativo` — no external evidence
- `concordanciaConTexto`: where history confirms or diverges from the text

**5d. Theological fields**
- `significadoTeologico`: why does this character matter in Reformed redemptive-history?
- `tipo`: does this character function as a type of Christ?
- `caracterMoral`: virtues and flaws from a biblical-Reformed perspective
- `enElNuevoTestamento`: referenced or interpreted in the NT?

---

### STEP 6 — THEOLOGY
**Fields:** `teologiaSistematica[]`, `anclasConfesionales`, `versiculosClave`, `distintivasReformadas`

- Search Monergism.com and ccel.org (Calvin's Commentaries)
- `anclasConfesionales`: cite specific WCF chapters (e.g. "WCF Cap. 7 — Del pacto")
- `versiculosClave`: 2–5 verses — prioritize those cited in NT or in Grudem
- `distintivasReformadas`: what does Reformed theology uniquely emphasize here?

**`teologiaSistematica` is now an array of OBJECTS, not strings.** Each object represents one doctrinal category present in this book, and must contain:
- `categoria`: one value from the controlled vocabulary
- `resumen`: 2–4 sentence explanation of what THIS book teaches about this doctrine (trilingual: es/en/pt)
- `pasajes`: 2–6 specific verse references from this book that are the primary loci for this doctrine
- `ensenanza`: one sentence per passage explaining what that passage contributes to the doctrine (trilingual: es/en/pt — can be a single shared string keyed to the verse array)

**Rules:**
- Only include categories that are actually prominent in this specific book — not every book has every doctrine
- `pasajes` must be verses FROM this book only (cross-references go in `resumen` prose)
- Minimum 3 entries per book; maximum matches the doctrinal richness of the book
- Reformed/Westminster lens applies to all summaries

---

### STEP 7 — CHAPTER SUMMARIES
**Fields:** all `resumenCapitulos[]` fields

- Search Bible Gateway for chapter summaries
- Group into natural narrative/thematic units — no gaps allowed
- Each unit needs: `titulo` (3–6 words), `descripcion` (2–4 sentences), `eventoClave`, `versiculoClave`
- Always connect to the redemptive-historical flow

---

### STEP 8 — SOURCES REGISTRY
**Fields:** all `fuentes[]` fields

Always include these defaults:
- ESV Study Bible (Crossway, 2008) — Tier 1 — EN
- Reformation Study Bible (Sproul, Ligonier, 2015) — Tier 1 — EN
- Biblia de Estudio de la Reforma (NBLA ed.) — Tier 1 — ES
- Systematic Theology — Grudem (Zondervan, 1994) — Tier 2 — EN
- Biblical Theology — Vos (Banner of Truth, 1975) — Tier 2 — EN

---

### STEP 9 — METADATA
**Fields:** all `meta[]` fields

- `meta.estado` = `"validado"` if all required fields populated, else `"extraído"`
- Calculate `meta.confianza` from 1.0:
  - −0.05 per field from internal knowledge only
  - −0.10 per empty field
  - −0.15 per character with `nivelEvidencia` = `"especulativo"`
- Record judgment calls in `meta.camposMarcados`

---

## QUALITY CHECKLIST

Before outputting final JSON, verify:
- [ ] All trilingual fields have ES, EN, and PT
- [ ] All enum fields use only controlled values above
- [ ] Every character has both `biografiaBiblica` and `biografiaHistorica`
- [ ] Every character biography cites at least one verse
- [ ] `tiposYSombras` has at least one entry for OT books
- [ ] `versiculosClave` has 2–5 entries
- [ ] `teologiaSistematica` has at least 3 entries, each with `categoria`, `resumen` (trilingual), `pasajes` (≥2 refs), and `ensenanza` (trilingual)
- [ ] `resumenCapitulos` covers every chapter — no gaps
- [ ] `meta.confianza` is calculated
- [ ] `fuentes` lists at least 3 sources

---

## JSON SCHEMA — ALL 75 FIELDS

```json
{
  "id": "integer 1–66",
  "testamento": "enum: Antiguo | Nuevo",
  "division": "enum: 10 values",
  "titulo": { "es": "", "en": "", "pt": "" },
  "tituloOriginal": "Hebrew or Greek characters",
  "transliteracion": "phonetic romanization",
  "significado": "literal meaning",

  "autor": {
    "nombre": "",
    "tradicional": "boolean",
    "nota": { "es": "", "en": "", "pt": "" }
  },
  "año": {
    "desde": "integer (negative=BC)",
    "hasta": "integer",
    "display": { "es": "", "en": "", "pt": "" }
  },
  "idiomaOriginal": "enum: Hebreo | Griego | Arameo",
  "escritoEn": { "es": "", "en": "", "pt": "" },

  "ordenEnDivision": "integer",
  "ordenCanon": "integer 1–66",
  "historiaRedentora": {
    "epoca": "enum: 7 values",
    "contextoPacto": "enum: 6 values",
    "enfoqueCristologico": { "es": "", "en": "", "pt": "" },
    "tiposYSombras": ["array of strings with Scripture refs"]
  },
  "aportacionAlCanon": { "es": "", "en": "", "pt": "" },

  "genero": { "es": "", "en": "", "pt": "" },
  "palabraClave": {
    "es": ["max 2 words"],
    "en": ["max 2 words"],
    "pt": ["max 2 words"]
  },
  "destinatario": { "es": "", "en": "", "pt": "" },
  "proposito": { "es": "", "en": "", "pt": "" },

  "personajes": [
    {
      "nombre": { "es": "", "en": "", "pt": "" },
      "principal": "boolean",
      "rol": "enum: protagonista | antagonista | secundario | tipo",
      "capitulosActivo": ["array of integers"],
      "descripcion": { "es": "", "en": "", "pt": "" },
      "acciones": { "es": "", "en": "", "pt": "" },
      "significadoTeologico": { "es": "", "en": "", "pt": "" },
      "tipo": { "es": "", "en": "", "pt": "" },
      "caracterMoral": { "es": "", "en": "", "pt": "" },
      "biografiaBiblica": {
        "resumen": { "es": "", "en": "", "pt": "" },
        "fuenteTexto": { "es": "NBLA", "en": "ESV", "pt": "NAA" },
        "versiculosClave": ["array of verse refs"]
      },
      "biografiaHistorica": {
        "resumen": { "es": "", "en": "", "pt": "" },
        "fuentes": [
          {
            "titulo": "",
            "autor": "",
            "año": "integer",
            "editorial": "",
            "nivel": "integer 1|2|3",
            "camposUtilizados": ["array"]
          }
        ],
        "nivelEvidencia": "enum: alto | medio | bajo | especulativo",
        "concordanciaConTexto": { "es": "", "en": "", "pt": "" }
      },
      "versiculosAsociados": ["array of verse refs"],
      "aparicionesEnOtrosLibros": ["array of book references"],
      "enElNuevoTestamento": { "es": "", "en": "", "pt": "" }
    }
  ],

  "teologiaSistematica": [
    {
      "categoria": "enum: from controlled vocabulary",
      "resumen": { "es": "2–4 sentences on what this book teaches about this doctrine", "en": "", "pt": "" },
      "pasajes": ["array of 2–6 verse refs from THIS book only"],
      "ensenanza": { "es": "one-sentence gloss per passage, keyed to the pasajes array order", "en": "", "pt": "" }
    }
  ],
  "anclasConfesionales": ["WCF chapter references"],
  "versiculosClave": ["2–5 verse refs"],
  "distintivasReformadas": { "es": "", "en": "", "pt": "" },

  "fuentes": [
    {
      "titulo": "",
      "autor": "",
      "año": "integer",
      "editorial": "",
      "nivel": "integer 1|2|3",
      "idioma": "enum: es | en | pt | todos",
      "camposUtilizados": ["array"]
    }
  ],

  "resumenCapitulos": [
    {
      "rangoInicio": "integer",
      "rangoFin": "integer",
      "titulo": { "es": "", "en": "", "pt": "" },
      "descripcion": { "es": "", "en": "", "pt": "" },
      "eventoClave": { "es": "", "en": "", "pt": "" },
      "versiculoClave": "string e.g. 'Gn 1:1'"
    }
  ],

  "meta": {
    "version": "1.0.0",
    "estado": "enum: borrador | extraído | validado | publicado",
    "confianza": "decimal 0.0–1.0",
    "camposMarcados": [
      {
        "campo": "",
        "razon": "",
        "resuelto": "boolean",
        "fechaMarcado": "ISO 8601"
      }
    ],
    "ultimaActualizacion": "ISO 8601",
    "revisadoPor": {
      "nombre": "",
      "rol": "enum: teólogo | editor | administrador",
      "fechaRevision": "ISO 8601"
    },
    "versionBiblia": {
      "es": "NBLA",
      "en": "ESV",
      "pt": "NAA"
    },
    "pipeline": {
      "faseActual": "integer 1–5",
      "historial": [
        {
          "fase": "integer",
          "nombre": "enum: diseño_esquema | registro_fuentes | extraccion | validacion | renderizado",
          "completado": "boolean",
          "fechaInicio": "ISO 8601",
          "fechaFin": "ISO 8601",
          "errores": ["array of strings"]
        }
      ]
    }
  }
}
```

---

## CONFLICT RESOLUTION RULES

1. **Authorship** → Reformed tradition wins (Mosaic authorship of Pentateuch, Pauline authorship of Pastorals, Petrine authorship of 2 Peter)
2. **Dating** → choose the earlier/conservative date consistent with Reformed position
3. **Theology** → Westminster Confession and covenant theology take precedence
4. **Historical conflicts** → document both positions in `concordanciaConTexto`
5. **Character role** → follow the canonical text's own presentation

---

*CANON Pipeline v1.1.0 — Reformed Protestant · NBLA / ESV / NAA*
*Schema change v1.1.0: `teologiaSistematica` upgraded from flat string array to structured objects with `categoria`, `resumen` (trilingual), `pasajes`, and `ensenanza` (trilingual) per category.*
*To run: upload this file and say "Run the CANON Pipeline on [book name]"*
