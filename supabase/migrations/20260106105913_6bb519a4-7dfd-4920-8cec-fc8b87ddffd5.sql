-- Make product_id nullable to allow custom requests not tied to existing products
ALTER TABLE public.custom_requests 
ALTER COLUMN product_id DROP NOT NULL;