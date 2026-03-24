import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState, useEffect } from "react";
import { Wifi, Settings, BatteryCharging, Maximize } from "lucide-react";
import { ThemeToggle } from "../shared/ThemeToggle";
import { CalendarWidget } from "./CalendarWidget";
import { siteConfig } from "../../data/siteConfig";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { useDesktop } from "../../context/DesktopContext";

export function Menubar() {
  const formatDateTime = () => {
    const d = new Date();
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    const time = d.toLocaleTimeString("en-US", { hour12: true, hour: "numeric", minute: "2-digit" });
    return `${weekday} ${month} ${day} ${time}`;
  };
  const [dateTime, setDateTime] = useState(formatDateTime);
  const [showCalendar, setShowCalendar] = useState(false);
  const { openWindow } = useWindowManagerContext();
  const { appComponents } = useDesktop();

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useGSAP(() => {
    gsap.from(".menubar", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDateTime(formatDateTime()), 1000);
    return () => clearInterval(t);
  }, []);

  const appIdToComponent = {
    projects: { id: "projects", title: "Projects", componentId: "projects" },
    about: { id: "about", title: "About", componentId: "about" },
    contact: { id: "contact", title: "Contact", componentId: "contact" },
  };

  const handleNavClick = (link) => {
    const app = appIdToComponent[link.appId];
    if (app && appComponents?.[app.componentId]) {
      openWindow(app.id, app.title, appComponents[app.componentId]);
    }
  };

  return (
    <header
      className="menubar fixed top-0 left-0 right-0 z-[100] min-h-9 h-9 flex items-center justify-between px-3 sm:px-4 bg-white/75 dark:bg-[#111111]/70 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/10"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
        paddingRight: "max(0.75rem, env(safe-area-inset-right))",
      }}
    >
      <div className="flex items-center gap-2 sm:gap-5 min-w-0 flex-1">
        <img
          src="/images/appleicon.png"
          alt="Apple"
          className="w-5 h-5 flex-shrink-0 invert dark:invert-0 opacity-95"
          aria-hidden="true"
        />
        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {siteConfig.ownerName}'s Portfolio
        </span>
        <nav className="hidden sm:flex items-center gap-4 lg:gap-6 ml-1 lg:ml-2 flex-shrink-0">
          {siteConfig.navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleNavClick(link)}
              className="text-sm text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Toggle Theme */}
        <div className="[&_svg]:text-gray-700 [&_svg]:dark:text-gray-200">
          <ThemeToggle />
        </div>
        
        {/* Settings */}
        <button 
          onClick={() => appComponents?.settings && openWindow("settings", "System Settings", appComponents.settings)}
          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
          title="System Settings"
        >
          <Settings className="w-4 h-4 text-gray-700 dark:text-gray-200" aria-hidden="true" />
        </button>

        {/* Battery (Unclickable, Green) */}
        <div className="flex items-center justify-center p-1 hidden sm:block">
          <BatteryCharging className="w-4 h-4 text-green-600 dark:text-green-500" aria-hidden="true" />
        </div>

        {/* Wi-Fi (Unclickable) */}
        <div className="flex items-center justify-center p-1 hidden sm:block">
          <Wifi className="w-4 h-4 text-gray-700 dark:text-gray-200" aria-hidden="true" />
        </div>

        {/* Date Time Button */}
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-[11px] sm:text-xs text-gray-800 dark:text-gray-100 tabular-nums font-medium tracking-wide hover:bg-black/5 dark:hover:bg-white/10 px-1.5 py-1 rounded transition-colors"
        >
          {dateTime}
        </button>

        {/* Fullscreen Toggle */}
        <button 
          onClick={toggleFullScreen}
          className="p-1 ml-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-3.5 h-3.5 text-gray-700 dark:text-gray-100" aria-hidden="true" />
        </button>
      </div>

      {/* Render Calendar Dropdown */}
      {showCalendar && (
        <>
          <div 
            className="fixed inset-0 z-[190]" 
            onClick={() => setShowCalendar(false)} 
            aria-hidden="true"
          />
          <CalendarWidget onClose={() => setShowCalendar(false)} />
        </>
      )}
    </header>
  );
}
