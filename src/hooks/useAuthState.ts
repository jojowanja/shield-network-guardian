
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { refreshUserSession, logSignInEvent } from "@/services/authService";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleAuthStateChange = (event: string, session: Session | null) => {
    console.log('Auth state change:', event, session?.user?.email || 'No user');
    
    setSession(session);
    setUser(session?.user || null);
    setIsLoading(false);
    
    // Log sign-in event for notifications (defer to avoid blocking)
    if (event === 'SIGNED_IN' && session?.user) {
      setTimeout(() => {
        logSignInEvent(session.user.id);
      }, 0);
    }
    
    if (event === 'SIGNED_OUT') {
      setIsNewUser(false);
    }
  };

  const updateIsNewUser = (value: boolean) => {
    setIsNewUser(value);
  };

  const refreshSession = async () => {
    const { session, user } = await refreshUserSession();
    setSession(session);
    setUser(user);
    setIsLoading(false);
  };

  const clearAuthState = () => {
    setSession(null);
    setUser(null);
    setIsNewUser(false);
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session
    refreshSession();

    // Clean up subscription
    return () => {
      console.log('Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    isNewUser,
    updateIsNewUser,
    refreshSession,
    clearAuthState
  };
};
