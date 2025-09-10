import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GlobalHeader from '../../components/ui/GlobalHeader';



// Import components
import GroupCard from './components/GroupCard';
import QuickStatsCard from './components/QuickStatsCard';
import ActivityFeed from './components/ActivityFeed';
import CreateGroupModal from './components/CreateGroupModal';
import JoinGroupModal from './components/JoinGroupModal';
import SearchBar from './components/SearchBar';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      type: 'financial',
      title: 'Payment Received',
      message: 'Rajesh Kumar contributed $50 to Diwali 2024 group',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: 'normal'
    },
    {
      id: 2,
      type: 'group',
      title: 'New Member Joined',
      message: 'Anita Patel joined your Navratri Celebration group',
      timestamp: new Date(Date.now() - 900000),
      read: false,
      priority: 'normal'
    },
    {
      id: 3,
      type: 'celebration',
      title: 'Event Reminder',
      message: 'Holi Festival is in 3 days! Final preparations needed.',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      priority: 'high'
    }
  ];

  // Mock groups data
  const userGroups = [
    {
      id: 1,
      name: "Diwali 2024 Celebration",
      description: "Community Diwali celebration with traditional decorations, sweets, and cultural programs",
      type: "diwali",
      image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=200&fit=crop",
      memberCount: 24,
      eventDate: "Nov 12, 2024",
      budgetProgress: 85,
      planningProgress: 72,
      lastActivity: "2 hours ago",
      isNew: false
    },
    {
      id: 2,
      name: "Navratri Dance Festival",
      description: "Nine nights of traditional Garba and Dandiya with live music and authentic Gujarati cuisine",
      type: "navratri",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      memberCount: 45,
      eventDate: "Oct 15-23, 2024",
      budgetProgress: 92,
      planningProgress: 88,
      lastActivity: "1 day ago",
      isNew: false
    },
    {
      id: 3,
      name: "Holi Spring Festival",
      description: "Colorful Holi celebration with organic colors, traditional music, and festive treats",
      type: "holi",
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=200&fit=crop",
      memberCount: 18,
      eventDate: "Mar 14, 2025",
      budgetProgress: 45,
      planningProgress: 35,
      lastActivity: "5 hours ago",
      isNew: true
    },
    {
      id: 4,
      name: "Ganesh Chaturthi 2024",
      description: "Traditional Ganesh festival with eco-friendly decorations and community prayers",
      type: "ganesh-chaturthi",
      image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400&h=200&fit=crop",
      memberCount: 32,
      eventDate: "Sep 7-17, 2024",
      budgetProgress: 100,
      planningProgress: 95,
      lastActivity: "3 days ago",
      isNew: false
    }
  ];

  // Mock user roles for each group
  const userRoles = {
    1: 'admin',
    2: 'organizer', 
    3: 'treasurer',
    4: 'general-member'
  };

  // Mock activity data
  const recentActivities = [
    {
      id: 1,
      type: 'payment-received',
      title: 'Payment Received',
      description: 'Rajesh Kumar contributed to Diwali 2024 group',
      groupName: 'Diwali 2024 Celebration',
      user: 'Rajesh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      amount: '50.00',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'member-joined',
      title: 'New Member Joined',
      description: 'Anita Patel joined your group',
      groupName: 'Navratri Dance Festival',
      user: 'Anita Patel',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      timestamp: new Date(Date.now() - 900000)
    },
    {
      id: 3,
      type: 'expense-added',
      title: 'Expense Added',
      description: 'Decoration materials purchased',
      groupName: 'Holi Spring Festival',
      user: 'Priya Sharma',
      avatar: currentUser?.avatar,
      amount: '125.50',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Milestone Achieved',
      description: 'Budget collection completed!',
      groupName: 'Ganesh Chaturthi 2024',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 5,
      type: 'role-assigned',
      title: 'Role Assigned',
      description: 'You were assigned as Treasurer',
      groupName: 'Holi Spring Festival',
      user: 'Admin',
      timestamp: new Date(Date.now() - 7200000)
    }
  ];

  // Calculate quick stats
  const quickStats = {
    totalBudget: userGroups?.reduce((sum, group) => sum + (group?.memberCount * 50), 0),
    activeGroups: userGroups?.length,
    upcomingEvents: userGroups?.filter(group => new Date(group.eventDate) > new Date())?.length,
    totalMembers: userGroups?.reduce((sum, group) => sum + group?.memberCount, 0)
  };

  // Filter groups based on search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredGroups(userGroups);
    } else {
      const filtered = userGroups?.filter(group =>
        group?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        group?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        group?.type?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchTerm]);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader 
        user={currentUser}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-heading mb-2">
                  Welcome back, {currentUser?.name?.split(' ')?.[0]}! 🎉
                </h1>
                <p className="text-muted-foreground">
                  Manage your festival celebrations and connect with your community
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => setIsJoinModalOpen(true)}
                >
                  Join Group
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Group
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <QuickStatsCard
              title="Total Budget"
              value={`$${quickStats?.totalBudget?.toLocaleString()}`}
              subtitle="Across all groups"
              icon="DollarSign"
              color="success"
              trend={12}
            />
            <QuickStatsCard
              title="Active Groups"
              value={quickStats?.activeGroups}
              subtitle="Currently managing"
              icon="Users"
              color="primary"
              trend={25}
            />
            <QuickStatsCard
              title="Upcoming Events"
              value={quickStats?.upcomingEvents}
              subtitle="This season"
              icon="Calendar"
              color="warning"
              trend={-5}
            />
            <QuickStatsCard
              title="Community Members"
              value={quickStats?.totalMembers}
              subtitle="Total participants"
              icon="Heart"
              color="secondary"
              trend={18}
            />
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search your groups..."
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Groups Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground font-heading">
                  Your Groups ({filteredGroups?.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" iconName="Filter" iconSize={16}>
                    Filter
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Grid3X3" iconSize={16} />
                </div>
              </div>

              {filteredGroups?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredGroups?.map((group) => (
                    <GroupCard
                      key={group?.id}
                      group={group}
                      userRole={userRoles?.[group?.id]}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {searchTerm ? 'No groups found' : 'No groups yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? `No groups match "${searchTerm}". Try a different search term.`
                      : 'Create your first group or join an existing one to get started'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        variant="outline"
                        iconName="UserPlus"
                        iconPosition="left"
                        onClick={() => setIsJoinModalOpen(true)}
                      >
                        Join Group
                      </Button>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        Create Group
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed activities={recentActivities} />
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="lg"
          iconName="Plus"
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-full w-14 h-14 festival-shadow-lg"
        />
      </div>
      {/* Modals */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;