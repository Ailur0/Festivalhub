import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SocialProof = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Festival Organizer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      content: "FestivalHub transformed our Diwali celebration planning. The financial tracking saved us hours of manual calculations!"
    },
    {
      id: 2,
      name: "Rajesh Patel",
      role: "Community Leader",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      content: "Managing 50+ members became effortless. The role-based system keeps everyone organized and accountable."
    },
    {
      id: 3,
      name: "Meera Gupta",
      role: "Treasurer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      content: "Real-time expense tracking and automated budget calculations make financial management transparent and stress-free."
    }
  ];

  const securityFeatures = [
    {
      icon: "Shield",
      title: "Bank-Level Security",
      description: "256-bit SSL encryption protects your data"
    },
    {
      icon: "Lock",
      title: "Privacy Protected",
      description: "Your group data stays private and secure"
    },
    {
      icon: "CheckCircle",
      title: "Verified Platform",
      description: "Trusted by 10,000+ festival organizers"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Users" },
    { number: "500+", label: "Festivals Organized" },
    { number: "$2M+", label: "Budget Managed" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-bold text-primary font-heading">
              {stat?.number}
            </div>
            <div className="text-xs text-muted-foreground">
              {stat?.label}
            </div>
          </div>
        ))}
      </div>
      {/* Security Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground font-heading text-center">
          Trusted & Secure
        </h3>
        <div className="grid gap-4">
          {securityFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-success mt-1">
                <Icon name={feature?.icon} size={16} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  {feature?.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {feature?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground font-heading text-center">
          What Our Users Say
        </h3>
        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
              <div className="flex items-start space-x-3">
                <Image
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-foreground">
                      {testimonial?.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {testimonial?.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "{testimonial?.content}"
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={12} className="text-accent fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Shield" size={16} />
          <span className="text-xs font-medium">SSL Secured</span>
        </div>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="CheckCircle" size={16} />
          <span className="text-xs font-medium">Verified</span>
        </div>
        <div className="flex items-center space-x-2 text-success">
          <Icon name="Users" size={16} />
          <span className="text-xs font-medium">Community Trusted</span>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;