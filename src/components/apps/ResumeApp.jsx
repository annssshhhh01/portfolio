import { useState, useEffect, useRef } from "react";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FileText, File, ArrowLeft, Download, GraduationCap, Briefcase, Code, Award } from "lucide-react";

export function ResumeApp() {
  const [viewMode, setViewMode] = useState("notion"); // 'notion' | 'pdf'
  const { closeWindow } = useWindowManagerContext();
  const containerRef = useRef(null);

  // Entrance Animation
  useGSAP(() => {
    if (viewMode === "notion" && containerRef.current) {
      gsap.from(".resume-section", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [viewMode]);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (viewMode === "pdf") {
          setViewMode("notion");
        } else {
          closeWindow("resume");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, closeWindow]);

  return (
    <div className="w-full h-full bg-[#0a0604] flex flex-col font-sans relative overflow-hidden text-gray-100">
      
      {/* ─── AMBIENT WARM GLOWS ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[10%] w-[60%] h-[50%] bg-[#3d2015] rounded-full blur-[150px] opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#21110b] rounded-full blur-[120px] opacity-80" />
      </div>

      {/* ─── TOP BAR ─── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {viewMode === "pdf" && (
            <button 
              onClick={() => setViewMode("notion")}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-300 backdrop-blur-sm"
              title="Go Back (Esc)"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex bg-black/40 p-1 rounded-lg backdrop-blur-md border border-white/5 shadow-inner">
            <button
              onClick={() => setViewMode("notion")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "notion" 
                  ? "bg-white/20 text-white shadow-sm scale-[1.02]" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FileText size={16} />
              Interactive View
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === "pdf" 
                  ? "bg-white/20 text-white shadow-sm scale-[1.02]" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <File size={16} />
              Legacy PDF
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-gray-400 hidden sm:block tracking-wide">
            {viewMode === "pdf" ? <span className="kbd bg-white/10 px-1.5 py-0.5 rounded font-mono">ESC</span> : ""}
          </div>
          <a
            href="/files/Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-blue-600/80 hover:bg-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
          </a>
        </div>
      </div>

      {/* ─── CONTENT AREA ─── */}
      <div className="flex-1 overflow-auto relative z-10 custom-scrollbar" ref={containerRef}>
        {viewMode === "pdf" ? (
          <div className="w-full h-full p-4 sm:p-8 flex items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-[1200px] border border-white/10 shadow-2xl rounded-xl overflow-hidden bg-gray-900/50 animate-in zoom-in-95 duration-300">
              <iframe
                src="/files/Resume.pdf"
                className="w-full h-full border-none"
                title="Resume PDF"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-[850px] mx-auto px-6 sm:px-12 py-12 sm:py-20 space-y-12">
            
            {/* ── Hero / Cover ── */}
            <div className="resume-section flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight drop-shadow-sm">
                  Ansh Sharma
                </h1>
                <p className="text-base font-medium text-blue-400 mb-4 tracking-wide">
                  Backend Engineer &nbsp;·&nbsp; FastAPI · Distributed Systems · PostgreSQL · Redis · AWS · Python
                </p>
                
                {/* Contact Tags */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a href="mailto:anshsharma.dev.work@gmail.com" className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    anshsharma.dev.work@gmail.com
                  </a>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    +91 7009313547
                  </span>
                  <a href="https://www.linkedin.com/in/anshsharma01/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    LinkedIn ↗
                  </a>
                  <a href="https://github.com/annssshhhh01" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>

            {/* ── Education ── */}
            <div className="resume-section">
              <div className="flex items-center gap-2 mb-4 text-xl font-bold">
                <GraduationCap className="text-blue-400" />
                <h2>Education</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-1">
                  <h3 className="font-bold text-lg text-white">Dr. B. R. Ambedkar National Institute of Technology Jalandhar</h3>
                  <span className="text-sm text-blue-300 font-semibold bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/20">July 2022 – June 2026</span>
                </div>
                <p className="text-gray-300 font-medium">Bachelor of Technology (B.Tech)</p>
              </div>
            </div>

            {/* ── Experience ── */}
            <div className="resume-section">
              <div className="flex items-center gap-2 mb-4 text-xl font-bold">
                <Briefcase className="text-purple-400" />
                <h2>Experience</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 border-b border-white/5 pb-3">
                  <h3 className="font-bold text-lg text-white">
                    Siemens <span className="opacity-40 px-2">•</span> <span className="font-medium text-gray-300">Technical Intern (Software &amp; Logic Automation)</span>
                  </h3>
                  <span className="text-sm text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/20">June 2025 – August 2025</span>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span>Modelled a real-time closed-loop control system as a <strong>two-interrupt state machine</strong> with zero runtime debugger, eliminating a class of undesirable runtime failures.</span></li>
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span>Factorised all logic as modelled state machines in Siemens PLC/HMI to ensure zero ambiguity in physical actuator states across <strong>3 SCADA workflows</strong>.</span></li>
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span>Traced silent EC2 IP bans to browser fingerprinting and integrated Playwright stealth mode, randomised delays, and cookie reuse, driving the ban rate from <strong>30% to 0%</strong>.</span></li>
                </ul>
              </div>
            </div>

            {/* ── Projects ── */}
            <div className="resume-section">
              <div className="flex items-center gap-2 mb-4 text-xl font-bold">
                <Code className="text-emerald-400" />
                <h2>Featured Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">

                {/* LinkedOut */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-cyan-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">
                      LinkedOut <span className="text-gray-400 text-sm font-normal">— Multi-Tenant AI Outreach System</span>
                    </h3>
                    <div className="flex gap-2 text-sm mt-2 sm:mt-0 font-medium">
                      <a href="https://github.com/annssshhhh01/Linkedin-automation-agent" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition">GitHub ↗</a>
                      <span>|</span>
                      <a href="https://www.linkedout.co.in/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition">Live Demo ↗</a>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-blue-300 mb-4 bg-black/30 border border-blue-500/20 inline-block px-2 py-1 rounded">FastAPI · PostgreSQL · pgvector · AWS EC2/S3 · Redis · OAuth2/JWT · asyncio · Docker · Next.js · Playwright</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Engineered <strong>full multi-tenant isolation</strong> using async FastAPI with ThreadPoolExecutor for thread-barrier task isolation, OAuth2/JWT auth, and RBAC — handling 1,000+ concurrent requests with 1.5 req/day rate limiting.</li>
                    <li>• Integrated <strong>LangGraph human-approval checkpointing</strong> via <code className="text-blue-300 bg-black/30 px-1 rounded">interrupt()</code> and <code className="text-blue-300 bg-black/30 px-1 rounded">MemorySaver</code>, allowing pipelines to pause for review and resume with full state intact.</li>
                    <li>• Claimed 100% of cross-user data exposure — traced global SQLAlchemy session state fixed with per-request scoped sessions, eliminating data leaks across tenants.</li>
                    <li>• Explored full model/multi-tenant isolation — ran FastAPI with ThreadPoolExecutor for browser task isolation, per-user job state tracking, full retry logic, and randomised delays.</li>
                  </ul>
                </div>

                {/* CargoNova AI */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-purple-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-purple-400 transition-colors">
                      CargoNova AI <span className="text-gray-400 text-sm font-normal">— Shipment Validation Pipeline</span>
                    </h3>
                    <div className="flex gap-2 text-sm mt-2 sm:mt-0 font-medium">
                      <a href="https://github.com/annssshhhh01" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition">GitHub ↗</a>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-purple-300 mb-4 bg-black/30 border border-purple-500/20 inline-block px-2 py-1 rounded">LangGraph · Groq (Llama 3) · FastAPI · Streamlit · SQLite · Gmail SMTP · TF-IDF · pdfplumber · Watchdog</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Shipped an <strong>end-to-end AI validation pipeline</strong> that extracts 8 key fields from shipping documents via Llama 3-8B and cross-validates consistency automatically.</li>
                    <li>• Resolved naming inconsistencies and port aliases via <strong>fuzzy matching</strong>, replacing manual 2–4 loop-per-shipment review processes.</li>
                    <li>• Designed a <strong>three-tier decision engine</strong> (auto_approve / flag_for_review / amendment_required) with LLM-drafted reply emails for human-in-the-loop approval.</li>
                    <li>• Implemented <strong>Watchdog + Gmail listener</strong> to fire the full pipeline on new shipments automatically, storing all results in SQLite with a plain-English audit trail.</li>
                  </ul>
                </div>

                {/* VaultAI */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-green-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-green-400 transition-colors">
                      VaultAI <span className="text-gray-400 text-sm font-normal">— Multimodal Document Q&amp;A System</span>
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-green-300 mb-4 bg-black/30 border border-green-500/20 inline-block px-2 py-1 rounded">FastAPI · FAISS · HuggingFace · OpenAI Whisper · LangChain · Groq Llama 3.3 · FFmpeg · AWS S3 · SQLite</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Enabled <strong>timestamp-linked AI playback</strong> by stripping audio via FFmpeg, transcribing with Whisper, and storing segments in PostgreSQL and FAISS for retrieval.</li>
                    <li>• Developed a <strong>retrieval-grounded LangChain + Groq Llama 3.3</strong> system that reduces hallucinations by strictly rejecting prompts without relevant retrieved context.</li>
                    <li>• Implemented <strong>content-type-aware chunking</strong> for full source traceability across documents, audio, and video segments.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ── Skills & Achievements ── */}
            <div className="resume-section grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
              
              {/* Technical Skills */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Code className="text-orange-400 w-5 h-5" /> Technical Skills
                </h2>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-white">Languages:</span> <span className="text-gray-400">Python, C++, JavaScript, SQL</span></div>
                  <div><span className="font-semibold text-white">Backend &amp; APIs:</span> <span className="text-gray-400">FastAPI, Flask, Node.js, REST, Microservices, Asyncio, WebSockets, OAuth2, JWT, Rate Limiting</span></div>
                  <div><span className="font-semibold text-white">Databases:</span> <span className="text-gray-400">PostgreSQL, pgvector, Redis, FAISS, Supabase, AWS S3, SQLite</span></div>
                  <div><span className="font-semibold text-white">Cloud &amp; DevOps:</span> <span className="text-gray-400">AWS (EC2, S3), Docker, Nginx, SSL/TLS, CI/CD, GitHub Actions</span></div>
                  <div><span className="font-semibold text-white">AI/ML:</span> <span className="text-gray-400">PyTorch, HuggingFace, Sentence Transformers, LLM Inference, RAG, LangGraph, LangChain</span></div>
                  <div><span className="font-semibold text-white">Tools:</span> <span className="text-gray-400">React, Next.js, Tailwind CSS, Playwright, Git, Postman, Streamlit</span></div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-400 w-5 h-5" /> Achievements
                </h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2"><span className="text-yellow-400">🏆</span> Global rank ~4,000 out of 30,000+ in a LeetCode Weekly Contest (Top 13%).</li>
                  <li className="flex gap-2"><span className="text-yellow-400">🎯</span> Solved 200+ DSA problems across LeetCode, CodeStudio, and GeeksforGeeks.</li>
                </ul>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
