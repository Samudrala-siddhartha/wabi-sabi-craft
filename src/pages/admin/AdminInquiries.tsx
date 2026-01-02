import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type Inquiry = Tables<'session_inquiries'>;

const statusOptions = ['pending', 'contacted', 'scheduled', 'completed', 'cancelled'];

const AdminInquiries: React.FC = () => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, admin_notes }: { id: string; status?: string; admin_notes?: string }) => {
      const updates: Record<string, string | undefined> = {};
      if (status) updates.status = status;
      if (admin_notes !== undefined) updates.admin_notes = admin_notes;
      
      const { error } = await supabase
        .from('session_inquiries')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast.success('Inquiry updated');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'contacted': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const openDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.admin_notes ?? '');
  };

  const handleSaveNotes = () => {
    if (selectedInquiry) {
      updateMutation.mutate({ id: selectedInquiry.id, admin_notes: adminNotes });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Session Inquiries</h1>
          <p className="text-muted-foreground mt-1">Manage private session requests</p>
        </div>

        {/* Inquiries Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : inquiries && inquiries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Preferred Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(inquiry.created_at), 'h:mm a')}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="line-clamp-2 text-sm">{inquiry.message}</p>
                      </TableCell>
                      <TableCell>
                        {inquiry.preferred_date 
                          ? format(new Date(inquiry.preferred_date), 'MMM d, yyyy')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Select
                          value={inquiry.status ?? 'pending'}
                          onValueChange={(value) => 
                            updateMutation.mutate({ id: inquiry.id, status: value })
                          }
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(inquiry.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetails(inquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No inquiries yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiry Details Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>View and manage this session inquiry</DialogDescription>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-6">
                {/* Inquiry Info */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Submitted</span>
                    <p>{format(new Date(selectedInquiry.created_at), 'PPpp')}</p>
                  </div>
                  
                  {selectedInquiry.preferred_date && (
                    <div>
                      <span className="text-sm text-muted-foreground">Preferred Date</span>
                      <p>{format(new Date(selectedInquiry.preferred_date), 'PPP')}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Status</span>
                    <p className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Message</span>
                    <p className="bg-muted/50 p-4 rounded-lg mt-1 whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                <div>
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this inquiry..."
                    rows={4}
                    className="mt-1"
                  />
                  <Button 
                    onClick={handleSaveNotes} 
                    className="mt-2"
                    disabled={updateMutation.isPending}
                  >
                    Save Notes
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

export default AdminInquiries;