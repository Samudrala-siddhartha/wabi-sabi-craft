export type AppRole = 'admin' | 'consumer' | 'producer';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  materials: string | null;
  care_instructions: string | null;
  category: string | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string | null;
  date: string;
  duration_minutes: number;
  price: number;
  capacity: number;
  spots_remaining: number;
  location: string | null;
  image_url: string | null;
  producer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_id: string | null;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
}

export interface WorkshopBooking {
  id: string;
  user_id: string;
  workshop_id: string;
  payment_status: 'pending' | 'paid' | 'failed';
  payment_id: string | null;
  created_at: string;
  workshop?: Workshop;
}

export interface SessionInquiry {
  id: string;
  user_id: string;
  message: string;
  preferred_date: string | null;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}
