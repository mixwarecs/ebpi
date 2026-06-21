import { useState } from "react";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#E8C56A";
const LAPIS = "#1B2A4A";
const LAPIS_DEEP = "#0F1A30";
const PARCHMENT = "#F2E8D0";
const SIENNA = "#8B3A2A";

// ── BIBLE GATEWAY LINK HELPER ─────────────────────────────────────────────────

const BOOK_MAP = {
  "Gn": "Genesis", "Gén": "Genesis", "Génesis": "Genesis",
  "Ex": "Exodus", "Éx": "Exodus", "Éxodo": "Exodus",
  "Lv": "Leviticus", "Lev": "Leviticus", "Levítico": "Leviticus",
  "Nm": "Numbers", "Núm": "Numbers", "Números": "Numbers",
  "Dt": "Deuteronomy", "Deut": "Deuteronomy", "Deuteronomio": "Deuteronomy",
  "Jos": "Joshua", "Josué": "Joshua",
  "Jue": "Judges", "Jueces": "Judges",
  "Rt": "Ruth", "Rut": "Ruth",
  "1S": "1Samuel", "1Sa": "1Samuel", "1 Samuel": "1Samuel",
  "2S": "2Samuel", "2Sa": "2Samuel", "2 Samuel": "2Samuel",
  "1R": "1Kings", "1Re": "1Kings", "1 Reyes": "1Kings",
  "2R": "2Kings", "2Re": "2Kings", "2 Reyes": "2Kings",
  "1Cr": "1Chronicles", "1 Crónicas": "1Chronicles",
  "2Cr": "2Chronicles", "2 Crónicas": "2Chronicles",
  "Esd": "Ezra", "Esdras": "Ezra",
  "Neh": "Nehemiah", "Nehemías": "Nehemiah",
  "Est": "Esther", "Ester": "Esther",
  "Job": "Job",
  "Sal": "Psalms", "Salmo": "Psalms", "Salmos": "Psalms",
  "Pr": "Proverbs", "Prov": "Proverbs", "Proverbios": "Proverbs",
  "Ec": "Ecclesiastes", "Ecl": "Ecclesiastes", "Eclesiastés": "Ecclesiastes",
  "Cnt": "Song+of+Songs", "Cantares": "Song+of+Songs",
  "Is": "Isaiah", "Isa": "Isaiah", "Isaías": "Isaiah",
  "Jer": "Jeremiah", "Jeremías": "Jeremiah",
  "Lm": "Lamentations", "Lam": "Lamentations", "Lamentaciones": "Lamentations",
  "Ez": "Ezekiel", "Ezequiel": "Ezekiel",
  "Dn": "Daniel", "Dan": "Daniel", "Daniel": "Daniel",
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
  "Lc": "Luke", "Lk": "Luke", "Lucas": "Luke",
  "Jn": "John", "Juan": "John",
  "Hch": "Acts", "Hechos": "Acts",
  "Ro": "Romans", "Rom": "Romans", "Romanos": "Romans",
  "1Co": "1Corinthians", "1Cor": "1Corinthians", "1 Corintios": "1Corinthians",
  "2Co": "2Corinthians", "2Cor": "2Corinthians", "2 Corintios": "2Corinthians",
  "Gá": "Galatians", "Gal": "Galatians", "Gálatas": "Galatians",
  "Ef": "Ephesians", "Efesios": "Ephesians",
  "Fil": "Philippians", "Filipenses": "Philippians",
  "Col": "Colossians", "Colosenses": "Colossians",
  "1Ts": "1Thessalonians", "1 Tesalonicenses": "1Thessalonians",
  "2Ts": "2Thessalonians", "2 Tesalonicenses": "2Thessalonians",
  "1Ti": "1Timothy", "1Tm": "1Timothy", "1 Timoteo": "1Timothy",
  "2Ti": "2Timothy", "2Tm": "2Timothy", "2 Timoteo": "2Timothy",
  "Tit": "Titus", "Tito": "Titus",
  "Flm": "Philemon", "Filemón": "Philemon",
  "He": "Hebrews", "Heb": "Hebrews", "Hebreos": "Hebrews",
  "Stg": "James", "Santiago": "James",
  "1P": "1Peter", "1Pe": "1Peter", "1 Pedro": "1Peter",
  "2P": "2Peter", "2Pe": "2Peter", "2 Pedro": "2Peter",
  "1Jn": "1John", "1 Juan": "1John",
  "2Jn": "2John", "2 Juan": "2John",
  "3Jn": "3John", "3 Juan": "3John",
  "Jud": "Jude", "Judas": "Jude",
  "Ap": "Revelation", "Apoc": "Revelation", "Apocalipsis": "Revelation",
};

function verseUrl(ref) {
  if (!ref) return null;
  const clean = ref.trim().split("—")[0].trim();
  const m = clean.match(/^(\d?[A-ZÁÉÍÓÚÑa-záéíóúñ]+)\s+(\d+:\d+(?:[–\-]\d+)?)/);
  if (!m) return null;
  const abbrev = m[1];
  const passage = m[2].replace("–", "-");
  const bookEn = BOOK_MAP[abbrev] || null;
  if (!bookEn) return null;
  const search = `${bookEn} ${passage}`.replace(/ /g, "+");
  return `https://www.biblegateway.com/passage/?search=${search}&version=NBLA`;
}

function linkifyVerses(text) {
  if (!text) return text;
  const VERSE_PATTERN = /(\(?)(\d?[A-ZÁÉÍÓÚa-záéíóú]+\s+\d+:\d+(?:[–\-]\d+)?)(\)?)/g;
  const parts = [];
  let last = 0;
  let m;
  while ((m = VERSE_PATTERN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const pre = m[1];
    const ref = m[2];
    const post = m[3];
    if (pre) parts.push(pre);
    const url = verseUrl(ref);
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

function VerseLink({ children, style = {} }) {
  const url = verseUrl(children);
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
const TABS = [
  { id: "overview",  label: "VISIÓN GENERAL" },
  { id: "theology",  label: "TEOLOGÍA" },
  { id: "purpose",   label: "PROPÓSITO" },
  { id: "canon",     label: "CONTEXTO CANÓNICO" },
  { id: "history",   label: "CONTEXTO HISTÓRICO" },
  { id: "verses",    label: "VERSÍCULOS CLAVE" },
  { id: "sources",   label: "FUENTES" },
];

const KEY_VERSES = [
  {
    ref: "Gn 1:1",
    text: "En el principio creó Dios los cielos y la tierra.",
    note: "La declaración más audaz de la Escritura. Refuta el ateísmo, el dualismo y el politeísmo del ANE en una sola cláusula. Juan 1:1 lo cita para identificar al Logos eterno con el acto creador.",
  },
  {
    ref: "Gn 1:26–27",
    text: "Entonces dijo Dios: Hagamos al hombre a nuestra imagen, conforme a nuestra semejanza.",
    note: "Fundamento de la dignidad humana: el hombre es imago Dei. El plural 'hagamos' apunta a la Trinidad. La imagen de Dios distingue al ser humano de toda otra criatura.",
  },
  {
    ref: "Gn 3:15",
    text: "Pondré enemistad entre tú y la mujer, y entre tu simiente y la simiente suya; ésta te herirá en la cabeza, y tú le herirás en el calcañar.",
    note: "El protoevangelio — la primera promesa del evangelio en la Escritura. La simiente de la mujer que aplasta la cabeza de la serpiente es Jesucristo (Gá 3:16; Ap 12:9).",
  },
  {
    ref: "Gn 12:2–3",
    text: "Haré de ti una nación grande… y serán benditas en ti todas las familias de la tierra.",
    note: "La promesa tripartita abrahámica: tierra, simiente y bendición universal. Pablo la cita en Gá 3:8 como 'el evangelio anunciado de antemano a Abraham'.",
  },
  {
    ref: "Gn 15:6",
    text: "Y creyó él a Jehová, y le fue contado por justicia.",
    note: "El versículo sobre justificación más citado del AT en el NT. Pablo lo usa tres veces (Ro 4:3; Gá 3:6; Ro 4:22) para demostrar que la justificación ha sido siempre por fe sola.",
  },
  {
    ref: "Gn 50:20",
    text: "Ustedes pensaron hacerme mal, pero Dios lo pensó para bien, para preservar la vida de mucho pueblo.",
    note: "La declaración más clara de la providencia soberana en el AT. Prefigura la cruz: los hombres crucificaron a Cristo; Dios lo ordenó para salvación (Hch 2:23).",
  },
];

const SOURCES = [
  {
    tier: "NIVEL 1", title: "ESV Study Bible", author: "Crossway Editors",
    meta: "Crossway · 2008 · EN", year: 2008, lang: "EN",
    campos: ["Introducción", "Resúmenes", "Teología", "Tipología"],
    popup: {
      bio: "Biblia de estudio académica producida por más de 50 eruditos evangélicos conservadores bajo la dirección editorial de Wayne Grudem y J.I. Packer. Publicada por Crossway en 2008, es la biblia de estudio de referencia estándar en el mundo evangélico angloparlante.",
      metodo: "Combina traducción literal (ESV) con notas exegéticas extensas, ensayos introductorios por libro, mapas, gráficos y artículos temáticos. Las notas reflejan teología reformada y complementaria sin comprometer el rigor académico.",
      aportacion: "Para el CANON Pipeline, provee los fundamentos de cada campo del registro: estructura literaria, autoría, datación, teología sistemática por libro, y resúmenes capítulo a capítulo. Es la fuente Nivel 1 más citada en todos los campos.",
      obras: ["ESV Study Bible (2008)", "ESV Reader's Bible (2016)"],
      url: "https://www.crossway.org/bibles/esv-study-bible-case/"
    }
  },
  {
    tier: "NIVEL 1", title: "Reformation Study Bible", author: "R.C. Sproul (ed.)",
    meta: "Ligonier Ministries · 2015 · EN", year: 2015, lang: "EN",
    campos: ["Teología Reformada", "WCF", "Distinctivas", "Pacto"],
    popup: {
      bio: "R.C. Sproul (1939–2017) fue uno de los teólogos reformados más influyentes del siglo XX, fundador de Ligonier Ministries y autor de más de 100 libros. Su Reformation Study Bible reúne a más de 75 eruditos reformados para producir la biblia de estudio más comprehensiva desde una perspectiva calvinista.",
      metodo: "Usa la traducción NKJV (inglés) con notas exegéticas que privilegian sistemáticamente la teología del pacto, la hermenéutica reformada y los estándares de Westminster. Cada libro incluye introducción, notas versículo a versículo y secciones de teología bíblica.",
      aportacion: "Es la fuente primaria para las distinctivas reformadas, las áncoras de la Confesión de Westminster y la interpretación pactual de cada libro. Define el tono teológico de todo el CANON Pipeline.",
      obras: ["Reformation Study Bible (2015)", "The Holiness of God (1985)", "Chosen by God (1986)", "Ligonier Teaching Series"],
      url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/"
    }
  },
  {
    tier: "NIVEL 1", title: "Biblia de Estudio de la Reforma (NBLA)", author: "Ligonier Ministries",
    meta: "B&H Español · 2020 · ES", year: 2020, lang: "ES",
    campos: ["Todos los campos en español", "Notas teológicas ES"],
    popup: {
      bio: "Edición en español de la Reformation Study Bible, traducida y adaptada para el mundo hispanohablante. Usa la Nueva Biblia de las Américas (NBLA) como texto base — la traducción al español más precisa y literal disponible hoy, producida por la Fundación Bíblica Lockman.",
      metodo: "Traduce y adapta las notas de la Reformation Study Bible al español con terminología teológica precisa. La NBLA como texto base es traducción de equivalencia formal (palabra por palabra) desde los textos hebreo, arameo y griego.",
      aportacion: "Es la fuente española de referencia para todos los campos trilingües del CANON Pipeline. Define el texto bíblico en español (campo 'es') para todos los 66 libros.",
      obras: ["Biblia de Estudio de la Reforma NBLA (2020)", "Nueva Biblia de las Américas — NBLA (2005)"],
      url: "https://bhespanol.com/products/biblia-de-estudio-de-la-reforma-nbla"
    }
  },
  {
    tier: "NIVEL 2", title: "Systematic Theology", author: "Wayne Grudem",
    meta: "Zondervan · 1994 · EN", year: 1994, lang: "EN",
    campos: ["Teología Sistemática", "Creación", "Imagen de Dios", "Pacto", "Elección"],
    popup: {
      bio: "Wayne Grudem (n. 1948) es Profesor Emérito de Teología Bíblica y Sistemática en Phoenix Seminary. Su Systematic Theology (1994) es el manual de teología sistemática reformado-evangélica más usado en seminarios del mundo anglohablante, con más de 600,000 copias vendidas.",
      metodo: "Organiza la teología en 57 categorías desde la Bibliología hasta la Escatología. Para cada doctrina presenta: definición, base bíblica exhaustiva, historia de la doctrina, desacuerdos con otras tradiciones y aplicación práctica. Accesible sin sacrificar rigor.",
      aportacion: "Provee el vocabulario controlado de teología sistemática para el campo 'teologiaSistematica' del CANON Pipeline. Las categorías del pipeline (Creación, Antropología, Hamartiología, etc.) siguen la estructura de Grudem.",
      obras: ["Systematic Theology (1994, 2nd ed. 2020)", "Bible Doctrine (1999)", "Christian Ethics (2018)", "Politics According to the Bible (2010)"],
      url: "https://zondervanacademic.com/products/systematic-theology-second-edition"
    }
  },
  {
    tier: "NIVEL 2", title: "Biblical Theology", author: "Geerhardus Vos",
    meta: "Banner of Truth · 1948/1975 · EN", year: 1948, lang: "EN",
    campos: ["Historia Redentora", "Tipología", "Enfoque Cristológico", "Épocas"],
    popup: {
      bio: "Geerhardus Vos (1862–1949) fue teólogo reformado holandés-americano, Profesor de Teología Bíblica en Princeton Seminary (1893–1932). Llamado 'el padre de la Teología Bíblica Reformada', fue maestro de J. Gresham Machen, John Murray y Cornelius Van Til. Su obra maestra fue publicada en 1948, un año antes de su muerte.",
      metodo: "Vos define la Teología Bíblica como 'la rama de la teología exegética que estudia el proceso de la auto-revelación de Dios depositada en la Biblia'. Su método traza la revelación progresiva de Dios a través de épocas históricas sucesivas (Adámico → Noáico → Abrahánico → Mosaico → Profético → Cumplimiento), mostrando cómo cada etapa anticipa y prefigura a Cristo.",
      aportacion: "Es la fuente definitiva para el campo 'historiaRedentora' del pipeline: las épocas redentoras, el 'enfoqueCristologico' por libro, y los 'tiposYSombras'. Su método de leer el AT cristocéntricamente define la hermenéutica de todo el CANON Pipeline.",
      obras: ["Biblical Theology: OT & NT (1948)", "Redemptive History and Biblical Interpretation (1980)", "The Pauline Eschatology (1930)", "The Teaching of Jesus on the Kingdom of God (1903)"],
      url: "https://theopedia.com/geerhardus-vos"
    }
  },
  {
    tier: "NIVEL 2", title: "A History of Israel", author: "John Bright",
    meta: "Westminster John Knox · 1959/2000 · EN", year: 1959, lang: "EN",
    campos: ["Contexto Histórico", "Biografía Histórica", "Arqueología"],
    popup: {
      bio: "John Bright (1908–1995) fue Profesor de Hebreo y del Antiguo Testamento en Union Theological Seminary de Virginia. Su A History of Israel (1959, 4ª ed. 2000) es considerada la historia del Antiguo Israel más influyente del siglo XX en el mundo anglohablante, equilibrando rigor histórico con fe bíblica.",
      metodo: "Integra evidencia arqueológica, textos del Antiguo Oriente Próximo y fuentes bíblicas para reconstruir la historia de Israel desde los orígenes patriarcales hasta el período helenístico. Bright defiende la historicidad sustancial de los relatos bíblicos frente al escepticismo de la escuela de Alt-Noth.",
      aportacion: "Provee el contexto histórico y arqueológico para el campo 'contextoHistorico' del pipeline y los sub-campos 'biografiaHistorica' de los personajes. Es la fuente estándar para situar cada libro en su período histórico.",
      obras: ["A History of Israel (1959, 4ª ed. 2000)", "The Kingdom of God (1953)", "Jeremiah — Anchor Bible Commentary (1965)"],
      url: "https://www.wjkbooks.com/Products/0664220681/a-history-of-israel.aspx"
    }
  },
  {
    tier: "NIVEL 2", title: "Ancient Egypt and the Old Testament", author: "John Currid",
    meta: "Baker Books · 1997 · EN", year: 1997, lang: "EN",
    campos: ["Contexto Egipcio", "ANE", "Pentateuco"],
    popup: {
      bio: "John Currid es Profesor de Antiguo Testamento en Reformed Theological Seminary (Charlotte). Especialista en Egipto antiguo y su relación con el Antiguo Testamento, con doctorado de la Universidad de Chicago y trabajo de campo en excavaciones egipcias.",
      metodo: "Examina cómo el trasfondo cultural, religioso y político de Egipto ilumina los textos del Pentateuco. A diferencia de aproximaciones que postulan dependencia bíblica de fuentes egipcias, Currid demuestra que el texto bíblico subvierte e invierte conscientemente los motivos culturales egipcios para proclamar la superioridad de YHWH.",
      aportacion: "Es la fuente primaria para el contexto egipcio de Génesis (relato de José), Éxodo, Levítico y Números. Provee los datos del campo 'fuentesANE' relacionados con Egipto y el campo 'arqueologia' para el Pentateuco.",
      obras: ["Ancient Egypt and the Old Testament (1997)", "A Study Commentary on Genesis (2003)", "A Study Commentary on Exodus (2000)", "Against the Gods: The Polemical Theology of the Old Testament (2013)"],
      url: "https://www.bakerpublishinggroup.com/books/ancient-egypt-and-the-old-testament/280019"
    }
  },
  {
    tier: "NIVEL 2", title: "Genesis — NICOT", author: "Victor P. Hamilton",
    meta: "Eerdmans · 1990/1995 · EN", year: 1990, lang: "EN",
    campos: ["Exégesis", "Personajes", "Estructura Literaria"],
    popup: {
      bio: "Victor P. Hamilton es Profesor Emérito de Religión y Filosofía en Asbury University. Su comentario en dos volúmenes sobre Génesis en la serie New International Commentary on the Old Testament (NICOT) es considerado el comentario académico evangélico estándar sobre el libro.",
      metodo: "Combina exégesis del texto hebreo con análisis literario, trasfondo del Antiguo Oriente Próximo e interpretación teológica. La serie NICOT es producida por eruditos que afirman la autoridad e inerrancia de la Escritura mientras aplican las mejores herramientas de la exégesis académica.",
      aportacion: "Provee la exégesis detallada para las biografías bíblicas de los personajes, el análisis de la estructura literaria (toledot) y los paralelos con el ANE en el campo 'contextoHistorico'. Es la fuente de referencia para el análisis versículo a versículo de Génesis.",
      obras: ["The Book of Genesis, Chapters 1–17 — NICOT (1990)", "The Book of Genesis, Chapters 18–50 — NICOT (1995)", "Handbook on the Pentateuch (1982)"],
      url: "https://www.eerdmans.com/Products/0790/the-book-of-genesis-chapters-118.aspx"
    }
  },
];

const TYPES_SHADOWS = [
  "Adán como tipo del segundo Adán, Cristo (Ro 5:14; 1Co 15:45–49)",
  "El árbol de la vida como tipo del Cristo que da vida eterna (Ap 2:7; 22:2)",
  "Las túnicas de piel de Gn 3:21 como tipo de la expiación sustitutiva en Cristo",
  "El arca de Noé como tipo de Cristo, único refugio del juicio (1Pe 3:20–21)",
  "El carnero en lugar de Isaac como tipo del Cordero de Dios (Gn 22:8; Jn 1:29)",
  "Melquisedec como tipo de Cristo, sacerdote-rey eterno (Gn 14:18–20; He 7:1–28)",
  "La escalera de Jacob como tipo de Cristo, único mediador (Gn 28:12; Jn 1:51)",
  "José como tipo de Cristo: rechazado, humillado, exaltado para salvar (Gn 37–50; Hch 7:9–14)",
];

const WCF_ANCHORS = [
  {
    cap: "Cap. 4",
    titulo: "De la Creación",
    doctrinas: ["Creación", "Antropología"],
    resumen: "Dios el Padre, el Hijo y el Espíritu Santo crearon de la nada el mundo y todo lo que hay en él en el espacio de seis días, y todo era bueno en gran manera. Creó al hombre varón y hembra, con almas racionales e inmortales, a su propia imagen: con conocimiento, justicia y santidad verdaderas.",
    genesis: ["Gn 1:1", "Gn 1:26–27", "Gn 1:31", "Gn 2:7"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-4",
  },
  {
    cap: "Cap. 6",
    titulo: "De la Caída del Hombre",
    doctrinas: ["Hamartiología"],
    resumen: "Nuestros primeros padres, seducidos por la astucia de Satanás, pecaron al comer del fruto prohibido. Por este pecado cayeron de su rectitud original y perdieron su comunión con Dios. De ellos descendió la muerte y la corrupción a toda la humanidad, siendo todos pecadores por naturaleza desde la concepción.",
    genesis: ["Gn 3:1–7", "Gn 3:16–19", "Gn 6:5"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-6",
  },
  {
    cap: "Cap. 7",
    titulo: "Del Pacto de Dios con el Hombre",
    doctrinas: ["Pacto", "Soteriología"],
    resumen: "Dios estableció con Adán un pacto de obras, prometiendo vida bajo condición de perfecta obediencia. Tras la caída, Dios se agradó de hacer un segundo pacto: el pacto de gracia, ofreciendo vida y salvación por Jesucristo. Este pacto fue administrado bajo el AT por promesas, profecías y sacrificios, y bajo el NT por la predicación y los sacramentos.",
    genesis: ["Gn 2:15–17", "Gn 15:9–18", "Gn 17:1–8"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-7",
  },
  {
    cap: "Cap. 3",
    titulo: "Del Decreto Eterno de Dios",
    doctrinas: ["Elección"],
    resumen: "Dios, desde la eternidad, por el sapientísimo y santísimo consejo de su propia voluntad, ordenó libremente todo lo que ocurre. Predestinó a ciertos hombres y ángeles a vida eterna. Esta predestinación no se basa en la fe prevista sino en el soberano beneplácito divino, para la manifestación de su gloria.",
    genesis: ["Gn 21:12", "Gn 25:23"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-3",
  },
  {
    cap: "Cap. 5",
    titulo: "De la Providencia",
    doctrinas: ["Providencia"],
    resumen: "Dios el gran Creador sostiene, dirige, dispone y gobierna a todas las criaturas, acciones y cosas, por su providencia sapientísima y santísima, según su infalible presciencia y el libre e inmutable consejo de su propia voluntad. Dios puede servirse incluso del mal para sus fines santos, sin ser autor del pecado.",
    genesis: ["Gn 45:5–8", "Gn 50:20"],
    url: "https://es.ligonier.org/recursos/credos-confesiones/la-confesion-de-fe-de-westminster/#capitulo-5",
  },
];

const THEOLOGY_TAGS = [
  "Creación","Antropología","Hamartiología","Pacto","Elección",
  "Soteriología","Providencia","Cristología","Teología Propia","Angelología",
];

const SYSTEMATIC_THEOLOGY = [
  {
    categoria: "Creación",
    resumen: "Génesis establece la doctrina de la creación ex nihilo: Dios crea el universo de la nada por su palabra todopoderosa (Gn 1:1). La creación es buena en su totalidad ('muy bueno', Gn 1:31) y tiene un fin redentor. El ser humano es la corona de la creación, hecho a imagen de Dios (imago Dei) con dominio delegado sobre la tierra.",
    pasajes: [
      { ref: "Gn 1:1",    nota: "Creación absoluta de la nada — fundamento de la soberanía divina." },
      { ref: "Gn 1:26–27", nota: "El hombre como imago Dei, corona y representante de Dios en la creación." },
      { ref: "Gn 1:31",   nota: "La bondad original e integral de la creación antes de la caída." },
      { ref: "Gn 2:1–3",  nota: "El sábado de Dios como patrón de descanso y adoración." },
      { ref: "Gn 2:7",    nota: "El hombre formado del polvo: dualidad de materialidad y aliento divino." },
    ],
  },
  {
    categoria: "Antropología",
    resumen: "Génesis establece la naturaleza del ser humano: creado a imagen de Dios (Gn 1:26–27), dotado del mandato cultural (Gn 1:28), unidad de cuerpo y alma (Gn 2:7), relacionalidad constitutiva ('no es bueno que el hombre esté solo'), y el matrimonio como institución pre-caída (Gn 2:24). Tras la caída la imagen queda distorsionada pero no destruida (Gn 9:6).",
    pasajes: [
      { ref: "Gn 1:26–28", nota: "Imago Dei y mandato cultural: el hombre como virrey de Dios sobre la creación." },
      { ref: "Gn 2:7",    nota: "Dualidad cuerpo-alma: el hombre como ser encarnado animado por Dios." },
      { ref: "Gn 2:18",   nota: "La socialidad como constitutivo: el ser humano no puede florecer en aislamiento." },
      { ref: "Gn 2:24",   nota: "El matrimonio como institución divina pre-caída: un hombre y una mujer, una sola carne." },
      { ref: "Gn 9:6",    nota: "La imagen de Dios persiste tras la caída y es fundamento de la ética." },
    ],
  },
  {
    categoria: "Hamartiología",
    resumen: "Génesis 3 es el texto fundacional de la doctrina del pecado. La tentación opera mediante la duda de la Palabra, la negación del juicio divino y la promesa de autonomía ('seréis como Dios'). El pecado entra por desobediencia voluntaria de Adán como cabeza federal, produciendo vergüenza, ocultamiento, culpa, ruptura relacional y muerte. La maldad se expande progresivamente (Gn 6:5) hasta el juicio del diluvio.",
    pasajes: [
      { ref: "Gn 3:1–7",   nota: "La estructura tripartita de la tentación: duda, negación, deseo; la caída como autonomía contra Dios." },
      { ref: "Gn 3:16–19", nota: "Las consecuencias del pecado: dolor, trabajo penoso, conflicto relacional, muerte física." },
      { ref: "Gn 4:7",     nota: "El pecado como poder que domina y ante el que se debe resistir." },
      { ref: "Gn 6:5",     nota: "Depravación total: 'todo designio de los pensamientos de su corazón era de continuo solamente el mal'." },
      { ref: "Gn 8:21",    nota: "La persistencia del pecado incluso tras el juicio: el corazón del hombre es malo desde su juventud." },
    ],
  },
  {
    categoria: "Pacto",
    resumen: "Génesis contiene tres pactos canónicos fundacionales: el Pacto Adámico (obras, Edén), el Pacto Noáico (con toda la creación, arco iris) y el Pacto Abrahánico (promesa tripartita de tierra, simiente y bendición, ratificado en Gn 15 y 17). Estos pactos forman la estructura vertebral de la historia redentora y anticipan el Nuevo Pacto en Cristo.",
    pasajes: [
      { ref: "Gn 2:15–17", nota: "El pacto de obras: obediencia perfecta a cambio de vida; desobediencia produce muerte." },
      { ref: "Gn 9:9–17",  nota: "El pacto noáico: universal, incondicional, señal visible del arco iris, fundamento del orden creacional." },
      { ref: "Gn 12:1–3",  nota: "La promesa tripartita abrahámica: tierra, simiente y bendición universal a todas las naciones." },
      { ref: "Gn 15:9–18", nota: "Ratificación formal: Dios solo pasa entre los animales, asumiendo unilateralmente las obligaciones del pacto." },
      { ref: "Gn 17:1–8",  nota: "El cambio de nombre a Abraham y la circuncisión como señal corporal del pacto." },
    ],
  },
  {
    categoria: "Elección",
    resumen: "Génesis es el libro más explícito del AT sobre la elección soberana e incondicional. Dios elige a Set, Sem, Abraham, Isaac sobre Ismael, y Jacob sobre Esaú — este último elegido antes de nacer y antes de haber hecho bien o mal (Gn 25:23). La elección no depende de méritos, primogenitura ni capacidad humana, sino únicamente del propósito soberano de Dios.",
    pasajes: [
      { ref: "Gn 12:1–3",  nota: "La elección soberana de Abraham de entre todos los pueblos, sin mérito previo declarado." },
      { ref: "Gn 18:19",   nota: "'Porque lo he conocido': la elección como base del conocimiento íntimo de Dios con su pueblo." },
      { ref: "Gn 21:12",   nota: "'En Isaac te será llamada descendencia': la línea del pacto pasa por el elegido, no el primogénito natural." },
      { ref: "Gn 25:23",   nota: "'El mayor servirá al menor': elección antes del nacimiento y de toda obra — fundamento de Ro 9:11–13." },
    ],
  },
  {
    categoria: "Soteriología",
    resumen: "El fundamento de la soteriología reformada aparece en Génesis: la justificación de Abraham por fe sin obras (Gn 15:6), anterior a la ley y a la circuncisión. Las túnicas de piel (Gn 3:21) son la primera señal de la expiación sustitutiva. El protoevangelio (Gn 3:15) es la primera promesa de salvación de toda la historia bíblica.",
    pasajes: [
      { ref: "Gn 3:15",    nota: "El protoevangelio: la primera promesa de la simiente que aplastará la cabeza de la serpiente." },
      { ref: "Gn 3:21",    nota: "Las túnicas de piel: primer sacrificio expiatorio en que Dios mismo cubre la vergüenza del pecador." },
      { ref: "Gn 15:6",    nota: "Justificación por fe sola, anterior a toda ley y circuncisión: paradigma paulino (Ro 4:3; Gá 3:6)." },
      { ref: "Gn 22:13–14", nota: "'En el monte de Jehová se proveerá': el carnero sustituto de Isaac como tipo de la expiación." },
    ],
  },
  {
    categoria: "Providencia",
    resumen: "La narrativa de José (Gn 37–50) es la demostración más detallada de la providencia divina en toda la Escritura. Dios gobierna cada contingencia — la envidia de los hermanos, la falsa acusación, el olvido del copero, los sueños de Faraón — para cumplir sus propósitos redentores. Gn 50:20 es la formulación más explícita de la providencia en el AT.",
    pasajes: [
      { ref: "Gn 28:15",   nota: "La promesa divina de acompañamiento y guía providencial a Jacob en su huida." },
      { ref: "Gn 45:5–8",  nota: "José reconoce que fue Dios, no sus hermanos, quien lo envió: providencia a través de actos pecaminosos." },
      { ref: "Gn 50:20",   nota: "'Vosotros pensasteis hacerme mal, pero Dios lo pensó para bien': decreto divino santo sobre intención humana maliciosa." },
    ],
  },
  {
    categoria: "Cristología",
    resumen: "Génesis presenta a Cristo implícitamente a través de tipos y sombras, y explícitamente en el protoevangelio (Gn 3:15). Cristo es la simiente prometida de la mujer, la simiente de Abraham en quien serán benditas todas las naciones, el Ángel de YHWH como teofanía pre-encarnada, y el segundo Adán prefigurado por el primero (Ro 5:14).",
    pasajes: [
      { ref: "Gn 3:15",    nota: "La simiente de la mujer: primera promesa cristológica explícita de toda la Escritura." },
      { ref: "Gn 12:3",    nota: "'En ti serán benditas todas las familias': promesa cumplida en Cristo (Gá 3:8,16)." },
      { ref: "Gn 14:18–20", nota: "Melquisedec, sacerdote-rey de Salem: tipo de Cristo como sumo sacerdote eterno (He 7)." },
      { ref: "Gn 22:8",    nota: "'Dios se proveerá de cordero': promesa cumplida en el Cordero de Dios (Jn 1:29)." },
      { ref: "Gn 49:10",   nota: "'No se apartará el cetro de Judá hasta que venga Siloh': profecía mesiánica directa." },
    ],
  },
  {
    categoria: "Teología Propia",
    resumen: "Génesis revela los atributos de Dios de manera narrativa: omnipotencia en la creación (Gn 1), omnisciencia ante Adán y Caín (Gn 3:9; 4:9), santidad que no tolera el pecado (Gn 3; 6; 19), misericordia soberana que provee redención antes del juicio (Gn 3:15,21), fidelidad al pacto a través de generaciones, e insinuación de la Trinidad ('hagamos', el Espíritu sobre las aguas).",
    pasajes: [
      { ref: "Gn 1:1–2",  nota: "Dios como Creador absoluto; el Espíritu como agente de la creación: insinuación trinitaria." },
      { ref: "Gn 1:26",   nota: "'Hagamos… a nuestra imagen': el plural como insinuación de la pluralidad divina." },
      { ref: "Gn 3:9",    nota: "'¿Dónde estás?': la omnisciencia que busca al pecador aunque conoce su ubicación." },
      { ref: "Gn 17:1",   nota: "El Todopoderoso (El Shaddai): Dios que puede cumplir lo humanamente imposible." },
      { ref: "Gn 18:14",  nota: "'¿Hay algo difícil para Dios?': la omnipotencia divina frente a la duda humana." },
    ],
  },
  {
    categoria: "Angelología",
    resumen: "Génesis introduce la angelología: los ángeles como mensajeros y ejecutores de la voluntad divina. El Ángel de YHWH aparece como figura singular que habla como Dios mismo (Gn 16:10,13; 22:11–12), lo que la tradición reformada interpreta como teofanía pre-encarnada del Hijo. Los querubines guardan el Edén (Gn 3:24). Los ángeles ejecutan el juicio sobre Sodoma (Gn 19).",
    pasajes: [
      { ref: "Gn 3:24",    nota: "Los querubines como guardianes del orden sagrado: el acceso a Dios requiere mediación y purificación." },
      { ref: "Gn 16:7–13", nota: "El Ángel de YHWH identificado con YHWH mismo: prefiguración del Hijo encarnado." },
      { ref: "Gn 19:1",    nota: "Los ángeles como ejecutores del juicio divino sobre Sodoma y Gomorra." },
      { ref: "Gn 22:11–12", nota: "El Ángel de YHWH detiene el sacrificio de Isaac: intervención directa del Hijo preencarnado." },
      { ref: "Gn 28:12",   nota: "La escalera de Jacob: ángeles mediadores entre el cielo y la tierra, tipo de Cristo (Jn 1:51)." },
    ],
  },
];

const CANON_EPOCHS = [
  { label: "ÉPOCAS 1–2", title: "Creación y Caída → Promesa", books: "Génesis 1–50", highlight: true },
  { label: "ÉPOCA 3",    title: "Ley",                         books: "Éxodo · Levítico · Números · Dt", highlight: false },
  { label: "ÉPOCA 4",    title: "Anticipación Profética",      books: "Josué → Malaquías", highlight: false },
  { label: "ÉPOCA 5",    title: "Cumplimiento",                books: "Evangelios · Hechos", highlight: false },
  { label: "ÉPOCA 6",    title: "Aplicación",                  books: "Epístolas Paulinas y Generales", highlight: false },
  { label: "ÉPOCA 7",    title: "Consumación",                 books: "Apocalipsis", highlight: false },
];

// ── HISTORICAL CONTEXT DATA ───────────────────────────────────────────────────

const HIST_PERIODO = "Prehistórico/Primordial (Gn 1–11) → Bronce Medio (c. 2000–1550 a.C.) para los relatos patriarcales (Gn 12–50). Período caracterizado por migraciones amorritas, ciudades-estado cananeas y el auge del comercio interregional entre Mesopotamia, Canaán y Egipto.";

const HIST_GEOGRAFIA = [
  { lugar: "Ur de los Caldeos", moderna: "Tell el-Muqayyar, sur de Irak", desc: "Ciudad natal de Abraham. Centro urbano sumero-acadio excavado por Leonard Woolley (1922–1934): escritura cuneiforme, matemáticas avanzadas y monumentales zigurats. Abraham proviene de este ambiente de alta cultura pagana." },
  { lugar: "Harán", moderna: "Harran, Şanlıurfa, Turquía", desc: "Punto de partida del llamado de Abraham (Gn 12:1). Cruce de rutas comerciales entre Mesopotamia y el Mediterráneo. El culto a Sin (dios luna) era central allí." },
  { lugar: "Canaán", moderna: "Israel, Palestina, sur del Líbano y Siria", desc: "La tierra prometida (Gn 12:5–7; 15:18–21). Mosaico de ciudades-estado en el Bronce Medio: Siquem, Hebrón, Betel, Beerseba. Cultura material bien documentada arqueológicamente." },
  { lugar: "Egipto", moderna: "República Árabe de Egipto", desc: "Potencia dominante del corredor siro-cananeo. Aparece en tres momentos: viaje de Abraham (Gn 12), ascenso de José (Gn 37–41) y asentamiento de Israel en Gosén (Gn 46–47)." },
  { lugar: "Sodoma y Gomorra", moderna: "Posiblemente Tall el-Hammam, Jordania (debatido)", desc: "Ciudades destruidas por juicio divino (Gn 19). Tall el-Hammam muestra evidencia de destrucción catastrófica repentina en el Bronce Medio Tardío, incluyendo temperaturas extremas consistentes con un impacto cósmico (Collins, 2018)." },
  { lugar: "Macpela / Hebrón", moderna: "Hebrón, Cisjordania — Cueva de los Patriarcas", desc: "Primera propiedad comprada por Abraham en Canaán (Gn 23). Uno de los pocos sitios patriarcales con continuidad arqueológica e histórica ininterrumpida hasta hoy." },
];

const HIST_CIVILIZACIONES = [
  { nombre: "Sumerios y Acadios", rol: "Trasfondo cultural de Ur y Harán", desc: "Su cosmología (Enuma Elish), relatos de diluvio (Epopeya de Gilgamesh) y código legal (Hammurabi) proveen el contexto que Génesis subvierte. Ampliamente documentados en textos cuneiformes." },
  { nombre: "Cananeos", rol: "Habitantes pre-israelitas de la tierra prometida", desc: "Abraham, Isaac y Jacob conviven y negocian con ellos. Su religión politeísta (Baal, Asera) está documentada en los archivos de Ugarit (c. 1400–1200 a.C.)." },
  { nombre: "Egipcios", rol: "Potencia dominante del contexto de José e Israel", desc: "Los más documentados del mundo antiguo. Papiros y textos administrativos del Bronce Medio confirman los detalles del relato de José: títulos, sistema de graneros, embalsamamiento, caravanas." },
  { nombre: "Hicsos", rol: "Explican el ascenso de un semita como José al poder en Egipto", desc: "Gobernantes semitas del Bajo Egipto c. 1650–1550 a.C. Documentados en las excavaciones de Avaris (Tell el-Dab\u02bca, Manfred Bietak). Cultura material semita hallada in situ." },
];

const HIST_ANE = [
  { nombre: "Enuma Elish", origen: "Babilonia, c. 1100 a.C.", desc: "Cosmogonía babilónica. Paralelos con Gn 1 en el orden de creación, pero radicalmente distinta: creación por batalla violenta entre dioses politeístas vs. creación soberana y pacífica del único Dios. Génesis subvierte, no deriva." },
  { nombre: "Epopeya de Gilgamesh (Tablilla XI)", origen: "Nínive, c. 700 a.C. (tradición sumeria c. 2100 a.C.)", desc: "Relato de diluvio con paralelos a Noé: hombre justo advertido, gran barco, animales, envío de aves, montaña, sacrificio. Diferencia clave: en Gilgamesh el diluvio es caprichoso, el superviviente se deifica, no hay pacto. En Génesis es juicio moral y gracia." },
  { nombre: "Textos de Nuzi", origen: "Nuzi, Iraq, c. 1500–1350 a.C.", desc: "~4.000 tablillas que confirman prácticas patriarcales: venta de primogenitura, adopción de siervos como herederos, esposas estériles dando siervas al marido. Confirman directamente Gn 15–16; 21; 30." },
  { nombre: "Archivos de Mari", origen: "Tell Hariri, Siria, c. 1800–1750 a.C.", desc: "~25.000 tablillas sobre la cultura amorreo-semita nómada del Bronce Medio. Nombres propios similares a los patriarcales (Benjamin, Jacob). Las migraciones documentadas son el tipo exacto de movimiento de Abraham." },
  { nombre: "Tablillas de Ebla", origen: "Tell Mardikh, Siria, c. 2400–2300 a.C.", desc: "~17.000 tablillas. Mencionan ciudades del Valle del Jordán con nombres que corresponden a Sodoma, Gomorra y las otras ciudades de Gn 14:2, en contexto comercial." },
];

const HIST_CRONOLOGIA = [
  { evento: "Nacimiento de Abram", fecha: "c. 2166 a.C.", ref: "Gn 11:26" },
  { evento: "Llamado de Abraham (75 años)", fecha: "c. 2091 a.C.", ref: "Gn 12:1-4" },
  { evento: "Nacimiento de Isaac", fecha: "c. 2066 a.C.", ref: "Gn 21:5" },
  { evento: "Nacimiento de Jacob y Esaú", fecha: "c. 2006 a.C.", ref: "Gn 25:26" },
  { evento: "José vendido a Egipto (17 años)", fecha: "c. 1897 a.C.", ref: "Gn 37:2" },
  { evento: "José ante Faraón (30 años)", fecha: "c. 1884 a.C.", ref: "Gn 41:46" },
  { evento: "Jacob desciende a Egipto (130 años)", fecha: "c. 1876 a.C.", ref: "Gn 47:9" },
  { evento: "Muerte de José (110 años)", fecha: "c. 1804 a.C.", ref: "Gn 50:26" },
];

const HIST_CONTROVERSIAS = "Las principales controversias: (1) Historicidad de Gn 1–11 — la tradición reformada los trata como historia real en género propio; la crítica moderna como 'mito etiológico'. (2) Datación patriarcal — Bronce Medio (posición reformada) vs. proyección retroactiva del período monárquico. (3) Extensión del diluvio — universal (posición reformada conservadora) vs. regional. (4) Identidad del faraón de José — el período hicso es el contexto más plausible pero no verificable con certeza. En todos los casos la tradición reformada mantiene la fiabilidad histórica del texto bíblico como primera autoridad.";

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

const CHARACTERS = [
  { id: "dios",     name: "Dios · YHWH",    heb: "יְהוָה", ch: [1,50],  xCh: 1,  side: "above", color: GOLD,      init: "יה",
    badge: "PROTAGONISTA ABSOLUTO",
    desc: "El Dios triuno, Creador soberano y redentor pactual. Actúa como el sujeto primario de toda acción narrativa: crea, juzga, promete, llama, bendice y preserva.",
    actions: "Crea el cosmos en seis días (Gn 1), establece el pacto adámico y el protoevangelio (Gn 3:15), destruye con el diluvio y hace pacto con Noé (Gn 9), llama y hace pacto con Abraham (Gn 12; 15; 17), prueba a Abraham en Moriah (Gn 22), renueva el pacto con Isaac y Jacob, y obra providencialmente a través de José (Gn 50:20).",
    theology: "Génesis revela a Dios como Creador soberano, Juez justo y Redentor misericordioso. Su elección soberana (Gn 25:23), su iniciativa en el pacto (Gn 15), y su providencia sobre el mal humano (Gn 50:20) son fundamentos del calvinismo y de la teología del pacto.",
    christType: "Dios es el antitipo de todos los tipos. El Padre que no retiene a su Hijo único (Gn 22:16; Ro 8:32). El Espíritu que se cierne sobre las aguas (Gn 1:2) anticipa su obra recreadora en el nuevo nacimiento.",
    ntRefs: "El Dios de Génesis es el Padre de nuestro Señor Jesucristo (2Co 1:3). Juan 1:1–3 conecta la creación con el Logos eterno. El Padre que 'no escatimó ni a su propio Hijo' (Ro 8:32) refleja Gn 22:16.",
    verses: ["Gn 1:1","Gn 3:15","Gn 12:1-3","Gn 15:6","Gn 50:20"] },

  { id: "adam",     name: "Adán",            heb: "אָדָם",   ch: [1,5],   xCh: 2,  side: "below", color: "#4A6741", init: "אד",
    badge: "TIPO DEL SEGUNDO ADÁN",
    desc: "El primer ser humano, creado a imagen de Dios, cabeza federal de toda la humanidad. Su desobediencia trajo la caída de toda la raza. Es tipo explícito de Cristo (Ro 5:14).",
    actions: "Creado del polvo (Gn 2:7), nombra los animales (Gn 2:20), recibe a Eva (Gn 2:22), desobedece el mandamiento (Gn 3:6), expulsado del Edén (Gn 3:23), engendra a Caín, Abel y Set.",
    theology: "Adán es la cabeza federal del pacto de obras (WCF Cap. 7). Su transgresión imputó culpa y corrupción a toda su descendencia (Ro 5:12–21). Como tipo, su fracaso establece la necesidad del segundo Adán.",
    christType: "Tipo explícito del segundo Adán (Ro 5:14; 1Co 15:45–49). Cristo cumple perfectamente lo que Adán falló en obedecer. 'Como en Adán todos mueren, también en Cristo todos serán vivificados' (1Co 15:22).",
    ntRefs: "Pablo lo interpreta en Ro 5:14 y 1Co 15:45. Lucas lo incluye en la genealogía de Cristo (Lc 3:38). La Reforma conecta la imputación del pecado de Adán con la imputación de la justicia de Cristo.",
    verses: ["Gn 1:26-27","Gn 2:7","Gn 3:6","Gn 3:15","Gn 3:21"] },

  { id: "eva",      name: "Eva",              heb: "חַוָּה",  ch: [2,4],   xCh: 4,  side: "above", color: "#4A6741", init: "חו",
    badge: "MADRE DE TODOS LOS VIVIENTES",
    desc: "La primera mujer, formada de la costilla de Adán. Madre de todos los vivientes (Gn 3:20). La promesa del protoevangelio le es dada directamente (Gn 3:15).",
    actions: "Creada de la costilla de Adán (Gn 2:22), tentada por la serpiente y come del fruto prohibido (Gn 3:6), recibe las consecuencias del pecado (Gn 3:16), engendra a Caín, Abel y Set.",
    theology: "Eva ilustra la dignidad de la mujer creada a imagen de Dios y la vulnerabilidad humana ante la tentación. La promesa de Gn 3:15 le es dada directamente: su simiente derrotará a la serpiente.",
    christType: "La promesa de Gn 3:15 es la primera promesa de Cristo — nacido de mujer (Gá 4:4), él es la simiente que aplasta la cabeza de la serpiente. Eva prefigura a María como 'la mujer' en el plan redentor.",
    ntRefs: "Pablo la menciona en 1Ti 2:13–14. La 'simiente de la mujer' (Gn 3:15) se cumple en Jesucristo, nacido de mujer (Gá 4:4). Apocalipsis 12 retoma la imagen de la mujer y la serpiente.",
    verses: ["Gn 2:22-23","Gn 3:6","Gn 3:15","Gn 3:20"] },

  { id: "noe",      name: "Noé",              heb: "נֹחַ",   ch: [5,9],   xCh: 7,  side: "below", color: SIENNA,    init: "נח",
    badge: "PREDICADOR DE JUSTICIA",
    desc: "El único hombre que halló gracia ante los ojos de Dios en su generación. Construyó el arca por fe y fue preservado del diluvio con toda su familia.",
    actions: "Recibe instrucción de construir el arca (Gn 6:14), entra con 7 personas y los animales (Gn 7), sale del arca y ofrece holocaustos (Gn 8:20), recibe el pacto noáico con el arco iris (Gn 9:11).",
    theology: "Noé es tipo de Cristo como el único remanente que preserva la vida a través del juicio. El diluvio tipifica el bautismo (1Pe 3:20–21). El arca es tipo de Cristo como único medio de salvación.",
    christType: "El arca es tipo de Cristo — el único medio de salvación en medio del juicio universal. Noé prefigura a Cristo como el que preserva la vida a través de la muerte y el juicio divino.",
    ntRefs: "Pedro lo llama 'predicador de justicia' (2Pe 2:5). El diluvio tipifica el bautismo (1Pe 3:20–21). Jesús compara su segunda venida con los días de Noé (Mt 24:37–38).",
    verses: ["Gn 6:8","Gn 6:22","Gn 7:1","Gn 8:20-21","Gn 9:11"] },

  { id: "abraham",  name: "Abraham",          heb: "אַבְרָהָם",ch:[12,25], xCh: 15, side: "above", color: "#1B5E8B", init: "אב",
    badge: "PADRE DE LA FE",
    desc: "Padre de la fe y de la nación hebrea. Llamado soberanamente por Dios desde Ur, recibe las promesas fundacionales del pacto abrahánico: tierra, simiente y bendición universal.",
    actions: "Llamado de Harán (Gn 12:1–4), separación de Lot (Gn 13), encuentro con Melquisedec (Gn 14), justificado por fe (Gn 15:6), circuncisión (Gn 17), intercesión por Sodoma (Gn 18), ofrenda de Isaac en Moriah (Gn 22).",
    theology: "Abraham es el fundamento humano del pacto de gracia. Su justificación por fe (Gn 15:6), citada en Ro 4 y Gá 3, demuestra que la salvación del AT y NT es la misma: sola fide. El pacto abrahánico es el eje de toda la historia redentora.",
    christType: "Prefigura a Dios el Padre en la ofrenda de Isaac: 'Como Abraham no retuvo a su único hijo' (Gn 22:16), así Dios no retuvo a su propio Hijo (Ro 8:32). El carnero sustituto prefigura la expiación.",
    ntRefs: "Pablo lo cita en Ro 4 y Gá 3 como paradigma de la justificación por fe. Jesús: 'Abraham se regocijó al ver mi día' (Jn 8:56). Hebreos 11:8–19 y Santiago 2:23: 'amigo de Dios'.",
    verses: ["Gn 12:1-3","Gn 15:6","Gn 17:1-8","Gn 22:15-18","Gn 25:7-8"] },

  { id: "sara",     name: "Sara",             heb: "שָׂרָה",  ch: [11,23], xCh: 19, side: "below", color: "#1B5E8B", init: "שר",
    badge: "MADRE DE LA PROMESA",
    desc: "Esposa de Abraham y madre de Isaac, el hijo de la promesa. Nacido cuando tenía 90 años, Isaac fue prueba del poder de Dios para cumplir lo imposible.",
    actions: "Viaja de Ur a Canaán con Abraham, presentada como hermana (Gn 12; 20), da a Agar a Abraham (Gn 16), ríe al escuchar la promesa (Gn 18:12), da a luz a Isaac a los 90 años (Gn 21:2), muere a los 127 años (Gn 23:1).",
    theology: "Sara representa la gracia soberana que da vida donde hay muerte. Su fe, aunque imperfecta, fue reconocida por Dios. Pablo la usa en Gá 4 como alegoría del pacto de gracia vs. el pacto de esclavitud.",
    christType: "Sara tipifica la Jerusalén celestial, la madre de los hijos de la promesa (Gá 4:26). Isaías llama a los creyentes a 'mirar a Sara que os dio a luz' como promesa de restauración (Is 51:2).",
    ntRefs: "Pedro la cita como modelo de fe y fortaleza (1Pe 3:6). Pablo la usa en Gá 4:22–31 como alegoría de la libertad del pacto de gracia. Hebreos 11:11 la incluye en el catálogo de la fe.",
    verses: ["Gn 17:15-16","Gn 18:12-14","Gn 21:1-7","Gn 23:1-2"] },

  { id: "isaac",    name: "Isaac",            heb: "יִצְחָק", ch: [21,27], xCh: 26, side: "above", color: "#6B4A8B", init: "יצ",
    badge: "HIJO DE LA PROMESA",
    desc: "Hijo de la promesa nacido de Sara a los 90 años. Su nombre significa 'risa'. Casi sacrificado en Moriah, su vida es el tipo más directo de Cristo en el Pentateuco.",
    actions: "Nacimiento sobrenatural (Gn 21:1–7), casi sacrificado en Moriah (Gn 22), recibe a Rebeca como esposa (Gn 24), engendra a Esaú y Jacob (Gn 25:24–26), renueva el pacto abrahánico (Gn 26), bendice a Jacob (Gn 27).",
    theology: "Isaac es el hijo de la promesa cuyo nacimiento depende enteramente de la gracia soberana. Su vida ilustra que la línea del pacto depende de la elección divina, no de la primogenitura natural.",
    christType: "Tipo más directo de Cristo: llevado al monte Moriah para ser sacrificado por su padre, cargó la leña (la cruz), fue obediente hasta la muerte, y fue 'devuelto' a Abraham (He 11:19). El carnero sustituto es el tipo de Cristo.",
    ntRefs: "Hebreos 11:17–19 presenta la ofrenda de Isaac como acto de fe en la resurrección. Pablo en Ro 9:7 y Gá 4:28 enfatiza que los hijos de la promesa son como Isaac. 'De entre los muertos lo levantó también, en sentido figurado' (He 11:19).",
    verses: ["Gn 21:2-3","Gn 22:1-14","Gn 25:21","Gn 26:24","Gn 27:27-29"] },

  { id: "jacob",    name: "Jacob · Israel",   heb: "יַעֲקֹב", ch: [25,50], xCh: 32, side: "below", color: "#8B6A1B", init: "יע",
    badge: "EL QUE LUCHÓ CON DIOS",
    desc: "Patriarca cuyo nombre es cambiado a Israel. A través de su carácter quebrantado y reformado por Dios, nace la nación de las doce tribus de Israel.",
    actions: "Compra la primogenitura de Esaú (Gn 25:33), engaña a Isaac (Gn 27), visión de la escalera en Betel (Gn 28), sirve a Labán 14 años por Raquel (Gn 29), lucha con Dios en Peniel y es renombrado Israel (Gn 32:28), desciende a Egipto con 70 personas (Gn 46).",
    theology: "Jacob es el paradigma de la gracia soberana e incondicional: Dios lo eligió mientras estaba en el vientre (Gn 25:23; Ro 9:11–13), antes de cualquier mérito. Su carácter defectuoso muestra que la elección no depende de las virtudes del elegido.",
    christType: "La escalera de Jacob (Gn 28:12) es interpretada por Cristo mismo como tipo de él: 'Verán el cielo abierto y a los ángeles de Dios que suben y descienden sobre el Hijo del Hombre' (Jn 1:51).",
    ntRefs: "Pablo cita la elección de Jacob sobre Esaú en Ro 9:11–13 como prueba de la elección soberana. Jesús interpreta la escalera de Betel en Jn 1:51. Hebreos 11:21 lo menciona por su fe al bendecir a los hijos de José.",
    verses: ["Gn 25:23","Gn 28:12-15","Gn 32:28","Gn 46:2-4","Gn 49:10"] },

  { id: "jose",     name: "José",             heb: "יוֹסֵף",  ch: [37,50], xCh: 41, side: "above", color: "#1B6B5E", init: "יס",
    badge: "TIPO DE CRISTO",
    desc: "Hijo undécimo de Jacob. La prefiguración tipológica de Cristo más desarrollada en Génesis: amado del padre, rechazado por sus hermanos, humillado, exaltado para salvar a muchos.",
    actions: "Recibe la túnica de colores (Gn 37:3), vendido a Egipto por 20 piezas de plata (Gn 37:28), fiel ante la tentación (Gn 39:9), encarcelado injustamente (Gn 39:20), exaltado a primer ministro (Gn 41:41), perdona a sus hermanos (Gn 45:1–15).",
    theology: "José es el tipo de Cristo más elaborado del AT antes de Isaías. Su declaración 'lo que ustedes pensaron hacerme mal, Dios lo pensó para bien' (Gn 50:20) es la expresión más clara de la providencia soberana en el AT.",
    christType: "Tipo de Cristo en 6 dimensiones: (1) Amado del padre enviado a sus hermanos (Jn 3:16); (2) Rechazado y vendido por plata (Mt 26:15); (3) Tentado sin pecar (He 4:15); (4) Condenado injustamente (Is 53); (5) Exaltado a la más alta autoridad (Fil 2:9–11); (6) Perdón de los que lo rechazaron (Ro 11:25–26).",
    ntRefs: "Esteban resume su vida en Hch 7:9–14. Hebreos 11:22 lo cita por su fe. La tipología José-Cristo es estructural en la hermenéutica reformada. Su perdón prefigura la gracia de Cristo hacia quienes lo rechazaron.",
    verses: ["Gn 37:28","Gn 39:9","Gn 41:41","Gn 45:5-8","Gn 50:20"] },
];

const CHAPTERS_INFO = Array.from({length: 50}, (_, i) => {
  const ch = i + 1;
  const titles = [
    "La Creación (Días 1–4)","Creación del Hombre y Eva","La Caída","Caín y Abel","Genealogía de Adán",
    "Corrupción Universal","El Diluvio Comienza","Las Aguas Bajan","Pacto Noáico","Las Naciones",
    "Torre de Babel","Llamado de Abraham","Abraham y Lot","Rescate de Lot · Melquisedec","El Pacto Formal",
    "Agar e Ismael","Circuncisión · Nuevo Nombre","Tres Visitantes · Intercesión","Destrucción de Sodoma","Abraham y Abimelec",
    "Nace Isaac · Expulsión de Agar","La Prueba de Abraham","Muerte de Sara","Rebeca para Isaac","Muerte de Abraham · Esaú y Jacob",
    "Pacto Renovado con Isaac","Jacob Usurpa la Bendición","Visión de la Escalera · Betel","Jacob y Labán · Lea y Raquel","Los Hijos de Jacob",
    "Jacob Huye de Labán","Jacob Lucha en Peniel","Reconciliación con Esaú","La Violación de Dina","Renovación en Betel · Muerte de Raquel",
    "Genealogía de Esaú","José Vendido","Judá y Tamar","José en Casa de Potifar","José Interpreta Sueños",
    "José Ante Faraón","Los Hermanos en Egipto","Segundo Viaje a Egipto","La Copa de Plata","José se Revela",
    "Familia Desciende a Egipto","Israel en Egipto","Bendición de Efraín y Manasés","Profecía de las Doce Tribus","Muerte de Jacob · Perdón Final"
  ];
  const descs = [
    "Dios crea la luz, el firmamento y la vegetación. 'En el principio creó Dios los cielos y la tierra.'",
    "Dios forma a Adán del polvo y a Eva de su costilla. El Edén y el pacto de obediencia son establecidos.",
    "La serpiente tienta a Eva. Adán y Eva pecan. Dios pronuncia el protoevangelio (Gn 3:15).",
    "Caín mata a su hermano Abel. Dios marca a Caín. Set nace como línea redentora.",
    "Diez generaciones de Adán a Noé. El estribillo 'y murió' declara el reinado de la muerte.",
    "La maldad del hombre es grande. Dios decide enviar el diluvio. Noé halla gracia ante Dios.",
    "Noé, su familia y los animales entran al arca. Las aguas cubren la tierra por cuarenta días.",
    "Dios recuerda a Noé. Las aguas receden. Noé envía la paloma. El arca descansa en Ararat.",
    "Dios establece el pacto con Noé: el arco iris como señal. 'No volveré a destruir la tierra con agua.'",
    "La tabla de las naciones registra los setenta pueblos descendientes de Sem, Cam y Jafet.",
    "Humanidad unida construye la torre. Dios confunde las lenguas y dispersa los pueblos.",
    "Dios llama a Abram con la promesa tripartita: tierra, simiente, bendición universal a todas las naciones.",
    "Abram y Lot se separan. Lot elige Sodoma. Dios renueva la promesa de tierra a Abram.",
    "Abraham rescata a Lot. Melquisedec, sacerdote-rey de Salem, lo bendice con pan y vino.",
    "Abram cree a Dios y le es contado por justicia. Dios formaliza el pacto en ceremonia solemne.",
    "Sara da a Agar a Abraham. Nace Ismael. El ángel de Dios promete bendecir a Ismael.",
    "Dios cambia el nombre de Abram a Abraham. Instituye la circuncisión. Promete a Isaac.",
    "Los tres visitantes anuncian el nacimiento de Isaac. Abraham intercede por Sodoma.",
    "Los ángeles sacan a Lot. Fuego y azufre destruyen Sodoma y Gomorra.",
    "Abraham presenta a Sara como su hermana ante Abimelec. Dios interviene para protegerla.",
    "Isaac nace de Sara. Agar e Ismael son expulsados pero Dios los guarda en el desierto.",
    "Dios ordena a Abraham ofrecer a Isaac en Moriah. Abraham obedece. Dios provee el carnero sustituto.",
    "Sara muere a los 127 años. Abraham compra la cueva de Macpela para sepultarla.",
    "El siervo de Abraham viaja a Mesopotamia. Dios guía providencialmente hasta Rebeca.",
    "Abraham muere a los 175 años. Nacen Esaú y Jacob. Esaú vende su primogenitura.",
    "Dios renueva el pacto abrahánico con Isaac en Berseba. Isaac prospera entre los filisteos.",
    "Jacob, guiado por Rebeca, engaña a Isaac ciego para recibir la bendición del primogénito.",
    "Jacob huye a Harán. En Betel sueña con la escalera al cielo y recibe la renovación del pacto.",
    "Jacob llega a Harán y se enamora de Raquel. Labán lo engaña y le da primero a Lea.",
    "Nacen los doce hijos de Jacob y nace José, hijo de Raquel. Dios bendice a Jacob.",
    "Jacob huye con su familia de Labán. Labán los alcanza pero Dios lo advierte. Hacen un pacto.",
    "Jacob lucha con el ángel de Dios y vence. Su nombre es cambiado a Israel.",
    "Esaú recibe a Jacob con abrazo y llanto. Los hermanos se reconcilian en Siquem.",
    "Siquem viola a Dina. Simeón y Leví vengan a su hermana matando a los varones de la ciudad.",
    "Dios renueva el pacto con Jacob en Betel. Raquel muere al nacer Benjamín. Muere Isaac.",
    "Los descendientes de Esaú y los reyes de Edom, fuera de la línea del pacto.",
    "Jacob ama a José más que a sus hermanos. Los sueños de José los provocan. Lo venden por 20 piezas de plata.",
    "Judá toma nuera a Tamar. Tamar engaña a Judá para tener descendencia. Nacen Fares y Zara.",
    "Dios prospera a José bajo Potifar. La esposa de Potifar lo acusa falsamente. José es encarcelado.",
    "José interpreta los sueños del copero y el panadero en prisión. El copero lo olvida dos años.",
    "José interpreta los sueños de Faraón. Faraón lo exalta a primer ministro de Egipto.",
    "Los hermanos de José van a Egipto. José los reconoce, los prueba y retiene a Simeón.",
    "Los hermanos regresan con Benjamín. José los recibe en su casa y come con ellos.",
    "José hace colocar su copa en el saco de Benjamín. Judá ofrece quedarse en su lugar.",
    "José llora y se revela a sus hermanos. Declara la providencia de Dios. Invita a toda la familia.",
    "Jacob y sus 70 descendientes descienden a Egipto. Dios confirma su presencia a Jacob.",
    "José presenta a su familia ante Faraón. Israel se establece en Gosén y prospera.",
    "Jacob bendice a los hijos de José cruzando sus manos para bendecir primero al menor.",
    "Jacob profetiza sobre las doce tribus. A Judá: 'No se apartará el cetro... hasta que venga Siloh.'",
    "Jacob es sepultado en Macpela. José declara: 'Dios lo pensó para bien.' José muere a los 110 años.",
  ];
  const verses = [
    "Gn 1:1","Gn 2:7","Gn 3:15","Gn 4:8","Gn 5:24","Gn 6:8","Gn 7:12","Gn 8:11","Gn 9:11","Gn 10:1",
    "Gn 11:7","Gn 12:2","Gn 13:15","Gn 14:18","Gn 15:6","Gn 16:11","Gn 17:5","Gn 18:10","Gn 19:24","Gn 20:6",
    "Gn 21:2","Gn 22:13","Gn 23:19","Gn 24:67","Gn 25:23","Gn 26:24","Gn 27:29","Gn 28:12","Gn 29:20","Gn 30:24",
    "Gn 31:49","Gn 32:28","Gn 33:4","Gn 34:25","Gn 35:10","Gn 36:1","Gn 37:28","Gn 38:26","Gn 39:9","Gn 40:8",
    "Gn 41:41","Gn 42:24","Gn 43:30","Gn 44:33","Gn 45:7","Gn 46:3","Gn 47:27","Gn 48:19","Gn 49:10","Gn 50:20",
  ];
  return { ch, color: chapterColor(ch), title: titles[i], desc: descs[i], verse: verses[i] };
});

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

function GenesisFullViewer({ onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeChar, setActiveChar] = useState(null);
  const [activeSource, setActiveSource] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [activeTheology, setActiveTheology] = useState(null);
  const [activeWcf, setActiveWcf] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null); // string key
  const [charTooltip, setCharTooltip] = useState(null); // { char, x, y }

  const TOTAL_W = 4200;
  const xOf = (ch) => ((ch - 0.5) / 50) * TOTAL_W;

  // ── TAB CONTENT ────────────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case "overview": return (
        <div>
          <div style={GS.prose}>
            Génesis es <strong style={{color:GOLD}}>el libro de los principios</strong>: el origen del cosmos, de la humanidad, del pecado y de la redención. Como primer libro del canon, provee los fundamentos absolutos de toda la teología bíblica. Sin Génesis, ningún otro libro del canon tiene fundamento narrativo ni teológico — es <strong style={{color:GOLD}}>la raíz de la que brota toda la historia redentora</strong>.
            <br/><br/>
            El libro se estructura en torno a diez secciones <em>toledot</em> («estas son las generaciones de...»), que funcionan como columnas vertebrales de la narrativa. La primera mitad (Gn 1–11) narra los orígenes universales: la creación, la caída, el diluvio y Babel. La segunda mitad (Gn 12–50) registra el origen del pueblo elegido a través de <strong style={{color:GOLD}}>los cuatro patriarcas: Abraham, Isaac, Jacob y José</strong>.
            <br/><br/>
            El arco narrativo corre desde «En el principio creó Dios los cielos y la tierra» ({linkifyVerses("Gn 1:1")}) hasta «José murió… y lo embalsamaron y lo pusieron en un ataúd en Egipto» ({linkifyVerses("Gn 50:26")}) — de la creación perfecta a la muerte en tierra extranjera, aguardando la promesa de retorno.
          </div>
        </div>
      );

      case "theology": {
        const activeCat = activeTheology || SYSTEMATIC_THEOLOGY[0];
        const DISTINCTIVAS = {
          "Creación": "La Reforma afirma la creación ex nihilo como fundamento de la soberanía absoluta de Dios, rechazando todo dualismo. El mandato cultural (Gn 1:28) es también base de la ética reformada del trabajo y la vocación.",
          "Antropología": "La Reforma enfatiza que tras la caída la imagen está corrompida pero no aniquilada (WCF 9.3), preservando la responsabilidad moral. La imago Dei es relacional y funcional, no sólo substancial.",
          "Hamartiología": "La Reforma afirma la depravación total: el pecado afecta todas las dimensiones del ser humano (intelecto, voluntad, emociones), incapacitándolo para buscar a Dios por sí mismo (WCF 6.4).",
          "Pacto": "La teología del pacto ve la historia bíblica como el desarrollo de un único pacto de gracia. El pacto de obras con Adán es la base para entender la obra de Cristo como segundo Adán que cumple perfectamente lo que Adán falló (WCF 7).",
          "Elección": "La Reforma afirma la elección incondicional (TULIP) basándose en Gn 25:23 y Ro 9:11–13. La elección no se basa en la fe prevista sino en el beneplácito soberano de Dios, para gloria de su gracia (WCF 3.5).",
          "Soteriología": "Gn 15:6 es el texto clave de la Reforma para demostrar que la justificación ha sido siempre por fe sola, anterior a la ley. Lutero y Calvino citaban este versículo contra la idea de salvación del AT por obras.",
          "Providencia": "La Reforma afirma que Dios no sólo permite el mal sino que lo decreta de manera que no sea su autor moral (distinción entre decretar y aprobar). Gn 50:20 es el texto clásico sobre la concurrencia divina (WCF 5.4).",
          "Cristología": "La hermenéutica reformada lee todo el AT cristocéntricamente. El protoevangelio (Gn 3:15) es la clave interpretativa del AT para la tradición reformada. Cristo recapitula y cumple toda la historia patriarcal.",
          "Teología Propia": "La Reforma enfatiza la incomprensibilidad de Dios: sólo lo conocemos en la medida en que él se revela. En Génesis esta revelación es narrativa y pactual. El nombre El Shaddai revela un Dios que actúa en la historia.",
          "Angelología": "La tradición reformada interpreta el Ángel de YHWH en Génesis como el Hijo pre-encarnado (Cristofanía), no un ángel creado — consistente con que el Ángel habla como YHWH mismo (Gn 16:13; 22:12).",
        };
        return (
          <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
            {/* LEFT: category buttons + WCF */}
            <div style={{display:"flex", flexDirection:"column", gap:3, flexShrink:0, minWidth:175, maxWidth:180}}>
              <div style={{...GS.metaLabel, marginBottom:4}}>DOCTRINAS</div>
              {SYSTEMATIC_THEOLOGY.map(cat => {
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
              <div style={{...GS.metaLabel, marginTop:12, marginBottom:4}}>CONFESIONES DE FE</div>
              {WCF_ANCHORS.map((w, i) => {
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
                      <div style={{...GS.metaLabel, marginBottom:2, color:"rgba(139,58,42,0.9)"}}>CONFESIÓN DE WESTMINSTER</div>
                      <div style={{fontSize:20, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>
                        {`${activeWcf.cap} — ${activeWcf.titulo}`}
                      </div>
                    </div>
                  </div>

                  {/* Doctrines connected */}
                  <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:14}}>
                    {activeWcf.doctrinas.map(d => (
                      <span key={d} style={{...GS.tag, borderColor:"rgba(139,58,42,0.4)", color:"rgba(200,130,100,0.9)"}}>
                        {d}
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
                      LO QUE ENSEÑA ESTE CAPÍTULO
                    </div>
                    <div style={{fontSize:15, lineHeight:1.78, color:"rgba(242,232,208,0.85)", fontStyle:"italic"}}>
                      {activeWcf.resumen}
                    </div>
                  </div>

                  {/* Genesis passages that ground this chapter */}
                  <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`,
                    borderRadius:3, padding:"14px 18px", marginBottom:14}}>
                    <div style={{...GS.metaLabel, marginBottom:10}}>PASAJES DE GÉNESIS QUE FUNDAMENTAN ESTE CAPÍTULO</div>
                    <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                      {activeWcf.genesis.map(v => (
                        <a key={v} href={verseUrl(v)} target="_blank" rel="noopener noreferrer"
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
                    LEER CAPÍTULO COMPLETO →
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
                  <div style={{...GS.metaLabel, marginBottom:2}}>TEOLOGÍA SISTEMÁTICA</div>
                  <div style={{fontSize:22, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>{activeCat.categoria}</div>
                </div>
              </div>

              {/* Summary */}
              <div style={{background:"rgba(27,42,74,0.4)", border:`1px solid rgba(201,168,76,0.18)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
                <div style={{...GS.metaLabel, marginBottom:8}}>LO QUE GÉNESIS ENSEÑA</div>
                <div style={{fontSize:15, lineHeight:1.75, color:"rgba(242,232,208,0.83)"}}>
                  {linkifyVerses(activeCat.resumen)}
                </div>
              </div>

              {/* Passages */}
              <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
                <div style={{...GS.metaLabel, marginBottom:12}}>PASAJES CLAVE EN GÉNESIS</div>
                {activeCat.pasajes.map((p, i) => (
                  <div key={i} style={{
                    display:"flex", gap:14, padding:"11px 0",
                    borderBottom: i < activeCat.pasajes.length-1 ? `1px solid rgba(201,168,76,0.07)` : "none",
                  }}>
                    <div style={{minWidth:94, flexShrink:0, paddingTop:2}}>
                      <VerseLink style={{fontSize:12}}>{p.ref}</VerseLink>
                    </div>
                    <div style={{fontSize:14, lineHeight:1.65, color:"rgba(242,232,208,0.72)"}}>
                      {linkifyVerses(p.nota)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reformed distinctive */}
              <div style={{
                background:"linear-gradient(90deg,rgba(139,58,42,0.12),rgba(139,58,42,0.02))",
                borderLeft:`3px solid ${SIENNA}`, padding:"13px 16px", borderRadius:"0 3px 3px 0",
              }}>
                <div style={{...GS.metaLabel, marginBottom:7}}>DISTINCTIVA REFORMADA</div>
                <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.65, color:"rgba(242,232,208,0.75)"}}>
                  {linkifyVerses(DISTINCTIVAS[activeCat.categoria] || "")}
                </div>
              </div>
                </div>
              )}
            </div>
          </div>
        );
      }

      case "purpose": return (
        <div>
          <div style={GS.purposeCols}>
            <div>
              <div style={GS.purposeColTitle}>PROPÓSITO HISTÓRICO</div>
              <div style={GS.prose}>
                Registrar los <strong style={{color:GOLD}}>orígenes del cosmos</strong>, la humanidad, el pecado y el pueblo elegido de Dios. Génesis responde las preguntas fundamentales de identidad para Israel en el desierto del Sinaí: ¿Quién nos creó? ¿Por qué sufrimos? ¿Por qué somos el pueblo de Dios? ¿Qué promesas nos garantizan la tierra?
                <br/><br/>La narrativa abarca unos <strong style={{color:GOLD}}>2,400 años de historia</strong> según la cronología bíblica conservadora, estableciendo la cadena ininterrumpida de la elección divina a través de las generaciones.
              </div>
            </div>
            <div>
              <div style={GS.purposeColTitle}>PROPÓSITO TEOLÓGICO</div>
              <div style={GS.prose}>
                Establecer que el <strong style={{color:GOLD}}>Dios soberano creó todo con un propósito redentor</strong>. El pecado irrumpió arruinando la creación, pero Dios en su gracia soberana eligió a un pueblo para sí, <strong style={{color:GOLD}}>prefigurando la salvación definitiva en Cristo</strong>.
                <br/><br/>Cada narrativa apunta hacia adelante: Adán → necesidad del segundo Adán; la caída → necesidad de redención; Abraham → justificación por fe; Isaac → sacrificio sustitutivo; Jacob → elección incondicional; José → exaltación del humillado para salvar a muchos.
              </div>
            </div>
          </div>
          <div style={GS.audienceBox}>
            <div style={{...GS.metaLabel, marginBottom: 8}}>DESTINATARIO ORIGINAL</div>
            <div style={{fontStyle:"italic", fontSize: 15, color:"rgba(242,232,208,0.8)", lineHeight: 1.65}}>
              La nación de Israel en el desierto del Sinaí, recién rescatada de Egipto y en proceso de formación como pueblo del pacto. Necesitaban conocer su identidad como pueblo de Dios, los fundamentos de la creación, el origen del pecado y la muerte, y la cadena ininterrumpida de las promesas patriarcales que culminarían en la tierra prometida y en el Mesías.
            </div>
          </div>
        </div>
      );

      case "canon": return (
        <div>
          <div style={{...GS.metaLabel, marginBottom: 18}}>POSICIÓN EN LA HISTORIA REDENTORA</div>
          <div style={GS.epochRow}>
            {CANON_EPOCHS.map((ep, i) => (
              <div key={i} style={{...GS.epoch(ep.highlight), ...(i===CANON_EPOCHS.length-1 ? GS.epochLast : {})}}>
                {ep.highlight && <div style={{fontSize:8, letterSpacing:2, color:GOLD, marginBottom:4}}>← GÉNESIS</div>}
                <div style={GS.epochLabel}>{ep.label}</div>
                <div style={GS.epochTitle}>{ep.title}</div>
                <div style={GS.epochBooks}>{ep.books}</div>
              </div>
            ))}
          </div>
          <div style={GS.christBox}>
            <div style={{...GS.metaLabel, marginBottom: 8}}>
              ENFOQUE CRISTOLÓGICO —{" "}
              <a href="https://www.thegospelcoalition.org/reviews/book-launched-biblical-theology/" target="_blank" rel="noopener noreferrer"
                style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid rgba(201,168,76,0.4)`, letterSpacing: 1 }}>
                TEOLOGÍA BÍBLICA (GEERHARDUS VOS)
              </a>
            </div>
            <div style={{fontStyle:"italic", fontSize: 15, color:"rgba(242,232,208,0.83)", lineHeight: 1.75}}>
              {linkifyVerses("Génesis presenta a Cristo como la Simiente prometida (Gn 3:15 — el protoevangelio), el verdadero Adán que revertirá la maldición del primero (Ro 5:12–21), el cumplimiento de las promesas a Abraham (Gá 3:16), y la figura prefigurada en José como aquel que desciende a la humillación para salvar a su pueblo.")}
            </div>
          </div>
          <div style={{...GS.metaLabel, marginBottom: 12}}>TIPOS Y SOMBRAS DE CRISTO</div>
          <div style={GS.typesGrid}>
            {TYPES_SHADOWS.map((t, i) => (
              <div key={i} style={GS.typeItem}>
                <span style={{color:GOLD, fontSize:9, flexShrink:0, marginTop:2}}>✦</span>
                <span>{linkifyVerses(t)}</span>
              </div>
            ))}
          </div>
        </div>
      );

      case "history": return (
        <div>
          {/* Period */}
          <div style={{background:"rgba(27,42,74,0.4)", border:`1px solid rgba(201,168,76,0.18)`, borderRadius:3, padding:"18px 20px", marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:8}}>PERÍODO HISTÓRICO</div>
            <div style={{fontSize:15, lineHeight:1.75, color:"rgba(242,232,208,0.83)"}}>{HIST_PERIODO}</div>
          </div>

          {/* Chronology */}
          <div style={{marginBottom:20}}>
            <div style={{...GS.metaLabel, marginBottom:12}}>CRONOLOGÍA INTERNA DEL LIBRO</div>
            <div style={{display:"flex", flexDirection:"column", gap:0}}>
              {HIST_CRONOLOGIA.map((e, i) => (
                <div key={i} style={{display:"flex", gap:16, padding:"10px 0", borderBottom:`1px solid rgba(201,168,76,0.08)`, alignItems:"flex-start"}}>
                  <div style={{minWidth:130, flexShrink:0}}>
                    <div style={{fontSize:12, fontWeight:700, color:GOLD, letterSpacing:0.5}}>{e.fecha}</div>
                    <VerseLink style={{fontSize:10}}>{e.ref}</VerseLink>
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
            <div style={{...GS.metaLabel, marginBottom:12}}>GEOGRAFÍA DEL LIBRO</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
              {HIST_GEOGRAFIA.map((g, i) => (
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
            <div style={{...GS.metaLabel, marginBottom:12}}>CIVILIZACIONES EN ESCENA</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
              {HIST_CIVILIZACIONES.map((c, i) => (
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
            <div style={{...GS.metaLabel, marginBottom:12}}>FUENTES DEL ANTIGUO ORIENTE PRÓXIMO (ANE)</div>
            <div style={{display:"flex", flexDirection:"column", gap:0}}>
              {HIST_ANE.map((a, i) => (
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
            <div style={{...GS.metaLabel, marginBottom:8, color:"rgba(139,58,42,0.9)"}}>CONTROVERSIAS HISTÓRICAS</div>
            <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.75, color:"rgba(242,232,208,0.78)"}}>
              {HIST_CONTROVERSIAS}
            </div>
          </div>
        </div>
      );

      case "verses": return (
        <div>
          {KEY_VERSES.map((v, i) => (
            <div key={i} style={{...GS.verseEntry, borderBottom: i<KEY_VERSES.length-1 ? `1px solid rgba(201,168,76,0.1)` : "none"}}>
              <div style={GS.verseRef}>
                <VerseLink style={{fontSize:13}}>{v.ref}</VerseLink>
              </div>
              <div style={{flex:1}}>
                <div style={GS.verseText}>"{v.text}"</div>
                <div style={GS.verseNote}>{linkifyVerses(v.note)}</div>
              </div>
            </div>
          ))}
        </div>
      );

      case "sources": return (
        <div>
          <div style={{...GS.metaLabel, marginBottom:16}}>
            Haz clic en cualquier fuente para ver biografía del autor, método y aportación al pipeline
          </div>
          <div style={GS.sourcesGrid}>
            {SOURCES.map((s, i) => (
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
                  Ver ficha completa →
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20, fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.3)", textAlign:"center"}}>
            CANON PIPELINE v1.2.0 · PROTESTANTISMO REFORMADO · NBLA / ESV / NAA
          </div>
        </div>
      );

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
          ← VOLVER AL ESTANTE
        </button>
      </div>

      {/* HEADER */}
      <header style={GS.header}>
        <div style={GS.eyebrow}>Canon Pipeline · Protestantismo Reformado · NBLA · ESV · NAA</div>
        <div style={GS.h1}>GÉNESIS</div>
        <div style={GS.hebrew}>בְּרֵאשִׁית</div>
        <p style={GS.subline}><em>Bereshit</em> — En el principio creó Dios los cielos y la tierra</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:"14px 24px", maxWidth:780, margin:"0 auto", textAlign:"left", padding:"0 20px" }}>
          {[
            ["Título Original", "בְּרֵאשִׁית · Bereshit"],
            ["Autor", "Moisés · Autoría tradicional"],
            ["Fecha de escritura", "c. 1445–1405 a.C."],
            ["División Canónica", "Pentateuco · #1 del Canon"],
            ["Idioma Original", "Hebreo Bíblico Clásico"],
            ["Versiones", "NBLA · ESV · NAA"],
          ].map(([l, v]) => (
            <div key={l} style={{ borderLeft:`2px solid rgba(201,168,76,0.3)`, paddingLeft:12 }}>
              <div style={{ fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.55)", marginBottom:4, textTransform:"uppercase" }}>{l}</div>
              <div style={{ fontSize:14, color:PARCHMENT, lineHeight:1.4 }}>{v}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ERA LEGEND */}
      <div style={GS.eraLegend}>
        {CHAPTER_ERAS.map(e => (
          <div key={e.color} style={GS.eraDot}>
            <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}} />
            {e.label}
          </div>
        ))}
      </div>

      {/* ── BOOK INFO PANEL ── */}
      <div style={GS.infoPanel}>
        <div style={GS.tabNavWrap}>
          <nav style={GS.tabNav}>
            {TABS.map(t => (
              <button key={t.id} style={GS.tabBtn(activeTab===t.id)} onClick={()=>setActiveTab(t.id)}>
                {t.label}
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
        ← Arrastra para explorar · Clic en capítulo → BibleGateway NBLA · Clic en personaje → biografía →
      </div>

      {/* ── TIMELINE ── */}
      <div style={GS.timelineWrap} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
        <div style={GS.timelineInner}>

          {/* ERA BANDS */}
          {CHAPTER_ERAS.map((era, i) => {
            const x1 = xOf(era.from);
            const x2 = xOf(era.to + 1);
            return (
              <div key={i} style={{ position:"absolute", top:0, left: x1, width: x2-x1, height:"100%",
                background:`linear-gradient(90deg,${era.color}10,${era.color}1e)`,
                borderRight:"1px dashed rgba(201,168,76,0.1)" }}>
                <span style={{position:"absolute",top:10,left:10,fontSize:13,letterSpacing:2,color:`${era.color}99`,whiteSpace:"nowrap"}}>
                  {era.label}
                </span>
              </div>
            );
          })}

          {/* SPINE */}
          <div style={GS.spine} />

          {/* CHAPTER DOTS */}
          {CHAPTERS_INFO.map(d => {
            const url = `https://www.biblegateway.com/passage/?search=Genesis+${d.ch}&version=NBLA`;
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
          {CHARACTERS.map(c => {
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
          <VerseLink style={{fontSize:9, letterSpacing:2}}>{tooltip.data.verse}</VerseLink>
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
            {charTooltip.char.desc}
          </div>
          <div style={{marginTop:10, fontSize:10, letterSpacing:2, color:"rgba(201,168,76,0.45)"}}>
            Gn {charTooltip.char.ch[0]}–{charTooltip.char.ch[1]} · Clic para ver biografía completa
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
                  {activeChar.heb}{" \u00b7 "}Gn {activeChar.ch[0]}–{activeChar.ch[1]}
                </div>
                <div style={GS.popupDesc}>{activeChar.desc}</div>
              </div>
            </div>

            <div style={GS.popupBody}>
              {[
                ["ACCIONES NARRATIVAS", activeChar.actions, "text"],
                ["SIGNIFICADO TEOLÓGICO", activeChar.theology, "text"],
                ["TIPO Y SOMBRA DE CRISTO", activeChar.christType, "banner"],
                ["EN EL NUEVO TESTAMENTO", activeChar.ntRefs, "nt"],
              ].map(([title, content, type]) => (
                <div key={title}>
                  <div style={GS.popupSectionTitle}>✦ {title}</div>
                  {type === "text" && <div style={GS.popupText}>{linkifyVerses(content)}</div>}
                  {type === "banner" && <div style={GS.typeBanner}><div style={{...GS.popupText,fontStyle:"italic"}}>{linkifyVerses(content)}</div></div>}
                  {type === "nt" && <div style={GS.ntBox}>{linkifyVerses(content)}</div>}
                </div>
              ))}
              <div style={GS.popupSectionTitle}>✦ VERSÍCULOS CLAVE</div>
              <div style={GS.versChips}>
                {activeChar.verses.map(v => (
                  <a key={v} href={verseUrl(v)} target="_blank" rel="noopener noreferrer"
                    style={{...GS.versChip, textDecoration:"none", display:"inline-block",
                      cursor: verseUrl(v) ? "pointer" : "default"}}>
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
                <div style={GS.popupSectionTitle}>✦ SOBRE EL AUTOR</div>
                <div style={GS.popupText}>{activeSource.popup.bio}</div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ MÉTODO Y ENFOQUE</div>
                <div style={GS.popupText}>{activeSource.popup.metodo}</div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ APORTACIÓN AL CANON PIPELINE</div>
                <div style={{...GS.typeBanner}}>
                  <div style={{...GS.popupText, fontStyle:"italic"}}>{activeSource.popup.aportacion}</div>
                </div>
              </div>

              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ OBRAS PRINCIPALES</div>
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
                VER FICHA COMPLETA →
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

  const openDivision = (id) => { setView({ mode: "division", id }); };
  const openBook = (book) => {
    if (book.ready) setView({ mode: "book", id: book.id });
    else openDivision(book.div);
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
    const heights = books.map((b) => tabCellHeight(b.es));
    const columns = balancedContiguousSplit(books, heights, GRID_COLS);
    return (
      <nav style={S.tabRail(side)}>
        <div style={S.railHeader}>
          <div style={S.railTitle}>{side === "left" ? "A.T." : "N.T."}</div>
          <div style={S.railSub}>{books.length} libros</div>
        </div>
        <div style={S.tabColumns}>
          {columns.map((col, ci) => (
            <div key={ci} style={S.tabColumn}>
              {col.map((b) => {
                const d = DIV_BY_ID[b.div];
                const isActiveBook = view.mode === "book" && view.id === b.id;
                const isActiveDiv = view.mode === "division" && view.id === b.div;
                const active = isActiveBook || isActiveDiv;
                return (
                  <button
                    key={b.id}
                    style={S.stepTab(d.color, active, tabCellHeight(b.es))}
                    onClick={() => openBook(b)}
                    title={b.es}
                  >
                    <span style={S.stepTabLabel(active, true)}>{b.es}</span>
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
  const activeBook = activeBookId ? BOOKS.find(b => b.id === activeBookId) : null;
  const isGenesisOpen = activeBook && activeBook.es === "Génesis";

  // Contextual subtitle — the header now persists across every view instead of
  // only showing on the index, with the instruction text swapped for something
  // relevant to where the person actually is (browsing a classification vs.
  // reading a book), rather than disappearing the moment they navigate away.
  let headerSubtitle = "Toca una clasificación para conocer su trasfondo histórico, por qué se agrupa así, y los libros que la componen.";
  if (view.mode === "division") {
    const d = DIV_BY_ID[view.id];
    headerSubtitle = `Explorando ${d.titulo} — ${d.rango}. Toca un libro a la izquierda o derecha, o vuelve al índice de clasificaciones.`;
  } else if (view.mode === "book" && activeBook) {
    headerSubtitle = isGenesisOpen
      ? "Recorre la línea de tiempo de Génesis: personajes, capítulos y teología sistemática interactiva."
      : `Leyendo ${activeBook.es}. Toca otro libro para navegar, o vuelve al índice de clasificaciones.`;
  }

  return (
    <div style={S.outer}>
      <div style={S.topBar} />
      <div style={S.appHeader}>
        <div style={S.appTitle}>Exploración Bíblica Panorámica Interactiva</div>
        <div style={S.headerInstruction}>{headerSubtitle}</div>
      </div>
      <div style={S.bookFrame}>
        <div style={S.book}>
          {!isGenesisOpen && renderRail(OT_BOOKS, "left")}

          {!isGenesisOpen && <div style={S.gutterShadowLeft} />}
          {!isGenesisOpen && <div style={S.gutterShadowRight} />}
          {!isGenesisOpen && <div style={S.gutterLine} />}

          <div style={S.pages}>
            {isGenesisOpen ? (
              <GenesisFullViewer onBack={goIndex} />
            ) : view.mode === "index" ? (
              <>
                <div style={S.page}>
                  <IndexPage divisions={OT_DIVISIONS} onSelect={openDivision} side="left" />
                </div>
                <div style={S.page}>
                  <IndexPage divisions={NT_DIVISIONS} onSelect={openDivision} side="right" />
                </div>
              </>
            ) : view.mode === "division" ? (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <DivisionTour division={DIV_BY_ID[view.id]} onSelectBook={openBook} onBack={goIndex} />
                </div>
              </div>
            ) : (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <button style={S.backLink} onClick={() => openDivision(activeBook.div)}>← {DIV_BY_ID[activeBook.div].titulo}</button>
                  <div style={S.comingSoon}>
                    <div style={S.comingSoonTitle}>{activeBook.es} — aún no generado</div>
                    <div>Este libro se añadirá al pipeline próximamente. Explora su división o visita Génesis, ya disponible.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isGenesisOpen && renderRail(NT_BOOKS, "right")}
        </div>
      </div>
      <div style={S.mobileNote}>El Canon · 66 libros · 10 divisiones · tradición reformada</div>
    </div>
  );
}

// ── INDEX PAGE (cover spread — classification cards) ────────────────────────

function IndexPage({ divisions, onSelect, side }) {
  return (
    <div>
      <div style={S.spreadEyebrowBig}>{side === "left" ? "ANTIGUO TESTAMENTO" : "NUEVO TESTAMENTO"}</div>
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
            <div style={S.classCardMeta}>{d.libros.length} {d.libros.length === 1 ? "libro" : "libros"} →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DIVISION TOUR (full page — replaces the spread) ──────────────────────────

function DivisionTour({ division: d, onSelectBook, onBack }) {
  return (
    <div>
      <button style={S.backLink} onClick={onBack}>← El Canon</button>

      <div style={S.divEyebrow(d.color)}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, display: "inline-block" }} />
        {d.testamento === "Antiguo" ? "ANTIGUO TESTAMENTO" : "NUEVO TESTAMENTO"} · {d.libros.length} {d.libros.length === 1 ? "LIBRO" : "LIBROS"}
      </div>
      <div style={S.divH1}>{d.titulo}</div>
      <div style={S.divRange}>{d.rango}</div>
      <div style={S.divTagline}>{d.tagline}</div>

      <div style={S.sectionLabel(d.color)}>VISIÓN GENERAL</div>
      <div style={S.prose}>{linkifyVerses(d.resumen)}</div>

      <div style={S.sectionLabel(d.color)}>TRASFONDO HISTÓRICO</div>
      <div style={S.prose}>{linkifyVerses(d.fondoHistorico)}</div>

      <div style={S.sectionLabel(d.color)}>¿POR QUÉ SE AGRUPAN ASÍ?</div>
      <div style={S.prose}>{linkifyVerses(d.porQueAgrupados)}</div>

      <div style={S.calloutGrid}>
        <div style={S.callout}>
          <div style={S.calloutLabel}>CONTEXTO DE PACTO</div>
          <div style={S.calloutText}>{linkifyVerses(d.epocaPacto)}</div>
        </div>
        <div style={S.callout}>
          <div style={S.calloutLabel}>ENFOQUE CRISTOLÓGICO</div>
          <div style={S.calloutText}>{linkifyVerses(d.enfoqueCristologico)}</div>
        </div>
      </div>

      <div style={S.sienna}>
        <div style={S.siennaLabel}>DISTINCTIVA REFORMADA</div>
        <div style={S.siennaText}>{linkifyVerses(d.distintivaReformada)}</div>
      </div>

      <div style={S.verseBox}>
        <div style={S.verseRef}>VERSÍCULO CLAVE DE LA DIVISIÓN</div>
        <VerseLink style={{ fontSize: 16 }}>{d.versiculoClave}</VerseLink>
      </div>

      <div style={S.sectionLabel(d.color)}>LOS LIBROS DE ESTA DIVISIÓN</div>
      <div style={S.bookGrid}>
        {d.libros.map(libro => {
          const bookEntry = BOOKS.find(b => b.es === libro.es);
          const ready = bookEntry?.ready;
          return (
            <div
              key={libro.es}
              style={S.bookCard(d.color)}
              onClick={() => bookEntry && onSelectBook(bookEntry)}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,42,74,0.65)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(27,42,74,0.4)"; }}
            >
              <div style={S.bookCardTitle}>
                {libro.es}
                {ready && <span style={S.bookCardBadge}>VER →</span>}
              </div>
              <div style={S.bookCardReason}>{linkifyVerses(libro.razon)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
