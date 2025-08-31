import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BudgetCalculator = ({ totalBudget, memberCount, onBudgetUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(totalBudget);

  const perMemberAmount = memberCount > 0 ? totalBudget / memberCount : 0;

  const handleSave = () => {
    onBudgetUpdate(newBudget);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewBudget(totalBudget);
    setIsEditing(false);
  };

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 festival-shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
            <Icon name="Calculator" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground font-heading">Budget Calculator</h3>
            <p className="text-sm text-muted-foreground">Automated per-member calculation</p>
          </div>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Edit Budget
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <Input
            label="Total Budget"
            type="number"
            value={newBudget}
            onChange={(e) => setNewBudget(Number(e?.target?.value))}
            placeholder="Enter total budget"
          />
          <div className="flex space-x-2">
            <Button variant="default" size="sm" onClick={handleSave}>
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
            <p className="text-xl font-bold text-foreground font-heading">
              {formatAmount(totalBudget)}
            </p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Members</p>
            <p className="text-xl font-bold text-foreground font-heading">
              {memberCount}
            </p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-primary mb-1">Per Member</p>
            <p className="text-xl font-bold text-primary font-heading">
              {formatAmount(perMemberAmount)}
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent mt-0.5" />
          <p className="text-sm text-accent-foreground">
            Budget automatically recalculates when members are added or removed from the group.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;