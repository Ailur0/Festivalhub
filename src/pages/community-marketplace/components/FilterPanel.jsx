import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isOpen = true, 
  onClose, 
  className = '' 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    location: true,
    features: true,
    community: true  // New community section
  });

  const categories = [
    { id: 'decoration', name: 'Decoration', icon: 'Palette' },
    { id: 'catering', name: 'Catering', icon: 'ChefHat' },
    { id: 'sound-lighting', name: 'Sound & Lighting', icon: 'Volume2' },
    { id: 'photography', name: 'Photography', icon: 'Camera' },
    { id: 'transportation', name: 'Transportation', icon: 'Truck' },
    { id: 'supplies', name: 'Supplies', icon: 'Package' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'cleaning', name: 'Cleaning', icon: 'Sparkles' }
  ];

  const priceRanges = [
    { id: 'under-100', name: 'Under $100', min: 0, max: 100 },
    { id: '100-500', name: '$100 - $500', min: 100, max: 500 },
    { id: '500-1000', name: '$500 - $1,000', min: 500, max: 1000 },
    { id: '1000-2000', name: '$1,000 - $2,000', min: 1000, max: 2000 },
    { id: 'over-2000', name: 'Over $2,000', min: 2000, max: null }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = filters?.categories?.includes(categoryId)
      ? filters?.categories?.filter(id => id !== categoryId)
      : [...(filters?.categories || []), categoryId];
    
    onFiltersChange?.({
      ...filters,
      categories: updatedCategories
    });
  };

  const handlePriceRangeChange = (rangeId) => {
    const updatedRanges = filters?.priceRanges?.includes(rangeId)
      ? filters?.priceRanges?.filter(id => id !== rangeId)
      : [...(filters?.priceRanges || []), rangeId];
    
    onFiltersChange?.({
      ...filters,
      priceRanges: updatedRanges
    });
  };

  const handleLocationChange = (value) => {
    onFiltersChange?.({
      ...filters,
      location: value
    });
  };

  const handleRadiusChange = (value) => {
    onFiltersChange?.({
      ...filters,
      radius: parseInt(value) || 25
    });
  };

  const handleDateChange = (value) => {
    onFiltersChange?.({
      ...filters,
      availableDate: value
    });
  };

  const handleVerifiedChange = (checked) => {
    onFiltersChange?.({
      ...filters,
      verified: checked
    });
  };

  const handleCommunityAddedChange = (checked) => {
    onFiltersChange?.({
      ...filters,
      addedByGroups: checked
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.categories?.length > 0) count += filters?.categories?.length;
    if (filters?.priceRanges?.length > 0) count += filters?.priceRanges?.length;
    if (filters?.location) count += 1;
    if (filters?.verified) count += 1;
    if (filters?.addedByGroups) count += 1;
    return count;
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-border last:border-b-0 pb-4 last:pb-0">
      <button
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <h4 className="font-medium text-foreground">{title}</h4>
        <Icon 
          name={expandedSections?.[section] ? 'ChevronUp' : 'ChevronDown'} 
          size={16}
          className="text-muted-foreground"
        />
      </button>
      
      {expandedSections?.[section] && (
        <div className="mt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-foreground">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          )}
        </div>
      </div>
      <div className="space-y-6">
        {/* Categories */}
        <FilterSection title="Categories" section="categories">
          <div className="space-y-2">
            {categories?.map((category) => (
              <Checkbox
                key={category?.id}
                checked={filters?.categories?.includes(category?.id)}
                onChange={() => handleCategoryChange(category?.id)}
                label={
                  <div className="flex items-center space-x-2">
                    <Icon name={category?.icon} size={16} className="text-muted-foreground" />
                    <span>{category?.name}</span>
                  </div>
                }
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" section="price">
          <div className="space-y-2">
            {priceRanges?.map((range) => (
              <Checkbox
                key={range?.id}
                checked={filters?.priceRanges?.includes(range?.id)}
                onChange={() => handlePriceRangeChange(range?.id)}
                label={range?.name}
              />
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location" section="location">
          <div className="space-y-3">
            <Input
              placeholder="Enter city or state"
              value={filters?.location || ''}
              onChange={handleLocationChange}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Radius: {filters?.radius || 25} miles
              </label>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={filters?.radius || 25}
                onChange={(e) => handleRadiusChange(e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 miles</span>
                <span>100+ miles</span>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Community Filters */}
        <FilterSection title="Community" section="community">
          <div className="space-y-2">
            <Checkbox
              checked={filters?.addedByGroups || false}
              onChange={handleCommunityAddedChange}
              label={
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <div>
                    <div className="font-medium">Community Added</div>
                    <div className="text-xs text-muted-foreground">
                      Vendors added by group admins
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </FilterSection>

        {/* Features */}
        <FilterSection title="Features" section="features">
          <div className="space-y-3">
            <Checkbox
              checked={filters?.verified || false}
              onChange={handleVerifiedChange}
              label={
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span>Verified Only</span>
                </div>
              }
            />
            <div>
              <Input
                type="date"
                label="Available Date"
                value={filters?.availableDate || ''}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </FilterSection>
      </div>
      {/* Apply Filters Button (Mobile) */}
      {onClose && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            fullWidth
            onClick={onClose}
          >
            Apply Filters ({getActiveFiltersCount()})
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;