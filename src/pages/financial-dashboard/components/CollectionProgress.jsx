import React from 'react';
import Icon from '../../../components/AppIcon';

const CollectionProgress = ({ totalBudget, collectedAmount, memberCount, paidMembers }) => {
  const progressPercentage = totalBudget > 0 ? (collectedAmount / totalBudget) * 100 : 0;
  const memberProgressPercentage = memberCount > 0 ? (paidMembers / memberCount) * 100 : 0;

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const getProjectedDate = () => {
    const currentRate = paidMembers / memberCount;
    if (currentRate === 0) return 'Not available';
    
    const daysToComplete = Math.ceil((memberCount - paidMembers) / (currentRate * 7));
    const projectedDate = new Date();
    projectedDate?.setDate(projectedDate?.getDate() + daysToComplete);
    
    return projectedDate?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const milestones = [
    { percentage: 25, label: '25%', reached: progressPercentage >= 25 },
    { percentage: 50, label: '50%', reached: progressPercentage >= 50 },
    { percentage: 75, label: '75%', reached: progressPercentage >= 75 },
    { percentage: 100, label: '100%', reached: progressPercentage >= 100 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 festival-shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-foreground font-heading">Collection Progress</h3>
          <p className="text-sm text-muted-foreground">Track funding milestones</p>
        </div>
      </div>
      {/* Amount Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Amount Collected</span>
          <span className="text-sm font-bold text-foreground">
            {formatAmount(collectedAmount)} / {formatAmount(totalBudget)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 mb-2">
          <div
            className="bg-success h-3 rounded-full transition-all duration-500 relative"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          >
            <div className="absolute right-0 top-0 h-3 w-1 bg-success-foreground/20 rounded-r-full" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {progressPercentage?.toFixed(1)}% of target amount collected
        </p>
      </div>
      {/* Member Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Members Contributed</span>
          <span className="text-sm font-bold text-foreground">
            {paidMembers} / {memberCount}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 mb-2">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(memberProgressPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {memberProgressPercentage?.toFixed(1)}% of members have contributed
        </p>
      </div>
      {/* Milestones */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Milestones</h4>
        <div className="flex justify-between items-center">
          {milestones?.map((milestone, index) => (
            <div key={milestone?.percentage} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  milestone?.reached
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {milestone?.reached ? (
                  <Icon name="Check" size={14} />
                ) : (
                  milestone?.label
                )}
              </div>
              <span className={`text-xs mt-1 ${
                milestone?.reached ? 'text-success font-medium' : 'text-muted-foreground'
              }`}>
                {milestone?.label}
              </span>
              {index < milestones?.length - 1 && (
                <div className="absolute w-full h-0.5 bg-muted top-4 left-4 -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Projected Completion */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Projected Completion</span>
          </div>
          <span className="text-sm font-bold text-foreground">
            {getProjectedDate()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Based on current contribution rate
        </p>
      </div>
    </div>
  );
};

export default CollectionProgress;