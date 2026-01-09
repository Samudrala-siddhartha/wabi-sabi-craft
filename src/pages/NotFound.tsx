import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useSEO, SEO_CONFIGS } from "@/hooks/useSEO";

const NotFound = () => {
  const location = useLocation();
  useSEO(SEO_CONFIGS.notFound);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="font-display text-6xl md:text-7xl font-light text-foreground mb-4">
            404
          </h1>
          
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          
          <p className="font-body text-muted-foreground text-lg mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-body">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-body">
              <Link to="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Shop
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
