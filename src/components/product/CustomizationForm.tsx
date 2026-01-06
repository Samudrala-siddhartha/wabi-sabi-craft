import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CustomizationFormProps {
  productId: string;
  productName: string;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ productId, productName }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [textNotes, setTextNotes] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Please upload a JPG or PNG image');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      // Store intended action and redirect to auth
      sessionStorage.setItem('customization_redirect', window.location.pathname);
      navigate('/auth');
      return;
    }

    if (!textNotes.trim() && !imageFile) {
      toast.error('Please provide notes or upload a reference image');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${productId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('customization-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('customization-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert custom request
      const { error: insertError } = await supabase
        .from('custom_requests')
        .insert({
          user_id: user.id,
          product_id: productId,
          text_notes: textNotes.trim() || null,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      // Show confirmation popup
      setShowConfirmation(true);
      
      // Reset form
      setTextNotes('');
      removeImage();
      setShowForm(false);

    } catch (error: any) {
      console.error('Error submitting customization:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+919879575601';
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-center gap-3">
        <Checkbox
          id="customize"
          checked={showForm}
          onCheckedChange={(checked) => setShowForm(checked === true)}
        />
        <Label htmlFor="customize" className="font-display text-lg cursor-pointer">
          I want to customize this product
        </Label>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <Label htmlFor="notes" className="font-body text-sm text-foreground mb-2 block">
              Customization Notes
            </Label>
            <Textarea
              id="notes"
              value={textNotes}
              onChange={(e) => setTextNotes(e.target.value)}
              placeholder="Describe size, color, usage, or any special request…"
              className="min-h-[120px] font-body"
              maxLength={1000}
            />
          </div>

          <div>
            <Label className="font-body text-sm text-foreground mb-2 block">
              Reference Image (optional)
            </Label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Reference"
                  className="w-32 h-32 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="font-body text-sm text-muted-foreground">
                  JPG or PNG, max 5MB
                </span>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || (!textNotes.trim() && !imageFile)}
            className="w-full font-body"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Customization Request'}
          </Button>
        </form>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              ✅ Customization Request Submitted
            </DialogTitle>
            <DialogDescription className="font-body text-base pt-4 space-y-4">
              <p>
                Are you satisfied with the details you've shared?
                Our team will review your request and contact you if clarification is needed.
              </p>
              <a
                href="tel:+919879575601"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                +91 9879575601
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 font-body"
            >
              Okay, Got It
            </Button>
            <Button
              variant="outline"
              onClick={handlePhoneCall}
              className="flex-1 font-body"
            >
              Contact Us
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomizationForm;
