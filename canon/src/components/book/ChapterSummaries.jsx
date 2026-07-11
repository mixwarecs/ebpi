import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Share2, Check, ExternalLink } from "lucide-react";
import { GOLD, PARCHMENT, BOOKS, BIBLE_VERSION, GS, UI } from "../../constants";
import { linkifyVerses, verseUrl } from "../../utils";
import VerseLink from "../VerseLink";

const TIPO_COLORS = {
  cumplimiento: "#1E4A7A", tipología: "#8A6420", paralelo: "#1E6858",
  doctrinal: "#4A2E8A", cita: "#8A1A1A", alusión: "#5A3E1A",
};

const TEMA_CATEGORIA = {
  "Creación/Nueva Creación": "CREACIÓN Y HUMANIDAD", "Imago Dei": "CREACIÓN Y HUMANIDAD",
  "Sábado/Descanso": "CREACIÓN Y HUMANIDAD", "Matrimonio": "CREACIÓN Y HUMANIDAD",
  "Trabajo/Vocación": "CREACIÓN Y HUMANIDAD", "Jardín/Edén": "CREACIÓN Y HUMANIDAD",
  "Pacto": "PACTO Y RELACIÓN", "Promesa/Cumplimiento": "PACTO Y RELACIÓN",
  "Presencia de Dios": "PACTO Y RELACIÓN", "Fidelidad/Hesed": "PACTO Y RELACIÓN",
  "Reino de Dios": "REINO Y GOBIERNO", "Realeza/Trono de David": "REINO Y GOBIERNO", "Pastor/Rey": "REINO Y GOBIERNO",
  "Éxodo/Liberación": "REDENCIÓN Y SALVACIÓN", "Redención/Rescate": "REDENCIÓN Y SALVACIÓN",
  "Sacrificio/Expiación": "REDENCIÓN Y SALVACIÓN", "Pascua/Cordero de Dios": "REDENCIÓN Y SALVACIÓN",
  "Sustitución": "REDENCIÓN Y SALVACIÓN", "Justificación": "REDENCIÓN Y SALVACIÓN", "Reconciliación": "REDENCIÓN Y SALVACIÓN",
  "Templo/Tabernáculo": "ADORACIÓN Y ESPACIO SAGRADO", "Sacerdocio": "ADORACIÓN Y ESPACIO SAGRADO",
  "Santidad": "ADORACIÓN Y ESPACIO SAGRADO", "Gloria de Dios": "ADORACIÓN Y ESPACIO SAGRADO", "Nombre de Dios": "ADORACIÓN Y ESPACIO SAGRADO",
  "Caída/Pecado": "PECADO Y JUICIO", "Maldición": "PECADO Y JUICIO",
  "Exilio/Desierto": "PECADO Y JUICIO", "Ira de Dios/Juicio": "PECADO Y JUICIO", "Idolatría": "PECADO Y JUICIO",
  "Israel/Iglesia": "PUEBLO DE DIOS", "Remanente": "PUEBLO DE DIOS",
  "Elección/Llamado": "PUEBLO DE DIOS", "Simiente/Descendencia": "PUEBLO DE DIOS",
  "Sabiduría": "SABIDURÍA Y PALABRA", "Palabra de Dios/Ley": "SABIDURÍA Y PALABRA",
  "Profeta/Profecía": "SABIDURÍA Y PALABRA", "Temor del Señor": "SABIDURÍA Y PALABRA",
  "Espíritu Santo": "ESPÍRITU Y TRANSFORMACIÓN", "Corazón Nuevo/Nuevo Nacimiento": "ESPÍRITU Y TRANSFORMACIÓN",
  "Fruto/Fructificación": "ESPÍRITU Y TRANSFORMACIÓN",
  "Cielos Nuevos/Tierra Nueva": "ESCATOLOGÍA", "Resurrección": "ESCATOLOGÍA",
  "Segunda Venida": "ESCATOLOGÍA", "Juicio Final": "ESCATOLOGÍA",
  "Bodas del Cordero": "ESCATOLOGÍA", "Vida Eterna": "ESCATOLOGÍA",
  "Mesías/Ungido": "TEMAS CENTRADOS EN CRISTO", "Siervo Sufriente": "TEMAS CENTRADOS EN CRISTO",
  "Hijo del Hombre": "TEMAS CENTRADOS EN CRISTO", "Último Adán": "TEMAS CENTRADOS EN CRISTO",
  "Verdadero Israel": "TEMAS CENTRADOS EN CRISTO", "Verdadero Templo": "TEMAS CENTRADOS EN CRISTO",
};

