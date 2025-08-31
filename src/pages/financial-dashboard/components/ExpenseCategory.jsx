import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpenseCategory = ({ category, expenses, onAddExpense, onEditExpense, onDeleteExpense, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcons = {
    'Decoration': 'Palette',
    'Prasad': 'Apple',
    'Pooja Items': 'Flame',
    'Logistics': 'Truck',
    'Cultural Events': 'Music',
    'Miscellaneous': 'MoreHorizontal'
  };

  const categoryColors = {
    'Decoration': 'text-purple-600 bg-purple-50 border-purple-200',
    'Prasad': 'text-green-600 bg-green-50 border-green-200',
    'Pooja Items': 'text-orange-600 bg-orange-50 border-orange-200',
    'Logistics': 'text-blue-600 bg-blue-50 border-blue-200',
    'Cultural Events': 'text-pink-600 bg-pink-50 border-pink-200',
    'Miscellaneous': 'text-gray-600 bg-gray-50 border-gray-200'
  };

  const totalAmount = expenses?.reduce((sum, expense) => sum + expense?.amount, 0);

  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canManageExpenses = ['admin', 'organizer', 'treasurer']?.includes(userRole);

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-micro"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors?.[category] || categoryColors?.['Miscellaneous']}`}>
            <Icon name={categoryIcons?.[category] || 'MoreHorizontal'} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{category}</h3>
            <p className="text-sm text-muted-foreground">
              {expenses?.length} expense{expenses?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="font-semibold text-foreground">{formatAmount(totalAmount)}</p>
            <p className="text-xs text-muted-foreground">Total spent</p>
          </div>
          <Icon
            name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            size={20}
            className="text-muted-foreground"
          />
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-border">
          {expenses?.length > 0 ? (
            <div className="divide-y divide-border">
              {expenses?.map((expense) => (
                <div key={expense?.id} className="p-4 hover:bg-muted/20 transition-micro">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{expense?.description}</h4>
                        <span className="font-semibold text-foreground">
                          {formatAmount(expense?.amount)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} />
                          <span>{formatDate(expense?.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="User" size={14} />
                          <span>{expense?.assignedTo}</span>
                        </div>
                      </div>
                    </div>
                    {canManageExpenses && (
                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Edit"
                          onClick={() => onEditExpense(expense)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => onDeleteExpense(expense?.id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Icon name="Receipt" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No expenses recorded yet</p>
            </div>
          )}

          {canManageExpenses && (
            <div className="p-4 border-t border-border bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onAddExpense(category)}
                fullWidth
              >
                Add {category} Expense
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseCategory;