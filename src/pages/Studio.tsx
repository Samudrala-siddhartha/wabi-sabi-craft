import React from 'react';
import { MapPin, Clock, Phone, Mail, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import useSEO, { SEO_CONFIGS } from '@/hooks/useSEO';
import { Link } from 'react-router-dom';

const Studio: React.FC = () => {
  useSEO(SEO_CONFIGS.studio);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Our Space
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Visit the Studio
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Step into our creative sanctuary and experience pottery up close.
          </p>
        </div>
      </section>

      {/* Studio Info */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-3xl text-foreground mb-4">
                  Welcome to Basho Studio
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Our studio is a peaceful haven where clay transforms into functional art. Whether you're here to browse our collection, attend a workshop, or simply soak in the creative atmosphere, we'd love to have you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-body font-medium text-foreground">Location</h3>
                    <p className="font-body text-muted-foreground">
                      Basho by Shivangi Studio<br />
                      Sector 15, Gurugram<br />
                      Haryana 122001, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-body font-medium text-foreground">Studio Hours</h3>
                    <p className="font-body text-muted-foreground">
                      Tuesday – Saturday: 10:00 AM – 6:00 PM<br />
                      Sunday: 11:00 AM – 4:00 PM<br />
                      Monday: Closed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-body font-medium text-foreground">Phone</h3>
                    <p className="font-body text-muted-foreground">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-body font-medium text-foreground">Email</h3>
                    <p className="font-body text-muted-foreground">
                      hello@bashobyshivangi.com
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/workshops">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Workshop
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/experiences">
                    Explore Experiences
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-6">
              <div className="aspect-square md:aspect-[4/3] rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.0517786064776!2d77.03891451507693!3d28.47022268247962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d4c7e3c4c3%3A0x8b1c7c7c7c7c7c7c!2sSector%2015%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Basho Studio Location"
                />
              </div>
              <p className="font-body text-sm text-muted-foreground text-center">
                Free parking available. Metro: Sector 15 (Yellow Line)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Policies */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-foreground text-center mb-12">
            Studio Policies
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-3">Walk-ins Welcome</h3>
              <p className="font-body text-muted-foreground">
                Feel free to drop by during studio hours to browse our collection. For workshops and experiences, advance booking is recommended.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-3">Order Collection</h3>
              <p className="font-body text-muted-foreground">
                Online orders can be collected from the studio. Please bring your order confirmation and ID. Collection hours align with studio hours.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-3">Photography</h3>
              <p className="font-body text-muted-foreground">
                Personal photography is welcome in the showroom area. Please ask before photographing works-in-progress or the pottery wheel area.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Care Section */}
      <section className="py-16 md:py-24">
        <div className="container-narrow">
          <h2 className="font-display text-3xl text-foreground text-center mb-12">
            Artisanship & After-Care
          </h2>
          
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-xl text-foreground mb-3">Our Craft Process</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Each piece begins as raw clay, carefully wedged to remove air bubbles. It's then shaped on the wheel or by hand, left to dry slowly, bisque fired at 1000°C, glazed with our signature finishes, and finally high-fired at 1280°C for strength and durability.
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl text-foreground mb-3">Materials & Safety</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                We use food-safe, lead-free glazes on all our tableware. Our stoneware is microwave-safe and dishwasher-safe. Pieces with metallic or specialized glazes may have specific care requirements noted on their product pages.
              </p>
            </div>

            <div>
              <h3 className="font-display text-xl text-foreground mb-3">Care & Longevity</h3>
              <ul className="font-body text-muted-foreground leading-relaxed space-y-2">
                <li>• Avoid extreme temperature changes — don't put a cold piece directly into a hot oven</li>
                <li>• Hand wash is recommended for pieces with delicate glazes</li>
                <li>• Use soft sponges to avoid scratching the glaze</li>
                <li>• Store carefully to prevent chipping — use felt dividers if stacking</li>
                <li>• With proper care, your pottery will last a lifetime and beyond</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Studio;
