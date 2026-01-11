import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Eye, EyeOff, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
}

interface FormData {
  image_url: string;
  title: string;
  category: string;
  is_published: boolean;
}

const categories = [
  { value: 'products', label: 'Products' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'studio', label: 'Studio & Events' },
];

const AdminGallery: React.FC = () => {
  useSEO(SEO_CONFIGS.adminGallery);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    image_url: '',
    title: '',
    category: 'products',
    is_published: true,
  });

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['admin-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase.from('gallery_images').insert([{
        image_url: data.image_url,
        title: data.title || null,
        category: data.category,
        is_published: data.is_published,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Image added to gallery');
      closeForm();
    },
    onError: (error) => {
      toast.error('Failed to add image: ' + error.message);
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Visibility updated');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Image removed from gallery');
      setDeleteImage(null);
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });

  const closeForm = () => {
    setIsFormOpen(false);
    setFormData({
      image_url: '',
      title: '',
      category: 'products',
      is_published: true,
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded');
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      toast.error('Please add an image');
      return;
    }
    createMutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">Gallery</h1>
            <p className="text-muted-foreground mt-1">Manage gallery images</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No gallery images yet</p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border"
              >
                <img
                  src={image.image_url}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  <span className="text-white text-xs bg-black/50 px-2 py-1 rounded capitalize">
                    {image.category}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => togglePublishMutation.mutate({ 
                        id: image.id, 
                        is_published: !image.is_published 
                      })}
                    >
                      {image.is_published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeleteImage(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status badge */}
                {!image.is_published && (
                  <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                    Hidden
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Image Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Image</Label>
                <div className="mt-1 space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Or paste image URL"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Image title"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Adding...' : 'Add Image'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteImage} onOpenChange={() => setDeleteImage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the image from the gallery. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteImage && deleteMutation.mutate(deleteImage.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
