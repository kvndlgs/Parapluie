-- Add missing columns to user_profiles table for onboarding flow

-- Add onboarding_completed and onboarding_completed_at
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamp with time zone;

-- Add invitation_sent_at to trusted_contacts (for tracking when invitation was sent)
ALTER TABLE public.trusted_contacts
ADD COLUMN IF NOT EXISTS invitation_sent_at timestamp with time zone;

-- Add user_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id uuid NOT NULL,
  total_calls_blocked integer DEFAULT 0,
  total_sms_blocked integer DEFAULT 0,
  total_threats_detected integer DEFAULT 0,
  total_reports_submitted integer DEFAULT 0,
  last_threat_at timestamp with time zone,
  since timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_stats_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON public.user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_code ON public.trusted_contacts(invitation_code);
CREATE INDEX IF NOT EXISTS idx_trusted_contacts_status ON public.trusted_contacts(contact_status);

-- Enable Row Level Security
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
CREATE POLICY IF NOT EXISTS "Users can view own stats"
ON public.user_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own stats"
ON public.user_stats FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Allow insert for new users"
ON public.user_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Comments
COMMENT ON COLUMN public.user_profiles.onboarding_completed IS 'Whether user has completed the onboarding flow';
COMMENT ON COLUMN public.user_profiles.onboarding_completed_at IS 'Timestamp when user completed onboarding';
COMMENT ON TABLE public.user_stats IS 'User statistics and metrics';
