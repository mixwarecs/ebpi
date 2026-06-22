# CANON Record Schema (v1.3.0)

This is the complete field-by-field shape every CANON book record must follow. A formal JSON Schema (draft 2020-12) version of this also exists for automated validation — see `canon-book.schema.json` if you need to validate a record programmatically; this document is the field-by-field human reference for writing one.

## Conventions used below

- `{ "es": "", "en": "", "pt": "" }` — a **trilingual object**: every field shaped like this needs real content in all three languages, not just Spanish
- `{ "es": [], "en": [], "pt": [] }` — a **trilingualArray**: an array of strings per language (e.g. keyword lists, field names)
- `"enum: X | Y"` — value must be exactly one of the listed options (see `controlled-vocabularies.md`)
- Arrays of objects (`personajes[]`, `fuentes[]`, etc.) repeat their inner shape once per item

## Full annotated example structure

```json
{
  "id": "integer 1–66",
  "testamento": "enum: Antiguo | Nuevo",
  "division": "enum: 10 values",
  "titulo": { "es": "", "en": "", "pt": "" },
  "tituloOriginal": "Hebrew or Greek characters",
  "transliteracion": "phonetic romanization",
  "significado": { "es": "", "en": "", "pt": "" },
  "capitulosTotal": 16,

  "autor": {
    "nombre": { "es": "", "en": "", "pt": "" },
    "tradicional": "boolean",
    "nota": { "es": "", "en": "", "pt": "" }
  },
  "año": {
    "desde": "integer (negative=BC)",
    "hasta": "integer",
    "display": { "es": "Fecha de escritura: ...", "en": "", "pt": "" }
  },
  "idiomaOriginal": "enum: Hebreo | Griego | Arameo",
  "escritoEn": { "es": "", "en": "", "pt": "" },

  "contextoHistorico": {
    "periodoHistorico": { "es": "", "en": "", "pt": "" },
    "geografia": [
      {
        "lugar":                 { "es": "", "en": "", "pt": "" },
        "identificacionModerna": { "es": "", "en": "", "pt": "" },
        "significancia":         { "es": "", "en": "", "pt": "" }
      }
    ],
    "civilizaciones": [
      {
        "nombre":             { "es": "", "en": "", "pt": "" },
        "rolEnElTexto":       { "es": "", "en": "", "pt": "" },
        "estadoArqueologico": { "es": "", "en": "", "pt": "" }
      }
    ],
    "arqueologia": { "es": "", "en": "", "pt": "" },
    "fuentesANE": [
      {
        "nombre":    { "es": "", "en": "", "pt": "" },
        "origen":    { "es": "", "en": "", "pt": "" },
        "relevancia": { "es": "", "en": "", "pt": "" }
      }
    ],
    "controversiasHistoricas": { "es": "", "en": "", "pt": "" },
    "cronologiaInterna": { "es": "", "en": "", "pt": "" }
  },

  "ordenEnDivision": "integer",
  "ordenCanon": "integer 1–66",
  "historiaRedentora": {
    "epoca": "enum: 7 values",
    "contextoPacto": "enum: 6 values",
    "enfoqueCristologico": { "es": "", "en": "", "pt": "" },
    "tiposYSombras": [
      { "es": "Tipo con referencia escritural (Ro 5:14)", "en": "", "pt": "" }
    ]
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
      "nombre":  { "es": "", "en": "", "pt": "" },
      "hebreo":  "Hebrew (OT) or Greek (NT) characters — optional field",
      "principal": "boolean",
      "rol": "enum: protagonista | antagonista | secundario | tipo",
      "capitulosActivo": ["array of integers"],
      "descripcion":          { "es": "", "en": "", "pt": "" },
      "acciones":             { "es": "", "en": "", "pt": "" },
      "significadoTeologico": { "es": "", "en": "", "pt": "" },
      "tipo":                 { "es": "", "en": "", "pt": "" },
      "caracterMoral":        { "es": "", "en": "", "pt": "" },
      "biografiaBiblica": {
        "resumen":    { "es": "", "en": "", "pt": "" },
        "fuenteTexto": { "es": "NBLA", "en": "ESV", "pt": "NAA" },
        "versiculosClave": ["array of bare verse refs e.g. 'Gn 1:1'"]
      },
      "biografiaHistorica": {
        "resumen": { "es": "", "en": "", "pt": "" },
        "fuentes": [
          {
            "titulo": "",
            "autor":  "",
            "año":  "integer",
            "editorial": "",
            "nivel": "integer 1|2|3",
            "camposUtilizados": ["plain string array — not trilingual here"]
          }
        ],
        "nivelEvidencia": "enum: alto | medio | bajo | especulativo",
        "concordanciaConTexto": { "es": "", "en": "", "pt": "" }
      },
      "versiculosAsociados": ["array of bare verse refs"],
      "aparicionesEnOtrosLibros": ["array of book abbreviations"],
      "enElNuevoTestamento": { "es": "", "en": "", "pt": "" }
    }
  ],

  "teologiaSistematica": [
    {
      "categoria":          { "es": "Elección", "en": "Election", "pt": "Eleição" },
      "resumen":            { "es": "2–4 sentences on what this book teaches about this doctrine", "en": "", "pt": "" },
      "pasajes":            ["array of 2–6 bare verse refs from THIS book only"],
      "ensenanza":          { "es": "one-sentence gloss per passage, entries separated by · ", "en": "", "pt": "" },
      "distintivaReformada": { "es": "1–2 sentences on the Reformed/covenant emphasis on this doctrine in this book", "en": "", "pt": "" }
    }
  ],

  "anclasConfesionales": [
    {
      "cap":      "e.g. 'Cap. 4'",
      "titulo":   { "es": "De la Creación", "en": "Of Creation", "pt": "Da Criação" },
      "doctrinas": ["Creación", "Antropología"],
      "resumen":  { "es": "2–4 sentence summary of this WCF chapter", "en": "", "pt": "" },
      "genesis":  ["array of bare verse refs from this book relevant to the chapter"],
      "url":      "stable URL to Ligonier or WCF text"
    }
  ],

  "versiculosClave": [
    {
      "ref":  "bare verse ref e.g. 'Gn 1:1'",
      "es":   "Full verse text in Spanish (NBLA)",
      "en":   "Full verse text in English (ESV)",
      "pt":   "Full verse text in Portuguese (NAA)",
      "nota": { "es": "Theological note 2–4 sentences", "en": "", "pt": "" }
    }
  ],

  "distintivasReformadas": { "es": "", "en": "", "pt": "" },

  "fuentes": [
    {
      "titulo":    "",
      "autor":     "",
      "año":  "integer",
      "editorial": "",
      "nivel":     "integer 1|2|3",
      "idioma":    "enum: es | en | pt | todos",
      "camposUtilizados": {
        "es": ["Introducción", "Teología"],
        "en": ["Introduction", "Theology"],
        "pt": ["Introdução", "Teologia"]
      },
      "popup": {
        "bio":        { "es": "2–3 sentences: who the author is, institution, standing in Reformed world", "en": "", "pt": "" },
        "metodo":     { "es": "2–3 sentences: how they approach their work, their method", "en": "", "pt": "" },
        "aportacion": { "es": "1–2 sentences: specific contribution to THIS book's CANON record", "en": "", "pt": "" },
        "obras": ["array of 3–5 key works: title (year)"],
        "url":  "stable trusted URL: Theopedia > Ligonier > TGC > publisher > Monergism > Wikipedia"
      }
    }
  ],

  "resumenCapitulos": [
    {
      "rangoInicio": "integer",
      "rangoFin":    "integer",
      "titulo":      { "es": "", "en": "", "pt": "" },
      "descripcion": { "es": "", "en": "", "pt": "" },
      "eventoClave": { "es": "", "en": "", "pt": "" },
      "versiculoClave": "bare verse ref e.g. 'Gn 1:1'"
    }
  ],

  "meta": {
    "version": "1.3.0",
    "estado": "enum: borrador | extraído | validado | publicado",
    "confianza": "decimal 0.0–1.0",
    "camposMarcados": [
      {
        "campo":        "",
        "razon":        "",
        "resuelto":     "boolean",
        "fechaMarcado": "ISO 8601"
      }
    ],
    "ultimaActualizacion": "ISO 8601",
    "revisadoPor": {
      "nombre":        "",
      "rol":           "enum: teólogo | editor | administrador",
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
          "fase":        "integer",
          "nombre":      "enum: diseño_esquema | registro_fuentes | extraccion | validacion | renderizado",
          "completado":  "boolean",
          "fechaInicio": "ISO 8601",
          "fechaFin":    "ISO 8601",
          "errores":     ["array of strings"]
        }
      ]
    }
  }
}
```

