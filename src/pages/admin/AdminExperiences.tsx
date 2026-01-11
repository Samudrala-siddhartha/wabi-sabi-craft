import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Cake, Leaf, Palette, Eye, Mail, Phone, Calendar, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

interface ExperienceInquiry {
  id: string;
  experience_id: string | null;
  experience_type: string;
  preferred_date: string | null;
  group_size: number;
  notes: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
}

const experienceIcons: Record<string, React.ElementType> = {
  couple: Heart,
  birthday: Cake,
  farm_garden: Leaf,
  studio: Palette,
};

const experienceLabels: Record<string, string> = {
  couple: 'Couple Session',
  birthday: 'Birthday Celebration',
  farm_garden: 'Farm & Garden',
  studio: 'Studio Experience',
};

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  scheduled: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminExperiences: React.FC = () => {
  useSEO(SEO_CONFIGS.adminExperiences);
  const [selectedInquiry, setSelectedInquiry] = useState<ExperienceInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<'pending' | 'contacted' | 'scheduled' | 'cancelled'>('pending');
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-experience-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experience_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ExperienceInquiry[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes: string }) => {
      const { error } = await supabase
        .from('experience_inquiries')
        .update({ status, admin_notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experience-inquiries'] });
      toast.success('Inquiry updated successfully');
      setSelectedInquiry(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const openDetail = (inquiry: ExperienceInquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes || '');
    setStatus(inquiry.status);
  };

  const handleUpdate = () => {
    if (!selectedInquiry) return;
    updateMutation.mutate({
      id: selectedInquiry.id,
      status,
      admin_notes: adminNotes,
    });
  };

  const pendingCount = inquiries?.filter(i => i.status === 'pending').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Experience Inquiries</h1>
            <p className="text-muted-foreground mt-1">
              Manage booking requests for experiences
              {pendingCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingCount} pending
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : inquiries && inquiries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Experience</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => {
                    const Icon = experienceIcons[inquiry.experience_type] || Palette;
                    return (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-primary" />
                            <span>{experienceLabels[inquiry.experience_type] || inquiry.experience_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{inquiry.contact_name}</p>
                            <p className="text-sm text-muted-foreground">{inquiry.contact_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {inquiry.preferred_date 
                            ? format(new Date(inquiry.preferred_date), 'MMM d, yyyy')
                            : <span className="text-muted-foreground">Flexible</span>
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {inquiry.group_size}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[inquiry.status]}>
                            {inquiry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openDetail(inquiry)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No experience inquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Experience Inquiry Details</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Experience Type</Label>
                    <div className="flex items-center gap-2 mt-1">
                      {(() => {
                        const Icon = experienceIcons[selectedInquiry.experience_type] || Palette;
                        return <Icon className="h-5 w-5 text-primary" />;
                      })()}
                      <span className="font-medium">
                        {experienceLabels[selectedInquiry.experience_type] || selectedInquiry.experience_type}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Group Size</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{selectedInquiry.group_size} people</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Name</Label>
                    <p className="font-medium">{selectedInquiry.contact_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Preferred Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedInquiry.preferred_date 
                          ? format(new Date(selectedInquiry.preferred_date), 'MMMM d, yyyy')
                          : 'Flexible'
                        }
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <a href={`mailto:${selectedInquiry.contact_email}`} className="text-primary hover:underline flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedInquiry.contact_email}
                    </a>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <a href={`tel:${selectedInquiry.contact_phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedInquiry.contact_phone}
                    </a>
                  </div>
                </div>

                {selectedInquiry.notes && (
                  <div>
                    <Label className="text-muted-foreground">Additional Notes</Label>
                    <p className="mt-1 p-3 bg-secondary/50 rounded-lg whitespace-pre-wrap">
                      {selectedInquiry.notes}
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(v: 'pending' | 'contacted' | 'scheduled' | 'cancelled') => setStatus(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="admin_notes">Admin Notes</Label>
                    <Textarea
                      id="admin_notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Internal notes about this inquiry..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setSelectedInquiry(null)}>
                    Close
                  </Button>
                  <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminExperiences;
