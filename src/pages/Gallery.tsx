import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

// Static gallery images from local assets
import galleryBowls from '@/assets/gallery-bowls.jpg';
import galleryPlanter from '@/assets/gallery-planter.jpg';
import galleryPlate from '@/assets/gallery-plate.jpg';
import galleryTeacup from '@/assets/gallery-teacup.jpg';
import galleryVase from '@/assets/gallery-vase.jpg';
import galleryWheel from '@/assets/gallery-wheel.jpg';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  category: string;
}

const staticImages: GalleryImage[] = [
  { id: '1', image_url: galleryBowls, title: 'Ceramic Bowls', category: 'products' },
  { id: '2', image_url: galleryPlanter, title: 'Handmade Planter', category: 'products' },
  { id: '3', image_url: galleryPlate, title: 'Artisan Plate', category: 'products' },
  { id: '4', image_url: galleryTeacup, title: 'Traditional Teacup', category: 'products' },
  { id: '5', image_url: galleryVase, title: 'Decorative Vase', category: 'products' },
  { id: '6', image_url: galleryWheel, title: 'Pottery Wheel Session', category: 'workshops' },
];

const Gallery: React.FC = () => {
  useSEO(SEO_CONFIGS.gallery);

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

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {staticImages.length === 0 ? (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {staticImages.map((image) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;
