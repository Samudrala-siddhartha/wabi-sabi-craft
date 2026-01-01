import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import bashoLogo from '@/assets/basho-logo-new.jpg';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isLoading: authLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'producer' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to login
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    // If user already has a role, redirect appropriately
    if (!authLoading && user && role) {
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'producer') {
        navigate('/');
      } else {
        navigate('/');
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleSubmit = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      // Insert the role for this user
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: selectedRole,
        });

      if (error) {
        // If role already exists, just redirect
        if (error.code === '23505') {
          toast.info('Role already set');
          navigate('/');
          return;
        }
        throw error;
      }

      toast.success('Welcome to Basho!');
      
      // Force a page reload to refresh auth context with new role
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast.error('Failed to set role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <Layout hideFooter>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // If user has role, show loading (redirect will happen)
  if (role) {
    return (
      <Layout hideFooter>
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={bashoLogo} 
              alt="Basho by Shivangi" 
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-light text-foreground">
              Welcome to Basho
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              Choose how you'd like to use Basho
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-8">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">I want to</Label>
                <RadioGroup
                  value={selectedRole || ''}
                  onValueChange={(v) => setSelectedRole(v as 'consumer' | 'producer')}
                  className="mt-4 space-y-3"
                >
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="consumer" id="role-consumer" />
                    <Label htmlFor="role-consumer" className="font-normal cursor-pointer flex-1">
                      <span className="font-medium text-lg">Buy & Attend</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Shop handcrafted pottery and join pottery workshops
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <RadioGroupItem value="producer" id="role-producer" />
                    <Label htmlFor="role-producer" className="font-normal cursor-pointer flex-1">
                      <span className="font-medium text-lg">Host Workshops</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Create and manage your own pottery workshops
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full font-body"
                disabled={!selectedRole || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoleSelection;
