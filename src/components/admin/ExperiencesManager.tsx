import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus, FiBriefcase, FiCalendar, FiHash } from "react-icons/fi";
import DeleteModal from "./DeleteModal";

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; id: string; name: string}>({
    isOpen: false,
    id: "",
    name: ""
  });
  
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    year: "",
    description: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("experiences").select("*").order("order_index", { ascending: true });
    if (data) setExperiences(data);
    else console.error("Error fetching experiences:", error);
    setLoading(false);
  };

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      organization: exp.organization,
      year: exp.year,
      description: exp.description,
      order_index: exp.order_index,
    });
  };

  const confirmDelete = (exp: any) => {
    setDeleteModal({ isOpen: true, id: exp.id, name: exp.title });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    await supabase.from("experiences").delete().eq("id", deleteModal.id);
    fetchExperiences();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from("experiences").update(formData).eq("id", editingId);
    } else {
      await supabase.from("experiences").insert([formData]);
    }
    setEditingId(null);
    setFormData({ title: "", organization: "", year: "", description: "", order_index: 0 });
    fetchExperiences();
  };

  if (loading && experiences.length === 0) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading experiences...</div>;

  return (
    <div>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={executeDelete}
        itemName={deleteModal.name}
      />

      <div className="mb-6 flex items-center justify-between border-b-2 border-[var(--theme-border)] pb-4">
        <h3 className="text-base font-heading font-extrabold text-[var(--theme-text-primary)] flex items-center gap-2">
          <div className="p-1 rounded bg-[var(--tag-yellow-bg)] border border-black shadow-[1px_1px_0px_0px_black] text-[var(--tag-yellow-text)] flex items-center justify-center">
            <FiBriefcase size={14} />
          </div>
          <span>Experiences List</span>
        </h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", organization: "", year: "", description: "", order_index: 0 });
            }}
            className="neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] text-xs py-1.5"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Editor Form Card */}
      <form onSubmit={handleSubmit} className="mb-8 bg-[var(--tag-gray-bg)]/20 p-6 border-2 border-[var(--theme-border)] rounded-2xl shadow-[3px_3px_0px_0px_var(--theme-border)]">
        <h4 className="text-xs font-mono font-bold mb-4 uppercase text-[var(--theme-text-primary)]">
          {editingId ? "📝 Edit Experience" : "➕ Add New Experience"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Title (Role)</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Organization</label>
            <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Year / Duration</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="e.g. Jan 2024 - Present" className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Order Index</label>
            <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} required className="notion-input" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="notion-input" />
        </div>
        
        <button type="submit" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
          {editingId ? "Update Record" : <><FiPlus size={14}/> Add Record</>}
        </button>
      </form>

      {/* Record listings */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div key={exp.id || idx} className="border-2.5 border-[var(--theme-border)] p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--theme-border)] transition-all duration-200">
            <div className="space-y-2 flex-1 min-w-0 mr-4">
              <h5 className="font-heading font-extrabold text-base text-[var(--theme-text-primary)] flex items-center gap-2">
                <FiBriefcase className="text-[var(--notion-blue)] flex-shrink-0" />
                <span>{exp.title}</span>
                <span className="text-[var(--theme-text-muted)] font-normal text-xs">@ {exp.organization}</span>
              </h5>
              
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="notion-tag bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] text-[10px]">
                  <FiCalendar size={10} />
                  {exp.year}
                </span>
                <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] text-[10px]">
                  <FiHash size={10} />
                  Order: {exp.order_index}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm font-sans font-medium text-[var(--theme-text-secondary)] leading-relaxed pt-1">
                {exp.description}
              </p>
            </div>
            
            <div className="flex gap-2 mt-3 md:mt-0 flex-shrink-0">
              <button 
                onClick={() => handleEdit(exp)} 
                className="p-2 border-2 border-black rounded-xl bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Edit"
              >
                <FiEdit2 size={13} />
              </button>
              <button 
                onClick={() => confirmDelete(exp)} 
                className="p-2 border-2 border-black rounded-xl bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Delete"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
