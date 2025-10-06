import { useEffect, useState } from "react";
import { toast } from "sonner";
import { backendNetworkService } from '@/services/backendNetworkService';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

  const fetchProfile = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch profile from backend
      const profileData = await backendNetworkService.getProfile();
      if (profileData) {
        setProfile({
          id: user.id,
          full_name: user.full_name || null,
          email: user.email,
          avatar_url: user.avatar_url || null,
          timezone: 'UTC',
          language: 'en',
          username: user.username || null
        });
      }

      // Fetch settings from backend
      const settingsData = await backendNetworkService.getSettings();
      if (settingsData) {
        setSettings(settingsData as UserSettings);
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
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }

      await backendNetworkService.updateProfile(updates);
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
      if (!user) {
        toast.error('User not authenticated');
        return false;
      }

      await backendNetworkService.updateSettings(updates);
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