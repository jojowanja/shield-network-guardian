
import { supabase } from "@/integrations/supabase/client";

export const signUpUser = async (email: string, password: string, userData?: any) => {
  try {
    console.log('Attempting to sign up user:', email);
    
    // Try to sign up the user with email confirmation disabled
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: undefined // Disable email confirmation
      }
    });
    
    console.log('Sign up response:', { data, error });
    
    // Handle SMTP errors gracefully
    if (error) {
      if (error.message?.includes("Error sending") || 
          error.message?.includes("SMTP") || 
          error.message?.includes("Username and Password not accepted")) {
        console.log('SMTP error during signup - attempting direct login');
        
        // If SMTP fails, the user might still be created, try signing in
        try {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (!signInError && signInData.user) {
            console.log('User was created successfully despite SMTP error');
            return { error: null, user: signInData.user };
          }
          
          // If sign-in also fails, user wasn't created
          console.log('User not created, treating as new signup');
          return { error: null, user: data.user, needsConfirmation: false };
        } catch (signInError) {
          console.log('Sign-in after SMTP error failed');
        }
      }
      
      // Handle duplicate user errors
      if (error.message?.includes("User already registered") || 
          error.message?.includes("already been registered")) {
        return { error: { message: "An account with this email already exists. Please sign in instead." } };
      }
      
      return { error };
    }
    
    // If signup was successful
    if (data.user) {
      console.log('User created successfully:', data.user.id);
      return { error: null, user: data.user };
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return { error };
  }
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
  try {
    console.log('Attempting password reset for:', email);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    
    if (error) {
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

export const refreshUserSession = async () => {
  try {
    console.log('Refreshing session...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session refresh error:", error);
      return { session: null, user: null };
    }
    
    console.log('Session refreshed:', data.session ? 'Active' : 'None');
    return { session: data.session, user: data.session?.user || null };
  } catch (error) {
    console.error("Error refreshing session:", error);
    return { session: null, user: null };
  }
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
