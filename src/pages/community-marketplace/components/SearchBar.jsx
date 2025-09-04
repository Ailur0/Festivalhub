import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  suggestions = [], 
  recentSearches = [],
  onClearRecent,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const mockSuggestions = [
    { id: 1, text: "Catering services", type: "category", icon: "ChefHat" },
    { id: 2, text: "Decoration for Diwali", type: "search", icon: "Search" },
    { id: 3, text: "Sound system rental", type: "category", icon: "Volume2" },
    { id: 4, text: "Photography services", type: "category", icon: "Camera" },
    { id: 5, text: "Flower decoration", type: "search", icon: "Search" }
  ];

  const mockRecentSearches = [
    { id: 1, text: "Mandap decoration", timestamp: "2025-08-28" },
    { id: 2, text: "Traditional catering", timestamp: "2025-08-27" },
    { id: 3, text: "Sound system", timestamp: "2025-08-26" }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0 || mockRecentSearches?.length > 0);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(searchQuery?.length > 0 || mockRecentSearches?.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion?.text);
    onSearch(suggestion?.text);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  const handleRecentSearchClick = (search) => {
    onSearchChange(search?.text);
    onSearch(search?.text);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery);
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const handleClearSearch = () => {
    onSearchChange('');
    inputRef?.current?.focus();
  };

  const filteredSuggestions = mockSuggestions?.filter(suggestion =>
    suggestion?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className={`relative flex items-center bg-card border border-border rounded-lg transition-festival ${
          isExpanded ? 'festival-shadow-md' : 'festival-shadow-sm hover:festival-shadow-md'
        }`}>
          <div className="flex items-center pl-4">
            <Icon name="Search" size={20} className="text-muted-foreground" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Search vendors, services, or categories..."
            className="flex-1 px-4 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-2 text-muted-foreground hover:text-foreground transition-micro"
            >
              <Icon name="X" size={16} />
            </button>
          )}
          
          <div className="pr-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              iconName="Search"
              iconSize={16}
              disabled={!searchQuery?.trim()}
            >
              Search
            </Button>
          </div>
        </div>
      </form>
      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg festival-shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchQuery?.length > 0 ? (
            <>
              {/* Search Suggestions */}
              {filteredSuggestions?.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Suggestions
                  </div>
                  {filteredSuggestions?.map((suggestion) => (
                    <button
                      key={suggestion?.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-micro"
                    >
                      <Icon 
                        name={suggestion?.icon} 
                        size={16} 
                        className="text-muted-foreground" 
                      />
                      <span className="text-sm text-foreground">{suggestion?.text}</span>
                      <div className="ml-auto">
                        <Icon name="ArrowUpLeft" size={14} className="text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Recent Searches */}
              {mockRecentSearches?.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Recent Searches
                    </div>
                    <button
                      onClick={onClearRecent}
                      className="text-xs text-muted-foreground hover:text-foreground transition-micro"
                    >
                      Clear all
                    </button>
                  </div>
                  {mockRecentSearches?.map((search) => (
                    <button
                      key={search?.id}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-micro group"
                    >
                      <Icon name="Clock" size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground flex-1">{search?.text}</span>
                      <Icon 
                        name="ArrowUpLeft" 
                        size={14} 
                        className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-micro" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {searchQuery?.length > 0 && filteredSuggestions?.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}

          {/* Popular Categories */}
          {searchQuery?.length === 0 && mockRecentSearches?.length === 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Popular Categories
              </div>
              {mockSuggestions?.slice(0, 4)?.map((suggestion) => (
                <button
                  key={suggestion?.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-micro"
                >
                  <Icon 
                    name={suggestion?.icon} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                  <span className="text-sm text-foreground">{suggestion?.text}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;