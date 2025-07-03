
import { supabase } from "@/integrations/supabase/client";

export const signUpUser = async (email: string, password: string, userData?: any) => {
  console.log('Attempting to sign up user:', email);
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: undefined, // Disable email confirmation
    }
  });
  
  console.log('Sign up response:', { data, error });
  
  if (error) {
    console.error("Sign up error:", error);
    return { error };
  }
  
  console.log('User created successfully:', data.user?.id);
  return { error: null, user: data.user };
};

export const signInUser = async (email: string, password: string) => {
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
  
  return { shouldRedirectToWelcome: isFirstTime, user: data.user };
};

export const resetUserPassword = async (email: string) => {
  console.log('Attempting password reset for:', email);
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset`,
  });
  
  if (error) {
    console.error("Password reset error:", error);
    return { error };
  }
  
  console.log('Password reset email sent successfully');
  return { error: null };
};

export const refreshUserSession = async () => {
  console.log('Refreshing session...');
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Session refresh error:", error);
    return { session: null, user: null };
  }
  
  console.log('Session refreshed:', data.session ? 'Active' : 'None');
  return { session: data.session, user: data.session?.user || null };
};

export const signOutUser = async () => {
  console.log('Signing out user...');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
  
  console.log('Sign out successful');
};

export const logSignInEvent = async (userId: string) => {
  try {
    console.log('Logging sign-in event for notifications...');
    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: 'other',
      severity: 'low',
      description: `User signed in from ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} at ${new Date().toLocaleString()}`,
      resolved: true
    });
    
    console.log('Sign-in event logged successfully');
  } catch (error) {
    console.error('Error logging sign-in event:', error);
  }
};
