import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect } from "react";
import { dockItems } from "../../data/dockItems";

const launchpadApps = dockItems.filter(
  (i) => i.type === "app"
);

export function Launchpad({ isOpen, onClose, onSelectApp }) {
  useGSAP(() => {
    if (!isOpen) return;
    gsap.from(".launchpad-icon", {
      scale: 0,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      ease: "back.out(2)",
    });
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-2xl flex flex-col items-center p-4 sm:p-6 md:p-12 overflow-y-auto"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-label="Launchpad"
    >
      {/* Mobile Cancel Button at Top */}
      <div className="w-full max-w-4xl flex justify-end mb-6 sm:hidden mt-2 px-2">
        <button 
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white text-sm font-medium border border-white/10 backdrop-blur-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-6 sm:gap-6 md:gap-8 w-full max-w-4xl mt-4 sm:mt-12 flex-1 place-content-start sm:place-content-center">
        {launchpadApps.map((item) => (
          <button
            key={item.id}
            type="button"
            className="launchpad-icon flex flex-col items-center justify-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl hover:bg-white/10 transition-colors min-w-[72px]"
            onClick={() => {
              if (item.type === "launchpad") return;
              if (item.type === "app") onSelectApp?.(item);
              onClose();
            }}
          >
            {item.iconImage ? (
              <img 
                src={item.iconImage} 
                alt="" 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-2xl drop-shadow-lg" 
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl bg-white/20 dark:bg-gray-700/40 border border-white/30 drop-shadow-lg overflow-hidden">
                <span className="text-3xl sm:text-4xl text-white">{item.icon ?? "⊞"}</span>
              </div>
            )}
            <span className="text-[11px] sm:text-xs text-white drop-shadow-md font-medium text-center leading-tight">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
