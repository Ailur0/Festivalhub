import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MembersList = ({ members, userRole, onInviteMember, onRemoveMember, onUpdateRole }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const roleOptions = [
    { value: 'fund_collection', label: 'Fund Collection', color: 'bg-green-100 text-green-800' },
    { value: 'treasurer', label: 'Treasurer', color: 'bg-blue-100 text-blue-800' },
    { value: 'management', label: 'Management', color: 'bg-purple-100 text-purple-800' },
    { value: 'logistics', label: 'Logistics', color: 'bg-orange-100 text-orange-800' },
    { value: 'decoration', label: 'Decoration', color: 'bg-pink-100 text-pink-800' },
    { value: 'prasad_preparation', label: 'Prasad Preparation', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'cultural_events', label: 'Cultural Events', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'general_member', label: 'General Member', color: 'bg-gray-100 text-gray-800' }
  ];

  const getRoleInfo = (role) => {
    return roleOptions?.find(option => option?.value === role) || roleOptions?.[roleOptions?.length - 1];
  };

  const canManageMembers = userRole === 'admin' || userRole === 'organizer';

  const handleRoleChange = (memberId, newRole) => {
    onUpdateRole?.(memberId, newRole);
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      onRemoveMember?.(memberId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground font-heading">
            Group Members ({members?.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage roles and permissions for group members
          </p>
        </div>
        {canManageMembers && (
          <Button
            variant="default"
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => setShowInviteModal(true)}
          >
            Invite Member
          </Button>
        )}
      </div>
      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.map((member) => {
          const roleInfo = getRoleInfo(member?.role);
          return (
            <div key={member?.id} className="bg-card border border-border rounded-lg p-4 festival-shadow-sm hover:festival-shadow-md transition-festival">
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/20">
                    <Image
                      src={member?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member?.name}`}
                      alt={member?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground truncate">
                        {member?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {member?.email}
                      </p>
                    </div>
                    {canManageMembers && member?.id !== 'current-user' && (
                      <button
                        onClick={() => handleRemoveMember(member?.id)}
                        className="text-muted-foreground hover:text-error transition-micro p-1"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    )}
                  </div>

                  {/* Role Badge */}
                  <div className="mt-2">
                    {canManageMembers && member?.id !== 'current-user' ? (
                      <Select
                        options={roleOptions}
                        value={member?.role}
                        onChange={(newRole) => handleRoleChange(member?.id, newRole)}
                        className="w-full"
                      />
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo?.color}`}>
                        {roleInfo?.label}
                      </span>
                    )}
                  </div>

                  {/* Contact Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    {member?.phone && (
                      <a
                        href={`tel:${member?.phone}`}
                        className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-micro"
                      >
                        <Icon name="Phone" size={14} />
                        <span>Call</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${member?.email}`}
                      className="flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-micro"
                    >
                      <Icon name="Mail" size={14} />
                      <span>Email</span>
                    </a>
                  </div>

                  {/* Contribution Status */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Contribution</span>
                      <span className={`font-medium ${member?.contributionStatus === 'paid' ? 'text-success' : member?.contributionStatus === 'partial' ? 'text-warning' : 'text-error'}`}>
                        ${member?.contributionAmount || 0} / ${member?.expectedContribution || 0}
                      </span>
                    </div>
                    <div className="mt-1 w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          member?.contributionStatus === 'paid' ? 'bg-success' :
                          member?.contributionStatus === 'partial' ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{
                          width: `${Math.min(100, (member?.contributionAmount / member?.expectedContribution) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md festival-shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground font-heading">
                Invite New Member
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-foreground transition-micro"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-accent/10 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Share Invite Link</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="https://festivalhub.com/join/abc123"
                    readOnly
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    onClick={() => navigator.clipboard?.writeText('https://festivalhub.com/join/abc123')}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">Or send direct invitation</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    iconName="Mail"
                    iconPosition="left"
                    fullWidth
                  >
                    Email Invite
                  </Button>
                  <Button
                    variant="outline"
                    iconName="MessageSquare"
                    iconPosition="left"
                    fullWidth
                  >
                    SMS Invite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersList;