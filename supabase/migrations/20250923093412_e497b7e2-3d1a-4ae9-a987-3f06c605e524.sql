-- Add missing columns to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';

-- Create settings table for user preferences (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  real_time_monitoring BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  auto_device_scanning BOOLEAN DEFAULT true,
  intrusion_detection BOOLEAN DEFAULT true,
  device_alerts BOOLEAN DEFAULT true,
  security_alerts BOOLEAN DEFAULT true,
  pi_ip_address TEXT,
  scan_interval INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for settings (if not already enabled)
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings (if they don't exist)
DO $$ 
BEGIN
  -- Check if policies exist before creating
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can view their own settings') THEN
    CREATE POLICY "Users can view their own settings" 
    ON public.user_settings 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can update their own settings') THEN
    CREATE POLICY "Users can update their own settings" 
    ON public.user_settings 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can insert their own settings') THEN
    CREATE POLICY "Users can insert their own settings" 
    ON public.user_settings 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add trigger for settings timestamps (if not exists)
CREATE TRIGGER IF NOT EXISTS update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();