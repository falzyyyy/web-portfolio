import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiGithub, FiExternalLink } from "react-icons/fi";

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
    <section id="projects" className="py-12 sm:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-16">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">05</span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">Projects</h2>
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
                <motion.div key={project.id || i} variants={staggerItem} className="neo-card flex flex-col group overflow-hidden bg-[var(--theme-bg-card)]">
                  
                  {/* Image Section */}
                  {imgSrc && (
                    <div className="w-full h-48 sm:h-56 overflow-hidden border-b-[3px] border-[var(--theme-border)] bg-[var(--neo-yellow)]">
                      <img 
                        src={imgSrc} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl border-2 border-[var(--theme-border)] bg-[var(--neo-cyan)] flex items-center justify-center shadow-[2px_2px_0px_0px_var(--theme-border)]">
                          <FiExternalLink size={20} className="text-[#1A1A1A]" />
                        </div>
                        <div className="flex gap-2">
                          {project.github_url && project.github_url !== "#" && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-[var(--theme-border)] rounded-md hover:bg-[var(--neo-pink)] transition-colors shadow-[2px_2px_0px_0px_var(--theme-border)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]" aria-label={`GitHub ${project.title}`}>
                              <FiGithub size={20} className="text-[#1A1A1A]" />
                            </a>
                          )}
                          {project.live_url && project.live_url !== "#" && (
                            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-[var(--theme-border)] rounded-md hover:bg-[var(--neo-green)] transition-colors shadow-[2px_2px_0px_0px_var(--theme-border)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]" aria-label={`Live Demo ${project.title}`}>
                              <FiExternalLink size={20} className="text-[#1A1A1A]" />
                            </a>
                          )}
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-[var(--theme-text-primary)] mb-3">{project.title}</h3>
                      <p className="text-base text-[var(--theme-text-secondary)] font-medium leading-relaxed mb-6">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack && (Array.isArray(project.tech_stack) ? project.tech_stack : String(project.tech_stack).split(",")).map((tech: string) => (
                        <span key={tech} className="text-xs px-3 py-1 border-2 border-[var(--theme-border)] text-[#1A1A1A] bg-[var(--theme-bg-card)] font-bold shadow-[2px_2px_0px_0px_var(--theme-border)]">{tech.trim()}</span>
                      ))}
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
