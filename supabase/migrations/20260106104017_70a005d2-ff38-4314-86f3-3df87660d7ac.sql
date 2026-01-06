-- Create custom_requests table for product customization requests
CREATE TABLE public.custom_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  text_notes TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own custom requests"
ON public.custom_requests
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can insert own custom requests"
ON public.custom_requests
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can view all requests
CREATE POLICY "Admins can view all custom requests"
ON public.custom_requests
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- Admins can update all requests
CREATE POLICY "Admins can update all custom requests"
ON public.custom_requests
FOR UPDATE
USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custom_requests_updated_at
BEFORE UPDATE ON public.custom_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for customization images
INSERT INTO storage.buckets (id, name, public) VALUES ('customization-images', 'customization-images', true);

-- Storage policies for customization images
CREATE POLICY "Users can upload customization images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'customization-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view customization images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'customization-images');