import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";

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
    <section id="experience" className="py-12 sm:py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-16">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              02
            </span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              Experience
            </h2>
          </motion.div>

          {/* Timeline */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={controls}
            className="relative"
          >
            {/* Vertical line */}
            <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[4px] bg-[var(--theme-border)]" />

            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id || i}
                variants={staggerItem}
                className={`relative flex flex-col md:flex-row mb-12 last:mb-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-4 z-10">
                  <div className="w-5 h-5 rounded-full border-4 border-[var(--theme-border)] bg-[var(--neo-yellow)] flex items-center justify-center" />
                </div>

                {/* Content */}
                <div
                  className={`ml-8 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                  }`}
                >
                  <div className="neo-card p-6 transition-all duration-300">
                    <span className="inline-block text-xs font-black text-[#1A1A1A] uppercase mb-3 px-3 py-1 border-2 border-[var(--theme-border)] bg-[var(--neo-pink)] shadow-[2px_2px_0px_0px_var(--theme-border)]">
                      {exp.year}
                    </span>
                    <h3 className="text-xl font-black text-[#1A1A1A] mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-sm font-bold text-[var(--theme-text-secondary)] mb-3">
                      {exp.organization}
                    </p>
                    <p className="text-sm text-[var(--theme-text-secondary)] font-medium leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
