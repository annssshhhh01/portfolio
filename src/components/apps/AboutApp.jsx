import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Github, Linkedin, Mail, Twitter, Instagram, Globe, ExternalLink
} from "lucide-react";

// ─── PROFILE DATA ────────────────────────────────────────
const PROFILE = {
  name: "Ansh Sharma",
  role: "Full Stack Developer • AI Engineer",
  email: "anshs.dev.work@gmail.com",
  site: "ekas.site",
  summary:
    "Engineering undergraduate at Dr. B. R. Ambedkar National Institute of Technology, Jalandhar (2022–2026), focused on full-stack development, Agentic AI workflows, and cloud-native deployments. Passionate about building scalable systems, contributing to open source, and designing developer tooling.",
  links: [
    { icon: Github, label: "GitHub", url: "https://github.com/annssshhhh01" },
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/anshsharma01/" },
    { icon: Twitter, label: "X", url: "https://x.com/Anshhh_001" },
    { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/annssshhh/" },
    { icon: Mail, label: "Email", url: "https://mail.google.com/mail/?view=cm&fs=1&to=anshs.dev.work@gmail.com" },
  ],
};

const EDUCATION = {
  institution: "Dr B. R. Ambedkar National Institute of Technology, Jalandhar",
  degree: "B.Tech | 2022 – 2026",
};

const EXPERIENCE = [
  {
    company: "Siemens",
    role: "Technical Intern (Software & Logic Automation)",
    duration: "June 2025 – August 2025",
    points: [
      "Engineered high-level State Machine logic for automated production systems, reducing computational overhead and enhancing operational reliability by 15%.",
      "Implemented modular low-latency logic frameworks to ensure fault-tolerant performance.",
      "Directed unit testing and algorithmic debugging to identify critical system bottlenecks.",
    ],
  },
];

const PROJECTS = [
  {
    title: "LinkedOut",
    subtitle: "Agentic AI & Distributed Automation Engine",
    tech: "FastAPI, LangGraph, AWS (EC2/S3), PostgreSQL, Redis, Playwright, Docker",
    live: "https://www.linkedout.co.in/",
    github: "https://github.com/annssshhhh01/Linkedin-automation-agent",
    points: [
      "Architected a Cloud-Native Multi-Agent System: stateful LangGraph workflow on AWS EC2 with MemorySaver checkpointing, reducing manual networking by 97%.",
      "Engineered Scalable Storage & Stealth Automation with AWS S3 and Playwright with randomized heuristics for 100% anti-bot bypass.",
      "Built context-aware outreach using pgvector for cosine similarity and hyper-personalized connection notes.",
      "Designed a non-blocking FastAPI architecture using ThreadPoolExecutor with Redis-backed WebSockets.",
    ],
  },
  {
    title: "Autonomous Agentic RAG Engine",
    subtitle: "Generative AI & NLP Pipeline",
    tech: "FastAPI, React, Groq API, Llama 3.2, LangGraph, FAISS",
    live: "https://rag-application-one.vercel.app/",
    github: "https://github.com/annssshhhh01/RAG-application",
    points: [
      "Production-ready RAG pipeline to query 500+ pages with sub-second response times using Groq API and FAISS.",
      "Implemented Recursive Character Splitting and Semantic Chunking, increasing retrieval precision by 30%.",
      "Leveraged LangGraph nodes for autonomous Self-Correction loops to minimize hallucinations.",
    ],
  },
  {
    title: "AI Food Nutrition Analyzer",
    subtitle: "Full-Stack AI Web Application",
    tech: "React, Python, Flask, PyTorch, Edamam API, Recharts",
    live: null,
    github: "https://github.com/annssshhhh01/food-nutrition-analyzer",
    points: [
      "Flask backend serving a custom-trained PyTorch EfficientNet model for real-time food classification.",
      "Implemented a hybrid JSON-based cache to minimize API latency and external calls.",
    ],
  },
  {
    title: "AI Cancer Model",
    subtitle: "Advanced Medical Imaging & Diagnostics",
    tech: "Python, TensorFlow, Scikit-Learn, Pandas, Matplotlib",
    live: null,
    github: "https://github.com/annssshhhh01/ai-cancer-model.git",
    points: [
      "Developed a diagnostic prediction model for cancer detection utilizing advanced AI/ML algorithms.",
      "Designed to increase prediction accuracy over large medical datasets.",
    ],
  },
];

const TECHNOLOGIES = {
  Languages: "C++, SQL, Python, JavaScript",
  "Frameworks & Libraries": "FastAPI, React, Next.js, LangGraph, LangChain, Redis, Flask, Tailwind CSS",
  Databases: "PostgreSQL, pgvector, FAISS (Vector DB)",
  "Cloud & DevOps": "AWS (EC2, S3), Docker, Nginx, GitHub Actions (CI/CD)",
  "Tools & Platforms": "Playwright, Git, Groq API, Postman, Hugging Face, Jupyter",
};

const ACHIEVEMENTS = [
  "Achieved a global rank of 4,000 in LeetCode Biweekly Contest.",
  "Solved 200+ problems on LeetCode, 100+ on Coding Ninjas, and 100+ on GeeksforGeeks.",
  "Core Member, LADC Club (Debating Society).",
];

const HACKATHONS = [
  { name: "HackAmol", result: "Participant", project: "Built an innovative AI-powered solution under competitive time constraints alongside a cross-functional team.", participants: "College-Level · NIT Jalandhar" },
];

export function AboutApp() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    gsap.from(".notion-section", {
      opacity: 0,
      y: 25,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto bg-transparent text-white font-sans"
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      {/* ─── HERO ─── */}
      <section className="notion-section max-w-3xl mx-auto pt-14 pb-10 px-8 text-center">
        <img
          src="/images/profile.jpg"
          alt="Ansh Sharma"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-6 border-2 border-white/10 shadow-xl"
        />
        <h1 className="text-[32px] sm:text-[38px] font-bold tracking-tight text-white mb-2 leading-tight">
          {PROFILE.name}
        </h1>
        <p className="text-[15px] text-white/50 font-medium mb-5">
          {PROFILE.role}
        </p>
        <p className="text-[13px] text-white/40 mb-2">
          <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`} target="_blank" rel="noreferrer" className="text-white/50 hover:text-white/70 transition-colors">{PROFILE.email}</a>
        </p>

        <p className="text-[14px] text-white/60 leading-relaxed max-w-2xl mx-auto mt-5">
          {PROFILE.summary}
        </p>

        {/* Social Row */}
        <div className="flex justify-center gap-3 mt-6">
          {PROFILE.links.map((link) => {
            const Icon = link.icon;
            return (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.12] transition-all hover:scale-110"
                title={link.label}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-6">

        {/* ─── EDUCATION ─── */}
        <Card title="Education" className="notion-section">
          <h4 className="text-[15px] font-semibold text-white">{EDUCATION.institution}</h4>
          <p className="text-[13px] text-white/40 mt-1">{EDUCATION.degree}</p>
        </Card>

        {/* ─── EXPERIENCE ─── */}
        <Card title="Professional Experience" className="notion-section">
          {EXPERIENCE.map((exp, i) => (
            <div key={i}>
              <div className="flex justify-between items-start flex-wrap gap-1 mb-2">
                <h4 className="text-[15px] font-semibold text-white">{exp.company} — <span className="font-normal text-white/60">{exp.role}</span></h4>
              </div>
              <p className="text-[12px] text-white/30 mb-3">{exp.duration}</p>
              <ul className="space-y-2">
                {exp.points.map((p, j) => (
                  <li key={j} className="text-[13px] text-white/60 leading-relaxed flex gap-2.5">
                    <span className="text-white/20 mt-[1px] flex-shrink-0">•</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Card>

        {/* ─── PROJECTS ─── */}
        <section className="notion-section">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {PROJECTS.map((p, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h4 className="text-[15px] font-semibold text-white">{p.title}</h4>
                  <div className="flex gap-2 flex-shrink-0">
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline">GitHub</a>}
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="text-[11px] text-blue-400 hover:underline flex items-center gap-1">Live Demo</a>}
                  </div>
                </div>
                <p className="text-[12px] text-white/30 italic mb-1">{p.subtitle}</p>
                <p className="text-[11px] text-white/25 mb-3">{p.tech}</p>
                <ul className="space-y-1.5">
                  {p.points.map((pt, j) => (
                    <li key={j} className="text-[13px] text-white/60 leading-relaxed flex gap-2.5">
                      <span className="text-white/20 mt-[1px] flex-shrink-0">•</span>{pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TECHNOLOGIES ─── */}
        <Card title="Technologies" className="notion-section">
          <div className="space-y-3">
            {Object.entries(TECHNOLOGIES).map(([cat, items]) => (
              <div key={cat}>
                <span className="text-[12px] font-semibold text-white/80">{cat}: </span>
                <span className="text-[13px] text-white/50">{items}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── ACHIEVEMENTS ─── */}
        <Card title="Achievements" className="notion-section">
          <ul className="space-y-2">
            {ACHIEVEMENTS.map((a, i) => (
              <li key={i} className="text-[13px] text-white/60 leading-relaxed flex gap-2.5">
                <span className="text-white/20 mt-[1px] flex-shrink-0">•</span>{a}
              </li>
            ))}
          </ul>
        </Card>

        {/* ─── HACKATHONS ─── */}
        <section className="notion-section">
          <SectionTitle>Hackathon Victories & Recognition</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HACKATHONS.map((h, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5">
                <h4 className="text-[15px] font-bold text-white mb-1">{h.name}</h4>
                <p className="text-[13px] text-white/50 mb-1 font-medium">{h.result}</p>
                <p className="text-[13px] text-white/40 leading-relaxed mb-3">{h.project}</p>
                <p className="text-[11px] text-white/25">{h.participants}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── REUSABLE SUBCOMPONENTS ──────────────────────────────
function SectionTitle({ children }) {
  return (
    <h3 className="text-[18px] font-bold text-white mb-4 tracking-tight">{children}</h3>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 ${className}`}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}
