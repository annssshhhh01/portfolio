import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { projects } from "../../data/projects";
import { ExternalLink, Github } from "lucide-react";

export function ProjectsApp() {
  // Extract unique categories from projects + "All"
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const [filter, setFilter] = useState("All");
  const containerRef = useRef(null);

  const filtered = projects.filter(
    (p) => filter === "All" || p.category === filter
  );

  useEffect(() => {
    // 1. Ambient Background Orbs Animation
    gsap.to(".bg-orb-1", {
      x: "15vw",
      y: "10vh",
      scale: 1.2,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    
    gsap.to(".bg-orb-2", {
      x: "-15vw",
      y: "-10vh",
      scale: 1.2,
      duration: 15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

    // 2. Add 3D mousemove effect to all cards
    const cards = gsap.utils.toArray(".project-card");
    
    // Clear any previous listeners
    const mouseMoveListeners = new Map();
    const mouseLeaveListeners = new Map();

    cards.forEach(card => {
      const handleMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Very subtle, premium tilt: 3 degrees max
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        
        gsap.to(card, {
          duration: 0.4,
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1200,
          boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.5)",
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          duration: 0.6,
          rotateX: 0,
          rotateY: 0,
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          ease: "power3.out"
        });
      };

      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);
      
      mouseMoveListeners.set(card, handleMouseMove);
      mouseLeaveListeners.set(card, handleMouseLeave);
    });

    return () => {
      cards.forEach(card => {
        const mm = mouseMoveListeners.get(card);
        const ml = mouseLeaveListeners.get(card);
        if (mm) card.removeEventListener("mousemove", mm);
        if (ml) card.removeEventListener("mouseleave", ml);
      });
      gsap.killTweensOf(".bg-orb-1");
      gsap.killTweensOf(".bg-orb-2");
    };
  }, [filtered.length]); // Re-bind if cards update

  return (
    <div ref={containerRef} className="h-full w-full p-6 md:p-10 overflow-auto bg-transparent text-white scroll-smooth pb-24 relative z-0">
      
      {/* --- DYNAMIC AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        {/* Subtle Tech Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] z-0"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Floating Glowing Orbs */}
        <div className="bg-orb-1 absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen z-0"></div>
        <div className="bg-orb-2 absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen z-0"></div>
        
        {/* Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-0"></div>
      </div>
      {/* ----------------------------------- */}
      
      {/* HEADER & FILTERS */}
      <div className="mb-12 max-w-6xl mx-auto flex flex-col items-center sm:items-start">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">Projects Showcase</h1>
        <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? "bg-white text-black shadow-[0_4px_14px_0_rgba(255,255,255,0.39)]"
                  : "bg-white/[0.05] border border-white/10 text-white/70 hover:bg-white/[0.1] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PROJECT CARDS */}
      <div className="space-y-10 flex flex-col items-center perspective-1000">
        {filtered.map((project) => (
          <article
            key={project.id}
            className="project-card group w-full max-w-6xl rounded-2xl bg-[#1C1D24] border border-[#2A2B30] flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:border-white/20 relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* LEFT SIDE: Image + Badges */}
            <div className="md:w-[55%] flex flex-col border-b md:border-b-0 md:border-r border-[#2A2B30] z-10 bg-[#15161A]">
              {/* Image Container (Full Bleed) */}
              <div className="w-full h-[250px] md:h-[340px] relative overflow-hidden bg-black">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Tech Stack Bar */}
              <div className="w-full bg-[#1E2028] p-4 flex flex-wrap gap-2 items-center min-h-[64px] border-t border-[#2A2B30]">
                {project.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[#2C418A]/80 text-[#D2E0FB] rounded-md text-xs font-semibold tracking-wide"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Text + Buttons */}
            <div className="md:w-[45%] p-8 md:p-10 flex flex-col bg-[#1C1D24] z-10 relative">
              <h3 className="text-3xl font-bold text-white tracking-wide">
                {project.title}
              </h3>
              <p className="text-[#A1A1AA] text-[15px] leading-relaxed mt-4">
                {project.description}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-auto w-full pt-10">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#000000] hover:bg-[#111111] border border-[#2A2B30] text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                     <ExternalLink className="w-[18px] h-[18px]" /> Live Demo
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#000000] hover:bg-[#111111] border border-[#2A2B30] text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                     <Github className="w-[18px] h-[18px]"/> Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
