-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.safety_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  event_type text NOT NULL CHECK (event_type = ANY (ARRAY['call'::text, 'sms'::text, 'threat'::text, 'phishing'::text, 'scam'::text])),
  event_status text NOT NULL CHECK (event_status = ANY (ARRAY['blocked'::text, 'allowed'::text, 'pending'::text, 'reported_safe'::text, 'reported_unsafe'::text, 'whitelisted'::text, 'reviewing'::text])),
  threat_level text NOT NULL CHECK (threat_level = ANY (ARRAY['none'::text, 'low'::text, 'medium'::text, 'high'::text, 'critical'::text])),
  threat_score integer CHECK (threat_score >= 0 AND threat_score <= 10),
  metadata jsonb NOT NULL,
  walter_analysis jsonb,
  user_feedback jsonb,
  trusted_contact_notified boolean DEFAULT false,
  timestamp timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT safety_events_pkey PRIMARY KEY (id),
  CONSTRAINT safety_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.security_settings (
  user_id uuid NOT NULL,
  protection_level text DEFAULT 'medium'::text CHECK (protection_level = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  call_protection_enabled boolean DEFAULT true,
  sms_protection_enabled boolean DEFAULT true,
  location_alerts_enabled boolean DEFAULT true,
  notifications_enabled boolean DEFAULT true,
  auto_block_unknown boolean DEFAULT false,
  auto_block_international boolean DEFAULT false,
  quiet_hours_enabled boolean DEFAULT false,
  quiet_hours_start time without time zone,
  quiet_hours_end time without time zone,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT security_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT security_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.trusted_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  senior_id uuid NOT NULL,
  contact_user_id uuid,
  contact_status text NOT NULL CHECK (contact_status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text, 'declined'::text, 'removed'::text, 'blocked'::text])),
  name text NOT NULL,
  relationship text NOT NULL,
  phone_number text,
  email text,
  preferred_contact_method text CHECK (preferred_contact_method = ANY (ARRAY['sms'::text, 'email'::text, 'app'::text])),
  invitation_code text UNIQUE,
  invitation_expires_at timestamp with time zone,
  invited_at timestamp with time zone DEFAULT now(),
  accepted_at timestamp with time zone,
  last_active_at timestamp with time zone,
  permissions jsonb DEFAULT '{"alert_level": "high", "can_view_alerts": true, "can_view_location": false, "can_access_calendar": false, "can_modify_settings": false, "can_receive_notifications": true}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT trusted_contacts_pkey PRIMARY KEY (id),
  CONSTRAINT trusted_contacts_senior_id_fkey FOREIGN KEY (senior_id) REFERENCES public.user_profiles(id),
  CONSTRAINT trusted_contacts_contact_user_id_fkey FOREIGN KEY (contact_user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text,
  preferred_name text,
  phone_number text NOT NULL,
  email text,
  date_of_birth date,
  language text DEFAULT 'fr'::text CHECK (language = ANY (ARRAY['fr'::text, 'en'::text])),
  timezone text DEFAULT 'America/Montreal'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);