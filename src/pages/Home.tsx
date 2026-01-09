import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-shivangi.png';
import founderImage from '@/assets/founder-shivangi.png';
import galleryBowls from '@/assets/gallery-bowls.jpg';

const Home: React.FC = () => {
  useSEO(SEO_CONFIGS.home);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch coming soon products from database
  const { data: comingSoonProducts } = useQuery({
    queryKey: ['coming-soon-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'coming_soon')
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Fetch featured active products from database
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('in_stock', true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const handleProductClick = (productId: string, isComingSoon: boolean) => {
    if (!user) {
      navigate('/signup');
      return;
    }
    
    navigate(`/product/${productId}`);
  };

  const handleViewAllClick = () => {
    if (user) {
      navigate('/shop');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        {/* Mobile Hero - Same image as desktop, mobile-optimized */}
        <div className="md:hidden w-full">
          <div className="relative w-full min-h-[50vh] bg-[#f5f0eb] overflow-hidden">
            <img 
              src={heroImage} 
              alt="Shivangi with handcrafted pottery" 
              className="w-full h-auto object-contain"
            />
            {/* Subtle bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="px-4 py-6 bg-background text-center">
            <span className="inline-block font-body text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">
              Handcrafted Pottery
            </span>
            <h1 className="font-display text-3xl font-light text-foreground mb-3 leading-[1.1]">
              Beauty in
              <br />
              <span className="font-semibold italic text-primary">Imperfection</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-5 leading-relaxed max-w-xs mx-auto">
              Embrace the Japanese philosophy of Wabi-Sabi with our handcrafted pottery.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="font-body text-base w-full">
                <Link to="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-body text-base w-full">
                <Link to="/workshops">
                  Explore Workshops
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Hero - hidden on mobile */}
        <div className="hidden md:block absolute inset-0">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent z-10" />
          
          {/* Hero Image */}
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Shivangi with handcrafted pottery" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        
        <div className="hidden md:block relative container-wide z-20 px-4">
          <div className="max-w-2xl">
            <span className="inline-block font-body text-sm tracking-[0.3em] text-muted-foreground uppercase mb-6 animate-fade-in">
              Handcrafted Pottery
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-foreground mb-6 leading-[1.1] animate-fade-in">
              Beauty in
              <br />
              <span className="font-semibold italic text-primary">Imperfection</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Embrace the Japanese philosophy of Wabi-Sabi with our handcrafted pottery collection. 
              Each piece tells a story of intention, patience, and natural beauty.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="font-body text-base px-8 py-6">
                <Link to="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-body text-base px-8 py-6 bg-background/80 backdrop-blur-sm">
                <Link to="/workshops">
                  Explore Workshops
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements - desktop only */}
        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 bg-foreground/30 rounded-full" />
          </div>
        </div>
      </section>

      {/* Coming Soon / Featured Pieces Section */}
      {comingSoonProducts && comingSoonProducts.length > 0 && (
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
                  Sneak Peek
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
                  Coming Soon
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {comingSoonProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product.id, true)}
                  className="group aspect-[3/4] bg-muted rounded-lg overflow-hidden relative cursor-pointer hover-scale"
                >
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Coming Soon
                  </Badge>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display text-xl text-primary-foreground">{product.name}</h3>
                    <p className="font-body text-primary-foreground/80 text-sm mt-1">
                      {user ? 'View details' : 'Sign up to see more'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="py-12 md:py-32">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Our Philosophy
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
              The Art of Wabi-Sabi
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Imperfection',
                description: 'We celebrate the cracks, asymmetries, and unique characteristics that make each piece one-of-a-kind.',
              },
              {
                title: 'Impermanence',
                description: 'Our pottery honors the transient nature of all things, creating pieces meant to be used and cherished.',
              },
              {
                title: 'Incompleteness',
                description: 'Each creation leaves space for the owner to complete its story through daily use and appreciation.',
              },
            ].map((item, index) => (
              <div 
                key={item.title}
                className="text-center p-8 bg-card rounded-lg shadow-soft animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection Preview */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 md:py-32 bg-secondary/30">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
                  Curated Selection
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
                  Featured Pieces
                </h2>
              </div>
              <button
                onClick={handleViewAllClick}
                className="font-body text-primary hover:text-primary/80 transition-colors flex items-center gap-2 mt-4 md:mt-0"
              >
                View All <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product.id, false)}
                  className="group aspect-[3/4] bg-muted rounded-lg overflow-hidden relative cursor-pointer hover-scale"
                >
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display text-xl text-primary-foreground">{product.name}</h3>
                    <p className="font-body text-primary-foreground/80 text-sm mt-1">
                      {user ? 'View in Shop' : 'Sign up to shop'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Workshop CTA */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container-narrow text-center">
          <span className="font-body text-sm tracking-[0.3em] uppercase opacity-80">
            Learn the Craft
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light mt-4 mb-6">
            Join Our Workshops
          </h2>
          <p className="font-body text-lg opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover the meditative art of pottery making in our intimate workshops. 
            Learn traditional techniques while creating your own unique pieces.
          </p>
          <Button 
            asChild 
            variant="secondary" 
            size="lg" 
            className="font-body text-base px-8 py-6"
          >
            <Link to="/workshops">
              Browse Workshops
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 md:py-32">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={founderImage} 
                alt="Shivangi crafting pottery at the wheel" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div>
              <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
                The Artist
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4 mb-6">
                Meet Shivangi
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                <span className="font-semibold text-foreground">Basho</span> is a Japanese word meaning "A Place". It is also the name of the legendary Japanese haiku poet who found profound beauty in simplicity.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                At Basho by Shivangi, we create handcrafted pottery that celebrates the Japanese philosophy of Wabi-Sabi—finding beauty in imperfection and embracing the natural cycle of growth and decay.
              </p>
              <Button asChild variant="outline" className="font-body">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;