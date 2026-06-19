import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal, staggerContainer, staggerItem } from "../hooks/useScrollReveal";
import { supabase } from "../lib/supabase";
import { FiImage, FiFolder, FiCalendar, FiBookmark } from "react-icons/fi";

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
    <section id="documentation" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={ref} initial="hidden" animate={controls}>
          {/* Section label */}
          <motion.div variants={staggerItem} className="flex items-center gap-2 mb-8 font-mono text-sm">
            <span className="font-bold text-[var(--theme-text-muted)] text-base">06.</span>
            <span className="text-[var(--theme-text-muted)]">workspace</span>
            <span className="text-[var(--theme-text-muted)]">/</span>
            <div className="p-1 rounded bg-[var(--tag-pink-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-pink-text)]">
              <FiImage size={14} />
            </div>
            <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Gallery Board: Memories</h2>
          </motion.div>

          <motion.div variants={staggerItem} className="mb-8">
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-2">Highlights & Memories</h3>
            <p className="text-sm sm:text-base text-[var(--theme-text-secondary)] font-medium max-w-2xl">
              A compilation of key moments across university life, organization events, and project development.
            </p>
          </motion.div>

          {/* Category Filter styled like physical 3D buttons */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => {
              const chipColors = {
                All: "bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)] border-black",
                Organization: "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] border-black",
                Project: "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] border-black",
                University: "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)] border-black",
              };
              
              const isSelected = activeCategory === category;
              
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs font-heading font-extrabold uppercase tracking-wider border-2 border-black transition-all rounded-lg cursor-pointer ${
                    isSelected
                      ? `${chipColors[category]} shadow-[1px_1px_0px_0px_var(--theme-border)] translate-x-[2px] translate-y-[2px]`
                      : "bg-[var(--theme-bg-card)] text-[var(--theme-text-secondary)] hover:bg-[var(--tag-gray-bg)] shadow-[3px_3px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_var(--theme-border)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_0px_var(--theme-border)]"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <FiFolder size={12} className="flex-shrink-0" />
                    <span>{category}</span>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Clean Rounded Image Grid */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((doc, idx) => {
                const colors = {
                  Organization: "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)]",
                  Project: "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]",
                  University: "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]",
                };
                const tagColorClass = colors[doc.category as keyof typeof colors] || "bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]";
                
                // Subtle rotation effect for Neo-Brutalist look
                const rotateClass = idx % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1";

                return (
                  <motion.div
                    key={doc.id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`border-2.5 border-[var(--theme-border)] bg-[var(--theme-bg-card)] p-4 flex flex-col group rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_var(--theme-border)] ${rotateClass} transition-all duration-200`}
                  >
                    {/* Photo Frame */}
                    <div className="w-full aspect-[4/3] border-2 border-[var(--theme-border)] rounded-xl overflow-hidden relative bg-zinc-100 dark:bg-zinc-800 shadow-[1.5px_1.5px_0px_0px_var(--theme-border)]">
                      <img
                        src={doc.image_url}
                        alt={doc.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Floating Category tag on top right */}
                      <span className={`absolute top-3 right-3 text-[10px] font-heading font-extrabold px-2 py-0.5 rounded border border-[var(--theme-border)] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${tagColorClass} flex items-center gap-1`}>
                        <FiBookmark size={10} />
                        {doc.category}
                      </span>
                    </div>
                    
                    {/* Caption */}
                    <div className="pt-4 pb-1 flex-grow flex flex-col justify-end">
                      <h4 className="text-base font-heading font-extrabold text-[var(--theme-text-primary)] leading-snug group-hover:text-[var(--notion-blue)] transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-[var(--theme-text-muted)] mt-2 flex items-center gap-1.5">
                        <FiCalendar size={12} />
                        {new Date(doc.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
