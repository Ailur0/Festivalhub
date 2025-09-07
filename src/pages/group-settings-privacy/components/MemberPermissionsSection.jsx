import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberPermissionsSection = ({ permissions, onPermissionsChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const roles = [
    { id: 'admin', label: 'Admin', color: 'text-error', bgColor: 'bg-error/10' },
    { id: 'organizer', label: 'Organizer', color: 'text-primary', bgColor: 'bg-primary/10' },
    { id: 'treasurer', label: 'Treasurer', color: 'text-success', bgColor: 'bg-success/10' },
    { id: 'fund_collection', label: 'Fund Collection', color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { id: 'management', label: 'Management', color: 'text-warning', bgColor: 'bg-warning/10' },
    { id: 'logistics', label: 'Logistics', color: 'text-accent-foreground', bgColor: 'bg-accent/20' },
    { id: 'decoration', label: 'Decoration', color: 'text-primary', bgColor: 'bg-primary/10' },
    { id: 'prasad_preparation', label: 'Prasad Preparation', color: 'text-success', bgColor: 'bg-success/10' },
    { id: 'cultural_events', label: 'Cultural Events', color: 'text-secondary', bgColor: 'bg-secondary/10' },
    { id: 'general_member', label: 'General Member', color: 'text-muted-foreground', bgColor: 'bg-muted' }
  ];

  const permissionTypes = [
    { id: 'viewBudget', label: 'View Budget', icon: 'Eye' },
    { id: 'manageExpenses', label: 'Manage Expenses', icon: 'DollarSign' },
    { id: 'inviteMembers', label: 'Invite Members', icon: 'UserPlus' },
    { id: 'accessMarketplace', label: 'Access Marketplace', icon: 'Store' },
    { id: 'editGroupDetails', label: 'Edit Group Details', icon: 'Edit' },
    { id: 'viewMemberContacts', label: 'View Member Contacts', icon: 'Phone' }
  ];

  const handlePermissionToggle = (roleId, permissionId) => {
    const updatedPermissions = { ...permissions };
    if (!updatedPermissions?.[roleId]) {
      updatedPermissions[roleId] = {};
    }
    updatedPermissions[roleId][permissionId] = !updatedPermissions?.[roleId]?.[permissionId];
    onPermissionsChange(updatedPermissions);
  };

  const isPermissionEnabled = (roleId, permissionId) => {
    return permissions?.[roleId]?.[permissionId] || false;
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Users" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground font-heading">Member Permissions</h3>
            <p className="text-sm text-muted-foreground">Configure role-based access controls</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-sm font-medium text-foreground">Role</th>
                  {permissionTypes?.map((permission) => (
                    <th key={permission?.id} className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">
                      <div className="flex flex-col items-center space-y-1">
                        <Icon name={permission?.icon} size={16} />
                        <span className="leading-tight">{permission?.label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles?.map((role) => (
                  <tr key={role?.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-micro">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${role?.bgColor} ${role?.color}`}>
                          {role?.label}
                        </span>
                      </div>
                    </td>
                    {permissionTypes?.map((permission) => (
                      <td key={permission?.id} className="text-center py-3 px-2">
                        <Checkbox
                          checked={isPermissionEnabled(role?.id, permission?.id)}
                          onChange={() => handlePermissionToggle(role?.id, permission?.id)}
                          size="sm"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-warning/10 rounded-md border border-warning/20">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-xs font-medium text-warning">Permission Changes</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Modifying permissions will affect all members with the selected roles immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPermissionsSection;