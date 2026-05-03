import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";

type Category = "All" | "Organization" | "Project" | "University";

const categories: Category[] = ["All", "Organization", "Project", "University"];

export default function Documentation() {
  const { ref, controls } = useScrollReveal();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [documentations, setDocumentations] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase.from("documentations").select("*").order("created_at", { ascending: false });
      if (data) setDocumentations(data);
    };
    fetchDocs();
  }, []);

  const filteredDocs = activeCategory === "All" 
    ? documentations 
    : documentations.filter(doc => doc.category === activeCategory);

  return (
    <section id="documentation" className="py-12 sm:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-10">
            <span className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">06</span>
            <div className="h-[4px] w-16 bg-[var(--theme-border)]" />
            <h2 className="text-xl font-black heading-neo text-[var(--theme-text-primary)]">Documentation</h2>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-12">
            <h3 className="text-4xl sm:text-5xl font-black text-[#1A1A1A] mb-4">Memories & Highlights</h3>
            <p className="text-lg text-[var(--theme-text-secondary)] font-medium max-w-2xl">
              A glimpse into my journey through university, organizational activities, and project collaborations.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-none font-bold text-base transition-all duration-200 border-[3px] border-[var(--theme-border)] ${
                  activeCategory === category
                    ? "bg-[var(--neo-yellow)] text-[#1A1A1A] shadow-[4px_4px_0px_0px_var(--theme-border)] translate-x-[-2px] translate-y-[-2px]"
                    : "bg-[var(--theme-bg-card)] text-[#1A1A1A] shadow-[0px_0px_0px_0px_var(--theme-border)] hover:shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-y-[2px] hover:-translate-x-[2px]"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Image Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-square sm:aspect-video neo-card overflow-hidden bg-[var(--theme-bg-card)] p-2"
                >
                  <div className="w-full h-full border-2 border-[var(--theme-border)] rounded-lg overflow-hidden relative">
                    <img
                      src={doc.image_url}
                      alt={doc.title}
                      className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-500"
                      loading="lazy"
                    />
                    
                    {/* Solid Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-[var(--neo-pink)] border-t-[3px] border-[var(--theme-border)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-4">
                      <span className="inline-block text-xs font-black uppercase text-[#1A1A1A] bg-[var(--neo-yellow)] px-2 py-1 border-2 border-[var(--theme-border)] mb-2 shadow-[2px_2px_0px_0px_var(--theme-border)]">
                        {doc.category}
                      </span>
                      <h4 className="text-lg font-black text-[#1A1A1A] leading-tight">
                        {doc.title}
                      </h4>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
