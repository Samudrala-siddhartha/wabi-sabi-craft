import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';

const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address_line_1: z.string().min(5, 'Address is required'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(10, 'Phone number is required'),
});

type AddressForm = z.infer<typeof addressSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'India',
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const onSubmit = async (data: AddressForm) => {
    if (!user) {
      toast.error('Please sign in to complete your order');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/shop');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const { error } = await supabase.from('orders').insert([{
        user_id: user.id,
        items: JSON.parse(JSON.stringify(items)),
        subtotal: subtotal,
        total: subtotal,
        status: 'pending',
        shipping_address: JSON.parse(JSON.stringify(data)),
      }]);

      if (error) throw error;

      // Clear cart and show success
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/activity');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container-narrow py-20 md:py-32 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-4xl font-light text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button asChild size="lg" className="font-body">
            <a href="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container-narrow py-20 md:py-32 text-center">
          <h1 className="font-display text-4xl font-light text-foreground mb-4">
            Sign In Required
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Please sign in to complete your purchase.
          </p>
          <Button asChild size="lg" className="font-body">
            <a href="/login">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-12 md:py-16">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Shipping Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Shipping Address
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="address_line_1">Address Line 1</Label>
                    <Input
                      id="address_line_1"
                      {...register('address_line_1')}
                      placeholder="Street address"
                      className="mt-1"
                    />
                    {errors.address_line_1 && (
                      <p className="text-destructive text-sm mt-1">{errors.address_line_1.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="address_line_2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address_line_2"
                      {...register('address_line_2')}
                      placeholder="Apartment, suite, etc."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="City"
                      className="mt-1"
                    />
                    {errors.city && (
                      <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register('state')}
                      placeholder="State"
                      className="mt-1"
                    />
                    {errors.state && (
                      <p className="text-destructive text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      {...register('postal_code')}
                      placeholder="Postal code"
                      className="mt-1"
                    />
                    {errors.postal_code && (
                      <p className="text-destructive text-sm mt-1">{errors.postal_code.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      {...register('country')}
                      placeholder="Country"
                      className="mt-1"
                    />
                    {errors.country && (
                      <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Phone number"
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="bg-secondary/50 rounded-lg border border-border p-6 mt-6">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Payment Integration Coming Soon
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Razorpay payment will be enabled once API keys are configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex justify-between font-body text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Free</span>
                  </div>
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between font-body font-medium text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6 font-body"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
