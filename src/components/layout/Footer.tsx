import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-foreground">
                Basho
              </span>
              <span className="font-display text-sm text-muted-foreground ml-2">
                by Shivangi
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground font-body text-sm max-w-sm leading-relaxed">
              Handcrafted pottery inspired by the Japanese philosophy of Wabi-Sabi. 
              Each piece embraces imperfection and celebrates the beauty of natural forms.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/shop" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link 
                  to="/workshops" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link 
                  to="/sessions" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Private Sessions
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookie-policy" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-muted-foreground hover:text-primary transition-colors font-body text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground font-body text-sm">
            © {currentYear} Basho by Shivangi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
