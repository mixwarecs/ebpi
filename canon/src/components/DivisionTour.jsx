import { UI, S, hexToRgba } from "../constants";
import { linkifyVerses, translateRef } from "../utils";
import VerseLink from "./VerseLink";

export default function DivisionTour({ division: d, onSelectBook, onBack, onBackToBook, fromBook, lang = "es" }) {
  const lv = (t) => linkifyVerses(t, lang);
  const u = UI[lang];
  const [ov, hi, why, cov, chr, ref, kv, books] = u.divSections;
  const navButtons = [
    ["back", u.backToShelf, onBack],
    fromBook && onBackToBook ? ["book", u.backToBook(fromBook[lang] || fromBook.es), onBackToBook] : null,
  ].filter(Boolean);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
        {navButtons.map(([key, label, handler]) => (
          <button key={key} onClick={handler} style={{
            fontFamily: "'Georgia',serif", fontSize: 12, letterSpacing: 2, color: "rgba(55,28,8,0.90)",
            background: hexToRgba(d.color, 0.14), border: `1px solid ${hexToRgba(d.color, 0.5)}`,
            borderRadius: 20, cursor: "pointer", padding: "6px 16px 6px 12px",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "background 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = hexToRgba(d.color, 0.28); e.currentTarget.style.borderColor = hexToRgba(d.color, 0.85); }}
            onMouseLeave={e => { e.currentTarget.style.background = hexToRgba(d.color, 0.14); e.currentTarget.style.borderColor = hexToRgba(d.color, 0.5); }}>
            {label}
          </button>
        ))}
      </div>

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
