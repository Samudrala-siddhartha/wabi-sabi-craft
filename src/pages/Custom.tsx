import { useState } from "react";
import { Palette, Image, Heart, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useSEO, SEO_CONFIGS } from "@/hooks/useSEO";

// Import inspiration images
import galleryBowls from "@/assets/gallery-bowls.jpg";
import galleryPlanter from "@/assets/gallery-planter.jpg";
import galleryVase from "@/assets/gallery-vase.jpg";
import galleryTeacup from "@/assets/gallery-teacup.jpg";

const productTypes = [
  "Vase",
  "Bowl",
  "Mug",
  "Plate",
  "Planter",
  "Tea Set",
  "Dinner Set",
  "Other"
];

const inspirationImages = [
  { src: galleryBowls, caption: "Organic tableware" },
  { src: galleryVase, caption: "Sculptural forms" },
  { src: galleryPlanter, caption: "Custom gifting" },
  { src: galleryTeacup, caption: "Experimental glazes" },
];

const Custom = () => {
  useSEO(SEO_CONFIGS.custom);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [productType, setProductType] = useState<string>("");
  const [textNotes, setTextNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a custom request.",
        variant: "destructive",
      });
      return;
    }

    const notes = productType ? `[${productType}] ${textNotes}` : textNotes;
    
    if (!notes.trim() && !imageFile) {
      toast({
        title: "Please add details",
        description: "Add a description or upload a reference image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('customization-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('customization-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert custom request without product_id
      const { error } = await supabase
        .from('custom_requests')
        .insert({
          user_id: user.id,
          text_notes: notes.trim() || null,
          image_url: imageUrl,
          status: 'submitted',
        });

      if (error) throw error;

      // Reset form
      setProductType("");
      setTextNotes("");
      setImageFile(null);
      setImagePreview(null);
      setShowConfirmation(true);

    } catch (error: any) {
      console.error('Error submitting custom request:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919879575601';
  };

  const features = [
    {
      icon: Palette,
      title: "Your Vision",
      description: "Describe your dream piece - size, color, style, and intended use."
    },
    {
      icon: Image,
      title: "Reference Images",
      description: "Share inspiration photos to help us understand your aesthetic."
    },
    {
      icon: Heart,
      title: "Personal Touch",
      description: "We craft each piece by hand, just for you."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Your Idea, Our Clay
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6 mt-4">
            Custom Creations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a unique vision? Let us bring it to life. From an initial sketch to the final glaze, 
            we craft one-of-a-kind ceramic pieces tailored to your needs.
          </p>
        </div>
      </section>

      {/* Story Section - How Custom Pottery is Made */}
      <section className="py-12 md:py-16 bg-[hsl(30,20%,96%)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-serif text-center text-foreground mb-8">
            How Your Custom Piece Comes to Life
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-semibold">
                1
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Share Your Vision</h3>
              <p className="text-sm text-muted-foreground">Tell us about your idea, purpose, and any reference images.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-semibold">
                2
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Design & Quote</h3>
              <p className="text-sm text-muted-foreground">We'll sketch concepts and provide a timeline and quote.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-semibold">
                3
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Handcraft & Fire</h3>
              <p className="text-sm text-muted-foreground">Your piece is shaped, dried, glazed, and kiln-fired.</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-semibold">
                4
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">Delivery</h3>
              <p className="text-sm text-muted-foreground">Carefully packaged and delivered to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 md:p-6">
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-serif text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-serif text-center text-foreground mb-8">
            Inspired by past custom creations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inspirationImages.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={item.src} 
                    alt={item.caption}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-serif text-center text-foreground mb-8">
            Describe Your Dream Piece
          </h2>

          {user ? (
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 md:p-8 rounded-lg shadow-sm">
              {/* Product Type */}
              <div className="space-y-2">
                <Label htmlFor="product-type">Product Type (optional)</Label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger id="product-type">
                    <SelectValue placeholder="Select a type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="notes">Description</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your dream piece - size, color, style, usage..."
                  value={textNotes}
                  onChange={(e) => setTextNotes(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Reference Image (optional)</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p>Click to upload JPG or PNG (max 5MB)</p>
                    </label>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || (!textNotes.trim() && !imageFile)}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          ) : (
            <div className="bg-card p-8 rounded-lg shadow-sm text-center">
              <p className="text-muted-foreground mb-4">
                Please sign in to submit a custom request.
              </p>
              <Button asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              ✅ Customization Request Submitted
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              Are you satisfied with the details you've shared?
              <br /><br />
              Our team will review your request and contact you if clarification is needed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <button
              onClick={handlePhoneCall}
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <Phone className="h-4 w-4" />
              +91 9879575601
            </button>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handlePhoneCall}
              className="w-full sm:w-auto"
            >
              Contact Us
            </Button>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="w-full sm:w-auto"
            >
              Okay, Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Custom;