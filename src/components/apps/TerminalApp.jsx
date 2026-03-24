import { useState, useRef, useEffect, useCallback } from "react";
import { useDesktop } from "../../context/DesktopContext";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { siteConfig } from "../../data/siteConfig";

const PROMPT = `${siteConfig.ownerName.toLowerCase()}@MacBook-Pro ~ % `;

// ASCII Art Banner
const BANNER = [
  '<span class="index">Ansh\'s Portfolio Terminal — @2026</span>',
  "",
  "  ╔═══════════════════════════════════════════════╗",
  "  ║     _    _   _ ____  _   _                    ║",
  "  ║    / \\  | \\ | / ___|| | | |                   ║",
  "  ║   / _ \\ |  \\| \\___ \\| |_| |                   ║",
  "  ║  / ___ \\| |\\  |___) |  _  |                   ║",
  "  ║ /_/   \\_\\_| \\_|____/|_| |_|                   ║",
  "  ║                                               ║",
  "  ║  Full Stack Developer • Problem Solver         ║",
  "  ╚═══════════════════════════════════════════════╝",
  "",
  '<span class="color2">Welcome to my interactive web terminal.</span>',
  '<span class="color2">For a list of available commands, type</span> <span class="command">\'help\'</span><span class="color2">.</span>',
];

const HELP = [
  "",
  "  whois         Who is Ansh?",
  "  whoami        Who are you?",
  "  ai            Ask the AI assistant",
  "  social        Display social networks",
  "  secret        Find the password",
  "  projects      View coding projects",
  "  history       View command history",
  "  help          This help",
  "  email         Contact me",
  "  clear         Clear terminal",
  "  banner        Display the header",
  "  matrix        Enter the Matrix",
  "  hack          Hacker mode",
  "  love          Show some love",
  "",
  "  open <app>    Open app (about, projects, contact, gallery, skills)",
  "",
  "  github        Open GitHub",
  "  linkedin      Open LinkedIn",
  "",
];

const WHOIS = [
  "",
  "Hey, I'm Ansh! 👋",
  "I'm a full-stack developer passionate about building beautiful,",
  "performant web experiences that solve real problems.",
  "",
  "With expertise in React, Node.js, Python, TypeScript, and cloud",
  "technologies, I specialize in building scalable web applications.",
  "",
  "I love clean code, great UX, and open source. When I'm not coding,",
  "you'll find me reading books, exploring new tech, or learning something new.",
  "",
];

const WHOAMI = [
  "",
  "The paradox of 'Who am I?' is: we never know, but we constantly find out.",
  "I am a developer, a problem-solver, and a lifelong learner.",
  "",
];

const SOCIAL = [
  "",
  "  github    github.com/annssshhhh01",
  "  linkedin  linkedin.com/in/anshsharma01/",
  "  email     (use 'email' command)",
  "",
];

const SECRET = [
  "",
  "  sudo      Only use if you're admin",
  "  ai        Ask the AI assistant",
  "  matrix    Enter the Matrix",
  "  hack      Hacker mode activated",
  "",
];

const PROJECTS_LIST = [
  "",
  "  🖥️  macOS Portfolio  — This interactive desktop you're using now",
  "  💻 Project Two      — Update with your real project",
  "  🚀 Project Three    — Update with your real project",
  "  ⚡ Project Four     — Update with your real project",
  "",
  "  (Update these in TerminalApp.jsx with your real projects!)",
  "",
];

const AI_RESPONSES = [
  "I'm an AI assistant created by Ansh. How can I help you today?",
  "That's an interesting question! Let me think about that...",
  "Based on my training data, I'd suggest exploring the available commands.",
  "I'm here to assist you with any questions about Ansh's portfolio.",
  "Have you tried the 'secret' command? There might be hidden features!",
  "I can help you navigate this terminal. Try 'help' for more options.",
  "I'm constantly learning and evolving, just like the code that created me.",
];

function addLinesToState(setLines, lines, className = "text-gray-300", delayMs = 60, idRef = null) {
  lines.forEach((line, i) => {
    setTimeout(() => {
      const id = idRef ? ++idRef.current : i;
      setLines((prev) => [...prev, { id, text: line, className }]);
    }, i * delayMs);
  });
}

