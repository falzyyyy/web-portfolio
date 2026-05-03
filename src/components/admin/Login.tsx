import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

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
    <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center px-6">
      <div className="max-w-md w-full neo-card p-8 bg-[var(--neo-cyan)] relative">
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-[var(--neo-yellow)] rounded-full border-[3px] border-[var(--theme-border)] shadow-[2px_2px_0px_0px_var(--theme-border)] z-10 animate-bounce" />
        
        <h2 className="text-3xl font-black heading-neo text-[#1A1A1A] mb-8 text-center uppercase">
          Admin Portal
        </h2>
        
        {error && (
          <div className="bg-red-100 border-[3px] border-red-500 text-red-600 p-3 mb-6 text-sm font-bold shadow-[2px_2px_0px_0px_#EF4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-20">
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--theme-bg-card)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-black text-[#1A1A1A] mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--theme-bg-card)] border-[3px] border-[var(--theme-border)] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_0px_var(--theme-border)] transition-all font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--neo-pink)] text-[#1A1A1A] font-black uppercase tracking-widest py-3 border-[3px] border-[var(--theme-border)] shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "ENTER"}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate("/")}
            className="text-sm font-bold text-[#1A1A1A] hover:text-[var(--neo-purple)] underline decoration-2 underline-offset-4 transition-colors"
          >
            &larr; Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
