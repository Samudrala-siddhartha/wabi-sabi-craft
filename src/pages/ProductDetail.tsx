import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Set SEO
  useSEO({
    title: product?.name || 'Product',
    description: product?.description || 'Handcrafted pottery from Basho by Shivangi',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } else if (!data) {
        navigate('/shop');
        toast.error('Product not found');
      } else {
        setProduct(data as Product);
      }
      setIsLoading(false);
    };

    fetchProduct();
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product || !product.in_stock) return;
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      });
    }
    
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    if (!product || !product.in_stock) return;
    handleAddToCart();
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-wide py-12">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  const isAvailable = product.in_stock;

  return (
    <Layout>
      <div className="container-wide py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate('/shop')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <span className="font-display text-muted-foreground text-4xl">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
              {!isAvailable && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Currently Unavailable
                  </Badge>
                </div>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
                {product.name}
              </h1>
              {product.category && (
                <Badge variant="secondary" className="font-body text-xs shrink-0">
                  {product.category}
                </Badge>
              )}
            </div>
            <p className="font-body text-2xl text-primary mt-4">
              {formatPrice(product.price)}
            </p>

            {!isAvailable && (
              <div className="mt-4 flex items-center gap-2 text-muted-foreground bg-muted p-3 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <span className="font-body">This item is currently unavailable</span>
              </div>
            )}

            {product.description && (
              <p className="font-body text-muted-foreground mt-6 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Materials & Care */}
            {(product.materials || product.care_instructions) && (
              <div className="mt-8 space-y-4 border-t border-border pt-8">
                {product.materials && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Materials
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {product.materials}
                    </p>
                  </div>
                )}
                {product.care_instructions && (
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      Care Instructions
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {product.care_instructions}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="mt-8 space-y-4">
              {isAvailable ? (
                <>
                  <div className="flex items-center gap-4">
                    <span className="font-body text-foreground">Quantity</span>
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-muted transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 font-body">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      size="lg"
                      className="flex-1 font-body"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      size="lg"
                      className="flex-1 font-body"
                    >
                      Buy Now
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <Button size="lg" className="w-full font-body" disabled>
                    Currently Unavailable
                  </Button>
                  <p className="font-body text-sm text-muted-foreground text-center">
                    This item will be available soon. Check back later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
