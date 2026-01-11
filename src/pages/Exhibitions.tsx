import React from 'react';
import { Calendar, MapPin, Clock, Image as ImageIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useSEO from '@/hooks/useSEO';

// Placeholder exhibitions data - in future can come from database
const upcomingEvents = [
  {
    id: '1',
    title: 'Wabi-Sabi: A Pottery Exhibition',
    location: 'Art Gallery, Surat',
    date: 'Coming Soon',
    description: 'An intimate exhibition showcasing our latest collection inspired by Japanese aesthetics.',
    status: 'upcoming',
  },
];

const pastEvents = [
  {
    id: 'p1',
    title: 'Holiday Pop-up Market',
    location: 'Dumas Road, Surat',
    date: 'December 2024',
    description: 'A festive pop-up featuring limited edition holiday pieces and gift sets.',
  },
  {
    id: 'p2',
    title: 'Ceramic Arts Festival',
    location: 'Gujarat Arts Center',
    date: 'October 2024',
    description: 'Live pottery demonstrations and workshops at the annual arts festival.',
  },
];

const Exhibitions: React.FC = () => {
  useSEO({
    title: 'Exhibitions & Pop-ups',
    description: 'Discover upcoming exhibitions, pop-up markets, and past events featuring Basho pottery.',
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide text-center">
          <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
            Meet Us In Person
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-light text-foreground mt-4">
            Exhibitions & Pop-ups
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Experience our pottery in person at exhibitions and pop-up markets.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Mark Your Calendar
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
              Upcoming Events
            </h2>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="font-display text-2xl text-foreground mb-2">
                Stay Tuned
              </h3>
              <p className="font-body text-muted-foreground max-w-md mx-auto">
                New exhibitions and events are being planned. Follow us on Instagram for announcements!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-primary text-primary-foreground">Upcoming</Badge>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-wide">
          <div className="text-center mb-12">
            <span className="font-body text-sm tracking-[0.3em] text-muted-foreground uppercase">
              Archive
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mt-4">
              Past Events
            </h2>
          </div>

          {pastEvents.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <p className="font-body text-muted-foreground">
                Past events will be archived here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden opacity-90">
                  <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">Past</Badge>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Exhibitions;
