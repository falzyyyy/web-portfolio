import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiBriefcase, FiCalendar, FiAward, FiLayers } from "react-icons/fi";

export default function Experience() {
  const { ref, controls } = useScrollReveal();
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { data } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
      if (data) setExperiences(data);
    };
    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">02.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-blue-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-blue-text)]">
              <FiBriefcase size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Work & Org Experience</h2>
          </motion.div>

          {/* Timeline list */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="relative pl-8 border-l-2.5 border-[var(--theme-border)] ml-3 sm:ml-4 space-y-8"
          >
            {experiences.map((exp, i) => {
              const tagColors = [
                "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]",
                "bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)]",
                "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)]",
                "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]",
                "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]"
              ];
              const tagColorClass = tagColors[i % tagColors.length];

              return (
                <motion.div
                  key={exp.id || i}
                  variants={staggerItem}
                  className="relative group"
                >
                  {/* Timeline bullet node */}
                  <div className="absolute -left-[43px] top-2 z-10 w-5 h-5 rounded-md border-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] group-hover:bg-[var(--tag-yellow-bg)] group-hover:-translate-y-0.5 transition-all">
                    <FiCalendar size={10} className="text-[var(--theme-text-primary)]" />
                  </div>

                  {/* Document style card */}
                  <div className="border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] max-w-4xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <span className={`notion-tag ${tagColorClass}`}>
                        <FiCalendar size={12} />
                        {exp.year}
                      </span>
                      <span className="text-xs font-mono font-bold text-[var(--theme-text-muted)] bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_var(--theme-border)]">
                        ID: {exp.order_index || i}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-2 flex items-center gap-2">
                      <FiAward className="text-[var(--notion-blue)] flex-shrink-0" />
                      <span>{exp.title}</span>
                    </h3>

                    <h4 className="text-sm font-heading font-bold text-[var(--theme-text-secondary)] mb-4 flex items-center gap-2">
                      <div className="p-1 rounded bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--theme-text-secondary)]">
                        <FiLayers size={12} />
                      </div>
                      <span>{exp.organization}</span>
                    </h4>

                    <div className="h-[2px] bg-[var(--theme-border)] my-4" />

                    <p className="text-sm sm:text-base font-sans font-medium text-[var(--theme-text-secondary)] leading-relaxed">
                      {exp.description}
                    </p>
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
