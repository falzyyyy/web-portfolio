import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiInfo, FiMapPin, FiAward, FiBookOpen, FiActivity, FiTarget } from "react-icons/fi";

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
    <section id="about" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
          {/* Section label */}
          <div className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">01.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-yellow-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-yellow-text)]">
              <FiInfo size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">About Me</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Properties sidebar */}
            <div className="lg:col-span-1 border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-4 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-1.5">
                <span>📋 Properties</span>
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm font-heading font-bold">
                {/* Location */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Location</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]">
                      <FiMapPin size={12} className="text-zinc-600" />
                      Palembang, ID
                    </span>
                  </div>
                </div>

                {/* Degree */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Degree</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
                      <FiAward size={12} />
                      Bachelor of CS
                    </span>
                  </div>
                </div>

                {/* University */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">University</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]">
                      <FiBookOpen size={12} />
                      Sriwijaya Univ
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Status</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]">
                      <FiActivity size={12} />
                      Active Graduate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notion main paragraph sheet */}
            <div className="lg:col-span-2 border-2.5 border-[var(--theme-border)] rounded-2xl p-6 sm:p-8 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200 flex flex-col justify-between">
              <div className="space-y-5 relative z-10 font-sans font-medium text-[var(--theme-text-secondary)] text-sm sm:text-base leading-relaxed">
                {paragraphs.map((p: string, i: number) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={controls}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, delay: 0.1 + i * 0.1 },
                      },
                    }}
                  >
                    {p}
                  </motion.p>
                ))}
              </div>

              {/* Callout box inside main body */}
              <div className="mt-6 notion-callout bg-[var(--tag-gray-bg)]">
                <div className="p-2 bg-[var(--tag-red-bg)] text-[var(--tag-red-text)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] rounded-md notion-callout-icon">
                  <FiTarget size={18} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--theme-text-primary)]">Mission</p>
                  <p className="text-xs sm:text-sm font-heading font-extrabold text-[var(--theme-text-secondary)] mt-0.5">
                    Fostering meaningful tech solutions through public relations, cloud system architecture, and robust coding principles.
                  </p>
                </div>
              </div>
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
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
            className="mt-16 h-[2px] bg-[var(--theme-border)] origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}
