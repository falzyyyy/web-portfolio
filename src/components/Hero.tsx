import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { 
  Monitor, 
  Cpu, 
  Users, 
  ArrowRight, 
  Download, 
  ArrowDown,
  Sparkles
} from "lucide-react";

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);
  const [featuredProject, setFeaturedProject] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData } = await supabase.from("profiles").select("*").single();
      if (profileData) setProfile(profileData);

      const { data: projectData } = await supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(1);
      if (projectData && projectData.length > 0) {
        setFeaturedProject(projectData[0]);
      }
    };
    fetchData();
  }, []);

  const name = profile?.name || "Naufal Nazhif Almaulidzar";
  const tagline = profile?.tagline || "Fresh Graduate of Informatics Engineering, University of Sriwijaya. Passionate about technology, communication, and creating impactful solutions.";
  const roles = profile?.roles || ["IT Professional", "Software Engineer", "Public Relations"];
  const resumeUrl = profile?.resume_url || "#";
  const avatarUrl = profile?.avatar_url || "/profile.jpg";

  // Split name to highlight middle name in Brutalist Pill style
  const nameParts = name.split(" ");
  const firstName = nameParts[0] || "Naufal";
  const middleName = nameParts[1] ? nameParts[1].toUpperCase() : "NAZHIF";
  const lastName = nameParts.slice(2).join(" ") || "Almaulidzar";

  // Featured project fallback and layout logic
  const defaultProject = {
    title: "RSMH Online Attendance App",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    live_url: "https://rsmh.co.id"
  };
  
  const projectToDisplay = featuredProject || defaultProject;
  
  // Dynamic image fetching for screenshot API fallback (same as Projects.tsx)
  let projectImg = projectToDisplay.image_url || (projectToDisplay as any).imageUrl;
  if (!projectImg && projectToDisplay.live_url && projectToDisplay.live_url !== "#") {
    projectImg = `https://api.microlink.io/?url=${encodeURIComponent(projectToDisplay.live_url)}&screenshot=true&meta=false&embed=screenshot.url`;
  }
  if (!projectImg) {
    projectImg = defaultProject.image_url;
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[var(--theme-bg)] flex flex-col justify-start pt-24 pb-10 px-4 sm:px-6 overflow-hidden"
    >
      {/* Title Header: Own the CODE Keep the VIBE style - customized to Naufal's name */}
      <div className="text-center md:text-left mb-8 sm:mb-10 max-w-5xl mx-auto w-full px-2 mt-2 sm:mt-0">
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight text-[var(--theme-text-primary)] leading-tight select-none">
          {firstName} <span className="relative inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 text-white bg-black dark:bg-white dark:text-black rounded-lg sm:rounded-xl transform -skew-x-6 shadow-[2.5px_2.5px_0px_0px_var(--notion-blue)]">{middleName}</span> {lastName}
        </h1>
      </div>

      {/* Main Grid Wrapper Card */}
      <div className="max-w-5xl mx-auto w-full border-2.5 border-black dark:border-[var(--theme-border)] rounded-3xl bg-[var(--notion-blue)] dark:bg-blue-700 p-6 sm:p-10 shadow-[6px_6px_0px_0px_black] dark:shadow-[6px_6px_0px_0px_var(--theme-border)] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Card Background Grid and Silhouettes Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0c_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0c_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-3xl z-0" />
        
        {/* Large abstract code bracket and tag silhouettes */}
        <div className="absolute right-12 bottom-6 text-[180px] font-mono font-extrabold text-white/5 select-none pointer-events-none leading-none rotate-[15deg] z-0">
          {"</>"}
        </div>
        <div className="absolute left-6 top-6 text-[140px] font-mono font-extrabold text-white/5 select-none pointer-events-none leading-none rotate-[-12deg] z-0">
          {"{}"}
        </div>
        
        {/* Decorative Floating Sparkles */}
        <div className="absolute left-1/4 top-10 text-white/15 animate-bounce pointer-events-none z-0">
          <Sparkles size={24} />
        </div>
        <div className="absolute right-1/3 bottom-12 text-white/15 animate-pulse pointer-events-none z-0">
          <Sparkles size={18} />
        </div>

        {/* Left Column (Spans 5/12 of space on large screens) */}
        <div className="w-full md:w-5/12 flex flex-col justify-between self-stretch text-white z-10">
          <div className="space-y-4">
            <span className="inline-block bg-white/20 border border-white/30 text-white font-mono text-[9px] uppercase font-bold px-3 py-1 rounded-full w-fit">
              🎓 Fresh Graduate
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold leading-tight">
              Where Code Meets Connection
            </h2>
            <p className="text-xs sm:text-sm font-sans font-medium leading-relaxed text-white/90">
              {tagline}
            </p>
          </div>

          <div className="mt-8 space-y-5">
            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="#projects" 
                className="bg-white text-black font-heading font-bold px-4 py-2.5 rounded-full hover:bg-zinc-100 transition-all border border-black shadow-[2.5px_2.5px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View Projects</span>
                <ArrowRight size={13} />
              </a>
              
              {resumeUrl && resumeUrl !== "#" && (
                <a 
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white hover:bg-white/10 text-white font-heading font-bold px-4 py-2 rounded-full transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download CV</span>
                </a>
              )}
            </div>

            {/* Social / Active Badge Section */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                <span className="w-6 h-6 rounded-full border border-black bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-[1px_1px_0px_0px_black]">G</span>
                <span className="w-6 h-6 rounded-full border border-black bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-[1px_1px_0px_0px_black]">L</span>
                <span className="w-6 h-6 rounded-full border border-black bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-[1px_1px_0px_0px_black]">E</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-white/80">Active on GitHub, LinkedIn & Email</span>
            </div>
          </div>
        </div>

        {/* Center Column: Portrait Photo with slight rotation overlap (Spans 3.5/12) */}
        <div className="relative flex-shrink-0 z-20 my-4 md:my-0 w-full max-w-[240px] sm:w-60 md:w-64 flex justify-center">
          <div className="w-full aspect-[3/4] rounded-2xl border-2.5 border-black bg-white dark:bg-zinc-800 shadow-[5px_5px_0px_0px_black] dark:shadow-[5px_5px_0px_0px_var(--theme-border)] overflow-hidden rotate-[-2deg] hover:rotate-[0deg] transition-all duration-300 transform md:-translate-y-12 md:scale-105 flex flex-col p-2">
            <div className="w-full h-full rounded-xl overflow-hidden border border-black bg-zinc-100">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Naufal+Nazhif&background=bae6fd&color=0369a1&size=256";
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Roles & Mini OS Window Featured Project (Spans 3.5/12) */}
        <div className="w-full md:w-3.5/12 flex flex-col justify-between self-stretch z-10 gap-6">
          
          {/* Roles Tags */}
          <div className="space-y-2.5">
            {roles.map((role: string, idx: number) => (
              <div 
                key={idx} 
                className="flex items-center gap-2.5 text-white font-heading font-bold text-xs uppercase bg-white/10 border border-white/20 px-3 py-2 rounded-xl"
              >
                <span className="p-1 rounded-lg bg-white/20 flex items-center justify-center text-white">
                  {idx === 0 && <Monitor size={12} />}
                  {idx === 1 && <Cpu size={12} />}
                  {idx === 2 && <Users size={12} />}
                </span>
                <span className="truncate">{role}</span>
              </div>
            ))}
          </div>

          {/* Mini Finder Window Card (Featured Project) */}
          <div className="w-full flex flex-col items-center md:items-start">
            <span className="text-[9px] font-mono font-bold tracking-widest text-white/80 uppercase mb-2 block self-start">
              Featured Work
            </span>
            <div className="bg-white dark:bg-zinc-900 border-2 border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_black] p-3 text-black dark:text-white flex flex-col gap-2 w-full max-w-[240px]">
              {/* Finder bar */}
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[8px] font-mono text-zinc-400 select-none">work_item.jpg</span>
              </div>
              
              {/* Image preview */}
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-black bg-zinc-50 relative">
                <img 
                  src={projectImg} 
                  alt={projectToDisplay.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Card Footer */}
              <div className="flex flex-col justify-between">
                <h5 className="font-heading font-extrabold text-[10px] leading-tight line-clamp-1">
                  {projectToDisplay.title}
                </h5>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[8px] font-mono text-zinc-400">Status</span>
                  <a 
                    href={projectToDisplay.live_url || projectToDisplay.liveUrl || "#projects"} 
                    className="px-2.5 py-0.5 bg-[var(--tag-green-bg)] text-[var(--tag-green-text)] rounded text-[8px] font-bold border border-black shadow-[1px_1px_0px_0px_black] active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
                  >
                    LIVE ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Down arrow scroll helper */}
      <div className="flex justify-center mt-8">
        <a
          href="#about"
          className="p-3 rounded-xl border-2 border-black bg-[var(--theme-bg-card)] shadow-[3px_3px_0px_0px_black] text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-yellow-bg)] transition-colors cursor-pointer"
        >
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}
