import { GOLD, PARCHMENT } from "../../constants";
import { linkifyVerses } from "../../utils";
import VerseLink from "../VerseLink";

const ERA_COLORS = {
  "Primordial":"#6B7F5E","Patriarcal":"#7A6B4F","Ley":"#8B6914","Éxodo":"#8B6914",
  "Anticipación":"#5A7A5A","Conquista":"#5A7A5A","Monarquía":"#4A6B8A","Exilio":"#7A4A6B",
  "Post-exilio":"#5A7A6B","Intertestamental":"#8A8A8A","Cumplimiento":"#6B5B95",
  "Ministerio":"#C9A84C","Iglesia":"#6B5B95","Aplicación":"#6B5B95","Consumación":"#8B0000",
};
function eraColor(era) {
  for (const [key, color] of Object.entries(ERA_COLORS)) {
    if (era && era.includes(key)) return color;
  }
  return "#7A8FA6";
}

export default function ChapterSummaries({ rawChapters = [], lang = "es" }) {
  if (!rawChapters.length) return null;
  const lv = (t) => linkifyVerses(t, lang);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      padding: "20px 28px 28px",
      textAlign: "left",
    }}>
      {rawChapters.map((c, i) => {
        const title = c.titulo?.[lang] || c.titulo?.es || "";
        const desc  = c.descripcion?.[lang] || c.descripcion?.es || "";
        const color = eraColor(c.era);
        const chLabel = c.rangoInicio === c.rangoFin
          ? String(c.rangoInicio)
          : `${c.rangoInicio}–${c.rangoFin}`;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 16,
              padding: "14px 0",
              borderBottom: i < rawChapters.length - 1
                ? "1px solid rgba(201,168,76,0.08)"
                : "none",
            }}
          >
            <div style={{
              flexShrink: 0,
              width: 44,
              textAlign: "right",
              paddingTop: 3,
            }}>
              <span style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 0.5,
                color,
                opacity: 0.9,
                whiteSpace: "nowrap",
              }}>
                {chLabel}
              </span>
            </div>

            <div style={{
              borderLeft: `3px solid ${color}`,
              paddingLeft: 14,
              flex: 1,
              minWidth: 0,
            }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: PARCHMENT,
                lineHeight: 1.35,
                marginBottom: 7,
                letterSpacing: 0.3,
              }}>
                {title}
              </div>

              <div style={{
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(242,232,208,0.82)",
                marginBottom: c.versiculoClave ? 10 : 0,
              }}>
                {lv(desc)}
              </div>

              {c.versiculoClave && (
                <div style={{ display: "inline-block" }}>
                  <VerseLink lang={lang} style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    color: GOLD,
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.22)",
                    borderRadius: 2,
                    padding: "2px 7px",
                  }}>
                    {c.versiculoClave}
                  </VerseLink>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
