import React from 'react';
import Layout from '@/components/layout/Layout';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

const Terms: React.FC = () => {
  useSEO(SEO_CONFIGS.terms);
  
  return (
    <Layout>
      <div className="container-narrow py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Terms & Conditions</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground space-y-8">
        <p className="text-sm">Last updated: December 2024</p>
        
        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing and using the Basho by Shivangi website, you agree to be bound by these Terms and Conditions. 
            If you do not agree with any part of these terms, please do not use our website.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">2. Products</h2>
          <p>
            All our pottery pieces are handcrafted, which means each item is unique. Slight variations in color, 
            texture, shape, and size are inherent characteristics of handmade ceramics and are not considered defects. 
            These variations are part of the Wabi-Sabi philosophy we embrace—finding beauty in imperfection.
          </p>
          <p className="mt-4">
            Product images are representative. Actual products may vary slightly from photographs due to the 
            handmade nature of our work and screen display variations.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">3. Pricing</h2>
          <p>
            All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to 
            change prices at any time without prior notice. The price applicable to your order is the price 
            displayed at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">4. Orders & Payment</h2>
          <p>
            Orders are processed after successful payment. We accept payments through Razorpay, which supports 
            credit/debit cards, UPI, net banking, and digital wallets.
          </p>
          <p className="mt-4">
            We reserve the right to refuse or cancel any order for reasons including but not limited to: 
            product availability, errors in pricing, or suspected fraudulent activity.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">5. Shipping & Delivery</h2>
          <p>
            We ship across India. Delivery times vary based on location and typically range from 5-10 business days. 
            International shipping may be available upon request.
          </p>
          <p className="mt-4">
            All items are carefully packaged to ensure safe delivery. However, we are not responsible for delays 
            caused by shipping carriers or customs clearance.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">6. Workshop Policies</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Workshop bookings are non-transferable</li>
            <li>Cancellations must be made at least 48 hours in advance for a full refund</li>
            <li>No-shows forfeit the booking amount</li>
            <li>We reserve the right to reschedule workshops due to unforeseen circumstances</li>
            <li>Participants must be 12 years or older unless otherwise specified</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">7. Private Sessions</h2>
          <p>
            Private session inquiries are subject to availability. Pricing and scheduling will be communicated 
            upon inquiry. A deposit may be required to confirm bookings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">8. Returns & Refunds</h2>
          <p>
            Due to the handmade nature of our products, we do not accept returns for change of mind. However, 
            if you receive a damaged item, please contact us within 48 hours of delivery with photographs, 
            and we will arrange a replacement or refund.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">9. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, designs, and logos, is the property of 
            Basho by Shivangi and is protected by copyright laws. Unauthorized use is prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">10. Contact Information</h2>
          <p>
            For questions about these Terms & Conditions, please contact us:
          </p>
          <p className="mt-4">
            <strong>Basho by Shivangi</strong><br />
            311, Silent Zone, Gavier<br />
            Dumas Road, Surat – 395007<br />
            Gujarat, India<br />
            Phone: <a href="tel:+919879575601" className="text-primary hover:underline">+91 9879575601</a><br />
            Instagram: <a href="https://www.instagram.com/bashobyyshivangi/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@bashobyyshivangi</a>
          </p>
        </section>
      </div>
      </div>
    </Layout>
  );
};

export default Terms;
