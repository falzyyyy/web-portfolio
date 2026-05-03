import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import ImageCropperModal from "./ImageCropperModal";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean; id: string; name: string}>({
    isOpen: false,
    id: "",
    name: ""
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [cropper, setCropper] = useState<{isOpen: boolean, imageSrc: string | null}>({ isOpen: false, imageSrc: null });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    live_url: "",
    github_url: "",
    tech_stack: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (data) setProjects(data);
    else console.error("Error fetching projects:", error);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCropper({ isOpen: true, imageSrc: reader.result?.toString() || null });
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropper({ isOpen: false, imageSrc: null });
    setUploadingImage(true);
    
    try {
      const fileName = `project_${Date.now()}.jpg`;
      const filePath = `projects/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      console.error("Upload failed:", error.message);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (proj: any) => {
    setEditingId(proj.id);
    setFormData({
      title: proj.title,
      description: proj.description,
      image_url: proj.image_url || "",
      live_url: proj.live_url || "",
      github_url: proj.github_url || "",
      tech_stack: proj.tech_stack ? proj.tech_stack.join(", ") : "",
    });
  };

  const confirmDelete = (proj: any) => {
    setDeleteModal({ isOpen: true, id: proj.id, name: proj.title });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    await supabase.from("projects").delete().eq("id", deleteModal.id);
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url,
      live_url: formData.live_url,
      github_url: formData.github_url,
      tech_stack: formData.tech_stack.split(",").map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      await supabase.from("projects").update(formattedData).eq("id", editingId);
    } else {
      await supabase.from("projects").insert([formattedData]);
    }
    setEditingId(null);
    setFormData({ title: "", description: "", image_url: "", live_url: "", github_url: "", tech_stack: "" });
    fetchProjects();
  };

  if (loading && projects.length === 0) return <div className="animate-pulse">Loading projects data...</div>;

  return (
    <div>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={executeDelete}
        itemName={deleteModal.name}
      />

      <div className="mb-8 flex items-center justify-between border-b-[3px] border-[var(--theme-border)] pb-4">
        <h3 className="text-3xl font-black heading-neo uppercase">Projects</h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", description: "", image_url: "", live_url: "", github_url: "", tech_stack: "" });
            }}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-[var(--neo-purple)] p-6 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)]">
        <h4 className="text-xl font-black mb-4 uppercase">{editingId ? "Edit Project" : "Add New Project"}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Tech Stack (Comma Separated)</label>
            <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} required placeholder="React, Node.js, Tailwind" className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-black mb-1 uppercase">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Image URL / Upload</label>
            <div className="flex flex-col gap-2">
              <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="Or paste URL here..." className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none bg-white" />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                <div className={`w-full bg-[var(--neo-cyan)] text-[#1A1A1A] font-bold border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] px-3 py-2 text-center uppercase ${uploadingImage ? 'opacity-50' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'}`}>
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Live URL</label>
            <input type="text" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">GitHub URL</label>
            <input type="text" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
        </div>
        
        <button type="submit" className="mt-4 bg-[var(--neo-yellow)] font-black uppercase px-6 py-2 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
          {editingId ? "Update Data" : <><FiPlus size={18}/> Add Data</>}
        </button>
      </form>

      <div className="space-y-4">
        {projects.map(proj => (
          <div key={proj.id} className="border-[3px] border-[var(--theme-border)] p-4 flex flex-col md:flex-row justify-between items-start bg-[var(--theme-bg-card)] gap-4">
            {proj.image_url && <img src={proj.image_url} alt={proj.title} className="w-24 h-24 object-cover border-[3px] border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] flex-shrink-0" />}
            <div className="flex-1">
              <h5 className="font-black text-lg">{proj.title}</h5>
              <p className="text-sm font-bold text-[var(--neo-cyan)] mb-2">{proj.tech_stack && proj.tech_stack.join(" • ")}</p>
              <p className="text-sm font-medium line-clamp-2 mb-2">{proj.description}</p>
              <div className="flex gap-4 text-xs font-bold text-gray-500">
                {proj.live_url && <a href={proj.live_url} target="_blank" rel="noreferrer" className="underline">Live Demo</a>}
                {proj.github_url && <a href={proj.github_url} target="_blank" rel="noreferrer" className="underline">GitHub</a>}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(proj)} className="p-2 bg-[var(--neo-green)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiEdit2 size={16}/></button>
              <button onClick={() => confirmDelete(proj)} className="p-2 bg-[var(--neo-pink)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"><FiTrash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      <ImageCropperModal
        isOpen={cropper.isOpen}
        imageSrc={cropper.imageSrc}
        onClose={() => setCropper({ isOpen: false, imageSrc: null })}
        onCropComplete={handleCropComplete}
        aspect={16 / 9}
      />
    </div>
  );
}
