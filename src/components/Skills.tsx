import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { hardSkills, softSkills } from "../data/portfolio-data";
import { HiCheck } from "react-icons/hi";

export default function Skills() {
  const { ref, controls } = useScrollReveal();

  return (
    <section id="skills" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-16">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              04
            </span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">
              Skills
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Hard Skills */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={controls}
            >
              <h3 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3">
                Hard Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {hardSkills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      variants={staggerItem}
                      className="skill-badge"
                    >
                      <Icon size={18} />
                      {skill.name}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Soft Skills */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={controls}
              className="neo-card p-8 bg-[var(--neo-yellow)]"
            >
              <h3 className="text-2xl font-black text-[#1A1A1A] mb-6 flex items-center gap-3">
                Soft Skills
              </h3>
              <ul className="space-y-4">
                {softSkills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={staggerItem}
                    className="flex items-center gap-3 text-[#1A1A1A] font-bold"
                  >
                    <span className="flex items-center justify-center w-6 h-6 border-2 border-[#1A1A1A] bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_#1A1A1A]">
                      <HiCheck size={14} className="text-[#1A1A1A]" />
                    </span>
                    <span className="text-lg">
                      {skill}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Decorative divider */}
          <motion.div
            variants={{
              hidden: { scaleX: 0 },
              visible: {
                scaleX: 1,
                transition: { duration: 0.8, delay: 0.6 },
              },
            }}
            className="mt-20 h-[4px] bg-[var(--theme-border)] origin-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
