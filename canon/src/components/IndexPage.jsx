import { UI, S } from "../constants";

export default function IndexPage({ divisions, onSelect, side, lang = "es" }) {
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
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
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
