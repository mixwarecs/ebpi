import { verseUrl } from "../utils";

const LINK = "#1E4A7A";
const LINK_HOVER = "#163A60";

export default function VerseLink({ children, lang = "es", style = {} }) {
  const url = verseUrl(children, lang);
  const base = {
    fontFamily: "'Georgia',serif", fontWeight: 700, color: LINK, letterSpacing: "0.5px",
    textDecoration: "none", borderBottom: `1px solid rgba(30,74,122,0.35)`,
    transition: "border-color 0.15s, color 0.15s", cursor: url ? "pointer" : "default", ...style,
  };
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={base}
        onMouseEnter={e => { e.target.style.color = LINK_HOVER; e.target.style.borderBottomColor = LINK_HOVER; }}
        onMouseLeave={e => { e.target.style.color = LINK; e.target.style.borderBottomColor = "rgba(30,74,122,0.35)"; }}>
        {children}
      </a>
    );
  }
  return <span style={{ ...base, borderBottom: "none" }}>{children}</span>;
}
