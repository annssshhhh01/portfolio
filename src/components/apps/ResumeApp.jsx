import { useState, useEffect, useRef } from "react";
import { useWindowManagerContext } from "../../context/WindowManagerContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FileText, File, ArrowLeft, Download, ExternalLink, GraduationCap, Briefcase, Code, Award } from "lucide-react";

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
      
      {/* ─── AMBIENT WARM GLOWS (Matching Reference Image) ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[10%] w-[60%] h-[50%] bg-[#3d2015] rounded-full blur-[150px] opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#21110b] rounded-full blur-[120px] opacity-80" />
      </div>

      {/* ─── MAC-STYLE GLASS TOP BAR (DARK ONLY) ─── */}
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
            {/* Glass iframe container */}
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
            
            {/* Hero / Cover */}
            <div className="resume-section flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-tight drop-shadow-sm">
                  Ansh Sharma
                </h1>
                <p className="text-lg font-medium text-blue-400 mb-4 tracking-wide">
                  Software Engineer & AI Specialist
                </p>
                
                {/* Glassy Contact Tags */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <a href="mailto:anshs.dev.work@gmail.com" className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    anshs.dev.work@gmail.com
                  </a>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    +91 7009213547
                  </span>
                  <a href="https://www.linkedin.com/in/anshsharma01/" target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    LinkedIn ↗
                  </a>
                  <a href="https://github.com/annssshhhh01" target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition backdrop-blur-md">
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Education Block (Glass Card) */}
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

            {/* Experience Block */}
            <div className="resume-section">
              <div className="flex items-center gap-2 mb-4 text-xl font-bold">
                <Briefcase className="text-purple-400" />
                <h2>Experience</h2>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:scale-[1.01] transition-transform duration-300">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 border-b border-white/5 pb-3">
                  <h3 className="font-bold text-lg text-white">
                    Siemens <span className="opacity-40 px-2">•</span> <span className="font-medium text-gray-300">Technical Intern (Software & Logic Automation)</span>
                  </h3>
                  <span className="text-sm text-purple-300 font-semibold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/20">June 2025 – August 2025</span>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span><strong>PLC Optimization:</strong> Analyzed and optimized PLC control logic by identifying redundant operations, improving program readability and reducing maintenance complexity in industrial workflows.</span></li>
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span><strong>State Machine Design:</strong> Applied State Machine design patterns to understand and improve sequential control logic in SCADA-based industrial automation workflows.</span></li>
                  <li className="flex gap-3"><span className="text-purple-400 mt-1">✦</span><span><strong>Modular Restructuring:</strong> Proposed modular restructuring of existing Ladder Logic programs, making them easier for the team to test and debug independently.</span></li>
                </ul>
              </div>
            </div>

            {/* Projects Block */}
            <div className="resume-section">
              <div className="flex items-center gap-2 mb-4 text-xl font-bold">
                <Code className="text-emerald-400" />
                <h2>Featured Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                
                {/* Project 1 */}
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-cyan-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-blue-400 transition-colors">
                      LinkedOut <span className="text-gray-400 text-sm font-normal">— Agentic AI & Automation Engine</span>
                    </h3>
                    <div className="flex gap-2 text-sm mt-2 sm:mt-0 font-medium">
                      <a href="https://github.com/annssshhhh01/Linkedin-automation-agent" target="_blank" className="text-gray-300 hover:text-blue-400 transition">GitHub ↗</a>
                      <span>|</span>
                      <a href="https://www.linkedout.co.in/" target="_blank" className="text-gray-300 hover:text-blue-400 transition">Demo ↗</a>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-blue-300 mb-4 bg-black/30 border border-blue-500/20 inline-block px-2 py-1 rounded">FastAPI, LangGraph, Groq API, AWS (EC2/S3), PostgreSQL (pgvector), Redis, Playwright, Docker</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Built a multi-agent automation system using LangGraph that fully automated LinkedIn outreach for 100+ profiles per day, reducing manual effort by ~90% through concurrent async execution.</li>
                    <li>• Designed a RAG pipeline using pgvector cosine similarity search over parsed resume data, generating personalized connection notes.</li>
                    <li>• Developed a Playwright-based stealth automation layer that successfully bypassed bot detection.</li>
                    <li>• Built a real-time log streaming system using Redis-backed WebSockets, delivering live automation status updates.</li>
                    <li>• Engineered an async FastAPI backend with ThreadPoolExecutor to isolate browser tasks from the main event loop.</li>
                  </ul>
                </div>

                {/* Project 2 */}
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-purple-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-purple-400 transition-colors">
                      Autonomous RAG Engine <span className="text-gray-400 text-sm font-normal">— Generative AI Pipeline</span>
                    </h3>
                    <div className="flex gap-2 text-sm mt-2 sm:mt-0 font-medium">
                      <a href="https://github.com/annssshhhh01/RAG-application" target="_blank" className="text-gray-300 hover:text-purple-400 transition">GitHub ↗</a>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-purple-300 mb-4 bg-black/30 border border-purple-500/20 inline-block px-2 py-1 rounded">FastAPI, React, Groq API, Llama 3.2, LangGraph, FAISS, Sentence Transformers</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Built a RAG pipeline indexing over 500 pages into FAISS using Sentence Transformer embeddings, serving answers via Groq-accelerated Llama 3.2 with under 1s response time.</li>
                    <li>• Implemented Semantic Chunking and Recursive Character Splitting strategies, noticeably improving retrieval relevance over fixed-size chunking.</li>
                    <li>• Designed LangGraph self-correcting agentic loops that validate retrieved context before passing it to the LLM, reducing hallucinated or off-topic answers.</li>
                  </ul>
                </div>

                {/* Project 3 */}
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-green-500/20 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                    <h3 className="font-bold text-xl text-white group-hover:text-green-400 transition-colors">
                      AI Food Nutrition Analyzer <span className="text-gray-400 text-sm font-normal">— Full-Stack App</span>
                    </h3>
                  </div>
                  <p className="text-xs font-mono text-green-300 mb-4 bg-black/30 border border-green-500/20 inline-block px-2 py-1 rounded">React, Python, Flask, PyTorch (EfficientNet-B3), Edamam API, Recharts</p>
                  <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
                    <li>• Trained a custom EfficientNet-B3 image classifier using PyTorch transfer learning and deployed it via a Flask REST API for real-time food recognition.</li>
                    <li>• Built a JSON-based caching layer for Edamam API responses, eliminating redundant network calls and reducing average response time by 40%.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* General Grid: Technologies & Achievements */}
            <div className="resume-section grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
              
              {/* Technologies */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Code className="text-orange-400 w-5 h-5" /> Arsenal
                </h2>
                <div className="space-y-3 text-sm">
                  <div><span className="font-semibold text-white">Languages:</span> <span className="text-gray-400">Python, C++, JavaScript, SQL</span></div>
                  <div><span className="font-semibold text-white">Backend & AI:</span> <span className="text-gray-400">FastAPI, Flask, LangGraph, LLMs, PyTorch</span></div>
                  <div><span className="font-semibold text-white">Databases:</span> <span className="text-gray-400">PostgreSQL, pgvector, FAISS, Redis</span></div>
                  <div><span className="font-semibold text-white">Cloud & Tools:</span> <span className="text-gray-400">AWS (EC2, S3), Docker, GitHub Actions, Playwright</span></div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Award className="text-yellow-400 w-5 h-5" /> Achievements
                </h2>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2"><span className="text-yellow-400">🏆</span> Secured a global rank of 4,000 in a LeetCode Biweekly Contest.</li>
                  <li className="flex gap-2"><span className="text-yellow-400">🎯</span> Solved 200+ DSA problems across LeetCode, Coding Ninjas, and GeeksforGeeks.</li>
                  <li className="flex gap-2"><span className="text-yellow-400">🎤</span> Core Member of LADC Debating Society. Developed critical thinking and communication skills.</li>
                </ul>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
