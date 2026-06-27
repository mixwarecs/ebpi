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
  const activeCat = activeTheology || theology[0] || null;
  const TL = UI[lang].theologyLabels;

  return (
    <div style={{display:"flex", gap:20, flexWrap:"wrap"}}>
      <div style={{display:"flex", flexDirection:"column", gap:3, flexShrink:0, minWidth:190, maxWidth:200}}>
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
                width:"100%", textAlign:"left", padding:"8px 10px", marginBottom:2,
                cursor:"pointer", borderRadius:2,
                border:`1px solid ${isActive ? "rgba(139,90,20,0.5)" : isHovered ? "rgba(139,90,20,0.3)" : "rgba(139,90,20,0.15)"}`,
                borderLeft:`3px solid ${isActive ? "rgba(139,90,20,0.9)" : isHovered ? "rgba(139,90,20,0.5)" : "rgba(139,90,20,0.25)"}`,
                background: isActive ? "rgba(201,168,76,0.12)" : isHovered ? "rgba(201,168,76,0.06)" : "transparent",
                transition:"all 0.15s",
              }}>
              <div style={{fontSize:15, fontFamily:"'Georgia',serif", fontWeight: isActive ? 700 : 500,
                color: isActive ? "rgba(50,22,5,1)" : isHovered ? "rgba(50,22,5,0.85)" : "rgba(70,38,10,0.65)",
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
                width:"100%", textAlign:"left", padding:"8px 10px", marginBottom:2,
                cursor:"pointer", borderRadius:2,
                border:`1px solid ${isActive ? "rgba(139,58,42,0.5)" : isHovered ? "rgba(139,58,42,0.3)" : "rgba(139,58,42,0.15)"}`,
                borderLeft:`3px solid ${isActive ? SIENNA : isHovered ? "rgba(139,58,42,0.6)" : "rgba(139,58,42,0.25)"}`,
                background: isActive ? "rgba(139,58,42,0.1)" : isHovered ? "rgba(139,58,42,0.05)" : "transparent",
                transition:"all 0.15s",
              }}>
              <div style={{fontSize:11, letterSpacing:1.5, fontWeight:700, marginBottom:2,
                color: isActive ? "rgba(100,35,15,1)" : isHovered ? "rgba(100,35,15,0.85)" : "rgba(100,35,15,0.68)", transition:"color 0.15s",
              }}>
                {w.cap}
              </div>
              <div style={{fontSize:15, fontWeight: isActive ? 600 : 400,
                color: isActive ? "rgba(22,8,2,1)" : isHovered ? "rgba(22,8,2,0.90)" : "rgba(40,18,4,0.75)",
                lineHeight:1.25, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color 0.15s",
              }}>
                {w.titulo}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{flex:1, minWidth:260}}>
        {!activeCat ? null : activeWcf ? (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
              <div style={{width:4, height:36, background:SIENNA, borderRadius:2, flexShrink:0}} />
              <div>
                <div style={{...GS.metaLabel, marginBottom:2, color:"rgba(100,35,15,0.95)"}}>{TL.wcf}</div>
                <div style={{fontSize:20, fontWeight:700, color:"rgba(35,15,4,0.92)", letterSpacing:0.5}}>
                  {`${activeWcf.cap} — ${activeWcf.titulo}`}
                </div>
              </div>
            </div>
            <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:14}}>
              {activeWcf.doctrinas.map(d => (
                <span key={d} style={{...GS.tag, borderColor:"rgba(100,35,15,0.35)", color:"rgba(100,35,15,0.88)"}}>
                  {categoriaEsToLang[d] || d}
                </span>
              ))}
            </div>
            <div style={{background:"linear-gradient(90deg,rgba(139,58,42,0.1),rgba(139,58,42,0.03))", borderLeft:`3px solid ${SIENNA}`, padding:"16px 18px", borderRadius:"0 3px 3px 0", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:8, color:"rgba(100,35,15,0.92)"}}>{TL.wcfTeaches}</div>
              <div style={{fontSize:16, lineHeight:1.78, color:"rgba(22,8,2,0.88)", fontStyle:"italic"}}>{lv(cap(activeWcf.resumen))}</div>
            </div>
            <div style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"14px 18px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:10}}>{TL.wcfPassages(bookTitle)}</div>
              <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
                {activeWcf.genesis.map(v => (
                  <a key={v} href={vu(v)} target="_blank" rel="noopener noreferrer"
                    style={{...GS.versChip, textDecoration:"none", cursor:"pointer"}}>
                    {v}
                  </a>
                ))}
              </div>
            </div>
            <a href={activeWcf.url} target="_blank" rel="noopener noreferrer" style={{
              display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'Georgia',serif", fontSize:12, letterSpacing:2, fontWeight:600,
              color:"#1E4A7A", textDecoration:"none", border:`1px solid rgba(30,74,122,0.40)`, padding:"8px 16px", borderRadius:2, background:"rgba(30,74,122,0.07)",
            }}>
              {TL.readFull}
            </a>
            <div style={{marginTop:12, fontSize:12, color:"rgba(65,38,10,0.55)", fontStyle:"italic"}}>
              Haz clic en una doctrina arriba para volver al panel de teología sistemática
            </div>
          </div>
        ) : (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
              <div style={{width:4, height:36, background:"rgba(139,90,20,0.75)", borderRadius:2, flexShrink:0}} />
              <div>
                <div style={{...GS.metaLabel, marginBottom:2}}>{TL.sysTheology}</div>
                <div style={{fontSize:22, fontWeight:700, color:"rgba(35,15,4,0.92)", letterSpacing:0.5}}>{activeCat.categoria}</div>
              </div>
            </div>
            <div style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:8}}>{TL.whatTeaches(bookTitle)}</div>
              <div style={{fontSize:15, lineHeight:1.75, color:"rgba(28,12,3,0.88)"}}>{lv(cap(activeCat.resumen))}</div>
            </div>
            <div style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"18px 20px", marginBottom:14}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{TL.keyPassages(bookTitle)}</div>
              {activeCat.pasajes.map((p, i) => (
                <div key={i} style={{display:"flex", gap:14, padding:"11px 0", borderBottom: i < activeCat.pasajes.length-1 ? `1px solid rgba(139,90,20,0.12)` : "none"}}>
                  <div style={{minWidth:94, flexShrink:0, paddingTop:2}}>
                    <VerseLink lang={lang} style={{fontSize:12}}>{p.ref}</VerseLink>
                  </div>
                  <div style={{fontSize:14, lineHeight:1.65, color:"rgba(35,15,4,0.82)"}}>{lv(cap(p.nota))}</div>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(139,58,42,0.06)", borderLeft:`3px solid ${SIENNA}`, padding:"13px 16px", borderRadius:"0 3px 3px 0"}}>
              <div style={{...GS.metaLabel, marginBottom:7, color:"rgba(100,35,15,0.92)"}}>{TL.reformed}</div>
              <div style={{fontSize:14, fontStyle:"italic", lineHeight:1.65, color:"rgba(35,15,4,0.80)"}}>{lv(cap(activeCat.distintivaReformada || ""))}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
