import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_IMAGE = '/og-image.jpg';
const SITE_NAME = 'Basho by Shivangi';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export const useSEO = ({ title, description, image, url, type = 'website' }: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | ${SITE_NAME}`;

    // Helper to update or create meta tag
    const updateMeta = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', description);

    // Open Graph tags
    updateMeta('og:title', `${title} | ${SITE_NAME}`, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:image', image || `${BASE_URL}${DEFAULT_IMAGE}`, true);
    if (url) {
      updateMeta('og:url', url, true);
    }

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', `${title} | ${SITE_NAME}`);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image || `${BASE_URL}${DEFAULT_IMAGE}`);

    // Cleanup function to reset title on unmount
    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, image, url, type]);
};

// Pre-defined SEO configs for common pages
export const SEO_CONFIGS = {
  home: {
    title: 'Handcrafted Pottery',
    description: 'Discover handcrafted pottery celebrating the Japanese philosophy of Wabi-Sabi. Each piece tells a story of intention, patience, and natural beauty.',
  },
  shop: {
    title: 'Shop Collection',
    description: 'Browse our collection of handcrafted pottery. Each piece is unique, embracing the natural variations that make pottery an art form.',
  },
  workshops: {
    title: 'Pottery Workshops',
    description: 'Join our intimate pottery workshops and learn traditional techniques while creating your own unique pieces.',
  },
  sessions: {
    title: 'Private Sessions',
    description: 'Book a private pottery session for a personalized hands-on experience. Perfect for individuals, couples, or small groups.',
  },
  about: {
    title: 'About Basho',
    description: 'Learn about Basho by Shivangi and our philosophy of finding beauty in imperfection through handcrafted pottery.',
  },
  cart: {
    title: 'Your Cart',
    description: 'Review the items in your cart and proceed to checkout.',
  },
  activity: {
    title: 'My Activity',
    description: 'View your orders, workshop bookings, and session inquiries.',
  },
  auth: {
    title: 'Sign In',
    description: 'Sign in to your account to track orders, book workshops, and more.',
  },
};

export default useSEO;
