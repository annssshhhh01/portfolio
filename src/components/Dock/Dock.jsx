import { useRef, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { dockItems } from "../../data/dockItems";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { useDesktop } from "../../context/DesktopContext";
import { DockIcon } from "./DockIcon";

const appItems = dockItems.filter((i) => i.type === "app");
/** All items shown in the dock (macOS-style: full dock, magnification on hover) */
const mainDockItems = dockItems;

/** 5 key apps shown in the mobile bottom tab bar (limited to prevent overflow) */
const MOBILE_APP_IDS = ["about", "projects", "skills", "terminal", "resume"];
const mobileDockItems = MOBILE_APP_IDS
  .map((id) => dockItems.find((d) => d.id === id))
  .filter(Boolean);

const MAGNIFY = 1.52;
const MAGNIFY_RADIUS = 2.2;

export function Dock({ onOpenLaunchpad }) {
  const dockContainerRef = useRef(null);
  const { openWindow, isOpen, restoreWindow, isMinimized } = useWindowManagerContext();
  const { appComponents } = useDesktop();

  useGSAP(() => {
    gsap.from(".dock", {
      y: 100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  useEffect(() => {
    const container = dockContainerRef.current;
    if (!container) return;

    let cleanup = () => { };
    const frameId = requestAnimationFrame(() => {
      const icons = container.querySelectorAll(".dock-icon-wrap");
      if (!icons.length) return;

      const getScale = (distance) => {
        if (distance <= 0) return MAGNIFY;
        const falloff = Math.max(0, 1 - distance / MAGNIFY_RADIUS);
        return 1 + (MAGNIFY - 1) * falloff;
      };

      const onMouseMove = (e) => {
        const mouseX = e.clientX;
        let nearest = 0;
        let nearestDist = Infinity;
        icons.forEach((icon, j) => {
          const r = icon.getBoundingClientRect();
          const centerX = r.left + r.width / 2;
          const d = Math.abs(mouseX - centerX);
          if (d < nearestDist) {
            nearestDist = d;
            nearest = j;
          }
        });
        const centerIndex = nearest;
        icons.forEach((icon, j) => {
          const distance = Math.abs(j - centerIndex);
          const scale = getScale(distance);
          gsap.to(icon, { scale, duration: 0.18, ease: "power2.out", overwrite: "auto" });
        });
      };

      const onMouseLeave = () => {
        gsap.to(icons, { scale: 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      };

      container.addEventListener("mousemove", onMouseMove);
      container.addEventListener("mouseleave", onMouseLeave);
      cleanup = () => {
        container.removeEventListener("mousemove", onMouseMove);
        container.removeEventListener("mouseleave", onMouseLeave);
      };
    });

    return () => {
      cancelAnimationFrame(frameId);
      cleanup();
    };
  }, []);

  const handleDockClick = useCallback(
    (item) => {
      if (item.type === "launchpad") {
        onOpenLaunchpad?.();
        return;
      }
      if (item.type === "app" && item.componentId) {
        const component = appComponents?.[item.componentId];
        if (isMinimized(item.id)) restoreWindow(item.id);
        else if (isOpen(item.id)) restoreWindow(item.id);
        else if (component) openWindow(item.id, item.title, component);
      }
    },
    [onOpenLaunchpad, isMinimized, isOpen, restoreWindow, openWindow, appComponents]
  );

  return (
    <>
      {/* Desktop Dock - expandable macOS-style with magnification */}
      <div
        className="dock fixed left-1/2 -translate-x-1/2 z-50 hidden md:block"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div
          ref={dockContainerRef}
          className="flex items-end gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-[18px] bg-white/20 backdrop-blur-2xl border border-white/25 max-w-[90vw]"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.1) inset" }}
        >
          {mainDockItems.map((item) => (
            <DockIcon
              key={item.id}
              item={item}
              isActive={item.type === "app" && isOpen(item.id)}
              onClick={handleDockClick}
            />
          ))}
        </div>
      </div>

      {/* Mobile bottom tab bar - iOS style, 44px touch targets, safe area */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-end justify-around bg-black/50 backdrop-blur-2xl border-t border-white/15"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        {mobileDockItems.map((item) => {
          const active = item.type === "app" && isOpen(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDockClick(item)}
              className="flex flex-col items-center justify-center gap-1 pt-2 pb-0.5 flex-1 min-h-[44px] relative"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {item.iconImage ? (
                <img
                  src={item.iconImage}
                  alt=""
                  className={`w-8 h-8 object-contain flex-shrink-0 transition-all duration-150 ${active ? "scale-110" : "opacity-80"}`}
                />
              ) : (
                <span className={`text-2xl leading-none transition-all duration-150 ${active ? "scale-110" : "opacity-80"}`}>
                  {item.icon}
                </span>
              )}
              <span className={`text-[10px] font-medium truncate w-full text-center transition-colors duration-150 ${active ? "text-blue-400" : "text-white/50"}`}>
                {item.title}
              </span>
              {/* Active dot indicator */}
              {active && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
