import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Quote, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

interface Testimonial {
  id: string;
  type: 'text' | 'video';
  customer_name: string;
  content: string;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
}

const Testimonials: React.FC = () => {
  useSEO(SEO_CONFIGS.testimonials);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const textTestimonials = testimonials.filter(t => t.type === 'text');
  const videoTestimonials = testimonials.filter(t => t.type === 'video');

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            What Our Customers Say
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Testimonials
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Stories from our community of pottery lovers and workshop participants.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border p-6">
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16">
              <Quote className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-2">
                No Testimonials Yet
              </h2>
              <p className="font-body text-muted-foreground">
                Check back soon for stories from our community.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Text Testimonials */}
              {textTestimonials.length > 0 && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-8">
                    Customer Reviews
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {textTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-card rounded-lg border border-border p-6 hover:shadow-medium transition-shadow"
                      >
                        <Quote className="h-8 w-8 text-primary/30 mb-4" />
                        <p className="font-body text-foreground leading-relaxed mb-4">
                          "{testimonial.content}"
                        </p>
                        <p className="font-body text-sm font-medium text-primary">
                          — {testimonial.customer_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Testimonials */}
              {videoTestimonials.length > 0 && (
                <div>
                  <h2 className="font-display text-3xl text-foreground mb-8">
                    Video Stories
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {videoTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-card rounded-lg border border-border overflow-hidden"
                      >
                        <div className="aspect-video relative bg-muted">
                          {testimonial.thumbnail_url ? (
                            <img
                              src={testimonial.thumbnail_url}
                              alt={testimonial.customer_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary">
                              <Play className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          {/* Video embed - content field contains the video URL */}
                          {testimonial.content.includes('youtube') || testimonial.content.includes('youtu.be') ? (
                            <iframe
                              src={testimonial.content.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          ) : testimonial.content.includes('vimeo') ? (
                            <iframe
                              src={testimonial.content.replace('vimeo.com/', 'player.vimeo.com/video/')}
                              className="absolute inset-0 w-full h-full"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={testimonial.content}
                              controls
                              className="absolute inset-0 w-full h-full"
                              poster={testimonial.thumbnail_url || undefined}
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-body font-medium text-foreground">
                            {testimonial.customer_name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
