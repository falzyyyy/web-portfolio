import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ImageCropperModal from "./ImageCropperModal";

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
      // Reset input so the same file can be selected again
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
      setMessage({ type: "success", text: "Profile picture uploaded! Don't forget to click 'Save Profile'." });
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
      // Update existing
      result = await supabase.from("profiles").update(formattedData).eq("id", formData.id);
    } else {
      // Insert new if doesn't exist
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

  if (loading) return <div className="animate-pulse">Loading profile data...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-3xl font-black heading-neo uppercase">Profile Settings</h3>
      </div>

      {message && (
        <div className={`p-4 mb-6 border-[3px] font-bold ${message.type === 'success' ? 'bg-[var(--neo-green)] border-[var(--theme-border)] text-[#1A1A1A] shadow-[4px_4px_0px_0px_var(--theme-border)]' : 'bg-red-200 border-red-500 text-red-700 shadow-[4px_4px_0px_0px_#EF4444]'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">Roles (Comma Separated)</label>
            <input
              type="text"
              value={formData.roles}
              onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
              placeholder="e.g. IT Professional, Software Engineer"
              className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">Hero Tagline</label>
          <textarea
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            rows={2}
            className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">About Me (Separate paragraphs with double enter)</label>
          <textarea
            value={formData.about_paragraphs}
            onChange={(e) => setFormData({ ...formData, about_paragraphs: e.target.value })}
            rows={6}
            className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">Profile Picture URL / Upload</label>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                placeholder="Or paste URL here..."
                className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingAvatar}
                />
                <div className={`w-full bg-[var(--neo-purple)] text-white font-bold border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] px-4 py-3 text-center uppercase ${uploadingAvatar ? 'opacity-50' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'}`}>
                  {uploadingAvatar ? "Uploading..." : "Upload Local Image"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">Resume / CV URL</label>
            <input
              type="text"
              value={formData.resume_url}
              onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
              placeholder="e.g. /resume.pdf or https://drive.google.com/..."
              className="w-full bg-[var(--theme-bg)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
            />
          </div>
        </div>

        {formData.avatar_url && (
          <div className="mt-4">
            <p className="text-sm font-black text-[#1A1A1A] mb-2 uppercase">Avatar Preview:</p>
            <img src={formData.avatar_url} alt="Profile Preview" className="w-24 h-24 object-cover border-[3px] border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)]" />
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-[var(--neo-yellow)] text-[#1A1A1A] font-black uppercase tracking-widest px-8 py-3 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
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
