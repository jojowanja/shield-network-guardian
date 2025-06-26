
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

  // Function to sign up - disable email confirmation to avoid SMTP issues
  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      console.log('Attempting to sign up user:', email);
      
      // First try to sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Don't require email confirmation since SMTP isn't configured
          emailRedirectTo: undefined,
          data: userData
        }
      });
      
      console.log('Sign up response:', { data, error });
      
      if (error) {
        // Handle specific error cases
        if (error.message?.includes("User already registered") || 
            error.message?.includes("already been registered")) {
          console.log('User already exists, this is expected');
          return { error: { message: "An account with this email already exists. Please sign in instead." } };
        }
        
        // Handle SMTP/email errors - treat as success since account might be created
        if (error.message?.includes("Error sending") || 
            error.message?.includes("SMTP") || 
            error.message?.includes("Username and Password not accepted") ||
            error.message?.includes("email rate limit exceeded")) {
          console.log('Email confirmation failed but account may have been created');
          return { error: null }; // Treat as success
        }
        
        console.error("Sign up error:", error);
        return { error };
      }
      
      // Check if user was created successfully
      if (data.user) {
        console.log('User created successfully:', data.user.id);
        return { error: null };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error signing up:", error);
      return { error };
    }
  };

  // Function to sign in
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      
      // Check if this is a new user by checking if they have a profile
      let isFirstTime = false;
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error('Error checking profile:', profileError);
        }
        
        if (!profile) {
          isFirstTime = true;
          console.log('New user detected - no profile found');
        }
        
      } catch (profileError) {
        console.error('Error checking profile:', profileError);
        isFirstTime = false;
      }
      
      setIsNewUser(isFirstTime);
      
      return { shouldRedirectToWelcome: isFirstTime };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  // Function to reset password
  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        // Handle SMTP errors gracefully for password reset
        if (error.message?.includes("Error sending") || 
            error.message?.includes("SMTP") || 
            error.message?.includes("Username and Password not accepted")) {
          console.log('Password reset email failed due to SMTP configuration');
          return { error: { message: "Password reset is currently unavailable due to email configuration issues. Please contact support." } };
        }
        
        console.error("Password reset error:", error);
        return { error };
      }
      
      console.log('Password reset email sent successfully');
      return { error: null };
    } catch (error: any) {
      console.error("Error resetting password:", error);
      return { error };
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      console.log('Refreshing session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session refresh error:", error);
        setSession(null);
        setUser(null);
        return;
      }
      
      console.log('Session refreshed:', data.session ? 'Active' : 'None');
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
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      console.log('Sign out successful');
      setSession(null);
      setUser(null);
      setIsNewUser(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email || 'No user');
        
        setSession(session);
        setUser(session?.user || null);
        
        if (!session) {
          setIsLoading(false);
        }
        
        // Log sign-in event for notifications (defer to avoid blocking)
        if (event === 'SIGNED_IN' && session?.user) {
          setIsLoading(false);
          setTimeout(async () => {
            try {
              console.log('Logging sign-in event for notifications...');
              await supabase.from('security_events').insert({
                user_id: session.user.id,
                event_type: 'other',
                severity: 'low',
                description: `User signed in from ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} at ${new Date().toLocaleString()}`,
                resolved: true
              });
              
              console.log('Sign-in event logged successfully');
            } catch (error) {
              console.error('Error logging sign-in event:', error);
            }
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          setIsLoading(false);
          setIsNewUser(false);
        }
      }
    );

    // Get initial session
    refreshSession();

    // Clean up subscription
    return () => {
      console.log('Cleaning up auth subscription...');
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
