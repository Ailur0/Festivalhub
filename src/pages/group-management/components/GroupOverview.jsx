import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GroupOverview = ({ group, recentActivity }) => {
  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'member_joined': return 'UserPlus';
      case 'expense_added': return 'DollarSign';
      case 'role_assigned': return 'Shield';
      case 'budget_updated': return 'Calculator';
      case 'vendor_added': return 'Store';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'member_joined': return 'text-success';
      case 'expense_added': return 'text-warning';
      case 'role_assigned': return 'text-primary';
      case 'budget_updated': return 'text-secondary';
      case 'vendor_added': return 'text-accent-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Details Card */}
      <div className="bg-card border border-border rounded-lg p-6 festival-shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
          {/* Group Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden bg-accent/20">
              <Image
                src={group?.image || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"}
                alt={group?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Group Information */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground font-heading mb-2">
                {group?.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={16} />
                  <span>{group?.festivalType}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={16} />
                  <span>{group?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Users" size={16} />
                  <span>{group?.memberCount} members</span>
                </div>
              </div>
            </div>

            {/* Festival Dates */}
            <div className="bg-accent/10 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <Icon name="CalendarDays" size={18} className="mr-2" />
                Festival Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {formatDate(group?.startDate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {formatDate(group?.endDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {group?.description}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-lg font-bold text-primary">${group?.totalBudget}</div>
                <div className="text-xs text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-lg font-bold text-success">${group?.collectedAmount}</div>
                <div className="text-xs text-muted-foreground">Collected</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-lg font-bold text-warning">${group?.expenses}</div>
                <div className="text-xs text-muted-foreground">Expenses</div>
              </div>
              <div className="text-center p-3 bg-secondary/10 rounded-lg">
                <div className="text-lg font-bold text-secondary">${group?.remainingBalance}</div>
                <div className="text-xs text-muted-foreground">Balance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6 festival-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Recent Activity
          </h3>
          <button className="text-primary hover:text-primary/80 text-sm font-medium transition-micro">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentActivity?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-micro">
              <div className={`mt-1 ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.user}</span> {activity?.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(activity?.timestamp)}
                </p>
              </div>
              {activity?.amount && (
                <div className="text-sm font-medium text-success">
                  +${activity?.amount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupOverview;