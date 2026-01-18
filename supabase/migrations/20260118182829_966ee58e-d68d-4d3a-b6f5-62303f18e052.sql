-- Add foreign key from session_inquiries.user_id to profiles.user_id for joining
ALTER TABLE public.session_inquiries
ADD CONSTRAINT session_inquiries_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);