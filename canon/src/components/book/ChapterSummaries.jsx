import { useState, useEffect, useRef } from "react";
import { Share2, Check, ExternalLink } from "lucide-react";
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

const GCS_BASE = "https://storage.googleapis.com/dramatized_bible/audio";

const AUDIO_CONFIG = {
  en: { source: "msb", ext: "mp3" },
  es: { source: "bll",  ext: "m4a" },
  pt: { source: "acf", ext: "mp3" },
};

function getAudioUrl(lang, bookNum, chapter) {
  const cfg = AUDIO_CONFIG[lang];
  if (!cfg) return null;
  return `${GCS_BASE}/${cfg.source}/${bookNum}_${chapter}.${cfg.ext}`;
}

const CHAPTER_LABELS = { es: "Cap.", en: "Ch.", pt: "Cap." };

function ChapterAudio({ lang, bookNum, rangoInicio, rangoFin, shouldAutoPlay, onSectionEnd, onPlayingChange, currentAudioRef }) {
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
          {label} {idx + 1} / {count}
        </div>
      )}
      <audio
        ref={audioRef}
        key={src}
        controls
        preload="none"
        src={src}
        onPlay={() => {
          if (currentAudioRef && currentAudioRef.current && currentAudioRef.current !== audioRef.current) {
            currentAudioRef.current.pause();
          }
          if (currentAudioRef) currentAudioRef.current = audioRef.current;
          onPlayingChange?.(true);
        }}
        onPause={() => {
          if (!currentAudioRef || currentAudioRef.current === audioRef.current) {
            onPlayingChange?.(false);
          }
        }}
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

function ChapterShareButton({ bookNum, lang, chapterIdx }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handleCopy = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#book/${bookNum}/summaries/${chapterIdx}/${lang}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px",
        color: copied ? GOLD : hovered ? "rgba(201,168,76,0.85)" : "rgba(201,168,76,0.35)",
        lineHeight: 0,
        transition: "color 0.2s",
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
    </button>
  );
}

export default function ChapterSummaries({ rawChapters = [], lang = "es", bookNum = 1, initialChapterIdx = null, onChapterChange }) {
  const lv = (t) => linkifyVerses(t, lang);

  const [activeIdx, setActiveIdx] = useState(null);
  const [playingIdx, setPlayingIdx] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(initialChapterIdx);
  const entryRefs = useRef([]);
  const didScrollToInitial = useRef(false);
  const currentAudioRef = useRef(null);

  // Scroll to the newly active entry
  useEffect(() => {
    if (activeIdx !== null && entryRefs.current[activeIdx]) {
      entryRefs.current[activeIdx].scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  // One-time scroll to the deep-linked chapter on mount
  useEffect(() => {
    if (didScrollToInitial.current) return;
    if (initialChapterIdx !== null && entryRefs.current[initialChapterIdx]) {
      didScrollToInitial.current = true;
      entryRefs.current[initialChapterIdx].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Reset when book or language changes
  useEffect(() => { setActiveIdx(null); }, [lang, bookNum]);

  if (!rawChapters.length) return null;

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
            onClick={() => { setHighlightIdx(i); onChapterChange?.(i); }}
            style={{
              cursor: "pointer",
              display: "flex",
              gap: 16,
              padding: (playingIdx === i || highlightIdx === i) ? "14px 14px" : "14px 0",
              margin: (playingIdx === i || highlightIdx === i) ? "2px -14px" : "0",
              borderBottom: (playingIdx === i || highlightIdx === i) ? "none" : (i < rawChapters.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none"),
              outline: (playingIdx === i || highlightIdx === i) ? "1px solid rgba(201,168,76,0.18)" : "none",
              borderRadius: (playingIdx === i || highlightIdx === i) ? 12 : 0,
              background: (playingIdx === i || highlightIdx === i) ? "rgba(201,168,76,0.07)" : "transparent",
              backdropFilter: (playingIdx === i || highlightIdx === i) ? "blur(10px)" : "none",
              boxShadow: (playingIdx === i || highlightIdx === i) ? "0 4px 20px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.12)" : "none",
              transition: "all 0.4s",
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
                onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.color = color; }}
              >
                {chLabel}
                <ExternalLink size={10} style={{ opacity: 0.7 }} />
              </a>
            </div>

            <div style={{
              borderLeft: `3px solid ${(playingIdx === i || highlightIdx === i) ? GOLD : color}`,
              transition: "border-color 0.4s",
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
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                <ChapterShareButton bookNum={bookNum} lang={lang} chapterIdx={i} />
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
                onPlayingChange={(playing) => { setPlayingIdx(playing ? i : null); if (playing) { setHighlightIdx(null); onChapterChange?.(i); } }}
                currentAudioRef={currentAudioRef}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
