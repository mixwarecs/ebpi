#!/usr/bin/env node
// Patches genesis.json:
//   1. historiaRedentora.tiposYSombras → {es,en,pt} objects
//   2. versiculosClave → {ref,es,en,pt} objects
//   3. autor.nombre → {es,en,pt} object

const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "genesis.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// ── 1. tiposYSombras ─────────────────────────────────────────────────────────

data.historiaRedentora.tiposYSombras = [
  {
    es: "Adán como tipo del segundo Adán, Cristo (Ro 5:14; 1Co 15:45–49)",
    en: "Adam as type of the second Adam, Christ (Rom 5:14; 1 Cor 15:45–49)",
    pt: "Adão como tipo do segundo Adão, Cristo (Rm 5:14; 1Co 15:45–49)",
  },
  {
    es: "El árbol de la vida como tipo del Cristo que da vida eterna (Ap 2:7; 22:2)",
    en: "The tree of life as type of Christ who gives eternal life (Rev 2:7; 22:2)",
    pt: "A árvore da vida como tipo de Cristo que dá vida eterna (Ap 2:7; 22:2)",
  },
  {
    es: "Las túnicas de piel de Gn 3:21 como tipo de la expiación sustitutiva en Cristo",
    en: "The garments of skin in Gen 3:21 as type of substitutionary atonement in Christ",
    pt: "As túnicas de pele de Gn 3:21 como tipo da expiação substitutiva em Cristo",
  },
  {
    es: "El arca de Noé como tipo de Cristo, único refugio del juicio (1Pe 3:20–21)",
    en: "Noah's ark as type of Christ, the sole refuge from judgment (1 Pet 3:20–21)",
    pt: "A arca de Noé como tipo de Cristo, único refúgio do juízo (1Pe 3:20–21)",
  },
  {
    es: "El carnero en lugar de Isaac como tipo del Cordero de Dios (Gn 22:8; Jn 1:29)",
    en: "The ram in place of Isaac as type of the Lamb of God (Gen 22:8; Jn 1:29)",
    pt: "O carneiro no lugar de Isaque como tipo do Cordeiro de Deus (Gn 22:8; Jo 1:29)",
  },
  {
    es: "Melquisedec como tipo de Cristo, sacerdote-rey eterno (Gn 14:18–20; He 7:1–28)",
    en: "Melchizedek as type of Christ, eternal priest-king (Gen 14:18–20; Heb 7:1–28)",
    pt: "Melquisedeque como tipo de Cristo, sacerdote-rei eterno (Gn 14:18–20; Hb 7:1–28)",
  },
  {
    es: "La escalera de Jacob como tipo de Cristo, único mediador (Gn 28:12; Jn 1:51)",
    en: "Jacob's ladder as type of Christ, the sole mediator (Gen 28:12; Jn 1:51)",
    pt: "A escada de Jacó como tipo de Cristo, único mediador (Gn 28:12; Jo 1:51)",
  },
  {
    es: "José como tipo de Cristo: rechazado, humillado, exaltado para salvar (Gn 37–50; Hch 7:9–14)",
    en: "Joseph as type of Christ: rejected, humiliated, exalted to save (Gen 37–50; Acts 7:9–14)",
    pt: "José como tipo de Cristo: rejeitado, humilhado, exaltado para salvar (Gn 37–50; At 7:9–14)",
  },
];

// ── 2. versiculosClave ───────────────────────────────────────────────────────

data.versiculosClave = [
  {
    ref: "Gn 1:1",
    es: "En el principio creó Dios los cielos y la tierra.",
    en: "In the beginning, God created the heavens and the earth.",
    pt: "No princípio, Deus criou os céus e a terra.",
  },
  {
    ref: "Gn 3:15",
    es: "Pondré enemistad entre tú y la mujer, y entre tu simiente y la simiente suya.",
    en: "I will put enmity between you and the woman, and between your offspring and her offspring.",
    pt: "Porei inimizade entre ti e a mulher, e entre a tua semente e a semente dela.",
  },
  {
    ref: "Gn 12:2-3",
    es: "Haré de ti una nación grande, y te bendeciré… serán benditas en ti todas las familias de la tierra.",
    en: "I will make of you a great nation, and I will bless you… in you all the families of the earth shall be blessed.",
    pt: "Farei de ti uma grande nação, e te abençoarei… em ti serão benditas todas as famílias da terra.",
  },
  {
    ref: "Gn 15:6",
    es: "Y creyó él a Jehová, y le fue contado por justicia.",
    en: "And he believed the LORD, and he counted it to him as righteousness.",
    pt: "E creu ele no SENHOR, e isso lhe foi imputado como justiça.",
  },
  {
    ref: "Gn 50:20",
    es: "Ustedes pensaron hacerme mal, pero Dios lo pensó para bien.",
    en: "You intended to harm me, but God intended it for good.",
    pt: "Vocês planejaram o mal contra mim, mas Deus o planejou para o bem.",
  },
];

// ── 3. autor.nombre ──────────────────────────────────────────────────────────

data.autor.nombre = { es: "Moisés", en: "Moses", pt: "Moisés" };

// ── Write ────────────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
console.log("Patched", FILE);
