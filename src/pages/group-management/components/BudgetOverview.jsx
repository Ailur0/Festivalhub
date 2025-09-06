import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetOverview = ({ budgetData, memberContributions, onAddExpense, onViewDetails }) => {
  const calculateProgress = (current, total) => {
    return total > 0 ? Math.min(100, (current / total) * 100) : 0;
  };

  const getContributionStatus = (member) => {
    const percentage = calculateProgress(member?.contributed, member?.expected);
    if (percentage >= 100) return { status: 'complete', color: 'text-success', bgColor: 'bg-success' };
    if (percentage >= 50) return { status: 'partial', color: 'text-warning', bgColor: 'bg-warning' };
    return { status: 'pending', color: 'text-error', bgColor: 'bg-error' };
  };

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold text-foreground">${budgetData?.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="Calculator" size={12} className="mr-1" />
              Auto-calculated per member
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collected</p>
              <p className="text-2xl font-bold text-success">${budgetData?.collected}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${calculateProgress(budgetData?.collected, budgetData?.total)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {calculateProgress(budgetData?.collected, budgetData?.total)?.toFixed(1)}% collected
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-2xl font-bold text-warning">${budgetData?.expenses}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Receipt" size={24} className="text-warning" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Icon name="ShoppingCart" size={12} className="mr-1" />
              {budgetData?.expenseCount} transactions
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className={`text-2xl font-bold ${budgetData?.balance >= 0 ? 'text-success' : 'text-error'}`}>
                ${Math.abs(budgetData?.balance)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${budgetData?.balance >= 0 ? 'bg-success/10' : 'bg-error/10'}`}>
              <Icon 
                name={budgetData?.balance >= 0 ? 'CheckCircle' : 'AlertCircle'} 
                size={24} 
                className={budgetData?.balance >= 0 ? 'text-success' : 'text-error'} 
              />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">
              {budgetData?.balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          iconName="Plus"
          iconPosition="left"
          onClick={onAddExpense}
        >
          Add Expense
        </Button>
        <Button
          variant="outline"
          iconName="Eye"
          iconPosition="left"
          onClick={() => onViewDetails?.('financial-dashboard')}
        >
          View Financial Details
        </Button>
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
        >
          Export Report
        </Button>
      </div>
      {/* Member Contributions */}
      <div className="bg-card border border-border rounded-lg p-6 festival-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Member Contributions
          </h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {memberContributions?.slice(0, 8)?.map((member) => {
            const statusInfo = getContributionStatus(member);
            const progress = calculateProgress(member?.contributed, member?.expected);
            
            return (
              <div key={member?.id} className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-micro">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-accent-foreground">
                    {member?.name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground truncate">{member?.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${statusInfo?.color}`}>
                        ${member?.contributed} / ${member?.expected}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${statusInfo?.bgColor}`} />
                    </div>
                  </div>
                  
                  <div className="mt-1">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${statusInfo?.bgColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {progress?.toFixed(1)}% • {member?.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {memberContributions?.length > 8 && (
          <div className="mt-4 pt-4 border-t border-border text-center">
            <Button variant="ghost" size="sm">
              View {memberContributions?.length - 8} more members
            </Button>
          </div>
        )}
      </div>
      {/* Budget Breakdown */}
      <div className="bg-card border border-border rounded-lg p-6 festival-shadow-md">
        <h3 className="text-lg font-semibold text-foreground font-heading mb-4">
          Budget Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetData?.categories?.map((category) => (
            <div key={category?.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${category?.color}`} />
                <span className="font-medium text-foreground">{category?.name}</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">${category?.allocated}</p>
                <p className="text-xs text-muted-foreground">
                  ${category?.spent} spent
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;