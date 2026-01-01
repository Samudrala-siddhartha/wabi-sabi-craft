import React from 'react';
import Layout from '@/components/layout/Layout';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';
import founderImage from '@/assets/founder-shivangi.png';
import galleryTeacup from '@/assets/gallery-teacup.jpg';
import galleryVase from '@/assets/gallery-vase.jpg';
import galleryPlate from '@/assets/gallery-plate.jpg';
import galleryBowls from '@/assets/gallery-bowls.jpg';
import galleryPlanter from '@/assets/gallery-planter.jpg';
import galleryWheel from '@/assets/gallery-wheel.jpg';

const galleryImages = [
  { src: galleryTeacup, alt: 'Handcrafted ceramic tea cup with wabi-sabi aesthetic' },
  { src: galleryVase, alt: 'Organic shaped ceramic vase with terracotta glaze' },
  { src: galleryPlate, alt: 'Artisan dinner plate with natural glaze variations' },
  { src: galleryBowls, alt: 'Stack of handmade ceramic bowls' },
  { src: galleryPlanter, alt: 'Ceramic planter with succulent' },
  { src: galleryWheel, alt: 'Pottery wheel with clay being shaped' },
];

const studioAddress = {
  line1: '311, Silent Zone, Gavier',
  line2: 'Dumas Road',
  city: 'Surat – 395007',
  state: 'Gujarat, India',
  phone: '+91 9879575601',
  hours: 'By appointment only',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=311+Silent+Zone+Gavier+Dumas+Road+Surat+395007',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.1234567890123!2d72.7654321!3d21.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA3JzMwLjQiTiA3MsKwNDUnNTUuNiJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
};

const About: React.FC = () => {
  useSEO(SEO_CONFIGS.about);
  
  return (
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

    {/* Gallery Section */}
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Our Creations
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
            Studio Gallery
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Studio Location Section */}
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Visit Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
            Our Studio
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Map */}
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.5!2d72.765!3d21.123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDumas%20Road%2C%20Surat!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Basho Studio Location"
              className="w-full h-full"
            />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">Address</h3>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {studioAddress.line1}<br />
                    {studioAddress.line2}<br />
                    {studioAddress.city}<br />
                    {studioAddress.state}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">Phone</h3>
                  <a 
                    href={`tel:${studioAddress.phone}`}
                    className="font-body text-muted-foreground hover:text-primary transition-colors"
                  >
                    {studioAddress.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">Hours</h3>
                  <p className="font-body text-muted-foreground">
                    {studioAddress.hours}
                  </p>
                </div>
              </div>

              <Button 
                asChild 
                className="w-full sm:w-auto mt-4"
              >
                <a 
                  href={studioAddress.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
  );
};

export default About;
