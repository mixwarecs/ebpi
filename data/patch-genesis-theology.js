#!/usr/bin/env node
// Patches genesis.json: adds trilingual categoria + distintivaReformada
// to each teologiaSistematica entry.

const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "genesis.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const CATEGORIA_MAP = {
  "Creación":      { es: "Creación",       en: "Creation",        pt: "Criação" },
  "Antropología":  { es: "Antropología",   en: "Anthropology",    pt: "Antropologia" },
  "Hamartiología": { es: "Hamartiología",  en: "Hamartiology",    pt: "Hamartiologia" },
  "Pacto":         { es: "Pacto",          en: "Covenant",        pt: "Aliança" },
  "Elección":      { es: "Elección",       en: "Election",        pt: "Eleição" },
  "Soteriología":  { es: "Soteriología",   en: "Soteriology",     pt: "Soteriologia" },
  "Providencia":   { es: "Providencia",    en: "Providence",      pt: "Providência" },
  "Cristología":   { es: "Cristología",    en: "Christology",     pt: "Cristologia" },
  "Teología Propia": { es: "Teología Propia", en: "Theology Proper", pt: "Teologia Própria" },
  "Angelología":   { es: "Angelología",    en: "Angelology",      pt: "Angelologia" },
};

const DISTINTIVA_MAP = {
  "Creación": {
    es: "La Reforma afirma la creación ex nihilo como fundamento de la soberanía absoluta de Dios, rechazando todo dualismo. El mandato cultural (Gn 1:28) es también base de la ética reformada del trabajo y la vocación.",
    en: "The Reformation affirms creation ex nihilo as the foundation of God's absolute sovereignty, rejecting all dualism. The cultural mandate (Gen 1:28) is also the basis for the Reformed ethic of work and vocation.",
    pt: "A Reforma afirma a criação ex nihilo como fundamento da soberania absoluta de Deus, rejeitando todo dualismo. O mandato cultural (Gn 1:28) é também a base da ética reformada do trabalho e da vocação.",
  },
  "Antropología": {
    es: "La Reforma enfatiza que tras la caída la imagen está corrompida pero no aniquilada (WCF 9.3), preservando la responsabilidad moral. La imago Dei es relacional y funcional, no sólo substancial.",
    en: "The Reformation emphasizes that after the Fall the image is corrupted but not annihilated (WCF 9.3), preserving moral responsibility. The imago Dei is relational and functional, not merely substantial.",
    pt: "A Reforma enfatiza que após a queda a imagem está corrompida mas não aniquilada (WCF 9.3), preservando a responsabilidade moral. A imago Dei é relacional e funcional, não apenas substancial.",
  },
  "Hamartiología": {
    es: "La Reforma afirma la depravación total: el pecado afecta todas las dimensiones del ser humano (intelecto, voluntad, emociones), incapacitándolo para buscar a Dios por sí mismo (WCF 6.4).",
    en: "The Reformation affirms total depravity: sin affects every dimension of human being (intellect, will, emotions), rendering humanity incapable of seeking God on its own (WCF 6.4).",
    pt: "A Reforma afirma a depravação total: o pecado afeta todas as dimensões do ser humano (intelecto, vontade, emoções), incapacitando-o de buscar a Deus por si mesmo (WCF 6.4).",
  },
  "Pacto": {
    es: "La teología del pacto ve la historia bíblica como el desarrollo de un único pacto de gracia. El pacto de obras con Adán es la base para entender la obra de Cristo como segundo Adán que cumple perfectamente lo que Adán falló (WCF 7).",
    en: "Covenant theology views biblical history as the unfolding of a single covenant of grace. The covenant of works with Adam is the basis for understanding Christ's work as the second Adam who perfectly fulfills what Adam failed (WCF 7).",
    pt: "A teologia do pacto vê a história bíblica como o desdobramento de um único pacto de graça. O pacto de obras com Adão é a base para compreender a obra de Cristo como segundo Adão que cumpre perfeitamente o que Adão falhou (WCF 7).",
  },
  "Elección": {
    es: "La Reforma afirma la elección incondicional (TULIP) basándose en Gn 25:23 y Ro 9:11–13. La elección no se basa en la fe prevista sino en el beneplácito soberano de Dios, para gloria de su gracia (WCF 3.5).",
    en: "The Reformation affirms unconditional election (TULIP) based on Gen 25:23 and Rom 9:11–13. Election is not based on foreseen faith but on God's sovereign good pleasure, for the glory of His grace (WCF 3.5).",
    pt: "A Reforma afirma a eleição incondicional (TULIP) baseando-se em Gn 25:23 e Rm 9:11–13. A eleição não se baseia na fé prevista, mas no beneplácito soberano de Deus, para glória de sua graça (WCF 3.5).",
  },
  "Soteriología": {
    es: "Gn 15:6 es el texto clave de la Reforma para demostrar que la justificación ha sido siempre por fe sola, anterior a la ley. Lutero y Calvino citaban este versículo contra la idea de salvación del AT por obras.",
    en: "Gen 15:6 is the Reformation's key text for demonstrating that justification has always been by faith alone, prior to the law. Luther and Calvin cited this verse against the idea of OT salvation by works.",
    pt: "Gn 15:6 é o texto-chave da Reforma para demonstrar que a justificação sempre foi pela fé somente, anterior à lei. Lutero e Calvino citavam este versículo contra a ideia de salvação no AT por obras.",
  },
  "Providencia": {
    es: "La Reforma afirma que Dios no sólo permite el mal sino que lo decreta de manera que no sea su autor moral (distinción entre decretar y aprobar). Gn 50:20 es el texto clásico sobre la concurrencia divina (WCF 5.4).",
    en: "The Reformation affirms that God not only permits evil but decrees it in a way that does not make Him its moral author (the distinction between decreeing and approving). Gen 50:20 is the classic text on divine concurrence (WCF 5.4).",
    pt: "A Reforma afirma que Deus não apenas permite o mal, mas o decreta de modo que não seja seu autor moral (distinção entre decretar e aprovar). Gn 50:20 é o texto clássico sobre a concorrência divina (WCF 5.4).",
  },
  "Cristología": {
    es: "La hermenéutica reformada lee todo el AT cristocéntricamente. El protoevangelio (Gn 3:15) es la clave interpretativa del AT para la tradición reformada. Cristo recapitula y cumple toda la historia patriarcal.",
    en: "Reformed hermeneutics reads all of the OT christocentrically. The protevangelium (Gen 3:15) is the interpretive key to the OT for the Reformed tradition. Christ recapitulates and fulfills all patriarchal history.",
    pt: "A hermenêutica reformada lê todo o AT cristocentricamente. O protoevangelium (Gn 3:15) é a chave interpretativa do AT para a tradição reformada. Cristo recapitula e cumpre toda a história patriarcal.",
  },
  "Teología Propia": {
    es: "La Reforma enfatiza la incomprensibilidad de Dios: sólo lo conocemos en la medida en que él se revela. En Génesis esta revelación es narrativa y pactual. El nombre El Shaddai revela un Dios que actúa en la historia.",
    en: "The Reformation emphasizes the incomprehensibility of God: we know Him only insofar as He reveals Himself. In Genesis this revelation is narrative and covenantal. The name El Shaddai reveals a God who acts in history.",
    pt: "A Reforma enfatiza a incompreensibilidade de Deus: só o conhecemos na medida em que ele se revela. Em Gênesis essa revelação é narrativa e pactual. O nome El Shaddai revela um Deus que age na história.",
  },
  "Angelología": {
    es: "La tradición reformada interpreta el Ángel de YHWH en Génesis como el Hijo pre-encarnado (Cristofanía), no un ángel creado — consistente con que el Ángel habla como YHWH mismo (Gn 16:13; 22:12).",
    en: "The Reformed tradition interprets the Angel of YHWH in Genesis as the pre-incarnate Son (Christophany), not a created angel — consistent with the Angel speaking as YHWH Himself (Gen 16:13; 22:12).",
    pt: "A tradição reformada interpreta o Anjo de YHWH em Gênesis como o Filho pré-encarnado (Cristofania), não um anjo criado — consistente com o Anjo falando como o próprio YHWH (Gn 16:13; 22:12).",
  },
};

data.teologiaSistematica = data.teologiaSistematica.map(t => {
  const esKey = typeof t.categoria === "string" ? t.categoria : t.categoria.es;
  return {
    ...t,
    categoria: CATEGORIA_MAP[esKey] || t.categoria,
    distintivaReformada: DISTINTIVA_MAP[esKey] || t.distintivaReformada || {},
  };
});

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
console.log("Patched", FILE);
