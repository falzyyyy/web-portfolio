import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { defaultCertificates, Certificate } from "../data/portfolio-data";
import { cn } from "../utils/cn";
import { 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Calendar, 
  FileText,
  Bookmark
} from "lucide-react";

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setCerts(data);
        } else {
          // Empty state fallback
          setCerts(defaultCertificates);
        }
      } catch (err: any) {
        console.warn("Supabase certificates table not found or failed to fetch. Falling back to static mock data.", err.message);
        setCerts(defaultCertificates);
      }
    };
    fetchCertificates();
  }, []);

  const categories = ["All", "Academic", "Organization", "Non-Academic"];

  const filteredCerts = certs.filter(c => 
    activeCategory === "All" ? true : c.type === activeCategory
  );

  const handlePrev = () => {
    setCurrentIndex(prev => 
      prev === 0 ? Math.max(0, filteredCerts.length - 1) : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
      prev === Math.max(0, filteredCerts.length - 1) ? 0 : prev + 1
    );
  };

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  return (
    <section id="certificates" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)]">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Label */}
        <div className="flex items-center gap-2 mb-8 font-mono text-sm">
          <span className="font-bold text-[var(--theme-text-muted)] text-base">05.</span>
          <span className="text-[var(--theme-text-muted)]">workspace</span>
          <span className="text-[var(--theme-text-muted)]">/</span>
          <div className="p-1 rounded bg-[var(--tag-orange-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-orange-text)]">
            <Award size={14} />
          </div>
          <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Certificates & Achievements</h2>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 text-xs font-heading font-bold rounded-lg border-2 border-black transition-all cursor-pointer",
                activeCategory === cat
                  ? "bg-[var(--theme-border)] text-white shadow-[2px_2px_0px_0px_var(--theme-border)] dark:shadow-[2px_2px_0px_0px_white] dark:border-white translate-y-0.5"
                  : "bg-[var(--theme-bg-card)] text-[var(--theme-text-primary)] shadow-[3px_3px_0px_0px_black] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_black]"
              )}
            >
              {cat === "Non-Academic" ? "⚽ Non-Academic (Sports)" : cat}
            </button>
          ))}
        </div>

        {filteredCerts.length === 0 ? (
          <div className="border-2.5 border-dashed border-[var(--theme-border)] p-12 text-center rounded-2xl bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)]">
            <p className="font-mono text-xs text-[var(--theme-text-muted)]">No certificates found in this category.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Slider view port */}
            <div className="overflow-hidden p-2">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 + 4)}%)`,
                  width: `${filteredCerts.length * 100}%`
                }}
              >
                {filteredCerts.map((cert) => {
                  const badgeColors = {
                    "Academic": "bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]",
                    "Organization": "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]",
                    "Non-Academic": "bg-[var(--tag-brown-bg)] text-[var(--tag-brown-text)]"
                  };
                  const badgeColor = badgeColors[cert.type] || "bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]";

                  return (
                    <div 
                      key={cert.id} 
                      className="w-full border-2.5 border-black dark:border-[var(--theme-border)] bg-[var(--theme-bg-card)] rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center shadow-[5px_5px_0px_0px_black] dark:shadow-[5px_5px_0px_0px_var(--theme-border)] flex-shrink-0"
                    >
                      {/* Left: Certificate Preview Card */}
                      <div 
                        onClick={() => setSelectedCert(cert)}
                        className="w-full md:w-1/2 aspect-[4/3] border-2 border-black rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-[2px_2px_0px_0px_black] relative group cursor-pointer"
                      >
                        <img 
                          src={cert.imageUrl} 
                          alt={cert.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-mono text-xs font-bold gap-2">
                          <Maximize2 size={16} />
                          <span>Zoom Certificate</span>
                        </div>
                      </div>

                      {/* Right: Info Card */}
                      <div className="w-full md:w-1/2 flex flex-col justify-between self-stretch">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("notion-tag text-[9px] font-sans font-bold", badgeColor)}>
                              {cert.type === "Non-Academic" ? "⚽ Non-Academic" : cert.type}
                            </span>
                            <span className="notion-tag bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)] text-[9px] font-mono">
                              <Calendar size={10} />
                              {cert.year}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[var(--theme-text-primary)] leading-tight">
                            {cert.title}
                          </h3>

                          <p className="text-sm font-sans font-semibold text-[var(--theme-text-secondary)] flex items-start gap-2">
                            <Bookmark className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                            <span>{cert.issuer}</span>
                          </p>
                        </div>

                        <div className="mt-6 md:mt-0 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-[var(--theme-text-muted)]">
                            Credential ID: {cert.id}
                          </span>
                          <button 
                            onClick={() => setSelectedCert(cert)}
                            className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] text-xs py-1.5 flex items-center gap-1.5"
                          >
                            <Maximize2 size={12} />
                            <span>Zoom View</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Slider Navigation controls */}
            {filteredCerts.length > 1 && (
              <div className="flex justify-end gap-3.5 mt-6">
                <button 
                  onClick={handlePrev}
                  className="p-2 border-2 border-black bg-[var(--theme-bg-card)] rounded-lg shadow-[2.5px_2.5px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-[var(--theme-text-primary)] hover:bg-[var(--tag-gray-bg)]"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-2 border-2 border-black bg-[var(--theme-bg-card)] rounded-lg shadow-[2.5px_2.5px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer text-[var(--theme-text-primary)] hover:bg-[var(--tag-gray-bg)]"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Separator Line */}
        <div className="mt-16 h-[2.5px] bg-[var(--theme-border)] origin-center" />
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
                src={selectedCert.imageUrl} 
                alt={selectedCert.title} 
                className="max-w-full max-h-[60vh] object-contain border border-black rounded-lg shadow-sm"
              />
            </div>

            {/* Modal Info Footer */}
            <div className="p-5 border-t-2 border-black bg-[var(--theme-bg-card)]">
              <h4 className="text-lg font-heading font-extrabold text-[var(--theme-text-primary)] mb-1">
                {selectedCert.title}
              </h4>
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