const CATEGORIA_COLORS = {
  "CREACIÓN Y HUMANIDAD":          { bg: "rgba(46,120,46,0.12)",   border: "rgba(46,120,46,0.50)",   text: "#1E6E1E" },
  "PACTO Y RELACIÓN":              { bg: "rgba(30,74,122,0.12)",   border: "rgba(30,74,122,0.50)",   text: "#1E4A7A" },
  "REINO Y GOBIERNO":              { bg: "rgba(90,45,140,0.12)",   border: "rgba(90,45,140,0.50)",   text: "#5A2D8C" },
  "REDENCIÓN Y SALVACIÓN":         { bg: "rgba(138,26,26,0.12)",   border: "rgba(138,26,26,0.50)",   text: "#8A1A1A" },
  "ADORACIÓN Y ESPACIO SAGRADO":   { bg: "rgba(160,120,20,0.12)",  border: "rgba(160,120,20,0.50)",  text: "#8A6A10" },
  "PECADO Y JUICIO":               { bg: "rgba(60,60,80,0.12)",    border: "rgba(60,60,80,0.50)",    text: "#3C3C50" },
  "PUEBLO DE DIOS":                { bg: "rgba(20,120,110,0.12)",  border: "rgba(20,120,110,0.50)",  text: "#14786E" },
  "SABIDURÍA Y PALABRA":           { bg: "rgba(180,90,20,0.12)",   border: "rgba(180,90,20,0.50)",   text: "#B45A14" },
  "ESPÍRITU Y TRANSFORMACIÓN":     { bg: "rgba(20,100,160,0.12)",  border: "rgba(20,100,160,0.50)",  text: "#1464A0" },
  "ESCATOLOGÍA":                   { bg: "rgba(50,50,150,0.12)",   border: "rgba(50,50,150,0.50)",   text: "#323296" },
  "TEMAS CENTRADOS EN CRISTO":     { bg: "rgba(160,40,80,0.12)",   border: "rgba(160,40,80,0.50)",   text: "#A02850" },
};

const ERA_COLORS = {
  "Primordial":"#A0C080","Patriarcal":"#C4A86A","Ley":"#E0B830","Éxodo":"#E0B830",
  "Anticipación":"#7EC87E","Conquista":"#7EC87E","Monarquía":"#6AAAD4","Exilio":"#C07AAA",
  "Post-exilio":"#70B8A8","Intertestamental":"#C0C0C0","Cumplimiento":"#A898E0",
  "Ministerio":"#E8C56A","Iglesia":"#A898E0","Aplicación":"#A898E0","Consumación":"#E05050",
};
// Darker variants of the same hues — readable on light parchment background
const ERA_INK_COLORS = {
  "Primordial":"#3A6E1A","Patriarcal":"#8A6420","Ley":"#8A7010","Éxodo":"#8A7010",
  "Anticipación":"#2E7835","Conquista":"#2E7835","Monarquía":"#1E5E8A","Exilio":"#7A2E6A",
  "Post-exilio":"#1E6858","Intertestamental":"#4A4A4A","Cumplimiento":"#3E2E8A",
  "Ministerio":"#8A7218","Iglesia":"#3E2E8A","Aplicación":"#3E2E8A","Consumación":"#8A1A1A",
};
function eraColor(era) {
  for (const [key, color] of Object.entries(ERA_COLORS)) {
    if (era && era.includes(key)) return color;
  }
  return "#7A8FA6";
}
function eraInkColor(era) {
  for (const [key, color] of Object.entries(ERA_INK_COLORS)) {
    if (era && era.includes(key)) return color;
  }
  return "#2E4A62";
}

const GCS_BASE = "https://storage.googleapis.com/dramatized_bible/audio";

const AUDIO_CONFIG = {
  en: { source: "msb", ext: "mp3" },
  es: { source: "bll",  ext: "m4a" },
  pt: { source: "acf", ext: "mp3" },
};

