import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryNavigation = ({ 
  selectedCategory, 
  onCategoryChange, 
  className = "" 
}) => {
  const categories = [
    { id: 'all', label: 'All', icon: 'Grid3X3', color: 'text-primary' },
    { id: 'catering', label: 'Catering', icon: 'ChefHat', color: 'text-orange-600' },
    { id: 'decoration', label: 'Decoration', icon: 'Flower', color: 'text-pink-600' },
    { id: 'sound-lighting', label: 'Sound & Lighting', icon: 'Volume2', color: 'text-blue-600' },
    { id: 'transportation', label: 'Transport', icon: 'Car', color: 'text-green-600' },
    { id: 'supplies', label: 'Supplies', icon: 'Package', color: 'text-purple-600' },
    { id: 'photography', label: 'Photography', icon: 'Camera', color: 'text-indigo-600' },
    { id: 'security', label: 'Security', icon: 'Shield', color: 'text-red-600' }
  ];

  return (
    <div className={`bg-card border-b border-border ${className}`}>
      {/* Desktop Navigation */}
      <div className="hidden lg:block px-6 py-4">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-micro ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={category?.icon} 
                size={16} 
                className={selectedCategory === category?.id ? '' : category?.color}
              />
              <span>{category?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-lg min-w-[80px] transition-micro ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={category?.icon} 
                size={20} 
                className={selectedCategory === category?.id ? '' : category?.color}
              />
              <span className="text-xs font-medium text-center leading-tight">
                {category?.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;