import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiBookOpen } from "react-icons/fi";

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
    <section id="education" className="py-12 sm:py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-16">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              03
            </span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              Education
            </h2>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" animate={controls} className="space-y-6">
            {education.map((edu, i) => (
              <motion.div key={edu.id || i} variants={staggerItem} className="neo-card p-6 sm:p-8 flex flex-col md:flex-row md:items-start gap-6 bg-[var(--neo-cyan)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[var(--theme-bg-card)] rounded-bl-full border-b-4 border-l-4 border-[var(--theme-border)] opacity-30 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-500" />
                
                <div className="w-14 h-14 rounded-2xl border-4 border-[var(--theme-border)] bg-[var(--neo-yellow)] flex items-center justify-center flex-shrink-0 z-10 shadow-[2px_2px_0px_0px_var(--theme-border)]">
                  <FiBookOpen size={24} className="text-[#1A1A1A]" />
                </div>
                
                <div className="flex-1 z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-black text-[#1A1A1A]">{edu.degree}</h3>
                    <span className="inline-block text-xs font-black text-[#1A1A1A] uppercase px-3 py-1 border-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] w-fit">
                      {edu.year}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1A1A1A] mb-4">{edu.institution}</h4>
                  
                  {edu.description && edu.description.length > 0 && (
                    <ul className="text-sm text-[#1A1A1A] font-medium leading-relaxed mt-4 list-disc ml-4 space-y-1">
                      {edu.description.map((desc: string, idx: number) => (
                        <li key={idx}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
