import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PrivacySettingsSection = ({ settings, onSettingsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const privacyOptions = [
    {
      id: 'groupVisibility',
      label: 'Public Group',
      description: 'Allow anyone to discover and view basic group information',
      checked: settings?.groupVisibility === 'public'
    },
    {
      id: 'inviteOnly',
      label: 'Invite Only Membership',
      description: 'Require admin approval for new members to join',
      checked: settings?.inviteOnly
    },
    {
      id: 'shareFinancialData',
      label: 'Share Financial Summary',
      description: 'Allow members to view budget and expense summaries',
      checked: settings?.shareFinancialData
    },
    {
      id: 'allowMemberInvites',
      label: 'Member Invitations',
      description: 'Let members invite others to join the group',
      checked: settings?.allowMemberInvites
    },
    {
      id: 'showMemberContacts',
      label: 'Show Member Contacts',
      description: 'Display phone numbers and emails to all members',
      checked: settings?.showMemberContacts
    }
  ];

  const handleToggle = (optionId) => {
    const option = privacyOptions?.find(opt => opt?.id === optionId);
    if (optionId === 'groupVisibility') {
      onSettingsChange({
        ...settings,
        groupVisibility: option?.checked ? 'private' : 'public'
      });
    } else {
      onSettingsChange({
        ...settings,
        [optionId]: !option?.checked
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Shield" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground font-heading">Privacy Settings</h3>
            <p className="text-sm text-muted-foreground">Control group visibility and data sharing</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border">
          {privacyOptions?.map((option) => (
            <div key={option?.id} className="flex items-start space-x-3 py-2">
              <Checkbox
                checked={option?.checked}
                onChange={() => handleToggle(option?.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  {option?.label}
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  {option?.description}
                </p>
              </div>
            </div>
          ))}

          <div className="mt-6 p-3 bg-accent/10 rounded-md border border-accent/20">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
              <div>
                <p className="text-xs font-medium text-accent-foreground">Privacy Notice</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Changes to privacy settings will take effect immediately. Members will be notified of significant changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettingsSection;