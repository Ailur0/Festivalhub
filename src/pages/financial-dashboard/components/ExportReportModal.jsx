import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ExportReportModal = ({ isOpen, onClose, onExport, financialData }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'pdf',
    includeOverview: true,
    includeContributions: true,
    includeExpenses: true,
    includeProgress: true,
    dateRange: 'all'
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleExport = () => {
    const reportData = {
      ...financialData,
      exportOptions,
      generatedAt: new Date()?.toISOString(),
      reportTitle: `Financial Report - ${new Date()?.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`
    };

    onExport(reportData);
    onClose();
  };

  const handleOptionChange = (field, value) => {
    setExportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg festival-shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
              <Icon name="Download" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-foreground font-heading">Export Financial Report</h2>
              <p className="text-sm text-muted-foreground">Generate comprehensive financial summary</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <Select
              label="Export Format"
              options={formatOptions}
              value={exportOptions?.format}
              onChange={(value) => handleOptionChange('format', value)}
              description="Choose your preferred file format"
            />
          </div>

          {/* Date Range */}
          <div>
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={exportOptions?.dateRange}
              onChange={(value) => handleOptionChange('dateRange', value)}
              description="Select the time period for the report"
            />
          </div>

          {/* Content Options */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Include in Report</h3>
            <div className="space-y-3">
              <Checkbox
                label="Financial Overview"
                description="Budget, collected amount, expenses, and balance"
                checked={exportOptions?.includeOverview}
                onChange={(e) => handleOptionChange('includeOverview', e?.target?.checked)}
              />
              <Checkbox
                label="Member Contributions"
                description="Individual contribution status and amounts"
                checked={exportOptions?.includeContributions}
                onChange={(e) => handleOptionChange('includeContributions', e?.target?.checked)}
              />
              <Checkbox
                label="Expense Details"
                description="Categorized expenses with dates and assignments"
                checked={exportOptions?.includeExpenses}
                onChange={(e) => handleOptionChange('includeExpenses', e?.target?.checked)}
              />
              <Checkbox
                label="Collection Progress"
                description="Progress charts and milestone tracking"
                checked={exportOptions?.includeProgress}
                onChange={(e) => handleOptionChange('includeProgress', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Report Preview</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Format: {formatOptions?.find(f => f?.value === exportOptions?.format)?.label}</p>
              <p>• Date Range: {dateRangeOptions?.find(d => d?.value === exportOptions?.dateRange)?.label}</p>
              <p>• Sections: {Object.values(exportOptions)?.filter(v => v === true)?.length} included</p>
              <p>• Generated: {new Date()?.toLocaleDateString('en-US')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="default"
              iconName="Download"
              iconPosition="left"
              onClick={handleExport}
              className="flex-1"
            >
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;