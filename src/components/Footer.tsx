import { motion } from "framer-motion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { FiGithub, FiLinkedin, FiMail, FiHeart } from "react-icons/fi";
import { socialLinks } from "../data/portfolio-data";

export default function Footer() {
  const { ref, controls, variants } = useScrollReveal();

  return (
    <footer id="contact" className="py-20 px-6 border-t-[4px] border-[var(--theme-border)] bg-[var(--neo-cyan)] mt-24">
      <div className="max-w-4xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants} className="text-center neo-card p-12 bg-[var(--theme-bg-card)]">
          <motion.div className="flex items-center gap-4 justify-center mb-10">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">07</span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">Contact</h2>
          </motion.div>

          <h3 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] mb-6 uppercase tracking-tighter">
            Let&apos;s Work Together
          </h3>
          <p className="text-[#1A1A1A] font-bold text-lg mb-10 max-w-md mx-auto">
            Tertarik untuk berkolaborasi atau punya pertanyaan? Jangan ragu untuk menghubungi saya.
          </p>

          <div className="flex items-center justify-center gap-6 mb-16">
            {socialLinks.map((link, idx) => {
              let Icon = link.icon;
              if (link.label === "LinkedIn") Icon = FiLinkedin;
              if (link.label === "Email") Icon = FiMail;
              if (link.label === "GitHub") Icon = FiGithub;
              
              const colors = ["var(--neo-yellow)", "var(--neo-pink)", "var(--neo-purple)"];
              const bgColor = colors[idx % colors.length];
              
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 border-4 border-[var(--theme-border)] flex items-center justify-center text-[#1A1A1A] hover:scale-110 transition-transform duration-300 shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-y-[-4px]"
                  style={{ backgroundColor: bgColor, borderRadius: idx % 2 === 0 ? '16px' : '50%' }}
                  aria-label={link.label}
                  id={`footer-${link.label.toLowerCase()}`}
                >
                  <Icon size={28} />
                </a>
              );
            })}
          </div>

          <div className="pt-8 border-t-[4px] border-[var(--theme-border)]">
            <p className="text-sm font-bold text-[#1A1A1A] flex items-center justify-center gap-2">
              © 2026 Naufal Nazhif. Built with
              <FiHeart size={16} className="text-[var(--neo-pink)] fill-[var(--neo-pink)]" />
              using React.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
