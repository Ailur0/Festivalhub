import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    eventDate: '',
    expectedMembers: '',
    privacy: 'private'
  });
  const [isLoading, setIsLoading] = useState(false);

  const festivalTypes = [
    { value: 'diwali', label: 'Diwali Celebration' },
    { value: 'holi', label: 'Holi Festival' },
    { value: 'navratri', label: 'Navratri Celebration' },
    { value: 'ganesh-chaturthi', label: 'Ganesh Chaturthi' },
    { value: 'durga-puja', label: 'Durga Puja' },
    { value: 'karva-chauth', label: 'Karva Chauth' },
    { value: 'dussehra', label: 'Dussehra' },
    { value: 'janmashtami', label: 'Janmashtami' },
    { value: 'community-event', label: 'Community Event' },
    { value: 'cultural-program', label: 'Cultural Program' },
    { value: 'other', label: 'Other Festival' }
  ];

  const privacyOptions = [
    { value: 'private', label: 'Private - Invite only' },
    { value: 'public', label: 'Public - Anyone can join' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      navigate('/group-management');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg festival-shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground font-heading">
                Create New Group
              </h2>
              <p className="text-sm text-muted-foreground">
                Start organizing your festival celebration
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Group Name"
            type="text"
            placeholder="e.g., Diwali 2024 Celebration"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Festival Type
            </label>
            <Select
              options={festivalTypes}
              value={formData?.type}
              onChange={(value) => handleInputChange('type', value)}
              placeholder="Select festival type"
              required
            />
          </div>

          <Input
            label="Description"
            type="text"
            placeholder="Brief description of your celebration"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            description="Help others understand what this group is about"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Event Date"
              type="date"
              value={formData?.eventDate}
              onChange={(e) => handleInputChange('eventDate', e?.target?.value)}
              required
            />

            <Input
              label="Expected Members"
              type="number"
              placeholder="20"
              value={formData?.expectedMembers}
              onChange={(e) => handleInputChange('expectedMembers', e?.target?.value)}
              min="2"
              max="500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Privacy Setting
            </label>
            <Select
              options={privacyOptions}
              value={formData?.privacy}
              onChange={(value) => handleInputChange('privacy', value)}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Plus"
              iconPosition="left"
            >
              Create Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;