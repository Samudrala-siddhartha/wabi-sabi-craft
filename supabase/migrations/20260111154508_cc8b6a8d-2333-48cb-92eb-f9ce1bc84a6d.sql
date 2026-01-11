-- ===========================================
-- 1. TESTIMONIALS TABLE
-- ===========================================
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video')),
  customer_name TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view published testimonials
CREATE POLICY "Anyone can view published testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_published = true);

-- Admins can view all testimonials
CREATE POLICY "Admins can view all testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can insert testimonials
CREATE POLICY "Admins can insert testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Admins can update testimonials
CREATE POLICY "Admins can update testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Admins can delete testimonials
CREATE POLICY "Admins can delete testimonials" 
ON public.testimonials 
FOR DELETE 
USING (is_admin(auth.uid()));

-- ===========================================
-- 2. CORPORATE INQUIRIES TABLE
-- ===========================================
CREATE TABLE public.corporate_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('gifting', 'workshop', 'collaboration')),
  message TEXT NOT NULL,
  reference_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corporate_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit corporate inquiries (public form)
CREATE POLICY "Anyone can submit corporate inquiries" 
ON public.corporate_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all corporate inquiries
CREATE POLICY "Admins can view all corporate inquiries" 
ON public.corporate_inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can update corporate inquiries
CREATE POLICY "Admins can update corporate inquiries" 
ON public.corporate_inquiries 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- ===========================================
-- 3. EXPERIENCES TABLE (for listing experiences)
-- ===========================================
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  experience_type TEXT NOT NULL CHECK (experience_type IN ('couple', 'birthday', 'farm_garden', 'studio')),
  min_group_size INTEGER DEFAULT 1,
  max_group_size INTEGER DEFAULT 10,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Anyone can view active experiences
CREATE POLICY "Anyone can view active experiences" 
ON public.experiences 
FOR SELECT 
USING (is_active = true);

-- Admins can view all experiences
CREATE POLICY "Admins can view all experiences" 
ON public.experiences 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can insert experiences
CREATE POLICY "Admins can insert experiences" 
ON public.experiences 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Admins can update experiences
CREATE POLICY "Admins can update experiences" 
ON public.experiences 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Admins can delete experiences
CREATE POLICY "Admins can delete experiences" 
ON public.experiences 
FOR DELETE 
USING (is_admin(auth.uid()));

-- ===========================================
-- 4. EXPERIENCE INQUIRIES TABLE
-- ===========================================
CREATE TABLE public.experience_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID REFERENCES public.experiences(id),
  experience_type TEXT NOT NULL,
  preferred_date DATE,
  group_size INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.experience_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit experience inquiries (public form)
CREATE POLICY "Anyone can submit experience inquiries" 
ON public.experience_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all experience inquiries
CREATE POLICY "Admins can view all experience inquiries" 
ON public.experience_inquiries 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can update experience inquiries
CREATE POLICY "Admins can update experience inquiries" 
ON public.experience_inquiries 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- ===========================================
-- 5. ADD WEIGHT_KG TO PRODUCTS (for shipping)
-- ===========================================
ALTER TABLE public.products 
ADD COLUMN weight_kg NUMERIC DEFAULT NULL;

-- ===========================================
-- 6. ADD GST_NUMBER TO ORDERS
-- ===========================================
ALTER TABLE public.orders 
ADD COLUMN gst_number TEXT DEFAULT NULL;

-- ===========================================
-- 7. WORKSHOP SLOTS TABLE (separate from workshops for slot management)
-- ===========================================
CREATE TABLE public.workshop_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 10,
  spots_remaining INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshop_slots ENABLE ROW LEVEL SECURITY;

-- Anyone can view workshop slots
CREATE POLICY "Anyone can view workshop slots" 
ON public.workshop_slots 
FOR SELECT 
USING (true);

-- Admins can insert workshop slots
CREATE POLICY "Admins can insert workshop slots" 
ON public.workshop_slots 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Admins can update workshop slots
CREATE POLICY "Admins can update workshop slots" 
ON public.workshop_slots 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Admins can delete workshop slots
CREATE POLICY "Admins can delete workshop slots" 
ON public.workshop_slots 
FOR DELETE 
USING (is_admin(auth.uid()));

-- ===========================================
-- 8. ADD SLOT_ID TO WORKSHOP_BOOKINGS
-- ===========================================
ALTER TABLE public.workshop_bookings 
ADD COLUMN slot_id UUID REFERENCES public.workshop_slots(id);

-- ===========================================
-- 9. ADMIN SETTINGS TABLE (for shipping rate)
-- ===========================================
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (for shipping rate display)
CREATE POLICY "Anyone can view settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Admins can insert settings
CREATE POLICY "Admins can insert settings" 
ON public.admin_settings 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

-- Admins can update settings
CREATE POLICY "Admins can update settings" 
ON public.admin_settings 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Insert default shipping rate
INSERT INTO public.admin_settings (key, value) 
VALUES ('shipping_rate_per_kg', '{"rate": 50}')
ON CONFLICT (key) DO NOTHING;

-- ===========================================
-- 10. UPDATE TRIGGERS FOR updated_at
-- ===========================================
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_corporate_inquiries_updated_at
BEFORE UPDATE ON public.corporate_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
BEFORE UPDATE ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_experience_inquiries_updated_at
BEFORE UPDATE ON public.experience_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();