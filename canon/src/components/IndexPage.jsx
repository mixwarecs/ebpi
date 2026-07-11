import { UI, S, BOOK_ID_BY_ES } from "../constants";

export default function IndexPage({ divisions, onSelect, onSelectBook, side, lang = "es" }) {
  const u = UI[lang];
  return (
    <div>
      <div style={S.spreadEyebrowBig}>{side === "left" ? u.ot_label : u.nt_label}</div>
      <div style={S.classGrid}>
        {divisions.map(d => (
          <div
            key={d.id}
            style={S.classCard()}
            onClick={() => onSelect(d.id)}
            onMouseEnter={e => { e.currentTarget.children[1].style.background = "rgba(201,168,76,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.children[1].style.background = "transparent"; }}
          >
            <div style={S.classCardHeader(d.color)}>{d.titulo}</div>
            <div style={S.classCardBody}>
              <div style={S.classCardBlurb}>{d.resumenBreve || d.tagline}</div>
              <div style={S.classCardBooks}>
                {d.libros.map((b, i) => {
                  const num = b.id ?? BOOK_ID_BY_ES[b.es];
                  return (
                    <div
                      key={b.id ?? i}
                      style={S.classCardBookItem}
                      onClick={e => { e.stopPropagation(); onSelectBook(b); }}
                      onMouseEnter={e => { e.currentTarget.children[1].style.textDecoration = "underline"; e.currentTarget.children[1].style.color = "#8B3A2A"; }}
                      onMouseLeave={e => { e.currentTarget.children[1].style.textDecoration = "none"; e.currentTarget.children[1].style.color = ""; }}
                    >
                      <span style={S.classCardBookNum}>{num}</span>
                      <span>{b.es}</span>
                    </div>
                  );
                })}
              </div>
              <div style={S.classCardMeta}>{u.cardBooks(d.libros.length)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
