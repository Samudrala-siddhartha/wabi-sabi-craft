import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AppRole } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import bashoLogo from '@/assets/basho-logo-contact.png';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  role: z.enum(['consumer', 'producer'], { required_error: 'Please select a role' }),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, user, role, needsRoleSelection, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'producer' | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // If user needs role selection, redirect there
      if (needsRoleSelection) {
        navigate('/role-selection');
        return;
      }
      
      // Otherwise redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'producer') {
        navigate('/');
      } else {
        navigate('/');
      }
    }
  }, [user, role, needsRoleSelection, authLoading, navigate]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back!');
      // Navigation will happen via useEffect when role is resolved
    }
    setIsLoading(false);
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    const { error } = await signUp(
      data.email,
      data.password,
      data.role as AppRole,
      data.firstName,
      data.lastName
    );
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('This email is already registered. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to create account');
      }
    } else {
      toast.success('Account created successfully!');
      // Navigation will happen via useEffect when role is resolved
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    // For signup, require role selection first
    if (!isLogin && !selectedRole) {
      setShowRoleSelection(true);
      toast.error('Please select a role before continuing with Google');
      return;
    }

    setIsGoogleLoading(true);
    
    // For login, redirect to role-selection page after auth
    // For signup, we store the role in localStorage temporarily
    if (!isLogin && selectedRole) {
      localStorage.setItem('pendingGoogleRole', selectedRole);
    }
    
    const redirectUrl = `${window.location.origin}/auth-callback`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      toast.error(error.message || 'Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  const roleSelected = isLogin || selectedRole !== null;

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
              {isLogin ? 'Welcome Back' : 'Join Basho'}
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          <div className="bg-card rounded-lg border border-border p-8">
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register('email')}
                    placeholder="you@example.com"
                    className="mt-1"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...loginForm.register('password')}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-destructive text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full font-body" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...signupForm.register('firstName')} className="mt-1" />
                    {signupForm.formState.errors.firstName && (
                      <p className="text-destructive text-sm mt-1">
                        {signupForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...signupForm.register('lastName')} className="mt-1" />
                    {signupForm.formState.errors.lastName && (
                      <p className="text-destructive text-sm mt-1">
                        {signupForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input id="signupEmail" type="email" {...signupForm.register('email')} className="mt-1" />
                  {signupForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input id="signupPassword" type="password" {...signupForm.register('password')} className="mt-1" />
                  {signupForm.formState.errors.password && (
                    <p className="text-destructive text-sm mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-base font-medium">I want to <span className="text-destructive">*</span></Label>
                  <RadioGroup
                    value={signupForm.watch('role') || ''}
                    onValueChange={(v) => {
                      signupForm.setValue('role', v as 'consumer' | 'producer');
                      setSelectedRole(v as 'consumer' | 'producer');
                    }}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:border-primary transition-colors">
                      <RadioGroupItem value="consumer" id="consumer" />
                      <Label htmlFor="consumer" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Buy & Attend</span>
                        <p className="text-sm text-muted-foreground">Shop products and join workshops</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-md hover:border-primary transition-colors">
                      <RadioGroupItem value="producer" id="producer" />
                      <Label htmlFor="producer" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Host Workshops</span>
                        <p className="text-sm text-muted-foreground">Create and manage pottery workshops</p>
                      </Label>
                    </div>
                  </RadioGroup>
                  {signupForm.formState.errors.role && (
                    <p className="text-destructive text-sm mt-1">
                      {signupForm.formState.errors.role.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-body" 
                  disabled={isLoading || !signupForm.watch('role')}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            )}

            {/* Google OAuth Separator */}
            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
                or
              </span>
            </div>

            {/* Role selection for Google signup */}
            {!isLogin && showRoleSelection && !selectedRole && (
              <div className="mb-4 p-4 bg-secondary/50 rounded-lg">
                <p className="font-body text-sm text-foreground mb-3">
                  Please select your role before continuing with Google:
                </p>
                <RadioGroup
                  value={selectedRole || ''}
                  onValueChange={(v) => setSelectedRole(v as 'consumer' | 'producer')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-card">
                    <RadioGroupItem value="consumer" id="google-consumer" />
                    <Label htmlFor="google-consumer" className="font-normal cursor-pointer text-sm">
                      Buy & Attend (Consumer)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border border-border rounded-md bg-card">
                    <RadioGroupItem value="producer" id="google-producer" />
                    <Label htmlFor="google-producer" className="font-normal cursor-pointer text-sm">
                      Host Workshops (Producer)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full font-body"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || (!isLogin && !selectedRole && !showRoleSelection)}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setShowRoleSelection(false);
                  setSelectedRole(null);
                }}
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
