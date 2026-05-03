import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiArrowDown } from "react-icons/hi";
import { FiDownload, FiArrowRight } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function Hero() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  // Use fallback values if not loaded
  const name = profile?.name || "Naufal Nazhif Almaulidzar";
  const tagline = profile?.tagline || "Fresh Graduate of Informatics Engineering, University of Sriwijaya. Passionate about technology, communication, and creating impactful solutions.";
  const roles = profile?.roles || ["IT Professional", "Software Engineer", "Public Relations"];
  const resumeUrl = profile?.resume_url || "#";
  const avatarUrl = profile?.avatar_url || "/profile.jpg";

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[var(--theme-bg)] flex items-center justify-center pt-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row items-center justify-center gap-12 w-full relative z-10">
        
        {/* Left Column: Text Content */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-2 mb-6 bg-[var(--neo-purple)] text-white font-bold border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] rounded-full text-sm">
              Hi, my name is {name.split(" ")[0]}.
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black heading-neo text-[var(--theme-text-primary)] mb-6 leading-tight">
              I am an <br />
              <span className="text-[var(--neo-pink)]" style={{ WebkitTextStroke: '2px var(--theme-border)', textShadow: '4px 4px 0px var(--theme-border)' }}>
                {roles[0] || "IT Professional"}
              </span> <br />
              & Engineer.
            </h1>
            
            <p className="text-lg sm:text-xl text-[var(--theme-text-secondary)] font-medium mb-10 max-w-2xl mx-auto lg:mx-0">
              {tagline}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a href="#projects" className="neo-btn">
                View My Work
                <FiArrowRight size={20} />
              </a>
              
              {resumeUrl && resumeUrl !== "#" && (
                <a 
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 font-bold flex items-center gap-2 text-[var(--theme-text-primary)] border-b-4 border-[var(--theme-border)] hover:bg-[var(--neo-yellow)] hover:border-[var(--theme-border)] transition-colors rounded-lg"
                >
                  <FiDownload size={20} />
                  Download CV
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Profile Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[450px] lg:h-[450px] flex-shrink-0"
        >
          {/* Neobrutalist Image Container */}
          <div className="absolute inset-0 bg-[var(--neo-pink)] border-4 border-[var(--theme-border)] shadow-[8px_8px_0px_0px_var(--theme-border)] rounded-[2rem] overflow-hidden group transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-full h-full object-cover grayscale mix-blend-multiply group-hover:grayscale-0 group-hover:mix-blend-normal transition-all duration-500"
              onError={(e) => {
                e.currentTarget.src = "https://ui-avatars.com/api/?name=Naufal+Nazhif&background=random&size=512";
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HiArrowDown className="text-[#1A1A1A]" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
