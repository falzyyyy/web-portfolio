import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProfileManager from "./ProfileManager";
import ExperiencesManager from "./ExperiencesManager";
import EducationManager from "./EducationManager";
import ProjectsManager from "./ProjectsManager";
import DocumentationsManager from "./DocumentationsManager";
import CertificatesManager from "./CertificatesManager";
import { FiLogOut, FiHome, FiUser, FiBriefcase, FiBookOpen, FiFolder, FiImage, FiMenu, FiX, FiSettings, FiSearch, FiAward } from "react-icons/fi";

type Tab = "profile" | "experiences" | "education" | "projects" | "certificates" | "documentations";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const tabsInfo = [
    { id: "profile", label: "Profile", icon: <FiUser size={14} />, color: "bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]" },
    { id: "experiences", label: "Experiences", icon: <FiBriefcase size={14} />, color: "bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)]" },
    { id: "education", label: "Education", icon: <FiBookOpen size={14} />, color: "bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)]" },
    { id: "projects", label: "Projects", icon: <FiFolder size={14} />, color: "bg-[var(--tag-orange-bg)] text-[var(--tag-orange-text)]" },
    { id: "certificates", label: "Certificates", icon: <FiAward size={14} />, color: "bg-[var(--tag-orange-bg)] text-[var(--tag-orange-text)]" },
    { id: "documentations", label: "Gallery", icon: <FiImage size={14} />, color: "bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)]" },
  ];

  const activeInfo = tabsInfo.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col md:flex-row text-[var(--theme-text-primary)] font-sans">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden border-b-2.5 border-[var(--theme-border)] bg-[var(--theme-bg-workspace)] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[var(--tag-yellow-bg)] border border-black shadow-[1px_1px_0px_0px_black] text-[var(--tag-yellow-text)]">
            <FiSettings size={14} />
          </div>
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider">CMS Workspace</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border-2 border-black bg-[var(--theme-bg-card)] rounded-lg shadow-[2px_2px_0px_0px_black] text-[var(--theme-text-primary)] cursor-pointer"
        >
          {isSidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </header>

      {/* Left Sidebar */}
      <aside className={`w-full md:w-64 border-r-2.5 border-[var(--theme-border)] bg-[var(--theme-bg-workspace)] flex-shrink-0 flex flex-col justify-between fixed md:sticky top-[60px] md:top-0 h-[calc(100vh-60px)] md:h-screen z-40 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div>
          {/* User profile block at top */}
          <div className="p-4 border-b-2.5 border-[var(--theme-border)] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)] flex items-center justify-center font-heading font-extrabold text-sm border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] select-none">
              N
            </div>
            <div>
              <h4 className="font-heading font-extrabold text-xs text-[var(--theme-text-primary)]">naufal-workspace</h4>
              <span className="text-[var(--theme-text-muted)] text-[9px] font-mono font-bold">Role: Workspace Admin</span>
            </div>
          </div>

          {/* Quick search/action */}
          <div className="px-3 pt-4 pb-2">
            <div className="px-3 py-2 border-2 border-[var(--theme-border)] bg-[var(--theme-bg-card)] rounded-xl font-mono text-[10px] text-[var(--theme-text-muted)] flex items-center justify-between shadow-[2px_2px_0px_0px_var(--theme-border)]">
              <span className="flex items-center gap-1.5 font-bold">
                <FiSearch size={12} className="text-[var(--theme-text-primary)]" />
                Search pages
              </span>
              <span className="px-1.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[9px] font-bold">Ctrl K</span>
            </div>
          </div>

          {/* Sidebar Tabs Links */}
          <div className="px-3 py-3 space-y-1.5">
            <span className="px-2.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--theme-text-muted)] block mb-2">
              Workspace Pages
            </span>
            {tabsInfo.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Tab);
                    setIsSidebarOpen(false);
                  }}
                  className={`notion-sidebar-item ${isSelected ? "active" : ""}`}
                >
                  <div className={`p-1 rounded-md border border-[var(--theme-border)] shadow-[1px_1px_0px_0px_var(--theme-border)] flex items-center justify-center ${tab.color}`}>
                    {tab.icon}
                  </div>
                  <span className="text-xs font-heading font-extrabold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer actions */}
        <div className="p-4 border-t-2.5 border-[var(--theme-border)] space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] text-xs flex items-center justify-center"
          >
            <FiHome size={13} />
            <span>Go to Public Site</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full neo-brutal-btn bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] text-xs flex items-center justify-center"
          >
            <FiLogOut size={13} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Sidebar mobile overlay background */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden top-[60px]"
        />
      )}

      {/* Main Workspace content */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto bg-[var(--theme-bg)]">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs path */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-[10px] text-[var(--theme-text-muted)] mb-6">
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/")}>naufal</span>
            <span>/</span>
            <span className="hover:underline cursor-pointer">admin</span>
            <span>/</span>
            <span className="font-semibold text-[var(--theme-text-primary)]">{activeInfo?.label.toLowerCase()}</span>
          </div>

          {/* Document Section header */}
          <div className="mb-8 flex items-start gap-4">
            <div className={`p-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${activeInfo?.color} flex items-center justify-center flex-shrink-0`}>
              {activeInfo?.icon}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight mb-1 text-[var(--theme-text-primary)]">
                {activeInfo?.label} Settings
              </h2>
              <p className="text-xs sm:text-sm font-sans font-semibold text-[var(--theme-text-secondary)]">
                Manage database records for the {activeInfo?.label} list on your landing page.
              </p>
            </div>
          </div>

          {/* Document Content Canvas */}
          <div className="border-2.5 border-[var(--theme-border)] p-6 sm:p-8 bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)]">
            {activeTab === "profile" && <ProfileManager />}
            {activeTab === "experiences" && <ExperiencesManager />}
            {activeTab === "education" && <EducationManager />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "certificates" && <CertificatesManager />}
            {activeTab === "documentations" && <DocumentationsManager />}
          </div>
        </div>
      </main>
    </div>
  );
}
