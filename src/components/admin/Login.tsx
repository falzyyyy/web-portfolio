import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FiLock, FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-workspace)] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full border-2.5 border-[var(--theme-border)] bg-[var(--theme-bg-card)] rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_var(--theme-border)]">
        {/* Cover strip */}
        <div className="h-24 overflow-hidden border-b-2.5 border-[var(--theme-border)] bg-zinc-100 dark:bg-zinc-800">
          <img 
            src="/notion-cover.png" 
            alt="Notion Cover" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8 relative">
          {/* Overlapping lock icon */}
          <div className="w-12 h-12 rounded-xl bg-[var(--tag-yellow-bg)] text-[var(--tag-yellow-text)] border-2 border-[var(--theme-border)] shadow-[2.5px_2.5px_0px_0px_var(--theme-border)] flex items-center justify-center text-xl absolute -top-7 left-8 select-none">
            <FiLock size={20} />
          </div>

          <div className="mt-4 mb-4 font-mono text-xs font-bold text-[var(--theme-text-muted)] flex items-center gap-1.5">
            <span>admin</span>
            <span>/</span>
            <span>login</span>
          </div>
          
          <h2 className="text-2xl font-heading font-extrabold text-[var(--theme-text-primary)] mb-5">
            Workspace Login
          </h2>
          
          {error && (
            <div className="bg-[var(--tag-red-bg)] border-2 border-[var(--theme-border)] text-[var(--tag-red-text)] px-4 py-2.5 rounded-lg text-xs mb-5 font-heading font-bold shadow-[2px_2px_0px_0px_var(--theme-border)] flex items-center gap-2">
              <FiAlertTriangle size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-20">
            <div>
              <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naufal@workspace.com"
                className="notion-input"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[var(--theme-text-secondary)] mb-1.5 uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="notion-input"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full neo-brutal-btn bg-[var(--tag-blue-bg)] text-[var(--tag-blue-text)] disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Open Workspace"}
            </button>
          </form>
          
          <div className="mt-6 pt-5 border-t-2 border-[var(--theme-border)] text-center">
            <button 
              onClick={() => navigate("/")}
              className="text-xs font-mono font-bold text-[var(--theme-text-secondary)] hover:text-[var(--notion-blue)] hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FiArrowLeft size={12} />
              <span>Return to main document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
