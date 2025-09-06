import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddVendorModal = ({ isOpen, onClose, onAddVendor, groupInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    phone: '',
    email: '',
    location: '',
    startingPrice: '',
    website: '',
    specialties: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: '', label: 'Select Category' },
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Vendor name is required';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData?.description?.trim()?.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/?.test(formData?.phone?.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData?.startingPrice?.trim()) {
      newErrors.startingPrice = 'Starting price is required';
    } else if (isNaN(parseFloat(formData?.startingPrice)) || parseFloat(formData?.startingPrice) <= 0) {
      newErrors.startingPrice = 'Please enter a valid price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const vendorData = {
        ...formData,
        startingPrice: parseFloat(formData?.startingPrice),
        addedBy: {
          groupId: groupInfo?.id,
          groupName: groupInfo?.name,
          adminName: groupInfo?.adminName || 'Group Admin'
        },
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        dateAdded: new Date()?.toISOString(),
        status: 'pending_review'
      };

      await onAddVendor?.(vendorData);
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        description: '',
        phone: '',
        email: '',
        location: '',
        startingPrice: '',
        website: '',
        specialties: '',
        image: ''
      });
      
      onClose?.();
    } catch (error) {
      console.error('Error adding vendor:', error);
      setErrors({ submit: 'Failed to add vendor. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        category: '',
        description: '',
        phone: '',
        email: '',
        location: '',
        startingPrice: '',
        website: '',
        specialties: '',
        image: ''
      });
      setErrors({});
      onClose?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 festival-shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground font-heading">
                Add Community Vendor
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Add a trusted vendor to the community marketplace
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClose}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Vendor Name"
                  value={formData?.name}
                  onChange={(value) => handleInputChange('name', value)}
                  placeholder="e.g., Golden Catering Services"
                  error={errors?.name}
                  required
                />
              </div>
              
              <div>
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData?.category}
                  onChange={(value) => handleInputChange('category', value)}
                  error={errors?.category}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Provide a detailed description of the vendor's services, specialties, and experience..."
                rows={4}
                className={`w-full px-3 py-2 border rounded-md resize-none transition-colors ${
                  errors?.description 
                    ? 'border-destructive focus:border-destructive' :'border-border focus:border-primary'
                } focus:outline-none focus:ring-2 focus:ring-primary/20`}
              />
              {errors?.description && (
                <p className="text-sm text-destructive mt-1">{errors?.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Minimum 50 characters ({formData?.description?.length || 0}/50)
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData?.phone}
                  onChange={(value) => handleInputChange('phone', value)}
                  placeholder="+1 (555) 123-4567"
                  error={errors?.phone}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={formData?.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="contact@vendor.com"
                  error={errors?.email}
                  required
                />
              </div>
            </div>

            <div>
              <Input
                label="Location"
                value={formData?.location}
                onChange={(value) => handleInputChange('location', value)}
                placeholder="e.g., Mumbai, Maharashtra"
                error={errors?.location}
                required
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Starting Price (USD)"
                  type="number"
                  value={formData?.startingPrice}
                  onChange={(value) => handleInputChange('startingPrice', value)}
                  placeholder="299"
                  error={errors?.startingPrice}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Website (Optional)"
                  type="url"
                  value={formData?.website}
                  onChange={(value) => handleInputChange('website', value)}
                  placeholder="https://www.vendor.com"
                />
              </div>
            </div>

            <div>
              <Input
                label="Specialties (Optional)"
                value={formData?.specialties}
                onChange={(value) => handleInputChange('specialties', value)}
                placeholder="e.g., Traditional Indian festivals, Wedding ceremonies"
              />
            </div>

            <div>
              <Input
                label="Image URL (Optional)"
                type="url"
                value={formData?.image}
                onChange={(value) => handleInputChange('image', value)}
                placeholder="https://example.com/vendor-image.jpg"
              />
            </div>
          </div>

          {/* Admin Information */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Admin Information</span>
            </div>
            <p className="text-sm text-muted-foreground">
              This vendor will be added by <strong>{groupInfo?.adminName || 'Group Admin'}</strong> from the group 
              "<strong>{groupInfo?.name}</strong>" and will be visible to all community groups.
            </p>
          </div>

          {/* Error Message */}
          {errors?.submit && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{errors?.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
            >
              {isSubmitting ? 'Adding Vendor...' : 'Add to Community'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendorModal;