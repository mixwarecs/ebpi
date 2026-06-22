import { useState, useRef } from "react";
import { LAPIS, LAPIS_DEEP, PARCHMENT, BIBLE_VERSION, GS, UI } from "../../constants";
import { linkifyVerses } from "../../utils";
import VerseLink from "../VerseLink";

export default function Timeline({ chapterEras, chapters, characters, totalChapters, hasBookEras, eraToLabel, bookData, bookAb, lang, onSelectChar }) {
  const lv = (t) => linkifyVerses(t, lang);
  const [tooltip, setTooltip] = useState(null);
  const [charTooltip, setCharTooltip] = useState(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const TOTAL_W = Math.max(totalChapters * 120, 1200);
  const xOf = (ch) => ((ch - 0.5) / totalChapters) * TOTAL_W;

  // Multi-character distribution per chapter:
  //   1 char  → keep original side from data
  //   2 chars → one above, one below (alternate by index)
  //   3+ chars → continue alternating; same-side overflow stacks vertically
  //              with a longer connector (one step further from spine per depth level)
  const STACK_STEP = 110; // px per depth level: 72px circle + ~38px clear gap
  const chGroups = {};
  characters.forEach((c, i) => {
    if (!chGroups[c.xCh]) chGroups[c.xCh] = [];
    chGroups[c.xCh].push(i);
  });
  const getPlacement = (charIdx) => {
    const c = characters[charIdx];
    const group = chGroups[c.xCh];
    if (group.length === 1) return { side: c.side, depth: 0 };
    const pos = group.indexOf(charIdx);
    return { side: pos % 2 === 0 ? "above" : "below", depth: Math.floor(pos / 2) };
  };

  const onMouseDown = (e) => {
    dragRef.current.isDown = true;
    dragRef.current.startX = e.pageX - e.currentTarget.offsetLeft;
    dragRef.current.scrollLeft = e.currentTarget.scrollLeft;
    e.currentTarget.style.cursor = "grabbing";
  };
  const onMouseUp = (e) => { dragRef.current.isDown = false; e.currentTarget.style.cursor = "grab"; };
  const onMouseMove = (e) => {
    if (!dragRef.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    e.currentTarget.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX) * 1.5;
  };

  return (
    <>
      <div style={GS.timelineWrap} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseUp} onMouseMove={onMouseMove}>
        <div style={GS.timelineInner}>
          {chapterEras.map((era, i) => {
            const x1 = xOf(era.from);
            const x2 = xOf(era.to + 1);
            return (
              <div key={i} style={{ position:"absolute", top:0, left:x1, width:x2-x1, height:"100%",
                background:`linear-gradient(90deg,${era.color}10,${era.color}1e)`,
                borderRight:"1px dashed rgba(201,168,76,0.1)" }}>
                <span style={{position:"absolute", top:10, left:10, fontSize:13, letterSpacing:2, color:`${era.color}99`, whiteSpace:"nowrap"}}>
                  {hasBookEras ? eraToLabel(era.era) : era.label}
                </span>
              </div>
            );
          })}

          <div style={GS.spine} />

          {chapters.map(d => {
            const bookEnName = bookData?.titulo?.en || "Genesis";
            const url = `https://www.biblegateway.com/passage/?search=${bookEnName}+${d.ch}&version=${BIBLE_VERSION[lang] || "NBLA"}&interface=print`;
            return (
              <div key={d.ch}
                style={{ position:"absolute", top:"50%", left:xOf(d.ch), transform:"translate(-50%,-50%)",
                  display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", zIndex:5 }}
                onMouseEnter={e => setTooltip({ data: d, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
                onClick={e => { e.stopPropagation(); window.open(url, "_blank", "noopener,noreferrer"); }}
              >
                <div style={{
                  width:48, height:48, borderRadius:"50%", border:`2px solid ${d.color}`,
                  background:LAPIS_DEEP, display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 10px ${d.color}40`, transition:"transform 0.15s, box-shadow 0.15s",
                }}>
                  <span style={{fontSize:13, fontWeight:700, color:d.color, fontFamily:"'Georgia',serif", lineHeight:1}}>{d.ch}</span>
                </div>
              </div>
            );
          })}

          {characters.map((c, i) => {
            const x = xOf(c.xCh);
            const { side, depth } = getPlacement(i);
            const isAbove = side === "above";
            const cLen = 55 + depth * STACK_STEP;
            return (
              <div key={c.id}
                onClick={() => onSelectChar(c)}
                onMouseEnter={e => setCharTooltip({ char: c, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setCharTooltip(null)}
                style={{ position:"absolute", left:x, transform:"translateX(-50%)",
                  top:isAbove ? "auto" : "50%", bottom:isAbove ? "50%" : "auto",
                  display:"flex", flexDirection:isAbove ? "column" : "column-reverse", alignItems:"center", cursor:"pointer",
                  zIndex: 20 - depth }}>
                <div style={{padding:"2px 4px", maxWidth:120, overflow:"hidden"}}>
                  <div style={{fontSize:14, fontWeight:600, letterSpacing:0.5, color:c.color, textAlign:"center",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontFamily:"'Georgia',serif"}}>{c.name}</div>
                </div>
                <div style={{width:72, height:72, borderRadius:"50%", border:`2px solid ${c.color}`,
                  background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.1))`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, fontWeight:700, color:c.color,
                  boxShadow:`0 4px 16px rgba(0,0,0,0.5), 0 0 0 3px ${c.color}20`, flexShrink:0}}>
                  {c.init}
                </div>
                <div style={{ width:1, height:cLen, pointerEvents:"none", background: isAbove
                  ? `linear-gradient(180deg,${c.color}80,${c.color}20)`
                  : `linear-gradient(180deg,${c.color}20,${c.color}80)` }} />
              </div>
            );
          })}
        </div>
      </div>

      {tooltip && (
        <div style={{ ...GS.chTooltip, left:Math.min(tooltip.x + 12, window.innerWidth - 300), top:tooltip.y - 120 }}>
          <div style={GS.chTooltipCh}>{(bookData?.titulo?.[lang] || bookData?.titulo?.es || "GÉNESIS").toUpperCase()} {tooltip.data.ch}</div>
          <div style={GS.chTooltipTitle}>{tooltip.data.title}</div>
          <div style={GS.chTooltipDesc}>{tooltip.data.desc}</div>
          <VerseLink lang={lang} style={{fontSize:9, letterSpacing:2}}>{tooltip.data.verse}</VerseLink>
        </div>
      )}

      {charTooltip && (
        <div style={{...GS.chTooltip, left:Math.min(charTooltip.x + 16, window.innerWidth - 320), top:charTooltip.y - 140, maxWidth:300, borderColor:`${charTooltip.char.color}60`}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10, paddingBottom:8, borderBottom:`1px solid rgba(201,168,76,0.15)`}}>
            <div style={{width:32, height:32, borderRadius:"50%", flexShrink:0, border:`1px solid ${charTooltip.char.color}`,
              background:`linear-gradient(135deg,${LAPIS},rgba(201,168,76,0.1))`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:charTooltip.char.color}}>
              {charTooltip.char.init}
            </div>
            <div>
              <div style={{fontSize:9, letterSpacing:3, color:charTooltip.char.color, marginBottom:2}}>{charTooltip.char.badge}</div>
              <div style={{fontSize:15, fontWeight:700, color:PARCHMENT}}>{charTooltip.char.name}</div>
            </div>
          </div>
          <div style={{fontSize:13, lineHeight:1.65, color:"rgba(242,232,208,0.78)", fontStyle:"italic"}}>{lv(charTooltip.char.desc)}</div>
          <div style={{marginTop:10, fontSize:10, letterSpacing:2, color:"rgba(201,168,76,0.45)"}}>
            {UI[lang].characterLabels.bioHint(charTooltip.char.ch[0], charTooltip.char.ch[1], bookAb)}
          </div>
        </div>
      )}
    </>
  );
}
