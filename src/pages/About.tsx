import React from 'react';
import Layout from '@/components/layout/Layout';
import founderImage from '@/assets/founder-shivangi.png';

const About: React.FC = () => (
  <Layout>
    {/* Hero Section */}
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-narrow text-center">
        <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">Our Story</span>
        <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">About Basho</h1>
      </div>
    </section>

    {/* Founder Section */}
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="aspect-[4/5] rounded-lg overflow-hidden">
            <img 
              src={founderImage} 
              alt="Shivangi crafting pottery at the wheel" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              The Artist
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4 mb-6">
              Shivangi
            </h2>
            <div className="space-y-6">
              <p className="font-body text-muted-foreground leading-relaxed text-lg">
                <span className="font-semibold text-foreground text-2xl font-display">Basho</span> is a Japanese word meaning "A Place". It is also the name of the legendary Japanese haiku poet who found profound beauty in the simplest moments of life.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed text-lg">
                At Basho by Shivangi, we create handcrafted pottery that celebrates the Japanese philosophy of <span className="italic text-foreground">Wabi-Sabi</span>—finding beauty in imperfection and embracing the natural cycle of growth and decay.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed text-lg">
                Each piece is crafted with intention, honoring traditional techniques while exploring contemporary forms. Our studio practice emphasizes mindfulness, sustainability, and the unique story each piece of pottery tells.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Philosophy Section */}
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-narrow text-center">
        <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
          Philosophy
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4 mb-8">
          The Way of Wabi-Sabi
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: 'Imperfection',
              description: 'We celebrate the cracks, asymmetries, and unique characteristics that make each piece one-of-a-kind.',
            },
            {
              title: 'Impermanence',
              description: 'Our pottery honors the transient nature of all things, creating pieces meant to be used and cherished.',
            },
            {
              title: 'Incompleteness',
              description: 'Each creation leaves space for the owner to complete its story through daily use and appreciation.',
            },
          ].map((item) => (
            <div key={item.title} className="p-8 bg-card rounded-lg shadow-soft">
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                {item.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;