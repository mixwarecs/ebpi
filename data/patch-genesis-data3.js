#!/usr/bin/env node
// Patches genesis.json:
//   1. versiculosClave[].nota → add trilingual theological note to each entry
//   2. anclasConfesionales → replace flat strings with full trilingual WCF objects

const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "genesis.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// ── 1. versiculosClave: add nota field ───────────────────────────────────────

const NOTAS = [
  {
    ref: "Gn 1:1",
    nota: {
      es: "La declaración más audaz de la Escritura. Refuta el ateísmo, el dualismo y el politeísmo del ANE en una sola cláusula. Juan 1:1 lo cita para identificar al Logos eterno con el acto creador.",
      en: "The boldest declaration of Scripture. In one clause it refutes atheism, dualism, and the polytheism of the ANE. John 1:1 cites it to identify the eternal Logos with the act of creation.",
      pt: "A declaração mais audaciosa da Escritura. Refuta o ateísmo, o dualismo e o politeísmo do ANE em uma única cláusula. João 1:1 a cita para identificar o Logos eterno com o ato criador.",
    },
  },
  {
    ref: "Gn 3:15",
    nota: {
      es: "El protoevangelio — la primera promesa del evangelio en la Escritura. La simiente de la mujer que aplasta la cabeza de la serpiente es Jesucristo (Gá 3:16; Ap 12:9).",
      en: "The protevangelium — the first gospel promise in Scripture. The seed of the woman who crushes the serpent's head is Jesus Christ (Gal 3:16; Rev 12:9).",
      pt: "O protoevangelium — a primeira promessa do evangelho na Escritura. A semente da mulher que esmaga a cabeça da serpente é Jesus Cristo (Gl 3:16; Ap 12:9).",
    },
  },
  {
    ref: "Gn 12:2-3",
    nota: {
      es: "La promesa tripartita abrahámica: tierra, simiente y bendición universal. Pablo la cita en Gá 3:8 como 'el evangelio anunciado de antemano a Abraham'.",
      en: "The tripartite Abrahamic promise: land, seed, and universal blessing. Paul cites it in Gal 3:8 as 'the gospel preached beforehand to Abraham'.",
      pt: "A promessa tripartite abraâmica: terra, semente e bênção universal. Paulo a cita em Gl 3:8 como 'o evangelho pregado de antemão a Abraão'.",
    },
  },
  {
    ref: "Gn 15:6",
    nota: {
      es: "El versículo sobre justificación más citado del AT en el NT. Pablo lo usa tres veces (Ro 4:3; Gá 3:6; Ro 4:22) para demostrar que la justificación ha sido siempre por fe sola.",
      en: "The most cited OT verse on justification in the NT. Paul uses it three times (Rom 4:3; Gal 3:6; Rom 4:22) to demonstrate that justification has always been by faith alone.",
      pt: "O versículo sobre justificação mais citado do AT no NT. Paulo o usa três vezes (Rm 4:3; Gl 3:6; Rm 4:22) para demonstrar que a justificação sempre foi pela fé somente.",
    },
  },
  {
    ref: "Gn 50:20",
    nota: {
      es: "La declaración más clara de la providencia soberana en el AT. Prefigura la cruz: los hombres crucificaron a Cristo; Dios lo ordenó para salvación (Hch 2:23).",
      en: "The clearest statement of sovereign providence in the OT. It prefigures the cross: men crucified Christ; God ordained it for salvation (Acts 2:23).",
      pt: "A declaração mais clara da providência soberana no AT. Prefigura a cruz: os homens crucificaram Cristo; Deus o ordenou para salvação (At 2:23).",
    },
  },
];

data.versiculosClave = data.versiculosClave.map(v => {
  const match = NOTAS.find(n => v.ref === n.ref || v.ref.startsWith(n.ref));
  return match ? { ...v, nota: match.nota } : v;
});

// ── 2. anclasConfesionales → full trilingual WCF objects ─────────────────────

