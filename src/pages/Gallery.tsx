import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
}

const Gallery: React.FC = () => {
  useSEO(SEO_CONFIGS.gallery);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'products', label: 'Products' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'studio', label: 'Studio & Events' },
  ];

  const filterImages = (category: string) => {
    if (category === 'all') return images;
    return images.filter(img => img.category === category);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Visual Stories
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Gallery
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            A glimpse into our world of handcrafted pottery.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h2 className="font-display text-2xl text-foreground mb-2">
                Gallery Coming Soon
              </h2>
              <p className="font-body text-muted-foreground">
                We're curating beautiful images to share with you.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 flex flex-wrap justify-center gap-2 h-auto bg-transparent">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat.value} value={cat.value}>
                  {filterImages(cat.value).length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      No images in this category yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filterImages(cat.value).map((image) => (
                        <div
                          key={image.id}
                          className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                        >
                          <img
                            src={image.image_url}
                            alt={image.title || 'Gallery image'}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