## Key validation rules not obvious from the shape above

- **`teologiaSistematica[].pasajes`** — minimum 2, maximum 6 verse refs, and they must be FROM this book only (cross-references belong in the prose `resumen`, not in `pasajes`)
- **`teologiaSistematica`** (top-level array) — minimum 3 entries total
- **`versiculosClave`** (top-level) — minimum 2, maximum 5 entries; each is a full object `{ref, es, en, pt, nota}`. The `nota` trilingual field is optional but strongly recommended — it provides the theological significance shown in the viewer's Key Verses tab
- **`anclasConfesionales`** — each entry is a **full WCF object** (not a plain string). Required fields: `cap`, `titulo` (trilingual), `doctrinas` (string array), `resumen` (trilingual), `genesis` (verse ref array), `url`
- **`historiaRedentora.tiposYSombras`** — each entry is a **trilingual object** `{es, en, pt}`. Include Scripture cross-references inside the prose string for each language, e.g. `"es": "Adán como tipo del segundo Adán, Cristo (Ro 5:14; 1Co 15:45–49)"`
- **`contextoHistorico.geografia[].lugar`** and **`.identificacionModerna`** — trilingual objects, not flat strings
- **`contextoHistorico.civilizaciones[].nombre`** — trilingual object, not flat string
- **`contextoHistorico.fuentesANE[].nombre`** and **`.origen`** — trilingual objects, not flat strings
- **`fuentes[].camposUtilizados`** — trilingualArray `{es:[], en:[], pt:[]}`, not a flat string array
- **`fuentes[].popup.bio/metodo/aportacion`** — trilingual objects `{es, en, pt}`, not flat strings
- **`personajes[].hebreo`** — optional string field for Hebrew (OT) or Greek (NT) characters; omit for NT characters where no original-language name is distinctive
- **`fuentes`** — minimum 3 entries; every entry requires a complete `popup` sub-object (added v1.2.0) — `bio`, `metodo`, `aportacion` (all trilingual), `obras[]`, `url`
- **`contextoHistorico.geografia`** — minimum 3 entries (added v1.2.0; required for every book, not optional)
- **`contextoHistorico.fuentesANE`** — minimum 1 entry for OT books
- **`personajes[].biografiaBiblica.fuenteTexto`** and **`meta.versionBiblia`** are both locked to the exact triple `{ "es": "NBLA", "en": "ESV", "pt": "NAA" }` — never vary these
- **`año.display.es`** must read "Fecha de escritura" as its label, not "Datación" or any other phrasing
- **`resumenCapitulos`** must cover every chapter of the book with no numeric gaps between consecutive units' `rangoFin`/`rangoInicio`
- **Verse reference format** — `"Libro Cap:Verso"` or `"Libro Cap:Verso-Verso"` (hyphen or en-dash both acceptable for ranges), e.g. `Gn 1:1`, `Gn 1:26-27`, `Ro 5:12–21`. Use the standard Spanish book abbreviations (Gn, Ex, Lv, Nm, Dt, Jos, Jue, Rt, 1S, 2S, 1R, 2R, 1Cr, 2Cr, Esd, Neh, Est, Job, Sal, Pr, Ec, Cnt, Is, Jer, Lm, Ez, Dn, Os, Jl, Am, Abd, Jon, Miq, Nah, Hab, Sof, Hag, Zac, Mal, Mt, Mr/Mc, Lc, Jn, Hch, Ro, 1Co, 2Co, Gá, Ef, Fil, Col, 1Ts, 2Ts, 1Ti, 2Ti, Tit, Flm, He, Stg, 1P, 2P, 1Jn, 2Jn, 3Jn, Jud, Ap)

