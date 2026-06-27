import { UI, S } from "../constants";
import { linkifyVerses, translateRef } from "../utils";
import VerseLink from "./VerseLink";

export default function DivisionTour({ division: d, onSelectBook, onBack, lang = "es" }) {
  const lv = (t) => linkifyVerses(t, lang);
  const u = UI[lang];
  const [ov, hi, why, cov, chr, ref, kv, books] = u.divSections;
  return (
    <div>
      <button style={S.backLink} onClick={onBack}>{u.backToCanon}</button>

      <div style={S.divEyebrow()}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, display: "inline-block" }} />
        {d.testamento === "Antiguo" ? u.ot_label : u.nt_label} · {d.libros.length} {d.libros.length === 1 ? u.book_s : u.book_p}
      </div>
      <div style={S.divH1}>{d.titulo}</div>
      <div style={S.divRange}>{d.rango}</div>
      <div style={S.divTagline}>{d.tagline}</div>

      <div style={S.sectionLabel()}>{ov}</div>
      <div style={S.prose}>{lv(d.resumen)}</div>

      <div style={S.sectionLabel()}>{hi}</div>
      <div style={S.prose}>{lv(d.fondoHistorico)}</div>

      <div style={S.sectionLabel()}>{why}</div>
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
        <VerseLink lang={lang} style={{ fontSize: 16 }}>{translateRef(d.versiculoClave, lang)}</VerseLink>
      </div>

      <div style={S.sectionLabel()}>{books}</div>
      <div style={S.bookGrid}>
        {d.libros.map(libro => {
          const ready = libro.ready;
          return (
            <div
              key={libro.es}
              style={S.bookCard(d.color)}
              onClick={() => onSelectBook(libro)}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.10)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
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
