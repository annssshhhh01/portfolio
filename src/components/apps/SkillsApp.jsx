import { useRef, useEffect } from "react";
import gsap from "gsap";
import { skills } from "../../data/skills";

// Accent color per category for hover glow
const CATEGORY_COLORS = {
  Languages: "#38BDF8",
  "Frameworks & Libraries": "#A78BFA",
  Databases: "#34D399",
  "Cloud & DevOps": "#FB923C",
  "Tools & Platforms": "#F472B6",
};

export function SkillsApp() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Staggered entrance animation for category sections
    const sections = container.querySelectorAll(".skill-section");
    gsap.fromTo(
      sections,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.07 }
    );

    // Staggered entrance for chips
    const chips = container.querySelectorAll(".skill-chip");
    gsap.fromTo(
      chips,
      { opacity: 0, scale: 0.85, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "back.out(1.4)",
        stagger: 0.025,
        delay: 0.15,
      }
    );

    // 3D tilt on individual skill chips
    const listeners = new Map();

    chips.forEach((chip) => {
      const onMove = (e) => {
        const rect = chip.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        gsap.to(chip, {
          duration: 0.2,
          rotateX: ((y - cy) / cy) * -10,
          rotateY: ((x - cx) / cx) * 10,
          scale: 1.12,
          transformPerspective: 500,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(chip, {
          duration: 0.45,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.5)",
        });
      };
      chip.addEventListener("mousemove", onMove);
      chip.addEventListener("mouseleave", onLeave);
      listeners.set(chip, { onMove, onLeave });
    });

    return () => {
      listeners.forEach(({ onMove, onLeave }, chip) => {
        chip.removeEventListener("mousemove", onMove);
        chip.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        background: "rgba(30, 30, 32, 0.55)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        padding: "36px 40px 80px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          Tech Stack
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.38)",
            fontWeight: 400,
          }}
        >
          Technologies I work with on a daily basis.
        </p>
      </div>

      {/* Category Sections */}
      {skills.map((category) => {
        const accent = CATEGORY_COLORS[category.category] || "#38BDF8";
        return (
          <div
            key={category.category}
            className="skill-section"
            style={{
              marginBottom: "32px",
              paddingBottom: "32px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Category Label with accent dot */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 8px ${accent}60`,
                }}
              ></div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.40)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {category.category}
              </span>
            </div>

            {/* Skill Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {category.skills.map((skill) => (
                <div
                  key={skill}
                  className="skill-chip"
                  style={{
                    padding: "9px 20px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.78)",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "default",
                    transformStyle: "preserve-3d",
                    transition:
                      "background 0.25s, border-color 0.25s, color 0.25s, box-shadow 0.25s",
                    letterSpacing: "0.01em",
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${accent}15`;
                    e.currentTarget.style.borderColor = `${accent}45`;
                    e.currentTarget.style.color = accent;
                    e.currentTarget.style.boxShadow = `0 0 20px ${accent}18, 0 4px 12px rgba(0,0,0,0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.78)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
