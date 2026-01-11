import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

const AdminGallery: React.FC = () => {
  useSEO(SEO_CONFIGS.adminGallery);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-light text-foreground">Gallery Management</h1>
          <p className="text-muted-foreground mt-2">Manage gallery images for your website.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Gallery Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">
                Gallery Management Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                The gallery management feature is being set up. Once the database is configured, 
                you'll be able to upload, categorize, and manage gallery images here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
