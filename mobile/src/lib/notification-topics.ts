import type { NotificationChannel } from '@/data/types';

/** Must match the topics allowed by the notification_preferences table. */
export const notificationTopics = [
  { id: 'budgetChanges', section: 'Money', label: 'Budget changes' },
  { id: 'newExpenses', section: 'Money', label: 'New expenses' },
  { id: 'paymentReminders', section: 'Money', label: 'Payment reminders' },
  { id: 'newMembers', section: 'Group', label: 'New members' },
  { id: 'announcements', section: 'Group', label: 'Group announcements' },
  { id: 'newVendors', section: 'Marketplace', label: 'New vendors' },
  { id: 'securityAlerts', section: 'Account', label: 'Security alerts' },
] as const;

export const notificationChannels: { id: NotificationChannel; label: string }[] = [
  { id: 'push', label: 'Push' },
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
];

/** Used until someone changes a setting, matching the table's column defaults. */
export const defaultChannels: Record<NotificationChannel, boolean> = { push: true, email: false, sms: false };
