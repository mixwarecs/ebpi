import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { LAPIS, LAPIS_DEEP, PARCHMENT, BIBLE_VERSION, GS, UI } from "../../constants";
import { linkifyVerses } from "../../utils";
import VerseLink from "../VerseLink";

export default function Timeline({ chapterEras, chapters, characters, totalChapters, hasBookEras, eraToLabel, bookData, bookAb, lang, onSelectChar }) {
  const lv = (t) => linkifyVerses(t, lang);
  const [tooltip, setTooltip] = useState(null);
  const [charTooltip, setCharTooltip] = useState(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const TOTAL_W = Math.max(totalChapters * 99, 1200);
  const xOf = (ch) => ((ch - 0.5) / totalChapters) * TOTAL_W;
  // Left/right edges of a chapter's slot (xOf gives the center) — used to size
  // era bands so they span full chapter slots instead of being offset by half a slot.
  const slotLeftEdge = (ch) => ((ch - 1) / totalChapters) * TOTAL_W;

  // Multi-character distribution per chapter:
  //   1 char  → keep original side from data
  //   2 chars → one above, one below (alternate by index)
  //   3+ chars → continue alternating; same-side overflow stacks vertically
  //              with a longer connector (one step further from spine per depth level)
  const STACK_STEP = 95; // px per depth level: 48px circle + ~47px clear gap
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

  // The deepest stack (above or below) determines how tall the timeline panel
  // needs to be so circles + labels never spill past its background. Measured
  // from the real rendered DOM (rather than estimated from font/box constants)
  // so it's exact regardless of font metrics or line-height rounding.
  const spineRef = useRef(null);
  const nodeRefs = useRef({}); // keyed by character id — React nulls out entries on unmount
  const [innerHeight, setInnerHeight] = useState(GS.timelineInner.height);

  useLayoutEffect(() => {
    if (!spineRef.current) return;
    const spineRect = spineRef.current.getBoundingClientRect();
    let maxAbove = 0, maxBelow = 0;
    Object.values(nodeRefs.current).forEach(el => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      maxAbove = Math.max(maxAbove, spineRect.top - r.top);
      maxBelow = Math.max(maxBelow, r.bottom - spineRect.bottom);
    });
    const needed = Math.max(maxAbove, maxBelow) * 2 + 60; // symmetric around spine + safety buffer
    setInnerHeight(Math.max(GS.timelineInner.height, Math.ceil(needed)));
  }, [characters]);

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
        <div style={{...GS.timelineInner, height: innerHeight}}>
          {chapterEras.map((era, i) => {
            const x1 = slotLeftEdge(era.from);
            const x2 = slotLeftEdge(era.to + 1);
            return (
              <div key={i} style={{ position:"absolute", top:0, left:x1, width:x2-x1, height:"100%",
                background:`linear-gradient(90deg,${era.color}10,${era.color}1e)`,
                borderRight:"1px dashed rgba(201,168,76,0.1)" }}>
                <span style={{position:"absolute", top:10, left:10, fontSize:13, letterSpacing:2, color:era.color, whiteSpace:"nowrap", textShadow:"0 1px 4px rgba(0,0,0,0.9)"}}>
                  {hasBookEras ? eraToLabel(era.era) : era.label}
                </span>
              </div>
            );
          })}

          <div ref={spineRef} style={GS.spine} />

          {chapters.map(d => {
            const bookEnName = bookData?.titulo?.en || "Genesis";
            const url = `https://www.biblegateway.com/passage/?search=${bookEnName}+${d.ch}&version=${BIBLE_VERSION[lang] || "NBLA"}&interface=print`;
            return (
              <div key={d.ch}
                style={{ position:"absolute", top:"50%", left:xOf(d.ch), transform:"translate(-50%,-50%)",
                  display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer", zIndex:100 }}
                onMouseEnter={e => setTooltip({ data: d, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip(null)}
                onClick={e => { e.stopPropagation(); window.open(url, "_blank", "noopener,noreferrer"); }}
              >
                <div style={{
                  width:36, height:36, borderRadius:"50%", border:`2px solid ${d.color}`,
                  background:LAPIS_DEEP, display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 10px ${d.color}40`, transition:"transform 0.15s, box-shadow 0.15s",
                }}>
                  <span style={{fontSize:15, fontWeight:700, color:d.color, fontFamily:"'Georgia',serif", lineHeight:1}}>{d.ch}</span>
                </div>
              </div>
            );
          })}

          {characters.map((c, i) => {
            const x = xOf(c.xCh);
            const { side, depth } = getPlacement(i);
            const isAbove = side === "above";
            const cLen = 40 + depth * STACK_STEP;
            return (
              <div key={c.id}
                ref={el => { nodeRefs.current[c.id] = el; }}
                style={{ position:"absolute", left:x, transform:"translateX(-50%)",
                  top:isAbove ? "auto" : "50%", bottom:isAbove ? "50%" : "auto",
                  display:"flex", flexDirection:isAbove ? "column" : "column-reverse", alignItems:"center",
                  zIndex: 20 - depth }}>
                {/* Clickable/hoverable hit-box covers only the label+circle — not the
                    connector below — so it never reaches the spine and overlap the
                    chapter dot (or the opposite node) when two characters share a chapter. */}
                <div
                  onClick={() => onSelectChar(c)}
                  onMouseEnter={e => setCharTooltip({ char: c, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setCharTooltip(null)}
                  style={{ display:"flex", flexDirection:isAbove ? "column" : "column-reverse", alignItems:"center", cursor:"pointer" }}>
                  <div style={{padding:"7px 4px", maxWidth:100, overflow:"hidden"}}>
                    <div style={{fontSize:12, fontWeight:700, letterSpacing:0.5, color:c.color, textAlign:"center", lineHeight:1.15,
                      whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontFamily:"'Georgia',serif",
                      textShadow:"0 1px 5px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)"}}>{c.name}</div>
                  </div>
                  <div style={{width:48, height:48, borderRadius:"50%", border:`2px solid ${c.color}`,
                    background:`linear-gradient(135deg,rgba(22,13,4,0.92),rgba(201,168,76,0.08))`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:14, fontWeight:700, color:c.color,
                    boxShadow:`0 4px 16px rgba(0,0,0,0.5), 0 0 0 3px ${c.color}20`, flexShrink:0}}>
                    {c.init}
                  </div>
                </div>
                <div style={{ width:1, height:cLen, pointerEvents:"none", background: isAbove
                  ? `linear-gradient(180deg,${c.color}80,${c.color}20)`
                  : `linear-gradient(180deg,${c.color}20,${c.color}80)` }} />
              </div>
            );
          })}
        </div>
      </div>

      {tooltip && createPortal(
        <div style={{ ...GS.chTooltip, left:Math.min(tooltip.x + 12, window.innerWidth - 300), top:tooltip.y - 120 }}>
          <div style={GS.chTooltipCh}>{(bookData?.titulo?.[lang] || bookData?.titulo?.es || "GÉNESIS").toUpperCase()} {tooltip.data.ch}</div>
          <div style={GS.chTooltipTitle}>{tooltip.data.title}</div>
          <div style={GS.chTooltipDesc}>{tooltip.data.desc}</div>
          <VerseLink lang={lang} style={{fontSize:9, letterSpacing:2}}>{tooltip.data.verse}</VerseLink>
        </div>
      , document.body)}

      {charTooltip && createPortal(
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
      , document.body)}
    </>
  );
}
