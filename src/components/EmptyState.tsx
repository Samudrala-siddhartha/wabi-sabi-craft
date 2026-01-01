import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, Package, Calendar, MessageSquare, ShoppingBag, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Package,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="font-body text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Button asChild>
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
};

// Pre-configured empty states for common use cases
export const EmptyProducts: React.FC = () => (
  <EmptyState
    icon={ShoppingBag}
    title="Collection Coming Soon"
    description="We're preparing beautiful handcrafted pieces for you. Check back soon to explore our pottery collection."
  />
);

export const EmptyWorkshops: React.FC = () => (
  <EmptyState
    icon={Calendar}
    title="No Workshops Available"
    description="We're planning new workshops. Sign up for notifications or check back soon for upcoming sessions."
    actionLabel="Explore Sessions"
    actionHref="/sessions"
  />
);

export const EmptyOrders: React.FC = () => (
  <EmptyState
    icon={Package}
    title="No Orders Yet"
    description="Your order history will appear here once you make your first purchase. Start exploring our collection!"
    actionLabel="Shop Now"
    actionHref="/shop"
  />
);

export const EmptyBookings: React.FC = () => (
  <EmptyState
    icon={Calendar}
    title="No Bookings Yet"
    description="You haven't booked any workshops yet. Join us for a hands-on pottery experience!"
    actionLabel="View Workshops"
    actionHref="/workshops"
  />
);

export const EmptyInquiries: React.FC = () => (
  <EmptyState
    icon={MessageSquare}
    title="No Inquiries Yet"
    description="You haven't submitted any session inquiries. Interested in a private pottery session?"
    actionLabel="Request a Session"
    actionHref="/sessions"
  />
);

export const EmptyGallery: React.FC = () => (
  <EmptyState
    icon={Image}
    title="Gallery Coming Soon"
    description="We're curating our best work to share with you. Check back soon to see our handcrafted pottery collection."
  />
);

export default EmptyState;
