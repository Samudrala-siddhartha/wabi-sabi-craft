import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter((cat): cat is string => cat !== null && cat !== undefined);
    return [...new Set(cats)].sort();
  }, [products]);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

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

      {/* Category Filter */}
      {categories.length > 0 && (
        <section className="py-8 border-b border-border">
          <div className="container-wide">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="font-body"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="font-body"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square rounded-lg bg-muted" />
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-5 w-1/4 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="font-display text-3xl text-foreground mb-4">
                {selectedCategory ? `No ${selectedCategory} products found` : 'Collection Coming Soon'}
              </h2>
              <p className="font-body text-muted-foreground mb-6">
                {selectedCategory 
                  ? 'Try selecting a different category.' 
                  : "We're preparing beautiful pieces for you. Check back soon!"}
              </p>
              {selectedCategory && (
                <Button onClick={() => setSelectedCategory(null)} variant="outline">
                  View All Products
                </Button>
              )}
            </div>
          ) : (
            <>
              {selectedCategory && (
                <div className="mb-8 flex items-center justify-between">
                  <p className="font-body text-muted-foreground">
                    Showing {filteredProducts.length} {selectedCategory.toLowerCase()} product{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedCategory(null)}
                    className="font-body text-muted-foreground"
                  >
                    Clear filter
                  </Button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group block"
                  >
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4 relative">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary">
                          <span className="font-display text-muted-foreground text-4xl">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      {product.category && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-3 left-3 font-body text-xs"
                        >
                          {product.category}
                        </Badge>
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
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