## Schema version history

- **v1.0.0** — initial release; `teologiaSistematica` was a flat array of category-name strings
- **v1.1.0** — `teologiaSistematica` upgraded to structured objects (`categoria`, `resumen`, `pasajes`, `ensenanza`)
- **v1.2.0** — added `contextoHistorico` (Step 3) and `fuentes[].popup` (Step 9, interactive author/source cards). Steps renumbered 0–10
- **v1.3.0** — nine field corrections to match the real genesis.json data:
  - `historiaRedentora.tiposYSombras` items: `string` → `trilingual` object
  - `anclasConfesionales` items: `string` → full `wcfAnclaEntry` object
  - `versiculosClave` items: bare `verseRef` string → `versiculoClaveEntry` object `{ref, es, en, pt, nota?}`
  - `fuentes[].camposUtilizados`: flat `string[]` → `trilingualArray`
  - `fuentes[].popup.bio/metodo/aportacion`: flat `string` → `trilingual` object
  - `contextoHistorico.geografia[].lugar` and `.identificacionModerna`: `string` → `trilingual`
  - `contextoHistorico.civilizaciones[].nombre`: `string` → `trilingual`
  - `contextoHistorico.fuentesANE[].nombre` and `.origen`: `string` → `trilingual`
  - `personajes[].hebreo`: new optional string field for original-language name characters
