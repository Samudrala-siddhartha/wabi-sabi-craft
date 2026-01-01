import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_EMAIL = 'siddarthasamudrala@gmail.com';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isLoading: authLoading, refreshRole } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      if (authLoading) return;

      if (!user) {
        // No user, go back to login
        navigate('/login');
        return;
      }

      // Check if user has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRole?.role) {
        // User has a role, redirect appropriately
        await refreshRole();
        
        if (existingRole.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return;
      }

      // Check if admin email
      if (user.email === ADMIN_EMAIL) {
        // Create admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'admin' });
        
        if (!error) {
          toast.success('Welcome, Admin!');
          await refreshRole();
          navigate('/admin');
          return;
        }
      }

      // Check for pending role from Google signup
      const pendingRole = localStorage.getItem('pendingGoogleRole');
      
      if (pendingRole && (pendingRole === 'consumer' || pendingRole === 'producer')) {
        // Create the role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: pendingRole });
        
        localStorage.removeItem('pendingGoogleRole');
        
        if (!error) {
          toast.success('Welcome to Basho!');
          await refreshRole();
          navigate('/');
          return;
        }
      }

      // No role exists and no pending role, go to role selection
      navigate('/role-selection');
    };

    handleCallback();
  }, [user, authLoading, navigate, refreshRole]);

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-body">Setting up your account...</p>
      </div>
    </Layout>
  );
};

export default AuthCallback;
