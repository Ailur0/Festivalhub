// Shapes returned by the database. The get_* functions return camelCase JSON;
// plain table reads are mapped to these shapes in src/lib/api.ts.

export type RoleId = 'admin' | 'organizer' | 'treasurer' | 'member';

/** Roles whose permissions can be edited. Admins always have every permission. */
export type EditableRoleId = Exclude<RoleId, 'admin'>;

export type PermissionId =
  | 'viewBudget'
  | 'manageExpenses'
  | 'inviteMembers'
  | 'accessMarketplace'
  | 'editGroupDetails'
  | 'viewMemberContacts';

export type FestivalType = 'diwali' | 'navratri' | 'holi' | 'ganesh-chaturthi' | 'durga-puja' | 'other';

export type ExpenseCategory =
  | 'Decoration'
  | 'Prasad'
  | 'Pooja Items'
  | 'Logistics'
  | 'Cultural Events'
  | 'Miscellaneous';

export type VendorCategory =
  | 'Catering'
  | 'Decoration'
  | 'Sound & Lighting'
  | 'Photography'
  | 'Transportation'
  | 'Supplies'
  | 'Security'
  | 'Cleaning';

export type Profile = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export type Member = {
  id: string;
  name: string;
  /** Null when the group hides member contacts or your role can't see them */
  email: string | null;
  phone: string | null;
  role: RoleId;
  responsibility: string;
  /** Null when your role can't see the budget */
  paidAmount: number | null;
};

export type Expense = {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidById: string | null;
  paidBy: string;
  date: string;
};

export type Invite = {
  id: string;
  code: string;
  maxUses: number;
  uses: number;
  expiresAt: string;
};

export type PrivacySettings = {
  publicGroup: boolean;
  inviteOnly: boolean;
  shareFinancialSummary: boolean;
  allowMemberInvites: boolean;
  showMemberContacts: boolean;
};

export type Permissions = Record<PermissionId, boolean>;

export type RolePermissions = Record<EditableRoleId, Permissions>;

/** One row per group on the Home screen and in the group switcher. */
export type GroupSummary = {
  id: string;
  name: string;
  festivalType: FestivalType;
  location: string;
  startDate: string;
  endDate: string;
  myRole: RoleId;
  memberCount: number;
  canViewBudget: boolean;
  totalBudget: number | null;
  collected: number | null;
  spent: number | null;
};

/** Everything one group's screens need, already filtered to what you may see. */
export type GroupDetail = {
  id: string;
  name: string;
  festivalType: FestivalType;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  totalBudget: number | null;
  myRole: RoleId;
  myPermissions: Permissions;
  privacy: PrivacySettings;
  /** Only sent to admins, who are the only ones who can edit it */
  permissions: RolePermissions | null;
  members: Member[];
  expenses: Expense[];
  /** Money collected from people who have since left, so totals still add up */
  formerMemberPayments: number;
  invites: Invite[];
};

export type ActivityType =
  | 'payment'
  | 'member-joined'
  | 'expense-added'
  | 'expense-removed'
  | 'budget-updated'
  | 'group-created';

export type ActivityEntry = {
  id: number;
  groupId: string;
  groupName: string;
  type: ActivityType;
  actorId: string | null;
  actorName: string;
  message: string;
  amount: number | null;
  timestamp: string;
};

export type AppNotification = {
  id: number;
  title: string;
  message: string;
  amount: number | null;
  read: boolean;
  timestamp: string;
};

export type NotificationChannel = 'push' | 'email' | 'sms';

export type NotificationPreferences = Record<string, Record<NotificationChannel, boolean>>;

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  rating: number;
  reviewCount: number;
  location: string;
  phone: string;
  email: string;
  priceMin: number;
  priceMax: number;
  verified: boolean;
  recommendedBy: { groupName: string; adminName: string; date: string } | null;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
};
