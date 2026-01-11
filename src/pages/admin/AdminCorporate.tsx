import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Mail, Phone, Eye } from 'lucide-react';
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

interface CorporateInquiry {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  inquiry_type: 'gifting' | 'workshop' | 'collaboration';
  message: string;
  reference_file_url: string | null;
  status: 'new' | 'contacted' | 'closed';
  admin_notes: string | null;
  created_at: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800',
};

const typeLabels = {
  gifting: 'Corporate Gifting',
  workshop: 'Team Workshop',
  collaboration: 'Brand Collaboration',
};

const AdminCorporate: React.FC = () => {
  useSEO(SEO_CONFIGS.adminCorporate);
  const [selectedInquiry, setSelectedInquiry] = useState<CorporateInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [status, setStatus] = useState<'new' | 'contacted' | 'closed'>('new');
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-corporate-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('corporate_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CorporateInquiry[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status: string; admin_notes: string }) => {
      const { error } = await supabase
        .from('corporate_inquiries')
        .update({ status, admin_notes })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-corporate-inquiries'] });
      toast.success('Inquiry updated successfully');
      setSelectedInquiry(null);
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const openDetail = (inquiry: CorporateInquiry) => {
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

  const newCount = inquiries?.filter(i => i.status === 'new').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Corporate Inquiries</h1>
            <p className="text-muted-foreground mt-1">
              Manage corporate gifting, workshop, and collaboration requests
              {newCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {newCount} new
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
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{inquiry.company_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{inquiry.contact_person}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{typeLabels[inquiry.inquiry_type]}</span>
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
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No corporate inquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Corporate Inquiry Details</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Company</Label>
                    <p className="font-medium">{selectedInquiry.company_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Contact Person</Label>
                    <p className="font-medium">{selectedInquiry.contact_person}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Inquiry Type</Label>
                    <p className="font-medium">{typeLabels[selectedInquiry.inquiry_type]}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Submitted</Label>
                    <p className="font-medium">
                      {format(new Date(selectedInquiry.created_at), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Message</Label>
                  <p className="mt-1 p-3 bg-secondary/50 rounded-lg whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(v: 'new' | 'contacted' | 'closed') => setStatus(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
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

export default AdminCorporate;
