import { useState, useEffect, useRef } from "react";
import ebpiLogo from "../assets/ebpi.png";

const GOLD = "#C9A84C";
const PARCHMENT = "#F2E8D0";
const SPINE_W = 42;
const PAGES_W = 18;

const LABELS = {
  es: {
    appName: "Exploración Bíblica\nPanorámica Interactiva",
    subtitle: "66 Libros · Teología Protestante · Reformada ",
    enter: "Abrir  ›",
    continue: "Continuar Lectura  ›",
  },
  en: {
    appName: "Interactive Panoramic\nBible Exploration",
    subtitle: "66 Books · Reformed Theology · Covenant of Grace",
    enter: "Open  ›",
    continue: "Continue Reading  ›",
  },
  pt: {
    appName: "Exploração Bíblica\nPanorâmica Interativa",
    subtitle: "66 Livros · Teologia Reformada · Aliança da Graça",
    enter: "Abrir  ›",
    continue: "Continuar Leitura  ›",
  },
};

export default function SplashScreen({ onEnter }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [bookExitTransform, setBookExitTransform] = useState("none");
  const bookRef = useRef(null);

  const savedLocation = (() => {
    try { return localStorage.getItem("ebpi_last_location"); } catch { return null; }
  })();

  const lang = (() => {
    try {
      const raw = savedLocation || "";
      const last = raw.split("/").pop();
      return ["es", "en", "pt"].includes(last) ? last : "es";
    } catch { return "es"; }
  })();

  const t = LABELS[lang] || LABELS.es;

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleEnter() {
    // Measure book position and compute slide-to-viewport transform
    if (bookRef.current) {
      const r = bookRef.current.getBoundingClientRect();
      const scaleX = window.innerWidth / r.width;
      const scaleY = window.innerHeight / r.height;
      // Translate so the book's center lands on the viewport center, then scale fills the screen
      const tx = window.innerWidth / 2 - (r.left + r.width / 2);
      const ty = window.innerHeight / 2 - (r.top + r.height / 2);
      setBookExitTransform(`translate(${tx}px, ${ty}px) scale(${scaleX}, ${scaleY})`);
    }
    setExiting(true);
    setTimeout(onEnter, 2200);
  }

  // Outer: fades in on mount; fades out after book is open
  const outerOpacity = exiting ? 0 : visible ? 1 : 0;
  const outerTransition = exiting
    ? "opacity 1.0s ease 0.8s"
    : "opacity 0.44s ease";

  // Book shell: slides and scales into the viewport as the cover opens
  const bookTransition = exiting
    ? "transform 1.9s cubic-bezier(0.4, 0, 0.2, 1)"
    : "none";

  // Cover flap: rotates open around the spine (left edge)
  const coverTransform = exiting ? "rotateY(-178deg)" : "rotateY(0deg)";
  const coverTransition = exiting
    ? "transform 1.8s cubic-bezier(0.25, 0.0, 0.55, 1.0)"
    : "none";

  return (
    <div
      onClick={handleEnter}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Table surface
        background:
          "radial-gradient(ellipse at 50% 65%, #311809 0%, #1a0c03 50%, #0d0601 100%)",
        opacity: outerOpacity,
        transition: outerTransition,
        overflow: "hidden",
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Perspective context — no transform here so it doesn't interfere */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", perspective: "1600px" }}
      >
        {/* Book shell — slides & scales into the viewport on open */}
        <div
          ref={bookRef}
          style={{
            position: "relative",
            width: "min(800px, 85vw)",
            height: "min(960px, 92vh)",
            transform: exiting ? bookExitTransform : "none",
            transformStyle: "preserve-3d",
            transition: bookTransition,
          }}
        >
          {/* ── Interior pages (revealed as cover swings open) ── */}
          <div
            style={{
              position: "absolute",
              left: SPINE_W,
              right: PAGES_W,
              top: 0,
              bottom: 0,
              background:
                "repeating-linear-gradient(0deg,#ede1c6 0px,#f6ecda 3px,#e8d9b6 4px,#f1e5cb 7px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(10px, 1.4vw, 13px)",
                color: "#8B6914",
                opacity: 0.30,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textAlign: "center",
                lineHeight: 2,
              }}
            >
              ✦
              <br />
              Soli Deo Gloria
            </div>
          </div>

          {/* ── Spine ── */}
          <div
            style={{
              position: "absolute",
              left: 0, top: 0, bottom: 0,
              width: SPINE_W,
              background:
                "linear-gradient(90deg, #0e0602 0%, #321508 50%, #1e0d05 100%)",
              borderRadius: "5px 0 0 5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 1,
                height: "60%",
                background: `linear-gradient(180deg, transparent, ${GOLD}, transparent)`,
                opacity: 0.22,
              }}
            />
          </div>

          {/* ── Cover flap — hinged at left edge (spine) ── */}
          <div
            style={{
              position: "absolute",
              left: SPINE_W, right: PAGES_W, top: 0, bottom: 0,
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              transform: coverTransform,
              transition: coverTransition,
            }}
          >
            {/* Front face — leather cover */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                backgroundImage: "url('/textures/leather-fine.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderTop: "2px solid rgba(201,168,76,0.22)",
                borderBottom: "2px solid rgba(201,168,76,0.22)",
                borderRight: "2px solid rgba(201,168,76,0.22)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Leather tint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(155deg, rgba(18,8,2,0.46) 0%, rgba(12,6,1,0.55) 100%)",
                }}
              />
              {/* Stitched leather border */}
              <div
                style={{
                  position: "absolute",
                  inset: 14,
                  backgroundImage: [
                    "repeating-linear-gradient(90deg, rgba(201,168,76,0.60) 0px, rgba(201,168,76,0.60) 7px, transparent 7px, transparent 13px)",
                    "repeating-linear-gradient(90deg, rgba(201,168,76,0.60) 0px, rgba(201,168,76,0.60) 7px, transparent 7px, transparent 13px)",
                    "repeating-linear-gradient(0deg,  rgba(201,168,76,0.60) 0px, rgba(201,168,76,0.60) 7px, transparent 7px, transparent 13px)",
                    "repeating-linear-gradient(0deg,  rgba(201,168,76,0.60) 0px, rgba(201,168,76,0.60) 7px, transparent 7px, transparent 13px)",
                  ].join(","),
                  backgroundSize: "13px 2px, 13px 2px, 2px 13px, 2px 13px",
                  backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
                  backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
                  pointerEvents: "none",
                }}
              />

              {/* Cover content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  padding: "0 44px",
                }}
              >
                {/* Top ornament */}
                <div
                  style={{
                    color: GOLD,
                    fontSize: 12,
                    letterSpacing: "0.5em",
                    opacity: 0.55,
                    marginBottom: 28,
                  }}
                >
                  ✦ &nbsp; ✦ &nbsp; ✦
                </div>

                {/* Logo */}
                <img
                  src={ebpiLogo}
                  alt="EBPI"
                  style={{
                    height: "min(100px, 12vh)",
                    width: "auto",
                    marginBottom: 26,
                    filter:
                      "drop-shadow(0 0 14px rgba(201,168,76,0.52)) drop-shadow(0 0 6px rgba(107,63,160,0.40))",
                    opacity: 0.94,
                  }}
                />

                {/* Hairline */}
                <div
                  style={{
                    width: 110,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                    opacity: 0.46,
                    marginBottom: 24,
                  }}
                />

                {/* App name */}
                <div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(20px, 3.6vw, 36px)",
                    fontWeight: 900,
                    color: GOLD,
                    lineHeight: 1.28,
                    letterSpacing: "0.05em",
                    textShadow:
                      "0 2px 16px rgba(201,168,76,0.32), 0 0 44px rgba(201,168,76,0.10)",
                    marginBottom: 20,
                    whiteSpace: "pre-line",
                  }}
                >
                  {t.appName}
                </div>

                {/* Subtitle */}
                <div
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(8px, 1.1vw, 10px)",
                    color: PARCHMENT,
                    opacity: 0.42,
                    letterSpacing: "0.14em",
                    lineHeight: 2,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: 40,
                  }}
                >
                  {t.subtitle}
                </div>

                {/* CTA */}
                <button
                  onClick={handleEnter}
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(10px, 1.4vw, 12px)",
                    letterSpacing: "0.22em",
                    color: GOLD,
                    background: "transparent",
                    border: "1px solid rgba(201,168,76,0.42)",
                    padding: "13px 44px",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    outline: "none",
                    opacity: exiting ? 0 : 1,
                    transition:
                      "opacity 0.15s ease, background 0.2s, border-color 0.2s",
                    pointerEvents: exiting ? "none" : "auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.10)";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.82)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "rgba(201,168,76,0.42)";
                  }}
                >
                  {savedLocation ? t.continue : t.enter}
                </button>

                {/* Bottom ornament */}
                <div
                  style={{
                    color: GOLD,
                    fontSize: 11,
                    letterSpacing: "0.4em",
                    opacity: 0.38,
                    marginTop: 30,
                  }}
                >
                  ✦
                </div>
              </div>
            </div>

            {/* Back face — inner cover (dark leather, seen as cover swings open) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background:
                  "linear-gradient(135deg, #1c0b04 0%, #321408 55%, #190a03 100%)",
                borderLeft: "2px solid rgba(201,168,76,0.08)",
              }}
            />
          </div>

          {/* ── Page edge — right side ── */}
          <div
            style={{
              position: "absolute",
              right: 0, top: 0, bottom: 0,
              width: PAGES_W,
              overflow: "hidden",
              borderRadius: "0 4px 4px 0",
              background:
                "url('/textures/pergament.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderTop: "1px solid rgba(201,168,76,0.18)",
              borderBottom: "1px solid rgba(201,168,76,0.18)",
              borderRight: "1px solid rgba(201,168,76,0.18)",
              boxShadow: "inset -2px 0 6px rgba(0,0,0,0.16)",
            }}
          />
        </div>

        {/* Ground shadow — outside the preserve-3d context so filter works */}
        <div
          style={{
            position: "absolute",
            bottom: -24,
            left: "6%", right: "6%",
            height: 32,
            background: "black",
            borderRadius: "50%",
            filter: "blur(20px)",
            opacity: 0.72,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
