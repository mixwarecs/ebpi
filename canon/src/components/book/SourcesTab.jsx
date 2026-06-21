import { useState } from "react";
import { GOLD, LAPIS, GS, UI } from "../../constants";

export default function SourcesTab({ sources, lang }) {
  const [activeSource, setActiveSource] = useState(null);
  const SL = UI[lang].sourcesLabels;

  return (
    <>
      <div style={{...GS.metaLabel, marginBottom:16}}>{SL.hint}</div>
      <div style={GS.sourcesGrid}>
        {sources.map((s, i) => (
          <div key={i} onClick={() => setActiveSource(s)} style={{
            ...GS.sourceCard, cursor:"pointer", border:`1px solid rgba(201,168,76,0.15)`, transition:"all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.border=`1px solid rgba(201,168,76,0.4)`; e.currentTarget.style.background="rgba(27,42,74,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.border=`1px solid rgba(201,168,76,0.15)`; e.currentTarget.style.background="rgba(27,42,74,0.35)"; }}
          >
            <div style={GS.sourceTier}>{s.tier}</div>
            <div style={GS.sourceTitle}>{s.title}</div>
            <div style={GS.sourceAuthor}>{s.author}</div>
            <div style={GS.sourceMeta}>{s.meta}</div>
            <div style={{marginTop:10, display:"flex", flexWrap:"wrap", gap:4}}>
              {s.campos.map(c => (
                <span key={c} style={{fontSize:8, letterSpacing:1.5, background:"rgba(201,168,76,0.07)", border:`1px solid rgba(201,168,76,0.15)`, color:"rgba(201,168,76,0.6)", padding:"2px 6px", borderRadius:2}}>{c}</span>
              ))}
            </div>
            <div style={{marginTop:10, fontSize:10, color:"rgba(201,168,76,0.5)", letterSpacing:1}}>{SL.viewCard}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:20, fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.3)", textAlign:"center"}}>{UI[lang].pipeline}</div>

      {activeSource && (
        <div style={GS.overlay(true)} onClick={e => { if (e.target === e.currentTarget) setActiveSource(null); }}>
          <div style={{...GS.popupCard, maxWidth:680}}>
            <button style={GS.closeBtn} onClick={() => setActiveSource(null)}>✕</button>
            <div style={{padding:"28px 28px 20px", borderBottom:`1px solid rgba(201,168,76,0.2)`}}>
              <div style={{display:"flex", alignItems:"flex-start", gap:18}}>
                <div style={{width:56, height:56, borderRadius:3, flexShrink:0, background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.12))`, border:`1px solid rgba(201,168,76,0.4)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:GOLD}}>✦</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:9, letterSpacing:3, color:"rgba(201,168,76,0.55)", marginBottom:4}}>{activeSource.tier} · {activeSource.meta}</div>
                  <div style={{fontSize:22, fontWeight:700, color:"#F2E8D0", lineHeight:1.2, marginBottom:4}}>{activeSource.title}</div>
                  <div style={{fontSize:15, fontStyle:"italic", color:"rgba(242,232,208,0.7)"}}>{activeSource.author}</div>
                </div>
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:6, marginTop:14}}>
                {activeSource.campos.map(c => (
                  <span key={c} style={{fontSize:9, letterSpacing:2, background:"rgba(201,168,76,0.1)", border:`1px solid rgba(201,168,76,0.3)`, color:GOLD, padding:"3px 9px", borderRadius:2}}>{c}</span>
                ))}
              </div>
            </div>
            <div style={{padding:"20px 28px 28px", overflowY:"auto", maxHeight:"60vh"}}>
              {[
                [SL.aboutAuthor, activeSource.popup.bio, "text"],
                [SL.method, activeSource.popup.metodo, "text"],
                [SL.contribution, activeSource.popup.aportacion, "banner"],
              ].map(([title, content, type]) => (
                <div key={title} style={{marginBottom:20}}>
                  <div style={GS.popupSectionTitle}>✦ {title}</div>
                  {type === "text" && <div style={GS.popupText}>{content}</div>}
                  {type === "banner" && <div style={GS.typeBanner}><div style={{...GS.popupText, fontStyle:"italic"}}>{content}</div></div>}
                </div>
              ))}
              <div style={{marginBottom:20}}>
                <div style={GS.popupSectionTitle}>✦ {SL.mainWorks}</div>
                <div style={{display:"flex", flexDirection:"column", gap:6}}>
                  {activeSource.popup.obras.map((o, i) => (
                    <div key={i} style={{display:"flex", gap:10, alignItems:"flex-start"}}>
                      <span style={{color:GOLD, fontSize:10, flexShrink:0, marginTop:3}}>◆</span>
                      <span style={{fontSize:14, color:"rgba(242,232,208,0.78)", lineHeight:1.5}}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href={activeSource.popup.url} target="_blank" rel="noopener noreferrer" style={{
                display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:2,
                color:GOLD, textDecoration:"none", border:`1px solid rgba(201,168,76,0.3)`, padding:"8px 16px", borderRadius:2, background:"rgba(201,168,76,0.06)",
              }}>
                {SL.viewFull}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
