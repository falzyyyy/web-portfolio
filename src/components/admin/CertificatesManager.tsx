import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { defaultCertificates, Certificate } from "../../data/portfolio-data";
import { FiEdit2, FiTrash2, FiPlus, FiAward, FiUpload, FiBookmark, FiFileText } from "react-icons/fi";
import DeleteModal from "./DeleteModal";
import ImageCropperModal from "./ImageCropperModal";

export default function CertificatesManager() {
  const [certs, setCerts] = useState<Certificate[]>([]);
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
    issuer: "",
    year: "",
    type: "Academic" as "Academic" | "Organization" | "Non-Academic",
    image_url: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setCerts(data);
      }
    } catch (err: any) {
      console.warn("Could not query certificates table. Using static data instead.", err.message);
      setCerts(defaultCertificates);
    } finally {
      setLoading(false);
    }
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
      const fileName = `certificate_${Date.now()}.jpg`;
      const filePath = `certificates/${fileName}`;
      
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

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      type: cert.type,
      image_url: cert.imageUrl || (cert as any).image_url || "",
    });
  };

  const confirmDelete = (cert: Certificate) => {
    setDeleteModal({ isOpen: true, id: cert.id, name: cert.title });
  };

  const executeDelete = async () => {
    if (!deleteModal.id) return;
    try {
      const { error } = await supabase.from("certificates").delete().eq("id", deleteModal.id);
      if (error) throw error;
      fetchCertificates();
    } catch (err: any) {
      alert(`Cannot delete from database: ${err.message}. To enable CMS database editing, please create the certificates table in your Supabase SQL Editor.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map form fields back to database properties if different
      const payload = {
        title: formData.title,
        issuer: formData.issuer,
        year: formData.year,
        type: formData.type,
        image_url: formData.image_url
      };

      if (editingId) {
        const { error } = await supabase.from("certificates").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("certificates").insert([payload]);
        if (error) throw error;
      }
      setEditingId(null);
      setFormData({ title: "", issuer: "", year: "", type: "Academic", image_url: "" });
      fetchCertificates();
    } catch (err: any) {
      alert(`Cannot save to database: ${err.message}. To enable CMS database editing, please create the certificates table in your Supabase SQL Editor.`);
    }
  };

  if (loading && certs.length === 0) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading certificates data...</div>;

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
            <FiAward size={14} />
          </div>
          <span>Certificates & Achievements Manager</span>
        </h3>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ title: "", issuer: "", year: "", type: "Academic", image_url: "" });
            }}
            className="neo-brutal-btn bg-white hover:bg-[var(--tag-gray-bg)] text-xs py-1.5"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-8 bg-[var(--tag-gray-bg)]/20 p-6 border-2 border-[var(--theme-border)] rounded-2xl shadow-[3px_3px_0px_0px_var(--theme-border)]">
        <h4 className="text-xs font-mono font-bold mb-4 uppercase text-[var(--theme-text-primary)]">
          {editingId ? "📝 Edit Certificate" : "➕ Add New Certificate"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Issuer / Organizer</label>
            <input type="text" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Year</label>
            <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="e.g. 2024" className="notion-input" />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Category Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="notion-input bg-[var(--theme-bg-card)] cursor-pointer">
              <option value="Academic">Academic</option>
              <option value="Organization">Organization</option>
              <option value="Non-Academic">Non-Academic (Sports / Art)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">Image URL / Upload Certificate</label>
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
                  <span>{uploadingImage ? "Uploading..." : "Upload Certificate Image"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {formData.image_url && (
          <div className="mb-4 p-4 border-2 border-dashed border-[var(--theme-border)] rounded-2xl w-fit bg-[var(--theme-bg)] shadow-[2.5px_2.5px_0px_0px_var(--theme-border)]">
            <p className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-2 uppercase">Certificate Preview:</p>
            <img src={formData.image_url} alt="Preview" className="h-28 object-cover border-2 border-[var(--theme-border)] rounded-xl shadow-[2px_2px_0px_0px_black]" />
          </div>
        )}

        <button type="submit" className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)]">
          {editingId ? "Update Certificate" : <><FiPlus size={14}/> Add Certificate</>}
        </button>
      </form>

      {/* Grid of listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert, idx) => {
          const img = cert.imageUrl || (cert as any).image_url;
          return (
            <div key={cert.id || idx} className="border-2.5 border-[var(--theme-border)] flex flex-col bg-[var(--theme-bg-card)] rounded-2xl shadow-[4px_4px_0px_0px_var(--theme-border)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_var(--theme-border)] transition-all duration-200 p-4 group">
              <div className="w-full aspect-[4/3] border-2 border-[var(--theme-border)] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-[1.5px_1.5px_0px_0px_var(--theme-border)]">
                {img ? (
                  <img src={img} alt={cert.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
                )}
              </div>
              
              <div className="pt-4 flex flex-col flex-grow">
                <h5 className="font-heading font-extrabold text-sm sm:text-base text-[var(--theme-text-primary)] line-clamp-1 flex items-center gap-1.5">
                  <FiFileText className="flex-shrink-0 text-zinc-500" />
                  <span>{cert.title}</span>
                </h5>
                <p className="text-[11px] font-heading font-bold text-zinc-500 mt-1">Issued by {cert.issuer} ({cert.year})</p>
                <div className="mt-2 mb-4">
                  <span className="notion-tag bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] text-[9px]">
                    <FiBookmark size={9} />
                    {cert.type}
                  </span>
                </div>
                
                <div className="flex gap-2.5 mt-auto">
                  <button 
                    onClick={() => handleEdit(cert)} 
                    className="neo-brutal-btn bg-[var(--tag-gray-bg)] text-[var(--theme-text-primary)] py-1.5 flex-1 text-[10px] flex items-center justify-center gap-1"
                  >
                    <FiEdit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => confirmDelete(cert)} 
                    className="neo-brutal-btn bg-[var(--tag-pink-bg)] text-[var(--tag-pink-text)] py-1.5 flex-1 text-[10px] flex items-center justify-center gap-1"
                  >
                    <FiTrash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ImageCropperModal
        isOpen={cropper.isOpen}
        imageSrc={cropper.imageSrc}
        onClose={() => setCropper({ isOpen: false, imageSrc: null })}
        onCropComplete={handleCropComplete}
        aspect={4 / 3}
      />
    </div>
  );
}
