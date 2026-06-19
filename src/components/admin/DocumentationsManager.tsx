import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus, FiImage, FiUpload, FiBookmark, FiFileText } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import ImageCropperModal from "./ImageCropperModal";

export default function DocumentationsManager() {
  const [docs, setDocs] = useState<any[]>([]);
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
    category: "Organization",
    image_url: "",
  });

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("documentations").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data);
    else console.error("Error fetching docs:", error);
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
      const fileName = `gallery_${Date.now()}.jpg`;
      const filePath = `documentations/${fileName}`;
      
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

  const handleEdit = (doc: any) => {
    setEditingId(doc.id);
    setFormData({
      title: doc.title,
      category: doc.category,
      image_url: doc.image_url,
    });
  };

  const confirmDelete = (doc: any) => {
    setDeleteModal({ isOpen: true, id: doc.id, name: doc.title });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    await supabase.from("documentations").delete().eq("id", deleteModal.id);
    fetchDocs();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from("documentations").update(formData).eq("id", editingId);
    } else {
      await supabase.from("documentations").insert([formData]);
    }
    setEditingId(null);
    setFormData({ title: "", category: "Organization", image_url: "" });
    fetchDocs();
  };

  if (loading && docs.length === 0) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading gallery data...</div>;

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
          <div className="p-1 rounded bg-[var(--tag-pink-bg)] border border-black shadow-[1px_1px_0px_0px_black] text-[var(--tag-pink-text)] flex items-center justify-center">
            <FiImage size={14} />
          </div>
          <span>Gallery/Documentation Records</span>
        </h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", category: "Organization", image_url: "" });
            }}
            className="neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] text-xs py-1.5"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-[var(--tag-gray-bg)]/20 p-6 border-2 border-[var(--theme-border)] rounded-2xl shadow-[3px_3px_0px_0px_var(--theme-border)]">
        <h4 className="text-xs font-mono font-bold mb-4 uppercase text-[var(--theme-text-primary)]">
          {editingId ? "📝 Edit Image Post" : "➕ Add New Image Post"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="notion-input bg-[var(--theme-bg-card)] cursor-pointer">
              <option value="Organization">Organization</option>
              <option value="Project">Project</option>
              <option value="University">University</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Image URL / Upload</label>
            <div className="flex flex-col gap-3">
              <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="Or paste URL here..." className="notion-input" />
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
                  <span>{uploadingImage ? "Uploading..." : "Upload Image File"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {formData.image_url && (
          <div className="mb-4 p-4 border-2 border-dashed border-[var(--theme-border)] rounded-2xl w-fit bg-[var(--theme-bg)] shadow-[2.5px_2.5px_0px_0px_var(--theme-border)]">
            <p className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-2 uppercase">Image Preview:</p>
            <img src={formData.image_url} alt="Preview" className="h-28 object-cover border-2 border-[var(--theme-border)] rounded-xl shadow-[2px_2px_0px_0px_black]" />
          </div>
        )}

        <button type="submit" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
          {editingId ? "Update Data" : <><FiPlus size={14}/> Add Photo</>}
        </button>
      </form>

      {/* Grid of gallery listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc, idx) => (
          <div key={doc.id || idx} className="border-2.5 border-[var(--theme-border)] flex flex-col bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--theme-border)] transition-all duration-200 p-4 group">
            <div className="w-full aspect-[4/3] border-2 border-[var(--theme-border)] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-[1.5px_1.5px_0px_0px_var(--theme-border)]">
              <img src={doc.image_url} alt={doc.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
            </div>
            
            <div className="pt-4 flex flex-col flex-grow">
              <h5 className="font-heading font-extrabold text-sm sm:text-base text-[var(--theme-text-primary)] line-clamp-1 flex items-center gap-1.5">
                <FiFileText className="flex-shrink-0 text-zinc-500" />
                <span>{doc.title}</span>
              </h5>
              <div className="mt-2 mb-4">
                <span className="notion-tag bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] text-[9px]">
                  <FiBookmark size={9} />
                  {doc.category}
                </span>
              </div>
              
              <div className="flex gap-2.5 mt-auto">
                <button 
                  onClick={() => handleEdit(doc)} 
                  className="neo-brutal-btn bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] py-1.5 flex-1 text-[10px] flex items-center justify-center gap-1.5"
                >
                  <FiEdit2 size={12} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => confirmDelete(doc)} 
                  className="neo-brutal-btn bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] py-1.5 flex-1 text-[10px] flex items-center justify-center gap-1.5"
                >
                  <FiTrash2 size={12} />
                  <span>Delete</span>
                </button>
              </div>
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
