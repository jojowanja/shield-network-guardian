export interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface Session {
  access_token: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ shouldRedirectToWelcome: boolean }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any; user?: User }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  isNewUser: boolean;
}
