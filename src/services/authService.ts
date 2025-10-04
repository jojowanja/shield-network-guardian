import { backendAuthService } from './backendAuthService';

export const signUpUser = async (email: string, password: string, userData?: any) => {
  return await backendAuthService.signUp(email, password, userData);
};

export const signInUser = async (email: string, password: string) => {
  return await backendAuthService.signIn(email, password);
};

export const resetUserPassword = async (email: string) => {
  return await backendAuthService.resetPassword(email);
};

export const refreshUserSession = async () => {
  return await backendAuthService.refreshSession();
};

export const signOutUser = async () => {
  await backendAuthService.signOut();
};

export const logSignInEvent = async (userId: string) => {
  await backendAuthService.logSignInEvent(userId);
};
