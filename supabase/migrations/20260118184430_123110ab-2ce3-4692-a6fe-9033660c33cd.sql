-- Add foreign key from orders.user_id to profiles.user_id for profile data access
ALTER TABLE public.orders
ADD CONSTRAINT orders_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);