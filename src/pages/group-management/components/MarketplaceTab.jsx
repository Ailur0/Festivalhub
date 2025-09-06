import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import AddVendorModal from './AddVendorModal';

const MarketplaceTab = ({ vendors, onViewVendor, onAddVendor, userRole, groupInfo }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'decoration', label: 'Decoration' },
    { value: 'catering', label: 'Catering' },
    { value: 'sound_lighting', label: 'Sound & Lighting' },
    { value: 'photography', label: 'Photography' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'security', label: 'Security' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'other', label: 'Other Services' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'newest', label: 'Recently Added' }
  ];

  // Check if user is admin (admin or management role)
  const isAdmin = userRole === 'admin' || userRole === 'management';

  const filteredVendors = vendors?.filter(vendor => 
    selectedCategory === 'all' || vendor?.category === selectedCategory
  );

  const sortedVendors = [...(filteredVendors || [])]?.sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b?.rating || 0) - (a?.rating || 0);
      case 'price_low':
        return (a?.startingPrice || 0) - (b?.startingPrice || 0);
      case 'price_high':
        return (b?.startingPrice || 0) - (a?.startingPrice || 0);
      case 'distance':
        return a?.id - b?.id; // Mock distance sorting
      case 'reviews':
        return (b?.reviewCount || 0) - (a?.reviewCount || 0);
      case 'newest':
        return new Date(b?.dateAdded || 0) - new Date(a?.dateAdded || 0);
      default:
        return 0;
    }
  });

  const handleAddVendor = (vendorData) => {
    console.log('Adding vendor:', vendorData);
    // This would typically call an API to save the vendor
    onAddVendor?.(vendorData);
    setShowAddVendorModal(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'decoration': return 'Palette';
      case 'catering': return 'ChefHat';
      case 'sound_lighting': return 'Volume2';
      case 'photography': return 'Camera';
      case 'transportation': return 'Truck';
      case 'security': return 'Shield';
      case 'cleaning': return 'Sparkles';
      case 'supplies': return 'Package';
      default: return 'Store';
    }
  };

  const getVendorStatusBadge = (vendor) => {
    if (vendor?.addedBy) {
      return (
        <div className="flex items-center space-x-1 text-xs">
          <Icon name="Users" size={12} className="text-primary" />
          <span className="text-primary">Added by {vendor?.addedBy?.groupName}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Community Marketplace
          </h3>
          <p className="text-sm text-muted-foreground">
            Discover trusted vendors from the community
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Filter by category"
            className="w-full sm:w-48"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
            className="w-full sm:w-48"
          />
          
          {/* Admin-only Add Vendor Button */}
          {isAdmin && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setShowAddVendorModal(true)}
            >
              Add Vendor
            </Button>
          )}
          
          {/* Browse All Vendors Button for non-admins and additional option for admins */}
          <Button
            variant="outline"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={onAddVendor}
          >
            Browse All
          </Button>
        </div>
      </div>

      {/* Admin Notice */}
      {isAdmin && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Crown" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground mb-1">Admin Privileges</h4>
              <p className="text-sm text-muted-foreground">
                As a group admin, you can add new vendors to the community marketplace. 
                These vendors will be visible to all community groups and help expand our shared network of trusted service providers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVendors?.map((vendor) => (
          <div key={vendor?.id} className="bg-card border border-border rounded-lg overflow-hidden festival-shadow-sm hover:festival-shadow-md transition-festival">
            {/* Vendor Image */}
            <div className="h-48 overflow-hidden bg-muted relative">
              <Image
                src={vendor?.image}
                alt={vendor?.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {vendor?.status === 'pending_review' && (
                <div className="absolute top-2 right-2">
                  <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Pending Review
                  </span>
                </div>
              )}
            </div>

            {/* Vendor Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground truncate">
                    {vendor?.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon 
                      name={getCategoryIcon(vendor?.category)} 
                      size={14} 
                      className="text-muted-foreground" 
                    />
                    <span className="text-sm text-muted-foreground capitalize">
                      {vendor?.category?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(vendor?.rating || 0)}
                  <span className="text-sm font-medium text-foreground ml-1">
                    {vendor?.rating || 'New'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {vendor?.description}
              </p>

              {/* Vendor Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starting from</span>
                  <span className="font-semibold text-primary">${vendor?.startingPrice}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{vendor?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>{vendor?.reviewCount || 0} reviews</span>
                  </div>
                </div>

                {/* Added by badge */}
                {getVendorStatusBadge(vendor)}

                {vendor?.isVerified && (
                  <div className="flex items-center space-x-1 text-xs text-success">
                    <Icon name="CheckCircle" size={12} />
                    <span>Community Verified</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  onClick={() => onViewVendor?.(vendor?.id)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Phone"
                  onClick={() => window.open(`tel:${vendor?.phone}`)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Mail"
                  onClick={() => window.open(`mailto:${vendor?.email}`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedVendors?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Store" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No vendors found
          </h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === 'all' ?'No vendors available yet. ' + (isAdmin ? 'Be the first to add a vendor to the community!' : 'Ask your group admin to add vendors to the marketplace.')
              : 'No vendors match your current filters. Try adjusting your search criteria.'
            }
          </p>
          <div className="flex justify-center space-x-3">
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSortBy('rating');
                }}
              >
                Clear Filters
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="default"
                onClick={() => setShowAddVendorModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Add First Vendor
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Load More */}
      {sortedVendors?.length > 0 && sortedVendors?.length >= 9 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Vendors
          </Button>
        </div>
      )}

      {/* Add Vendor Modal */}
      <AddVendorModal
        isOpen={showAddVendorModal}
        onClose={() => setShowAddVendorModal(false)}
        onAddVendor={handleAddVendor}
        groupInfo={groupInfo}
      />
    </div>
  );
};

export default MarketplaceTab;