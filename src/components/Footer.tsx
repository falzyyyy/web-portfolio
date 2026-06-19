import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { socialLinks } from "../data/portfolio-data";

export default function Footer() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <footer id="contact" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          ref={ref} 
          initial="hidden" 
          animate={controls} 
          variants={variants} 
          className="text-center border-2.5 border-[var(--theme-border)] p-8 sm:p-12 bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-200"
        >
          {/* Section label */}
          <motion.div className="flex items-center gap-2 justify-center mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">07.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-yellow-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-yellow-text)]">
              <FiMail size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Contact</h2>
          </motion.div>

          <h3 className="text-3xl sm:text-5xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-4 tracking-tight">
            Let&apos;s Connect!
          </h3>
          <p className="text-[var(--theme-text-secondary)] text-sm sm:text-base mb-8 max-w-md mx-auto font-sans font-semibold">
            Interested in collaboration or have any questions? Feel free to reach out to me through the channels below.
          </p>

          {/* Social connections property list */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {socialLinks.map((link) => {
              let Icon = link.icon;
              if (link.label === "LinkedIn") Icon = FiLinkedin;
              if (link.label === "Email") Icon = FiMail;
              if (link.label === "GitHub") Icon = FiGithub;
              
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border-2 border-black rounded-xl flex items-center justify-center bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] hover:bg-[var(--tag-yellow-bg)] shadow-[3px_3px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--theme-border)] transition-all duration-150"
                  aria-label={link.label}
                  id={`footer-${link.label.toLowerCase()}`}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>

          {/* Bottom attribution */}
          <div className="pt-6 border-t-2 border-[var(--theme-border)] font-mono">
            <p className="text-xs text-[var(--theme-text-secondary)] flex items-center justify-center gap-2 font-bold">
              <span>© 2026 Naufal Nazhif. Built with</span>
              <FiHeart size={14} className="text-red-500 fill-red-500 animate-pulse" />
              <span>using React & Tailwind.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
