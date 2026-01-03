import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyWorkshops } from '@/components/EmptyState';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '@/components/PullToRefresh';
import { format } from 'date-fns';

const Workshops: React.FC = () => {
  useSEO(SEO_CONFIGS.workshops);
  const queryClient = useQueryClient();
  
  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching workshops:', error);
        throw error;
      }
      return data as Workshop[];
    },
  });

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['workshops'] });
  }, [queryClient]);

  const { pullDistance, isRefreshing, containerRef } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      <div ref={containerRef}>
        <PullToRefreshIndicator 
          pullDistance={pullDistance} 
          isRefreshing={isRefreshing} 
        />

        {/* Hero */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container-wide text-center">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Learn & Create
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
              Workshops
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
              Immerse yourself in the art of pottery making. Join our intimate workshops 
              and discover the meditative joy of creating with clay.
            </p>
          </div>
        </section>

        {/* Workshops List */}
        <section className="py-16 md:py-24">
          <div className="container-wide">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-6 bg-card rounded-lg border border-border">
                    <Skeleton className="w-full md:w-64 h-48 rounded-md" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <div className="flex gap-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : workshops.length === 0 ? (
              <EmptyWorkshops />
            ) : (
              <div className="space-y-6">
                {workshops.map((workshop) => (
                  <Link
                    key={workshop.id}
                    to={`/workshops/${workshop.id}`}
                    className="block group"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6 bg-card rounded-lg border border-border hover:shadow-medium transition-shadow">
                      {/* Image */}
                      <div className="w-full md:w-64 h-48 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                        {workshop.image_url ? (
                          <img
                            src={workshop.image_url}
                            alt={workshop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <span className="font-display text-muted-foreground text-2xl">
                              {workshop.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                          {workshop.title}
                        </h3>
                        
                        {workshop.description && (
                          <p className="font-body text-muted-foreground mt-2 line-clamp-2">
                            {workshop.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="font-body">
                              {format(new Date(workshop.date), 'EEEE, MMMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="font-body">
                              {format(new Date(workshop.date), 'h:mm a')} · {workshop.duration_minutes} min
                            </span>
                          </div>
                          {workshop.location && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="font-body">{workshop.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="font-body">
                              {workshop.spots_remaining} spots left
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <span className="font-body text-xl font-medium text-primary">
                            {formatPrice(workshop.price)}
                          </span>
                          <Button variant="outline" className="font-body">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Workshops;
