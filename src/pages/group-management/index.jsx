import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import GroupContextNavigation from '../../components/ui/GroupContextNavigation';
import GroupOverview from './components/GroupOverview';
import MembersList from './components/MembersList';
import BudgetOverview from './components/BudgetOverview';
import MarketplaceTab from './components/MarketplaceTab';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const GroupManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [communityVendors, setCommunityVendors] = useState([]);

  // Mock user data
  const currentUser = {
    id: 'current-user',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    role: 'admin'
  };

  // Mock group data
  const groupData = {
    id: 'group-1',
    name: 'Diwali Celebration 2024',
    type: 'Hindu Festival',
    festivalType: 'Diwali Festival',
    location: 'Community Center, Downtown',
    memberCount: 24,
    startDate: '2024-11-01',
    endDate: '2024-11-05',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    description: `Join us for a grand Diwali celebration featuring traditional decorations, cultural performances, and community feast. This year's festival will include rangoli competitions, diya lighting ceremony, and special prasad preparation by our dedicated volunteers.`,
    totalBudget: 5000,
    collectedAmount: 3200,
    expenses: 1800,
    remainingBalance: 1400
  };

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      user: 'Priya Sharma',
      action: 'contributed $150 to the festival fund',
      type: 'member_joined',
      timestamp: '2024-10-28T10:30:00Z',
      amount: 150
    },
    {
      id: 2,
      user: 'Amit Patel',
      action: 'was assigned the Decoration role',
      type: 'role_assigned',
      timestamp: '2024-10-28T09:15:00Z'
    },
    {
      id: 3,
      user: 'Sunita Gupta',
      action: 'added expense for rangoli supplies',
      type: 'expense_added',
      timestamp: '2024-10-27T16:45:00Z',
      amount: 75
    },
    {
      id: 4,
      user: 'Vikram Singh',
      action: 'joined the group',
      type: 'member_joined',
      timestamp: '2024-10-27T14:20:00Z'
    },
    {
      id: 5,
      user: 'Meera Joshi',
      action: 'updated the total budget',
      type: 'budget_updated',
      timestamp: '2024-10-26T11:30:00Z'
    }
  ];

  // Mock members data
  const membersData = [
    {
      id: 'current-user',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+1-555-0101',
      role: 'management',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajesh Kumar',
      contributionAmount: 250,
      expectedContribution: 250,
      contributionStatus: 'paid'
    },
    {
      id: 'member-2',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+1-555-0102',
      role: 'fund_collection',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Priya Sharma',
      contributionAmount: 200,
      expectedContribution: 200,
      contributionStatus: 'paid'
    },
    {
      id: 'member-3',
      name: 'Amit Patel',
      email: 'amit.patel@email.com',
      phone: '+1-555-0103',
      role: 'decoration',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Amit Patel',
      contributionAmount: 150,
      expectedContribution: 200,
      contributionStatus: 'partial'
    },
    {
      id: 'member-4',
      name: 'Sunita Gupta',
      email: 'sunita.gupta@email.com',
      phone: '+1-555-0104',
      role: 'treasurer',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sunita Gupta',
      contributionAmount: 200,
      expectedContribution: 200,
      contributionStatus: 'paid'
    },
    {
      id: 'member-5',
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+1-555-0105',
      role: 'logistics',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vikram Singh',
      contributionAmount: 0,
      expectedContribution: 200,
      contributionStatus: 'pending'
    },
    {
      id: 'member-6',
      name: 'Meera Joshi',
      email: 'meera.joshi@email.com',
      phone: '+1-555-0106',
      role: 'prasad_preparation',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Meera Joshi',
      contributionAmount: 180,
      expectedContribution: 200,
      contributionStatus: 'partial'
    },
    {
      id: 'member-7',
      name: 'Arjun Reddy',
      email: 'arjun.reddy@email.com',
      phone: '+1-555-0107',
      role: 'cultural_events',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Arjun Reddy',
      contributionAmount: 200,
      expectedContribution: 200,
      contributionStatus: 'paid'
    },
    {
      id: 'member-8',
      name: 'Kavya Nair',
      email: 'kavya.nair@email.com',
      phone: '+1-555-0108',
      role: 'general_member',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Kavya Nair',
      contributionAmount: 100,
      expectedContribution: 200,
      contributionStatus: 'partial'
    }
  ];

  // Mock budget data
  const budgetData = {
    total: 5000,
    collected: 3200,
    expenses: 1800,
    balance: 1400,
    expenseCount: 12,
    categories: [
      { name: 'Decoration', allocated: 1500, spent: 650, color: 'bg-pink-500' },
      { name: 'Prasad & Food', allocated: 1200, spent: 480, color: 'bg-orange-500' },
      { name: 'Sound & Lighting', allocated: 800, spent: 320, color: 'bg-blue-500' },
      { name: 'Cultural Events', allocated: 600, spent: 200, color: 'bg-purple-500' },
      { name: 'Logistics', allocated: 500, spent: 150, color: 'bg-green-500' },
      { name: 'Miscellaneous', allocated: 400, spent: 0, color: 'bg-gray-500' }
    ]
  };

  // Mock vendors data
  const vendorsData = [
    {
      id: 'vendor-1',
      name: 'Elegant Decorations',
      category: 'decoration',
      description: 'Specializing in traditional Indian festival decorations with modern touch. Expert in rangoli, flower arrangements, and lighting setups.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      rating: 4.8,
      reviewCount: 127,
      startingPrice: 299,
      location: '2.5 miles away',
      phone: '+1-555-0201',
      email: 'info@elegantdecorations.com',
      isVerified: true,
      addedBy: {
        groupId: 'group-2',
        groupName: 'Holi Festival 2024',
        adminName: 'Meera Patel'
      },
      dateAdded: '2024-10-20T10:00:00Z',
      status: 'verified'
    },
    {
      id: 'vendor-2',
      name: 'Spice Garden Catering',
      category: 'catering',
      description: 'Authentic Indian cuisine for festivals and celebrations. Specializing in traditional sweets, prasad, and vegetarian feast preparations.',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      rating: 4.9,
      reviewCount: 203,
      startingPrice: 15,
      location: '1.8 miles away',
      phone: '+1-555-0202',
      email: 'orders@spicegarden.com',
      isVerified: true,
      addedBy: {
        groupId: 'group-3',
        groupName: 'Ganesh Chaturthi Community',
        adminName: 'Arjun Reddy'
      },
      dateAdded: '2024-10-18T14:30:00Z',
      status: 'verified'
    },
    {
      id: 'vendor-3',
      name: 'SoundWave Productions',
      category: 'sound_lighting',
      description: 'Professional sound and lighting services for cultural events. Complete setup for stage performances and ceremonies.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      rating: 4.6,
      reviewCount: 89,
      startingPrice: 450,
      location: '3.2 miles away',
      phone: '+1-555-0203',
      email: 'booking@soundwave.com',
      isVerified: false
    },
    {
      id: 'vendor-4',
      name: 'Moments Photography',
      category: 'photography',
      description: 'Capturing beautiful moments of your festival celebrations. Experienced in cultural events and traditional ceremonies.',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e732a1e?w=400',
      rating: 4.7,
      reviewCount: 156,
      startingPrice: 350,
      location: '4.1 miles away',
      phone: '+1-555-0204',
      email: 'hello@momentsphotography.com',
      isVerified: true
    },
    {
      id: 'vendor-5',
      name: 'Safe Transport Services',
      category: 'transportation',
      description: 'Reliable transportation for group events and festival supplies. Clean vehicles with experienced drivers.',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      rating: 4.4,
      reviewCount: 78,
      startingPrice: 80,
      location: '2.9 miles away',
      phone: '+1-555-0205',
      email: 'bookings@safetransport.com',
      isVerified: true
    },
    {
      id: 'vendor-6',
      name: 'Guardian Security',
      category: 'security',
      description: 'Professional security services for community events. Trained personnel for crowd management and safety.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      rating: 4.5,
      reviewCount: 92,
      startingPrice: 120,
      location: '1.5 miles away',
      phone: '+1-555-0206',
      email: 'contact@guardiansecurity.com',
      isVerified: true
    }
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New member joined',
      message: 'Vikram Singh has joined your group',
      type: 'group',
      priority: 'normal',
      read: false,
      timestamp: new Date(Date.now() - 300000),
      time: '5 minutes ago'
    },
    {
      id: 2,
      title: 'Payment received',
      message: 'Priya Sharma contributed $150',
      type: 'financial',
      priority: 'normal',
      read: false,
      timestamp: new Date(Date.now() - 900000),
      time: '15 minutes ago'
    }
  ];

  // Initialize community vendors on mount
  useEffect(() => {
    setCommunityVendors(vendorsData);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'members', label: 'Members', icon: 'Users' },
    { id: 'budget', label: 'Budget', icon: 'DollarSign' },
    { id: 'marketplace', label: 'Marketplace', icon: 'Store' }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleInviteMember = () => {
    console.log('Invite member clicked');
  };

  const handleRemoveMember = (memberId) => {
    console.log('Remove member:', memberId);
  };

  const handleUpdateRole = (memberId, newRole) => {
    console.log('Update role:', memberId, newRole);
  };

  const handleAddExpense = () => {
    navigate('/financial-dashboard');
  };

  const handleViewDetails = (route) => {
    navigate(`/${route}`);
  };

  const handleViewVendor = (vendorId) => {
    console.log('View vendor:', vendorId);
  };

  const handleBrowseMarketplace = () => {
    navigate('/community-marketplace');
  };

  const handleAddVendorToCommunity = (vendorData) => {
    // Add vendor to community marketplace
    const newVendor = {
      ...vendorData,
      id: `vendor-${Date.now()}`,
      addedBy: {
        groupId: groupData?.id,
        groupName: groupData?.name,
        adminName: currentUser?.name
      },
      dateAdded: new Date()?.toISOString(),
      status: 'pending_review'
    };

    setCommunityVendors(prev => [newVendor, ...prev]);
    
    // Show success message (in real app, this would be a toast notification)
    console.log('Vendor added to community marketplace:', newVendor);
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <GroupOverview 
            group={groupData} 
            recentActivity={recentActivity}
          />
        );
      case 'members':
        return (
          <MembersList
            members={membersData}
            userRole={currentUser?.role}
            onInviteMember={handleInviteMember}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateRole}
          />
        );
      case 'budget':
        return (
          <BudgetOverview
            budgetData={budgetData}
            memberContributions={membersData}
            onAddExpense={handleAddExpense}
            onViewDetails={handleViewDetails}
          />
        );
      case 'marketplace':
        return (
          <MarketplaceTab
            vendors={communityVendors}
            onViewVendor={handleViewVendor}
            onAddVendor={handleBrowseMarketplace}
            userRole={currentUser?.role}
            groupInfo={{
              id: groupData?.id,
              name: groupData?.name,
              adminName: currentUser?.name
            }}
            onAddVendorToCommunity={handleAddVendorToCommunity}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        user={currentUser}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
      {/* Group Context Navigation */}
      <GroupContextNavigation 
        group={groupData}
        userRole={currentUser?.role}
      />
      {/* Main Content */}
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => handleTabChange(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-micro ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Main FAB */}
          <Button
            variant="default"
            size="icon"
            className="w-14 h-14 rounded-full festival-shadow-lg"
            onClick={() => setShowFloatingActions(!showFloatingActions)}
          >
            <Icon name={showFloatingActions ? 'X' : 'Plus'} size={24} />
          </Button>

          {/* Action Menu */}
          {showFloatingActions && (
            <div className="absolute bottom-16 right-0 space-y-3 animate-slide-up">
              <div className="flex items-center space-x-3">
                <span className="bg-card text-foreground px-3 py-1 rounded-lg text-sm font-medium festival-shadow-md">
                  Add Expense
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-12 h-12 rounded-full festival-shadow-md"
                  onClick={handleAddExpense}
                >
                  <Icon name="Receipt" size={20} />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="bg-card text-foreground px-3 py-1 rounded-lg text-sm font-medium festival-shadow-md">
                  Invite Member
                </span>
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-12 h-12 rounded-full festival-shadow-md"
                  onClick={handleInviteMember}
                >
                  <Icon name="UserPlus" size={20} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Overlay for FAB menu */}
      {showFloatingActions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFloatingActions(false)}
        />
      )}
    </div>
  );
};

export default GroupManagement;