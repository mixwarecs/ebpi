import { useState, useEffect } from "react";
import { adaptManifestBook } from "./adapters/canonToViewer";
import { GOLD, LAPIS_DEEP, BOOKS, DIVISIONS, DIV_BY_ID, S, UI } from "./constants";
import { tabCellHeight, balancedContiguousSplit } from "./utils";
import BookViewer from "./components/BookViewer";
import IndexPage from "./components/IndexPage";
import DivisionTour from "./components/DivisionTour";
import ebpiLogo from "./assets/ebpi.png";

const OT_BOOKS = BOOKS.filter(b => b.id <= 39);
const NT_BOOKS = BOOKS.filter(b => b.id >= 40);
const LANGS = ["es", "en", "pt"];
const TAB_IDS = ["overview", "theology", "purpose", "canon", "history", "verses", "sources"];

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  if (!raw) return { view: { mode: "index" }, lang: "es" };
  const parts = raw.split("/");
  const last = parts[parts.length - 1];
  const hasLang = LANGS.includes(last);
  const lang = hasLang ? last : "es";
  const path = hasLang ? parts.slice(0, -1) : parts;
  if (path.length === 0 || LANGS.includes(path[0])) return { view: { mode: "index" }, lang };
  const [mode, id, maybeTab] = path;
  if ((mode === "division" || mode === "book") && id) {
    const numId = Number(id);
    const view = { mode, id: isNaN(numId) ? id : numId };
    if (mode === "book") view.tab = (maybeTab && TAB_IDS.includes(maybeTab)) ? maybeTab : "overview";
    return { view, lang };
  }
  return { view: { mode: "index" }, lang };
}

function buildHash(view, lang) {
  if (view.mode === "index") return lang;
  if (view.mode === "book") {
    const t = view.tab && view.tab !== "overview" ? `/${view.tab}` : "";
    return `book/${view.id}${t}/${lang}`;
  }
  return `${view.mode}/${view.id}/${lang}`;
}

