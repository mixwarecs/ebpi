import { UI, S } from "../constants";
import { linkifyVerses } from "../utils";
import VerseLink from "./VerseLink";

export default function DivisionTour({ division: d, onSelectBook, onBack, lang = "es" }) {
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
