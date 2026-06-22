import { useState } from "react";
import { GOLD, PARCHMENT, SIENNA, GS, UI } from "../../constants";
import { linkifyVerses, verseUrl, cap } from "../../utils";
import VerseLink from "../VerseLink";

export default function TheologyTab({ theology, wcfAnchors, bookTitle, categoriaEsToLang, lang }) {
  const lv = (t) => linkifyVerses(t, lang);
  const vu = (r) => verseUrl(r, lang);
  const [activeTheology, setActiveTheology] = useState(null);
  const [activeWcf, setActiveWcf] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const activeCat = activeTheology || theology[0];
  const TL = UI[lang].theologyLabels;

  return (
    <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
      <div style={{display:"flex", flexDirection:"column", gap:3, flexShrink:0, minWidth:175, maxWidth:180}}>
        <div style={{...GS.metaLabel, marginBottom:4}}>{TL.doctrines}</div>
        {theology.map(cat => {
          const isActive = activeCat.categoria === cat.categoria;
          const isHovered = hoveredMenu === cat.categoria;
          return (
            <button key={cat.categoria}
              onClick={() => { setActiveTheology(cat); setActiveWcf(null); }}
              onMouseEnter={() => setHoveredMenu(cat.categoria)}
              onMouseLeave={() => setHoveredMenu(null)}
              style={{
                width:"100%", textAlign:"left", padding:"6px 8px", marginBottom:2,
                cursor:"pointer", borderRadius:2,
                border:`1px solid ${isActive ? "rgba(201,168,76,0.4)" : isHovered ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.1)"}`,
                borderLeft:`3px solid ${isActive ? GOLD : isHovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.2)"}`,
                background: isActive ? "rgba(201,168,76,0.1)" : isHovered ? "rgba(201,168,76,0.06)" : "rgba(27,42,74,0.15)",
                transition:"all 0.15s",
              }}>
              <div style={{fontSize:13, fontFamily:"'Georgia',serif",
                color: isActive ? PARCHMENT : isHovered ? "rgba(242,232,208,0.85)" : "rgba(242,232,208,0.55)",
                lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color 0.15s",
              }}>
                {cat.categoria}
              </div>
            </button>
          );
        })}

        <div style={{...GS.metaLabel, marginTop:12, marginBottom:4}}>{TL.confessions}</div>
        {wcfAnchors.map((w, i) => {
          const isActive = activeWcf?.cap === w.cap;
          const isHovered = hoveredMenu === w.cap;
          return (
            <button key={i}
              onClick={() => { setActiveWcf(isActive ? null : w); setActiveTheology(null); }}
              onMouseEnter={() => setHoveredMenu(w.cap)}
              onMouseLeave={() => setHoveredMenu(null)}
              style={{
                width:"100%", textAlign:"left", padding:"6px 8px", marginBottom:2,
                cursor:"pointer", borderRadius:2,
                border:`1px solid ${isActive ? "rgba(201,168,76,0.4)" : isHovered ? "rgba(139,58,42,0.4)" : "rgba(201,168,76,0.1)"}`,
                borderLeft:`3px solid ${isActive ? SIENNA : isHovered ? "rgba(139,58,42,0.7)" : "rgba(139,58,42,0.25)"}`,
                background: isActive ? "rgba(139,58,42,0.1)" : isHovered ? "rgba(139,58,42,0.07)" : "rgba(27,42,74,0.15)",
                transition:"all 0.15s",
              }}>
              <div style={{fontSize:10, letterSpacing:1.5, marginBottom:1,
                color: isActive ? GOLD : isHovered ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.45)", transition:"color 0.15s",
              }}>
                {w.cap}
              </div>
              <div style={{fontSize:13,
                color: isActive ? PARCHMENT : isHovered ? "rgba(242,232,208,0.85)" : "rgba(242,232,208,0.55)",
                lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color 0.15s",
              }}>
                {w.titulo}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{flex:1, minWidth:260}}>
        {activeWcf ? (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
              <div style={{width:4, height:36, background:SIENNA, borderRadius:2, flexShrink:0}} />
              <div>
                <div style={{...GS.metaLabel, marginBottom:2, color:"rgba(139,58,42,0.9)"}}>{TL.wcf}</div>
                <div style={{fontSize:20, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>
                  {`${activeWcf.cap} — ${activeWcf.titulo}`}
                </div>
              </div>
            </div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:14}}>
              {activeWcf.doctrinas.map(d => (
                <span key={d} style={{...GS.tag, borderColor:"rgba(139,58,42,0.4)", color:"rgba(200,130,100,0.9)"}}>
                  {categoriaEsToLang[d] || d}
                </span>
              ))}
            </div>
            <div style={{background:"linear-gradient(90deg,rgba(139,58,42,0.1),rgba(139,58,42,0.03))", borderLeft:`3px solid ${SIENNA}`, padding:"16px 18px", borderRadius:"0 3px 3px 0", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:8, color:"rgba(139,58,42,0.8)"}}>{TL.wcfTeaches}</div>
              <div style={{fontSize:15, lineHeight:1.78, color:"rgba(242,232,208,0.85)", fontStyle:"italic"}}>{lv(cap(activeWcf.resumen))}</div>
            </div>
            <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"14px 18px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:10}}>{TL.wcfPassages(bookTitle)}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {activeWcf.genesis.map(v => (
                  <a key={v} href={vu(v)} target="_blank" rel="noopener noreferrer"
                    style={{...GS.versChip, textDecoration:"none", borderColor:"rgba(201,168,76,0.4)", cursor:"pointer"}}>
                    {v}
                  </a>
                ))}
              </div>
            </div>
            <a href={activeWcf.url} target="_blank" rel="noopener noreferrer" style={{
              display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:2,
              color:GOLD, textDecoration:"none", border:`1px solid rgba(201,168,76,0.3)`, padding:"8px 16px", borderRadius:2, background:"rgba(201,168,76,0.06)",
            }}>
              {TL.readFull}
            </a>
            <div style={{marginTop:12, fontSize:11, color:"rgba(242,232,208,0.35)", fontStyle:"italic"}}>
              Haz clic en una doctrina arriba para volver al panel de teología sistemática
            </div>
          </div>
        ) : (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
              <div style={{width:4, height:36, background:GOLD, borderRadius:2, flexShrink:0}} />
              <div>
                <div style={{...GS.metaLabel, marginBottom:2}}>{TL.sysTheology}</div>
                <div style={{fontSize:22, fontWeight:700, color:PARCHMENT, letterSpacing:0.5}}>{activeCat.categoria}</div>
              </div>
            </div>
            <div style={{background:"rgba(27,42,74,0.4)", border:`1px solid rgba(201,168,76,0.18)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:8}}>{TL.whatTeaches(bookTitle)}</div>
              <div style={{fontSize:15, lineHeight:1.75, color:"rgba(242,232,208,0.83)"}}>{lv(cap(activeCat.resumen))}</div>
            </div>
            <div style={{background:"rgba(15,26,48,0.5)", border:`1px solid rgba(201,168,76,0.12)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{TL.keyPassages(bookTitle)}</div>
              {activeCat.pasajes.map((p, i) => (
                <div key={i} style={{display:"flex", gap:14, padding:"11px 0", borderBottom: i < activeCat.pasajes.length-1 ? `1px solid rgba(201,168,76,0.07)` : "none"}}>
                  <div style={{minWidth:94, flexShrink:0, paddingTop:2}}>
                    <VerseLink lang={lang} style={{fontSize:12}}>{p.ref}</VerseLink>
                  </div>
                  <div style={{fontSize:14, lineHeight:1.65, color:"rgba(242,232,208,0.72)"}}>{lv(cap(p.nota))}</div>
                </div>
              ))}
            </div>
            <div style={{background:"linear-gradient(90deg,rgba(139,58,42,0.12),rgba(139,58,42,0.02))", borderLeft:`3px solid ${SIENNA}`, padding:"13px 16px", borderRadius:"0 3px 3px 0"}}>
              <div style={{...GS.metaLabel, marginBottom:7}}>{TL.reformed}</div>
              <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.65, color:"rgba(242,232,208,0.75)"}}>{lv(cap(activeCat.distintivaReformada || ""))}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
