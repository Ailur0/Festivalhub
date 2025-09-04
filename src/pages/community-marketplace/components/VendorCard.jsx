import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorCard = ({ 
  vendor, 
  onViewProfile, 
  onToggleFavorite, 
  isFavorite = false, 
  viewMode = 'grid',
  showCommunityBadge = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewProfile = () => {
    onViewProfile?.(vendor);
  };

  const handleToggleFavorite = (e) => {
    e?.stopPropagation();
    onToggleFavorite?.(vendor?.id);
  };

  const handleContact = (type, value) => {
    if (type === 'phone') {
      window.open(`tel:${value}`, '_self');
    } else if (type === 'email') {
      window.open(`mailto:${value}`, '_self');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatPrice = (priceRange) => {
    if (priceRange?.min && priceRange?.max) {
      return `$${priceRange?.min} - $${priceRange?.max}`;
    } else if (priceRange?.min) {
      return `From $${priceRange?.min}`;
    }
    return 'Contact for pricing';
  };

  // Grid view (default)
  if (viewMode === 'grid') {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden festival-shadow-sm hover:festival-shadow-md transition-festival cursor-pointer group"
           onClick={handleViewProfile}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={vendor?.image}
            alt={vendor?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' :'bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500'
            }`}
          >
            <Icon name="Heart" size={16} className={isFavorite ? 'fill-current' : ''} />
          </button>

          {/* Community Badge */}
          {showCommunityBadge && vendor?.addedBy && (
            <div className="absolute top-3 left-3">
              <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Icon name="Users" size={12} />
                <span>Community</span>
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {vendor?.verified && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                <Icon name="CheckCircle" size={12} />
                <span>Verified</span>
              </div>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {vendor?.name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {vendor?.category}
              </p>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 ml-3">
              {renderStars(vendor?.rating)}
              <span className="text-sm font-medium text-foreground ml-1">
                {vendor?.rating || 'New'}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {vendor?.description}
          </p>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-semibold text-primary">
                {formatPrice(vendor?.priceRange)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={12} />
                <span className="truncate">{vendor?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="MessageSquare" size={12} />
                <span>{vendor?.reviewCount || 0} reviews</span>
              </div>
            </div>

            {/* Community Attribution */}
            {showCommunityBadge && vendor?.addedBy && (
              <div className="text-xs text-primary bg-primary/10 rounded-md px-2 py-1">
                Added by {vendor?.addedBy?.groupName}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              fullWidth
              onClick={(e) => {
                e?.stopPropagation();
                handleViewProfile();
              }}
            >
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Phone"
              onClick={(e) => {
                e?.stopPropagation();
                handleContact('phone', vendor?.phone);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              onClick={(e) => {
                e?.stopPropagation();
                handleContact('email', vendor?.email);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden festival-shadow-sm hover:festival-shadow-md transition-festival cursor-pointer group"
         onClick={handleViewProfile}>
      <div className="flex p-4">
        {/* Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={vendor?.image}
            alt={vendor?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Community Badge */}
          {showCommunityBadge && vendor?.addedBy && (
            <div className="absolute -top-1 -left-1">
              <div className="bg-primary text-primary-foreground text-xs px-1 py-0.5 rounded-sm">
                <Icon name="Users" size={10} />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 ml-4 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">
                  {vendor?.name}
                </h3>
                {vendor?.verified && (
                  <Icon name="CheckCircle" size={14} className="text-success flex-shrink-0" />
                )}
              </div>
              
              <p className="text-sm text-muted-foreground capitalize mb-2">
                {vendor?.category}
              </p>

              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {vendor?.description}
              </p>

              <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{vendor?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MessageSquare" size={12} />
                  <span>{vendor?.reviewCount || 0} reviews</span>
                </div>
              </div>

              {/* Community Attribution */}
              {showCommunityBadge && vendor?.addedBy && (
                <div className="text-xs text-primary mb-2">
                  Added by {vendor?.addedBy?.groupName}
                </div>
              )}
            </div>

            {/* Right side info */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {/* Favorite Button */}
              <button
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-500' :'bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-500'
                }`}
              >
                <Icon name="Heart" size={14} className={isFavorite ? 'fill-current' : ''} />
              </button>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                {renderStars(vendor?.rating)}
                <span className="text-sm font-medium text-foreground ml-1">
                  {vendor?.rating || 'New'}
                </span>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(vendor?.priceRange)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleContact('phone', vendor?.phone);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  onClick={(e) => {
                    e?.stopPropagation();
                    handleContact('email', vendor?.email);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;