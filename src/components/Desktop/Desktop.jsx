import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { useDesktop } from "../../context/DesktopContext";
import { DesktopIcon } from "./DesktopIcon";
import { User, Mail, FileText, ClipboardList } from "lucide-react";
import { WindowManager } from "../Window/WindowManager";
import { wallpapers } from "../../data/wallpapers";

// Custom Blueprint Chart Icon matching the user's uploaded image
const ProjectBlueprintIcon = ({ size, strokeWidth }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth * 4.5} 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Paper right side */}
    <path d="M32 15 H90 V85 H32" />
    
    {/* Paper left roll (cylinder shape) */}
    <path d="M32 15 C32 5 18 5 18 15 V85 C18 95 32 95 32 85" />
    <path d="M18 15 C18 25 32 25 32 15" />
    <path d="M18 85 C18 75 32 75 32 85" />
    
    {/* Upward Line Chart */}
    <path d="M42 55 L54 42 L64 52 L77 36" />
    
    {/* Solid Arrow Head */}
    <polygon points="66,35 81,32 79,47" fill="currentColor" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="miter" />
    
    {/* Bottom Base Line */}
    <line x1="42" y1="70" x2="80" y2="70" />
  </svg>
);

// Custom Dark Square Contact Icon matching the user's uploaded image
const ContactAppIcon = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    className={className}
  >
    <rect width="100" height="100" rx="22" fill="#2c2c2e" />
    <rect x="0.5" y="0.5" width="99" height="99" rx="21.5" stroke="#FFFFFF" strokeOpacity="0.08" />
    <path d="M72 36H28C25.7909 36 24 37.7909 24 40V60C24 62.2091 25.7909 64 28 64H72C74.2091 64 76 62.2091 76 60V40C76 37.7909 74.2091 36 72 36Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M76 40L50 56.5L24 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Using React nodes for icons to leverage Lucide matching the user's reference exactly.
const desktopItems = [
  { id: "about", title: "About Me", icon: <User size={26} strokeWidth={1.5} />, appId: "about" },
  { id: "projects", title: "Projects", icon: <ProjectBlueprintIcon size={26} strokeWidth={1.5} />, appId: "projects" },
  { id: "contact", title: "Contact", icon: <ContactAppIcon size={34} />, appId: "contact" },
  { id: "resume", title: "Resume", icon: <FileText size={26} strokeWidth={1.5} />, appId: "resume" },
];

export function Desktop() {
  const welcomeRef = useRef(null);
  const videoRef = useRef(null);
  const { openWindow } = useWindowManagerContext();
  const { appComponents, wallpaperId } = useDesktop();
  const wallpaperConfig = useMemo(
    () => wallpapers.find((w) => w.id === wallpaperId) || wallpapers[0],
    [wallpaperId]
  );
  const isVideo = wallpaperConfig?.type === "video";
  const videoSrc = isVideo ? wallpaperConfig?.src : null;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Aggressive video play: try on every ready state, retries, and when tab becomes visible
  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      video.setAttribute("muted", "");
      video.volume = 0;
      const p = video.play();
      if (p && typeof p.then === "function") p.catch(() => { });
    };

    const events = ["loadstart", "loadedmetadata", "loadeddata", "canplay", "canplaythrough", "playing"];
    const onReady = () => tryPlay();
    events.forEach((ev) => video.addEventListener(ev, onReady));

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryPlay();
    const raf = requestAnimationFrame(() => tryPlay());
    const t1 = setTimeout(tryPlay, 100);
    const t2 = setTimeout(tryPlay, 400);
    const t3 = setTimeout(tryPlay, 1200);
    const t4 = setTimeout(tryPlay, 2500);
    const t5 = setTimeout(tryPlay, 5000);

    return () => {
      events.forEach((ev) => video.removeEventListener(ev, onReady));
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [videoSrc]);

  useGSAP(() => {
    gsap.from(".desktop-icon", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)",
      delay: 0.5,
    });
    gsap.from(".desktop-welcome", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });
  }, []);

  useGSAP(() => {
    const el = welcomeRef.current;
    if (!el) return;

    const onOver = (e) => {
      const letter = e.target.closest(".welcome-letter");
      if (letter) {
        gsap.to(letter, {
          scale: 1.14,
          y: -4,
          duration: 0.18,
          ease: "sine.out",
          overwrite: "auto",
          force3D: true,
        });
      }
    };
    const onOut = (e) => {
      const letter = e.target.closest(".welcome-letter");
      if (letter) {
        gsap.to(letter, {
          scale: 1,
          y: 0,
          duration: 0.12,
          ease: "sine.inOut",
          overwrite: "auto",
          force3D: true,
        });
      }
    };

    el.addEventListener("mouseover", onOver);
    el.addEventListener("mouseout", onOut);
    return () => {
      el.removeEventListener("mouseover", onOver);
      el.removeEventListener("mouseout", onOut);
    };
  }, []);

  const openApp = useCallback(
    (appId) => {
      const map = {
        about: { id: "about", title: "About Me", componentId: "about" },
        projects: { id: "projects", title: "Projects", componentId: "projects" },
        contact: { id: "contact", title: "Contact", componentId: "contact" },
        resume: { id: "resume", title: "Resume.pdf", componentId: "resume" },
        skills: { id: "skills", title: "Skills", componentId: "skills" },
        terminal: { id: "terminal", title: "Terminal", componentId: "terminal" },
      };
      const app = map[appId];
      if (app && appComponents?.[app.componentId]) {
        openWindow(app.id, app.title, appComponents[app.componentId]);
      }
    },
    [openWindow, appComponents]
  );

  return (
    <div
      className="desktop relative w-full h-full overflow-hidden"
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        backgroundColor: isVideo ? "transparent" : undefined,
      }}
    >
      {isVideo && videoSrc ? (
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
        />
      ) : null}
      {!isVideo && wallpaperConfig?.src ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${wallpaperConfig.src})` }}
        />
      ) : null}
      {!wallpaperConfig?.src ? (
        <div className="absolute inset-0 bg-black" />
      ) : null}

      {/* Welcome text removed as requested */}

      {/* Right Vertical Glassy Icons Stack */}
      <div className="absolute top-1/2 right-6 sm:right-8 -translate-y-1/2 flex flex-col gap-4 scale-[0.80] origin-right z-10">
        {desktopItems.map((item) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            iconImage={item.iconImage}
            label={item.title}
            onDoubleClick={() => openApp(item.appId)}
          />
        ))}
      </div>

      <WindowManager />
    </div>
  );
}
