-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'consumer', 'producer');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'consumer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  materials TEXT,
  care_instructions TEXT,
  category TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create workshops table
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  capacity INTEGER DEFAULT 10,
  spots_remaining INTEGER DEFAULT 10,
  location TEXT,
  image_url TEXT,
  producer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create workshop_bookings table
CREATE TABLE public.workshop_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, workshop_id)
);

-- Create session_inquiries table
CREATE TABLE public.session_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  message TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_inquiries ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin(auth.uid()));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Workshops policies (public read, admin/producer write)
CREATE POLICY "Anyone can view workshops" ON public.workshops
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert workshops" ON public.workshops
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Producers can insert own workshops" ON public.workshops
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'producer') AND producer_id = auth.uid());

CREATE POLICY "Producers can update own workshops" ON public.workshops
  FOR UPDATE USING (public.has_role(auth.uid(), 'producer') AND producer_id = auth.uid());

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Workshop bookings policies
CREATE POLICY "Users can view own bookings" ON public.workshop_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.workshop_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings" ON public.workshop_bookings
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Session inquiries policies
CREATE POLICY "Users can view own inquiries" ON public.session_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inquiries" ON public.session_inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all inquiries" ON public.session_inquiries
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all inquiries" ON public.session_inquiries
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  user_email TEXT;
BEGIN
  -- Get email and role from metadata
  user_email := NEW.email;
  user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'consumer');
  
  -- Override role to admin if email matches
  IF user_email = 'siddarthasamudrala@gmail.com' THEN
    user_role := 'admin';
  END IF;
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    user_email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_inquiries_updated_at
  BEFORE UPDATE ON public.session_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();