import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user && role) {
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else if (user && !role) {
        // User exists but role not yet assigned, wait a moment then redirect
        const timeout = setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
        return () => clearTimeout(timeout);
      } else {
        // No user, redirect to auth
        navigate('/auth', { replace: true });
      }
    }
  }, [user, role, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground font-body">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
