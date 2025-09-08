import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'member-joined': 'UserPlus',
      'expense-added': 'DollarSign',
      'milestone': 'Trophy',
      'group-created': 'Plus',
      'payment-received': 'CreditCard',
      'event-scheduled': 'Calendar',
      'role-assigned': 'Shield',
      'budget-updated': 'Calculator'
    };
    return icons?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colors = {
      'member-joined': 'text-success bg-success/10',
      'expense-added': 'text-warning bg-warning/10',
      'milestone': 'text-accent-foreground bg-accent/10',
      'group-created': 'text-primary bg-primary/10',
      'payment-received': 'text-success bg-success/10',
      'event-scheduled': 'text-secondary bg-secondary/10',
      'role-assigned': 'text-primary bg-primary/10',
      'budget-updated': 'text-warning bg-warning/10'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/10';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground font-heading">Recent Activity</h3>
          <Icon name="Activity" size={18} className="text-muted-foreground" />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {activities?.length > 0 ? (
          activities?.map((activity) => (
            <div key={activity?.id} className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-micro">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={14} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity?.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity?.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {activity?.groupName}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity?.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {activity?.avatar && (
                      <div className="ml-3 flex-shrink-0">
                        <Image
                          src={activity?.avatar}
                          alt={activity?.user || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  
                  {activity?.amount && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      <Icon name="DollarSign" size={12} className="mr-1" />
                      ${activity?.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Icon name="Activity" size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No recent activity</p>
            <p className="text-xs">Activity from your groups will appear here</p>
          </div>
        )}
      </div>
      {activities?.length > 0 && (
        <div className="p-3 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-micro">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;