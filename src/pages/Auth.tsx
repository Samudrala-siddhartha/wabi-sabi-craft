import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { AppRole } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['consumer', 'producer'], { required_error: 'Please select a role' }),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'consumer' },
  });

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      toast.error(error.message || 'Failed to sign in');
    } else {
      toast.success('Welcome back!');
      navigate('/');
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
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
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
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...signupForm.register('lastName')} className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signupEmail">Email</Label>
                  <Input id="signupEmail" type="email" {...signupForm.register('email')} className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input id="signupPassword" type="password" {...signupForm.register('password')} className="mt-1" />
                </div>

                <div>
                  <Label>I want to</Label>
                  <RadioGroup
                    defaultValue="consumer"
                    onValueChange={(v) => signupForm.setValue('role', v as 'consumer' | 'producer')}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-md">
                      <RadioGroupItem value="consumer" id="consumer" />
                      <Label htmlFor="consumer" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Buy & Attend</span>
                        <p className="text-sm text-muted-foreground">Shop products and join workshops</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-md">
                      <RadioGroupItem value="producer" id="producer" />
                      <Label htmlFor="producer" className="font-normal cursor-pointer flex-1">
                        <span className="font-medium">Host Workshops</span>
                        <p className="text-sm text-muted-foreground">Create and manage pottery workshops</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full font-body" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
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
