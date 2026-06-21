import { useState, useEffect } from "react";
import { adaptManifestBook, adaptFuentes, adaptTheology, adaptCapitulos, adaptContextoHistorico, adaptVersiculosClave, adaptAnclasConfesionales, adaptTiposYSombras, adaptPersonajes } from "./adapters/canonToViewer";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#E8C56A";
const LAPIS = "#1B2A4A";
const LAPIS_DEEP = "#0F1A30";
const PARCHMENT = "#F2E8D0";
const SIENNA = "#8B3A2A";

// ── BIBLE GATEWAY LINK HELPER ─────────────────────────────────────────────────

const BOOK_MAP = {
  // ── Spanish ──────────────────────────────────────────────────────────────
  "Gn": "Genesis", "Gén": "Genesis", "Génesis": "Genesis",
  "Ex": "Exodus", "Éx": "Exodus", "Éxodo": "Exodus",
  "Lv": "Leviticus", "Lev": "Leviticus", "Levítico": "Leviticus",
  "Nm": "Numbers", "Núm": "Numbers", "Números": "Numbers",
  "Dt": "Deuteronomy", "Deut": "Deuteronomy", "Deuteronomio": "Deuteronomy",
  "Jos": "Joshua", "Josué": "Joshua",
  "Jue": "Judges", "Jueces": "Judges",
  "Rt": "Ruth", "Rut": "Ruth",
  "1S": "1Samuel", "1Sa": "1Samuel", "1Samuel": "1Samuel",
  "2S": "2Samuel", "2Sa": "2Samuel", "2Samuel": "2Samuel",
  "1R": "1Kings", "1Re": "1Kings",
  "2R": "2Kings", "2Re": "2Kings",
  "1Cr": "1Chronicles",
  "2Cr": "2Chronicles",
  "Esd": "Ezra", "Esdras": "Ezra",
  "Neh": "Nehemiah", "Nehemías": "Nehemiah",
  "Est": "Esther", "Ester": "Esther",
  "Job": "Job",
  "Sal": "Psalms", "Salmo": "Psalms", "Salmos": "Psalms",
  "Pr": "Proverbs", "Prov": "Proverbs", "Proverbios": "Proverbs",
  "Ec": "Ecclesiastes", "Ecl": "Ecclesiastes", "Eclesiastés": "Ecclesiastes",
  "Cnt": "Song+of+Songs", "Cantares": "Song+of+Songs",
  "Is": "Isaiah", "Isaías": "Isaiah",
  "Jer": "Jeremiah", "Jeremías": "Jeremiah",
  "Lm": "Lamentations", "Lamentaciones": "Lamentations",
  "Ez": "Ezekiel", "Ezequiel": "Ezekiel",
  "Dn": "Daniel", "Daniel": "Daniel",
  "Os": "Hosea", "Oseas": "Hosea",
  "Jl": "Joel", "Joel": "Joel",
  "Am": "Amos", "Amós": "Amos",
  "Abd": "Obadiah", "Abdías": "Obadiah",
  "Jon": "Jonah", "Jonás": "Jonah",
  "Miq": "Micah", "Miqueas": "Micah",
  "Nah": "Nahum", "Nahúm": "Nahum",
  "Hab": "Habakkuk", "Habacuc": "Habakkuk",
  "Sof": "Zephaniah", "Sofonías": "Zephaniah",
  "Hag": "Haggai", "Hageo": "Haggai",
  "Zac": "Zechariah", "Zacarías": "Zechariah",
  "Mal": "Malachi", "Malaquías": "Malachi",
  "Mt": "Matthew", "Mat": "Matthew", "Mateo": "Matthew",
  "Mr": "Mark", "Mc": "Mark", "Marcos": "Mark",
  "Lc": "Luke", "Lucas": "Luke",
  "Jn": "John", "Juan": "John",
  "Hch": "Acts", "Hechos": "Acts",
  "Ro": "Romans", "Romanos": "Romans",
  "1Co": "1Corinthians", "1Corintios": "1Corinthians",
  "2Co": "2Corinthians", "2Corintios": "2Corinthians",
  "Gá": "Galatians", "Gálatas": "Galatians",
  "Ef": "Ephesians", "Efesios": "Ephesians",
  "Fil": "Philippians", "Filipenses": "Philippians",
  "Col": "Colossians", "Colosenses": "Colossians",
  "1Ts": "1Thessalonians", "1Tesalonicenses": "1Thessalonians",
  "2Ts": "2Thessalonians", "2Tesalonicenses": "2Thessalonians",
  "1Ti": "1Timothy", "1Timoteo": "1Timothy",
  "2Ti": "2Timothy", "2Timoteo": "2Timothy",
  "Tit": "Titus", "Tito": "Titus",
  "Flm": "Philemon", "Filemón": "Philemon",
  "He": "Hebrews", "Hebreos": "Hebrews",
  "Stg": "James", "Santiago": "James",
  "1P": "1Peter", "1Pe": "1Peter", "1Pedro": "1Peter",
  "2P": "2Peter", "2Pe": "2Peter", "2Pedro": "2Peter",
  "1Jn": "1John", "1Juan": "1John",
  "2Jn": "2John", "2Juan": "2John",
  "3Jn": "3John", "3Juan": "3John",
  "Jud": "Jude", "Judas": "Jude",
  "Ap": "Revelation", "Apoc": "Revelation", "Apocalipsis": "Revelation",
  // ── English ───────────────────────────────────────────────────────────────
  "Gen": "Genesis",
  "Exod": "Exodus",
  "Josh": "Joshua",
  "Judg": "Judges",
  "1Sam": "1Samuel", "2Sam": "2Samuel",
  "1Kgs": "1Kings",  "2Kgs": "2Kings",
  "1Chr": "1Chronicles", "2Chr": "2Chronicles",
  "Ezra": "Ezra",
  "Ps": "Psalms", "Psa": "Psalms",
  "Eccl": "Ecclesiastes",
  "Song": "Song+of+Songs",
  "Isa": "Isaiah",
  "Lam": "Lamentations",
  "Ezek": "Ezekiel",
  "Dan": "Daniel",
  "Hos": "Hosea",
  "Obad": "Obadiah",
  "Mic": "Micah",
  "Zeph": "Zephaniah",
  "Zech": "Zechariah",
  "Acts": "Acts",
  "Rom": "Romans",
  "1Cor": "1Corinthians", "2Cor": "2Corinthians",
  "Gal": "Galatians",
  "Eph": "Ephesians",
  "Phil": "Philippians",
  "1Thess": "1Thessalonians", "2Thess": "2Thessalonians",
  "1Tim": "1Timothy",         "2Tim": "2Timothy",
  "Phlm": "Philemon",
  "Heb": "Hebrews",
  "Jas": "James",
  "1Pet": "1Peter", "2Pet": "2Peter",
  "1John": "1John", "2John": "2John", "3John": "3John",
  "Jude": "Jude",
  "Rev": "Revelation",
  // ── Portuguese ────────────────────────────────────────────────────────────
  "Jo": "John",
  "At": "Acts",
  "Rm": "Romans",
  "Gl": "Galatians",
  "Fl": "Philippians",
  "Cl": "Colossians",
  "1Tm": "1Timothy", "2Tm": "2Timothy",
  "Hb": "Hebrews",
  "Tg": "James",
  // ── Portuguese additions ──────────────────────────────────────────────────
  "Sl": "Psalms", "Pv": "Proverbs",
  "Jr": "Jeremiah", "Js": "Joshua", "Jz": "Judges",
  "Jó": "Job",
  "1Rs": "1Kings", "2Rs": "2Kings",
  "1Sm": "1Samuel", "2Sm": "2Samuel",
  "Zc": "Zechariah", "Ml": "Malachi",
  "Mq": "Micah", "Miquéias": "Micah",
  "Hc": "Habakkuk", "Sf": "Zephaniah",
  "Fp": "Philippians",
  "1Jo": "1John", "2Jo": "2John", "3Jo": "3John",
  "Hebreus": "Hebrews", "Tiago": "James",
  "Apocalipse": "Revelation", "Re": "Revelation",
  "Juízes": "Judges", "1Reis": "1Kings", "2Reis": "2Kings",
  "1Coríntios": "1Corinthians", "2Coríntios": "2Corinthians",
  // ── English full names & extra abbreviations ──────────────────────────────
  "Genesis": "Genesis", "Exodus": "Exodus", "Leviticus": "Leviticus",
  "Numbers": "Numbers", "Num": "Numbers", "Nu": "Numbers",
  "Deuteronomy": "Deuteronomy", "Joshua": "Joshua", "Judges": "Judges",
  "Ruth": "Ruth", "Nehemiah": "Nehemiah", "Esther": "Esther",
  "Psalms": "Psalms", "Psalm": "Psalms",
  "Proverbs": "Proverbs", "Ecclesiastes": "Ecclesiastes",
  "Isaiah": "Isaiah", "Jeremiah": "Jeremiah", "Lamentations": "Lamentations",
  "Ezekiel": "Ezekiel", "Daniel": "Daniel", "Hosea": "Hosea",
  "Joel": "Joel", "Amos": "Amos", "Jonah": "Jonah", "Micah": "Micah",
  "Nahum": "Nahum", "Habakkuk": "Habakkuk", "Zechariah": "Zechariah",
  "Malachi": "Malachi",
  "Matthew": "Matthew", "Matt": "Matthew",
  "Mark": "Mark", "Mk": "Mark",
  "Luke": "Luke", "Lk": "Luke",
  "John": "John",
  "Hebrews": "Hebrews", "James": "James",
  "Romans": "Romans", "Revelation": "Revelation",
  "1Kings": "1Kings", "2Kings": "2Kings",
  // ── Other variants ────────────────────────────────────────────────────────
  "Ga": "Galatians",
  "Ho": "Hosea",
  "Ac": "Acts",
  "1Corinthians": "1Corinthians", "2Corinthians": "2Corinthians",
  "1Peter": "1Peter", "2Peter": "2Peter",
  "1Reyes": "1Kings", "2Reyes": "2Kings",
};

const BIBLE_VERSION = { es: "NBLA", en: "ESV", pt: "NAA" };

function verseUrl(ref, lang = "es") {
  if (!ref) return null;
  const clean = ref.trim().split("—")[0].trim();
  const m = clean.match(/^((?:\d+\s?)?[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ]*)\s+(\d+(?:[–\-]\d+)?(?::\d+(?:[–\-,]\d+)*)?)/);
  if (!m) return null;
  const abbrev = m[1].replace(" ", "");
  const passage = m[2].replace("–", "-");
  const bookEn = BOOK_MAP[abbrev] || null;
  if (!bookEn) return null;
  const search = `${bookEn} ${passage}`.replace(/ /g, "+");
  const version = BIBLE_VERSION[lang] || "NBLA";
  return `https://www.biblegateway.com/passage/?search=${search}&version=${version}`;
}

function linkifyVerses(text, lang = "es") {
  if (!text) return text;
  const VERSE_PATTERN = /(\(?)((?:\d+\s?)?[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ]*\s+\d+(?:[–\-]\d+)?(?::\d+(?:[–\-,]\d+)*)?)(\)?)/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = VERSE_PATTERN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const pre = m[1];
    const ref = m[2];
    const post = m[3];
    if (pre) parts.push(pre);
    const url = verseUrl(ref, lang);
    if (url) {
      parts.push(
        <a key={`${ref}-${m.index}`} href={url} target="_blank" rel="noopener noreferrer"
          style={{ color: GOLD, fontWeight: 700, textDecoration: "none",
            borderBottom: "1px solid rgba(201,168,76,0.35)", letterSpacing: "0.3px" }}
          onMouseEnter={e => { e.target.style.color = GOLD_BRIGHT; e.target.style.borderBottomColor = GOLD_BRIGHT; }}
          onMouseLeave={e => { e.target.style.color = GOLD; e.target.style.borderBottomColor = "rgba(201,168,76,0.35)"; }}>
          {ref}
        </a>
      );
    } else {
      parts.push(ref);
    }
    if (post) parts.push(post);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? text : parts;
}

