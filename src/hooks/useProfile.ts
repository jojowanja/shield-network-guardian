import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  timezone: string;
  language: string;
  username: string | null;
}

interface UserSettings {
  id: string;
  real_time_monitoring: boolean;
  push_notifications: boolean;
  auto_device_scanning: boolean;
  intrusion_detection: boolean;
  device_alerts: boolean;
  security_alerts: boolean;
  pi_ip_address: string | null;
  scan_interval: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        toast.error('Failed to load profile');
      } else if (profileData) {
        setProfile(profileData);
      }

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
        toast.error('Failed to load settings');
      } else if (settingsData) {
        setSettings(settingsData);
      }
      
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...updates 
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }

      toast.success('Profile updated successfully');
      await fetchProfile(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id, 
          ...updates 
        });

      if (error) {
        console.error('Error updating settings:', error);
        toast.error('Failed to update settings');
        return false;
      }

      toast.success('Settings updated successfully');
      await fetchProfile(); // Refresh data
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    settings,
    loading,
    updateProfile,
    updateSettings,
    refetch: fetchProfile,
  };
};