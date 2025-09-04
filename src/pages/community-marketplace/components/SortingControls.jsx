import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortingControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  resultsCount = 0,
  className = "" 
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions = [
    { id: 'relevance', label: 'Relevance', icon: 'Target' },
    { id: 'rating', label: 'Highest Rated', icon: 'Star' },
    { id: 'distance', label: 'Nearest First', icon: 'MapPin' },
    { id: 'price-low', label: 'Price: Low to High', icon: 'TrendingUp' },
    { id: 'price-high', label: 'Price: High to Low', icon: 'TrendingDown' },
    { id: 'newest', label: 'Newest First', icon: 'Clock' }
  ];

  const viewModes = [
    { id: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { id: 'list', icon: 'List', label: 'List View' }
  ];

  const currentSort = sortOptions?.find(option => option?.id === sortBy) || sortOptions?.[0];

  const handleSortSelect = (sortId) => {
    onSortChange(sortId);
    setShowSortMenu(false);
  };

  return (
    <div className={`flex items-center justify-between bg-card border-b border-border px-4 lg:px-6 py-3 ${className}`}>
      {/* Results Count */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resultsCount?.toLocaleString()}</span> vendors found
        </div>
      </div>
      {/* Controls */}
      <div className="flex items-center space-x-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSortMenu(!showSortMenu)}
            iconName={currentSort?.icon}
            iconPosition="left"
            iconSize={16}
            className="min-w-[140px] justify-between"
          >
            <span className="hidden sm:inline">{currentSort?.label}</span>
            <span className="sm:hidden">Sort</span>
            <Icon name="ChevronDown" size={16} className="ml-2" />
          </Button>

          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg festival-shadow-lg z-50">
              <div className="p-1">
                {sortOptions?.map((option) => (
                  <button
                    key={option?.id}
                    onClick={() => handleSortSelect(option?.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-md transition-micro ${
                      sortBy === option?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={option?.icon} size={16} />
                    <span className="text-sm">{option?.label}</span>
                    {sortBy === option?.id && (
                      <Icon name="Check" size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
          {viewModes?.map((mode) => (
            <button
              key={mode?.id}
              onClick={() => onViewModeChange(mode?.id)}
              className={`flex items-center justify-center w-10 h-8 transition-micro ${
                viewMode === mode?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={mode?.label}
            >
              <Icon name={mode?.icon} size={16} />
            </button>
          ))}
        </div>

        {/* Filter Button (Mobile) */}
        <Button
          variant="outline"
          size="sm"
          iconName="Filter"
          iconSize={16}
          className="lg:hidden"
        >
          <span className="hidden sm:inline ml-2">Filters</span>
        </Button>
      </div>
      {/* Sort Menu Overlay */}
      {showSortMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
};

export default SortingControls;