function VerseLink({ children, lang = "es", style = {} }) {
  const url = verseUrl(children, lang);
  const base = {
    fontFamily: "'Georgia',serif", fontWeight: 700, color: GOLD, letterSpacing: "0.5px",
    textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.35)`,
    transition: "border-color 0.15s, color 0.15s", cursor: url ? "pointer" : "default", ...style,
  };
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={base}
        onMouseEnter={e => { e.target.style.color = GOLD_BRIGHT; e.target.style.borderBottomColor = GOLD_BRIGHT; }}
        onMouseLeave={e => { e.target.style.color = GOLD; e.target.style.borderBottomColor = "rgba(201,168,76,0.35)"; }}>
        {children}
      </a>
    );
  }
  return <span style={{ ...base, borderBottom: "none" }}>{children}</span>;
}

/**
 * Computes a tab cell's height from its OWN book name length, instead of every
 * cell sharing one height sized for the longest name in the canon. That global
 * approach left short names like "Job" or "Rut" floating in the middle of a
 * box built for "1 Tesalonicenses", with ~80-120px of dead space above and
 * below — the "huge margin" problem. Each cell is now just tall enough for its
 * own rotated single line, plus a fixed pixel allowance for vertical padding,
 * border, and the ready-dot indicator, with a minimum so short names still
 * read as a real tab rather than a sliver.
 */
function tabCellHeight(name) {
  // CHAR_PX must be >= fontSize * stepTabLabel's CSS lineHeight, or the cell will
  // be mathematically too short for its own rotated text (verified: 17 * 0.9 = 15.3
  // is the real per-character footprint at the current font/line-height — going
  // below that risks clipping, not just tight margin). The visible reduction comes
  // from CHROME_PX/MIN_PX and the cell's own padding instead.
  const CHAR_PX = 17 * 0.9; // matches stepTabLabel's fontSize/lineHeight — keep in sync
  const CHROME_PX = 6;        // padding + borders + dot clearance
  const MIN_PX = 36;          // floor so 2-3 char names still look like a tab
  return Math.max(MIN_PX, Math.round(name.length * CHAR_PX + CHROME_PX));
}

/**
 * Splits `items` into `cols` CONTIGUOUS groups (preserving canonical order —
 * each column stays one consecutive run of the canon, matching the physical
 * Bible tab reference) while minimizing the tallest resulting column's total
 * height. A naive equal-COUNT split (N items per column regardless of length)
 * left columns wildly uneven — e.g. a column that happened to contain both
 * "1 Tesalonicenses" and "2 Tesalonicenses" ran ~1220px tall while a neighbor
 * with shorter names ran ~660px, wasting most of that column's vertical space.
 * This uses binary search on the answer (a standard technique for "split an
 * array into k contiguous parts minimizing the largest part") to find the
 * smallest possible "tallest column" height, then reconstructs the split.
 */
function balancedContiguousSplit(items, heights, cols) {
  const canFit = (maxAllowed) => {
    let neededCols = 1, running = 0;
    for (const h of heights) {
      if (h > maxAllowed) return false;
      if (running + h > maxAllowed) { neededCols++; running = h; }
      else running += h;
    }
    return neededCols <= cols;
  };
  let lo = Math.max(...heights), hi = heights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (canFit(mid)) hi = mid; else lo = mid + 1;
  }
  const maxAllowed = lo;
  const result = [];
  let start = 0, running = 0;
  for (let i = 0; i < items.length; i++) {
    if (running + heights[i] > maxAllowed) {
      result.push(items.slice(start, i));
      start = i; running = heights[i];
    } else {
      running += heights[i];
    }
  }
  result.push(items.slice(start));
  return result;
}

// ── DIVISIONS — controlled vocabulary, color-coded, full tour content ────────

const DIVISIONS = [
  {
    id: "pentateuco",
    titulo: "Pentateuco",
    tituloEn: "The Pentateuch",
    tituloPt: "O Pentateuco",
    color: "#4A6741",
    rango: "Génesis – Deuteronomio",
    testamento: "Antiguo",
    tagline: "La Torá — el fundamento de toda revelación posterior",
    resumen: "Los cinco primeros libros del canon, atribuidos por la tradición reformada a la autoría mosaica (con la posible excepción del relato de su muerte en Dt 34, añadido por una mano posterior, probablemente Josué). Narran desde la creación del cosmos hasta la muerte de Moisés a las puertas de Canaán: la cosmogonía, la caída, el diluvio, el llamado patriarcal, el éxodo, la entrega de la Ley en Sinaí y la peregrinación por el desierto.",
    fondoHistorico: "Compuesto en el contexto del Bronce Tardío (c. 1446–1406 a.C. según la cronología larga reformada, que toma 1R 6:1 como dato literal), el Pentateuco refleja con precisión el mundo del Antiguo Oriente Próximo del segundo milenio: tratados de vasallaje hititas (la estructura del pacto en Éxodo y Deuteronomio sigue el formato de tratado suzerano-vasallo del s. XIV–XIII a.C.), prácticas legales mesopotámicas (paralelos y contrastes con el Código de Hammurabi), y la cultura egipcia del Imperio Nuevo que domina el trasfondo de Éxodo. La crítica documentaria (JEDP, Wellhausen) propuso una composición tardía y compuesta; la posición reformada confiesa la autoría mosaica sustancial, consistente con el testimonio de Cristo mismo (Jn 5:46; Lc 24:27,44) y de los apóstoles.",
    porQueAgrupados: "Estos cinco libros forman una sola obra literaria continua — la Torá — unida por la genealogía narrativa (toledot), por la autoría mosaica y, sobre todo, porque juntos establecen el marco teológico que todo el resto de la Escritura presupone: la doctrina de Dios como Creador, la naturaleza del pecado, la elección de un pueblo pactual, y la Ley como expresión del carácter divino. Ningún libro posterior del canon puede leerse correctamente sin el Pentateuco como cimiento.",
    epocaPacto: "Aquí se establecen, en sucesión, el Pacto Adámico (obras), el Pacto Noáico (preservación universal) y el Pacto Abrahánico (promesa de tierra, simiente y bendición) — y al cierre del Pentateuco, el Pacto Mosaico (Ley) administra ese mismo pacto de gracia bajo la nación de Israel como pueblo de posesión exclusiva de Dios.",
    enfoqueCristologico: "El Pentateuco anticipa a Cristo de manera explícita (la simiente de la mujer, Gn 3:15; el profeta semejante a Moisés, Dt 18:15) y típica: el cordero pascual, el sumo sacerdote, el tabernáculo como morada de Dios entre los hombres, y Moisés mismo como mediador y libertador que prefigura al Mediador definitivo.",
    distintivaReformada: "La tradición reformada sostiene la unidad mosaica del Pentateuco frente a la hipótesis documentaria, no por mero conservadurismo sino porque el testimonio interno del propio texto (Ex 24:4; Dt 31:9,24) y el testimonio de Cristo (Jn 5:46–47: 'si creyeseis a Moisés, me creeríais a mí') hacen de la autoría mosaica un asunto de fidelidad a la autoridad de la Escritura misma, no solo de crítica literaria.",
    versiculoClave: "Dt 6:4-5",
    libros: [
      { es: "Génesis", razon: "Los orígenes: creación, caída, diluvio, y el llamado de los patriarcas. Establece cada doctrina fundacional que el resto del canon desarrollará." },
      { es: "Éxodo", razon: "La redención de Israel de la esclavitud egipcia y la entrega de la Ley en Sinaí — el patrón redentor (liberación + pacto) que estructura toda la soteriología bíblica." },
      { es: "Levítico", razon: "El código de santidad y el sistema sacrificial que regula cómo un pueblo pecador puede acercarse a un Dios santo — la base typológica de la obra expiatoria de Cristo." },
      { es: "Números", razon: "El censo y la peregrinación de cuarenta años por el desierto: el juicio sobre la incredulidad de una generación y la fidelidad de Dios para preservar a la siguiente." },
      { es: "Deuteronomio", razon: "El segundo discurso de la Ley, renovación del pacto en la frontera de Canaán — estructurado como un tratado de vasallaje del ANE, cierra el Pentateuco con la muerte de Moisés." },
    ],
  },
  {
    id: "historico-at",
    titulo: "Histórico",
    tituloEn: "Historical Books",
    color: "#1B5E8B",
    rango: "Josué – Ester",
    testamento: "Antiguo",
    tagline: "La conquista, la monarquía y el exilio del pueblo del pacto",
    resumen: "Doce libros que narran la historia de Israel desde la conquista de Canaán bajo Josué (c. 1406 a.C.) hasta la restauración postexílica bajo Esdras y Nehemías (s. V a.C.) — unos novecientos años de historia nacional, abarcando la conquista, el período de los jueces, el establecimiento de la monarquía unida (Saúl, David, Salomón), la división del reino, la apostasía progresiva, el exilio asirio del norte y babilónico del sur, y el retorno bajo el decreto persa de Ciro.",
    fondoHistorico: "Este período se cruza directamente con los grandes imperios documentados extrabíblicamente: la Estela de Merneptah (c. 1208 a.C.) es la primera mención extrabíblica de 'Israel' como entidad en Canaán; la Estela de Tel Dan (s. IX a.C.) menciona la 'casa de David'; los anales asirios de Salmanasar III registran a Acab de Israel en la batalla de Qarqar (853 a.C.); el Cilindro de Ciro (539 a.C.) confirma la política persa de repatriación de pueblos cautivos que permitió el retorno judío descrito en Esdras. La arqueología de los siglos XX y XXI ha producido fuerte debate sobre la extensión de la monarquía davídica-salomónica (el 'minimalismo' vs. el 'maximalismo' bíblico), pero los hallazgos de Tel Dan y la arquitectura monumental de Meguido y Hazor han reforzado la posición conservadora frente al escepticismo de mediados del s. XX.",
    porQueAgrupados: "Estos libros comparten género narrativo-historiográfico y trazan una sola línea cronológica continua de la historia nacional de Israel — aunque 1–2 Crónicas relee la misma historia de Samuel-Reyes con un énfasis sacerdotal y davídico distinto, escrito para la comunidad postexílica. Juntos documentan el ciclo pactual repetido: bendición por obediencia, apostasía, juicio, y la fidelidad persistente de Dios a su promesa davídica pese al fracaso humano constante.",
    epocaPacto: "Domina el Pacto Mosaico en su fase de administración nacional (bendiciones y maldiciones de Dt 28 cumpliéndose literalmente), y emerge aquí el Pacto Davídico (2S 7) — la promesa de un trono eterno que ningún rey humano de esta división cumple plenamente, dejando una tensión que solo Cristo resuelve.",
    enfoqueCristologico: "El fracaso sostenido de cada rey humano —incluso David y Salomón— para encarnar plenamente la justicia del reino de Dios genera una expectativa mesiánica creciente. El trono davídico vacío tras el exilio (no hay rey en Esdras-Nehemías) deja al lector del canon esperando al Hijo de David prometido (2S 7:12-13) cuyo reino sí será eterno.",
    distintivaReformada: "La tradición reformada lee estos libros no como mera crónica política sino como historiografía teológica: cada evento se narra para mostrar la fidelidad del pacto de Dios pese a la infidelidad humana — un patrón que culmina, no en la institución monárquica israelita, sino en el Rey perfecto que esa institución solo podía prefigurar.",
    versiculoClave: "2S 7:16",
    libros: [
      { es: "Josué", razon: "La conquista de Canaán: cumplimiento de la promesa de la tierra hecha a Abraham, bajo el sucesor de Moisés cuyo nombre (Yehoshua) es la forma hebrea de 'Jesús'." },
      { es: "Jueces", razon: "El ciclo de apostasía-opresión-clamor-liberación bajo jueces carismáticos, documentando la anarquía espiritual de 'cada uno hacía lo que bien le parecía' sin un rey fiel." },
      { es: "Rut", razon: "Una historia de lealtad pactual (hesed) ambientada en el período de los jueces, que culmina en la genealogía davídica — y por tanto mesiánica." },
      { es: "1 Samuel", razon: "La transición de jueces a monarquía: el rechazo del liderazgo carismático, la unción de Saúl y su fracaso, y el ascenso de David." },
      { es: "2 Samuel", razon: "El reinado de David y el Pacto Davídico (2S 7) — la promesa de una dinastía y un trono eternos, eje mesiánico de toda la historia subsiguiente." },
      { es: "1 Reyes", razon: "El apogeo de Salomón y la construcción del templo, seguidos por la división del reino tras su apostasía — el inicio de la decadencia dual." },
      { es: "2 Reyes", razon: "La caída de ambos reinos: Israel al exilio asirio (722 a.C.) y Judá al exilio babilónico (586 a.C.) — el juicio pactual cumplido en la historia." },
      { es: "1 Crónicas", razon: "Relectura sacerdotal-davídica de la historia para la comunidad postexílica, con genealogías que conectan a Adán con David — reafirmando la promesa pese al exilio." },
      { es: "2 Crónicas", razon: "Historia del reino del sur con énfasis en el templo y la reforma religiosa, cerrando con el decreto de Ciro que abre la puerta al retorno." },
      { es: "Esdras", razon: "El retorno del exilio y la reconstrucción del templo bajo el decreto persa — la fidelidad de Dios para restaurar a un remanente." },
      { es: "Nehemías", razon: "La reconstrucción de los muros de Jerusalén y la renovación del pacto bajo Esdras y Nehemías, estableciendo la comunidad postexílica." },
      { es: "Ester", razon: "La preservación providencial del pueblo judío en la diáspora persa — Dios actúa sin ser mencionado explícitamente, modelo de providencia oculta." },
    ],
  },
  {
    id: "sabiduria",
    titulo: "Sabiduría y Poesía",
    tituloEn: "Wisdom & Poetry",
    color: "#6B4A8B",
    rango: "Job – Cantares",
    testamento: "Antiguo",
    tagline: "La piedad reflexiva: sufrimiento, adoración, sabiduría práctica y amor pactual",
    resumen: "Cinco libros de género poético hebreo (caracterizado por el paralelismo de pensamiento, no la rima) que tratan, cada uno desde un ángulo distinto, la pregunta de cómo vivir sabiamente delante de Dios: el sufrimiento del justo (Job), la adoración congregacional e individual (Salmos), la sabiduría práctica cotidiana (Proverbios), el sinsentido aparente de la vida 'bajo el sol' (Eclesiastés), y el amor conyugal como don bueno de Dios (Cantares).",
    fondoHistorico: "La literatura sapiencial era un género panorámico del Antiguo Oriente Próximo —existen paralelos egipcios (la Instrucción de Amenemope, con semejanzas notables a Pr 22:17–24:22) y mesopotámicos (el 'Job babilónico', Ludlul Bel Nemeqi)— pero la sabiduría bíblica se distingue radicalmente al fundamentar toda sabiduría en 'el temor de Jehová' (Pr 1:7; 9:10) y no en la mera observación pragmática del orden cósmico. Los Salmos, compuestos a lo largo de un milenio (de Moisés en el Sal 90 hasta el período postexílico), reflejan el uso litúrgico del templo de Salomón y la sinagoga postexílica. Job está ambientado en la era patriarcal (sin referencias a la Ley mosaica, sacrificios hechos por el propio patriarca como sacerdote familiar), aunque su composición literaria es debatida.",
    porQueAgrupados: "Comparten forma poética hebrea y función reflexiva: a diferencia de los libros históricos (que narran lo que Dios hizo) o proféticos (que declaran lo que Dios dice que hará), estos libros exploran cómo el pueblo del pacto debe pensar, sentir, sufrir, adorar y amar delante de Dios en medio de la vida ordinaria y extraordinaria.",
    epocaPacto: "Estos libros no avanzan la línea narrativa del pacto sino que la presuponen, dándole expresión emocional y reflexiva: los Salmos son la voz orante de Israel bajo el pacto davídico; Proverbios aplica la sabiduría de la Ley a la vida diaria; Job antecede formalmente a Sinaí pero confronta la pregunta universal de la justicia divina.",
    enfoqueCristologico: "Los Salmos son citados en el NT más que cualquier otro libro del AT como referidos directamente a Cristo (el Salmo 22 en la cruz, el Salmo 110 como el más citado de todo el NT). Job anticipa la necesidad de un mediador-árbitro entre Dios y el hombre (Job 9:33; 19:25, 'yo sé que mi Redentor vive'). Proverbios personifica la Sabiduría (Pr 8) de un modo que el NT aplica a Cristo, la sabiduría de Dios encarnada (1Co 1:24).",
    distintivaReformada: "La tradición reformada lee los Salmos como el manual de oración inspirado de la iglesia —Calvino los llamó 'una anatomía de todas las partes del alma'— y sostiene que Eclesiastés no enseña escepticismo sino que demuestra, mediante la experiencia de Salomón, la futilidad de buscar sentido último 'bajo el sol' aparte de Dios, preparando al lector para la trascendencia que solo la revelación divina provee.",
    versiculoClave: "Pr 1:7",
    libros: [
      { es: "Job", razon: "La pregunta del sufrimiento inocente confrontada sin respuestas fáciles, resuelta no con explicación sino con la revelación de la soberanía y sabiduría incomprensibles de Dios (Job 38-41)." },
      { es: "Salmos", razon: "150 oraciones y cánticos que expresan toda la gama de la experiencia humana delante de Dios — lamento, alabanza, confianza, arrepentimiento — el himnario inspirado de la fe del pacto." },
      { es: "Proverbios", razon: "Sabiduría práctica para la vida cotidiana, fundamentada en 'el temor de Jehová' como principio de todo conocimiento verdadero (Pr 1:7)." },
      { es: "Eclesiastés", razon: "La búsqueda de sentido 'bajo el sol' que termina en vanidad aparte de Dios, concluyendo que el deber del hombre es temer a Dios y guardar sus mandamientos (Ec 12:13)." },
      { es: "Cantares", razon: "Un poema de amor conyugal que celebra el matrimonio como don bueno de Dios, leído tradicionalmente también como figura del amor de Cristo por su Iglesia." },
    ],
  },
  {
    id: "profetas-mayores",
    titulo: "Profetas Mayores",
    tituloEn: "Major Prophets",
    color: "#8B3A2A",
    rango: "Isaías – Daniel",
    testamento: "Antiguo",
    tagline: "Voces extensas de juicio y esperanza en el ocaso de las dos monarquías",
    resumen: "Cinco libros llamados 'mayores' no por mayor importancia espiritual sino por su extensión literaria. Isaías, Jeremías (junto con Lamentaciones, su elegía sobre la caída de Jerusalén), Ezequiel y Daniel ministran durante el período más oscuro de la historia de Israel: el ocaso del reino del sur, la caída de Jerusalén (586 a.C.) y el exilio babilónico — combinando denuncia del pecado del pacto, anuncio de juicio inminente, y promesas de restauración futura centradas en un Mesías venidero.",
    fondoHistorico: "Este período (c. 740–530 a.C.) coincide con el ascenso y caída del imperio neo-asirio y el ascenso del imperio neo-babilónico bajo Nabucodonosor II, documentado extensamente en las Crónicas Babilónicas y los anales asirios. Las profecías de Isaías contra naciones específicas (caps. 13–23) son corroboradas por registros asirios y babilónicos de las campañas militares de la época. El libro de Daniel está ambientado en la corte babilónica y luego persa, con detalles administrativos (como la organización satrapal persa, Dn 6:1) confirmados por fuentes extrabíblicas, aunque la datación del libro mismo —ya sea en el s. VI a.C. (posición conservadora, defendida por la precisión histórica del relato) o en el s. II a.C. (posición crítica, por la especificidad de las profecías sobre los imperios helenísticos)— sigue siendo objeto de debate académico significativo; la tradición reformada sostiene la datación temprana, consistente con el testimonio de Cristo sobre 'Daniel el profeta' (Mt 24:15).",
    porQueAgrupados: "Comparten extensión, género oracular-narrativo mixto, y el contexto histórico compartido del juicio y exilio de Judá — aunque Ezequiel y Daniel profetizan ya desde el exilio mismo en Babilonia, mientras Isaías y Jeremías lo anuncian de antemano desde Jerusalén.",
    epocaPacto: "Estos libros operan bajo la 'Anticipación Profética': el pacto mosaico ha sido roto de manera flagrante (las maldiciones de Dt 28 se cumplen literalmente en el exilio), pero Dios promete, a través de estos mismos profetas, un Nuevo Pacto (Jer 31:31-34) que tendrá éxito donde el pacto mosaico, dada la dureza del corazón humano, no pudo.",
    enfoqueCristologico: "Isaías 53 es el texto del Siervo Sufriente más citado del AT respecto a la expiación sustitutiva de Cristo. Jeremías 31 profetiza explícitamente el Nuevo Pacto que Cristo instituye en la Última Cena (Lc 22:20). Ezequiel anuncia el corazón nuevo y el Espíritu nuevo (Ez 36:26-27) que se cumplen en Pentecostés. Daniel 7 presenta al 'Hijo del Hombre' — el título que Jesús usa más de sí mismo en los evangelios.",
    distintivaReformada: "La hermenéutica reformada lee estas profecías con un cumplimiento ya/todavía-no: el Nuevo Pacto se inaugura en la primera venida de Cristo y se consuma en la segunda, rechazando tanto la lectura dispensacionalista de un cumplimiento exclusivamente futuro-nacional como la lectura crítica que las trata como mera literatura post-eventum.",
    versiculoClave: "Is 53:5",
    libros: [
      { es: "Isaías", razon: "El 'quinto evangelio' del AT — desde el juicio sobre Judá hasta la consolación del Siervo Sufriente (cap. 53) y la nueva creación (caps. 65-66)." },
      { es: "Jeremías", razon: "El 'profeta llorón' que anuncia la inminente caída de Jerusalén y, en medio del juicio, la promesa explícita de un Nuevo Pacto (Jer 31:31-34)." },
      { es: "Lamentaciones", razon: "Cinco poemas elegíacos que lamentan la destrucción de Jerusalén en el 586 a.C., sosteniendo la esperanza en la fidelidad de Dios en medio de la desolación (Lm 3:22-23)." },
      { es: "Ezequiel", razon: "Visiones proféticas desde el exilio babilónico mismo: la gloria de Dios que abandona el templo y promete regresar, y la promesa del corazón nuevo y el Espíritu (Ez 36)." },
      { es: "Daniel", razon: "Narrativas de fidelidad en la corte pagana y visiones apocalípticas de los imperios sucesivos y el reino eterno del 'Hijo del Hombre' (Dn 7)." },
    ],
  },
  {
    id: "profetas-menores",
    titulo: "Profetas Menores",
    tituloEn: "Minor Prophets",
    color: "#8B6A1B",
    rango: "Oseas – Malaquías",
    testamento: "Antiguo",
    tagline: "El Libro de los Doce — voces breves abarcando tres siglos de la historia del pacto",
    resumen: "Doce libros breves (de ahí 'menores', por extensión, no por importancia) que en la tradición hebrea se contaban como un solo rollo, 'El Libro de los Doce'. Abarcan desde el s. VIII a.C. (Oseas, Amós, Jonás, Miqueas) hasta el período postexílico (Hageo, Zacarías, Malaquías, s. VI–V a.C.), cubriendo el ministerio profético tanto hacia el reino del norte como hacia el del sur y hacia naciones extranjeras (Jonás a Nínive, Abdías a Edom, Nahúm a Nínive de nuevo).",
    fondoHistorico: "Amós profetiza durante el apogeo económico y la corrupción social del reinado de Jeroboam II en Israel (c. 760 a.C.), un período de prosperidad documentado arqueológicamente en los marfiles de Samaria que el propio Amós denuncia (Am 6:4). Jonás está ambientado en Nínive bajo el imperio asirio anterior a su caída (la ciudad cayó en 612 a.C., evento que Nahúm profetiza con detalle). Hageo y Zacarías ministran durante la reconstrucción del segundo templo bajo el gobernador persa Zorobabel (520 a.C.), corroborado por el calendario persa preciso que ambos libros usan para fechar sus oráculos. Malaquías, el último profeta del AT canónico, ministra en el s. V a.C., posiblemente contemporáneo de Nehemías, denunciando la misma laxitud sacerdotal que Nehemías combate administrativamente.",
    porQueAgrupados: "Agrupados desde la antigüedad por su brevedad compartida y porque juntos —más que individualmente— trazan el arco completo del ministerio profético preexílico, exílico y postexílico, formando una sola narrativa profética coherente cuando se leen en conjunto, pese a abarcar siglos y autores distintos.",
    epocaPacto: "Igual que los profetas mayores, ministran bajo la 'Anticipación Profética', pero los Doce añaden un énfasis distintivo: el alcance del juicio y la misericordia de Dios hacia las naciones gentiles (Jonás a Nínive, la profecía de las naciones en Amós 1-2), anticipando la inclusión de los gentiles en el pacto de gracia.",
    enfoqueCristologico: "Miqueas 5:2 profetiza el lugar de nacimiento del Mesías, citado literalmente en Mt 2:6. Zacarías profetiza la entrada triunfal (Zac 9:9, citada en Mt 21:5) y el precio de la traición (Zac 11:12-13, cumplida en Mt 27:9-10). Malaquías anuncia al precursor que prepara el camino (Mal 3:1; 4:5-6), identificado por Jesús mismo con Juan el Bautista (Mt 11:14).",
    distintivaReformada: "La tradición reformada destaca que estos doce profetas, pese a su brevedad individual, sostienen unánimemente la misma teología del pacto que los profetas mayores: el llamado a la justicia social como fruto necesario —no opcional— de la fe genuina (Am 5:24; Miq 6:8), rechazando tanto el legalismo ritualista sin ética como el activismo social sin doctrina del pecado y la gracia.",
    versiculoClave: "Miq 6:8",
    libros: [
      { es: "Oseas", razon: "El matrimonio del profeta con una mujer infiel se convierte en metáfora viva de la infidelidad de Israel y el amor pactual inquebrantable de Dios." },
      { es: "Joel", razon: "Una plaga de langostas se convierte en figura del Día de Jehová venidero, con la promesa del derramamiento del Espíritu (Jl 2:28-32) citada por Pedro en Pentecostés (Hch 2)." },
      { es: "Amós", razon: "Denuncia profética de la injusticia social y la religiosidad vacía en el próspero reino del norte: 'corra el juicio como las aguas' (Am 5:24)." },
      { es: "Abdías", razon: "El libro más breve del AT, un oráculo de juicio contra Edom por su traición fraternal hacia Judá en el día de su calamidad." },
      { es: "Jonás", razon: "Un profeta reticente enviado a Nínive, la capital enemiga, revelando que la misericordia de Dios no se limita a Israel sino que alcanza a las naciones." },
      { es: "Miqueas", razon: "Anuncia tanto el juicio sobre la injusticia social como el nacimiento del Mesías en Belén (Miq 5:2) y la esencia de la piedad genuina (Miq 6:8)." },
      { es: "Nahúm", razon: "Profetiza la caída de Nínive —cumplida en el 612 a.C.— como vindicación de la justicia de Dios tras la conversión temporal de la ciudad en Jonás." },
      { es: "Habacuc", razon: "Un diálogo entre el profeta y Dios sobre el uso de una nación más impía (Babilonia) para juzgar a Judá, resuelto en 'el justo por su fe vivirá' (Hab 2:4), citado tres veces en el NT." },
      { es: "Sofonías", razon: "Anuncia el Día de Jehová como juicio universal y, a la vez, como restauración futura con gozo: 'se gozará sobre ti con cánticos' (Sof 3:17)." },
      { es: "Hageo", razon: "Llama al remanente postexílico a reconstruir el templo, prometiendo que la gloria de esta segunda casa superará a la primera." },
      { es: "Zacarías", razon: "Visiones nocturnas y oráculos mesiánicos que anticipan tanto el primer advenimiento humilde (Zac 9:9) como el reinado final de Jehová sobre toda la tierra." },
      { es: "Malaquías", razon: "El último libro del AT canónico: denuncia la apatía sacerdotal postexílica y anuncia al precursor (Elías) que preparará el camino del Señor." },
    ],
  },
  {
    id: "evangelios",
    titulo: "Evangelios",
    tituloEn: "Gospels",
    color: "#C9A84C",
    rango: "Mateo – Juan",
    testamento: "Nuevo",
    tagline: "El cumplimiento — la vida, muerte y resurrección de Jesucristo",
    resumen: "Cuatro relatos complementarios, no contradictorios, de la persona y obra de Jesucristo, escritos para audiencias y con énfasis distintos: Mateo presenta a Jesús como el Mesías davídico que cumple la Ley y los profetas, dirigido principalmente a lectores judíos; Marcos lo retrata como el Siervo activo y sufriente en una narrativa ágil; Lucas, escrito por un médico gentil, enfatiza la compasión universal de Cristo hacia los marginados; Juan, el más tardío y teológicamente explícito, presenta a Jesús como el Verbo eterno encarnado.",
    fondoHistorico: "Los tres primeros evangelios (Mateo, Marcos, Lucas) se denominan 'sinópticos' por su estrecha relación literaria compartida —el llamado 'problema sinóptico'— con la posición mayoritaria (incluida la reformada-evangélica) sosteniendo la prioridad de Marcos como fuente más temprana (c. 55-65 d.C.), usada junto con una fuente de dichos (hipotética, llamada 'Q') por Mateo y Lucas. Los evangelios fueron escritos dentro de la generación de testigos oculares (entre c. 55-90 d.C.), un período demasiado corto para el desarrollo legendario que la crítica liberal del s. XIX propuso. El descubrimiento de manuscritos como el Papiro P52 (fragmento de Juan, datado c. 125 d.C., hallado en Egipto) confirma una circulación temprana del cuarto evangelio, incompatible con teorías de composición tardía en el s. II.",
    porQueAgrupados: "Comparten género (bios greco-romano aplicado teológicamente) y sujeto único: la persona de Jesucristo. Forman, junto con Hechos, el centro absoluto del canon — el punto hacia el cual converge todo el Antiguo Testamento y del cual fluye todo el Nuevo.",
    epocaPacto: "Esta es la época del 'Cumplimiento' (Vos): el Reino de Dios anunciado por los profetas irrumpe en la historia en la persona de Cristo. El Nuevo Pacto profetizado por Jeremías 31 se inaugura literalmente en la Última Cena (Mt 26:28; Lc 22:20) y se sella con la muerte y resurrección de Cristo.",
    enfoqueCristologico: "Los evangelios son, por definición, el centro cristológico absoluto del canon: cada palabra y acción de Cristo cumple las Escrituras del AT (la fórmula 'para que se cumpliese' aparece repetidamente en Mateo) y establece el fundamento histórico sobre el cual descansa toda la doctrina apostólica posterior.",
    distintivaReformada: "La tradición reformada insiste en la armonía sustancial —no la identidad verbal mecánica— de los cuatro evangelios como testigos complementarios e inspirados del mismo Cristo histórico, rechazando tanto la armonización forzada que ignora el énfasis teológico distintivo de cada evangelista como la crítica de fuentes que disuelve su fiabilidad histórica.",
    versiculoClave: "Jn 1:14",
    libros: [
      { es: "Mateo", razon: "Escrito para una audiencia judía, demuestra sistemáticamente que Jesús cumple la Ley y los profetas como el Mesías davídico prometido; estructura el Sermón del Monte como la nueva Torá del Reino." },
      { es: "Marcos", razon: "El evangelio más breve y dinámico, centrado en la acción y el sufrimiento de Jesús como el Siervo de Jehová; probablemente la fuente más temprana usada por Mateo y Lucas." },
      { es: "Lucas", razon: "Escrito por un médico gentil con rigor historiográfico (Lc 1:1-4), enfatiza la compasión de Cristo hacia pobres, mujeres, samaritanos y pecadores marginados." },
      { es: "Juan", razon: "El evangelio teológico por excelencia: presenta a Jesús como el Logos eterno encarnado (Jn 1:1,14) mediante siete señales y siete declaraciones 'Yo Soy' que revelan su deidad." },
    ],
  },
  {
    id: "historia-nt",
    titulo: "Historia",
    tituloEn: "History",
    color: "#1B6B5E",
    rango: "Hechos",
    testamento: "Nuevo",
    tagline: "El nacimiento y expansión de la iglesia apostólica",
    resumen: "Un solo libro —Hechos de los Apóstoles, segundo volumen de la obra de Lucas— que narra la expansión del evangelio desde Jerusalén hasta Roma a través de la obra del Espíritu Santo, desde Pentecostés hasta el encarcelamiento de Pablo en Roma (c. 30-62 d.C.), documentando el nacimiento de la iglesia, su ruptura misionera con las fronteras étnicas judías, y la formación de las primeras comunidades cristianas gentiles.",
    fondoHistorico: "Hechos demuestra una precisión historiográfica notable, confirmada por la arqueología y la historia secular: los títulos políticos exactos para cada región (procónsul en Chipre y Acaya, Hch 13:7; 18:12; asiarcas en Éfeso, Hch 19:31) que cambiaban según el estatus administrativo romano de cada provincia, verificados por inscripciones; la mención del hambre bajo Claudio (Hch 11:28), corroborada por Suetonio y Josefo; y la expulsión de judíos de Roma por el edicto de Claudio (Hch 18:2), confirmada por el historiador romano Suetonio. El historiador clásico Colin Hemer documentó decenas de detalles geográficos y políticos verificados independientemente, reforzando la fiabilidad histórica del relato lucano frente al escepticismo de la Escuela de Tubinga (s. XIX), que proponía una composición tardía y tendenciosa.",
    porQueAgrupados: "Constituye su propia categoría porque no es evangelio (no narra la vida terrenal de Cristo) ni epístola (no es carta doctrinal) sino historiografía eclesial: el puente narrativo indispensable entre el ministerio terrenal de Cristo y las cartas apostólicas que presuponen las iglesias que Hechos describe estar fundándose.",
    epocaPacto: "Sigue dentro del 'Cumplimiento', pero documenta su aplicación expansiva: el derramamiento del Espíritu en Pentecostés (Hch 2) inaugura la era de la iglesia, y el Concilio de Jerusalén (Hch 15) resuelve formalmente que el Nuevo Pacto incluye a los gentiles sin las obras de la Ley mosaica.",
    enfoqueCristologico: "Hechos documenta el Cristo resucitado y ascendido continuando su obra desde el cielo a través de su Espíritu y su iglesia ('todas las cosas que Jesús comenzó a hacer y a enseñar', Hch 1:1, implicando que Hechos narra lo que Jesús continúa haciendo). Los sermones apostólicos en Hechos son consistentemente cristocéntricos, centrados en la muerte, resurrección y señorío de Cristo conforme a las Escrituras.",
    distintivaReformada: "La tradición reformada lee Hechos como el registro normativo —no necesariamente repetible en cada detalle— de la fundación apostólica de la iglesia, distinguiendo entre lo descriptivo (lo que ocurrió una vez en la era apostólica fundacional) y lo prescriptivo (lo que la iglesia debe practicar permanentemente), un principio hermenéutico clave para la teología reformada del culto y los dones.",
    versiculoClave: "Hch 1:8",
    libros: [
      { es: "Hechos", razon: "Único libro de su categoría: documenta el nacimiento de la iglesia en Pentecostés y su expansión geográfica y étnica desde Jerusalén hasta Roma, estableciendo el puente histórico entre los evangelios y las epístolas." },
    ],
  },
  {
    id: "paulinas",
    titulo: "Epístolas Paulinas",
    tituloEn: "Pauline Epistles",
    color: "#1B5E8B",
    rango: "Romanos – Filemón",
    testamento: "Nuevo",
    tagline: "La doctrina apostólica aplicada a iglesias y personas concretas",
    resumen: "Trece cartas atribuidas al apóstol Pablo, escritas a iglesias específicas (Romanos a Filemón) y a colaboradores individuales (las Pastorales: 1-2 Timoteo, Tito), abarcando desde la exposición doctrinal más sistemática del NT (Romanos) hasta una breve carta personal sobre un esclavo fugitivo (Filemón). Juntas constituyen el corpus teológico más extenso de cualquier autor del NT.",
    fondoHistorico: "Las cartas paulinas se escribieron en el contexto de los tres viajes misioneros de Pablo y su posterior encarcelamiento romano (c. 48-67 d.C.), documentado en Hechos. La autenticidad paulina de las siete 'indiscutidas' (Romanos, 1-2 Corintios, Gálatas, Filipenses, 1 Tesalonicenses, Filemón) es aceptada casi universalmente incluso por la crítica secular; la tradición reformada sostiene también la autenticidad de las seis restantes —Efesios, Colosenses, 2 Tesalonicenses y las tres Pastorales— frente a la crítica que las considera pseudoepígrafas por diferencias de vocabulario y estilo, atribuibles razonablemente al uso de amanuenses (como Tercio en Ro 16:22) y a la diversidad natural de género epistolar (doctrinal vs. pastoral) y etapa vital del apóstol. Descubrimientos arqueológicos como la inscripción de Galión en Delfos han permitido fechar con precisión el ministerio de Pablo en Corinto (c. 51-52 d.C.).",
    porQueAgrupados: "Comparten autoría paulina y género epistolar (carta ocasional greco-romana adaptada a propósito doctrinal y pastoral), tradicionalmente ordenadas por extensión decreciente más que por orden cronológico de composición.",
    epocaPacto: "Época de 'Aplicación': estas cartas no narran eventos redentores nuevos sino que aplican el evangelio ya cumplido en Cristo —su muerte, resurrección y señorío— a la doctrina, la ética y la vida eclesial de comunidades concretas enfrentando herejías, divisiones y preguntas pastorales específicas.",
    enfoqueCristologico: "Pablo desarrolla con mayor profundidad sistemática que cualquier otro autor del NT la doctrina de la justificación por fe en la obra de Cristo (Romanos, Gálatas), la unión del creyente con Cristo, y la supremacía cósmica de Cristo sobre toda la creación (Col 1:15-20).",
    distintivaReformada: "Romanos y Gálatas son, junto con los evangelios, el fundamento textual primario de la doctrina reformada de la justificación por fe sola (sola fide) frente a toda forma de justificación por obras —el eje doctrinal que distinguió a la Reforma protestante de Roma en el s. XVI y que la tradición reformada confiesa como 'el artículo de la fe por el cual la iglesia está en pie o cae' (Lutero, adoptado ampliamente por la tradición reformada).",
    versiculoClave: "Ro 1:16-17",
    libros: [
      { es: "Romanos", razon: "La exposición sistemática más completa del evangelio en el NT: pecado universal, justificación por fe, santificación, la soberanía electiva de Dios, y la ética cristiana — el tratado doctrinal por excelencia de Pablo." },
      { es: "1 Corintios", razon: "Corrección pastoral de divisiones, inmoralidad, desorden litúrgico y confusión doctrinal en una iglesia gentil problemática, culminando en la defensa clásica de la resurrección (cap. 15)." },
      { es: "2 Corintios", razon: "La carta más personal de Pablo, defendiendo su apostolado legítimo frente a falsos apóstoles y exponiendo la teología del sufrimiento y la suficiencia de la gracia." },
      { es: "Gálatas", razon: "El manifiesto de la justificación por fe sola frente a los judaizantes que exigían la circuncisión: 'el evangelio de la libertad' frente a todo legalismo." },
      { es: "Efesios", razon: "La eclesiología cósmica de Pablo: la iglesia como el cuerpo de Cristo, unidad de judíos y gentiles, y la armadura espiritual para la guerra cristiana." },
      { es: "Filipenses", razon: "Carta de gozo escrita desde prisión, con el himno cristológico de la kénosis (Fil 2:5-11) como uno de los textos cristológicos más densos del NT." },
      { es: "Colosenses", razon: "Defensa de la supremacía absoluta de Cristo frente a un sincretismo filosófico-religioso temprano que amenazaba con relativizar su persona y obra." },
      { es: "1 Tesalonicenses", razon: "Una de las cartas más tempranas de Pablo, con enseñanza pastoral sobre la santificación y la esperanza escatológica del regreso de Cristo." },
      { es: "2 Tesalonicenses", razon: "Corrección de una confusión escatológica sobre el 'día del Señor', con la revelación del 'hombre de pecado' que debe preceder la segunda venida." },
      { es: "1 Timoteo", razon: "Carta pastoral con instrucciones sobre el orden eclesial, la cualificación de ancianos y diáconos, y la defensa de la sana doctrina frente a falsos maestros." },
      { es: "2 Timoteo", razon: "El testamento final de Pablo, escrito en prisión poco antes de su martirio, exhortando a Timoteo a la fidelidad doctrinal y al sufrimiento por el evangelio." },
      { es: "Tito", razon: "Instrucciones para organizar el liderazgo de la iglesia en Creta y para que la sana doctrina produzca buenas obras visibles en cada grupo social." },
      { es: "Filemón", razon: "La carta más breve de Pablo, una apelación personal en favor de Onésimo, un esclavo fugitivo convertido — el evangelio aplicado a una relación social concreta." },
    ],
  },
  {
    id: "generales",
    titulo: "Epístolas Generales",
    tituloEn: "General Epistles",
    color: "#8B3A2A",
    rango: "Hebreos – Judas",
    testamento: "Nuevo",
    tagline: "Voces apostólicas complementarias para una iglesia dispersa y perseguida",
    resumen: "Ocho cartas de autoría no paulina —Hebreos (autor anónimo en el texto mismo, aunque tradicionalmente debatido), Santiago, 1-2 Pedro, 1-3 Juan y Judas— dirigidas, en su mayoría, a audiencias más amplias y dispersas que las cartas paulinas (de ahí 'generales' o 'católicas', en el sentido de 'universales'), enfrentando la persecución, la persistencia de falsa doctrina y la necesidad de perseverancia en la fe.",
    fondoHistorico: "Hebreos se dirige a cristianos de trasfondo judío tentados a retroceder al judaísmo bajo presión de persecución, probablemente antes de la destrucción del templo en el 70 d.C. (el argumento del libro sobre la superioridad del sacerdocio de Cristo tendría mucha menos fuerza retórica si el templo ya hubiera sido destruido). Santiago, posiblemente la carta más temprana del NT (c. 45-48 d.C.), refleja un judaísmo cristiano primitivo previo al Concilio de Jerusalén. 1 Pedro se escribe a cristianos dispersos en Asia Menor bajo presión social creciente, posiblemente anticipando la persecución más sistemática bajo Nerón (64 d.C.) o Domiciano. 2 Pedro y Judas comparten material literario notable (compárese 2P 2 con Judas), reflejando la lucha común de la iglesia primitiva contra el gnosticismo incipiente y el libertinaje moral disfrazado de libertad cristiana.",
    porQueAgrupados: "Agrupadas por exclusión (no son paulinas) y por destinatarios más generales que congregaciones específicas, estas cartas aportan perspectivas apostólicas complementarias —sacerdotal (Hebreos), práctica (Santiago), pastoral-sufriente (1-2 Pedro), relacional (1-3 Juan) y polémica (Judas)— que equilibran y enriquecen la doctrina paulina sin contradecirla.",
    epocaPacto: "También época de 'Aplicación', con un acento distintivo en la perseverancia bajo sufrimiento y la advertencia contra la apostasía y la falsa doctrina que amenazaban a las comunidades cristianas dispersas del primer siglo.",
    enfoqueCristologico: "Hebreos presenta la cristología sacerdotal más desarrollada del NT: Cristo como sumo sacerdote según el orden de Melquisedec, superior a los ángeles, a Moisés y al sacerdocio levítico, cuyo sacrificio único y definitivo cumple y abroga el sistema sacrificial completo del AT.",
    distintivaReformada: "La tradición reformada ha debatido históricamente la relación entre Santiago ('la fe sin obras es muerta', Stg 2:26) y Pablo ('por gracia sois salvos... no por obras', Ef 2:8-9), resolviendo —siguiendo a Calvino— que ambos enseñan la misma doctrina desde ángulos distintos: Pablo describe la raíz de la justificación (fe sola) y Santiago describe el fruto necesario de la fe genuina (obras), sin que esto comprometa sola fide.",
    versiculoClave: "He 1:3",
    libros: [
      { es: "Hebreos", razon: "Demuestra la superioridad de Cristo sobre ángeles, Moisés y el sacerdocio levítico, con la exhortación central a perseverar en la fe frente a la tentación de retroceder al judaísmo." },
      { es: "Santiago", razon: "Sabiduría práctica intensamente ética, insistiendo en que la fe genuina se demuestra necesariamente en obras visibles — complemento, no contradicción, de la doctrina paulina de la justificación." },
      { es: "1 Pedro", razon: "Aliento pastoral a cristianos sufriendo persecución y dispersión, llamándolos a la santidad y la esperanza viva fundamentada en la resurrección de Cristo." },
      { es: "2 Pedro", razon: "Advertencia contra falsos maestros y el escepticismo respecto a la segunda venida, con un testamento final del apóstol antes de su martirio." },
      { es: "1 Juan", razon: "Pruebas de la vida eterna genuina —fe correcta, obediencia y amor fraternal— escrita contra un proto-gnosticismo que negaba la encarnación real de Cristo." },
      { es: "2 Juan", razon: "Una breve carta de advertencia contra recibir a falsos maestros que niegan que Cristo vino en carne." },
      { es: "3 Juan", razon: "Una carta personal que elogia la hospitalidad cristiana hacia maestros itinerantes y denuncia el orgullo eclesiástico de Diótrefes." },
      { es: "Judas", razon: "Una polémica urgente contra falsos maestros libertinos infiltrados en la iglesia, citando tradición judía extracanónica para ilustrar el juicio cierto sobre la apostasía." },
    ],
  },
  {
    id: "profecia",
    titulo: "Profecía",
    tituloEn: "Prophecy",
    color: "#6B4A8B",
    rango: "Apocalipsis",
    testamento: "Nuevo",
    tagline: "La consumación — el triunfo final de Cristo y la nueva creación",
    resumen: "El libro final del canon, escrito por el apóstol Juan en exilio en la isla de Patmos, combinando los géneros de epístola, profecía y apocalíptica judía para revelar el triunfo escatológico de Cristo sobre todo poder hostil y la consumación final de la historia redentora en la nueva creación.",
    fondoHistorico: "Compuesto durante el reinado de Domiciano (c. 95 d.C., posición mayoritaria reformada, apoyada en el testimonio de Ireneo, discípulo de Policarpo quien conoció al propio Juan) o posiblemente bajo Nerón (c. 68 d.C., minoritaria), en un contexto de presión creciente hacia el culto imperial romano que las siete iglesias de Asia Menor (Ap 2-3) enfrentaban de manera diversa. El género apocalíptico —con su simbolismo numérico, bestias, visiones cósmicas— tiene precedentes en Daniel, Ezequiel y Zacarías, y paralelos extrabíblicos en literatura intertestamentaria judía (como 1 Enoc), aunque Apocalipsis se distingue de estos paralelos por anclarse explícitamente en eventos históricos ya cumplidos (la muerte y resurrección de Cristo) en lugar de la especulación puramente futurista de la apocalíptica no canónica.",
    porQueAgrupados: "Constituye su propia categoría por ser el único libro plenamente apocalíptico del NT (a diferencia del 'pequeño apocalipsis' de los evangelios sinópticos, que es un discurso, no un libro entero), y por su posición canónica deliberada como clímax final de toda la revelación bíblica.",
    epocaPacto: "La época de la 'Consumación': el Reino de Dios, inaugurado en la primera venida de Cristo, se consuma plenamente. Las cuatro tradiciones interpretativas históricas dentro del protestantismo (preterista, historicista, futurista, idealista) compiten por la lectura correcta de los detalles, pero la tradición reformada generalmente sostiene una lectura que combina elementos preteristas (cumplimiento parcial en el s. I) e idealistas (principios atemporales del conflicto entre el reino de Cristo y los poderes del mal), evitando el futurismo dispensacionalista que pospone la mayor parte del libro a un período de tribulación literal de siete años desconectado de la iglesia.",
    enfoqueCristologico: "Apocalipsis presenta la cristología más exaltada y cósmica de todo el canon: Cristo como el Cordero inmolado que es digno de abrir el rollo (cap. 5), el Rey de reyes y Señor de señores que regresa en victoria (cap. 19), y quien hace nuevas todas las cosas (cap. 21) — el punto culminante de toda la trayectoria cristológica que comenzó en el protoevangelio de Génesis 3:15.",
    distintivaReformada: "La tradición reformada lee Apocalipsis cristocéntricamente como la consumación gloriosa de la historia redentora completa del canon —no como un mapa cronológico literal de eventos geopolíticos futuros— viendo en la batalla cósmica del libro el mismo conflicto entre la simiente de la mujer y la simiente de la serpiente anunciado en Génesis 3:15, ahora resuelto definitivamente a favor de Cristo y su iglesia.",
    versiculoClave: "Ap 21:3-4",
    libros: [
      { es: "Apocalipsis", razon: "Cierra el canon con la consumación de toda la historia redentora: el juicio final de todo poder hostil a Dios y la restauración de la nueva creación, donde 'el tabernáculo de Dios está con los hombres' (Ap 21:3) — el Edén perdido en Génesis, plenamente recuperado." },
    ],
  },
];

const DIVISION_ORDER = DIVISIONS.map(d => d.id);
const DIV_BY_ID = Object.fromEntries(DIVISIONS.map(d => [d.id, d]));

// ── 66 BOOKS REGISTRY — canonical order, mapped to division ──────────────────

const BOOKS = [
  { id: 1, es: "Génesis", en: "Genesis", ab: "Gn", div: "pentateuco", ready: true },
  { id: 2, es: "Éxodo", en: "Exodus", ab: "Éx", div: "pentateuco" },
  { id: 3, es: "Levítico", en: "Leviticus", ab: "Lv", div: "pentateuco" },
  { id: 4, es: "Números", en: "Numbers", ab: "Nm", div: "pentateuco" },
  { id: 5, es: "Deuteronomio", en: "Deuteronomy", ab: "Dt", div: "pentateuco" },
  { id: 6, es: "Josué", en: "Joshua", ab: "Jos", div: "historico-at" },
  { id: 7, es: "Jueces", en: "Judges", ab: "Jue", div: "historico-at" },
  { id: 8, es: "Rut", en: "Ruth", ab: "Rt", div: "historico-at" },
  { id: 9, es: "1 Samuel", en: "1 Samuel", ab: "1S", div: "historico-at" },
  { id: 10, es: "2 Samuel", en: "2 Samuel", ab: "2S", div: "historico-at" },
  { id: 11, es: "1 Reyes", en: "1 Kings", ab: "1R", div: "historico-at" },
  { id: 12, es: "2 Reyes", en: "2 Kings", ab: "2R", div: "historico-at" },
  { id: 13, es: "1 Crónicas", en: "1 Chronicles", ab: "1Cr", div: "historico-at" },
  { id: 14, es: "2 Crónicas", en: "2 Chronicles", ab: "2Cr", div: "historico-at" },
  { id: 15, es: "Esdras", en: "Ezra", ab: "Esd", div: "historico-at" },
  { id: 16, es: "Nehemías", en: "Nehemiah", ab: "Neh", div: "historico-at" },
  { id: 17, es: "Ester", en: "Esther", ab: "Est", div: "historico-at" },
  { id: 18, es: "Job", en: "Job", ab: "Job", div: "sabiduria" },
  { id: 19, es: "Salmos", en: "Psalms", ab: "Sal", div: "sabiduria" },
  { id: 20, es: "Proverbios", en: "Proverbs", ab: "Pr", div: "sabiduria" },
  { id: 21, es: "Eclesiastés", en: "Ecclesiastes", ab: "Ecl", div: "sabiduria" },
  { id: 22, es: "Cantares", en: "Song of Solomon", ab: "Cnt", div: "sabiduria" },
  { id: 23, es: "Isaías", en: "Isaiah", ab: "Is", div: "profetas-mayores" },
  { id: 24, es: "Jeremías", en: "Jeremiah", ab: "Jer", div: "profetas-mayores" },
  { id: 25, es: "Lamentaciones", en: "Lamentations", ab: "Lm", div: "profetas-mayores" },
  { id: 26, es: "Ezequiel", en: "Ezekiel", ab: "Ez", div: "profetas-mayores" },
  { id: 27, es: "Daniel", en: "Daniel", ab: "Dn", div: "profetas-mayores" },
  { id: 28, es: "Oseas", en: "Hosea", ab: "Os", div: "profetas-menores" },
  { id: 29, es: "Joel", en: "Joel", ab: "Jl", div: "profetas-menores" },
  { id: 30, es: "Amós", en: "Amos", ab: "Am", div: "profetas-menores" },
  { id: 31, es: "Abdías", en: "Obadiah", ab: "Abd", div: "profetas-menores" },
  { id: 32, es: "Jonás", en: "Jonah", ab: "Jon", div: "profetas-menores" },
  { id: 33, es: "Miqueas", en: "Micah", ab: "Miq", div: "profetas-menores" },
  { id: 34, es: "Nahúm", en: "Nahum", ab: "Nah", div: "profetas-menores" },
  { id: 35, es: "Habacuc", en: "Habakkuk", ab: "Hab", div: "profetas-menores" },
  { id: 36, es: "Sofonías", en: "Zephaniah", ab: "Sof", div: "profetas-menores" },
  { id: 37, es: "Hageo", en: "Haggai", ab: "Hag", div: "profetas-menores" },
  { id: 38, es: "Zacarías", en: "Zechariah", ab: "Zac", div: "profetas-menores" },
  { id: 39, es: "Malaquías", en: "Malachi", ab: "Mal", div: "profetas-menores" },
  { id: 40, es: "Mateo", en: "Matthew", ab: "Mt", div: "evangelios" },
  { id: 41, es: "Marcos", en: "Mark", ab: "Mr", div: "evangelios" },
  { id: 42, es: "Lucas", en: "Luke", ab: "Lc", div: "evangelios" },
  { id: 43, es: "Juan", en: "John", ab: "Jn", div: "evangelios" },
  { id: 44, es: "Hechos", en: "Acts", ab: "Hch", div: "historia-nt" },
  { id: 45, es: "Romanos", en: "Romans", ab: "Ro", div: "paulinas" },
  { id: 46, es: "1 Corintios", en: "1 Corinthians", ab: "1Co", div: "paulinas" },
  { id: 47, es: "2 Corintios", en: "2 Corinthians", ab: "2Co", div: "paulinas" },
  { id: 48, es: "Gálatas", en: "Galatians", ab: "Gá", div: "paulinas" },
  { id: 49, es: "Efesios", en: "Ephesians", ab: "Ef", div: "paulinas" },
  { id: 50, es: "Filipenses", en: "Philippians", ab: "Fil", div: "paulinas" },
  { id: 51, es: "Colosenses", en: "Colossians", ab: "Col", div: "paulinas" },
  { id: 52, es: "1 Tesalonicenses", en: "1 Thessalonians", ab: "1Ts", div: "paulinas" },
  { id: 53, es: "2 Tesalonicenses", en: "2 Thessalonians", ab: "2Ts", div: "paulinas" },
  { id: 54, es: "1 Timoteo", en: "1 Timothy", ab: "1Ti", div: "paulinas" },
  { id: 55, es: "2 Timoteo", en: "2 Timothy", ab: "2Ti", div: "paulinas" },
  { id: 56, es: "Tito", en: "Titus", ab: "Tit", div: "paulinas" },
  { id: 57, es: "Filemón", en: "Philemon", ab: "Flm", div: "paulinas" },
  { id: 58, es: "Hebreos", en: "Hebrews", ab: "He", div: "generales" },
  { id: 59, es: "Santiago", en: "James", ab: "Stg", div: "generales" },
  { id: 60, es: "1 Pedro", en: "1 Peter", ab: "1P", div: "generales" },
  { id: 61, es: "2 Pedro", en: "2 Peter", ab: "2P", div: "generales" },
  { id: 62, es: "1 Juan", en: "1 John", ab: "1Jn", div: "generales" },
  { id: 63, es: "2 Juan", en: "2 John", ab: "2Jn", div: "generales" },
  { id: 64, es: "3 Juan", en: "3 John", ab: "3Jn", div: "generales" },
  { id: 65, es: "Judas", en: "Jude", ab: "Jud", div: "generales" },
  { id: 66, es: "Apocalipsis", en: "Revelation", ab: "Ap", div: "profecia" },
];

// ── GENESIS SNAPSHOT — only fully populated book record ──────────────────────

const GENESIS = {
  titulo: "Génesis", tituloOriginal: "בְּרֵאשִׁית", translit: "Bereshit",
  significado: "\u201cEn el principio\u201d",
  autor: "Moisés (tradicional)", anio: "c. 1446–1406 a.C.",
  idioma: "Hebreo", capitulos: 50,
  tagline: "El libro de los principios: creación, caída, pacto y providencia",
  resumen: "Génesis es el libro de los principios: el origen del cosmos, de la humanidad, del pecado y de la redención. Se estructura en torno a diez secciones toledot (\u201cestas son las generaciones de\u2026\u201d). La primera mitad (Gn 1\u201311) narra los orígenes universales; la segunda (Gn 12\u201350) registra el origen del pueblo elegido a través de los cuatro patriarcas: Abraham, Isaac, Jacob y José.",
  versiculoClave: "Gn 1:1",
  versiculoTexto: "En el principio creó Dios los cielos y la tierra.",
  tiposYSombras: [
    "El protoevangelio (Gn 3:15) — la simiente de la mujer que aplasta la cabeza de la serpiente",
    "Melquisedec (Gn 14:18-20) — sacerdote-rey, tipo de Cristo según He 7",
    "El carnero sustituto en Moriah (Gn 22:13-14) — tipo de la expiación sustitutiva",
    "José vendido y exaltado (Gn 37-50) — tipo de rechazo, sufrimiento y exaltación providencial",
  ],
  personajesDestacados: ["Dios · YHWH", "Adán", "Eva", "Noé", "Abraham", "Sara", "Isaac", "Jacob", "José"],
};

// ── STYLES — OPEN BOOK LAYOUT ─────────────────────────────────────────────────

const S = {
  outer: { fontFamily: "'Georgia', serif", background: "#070D1A", color: PARCHMENT, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 16px 48px" },
  topBar: { height: 3, width: "100%", maxWidth: 1400, background: `linear-gradient(90deg, transparent, ${GOLD}, ${SIENNA}, ${GOLD}, transparent)`, flexShrink: 0, marginBottom: 18 },
  // App title + instruction subtitle, shown once in the header band below the
  // gold ornamental bar — replaces the old per-page instruction copy that used
  // to repeat on both the left (A.T.) and right (N.T.) classification spreads.
  appHeader: { width: "100%", maxWidth: 1400, textAlign: "center", marginBottom: 18 },
  appTitle: { fontFamily: "'Georgia',serif", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 900, color: PARCHMENT, letterSpacing: 0.5, lineHeight: 1.15, marginBottom: 10, textShadow: "0 0 40px rgba(201,168,76,0.25)" },
  headerInstruction: { fontSize: 13.5, fontStyle: "italic", color: "rgba(242,232,208,0.55)", lineHeight: 1.6 },

  bookFrame: { width: "100%", maxWidth: 1400, position: "relative" },

  // The open-book "case" — three columns: left tabs, center pages, right tabs
  book: {
    display: "flex", alignItems: "stretch", minHeight: 940,
    background: "linear-gradient(180deg, #16233F, #0F1A30 55%, #0C1729)",
    borderRadius: 6, border: `1px solid rgba(201,168,76,0.22)`,
    boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.3)",
    overflow: "hidden", position: "relative",
  },

  // Spine shadow down the center, like a real open book gutter
  gutterShadowLeft: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 60, marginLeft: -60, background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.35))", pointerEvents: "none", zIndex: 5 },
  gutterShadowRight: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 60, background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)", pointerEvents: "none", zIndex: 5 },
  gutterLine: { position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(201,168,76,0.18)", zIndex: 6 },

  // ── TAB RAILS (left = OT, right = NT) — a grid of tabs, not one tall column.
  // Each cell shows the FULL book name as ONE unbroken vertical line — no in-cell
  // wrapping — so every cell is the same fixed height, sized for the longest name
  // in the canon ("1 Tesalonicenses"). Spreading books across 3 columns still
  // cuts total height by ~3x versus a single column; the rail scrolls vertically
  // since full single-line names at legible size exceed one screen for 39 books.
  tabRail: (side) => ({
    width: 84, flexShrink: 0, padding: "12px 2px",
    position: "relative",
    background: "linear-gradient(180deg, rgba(27,42,74,0.95), rgba(20,32,58,0.97))",
    borderRight: side === "left" ? `1px solid rgba(201,168,76,0.15)` : "none",
    borderLeft: side === "right" ? `1px solid rgba(201,168,76,0.15)` : "none",
    overflowY: "auto", overflowX: "hidden",
  }),
  railHeader: { padding: "0 0 8px", marginBottom: 6, borderBottom: `1px solid rgba(201,168,76,0.15)`, textAlign: "center" },
  railTitle: { fontSize: 10, letterSpacing: 2, color: GOLD },
  railSub: { fontSize: 8, letterSpacing: 0.5, color: "rgba(242,232,208,0.4)", marginTop: 2 },

  // Still 3 columns, height unchanged (that was never the problem — names were
  // not clipping). This pass only narrows the COLUMN WIDTH: the rotated text
  // was sitting in a column noticeably wider than the glyphs need, leaving
  // visible side margin (e.g. around "Deuteronomio"). Tighter gap/padding here.
  // alignItems: "start" (not "stretch") is essential now — with stretch, CSS
  // Grid would force every cell in a row to match the tallest cell in that
  // row, recreating the exact "huge margin" problem for any short name that
  // happens to share a row with a long one. "start" lets each cell keep its
  // own intrinsic height from tabCellHeight().
  // Replaces the old CSS Grid approach. tabColumns lays out GRID_COLS flex
  // columns side by side; each tabColumn is its own independent vertical
  // stack, so a tall name in one column can never inflate the row height
  // of cells in neighboring columns — every cell's height comes purely
  // from its own tabCellHeight() value.
  tabColumns: { display: "flex", gap: 0.5 },
  tabColumn: { display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 0 },
  stepTab: (color, active, height) => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height, position: "relative",
    cursor: "pointer", border: "none", padding: "1px 0px 1px",
    background: active ? `${color}55` : `${color}26`,
    borderTop: `3px solid ${active ? color : color + "95"}`,
    borderBottom: `1px solid ${color}30`,
    borderLeft: `1px solid ${color}30`,
    borderRight: `1px solid ${color}30`,
    borderRadius: "0 0 3px 3px",
    transition: "background 0.12s",
  }),
  stepTabLabel: (active, ready) => ({
    fontSize: 17, color: active ? PARCHMENT : ready ? "rgba(242,232,208,0.86)" : "rgba(242,232,208,0.42)",
    letterSpacing: 0.2, lineHeight: 0.9, whiteSpace: "nowrap",
    writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)",
    fontStyle: "italic", fontWeight: active ? 700 : 400,
  }),
  readyDot: { width: 3.5, height: 3.5, borderRadius: "50%", background: GOLD, position: "absolute", top: 1.5, right: 1.5, boxShadow: "0 0 4px rgba(201,168,76,0.9)" },

  // ── CENTER GUTTER (the open pages) ──
  pages: { flex: 1, minWidth: 0, display: "flex", position: "relative" },
  page: { flex: 1, minWidth: 0, overflowY: "auto", padding: "36px 30px 60px" },
  pageLeftEdge: { borderRight: "none" },
  pageRightEdge: { borderLeft: "none" },

  // Single full-width content page (used when a division or book is open — "turn to this page")
  fullPage: { flex: 1, minWidth: 0, overflowY: "auto", padding: "40px 56px 70px" },
  fullPageInner: { maxWidth: 880, margin: "0 auto" },

  // Cover / index spread headers
  spreadEyebrowBig: { fontFamily: "'Georgia',serif", fontSize: 22, letterSpacing: 4, color: GOLD, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 },

  // Classification card grid (fills the open spread)
  classGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 },
  classCard: (color) => ({
    background: "rgba(27,42,74,0.42)", border: `1px solid ${color}38`, borderTop: `3px solid ${color}`,
    borderRadius: 3, padding: "16px 17px", cursor: "pointer", transition: "transform 0.15s, background 0.15s",
  }),
  classCardEyebrow: (color) => ({ fontSize: 8.5, letterSpacing: 2.5, color, marginBottom: 6, textTransform: "uppercase" }),
  classCardTitle: { fontSize: 16.5, fontWeight: 700, color: PARCHMENT, marginBottom: 7, lineHeight: 1.2 },
  classCardBlurb: { fontSize: 12.5, lineHeight: 1.55, color: "rgba(242,232,208,0.62)", marginBottom: 10 },
  classCardMeta: { fontSize: 9.5, letterSpacing: 1, color: "rgba(242,232,208,0.35)" },

  // Division detail (full page)
  backLink: { fontSize: 11, letterSpacing: 2, color: "rgba(201,168,76,0.6)", cursor: "pointer", marginBottom: 22, display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0 },
  divEyebrow: (color) => ({ fontSize: 10, letterSpacing: 5, color, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }),
  divH1: { fontFamily: "'Georgia',serif", fontSize: "clamp(32px,4.5vw,50px)", fontWeight: 900, color: PARCHMENT, letterSpacing: -0.5, lineHeight: 1, marginBottom: 10 },
  divRange: { fontSize: 13, color: "rgba(242,232,208,0.45)", letterSpacing: 1.5, marginBottom: 16 },
  divTagline: { fontStyle: "italic", fontSize: 17, color: "rgba(242,232,208,0.75)", lineHeight: 1.6, maxWidth: 680, marginBottom: 30 },

  sectionLabel: (color) => ({ fontSize: 10, letterSpacing: 3.5, color, textTransform: "uppercase", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid rgba(201,168,76,0.15)` }),
  prose: { fontSize: 15.5, lineHeight: 1.8, color: "rgba(242,232,208,0.82)", marginBottom: 30 },

  bookGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 13, marginBottom: 8 },
  bookCard: (color) => ({
    background: "rgba(27,42,74,0.4)", border: `1px solid ${color}30`, borderLeft: `3px solid ${color}`,
    borderRadius: 3, padding: "13px 15px", cursor: "pointer", transition: "background 0.15s",
  }),
  bookCardTitle: { fontSize: 14.5, fontWeight: 700, color: PARCHMENT, marginBottom: 5, display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" },
  bookCardReason: { fontSize: 12.5, lineHeight: 1.55, color: "rgba(242,232,208,0.62)" },
  bookCardBadge: { fontSize: 8, letterSpacing: 1.5, color: GOLD, border: `1px solid rgba(201,168,76,0.4)`, padding: "2px 6px", borderRadius: 2, flexShrink: 0 },

  calloutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 30 },
  callout: { background: "rgba(27,42,74,0.4)", border: `1px solid rgba(201,168,76,0.12)`, borderRadius: 3, padding: "16px 18px" },
  calloutLabel: { fontSize: 9, letterSpacing: 3, color: "rgba(201,168,76,0.55)", marginBottom: 8, textTransform: "uppercase" },
  calloutText: { fontSize: 14, lineHeight: 1.7, color: "rgba(242,232,208,0.8)" },
  sienna: { background: "linear-gradient(90deg, rgba(139,58,42,0.14), rgba(139,58,42,0.03))", borderLeft: `3px solid ${SIENNA}`, padding: "15px 18px", borderRadius: "0 3px 3px 0", marginBottom: 30 },
  siennaLabel: { fontSize: 9, letterSpacing: 3, color: SIENNA, marginBottom: 8, textTransform: "uppercase", fontWeight: 700 },
  siennaText: { fontSize: 14, lineHeight: 1.75, color: "rgba(242,232,208,0.85)", fontStyle: "italic" },

  verseBox: { background: "linear-gradient(135deg,rgba(27,42,74,0.6),rgba(15,26,48,0.8))", border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 3, padding: "18px 22px", marginBottom: 32, textAlign: "center" },
  verseRef: { fontSize: 11, letterSpacing: 3, color: GOLD, marginBottom: 8, fontWeight: 700 },

  comingSoon: { textAlign: "center", padding: "50px 20px", border: `1px dashed rgba(201,168,76,0.25)`, borderRadius: 4, color: "rgba(242,232,208,0.5)" },
  comingSoonTitle: { fontSize: 17, color: PARCHMENT, marginBottom: 8, fontStyle: "italic" },

  // Mobile fallback note (book frame too narrow)
  mobileNote: { fontSize: 11, color: "rgba(242,232,208,0.4)", textAlign: "center", marginTop: 14, letterSpacing: 0.5 },
};
// ── UI TRANSLATIONS ───────────────────────────────────────────────────────────
const UI = {
  es: {
    appTitle: "Exploración Bíblica Panorámica Interactiva",
    ot: "A.T.", nt: "N.T.",
    books: n => `${n} ${n === 1 ? "libro" : "libros"}`,
    cardBooks: n => `${n} ${n === 1 ? "libro" : "libros"} →`,
    tabs: ["VISIÓN GENERAL","TEOLOGÍA","PROPÓSITO","CONTEXTO CANÓNICO","CONTEXTO HISTÓRICO","VERSÍCULOS CLAVE","FUENTES"],
    backToShelf: "← VOLVER AL ESTANTE",
    backToCanon: "← El Canon",
    eyebrow: "Canon Pipeline · Protestantismo Reformado · NBLA · ESV · NAA",
    subline: "Bereshit — En el principio creó Dios los cielos y la tierra",
    metaLabels: ["Título Original","Autor","Fecha de escritura","División Canónica","Idioma Original","Versiones"],
    traditional: "Autoría tradicional",
    canonEntry: n => `#${n} del Canon`,
    hint: "← Arrastra para explorar · Clic en capítulo → BibleGateway NBLA · Clic en personaje → biografía →",
    pipeline: "CANON PIPELINE v1.2.0 · PROTESTANTISMO REFORMADO · NBLA / ESV / NAA",
    eraLabels: ["CREACIÓN Y CAÍDA · Gn 1–11","PACTO ABRAHÁNICO · Gn 12–25","PATRIARCAS · Gn 26–36","PROVIDENCIA · JOSÉ · Gn 37–50"],
    ot_label: "ANTIGUO TESTAMENTO", nt_label: "NUEVO TESTAMENTO",
    book_s: "LIBRO", book_p: "LIBROS",
    divSections: ["VISIÓN GENERAL","TRASFONDO HISTÓRICO","¿POR QUÉ SE AGRUPAN ASÍ?","CONTEXTO DE PACTO","ENFOQUE CRISTOLÓGICO","DISTINCTIVA REFORMADA","VERSÍCULO CLAVE DE LA DIVISIÓN","LOS LIBROS DE ESTA DIVISIÓN"],
    see: "VER →",
    headerIndex: "Toca una clasificación para conocer su trasfondo histórico, por qué se agrupa así, y los libros que la componen.",
    headerDiv: (t, r) => `Explorando ${t} — ${r}. Toca un libro a la izquierda o derecha, o vuelve al índice de clasificaciones.`,
    headerGenesis: "Recorre la línea de tiempo de Génesis: personajes, capítulos y teología sistemática interactiva.",
    headerBook: b => `Leyendo ${b}. Toca otro libro para navegar, o vuelve al índice de clasificaciones.`,
    theologyLabels: {
      doctrines: "DOCTRINAS",
      sysTheology: "TEOLOGÍA SISTEMÁTICA",
      whatTeaches: t => `LO QUE ${t} ENSEÑA`,
      keyPassages: t => `PASAJES CLAVE EN ${t}`,
      reformed: "DISTINCTIVA REFORMADA",
      confessions: "CONFESIONES DE FE",
      wcf: "CONFESIÓN DE WESTMINSTER",
      wcfTeaches: "LO QUE ENSEÑA ESTE CAPÍTULO",
      wcfPassages: t => `PASAJES DE ${t} QUE FUNDAMENTAN ESTE CAPÍTULO`,
      readFull: "LEER CAPÍTULO COMPLETO →",
      wcfHint: t => `Haz clic en una doctrina para ver los versículos de ${t} que fundamentan ese capítulo.`,
    },
    purposeLabels: {
      historical: "PROPÓSITO HISTÓRICO",
      theological: "PROPÓSITO TEOLÓGICO",
      audience: "DESTINATARIO ORIGINAL",
    },
    canonLabels: {
      position: "POSICIÓN EN LA HISTORIA REDENTORA",
      genesisMarker: t => `← ${t}`,
      christFocus: "ENFOQUE CRISTOLÓGICO",
      biblicalTheology: "TEOLOGÍA BÍBLICA (GEERHARDUS VOS)",
      typesShadows: "TIPOS Y SOMBRAS DE CRISTO",
    },
    historyLabels: {
      period: "PERÍODO HISTÓRICO",
      chronology: "CRONOLOGÍA INTERNA DEL LIBRO",
      geography: "GEOGRAFÍA DEL LIBRO",
      civilizations: "CIVILIZACIONES EN ESCENA",
      ane: "FUENTES DEL ANTIGUO ORIENTE PRÓXIMO (ANE)",
      controversies: "CONTROVERSIAS HISTÓRICAS",
    },
    sourcesLabels: {
      hint: "Haz clic en cualquier fuente para ver biografía del autor, método y aportación al pipeline",
      viewCard: "Ver ficha completa →",
      aboutAuthor: "SOBRE EL AUTOR",
      method: "MÉTODO Y ENFOQUE",
      contribution: "APORTACIÓN AL CANON PIPELINE",
      mainWorks: "OBRAS PRINCIPALES",
      viewFull: "VER FICHA COMPLETA →",
    },
    characterLabels: {
      actions: "ACCIONES NARRATIVAS",
      theological: "SIGNIFICADO TEOLÓGICO",
      typeShadow: "TIPO Y SOMBRA DE CRISTO",
      inNT: "EN EL NUEVO TESTAMENTO",
      keyVerses: "VERSÍCULOS CLAVE",
      bioHint: (a, b, ab) => `${ab} ${a}–${b} · Clic para ver biografía completa`,
    },
    comingSoon: b => `${b} — aún no generado. Este libro se añadirá al pipeline próximamente.`,
    footer: "El Canon · 66 libros · 10 divisiones · tradición reformada",
  },
  en: {
    appTitle: "Interactive Panoramic Bible Exploration",
    ot: "O.T.", nt: "N.T.",
    books: n => `${n} ${n === 1 ? "book" : "books"}`,
    cardBooks: n => `${n} ${n === 1 ? "book" : "books"} →`,
    tabs: ["OVERVIEW","THEOLOGY","PURPOSE","CANONICAL CONTEXT","HISTORICAL CONTEXT","KEY VERSES","SOURCES"],
    backToShelf: "← BACK TO SHELF",
    backToCanon: "← The Canon",
    eyebrow: "Canon Pipeline · Reformed Protestantism · NBLA · ESV · NAA",
    subline: "Bereshit — In the beginning God created the heavens and the earth",
    metaLabels: ["Original Title","Author","Date Written","Canonical Division","Original Language","Versions"],
    traditional: "Traditional authorship",
    canonEntry: n => `#${n} of the Canon`,
    hint: "← Drag to explore · Click chapter → BibleGateway ESV · Click character → biography →",
    pipeline: "CANON PIPELINE v1.2.0 · REFORMED PROTESTANTISM · NBLA / ESV / NAA",
    eraLabels: ["CREATION & FALL · Gen 1–11","ABRAHAMIC COVENANT · Gen 12–25","PATRIARCHS · Gen 26–36","PROVIDENCE · JOSEPH · Gen 37–50"],
    ot_label: "OLD TESTAMENT", nt_label: "NEW TESTAMENT",
    book_s: "BOOK", book_p: "BOOKS",
    divSections: ["OVERVIEW","HISTORICAL BACKGROUND","WHY GROUPED TOGETHER?","COVENANT CONTEXT","CHRISTOLOGICAL FOCUS","REFORMED DISTINCTIVE","KEY VERSE OF THE DIVISION","BOOKS IN THIS DIVISION"],
    see: "SEE →",
    headerIndex: "Tap a classification to explore its historical background, why it's grouped this way, and its books.",
    headerDiv: (t, r) => `Exploring ${t} — ${r}. Tap a book on the left or right, or return to the index.`,
    headerGenesis: "Explore the Genesis timeline: characters, chapters, and interactive systematic theology.",
    headerBook: b => `Reading ${b}. Tap another book to navigate, or return to the index.`,
    theologyLabels: {
      doctrines: "DOCTRINES",
      sysTheology: "SYSTEMATIC THEOLOGY",
      whatTeaches: t => `WHAT ${t} TEACHES`,
      keyPassages: t => `KEY PASSAGES IN ${t}`,
      reformed: "REFORMED DISTINCTIVE",
      confessions: "CONFESSIONS OF FAITH",
      wcf: "WESTMINSTER CONFESSION",
      wcfTeaches: "WHAT THIS CHAPTER TEACHES",
      wcfPassages: t => `${t} PASSAGES THAT GROUND THIS CHAPTER`,
      readFull: "READ FULL CHAPTER →",
      wcfHint: t => `Click a doctrine to see the ${t} passages that ground that chapter.`,
    },
    purposeLabels: {
      historical: "HISTORICAL PURPOSE",
      theological: "THEOLOGICAL PURPOSE",
      audience: "ORIGINAL AUDIENCE",
    },
    canonLabels: {
      position: "POSITION IN REDEMPTIVE HISTORY",
      genesisMarker: t => `← ${t}`,
      christFocus: "CHRISTOLOGICAL FOCUS",
      biblicalTheology: "BIBLICAL THEOLOGY (GEERHARDUS VOS)",
      typesShadows: "TYPES AND SHADOWS OF CHRIST",
    },
    historyLabels: {
      period: "HISTORICAL PERIOD",
      chronology: "INTERNAL CHRONOLOGY OF THE BOOK",
      geography: "BOOK GEOGRAPHY",
      civilizations: "CIVILIZATIONS IN SCENE",
      ane: "ANCIENT NEAR EAST SOURCES (ANE)",
      controversies: "HISTORICAL CONTROVERSIES",
    },
    sourcesLabels: {
      hint: "Click any source to view the author biography, method and contribution to the pipeline",
      viewCard: "View full card →",
      aboutAuthor: "ABOUT THE AUTHOR",
      method: "METHOD & APPROACH",
      contribution: "CONTRIBUTION TO CANON PIPELINE",
      mainWorks: "MAIN WORKS",
      viewFull: "VIEW FULL CARD →",
    },
    characterLabels: {
      actions: "NARRATIVE ACTIONS",
      theological: "THEOLOGICAL MEANING",
      typeShadow: "TYPE AND SHADOW OF CHRIST",
      inNT: "IN THE NEW TESTAMENT",
      keyVerses: "KEY VERSES",
      bioHint: (a, b, ab) => `${ab} ${a}–${b} · Click for full biography`,
    },
    comingSoon: b => `${b} — not yet generated. This book will be added to the pipeline soon.`,
    footer: "The Canon · 66 books · 10 divisions · Reformed tradition",
  },
  pt: {
    appTitle: "Exploração Bíblica Panorâmica Interativa",
    ot: "A.T.", nt: "N.T.",
    books: n => `${n} ${n === 1 ? "livro" : "livros"}`,
    cardBooks: n => `${n} ${n === 1 ? "livro" : "livros"} →`,
    tabs: ["VISÃO GERAL","TEOLOGIA","PROPÓSITO","CONTEXTO CANÔNICO","CONTEXTO HISTÓRICO","VERSÍCULOS-CHAVE","FONTES"],
    backToShelf: "← VOLTAR À ESTANTE",
    backToCanon: "← O Cânon",
    eyebrow: "Canon Pipeline · Protestantismo Reformado · NBLA · ESV · NAA",
    subline: "Bereshit — No princípio Deus criou os céus e a terra",
    metaLabels: ["Título Original","Autor","Data de Composição","Divisão Canônica","Idioma Original","Versões"],
    traditional: "Autoria tradicional",
    canonEntry: n => `#${n} do Cânon`,
    hint: "← Arraste para explorar · Clique no capítulo → BibleGateway NAA · Clique no personagem → biografia →",
    pipeline: "CANON PIPELINE v1.2.0 · PROTESTANTISMO REFORMADO · NBLA / ESV / NAA",
    eraLabels: ["CRIAÇÃO E QUEDA · Gn 1–11","ALIANÇA ABRAÂMICA · Gn 12–25","PATRIARCAS · Gn 26–36","PROVIDÊNCIA · JOSÉ · Gn 37–50"],
    ot_label: "ANTIGO TESTAMENTO", nt_label: "NOVO TESTAMENTO",
    book_s: "LIVRO", book_p: "LIVROS",
    divSections: ["VISÃO GERAL","CONTEXTO HISTÓRICO","POR QUE AGRUPADOS ASSIM?","CONTEXTO DE ALIANÇA","ENFOQUE CRISTOLÓGICO","DISTINTIVA REFORMADA","VERSÍCULO-CHAVE DA DIVISÃO","LIVROS DESTA DIVISÃO"],
    see: "VER →",
    headerIndex: "Toque em uma classificação para conhecer seu contexto histórico, por que é agrupada assim e seus livros.",
    headerDiv: (t, r) => `Explorando ${t} — ${r}. Toque em um livro à esquerda ou direita, ou volte ao índice.`,
    headerGenesis: "Explore a linha do tempo de Gênesis: personagens, capítulos e teologia sistemática interativa.",
    headerBook: b => `Lendo ${b}. Toque em outro livro para navegar, ou volte ao índice.`,
    theologyLabels: {
      doctrines: "DOUTRINAS",
      sysTheology: "TEOLOGIA SISTEMÁTICA",
      whatTeaches: t => `O QUE ${t} ENSINA`,
      keyPassages: t => `PASSAGENS-CHAVE EM ${t}`,
      reformed: "DISTINTIVA REFORMADA",
      confessions: "CONFISSÕES DE FÉ",
      wcf: "CONFISSÃO DE WESTMINSTER",
      wcfTeaches: "O QUE ESTE CAPÍTULO ENSINA",
      wcfPassages: t => `PASSAGENS DE ${t} QUE FUNDAMENTAM ESTE CAPÍTULO`,
      readFull: "LER CAPÍTULO COMPLETO →",
      wcfHint: t => `Clique em uma doutrina para ver as passagens de ${t} que fundamentam esse capítulo.`,
    },
    purposeLabels: {
      historical: "PROPÓSITO HISTÓRICO",
      theological: "PROPÓSITO TEOLÓGICO",
      audience: "DESTINATÁRIO ORIGINAL",
    },
    canonLabels: {
      position: "POSIÇÃO NA HISTÓRIA REDENTORA",
      genesisMarker: t => `← ${t}`,
      christFocus: "ENFOQUE CRISTOLÓGICO",
      biblicalTheology: "TEOLOGIA BÍBLICA (GEERHARDUS VOS)",
      typesShadows: "TIPOS E SOMBRAS DE CRISTO",
    },
    historyLabels: {
      period: "PERÍODO HISTÓRICO",
      chronology: "CRONOLOGIA INTERNA DO LIVRO",
      geography: "GEOGRAFIA DO LIVRO",
      civilizations: "CIVILIZAÇÕES EM CENA",
      ane: "FONTES DO ANTIGO ORIENTE PRÓXIMO (ANE)",
      controversies: "CONTROVÉRSIAS HISTÓRICAS",
    },
    sourcesLabels: {
      hint: "Clique em qualquer fonte para ver a biografia do autor, método e contribuição ao pipeline",
      viewCard: "Ver ficha completa →",
      aboutAuthor: "SOBRE O AUTOR",
      method: "MÉTODO E ABORDAGEM",
      contribution: "CONTRIBUIÇÃO AO CANON PIPELINE",
      mainWorks: "OBRAS PRINCIPAIS",
      viewFull: "VER FICHA COMPLETA →",
    },
    characterLabels: {
      actions: "AÇÕES NARRATIVAS",
      theological: "SIGNIFICADO TEOLÓGICO",
      typeShadow: "TIPO E SOMBRA DE CRISTO",
      inNT: "NO NOVO TESTAMENTO",
      keyVerses: "VERSÍCULOS-CHAVE",
      bioHint: (a, b, ab) => `${ab} ${a}–${b} · Clique para ver biografia completa`,
    },
    comingSoon: b => `${b} — ainda não gerado. Este livro será adicionado ao pipeline em breve.`,
    footer: "O Cânon · 66 livros · 10 divisões · tradição reformada",
  },
};