function getAudioUrl(lang, bookNum, chapter) {
  const cfg = AUDIO_CONFIG[lang];
  if (!cfg) return null;
  return `${GCS_BASE}/${cfg.source}/${bookNum}_${chapter}.${cfg.ext}`;
}

const CHAPTER_LABELS = { es: "Cap.", en: "Ch.", pt: "Cap." };

function ChapterAudio({ lang, bookNum, rangoInicio, rangoFin, capitulosTotal, shouldAutoPlay, onSectionEnd, onPlayingChange, currentAudioRef }) {
  // Single-chapter books (Jude, 2/3 John, Philemon, Obadiah) have exactly one
  // narrated audio file regardless of how many verse-range units subdivide
  // the chapter for summary purposes (see adaptCapitulos in canonToViewer.js).
  const isSingleChapterBook = capitulosTotal === 1;
  const count = isSingleChapterBook ? 1 : rangoFin - rangoInicio + 1;
  const [idx, setIdx] = useState(0);
  const audioRef = useRef(null);
  const chapter = isSingleChapterBook ? 1 : rangoInicio + idx;
  const src = getAudioUrl(lang, bookNum, chapter);

  // Reset when lang/book/range changes
  useEffect(() => { setIdx(0); }, [lang, bookNum, rangoInicio, rangoFin, capitulosTotal]);

  // When idx advances within a range, auto-play the next chapter
  useEffect(() => {
    if (idx > 0 && audioRef.current) {
      audioRef.current.play();
    }
  }, [idx]);

  // Auto-play when parent signals this section should start
  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [shouldAutoPlay]);

  const handleEnded = () => {
    if (idx < count - 1) {
      setIdx(i => i + 1);
    } else {
      onSectionEnd?.();
    }
  };

  const label = CHAPTER_LABELS[lang] || "Cap.";

  return (
    <div style={{ marginTop: 10 }}>
      {count > 1 && (
        <div style={{
          fontSize: 10,
          letterSpacing: 1.5,
          color: "rgba(22,8,2,0.72)",
          marginBottom: 4,
          textTransform: "uppercase",
        }}>
          {label} {idx + 1} / {count}
        </div>
      )}
      <audio
        ref={audioRef}
        key={src}
        controls
        preload="none"
        src={src}
        onPlay={() => {
          if (currentAudioRef && currentAudioRef.current && currentAudioRef.current !== audioRef.current) {
            currentAudioRef.current.pause();
          }
          if (currentAudioRef) currentAudioRef.current = audioRef.current;
          onPlayingChange?.(true);
        }}
        onPause={() => {
          if (!currentAudioRef || currentAudioRef.current === audioRef.current) {
            onPlayingChange?.(false);
          }
        }}
        onEnded={handleEnded}
        style={{
          width: "100%",
          height: 28,
          filter: "invert(0.85) sepia(0.4) hue-rotate(10deg)",
          opacity: 0.92,
        }}
      />
    </div>
  );
}

function ChapterShareButton({ bookNum, lang, chapterIdx }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#book/${bookNum}/summaries/${chapterIdx}/${lang}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        color: copied ? "rgba(139,90,20,1)" : hovered ? "rgba(30,74,122,0.90)" : "rgba(55,28,8,0.60)",
        lineHeight: 0,
        transition: "color 0.2s",
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={17} strokeWidth={2.5} /> : <Share2 size={17} strokeWidth={2.5} />}
    </button>
  );
}

