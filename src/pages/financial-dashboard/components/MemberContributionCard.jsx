import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MemberContributionCard = ({ member, onContactMember, onMarkAsPaid }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'overdue':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'overdue':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const progressPercentage = (member?.paidAmount / member?.totalAmount) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {member?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-foreground">{member?.name}</h4>
            <p className="text-sm text-muted-foreground">{member?.role}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(member?.status)}`}>
          <Icon name={getStatusIcon(member?.status)} size={12} />
          <span>{member?.status?.charAt(0)?.toUpperCase() + member?.status?.slice(1)}</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Contribution Progress</span>
          <span className="font-medium text-foreground">
            {formatAmount(member?.paidAmount)} / {formatAmount(member?.totalAmount)}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              member?.status === 'paid' ? 'bg-success' : 
              member?.status === 'overdue' ? 'bg-error' : 'bg-warning'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {progressPercentage?.toFixed(0)}% completed
        </p>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          iconName="Phone"
          iconPosition="left"
          onClick={() => onContactMember(member, 'phone')}
          className="flex-1"
        >
          Call
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Mail"
          iconPosition="left"
          onClick={() => onContactMember(member, 'email')}
          className="flex-1"
        >
          Email
        </Button>
        {member?.status !== 'paid' && (
          <Button
            variant="default"
            size="sm"
            iconName="Check"
            onClick={() => onMarkAsPaid(member?.id)}
          />
        )}
      </div>
    </div>
  );
};

export default MemberContributionCard;