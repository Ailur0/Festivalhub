import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GroupCard = ({ group, userRole }) => {
  const navigate = useNavigate();

  const handleGroupClick = () => {
    navigate('/group-management');
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'admin': 'bg-primary text-primary-foreground',
      'organizer': 'bg-secondary text-secondary-foreground',
      'treasurer': 'bg-success text-success-foreground',
      'fund-collection': 'bg-warning text-warning-foreground',
      'management': 'bg-accent text-accent-foreground',
      'logistics': 'bg-muted text-muted-foreground',
      'decoration': 'bg-primary/20 text-primary',
      'prasad-preparation': 'bg-secondary/20 text-secondary',
      'cultural-events': 'bg-success/20 text-success',
      'general-member': 'bg-muted text-muted-foreground'
    };
    return roleColors?.[role] || 'bg-muted text-muted-foreground';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-md hover:festival-shadow-lg transition-festival cursor-pointer group"
         onClick={handleGroupClick}>
      {/* Group Image */}
      <div className="relative h-32 overflow-hidden rounded-t-lg">
        <Image
          src={group?.image}
          alt={group?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-festival"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(userRole)}`}>
            {userRole?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
          </span>
        </div>
        {group?.isNew && (
          <div className="absolute top-2 left-2">
            <span className="bg-accent text-accent-foreground px-2 py-1 text-xs font-medium rounded-full">
              New
            </span>
          </div>
        )}
      </div>
      {/* Group Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground font-heading line-clamp-1">
            {group?.name}
          </h3>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-foreground transition-micro" />
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {group?.description}
        </p>

        {/* Group Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={14} />
              <span>{group?.memberCount} members</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{group?.eventDate}</span>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-2">
          {/* Budget Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Budget Collection</span>
              <span className="font-medium text-foreground">{group?.budgetProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(group?.budgetProgress)}`}
                style={{ width: `${group?.budgetProgress}%` }}
              />
            </div>
          </div>

          {/* Planning Progress */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Planning Status</span>
              <span className="font-medium text-foreground">{group?.planningProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(group?.planningProgress)}`}
                style={{ width: `${group?.planningProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="DollarSign"
              iconSize={14}
              onClick={(e) => {
                e?.stopPropagation();
                navigate('/financial-dashboard');
              }}
            >
              Finances
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {group?.lastActivity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;