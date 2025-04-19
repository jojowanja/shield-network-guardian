
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// Initialize Supabase client with fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-public-anon-key';

// Create client only if we have valid URL and key
const supabaseClient = () => {
  if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-url.supabase.co') {
    console.warn('Supabase URL is not configured. Using demo mode.');
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = supabaseClient();

// Mock user for demo mode
const mockUser = {
  id: "mock-user-id",
  email: "demo@example.com",
  app_metadata: {},
  user_metadata: { name: "Demo User" },
  aud: "authenticated",
  created_at: new Date().toISOString()
};

// Mock session for demo mode
const mockSession = {
  access_token: "mock-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  user: mockUser
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Demo mode
  const isDemo = !supabase;

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      if (isDemo) {
        // In demo mode, use mock data
        console.info("Running in demo mode with mock user");
        setUser(mockUser as User);
        setSession(mockSession as Session);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase!.auth.getSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user || null);
    } catch (error) {
      console.error("Error refreshing session:", error);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      if (isDemo) {
        // In demo mode, just clear state
        setSession(null);
        setUser(null);
        navigate("/auth");
        return;
      }

      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    // Initial session check
    refreshSession();
    
    // Set up auth state change listener if not in demo mode
    if (!isDemo && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user || null);
          setIsLoading(false);
        }
      );

      // Clean up subscription
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isDemo]);

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
