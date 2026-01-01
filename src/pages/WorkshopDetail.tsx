import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { toast } from 'sonner';
import { format } from 'date-fns';

const WorkshopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);

  // Set SEO
  useSEO({
    title: workshop?.title || 'Workshop',
    description: workshop?.description || 'Join our pottery workshop at Basho by Shivangi',
  });

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching workshop:', error);
        toast.error('Failed to load workshop');
      } else if (!data) {
        navigate('/workshops');
        toast.error('Workshop not found');
      } else {
        setWorkshop(data as Workshop);
      }
      setIsLoading(false);
    };

    const checkBooking = async () => {
      if (!user || !id) return;

      const { data } = await supabase
        .from('workshop_bookings')
        .select('id')
        .eq('user_id', user.id)
        .eq('workshop_id', id)
        .maybeSingle();

      if (data) {
        setHasBooked(true);
      }
    };

    fetchWorkshop();
    checkBooking();
  }, [id, navigate, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please sign in to book this workshop');
      navigate('/login');
      return;
    }

    if (!workshop || workshop.spots_remaining <= 0) return;

    setIsBooking(true);

    try {
      const { error } = await supabase.from('workshop_bookings').insert({
        user_id: user.id,
        workshop_id: workshop.id,
        payment_status: workshop.price === 0 ? 'paid' : 'pending',
      });

      if (error) {
        if (error.code === '23505') {
          toast.error('You have already booked this workshop');
        } else {
          throw error;
        }
      } else {
        setHasBooked(true);
        toast.success('Workshop booked successfully!');
      }
    } catch (error) {
      console.error('Error booking workshop:', error);
      toast.error('Failed to book workshop. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-wide py-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <Skeleton className="aspect-video rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!workshop) {
    return null;
  }

  const isFullyBooked = workshop.spots_remaining <= 0;
  const isPastEvent = new Date(workshop.date) < new Date();

  return (
    <Layout>
      <div className="container-wide py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate('/workshops')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Workshops
        </Button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <div className="aspect-video md:aspect-square bg-muted rounded-lg overflow-hidden relative">
            {workshop.image_url ? (
              <img
                src={workshop.image_url}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <span className="font-display text-muted-foreground text-4xl">
                  {workshop.title.charAt(0)}
                </span>
              </div>
            )}
            {(isFullyBooked || isPastEvent) && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {isPastEvent ? 'Past Event' : 'Fully Booked'}
                </Badge>
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              {workshop.title}
            </h1>
            
            <p className="font-body text-2xl text-primary mt-4">
              {formatPrice(workshop.price)}
            </p>

            {workshop.description && (
              <p className="font-body text-muted-foreground mt-6 leading-relaxed">
                {workshop.description}
              </p>
            )}

            {/* Info */}
            <div className="mt-8 space-y-4 border-t border-border pt-8">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="font-body">
                  <span className="text-foreground font-medium">
                    {format(new Date(workshop.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div className="font-body">
                  <span className="text-foreground font-medium">
                    {format(new Date(workshop.date), 'h:mm a')}
                  </span>
                  <span className="text-muted-foreground"> · {workshop.duration_minutes} minutes</span>
                </div>
              </div>

              {workshop.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-body text-foreground">{workshop.location}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-body text-foreground">
                  {isFullyBooked ? (
                    <span className="text-destructive">No spots available</span>
                  ) : (
                    <>{workshop.spots_remaining} of {workshop.capacity} spots available</>
                  )}
                </span>
              </div>
            </div>

            {/* Booking */}
            <div className="mt-8">
              {isPastEvent ? (
                <div className="bg-muted rounded-lg p-4">
                  <p className="font-body text-muted-foreground">
                    This workshop has already taken place.
                  </p>
                </div>
              ) : hasBooked ? (
                <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-body text-foreground font-medium">
                      You're booked for this workshop
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                      Check your email for details and instructions.
                    </p>
                  </div>
                </div>
              ) : isFullyBooked ? (
                <div className="space-y-4">
                  <Button size="lg" className="w-full font-body" disabled>
                    <XCircle className="h-4 w-4 mr-2" />
                    Fully Booked
                  </Button>
                  <p className="font-body text-sm text-muted-foreground text-center">
                    All spots have been filled. Check our other workshops.
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full font-body"
                  disabled={isBooking}
                >
                  {isBooking ? 'Booking...' : 'Book Your Seat'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkshopDetail;
