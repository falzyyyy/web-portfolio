import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiBookOpen, FiMapPin, FiAward, FiTrendingUp, FiBookmark } from "react-icons/fi";

export default function Education() {
  const { ref, controls } = useScrollReveal();
  const [education, setEducation] = useState<any[]>([]);

  useEffect(() => {
    const fetchEducation = async () => {
      const { data } = await supabase.from("education").select("*").order("order_index", { ascending: true });
      if (data) setEducation(data);
    };
    fetchEducation();
  }, []);

  return (
    <section id="education" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">03.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-purple-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-purple-text)]">
              <FiBookOpen size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Education History</h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate={controls} className="space-y-8">
            {education.map((edu, i) => {
              const isUnsri = edu.institution.toLowerCase().includes("sriwijaya") || edu.degree.toLowerCase().includes("bachelor");
              
              return (
                <motion.div 
                  key={edu.id || i} 
                  variants={staggerItem} 
                  className="border-2.5 border-[var(--theme-border)] p-6 bg-[var(--theme-bg-card)] rounded-2xl flex flex-col sm:flex-row sm:items-start gap-5 relative overflow-hidden shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200"
                >
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-xl border-2 border-[var(--theme-border)] bg-[var(--tag-purple-bg)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_var(--theme-border)] text-[var(--tag-purple-text)]">
                    <FiBookmark size={22} />
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[var(--theme-text-primary)]">
                        {edu.degree}
                      </h3>
                      <span className="inline-block text-xs font-mono font-bold text-[var(--theme-text-secondary)] bg-[var(--tag-gray-bg)] px-3 py-1 rounded-md border border-[var(--theme-border)] shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] w-fit">
                        {edu.year}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-heading font-bold text-[var(--theme-text-secondary)] mb-4 flex items-center gap-2">
                      <FiMapPin className="text-[var(--theme-text-muted)]" />
                      <span>{edu.institution}</span>
                    </h4>

                    {/* Muted Notion Tag style for GPA & honors */}
                    {isUnsri && (
                      <div className="mb-4 flex flex-wrap gap-2.5">
                        <span className="notion-tag bg-[var(--tag-green-bg)] text-[var(--tag-green-text)] font-heading font-extrabold shadow-[2px_2px_0px_0px_var(--theme-border)]">
                          <FiTrendingUp size={12} />
                          GPA: 3.74 / 4.00
                        </span>
                        <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] font-heading font-extrabold shadow-[2px_2px_0px_0px_var(--theme-border)]">
                          <FiAward size={12} />
                          Cum Laude Honors
                        </span>
                      </div>
                    )}
                    
                    <div className="h-[2px] bg-[var(--theme-border)] my-4" />

                    {edu.description && edu.description.length > 0 && (
                      <ul className="text-sm sm:text-base text-[var(--theme-text-secondary)] leading-relaxed space-y-3.5 list-none font-sans font-medium">
                        {edu.description.map((desc: string, idx: number) => {
                          let cleanText = desc;
                          if (cleanText.includes("3.84")) {
                            cleanText = cleanText.replace("3.84", "3.74");
                          }
                          return (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-text-primary)] mt-2.5 flex-shrink-0 border border-[var(--theme-border)]" />
                              <span>{cleanText}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
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
