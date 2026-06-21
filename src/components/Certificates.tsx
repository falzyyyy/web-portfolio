import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { defaultCertificates, Certificate } from "../data/portfolio-data";
import { cn } from "../utils/cn";
import { 
  Award, 
  Maximize2, 
  X, 
  Calendar, 
  FileText,
  Bookmark
} from "lucide-react";

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Academic");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setCerts(data);
        } else {
          setCerts(defaultCertificates);
        }
      } catch (err: any) {
        console.warn("Supabase certificates table failed to fetch. Falling back to static mock data.", err.message);
        setCerts(defaultCertificates);
      }
    };
    fetchCertificates();
  }, []);

  const categories = ["Academic", "Organization", "Non-Academic"];

  const filteredCerts = certs.filter(c => c.type === activeCategory);

  return (
    <section id="certificates" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-10 font-mono text-sm">
          <span className="font-bold text-[var(--theme-text-muted)] text-base">05.</span>
          <span className="text-[var(--theme-text-muted)]">workspace</span>
          <span className="text-[var(--theme-text-muted)]">/</span>
          <div className="p-1 rounded bg-[var(--tag-orange-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-orange-text)]">
            <Award size={14} />
          </div>
          <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Certificates & Achievements</h2>
        </div>

        {/* Physical Folder Tabs Container */}
        <div className="relative">
          {/* Style sheet injection to hide webkit scrollbars locally */}
          <style>{`
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Folder Tabs Headers */}
          <div 
            className="flex items-end pl-2 sm:pl-4 space-x-1.5 z-0 relative overflow-x-auto flex-nowrap scrollbar-none pb-[2.5px]"
            style={{
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-heading font-bold rounded-t-xl border-t-2.5 border-x-2.5 border-black transition-all cursor-pointer relative flex-shrink-0",
                    isActive
                      ? "bg-[var(--theme-bg-card)] text-[var(--theme-text-primary)] translate-y-[2.5px] z-20 pb-3"
                      : "bg-zinc-200 dark:bg-zinc-800 text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] translate-y-0 z-10 hover:-translate-y-0.5"
                  )}
                  style={{
                    borderBottom: isActive ? "2.5px solid var(--theme-bg-card)" : "none"
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {cat === "Academic" && "🎓"}
                    {cat === "Organization" && "👥"}
                    {cat === "Non-Academic" && "⚽"}
                    <span>{cat === "Non-Academic" ? "Non-Academic" : cat}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Main Folder Content Box */}
          <div className="relative z-10 bg-[var(--theme-bg-card)] border-2.5 border-black rounded-r-2xl rounded-bl-2xl p-6 sm:p-8 shadow-[5px_5px_0px_0px_black] dark:shadow-[5px_5px_0px_0px_var(--theme-border)]">
            
            {filteredCerts.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--theme-border)] p-12 text-center rounded-xl bg-[var(--theme-bg)]">
                <p className="font-mono text-xs text-[var(--theme-text-muted)]">No certificates uploaded under this category yet.</p>
              </div>
            ) : (
              /* Grid of MacOS Window Cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredCerts.map((cert) => {
                  const img = cert.imageUrl || (cert as any).image_url;
                  
                  return (
                    <div 
                      key={cert.id} 
                      onClick={() => setSelectedCert(cert)}
                      className="border-2 border-black dark:border-[var(--theme-border)] rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_0px_black] dark:shadow-[3px_3px_0px_0px_var(--theme-border)] hover:-translate-y-1.5 hover:shadow-[5.5px_5.5px_0px_0px_black] dark:hover:shadow-[5.5px_5.5px_0px_0px_var(--theme-border)] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      {/* MacOS Window Titlebar */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-800 border-b-2 border-black dark:border-[var(--theme-border)]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                        </div>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 select-none">
                          cert_preview.jpg
                        </span>
                      </div>

                      {/* Certificate Document Screenshot Area */}
                      <div className="aspect-[4/3] w-full border-b border-black dark:border-[var(--theme-border)] overflow-hidden relative bg-zinc-50 dark:bg-zinc-950">
                        {img ? (
                          <img 
                            src={img} 
                            alt={cert.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-[1.02] duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-zinc-400">
                            No Credential Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-[10px] font-bold gap-1.5">
                          <Maximize2 size={12} />
                          <span>Maximize</span>
                        </div>
                      </div>

                      {/* Info details block */}
                      <div className="p-4 flex flex-col justify-between flex-grow bg-white dark:bg-zinc-900">
                        <div>
                          <h4 className="font-heading font-extrabold text-sm text-[var(--theme-text-primary)] leading-snug line-clamp-2">
                            {cert.title}
                          </h4>
                          <p className="text-[10px] font-sans font-bold text-[var(--theme-text-secondary)] mt-1.5 flex items-start gap-1">
                            <Bookmark className="w-3 h-3 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <span>{cert.issuer}</span>
                          </p>
                        </div>

                        <div className="mt-4 pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[9px] font-mono font-bold text-[var(--theme-text-muted)]">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {cert.year}
                          </span>
                          <span className="notion-tag bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)] text-[8px] py-0.5 px-1.5">
                            {cert.type === "Non-Academic" ? "Sports" : cert.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-[var(--theme-bg-card)] border-2.5 border-black dark:border-white shadow-[6px_6px_0px_0px_black] dark:shadow-[6px_6px_0px_0px_white] w-full max-w-3xl flex flex-col rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b-2 border-black bg-[var(--theme-bg-workspace)]">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-zinc-600" />
                <span className="font-heading font-extrabold text-sm text-[var(--theme-text-primary)]">Certificate Preview</span>
              </div>
              <button 
                onClick={() => setSelectedCert(null)}
                className="p-1.5 border-2 border-black hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] cursor-pointer bg-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative w-full aspect-[4/3] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
              <img 
                src={selectedCert.imageUrl || (selectedCert as any).image_url} 
                alt={selectedCert.title} 
                className="max-w-full max-h-[60vh] object-contain border border-black rounded-lg shadow-sm"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-5 border-t-2 border-black bg-[var(--theme-bg-card)]">
              <h3 className="text-lg font-heading font-extrabold text-[var(--theme-text-primary)] mb-1">
                {selectedCert.title}
              </h3>
              <p className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] uppercase tracking-wider">
                Issued by {selectedCert.issuer} • {selectedCert.year}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
