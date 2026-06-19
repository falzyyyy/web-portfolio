import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus, FiBookOpen, FiCalendar, FiHash } from "react-icons/fi";
import DeleteModal from "./DeleteModal";

export default function EducationManager() {
  const [education, setEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; id: string; name: string}>({
    isOpen: false,
    id: "",
    name: ""
  });
  
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    year: "",
    description: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("education").select("*").order("order_index", { ascending: true });
    if (data) setEducation(data);
    else console.error("Error fetching education:", error);
    setLoading(false);
  };

  const handleEdit = (edu: any) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      description: edu.description ? edu.description.join("\n") : "",
      order_index: edu.order_index,
    });
  };

  const confirmDelete = (edu: any) => {
    setDeleteModal({ isOpen: true, id: edu.id, name: edu.degree });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    await supabase.from("education").delete().eq("id", deleteModal.id);
    fetchEducation();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      degree: formData.degree,
      institution: formData.institution,
      year: formData.year,
      description: formData.description.split("\n").map(d => d.trim()).filter(Boolean),
      order_index: formData.order_index,
    };

    if (editingId) {
      await supabase.from("education").update(formattedData).eq("id", editingId);
    } else {
      await supabase.from("education").insert([formattedData]);
    }
    setEditingId(null);
    setFormData({ degree: "", institution: "", year: "", description: "", order_index: 0 });
    fetchEducation();
  };

  if (loading && education.length === 0) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading education data...</div>;

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
          <div className="p-1 rounded bg-[var(--tag-purple-bg)] border border-black shadow-[1px_1px_0px_0px_black] text-[var(--tag-purple-text)] flex items-center justify-center">
            <FiBookOpen size={14} />
          </div>
          <span>Education Records</span>
        </h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ degree: "", institution: "", year: "", description: "", order_index: 0 });
            }}
            className="neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] text-xs py-1.5"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-[var(--tag-gray-bg)]/20 p-6 border-2 border-[var(--theme-border)] rounded-2xl shadow-[3px_3px_0px_0px_var(--theme-border)]">
        <h4 className="text-xs font-mono font-bold mb-4 uppercase text-[var(--theme-text-primary)]">
          {editingId ? "📝 Edit Education Record" : "➕ Add New Education Record"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Degree Title</label>
            <input type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Institution Name</label>
            <input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Year / Duration</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="e.g. 2022 - Present" className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Order Index</label>
            <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} required className="notion-input" />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Description (One bullet point per line)</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Graduated with honors&#10;Member of student council" className="notion-input" />
        </div>
        
        <button type="submit" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
          {editingId ? "Update Data" : <><FiPlus size={14}/> Add Data</>}
        </button>
      </form>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div key={edu.id || idx} className="border-2.5 border-[var(--theme-border)] p-5 flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--theme-border)] transition-all duration-200">
            <div className="space-y-2 flex-1 min-w-0 mr-4">
              <h5 className="font-heading font-extrabold text-base text-[var(--theme-text-primary)] flex items-center gap-2">
                <FiBookOpen className="text-[var(--notion-blue)] flex-shrink-0" />
                <span>{edu.degree}</span>
                <span className="text-[var(--theme-text-muted)] font-normal text-xs">@ {edu.institution}</span>
              </h5>
              
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="notion-tag bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] text-[10px]">
                  <FiCalendar size={10} />
                  {edu.year}
                </span>
                <span className="notion-tag bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] text-[10px]">
                  <FiHash size={10} />
                  Order: {edu.order_index}
                </span>
              </div>
              
              <ul className="text-xs sm:text-sm font-sans font-medium text-[var(--theme-text-secondary)] list-none pl-0 space-y-2 mt-3">
                {edu.description && edu.description.map((desc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-text-primary)] mt-2 flex-shrink-0 border border-black" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2 mt-3 md:mt-0 flex-shrink-0">
              <button 
                onClick={() => handleEdit(edu)} 
                className="p-2 border-2 border-black rounded-xl bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Edit"
              >
                <FiEdit2 size={13} />
              </button>
              <button 
                onClick={() => confirmDelete(edu)} 
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
