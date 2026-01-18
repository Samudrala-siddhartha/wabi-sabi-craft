-- Add contact columns to custom_requests table
ALTER TABLE public.custom_requests
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add foreign key to profiles for joining user data
ALTER TABLE public.custom_requests
ADD CONSTRAINT custom_requests_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);