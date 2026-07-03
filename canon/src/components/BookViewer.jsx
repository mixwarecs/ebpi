import { useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Play, ChevronsDown, Share2, BookOpen } from "lucide-react";
import { adaptFuentes, adaptTheology, adaptCapitulos, adaptContextoHistorico, adaptVersiculosClave, adaptAnclasConfesionales, adaptTiposYSombras, adaptPersonajes } from "../adapters/canonToViewer";
import { GOLD, LAPIS, LAPIS_DEEP, PARCHMENT, SIENNA, BOOKS, CHAPTER_ERAS, UI, TABS, GS } from "../constants";
import { linkifyVerses, verseUrl, cap } from "../utils";
import VerseLink from "./VerseLink";
import TheologyTab from "./book/TheologyTab";
import SourcesTab from "./book/SourcesTab";
import Timeline from "./book/Timeline";
import ChapterSummaries from "./book/ChapterSummaries";

export default function BookViewer({ onBack, bookData, globalData, personasDisplay = {}, lang = "es", divisionName, activeTab = "overview", onTabChange, onBottomTabChange, onChapterChange, manifestBook = null, initialBottomTab = "timeline", initialChapterIdx = null }) {
  const lv = (t) => linkifyVerses(t, lang);
  const vu = (r) => verseUrl(r, lang);

  const theology    = bookData ? adaptTheology(bookData.teologiaSistematica, lang) : [];
  const sources     = bookData ? adaptFuentes(bookData.fuentes, lang) : [];
  const chapters    = bookData ? adaptCapitulos(bookData.resumenCapitulos, lang) : [];
  const histCtx     = bookData ? adaptContextoHistorico(bookData.contextoHistorico, lang) : {};
  const keyVerses   = bookData ? adaptVersiculosClave(bookData.versiculosClave, lang) : [];
  const wcfAnchors  = bookData ? adaptAnclasConfesionales(bookData.anclasConfesionales, lang) : [];
  const tiposSombras = bookData ? adaptTiposYSombras(bookData.historiaRedentora?.tiposYSombras, lang) : [];
  const totalChapters = bookData?.capitulosTotal || 50;
  const bookAb      = BOOKS.find(b => b.id === bookData?.id)?.ab || "Gn";
  const characters  = bookData ? adaptPersonajes(bookData.personajes, lang, personasDisplay, totalChapters, bookAb) : [];
  const epochs      = globalData ? (globalData.epocasRedentoras[lang] || globalData.epocasRedentoras.es) : [];
  const bookTitle   = (bookData?.titulo?.[lang] || bookData?.titulo?.es || "").toUpperCase();
  const IDIOMA_TRANS = { "Hebreo": { en: "Hebrew", pt: "Hebraico" }, "Griego": { en: "Greek", pt: "Grego" }, "Arameo": { en: "Aramaic", pt: "Aramaico" }, "Hebreo y Arameo": { en: "Hebrew and Aramaic", pt: "Hebraico e Aramaico" } };
  const idiomaLabel = (raw) => { if (!raw) return raw; const t = IDIOMA_TRANS[raw]; return t?.[lang] || raw; };

  const categoriaEsToLang = {};
  (bookData?.teologiaSistematica || []).forEach(e => {
    if (e.categoria && typeof e.categoria === "object")
      categoriaEsToLang[e.categoria.es] = e.categoria[lang] || e.categoria.es;
  });

  const hasBookEras = chapters.some(c => c.era && c.era.trim());
  const chapterEras = hasBookEras ? (() => {
    const groups = [];
    for (const c of chapters) {
      const prev = groups[groups.length - 1];
      if (prev && prev.era === c.era) { prev.to = c.ch; }
      else groups.push({ from: c.ch, to: c.ch, color: c.color, era: c.era, label: c.era });
    }
    return groups;
  })() : CHAPTER_ERAS;

  const esEpochs   = globalData?.epocasRedentoras?.es || [];
  const bookEpoca  = bookData?.historiaRedentora?.epoca || "";
  const highlightIdx = esEpochs.findIndex(ep => ep.title === bookEpoca || ep.title.includes(bookEpoca));
  const eraToLabel = (eraName) => {
    const idx = esEpochs.findIndex(ep => ep.title === eraName);
    return idx >= 0 ? (epochs[idx]?.title || eraName) : eraName;
  };
  const { HIST_PERIODO: HP = "", HIST_GEOGRAFIA: HG = [], HIST_CIVILIZACIONES: HC = [],
          HIST_ANE: HA = [], HIST_CRONOLOGIA: HCr = [], HIST_CONTROVERSIAS: HCo = "" } = histCtx;

  const [activeChar, setActiveChar] = useState(null);
  const [bottomTab, setBottomTab] = useState(initialBottomTab);

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return (
        <div style={GS.prose}>
          {bookData && (bookData.resumenGeneral?.[lang] || bookData.resumenGeneral?.es || bookData.proposito[lang] || bookData.proposito.es)
            ? lv(cap(bookData.resumenGeneral?.[lang] || bookData.resumenGeneral?.es || bookData.proposito[lang] || bookData.proposito.es))
            : <>
                Génesis es <strong style={{color:GOLD}}>el libro de los principios</strong>: el origen del cosmos, de la humanidad, del pecado y de la redención.
                Como primer libro del canon, provee los fundamentos absolutos de toda la teología bíblica.
                Sin Génesis, ningún otro libro del canon tiene fundamento narrativo ni teológico —
                es <strong style={{color:GOLD}}>la raíz de la que brota toda la historia redentora</strong>.
                <br/><br/>
                El libro se estructura en torno a diez secciones <em>toledot</em> («estas son las generaciones de...»),
                que funcionan como columnas vertebrales de la narrativa. La primera mitad (Gn 1–11) narra los orígenes universales:
                la creación, la caída, el diluvio y Babel. La segunda mitad (Gn 12–50) registra el origen del pueblo elegido
                a través de <strong style={{color:GOLD}}>los cuatro patriarcas: Abraham, Isaac, Jacob y José</strong>.
                <br/><br/>
                El arco narrativo corre desde «En el principio creó Dios los cielos y la tierra» ({lv("Gn 1:1")})
                hasta «José murió… y lo embalsamaron y lo pusieron en un ataúd en Egipto» ({lv("Gn 50:26")}) —
                de la creación perfecta a la muerte en tierra extranjera, aguardando la promesa de retorno.
              </>
          }
        </div>
      );

      case "theology": return (
        <TheologyTab theology={theology} wcfAnchors={wcfAnchors} bookTitle={bookTitle} categoriaEsToLang={categoriaEsToLang} lang={lang} />
      );

      case "purpose": {
        const PL = UI[lang].purposeLabels;
        return (
          <div>
            <div style={GS.prose}>
              {lv(cap(bookData?.proposito?.[lang] || bookData?.proposito?.es || ""))}
            </div>
            <div style={GS.audienceBox}>
              <div style={{...GS.metaLabel, marginBottom:8}}>{PL.audience}</div>
              <div style={{fontStyle:"italic", fontSize:16, color:"rgba(22,8,2,0.85)", lineHeight:1.68}}>
                {lv(bookData?.destinatario?.[lang] || bookData?.destinatario?.es || "")}
              </div>
            </div>
          </div>
        );
      }

      case "canon": {
        const CL = UI[lang].canonLabels;
        const christText = bookData?.historiaRedentora?.enfoqueCristologico?.[lang]
          || bookData?.historiaRedentora?.enfoqueCristologico?.es || "";
        return (
          <div>
            <div style={{...GS.metaLabel, marginBottom:18}}>{CL.position}</div>
            <div style={GS.epochRow}>
              {epochs.map((ep, i) => {
                const hl = i === highlightIdx;
                return (
                  <div key={i} style={{...GS.epoch(hl), ...(i===epochs.length-1 ? GS.epochLast : {})}}>
                    {hl && <div style={{fontSize:11, letterSpacing:1.5, fontWeight:600, color:"rgba(100,68,18,0.92)", marginBottom:5}}>← {bookTitle || "GÉNESIS"}</div>}
                    <div style={GS.epochLabel(hl)}>{ep.label}</div>
                    <div style={GS.epochTitle(hl)}>{ep.title}</div>
                    <div style={GS.epochBooks(hl)}>{ep.books}</div>
                  </div>
                );
              })}
            </div>
            <div style={GS.christBox}>
              <div style={{...GS.metaLabel, marginBottom:8}}>
                {CL.christFocus} —{" "}
                <a href="https://www.thegospelcoalition.org/reviews/book-launched-biblical-theology/" target="_blank" rel="noopener noreferrer"
                  style={{color:"rgba(118,84,22,0.88)", textDecoration:"none", borderBottom:`1px solid rgba(139,90,20,0.4)`, letterSpacing:1}}>
                  {CL.biblicalTheology}
                </a>
              </div>
              <div style={{fontStyle:"italic", fontSize:16, color:"rgba(22,8,2,0.88)", lineHeight:1.78}}>{lv(christText)}</div>
            </div>
            <div style={{...GS.metaLabel, marginBottom:12}}>{CL.typesShadows}</div>
            <div style={GS.typesGrid}>
              {tiposSombras.map((t, i) => (
                <div key={i} style={GS.typeItem}>
                  <span style={{color:"rgba(100,68,18,0.82)", fontSize:11, flexShrink:0, marginTop:1}}>✦</span>
                  <span>{lv(t)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "history": {
        const HL = UI[lang].historyLabels;
        return (
          <div>
            <div style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"18px 20px", marginBottom:20}}>
              <div style={{...GS.metaLabel, marginBottom:8}}>{HL.period}</div>
              <div style={{fontSize:16, lineHeight:1.78, color:"rgba(22,8,2,0.88)"}}>{lv(HP)}</div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{HL.chronology}</div>
              <div style={{display:"flex", flexDirection:"column", gap:0}}>
                {HCr.map((e, i) => (
                  <div key={i} style={{display:"flex", flexDirection:"column", gap:5, padding:"13px 0", borderBottom:`1px solid rgba(139,90,20,0.10)`}}>
                    <div style={{display:"flex", alignItems:"baseline", gap:10, flexWrap:"wrap"}}>
                      <div style={{fontSize:13, fontWeight:700, color:"#9B6C1A", letterSpacing:0.5}}>{e.fecha}</div>
                      <VerseLink lang={lang} style={{fontSize:11}}>{e.ref}</VerseLink>
                    </div>
                    <div style={{fontSize:15, color:"rgba(22,8,2,0.85)", lineHeight:1.65}}>{lv(cap(e.evento))}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:10, fontSize:12, fontStyle:"italic", color:"rgba(22,8,2,0.72)"}}>
                {HL.chronologyNote}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{HL.geography}</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
                {HG.map((g, i) => (
                  <div key={i} style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"15px 18px"}}>
                    <div style={{fontSize:15, fontWeight:700, color:"rgba(22,8,2,0.90)", marginBottom:3}}>{g.lugar}</div>
                    <div style={{fontSize:12, letterSpacing:0.5, color:"rgba(22,8,2,0.70)", marginBottom:8}}>{g.moderna}</div>
                    <div style={{fontSize:14, lineHeight:1.65, color:"rgba(22,8,2,0.85)"}}>{lv(cap(g.desc))}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{HL.civilizations}</div>
              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12}}>
                {HC.map((c, i) => (
                  <div key={i} style={{background:"rgba(201,168,76,0.06)", border:`1px solid rgba(139,90,20,0.2)`, borderRadius:3, padding:"15px 18px"}}>
                    <div style={{fontSize:15, fontWeight:700, color:"rgba(22,8,2,0.90)", marginBottom:6}}>{c.nombre}</div>
                    <div style={{fontSize:14, lineHeight:1.65, color:"rgba(22,8,2,0.82)"}}>{lv(cap(c.desc))}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{...GS.metaLabel, marginBottom:12}}>{HL.ane}</div>
              <div style={{display:"flex", flexDirection:"column", gap:0}}>
                {HA.map((a, i) => (
                  <div key={i} style={{display:"flex", flexDirection:"column", gap:5, padding:"15px 0", borderBottom:`1px solid rgba(139,90,20,0.10)`}}>
                    <div style={{fontSize:16, fontWeight:700, color:"rgba(22,8,2,0.90)", lineHeight:1.3}}>{a.nombre}</div>
                    <div style={{fontSize:13, letterSpacing:0.5, color:"rgba(22,8,2,0.70)", marginBottom:2}}>{a.origen}</div>
                    <div style={{fontSize:14, lineHeight:1.68, color:"rgba(22,8,2,0.82)"}}>{lv(cap(a.desc))}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"linear-gradient(90deg,rgba(201,168,76,0.10),rgba(201,168,76,0.02))", borderLeft:`3px solid rgba(139,90,20,0.45)`, padding:"15px 18px", borderRadius:"0 3px 3px 0"}}>
              <div style={{...GS.metaLabel, marginBottom:8}}>{HL.controversies}</div>
              <div style={{fontSize:15, fontStyle:"italic", lineHeight:1.78, color:"rgba(22,8,2,0.85)"}}>{lv(cap(HCo))}</div>
            </div>
          </div>
        );
      }

      case "verses": return (
        <div>
          {keyVerses.map((v, i) => (
            <div key={i} style={{...GS.verseEntry, borderBottom: i<keyVerses.length-1 ? `1px solid rgba(201,168,76,0.1)` : "none"}}>
              <div style={GS.verseRef}>
                <VerseLink lang={lang} style={{fontSize:13}}>{v.ref}</VerseLink>
              </div>
              <div style={{flex:1}}>
                <div style={GS.verseText}>"{v.text}"</div>
                <div style={GS.verseNote}>{lv(v.nota)}</div>
              </div>
            </div>
          ))}
        </div>
      );

      case "sources": return (
        <SourcesTab sources={sources} lang={lang} />
      );

      default: return null;
    }
  };

  return (
    <div style={GS.app}>
      <style>{`
        @keyframes tabFadeArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 0.9; transform: translateX(4px); }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes tabReveal {
          from {
            -webkit-mask-size: 2% 100%;
            mask-size: 2% 100%;
            opacity: 0.3;
          }
          to {
            -webkit-mask-size: 200% 100%;
            mask-size: 200% 100%;
            opacity: 1;
          }
        }
        nav::-webkit-scrollbar { display: none; }
        .canon-tab:not(:last-child) { border-right: 1px solid rgba(139,90,20,0.20) !important; }
        .canon-tab:not([data-active="true"]):hover { background: rgba(201,168,76,0.10) !important; color: rgba(80,45,10,0.90) !important; }
      `}</style>
      <div style={GS.topBar} />

      <div style={{padding:"14px 24px", display:"flex", justifyContent:"center", alignItems:"center"}}>
        <button onClick={onBack} style={{
          fontFamily:"'Georgia',serif", fontSize:12, letterSpacing:2, color:"rgba(55,28,8,0.90)",
          background:"rgba(201,168,76,0.14)", border:"1px solid rgba(139,90,20,0.35)",
          borderRadius:20, cursor:"pointer", padding:"6px 16px 6px 12px",
          display:"inline-flex", alignItems:"center", gap:8,
          transition:"background 0.15s, border-color 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.28)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.14)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; }}>
          {UI[lang].backToShelf}
        </button>
      </div>

      <header style={GS.header}>
        <div style={GS.eyebrow}>{UI[lang].eyebrow}</div>
        <div style={GS.h1}>{(manifestBook ? (manifestBook[lang] || manifestBook.es) : bookData ? (bookData.titulo[lang] || bookData.titulo.es) : "GÉNESIS").toUpperCase()}</div>
        <div style={GS.hebrew}>{bookData ? bookData.tituloOriginal : "בְּרֵאשִׁית"}</div>
        <p style={GS.subline}>
          <em>{bookData ? bookData.transliteracion : "Bereshit"}</em>
          {" — "}
          {bookData ? (bookData.significado[lang] || bookData.significado.es) : UI[lang].subline.split(" — ")[1]}
        </p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:"14px 24px", maxWidth:960, margin:"0 auto", textAlign:"left", padding:"0 20px"}}>
          {UI[lang].metaLabels.map((label, i) => {
            const values = [
              bookData ? `${bookData.tituloOriginal} · ${bookData.transliteracion}` : "בְּרֵאשִׁית · Bereshit",
              bookData ? `${typeof bookData.autor.nombre === "object" ? (bookData.autor.nombre[lang] || bookData.autor.nombre.es) : bookData.autor.nombre} · ${UI[lang].traditional}` : `Moisés · ${UI[lang].traditional}`,
              bookData ? (bookData.año.display[lang] || bookData.año.display.es).replace(/^.*?:\s*/, "") : "c. 1445–1405 a.C.",
              `${divisionName || (bookData ? bookData.division : "Pentateuco")} · ${UI[lang].canonEntry(bookData ? bookData.ordenCanon : 1)}`,
              bookData ? idiomaLabel(bookData.idiomaOriginal) : "Hebreo",
              "NBLA · ESV · ARC",
              bookData?.escritoEn ? (bookData.escritoEn[lang] || bookData.escritoEn.es) : "",
            ];
            return (
              <div key={label} style={{borderLeft:`2px solid rgba(201,168,76,0.3)`, paddingLeft:12}}>
                <div style={{fontSize:10, fontWeight:700, letterSpacing:3, color:"rgba(22,8,2,0.80)", marginBottom:4, textTransform:"uppercase"}}>{label}</div>
                <div style={{fontSize:14, color:"rgba(22,10,3,0.88)", lineHeight:1.4}}>{values[i]}</div>
              </div>
            );
          })}
        </div>
      </header>

      <div style={GS.eraLegend}>
        {chapterEras.map((e, i) => (
          <div key={e.color + i} style={GS.eraDot}>
            <div style={{width:10, height:10, borderRadius:"50%", background:e.color, flexShrink:0}} />
            {hasBookEras ? eraToLabel(e.era) : UI[lang].eraLabels[i]}
          </div>
        ))}
      </div>

      <div style={GS.infoPanel}>
        <div style={GS.tabNavWrap}>
          <nav style={GS.tabNav}>
            {TABS.map((t, i) => (
              <button key={t.id} className="canon-tab" data-active={activeTab===t.id} style={GS.tabBtn(activeTab===t.id)} onClick={() => onTabChange(t.id)} onMouseDown={e => e.preventDefault()}>
                {UI[lang].tabs[i]}
              </button>
            ))}
          </nav>
          <div style={GS.tabNavFade}>
            <span style={{fontSize:16, color:"rgba(201,168,76,0.5)", animation:"tabFadeArrow 1.5s ease-in-out infinite"}}>›</span>
          </div>
        </div>
        <div key={activeTab} style={{
          ...GS.tabPanels,
          animation: "tabReveal 3.6s cubic-bezier(0.22,1,0.36,1) both",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskSize: "2% 100%",
          WebkitMaskPosition: "50% 0",
          WebkitMaskRepeat: "no-repeat",
          maskImage: "linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
          maskSize: "2% 100%",
          maskPosition: "50% 0",
          maskRepeat: "no-repeat",
        }}>
          {renderTab()}
        </div>
      </div>

      <div style={{marginTop:8}}>
        <div style={{
          display:"flex", borderBottom:`1px solid rgba(139,90,20,0.30)`,
          borderTop:`1px solid rgba(139,90,20,0.20)`,
          padding:"0", gap:0,
          backgroundImage:"linear-gradient(rgba(210,170,90,0.28), rgba(185,140,55,0.20)), url('/textures/pergament.jpg')",
          backgroundSize:"cover", backgroundPosition:"center",
        }}>
          {[
            { id:"timeline",   label: UI[lang].timelineLabel },
            { id:"summaries",  label: UI[lang].summariesLabel },
          ].map(({ id, label }) => (
            <button
              key={id}
              className="canon-tab"
              data-active={bottomTab === id}
              onClick={() => { setBottomTab(id); onBottomTabChange?.(id); }}
              onMouseDown={e => e.preventDefault()}
              style={GS.tabBtn(bottomTab === id)}
            >
              {label}
            </button>
          ))}
        </div>

        {bottomTab === "timeline" && (
          <div key="timeline" style={{
            animation:"tabReveal 1.4s cubic-bezier(0.22,1,0.36,1) both",
            WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskSize:"2% 100%", WebkitMaskPosition:"50% 0", WebkitMaskRepeat:"no-repeat",
            maskImage:"linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
            maskSize:"2% 100%", maskPosition:"50% 0", maskRepeat:"no-repeat",
          }}>
          <>
            <div style={{textAlign:"center", padding:"10px 20px 4px", fontSize:13, color:"rgba(22,8,2,0.80)", fontStyle:"italic", letterSpacing:1}}>
              {UI[lang].hint}
            </div>
            <Timeline
              chapterEras={chapterEras}
              chapters={chapters}
              characters={characters}
              totalChapters={totalChapters}
              hasBookEras={hasBookEras}
              eraToLabel={eraToLabel}
              bookData={bookData}
              bookAb={bookAb}
              lang={lang}
              onSelectChar={setActiveChar}
            />
          </>
          </div>
        )}

        {bottomTab === "summaries" && (
          <div key="summaries" style={{
            borderTop:"1px solid rgba(139,90,20,0.15)",
            overflowY:"auto",
            backgroundImage:"linear-gradient(rgba(200,160,80,0.18), rgba(180,130,50,0.12)), url('/textures/pergament.jpg')",
            backgroundSize:"cover",
            backgroundPosition:"center",
            animation:"tabReveal 3.6s cubic-bezier(0.22,1,0.36,1) both",
            WebkitMaskImage:"linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskSize:"2% 100%", WebkitMaskPosition:"50% 0", WebkitMaskRepeat:"no-repeat",
            maskImage:"linear-gradient(90deg, transparent 0%, black 18%, black 82%, transparent 100%)",
            maskSize:"2% 100%", maskPosition:"50% 0", maskRepeat:"no-repeat",
          }}>
            <div style={{
              display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:"6px 16px",
              padding:"14px 24px 10px",
              borderBottom:"1px solid rgba(139,90,20,0.12)",
            }}>
              {(UI[lang].summariesSteps || []).map((text, idx) => {
                const Icon = [ExternalLink, Play, ChevronsDown, Share2, BookOpen][idx] || BookOpen;
                return (
                  <div key={idx} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                    <Icon size={13} color="rgba(0,0,0,0.75)" style={{ flexShrink:0, marginTop:2 }} />
                    <span style={{ fontSize:12, color:"rgba(0,0,0,0.85)", lineHeight:1.5 }}>{text}</span>
                  </div>
                );
              })}
            </div>
            <ChapterSummaries rawChapters={bookData?.resumenCapitulos || []} lang={lang} bookNum={bookData?.ordenCanon || 1} initialChapterIdx={initialChapterIdx} onChapterChange={onChapterChange} />
          </div>
        )}
      </div>

      {activeChar && createPortal(
        <div style={GS.overlay(true)} onClick={e => { if (e.target === e.currentTarget) setActiveChar(null); }}>
          <div style={GS.popupCard}>
            <button style={GS.closeBtn} onClick={() => setActiveChar(null)}>✕</button>
            <div style={GS.popupHeader}>
              <div style={GS.popupAvatar(activeChar.color)}>{activeChar.init}</div>
              <div style={{flex:1}}>
                <div style={GS.popupBadge(activeChar.color)}>{activeChar.badge}</div>
                <div style={GS.popupName}>{activeChar.name}</div>
                <div style={GS.popupChapters(activeChar.color)}>{activeChar.heb}{" · "}{bookAb} {activeChar.ch[0]}–{activeChar.ch[1]}</div>
                <div style={GS.popupDesc}>{lv(activeChar.desc)}</div>
              </div>
            </div>
            <div style={GS.popupBody}>
              {[
                [UI[lang].characterLabels.actions,    activeChar.actions,    "text"],
                [UI[lang].characterLabels.theological, activeChar.theology,  "text"],
                [UI[lang].characterLabels.typeShadow,  activeChar.christType,"banner"],
                [UI[lang].characterLabels.inNT,        activeChar.ntRefs,    "nt"],
              ].map(([title, content, type]) => (
                <div key={title}>
                  <div style={GS.popupSectionTitle}>✦ {title}</div>
                  {type === "text" && <div style={GS.popupText}>{lv(content)}</div>}
                  {type === "banner" && <div style={GS.typeBanner}><div style={{...GS.popupText, fontStyle:"italic"}}>{lv(content)}</div></div>}
                  {type === "nt" && <div style={GS.ntBox}>{lv(content)}</div>}
                </div>
              ))}
              <div style={GS.popupSectionTitle}>✦ {UI[lang].characterLabels.keyVerses}</div>
              <div style={GS.versChips}>
                {activeChar.verses.map(v => (
                  <a key={v} href={vu(v)} target="_blank" rel="noopener noreferrer"
                    style={{...GS.versChip, textDecoration:"none", display:"inline-block", cursor: vu(v) ? "pointer" : "default"}}>
                    {v}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
