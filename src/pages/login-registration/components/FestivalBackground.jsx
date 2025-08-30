import React from 'react';
import Image from '../../../components/AppImage';

const FestivalBackground = () => {
  const backgroundImages = [
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
      alt: "Colorful Diwali celebration with diyas and rangoli"
    },
    {
      src: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?w=1200&h=800&fit=crop",
      alt: "Traditional festival decorations and lights"
    },
    {
      src: "https://images.pixabay.com/photo/2017/10/07/15/27/diwali-2827457_1280.jpg?w=1200&h=800&fit=crop",
      alt: "Festival celebration with community gathering"
    }
  ];

  const currentImage = backgroundImages?.[0];

  return (
    <div className="hidden lg:block relative w-full h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentImage?.src}
          alt={currentImage?.alt}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
        <div className="max-w-md space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white font-heading drop-shadow-lg">
              Celebrate Together
            </h1>
            <p className="text-lg text-white/90 drop-shadow-md">
              Streamline your festival planning with automated financial management and seamless group collaboration
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm">Automated budget calculations</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm">Real-time expense tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm">Community vendor marketplace</span>
            </div>
            <div className="flex items-center space-x-3 text-white/90">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-sm">Role-based group management</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center space-x-4 pt-4">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-200" />
          </div>
        </div>
      </div>
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
};

export default FestivalBackground;