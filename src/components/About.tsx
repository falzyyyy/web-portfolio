import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";

export default function About() {
  const { ref, controls, variants } = useScrollReveal();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  const paragraphs = profile?.about_paragraphs || [
    "My name is Naufal Nazhif Almaulidzar, a fresh graduate of Informatics Engineering from the Faculty of Computer Science, University of Sriwijaya. I am passionate about exploring technology and communication, particularly in IT solutions, Public Relations, and event management.",
    "With a strong interest in fostering meaningful connections and impactful teamwork, I aim to leverage my technical skills and organizational experience to contribute to innovative projects and collaborative environments."
  ];

  return (
    <section id="about" className="py-12 sm:py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          {/* Section label */}
          <div className="flex items-center gap-4 mb-12">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              01
            </span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              About Me
            </h2>
          </div>

          {/* Content */}
          <div className="neo-card p-8 sm:p-12 bg-[var(--neo-cyan)] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--neo-yellow)] rounded-full border-4 border-[var(--theme-border)] opacity-50" />
            
            <div className="space-y-6 relative z-10">
              {paragraphs.map((p: string, i: number) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={controls}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.6, delay: 0.2 + i * 0.15 },
                    },
                  }}
                  className="text-[#1A1A1A] text-lg sm:text-xl font-medium leading-relaxed"
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={controls}
            variants={{
              hidden: { scaleX: 0 },
              visible: {
                scaleX: 1,
                transition: { duration: 0.8, delay: 0.6 },
              },
            }}
            className="mt-16 h-[4px] bg-[var(--theme-border)] origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}
