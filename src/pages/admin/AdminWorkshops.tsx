import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

type Workshop = Tables<'workshops'>;

interface WorkshopFormData {
  title: string;
  description: string;
  date: string;
  duration_minutes: number;
  price: number;
  capacity: number;
  spots_remaining: number;
  location: string;
  image_url: string;
}

const defaultFormData: WorkshopFormData = {
  title: '',
  description: '',
  date: '',
  duration_minutes: 120,
  price: 0,
  capacity: 10,
  spots_remaining: 10,
  location: '',
  image_url: '',
};

const AdminWorkshops: React.FC = () => {
  useSEO(SEO_CONFIGS.adminWorkshops);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [deleteWorkshop, setDeleteWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState<WorkshopFormData>(defaultFormData);
  const queryClient = useQueryClient();

  const { data: workshops, isLoading } = useQuery({
    queryKey: ['admin-workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkshopFormData) => {
      const { error } = await supabase.from('workshops').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop created successfully');
      closeForm();
    },
    onError: (error) => {
      toast.error('Failed to create workshop: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: WorkshopFormData }) => {
      const { error } = await supabase.from('workshops').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop updated successfully');
      closeForm();
    },
    onError: (error) => {
      toast.error('Failed to update workshop: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('workshops').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workshops'] });
      toast.success('Workshop deleted successfully');
      setDeleteWorkshop(null);
    },
    onError: (error) => {
      toast.error('Failed to delete workshop: ' + error.message);
    },
  });

  const openCreateForm = () => {
    setEditingWorkshop(null);
    setFormData(defaultFormData);
    setIsFormOpen(true);
  };

  const openEditForm = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setFormData({
      title: workshop.title,
      description: workshop.description ?? '',
      date: workshop.date ? format(new Date(workshop.date), "yyyy-MM-dd'T'HH:mm") : '',
      duration_minutes: workshop.duration_minutes ?? 120,
      price: workshop.price,
      capacity: workshop.capacity ?? 10,
      spots_remaining: workshop.spots_remaining ?? 10,
      location: workshop.location ?? '',
      image_url: workshop.image_url ?? '',
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingWorkshop(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Workshop title is required');
      return;
    }
    if (!formData.date) {
      toast.error('Workshop date is required');
      return;
    }
    if (editingWorkshop) {
      updateMutation.mutate({ id: editingWorkshop.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Workshops</h1>
            <p className="text-muted-foreground mt-1">Manage your pottery workshops</p>
          </div>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Add Workshop
          </Button>
        </div>

        {/* Workshops Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : workshops && workshops.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {workshop.image_url ? (
                            <img
                              src={workshop.image_url}
                              alt={workshop.title}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-muted" />
                          )}
                          <div>
                            <p className="font-medium">{workshop.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {workshop.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(workshop.date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(workshop.date), 'h:mm a')} • {workshop.duration_minutes} min
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>₹{workshop.price}</TableCell>
                      <TableCell>
                        <span className={`text-sm ${
                          (workshop.spots_remaining ?? 0) <= 3 
                            ? 'text-orange-600 font-medium' 
                            : ''
                        }`}>
                          {workshop.spots_remaining}/{workshop.capacity} spots
                        </span>
                      </TableCell>
                      <TableCell>{workshop.location || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditForm(workshop)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteWorkshop(workshop)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No workshops yet</p>
                <Button onClick={openCreateForm} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Workshop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workshop Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Workshop Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter workshop title"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the workshop"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date & Time *</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="30"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => {
                      const capacity = Number(e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        capacity,
                        spots_remaining: editingWorkshop ? prev.spots_remaining : capacity
                      }));
                    }}
                  />
                </div>
                {editingWorkshop && (
                  <div>
                    <Label htmlFor="spots">Spots Remaining</Label>
                    <Input
                      id="spots"
                      type="number"
                      min="0"
                      max={formData.capacity}
                      value={formData.spots_remaining}
                      onChange={(e) => setFormData(prev => ({ ...prev, spots_remaining: Number(e.target.value) }))}
                    />
                  </div>
                )}
                <div className={editingWorkshop ? '' : 'col-span-2'}>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Workshop location"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Paste image URL"
                  />
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Workshop preview"
                      className="mt-2 h-32 w-full object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteWorkshop} onOpenChange={() => setDeleteWorkshop(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Workshop</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteWorkshop?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteWorkshop && deleteMutation.mutate(deleteWorkshop.id)}
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

export default AdminWorkshops;