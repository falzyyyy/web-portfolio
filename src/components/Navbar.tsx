import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { FiTerminal, FiFolder } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#documentation" },
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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 pointer-events-none">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`pointer-events-auto transition-all duration-300 w-full max-w-5xl rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] ${
          isScrolled
            ? "shadow-[3px_3px_0px_0px_var(--theme-border)]"
            : "shadow-none"
        }`}
      >
        <div className="mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Notion Workspace Breadcrumbs logo */}
          <a
            href="#"
            className="flex items-center gap-2 font-heading font-extrabold text-sm text-[var(--theme-text-primary)] group hover:opacity-90"
          >
            <div className="p-1 rounded bg-[var(--tag-blue-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-blue-text)]">
              <FiTerminal size={14} />
            </div>
            <span className="hover:underline">naufal</span>
            <span className="text-[var(--theme-text-muted)] font-normal font-mono">/</span>
            <div className="p-1 rounded bg-[var(--tag-purple-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-purple-text)]">
              <FiFolder size={14} />
            </div>
            <span className="hover:underline text-[var(--theme-text-secondary)]">portfolio</span>
          </a>

          {/* Desktop Links & Theme Toggle */}
          <div className="hidden md:flex items-center gap-1.5 font-bold font-heading">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-md border-2 border-transparent text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-yellow-bg)] hover:border-[var(--theme-border)] hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
            
            <div className="w-[2px] h-5 bg-[var(--theme-border)] mx-2" />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-transparent rounded-md text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-pink-bg)] hover:border-[var(--theme-border)] hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all duration-150 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon size={14} /> : <FaSun size={14} />}
            </button>
          </div>

          {/* Mobile Hamburger & Theme Toggle */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-transparent rounded-md text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-pink-bg)] hover:border-[var(--theme-border)] hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FaMoon size={14} /> : <FaSun size={14} />}
            </button>
            
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 border-2 border-transparent rounded-md text-[var(--theme-text-primary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {isMobileOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] rounded-b-xl overflow-hidden font-heading font-extrabold"
            >
              <div className="p-4 flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-xs uppercase tracking-wider p-2.5 rounded-md border-2 border-transparent text-[var(--theme-text-secondary)] hover:text-black hover:bg-[var(--tag-yellow-bg)] hover:border-[var(--theme-border)] hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
