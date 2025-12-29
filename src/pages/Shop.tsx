import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import Layout from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data as Product[]);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            The Collection
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Shop
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Each piece is handcrafted with care, embracing the natural variations 
            that make pottery an art form.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-display text-3xl text-foreground mb-4">
                Collection Coming Soon
              </h2>
              <p className="font-body text-muted-foreground">
                We're preparing beautiful pieces for you. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary">
                        <span className="font-display text-muted-foreground text-lg">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-body text-muted-foreground mt-1">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
