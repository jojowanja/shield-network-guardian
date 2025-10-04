import { useState, useEffect } from "react";
import { refreshUserSession, logSignInEvent } from "@/services/authService";

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

interface Session {
  access_token: string;
}

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Remove the unused handleAuthStateChange function

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
    console.log('Setting up auth state...');
    
    // Get initial session
    refreshSession();
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
