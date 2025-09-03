import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  notifications = [], 
  onNotificationClick, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClearAll 
}) => {
  const [filter, setFilter] = useState('all'); // all, unread, financial, group
  const [isVisible, setIsVisible] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'Bell' },
    { value: 'unread', label: 'Unread', icon: 'BellRing' },
    { value: 'financial', label: 'Financial', icon: 'DollarSign' },
    { value: 'group', label: 'Group', icon: 'Users' }
  ];

  const filteredNotifications = notifications?.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification?.read;
      case 'financial':
        return notification?.type === 'financial';
      case 'group':
        return notification?.type === 'group';
      default:
        return true;
    }
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'financial':
        return 'DollarSign';
      case 'group':
        return 'Users';
      case 'system':
        return 'Settings';
      case 'celebration':
        return 'PartyPopper';
      default:
        return priority === 'high' ? 'AlertCircle' : 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    switch (type) {
      case 'financial':
        return 'text-success';
      case 'group':
        return 'text-primary';
      case 'system':
        return 'text-muted-foreground';
      case 'celebration':
        return 'text-accent-foreground';
      default:
        return priority === 'high' ? 'text-warning' : 'text-muted-foreground';
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      onMarkAsRead?.(notification?.id);
    }
    onNotificationClick?.(notification);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg festival-shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Bell" size={20} className="text-foreground" />
          <h3 className="font-semibold text-foreground font-heading">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            iconName="Trash2"
            iconSize={14}
          />
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium transition-micro ${
              filter === option?.value
                ? 'text-primary border-b-2 border-primary bg-background' :'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={option?.icon} size={14} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer transition-micro ${
                !notification?.read ? 'bg-accent/5 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${getNotificationColor(notification?.type, notification?.priority)}`}>
                  <Icon 
                    name={getNotificationIcon(notification?.type, notification?.priority)} 
                    size={16} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <p className={`text-sm font-medium ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification?.title}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatTime(notification?.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification?.message}
                  </p>
                  {notification?.actionRequired && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={(e) => {
                          e?.stopPropagation();
                          notification?.onAction?.();
                        }}
                      >
                        {notification?.actionText || 'Take Action'}
                      </Button>
                    </div>
                  )}
                </div>
                {!notification?.read && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Icon 
              name={filter === 'unread' ? 'CheckCircle' : 'Bell'} 
              size={32} 
              className="mx-auto mb-3 opacity-50" 
            />
            <p className="text-sm font-medium mb-1">
              {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
            </p>
            <p className="text-xs">
              {filter === 'unread' ?'You have no unread notifications' :'Notifications will appear here when you have updates'
              }
            </p>
          </div>
        )}
      </div>
      {/* Footer Actions */}
      {filteredNotifications?.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="ExternalLink" size={14} className="mr-2" />
            View notification settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;