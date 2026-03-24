import { useState, useRef, useEffect } from "react";

// ─── INITIAL NOTE DATA ─────────────────────────────────
const INITIAL_NOTES = [
  {
    id: "about",
    title: "About Myself",
    body: "Hey, Ansh here.\n\nA bit of a wanderer but somehow still consistent with the things that actually matter. Most days are a mix of coding, gym, and falling into random AI rabbit holes that start with \"just 5 more minutes\" and somehow end with a completely new idea and no sense of time. Backend, AI, and just understanding how different startups work are where most of the energy goes. Building something from scratch, breaking it, and then figuring it out at 2 AM just feels way more real than anything taught in a classroom.\n\nCurrently in final year at NIT Jalandhar, but never really fit into the usual \"study this → get job → repeat\" loop. It always felt better to just try things, mess up, and learn on the way. That's exactly how LinkedOut happened. Applying to jobs was honestly taking too much time, so instead of complaining, just built something around it. It started casually, no big plan, but kept improving it and now it's actually being used by a lot of classmates. Built it, deployed it, broke things multiple times, fixed them, and picked up backend concepts and some hands-on experience with tools like AWS along the way.\n\nThe vibe is pretty simple — chill, sarcastic, and not someone who likes taking things too seriously unless needed. Humor does most of the heavy lifting, especially when debugging starts feeling personal. Anime is also a big part of the personality — probably explains the random motivation bursts and the belief that things somehow work out in the end. And yeah, occasional shitposting on Reddit and X happens when things get a bit too serious.\n\nThere's also this habit of getting curious and going all in. Sometimes that means too many ideas at once, sometimes overthinking, but it always leads to learning something useful. Prefer building over planning, action over overthinking, and fast-moving environments where things actually happen — which is why startups feel more real.\n\nAt the end, the goal is simple — enough freedom to explore, keep learning new tech, build things that actually matter, and not feel stuck doing the same thing every day. And yeah, one day buying a piece of land in Japan is definitely happening — no clear plan, just vibes and a lot of anime influence.\n\nAnd finally, before AI takes my job, I want God to take me.",
    attachments: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "books",
    title: "Books",
    body: "My Reading List\n\nClick on any book below to open the PDF.",
    attachments: [
      { id: "pdf1", name: "The AI Engineer's System Design Interview Guide", author: "Lamhot Siagian", cover: "/files/ai-engineer-system-design-cover.png", url: "/files/AI Engineer System Design.pdf" },
      { id: "pdf2", name: "AI Engineering: Building Applications with Foundation Models", author: "Chip Huyen", cover: "/files/ai-engineering-chip-huyen-cover.png", url: "/files/AI Engineering - Building Applications with Foundation Models -Chip Huyen.pdf" },
      { id: "pdf3", name: "Indian Railways Timetable: Trains at a Glance", author: "Indian Railways", cover: "/files/indian-railways-cover.png", url: "/files/Indian Railways - Trains at a glance 2011 - libgen.li.pdf" },
      { id: "pdf4", name: "Knots: More than 50 of the most useful knots", author: "Peter Owen", cover: "/files/knots-cover.png", url: "/files/Knots for Camping Sailing Fishing and Climbing.pdf" },
      { id: "pdf5", name: "Functional Programming in Scala", author: "Paul Chiusano, Rúnar Bjarnason", cover: "/files/functional-programming-scala-cover.png", url: "/files/Manning.Functional.Programming.in.Scala.2014.8.pdf" },
      { id: "pdf6", name: "System Design Interview: An Insider's Guide", author: "Alex Xu", cover: "/files/system-design-interview-cover.png", url: "/files/SystemDesignInterview.pdf" },
    ],
    updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
];

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function getSnippet(body) {
  const lines = body.split("\n").filter((l) => l.trim());
  return lines[1] || "No additional text";
}

// ─── COMPONENT ─────────────────────────────────────────
export function NotepadApp() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeId, setActiveId] = useState(INITIAL_NOTES[0].id);
  const [search, setSearch] = useState("");
  const textareaRef = useRef(null);

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  const activeNote = notes.find((n) => n.id === activeId) || notes[0];

  const updateBody = (val) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? { ...n, body: val, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const addNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "New Note",
      body: "",
      attachments: [],
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const deleteNote = () => {
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== activeId);
    setNotes(remaining);
    setActiveId(remaining[0].id);
  };

  // Auto-update title from first line
  useEffect(() => {
    if (!activeNote) return;
    const firstLine = activeNote.body.split("\n")[0].trim() || "New Note";
    if (firstLine !== activeNote.title) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeId ? { ...n, title: firstLine.slice(0, 40) } : n
        )
      );
    }
  }, [activeNote?.body]);

  // Auto-resize textarea height so it doesn't clip long notes on initial load
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.max(100, textareaRef.current.scrollHeight) + "px";
    }
  }, [activeId, activeNote?.body]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* ── LEFT SIDEBAR ───────────────────────────────── */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "rgba(30, 30, 32, 0.85)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "12px 14px 8px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em" }}>
              On My Mac
            </span>
            <button
              onClick={addNote}
              title="New Note"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
                color: "rgba(255,255,255,0.5)",
                fontSize: "18px",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              ✏️
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                padding: "5px 10px 5px 26px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.8)",
                outline: "none",
              }}
            />
          </div>

          {/* Notes label with count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,220,100,0.95)" }}>Notes</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{filtered.length}</span>
          </div>
        </div>

        {/* Notes List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((note) => {
            const isActive = note.id === activeId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveId(note.id)}
                style={{
                  padding: "12px 14px",
                  cursor: "pointer",
                  background: isActive ? "rgba(255,200,50,0.15)" : "transparent",
                  borderLeft: isActive ? "3px solid rgba(255,200,50,0.8)" : "3px solid transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "rgba(255,220,100,0.95)" : "rgba(255,255,255,0.85)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {note.title}
                  {note.attachments?.length > 0 && " 📎"}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", display: "flex", gap: "6px" }}>
                  <span>{formatDate(note.updatedAt)}</span>
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                    {getSnippet(note.body)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete button at bottom */}
        <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px" }}>
          <button
            onClick={deleteNote}
            title="Delete Note"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.3)",
              fontSize: "16px",
              padding: "4px 6px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,60,60,0.15)";
              e.currentTarget.style.color = "rgba(255,100,100,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "rgba(255,255,255,0.3)";
            }}
          >
            🗑
          </button>
        </div>
      </div>

      {/* ── RIGHT EDITOR ───────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "rgba(20, 20, 22, 0.6)",
          overflowY: "auto",
        }}
      >
        {/* Editor top bar */}
        {activeNote && (
          <div style={{ padding: "10px 20px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)", textAlign: "center", position: "sticky", top: 0, background: "rgba(20, 20, 22, 0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", zIndex: 10 }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              {new Date(activeNote.updatedAt).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}
            </div>
          </div>
        )}

        {/* Text/Content Area */}
        {activeNote && (
          <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", flex: 1 }}>
            <textarea
              ref={textareaRef}
              value={activeNote.body}
              onChange={(e) => updateBody(e.target.value)}
              spellCheck
              style={{
                width: "100%",
                boxSizing: "border-box",
                minHeight: "100px",
                paddingBottom: "20px",
                resize: "none",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "rgba(255,255,255,0.9)",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                overflow: "auto",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />

            {/* Book Covers Vertical List */}
            {activeNote.attachments && activeNote.attachments.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "40px",
                  paddingBottom: "32px",
                }}
              >
                {activeNote.attachments.map((file, idx) => (
                  <div
                    key={file.id}
                    style={{
                      borderBottom: idx !== activeNote.attachments.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                      paddingBottom: "24px",
                      marginBottom: "24px",
                    }}
                  >
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Read ${file.name}`}
                      style={{
                        display: "flex",
                        gap: "24px",
                        textDecoration: "none",
                        color: "rgba(255,255,255,0.9)",
                        transition: "opacity 0.2s",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <div
                        style={{
                          width: "90px",
                          aspectRatio: "2/3",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          borderRadius: "4px 6px 6px 4px",
                          boxShadow: "0 6px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15)",
                          overflow: "hidden",
                          flexShrink: 0,
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {/* Spine indent detail */}
                        <div
                          style={{
                            position: "absolute",
                            left: "3px",
                            top: 0,
                            bottom: 0,
                            width: "2px",
                            background: "rgba(255,255,255,0.4)",
                            zIndex: 10,
                            boxShadow: "1px 0 2px rgba(0,0,0,0.1)",
                          }}
                        />
                        {file.cover ? (
                          <>
                            <img
                              src={file.cover}
                              alt=""
                              style={{ width: "100%", height: "100%", objectFit: "cover", color: "transparent" }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                if (e.currentTarget.nextSibling) {
                                  e.currentTarget.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                            {/* Fallback shown only if image fails to load */}
                            <div style={{ display: "none", textAlign: "center", color: "#999", padding: "10px", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                              <span style={{ fontSize: "24px", display: "block" }}>
                                📚
                              </span>
                            </div>
                          </>
                        ) : (
                          <div style={{ textAlign: "center", color: "#999", padding: "10px" }}>
                            <span style={{ fontSize: "24px", display: "block" }}>
                              📚
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Name and Author Info */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            fontSize: "17px",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            marginBottom: "6px",
                            color: "rgba(255,255,255,0.95)",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                          }}
                        >
                          {file.name}
                        </span>
                        {file.author && (
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.5)",
                              marginBottom: "10px",
                            }}
                          >
                            {file.author}
                          </span>
                        )}
                        <span style={{ fontSize: "12px", color: "#4da6ff", fontWeight: 500 }}>
                          Open PDF Document
                        </span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
