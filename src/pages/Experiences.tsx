import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Cake, Leaf, Palette, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

interface Experience {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  experience_type: 'couple' | 'birthday' | 'farm_garden' | 'studio';
  min_group_size: number;
  max_group_size: number;
  is_active: boolean;
}

const experienceIcons = {
  couple: Heart,
  birthday: Cake,
  farm_garden: Leaf,
  studio: Palette,
};

const experienceLabels = {
  couple: 'Couple Sessions',
  birthday: 'Birthday Celebrations',
  farm_garden: 'Farm & Garden Events',
  studio: 'Studio Experiences',
};

const Experiences: React.FC = () => {
  useSEO(SEO_CONFIGS.experiences);

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Experience[];
    },
  });

  // Default experiences if none in database
  const defaultExperiences = [
    {
      id: 'couple',
      title: 'Couple Sessions',
      description: 'A romantic pottery experience for two. Create matching pieces together while enjoying an intimate workshop setting.',
      experience_type: 'couple' as const,
      image_url: null,
      min_group_size: 2,
      max_group_size: 2,
      is_active: true,
    },
    {
      id: 'birthday',
      title: 'Birthday Celebrations',
      description: 'Make your birthday unforgettable with a pottery party. Perfect for all ages, guests take home their own creations.',
      experience_type: 'birthday' as const,
      image_url: null,
      min_group_size: 5,
      max_group_size: 15,
      is_active: true,
    },
    {
      id: 'farm_garden',
      title: 'Farm & Garden Events',
      description: 'Experience pottery in nature. Our outdoor sessions combine the serenity of gardens with the joy of creating.',
      experience_type: 'farm_garden' as const,
      image_url: null,
      min_group_size: 4,
      max_group_size: 20,
      is_active: true,
    },
    {
      id: 'studio',
      title: 'Studio Experiences',
      description: 'Deep dive into pottery at our fully-equipped studio. Learn from expert potters in a professional setting.',
      experience_type: 'studio' as const,
      image_url: null,
      min_group_size: 1,
      max_group_size: 8,
      is_active: true,
    },
  ];

  const displayExperiences = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Special Moments
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Experiences
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Beyond workshops, we offer curated pottery experiences for life's special moments.
            From romantic couple sessions to memorable birthday celebrations.
          </p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border overflow-hidden">
                  <Skeleton className="h-64" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {displayExperiences.map((experience) => {
                const Icon = experienceIcons[experience.experience_type];
                return (
                  <Link
                    key={experience.id}
                    to={`/experiences/${experience.experience_type}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-medium transition-shadow">
                      {/* Image */}
                      <div className="h-64 bg-muted relative overflow-hidden">
                        {experience.image_url ? (
                          <img
                            src={experience.image_url}
                            alt={experience.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/50">
                            <Icon className="h-20 w-20 text-primary/30" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-body text-sm text-muted-foreground">
                            {experience.min_group_size === experience.max_group_size
                              ? `${experience.min_group_size} people`
                              : `${experience.min_group_size}-${experience.max_group_size} people`}
                          </span>
                        </div>

                        <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                          {experience.title}
                        </h3>

                        {experience.description && (
                          <p className="font-body text-muted-foreground mt-3 line-clamp-2">
                            {experience.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-4 text-primary font-body">
                          <span>Book Now</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Experiences;