export default function ChapterSummaries({ rawChapters = [], lang = "es", bookNum = 1, initialChapterIdx = null, onChapterChange, capitulosTotal = null, divisionColor = GOLD }) {
  const lv = (t) => linkifyVerses(t, lang);

  const [activeIdx, setActiveIdx] = useState(null);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(initialChapterIdx);
  const [activeRefs, setActiveRefs] = useState(null);
  const [activeThemes, setActiveThemes] = useState(null);
  const entryRefs = useRef([]);
  const didScrollToInitial = useRef(false);
  const currentAudioRef = useRef(null);

  // Scroll to the newly active entry
  useEffect(() => {
    if (activeIdx !== null && entryRefs.current[activeIdx]) {
      entryRefs.current[activeIdx].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  // One-time scroll to the deep-linked chapter on mount
  useEffect(() => {
    if (didScrollToInitial.current) return;
    if (initialChapterIdx !== null && entryRefs.current[initialChapterIdx]) {
      didScrollToInitial.current = true;
      entryRefs.current[initialChapterIdx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Reset when book or language changes
  useEffect(() => { setActiveIdx(null); }, [lang, bookNum]);

  if (!rawChapters.length) return null;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      padding: "20px 28px 28px",
      textAlign: "left",
    }}>
      {activeRefs && createPortal(
        <div style={GS.overlay(true)} onClick={e => { if (e.target === e.currentTarget) setActiveRefs(null); }}>
          <div style={{...GS.popupCard, maxWidth: 560}}>
            <button style={GS.closeBtn} onClick={() => setActiveRefs(null)}>✕</button>
            <div style={GS.popupHeader}>
              <div style={{flex: 1}}>
                <div style={GS.popupBadge("#3E2E8A")}>
                  {CHAPTER_LABELS[lang] || "Cap."} {activeRefs.rangoInicio === activeRefs.rangoFin ? String(activeRefs.rangoInicio) : `${activeRefs.rangoInicio}–${activeRefs.rangoFin}`}
                </div>
                <div style={GS.popupName}>{activeRefs.titulo?.[lang] || activeRefs.titulo?.es || ""}</div>
              </div>
            </div>
            <div style={GS.popupBody}>
              <div style={GS.popupSectionTitle}>✦ {UI[lang]?.crossRefLabels?.title || "REFERENCIAS RELACIONADAS"}</div>
              {activeRefs.referenciasRelacionadas.map((r, ri) => {
                const tipoColor = TIPO_COLORS[r.tipo] || "#5A3E1A";
                const tipoLabel = UI[lang]?.crossRefLabels?.tipos?.[r.tipo] || r.tipo.toUpperCase();
                const nota = r.nota ? (r.nota[lang] || r.nota.es || "") : "";
                return (
                  <div key={ri} style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: ri < activeRefs.referenciasRelacionadas.length - 1 ? "1px solid rgba(139,90,20,0.10)" : "none",
                    alignItems: "flex-start",
                  }}>
                    <div style={{
                      fontSize: 9,
                      letterSpacing: 2.5,
                      fontWeight: 700,
                      color: tipoColor,
                      border: `1px solid ${tipoColor}55`,
                      background: `${tipoColor}12`,
                      padding: "3px 8px",
                      borderRadius: 2,
                      flexShrink: 0,
                      marginTop: 3,
                      whiteSpace: "nowrap",
                    }}>{tipoLabel}</div>
                    <div style={{flex: 1}}>
                      <VerseLink lang={lang} style={{fontSize: 14, fontWeight: 700, letterSpacing: 0.5}}>
                        {r.ref}
                      </VerseLink>
                      {nota && (
                        <div style={{fontSize: 14, lineHeight: 1.65, color: "rgba(22,8,2,0.78)", marginTop: 5, fontStyle: "italic"}}>
                          {linkifyVerses(nota, lang)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {activeThemes && createPortal(
        <div style={GS.overlay(true)} onClick={e => { if (e.target === e.currentTarget) setActiveThemes(null); }}>
          <div style={{...GS.popupCard, maxWidth: 520}}>
            <button style={GS.closeBtn} onClick={() => setActiveThemes(null)}>✕</button>
            <div style={GS.popupHeader}>
              <div style={{flex: 1}}>
                <div style={GS.popupBadge("#8A6A10")}>
                  {CHAPTER_LABELS[lang] || "Cap."} {activeThemes.rangoInicio === activeThemes.rangoFin ? String(activeThemes.rangoInicio) : `${activeThemes.rangoInicio}–${activeThemes.rangoFin}`}
                </div>
                <div style={GS.popupName}>{activeThemes.titulo?.[lang] || activeThemes.titulo?.es || ""}</div>
              </div>
            </div>
            <div style={GS.popupBody}>
              <div style={GS.popupSectionTitle}>✦ {UI[lang]?.temasLabels?.title || "TEMAS BÍBLICO-TEOLÓGICOS"}</div>
              {(() => {
                const tb = activeThemes.temasBiblicoteologicos;
                const principalName = Object.keys(tb.principal)[0];
                const allEntries = [
                  { tema: principalName, nota: tb.principal[principalName], isPrincipal: true },
                  ...(tb.secundarios || []).map(obj => { const n = Object.keys(obj)[0]; return { tema: n, nota: obj[n], isPrincipal: false }; }),
                ];
                return allEntries.map(({ tema, nota, isPrincipal }, ti) => {
                  const cat = TEMA_CATEGORIA[tema] || "";
                  const clr = CATEGORIA_COLORS[cat] || { bg: "rgba(100,80,40,0.10)", border: "rgba(100,80,40,0.40)", text: "#645028" };
                  const roleLabel = isPrincipal
                    ? (UI[lang]?.temasLabels?.principal || "TEMA PRINCIPAL")
                    : (UI[lang]?.temasLabels?.secundario || "TEMA SECUNDARIO");
                  return (
                    <div key={ti} style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 0",
                      borderBottom: ti < allEntries.length - 1 ? "1px solid rgba(139,90,20,0.10)" : "none",
                      alignItems: "flex-start",
                    }}>
                      <div style={{
                        fontSize: 9,
                        letterSpacing: 2.5,
                        fontWeight: 700,
                        color: clr.text,
                        border: `1px solid ${clr.border}`,
                        background: clr.bg,
                        padding: "3px 8px",
                        borderRadius: 2,
                        flexShrink: 0,
                        marginTop: 3,
                        whiteSpace: "nowrap",
                      }}>{roleLabel}</div>
                      <div style={{flex: 1}}>
                        <div style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: clr.text,
                          lineHeight: 1.3,
                          letterSpacing: 0.5,
                        }}>{UI[lang]?.temasLabels?.temas?.[tema] || tema}</div>
                        <div style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: 2,
                          color: "rgba(22,8,2,0.72)",
                          marginTop: 3,
                        }}>{UI[lang]?.temasLabels?.categorias?.[cat] || cat}</div>
                        {(() => { const n = nota?.[lang] || nota?.es || ""; return n ? <div style={{fontSize: 14, lineHeight: 1.65, color: "rgba(22,8,2,0.78)", marginTop: 5, fontStyle: "italic"}}>{lv(n)}</div> : null; })()}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}

      {rawChapters.map((c, i) => {
        const title = c.titulo?.[lang] || c.titulo?.es || "";
        const desc  = c.descripcion?.[lang] || c.descripcion?.es || "";
        const color = eraInkColor(c.era);
        const chLabel = c.rangoInicio === c.rangoFin
          ? String(c.rangoInicio)
          : `${c.rangoInicio}–${c.rangoFin}`;
        const bookEnName = BOOKS.find(b => b.id === bookNum)?.en || "Genesis";
        const chRange = c.rangoInicio === c.rangoFin
          ? String(c.rangoInicio)
          : `${c.rangoInicio}-${c.rangoFin}`;
        const chapterUrl = `https://www.biblegateway.com/passage/?search=${bookEnName}+${chRange}&version=${BIBLE_VERSION[lang] || "NBLA"}&interface=print`;

        return (
          <div
            key={i}
            ref={el => { entryRefs.current[i] = el; }}
            onClick={() => { setHighlightIdx(i); onChapterChange?.(i); }}
            style={{
              cursor: "pointer",
              display: "flex",
              gap: 16,
              padding: (playingIdx === i || highlightIdx === i) ? "14px 14px" : "14px 0",
              margin: (playingIdx === i || highlightIdx === i) ? "2px -14px" : "0",
              borderBottom: (playingIdx === i || highlightIdx === i) ? "none" : (i < rawChapters.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none"),
              outline: (playingIdx === i || highlightIdx === i) ? "2px solid rgba(139,90,20,0.45)" : "none",
              borderRadius: (playingIdx === i || highlightIdx === i) ? 6 : 0,
              background: (playingIdx === i || highlightIdx === i) ? "rgba(180,140,50,0.14)" : "transparent",
              backdropFilter: "none",
              boxShadow: (playingIdx === i || highlightIdx === i) ? "0 2px 10px rgba(100,68,18,0.14)" : "none",
            }}
          >
            <div style={{
              flexShrink: 0,
              width: 44,
              textAlign: "right",
              paddingTop: 3,
            }}>
              <a
                href={chapterUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderBottom: `1px solid ${color}55`,
                  transition: "color 0.15s",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#1E4A7A"; }}
                onMouseLeave={e => { e.currentTarget.style.color = color; }}
              >
                {chLabel}
                <ExternalLink size={10} style={{ opacity: 0.7 }} />
              </a>
            </div>

            <div style={{
              borderLeft: `3px solid ${(playingIdx === i || highlightIdx === i) ? "#1E4A7A" : divisionColor}`,
              transition: "border-color 0.4s",
              paddingLeft: 14,
              flex: 1,
              minWidth: 0,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flex: 1,
                  minWidth: 0,
                }}>
                  <ChapterShareButton bookNum={bookNum} lang={lang} chapterIdx={i} />
                  <span style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "rgba(22,8,2,0.90)",
                    lineHeight: 1.3,
                    letterSpacing: 0.2,
                  }}>{title}</span>
                </div>
                {c.versiculoClave && (() => {
                  const url = verseUrl(c.versiculoClave, lang);
                  return (
                    <a
                      href={url || undefined}
                      target={url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        height: 32,
                        boxSizing: "border-box",
                        fontSize: 12,
                        letterSpacing: 0.8,
                        color: "#1E4A7A",
                        background: "rgba(30,74,122,0.08)",
                        border: "1px solid rgba(30,74,122,0.35)",
                        borderRadius: 2,
                        padding: "0 13px",
                        textDecoration: "none",
                        fontFamily: "'Georgia', serif",
                        flexShrink: 0,
                        cursor: url ? "pointer" : "default",
                      }}
                    >
                      <ExternalLink size={11} strokeWidth={2} />
                      <strong style={{ fontWeight: 700 }}>{c.versiculoClave}</strong>
                      <span style={{ opacity: 0.80 }}>
                        · {UI[lang]?.crossRefLabels?.verseKeyLabel || "Vers. clave"}
                      </span>
                    </a>
                  );
                })()}
                {c.referenciasRelacionadas?.length > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveRefs(c); }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 32,
                      boxSizing: "border-box",
                      fontSize: 12,
                      letterSpacing: 0.8,
                      color: "#3E2E8A",
                      background: "rgba(62,46,138,0.08)",
                      border: "1px solid rgba(62,46,138,0.35)",
                      borderRadius: 2,
                      padding: "0 13px",
                      cursor: "pointer",
                      fontFamily: "'Georgia', serif",
                      flexShrink: 0,
                    }}
                  >
                    {UI[lang]?.crossRefLabels?.trigger?.(c.referenciasRelacionadas.length) ?? `↔ ${c.referenciasRelacionadas.length}`}
                  </button>
                )}
              </div>

              <div style={{
                fontSize: 17,
                lineHeight: 1.80,
                color: "rgba(22,8,2,0.82)",
              }}>
                {lv(desc)}
              </div>

              {c.temasBiblicoteologicos && (() => {
                const principalName = Object.keys(c.temasBiblicoteologicos.principal)[0];
                const count = 1 + (c.temasBiblicoteologicos.secundarios?.length || 0);
                const clr = CATEGORIA_COLORS[TEMA_CATEGORIA[principalName]] || { bg: "rgba(100,80,40,0.10)", border: "rgba(100,80,40,0.40)", text: "#645028" };
                return (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, marginBottom: 4 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveThemes(c); }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: 32,
                        boxSizing: "border-box",
                        fontSize: 12,
                        letterSpacing: 0.8,
                        color: clr.text,
                        background: clr.bg,
                        border: `1px solid ${clr.border}`,
                        borderRadius: 2,
                        padding: "0 13px",
                        cursor: "pointer",
                        fontFamily: "'Georgia', serif",
                        flexShrink: 0,
                      }}
                    >
                      {UI[lang]?.temasLabels?.trigger?.(count) ?? `✦ ${count} Temas`}
                    </button>
                  </div>
                );
              })()}

              <ChapterAudio
                lang={lang}
                bookNum={bookNum}
                rangoInicio={c.rangoInicio}
                rangoFin={c.rangoFin}
                capitulosTotal={capitulosTotal}
                shouldAutoPlay={activeIdx === i}
                onSectionEnd={() => setActiveIdx(i + 1 < rawChapters.length ? i + 1 : null)}
                onPlayingChange={(playing) => { setPlayingIdx(playing ? i : null); if (playing) { setHighlightIdx(null); onChapterChange?.(i); } }}
                currentAudioRef={currentAudioRef}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
