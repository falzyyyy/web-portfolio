import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { 
  Briefcase, 
  Calendar, 
  Award, 
  Layers,
  ArrowUpRight 
} from "lucide-react";
import { cn } from "../utils/cn";

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
              <Briefcase size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Work & Org Experience</h2>
          </motion.div>

          {/* Asymmetric Bento Grid layout */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
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

              // Setup asymmetric bento span layout
              const colSpanClass = (i === 0 || i === 3 || i === 4) ? "md:col-span-2" : "md:col-span-1";

              return (
                <motion.div
                  key={exp.id || i}
                  variants={staggerItem}
                  className={cn(
                    "border-2 border-black dark:border-[var(--theme-border)] rounded-2xl p-5 bg-[var(--theme-bg-card)] shadow-[3.5px_3.5px_0px_0px_black] dark:shadow-[3.5px_3.5px_0px_0px_var(--theme-border)] hover:-translate-y-1 hover:shadow-[5.5px_5.5px_0px_0px_black] dark:hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200 flex flex-col justify-between group",
                    colSpanClass
                  )}
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className={cn("notion-tag text-[9px] font-semibold", tagColorClass)}>
                        <Calendar size={10} />
                        {exp.year}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[var(--theme-text-muted)] bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_var(--theme-border)]">
                        #{exp.order_index || i + 1}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="text-lg sm:text-xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-1 flex items-start gap-1.5 leading-snug">
                      <Award className="text-[var(--notion-blue)] flex-shrink-0 mt-1" size={16} />
                      <span>{exp.title}</span>
                    </h3>

                    {/* Org / Company info */}
                    <h4 className="text-[11px] font-heading font-bold text-[var(--theme-text-secondary)] mb-4 flex items-center gap-1.5">
                      <div className="p-0.5 rounded bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] shadow-[0.5px_0.5px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--theme-text-secondary)]">
                        <Layers size={10} />
                      </div>
                      <span>{exp.organization}</span>
                    </h4>

                    {/* Divider */}
                    <div className="h-[1.5px] bg-[var(--theme-border)] opacity-15 my-3" />

                    {/* Description text */}
                    <p className="text-xs sm:text-sm font-sans font-medium text-[var(--theme-text-secondary)] leading-relaxed mb-6">
                      {exp.description}
                    </p>
                  </div>

                  {/* Footer link arrow */}
                  <div className="flex justify-end pt-2">
                    <div className="w-8 h-8 rounded-lg border-2 border-black dark:border-[var(--theme-border)] bg-[var(--theme-bg-card)] flex items-center justify-center shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--theme-border)] group-hover:bg-[var(--tag-yellow-bg)] group-hover:text-black group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_black] transition-all cursor-pointer">
                      <ArrowUpRight size={14} className="transform group-hover:rotate-45 transition-transform duration-200" />
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
