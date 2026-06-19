import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus, FiFolder, FiUpload, FiExternalLink, FiGithub, FiFileText, FiBookmark } from "react-icons/fi";
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

  if (loading && projects.length === 0) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading projects data...</div>;

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
          <div className="p-1 rounded bg-[var(--tag-orange-bg)] border border-black shadow-[1px_1px_0px_0px_black] text-[var(--tag-orange-text)] flex items-center justify-center">
            <FiFolder size={14} />
          </div>
          <span>Projects Database</span>
        </h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", description: "", image_url: "", live_url: "", github_url: "", tech_stack: "" });
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
          {editingId ? "📝 Edit Project Record" : "➕ Add New Project Record"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Tech Stack (Comma Separated)</label>
            <input type="text" value={formData.tech_stack} onChange={e => setFormData({...formData, tech_stack: e.target.value})} required placeholder="React, Node.js, Tailwind" className="notion-input" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Image URL / Upload</label>
            <div className="flex flex-col gap-3">
              <input type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="Or paste URL here..." className="notion-input" />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadingImage}
                />
                <div className="neo-brutal-btn w-full py-2 bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] flex items-center justify-center gap-1.5">
                  <FiUpload size={14} />
                  <span>{uploadingImage ? "Uploading cover..." : "Upload Cover Image"}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Live URL</label>
            <input type="text" value={formData.live_url} onChange={e => setFormData({...formData, live_url: e.target.value})} className="notion-input" />
            
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mt-3.5 mb-1.5 uppercase">GitHub URL</label>
            <input type="text" value={formData.github_url} onChange={e => setFormData({...formData, github_url: e.target.value})} className="notion-input" />
          </div>
        </div>
        
        <button type="submit" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
          {editingId ? "Update Data" : <><FiPlus size={14}/> Add Project</>}
        </button>
      </form>

      {/* Database Listing cards */}
      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div key={proj.id || idx} className="border-2.5 border-[var(--theme-border)] p-5 flex flex-col md:flex-row justify-between items-start bg-[var(--theme-bg-card)] gap-5 rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--theme-border)] transition-all duration-200">
            {proj.image_url && (
              <img 
                src={proj.image_url} 
                alt={proj.title} 
                className="w-24 h-24 md:w-28 md:h-20 object-cover border-2 border-black rounded-xl flex-shrink-0 shadow-[2px_2px_0px_0px_black]" 
              />
            )}
            
            <div className="flex-grow space-y-2.5 min-w-0 mr-4">
              <h5 className="font-heading font-extrabold text-base text-[var(--theme-text-primary)] flex items-center gap-2">
                <FiFileText className="text-[var(--notion-blue)] flex-shrink-0" />
                <span>{proj.title}</span>
              </h5>
              
              <div className="flex flex-wrap gap-2">
                {proj.tech_stack && proj.tech_stack.map((tech: string, tIdx: number) => (
                  <span key={tech + tIdx} className="notion-tag bg-[var(--tag-gray-bg)] text-[var(--tag-gray-text)] text-[9px]">
                    <FiBookmark size={8} />
                    {tech}
                  </span>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm font-sans font-medium text-[var(--theme-text-secondary)] line-clamp-2 leading-relaxed">
                {proj.description}
              </p>
              
              <div className="flex gap-4 text-[10px] font-mono font-bold text-[var(--theme-text-muted)] pt-0.5">
                {proj.live_url && proj.live_url !== "#" && (
                  <a href={proj.live_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--notion-blue)] hover:underline">
                    <FiExternalLink size={10} />
                    <span>Live Demo</span>
                  </a>
                )}
                {proj.github_url && proj.github_url !== "#" && (
                  <a href={proj.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-[var(--notion-blue)] hover:underline">
                    <FiGithub size={10} />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 flex-shrink-0 self-center">
              <button 
                onClick={() => handleEdit(proj)} 
                className="p-2 border-2 border-black rounded-xl bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Edit"
              >
                <FiEdit2 size={13} />
              </button>
              <button 
                onClick={() => confirmDelete(proj)} 
                className="p-2 border-2 border-black rounded-xl bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Delete"
              >
                <FiTrash2 size={13} />
              </button>
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
