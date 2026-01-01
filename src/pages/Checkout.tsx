import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Loader2, ShoppingBag, ArrowRight, CreditCard, CheckCircle, Shield } from 'lucide-react';
import bashoLogo from '@/assets/basho-logo-new.jpg';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const addressSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  address_line_1: z.string().trim().min(5, 'Address is required').max(200),
  address_line_2: z.string().max(200).optional(),
  city: z.string().trim().min(2, 'City is required').max(100),
  state: z.string().trim().min(2, 'State is required').max(100),
  postal_code: z.string().trim().min(5, 'Postal code is required').max(10),
  country: z.string().trim().min(2, 'Country is required').max(100),
  phone: z.string().trim().min(10, 'Phone number is required').max(15),
});

type AddressForm = z.infer<typeof addressSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: 'India',
    },
  });

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const initiateRazorpayPayment = async (orderId: string, amount: number, addressData: AddressForm) => {
    try {
      // Create Razorpay order via edge function
      const { data: razorpayData, error: razorpayError } = await supabase.functions.invoke(
        'create-razorpay-order',
        {
          body: {
            orderId,
            amount,
            currency: 'INR',
            receipt: orderId,
            notes: {
              customer_name: addressData.name,
              customer_email: user?.email,
            },
          },
        }
      );

      if (razorpayError || !razorpayData) {
        throw new Error(razorpayError?.message || 'Failed to create payment order');
      }

      const options: RazorpayOptions = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'Basho by Shivangi',
        description: 'Handcrafted Pottery Purchase',
        order_id: razorpayData.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
              'verify-razorpay-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: orderId,
                },
              }
            );

            if (verifyError) {
              throw new Error('Payment verification failed');
            }

            clearCart();
            toast.success('Payment successful! Your order has been placed.');
            navigate('/activity');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: addressData.name,
          email: user?.email || '',
          contact: addressData.phone,
        },
        theme: {
          color: '#C97B5D',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Razorpay error:', error);
      throw error;
    }
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

    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          items: JSON.parse(JSON.stringify(items)),
          subtotal: subtotal,
          total: subtotal,
          status: 'pending',
          shipping_address: JSON.parse(JSON.stringify(data)),
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Initiate Razorpay payment
      await initiateRazorpayPayment(orderData.id, subtotal, data);
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
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
            <Link to="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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
            <Link to="/login">
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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

              {/* Payment Info */}
              <div className="bg-secondary/50 rounded-lg border border-border p-6 mt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Secure Payment with Razorpay
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Your payment is processed securely. We accept all major cards, UPI, and net banking.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="font-body text-xs text-muted-foreground">
                        Cards, UPI, Net Banking, Wallets
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                  <img 
                    src={bashoLogo} 
                    alt="Basho by Shivangi" 
                    className="h-12 w-auto object-contain"
                  />
                </div>

                <h2 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">
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
                  disabled={isProcessing || !razorpayLoaded}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay {formatPrice(subtotal)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
