import React from 'react';
import Layout from '@/components/layout/Layout';

const About: React.FC = () => (
  <Layout>
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-narrow text-center">
        <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">Our Story</span>
        <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">About Basho</h1>
      </div>
    </section>
    <section className="py-16 md:py-24">
      <div className="container-narrow">
        <div className="prose prose-lg max-w-none">
          <p className="font-body text-muted-foreground leading-relaxed text-lg">
            Basho is a celebration of the Japanese philosophy of Wabi-Sabi—finding beauty in imperfection and embracing the natural cycle of growth and decay. Each piece in our collection is handcrafted with intention, honoring traditional techniques while exploring contemporary forms.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed text-lg mt-6">
            Founded by Shivangi, a ceramic artist with over a decade of experience, Basho emerged from a deep appreciation for the meditative qualities of working with clay. Our studio practice emphasizes mindfulness, sustainability, and the unique story each piece of pottery tells.
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
