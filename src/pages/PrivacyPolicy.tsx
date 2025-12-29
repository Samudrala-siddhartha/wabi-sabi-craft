import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy: React.FC = () => (
  <Layout>
    <div className="container-narrow py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  </Layout>
);

export default PrivacyPolicy;
