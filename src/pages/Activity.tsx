import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyOrders, EmptyBookings, EmptyInquiries } from '@/components/EmptyState';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const Activity: React.FC = () => {
  useSEO(SEO_CONFIGS.activity);
  
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [ordersRes, bookingsRes, inquiriesRes] = await Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('workshop_bookings').select('*, workshops(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('session_inquiries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (ordersRes.error) console.error('Error fetching orders:', ordersRes.error);
      if (bookingsRes.error) console.error('Error fetching bookings:', bookingsRes.error);
      if (inquiriesRes.error) console.error('Error fetching inquiries:', inquiriesRes.error);

      setOrders(ordersRes.data || []);
      setBookings(bookingsRes.data || []);
      setInquiries(inquiriesRes.data || []);
    } catch (err) {
      setError('Failed to load your activity. Please try again.');
      console.error('Error fetching activity data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'delivered':
      case 'completed':
      case 'attended':
        return 'default';
      case 'pending':
      case 'registered':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container-wide py-12">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-wide py-12 md:py-16">
          <div className="text-center py-16">
            <h2 className="font-display text-2xl text-foreground mb-4">Something went wrong</h2>
            <p className="font-body text-muted-foreground mb-6">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">My Activity</h1>

        {/* Orders */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-semibold text-foreground">Orders</h2>
          </div>
          {orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-body text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      <p className="font-display text-lg text-foreground mt-1">{formatPrice(order.total)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </Badge>
                      <p className="font-body text-sm text-muted-foreground mt-2">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Workshop Bookings */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-semibold text-foreground">Workshop Bookings</h2>
          </div>
          {bookings.length === 0 ? (
            <EmptyBookings />
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-display text-lg text-foreground">{booking.workshops?.title || 'Workshop'}</p>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        {booking.workshops?.date ? format(new Date(booking.workshops.date), 'EEEE, MMMM d, yyyy') : 'Date TBD'}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(booking.payment_status)}>
                      {booking.payment_status?.charAt(0).toUpperCase() + booking.payment_status?.slice(1) || 'Registered'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Session Inquiries */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl font-semibold text-foreground">Session Inquiries</h2>
          </div>
          {inquiries.length === 0 ? (
            <EmptyInquiries />
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-soft transition-shadow">
                  <p className="font-body text-foreground line-clamp-2">{inquiry.message}</p>
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant={getStatusBadgeVariant(inquiry.status)}>
                      {inquiry.status?.charAt(0).toUpperCase() + inquiry.status?.slice(1) || 'Pending'}
                    </Badge>
                    <p className="font-body text-sm text-muted-foreground">{format(new Date(inquiry.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Activity;
