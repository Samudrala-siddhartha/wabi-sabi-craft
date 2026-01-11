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
const DEFAULT_TAGLINE = 'Handcrafted Pottery & Studio Experiences';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export const useSEO = ({ title, description, image, url, type = 'website' }: SEOProps) => {
  useEffect(() => {
    // Update document title
    // For home page, show full branding with tagline
    // For other pages, show "{Page} | Basho by Shivangi"
    const isHomePage = title.toLowerCase() === 'home' || title === '';
    document.title = isHomePage 
      ? `${SITE_NAME} | ${DEFAULT_TAGLINE}`
      : `${title} | ${SITE_NAME}`;

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
    const ogTitle = isHomePage 
      ? `${SITE_NAME} | ${DEFAULT_TAGLINE}`
      : `${title} | ${SITE_NAME}`;
    updateMeta('og:title', ogTitle, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', SITE_NAME, true);
    updateMeta('og:image', image || `${BASE_URL}${DEFAULT_IMAGE}`, true);
    if (url) {
      updateMeta('og:url', url, true);
    }

    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', ogTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image || `${BASE_URL}${DEFAULT_IMAGE}`);

    // Cleanup function to reset title on unmount
    return () => {
      document.title = `${SITE_NAME} | ${DEFAULT_TAGLINE}`;
    };
  }, [title, description, image, url, type]);
};

// Pre-defined SEO configs for common pages
export const SEO_CONFIGS = {
  home: {
    title: 'Home',
    description: 'Discover handcrafted pottery celebrating the Japanese philosophy of Wabi-Sabi. Each piece tells a story of intention, patience, and natural beauty.',
  },
  shop: {
    title: 'Shop',
    description: 'Browse our collection of handcrafted pottery. Each piece is unique, embracing the natural variations that make pottery an art form.',
  },
  workshops: {
    title: 'Workshops',
    description: 'Join our intimate pottery workshops and learn traditional techniques while creating your own unique pieces.',
  },
  sessions: {
    title: 'Sessions',
    description: 'Book a private pottery session for a personalized hands-on experience. Perfect for individuals, couples, or small groups.',
  },
  about: {
    title: 'About',
    description: 'Learn about Basho by Shivangi and our philosophy of finding beauty in imperfection through handcrafted pottery.',
  },
  cart: {
    title: 'Cart',
    description: 'Review the items in your cart and proceed to checkout.',
  },
  checkout: {
    title: 'Checkout',
    description: 'Complete your purchase of handcrafted pottery from Basho by Shivangi.',
  },
  activity: {
    title: 'Activity',
    description: 'View your orders, workshop bookings, and session inquiries.',
  },
  auth: {
    title: 'Sign In',
    description: 'Sign in to your account to track orders, book workshops, and more.',
  },
  custom: {
    title: 'Custom Orders',
    description: 'Request a custom handcrafted pottery piece tailored to your vision.',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    description: 'Learn how Basho by Shivangi collects, uses, and protects your personal information.',
  },
  cookiePolicy: {
    title: 'Cookie Policy',
    description: 'Understand how Basho by Shivangi uses cookies on our website.',
  },
  terms: {
    title: 'Terms of Service',
    description: 'Read the terms and conditions for using the Basho by Shivangi website and services.',
  },
  forgotPassword: {
    title: 'Forgot Password',
    description: 'Reset your password for your Basho by Shivangi account.',
  },
  resetPassword: {
    title: 'Reset Password',
    description: 'Create a new password for your Basho by Shivangi account.',
  },
  notFound: {
    title: 'Page Not Found',
    description: 'The page you are looking for does not exist.',
  },
  // Admin pages
  adminDashboard: {
    title: 'Admin Dashboard',
    description: 'Manage your Basho by Shivangi store.',
  },
  adminProducts: {
    title: 'Admin Products',
    description: 'Manage products in your Basho by Shivangi store.',
  },
  adminOrders: {
    title: 'Admin Orders',
    description: 'View and manage customer orders.',
  },
  adminWorkshops: {
    title: 'Admin Workshops',
    description: 'Manage pottery workshops and sessions.',
  },
  adminInquiries: {
    title: 'Admin Inquiries',
    description: 'View and respond to customer inquiries.',
  },
  // New pages
  testimonials: {
    title: 'Testimonials',
    description: 'Read what our customers say about their Basho by Shivangi experience.',
  },
  corporate: {
    title: 'Corporate & Collaborations',
    description: 'Partner with Basho for corporate gifting, team workshops, and brand collaborations.',
  },
  experiences: {
    title: 'Experiences',
    description: 'Book unique pottery experiences for couples, birthdays, and special occasions.',
  },
  adminTestimonials: {
    title: 'Admin Testimonials',
    description: 'Manage customer testimonials and reviews.',
  },
  adminCorporate: {
    title: 'Admin Corporate',
    description: 'View and manage corporate inquiries.',
  },
  adminExperiences: {
    title: 'Admin Experiences',
    description: 'Manage experience booking inquiries.',
  },
  // Gallery, Philosophy, Studio pages
  gallery: {
    title: 'Gallery',
    description: 'Explore our visual gallery of handcrafted pottery, workshops, and studio events.',
  },
  philosophy: {
    title: 'Our Philosophy',
    description: 'Discover the Wabi-Sabi philosophy behind Basho by Shivangi and our approach to handcrafted pottery.',
  },
  studio: {
    title: 'Visit Our Studio',
    description: 'Plan your visit to Basho studio for collections, exhibitions, and pottery experiences.',
  },
  adminGallery: {
    title: 'Admin Gallery',
    description: 'Manage gallery images and media.',
  },
  care: {
    title: 'Care & Artisanship',
    description: 'Learn about our craft process, materials, and how to care for your handmade pottery.',
  },
  exhibitions: {
    title: 'Exhibitions & Pop-ups',
    description: 'Discover upcoming exhibitions, pop-up markets, and past events featuring Basho pottery.',
  },
};

export default useSEO;
