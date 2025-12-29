import React from 'react';
import Layout from '@/components/layout/Layout';

const CookiePolicy: React.FC = () => (
  <Layout>
    <div className="container-narrow py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-8">Cookie Policy</h1>
      <div className="prose prose-lg max-w-none font-body text-muted-foreground space-y-8">
        <p className="text-sm">Last updated: December 2024</p>
        
        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit our website. They help us 
            provide you with a better experience by remembering your preferences and understanding how you use our site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">2. Types of Cookies We Use</h2>
          
          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They enable core features like 
            shopping cart functionality, user authentication, and secure checkout. You cannot opt out of these cookies.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Functional Cookies</h3>
          <p>
            These cookies remember your preferences and choices, such as language settings and recently viewed products. 
            They enhance your browsing experience but are not essential for the website to work.
          </p>

          <h3 className="font-display text-xl text-foreground mt-6 mb-3">Analytics Cookies</h3>
          <p>
            We use analytics cookies to understand how visitors interact with our website. This helps us improve 
            our website design and content. All data collected is anonymous and aggregated.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">3. Third-Party Cookies</h2>
          <p>
            We use payment processing services (Razorpay) that may set their own cookies during the checkout process. 
            These cookies are essential for secure payment processing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">4. Managing Cookies</h2>
          <p>
            You can control and delete cookies through your browser settings. However, disabling certain cookies 
            may affect the functionality of our website, including the ability to make purchases.
          </p>
          <p className="mt-4">
            Most browsers allow you to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>View the cookies stored on your device</li>
            <li>Delete all or specific cookies</li>
            <li>Block cookies from being set</li>
            <li>Set preferences for certain websites</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">5. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an 
            updated revision date.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-foreground mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Basho by Shivangi</strong><br />
            Phone: +91 9879575601<br />
            Instagram: @bashobyyshivangi
          </p>
        </section>
      </div>
    </div>
  </Layout>
);

export default CookiePolicy;
