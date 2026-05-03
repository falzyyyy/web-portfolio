import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import ProfileManager from "./ProfileManager";
import ExperiencesManager from "./ExperiencesManager";
import EducationManager from "./EducationManager";
import ProjectsManager from "./ProjectsManager";
import DocumentationsManager from "./DocumentationsManager";

type Tab = "profile" | "experiences" | "education" | "projects" | "documentations";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[#1A1A1A] font-sans pb-20">
      {/* Admin Navbar */}
      <nav className="border-b-[4px] border-[var(--theme-border)] px-6 py-4 flex justify-between items-center bg-[var(--neo-yellow)] sticky top-0 z-50 shadow-[0px_4px_0px_0px_var(--theme-border)]">
        <h1 className="text-2xl font-black heading-neo uppercase tracking-tighter">
          Admin CMS
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            View Site
          </button>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--neo-pink)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-black mb-4 heading-neo">Dashboard</h2>
          <p className="text-lg font-bold text-[var(--theme-text-secondary)]">
            Manage your portfolio content. Changes will be reflected immediately.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {(["profile", "experiences", "education", "projects", "documentations"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold uppercase tracking-wider border-[3px] border-[var(--theme-border)] transition-all ${
                activeTab === tab 
                  ? "bg-[var(--neo-cyan)] shadow-[4px_4px_0px_0px_var(--theme-border)] translate-x-0 translate-y-0" 
                  : "bg-[var(--theme-bg-card)] hover:bg-[var(--neo-yellow)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:shadow-[4px_4px_0px_0px_var(--theme-border)] opacity-70 hover:opacity-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="neo-card p-8 bg-[var(--theme-bg-card)] min-h-[500px]">
          {activeTab === "profile" && <ProfileManager />}
          {activeTab === "experiences" && <ExperiencesManager />}
          {activeTab === "education" && <EducationManager />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "documentations" && <DocumentationsManager />}
        </div>
      </main>
    </div>
  );
}
