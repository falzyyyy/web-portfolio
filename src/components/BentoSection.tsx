import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { hardSkills, softSkills } from "../data/portfolio-data";
import { cn } from "../utils/cn";
import { 
  User, 
  MapPin, 
  Award, 
  BookOpen, 
  Activity, 
  Target, 
  TrendingUp, 
  Check, 
  Terminal, 
  Hash, 
  ChevronRight, 
  FileText 
} from "lucide-react";

export default function BentoSection() {
  const [profile, setProfile] = useState<any>(null);
  const [education, setEducation] = useState<any[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "naufal-workspace login: success",
    "Type 'help' to see list of available commands."
  ]);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfileAndEducation = async () => {
      const { data: profileData } = await supabase.from("profiles").select("*").single();
      if (profileData) setProfile(profileData);

      const { data: eduData } = await supabase.from("education").select("*").order("order_index", { ascending: true });
      if (eduData) setEducation(eduData);
    };
    fetchProfileAndEducation();
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response = "";
    switch (cmd) {
      case "help":
        response = "Available commands: help, about, skills, gpa, clear";
        break;
      case "about":
        response = profile?.tagline || "IT professional passionate about technology and communication solutions.";
        break;
      case "skills":
        response = `Technical stack: ${hardSkills.slice(0, 6).map(s => s.name).join(", ")} and more.`;
        break;
      case "gpa":
        response = "GPA: 3.74/4.00 | Honors: Cum Laude | University of Sriwijaya";
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      default:
        response = `Command not found: '${cmd}'. Type 'help' for options.`;
    }

    setTerminalHistory(prev => [...prev, `> ${terminalInput}`, response]);
    setTerminalInput("");
  };

  const paragraphs = profile?.about_paragraphs || [
    "My name is Naufal Nazhif Almaulidzar, a fresh graduate of Informatics Engineering from the Faculty of Computer Science, Sriwijaya University. I am passionate about cloud architecture, event coordination, and coding solutions.",
    "I focus on creating high-quality, scalable digital interfaces and establishing meaningful community connections through public relations."
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 bg-[var(--theme-bg)] transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-10 font-mono text-sm">
          <span className="font-bold text-[var(--theme-text-muted)] text-base">01.</span>
          <span className="text-[var(--theme-text-muted)]">workspace</span>
          <span className="text-[var(--theme-text-muted)]">/</span>
          <div className="p-1 rounded bg-[var(--tag-yellow-bg)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center text-[var(--tag-yellow-text)]">
            <User size={14} />
          </div>
          <h2 className="font-heading font-extrabold text-[var(--theme-text-primary)]">Bento Workspace</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[auto]">
          
          {/* Card 1: About Me (Large, spans 2 cols) */}
          <div className="md:col-span-2 border-2.5 border-[var(--theme-border)] rounded-2xl p-6 sm:p-8 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-4 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-1.5">
                <FileText size={14} />
                <span>workspace / readme.md</span>
              </h3>
              <div className="space-y-4 font-sans font-medium text-[var(--theme-text-secondary)] text-sm sm:text-base leading-relaxed">
                {paragraphs.map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            
            <div className="mt-6 notion-callout bg-[var(--tag-gray-bg)] border-2 border-[var(--theme-border)] shadow-[2.5px_2.5px_0px_0px_var(--theme-border)]">
              <div className="p-2 bg-[var(--tag-red-bg)] text-[var(--tag-red-text)] border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] rounded-md notion-callout-icon">
                <Target size={18} />
              </div>
              <div>
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--theme-text-primary)]">Mission</p>
                <p className="text-xs sm:text-sm font-heading font-extrabold text-[var(--theme-text-secondary)] mt-0.5">
                  Fostering meaningful tech solutions through public relations, cloud systems, and high-fidelity code principles.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Workspace Properties (1 col) */}
          <div className="border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200 flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-4 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-1.5">
                <Hash size={14} />
                <span>Properties</span>
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm font-heading font-bold">
                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Location</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)]">
                      <MapPin size={11} className="text-zinc-600 flex-shrink-0" />
                      Palembang, ID
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Degree</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
                      <Award size={11} className="flex-shrink-0" />
                      Bachelor of CS
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">University</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]">
                      <BookOpen size={11} className="flex-shrink-0" />
                      Sriwijaya Univ
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-2">
                  <span className="text-[var(--theme-text-secondary)] font-mono text-xs font-semibold">Status</span>
                  <div className="col-span-2">
                    <span className="notion-tag bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]">
                      <Activity size={11} className="flex-shrink-0" />
                      Active Graduate
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 border-2 border-dashed border-[var(--theme-border)] rounded-xl bg-[var(--theme-bg)] text-center shadow-[2px_2px_0px_0px_var(--theme-border)]">
              <span className="text-xs font-mono font-bold text-[var(--theme-text-muted)] uppercase block mb-1">GPA ACHIEVED</span>
              <span className="text-3xl font-heading font-extrabold text-[var(--notion-blue)]">3.74</span>
            </div>
          </div>

          {/* Card 3: Education History (Large, spans 2 cols) */}
          <div className="md:col-span-2 border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-5 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-2">
              <BookOpen size={14} />
              <span>Education records</span>
            </h3>

            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border-2 border-[var(--theme-border)] bg-[var(--tag-purple-bg)] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_var(--theme-border)] text-[var(--tag-purple-text)]">
                    <Award size={18} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-[var(--theme-text-primary)]">
                        {edu.degree}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-[var(--theme-text-secondary)] bg-[var(--tag-gray-bg)] border border-[var(--theme-border)] px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_var(--theme-border)] w-fit">
                        {edu.year}
                      </span>
                    </div>
                    <p className="text-xs font-heading font-bold text-[var(--theme-text-muted)] flex items-center gap-1">
                      <MapPin size={10} />
                      <span>{edu.institution}</span>
                    </p>
                    {edu.degree.toLowerCase().includes("bachelor") && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="notion-tag bg-[var(--tag-green-bg)] text-[var(--tag-green-text)] text-[10px]">
                          <TrendingUp size={10} />
                          GPA: 3.74
                        </span>
                        <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] text-[10px]">
                          <Award size={10} />
                          Cum Laude Honors
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Technical Skills (1 col) */}
          <div className="border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-4 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-2">
              <Activity size={14} />
              <span>Technical Skills</span>
            </h3>

            <div className="flex flex-wrap gap-2">
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
                  <div
                    key={skill.name}
                    className={cn(
                      "notion-tag text-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-default",
                      tagColor
                    )}
                  >
                    <Icon size={12} className="flex-shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 5: Interactive Terminal Sandbox (Large, spans 2 cols) */}
          <div className="md:col-span-2 border-2.5 border-[var(--theme-border)] rounded-2xl bg-[#1e1e24] text-zinc-100 p-5 font-mono shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Terminal size={14} className="text-[var(--tag-yellow-bg)]" />
                  <span className="text-[11px] font-bold text-zinc-400">naufal-bash v1.0.2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              </div>

              <div ref={terminalBodyRef} className="text-xs space-y-1.5 h-[120px] overflow-y-auto custom-scrollbar">
                {terminalHistory.map((line, i) => (
                  <div key={i} className={cn(
                    "leading-relaxed",
                    line.startsWith(">") ? "text-[var(--tag-blue-bg)] font-bold" : "text-zinc-300"
                  )}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 border-t border-zinc-700 pt-3 mt-2">
              <span className="text-zinc-400 font-bold select-none">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="type help..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-white placeholder-zinc-500 font-mono"
              />
              <button type="submit" className="px-2.5 py-1 bg-zinc-700 text-white rounded text-[10px] font-bold hover:bg-zinc-600 transition-colors border border-black shadow-[1.5px_1.5px_0px_0px_black] active:translate-x-0.5 active:translate-y-0.5">
                <ChevronRight size={12} />
              </button>
            </form>
          </div>

          {/* Card 6: Core Competencies (1 col) */}
          <div className="border-2.5 border-[var(--theme-border)] rounded-2xl p-6 bg-[var(--theme-bg-card)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--theme-border)] transition-all duration-200">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--theme-text-muted)] mb-4 border-b-2 border-[var(--theme-border)] pb-2 flex items-center gap-2">
              <Check size={14} />
              <span>Competencies</span>
            </h3>

            <ul className="space-y-3">
              {softSkills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 text-[var(--theme-text-primary)]"
                >
                  <span className="flex items-center justify-center w-4.5 h-4.5 border-2 border-[var(--theme-border)] bg-[var(--notion-blue)] rounded shadow-[1px_1px_0px_0px_var(--theme-border)] flex-shrink-0">
                    <Check size={10} className="text-white stroke-[3px]" />
                  </span>
                  <span className="text-xs sm:text-sm font-sans font-semibold text-[var(--theme-text-secondary)]">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Visual Section Separator */}
        <div className="mt-16 h-[2.5px] bg-[var(--theme-border)] origin-center" />
      </div>
    </section>
  );
}
