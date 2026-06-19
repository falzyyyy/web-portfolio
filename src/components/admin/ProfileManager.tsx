import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ImageCropperModal from "./ImageCropperModal";
import { FiSave, FiUpload, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export default function ProfileManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropper, setCropper] = useState<{isOpen: boolean, imageSrc: string | null}>({ isOpen: false, imageSrc: null });

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    roles: "",
    tagline: "",
    about_paragraphs: "",
    resume_url: "",
    avatar_url: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").single();
    
    if (data) {
      setFormData({
        id: data.id,
        name: data.name || "",
        roles: data.roles ? data.roles.join(", ") : "",
        tagline: data.tagline || "",
        about_paragraphs: data.about_paragraphs ? data.about_paragraphs.join("\n\n") : "",
        resume_url: data.resume_url || "",
        avatar_url: data.avatar_url || "",
      });
    } else if (error && error.code !== 'PGRST116') {
      console.error("Error fetching profile:", error);
    }
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
    setUploadingAvatar(true);
    
    try {
      const fileName = `avatar_${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('portfolio-assets').upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, avatar_url: data.publicUrl }));
      setMessage({ type: "success", text: "Profile picture uploaded! Don't forget to click 'Save Changes'." });
    } catch (error: any) {
      setMessage({ type: "error", text: `Upload failed: ${error.message}` });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formattedData = {
      name: formData.name,
      roles: formData.roles.split(",").map((r) => r.trim()).filter(Boolean),
      tagline: formData.tagline,
      about_paragraphs: formData.about_paragraphs.split("\n\n").map((p) => p.trim()).filter(Boolean),
      resume_url: formData.resume_url,
      avatar_url: formData.avatar_url,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (formData.id) {
      result = await supabase.from("profiles").update(formattedData).eq("id", formData.id);
    } else {
      result = await supabase.from("profiles").insert([formattedData]);
    }

    if (result.error) {
      setMessage({ type: "error", text: result.error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully!" });
      fetchProfile();
    }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse font-mono text-xs text-[var(--theme-text-muted)]">Loading profile data...</div>;

  return (
    <div>
      {message && (
        <div className={`p-4 mb-6 border-2 border-black rounded-xl text-xs sm:text-sm font-heading font-extrabold shadow-[3px_3px_0px_0px_var(--theme-border)] flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-[var(--tag-green-bg)] text-[var(--tag-green-text)]' 
            : 'bg-[var(--tag-red-bg)] text-[var(--tag-red-text)]'
        }`}>
          {message.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="notion-input"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
              Roles (Comma Separated)
            </label>
            <input
              type="text"
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
              placeholder="IT Professional, Software Engineer"
              className="notion-input"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
            Hero Tagline
          </label>
          <textarea
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            rows={2}
            className="notion-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
            About Paragraphs (Separate with double enter)
          </label>
          <textarea
            value={formData.about_paragraphs}
            onChange={(e) => setFormData({ ...formData, about_paragraphs: e.target.value })}
            rows={5}
            className="notion-input"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
              Profile Picture URL / Upload
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="Or paste URL here..."
                className="notion-input"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={uploadingAvatar}
                />
                <div className="neo-brutal-btn w-full py-2 bg-[var(--tag-purple-bg)] text-[var(--tag-purple-text)] flex items-center justify-center gap-1.5">
                  <FiUpload size={14} />
                  <span>{uploadingAvatar ? "Uploading file..." : "Upload Local File"}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
              Resume / CV URL
            </label>
            <input
              type="text"
              value={formData.resume_url}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              placeholder="/resume.pdf or drive link..."
              className="notion-input"
            />
          </div>
        </div>

        {formData.avatar_url && (
          <div className="mt-3 p-4 border-2 border-dashed border-[var(--theme-border)] rounded-2xl w-fit bg-[var(--theme-bg)] shadow-[2.5px_2.5px_0px_0px_var(--theme-border)]">
            <p className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-2 uppercase">
              Avatar Preview:
            </p>
            <img 
              src={formData.avatar_url} 
              alt="Profile Preview" 
              className="w-20 h-20 object-cover border-2 border-[var(--theme-border)] rounded-full shadow-[2px_2px_0px_0px_black]" 
            />
          </div>
        )}

        <div className="pt-4 border-t-2 border-[var(--theme-border)]">
          <button
            type="submit"
            disabled={saving}
            className="neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] w-full sm:w-auto"
          >
            <FiSave size={14} />
            <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
          </button>
        </div>
      </form>

      <ImageCropperModal
        isOpen={cropper.isOpen}
        imageSrc={cropper.imageSrc}
        onClose={() => setCropper({ isOpen: false, imageSrc: null })}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