export default function CanonShelf() {
  const [view, setView] = useState(() => parseHash().view);
  const [manifest, setManifest] = useState(null);
  const [bookDataCache, setBookDataCache] = useState({});
  const [globalData, setGlobalData] = useState(null);
  const [personasDisplay, setPersonasDisplay] = useState({});
  const [lang, setLang] = useState(() => parseHash().lang);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/data/books-manifest.json").then(r => r.json()).then(setManifest).catch(() => {});
    fetch("/data/canon-global.json").then(r => r.json()).then(setGlobalData).catch(() => {});
    fetch("/data/personas-display.json").then(r => r.json()).then(setPersonasDisplay).catch(() => {});
  }, []);

  useEffect(() => {
    const onPop = () => {
      window.scrollTo(0, 0);
      const { view: v, lang: l } = parseHash();
      setView(v);
      setLang(l);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const activeBooks = manifest
    ? manifest.libros.map(l => adaptManifestBook(l))
    : BOOKS;

  useEffect(() => {
    if (view.mode !== "book") return;
    if (bookDataCache[view.id]) return;
    const book = activeBooks.find(b => b.id === view.id);
    const dataFile = book?.dataFile;
    if (!dataFile) return;
    fetch(`/data/${dataFile}`)
      .then(r => r.json())
      .then(data => setBookDataCache(prev => ({ ...prev, [view.id]: data })))
      .catch(() => {});
  }, [view.mode, view.id, activeBooks]);

  const activeDivisions = manifest
    ? manifest.divisiones.map(d => {
        const divBooks = d.libros.map(id => {
          const l = manifest.libros.find(b => b.id === id);
          return { es: l.titulo[lang] || l.titulo.es, en: l.titulo.en, razon: l.razon[lang] || l.razon.es, id: l.id, ready: l.disponible, div: l.division };
        });
        const first = manifest.libros.find(b => b.id === d.libros[0]);
        const last  = manifest.libros.find(b => b.id === d.libros[d.libros.length - 1]);
        const rango = first.id === last.id
          ? (first.titulo[lang] || first.titulo.es)
          : `${first.titulo[lang] || first.titulo.es} – ${last.titulo[lang] || last.titulo.es}`;
        return {
          ...d,
          titulo: d.nombre[lang] || d.nombre.es,
          tagline: d.tagline[lang] || d.tagline.es,
          resumen: d.resumen[lang] || d.resumen.es,
          fondoHistorico: d.fondoHistorico[lang] || d.fondoHistorico.es,
          porQueAgrupados: d.porQueAgrupados[lang] || d.porQueAgrupados.es,
          epocaPacto: d.epocaPacto[lang] || d.epocaPacto.es,
          enfoqueCristologico: d.enfoqueCristologico[lang] || d.enfoqueCristologico.es,
          distintivaReformada: d.distintivaReformada[lang] || d.distintivaReformada.es,
          rango,
          libros: divBooks,
        };
      })
    : DIVISIONS;

  const activeDivById = Object.fromEntries(activeDivisions.map(d => [d.id, d]));
  const activeOTBooks = activeBooks.filter(b => b.id <= 39);
  const activeNTBooks = activeBooks.filter(b => b.id >= 40);
  const activeOTDivisions = activeDivisions.filter(d => d.testamento === "Antiguo");
  const activeNTDivisions = activeDivisions.filter(d => d.testamento === "Nuevo");

  const navigate = (nextView) => {
    window.scrollTo(0, 0);
    setView(nextView);
    history.pushState(null, "", "#" + buildHash(nextView, lang));
  };

  const changeLang = (l) => {
    setLang(l);
    history.replaceState(null, "", "#" + buildHash(view, l));
  };

  const openDivision = (id) => navigate({ mode: "division", id });
  const changeTab = (tab) => {
    const next = { ...view, tab };
    setView(next);
    history.replaceState(null, "", "#" + buildHash(next, lang));
  };

  const openBook = (book) => {
    if (book.ready) {
      navigate({ mode: "book", id: book.id, tab: "overview" });
    } else {
      openDivision(book.div);
    }
  };
  const goIndex = () => navigate({ mode: "index" });

  const GRID_COLS = 4;
  const renderRail = (books, side) => {
    const heights = books.map(b => tabCellHeight(b[lang] || b.es));
    const columns = balancedContiguousSplit(books, heights, GRID_COLS);
    return (
      <nav style={S.tabRail(side)}>
        <div style={S.railHeader}>
          <div style={S.railTitle}>{side === "left" ? UI[lang].ot : UI[lang].nt}</div>
          <div style={S.railSub}>{UI[lang].books(books.length)}</div>
        </div>
        <div style={S.tabColumns}>
          {columns.map((col, ci) => (
            <div key={ci} style={S.tabColumn}>
              {col.map(b => {
                const d = activeDivById[b.div] || DIV_BY_ID[b.div];
                const active = (view.mode === "book" && view.id === b.id) || (view.mode === "division" && view.id === b.div);
                return (
                  <button key={b.id} style={S.stepTab(d.color, active, tabCellHeight(b[lang] || b.es))} onClick={() => openBook(b)} title={b[lang] || b.es}>
                    <span style={S.stepTabLabel(active, true)}>{b[lang] || b.es}</span>
                    {b.ready && <span style={S.readyDot} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>
    );
  };

  const activeBook = view.mode === "book" ? activeBooks.find(b => b.id === view.id) : null;
  const isBookOpen = activeBook?.ready;
  const activeBookData = activeBook ? (bookDataCache[activeBook.id] || null) : null;

  const u = UI[lang];
  let headerSubtitle = u.headerIndex;
  if (view.mode === "division") {
    const d = activeDivById[view.id];
    if (d) headerSubtitle = u.headerDiv(d.titulo, d.rango);
  } else if (view.mode === "book" && activeBook) {
    headerSubtitle = u.headerBook(activeBook[lang] || activeBook.es);
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={S.outer}>
      <div style={{ position: "relative", width: "100%", maxWidth: 1400, height: 68, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: 18 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", height: 3, background: "linear-gradient(90deg, transparent, #C9A84C, #8B3A2A, #C9A84C, transparent)" }} />
        <img src={ebpiLogo} alt="EBPI" style={{ position: "relative", zIndex: 1, height: 64, width: "auto", opacity: 0.75, filter: "drop-shadow(0 0 7px rgba(201,168,76,0.5)) drop-shadow(0 0 5px rgba(107,63,160,0.45))" }} />
        <button
          onClick={handleShare}
          title="Copy link"
          style={{
            position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
            zIndex: 2,
            background: copied ? GOLD : "rgba(7,13,26,0.92)",
            border: `1px solid ${copied ? GOLD : GOLD}`,
            borderRadius: 20,
            color: copied ? LAPIS_DEEP : GOLD,
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            padding: "6px 14px", cursor: "pointer",
            fontFamily: "'Georgia',serif", transition: "all 0.2s",
            boxShadow: `0 0 10px rgba(201,168,76,0.2)`,
          }}
        >
          {copied ? u.copied : u.share}
        </button>
      </div>
      <div style={S.appHeader}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
          <div style={S.appTitle}>{u.appTitle}</div>
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => changeLang(l)} style={{
                padding: "4px 10px", borderRadius: 3, fontSize: 12, fontWeight: 700, letterSpacing: 1,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'Georgia',serif",
                background: lang === l ? GOLD : "transparent",
                color: lang === l ? LAPIS_DEEP : "rgba(201,168,76,0.55)",
                border: `1px solid ${lang === l ? GOLD : "rgba(201,168,76,0.3)"}`,
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div style={S.headerInstruction}>{headerSubtitle}</div>
      </div>
      <div style={S.bookFrame}>
        <div style={S.book}>
          {!isBookOpen && renderRail(activeOTBooks, "left")}
          {!isBookOpen && <div style={S.gutterShadowLeft} />}
          {!isBookOpen && <div style={S.gutterShadowRight} />}
          {!isBookOpen && <div style={S.gutterLine} />}

          <div style={S.pages}>
            {isBookOpen ? (
              <BookViewer
                onBack={goIndex}
                bookData={activeBookData}
                globalData={globalData}
                personasDisplay={personasDisplay}
                lang={lang}
                activeTab={view.tab || "overview"}
                onTabChange={changeTab}
                manifestBook={activeBook}
                divisionName={(() => {
                  const d = activeDivById[activeBook?.div];
                  if (!d) return "";
                  return lang === "en" ? (d.tituloEn || d.titulo) : lang === "pt" ? (d.tituloPt || d.titulo) : d.titulo;
                })()}
              />
            ) : view.mode === "index" ? (
              <>
                <div style={S.page}>
                  <IndexPage divisions={activeOTDivisions} onSelect={openDivision} side="left" lang={lang} />
                </div>
                <div style={S.page}>
                  <IndexPage divisions={activeNTDivisions} onSelect={openDivision} side="right" lang={lang} />
                </div>
              </>
            ) : view.mode === "division" ? (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <DivisionTour division={activeDivById[view.id]} onSelectBook={openBook} onBack={goIndex} lang={lang} />
                </div>
              </div>
            ) : (
              <div style={S.fullPage}>
                <div style={S.fullPageInner}>
                  <button style={S.backLink} onClick={() => openDivision(activeBook.div)}>← {activeDivById[activeBook.div]?.titulo}</button>
                  <div style={S.comingSoon}>
                    <div style={S.comingSoonTitle}>{u.comingSoon(activeBook[lang] || activeBook.es)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isBookOpen && renderRail(activeNTBooks, "right")}
        </div>
      </div>
      <div style={S.mobileNote}>{u.footer}</div>
    </div>
  );
}
