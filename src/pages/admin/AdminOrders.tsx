import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

type Order = Tables<'orders'>;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  postal_code?: string;
  country?: string;
}

interface OrderWithProfile extends Order {
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
}

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders: React.FC = () => {
  useSEO(SEO_CONFIGS.adminOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_profiles_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as OrderWithProfile[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error('Failed to update status: ' + error.message);
    },
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-purple-100 text-purple-700';
      case 'shipped': return 'bg-indigo-100 text-indigo-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const parseItems = (items: unknown): CartItem[] => {
    if (Array.isArray(items)) {
      return items as CartItem[];
    }
    return [];
  };

  const parseAddress = (address: unknown): ShippingAddress | null => {
    if (address && typeof address === 'object') {
      return address as ShippingAddress;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage customer orders</p>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const items = parseItems(order.items);
                    const address = parseAddress(order.shipping_address);
                    // Get customer name: prefer shipping_address.name, fallback to firstName/lastName, then profile
                    const customerName = address?.name 
                      || (address?.firstName && address?.lastName ? `${address.firstName} ${address.lastName}` : null)
                      || (order.profiles?.first_name && order.profiles?.last_name ? `${order.profiles.first_name} ${order.profiles.last_name}` : null)
                      || '-';
                    // Get email: prefer shipping_address.email, fallback to profile
                    const customerEmail = address?.email || order.profiles?.email || '';
                    // Get phone from shipping address
                    const customerPhone = address?.phone || '';
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{customerName}</p>
                          {customerEmail && (
                            <p className="text-xs text-muted-foreground">{customerEmail}</p>
                          )}
                          {customerPhone && (
                            <p className="text-xs text-muted-foreground">{customerPhone}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), 'MMM d, yyyy')}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(order.created_at), 'h:mm a')}
                          </span>
                        </TableCell>
                        <TableCell>
                          {items.length} item{items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell className="font-medium">₹{order.total}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status ?? 'pending'}
                            onValueChange={(value) => 
                              updateStatusMutation.mutate({ id: order.id, status: value })
                            }
                          >
                            <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order ID:</span>
                    <p className="font-mono">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p>{format(new Date(selectedOrder.created_at), 'PPpp')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment ID:</span>
                    <p className="font-mono text-xs">{selectedOrder.payment_id || 'N/A'}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    {(() => {
                      const address = parseAddress(selectedOrder.shipping_address);
                      const profile = (selectedOrder as OrderWithProfile).profiles;
                      if (!address) return <p className="text-muted-foreground text-sm">No address provided</p>;
                      
                      // Build display values with fallbacks
                      const displayName = address.name 
                        || (address.firstName && address.lastName ? `${address.firstName} ${address.lastName}` : null)
                        || (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 'N/A');
                      const displayEmail = address.email || profile?.email || 'N/A';
                      const displayPhone = address.phone || 'N/A';
                      const displayAddress = address.address_line_1 || address.address || '';
                      const displayAddress2 = address.address_line_2 || '';
                      const displayCity = address.city || '';
                      const displayState = address.state || '';
                      const displayPostal = address.postal_code || address.pincode || '';
                      
                      return (
                        <div className="text-sm bg-muted/50 p-4 rounded-lg">
                          <p className="font-medium">{displayName}</p>
                          <p>{displayAddress}</p>
                          {displayAddress2 && <p>{displayAddress2}</p>}
                          <p>{displayCity}, {displayState} - {displayPostal}</p>
                          <p className="mt-2">Phone: {displayPhone}</p>
                          <p>Email: {displayEmail}</p>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {parseItems(selectedOrder.items).map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-muted rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg mt-2">
                    <span>Total</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;