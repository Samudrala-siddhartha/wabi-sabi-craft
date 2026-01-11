import React from 'react';
import Layout from '@/components/layout/Layout';
import useSEO, { SEO_CONFIGS } from '@/hooks/useSEO';

const Philosophy: React.FC = () => {
  useSEO(SEO_CONFIGS.philosophy);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Our Craft
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Philosophy
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            The guiding principles behind every piece we create.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <div className="space-y-16">
            {/* Wabi-Sabi */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Embracing Wabi-Sabi
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
                At Basho, we draw deep inspiration from the Japanese philosophy of wabi-sabi — the art of finding beauty in imperfection and accepting the natural cycle of growth and decay. Each piece we create carries subtle variations, gentle asymmetries, and unique characteristics that celebrate the handmade nature of our craft.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                These "imperfections" are not flaws; they are the soul of the piece, telling the story of the clay, the hands that shaped it, and the fire that transformed it.
              </p>
            </div>

            {/* Slow Craft */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                The Slow Craft Movement
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
                In a world of mass production and instant gratification, we choose a different path. Each piece at Basho is made slowly, deliberately, with full attention and care. From wedging the clay to glazing and firing, every step is performed by hand with intention.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                This slow approach isn't just about the end product — it's about honoring the process, the material, and the tradition of pottery that spans thousands of years.
              </p>
            </div>

            {/* Minimalism */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Mindful Minimalism
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
                Our designs embrace simplicity without sacrificing warmth. We believe that the objects we use daily should bring calm and joy, not visual noise. Clean lines, muted earth tones, and functional forms define our aesthetic.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Every piece is designed to serve a purpose while becoming a quiet companion in your daily rituals — morning tea, a simple meal, or a moment of pause.
              </p>
            </div>

            {/* Sustainability */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Earth-Conscious Creation
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
                Clay is one of Earth's most ancient and renewable materials. We source our clay responsibly and work with natural, non-toxic glazes whenever possible. Our studio practices prioritize minimal waste — clay scraps are recycled, and we're constantly exploring more sustainable firing methods.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                When you choose a Basho piece, you're choosing an object that can last generations, reducing the need for disposable alternatives.
              </p>
            </div>

            {/* Connection */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
                Creating Connection
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
                Beyond making objects, we aim to create connections — between the maker and the user, between the material and the moment, between tradition and contemporary life.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Through our workshops and studio experiences, we invite you to feel the clay between your fingers, to understand the patience pottery requires, and to discover your own creative voice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-narrow text-center">
          <blockquote className="font-display text-2xl md:text-3xl text-foreground italic leading-relaxed">
            "In every piece of clay, there is a story waiting to be told. Our hands simply help it find its form."
          </blockquote>
          <p className="font-body text-muted-foreground mt-6">— Shivangi, Founder of Basho</p>
        </div>
      </section>
    </Layout>
  );
};

export default Philosophy;