const TABS = [
  { id: "overview",  label: "VISIÓN GENERAL" },
  { id: "theology",  label: "TEOLOGÍA" },
  { id: "purpose",   label: "PROPÓSITO" },
  { id: "canon",     label: "CONTEXTO CANÓNICO" },
  { id: "history",   label: "CONTEXTO HISTÓRICO" },
  { id: "verses",    label: "VERSÍCULOS CLAVE" },
  { id: "sources",   label: "FUENTES" },
];

// ── HISTORICAL CONTEXT DATA ───────────────────────────────────────────────────

const CHAPTER_ERAS = [
  { from: 1,  to: 11, color: "#4A6741", label: "CREACIÓN Y CAÍDA · Gn 1–11" },
  { from: 12, to: 25, color: "#1B5E8B", label: "PACTO ABRAHÁNICO · Gn 12–25" },
  { from: 26, to: 36, color: "#6B4A8B", label: "PATRIARCAS · Gn 26–36" },
  { from: 37, to: 50, color: "#1B6B5E", label: "PROVIDENCIA · JOSÉ · Gn 37–50" },
];

const chapterColor = (ch) => {
  const era = CHAPTER_ERAS.find(e => ch >= e.from && ch <= e.to);
  return era ? era.color : GOLD;
};

// ── STYLES (inline) ──────────────────────────────────────────────────────────

