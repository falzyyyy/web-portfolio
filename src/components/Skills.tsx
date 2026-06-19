import { motion } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { hardSkills, softSkills } from "../data/portfolio-data";
import { HiCheck } from "react-icons/hi";
import { FiTerminal, FiTag, FiCheckSquare } from "react-icons/fi";

export default function Skills() {
  const { ref, controls } = useScrollReveal();

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">04.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-green-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-green-text)]">
              <FiTerminal size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Skills Matrix</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hard Skills */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={controls}
              className="border-2.5 border-[var(--theme-border)] p-6 bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200"
            >
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-5 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-2">
                <div className="p-1 rounded bg-[var(--tag-blue-bg)] border border-[var(--theme-border)] text-[var(--tag-blue-text)] flex items-center justify-center">
                  <FiTag size={12} />
                </div>
                <span>Technical Skills</span>
              </h3>
              
              <div className="flex flex-wrap gap-2.5">
                {hardSkills.map((skill, i) => {
                  const Icon = skill.icon;
                  const tagColors = [
                    "bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]",
                    "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]",
                    "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]",
                    "bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)]",
                    "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]",
                    "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)]"
                  ];
                  const tagColor = tagColors[i % tagColors.length];
                  
                  return (
                    <motion.div
                      key={skill.name}
                      variants={staggerItem}
                      className={`notion-tag ${tagColor} px-3 py-1.5 text-xs flex items-center gap-2 hover:scale-102 cursor-default`}
                    >
                      <Icon size={14} className="opacity-90 flex-shrink-0" />
                      <span>{skill.name}</span>
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
              className="border-2.5 border-[var(--theme-border)] p-6 bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200"
            >
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-5 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-2">
                <div className="p-1 rounded bg-[var(--tag-pink-bg)] border border-[var(--theme-border)] text-[var(--tag-pink-text)] flex items-center justify-center">
                  <FiCheckSquare size={12} />
                </div>
                <span>Core Competencies</span>
              </h3>
              
              <ul className="space-y-4">
                {softSkills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={staggerItem}
                    className="flex items-center gap-3.5 text-[var(--theme-text-primary)]"
                  >
                    {/* Notion Checkbox styling with Neo-Brutalist shadow */}
                    <span className="flex items-center justify-center w-5 h-5 border-2 border-[var(--theme-border)] bg-[var(--notion-blue)] rounded shadow-[1.5px_1.5px_0px_0px_var(--theme-border)] flex-shrink-0">
                      <HiCheck size={12} className="text-white" />
                    </span>
                    <span className="text-sm sm:text-base font-sans font-semibold text-[var(--theme-text-secondary)]">
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
                transition: { duration: 0.5, delay: 0.2 },
              },
            }}
            className="mt-16 h-[2px] bg-[var(--theme-border)] origin-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
