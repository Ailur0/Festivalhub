import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const SearchBar = ({ onSearch, placeholder = "Search groups..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <div className="relative">
      <div className={`relative transition-all duration-200 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon 
            name="Search" 
            size={18} 
            className={`transition-colors ${
              isFocused ? 'text-primary' : 'text-muted-foreground'
            }`}
          />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            isFocused ? 'festival-shadow-md' : 'festival-shadow-sm'
          }`}
        />
        
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        )}
      </div>
      {/* Search suggestions could go here */}
      {isFocused && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg festival-shadow-lg z-20">
          <div className="p-3">
            <p className="text-xs text-muted-foreground mb-2">Quick filters:</p>
            <div className="flex flex-wrap gap-2">
              {['Diwali', 'Holi', 'Navratri', 'Recent']?.map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    setSearchTerm(filter);
                    onSearch?.(filter);
                  }}
                  className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;