const GS = {
  app: { fontFamily: "'Georgia', serif", background: LAPIS_DEEP, color: PARCHMENT, minHeight: "100vh", overflowX: "hidden" },
  topBar: { height: 3, background: `linear-gradient(90deg, transparent, ${GOLD}, ${SIENNA}, ${GOLD}, transparent)` },
  header: { textAlign: "center", padding: "48px 20px 32px", borderBottom: `1px solid rgba(201,168,76,0.3)`, background: "linear-gradient(180deg,rgba(15,26,48,0.9),rgba(27,42,74,0.6))" },
  eyebrow: { fontFamily: "'Georgia',serif", fontSize: 10, letterSpacing: 6, color: GOLD, textTransform: "uppercase", marginBottom: 14, opacity: 0.8 },
  h1: { fontFamily: "'Georgia',serif", fontSize: "clamp(44px,7vw,88px)", fontWeight: 900, color: PARCHMENT, letterSpacing: -1, lineHeight: 0.92, marginBottom: 6, textShadow: `0 0 60px rgba(201,168,76,0.3)` },
  hebrew: { fontSize: "clamp(20px,3.5vw,36px)", color: GOLD, opacity: 0.7, letterSpacing: 8, marginBottom: 12, direction: "rtl" },
  subline: { fontStyle: "italic", fontSize: 17, color: "rgba(242,232,208,0.7)", maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 },
  badgeRow: { display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" },
  badge: { fontFamily: "'Georgia',serif", fontSize: 10, letterSpacing: 3, color: GOLD, border: `1px solid rgba(201,168,76,0.4)`, padding: "5px 12px", borderRadius: 2 },
  eraLegend: { display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", padding: "12px 20px", background: "rgba(15,26,48,0.5)", borderBottom: `1px solid rgba(201,168,76,0.15)` },
  eraDot: { display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "rgba(242,232,208,0.7)" },

  // BOOK INFO PANEL
  infoPanel: { background: "linear-gradient(180deg,rgba(15,26,48,0.97),rgba(10,16,30,0.99))", borderBottom: `1px solid rgba(201,168,76,0.2)` },
  tabNavWrap: { position: "relative" },
  tabNav: { display: "flex", borderBottom: `1px solid rgba(201,168,76,0.15)`, overflowX: "auto", padding: "0 24px", gap: 0, scrollbarWidth: "none", msOverflowStyle: "none" },
  tabNavFade: { position: "absolute", right: 0, top: 0, bottom: 1, width: 80, background: `linear-gradient(90deg, transparent, rgba(10,16,30,0.97))`, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10 },
  tabBtn: (active) => ({
    fontFamily: "'Georgia',serif", fontSize: 13, fontWeight: 600, letterSpacing: 2, color: active ? GOLD : "rgba(201,168,76,0.45)",
    background: "none", border: "none", borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
    padding: "16px 20px 14px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
    transition: "color 0.2s, border-color 0.2s",
  }),
  tabPanels: { padding: "28px 32px 32px" },

  // Meta grid
  metaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 20, marginBottom: 24 },
  metaBlock: { borderLeft: `2px solid rgba(201,168,76,0.25)`, paddingLeft: 14 },
  metaLabel: { fontSize: 9, letterSpacing: 3, color: "rgba(201,168,76,0.55)", marginBottom: 5, textTransform: "uppercase" },
  metaValue: { fontSize: 15, color: PARCHMENT, lineHeight: 1.4 },
  divider: { height: 1, background: "linear-gradient(90deg,rgba(201,168,76,0.2),transparent)", margin: "18px 0" },
  prose: { fontSize: 16, lineHeight: 1.78, color: "rgba(242,232,208,0.82)", maxWidth: 860 },

  // Theology
  theoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16, marginBottom: 20 },
  theoCard: { background: "rgba(27,42,74,0.4)", border: `1px solid rgba(201,168,76,0.12)`, borderRadius: 3, padding: 18 },
  theoCardTitle: { fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid rgba(201,168,76,0.15)` },
  theoCardText: { fontSize: 14, lineHeight: 1.7, color: "rgba(242,232,208,0.78)" },
  tagsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 },
  tag: { fontSize: 9, letterSpacing: 2, background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.25)`, color: "rgba(201,168,76,0.8)", padding: "4px 10px", borderRadius: 2 },
  wcfItem: { display: "flex", gap: 10, padding: "9px 0", borderBottom: `1px solid rgba(201,168,76,0.08)`, fontSize: 14, color: "rgba(242,232,208,0.75)", lineHeight: 1.5 },

  // Purpose
  purposeCols: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  purposeColTitle: { fontSize: 10, letterSpacing: 3, color: GOLD, marginBottom: 12, paddingBottom: 6, borderBottom: `1px solid rgba(201,168,76,0.2)` },
  audienceBox: { marginTop: 22, background: "linear-gradient(90deg,rgba(139,58,42,0.14),rgba(139,58,42,0.04))", borderLeft: `3px solid ${SIENNA}`, padding: "14px 18px", borderRadius: "0 3px 3px 0" },

  // Canon
  epochRow: { display: "flex", overflowX: "auto", marginBottom: 24, gap: 0 },
  epoch: (highlight) => ({
    flex: 1, minWidth: 120, padding: "14px 12px",
    border: `1px solid ${highlight ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.12)"}`,
    borderRight: "none",
    background: highlight ? "rgba(201,168,76,0.07)" : "transparent",
  }),
  epochLast: { borderRight: `1px solid rgba(201,168,76,0.12)` },
  epochLabel: { fontSize: 8, letterSpacing: 2, color: "rgba(201,168,76,0.55)", marginBottom: 4 },
  epochTitle: { fontSize: 14, fontWeight: 600, color: PARCHMENT, lineHeight: 1.3, marginBottom: 5 },
  epochBooks: { fontSize: 10, color: "rgba(242,232,208,0.38)", letterSpacing: 1 },
  christBox: { background: "linear-gradient(135deg,rgba(27,42,74,0.6),rgba(15,26,48,0.8))", border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 3, padding: "18px 22px", marginBottom: 18 },
  typesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 10 },
  typeItem: { display: "flex", gap: 10, padding: "10px 12px", background: "rgba(201,168,76,0.04)", border: `1px solid rgba(201,168,76,0.1)`, borderRadius: 3, fontSize: 13, color: "rgba(242,232,208,0.75)", lineHeight: 1.5 },

  // Verses
  verseEntry: { display: "flex", gap: 18, padding: "18px 0", borderBottom: `1px solid rgba(201,168,76,0.1)`, alignItems: "flex-start" },
  verseRef: { fontWeight: 700, fontSize: 13, color: GOLD, minWidth: 80, paddingTop: 3, letterSpacing: 1, flexShrink: 0 },
  verseText: { fontStyle: "italic", fontSize: 17, color: PARCHMENT, lineHeight: 1.6, marginBottom: 5 },
  verseNote: { fontSize: 13, color: "rgba(242,232,208,0.55)", lineHeight: 1.5 },

  // Sources
  sourcesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 },
  sourceCard: { background: "rgba(27,42,74,0.35)", border: `1px solid rgba(201,168,76,0.1)`, borderRadius: 3, padding: "14px 16px" },
  sourceTier: { fontSize: 8, letterSpacing: 3, color: "rgba(201,168,76,0.5)", marginBottom: 4 },
  sourceTitle: { fontSize: 15, fontWeight: 600, color: PARCHMENT, lineHeight: 1.3, marginBottom: 2 },
  sourceAuthor: { fontStyle: "italic", fontSize: 13, color: "rgba(242,232,208,0.6)", marginBottom: 2 },
  sourceMeta: { fontSize: 9, letterSpacing: 2, color: "rgba(201,168,76,0.4)" },

  // Timeline
  timelineWrap: { overflowX: "auto", padding: "52px 40px 100px", cursor: "grab", position: "relative" },
  timelineInner: { position: "relative", width: 4200, height: 520 },
  spine: { position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,rgba(201,168,76,0.3) 2%,${GOLD} 20%,${GOLD} 80%,rgba(201,168,76,0.3) 98%,transparent)`, transform: "translateY(-50%)" },

  // Character popup
  overlay: (open) => ({ position: "fixed", inset: 0, background: "rgba(10,16,30,0.88)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, opacity: open ? 1 : 0, pointerEvents: open ? "all" : "none", transition: "opacity 0.25s" }),
  popupCard: { background: "linear-gradient(145deg,#1a2840,#0f1a30)", border: `1px solid rgba(201,168,76,0.4)`, borderRadius: 4, maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" },
  popupHeader: { padding: "28px 28px 20px", borderBottom: `1px solid rgba(201,168,76,0.2)`, display: "flex", gap: 20, alignItems: "flex-start" },
  popupAvatar: (color) => ({ width: 96, height: 96, borderRadius: 3, border: `1px solid ${color}`, background: `linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.1))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color, flexShrink: 0 }),
  popupBadge: (color) => ({ display: "inline-block", fontSize: 9, letterSpacing: 3, color, border: `1px solid rgba(201,168,76,0.4)`, padding: "3px 9px", marginBottom: 7, borderRadius: 2 }),
  popupName: { fontSize: 26, fontWeight: 700, color: PARCHMENT, lineHeight: 1.1, marginBottom: 5 },
  popupChapters: (color) => ({ fontSize: 12, color, letterSpacing: 1, marginBottom: 10 }),
  popupDesc: { fontStyle: "italic", fontSize: 15, color: "rgba(242,232,208,0.85)", lineHeight: 1.65 },
  popupBody: { padding: "20px 28px 28px" },
  popupSectionTitle: { fontSize: 9, letterSpacing: 4, color: GOLD, marginBottom: 9, paddingBottom: 5, borderBottom: `1px solid rgba(201,168,76,0.15)`, marginTop: 18 },
  popupText: { fontSize: 15, lineHeight: 1.7, color: "rgba(242,232,208,0.8)" },
  typeBanner: { background: "linear-gradient(90deg,rgba(139,58,42,0.18),rgba(139,58,42,0.04))", borderLeft: `3px solid ${SIENNA}`, padding: "11px 14px", borderRadius: "0 3px 3px 0", marginTop: 8 },
  ntBox: { background: "rgba(27,42,74,0.5)", border: `1px solid rgba(201,168,76,0.15)`, borderRadius: 3, padding: "11px 14px", marginTop: 8, fontSize: 14, lineHeight: 1.65, color: "rgba(242,232,208,0.75)" },
  closeBtn: { position: "absolute", top: 14, right: 14, width: 30, height: 30, background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD, fontSize: 15, zIndex: 10 },
  versChips: { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 },
  versChip: { fontSize: 10, letterSpacing: 1, background: "rgba(201,168,76,0.1)", border: `1px solid rgba(201,168,76,0.3)`, color: GOLD, padding: "3px 9px", borderRadius: 2 },

  // Chapter tooltip
  chTooltip: { position: "fixed", background: "rgba(10,16,30,0.97)", border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 3, padding: "16px 18px", maxWidth: 280, pointerEvents: "none", zIndex: 500, boxShadow: "0 8px 30px rgba(0,0,0,0.6)" },
  chTooltipCh: { fontSize: 9, letterSpacing: 3, color: GOLD, marginBottom: 3 },
  chTooltipTitle: { fontSize: 16, fontWeight: 700, color: PARCHMENT, marginBottom: 7, lineHeight: 1.2 },
  chTooltipDesc: { fontSize: 13, lineHeight: 1.6, color: "rgba(242,232,208,0.72)", marginBottom: 8 },
  chTooltipVerse: { fontSize: 9, letterSpacing: 2, color: "rgba(201,168,76,0.65)" },
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

function GenesisFullViewer({ onBack, bookData, globalData, personasDisplay = {}, lang = "es", divisionName }) {
  const lv = (t) => linkifyVerses(t, lang);
  const vu = (r) => verseUrl(r, lang);
  const theology   = bookData ? adaptTheology(bookData.teologiaSistematica, lang) : [];
  const sources    = bookData ? adaptFuentes(bookData.fuentes, lang) : [];
  const chapters   = bookData ? adaptCapitulos(bookData.resumenCapitulos, lang) : [];
  const histCtx    = bookData ? adaptContextoHistorico(bookData.contextoHistorico, lang) : {};
  const keyVerses  = bookData ? adaptVersiculosClave(bookData.versiculosClave, lang) : [];
  const wcfAnchors = bookData ? adaptAnclasConfesionales(bookData.anclasConfesionales, lang) : [];
  const tiposSombras = bookData ? adaptTiposYSombras(bookData.historiaRedentora?.tiposYSombras, lang) : [];
  const characters = bookData ? adaptPersonajes(bookData.personajes, lang, personasDisplay) : [];
  const epochs     = globalData ? (globalData.epocasRedentoras[lang] || globalData.epocasRedentoras.es) : [];
  const totalChapters = bookData?.capitulosTotal || 50;
  const bookTitle = (bookData?.titulo?.[lang] || bookData?.titulo?.es || "").toUpperCase();
  const bookAb = BOOKS.find(b => b.id === bookData?.id)?.ab || "Gn";
  const categoriaEsToLang = {};
  (bookData?.teologiaSistematica || []).forEach(e => {
    if (e.categoria && typeof e.categoria === "object")
      categoriaEsToLang[e.categoria.es] = e.categoria[lang] || e.categoria.es;
  });
  // Build era bands from chapter data when era values are present; fall back to
  // the Genesis-specific CHAPTER_ERAS constant for books without era annotations.
  const hasBookEras = chapters.some(c => c.era && c.era.trim());
  const chapterEras = hasBookEras ? (() => {
    const groups = [];
    for (const c of chapters) {
      const prev = groups[groups.length - 1];
      if (prev && prev.era === c.era) { prev.to = c.ch; }
      else groups.push({ from: c.ch, to: c.ch, color: c.color, era: c.era, label: c.era });
    }
    return groups;
  })() : CHAPTER_ERAS;
  // Derive epoch highlight index from the book's own epoca field so it works for
  // any book, not just Genesis. Always match against the Spanish titles (source of truth).
  const esEpochs = globalData?.epocasRedentoras?.es || [];
  const bookEpoca = bookData?.historiaRedentora?.epoca || "";
  const highlightIdx = esEpochs.findIndex(ep => ep.title === bookEpoca || ep.title.includes(bookEpoca));
  // Translate a Spanish era name to the current language using the epoch data.
  const eraToLabel = (eraName) => {
    const idx = esEpochs.findIndex(ep => ep.title === eraName);
    return idx >= 0 ? (epochs[idx]?.title || eraName) : eraName;
  };
  const { HIST_PERIODO: HP, HIST_GEOGRAFIA: HG, HIST_CIVILIZACIONES: HC,
          HIST_ANE: HA, HIST_CRONOLOGIA: HCr, HIST_CONTROVERSIAS: HCo } = histCtx;
  const [activeTab, setActiveTab] = useState("overview");
  const [activeChar, setActiveChar] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [activeTheology, setActiveTheology] = useState(null);
  const [activeWcf, setActiveWcf] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null); // string key
  const [charTooltip, setCharTooltip] = useState(null); // { char, x, y }

  const TOTAL_W = 4200;
  const xOf = (ch) => ((ch - 0.5) / totalChapters) * TOTAL_W;

  // ── TAB CONTENT ────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "overview": return (
        <div>
          <div style={GS.prose}>
            {bookData && (bookData.proposito[lang] || bookData.proposito.es)
              ? lv(bookData.proposito[lang] || bookData.proposito.es)
              : <>
                  Génesis es <strong style={{color:GOLD}}>el libro de los principios</strong>: el origen del cosmos, de la humanidad, del pecado y de la redención. Como primer libro del canon, provee los fundamentos absolutos de toda la teología bíblica. Sin Génesis, ningún otro libro del canon tiene fundamento narrativo ni teológico — es <strong style={{color:GOLD}}>la raíz de la que brota toda la historia redentora</strong>.
                  <br/><br/>
                  El libro se estructura en torno a diez secciones <em>toledot</em> («estas son las generaciones de...»), que funcionan como columnas vertebrales de la narrativa. La primera mitad (Gn 1–11) narra los orígenes universales: la creación, la caída, el diluvio y Babel. La segunda mitad (Gn 12–50) registra el origen del pueblo elegido a través de <strong style={{color:GOLD}}>los cuatro patriarcas: Abraham, Isaac, Jacob y José</strong>.
                  <br/><br/>
                  El arco narrativo corre desde «En el principio creó Dios los cielos y la tierra» ({lv("Gn 1:1")}) hasta «José murió… y lo embalsamaron y lo pusieron en un ataúd en Egipto» ({lv("Gn 50:26")}) — de la creación perfecta a la muerte en tierra extranjera, aguardando la promesa de retorno.
                </>
            }
          </div>
        </div>
      );

      case "theology": {
        const activeCat = activeTheology || theology[0];
        const TL = UI[lang].theologyLabels;
        return (
          <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
            {/* LEFT: category buttons + WCF */}
            <div style={{display:"flex", flexDirection:"column", gap:3, flexShrink:0, minWidth:175, maxWidth:180}}>
              <div style={{...GS.metaLabel, marginBottom:4}}>{TL.doctrines}</div>
              {theology.map(cat => {
                const isActive = activeCat.categoria === cat.categoria;
                const isHovered = hoveredMenu === cat.categoria;
                return (
                  <button key={cat.categoria}
                    onClick={() => { setActiveTheology(cat); setActiveWcf(null); }}
                    onMouseEnter={() => setHoveredMenu(cat.categoria)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    style={{
                      width:"100%", textAlign:"left", padding:"6px 8px", marginBottom:2,
                      cursor:"pointer", borderRadius:2,
                      border:`1px solid ${isActive ? "rgba(201,168,76,0.4)" : isHovered ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.1)"}`,
                      borderLeft:`3px solid ${isActive ? GOLD : isHovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"}`,
                      background: isActive ? "rgba(201,168,76,0.1)" : isHovered ? "rgba(201,168,76,0.06)" : "rgba(27,42,74,0.15)",
                      transition:"all 0.15s",
                    }}>
                    <div style={{fontSize:13, fontFamily:"'Georgia',serif",
                      color: isActive ? PARCHMENT : isHovered ? "rgba(242,232,208,0.85)" : "rgba(242,232,208,0.55)",
                      lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                      transition:"color 0.15s",
                    }}>
                      {cat.categoria}
                    </div>
                  </button>
                );
              })}
              <div style={{...GS.metaLabel, marginTop:12, marginBottom:4}}>{TL.confessions}</div>
              {wcfAnchors.map((w, i) => {
                const isActive = activeWcf?.cap === w.cap;
                const isHovered = hoveredMenu === w.cap;
                return (
                  <button key={i}
                    onClick={() => { setActiveWcf(isActive ? null : w); setActiveTheology(null); }}
                    onMouseEnter={() => setHoveredMenu(w.cap)}
                    onMouseLeave={() => setHoveredMenu(null)}
                    style={{
                      width:"100%", textAlign:"left", padding:"6px 8px", marginBottom:2,
                      cursor:"pointer", borderRadius:2,
                      border:`1px solid ${isActive ? "rgba(201,168,76,0.4)" : isHovered ? "rgba(139,58,42,0.4)" : "rgba(201,168,76,0.1)"}`,
                      borderLeft:`3px solid ${isActive ? SIENNA : isHovered ? "rgba(139,58,42,0.7)" : "rgba(139,58,42,0.25)"}`,
                      background: isActive ? "rgba(139,58,42,0.1)" : isHovered ? "rgba(139,58,42,0.07)" : "rgba(27,42,74,0.15)",
                      transition:"all 0.15s",
                    }}>
                    <div style={{fontSize:10, letterSpacing:1.5, marginBottom:1,
                      color: isActive ? GOLD : isHovered ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.45)",
                      transition:"color 0.15s",
                    }}>
                      {w.cap}
                    </div>
                    <div style={{fontSize:13,
                      color: isActive ? PARCHMENT : isHovered ? "rgba(242,232,208,0.85)" : "rgba(242,232,208,0.55)",
                      lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                      transition:"color 0.15s",
                    }}>
                      {w.titulo}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: theology detail OR wcf detail */}
            <div style={{flex:1, minWidth:260}}>
              {activeWcf ? (
                /* WCF DETAIL PANEL */
                <div>
                  <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
                    <div style={{width:4, height:36, background:SIENNA, borderRadius:2, flexShrink:0}} />
                    <div>
                      <div style={{...GS.metaLabel, marginBottom:2, color:"rgba(139,58,42,0.9)"}}>{TL.wcf}</div>
                      <div style={{fontSize:20, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>
                        {`${activeWcf.cap} — ${activeWcf.titulo}`}
                      </div>
                    </div>
                  </div>

                  {/* Doctrines connected */}
                  <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:14}}>
                    {activeWcf.doctrinas.map(d => (
                      <span key={d} style={{...GS.tag, borderColor:"rgba(139,58,42,0.4)", color:"rgba(200,130,100,0.9)"}}>
                        {categoriaEsToLang[d] || d}
                      </span>
                    ))}
                  </div>

                  {/* Summary */}
                  <div style={{
                    background:"linear-gradient(90deg,rgba(139,58,42,0.1),rgba(139,58,42,0.03))",
                    borderLeft:`3px solid ${SIENNA}`, padding:"16px 18px",
                    borderRadius:"0 3px 3px 0", marginBottom:14,
                  }}>
                    <div style={{...GS.metaLabel, marginBottom:8, color:"rgba(139,58,42,0.8)"}}>
                      {TL.wcfTeaches}
                    </div>
                    <div style={{fontSize:15, lineHeight:1.78, color:"rgba(242,232,208,0.85)", fontStyle:"italic"}}>
                      {lv(activeWcf.resumen)}
                    </div>
                  </div>

                  {/* Genesis passages that ground this chapter */}
                  <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`,
                    borderRadius:3, padding:"14px 18px", marginBottom:14}}>
                    <div style={{...GS.metaLabel, marginBottom:10}}>{TL.wcfPassages(bookTitle)}</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {activeWcf.genesis.map(v => (
                        <a key={v} href={vu(v)} target="_blank" rel="noopener noreferrer"
                          style={{...GS.versChip, textDecoration:"none",
                            borderColor:"rgba(201,168,76,0.4)", cursor:"pointer"}}>
                          {v}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Link to full text */}
                  <a href={activeWcf.url} target="_blank" rel="noopener noreferrer" style={{
                    display:"inline-flex", alignItems:"center", gap:8,
                    fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:2,
                    color:GOLD, textDecoration:"none",
                    border:`1px solid rgba(201,168,76,0.3)`, padding:"8px 16px",
                    borderRadius:2, background:"rgba(201,168,76,0.06)",
                  }}>
                    {TL.readFull}
                  </a>
                  <div style={{marginTop:12, fontSize:11, color:"rgba(242,232,208,0.35)", fontStyle:"italic"}}>
                    Haz clic en una doctrina arriba para volver al panel de teología sistemática
                  </div>
                </div>
              ) : (
                <div>
              {/* Header */}
              <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
                <div style={{width:4, height:36, background:GOLD, borderRadius:2, flexShrink:0}} />
                <div>
                  <div style={{...GS.metaLabel, marginBottom:2}}>{TL.sysTheology}</div>
                  <div style={{fontSize:22, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>{activeCat.categoria}</div>
                </div>
              </div>

              {/* Summary */}
              <div style={{background:"rgba(27,42,74,0.4)", border:`1px solid rgba(201,168,76,0.18)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
                <div style={{...GS.metaLabel, marginBottom:8}}>{TL.whatTeaches(bookTitle)}</div>
                <div style={{fontSize:15, lineHeight:1.75, color:"rgba(242,232,208,0.83)"}}>
                  {lv(activeCat.resumen)}
                </div>
              </div>

              {/* Passages */}
              <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
                <div style={{...GS.metaLabel, marginBottom:12}}>{TL.keyPassages(bookTitle)}</div>
                {activeCat.pasajes.map((p, i) => (
                  <div key={i} style={{
                    display:"flex", gap:14, padding:"11px 0",
                    borderBottom: i < activeCat.pasajes.length-1 ? `1px solid rgba(201,168,76,0.07)` : "none",
                  }}>
                    <div style={{minWidth:94, flexShrink:0, paddingTop:2}}>
                      <VerseLink lang={lang} style={{fontSize:12}}>{p.ref}</VerseLink>
                    </div>
                    <div style={{fontSize:14, lineHeight:1.65, color:"rgba(242,232,208,0.72)"}}>
                      {lv(p.nota)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reformed distinctive */}
              <div style={{
                background:"linear-gradient(90deg,rgba(139,58,42,0.12),rgba(139,58,42,0.02))",
                borderLeft:`3px solid ${SIENNA}`, padding:"13px 16px", borderRadius:"0 3px 3px 0",
              }}>
                <div style={{...GS.metaLabel, marginBottom:7}}>{TL.reformed}</div>
                <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.65, color:"rgba(242,232,208,0.75)"}}>
                  {lv(activeCat.distintivaReformada || "")}
                </div>
              </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "purpose": {
        const PL = UI[lang].purposeLabels;
        return (
          <div>
            <div style={GS.prose}>
              {bookData && (bookData.proposito[lang] || bookData.proposito.es)
                ? lv(bookData.proposito[lang] || bookData.proposito.es)
                : lv(bookData?.proposito?.es || "")
              }
            </div>
            <div style={GS.audienceBox}>
              <div style={{...GS.metaLabel, marginBottom: 8}}>{PL.audience}</div>
              <div style={{fontStyle:"italic", fontSize: 15, color:"rgba(242,232,208,0.8)", lineHeight: 1.65}}>
                {bookData && (bookData.destinatario[lang] || bookData.destinatario.es)
                  ? bookData.destinatario[lang] || bookData.destinatario.es
                  : ""
                }
              </div>
            </div>
          </div>
        );
      }

      case "canon": {
        const CL = UI[lang].canonLabels;
        const christText = bookData?.historiaRedentora?.enfoqueCristologico?.[lang]
          || bookData?.historiaRedentora?.enfoqueCristologico?.es || "";
        return (
          <div>
            <div style={{...GS.metaLabel, marginBottom: 18}}>{CL.position}</div>
            <div style={GS.epochRow}>
              {epochs.map((ep, i) => (
                <div key={i} style={{...GS.epoch(i === highlightIdx), ...(i===epochs.length-1 ? GS.epochLast : {})}}>
                  {i === highlightIdx && <div style={{fontSize:8, letterSpacing:2, color:GOLD, marginBottom:4}}>← {bookData ? (bookData.titulo[lang] || bookData.titulo.es).toUpperCase() : "GÉNESIS"}</div>}
                  <div style={GS.epochLabel}>{ep.label}</div>
                  <div style={GS.epochTitle}>{ep.title}</div>
                  <div style={GS.epochBooks}>{ep.books}</div>
                </div>
              ))}
            </div>
            <div style={GS.christBox}>
              <div style={{...GS.metaLabel, marginBottom: 8}}>
                {CL.christFocus} —{" "}
                <a href="https://www.thegospelcoalition.org/reviews/book-launched-biblical-theology/" target="_blank" rel="noopener noreferrer"
                  style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.4)`, letterSpacing: 1 }}>
                  {CL.biblicalTheology}
                </a>
              </div>
              <div style={{fontStyle:"italic", fontSize: 15, color:"rgba(242,232,208,0.83)", lineHeight: 1.75}}>
                {lv(christText)}
              </div>
            </div>
            <div style={{...GS.metaLabel, marginBottom: 12}}>{CL.typesShadows}</div>
            <div style={GS.typesGrid}>
              {tiposSombras.map((t, i) => (
                <div key={i} style={GS.typeItem}>
                  <span style={{color:GOLD, fontSize:9, flexShrink:0, marginTop:2}}>✦</span>
                  <span>{lv(t)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "history": {
        const HL = UI[lang].historyLabels;
        return (
        <div>
          {/* Period */}
          <div style={{background:"rgba(27,42,74,0.4)", border:`1px solid rgba(201,168,76,0.18)`, borderRadius:3, padding:"18px 20px", marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:8}}>{HL.period}</div>
            <div style={{fontSize:15, lineHeight:1.75, color:"rgba(242,232,208,0.83)"}}>{HP}</div>
          </div>

          {/* Chronology */}
          <div style={{marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:12}}>{HL.chronology}</div>
            <div style={{display:"flex", flexDirection:"column", gap:0}}>
              {HCr.map((e, i) => (
                <div key={i} style={{display:"flex", gap:16, padding:"10px 0", borderBottom:`1px solid rgba(201,168,76,0.08)`, alignItems:"flex-start"}}>
                  <div style={{minWidth:130, flexShrink:0}}>
                    <div style={{fontSize:12, fontWeight:700, color:GOLD, letterSpacing:0.5}}>{e.fecha}</div>
                    <VerseLink lang={lang} style={{fontSize:10}}>{e.ref}</VerseLink>
                  </div>
                  <div style={{fontSize:14, color:"rgba(242,232,208,0.78)", lineHeight:1.5}}>{e.evento}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:8, fontSize:11, fontStyle:"italic", color:"rgba(242,232,208,0.4)"}}>
              Cronología conservadora-reformada (Ussher/masorética). La cronología moderna sitúa estos eventos 1–3 siglos más tarde.
            </div>
          </div>

          {/* Geography */}
          <div style={{marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:12}}>{HL.geography}</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
              {HG.map((g, i) => (
                <div key={i} style={{background:"rgba(27,42,74,0.35)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"14px 16px"}}>
                  <div style={{fontSize:13, fontWeight:700, color:GOLD, marginBottom:3}}>{g.lugar}</div>
                  <div style={{fontSize:11, letterSpacing:1, color:"rgba(201,168,76,0.5)", marginBottom:8}}>{g.moderna}</div>
                  <div style={{fontSize:13, lineHeight:1.6, color:"rgba(242,232,208,0.72)"}}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Civilizations */}
          <div style={{marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:12}}>{HL.civilizations}</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
              {HC.map((c, i) => (
                <div key={i} style={{background:"rgba(27,42,74,0.35)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"14px 16px"}}>
                  <div style={{fontSize:13, fontWeight:700, color:PARCHMENT, marginBottom:2}}>{c.nombre}</div>
                  <div style={{fontSize:11, letterSpacing:1, color:"rgba(201,168,76,0.5)", marginBottom:8}}>{c.rol}</div>
                  <div style={{fontSize:13, lineHeight:1.6, color:"rgba(242,232,208,0.72)"}}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ANE Sources */}
          <div style={{marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:12}}>{HL.ane}</div>
            <div style={{display:"flex", flexDirection:"column", gap:0}}>
              {HA.map((a, i) => (
                <div key={i} style={{display:"flex", gap:16, padding:"14px 0", borderBottom:`1px solid rgba(201,168,76,0.08)`, alignItems:"flex-start"}}>
                  <div style={{minWidth:200, flexShrink:0}}>
                    <div style={{fontSize:13, fontWeight:700, color:PARCHMENT, lineHeight:1.3, marginBottom:3}}>{a.nombre}</div>
                    <div style={{fontSize:10, letterSpacing:1, color:"rgba(201,168,76,0.5)"}}>{a.origen}</div>
                  </div>
                  <div style={{fontSize:13, lineHeight:1.65, color:"rgba(242,232,208,0.75)"}}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controversies */}
          <div style={{
            background:"linear-gradient(90deg,rgba(139,58,42,0.12),rgba(139,58,42,0.02))",
            borderLeft:`3px solid ${SIENNA}`, padding:"14px 18px", borderRadius:"0 3px 3px 0",
          }}>
            <div style={{...GS.metaLabel, marginBottom:8, color:"rgba(139,58,42,0.9)"}}>{HL.controversies}</div>
            <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.75, color:"rgba(242,232,208,0.78)"}}>
              {HCo}
            </div>
          </div>
        </div>
        );
      }

      case "verses": return (
        <div>
          {keyVerses.map((v, i) => (
            <div key={i} style={{...GS.verseEntry, borderBottom: i<keyVerses.length-1 ? `1px solid rgba(201,168,76,0.1)` : "none"}}>
              <div style={GS.verseRef}>
                <VerseLink lang={lang} style={{fontSize:13}}>{v.ref}</VerseLink>
              </div>
              <div style={{flex:1}}>
                <div style={GS.verseText}>"{v.text}"</div>
                <div style={GS.verseNote}>{lv(v.nota)}</div>
              </div>
            </div>
          ))}
        </div>
      );

      case "sources": {
        const SL = UI[lang].sourcesLabels;
        return (
        <div>
          <div style={{...GS.metaLabel, marginBottom:16}}>
            {SL.hint}
          </div>
          <div style={GS.sourcesGrid}>
            {sources.map((s, i) => (
              <div key={i} onClick={() => setActiveSource(s)} style={{
                ...GS.sourceCard,
                cursor: "pointer",
                border: `1px solid rgba(201,168,76,0.15)`,
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.border=`1px solid rgba(201,168,76,0.4)`; e.currentTarget.style.background="rgba(27,42,74,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.border=`1px solid rgba(201,168,76,0.15)`; e.currentTarget.style.background="rgba(27,42,74,0.35)"; }}
              >
                <div style={GS.sourceTier}>{s.tier}</div>
                <div style={GS.sourceTitle}>{s.title}</div>
                <div style={GS.sourceAuthor}>{s.author}</div>
                <div style={GS.sourceMeta}>{s.meta}</div>
                <div style={{marginTop:10, display:"flex", flexWrap:"wrap", gap:4}}>
                  {s.campos.map(c => (
                    <span key={c} style={{fontSize:8, letterSpacing:1.5, background:"rgba(201,168,76,0.07)",
                      border:`1px solid rgba(201,168,76,0.15)`, color:"rgba(201,168,76,0.6)",
                      padding:"2px 6px", borderRadius:2}}>
                      {c}
                    </span>
                  ))}
                </div>
                <div style={{marginTop:10, fontSize:10, color:"rgba(201,168,76,0.5)", letterSpacing:1}}>
                  {SL.viewCard}
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20, fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.3)", textAlign:"center"}}>
            {UI[lang].pipeline}
          </div>
        </div>
        );
      }

      default: return null;
    }
  };

  // ── TIMELINE DRAG ────────────────────────────────────────────────────────
  const dragRef = { isDown: false, startX: 0, scrollLeft: 0 };
  const onMouseDown = (e) => {
    dragRef.isDown = true;
    dragRef.startX = e.pageX - e.currentTarget.offsetLeft;
    dragRef.scrollLeft = e.currentTarget.scrollLeft;
    e.currentTarget.style.cursor = "grabbing";
  };
  const onMouseUp = (e) => { dragRef.isDown = false; e.currentTarget.style.cursor = "grab"; };
  const onMouseMove = (e) => {
    if (!dragRef.isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    e.currentTarget.scrollLeft = dragRef.scrollLeft - (x - dragRef.startX) * 1.5;
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={GS.app}>
      <style>{`
        @keyframes tabFadeArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 0.9; transform: translateX(4px); }
        }
        nav::-webkit-scrollbar { display: none; }
      `}</style>
      <div style={GS.topBar} />

      {/* BACK TO SHELF */}
      <div style={{ padding: "14px 24px 0" }}>
        <button onClick={onBack} style={{
          fontFamily: "'Georgia',serif", fontSize: 11, letterSpacing: 2, color: "rgba(201,168,76,0.7)",
          background: "none", border: "none", cursor: "pointer", padding: 0,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(201,168,76,0.7)"; }}>
          {UI[lang].backToShelf}
        </button>
      </div>

      {/* HEADER */}
      <header style={GS.header}>
        <div style={GS.eyebrow}>{UI[lang].eyebrow}</div>
        <div style={GS.h1}>{bookData ? (bookData.titulo[lang] || bookData.titulo.es).toUpperCase() : "GÉNESIS"}</div>
        <div style={GS.hebrew}>{bookData ? bookData.tituloOriginal : "בְּרֵאשִׁית"}</div>
        <p style={GS.subline}>
          <em>{bookData ? bookData.transliteracion : "Bereshit"}</em>
          {" — "}
          {bookData ? (bookData.significado[lang] || bookData.significado.es) : UI[lang].subline.split(" — ")[1]}
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:"14px 24px", maxWidth:780, margin:"0 auto", textAlign:"left", padding:"0 20px" }}>
          {UI[lang].metaLabels.map((label, i) => {
            const values = [
              bookData ? `${bookData.tituloOriginal} · ${bookData.transliteracion}` : "בְּרֵאשִׁית · Bereshit",
              bookData ? `${typeof bookData.autor.nombre === "object" ? (bookData.autor.nombre[lang] || bookData.autor.nombre.es) : bookData.autor.nombre} · ${UI[lang].traditional}` : `Moisés · ${UI[lang].traditional}`,
              bookData ? (bookData.año.display[lang] || bookData.año.display.es).replace(/^.*?:\s*/, "") : "c. 1445–1405 a.C.",
              `${divisionName || (bookData ? bookData.division : "Pentateuco")} · ${UI[lang].canonEntry(bookData ? bookData.ordenCanon : 1)}`,
              bookData ? (bookData.escritoEn[lang] || bookData.escritoEn.es) : "Hebreo Bíblico Clásico",
              "NBLA · ESV · NAA",
            ];
            return (
              <div key={label} style={{ borderLeft:`2px solid rgba(201,168,76,0.3)`, paddingLeft:12 }}>
                <div style={{ fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.55)", marginBottom:4, textTransform:"uppercase" }}>{label}</div>
                <div style={{ fontSize:14, color:PARCHMENT, lineHeight:1.4 }}>{values[i]}</div>
              </div>
            );
          })}
        </div>
      </header>

      {/* ERA LEGEND */}
      <div style={GS.eraLegend}>
        {chapterEras.map((e, i) => (
          <div key={e.color + i} style={GS.eraDot}>
            <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}} />
            {hasBookEras ? eraToLabel(e.era) : UI[lang].eraLabels[i]}
          </div>
        ))}
      </div>

      {/* ── BOOK INFO PANEL ── */}
      <div style={GS.infoPanel}>
        <div style={GS.tabNavWrap}>
          <nav style={GS.tabNav}>
            {TABS.map((t, i) => (
              <button key={t.id} style={GS.tabBtn(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
                {UI[lang].tabs[i]}
              </button>
            ))}
          </nav>
          <div style={GS.tabNavFade}>
            <span style={{ fontSize:16, color:"rgba(201,168,76,0.5)", animation:"tabFadeArrow 1.5s ease-in-out infinite" }}>›</span>
          </div>
        </div>
        <div style={GS.tabPanels}>
          {renderTab()}
        </div>
      </div>

      <div style={{textAlign:"center", padding:"14px 20px 4px", fontSize:13, color:"rgba(242,232,208,0.4)", fontStyle:"italic", letterSpacing:1}}>
        {UI[lang].hint}
      </div>

      {/* ── TIMELINE ── */}
      <div style={GS.timelineWrap} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
        <div style={GS.timelineInner}>

          {/* ERA BANDS */}
          {chapterEras.map((era, i) => {
            const x1 = xOf(era.from);
            const x2 = xOf(era.to + 1);
            return (
              <div key={i} style={{ position:"absolute", top:0, left: x1, width: x2-x1, height:"100%",
                background:`linear-gradient(90deg,${era.color}10,${era.color}1e)`,
                borderRight:"1px dashed rgba(201,168,76,0.1)" }}>
                <span style={{position:"absolute",top:10,left:10,fontSize:13,letterSpacing:2,color:`${era.color}99`,whiteSpace:"nowrap"}}>
                  {hasBookEras ? eraToLabel(era.era) : era.label}
                </span>
              </div>
            );
          })}

          {/* SPINE */}
          <div style={GS.spine} />

          {/* CHAPTER DOTS */}
          {chapters.map(d => {
            const bookEnName = bookData?.titulo?.en || "Genesis";
            const url = `https://www.biblegateway.com/passage/?search=${bookEnName}+${d.ch}&version=${BIBLE_VERSION[lang] || 'NBLA'}`;
            return (
            <div key={d.ch}
              style={{ position:"absolute", top:"50%", left: xOf(d.ch), transform:"translate(-50%,-50%)",
                display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", zIndex:5 }}
              onMouseEnter={(e) => setTooltip({ data: d, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setTooltip(null)}
              onClick={(e) => { e.stopPropagation(); window.open(url, "_blank", "noopener,noreferrer"); }}
            >
              <div style={{
                width:48, height:48, borderRadius:"50%",
                border:`2px solid ${d.color}`,
                background: LAPIS_DEEP,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 0 10px ${d.color}40`,
                transition:"transform 0.15s, box-shadow 0.15s",
              }}>
                <span style={{
                  fontSize:13, fontWeight:700, color:d.color,
                  fontFamily:"'Georgia',serif", lineHeight:1,
                }}>
                  {d.ch}
                </span>
              </div>
            </div>
            );
          })}

          {/* CHARACTER NODES */}
          {characters.map(c => {
            const x = xOf(c.xCh);
            const isAbove = c.side === "above";
            const stemH = 55;
            return (
              <div key={c.id} onClick={() => setActiveChar(c)}
                onMouseEnter={(e) => setCharTooltip({ char: c, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setCharTooltip(null)}
                style={{ position:"absolute", left: x-36, top: isAbove ? "auto" : "50%", bottom: isAbove ? "50%" : "auto",
                  display:"flex", flexDirection: isAbove ? "column" : "column-reverse", alignItems:"center",
                  cursor:"pointer", zIndex:10 }}>
                {/* name label — transparent, directly adjacent to circle */}
                <div style={{ padding:"2px 8px" }}>
                  <div style={{
                    fontSize:18, fontWeight:600, letterSpacing:0.5,
                    color:c.color, textAlign:"center", whiteSpace:"nowrap",
                    fontFamily:"'Georgia',serif",
                  }}>
                    {c.name}
                  </div>
                </div>
                {/* avatar circle */}
                <div style={{
                  width:72, height:72, borderRadius:"50%",
                  border:`2px solid ${c.color}`,
                  background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.1))`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, fontWeight:700, color:c.color,
                  boxShadow:`0 4px 16px rgba(0,0,0,0.5), 0 0 0 3px ${c.color}20`,
                  flexShrink:0,
                }}>
                  {c.init}
                </div>
                {/* stem */}
                <div style={{ width:1, height:stemH, background: isAbove
                  ? `linear-gradient(180deg,${c.color}80,${c.color}20)`
                  : `linear-gradient(180deg,${c.color}20,${c.color}80)` }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* CHAPTER TOOLTIP */}
      {tooltip && (
        <div style={{ ...GS.chTooltip, left: Math.min(tooltip.x + 12, window.innerWidth - 300), top: tooltip.y - 120 }}>
          <div style={GS.chTooltipCh}>GÉNESIS {tooltip.data.ch}</div>
          <div style={GS.chTooltipTitle}>{tooltip.data.title}</div>
          <div style={GS.chTooltipDesc}>{tooltip.data.desc}</div>
          <VerseLink lang={lang} style={{fontSize:9, letterSpacing:2}}>{tooltip.data.verse}</VerseLink>
        </div>
      )}

      {/* CHARACTER HOVER TOOLTIP */}
      {charTooltip && (
        <div style={{
          ...GS.chTooltip,
          left: Math.min(charTooltip.x + 16, window.innerWidth - 320),
          top: charTooltip.y - 140,
          maxWidth: 300,
          borderColor: `${charTooltip.char.color}60`,
        }}>
          <div style={{
            display:"flex", alignItems:"center", gap:10, marginBottom:10,
            paddingBottom:8, borderBottom:`1px solid rgba(201,168,76,0.15)`,
          }}>
            <div style={{
              width:32, height:32, borderRadius:"50%", flexShrink:0,
              border:`1px solid ${charTooltip.char.color}`,
              background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.1))`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700, color:charTooltip.char.color,
            }}>
              {charTooltip.char.init}
            </div>
            <div>
              <div style={{fontSize:9, letterSpacing:3, color:charTooltip.char.color, marginBottom:2}}>
                {charTooltip.char.badge}
              </div>
              <div style={{fontSize:15, fontWeight:700, color:PARCHMENT}}>
                {charTooltip.char.name}
              </div>
            </div>
          </div>
          <div style={{fontSize:13, lineHeight:1.65, color:"rgba(242,232,208,0.78)", fontStyle:"italic"}}>
            {lv(charTooltip.char.desc)}
          </div>
          <div style={{marginTop:10, fontSize:10, letterSpacing:2, color:"rgba(201,168,76,0.45)"}}>
            {UI[lang].characterLabels.bioHint(charTooltip.char.ch[0], charTooltip.char.ch[1], bookAb)}
          </div>
        </div>
      )}

      {/* CHARACTER POPUP */}
      {activeChar && (
        <div style={GS.overlay(!!activeChar)} onClick={(e)=>{if(e.target===e.currentTarget)setActiveChar(null)}}>
          <div style={GS.popupCard}>
            <button style={GS.closeBtn} onClick={()=>setActiveChar(null)}>✕</button>

            <div style={GS.popupHeader}>
              <div style={GS.popupAvatar(activeChar.color)}>{activeChar.init}</div>
              <div style={{flex:1}}>
                <div style={GS.popupBadge(activeChar.color)}>{activeChar.badge}</div>
                <div style={GS.popupName}>{activeChar.name}</div>
                <div style={GS.popupChapters(activeChar.color)}>
                  {activeChar.heb}{" \u00b7 "}{bookAb} {activeChar.ch[0]}–{activeChar.ch[1]}
                </div>
                <div style={GS.popupDesc}>{lv(activeChar.desc)}</div>
              </div>
            </div>

            <div style={GS.popupBody}>
              {[
                [UI[lang].characterLabels.actions,    activeChar.actions,    "text"],
                [UI[lang].characterLabels.theological, activeChar.theology,  "text"],
                [UI[lang].characterLabels.typeShadow,  activeChar.christType,"banner"],
                [UI[lang].characterLabels.inNT,        activeChar.ntRefs,    "nt"],
              ].map(([title, content, type]) => (
                <div key={title}>
                  <div style={GS.popupSectionTitle}>✦ {title}</div>
                  {type === "text" && <div style={GS.popupText}>{lv(content)}</div>}
                  {type === "banner" && <div style={GS.typeBanner}><div style={{...GS.popupText,fontStyle:"italic"}}>{lv(content)}</div></div>}
                  {type === "nt" && <div style={GS.ntBox}>{lv(content)}</div>}
                </div>
              ))}
              <div style={GS.popupSectionTitle}>✦ {UI[lang].characterLabels.keyVerses}</div>
              <div style={GS.versChips}>
                {activeChar.verses.map(v => (
                  <a key={v} href={vu(v)} target="_blank" rel="noopener noreferrer"
                    style={{...GS.versChip, textDecoration:"none", display:"inline-block",
                      cursor: vu(v) ? "pointer" : "default"}}>
                    {v}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOURCE POPUP */}
      {activeSource && (
        <div style={GS.overlay(!!activeSource)} onClick={(e)=>{if(e.target===e.currentTarget)setActiveSource(null)}}>
          <div style={{...GS.popupCard, maxWidth:680}}>
            <button style={GS.closeBtn} onClick={()=>setActiveSource(null)}>✕</button>

            {/* Header */}
            <div style={{padding:"28px 28px 20px", borderBottom:`1px solid rgba(201,168,76,0.2)`}}>
              <div style={{display:"flex", alignItems:"flex-start", gap:18}}>
                <div style={{
                  width:56, height:56, borderRadius:3, flexShrink:0,
                  background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.12))`,
                  border:`1px solid rgba(201,168,76,0.4)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22, color:GOLD,
                }}>
                  ✦
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.55)", marginBottom:4}}>{activeSource.tier} · {activeSource.meta}</div>
                  <div style={{fontSize:22, fontWeight:700, color:PARCHMENT, lineHeight:1.2, marginBottom:4}}>{activeSource.title}</div>
                  <div style={{fontSize:15, fontStyle:"italic", color:"rgba(242,232,208,0.7)"}}>{activeSource.author}</div>
                </div>
              </div>
              {/* Campo tags */}
              <div style={{display:"flex", flexWrap:"wrap", gap:6, marginTop:14}}>
                {activeSource.campos.map(c => (
                  <span key={c} style={{fontSize:9, letterSpacing:2, background:"rgba(201,168,76,0.1)",
                    border:`1px solid rgba(201,168,76,0.3)`, color:GOLD,
                    padding:"3px 9px", borderRadius:2}}>{c}</span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={{padding:"20px 28px 28px", overflowY:"auto", maxHeight:"60vh"}}>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ {UI[lang].sourcesLabels.aboutAuthor}</div>
                <div style={GS.popupText}>{activeSource.popup.bio}</div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ {UI[lang].sourcesLabels.method}</div>
                <div style={GS.popupText}>{activeSource.popup.metodo}</div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ {UI[lang].sourcesLabels.contribution}</div>
                <div style={{...GS.typeBanner}}>
                  <div style={{...GS.popupText, fontStyle:"italic"}}>{activeSource.popup.aportacion}</div>
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ {UI[lang].sourcesLabels.mainWorks}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {activeSource.popup.obras.map((o, i) => (
                    <div key={i} style={{display:"flex", gap:10, alignItems:"flex-start"}}>
                      <span style={{color:GOLD, fontSize:10, flexShrink:0, marginTop:3}}>◆</span>
                      <span style={{fontSize:14, color:"rgba(242,232,208,0.78)", lineHeight:1.5}}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a href={activeSource.popup.url} target="_blank" rel="noopener noreferrer" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:2,
                color:GOLD, textDecoration:"none",
                border:`1px solid rgba(201,168,76,0.3)`, padding:"8px 16px",
                borderRadius:2, background:"rgba(201,168,76,0.06)",
              }}>
                {UI[lang].sourcesLabels.viewFull}
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// ── MAIN COMPONENT — OPEN BOOK ────────────────────────────────────────────────

const OT_DIVISIONS = DIVISIONS.filter(d => d.testamento === "Antiguo");
const NT_DIVISIONS = DIVISIONS.filter(d => d.testamento === "Nuevo");
const OT_BOOKS = BOOKS.filter(b => b.id <= 39);
const NT_BOOKS = BOOKS.filter(b => b.id >= 40);

export default function CanonShelf() {
  const [view, setView] = useState({ mode: "index" }); // {mode:"index"} | {mode:"division", id} | {mode:"book", id}
  const [manifest, setManifest] = useState(null);
  const [bookDataCache, setBookDataCache] = useState({});
  const [globalData, setGlobalData] = useState(null);
  const [personasDisplay, setPersonasDisplay] = useState({});
  const [lang, setLang] = useState("es"); // "es" | "en" | "pt"

  useEffect(() => {
    fetch("/data/books-manifest.json").then(r => r.json()).then(setManifest).catch(() => {});
    fetch("/data/canon-global.json").then(r => r.json()).then(setGlobalData).catch(() => {});
    fetch("/data/personas-display.json").then(r => r.json()).then(setPersonasDisplay).catch(() => {});
  }, []);

  // Normalize manifest data to the shape this component expects, using the active lang
  const activeBooks = manifest
    ? manifest.libros.map(l => adaptManifestBook(l))
    : BOOKS;

  const activeDivisions = manifest
    ? manifest.divisiones.map(d => {
        const divBooks = d.libros.map(id => {
          const l = manifest.libros.find(b => b.id === id);
          return { es: l.titulo[lang] || l.titulo.es, en: l.titulo.en, razon: l.razon[lang] || l.razon.es, id: l.id, ready: l.disponible, div: l.division };
        });
        // derive rango from first+last book name in active lang (no manifest change needed)
        const first = manifest.libros.find(b => b.id === d.libros[0]);
        const last  = manifest.libros.find(b => b.id === d.libros[d.libros.length - 1]);
        const rango = first.id === last.id
          ? (first.titulo[lang] || first.titulo.es)
          : `${first.titulo[lang] || first.titulo.es} – ${last.titulo[lang] || last.titulo.es}`;
        return {
          ...d,
          titulo: d.nombre[lang] || d.nombre.es,
          tagline: d.tagline[lang] || d.tagline.es,
          resumen: d.resumen[lang] || d.resumen.es,
          fondoHistorico: d.fondoHistorico[lang] || d.fondoHistorico.es,
          porQueAgrupados: d.porQueAgrupados[lang] || d.porQueAgrupados.es,
          epocaPacto: d.epocaPacto[lang] || d.epocaPacto.es,
          enfoqueCristologico: d.enfoqueCristologico[lang] || d.enfoqueCristologico.es,
          distintivaReformada: d.distintivaReformada[lang] || d.distintivaReformada.es,
          rango,
          libros: divBooks,
        };
      })
    : DIVISIONS;

  const activeDivById = Object.fromEntries(activeDivisions.map(d => [d.id, d]));
  const activeOTBooks = activeBooks.filter(b => b.id <= 39);
  const activeNTBooks = activeBooks.filter(b => b.id >= 40);
  const activeOTDivisions = activeDivisions.filter(d => d.testamento === "Antiguo");
  const activeNTDivisions = activeDivisions.filter(d => d.testamento === "Nuevo");

  const openDivision = (id) => { setView({ mode: "division", id }); };
  const openBook = (book) => {
    if (book.ready) {
      setView({ mode: "book", id: book.id });
      // Always look up dataFile from the authoritative activeBooks list — callers
      // like DivisionTour pass partial objects that may not include dataFile.
      const fullBook = activeBooks.find(b => b.id === book.id);
      const dataFile = fullBook?.dataFile;
      if (dataFile && !bookDataCache[book.id]) {
        fetch(`/data/${dataFile}`)
          .then(r => r.json())
          .then(data => setBookDataCache(prev => ({ ...prev, [book.id]: data })))
          .catch(() => {});
      }
    } else openDivision(book.div);
  };
  const goIndex = () => setView({ mode: "index" });

  const GRID_COLS = 4;
  const renderRail = (books, side) => {
    // Split into GRID_COLS independent column arrays (still column-major: each
    // column is one consecutive run of the canon). Each column renders as its
    // OWN flex stack — not a shared CSS Grid — so one column's tallest tab can
    // never force every other column in that row to match its height. The
    // split itself is HEIGHT-balanced (not equal-count): an equal-count split
    // could land both "1 Tesalonicenses" and "2 Tesalonicenses" in the same
    // column, making it ~1220px tall while a neighboring column of short names
    // ran only ~660px — most of that column's space going to waste. Balancing
    // by total height instead keeps every column close to the same length,
    // packing the rail as densely as a consecutive-run constraint allows.
    const heights = books.map((b) => tabCellHeight(b[lang] || b.es));
    const columns = balancedContiguousSplit(books, heights, GRID_COLS);
    return (
      <nav style={S.tabRail(side)}>
        <div style={S.railHeader}>
          <div style={S.railTitle}>{side === "left" ? UI[lang].ot : UI[lang].nt}</div>
          <div style={S.railSub}>{UI[lang].books(books.length)}</div>
        </div>
        <div style={S.tabColumns}>
          {columns.map((col, ci) => (
            <div key={ci} style={S.tabColumn}>
              {col.map((b) => {
                const d = activeDivById[b.div] || DIV_BY_ID[b.div];
                const isActiveBook = view.mode === "book" && view.id === b.id;
                const isActiveDiv = view.mode === "division" && view.id === b.div;
                const active = isActiveBook || isActiveDiv;
                return (
                  <button
                    key={b.id}
                    style={S.stepTab(d.color, active, tabCellHeight(b[lang] || b.es))}
                    onClick={() => openBook(b)}
                    title={b[lang] || b.es}
                  >
                    <span style={S.stepTabLabel(active, true)}>{b[lang] || b.es}</span>
                    {b.ready && <span style={S.readyDot} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
    );
  };

  const activeBookId = view.mode === "book" ? view.id : null;
  const activeBook = activeBookId ? activeBooks.find(b => b.id === activeBookId) : null;
  const isBookOpen = activeBook && activeBook.ready;
  const activeBookData = activeBook ? (bookDataCache[activeBook.id] || null) : null;

  const u = UI[lang];
  let headerSubtitle = u.headerIndex;
  if (view.mode === "division") {
    const d = activeDivById[view.id];
    headerSubtitle = u.headerDiv(d.titulo, d.rango);
  } else if (view.mode === "book" && activeBook) {
    headerSubtitle = u.headerBook(activeBook[lang] || activeBook.es);
  }

  return (
    <div style={S.outer}>
      <div style={S.topBar} />
      <div style={S.appHeader}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <div style={S.appTitle}>{u.appTitle}</div>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {["es", "en", "pt"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "4px 10px", borderRadius: 3, fontSize: 12, fontWeight: 700, letterSpacing: 1,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'Georgia',serif",
                background: lang === l ? GOLD : "transparent",
                color: lang === l ? LAPIS_DEEP : "rgba(201,168,76,0.55)",
                border: `1px solid ${lang === l ? GOLD : "rgba(201,168,76,0.3)"}`,
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div style={S.headerInstruction}>{headerSubtitle}</div>
      </div>
      <div style={S.bookFrame}>
        <div style={S.book}>
          {!isBookOpen && renderRail(activeOTBooks, "left")}

          {!isBookOpen && <div style={S.gutterShadowLeft} />}
          {!isBookOpen && <div style={S.gutterShadowRight} />}
          {!isBookOpen && <div style={S.gutterLine} />}

          <div style={S.pages}>
            {isBookOpen ? (
              <GenesisFullViewer onBack={goIndex} bookData={activeBookData} globalData={globalData} personasDisplay={personasDisplay} lang={lang}
                divisionName={
                  (() => {
                    const divId = activeBook?.div;
                    const d = activeDivById[divId];
                    if (!d) return "";
                    return lang === "en" ? (d.tituloEn || d.titulo) : lang === "pt" ? (d.tituloPt || d.titulo) : d.titulo;
                  })()
                } />
            ) : view.mode === "index" ? (
              <>
                <div style={S.page}>
                  <IndexPage divisions={activeOTDivisions} onSelect={openDivision} side="left" lang={lang} />
                </div>
                <div style={S.page}>
                  <IndexPage divisions={activeNTDivisions} onSelect={openDivision} side="right" lang={lang} />
                </div>
              </>
            ) : view.mode === "division" ? (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <DivisionTour division={activeDivById[view.id]} onSelectBook={openBook} onBack={goIndex} lang={lang} />
                </div>
              </div>
            ) : (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <button style={S.backLink} onClick={() => openDivision(activeBook.div)}>← {activeDivById[activeBook.div]?.titulo}</button>
                  <div style={S.comingSoon}>
                    <div style={S.comingSoonTitle}>{UI[lang].comingSoon(activeBook[lang] || activeBook.es)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isBookOpen && renderRail(activeNTBooks, "right")}
        </div>
      </div>
      <div style={S.mobileNote}>{UI[lang].footer}</div>
    </div>
  );
}

// ── INDEX PAGE (cover spread — classification cards) ────────────────────────

function IndexPage({ divisions, onSelect, side, lang = "es" }) {
  const u = UI[lang];
  return (
    <div>
      <div style={S.spreadEyebrowBig}>{side === "left" ? u.ot_label : u.nt_label}</div>
      <div style={S.classGrid}>
        {divisions.map(d => (
          <div
            key={d.id}
            style={S.classCard(d.color)}
            onClick={() => onSelect(d.id)}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,42,74,0.7)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(27,42,74,0.42)"; }}
          >
            <div style={S.classCardEyebrow(d.color)}>{d.rango}</div>
            <div style={S.classCardTitle}>{d.titulo}</div>
            <div style={S.classCardBlurb}>{d.tagline}</div>
            <div style={S.classCardMeta}>{u.cardBooks(d.libros.length)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DIVISION TOUR (full page — replaces the spread) ──────────────────────────

function DivisionTour({ division: d, onSelectBook, onBack, lang = "es" }) {
  const lv = (t) => linkifyVerses(t, lang);
  const u = UI[lang];
  const [ov, hi, why, cov, chr, ref, kv, books] = u.divSections;
  return (
    <div>
      <button style={S.backLink} onClick={onBack}>{u.backToCanon}</button>

      <div style={S.divEyebrow(d.color)}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, display: "inline-block" }} />
        {d.testamento === "Antiguo" ? u.ot_label : u.nt_label} · {d.libros.length} {d.libros.length === 1 ? u.book_s : u.book_p}
      </div>
      <div style={S.divH1}>{d.titulo}</div>
      <div style={S.divRange}>{d.rango}</div>
      <div style={S.divTagline}>{d.tagline}</div>

      <div style={S.sectionLabel(d.color)}>{ov}</div>
      <div style={S.prose}>{lv(d.resumen)}</div>

      <div style={S.sectionLabel(d.color)}>{hi}</div>
      <div style={S.prose}>{lv(d.fondoHistorico)}</div>

      <div style={S.sectionLabel(d.color)}>{why}</div>
      <div style={S.prose}>{lv(d.porQueAgrupados)}</div>

      <div style={S.calloutGrid}>
        <div style={S.callout}>
          <div style={S.calloutLabel}>{cov}</div>
          <div style={S.calloutText}>{lv(d.epocaPacto)}</div>
        </div>
        <div style={S.callout}>
          <div style={S.calloutLabel}>{chr}</div>
          <div style={S.calloutText}>{lv(d.enfoqueCristologico)}</div>
        </div>
      </div>

      <div style={S.sienna}>
        <div style={S.siennaLabel}>{ref}</div>
        <div style={S.siennaText}>{lv(d.distintivaReformada)}</div>
      </div>

      <div style={S.verseBox}>
        <div style={S.verseRef}>{kv}</div>
        <VerseLink lang={lang} style={{ fontSize: 16 }}>{d.versiculoClave}</VerseLink>
      </div>

      <div style={S.sectionLabel(d.color)}>{books}</div>
      <div style={S.bookGrid}>
        {d.libros.map(libro => {
          const ready = libro.ready;
          return (
            <div
              key={libro.es}
              style={S.bookCard(d.color)}
              onClick={() => onSelectBook(libro)}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,42,74,0.65)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(27,42,74,0.4)"; }}
            >
              <div style={S.bookCardTitle}>
                {libro.es}
                {ready && <span style={S.bookCardBadge}>{u.see}</span>}
              </div>
              <div style={S.bookCardReason}>{lv(libro.razon)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
