import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const inquirySchema = z.object({
  contact_name: z.string().min(2, 'Please enter your name'),
  contact_email: z.string().email('Please enter a valid email'),
  contact_phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Please provide more details about your session'),
  preferred_date: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryForm) => {
    if (!user) {
      toast.error('Please sign in to submit an inquiry');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('session_inquiries').insert({
        user_id: user.id,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        message: data.message,
        preferred_date: data.preferred_date ? new Date(data.preferred_date).toISOString() : null,
      });

      if (error) throw error;

      reset();
      toast.success('Inquiry submitted! We will get back to you soon.');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            One-on-One
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Private Sessions
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Experience personalized pottery instruction tailored to your skill level and interests. 
            Perfect for individuals, couples, or small groups.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Calendar,
                title: 'Flexible Scheduling',
                description: 'Book sessions at times that work for you, including evenings and weekends.',
              },
              {
                icon: Clock,
                title: 'Personalized Pace',
                description: 'Learn at your own speed with individual attention and customized instruction.',
              },
              {
                icon: Send,
                title: 'Custom Projects',
                description: 'Work on projects that interest you, from functional ware to artistic pieces.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-8 bg-card rounded-lg border border-border"
              >
                <feature.icon className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Inquiry Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="font-display text-3xl font-light text-foreground text-center mb-2">
                Inquire Now
              </h2>
              <p className="font-body text-muted-foreground text-center mb-8">
                Tell us about your pottery goals and we'll create a personalized experience for you.
              </p>

              {!user ? (
                <div className="text-center py-8">
                  <p className="font-body text-muted-foreground mb-4">
                    Please sign in to submit an inquiry.
                  </p>
                  <Button onClick={() => navigate('/login')} className="font-body">
                    Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact_name">Your Name</Label>
                      <Input
                        id="contact_name"
                        {...register('contact_name')}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                      {errors.contact_name && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        {...register('contact_email')}
                        placeholder="Enter your email"
                        className="mt-1"
                      />
                      {errors.contact_email && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      {...register('contact_phone')}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                    {errors.contact_phone && (
                      <p className="text-destructive text-sm mt-1">{errors.contact_phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">What would you like to learn or create?</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us about your experience level, interests, and what you hope to achieve..."
                      className="mt-1 min-h-[150px]"
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="preferred_date">Preferred Date (Optional)</Label>
                    <Input
                      id="preferred_date"
                      type="datetime-local"
                      {...register('preferred_date')}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-body"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sessions;
