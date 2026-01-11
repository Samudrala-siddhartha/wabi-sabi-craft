import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import bashoLogo from '@/assets/basho-logo-new.jpg';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const mainNavLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/workshops', label: 'Workshops' },
    { href: '/experiences', label: 'Experiences' },
    { href: '/corporate', label: 'Corporate' },
  ];

  const moreLinks = [
    { href: '/sessions', label: 'Private Sessions' },
    { href: '/custom', label: 'Custom Orders' },
    { href: '/studio', label: 'Visit Studio' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/philosophy', label: 'Philosophy' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={bashoLogo} 
              alt="Basho by Shivangi" 
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            
            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="font-body text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide flex items-center gap-1">
                  More
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} onClick={() => navigate(link.href)}>
                    {link.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card">
                  <DropdownMenuItem onClick={() => navigate('/activity')}>
                    My Activity
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="font-body"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              {[...mainNavLinks, ...moreLinks].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-body text-base font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
