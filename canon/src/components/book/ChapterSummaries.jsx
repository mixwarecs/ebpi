import { useState, useEffect, useRef } from "react";
import { GOLD, PARCHMENT, BOOKS, BIBLE_VERSION } from "../../constants";
import { linkifyVerses } from "../../utils";
import VerseLink from "../VerseLink";

const ERA_COLORS = {
  "Primordial":"#6B7F5E","Patriarcal":"#7A6B4F","Ley":"#8B6914","Éxodo":"#8B6914",
  "Anticipación":"#5A7A5A","Conquista":"#5A7A5A","Monarquía":"#4A6B8A","Exilio":"#7A4A6B",
  "Post-exilio":"#5A7A6B","Intertestamental":"#8A8A8A","Cumplimiento":"#6B5B95",
  "Ministerio":"#C9A84C","Iglesia":"#6B5B95","Aplicación":"#6B5B95","Consumación":"#8B0000",
};
function eraColor(era) {
  for (const [key, color] of Object.entries(ERA_COLORS)) {
    if (era && era.includes(key)) return color;
  }
  return "#7A8FA6";
}

function getAudioUrl(lang, bookNum, chapter) {
  if (lang === "es") return `https://www.wordproaudio.net/bibles/app/audio/6/${bookNum}/${chapter}.mp3`;
  if (lang === "en") return `http://kjv.wordfree.net/bibles/app/audio/1/${bookNum}/${chapter}.mp3`;
  if (lang === "pt") return `https://www.wordproaudio.org/bibles/app/audio/2_BR/${bookNum}/${chapter}.mp3`;
  return null;
}

const CHAPTER_LABELS = { es: "Cap.", en: "Ch.", pt: "Cap." };

function ChapterAudio({ lang, bookNum, rangoInicio, rangoFin, shouldAutoPlay, onSectionEnd }) {
  const count = rangoFin - rangoInicio + 1;
  const [idx, setIdx] = useState(0);
  const audioRef = useRef(null);
  const chapter = rangoInicio + idx;
  const src = getAudioUrl(lang, bookNum, chapter);

  // Reset when lang/book/range changes
  useEffect(() => { setIdx(0); }, [lang, bookNum, rangoInicio, rangoFin]);

  // When idx advances within a range, auto-play the next chapter
  useEffect(() => {
    if (idx > 0 && audioRef.current) {
      audioRef.current.play();
    }
  }, [idx]);

  // Auto-play when parent signals this section should start
  useEffect(() => {
    if (shouldAutoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [shouldAutoPlay]);

  const handleEnded = () => {
    if (idx < count - 1) {
      setIdx(i => i + 1);
    } else {
      onSectionEnd?.();
    }
  };

  const label = CHAPTER_LABELS[lang] || "Cap.";

  return (
    <div style={{ marginTop: 10 }}>
      {count > 1 && (
        <div style={{
          fontSize: 10,
          letterSpacing: 1.5,
          color: "rgba(201,168,76,0.6)",
          marginBottom: 4,
          textTransform: "uppercase",
        }}>
          {label} {chapter} / {count}
        </div>
      )}
      <audio
        ref={audioRef}
        key={src}
        controls
        preload="none"
        src={src}
        onEnded={handleEnded}
        style={{
          width: "100%",
          height: 28,
          filter: "invert(0.85) sepia(0.4) hue-rotate(10deg)",
          opacity: 0.75,
        }}
      />
    </div>
  );
}

export default function ChapterSummaries({ rawChapters = [], lang = "es", bookNum = 1 }) {
  if (!rawChapters.length) return null;
  const lv = (t) => linkifyVerses(t, lang);

  const [activeIdx, setActiveIdx] = useState(null);
  const entryRefs = useRef([]);

  // Scroll to the newly active entry
  useEffect(() => {
    if (activeIdx !== null && entryRefs.current[activeIdx]) {
      entryRefs.current[activeIdx].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  // Reset when book or language changes
  useEffect(() => { setActiveIdx(null); }, [lang, bookNum]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      padding: "20px 28px 28px",
      textAlign: "left",
    }}>
      {rawChapters.map((c, i) => {
        const title = c.titulo?.[lang] || c.titulo?.es || "";
        const desc  = c.descripcion?.[lang] || c.descripcion?.es || "";
        const color = eraColor(c.era);
        const chLabel = c.rangoInicio === c.rangoFin
          ? String(c.rangoInicio)
          : `${c.rangoInicio}–${c.rangoFin}`;
        const bookEnName = BOOKS.find(b => b.id === bookNum)?.en || "Genesis";
        const chRange = c.rangoInicio === c.rangoFin
          ? String(c.rangoInicio)
          : `${c.rangoInicio}-${c.rangoFin}`;
        const chapterUrl = `https://www.biblegateway.com/passage/?search=${bookEnName}+${chRange}&version=${BIBLE_VERSION[lang] || "NBLA"}&interface=print`;

        return (
          <div
            key={i}
            ref={el => { entryRefs.current[i] = el; }}
            style={{
              display: "flex",
              gap: 16,
              padding: "14px 0",
              borderBottom: i < rawChapters.length - 1
                ? "1px solid rgba(201,168,76,0.08)"
                : "none",
            }}
          >
            <div style={{
              flexShrink: 0,
              width: 44,
              textAlign: "right",
              paddingTop: 3,
            }}>
              <a
                href={chapterUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color,
                  opacity: 0.85,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  cursor: "pointer",
                  borderBottom: `1px solid ${color}`,
                  transition: "opacity 0.15s",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 2,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.85"; }}
              >
                {chLabel}
                <span style={{ fontSize: 9, opacity: 0.6, lineHeight: 1 }}>↗</span>
              </a>
            </div>

            <div style={{
              borderLeft: `3px solid ${color}`,
              paddingLeft: 14,
              flex: 1,
              minWidth: 0,
            }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: PARCHMENT,
                lineHeight: 1.35,
                marginBottom: 7,
                letterSpacing: 0.3,
              }}>
                {title}
              </div>

              <div style={{
                fontSize: 16,
                lineHeight: 1.78,
                color: "rgba(242,232,208,0.82)",
                marginBottom: c.versiculoClave ? 10 : 0,
              }}>
                {lv(desc)}
              </div>

              {c.versiculoClave && (
                <div style={{ display: "inline-block" }}>
                  <VerseLink lang={lang} style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    color: GOLD,
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.22)",
                    borderRadius: 2,
                    padding: "2px 7px",
                  }}>
                    {c.versiculoClave}
                  </VerseLink>
                </div>
              )}

              <ChapterAudio
                lang={lang}
                bookNum={bookNum}
                rangoInicio={c.rangoInicio}
                rangoFin={c.rangoFin}
                shouldAutoPlay={activeIdx === i}
                onSectionEnd={() => setActiveIdx(i + 1 < rawChapters.length ? i + 1 : null)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
