import { createContext, useContext, ReactNode } from "react";
import { AuthContextType, User } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { signUpUser, signInUser, resetUserPassword, signOutUser } from "@/services/authService";

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
  const {
    user,
    session,
    isLoading,
    isNewUser,
    updateIsNewUser,
    refreshSession,
    clearAuthState
  } = useAuthState();

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInUser(email, password);
      updateIsNewUser(result.shouldRedirectToWelcome);
      return { shouldRedirectToWelcome: result.shouldRedirectToWelcome };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error: any; user?: User }> => {
    return await signUpUser(email, password, userData);
  };

  const resetPassword = async (email: string) => {
    return await resetUserPassword(email);
  };

  const signOut = async () => {
    try {
      await signOutUser();
      clearAuthState();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
