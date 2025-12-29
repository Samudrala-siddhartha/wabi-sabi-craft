import React from 'react';
import Layout from '@/components/layout/Layout';

const CookiePolicy: React.FC = () => (
  <Layout>
    <div className="container-narrow py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Cookie Policy</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">What Are Cookies</h2>
        <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience.</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">How We Use Cookies</h2>
        <p>We use cookies to remember your preferences, understand how you use our site, and improve our services.</p>
      </div>
    </div>
  </Layout>
);

export default CookiePolicy;
