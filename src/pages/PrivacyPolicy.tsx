import React from 'react';
import Layout from '@/components/layout/Layout';

const PrivacyPolicy: React.FC = () => (
  <Layout>
    <div className="container-narrow py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground space-y-8">
        <p className="text-sm">Last updated: December 2024</p>
        
        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Basho by Shivangi. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
            or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect information you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Name, email address, and phone number when you create an account</li>
            <li>Shipping address and billing information when you make a purchase</li>
            <li>Communications you send to us, such as inquiries about workshops or private sessions</li>
            <li>Workshop preferences and booking information</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Process and fulfill your orders</li>
            <li>Send order confirmations and updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Schedule and manage workshop bookings</li>
            <li>Send promotional communications (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">4. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information 
            with trusted service providers who assist us in operating our website, processing payments, and delivering 
            products to you.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of 
            transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
