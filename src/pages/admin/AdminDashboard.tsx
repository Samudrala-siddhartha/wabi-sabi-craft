import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Package, Calendar, ShoppingCart, MessageSquare, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

const AdminDashboard: React.FC = () => {
  useSEO(SEO_CONFIGS.adminDashboard);
  // Fetch counts
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, workshops, orders, inquiries] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('workshops').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('session_inquiries').select('id', { count: 'exact', head: true }),
      ]);

      return {
        products: products.count ?? 0,
        workshops: workshops.count ?? 0,
        orders: orders.count ?? 0,
        inquiries: inquiries.count ?? 0,
      };
    },
  });

  // Fetch recent orders
  const { data: recentOrders } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  // Fetch pending inquiries
  const { data: pendingInquiries } = useQuery({
    queryKey: ['admin-pending-inquiries'],
    queryFn: async () => {
      const { data } = await supabase
        .from('session_inquiries')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const statCards = [
    { label: 'Products', value: stats?.products ?? 0, icon: Package, href: '/admin/products', color: 'text-blue-600' },
    { label: 'Workshops', value: stats?.workshops ?? 0, icon: Calendar, href: '/admin/workshops', color: 'text-green-600' },
    { label: 'Orders', value: stats?.orders ?? 0, icon: ShoppingCart, href: '/admin/orders', color: 'text-orange-600' },
    { label: 'Inquiries', value: stats?.inquiries ?? 0, icon: MessageSquare, href: '/admin/inquiries', color: 'text-purple-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link key={stat.label} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/orders">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentOrders && recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.total}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.status === 'completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No orders yet</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Inquiries</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/inquiries">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {pendingInquiries && pendingInquiries.length > 0 ? (
                <div className="space-y-3">
                  {pendingInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="py-2 border-b border-border last:border-0">
                      <p className="font-medium text-sm line-clamp-1">{inquiry.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                        {inquiry.preferred_date && ` • Preferred: ${new Date(inquiry.preferred_date).toLocaleDateString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No pending inquiries</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;