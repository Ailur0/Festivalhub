import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const GroupDetailsSection = ({ groupDetails, onDetailsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(groupDetails);
  const [errors, setErrors] = useState({});

  const festivalTypes = [
    { value: 'diwali', label: 'Diwali' },
    { value: 'holi', label: 'Holi' },
    { value: 'navratri', label: 'Navratri' },
    { value: 'ganesh_chaturthi', label: 'Ganesh Chaturthi' },
    { value: 'durga_puja', label: 'Durga Puja' },
    { value: 'karva_chauth', label: 'Karva Chauth' },
    { value: 'dussehra', label: 'Dussehra' },
    { value: 'janmashtami', label: 'Janmashtami' },
    { value: 'raksha_bandhan', label: 'Raksha Bandhan' },
    { value: 'other', label: 'Other Festival' }
  ];

  const handleInputChange = (field, value) => {
    setEditedDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editedDetails?.name?.trim()) {
      newErrors.name = 'Group name is required';
    }
    
    if (!editedDetails?.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!editedDetails?.festivalType) {
      newErrors.festivalType = 'Festival type is required';
    }
    
    if (!editedDetails?.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!editedDetails?.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (editedDetails?.startDate && editedDetails?.endDate && 
        new Date(editedDetails.startDate) > new Date(editedDetails.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onDetailsChange(editedDetails);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedDetails(groupDetails);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground font-heading">Group Details</h3>
            <p className="text-sm text-muted-foreground">Manage group information and settings</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Basic Information</h4>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Details
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  iconName="Check"
                  iconPosition="left"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Group Name"
              type="text"
              value={editedDetails?.name || ''}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              disabled={!isEditing}
              required
            />

            <Select
              label="Festival Type"
              options={festivalTypes}
              value={editedDetails?.festivalType || ''}
              onChange={(value) => handleInputChange('festivalType', value)}
              error={errors?.festivalType}
              disabled={!isEditing}
              required
            />

            <Input
              label="Start Date"
              type="date"
              value={editedDetails?.startDate || ''}
              onChange={(e) => handleInputChange('startDate', e?.target?.value)}
              error={errors?.startDate}
              disabled={!isEditing}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={editedDetails?.endDate || ''}
              onChange={(e) => handleInputChange('endDate', e?.target?.value)}
              error={errors?.endDate}
              disabled={!isEditing}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Location"
                type="text"
                value={editedDetails?.location || ''}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                error={errors?.location}
                disabled={!isEditing}
                placeholder="Enter festival location"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={editedDetails?.description || ''}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-micro ${
                  isEditing 
                    ? 'border-border bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary' 
                    : 'border-border bg-muted text-muted-foreground'
                } ${errors?.description ? 'border-error' : ''}`}
                placeholder="Describe your festival group and its purpose"
              />
              {errors?.description && (
                <p className="text-xs text-error mt-1">{errors?.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center p-3 bg-muted/50 rounded-md">
              <p className="text-2xl font-bold text-primary">{groupDetails?.memberCount || 0}</p>
              <p className="text-xs text-muted-foreground">Total Members</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-md">
              <p className="text-2xl font-bold text-success">${groupDetails?.totalBudget || 0}</p>
              <p className="text-xs text-muted-foreground">Total Budget</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-md">
              <p className="text-2xl font-bold text-secondary">{groupDetails?.daysRemaining || 0}</p>
              <p className="text-xs text-muted-foreground">Days Remaining</p>
            </div>
          </div>

          {isEditing && (
            <div className="mt-4 p-3 bg-accent/10 rounded-md border border-accent/20">
              <div className="flex items-start space-x-2">
                <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-accent-foreground">Save Changes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changes will be saved immediately and all members will be notified of updates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupDetailsSection;