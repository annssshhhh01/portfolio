import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LINKS = [
  {
    id: "github",
    title: "GitHub",
    subtitle: "github.com/annssshhhh01",
    url: "https://github.com/annssshhhh01",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    subtitle: "linkedin.com/in/anshsharma01",
    url: "https://www.linkedin.com/in/anshsharma01/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
      </svg>
    ),
  },
  {
    id: "x",
    title: "X (Twitter)",
    subtitle: "x.com/Anshhh_001",
    url: "https://x.com/Anshhh_001",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    title: "Instagram",
    subtitle: "instagram.com/annssshhh",
    url: "https://www.instagram.com/annssshhh/",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
      </svg>
    ),
  },
  {
    id: "email",
    title: "Email",
    subtitle: "anshs.dev.work@gmail.com",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=anshs.dev.work@gmail.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    title: "Portfolio",
    subtitle: "anshsharma.dev",
    url: "https://anshsharma.dev",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

export function ContactApp() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(".social-card", {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.45,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        background: "transparent",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "48px",
        paddingBottom: "48px",
        paddingLeft: "24px",
        paddingRight: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "32px", letterSpacing: "-0.3px" }}>
        Connect With Me
      </h1>

      <div style={{ width: "100%", maxWidth: "580px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-card"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              textDecoration: "none",
              transition: "background 0.18s, border-color 0.18s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Icon circle */}
            <div style={{
              flexShrink: 0,
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.85)",
            }}>
              {link.svg}
            </div>

            {/* Text */}
            <div style={{ marginLeft: "16px", overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "2px" }}>
                {link.title}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {link.subtitle}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ marginLeft: "12px", flexShrink: 0, color: "rgba(255,255,255,0.25)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
