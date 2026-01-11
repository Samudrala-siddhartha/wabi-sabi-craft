import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Gift, Users, Palette, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useSEO, SEO_CONFIGS } from '@/hooks/useSEO';

const inquirySchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  contact_person: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  inquiry_type: z.enum(['gifting', 'workshop', 'collaboration']),
  message: z.string().min(10, 'Please provide more details'),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const services = [
  {
    icon: Gift,
    title: 'Corporate Gifting',
    description: 'Curated handcrafted pottery gifts for your clients, employees, and partners. Each piece tells a story of craftsmanship and thoughtfulness.',
  },
  {
    icon: Users,
    title: 'Team Workshops',
    description: 'Unique team-building experiences through pottery. Foster creativity, collaboration, and mindfulness in your workplace.',
  },
  {
    icon: Palette,
    title: 'Brand Collaborations',
    description: 'Custom pottery collections aligned with your brand identity. From concept to creation, we bring your vision to life.',
  },
];

const Corporate: React.FC = () => {
  useSEO(SEO_CONFIGS.corporate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  });

  const inquiryType = watch('inquiry_type');

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('corporate_inquiries')
        .insert([{
          company_name: data.company_name,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone,
          inquiry_type: data.inquiry_type,
          message: data.message,
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      reset();
      toast.success('Inquiry submitted successfully!');
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
            Business Solutions
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Corporate & Collaborations
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Partner with Basho for meaningful corporate experiences. From bespoke gifting 
            to team workshops, we create memorable moments through pottery.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-12">
            Our Corporate Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-card rounded-lg border border-border p-8 text-center hover:shadow-medium transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-narrow">
          <div className="bg-card rounded-lg border border-border p-8 md:p-12">
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="font-display text-2xl text-foreground mb-4">
                  Thank You!
                </h3>
                <p className="font-body text-muted-foreground mb-6">
                  We've received your inquiry and will get back to you within 2 business days.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="font-display text-3xl text-foreground">
                    Get In Touch
                  </h2>
                  <p className="font-body text-muted-foreground mt-2">
                    Tell us about your requirements and we'll create a custom solution.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        {...register('company_name')}
                        placeholder="Your company name"
                        className="mt-1"
                      />
                      {errors.company_name && (
                        <p className="text-destructive text-sm mt-1">{errors.company_name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="contact_person">Contact Person *</Label>
                      <Input
                        id="contact_person"
                        {...register('contact_person')}
                        placeholder="Your name"
                        className="mt-1"
                      />
                      {errors.contact_person && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_person.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="work@company.com"
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder="+91 9876543210"
                        className="mt-1"
                      />
                      {errors.phone && (
                        <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Inquiry Type *</Label>
                    <Select
                      value={inquiryType}
                      onValueChange={(value: 'gifting' | 'workshop' | 'collaboration') =>
                        setValue('inquiry_type', value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gifting">Corporate Gifting</SelectItem>
                        <SelectItem value="workshop">Team Workshop</SelectItem>
                        <SelectItem value="collaboration">Brand Collaboration</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.inquiry_type && (
                      <p className="text-destructive text-sm mt-1">{errors.inquiry_type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register('message')}
                      placeholder="Tell us about your requirements, budget, timeline, and any specific ideas..."
                      rows={5}
                      className="mt-1"
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                    )}
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
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Corporate;
