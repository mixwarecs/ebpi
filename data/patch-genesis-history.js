#!/usr/bin/env node
// Patches genesis.json: makes geography, civilization, and ANE fields trilingual.
//   - contextoHistorico.geografia[].lugar         → {es, en, pt}
//   - contextoHistorico.geografia[].identificacionModerna → {es, en, pt}
//   - contextoHistorico.civilizaciones[].nombre   → {es, en, pt}
//   - contextoHistorico.fuentesANE[].nombre        → {es, en, pt}
//   - contextoHistorico.fuentesANE[].origen        → {es, en, pt}

const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "genesis.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// ── 1. geografia ─────────────────────────────────────────────────────────────

const GEO_LUGAR = {
  "Ur de los Caldeos":   { es: "Ur de los Caldeos",   en: "Ur of the Chaldeans",       pt: "Ur dos Caldeus" },
  "Harán":               { es: "Harán",               en: "Haran",                     pt: "Harã" },
  "Canaán":              { es: "Canaán",              en: "Canaan",                    pt: "Canaã" },
  "Egipto":              { es: "Egipto",              en: "Egypt",                     pt: "Egito" },
  "Sodoma y Gomorra":    { es: "Sodoma y Gomorra",    en: "Sodom and Gomorrah",        pt: "Sodoma e Gomorra" },
  "Macpela / Hebrón":    { es: "Macpela / Hebrón",    en: "Machpelah / Hebron",        pt: "Macpela / Hebrom" },
};

const GEO_MODERNA = {
  "Tell el-Muqayyar, sur de Irak":
    { es: "Tell el-Muqayyar, sur de Irak",   en: "Tell el-Muqayyar, southern Iraq",                          pt: "Tell el-Muqayyar, sul do Iraque" },
  "Harran, Şanlıurfa, Turquía":
    { es: "Harran, Şanlıurfa, Turquía",       en: "Harran, Şanlıurfa, Turkey",                                pt: "Harran, Şanlıurfa, Turquia" },
  "Israel, Palestina, sur del Líbano y Siria":
    { es: "Israel, Palestina, sur del Líbano y Siria", en: "Israel, Palestine, southern Lebanon and Syria",   pt: "Israel, Palestina, sul do Líbano e Síria" },
  "República Árabe de Egipto":
    { es: "República Árabe de Egipto",        en: "Arab Republic of Egypt",                                   pt: "República Árabe do Egito" },
  "Posiblemente Tall el-Hammam, Jordania (debatido)":
    { es: "Posiblemente Tall el-Hammam, Jordania (debatido)", en: "Possibly Tall el-Hammam, Jordan (debated)", pt: "Possivelmente Tall el-Hammam, Jordânia (debatido)" },
  "Hebrón, Cisjordania — Cueva de los Patriarcas":
    { es: "Hebrón, Cisjordania — Cueva de los Patriarcas", en: "Hebron, West Bank — Cave of the Patriarchs",  pt: "Hebrom, Cisjordânia — Caverna dos Patriarcas" },
};

data.contextoHistorico.geografia = data.contextoHistorico.geografia.map(g => ({
  ...g,
  lugar:               GEO_LUGAR[g.lugar]   || g.lugar,
  identificacionModerna: GEO_MODERNA[g.identificacionModerna] || g.identificacionModerna,
}));

// ── 2. civilizaciones ─────────────────────────────────────────────────────────

const CIV_NOMBRE = {
  "Sumerios y Acadios": { es: "Sumerios y Acadios", en: "Sumerians and Akkadians", pt: "Sumérios e Acadianos" },
  "Cananeos":           { es: "Cananeos",           en: "Canaanites",              pt: "Cananeus" },
  "Egipcios":           { es: "Egipcios",           en: "Egyptians",               pt: "Egípcios" },
  "Hicsos":             { es: "Hicsos",             en: "Hyksos",                  pt: "Hicsos" },
};

data.contextoHistorico.civilizaciones = data.contextoHistorico.civilizaciones.map(c => ({
  ...c,
  nombre: CIV_NOMBRE[c.nombre] || c.nombre,
}));

// ── 3. fuentesANE ─────────────────────────────────────────────────────────────

const ANE_NOMBRE = {
  "Enuma Elish":
    { es: "Enuma Elish",                    en: "Enuma Elish",                   pt: "Enuma Elish" },
  "Epopeya de Gilgamesh (Tablilla XI)":
    { es: "Epopeya de Gilgamesh (Tablilla XI)", en: "Epic of Gilgamesh (Tablet XI)", pt: "Epopeia de Gilgamesh (Tábua XI)" },
  "Textos de Nuzi":
    { es: "Textos de Nuzi",                 en: "Nuzi Texts",                    pt: "Textos de Nuzi" },
  "Archivos de Mari":
    { es: "Archivos de Mari",               en: "Mari Archives",                 pt: "Arquivos de Mari" },
  "Tablillas de Ebla":
    { es: "Tablillas de Ebla",              en: "Ebla Tablets",                  pt: "Tábuas de Ebla" },
};

const ANE_ORIGEN = {
  "Babilonia, c. 1100 a.C.":
    { es: "Babilonia, c. 1100 a.C.",        en: "Babylon, c. 1100 BC",           pt: "Babilônia, c. 1100 a.C." },
  "Nínive, c. 700 a.C. (tradición sumeria c. 2100 a.C.)":
    { es: "Nínive, c. 700 a.C. (tradición sumeria c. 2100 a.C.)", en: "Nineveh, c. 700 BC (Sumerian tradition c. 2100 BC)", pt: "Nínive, c. 700 a.C. (tradição sumeria c. 2100 a.C.)" },
  "Nuzi, Iraq, c. 1500–1350 a.C.":
    { es: "Nuzi, Iraq, c. 1500–1350 a.C.",  en: "Nuzi, Iraq, c. 1500–1350 BC",  pt: "Nuzi, Iraque, c. 1500–1350 a.C." },
  "Tell Hariri, Siria, c. 1800–1750 a.C.":
    { es: "Tell Hariri, Siria, c. 1800–1750 a.C.", en: "Tell Hariri, Syria, c. 1800–1750 BC", pt: "Tell Hariri, Síria, c. 1800–1750 a.C." },
  "Tell Mardikh, Siria, c. 2400–2300 a.C.":
    { es: "Tell Mardikh, Siria, c. 2400–2300 a.C.", en: "Tell Mardikh, Syria, c. 2400–2300 BC", pt: "Tell Mardikh, Síria, c. 2400–2300 a.C." },
};

data.contextoHistorico.fuentesANE = data.contextoHistorico.fuentesANE.map(f => ({
  ...f,
  nombre: ANE_NOMBRE[f.nombre] || f.nombre,
  origen: ANE_ORIGEN[f.origen] || f.origen,
}));

// ── Write ──────────────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
console.log("Patched", FILE);
