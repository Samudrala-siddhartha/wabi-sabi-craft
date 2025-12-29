import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Upload, Check, X } from 'lucide-react';

// Import all product images
import bookends from '@/assets/products/bookends.png';
import bookendsNew from '@/assets/products/bookends-new.png';
import ceramicVase from '@/assets/products/ceramic-vase.png';
import ceramicVaseNew from '@/assets/products/ceramic-vase-new.png';
import chipDip from '@/assets/products/chip-dip.png';
import dinnerSet from '@/assets/products/dinner-set.png';
import dinnerSetNew from '@/assets/products/dinner-set-new.png';
import heartBowl from '@/assets/products/heart-bowl.png';
import heartBowlNew from '@/assets/products/heart-bowl-new.png';
import lipsMug from '@/assets/products/lips-mug.png';
import lipsMugNew from '@/assets/products/lips-mug-new.png';
import matchaSet from '@/assets/products/matcha-set.png';
import matchaSetNew from '@/assets/products/matcha-set-new.png';
import milkPourer from '@/assets/products/milk-pourer.png';
import milkPourerNew from '@/assets/products/milk-pourer-new.png';
import ovalTray from '@/assets/products/oval-tray.png';
import ovalTrayNew from '@/assets/products/oval-tray-new.png';
import stripedMugSet from '@/assets/products/striped-mug-set.png';
import stripedMug from '@/assets/products/striped-mug.png';
import teaPotSet from '@/assets/products/tea-pot-set.png';
import teaPotSetNew from '@/assets/products/tea-pot-set-new.png';
import wavyPlates from '@/assets/products/wavy-plates.png';
import wavyPlatesNew from '@/assets/products/wavy-plates-new.png';

interface ImageUpload {
  name: string;
  fileName: string;
  localPath: string;
  productName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  publicUrl?: string;
}

const imageList: Omit<ImageUpload, 'status'>[] = [
  { name: 'Bookends', fileName: 'bookends-new.png', localPath: bookendsNew, productName: 'Ceramic Bookends' },
  { name: 'Ceramic Vase', fileName: 'ceramic-vase-new.png', localPath: ceramicVaseNew, productName: 'Ceramic Vase' },
  { name: 'Chip & Dip', fileName: 'chip-dip.png', localPath: chipDip, productName: 'Chip & Dip Platter' },
  { name: 'Dinner Set', fileName: 'dinner-set-new.png', localPath: dinnerSetNew, productName: 'Complete Dinner Set' },
  { name: 'Heart Bowl', fileName: 'heart-bowl-new.png', localPath: heartBowlNew, productName: 'Heart Bowl' },
  { name: 'Lips Mug', fileName: 'lips-mug-new.png', localPath: lipsMugNew, productName: 'Lips Mug' },
  { name: 'Matcha Set', fileName: 'matcha-set-new.png', localPath: matchaSetNew, productName: 'Matcha Set' },
  { name: 'Milk Pourer', fileName: 'milk-pourer-new.png', localPath: milkPourerNew, productName: 'Milk Pourer' },
  { name: 'Oval Tray', fileName: 'oval-tray-new.png', localPath: ovalTrayNew, productName: 'Oval Tray' },
  { name: 'Striped Mug Set', fileName: 'striped-mug-set.png', localPath: stripedMugSet, productName: 'Striped Coffee Mug Set' },
  { name: 'Striped Mug', fileName: 'striped-mug.png', localPath: stripedMug, productName: 'Striped Mug' },
  { name: 'Tea Pot Set', fileName: 'tea-pot-set-new.png', localPath: teaPotSetNew, productName: 'Tea Pot Set' },
  { name: 'Wavy Plates', fileName: 'wavy-plates-new.png', localPath: wavyPlatesNew, productName: 'Wavy Plates' },
];

const UploadProductImages: React.FC = () => {
  const [uploads, setUploads] = useState<ImageUpload[]>(
    imageList.map(img => ({ ...img, status: 'pending' as const }))
  );
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (upload: ImageUpload, index: number) => {
    setUploads(prev => prev.map((u, i) => i === index ? { ...u, status: 'uploading' } : u));

    try {
      // Fetch the image from the local path (Vite serves it)
      const response = await fetch(upload.localPath);
      const blob = await response.blob();

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(upload.fileName, blob, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(upload.fileName);

      // Update the product in the database
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: [publicUrl] })
        .eq('name', upload.productName);

      if (updateError) {
        console.warn(`Product "${upload.productName}" not found or update failed:`, updateError);
      }

      setUploads(prev => prev.map((u, i) => 
        i === index ? { ...u, status: 'success', publicUrl } : u
      ));

      return true;
    } catch (error: any) {
      console.error(`Failed to upload ${upload.name}:`, error);
      setUploads(prev => prev.map((u, i) => i === index ? { ...u, status: 'error' } : u));
      return false;
    }
  };

  const uploadAll = async () => {
    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].status !== 'success') {
        const success = await uploadImage(uploads[i], i);
        if (success) successCount++;
      }
    }

    setIsUploading(false);
    toast.success(`Uploaded ${successCount} of ${uploads.length} images`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Upload Product Images</h1>
            <p className="text-muted-foreground mt-1">Upload generated images to storage and update products</p>
          </div>
          <Button onClick={uploadAll} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload All
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploads.map((upload, index) => (
            <Card key={upload.fileName}>
              <CardContent className="p-4">
                <div className="relative aspect-square mb-3">
                  <img
                    src={upload.localPath}
                    alt={upload.name}
                    className="w-full h-full object-cover rounded"
                  />
                  {upload.status === 'uploading' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  {upload.status === 'success' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  {upload.status === 'error' && (
                    <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full">
                      <X className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm truncate">{upload.name}</p>
                <p className="text-xs text-muted-foreground truncate">{upload.productName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UploadProductImages;
