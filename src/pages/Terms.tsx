import React from 'react';
import Layout from '@/components/layout/Layout';

const Terms: React.FC = () => (
  <Layout>
    <div className="container-narrow py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Terms & Conditions</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Agreement to Terms</h2>
        <p>By accessing our website, you agree to be bound by these terms and conditions.</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Products and Services</h2>
        <p>All products are handcrafted and may have slight variations. This is part of their unique character.</p>
        <h2 className="font-display text-2xl text-foreground mt-8 mb-4">Workshop Policies</h2>
        <p>Workshop bookings are subject to availability. Cancellations must be made at least 48 hours in advance.</p>
      </div>
    </div>
  </Layout>
);

export default Terms;
