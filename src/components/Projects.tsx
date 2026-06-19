import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiGithub, FiExternalLink, FiFolder, FiFileText, FiImage, FiHash } from "react-icons/fi";

export default function Projects() {
  const { ref, controls } = useScrollReveal();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
      if (error) console.error("Error fetching projects:", error);
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">05.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-purple-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-purple-text)]">
              <FiFolder size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Gallery Database: Projects</h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate={controls} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, i) => {
              // Determine image source
              let imgSrc = project.image_url;
              if (!imgSrc && project.live_url && project.live_url !== "#") {
                // Use Microlink API for website screenshot
                imgSrc = `https://api.microlink.io/?url=${encodeURIComponent(project.live_url)}&screenshot=true&meta=false&embed=screenshot.url`;
              }

              return (
                <motion.div 
                  key={project.id || i} 
                  variants={staggerItem} 
                  className="border-2.5 border-[var(--theme-border)] rounded-2xl flex flex-col group overflow-hidden bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--theme-border)] transition-all duration-250 cursor-pointer"
                >
                  
                  {/* Notion Cover Image Block */}
                  {imgSrc ? (
                    <div className="w-full h-48 sm:h-56 overflow-hidden border-b-2.5 border-[var(--theme-border)] bg-[var(--tag-gray-bg)] relative">
                      <img 
                        src={imgSrc} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white border-2 border-black px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] text-[#18181b] flex items-center gap-1">
                        <FiImage size={10} />
                        Cover
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-28 border-b-2.5 border-[var(--theme-border)] bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 relative flex items-center justify-center">
                      <FiFolder size={28} className="text-[var(--theme-text-muted)]" />
                    </div>
                  )}

                  {/* Document Content Block */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Card Action properties */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono font-bold text-[var(--theme-text-muted)] bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] flex items-center gap-1">
                          <FiHash size={10} />
                          proj-{project.id?.substring(0, 4) || i}
                        </span>
                        
                        <div className="flex gap-2">
                          {project.github_url && project.github_url !== "#" && (
                            <a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 border border-black rounded-lg bg-[var(--tag-gray-bg)] hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[var(--theme-text-primary)] shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_var(--theme-border)] transition-all duration-150"
                              aria-label={`GitHub ${project.title}`}
                            >
                              <FiGithub size={14} />
                            </a>
                          )}
                          {project.live_url && project.live_url !== "#" && (
                            <a 
                              href={project.live_url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 border border-black rounded-lg bg-[var(--tag-gray-bg)] hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[var(--theme-text-primary)] shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_var(--theme-border)] transition-all duration-150"
                              aria-label={`Live Demo ${project.title}`}
                            >
                              <FiExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-3 group-hover:text-[var(--notion-blue)] transition-colors flex items-center gap-2">
                        <FiFileText className="flex-shrink-0" />
                        <span>{project.title}</span>
                      </h3>
                      
                      <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed mb-5 font-medium">
                        {project.description}
                      </p>
                    </div>

                    {/* Notion horizontal divider */}
                    <div className="h-[2px] bg-[var(--theme-border)] my-4" />

                    {/* Tech Stack properties tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack && (
                        (Array.isArray(project.tech_stack) ? project.tech_stack : String(project.tech_stack).split(","))
                      ).map((tech: string, tIdx: number) => {
                        const tagColors = [
                          "bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]",
                          "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]",
                          "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]",
                          "bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)]",
                          "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]",
                          "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)]"
                        ];
                        const colorClass = tagColors[tIdx % tagColors.length];
                        
                        return (
                          <span key={tech} className={`notion-tag ${colorClass} text-[10px]`}>
                            {tech.trim()}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
