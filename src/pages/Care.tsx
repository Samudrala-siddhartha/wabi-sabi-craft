import React from 'react';
import { Leaf, Shield, Sparkles, Heart, Flame, Droplets, Sun, Hand } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import useSEO, { SEO_CONFIGS } from '@/hooks/useSEO';

const Care: React.FC = () => {
  useSEO({
    title: 'Care & Artisanship',
    description: 'Learn about our craft process, materials, and how to care for your handmade pottery to ensure it lasts a lifetime.',
  });

  const craftSteps = [
    {
      icon: Hand,
      title: 'Clay Selection',
      description: 'We begin with carefully sourced stoneware clay, chosen for its durability and beautiful firing characteristics.',
    },
    {
      icon: Sparkles,
      title: 'Hand Shaping',
      description: 'Each piece is shaped by hand on the potter\'s wheel or through hand-building techniques, ensuring unique character.',
    },
    {
      icon: Sun,
      title: 'Slow Drying',
      description: 'Pieces dry slowly over several days to prevent cracking and ensure structural integrity.',
    },
    {
      icon: Flame,
      title: 'Kiln Firing',
      description: 'First bisque fired at 1000°C, then glazed and high-fired at 1280°C for strength and vitrification.',
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Artisanship & After-Care
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Handmade with Love
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Every piece is thoughtfully handcrafted, making it one-of-a-kind — just like you.
          </p>
        </div>
      </section>

      {/* Craft Process */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Our Process
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
              From Clay to Creation
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {craftSteps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="font-display text-sm text-muted-foreground mb-2">Step {index + 1}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Instructions */}
      <section className="py-16 md:py-24 bg-[hsl(30,30%,95%)]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Care Instructions
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
              Caring for Your Pottery
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Tableware */}
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground">For Tableware</h3>
              </div>
              <ul className="space-y-3 font-body text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Food safe</strong> — all glazes are non-toxic</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Lead free</strong> — no harmful materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <Flame className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Microwave and oven friendly</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Droplets className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong className="text-foreground">Dishwasher friendly</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Handwash gently with soap or detergent to extend its longevity</span>
                </li>
              </ul>
            </div>

            {/* Lights & Artifacts */}
            <div className="bg-card rounded-lg border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground">For Lights & Artifacts</h3>
              </div>
              <ul className="space-y-3 font-body text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Leaf className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Clean with a damp cloth followed by a dry cloth</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sun className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Keep away from direct prolonged sunlight to preserve glaze colors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Hand className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Handle with care — each piece is unique and irreplaceable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Handmade Note */}
      <section className="py-16 md:py-24">
        <div className="container-narrow text-center">
          <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-6">
            <Heart className="h-6 w-6 text-primary inline-block mr-2" />
            <span className="font-display text-lg text-primary">Handmade with Love</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-6">
            Embrace the Unique
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            All our products are handmade with love and care. Each piece has its own unique individuality. 
            No two pieces are identical — and that's the beauty of handcrafted pottery. 
            Natural variations in glaze, texture, and form are not defects but signatures of authentic craftsmanship.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Care;