data.anclasConfesionales = [
  {
    cap: "Cap. 4",
    titulo: { es: "De la Creación", en: "Of Creation", pt: "Da Criação" },
    doctrinas: ["Creación", "Antropología"],
    resumen: {
      es: "Dios el Padre, el Hijo y el Espíritu Santo crearon de la nada el mundo y todo lo que hay en él en el espacio de seis días, y todo era bueno en gran manera. Creó al hombre varón y hembra, con almas racionales e inmortales, a su propia imagen: con conocimiento, justicia y santidad verdaderas.",
      en: "God the Father, Son, and Holy Spirit created the world and all things therein out of nothing in the space of six days, and all very good. He created man male and female, with rational and immortal souls, after His own image: in knowledge, righteousness, and true holiness.",
      pt: "Deus Pai, Filho e Espírito Santo criaram do nada o mundo e tudo o que nele há em seis dias, e tudo era muito bom. Criou o homem, varão e fêmea, com almas racionais e imortais, à sua própria imagem: em conhecimento, justiça e santidade verdadeiros.",
    },
    genesis: ["Gn 1:1", "Gn 1:26–27", "Gn 1:31", "Gn 2:7"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-4",
  },
  {
    cap: "Cap. 6",
    titulo: { es: "De la Caída del Hombre", en: "Of the Fall of Man", pt: "Da Queda do Homem" },
    doctrinas: ["Hamartiología"],
    resumen: {
      es: "Nuestros primeros padres, seducidos por la astucia de Satanás, pecaron al comer del fruto prohibido. Por este pecado cayeron de su rectitud original y perdieron su comunión con Dios. De ellos descendió la muerte y la corrupción a toda la humanidad, siendo todos pecadores por naturaleza desde la concepción.",
      en: "Our first parents, being seduced by the subtlety and temptation of Satan, sinned by eating the forbidden fruit. By this sin they fell from their original righteousness and lost communion with God. From them, death and corruption descended to all mankind; all are now sinners by nature from their conception.",
      pt: "Nossos primeiros pais, seduzidos pela sutileza e tentação de Satanás, pecaram ao comer do fruto proibido. Por esse pecado caíram de sua retidão original e perderam a comunhão com Deus. Deles desceram a morte e a corrupção para toda a humanidade; todos agora são pecadores por natureza desde a concepção.",
    },
    genesis: ["Gn 3:1–7", "Gn 3:16–19", "Gn 6:5"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-6",
  },
  {
    cap: "Cap. 7",
    titulo: { es: "Del Pacto de Dios con el Hombre", en: "Of God's Covenant with Man", pt: "Do Pacto de Deus com o Homem" },
    doctrinas: ["Pacto", "Soteriología"],
    resumen: {
      es: "Dios estableció con Adán un pacto de obras, prometiendo vida bajo condición de perfecta obediencia. Tras la caída, Dios se agradó de hacer un segundo pacto: el pacto de gracia, ofreciendo vida y salvación por Jesucristo. Este pacto fue administrado bajo el AT por promesas, profecías y sacrificios, y bajo el NT por la predicación y los sacramentos.",
      en: "God made a covenant of works with Adam, promising life upon condition of perfect obedience. After the fall, God was pleased to make a second covenant: the covenant of grace, offering life and salvation by Jesus Christ. Under the OT it was administered by promises, prophecies, and sacrifices; under the NT, by preaching and the sacraments.",
      pt: "Deus fez com Adão um pacto de obras, prometendo vida sob condição de perfeita obediência. Após a queda, Deus se agradou em fazer um segundo pacto: o pacto de graça, oferecendo vida e salvação por Jesus Cristo. No AT foi administrado por promessas, profecias e sacrifícios; no NT, pela pregação e pelos sacramentos.",
    },
    genesis: ["Gn 2:15–17", "Gn 15:9–18", "Gn 17:1–8"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-7",
  },
  {
    cap: "Cap. 3",
    titulo: { es: "Del Decreto Eterno de Dios", en: "Of God's Eternal Decree", pt: "Do Decreto Eterno de Deus" },
    doctrinas: ["Elección"],
    resumen: {
      es: "Dios, desde la eternidad, por el sapientísimo y santísimo consejo de su propia voluntad, ordenó libremente todo lo que ocurre. Predestinó a ciertos hombres y ángeles a vida eterna. Esta predestinación no se basa en la fe prevista sino en el soberano beneplácito divino, para la manifestación de su gloria.",
      en: "God, from all eternity, by the most wise and holy counsel of His own will, freely ordained whatever comes to pass. He predestined certain men and angels to everlasting life. This predestination is not based on foreseen faith but on God's sovereign good pleasure, for the manifestation of His glory.",
      pt: "Deus, desde a eternidade, pelo sapientíssimo e santíssimo conselho de sua própria vontade, ordenou livremente tudo o que acontece. Predestinou certos homens e anjos para a vida eterna. Essa predestinação não se baseia na fé prevista, mas no soberano beneplácito divino, para a manifestação de sua glória.",
    },
    genesis: ["Gn 21:12", "Gn 25:23"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-3",
  },
  {
    cap: "Cap. 5",
    titulo: { es: "De la Providencia", en: "Of Providence", pt: "Da Providência" },
    doctrinas: ["Providencia"],
    resumen: {
      es: "Dios el gran Creador sostiene, dirige, dispone y gobierna a todas las criaturas, acciones y cosas, por su providencia sapientísima y santísima, según su infalible presciencia y el libre e inmutable consejo de su propia voluntad. Dios puede servirse incluso del mal para sus fines santos, sin ser autor del pecado.",
      en: "God the great Creator upholds, directs, disposes, and governs all creatures, actions, and things, by His most wise and holy providence, according to His infallible foreknowledge and the free and immutable counsel of His own will. God may even make use of evil for His holy ends, without being the author of sin.",
      pt: "Deus, o grande Criador, sustenta, dirige, dispõe e governa todas as criaturas, ações e coisas, por sua providência sapientíssima e santíssima, conforme sua infalsificável presciência e o livre e imutável conselho de sua própria vontade. Deus pode até usar o mal para seus fins santos, sem ser o autor do pecado.",
    },
    genesis: ["Gn 45:5–8", "Gn 50:20"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-5",
  },
];

// ── Write ────────────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
console.log("Patched", FILE);
