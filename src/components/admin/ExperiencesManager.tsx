import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
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

  if (loading && experiences.length === 0) return <div className="animate-pulse">Loading experiences...</div>;

  return (
    <div>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={executeDelete}
        itemName={deleteModal.name}
      />

      <div className="mb-8 flex items-center justify-between border-b-[3px] border-[var(--theme-border)] pb-4">
        <h3 className="text-3xl font-black heading-neo uppercase">Experiences</h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", organization: "", year: "", description: "", order_index: 0 });
            }}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-[var(--neo-cyan)] p-6 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)]">
        <h4 className="text-xl font-black mb-4 uppercase">{editingId ? "Edit Experience" : "Add New Experience"}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Title (Role)</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Organization</label>
            <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Year/Duration</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="e.g. Jan 2024 - Present" className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Order Index</label>
            <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-black mb-1 uppercase">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
        </div>
        <button type="submit" className="bg-[var(--neo-yellow)] font-black uppercase px-6 py-2 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
          {editingId ? "Update Data" : <><FiPlus size={18}/> Add Data</>}
        </button>
      </form>

      <div className="space-y-4">
        {experiences.map(exp => (
          <div key={exp.id} className="border-[3px] border-[var(--theme-border)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--theme-bg-card)]">
            <div>
              <h5 className="font-black text-lg">{exp.title} <span className="text-[var(--neo-purple)]">@ {exp.organization}</span></h5>
              <p className="text-sm font-bold text-gray-500 mb-2">{exp.year} | Order: {exp.order_index}</p>
              <p className="text-sm font-medium">{exp.description}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
              <button onClick={() => handleEdit(exp)} className="p-2 bg-[var(--neo-green)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiEdit2 size={16}/></button>
              <button onClick={() => confirmDelete(exp)} className="p-2 bg-[var(--neo-pink)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiTrash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
