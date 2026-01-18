-- Add contact columns to session_inquiries table
ALTER TABLE public.session_inquiries
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Fix admin_settings: restrict SELECT to authenticated users only
DROP POLICY IF EXISTS "Anyone can view settings" ON public.admin_settings;
CREATE POLICY "Authenticated users can view settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (true);

-- Update experience_inquiries INSERT policy to require authentication
DROP POLICY IF EXISTS "Anyone can create experience inquiries" ON public.experience_inquiries;
CREATE POLICY "Authenticated users can create experience inquiries"
ON public.experience_inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Update corporate_inquiries INSERT policy to require authentication
DROP POLICY IF EXISTS "Anyone can create corporate inquiries" ON public.corporate_inquiries;
CREATE POLICY "Authenticated users can create corporate inquiries"
ON public.corporate_inquiries
FOR INSERT
TO authenticated
WITH CHECK (true);