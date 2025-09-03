import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const GroupContextNavigation = ({ group, userRole = 'member' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const groupTabs = [
    {
      label: 'Management',
      path: '/group-management',
      icon: 'Users',
      permissions: ['admin', 'organizer', 'member']
    },
    {
      label: 'Finances',
      path: '/financial-dashboard',
      icon: 'DollarSign',
      permissions: ['admin', 'organizer', 'treasurer', 'member']
    },
    {
      label: 'Settings',
      path: '/group-settings-privacy',
      icon: 'Settings',
      permissions: ['admin', 'organizer']
    }
  ];

  const visibleTabs = groupTabs?.filter(tab => 
    tab?.permissions?.includes(userRole)
  );

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path);
  };

  const handleTabClick = (path) => {
    navigate(path);
  };

  if (!group) return null;

  return (
    <div className="sticky top-16 z-90 bg-card border-b border-border festival-shadow-sm">
      <div className="px-4 lg:px-6">
        {/* Group Info */}
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-accent-foreground)" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground font-heading">
                {group?.name || 'Festival Group'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {group?.type || 'Community Festival'} • {group?.memberCount || 0} members
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userRole === 'admin' ?'bg-primary/10 text-primary'
                : userRole === 'organizer' ?'bg-secondary/10 text-secondary' :'bg-muted text-muted-foreground'
            }`}>
              {userRole?.charAt(0)?.toUpperCase() + userRole?.slice(1)}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 py-2 overflow-x-auto">
          {visibleTabs?.map((tab) => (
            <button
              key={tab?.path}
              onClick={() => handleTabClick(tab?.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-micro ${
                isActivePath(tab?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupContextNavigation;