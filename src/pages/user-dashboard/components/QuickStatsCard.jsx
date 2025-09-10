import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ title, value, subtitle, icon, trend, color = 'primary' }) => {
  const getColorClasses = (colorName) => {
    const colors = {
      primary: 'text-primary bg-primary/10',
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10',
      secondary: 'text-secondary bg-secondary/10',
      accent: 'text-accent-foreground bg-accent/10'
    };
    return colors?.[colorName] || colors?.primary;
  };

  const getTrendIcon = () => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 festival-shadow-sm hover:festival-shadow-md transition-festival">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground font-heading mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon name={icon} size={20} />
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center mt-3 pt-3 border-t border-border">
          <Icon 
            name={getTrendIcon()} 
            size={14} 
            className={`mr-1 ${getTrendColor()}`}
          />
          <span className={`text-xs font-medium ${getTrendColor()}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default QuickStatsCard;