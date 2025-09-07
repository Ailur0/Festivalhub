import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const InviteManagementSection = ({ invites, onInviteAction }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showQRCode, setShowQRCode] = useState(null);

  const activeInvites = [
    {
      id: 'inv_001',
      code: 'DIWALI2024_ABC123',
      type: 'general',
      expiresAt: '2024-12-15',
      usageCount: 5,
      maxUsage: 50,
      createdBy: 'Admin',
      createdAt: '2024-08-20'
    },
    {
      id: 'inv_002',
      code: 'ORGANIZER_XYZ789',
      type: 'organizer',
      expiresAt: '2024-11-30',
      usageCount: 2,
      maxUsage: 5,
      createdBy: 'Admin',
      createdAt: '2024-08-25'
    }
  ];

  const handleCopyInvite = (code) => {
    const inviteUrl = `${window.location?.origin}/join/${code}`;
    navigator.clipboard?.writeText(inviteUrl);
    // Toast notification would be shown here
  };

  const handleRegenerateCode = (inviteId) => {
    onInviteAction?.('regenerate', inviteId);
  };

  const handleRevokeInvite = (inviteId) => {
    onInviteAction?.('revoke', inviteId);
  };

  const handleCreateNewInvite = () => {
    onInviteAction?.('create');
  };

  const getInviteTypeColor = (type) => {
    switch (type) {
      case 'organizer':
        return 'bg-primary/10 text-primary';
      case 'treasurer':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const generateQRCodeUrl = (code) => {
    const inviteUrl = `${window.location?.origin}/join/${code}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg festival-shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-micro rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground font-heading">Invite Management</h3>
            <p className="text-sm text-muted-foreground">Manage group invitation links and codes</p>
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
            <h4 className="font-medium text-foreground">Active Invitations</h4>
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateNewInvite}
              iconName="Plus"
              iconPosition="left"
            >
              Create New Invite
            </Button>
          </div>

          <div className="space-y-3">
            {activeInvites?.map((invite) => (
              <div key={invite?.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <code className="px-2 py-1 bg-muted rounded text-sm font-mono text-foreground">
                        {invite?.code}
                      </code>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getInviteTypeColor(invite?.type)}`}>
                        {invite?.type?.charAt(0)?.toUpperCase() + invite?.type?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Usage:</span> {invite?.usageCount}/{invite?.maxUsage}
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span> {invite?.expiresAt}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {invite?.createdAt}
                      </div>
                      <div>
                        <span className="font-medium">By:</span> {invite?.createdBy}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => handleCopyInvite(invite?.code)}
                      iconName="Copy"
                      iconPosition="left"
                    >
                      Copy Link
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setShowQRCode(showQRCode === invite?.id ? null : invite?.id)}
                      iconName="QrCode"
                      iconPosition="left"
                    >
                      QR Code
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleRegenerateCode(invite?.id)}
                      iconName="RefreshCw"
                      iconPosition="left"
                    >
                      Regenerate
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="xs"
                      onClick={() => handleRevokeInvite(invite?.id)}
                      iconName="Trash2"
                      iconPosition="left"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>

                {showQRCode === invite?.id && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md text-center">
                    <img
                      src={generateQRCodeUrl(invite?.code)}
                      alt={`QR Code for ${invite?.code}`}
                      className="mx-auto mb-2"
                      width={150}
                      height={150}
                    />
                    <p className="text-xs text-muted-foreground">
                      Scan this QR code to join the group
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center p-3 bg-success/10 rounded-md">
              <p className="text-lg font-bold text-success">7</p>
              <p className="text-xs text-muted-foreground">Total Invites Used</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-md">
              <p className="text-lg font-bold text-primary">2</p>
              <p className="text-xs text-muted-foreground">Active Invites</p>
            </div>
            <div className="text-center p-3 bg-warning/10 rounded-md">
              <p className="text-lg font-bold text-warning">48</p>
              <p className="text-xs text-muted-foreground">Remaining Uses</p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-accent/10 rounded-md border border-accent/20">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
              <div>
                <p className="text-xs font-medium text-accent-foreground">Invitation Guidelines</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Share invitation links securely. Revoked invites cannot be reactivated. QR codes work best for mobile sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteManagementSection;