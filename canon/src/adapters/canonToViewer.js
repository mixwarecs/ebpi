// Transforms CANON schema shapes → component-expected shapes.
// All functions are pure (no side effects, no imports).

const ERA_COLORS = {
  "Primordial":     "#6B7F5E",
  "Patriarcal":     "#7A6B4F",
  "Ley":            "#8B6914",
  "Éxodo":          "#8B6914",
  "Anticipación":   "#5A7A5A",
  "Conquista":      "#5A7A5A",
  "Monarquía":      "#4A6B8A",
  "Exilio":         "#7A4A6B",
  "Post-exilio":    "#5A7A6B",
  "Intertestamental":"#8A8A8A",
  "Ministerio":     "#C9A84C",
  "Iglesia":        "#6B5B95",
  "Consumación":    "#8B0000",
};

function eraColor(era) {
  for (const [key, color] of Object.entries(ERA_COLORS)) {
    if (era && era.includes(key)) return color;
  }
  return "#888";
}

// books-manifest libro → shelf book shape
export function adaptManifestBook(libro) {
  return {
    id: libro.id,
    es: libro.titulo.es,
    en: libro.titulo.en,
    pt: libro.titulo.pt,
    ab: libro.abreviatura,
    div: libro.division,
    ready: libro.disponible,
    razon: libro.razon,
    cap: libro.capitulosTotal,
    color: libro.divisionColor,
    dataFile: libro.dataFile || null,
  };
}

// canon fuentes[] → viewer sources[]
export function adaptFuentes(fuentes, lang = "es") {
  if (!fuentes) return [];
  const pick = (v) => v && typeof v === "object" ? (v[lang] || v.es || "") : (v || "");
  return fuentes.map(f => {
    const p = f.popup || {};
    return {
      tier:   f.nivel != null ? `NIVEL ${f.nivel}` : "",
      title:  f.titulo,
      author: f.autor,
      year:   f.año || "",
      lang:   f.idioma ? f.idioma.toUpperCase() : "",
      meta:   [f.editorial, f.año, f.idioma ? f.idioma.toUpperCase() : ""].filter(Boolean).join(" · "),
      campos: f.camposUtilizados
        ? (typeof f.camposUtilizados === "object" && !Array.isArray(f.camposUtilizados)
            ? (f.camposUtilizados[lang] || f.camposUtilizados.es || [])
            : f.camposUtilizados)
        : [],
      popup: {
        bio:       pick(p.bio),
        metodo:    pick(p.metodo),
        aportacion:pick(p.aportacion),
        obras:     p.obras || [],
        url:       p.url || "",
      },
    };
  });
}

// canon teologiaSistematica[] → viewer theology[]
export function adaptTheology(teologiaSistematica, lang = "es") {
  if (!teologiaSistematica) return [];
  return teologiaSistematica.map(t => {
    const pasajesRefs = t.pasajes || [];
    const notas = t.ensenanza && t.ensenanza[lang]
      ? t.ensenanza[lang].split(" · ")
      : [];
    return {
      categoria: t.categoria && typeof t.categoria === "object"
        ? (t.categoria[lang] || t.categoria.es)
        : t.categoria,
      distintivaReformada: t.distintivaReformada
        ? (t.distintivaReformada[lang] || t.distintivaReformada.es || "")
        : "",
      resumen: t.resumen ? (t.resumen[lang] || "") : "",
      pasajes: pasajesRefs.map((ref, i) => ({
        ref,
        nota: notas[i] || "",
      })),
    };
  });
}

// historiaRedentora.tiposYSombras[] → string[]
export function adaptTiposYSombras(arr, lang = "es") {
  if (!arr) return [];
  return arr.map(t => typeof t === "object" ? (t[lang] || t.es) : t);
}

// versiculosClave[] → [{ref, text, nota}]
export function adaptVersiculosClave(arr, lang = "es") {
  if (!arr) return [];
  return arr.map(v => {
    if (typeof v === "object") return {
      ref: v.ref,
      text: v[lang] || v.es,
      nota: v.nota ? (v.nota[lang] || v.nota.es || "") : "",
    };
    const sep = v.indexOf(" — ");
    return sep > -1 ? { ref: v.slice(0, sep), text: v.slice(sep + 3), nota: "" } : { ref: "", text: v, nota: "" };
  });
}

// anclasConfesionales[] → viewer wcf anchors []
export function adaptAnclasConfesionales(arr, lang = "es") {
  if (!arr) return [];
  return arr.map(w => {
    if (typeof w === "string") return null; // skip old flat-string format
    return {
      cap: w.cap,
      titulo: w.titulo ? (w.titulo[lang] || w.titulo.es) : w.cap,
      resumen: w.resumen ? (w.resumen[lang] || w.resumen.es || "") : "",
      doctrinas: w.doctrinas || [],
      genesis: w.genesis || [],
      url: w.url || "",
    };
  }).filter(Boolean);
}

// canon resumenCapitulos[] → viewer chapters[]
export function adaptCapitulos(resumenCapitulos, lang = "es") {
  if (!resumenCapitulos) return [];
  const out = [];
  for (const c of resumenCapitulos) {
    const start = c.rangoInicio;
    const end = c.rangoFin;
    for (let ch = start; ch <= end; ch++) {
      out.push({
        ch,
        color: eraColor(c.era),
        title: c.titulo ? (c.titulo[lang] || c.titulo.es || "") : "",
        desc: c.descripcion ? (c.descripcion[lang] || c.descripcion.es || "") : "",
        verse: c.versiculoClave || "",
        era: c.era || "",
      });
    }
  }
  return out;
}

// personajes[] → component character shape (content from JSON, display config inline)
const PERSONA_DISPLAY_FALLBACK = { id: "", color:"#888", init:"?", xCh:1, side:"above", badge:{es:"",en:"",pt:""} };

export function adaptPersonajes(arr, lang = "es", personasDisplay = {}) {
  if (!arr) return [];
  return arr.map(p => {
    const esName = typeof p.nombre === "object" ? p.nombre.es : p.nombre;
    const d = personasDisplay[esName] || { ...PERSONA_DISPLAY_FALLBACK, id: esName };
    const caps = p.capitulosActivo || [];
    return {
      id: d.id,
      name:      typeof p.nombre === "object" ? (p.nombre[lang] || p.nombre.es) : p.nombre,
      heb:       p.hebreo || "",
      ch:        [caps[0] ?? 1, caps[caps.length - 1] ?? 50],
      xCh:       d.xCh,
      side:      d.side,
      color:     d.color,
      init:      d.init,
      badge:     d.badge[lang] || d.badge.es || "",
      desc:      p.descripcion         ? (p.descripcion[lang]         || p.descripcion.es         || "") : "",
      actions:   p.acciones            ? (p.acciones[lang]            || p.acciones.es            || "") : "",
      theology:  p.significadoTeologico? (p.significadoTeologico[lang]|| p.significadoTeologico.es|| "") : "",
      christType:p.tipo                ? (p.tipo[lang]                || p.tipo.es                || "") : "",
      ntRefs:    p.enElNuevoTestamento  ? (p.enElNuevoTestamento[lang] || p.enElNuevoTestamento.es || "") : "",
      verses:    p.versiculosAsociados || [],
    };
  });
}

// canon contextoHistorico → viewer HIST_* shape
export function adaptContextoHistorico(ctx, lang = "es") {
  if (!ctx) return {};

  const HIST_PERIODO = ctx.periodoHistorico ? (ctx.periodoHistorico[lang] || "") : "";

  const pick = (v) => v && typeof v === "object" ? (v[lang] || v.es || "") : (v || "");

  const HIST_GEOGRAFIA = (ctx.geografia || []).map(g => ({
    lugar:   pick(g.lugar),
    moderna: pick(g.identificacionModerna),
    desc:    g.significancia ? (g.significancia[lang] || "") : "",
  }));

  const HIST_CIVILIZACIONES = (ctx.civilizaciones || []).map(c => ({
    nombre: pick(c.nombre),
    rol:    c.rolEnElTexto ? (c.rolEnElTexto[lang] || "") : "",
    estado: c.estadoArqueologico ? (c.estadoArqueologico[lang] || "") : "",
  }));

  const HIST_ANE = (ctx.fuentesANE || []).map(f => ({
    nombre: pick(f.nombre),
    origen: pick(f.origen),
    desc:   f.relevancia ? (f.relevancia[lang] || "") : "",
  }));

  // cronologiaInterna is a multilingual string with entries separated by ' · '
  // Each entry has the pattern "circa/year: event (ref)" or similar free-form text
  const crono = ctx.cronologiaInterna ? (ctx.cronologiaInterna[lang] || "") : "";
  const HIST_CRONOLOGIA = crono
    ? crono.split(" · ").map(entry => {
        const m = entry.match(/^(.*?):\s+(.*?)(?:\s+\(([^)]+)\))?$/);
        if (m) return { fecha: m[1].trim(), evento: m[2].trim(), ref: m[3] || "" };
        return { fecha: "", evento: entry.trim(), ref: "" };
      })
    : [];

  const HIST_CONTROVERSIAS = ctx.controversiasHistoricas
    ? (ctx.controversiasHistoricas[lang] || "")
    : "";

  return {
    HIST_PERIODO,
    HIST_GEOGRAFIA,
    HIST_CIVILIZACIONES,
    HIST_ANE,
    HIST_CRONOLOGIA,
    HIST_CONTROVERSIAS,
  };
}
