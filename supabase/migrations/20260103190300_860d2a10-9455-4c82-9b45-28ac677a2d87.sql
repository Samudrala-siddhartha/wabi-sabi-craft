-- Add status column to products table for coming soon functionality
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' 
CHECK (status IN ('active', 'coming_soon'));