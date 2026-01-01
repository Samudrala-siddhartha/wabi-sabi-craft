-- Fix security issues: Ensure explicit authentication checks in RLS policies

-- 1. First, make orders.user_id NOT NULL to prevent anonymous order creation
-- Check if there are any orders with NULL user_id first
UPDATE public.orders SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

-- 2. Drop and recreate orders policies with explicit auth checks
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 3. Drop and recreate profiles policies with explicit auth checks
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 4. Also secure session_inquiries with explicit checks
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.session_inquiries;
DROP POLICY IF EXISTS "Users can insert own inquiries" ON public.session_inquiries;
DROP POLICY IF EXISTS "Admins can view all inquiries" ON public.session_inquiries;
DROP POLICY IF EXISTS "Admins can update all inquiries" ON public.session_inquiries;

CREATE POLICY "Users can view own inquiries" ON public.session_inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own inquiries" ON public.session_inquiries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all inquiries" ON public.session_inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

CREATE POLICY "Admins can update all inquiries" ON public.session_inquiries
  FOR UPDATE USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 5. Secure workshop_bookings with explicit checks
DROP POLICY IF EXISTS "Users can view own bookings" ON public.workshop_bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON public.workshop_bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.workshop_bookings;

CREATE POLICY "Users can view own bookings" ON public.workshop_bookings
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.workshop_bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.workshop_bookings
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));

-- 6. Secure user_roles with explicit checks
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role on signup" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can insert own role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (auth.uid() IS NOT NULL AND is_admin(auth.uid()));