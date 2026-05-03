import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
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

  if (loading && docs.length === 0) return <div className="animate-pulse">Loading gallery data...</div>;

  return (
    <div>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} 
        onConfirm={executeDelete}
        itemName={deleteModal.name}
      />

      <div className="mb-8 flex items-center justify-between border-b-[3px] border-[var(--theme-border)] pb-4">
        <h3 className="text-3xl font-black heading-neo uppercase">Gallery / Documentations</h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", category: "Organization", image_url: "" });
            }}
            className="text-sm font-bold border-2 border-[var(--theme-border)] px-4 py-2 bg-[var(--theme-bg-card)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-[var(--neo-cyan)] p-6 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)]">
        <h4 className="text-xl font-black mb-4 uppercase">{editingId ? "Edit Image" : "Add New Image"}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none bg-white">
              <option value="Organization">Organization</option>
              <option value="Project">Project</option>
              <option value="University">University</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-black mb-1 uppercase">Image URL / Upload</label>
            <div className="flex flex-col gap-2">
              <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="Or paste URL here..." className="w-full border-[3px] border-[var(--theme-border)] px-3 py-2 font-medium focus:outline-none" />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingImage}
                />
                <div className={`w-full bg-[var(--neo-purple)] text-white font-bold border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] px-3 py-2 text-center uppercase ${uploadingImage ? 'opacity-50' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'}`}>
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {formData.image_url && (
          <div className="mb-4">
            <p className="text-sm font-black mb-1 uppercase">Preview:</p>
            <img src={formData.image_url} alt="Preview" className="h-32 object-cover border-[3px] border-[var(--theme-border)]" />
          </div>
        )}

        <button type="submit" className="bg-[var(--neo-yellow)] font-black uppercase px-6 py-2 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
          {editingId ? "Update Data" : <><FiPlus size={18}/> Add Data</>}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map(doc => (
          <div key={doc.id} className="border-[3px] border-[var(--theme-border)] flex flex-col bg-[var(--theme-bg-card)]">
            <img src={doc.image_url} alt={doc.title} className="w-full h-48 object-cover border-b-[3px] border-[var(--theme-border)]" />
            <div className="p-4 flex flex-col flex-1">
              <h5 className="font-black text-lg line-clamp-1">{doc.title}</h5>
              <p className="text-sm font-bold text-[var(--neo-purple)] mb-4">{doc.category}</p>
              
              <div className="flex gap-2 mt-auto">
                <button onClick={() => handleEdit(doc)} className="flex-1 p-2 bg-[var(--neo-green)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex justify-center items-center gap-1 font-bold text-sm">
                  <FiEdit2 size={14}/> Edit
                </button>
                <button onClick={() => confirmDelete(doc)} className="flex-1 p-2 bg-[var(--neo-pink)] border-2 border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex justify-center items-center gap-1 font-bold text-sm text-[#1A1A1A]">
                  <FiTrash2 size={14}/> Delete
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
