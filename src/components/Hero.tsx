import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowDown as ArrowDownIcon } from "react-icons/hi";
import { FiDownload, FiArrowRight, FiZap, FiCalendar, FiUser } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  // Use fallback values if not loaded
  const name = profile?.name || "Naufal Nazhif Almaulidzar";
  const tagline = profile?.tagline || "Fresh Graduate of Informatics Engineering, University of Sriwijaya. Passionate about technology, communication, and creating impactful solutions.";
  const roles = profile?.roles || ["IT Professional", "Software Engineer", "Public Relations"];
  const resumeUrl = profile?.resume_url || "#";
  const avatarUrl = profile?.avatar_url || "/profile.jpg";

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[var(--theme-bg)] flex flex-col justify-start pt-24 pb-10 px-4 sm:px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full border-2.5 border-[var(--theme-border)] rounded-2xl overflow-hidden bg-[var(--theme-bg-card)] shadow-[6px_6px_0px_0px_var(--theme-border)]">
        {/* Notion-style Page Cover Banner (3D Asset Layout) */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b-2.5 border-[var(--theme-border)] bg-zinc-100 dark:bg-zinc-800">
          <img 
            src="/notion-cover.png" 
            alt="Notion Style 3D Cover" 
            className="w-full h-full object-cover"
          />
          {/* Workspace Status Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white border-2 border-black rounded-lg text-xs font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#18181b]">
            🔒 Workspace: Public
          </div>
          
          {/* Floating Mascot (3D rocket-laptop icon from public folder) */}
          <div className="absolute right-6 -bottom-8 w-24 h-24 sm:w-32 sm:h-32 z-10 animate-float pointer-events-none drop-shadow-[5px_5px_0px_rgba(0,0,0,0.15)]">
            <img 
              src="/notion-avatar.png" 
              alt="3D Rocket Laptop Mascot" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Notion Page Icon Overlap */}
        <div className="px-6 sm:px-12 relative flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 mb-6">
          <div className="relative flex-shrink-0 z-20">
            {/* Profile photo in Neo-Brutalist Frame */}
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl bg-[var(--theme-bg-card)] border-2.5 border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] overflow-hidden p-1 flex items-center justify-center hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-250">
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-full h-full rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Naufal+Nazhif&background=bae6fd&color=0369a1&size=128";
                }}
              />
            </div>
          </div>

          {/* Saturated Option tags */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 font-heading">
            {roles.map((role: string, idx: number) => {
              const tagsColors = [
                "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]",
                "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]",
                "bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)]"
              ];
              const colorClass = tagsColors[idx % tagsColors.length];
              
              return (
                <span 
                  key={idx} 
                  className={`notion-tag ${colorClass}`}
                >
                  {role}
                </span>
              );
            })}
          </div>
        </div>

        {/* Details & Body */}
        <div className="px-6 sm:px-12 pb-12 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Breadcrumb info with clean mini icons */}
            <div className="text-xs font-mono font-bold text-[var(--theme-text-muted)] mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-[var(--theme-text-primary)]" />
                Last edited: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
              <span className="flex items-center gap-1.5">
                <FiUser className="text-[var(--theme-text-primary)]" />
                Author: Naufal
              </span>
            </div>

            {/* Document Header Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-[var(--theme-text-primary)] mb-6 leading-tight">
              {name}
            </h1>

            {/* Notion Callout block with Orange highlight */}
            <div className="notion-callout mb-8">
              <div className="p-2 bg-[var(--tag-orange-bg)] text-[var(--tag-orange-text)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] rounded-md notion-callout-icon">
                <FiZap size={18} />
              </div>
              <div>
                <h4 className="font-heading font-extrabold text-sm text-[var(--theme-text-primary)] mb-1">About Me</h4>
                <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed font-medium">
                  {tagline}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#projects" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
                <span>View Projects</span>
                <FiArrowRight size={16} />
              </a>
              
              {resumeUrl && resumeUrl !== "#" && (
                <a 
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-brutal-btn bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]"
                >
                  <FiDownload size={16} />
                  <span>Download CV</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Down arrow scroll helper */}
      <div className="flex justify-center mt-8">
        <motion.a
          href="#about"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="p-3 rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] shadow-[3px_3px_0px_0px_var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-yellow-bg)] transition-colors cursor-pointer"
        >
          <ArrowDownIcon size={18} />
        </motion.a>
      </div>
    </section>
  );
}
