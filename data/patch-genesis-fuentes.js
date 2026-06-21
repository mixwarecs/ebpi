#!/usr/bin/env node
// Patches genesis.json fuentes[]:
//   - popup.bio, popup.metodo, popup.aportacion: flat string → {es, en, pt}
//   - camposUtilizados: string[] → {es: [...], en: [...], pt: [...]}

const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "genesis.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// ── Trilingual fuentes data keyed by titulo ───────────────────────────────────

const FUENTES_DATA = {
  "ESV Study Bible": {
    camposUtilizados: {
      es: ["Introducción", "Resúmenes", "Teología", "Tipología"],
      en: ["Introduction", "Summaries", "Theology", "Typology"],
      pt: ["Introdução", "Resumos", "Teologia", "Tipologia"],
    },
    bio: {
      es: "Biblia de estudio académica producida por más de 50 eruditos evangélicos conservadores bajo la dirección editorial de Wayne Grudem y J.I. Packer. Publicada por Crossway en 2008, es la biblia de estudio de referencia estándar en el mundo evangélico angloparlante.",
      en: "An academic study Bible produced by more than 50 conservative evangelical scholars under the editorial direction of Wayne Grudem and J.I. Packer. Published by Crossway in 2008, it is the standard reference study Bible in the English-speaking evangelical world.",
      pt: "Bíblia de estudo acadêmica produzida por mais de 50 eruditos evangélicos conservadores sob a direção editorial de Wayne Grudem e J.I. Packer. Publicada pela Crossway em 2008, é a bíblia de estudo de referência padrão no mundo evangélico anglófono.",
    },
    metodo: {
      es: "Combina traducción literal (ESV) con notas exegéticas extensas, ensayos introductorios por libro, mapas, gráficos y artículos temáticos. Las notas reflejan teología reformada y complementaria sin comprometer el rigor académico.",
      en: "Combines a literal translation (ESV) with extensive exegetical notes, book-by-book introductory essays, maps, charts, and thematic articles. The notes reflect Reformed and complementarian theology without compromising academic rigor.",
      pt: "Combina tradução literal (ESV) com notas exegéticas extensas, ensaios introdutórios por livro, mapas, gráficos e artigos temáticos. As notas refletem teologia reformada e complementarista sem comprometer o rigor acadêmico.",
    },
    aportacion: {
      es: "Para el CANON Pipeline, provee los fundamentos de cada campo del registro: estructura literaria, autoría, datación, teología sistemática por libro, y resúmenes capítulo a capítulo. Es la fuente Nivel 1 más citada en todos los campos.",
      en: "For the CANON Pipeline, it provides the foundation for each record field: literary structure, authorship, dating, systematic theology by book, and chapter-by-chapter summaries. It is the most-cited Level 1 source across all fields.",
      pt: "Para o CANON Pipeline, fornece os fundamentos de cada campo do registro: estrutura literária, autoria, datação, teologia sistemática por livro e resumos capítulo a capítulo. É a fonte Nível 1 mais citada em todos os campos.",
    },
  },

  "Reformation Study Bible": {
    camposUtilizados: {
      es: ["Teología Reformada", "WCF", "Distinctivas", "Pacto"],
      en: ["Reformed Theology", "WCF", "Distinctives", "Covenant"],
      pt: ["Teologia Reformada", "CFW", "Distintivas", "Aliança"],
    },
    bio: {
      es: "R.C. Sproul (1939–2017) fue uno de los teólogos reformados más influyentes del siglo XX, fundador de Ligonier Ministries. Su Reformation Study Bible reúne a más de 75 eruditos reformados para producir la biblia de estudio más comprehensiva desde una perspectiva calvinista.",
      en: "R.C. Sproul (1939–2017) was one of the most influential Reformed theologians of the twentieth century and founder of Ligonier Ministries. His Reformation Study Bible brings together more than 75 Reformed scholars to produce the most comprehensive study Bible from a Calvinist perspective.",
      pt: "R.C. Sproul (1939–2017) foi um dos teólogos reformados mais influentes do século XX e fundador do Ligonier Ministries. Sua Reformation Study Bible reúne mais de 75 eruditos reformados para produzir a bíblia de estudo mais abrangente de uma perspectiva calvinista.",
    },
    metodo: {
      es: "Usa la traducción NKJV con notas exegéticas que privilegian la teología del pacto, la hermenéutica reformada y los estándares de Westminster. Cada libro incluye introducción, notas versículo a versículo y secciones de teología bíblica.",
      en: "Uses the NKJV translation with exegetical notes that privilege covenant theology, Reformed hermeneutics, and the Westminster Standards. Each book includes an introduction, verse-by-verse notes, and sections on biblical theology.",
      pt: "Usa a tradução NKJV com notas exegéticas que privilegiam a teologia do pacto, a hermenêutica reformada e os Padrões de Westminster. Cada livro inclui introdução, notas versículo a versículo e seções de teologia bíblica.",
    },
    aportacion: {
      es: "Es la fuente primaria para las distinctivas reformadas, las áncoras de la Confesión de Westminster y la interpretación pactual de cada libro. Define el tono teológico de todo el CANON Pipeline.",
      en: "It is the primary source for Reformed distinctives, Westminster Confession anchors, and the covenantal interpretation of each book. It defines the theological tone of the entire CANON Pipeline.",
      pt: "É a fonte primária para as distintivas reformadas, as âncoras da Confissão de Westminster e a interpretação pactual de cada livro. Define o tom teológico de todo o CANON Pipeline.",
    },
  },

  "Biblia de Estudio de la Reforma (NBLA)": {
    camposUtilizados: {
      es: ["Todos los campos en español", "Notas teológicas ES"],
      en: ["All fields in Spanish", "Theological notes ES"],
      pt: ["Todos os campos em espanhol", "Notas teológicas ES"],
    },
    bio: {
      es: "Edición en español de la Reformation Study Bible, traducida y adaptada para el mundo hispanohablante. Usa la Nueva Biblia de las Américas (NBLA) como texto base — la traducción al español más precisa y literal disponible hoy.",
      en: "The Spanish-language edition of the Reformation Study Bible, translated and adapted for the Spanish-speaking world. It uses the Nueva Biblia de las Américas (NBLA) as its base text — the most precise and literal Spanish translation available today.",
      pt: "Edição em espanhol da Reformation Study Bible, traduzida e adaptada para o mundo hispanófono. Usa a Nueva Biblia de las Américas (NBLA) como texto base — a tradução espanhola mais precisa e literal disponível hoje.",
    },
    metodo: {
      es: "Traduce y adapta las notas de la Reformation Study Bible al español con terminología teológica precisa. La NBLA como texto base es traducción de equivalencia formal desde los textos hebreo, arameo y griego.",
      en: "Translates and adapts the Reformation Study Bible notes into Spanish with precise theological terminology. The NBLA as base text is a formal-equivalence translation from the Hebrew, Aramaic, and Greek texts.",
      pt: "Traduz e adapta as notas da Reformation Study Bible para o espanhol com terminologia teológica precisa. A NBLA como texto base é tradução de equivalência formal a partir dos textos hebraico, aramaico e grego.",
    },
    aportacion: {
      es: "Es la fuente española de referencia para todos los campos trilingües del CANON Pipeline. Define el texto bíblico en español para todos los 66 libros.",
      en: "It is the Spanish reference source for all trilingual fields in the CANON Pipeline. It defines the biblical text in Spanish for all 66 books.",
      pt: "É a fonte espanhola de referência para todos os campos trilíngues do CANON Pipeline. Define o texto bíblico em espanhol para todos os 66 livros.",
    },
  },

  "Systematic Theology": {
    camposUtilizados: {
      es: ["Teología Sistemática", "Creación", "Imagen de Dios", "Pacto", "Elección"],
      en: ["Systematic Theology", "Creation", "Image of God", "Covenant", "Election"],
      pt: ["Teologia Sistemática", "Criação", "Imagem de Deus", "Aliança", "Eleição"],
    },
    bio: {
      es: "Wayne Grudem (n. 1948) es Profesor Emérito de Teología Bíblica y Sistemática en Phoenix Seminary. Su Systematic Theology (1994) es el manual de teología sistemática reformado-evangélica más usado en seminarios del mundo anglohablante.",
      en: "Wayne Grudem (b. 1948) is Professor Emeritus of Biblical and Systematic Theology at Phoenix Seminary. His Systematic Theology (1994) is the most widely used Reformed-evangelical systematic theology textbook in seminaries across the English-speaking world.",
      pt: "Wayne Grudem (n. 1948) é Professor Emérito de Teologia Bíblica e Sistemática no Phoenix Seminary. Sua Systematic Theology (1994) é o manual de teologia sistemática reformada-evangélica mais usado em seminários do mundo anglófono.",
    },
    metodo: {
      es: "Organiza la teología en 57 categorías. Para cada doctrina presenta definición, base bíblica exhaustiva, historia de la doctrina, desacuerdos con otras tradiciones y aplicación práctica.",
      en: "Organizes theology into 57 categories. For each doctrine it presents a definition, exhaustive biblical basis, history of the doctrine, disagreements with other traditions, and practical application.",
      pt: "Organiza a teologia em 57 categorias. Para cada doutrina apresenta definição, base bíblica exaustiva, história da doutrina, desacordos com outras tradições e aplicação prática.",
    },
    aportacion: {
      es: "Provee el vocabulario controlado de teología sistemática para el campo 'teologiaSistematica' del CANON Pipeline. Las categorías del pipeline siguen la estructura de Grudem.",
      en: "Provides the controlled vocabulary of systematic theology for the 'teologiaSistematica' field of the CANON Pipeline. The pipeline categories follow Grudem's structure.",
      pt: "Fornece o vocabulário controlado de teologia sistemática para o campo 'teologiaSistematica' do CANON Pipeline. As categorias do pipeline seguem a estrutura de Grudem.",
    },
  },

  "Biblical Theology": {
    camposUtilizados: {
      es: ["Historia Redentora", "Tipología", "Enfoque Cristológico", "Épocas"],
      en: ["Redemptive History", "Typology", "Christological Focus", "Epochs"],
      pt: ["História Redentora", "Tipologia", "Enfoque Cristológico", "Épocas"],
    },
    bio: {
      es: "Geerhardus Vos (1862–1949) fue teólogo reformado holandés-americano, Profesor de Teología Bíblica en Princeton Seminary (1893–1932). Llamado 'el padre de la Teología Bíblica Reformada', fue maestro de J. Gresham Machen y Cornelius Van Til.",
      en: "Geerhardus Vos (1862–1949) was a Dutch-American Reformed theologian and Professor of Biblical Theology at Princeton Seminary (1893–1932). Called 'the father of Reformed Biblical Theology,' he was the teacher of J. Gresham Machen and Cornelius Van Til.",
      pt: "Geerhardus Vos (1862–1949) foi teólogo reformado holandês-americano, Professor de Teologia Bíblica no Princeton Seminary (1893–1932). Chamado de 'o pai da Teologia Bíblica Reformada', foi mestre de J. Gresham Machen e Cornelius Van Til.",
    },
    metodo: {
      es: "Vos traza la revelación progresiva de Dios a través de épocas históricas sucesivas (Adámico → Noáico → Abrahánico → Mosaico → Profético → Cumplimiento), mostrando cómo cada etapa anticipa y prefigura a Cristo.",
      en: "Vos traces the progressive revelation of God through successive historical epochs (Adamic → Noahic → Abrahamic → Mosaic → Prophetic → Fulfillment), showing how each stage anticipates and prefigures Christ.",
      pt: "Vos traça a revelação progressiva de Deus por meio de épocas históricas sucessivas (Adâmico → Noético → Abraâmico → Mosaico → Profético → Cumprimento), mostrando como cada etapa antecipa e prefigura Cristo.",
    },
    aportacion: {
      es: "Es la fuente definitiva para el campo 'historiaRedentora' del pipeline: las épocas redentoras, el 'enfoqueCristologico' por libro, y los 'tiposYSombras'. Su método define la hermenéutica de todo el CANON Pipeline.",
      en: "It is the definitive source for the pipeline's 'historiaRedentora' field: the redemptive epochs, the per-book 'enfoqueCristologico,' and the 'tiposYSombras.' Its method defines the hermeneutic of the entire CANON Pipeline.",
      pt: "É a fonte definitiva para o campo 'historiaRedentora' do pipeline: as épocas redentoras, o 'enfoqueCristologico' por livro e os 'tiposYSombras'. Seu método define a hermenêutica de todo o CANON Pipeline.",
    },
  },

  "A History of Israel": {
    camposUtilizados: {
      es: ["Contexto Histórico", "Biografía Histórica", "Arqueología"],
      en: ["Historical Context", "Historical Biography", "Archaeology"],
      pt: ["Contexto Histórico", "Biografia Histórica", "Arqueologia"],
    },
    bio: {
      es: "John Bright (1908–1995) fue Profesor de Hebreo y del Antiguo Testamento en Union Theological Seminary de Virginia. Su A History of Israel es considerada la historia del Antiguo Israel más influyente del siglo XX en el mundo anglohablante.",
      en: "John Bright (1908–1995) was Professor of Hebrew and Old Testament at Union Theological Seminary in Virginia. His A History of Israel is considered the most influential history of ancient Israel of the twentieth century in the English-speaking world.",
      pt: "John Bright (1908–1995) foi Professor de Hebraico e do Antigo Testamento no Union Theological Seminary da Virgínia. Seu A History of Israel é considerada a história do antigo Israel mais influente do século XX no mundo anglófono.",
    },
    metodo: {
      es: "Integra evidencia arqueológica, textos del Antiguo Oriente Próximo y fuentes bíblicas para reconstruir la historia de Israel. Defiende la historicidad sustancial de los relatos bíblicos frente al escepticismo de la escuela de Alt-Noth.",
      en: "Integrates archaeological evidence, Ancient Near Eastern texts, and biblical sources to reconstruct the history of Israel. It defends the substantial historicity of the biblical narratives against the skepticism of the Alt-Noth school.",
      pt: "Integra evidências arqueológicas, textos do Antigo Oriente Próximo e fontes bíblicas para reconstruir a história de Israel. Defende a historicidade substancial dos relatos bíblicos frente ao ceticismo da escola de Alt-Noth.",
    },
    aportacion: {
      es: "Provee el contexto histórico y arqueológico para el campo 'contextoHistorico' del pipeline y los sub-campos 'biografiaHistorica' de los personajes.",
      en: "Provides the historical and archaeological context for the pipeline's 'contextoHistorico' field and the characters' 'biografiaHistorica' sub-fields.",
      pt: "Fornece o contexto histórico e arqueológico para o campo 'contextoHistorico' do pipeline e os subcampos 'biografiaHistorica' dos personagens.",
    },
  },

  "Ancient Egypt and the Old Testament": {
    camposUtilizados: {
      es: ["Contexto Egipcio", "ANE", "Pentateuco"],
      en: ["Egyptian Context", "ANE", "Pentateuch"],
      pt: ["Contexto Egípcio", "ANE", "Pentateuco"],
    },
    bio: {
      es: "John Currid es Profesor de Antiguo Testamento en Reformed Theological Seminary (Charlotte). Especialista en Egipto antiguo y su relación con el AT, con doctorado de la Universidad de Chicago y trabajo de campo en excavaciones egipcias.",
      en: "John Currid is Professor of Old Testament at Reformed Theological Seminary (Charlotte). A specialist in ancient Egypt and its relationship to the OT, he holds a doctorate from the University of Chicago and has done fieldwork in Egyptian excavations.",
      pt: "John Currid é Professor do Antigo Testamento no Reformed Theological Seminary (Charlotte). Especialista no Egito antigo e sua relação com o AT, possui doutorado pela Universidade de Chicago e trabalhou em campo em escavações egípcias.",
    },
    metodo: {
      es: "Examina cómo el trasfondo cultural y político de Egipto ilumina los textos del Pentateuco. Demuestra que el texto bíblico subvierte e invierte los motivos culturales egipcios para proclamar la superioridad de YHWH.",
      en: "Examines how the cultural and political background of Egypt illuminates the texts of the Pentateuch. Demonstrates that the biblical text subverts and inverts Egyptian cultural motifs to proclaim the supremacy of YHWH.",
      pt: "Examina como o contexto cultural e político do Egito ilumina os textos do Pentateuco. Demonstra que o texto bíblico subverte e inverte os motivos culturais egípcios para proclamar a superioridade de YHWH.",
    },
    aportacion: {
      es: "Es la fuente primaria para el contexto egipcio de Génesis (relato de José), proveyendo los datos del campo 'arqueologia' y 'fuentesANE' relacionados con Egipto.",
      en: "It is the primary source for the Egyptian context of Genesis (the Joseph narrative), supplying data for the 'arqueologia' and 'fuentesANE' fields related to Egypt.",
      pt: "É a fonte primária para o contexto egípcio de Gênesis (narrativa de José), fornecendo os dados do campo 'arqueologia' e 'fuentesANE' relacionados ao Egito.",
    },
  },

  "Genesis — NICOT": {
    camposUtilizados: {
      es: ["Exégesis", "Personajes", "Estructura Literaria"],
      en: ["Exegesis", "Characters", "Literary Structure"],
      pt: ["Exegese", "Personagens", "Estrutura Literária"],
    },
    bio: {
      es: "Victor P. Hamilton es Profesor Emérito de Religión y Filosofía en Asbury University. Su comentario en dos volúmenes sobre Génesis en la serie NICOT es considerado el comentario académico evangélico estándar sobre el libro.",
      en: "Victor P. Hamilton is Professor Emeritus of Religion and Philosophy at Asbury University. His two-volume commentary on Genesis in the NICOT series is considered the standard evangelical academic commentary on the book.",
      pt: "Victor P. Hamilton é Professor Emérito de Religião e Filosofia na Asbury University. Seu comentário em dois volumes sobre Gênesis na série NICOT é considerado o comentário acadêmico evangélico padrão sobre o livro.",
    },
    metodo: {
      es: "Combina exégesis del texto hebreo con análisis literario, trasfondo del ANE e interpretación teológica. La serie NICOT es producida por eruditos que afirman la autoridad e inerrancia de la Escritura.",
      en: "Combines exegesis of the Hebrew text with literary analysis, ANE background, and theological interpretation. The NICOT series is produced by scholars who affirm the authority and inerrancy of Scripture.",
      pt: "Combina exegese do texto hebraico com análise literária, contexto do ANE e interpretação teológica. A série NICOT é produzida por eruditos que afirmam a autoridade e inerrância das Escrituras.",
    },
    aportacion: {
      es: "Provee la exégesis detallada para las biografías bíblicas de los personajes, el análisis de la estructura literaria (toledot) y los paralelos con el ANE.",
      en: "Provides detailed exegesis for the biblical biographies of characters, the analysis of the literary structure (toledot), and parallels with the ANE.",
      pt: "Fornece a exegese detalhada para as biografias bíblicas dos personagens, a análise da estrutura literária (toledot) e os paralelos com o ANE.",
    },
  },
};