function addLine(setLines, text, className = "text-gray-300", delayMs = 0, idRef = null) {
  const push = () => {
    const id = idRef ? ++idRef.current : Math.random();
    setLines((prev) => [...prev, { id, text, className }]);
  };
  if (delayMs > 0) {
    setTimeout(push, delayMs);
  } else {
    push();
  }
}

export function TerminalApp() {
  const { appComponents } = useDesktop();
  const { openWindow, focusedId } = useWindowManagerContext();
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [passwordMode, setPasswordMode] = useState(false);
  const [password, setPassword] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const didInit = useRef(false);
  const lineIdRef = useRef(0);
  const [hScroll, setHScroll] = useState({ scrollLeft: 0, scrollWidth: 0, clientWidth: 0 });
  const hScrollTrackRef = useRef(null);
  const dragStartRef = useRef(null);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    setLines(
      BANNER.map((line) => ({
        id: lineIdRef.current++,
        text: line,
        className: "text-emerald-400",
      }))
    );
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    if (focusedId === "terminal") inputRef.current?.focus();
  }, [focusedId]);

  const syncHScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setHScroll({
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
      const t = setTimeout(syncHScroll, 50);
      return () => clearTimeout(t);
    }
  }, [lines, syncHScroll]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncHScroll();
    const onScroll = () => syncHScroll();
    const onResize = () => syncHScroll();
    el.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(syncHScroll);
      ro.observe(el);
    }
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [lines, syncHScroll]);

  const handleHScrollTrackClick = useCallback(
    (e) => {
      const el = scrollRef.current;
      const track = hScrollTrackRef.current;
      if (!el || !track || hScroll.scrollWidth <= hScroll.clientWidth) return;
      const rect = track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      const targetLeft = ratio * (hScroll.scrollWidth - hScroll.clientWidth);
      el.scrollTo({ left: targetLeft, behavior: "smooth" });
    },
    [hScroll]
  );

  const handleHScrollThumbMouseDown = useCallback((e) => {
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 };
    const onMove = (e2) => {
      if (!dragStartRef.current || !scrollRef.current) return;
      const el = scrollRef.current;
      const dx = e2.clientX - dragStartRef.current.x;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const newLeft = Math.max(0, Math.min(maxScroll, dragStartRef.current.scrollLeft + dx));
      el.scrollLeft = newLeft;
      dragStartRef.current = { x: e2.clientX, scrollLeft: newLeft };
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const runCommand = useCallback(
    (cmd) => {
      const rawCmd = cmd.trim();
      const c = rawCmd.toLowerCase();
      if (!c) {
        setLines((prev) => [
          ...prev,
          { id: lineIdRef.current++, text: PROMPT, className: "text-amber-200/90" },
        ]);
        return;
      }

      if (!passwordMode) {
        setCommandHistory((prev) => [...prev, rawCmd]);
        setHistoryIndex(-1);
        setLines((prev) => [
          ...prev,
          { id: lineIdRef.current++, text: PROMPT + rawCmd, className: "text-gray-400" },
        ]);
      }

      switch (c) {
        case "help":
          addLinesToState(setLines, HELP, "text-gray-300", 40, lineIdRef);
          break;
        case "whois":
          addLinesToState(setLines, WHOIS, "text-gray-300", 50, lineIdRef);
          break;
        case "whoami":
          addLinesToState(setLines, WHOAMI, "text-gray-300", 50, lineIdRef);
          break;
        case "ai": {
          const msg = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
          addLine(setLines, "  🤖 AI: " + msg, "text-emerald-400", 80, lineIdRef);
          addLine(setLines, "", "", 200, lineIdRef);
          break;
        }
        case "sudo":
          addLine(setLines, "  Oh no, you're not admin...", "text-amber-400", 80, lineIdRef);
          setTimeout(() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank"), 1000);
          addLine(setLines, "", "", 400, lineIdRef);
          break;
        case "social":
          addLinesToState(setLines, SOCIAL, "text-gray-300", 40, lineIdRef);
          break;
        case "secret":
          setPasswordMode(true);
          addLine(setLines, "  Enter password:", "text-amber-200/90", 80, lineIdRef);
          addLine(setLines, "", "", 120, lineIdRef);
          break;
        case "projects":
          addLinesToState(setLines, PROJECTS_LIST, "text-gray-300", 45, lineIdRef);
          break;
        case "password":
          addLine(setLines, "  Lol! You're joking, right? You're gonna have to try harder than that! 😂", "text-red-400", 100, lineIdRef);
          addLine(setLines, "", "", 200, lineIdRef);
          break;
        case "history":
          addLine(setLines, " ", "", 0, lineIdRef);
          commandHistory.forEach((h, i) => {
            addLine(setLines, "  " + h, "text-gray-400", 60 * (i + 1), lineIdRef);
          });
          addLine(setLines, " ", "text-gray-300", 60 * commandHistory.length + 80, lineIdRef);
          break;
        case "email":
          addLine(setLines, "  Opening mailto...", "text-emerald-400", 0, lineIdRef);
          window.open("mailto:anshsharma@example.com", "_blank");
          addLine(setLines, "", "", 100, lineIdRef);
          break;
        case "clear":
          setLines([]);
          return;
        case "banner":
          addLinesToState(setLines, BANNER, "text-emerald-400", 60, lineIdRef);
          break;
        case "matrix":
          addLine(setLines, "  🔴 ENTERING MATRIX MODE... 🔴", "text-emerald-400", 80, lineIdRef);
          addLine(setLines, "  Wake up, Neo...", "text-gray-400", 280, lineIdRef);
          addLine(setLines, "  The Matrix has you...", "text-gray-400", 480, lineIdRef);
          addLine(setLines, "  Follow the white rabbit.", "text-gray-400", 680, lineIdRef);
          addLine(setLines, "", "", 900, lineIdRef);
          break;
        case "hack":
          addLine(setLines, "  🚨 INITIATING HACKER MODE... 🚨", "text-red-400", 80, lineIdRef);
          addLine(setLines, "  Accessing mainframe...", "text-gray-400", 280, lineIdRef);
          addLine(setLines, "  Bypassing security protocols...", "text-gray-400", 480, lineIdRef);
          addLine(setLines, "  System compromised! 💀", "text-red-400", 680, lineIdRef);
          addLine(setLines, "", "", 900, lineIdRef);
          break;
        case "love":
          addLine(setLines, "  💕 LOVE DETECTED! 💕", "text-pink-400", 80, lineIdRef);
          addLine(setLines, "   ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥", "text-pink-400", 200, lineIdRef);
          addLine(setLines, "   ♥ ♥", "text-pink-400", 300, lineIdRef);
          addLine(setLines, "   ♥ ♥", "text-pink-400", 400, lineIdRef);
          addLine(setLines, "  ♥ I LOVE CODING! 💻 ♥", "text-pink-400", 500, lineIdRef);
          addLine(setLines, "   ♥ ♥", "text-pink-400", 600, lineIdRef);
          addLine(setLines, "   ♥ ♥", "text-pink-400", 700, lineIdRef);
          addLine(setLines, "   ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥", "text-pink-400", 800, lineIdRef);
          addLine(setLines, "", "", 1000, lineIdRef);
          break;
        case "github":
          addLine(setLines, "  Opening GitHub...", "text-emerald-400", 0, lineIdRef);
          window.open("https://github.com/annssshhhh01", "_blank");
          addLine(setLines, "", "", 100, lineIdRef);
          break;
        case "linkedin":
          addLine(setLines, "  Opening LinkedIn...", "text-emerald-400", 0, lineIdRef);
          window.open("https://www.linkedin.com/in/anshsharma01/", "_blank");
          addLine(setLines, "", "", 100, lineIdRef);
          break;
        default:
          if (c.startsWith("open ")) {
            const app = c.slice(5).trim();
            const map = {
              about: ["about", "About"],
              projects: ["projects", "Projects"],
              contact: ["contact", "Contact"],
              gallery: ["gallery", "Photos"],
              skills: ["skills", "Skills"],
            };
            const [id, title] = map[app] || [];
            if (id && appComponents?.[id]) {
              openWindow(id, title, appComponents[id]);
              addLine(setLines, `  Opening ${title}...`, "text-emerald-400", 0, lineIdRef);
              addLine(setLines, "", "", 100, lineIdRef);
            } else {
              setLines((prev) => [
                ...prev,
                { id: lineIdRef.current++, text: `  Unknown app: ${app}. Try: about, projects, contact, gallery, skills`, className: "text-amber-400" },
                { id: lineIdRef.current++, text: "", className: "" },
              ]);
            }
          } else {
            setLines((prev) => [
              ...prev,
              { id: lineIdRef.current++, text: `  zsh: command not found: ${rawCmd}`, className: "text-red-400" },
              { id: lineIdRef.current++, text: "  Type 'help' for available commands.", className: "text-gray-500" },
              { id: lineIdRef.current++, text: "", className: "" },
            ]);
          }
      }
    },
    [passwordMode, commandHistory, appComponents, openWindow]
  );

  const handleKeyDown = (e) => {
    if (passwordMode) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (password === "Banger") {
          addLinesToState(setLines, SECRET, "text-emerald-400", 80, lineIdRef);
          setPasswordMode(false);
          setPassword("");
        } else {
          addLine(setLines, "  Wrong password.", "text-red-400", 0, lineIdRef);
          addLine(setLines, "", "", 80, lineIdRef);
          setPasswordMode(false);
          setPassword("");
        }
      } else if (e.key === "Backspace") {
        setPassword((p) => p.slice(0, -1));
      } else if (e.key.length === 1) {
        setPassword((p) => p + e.key);
      }
      e.preventDefault();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const next = historyIndex + 1;
      if (next < commandHistory.length) {
        setHistoryIndex(next);
        setInput(commandHistory[commandHistory.length - 1 - next]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(commandHistory[commandHistory.length - 1 - next]);
      return;
    }
  };

  const handleChange = (e) => {
    if (!passwordMode) setInput(e.target.value);
  };

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="terminal-app h-full flex flex-col bg-black/40 text-gray-300 font-mono text-sm overflow-hidden rounded-b-lg cursor-text"
      style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Code", monospace' }}
      onClick={focusInput}
      role="application"
      aria-label="Terminal"
    >
      <style>{`
        .terminal-app .terminal-banner-html .index { color: #9ca3af; }
        .terminal-app .terminal-banner-html .color2 { color: #34d399; }
        .terminal-app .terminal-banner-html .command { color: #fbbf24; }
      `}</style>
      <div
        ref={scrollRef}
        className="terminal-output flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 min-h-0"
        style={{ scrollBehavior: "smooth" }}
      >
        {lines.map((line) => (
          <div key={line.id ?? line.text} className={`terminal-line ${line.className || "text-gray-300"}`} style={{ whiteSpace: "pre", fontFamily: "inherit" }}>
            {typeof line.text === "string" && line.text.includes("<span") ? (
              <span dangerouslySetInnerHTML={{ __html: line.text }} className="terminal-banner-html" />
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 bg-black/40 p-2 flex items-center gap-1 shrink-0 min-h-[40px]">
        <span className="text-amber-200/90 shrink-0 select-none">{PROMPT}</span>
        {passwordMode ? (
          <span className="text-gray-400 flex-1 min-w-0">{password.replace(/./g, "•")}</span>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-gray-300 caret-gray-300 min-w-[120px] w-full"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Terminal input"
          />
        )}
      </div>
      {hScroll.scrollWidth > hScroll.clientWidth && (
        <div
          ref={hScrollTrackRef}
          role="scrollbar"
          aria-orientation="horizontal"
          aria-valuenow={hScroll.scrollLeft}
          aria-valuemin={0}
          aria-valuemax={Math.max(0, hScroll.scrollWidth - hScroll.clientWidth)}
          className="shrink-0 h-2 flex items-center px-1 bg-black/40 border-t border-white/5 cursor-pointer"
          onClick={handleHScrollTrackClick}
        >
          <div
            className="h-1.5 rounded-full bg-white/30 hover:bg-white/40 cursor-grab active:cursor-grabbing flex-shrink-0"
            style={{
              width: `${Math.max(10, (hScroll.clientWidth / hScroll.scrollWidth) * 100)}%`,
              marginLeft: `${(hScroll.scrollLeft / hScroll.scrollWidth) * 100}%`,
              transition: "margin-left 120ms ease-out, width 120ms ease-out",
            }}
            onMouseDown={handleHScrollThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
}
