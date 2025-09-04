import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import GroupContextNavigation from '../../components/ui/GroupContextNavigation';
import OverviewCard from './components/OverviewCard';
import BudgetCalculator from './components/BudgetCalculator';
import MemberContributionCard from './components/MemberContributionCard';
import ExpenseCategory from './components/ExpenseCategory';
import CollectionProgress from './components/CollectionProgress';
import AddExpenseModal from './components/AddExpenseModal';
import ExportReportModal from './components/ExportReportModal';
import Button from '../../components/ui/Button';


const FinancialDashboard = () => {
  const navigate = useNavigate();
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Mock data
  const currentUser = {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    role: "admin"
  };

  const currentGroup = {
    id: 1,
    name: "Diwali Celebration 2024",
    type: "Festival Committee",
    memberCount: 12,
    totalBudget: 5000,
    collectedAmount: 3200,
    totalExpenses: 1800
  };

  const [budgetData, setBudgetData] = useState({
    totalBudget: currentGroup?.totalBudget,
    collectedAmount: currentGroup?.collectedAmount,
    totalExpenses: currentGroup?.totalExpenses,
    remainingBalance: currentGroup?.collectedAmount - currentGroup?.totalExpenses
  });

  const members = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Admin",
      totalAmount: 417,
      paidAmount: 417,
      status: "paid",
      phone: "+1-555-0101",
      email: "rajesh.kumar@email.com"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Treasurer",
      totalAmount: 417,
      paidAmount: 417,
      status: "paid",
      phone: "+1-555-0102",
      email: "priya.sharma@email.com"
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "Decoration Head",
      totalAmount: 417,
      paidAmount: 200,
      status: "pending",
      phone: "+1-555-0103",
      email: "amit.patel@email.com"
    },
    {
      id: 4,
      name: "Sunita Gupta",
      role: "Cultural Events",
      totalAmount: 417,
      paidAmount: 0,
      status: "overdue",
      phone: "+1-555-0104",
      email: "sunita.gupta@email.com"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Logistics",
      totalAmount: 417,
      paidAmount: 417,
      status: "paid",
      phone: "+1-555-0105",
      email: "vikram.singh@email.com"
    },
    {
      id: 6,
      name: "Meera Joshi",
      role: "Prasad Preparation",
      totalAmount: 417,
      paidAmount: 300,
      status: "pending",
      phone: "+1-555-0106",
      email: "meera.joshi@email.com"
    }
  ];

  const initialExpenses = [
    {
      id: 1,
      category: "Decoration",
      description: "Marigold flowers and rangoli materials",
      amount: 250,
      assignedTo: "Amit Patel",
      date: "2024-08-25"
    },
    {
      id: 2,
      category: "Decoration",
      description: "LED lights and diyas",
      amount: 180,
      assignedTo: "Amit Patel",
      date: "2024-08-26"
    },
    {
      id: 3,
      category: "Prasad",
      description: "Sweets and dry fruits",
      amount: 320,
      assignedTo: "Meera Joshi",
      date: "2024-08-27"
    },
    {
      id: 4,
      category: "Pooja Items",
      description: "Incense, camphor, and oil lamps",
      amount: 150,
      assignedTo: "Rajesh Kumar",
      date: "2024-08-28"
    },
    {
      id: 5,
      category: "Cultural Events",
      description: "Sound system rental",
      amount: 400,
      assignedTo: "Sunita Gupta",
      date: "2024-08-29"
    },
    {
      id: 6,
      category: "Logistics",
      description: "Tables and chairs rental",
      amount: 300,
      assignedTo: "Vikram Singh",
      date: "2024-08-29"
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      type: 'financial',
      priority: 'high',
      title: 'Payment Overdue',
      message: 'Sunita Gupta has an overdue payment of $417',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionRequired: true,
      actionText: 'Send Reminder'
    },
    {
      id: 2,
      type: 'financial',
      priority: 'medium',
      title: 'Expense Added',
      message: 'New expense of $400 added for Cultural Events',
      timestamp: new Date(Date.now() - 7200000),
      read: false
    },
    {
      id: 3,
      type: 'group',
      priority: 'low',
      title: 'Budget Updated',
      message: 'Total budget has been updated to $5,000',
      timestamp: new Date(Date.now() - 86400000),
      read: true
    }
  ];

  useEffect(() => {
    setExpenses(initialExpenses);
    setNotifications(mockNotifications);
  }, []);

  const handleBudgetUpdate = (newBudget) => {
    setBudgetData(prev => ({
      ...prev,
      totalBudget: newBudget
    }));
  };

  const handleContactMember = (member, method) => {
    if (method === 'phone') {
      window.open(`tel:${member?.phone}`);
    } else if (method === 'email') {
      window.open(`mailto:${member?.email}?subject=Festival Contribution Reminder&body=Dear ${member?.name},%0D%0A%0D%0AThis is a friendly reminder about your contribution for the ${currentGroup?.name}.`);
    }
  };

  const handleMarkAsPaid = (memberId) => {
    // In real app, this would update the backend
    console.log(`Marking member ${memberId} as paid`);
  };

  const handleAddExpense = (category) => {
    setSelectedCategory(category);
    setIsAddExpenseModalOpen(true);
  };

  const handleExpenseSubmit = (newExpense) => {
    setExpenses(prev => [...prev, newExpense]);
    setBudgetData(prev => ({
      ...prev,
      totalExpenses: prev?.totalExpenses + newExpense?.amount,
      remainingBalance: prev?.collectedAmount - (prev?.totalExpenses + newExpense?.amount)
    }));
  };

  const handleEditExpense = (expense) => {
    console.log('Edit expense:', expense);
  };

  const handleDeleteExpense = (expenseId) => {
    const expenseToDelete = expenses?.find(e => e?.id === expenseId);
    if (expenseToDelete) {
      setExpenses(prev => prev?.filter(e => e?.id !== expenseId));
      setBudgetData(prev => ({
        ...prev,
        totalExpenses: prev?.totalExpenses - expenseToDelete?.amount,
        remainingBalance: prev?.collectedAmount - (prev?.totalExpenses - expenseToDelete?.amount)
      }));
    }
  };

  const handleExportReport = (reportData) => {
    console.log('Exporting report:', reportData);
    // In real app, this would generate and download the report
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
  };

  const categories = ['Decoration', 'Prasad', 'Pooja Items', 'Logistics', 'Cultural Events', 'Miscellaneous'];
  const expensesByCategory = categories?.reduce((acc, category) => {
    acc[category] = expenses?.filter(expense => expense?.category === category);
    return acc;
  }, {});

  const paidMembers = members?.filter(member => member?.status === 'paid')?.length;
  const overviewCards = [
    {
      title: 'Total Budget',
      amount: budgetData?.totalBudget,
      percentage: 0,
      trend: 'neutral',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Amount Collected',
      amount: budgetData?.collectedAmount,
      percentage: ((budgetData?.collectedAmount / budgetData?.totalBudget) * 100)?.toFixed(1),
      trend: 'up',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Total Expenses',
      amount: budgetData?.totalExpenses,
      percentage: ((budgetData?.totalExpenses / budgetData?.totalBudget) * 100)?.toFixed(1),
      trend: 'up',
      icon: 'Receipt',
      color: 'warning'
    },
    {
      title: 'Remaining Balance',
      amount: budgetData?.remainingBalance,
      percentage: ((budgetData?.remainingBalance / budgetData?.totalBudget) * 100)?.toFixed(1),
      trend: budgetData?.remainingBalance > 0 ? 'up' : 'down',
      icon: 'Wallet',
      color: budgetData?.remainingBalance > 0 ? 'success' : 'error'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={currentUser} 
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
      <GroupContextNavigation 
        group={currentGroup} 
        userRole={currentUser?.role} 
      />
      <main className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-heading mb-2">
                Financial Dashboard
              </h1>
              <p className="text-muted-foreground">
                Comprehensive budget oversight and expense management for {currentGroup?.name}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={() => setIsExportModalOpen(true)}
              >
                Export Report
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsAddExpenseModalOpen(true)}
              >
                Add Expense
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewCards?.map((card, index) => (
              <OverviewCard
                key={index}
                title={card?.title}
                amount={card?.amount}
                percentage={card?.percentage}
                trend={card?.trend}
                icon={card?.icon}
                color={card?.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Budget Calculator */}
              <BudgetCalculator
                totalBudget={budgetData?.totalBudget}
                memberCount={currentGroup?.memberCount}
                onBudgetUpdate={handleBudgetUpdate}
              />

              {/* Expense Categories */}
              <div>
                <h2 className="text-xl font-semibold text-foreground font-heading mb-6">
                  Expense Management
                </h2>
                <div className="space-y-4">
                  {categories?.map(category => (
                    <ExpenseCategory
                      key={category}
                      category={category}
                      expenses={expensesByCategory?.[category]}
                      onAddExpense={handleAddExpense}
                      onEditExpense={handleEditExpense}
                      onDeleteExpense={handleDeleteExpense}
                      userRole={currentUser?.role}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Collection Progress */}
              <CollectionProgress
                totalBudget={budgetData?.totalBudget}
                collectedAmount={budgetData?.collectedAmount}
                memberCount={currentGroup?.memberCount}
                paidMembers={paidMembers}
              />

              {/* Member Contributions */}
              <div>
                <h2 className="text-xl font-semibold text-foreground font-heading mb-6">
                  Member Contributions
                </h2>
                <div className="space-y-4">
                  {members?.map(member => (
                    <MemberContributionCard
                      key={member?.id}
                      member={member}
                      onContactMember={handleContactMember}
                      onMarkAsPaid={handleMarkAsPaid}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="icon"
          iconName="Plus"
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="w-14 h-14 rounded-full festival-shadow-lg"
        />
      </div>
      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => {
          setIsAddExpenseModalOpen(false);
          setSelectedCategory('');
        }}
        onAddExpense={handleExpenseSubmit}
        selectedCategory={selectedCategory}
        members={members}
      />
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportReport}
        financialData={{
          group: currentGroup,
          budget: budgetData,
          members,
          expenses,
          categories: expensesByCategory
        }}
      />
    </div>
  );
};

export default FinancialDashboard;