import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 15 minutes of inactivity
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      // Logout logic due to inactivity
      await supabase.auth.signOut();
      alert("Sesi Anda telah berakhir karena tidak ada aktivitas (Auto Logout). Silakan login kembali.");
      navigate("/login", { replace: true });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) resetTimeout();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        resetTimeout();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Setup event listeners for user activity
  useEffect(() => {
    if (!session) return; // Only track activity if logged in

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    
    const handleActivity = () => {
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-text-primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
