import { useState } from "react";
import { createPortal } from "react-dom";
import { GS, UI } from "../../constants";

export default function SourcesTab({ sources, lang }) {
  const [activeSource, setActiveSource] = useState(null);
  const SL = UI[lang].sourcesLabels;

  return (
    <>
      <div style={{...GS.metaLabel, marginBottom:16}}>{SL.hint}</div>
      <div style={GS.sourcesGrid}>
        {sources.map((s, i) => (
          <div key={i} onClick={() => setActiveSource(s)} style={{
            ...GS.sourceCard, cursor:"pointer", transition:"all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.border=`1px solid rgba(139,90,20,0.4)`; e.currentTarget.style.background="rgba(201,168,76,0.13)"; }}
            onMouseLeave={e => { e.currentTarget.style.border=`1px solid rgba(139,90,20,0.2)`; e.currentTarget.style.background="rgba(201,168,76,0.06)"; }}
          >
            <div style={GS.sourceTier}>{s.tier}</div>
            <div style={GS.sourceTitle}>{s.title}</div>
            <div style={GS.sourceAuthor}>{s.author}</div>
            <div style={GS.sourceMeta}>{s.meta}</div>
            <div style={{marginTop:10, display:"flex", flexWrap:"wrap", gap:4}}>
              {s.campos.map(c => (
                <span key={c} style={{fontSize:11, letterSpacing:1, fontWeight:500, background:"rgba(139,90,20,0.08)", border:`1px solid rgba(139,90,20,0.32)`, color:"rgba(80,48,10,0.88)", padding:"3px 8px", borderRadius:2}}>{c}</span>
              ))}
            </div>
            <div style={{marginTop:12, fontSize:12, fontWeight:600, color:"rgba(80,48,10,0.80)", letterSpacing:1}}>{SL.viewCard}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:20, fontSize:9, letterSpacing:3, color:"rgba(22,8,2,0.55)", textAlign:"center"}}>{UI[lang].pipeline}</div>

      {activeSource && createPortal(
        <div style={GS.overlay(true)} onClick={e => { if (e.target === e.currentTarget) setActiveSource(null); }}>
          <div style={{...GS.popupCard, maxWidth:680}}>
            <button style={GS.closeBtn} onClick={() => setActiveSource(null)}>✕</button>
            <div style={{padding:"28px 28px 20px", borderBottom:`1px solid rgba(139,90,20,0.18)`}}>
              <div style={{display:"flex", alignItems:"flex-start", gap:18}}>
                <div style={{width:56, height:56, borderRadius:3, flexShrink:0, background:`rgba(235,218,185,0.85)`, border:`1px solid rgba(139,90,20,0.35)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, color:"rgba(100,68,18,0.85)"}}>✦</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:9, letterSpacing:3, color:"rgba(22,8,2,0.70)", marginBottom:4}}>{activeSource.tier} · {activeSource.meta}</div>
                  <div style={{fontSize:22, fontWeight:700, color:"rgba(22,8,2,0.92)", lineHeight:1.2, marginBottom:4}}>{activeSource.title}</div>
                  <div style={{fontSize:15, fontStyle:"italic", color:"rgba(22,8,2,0.72)"}}>{activeSource.author}</div>
                </div>
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:6, marginTop:14}}>
                {activeSource.campos.map(c => (
                  <span key={c} style={{fontSize:10, letterSpacing:1.5, background:"rgba(139,90,20,0.08)", border:`1px solid rgba(139,90,20,0.30)`, color:"rgba(80,48,10,0.88)", padding:"3px 9px", borderRadius:2}}>{c}</span>
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
                      <span style={{color:"rgba(100,68,18,0.80)", fontSize:10, flexShrink:0, marginTop:3}}>◆</span>
                      <span style={{fontSize:14, color:"rgba(22,8,2,0.78)", lineHeight:1.5}}>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href={activeSource.popup.url} target="_blank" rel="noopener noreferrer" style={{
                display:"inline-flex", alignItems:"center", gap:8, fontFamily:"'Georgia',serif", fontSize:11, letterSpacing:2,
                color:"rgba(55,28,8,0.85)", textDecoration:"none", border:`1px solid rgba(139,90,20,0.35)`, padding:"8px 16px", borderRadius:2, background:"rgba(139,90,20,0.08)",
              }}>
                {SL.viewFull}
              </a>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
