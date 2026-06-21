import { verseUrl } from "../utils";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#E8C56A";

export default function VerseLink({ children, lang = "es", style = {} }) {
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