// ── Apply patches ─────────────────────────────────────────────────────────────

for (const f of data.fuentes) {
  const patch = FUENTES_DATA[f.titulo];
  if (!patch) {
    console.warn(`WARNING: no patch data found for fuente "${f.titulo}" — skipped`);
    continue;
  }

  f.camposUtilizados = patch.camposUtilizados;
  f.popup.bio = patch.bio;
  f.popup.metodo = patch.metodo;
  f.popup.aportacion = patch.aportacion;
}

// ── Write ─────────────────────────────────────────────────────────────────────

fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
console.log("Patched", FILE);

// ── Spot-check ────────────────────────────────────────────────────────────────

const check = data.fuentes[0];
console.log("\nSpot-check — fuentes[0] (ESV Study Bible):");
console.log("  camposUtilizados.en:", check.camposUtilizados.en);
console.log("  popup.bio.en:", check.popup.bio.en);
console.log("  popup.metodo.pt:", check.popup.metodo.pt);
console.log("  popup.aportacion.pt:", check.popup.aportacion.pt);

const check7 = data.fuentes[7];
console.log("\nSpot-check — fuentes[7] (Genesis — NICOT):");
console.log("  camposUtilizados.pt:", check7.camposUtilizados.pt);
console.log("  popup.bio.en:", check7.popup.bio.en);
