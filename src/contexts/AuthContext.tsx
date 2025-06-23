
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ shouldRedirectToWelcome: boolean }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  isNewUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshSession: async () => {},
  signIn: async () => ({ shouldRedirectToWelcome: false }),
  signUp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  isNewUser: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Function to sign up
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/welcome`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error("Error signing up:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to sign in
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if this is a new user by checking if they have a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      const isFirstTime = !profile;
      setIsNewUser(isFirstTime);
      
      return { shouldRedirectToWelcome: isFirstTime };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset password
  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/auth?mode=reset`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error: any) {
      console.error("Error resetting password:", error);
      return { error };
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setIsNewUser(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    // Get initial session
    refreshSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
        
        // Log sign-in event for notifications
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Create a sign-in notification entry
            await supabase.from('security_events').insert({
              user_id: session.user.id,
              event_type: 'other',
              severity: 'low',
              description: `User signed in from ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} at ${new Date().toLocaleString()}`,
              resolved: true
            });
            
            console.log('Sign-in event logged for email notifications');
          } catch (error) {
            console.error('Error logging sign-in event:', error);
          }
        }
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
    signIn,
    signUp,
    resetPassword,
    isNewUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
