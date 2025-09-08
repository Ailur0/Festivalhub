import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import GroupContextNavigation from '../../components/ui/GroupContextNavigation';
import PrivacySettingsSection from './components/PrivacySettingsSection';
import MemberPermissionsSection from './components/MemberPermissionsSection';
import NotificationPreferencesSection from './components/NotificationPreferencesSection';
import GroupDetailsSection from './components/GroupDetailsSection';
import InviteManagementSection from './components/InviteManagementSection';
import DangerZoneSection from './components/DangerZoneSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const GroupSettingsPrivacy = () => {
  const navigate = useNavigate();
  const [user] = useState({
    id: 'user_001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    role: 'admin'
  });

  const [currentGroup] = useState({
    id: 'group_001',
    name: 'Diwali Celebration 2024',
    type: 'Community Festival',
    memberCount: 45,
    totalBudget: 15000,
    daysRemaining: 28
  });

  const [notifications] = useState([
    {
      id: 'notif_001',
      title: 'Settings Updated',
      message: 'Group privacy settings have been modified',
      type: 'system',
      priority: 'medium',
      read: false,
      timestamp: new Date(Date.now() - 300000),
      time: '5 minutes ago'
    },
    {
      id: 'notif_002',
      title: 'New Member Request',
      message: 'Priya Sharma wants to join the group',
      type: 'group',
      priority: 'high',
      read: false,
      timestamp: new Date(Date.now() - 900000),
      time: '15 minutes ago'
    }
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    groupVisibility: 'public',
    inviteOnly: true,
    shareFinancialData: true,
    allowMemberInvites: false,
    showMemberContacts: true
  });

  const [memberPermissions, setMemberPermissions] = useState({
    admin: {
      viewBudget: true,
      manageExpenses: true,
      inviteMembers: true,
      accessMarketplace: true,
      editGroupDetails: true,
      viewMemberContacts: true
    },
    organizer: {
      viewBudget: true,
      manageExpenses: true,
      inviteMembers: true,
      accessMarketplace: true,
      editGroupDetails: false,
      viewMemberContacts: true
    },
    treasurer: {
      viewBudget: true,
      manageExpenses: true,
      inviteMembers: false,
      accessMarketplace: false,
      editGroupDetails: false,
      viewMemberContacts: true
    },
    general_member: {
      viewBudget: true,
      manageExpenses: false,
      inviteMembers: false,
      accessMarketplace: true,
      editGroupDetails: false,
      viewMemberContacts: false
    }
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    financial: {
      budgetChanges: { email: true, push: true, sms: false },
      newExpenses: { email: true, push: true, sms: false },
      contributionUpdates: { email: false, push: true, sms: false },
      paymentReminders: { email: true, push: true, sms: true }
    },
    group: {
      newMembers: { email: true, push: true, sms: false },
      memberUpdates: { email: false, push: true, sms: false },
      groupAnnouncements: { email: true, push: true, sms: false },
      roleAssignments: { email: true, push: true, sms: false }
    },
    marketplace: {
      newVendors: { email: false, push: true, sms: false },
      vendorUpdates: { email: false, push: false, sms: false },
      reviewAlerts: { email: false, push: true, sms: false },
      recommendedServices: { email: true, push: false, sms: false }
    },
    system: {
      securityAlerts: { email: true, push: true, sms: true },
      systemUpdates: { email: true, push: false, sms: false },
      dataExports: { email: true, push: true, sms: false },
      backupAlerts: { email: false, push: false, sms: false }
    }
  });

  const [groupDetails, setGroupDetails] = useState({
    name: 'Diwali Celebration 2024',
    description: 'Annual Diwali festival celebration for our community with traditional rituals, cultural programs, and feast preparation.',
    festivalType: 'diwali',
    startDate: '2024-10-30',
    endDate: '2024-11-02',
    location: 'Community Center, Downtown',
    memberCount: 45,
    totalBudget: 15000,
    daysRemaining: 28
  });

  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    document.title = 'Group Settings & Privacy - FestivalHub';
  }, []);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handlePrivacySettingsChange = (newSettings) => {
    setPrivacySettings(newSettings);
    showSaveStatus('Privacy settings updated successfully');
  };

  const handlePermissionsChange = (newPermissions) => {
    setMemberPermissions(newPermissions);
    showSaveStatus('Member permissions updated successfully');
  };

  const handleNotificationPreferencesChange = (newPreferences) => {
    setNotificationPreferences(newPreferences);
    showSaveStatus('Notification preferences updated successfully');
  };

  const handleGroupDetailsChange = (newDetails) => {
    setGroupDetails(newDetails);
    showSaveStatus('Group details updated successfully');
  };

  const handleInviteAction = (action, inviteId) => {
    switch (action) {
      case 'create': showSaveStatus('New invitation created successfully');
        break;
      case 'regenerate': showSaveStatus('Invitation code regenerated successfully');
        break;
      case 'revoke': showSaveStatus('Invitation revoked successfully');
        break;
      default:
        break;
    }
  };

  const handleDangerAction = (action) => {
    switch (action) {
      case 'export':
        showSaveStatus('Data export completed successfully');
        break;
      case 'transfer': showSaveStatus('Ownership transfer initiated');
        break;
      case 'leave': navigate('/user-dashboard');
        break;
      case 'delete':
        navigate('/user-dashboard');
        break;
      default:
        break;
    }
  };

  const showSaveStatus = (message) => {
    setSaveStatus(message);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={user} 
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
      <GroupContextNavigation 
        group={currentGroup}
        userRole={user?.role}
      />
      <main className="pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/group-management')}
                className="hover:text-foreground transition-micro"
              >
                Group Management
              </button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">Settings & Privacy</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-heading">
                  Group Settings & Privacy
                </h1>
                <p className="text-muted-foreground mt-1">
                  Configure privacy controls, permissions, and group preferences
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/group-management')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Management
                </Button>
              </div>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <p className="text-sm text-success font-medium">{saveStatus}</p>
              </div>
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-6">
            <PrivacySettingsSection 
              settings={privacySettings}
              onSettingsChange={handlePrivacySettingsChange}
            />
            
            <MemberPermissionsSection 
              permissions={memberPermissions}
              onPermissionsChange={handlePermissionsChange}
            />
            
            <NotificationPreferencesSection 
              preferences={notificationPreferences}
              onPreferencesChange={handleNotificationPreferencesChange}
            />
            
            <GroupDetailsSection 
              groupDetails={groupDetails}
              onDetailsChange={handleGroupDetailsChange}
            />
            
            <InviteManagementSection 
              invites={[]}
              onInviteAction={handleInviteAction}
            />
            
            <DangerZoneSection 
              onDangerAction={handleDangerAction}
            />
          </div>

          {/* Mobile Back Button */}
          <div className="md:hidden mt-8">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate('/group-management')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Group Management
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupSettingsPrivacy;