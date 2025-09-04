import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VendorProfileModal = ({ vendor, isOpen, onClose, onToggleFavorite, isFavorite = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', photos: [] });

  if (!isOpen || !vendor) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'services', label: 'Services', icon: 'Package' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'gallery', label: 'Gallery', icon: 'Image' }
  ];

  const mockReviews = [
    {
      id: 1,
      user: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      date: "2025-08-15",
      comment: `Excellent service for our Diwali celebration! The decoration was absolutely stunning and the team was very professional. They understood our requirements perfectly and delivered beyond expectations.`,
      photos: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400"
      ],
      helpful: 12
    },
    {
      id: 2,
      user: "Rajesh Kumar",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4,
      date: "2025-08-10",
      comment: `Good quality catering service. Food was delicious and presentation was great. Only minor issue was slight delay in setup, but overall very satisfied with the service.`,
      photos: [],
      helpful: 8
    },
    {
      id: 3,
      user: "Meera Patel",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 5,
      date: "2025-08-05",
      comment: `Outstanding photography service! Captured all the beautiful moments of our Ganesh Chaturthi celebration. The photographer was very creative and professional.`,
      photos: [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
      ],
      helpful: 15
    }
  ];

  const mockServices = [
    {
      id: 1,
      name: "Premium Decoration Package",
      description: "Complete festival decoration including mandap, lighting, flowers, and traditional elements",
      price: "$1,200 - $2,500",
      duration: "Full day setup",
      includes: ["Mandap decoration", "Lighting setup", "Fresh flowers", "Traditional elements", "Cleanup service"]
    },
    {
      id: 2,
      name: "Basic Decoration Package",
      description: "Essential decoration elements for smaller celebrations",
      price: "$500 - $1,000",
      duration: "Half day setup",
      includes: ["Basic mandap", "Simple lighting", "Artificial flowers", "Cleanup service"]
    },
    {
      id: 3,
      name: "Custom Decoration",
      description: "Tailored decoration based on specific requirements and theme",
      price: "Quote on request",
      duration: "Variable",
      includes: ["Custom design", "Premium materials", "Professional setup", "Photography support"]
    }
  ];

  const renderStars = (rating, size = 16, interactive = false, onRatingChange = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
        disabled={!interactive}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-micro' : 'cursor-default'}
      >
        <Icon
          name="Star"
          size={size}
          className={index < Math.floor(rating) ? 'text-accent fill-accent' : 'text-muted'}
        />
      </button>
    ));
  };

  const handleContact = (type) => {
    if (type === 'call') {
      window.open(`tel:${vendor?.phone}`, '_self');
    } else if (type === 'email') {
      window.open(`mailto:${vendor?.email}`, '_self');
    } else if (type === 'message') {
      window.open(`sms:${vendor?.phone}`, '_self');
    }
  };

  const handleImageNavigation = (direction) => {
    const totalImages = vendor?.gallery?.length || 0;
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const handleReviewSubmit = () => {
    // Mock review submission
    console.log('Submitting review:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, comment: '', photos: [] });
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg festival-shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Store" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground font-heading">
                {vendor?.name}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  {renderStars(vendor?.rating)}
                  <span className="text-sm font-medium text-foreground ml-1">
                    {vendor?.rating}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({vendor?.reviewCount} reviews)
                  </span>
                </div>
                {vendor?.verified && (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Heart"
              iconSize={20}
              onClick={() => onToggleFavorite(vendor?.id)}
              className={isFavorite ? 'text-error' : 'text-muted-foreground'}
            />
            <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/30 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium whitespace-nowrap transition-micro ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary bg-background' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Hero Image */}
              <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={vendor?.image}
                  alt={vendor?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 font-heading">About</h3>
                  <p className="text-muted-foreground mb-4">{vendor?.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="MapPin" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">{vendor?.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">Available for booking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="DollarSign" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        Starting from ${vendor?.priceRange?.min}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3 font-heading">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Phone" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{vendor?.phone}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Phone"
                        onClick={() => handleContact('call')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="Mail" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">{vendor?.email}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Mail"
                        onClick={() => handleContact('email')}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">Send Message</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MessageCircle"
                        onClick={() => handleContact('message')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground font-heading">Services & Packages</h3>
                <Button variant="outline" size="sm" iconName="Download">
                  Download Brochure
                </Button>
              </div>
              
              {mockServices?.map((service) => (
                <div key={service?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{service?.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{service?.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{service?.price}</div>
                      <div className="text-xs text-muted-foreground">{service?.duration}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-foreground mb-2">Includes:</h5>
                    <div className="grid grid-cols-2 gap-1">
                      {service?.includes?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={14} className="text-success" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" fullWidth>
                      Get Quote
                    </Button>
                    <Button variant="default" size="sm" fullWidth>
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground font-heading">Customer Reviews</h3>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Plus"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Write Review
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="border border-border rounded-lg p-4 bg-muted/30">
                  <h4 className="font-medium text-foreground mb-3">Write a Review</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                      <div className="flex items-center space-x-1">
                        {renderStars(newReview?.rating, 20, true, (rating) => 
                          setNewReview(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    <Input
                      label="Your Review"
                      type="text"
                      placeholder="Share your experience..."
                      value={newReview?.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e?.target?.value }))}
                    />
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                      <Button variant="default" size="sm" onClick={handleReviewSubmit}>
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews?.map((review) => (
                  <div key={review?.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Image
                        src={review?.avatar}
                        alt={review?.user}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h5 className="font-medium text-foreground">{review?.user}</h5>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {renderStars(review?.rating, 14)}
                              </div>
                              <span className="text-xs text-muted-foreground">{review?.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{review?.comment}</p>
                        
                        {review?.photos?.length > 0 && (
                          <div className="flex space-x-2 mb-3">
                            {review?.photos?.map((photo, index) => (
                              <Image
                                key={index}
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro">
                            <Icon name="ThumbsUp" size={14} />
                            <span className="text-xs">Helpful ({review?.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-micro">
                            <Icon name="MessageCircle" size={14} />
                            <span className="text-xs">Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground font-heading">Photo Gallery</h3>
              
              {/* Main Image */}
              <div className="relative h-80 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={vendor?.gallery?.[currentImageIndex] || vendor?.image}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {vendor?.gallery && vendor?.gallery?.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-micro hover:bg-card"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-micro hover:bg-card"
                    >
                      <Icon name="ChevronRight" size={20} />
                    </button>
                    
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">
                        {currentImageIndex + 1} / {vendor?.gallery?.length}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Grid */}
              {vendor?.gallery && vendor?.gallery?.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {vendor?.gallery?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 rounded-lg overflow-hidden transition-micro ${
                        index === currentImageIndex ? 'ring-2 ring-primary' : 'hover:opacity-80'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Starting from <span className="font-semibold text-foreground">${vendor?.priceRange?.min}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" iconName="MessageCircle" onClick={() => handleContact('message')}>
              Message
            </Button>
            <Button variant="default" iconName="Phone" onClick={() => handleContact('call')}>
              Call Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileModal;