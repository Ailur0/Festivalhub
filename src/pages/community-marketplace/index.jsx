import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';

import VendorCard from './components/VendorCard';
import FilterPanel from './components/FilterPanel';
import VendorProfileModal from './components/VendorProfileModal';
import SearchBar from './components/SearchBar';
import CategoryNavigation from './components/CategoryNavigation';
import SortingControls from './components/SortingControls';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const CommunityMarketplace = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [favoriteVendors, setFavoriteVendors] = useState(new Set());
  const [filters, setFilters] = useState({
    categories: [],
    priceRanges: [],
    location: '',
    radius: 25,
    availableDate: '',
    verified: false,
    addedByGroups: false  // New filter for community-added vendors
  });

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'group',
      title: 'New vendor review',
      message: 'Rajesh Kumar left a 5-star review for Golden Catering Services',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: 'normal'
    },
    {
      id: 2,
      type: 'financial',
      title: 'Vendor added by admin',
      message: 'New vendor "Sacred Supplies Store" added by Ganesh Chaturthi Community admin',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      priority: 'normal'
    },
    {
      id: 3,
      type: 'celebration',
      title: 'Festival reminder',
      message: 'Ganesh Chaturthi is in 5 days. Don\'t forget to finalize your vendor bookings!',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      priority: 'high'
    }
  ];

  // Updated mock vendor data with community-added vendors
  const mockVendors = [
    {
      id: 1,
      name: "Golden Catering Services",
      category: "Catering",
      description: `Premium catering service specializing in traditional Indian festival foods and sweets.\nWe provide authentic vegetarian meals for all Hindu festivals including Diwali, Holi, and Ganesh Chaturthi.\nOur experienced chefs use traditional recipes and fresh ingredients to create memorable dining experiences.`,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
      rating: 4.8,
      reviewCount: 127,
      location: "Mumbai, Maharashtra",
      phone: "+91 98765 43210",
      email: "info@goldencatering.com",
      priceRange: { min: 500, max: 2000 },
      verified: true,
      addedBy: {
        groupId: 'group-4',
        groupName: 'Diwali Mumbai 2024',
        adminName: 'Rajesh Kumar',
        dateAdded: '2024-10-15T09:00:00Z'
      },
      gallery: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"
      ]
    },
    {
      id: 2,
      name: "Elegant Decorations",
      category: "Decoration",
      description: `Professional decoration service for all types of Hindu festivals and celebrations.\nSpecializing in mandap decoration, floral arrangements, and traditional lighting setups.\nWe create beautiful and authentic festival atmospheres that honor cultural traditions.`,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      rating: 4.9,
      reviewCount: 89,
      location: "Delhi, NCR",
      phone: "+91 98765 43211",
      email: "contact@elegantdecorations.com",
      priceRange: { min: 800, max: 5000 },
      verified: true,
      addedBy: {
        groupId: 'group-5',
        groupName: 'Delhi Holi Festival',
        adminName: 'Meera Patel',
        dateAdded: '2024-10-12T14:30:00Z'
      },
      gallery: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
        "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500"
      ]
    },
    {
      id: 3,
      name: "SoundWave Audio Systems",
      category: "Sound & Lighting",
      description: `Professional sound and lighting equipment rental for festivals and events.\nHigh-quality audio systems, microphones, and stage lighting for all occasions.\nExperienced technicians ensure perfect sound quality for your celebrations.`,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      rating: 4.6,
      reviewCount: 156,
      location: "Bangalore, Karnataka",
      phone: "+91 98765 43212",
      email: "bookings@soundwaveaudio.com",
      priceRange: { min: 300, max: 1500 },
      verified: false,
      gallery: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500"
      ]
    },
    {
      id: 4,
      name: "Divine Photography",
      category: "Photography",
      description: `Specialized in capturing the essence and beauty of Hindu festivals and celebrations.\nProfessional photographers with deep understanding of cultural significance.\nWe preserve your precious festival memories with artistic and traditional photography.`,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500",
      rating: 4.7,
      reviewCount: 203,
      location: "Chennai, Tamil Nadu",
      phone: "+91 98765 43213",
      email: "info@divinephotography.com",
      priceRange: { min: 1000, max: 3000 },
      verified: true,
      gallery: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500"
      ]
    },
    {
      id: 5,
      name: "Festival Transport Services",
      category: "Transportation",
      description: `Reliable transportation services for festival attendees and equipment.\nComfortable buses and vans for group transportation to festival venues.\nSpecialized in handling festival logistics and crowd management.`,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500",
      rating: 4.4,
      reviewCount: 78,
      location: "Pune, Maharashtra",
      phone: "+91 98765 43214",
      email: "bookings@festivaltransport.com",
      priceRange: { min: 200, max: 800 },
      verified: false,
      gallery: [
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
      ]
    },
    {
      id: 6,
      name: "Sacred Supplies Store",
      category: "Supplies",
      description: `Complete range of festival supplies including pooja items, decorative materials, and traditional accessories.\nAuthentic products sourced from trusted manufacturers.\nEverything you need for a perfect Hindu festival celebration.`,
      image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500",
      rating: 4.5,
      reviewCount: 92,
      location: "Kolkata, West Bengal",
      phone: "+91 98765 43215",
      email: "orders@sacredsupplies.com",
      priceRange: { min: 100, max: 1000 },
      verified: true,
      addedBy: {
        groupId: 'group-6',
        groupName: 'Kolkata Durga Puja Committee',
        adminName: 'Amit Banerjee',
        dateAdded: '2024-10-10T16:45:00Z'
      },
      gallery: [
        "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500"
      ]
    },
    {
      id: 7,
      name: "Secure Events Protection",
      category: "Security",
      description: `Professional security services for large festival gatherings and events.\nTrained security personnel experienced in crowd management and event safety.\nEnsuring safe and peaceful celebrations for all attendees.`,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500",
      rating: 4.3,
      reviewCount: 45,
      location: "Hyderabad, Telangana",
      phone: "+91 98765 43216",
      email: "security@secureevents.com",
      priceRange: { min: 400, max: 1200 },
      verified: true,
      gallery: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500"
      ]
    },
    {
      id: 8,
      name: "Clean Sweep Services",
      category: "Cleaning",
      description: `Post-event cleaning services for festival venues and community spaces.\nProfessional cleaning crew with eco-friendly products and equipment.\nLeaving your celebration venues spotless and ready for the next event.`,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
      rating: 4.2,
      reviewCount: 67,
      location: "Jaipur, Rajasthan",
      phone: "+91 98765 43217",
      email: "bookings@cleansweep.com",
      priceRange: { min: 150, max: 600 },
      verified: false,
      gallery: [
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500"
      ]
    }
  ];

  // Filter vendors based on search, category, and filters
  const filteredVendors = mockVendors?.filter(vendor => {
    // Search query filter
    if (searchQuery && !vendor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !vendor?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) &&
        !vendor?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryMap = {
        'catering': 'Catering',
        'decoration': 'Decoration',
        'sound-lighting': 'Sound & Lighting',
        'transportation': 'Transportation',
        'supplies': 'Supplies',
        'photography': 'Photography',
        'security': 'Security',
        'cleaning': 'Cleaning'
      };
      if (vendor?.category !== categoryMap?.[selectedCategory]) {
        return false;
      }
    }

    // Verified filter
    if (filters?.verified && !vendor?.verified) {
      return false;
    }

    // Community-added filter
    if (filters?.addedByGroups && !vendor?.addedBy) {
      return false;
    }

    // Location filter (mock implementation)
    if (filters?.location && !vendor?.location?.toLowerCase()?.includes(filters?.location?.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort vendors with priority for community-added vendors
  const sortedVendors = [...filteredVendors]?.sort((a, b) => {
    // Priority sort: community-added vendors first when sorting by relevance
    if (sortBy === 'relevance') {
      if (a?.addedBy && !b?.addedBy) return -1;
      if (!a?.addedBy && b?.addedBy) return 1;
    }

    switch (sortBy) {
      case 'rating':
        return (b?.rating || 0) - (a?.rating || 0);
      case 'price-low':
        return (a?.priceRange?.min || 0) - (b?.priceRange?.min || 0);
      case 'price-high':
        return (b?.priceRange?.min || 0) - (a?.priceRange?.min || 0);
      case 'newest':
        // Sort by date added for community vendors, then by ID for others
        const aDate = a?.addedBy?.dateAdded ? new Date(a.addedBy.dateAdded)?.getTime() : 0;
        const bDate = b?.addedBy?.dateAdded ? new Date(b.addedBy.dateAdded)?.getTime() : 0;
        if (aDate || bDate) {
          return bDate - aDate;
        }
        return b?.id - a?.id;
      case 'distance':
        return a?.id - b?.id; // Mock distance sorting
      default:
        return 0; // Relevance with community priority handled above
    }
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRanges: [],
      location: '',
      radius: 25,
      availableDate: '',
      verified: false,
      addedByGroups: false
    });
  };

  const handleVendorProfileView = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleToggleFavorite = (vendorId) => {
    setFavoriteVendors(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites?.has(vendorId)) {
        newFavorites?.delete(vendorId);
      } else {
        newFavorites?.add(vendorId);
      }
      return newFavorites;
    });
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleMarkAsRead = (notificationId) => {
    console.log('Mark as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    console.log('Mark all as read');
  };

  const handleClearAllNotifications = () => {
    console.log('Clear all notifications');
  };

  // Close mobile filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event?.target?.closest('.filter-panel') && !event?.target?.closest('.filter-button')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // Calculate community statistics
  const communityAddedCount = mockVendors?.filter(vendor => vendor?.addedBy)?.length;
  const uniqueGroups = new Set(mockVendors?.filter(vendor => vendor?.addedBy)?.map(vendor => vendor?.addedBy?.groupName));

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader
        user={mockUser}
        notifications={mockNotifications}
        onNotificationClick={handleNotificationClick}
      />
      {/* Main Content */}
      <div className="pt-16">
        {/* Search Section */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                Community Marketplace
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Discover trusted vendors and service providers for your festival celebrations. 
                Connect with community-verified professionals who understand your cultural needs.
              </p>
              
              {/* Community Stats */}
              {communityAddedCount > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Users" size={16} className="text-primary" />
                      <span className="text-foreground">
                        <strong>{communityAddedCount}</strong> vendors added by community groups
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Building" size={16} className="text-primary" />
                      <span className="text-foreground">
                        From <strong>{uniqueGroups?.size}</strong> active groups
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              onClearRecent={() => {}}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* Category Navigation */}
        <CategoryNavigation
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  onClose={() => {}}
                  isOpen={true}
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Sorting Controls */}
              <SortingControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                resultsCount={sortedVendors?.length}
                className="mb-6"
              />

              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  iconName="Filter"
                  iconPosition="left"
                  className="filter-button"
                >
                  Filters
                  {(filters?.categories?.length > 0 || filters?.verified || filters?.location || filters?.addedByGroups) && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {filters?.categories?.length + (filters?.verified ? 1 : 0) + (filters?.location ? 1 : 0) + (filters?.addedByGroups ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>

              {/* Vendors Grid/List */}
              {sortedVendors?.length > 0 ? (
                <div className={
                  viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' :'space-y-4'
                }>
                  {sortedVendors?.map((vendor) => (
                    <VendorCard
                      key={vendor?.id}
                      vendor={vendor}
                      onViewProfile={handleVendorProfileView}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favoriteVendors?.has(vendor?.id)}
                      showCommunityBadge={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="mx-auto mb-4 text-muted opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No vendors found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to find more vendors.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Load More Button (for pagination) */}
              {sortedVendors?.length > 0 && sortedVendors?.length >= 12 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg">
                    Load More Vendors
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-card filter-panel">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
              className="h-full"
            />
          </div>
        </div>
      )}
      {/* Vendor Profile Modal */}
      <VendorProfileModal
        vendor={selectedVendor}
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedVendor ? favoriteVendors?.has(selectedVendor?.id) : false}
      />
    </div>
  );
};

export default CommunityMarketplace;