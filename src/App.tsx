import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Workshops from "./pages/Workshops";
import WorkshopDetail from "./pages/WorkshopDetail";
import Sessions from "./pages/Sessions";
import Custom from "./pages/Custom";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Activity from "./pages/Activity";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
// New public pages
import Testimonials from "./pages/Testimonials";
import Corporate from "./pages/Corporate";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import Philosophy from "./pages/Philosophy";
import Studio from "./pages/Studio";
import Gallery from "./pages/Gallery";
import Care from "./pages/Care";
import Exhibitions from "./pages/Exhibitions";
// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminWorkshops from "./pages/admin/AdminWorkshops";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInquiries from "./pages/admin/AdminInquiries";
import UploadProductImages from "./pages/admin/UploadProductImages";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminCorporate from "./pages/admin/AdminCorporate";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminGallery from "./pages/admin/AdminGallery";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/workshops/:id" element={<WorkshopDetail />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/custom" element={<Custom />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/terms" element={<Terms />} />
                {/* New Public Routes */}
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/corporate" element={<Corporate />} />
                <Route path="/experiences" element={<Experiences />} />
                <Route path="/experiences/:type" element={<ExperienceDetail />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/care" element={<Care />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/workshops" element={<AdminWorkshops />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/inquiries" element={<AdminInquiries />} />
                <Route path="/admin/upload-images" element={<UploadProductImages />} />
                <Route path="/admin/testimonials" element={<AdminTestimonials />} />
                <Route path="/admin/corporate" element={<AdminCorporate />} />
                <Route path="/admin/experiences" element={<AdminExperiences />} />
                <Route path="/admin/gallery" element={<AdminGallery />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
