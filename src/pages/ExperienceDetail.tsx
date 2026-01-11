import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, Cake, Leaf, Palette, ArrowLeft, CheckCircle, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

const inquirySchema = z.object({
  contact_name: z.string().min(2, 'Name is required'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().min(10, 'Valid phone number is required'),
  preferred_date: z.string().optional(),
  group_size: z.number().min(1, 'Group size is required'),
  notes: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

const experienceIcons = {
  couple: Heart,
  birthday: Cake,
  farm_garden: Leaf,
  studio: Palette,
};

const experienceDetails = {
  couple: {
    title: 'Couple Sessions',
    description: 'A romantic pottery experience designed for two. Create matching pieces together while enjoying an intimate workshop setting with expert guidance.',
    features: [
      'Private session for couples',
      'Create 2 pieces each',
      'Glazing included',
      'Pieces delivered after firing',
      'Refreshments provided',
    ],
    groupSize: { min: 2, max: 2 },
    duration: '2-3 hours',
  },
  birthday: {
    title: 'Birthday Celebrations',
    description: 'Make your birthday unforgettable with a pottery party! Perfect for all ages, guests create their own pieces to take home as memories.',
    features: [
      'Private party setup',
      'All materials included',
      'Expert guidance for all skill levels',
      'Customizable to your theme',
      'Perfect for kids and adults',
    ],
    groupSize: { min: 5, max: 15 },
    duration: '2-4 hours',
  },
  farm_garden: {
    title: 'Farm & Garden Events',
    description: 'Experience pottery in nature. Our outdoor sessions combine the serenity of gardens with the meditative joy of creating with clay.',
    features: [
      'Outdoor natural setting',
      'Connection with nature',
      'Seasonal themes available',
      'Perfect for corporate retreats',
      'Refreshments included',
    ],
    groupSize: { min: 4, max: 20 },
    duration: '3-4 hours',
  },
  studio: {
    title: 'Studio Experiences',
    description: 'Deep dive into pottery at our fully-equipped studio. Learn various techniques from expert potters in a professional setting.',
    features: [
      'Professional studio access',
      'Expert instruction',
      'Multiple techniques covered',
      'All tools and materials',
      'Take home your creations',
    ],
    groupSize: { min: 1, max: 8 },
    duration: '2-3 hours',
  },
};

type ExperienceType = keyof typeof experienceDetails;

const ExperienceDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const experienceType = type as ExperienceType;
  const experience = experienceDetails[experienceType];
  const Icon = experienceIcons[experienceType];

  useSEO({
    title: experience?.title || 'Experience',
    description: experience?.description || 'Book a unique pottery experience at Basho by Shivangi',
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      group_size: experience?.groupSize.min || 1,
    },
  });

  if (!experience) {
    return (
      <Layout>
        <div className="container-wide py-20 text-center">
          <h1 className="font-display text-3xl text-foreground">Experience not found</h1>
          <Button onClick={() => navigate('/experiences')} variant="outline" className="mt-4">
            View All Experiences
          </Button>
        </div>
      </Layout>
    );
  }

  const onSubmit = async (data: InquiryForm) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('experience_inquiries')
        .insert([{
          ...data,
          experience_type: experienceType,
          preferred_date: data.preferred_date || null,
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      reset();
      toast.success('Booking request submitted!');
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container-wide py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate('/experiences')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Experiences
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Details */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <span className="font-body text-sm text-muted-foreground uppercase tracking-wider">
                Experience
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-light text-foreground">
              {experience.title}
            </h1>

            <p className="font-body text-lg text-muted-foreground mt-6 leading-relaxed">
              {experience.description}
            </p>

            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{experience.groupSize.min}-{experience.groupSize.max} people</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{experience.duration}</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-secondary/50 rounded-lg">
              <h3 className="font-display text-xl text-foreground mb-4">What's Included</h3>
              <ul className="space-y-3">
                {experience.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-body text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="bg-card rounded-lg border border-border p-6 md:p-8 sticky top-24">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-2xl text-foreground mb-4">
                    Request Received!
                  </h3>
                  <p className="font-body text-muted-foreground mb-2">
                    We'll contact you within 24 hours to confirm availability and discuss details.
                  </p>
                  <p className="font-body text-sm text-muted-foreground mb-6">
                    For urgent queries, call +91 9879575601
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl text-foreground mb-6">
                    Book This Experience
                  </h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="contact_name">Your Name *</Label>
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
                      <Label htmlFor="contact_email">Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        {...register('contact_email')}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                      {errors.contact_email && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="contact_phone">Phone *</Label>
                      <Input
                        id="contact_phone"
                        {...register('contact_phone')}
                        placeholder="+91 9876543210"
                        className="mt-1"
                      />
                      {errors.contact_phone && (
                        <p className="text-destructive text-sm mt-1">{errors.contact_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="preferred_date">Preferred Date</Label>
                      <Input
                        id="preferred_date"
                        type="date"
                        {...register('preferred_date')}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="group_size">Group Size *</Label>
                      <Input
                        id="group_size"
                        type="number"
                        {...register('group_size', { valueAsNumber: true })}
                        min={experience.groupSize.min}
                        max={experience.groupSize.max}
                        className="mt-1"
                      />
                      <p className="text-muted-foreground text-xs mt-1">
                        {experience.groupSize.min}-{experience.groupSize.max} people allowed
                      </p>
                      {errors.group_size && (
                        <p className="text-destructive text-sm mt-1">{errors.group_size.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        {...register('notes')}
                        placeholder="Any special requests or information..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full font-body"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      This is a booking request. We'll confirm availability and pricing.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExperienceDetail;
