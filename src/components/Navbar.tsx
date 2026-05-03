import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#documentation" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`pointer-events-auto transition-all duration-300 w-full max-w-5xl rounded-full ${
          isScrolled
            ? "bg-[var(--theme-bg-card)] border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)]"
            : "bg-transparent border-[3px] border-transparent"
        }`}
      >
        <div className={`mx-auto px-6 flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}>
          {/* Logo */}
        <a
          href="#"
          className="text-2xl font-black tracking-tight text-[var(--theme-text-primary)] hover:-translate-y-1 transition-transform"
        >
          N<span className="text-[var(--neo-pink)]">.</span>
        </a>

        {/* Desktop Links & Theme Toggle */}
        <div className="hidden md:flex items-center gap-8 font-bold">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-[var(--neo-yellow)] rounded-md border-2 border-[var(--theme-border)] text-[#1A1A1A] hover:bg-[var(--neo-pink)] transition-all duration-300 hover:rotate-12 shadow-[2px_2px_0px_0px_var(--theme-border)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 bg-[var(--neo-yellow)] rounded-md border-2 border-[var(--theme-border)] text-[#1A1A1A] shadow-[2px_2px_0px_0px_var(--theme-border)]"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />}
          </button>
          
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 bg-[var(--theme-bg-card)] rounded-md border-2 border-[var(--theme-border)] text-[var(--theme-text-primary)] shadow-[2px_2px_0px_0px_var(--theme-border)]"
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isMobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 top-20 bg-[var(--theme-bg-card)] z-40 border-b-[3px] border-[var(--theme-border)]"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-3xl font-black heading-neo text-[var(--theme-text-primary)] hover:text-[var(--neo-pink)] transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
    </div>
  );
}
