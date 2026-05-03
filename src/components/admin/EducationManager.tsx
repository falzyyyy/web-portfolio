import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
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

  if (loading && education.length === 0) return <div className="animate-pulse">Loading education data...</div>;

  return (
    <div>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={executeDelete}
        itemName={deleteModal.name}
      />

      <div className="mb-8 flex items-center justify-between border-b-[3px] border-[var(--theme-border)] pb-4">
        <h3 className="text-3xl font-black heading-neo uppercase">Education</h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ degree: "", institution: "", year: "", description: "", order_index: 0 });
            }}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-[var(--neo-green)] p-6 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)]">
        <h4 className="text-xl font-black mb-4 uppercase">{editingId ? "Edit Education" : "Add New Education"}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Degree</label>
            <input type="text" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Institution</label>
            <input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Year/Duration</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="e.g. 2022 - Present" className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Order Index</label>
            <input type="number" value={formData.order_index} onChange={e => setFormData({...formData, order_index: parseInt(e.target.value)})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-black mb-1 uppercase">Description (One bullet point per line)</label>
          <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Graduated with honors&#10;Member of student council" className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
        </div>
        <button type="submit" className="bg-[var(--neo-yellow)] font-black uppercase px-6 py-2 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
          {editingId ? "Update Data" : <><FiPlus size={18}/> Add Data</>}
        </button>
      </form>

      <div className="space-y-4">
        {education.map(edu => (
          <div key={edu.id} className="border-[3px] border-[var(--theme-border)] p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-[var(--theme-bg-card)]">
            <div>
              <h5 className="font-black text-lg">{edu.degree} <span className="text-[var(--neo-purple)]">@ {edu.institution}</span></h5>
              <p className="text-sm font-bold text-gray-500 mb-2">{edu.year} | Order: {edu.order_index}</p>
              <ul className="text-sm font-medium list-disc ml-4 space-y-1">
                {edu.description && edu.description.map((desc: string, i: number) => <li key={i}>{desc}</li>)}
              </ul>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
              <button onClick={() => handleEdit(edu)} className="p-2 bg-[var(--neo-green)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiEdit2 size={16}/></button>
              <button onClick={() => confirmDelete(edu)} className="p-2 bg-[var(--neo-pink)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiTrash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
