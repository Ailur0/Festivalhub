import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationPreferencesSection = ({ preferences, onPreferencesChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const notificationCategories = [
    {
      id: 'financial',
      label: 'Financial Updates',
      icon: 'DollarSign',
      color: 'text-success',
      notifications: [
        { id: 'budgetChanges', label: 'Budget Changes', description: 'When budget is updated or recalculated' },
        { id: 'newExpenses', label: 'New Expenses', description: 'When expenses are added or modified' },
        { id: 'contributionUpdates', label: 'Contribution Updates', description: 'When member contributions are recorded' },
        { id: 'paymentReminders', label: 'Payment Reminders', description: 'Automated reminders for pending contributions' }
      ]
    },
    {
      id: 'group',
      label: 'Group Activities',
      icon: 'Users',
      color: 'text-primary',
      notifications: [
        { id: 'newMembers', label: 'New Members', description: 'When someone joins the group' },
        { id: 'memberUpdates', label: 'Member Updates', description: 'When member roles or details change' },
        { id: 'groupAnnouncements', label: 'Group Announcements', description: 'Important group-wide messages' },
        { id: 'roleAssignments', label: 'Role Assignments', description: 'When roles are assigned or changed' }
      ]
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: 'Store',
      color: 'text-secondary',
      notifications: [
        { id: 'newVendors', label: 'New Vendors', description: 'When vendors are added to marketplace' },
        { id: 'vendorUpdates', label: 'Vendor Updates', description: 'When vendor information changes' },
        { id: 'reviewAlerts', label: 'Review Alerts', description: 'When new reviews are posted' },
        { id: 'recommendedServices', label: 'Recommended Services', description: 'Personalized vendor recommendations' }
      ]
    },
    {
      id: 'system',
      label: 'System & Security',
      icon: 'Shield',
      color: 'text-warning',
      notifications: [
        { id: 'securityAlerts', label: 'Security Alerts', description: 'Login attempts and security events' },
        { id: 'systemUpdates', label: 'System Updates', description: 'Platform updates and maintenance' },
        { id: 'dataExports', label: 'Data Exports', description: 'When data export requests are completed' },
        { id: 'backupAlerts', label: 'Backup Alerts', description: 'Data backup status notifications' }
      ]
    }
  ];

  const deliveryMethods = [
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'push', label: 'Push Notifications', icon: 'Bell' },
    { id: 'sms', label: 'SMS', icon: 'MessageSquare' }
  ];

  const handleNotificationToggle = (categoryId, notificationId, method) => {
    const updatedPreferences = { ...preferences };
    if (!updatedPreferences?.[categoryId]) {
      updatedPreferences[categoryId] = {};
    }
    if (!updatedPreferences?.[categoryId]?.[notificationId]) {
      updatedPreferences[categoryId][notificationId] = {};
    }
    updatedPreferences[categoryId][notificationId][method] = 
      !updatedPreferences?.[categoryId]?.[notificationId]?.[method];
    onPreferencesChange(updatedPreferences);
  };

  const isNotificationEnabled = (categoryId, notificationId, method) => {
    return preferences?.[categoryId]?.[notificationId]?.[method] || false;
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground font-heading">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground">Configure how you receive updates</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-6">
          {notificationCategories?.map((category) => (
            <div key={category?.id} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name={category?.icon} size={18} className={category?.color} />
                <h4 className="font-medium text-foreground">{category?.label}</h4>
              </div>
              
              <div className="space-y-3 ml-6">
                {category?.notifications?.map((notification) => (
                  <div key={notification?.id} className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{notification?.label}</p>
                      <p className="text-xs text-muted-foreground">{notification?.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-4">
                      {deliveryMethods?.map((method) => (
                        <div key={method?.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={isNotificationEnabled(category?.id, notification?.id, method?.id)}
                            onChange={() => handleNotificationToggle(category?.id, notification?.id, method?.id)}
                            size="sm"
                          />
                          <div className="flex items-center space-x-1">
                            <Icon name={method?.icon} size={14} className="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{method?.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 p-3 bg-accent/10 rounded-md border border-accent/20">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
              <div>
                <p className="text-xs font-medium text-accent-foreground">Notification Settings</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can update these preferences anytime. Critical security notifications cannot be disabled.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPreferencesSection;