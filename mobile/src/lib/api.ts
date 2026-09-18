import type {
  ActivityEntry,
  AppNotification,
  EditableRoleId,
  ExpenseCategory,
  FestivalType,
  GroupDetail,
  GroupSummary,
  NotificationChannel,
  NotificationPreferences,
  PermissionId,
  PrivacySettings,
  Profile,
  Review,
  RoleId,
  Vendor,
} from '@/data/types';
import { asError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

// Reads go through the database's get_* functions, which return only what the
// caller's role may see. Writes go to tables and are checked by row-level security.

export async function fetchMyGroups(): Promise<GroupSummary[]> {
  const { data, error } = await supabase.rpc('get_my_groups');
  if (error) throw asError(error, "Couldn't load your groups.");
  return (data ?? []) as GroupSummary[];
}

export async function fetchGroupDetail(groupId: string): Promise<GroupDetail> {
  const { data, error } = await supabase.rpc('get_group_detail', { p_group_id: groupId });
  if (error) throw asError(error, "Couldn't load this group.");
  return data as GroupDetail;
}

export async function fetchActivity(groupId?: string, limit = 20): Promise<ActivityEntry[]> {
  const { data, error } = await supabase.rpc('get_activity', { p_group_id: groupId ?? null, p_limit: limit });
  if (error) throw asError(error, "Couldn't load recent activity.");
  return (data ?? []) as ActivityEntry[];
}

export async function fetchProfile(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('id, name, email, phone').maybeSingle();
  if (error) throw asError(error, "Couldn't load your profile.");
  return data as Profile | null;
}

export async function updateProfile(input: { name: string; phone: string | null }): Promise<void> {
  const { error } = await supabase.from('profiles').update(input).eq('id', await currentUserId());
  if (error) throw asError(error, "Couldn't save your profile.");
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Sign in to continue.');
  return data.user.id;
}

// --- Groups ----------------------------------------------------------------

export type NewGroup = {
  name: string;
  festivalType: FestivalType;
  location: string;
  startDate: string;
  endDate: string | null;
  totalBudget: number;
  description: string;
};

export async function createGroup(input: NewGroup): Promise<string> {
  const { data, error } = await supabase.rpc('create_group', {
    p_name: input.name,
    p_festival_type: input.festivalType,
    p_location: input.location,
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_total_budget: input.totalBudget,
    p_description: input.description,
  });
  if (error) throw asError(error, "Couldn't create the group.");
  return data as string;
}

export async function joinGroup(code: string): Promise<string> {
  const { data, error } = await supabase.rpc('join_group', { p_code: code.trim().toUpperCase() });
  if (error) throw asError(error, "Couldn't join that group.");
  return data as string;
}

export async function leaveGroup(groupId: string): Promise<void> {
  const { error } = await supabase.rpc('leave_group', { p_group_id: groupId });
  if (error) throw asError(error, "Couldn't leave the group.");
}

export async function deleteGroup(groupId: string): Promise<void> {
  const { error } = await supabase.from('groups').delete().eq('id', groupId);
  if (error) throw asError(error, "Couldn't delete the group.");
}

export type GroupDetailsInput = {
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
};

export async function updateGroupDetails(groupId: string, input: GroupDetailsInput): Promise<void> {
  const { error } = await supabase
    .from('groups')
    .update({
      name: input.name,
      description: input.description,
      location: input.location,
      start_date: input.startDate,
      end_date: input.endDate,
    })
    .eq('id', groupId);
  if (error) throw asError(error, "Couldn't save the group details.");
}

export async function setBudget(groupId: string, totalBudget: number): Promise<void> {
  const { error } = await supabase.from('groups').update({ total_budget: totalBudget }).eq('id', groupId);
  if (error) throw asError(error, "Couldn't update the budget.");
}

const privacyColumns: Record<keyof PrivacySettings, string> = {
  publicGroup: 'public_group',
  inviteOnly: 'invite_only',
  shareFinancialSummary: 'share_financial_summary',
  allowMemberInvites: 'allow_member_invites',
  showMemberContacts: 'show_member_contacts',
};

export async function setPrivacy(groupId: string, key: keyof PrivacySettings, value: boolean): Promise<void> {
  const { error } = await supabase
    .from('groups')
    .update({ [privacyColumns[key]]: value })
    .eq('id', groupId);
  if (error) throw asError(error, "Couldn't update the privacy setting.");
}

const permissionColumns: Record<PermissionId, string> = {
  viewBudget: 'view_budget',
  manageExpenses: 'manage_expenses',
  inviteMembers: 'invite_members',
  accessMarketplace: 'access_marketplace',
  editGroupDetails: 'edit_group_details',
  viewMemberContacts: 'view_member_contacts',
};

export async function setRolePermission(
  groupId: string,
  role: EditableRoleId,
  permission: PermissionId,
  value: boolean,
): Promise<void> {
  const { error } = await supabase
    .from('role_permissions')
    .update({ [permissionColumns[permission]]: value })
    .eq('group_id', groupId)
    .eq('role', role);
  if (error) throw asError(error, "Couldn't update permissions.");
}

// --- Members ---------------------------------------------------------------

export async function setMemberRole(groupId: string, memberId: string, role: RoleId): Promise<void> {
  const { error } = await supabase
    .from('group_members')
    .update({ role })
    .eq('group_id', groupId)
    .eq('user_id', memberId);
  if (error) throw asError(error, "Couldn't change that role.");
}

export async function removeMember(groupId: string, memberId: string): Promise<void> {
  const { error } = await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', memberId);
  if (error) throw asError(error, "Couldn't remove that member.");
}

// --- Money -----------------------------------------------------------------

export type NewExpense = {
  groupId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidById: string | null;
  date: string;
};

export async function addExpense(input: NewExpense): Promise<void> {
  const { error } = await supabase.from('expenses').insert({
    group_id: input.groupId,
    category: input.category,
    description: input.description,
    amount: input.amount,
    paid_by: input.paidById,
    spent_on: input.date,
  });
  if (error) throw asError(error, "Couldn't save the expense.");
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
  if (error) throw asError(error, "Couldn't delete the expense.");
}

export async function recordPayment(groupId: string, memberId: string, amount: number): Promise<void> {
  const { error } = await supabase
    .from('payments')
    .insert({ group_id: groupId, member_id: memberId, amount });
  if (error) throw asError(error, "Couldn't record the payment.");
}

// --- Invites ---------------------------------------------------------------

export async function createInvite(groupId: string): Promise<void> {
  // The code and expiry are generated by the database
  const { error } = await supabase.from('invites').insert({ group_id: groupId });
  if (error) throw asError(error, "Couldn't create an invite code.");
}

export async function revokeInvite(inviteId: string): Promise<void> {
  const { error } = await supabase.from('invites').delete().eq('id', inviteId);
  if (error) throw asError(error, "Couldn't revoke that code.");
}

// --- Vendors ---------------------------------------------------------------

type VendorRow = {
  id: string;
  name: string;
  category: Vendor['category'];
  description: string;
  rating: number;
  review_count: number;
  location: string;
  phone: string;
  email: string;
  price_min: number;
  price_max: number;
  verified: boolean;
  recommended_by_group: string | null;
  recommended_by_admin: string | null;
  recommended_on: string | null;
};

function toVendor(row: VendorRow): Vendor {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    location: row.location,
    phone: row.phone,
    email: row.email,
    priceMin: Number(row.price_min),
    priceMax: Number(row.price_max),
    verified: row.verified,
    recommendedBy: row.recommended_by_group
      ? {
          groupName: row.recommended_by_group,
          adminName: row.recommended_by_admin ?? 'A group admin',
          date: row.recommended_on ?? '',
        }
      : null,
  };
}

export async function fetchVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase.from('vendors').select('*').order('name');
  if (error) throw asError(error, "Couldn't load vendors.");
  return ((data ?? []) as VendorRow[]).map(toVendor);
}

export async function fetchVendorReviews(vendorId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('vendor_reviews')
    .select('id, author_name, rating, comment, reviewed_on')
    .eq('vendor_id', vendorId)
    .order('reviewed_on', { ascending: false });
  if (error) throw asError(error, "Couldn't load reviews.");
  return (data ?? []).map((row) => ({
    id: row.id as string,
    authorName: row.author_name as string,
    rating: row.rating as number,
    comment: row.comment as string,
    date: row.reviewed_on as string,
  }));
}

export async function fetchFavoriteVendorIds(): Promise<string[]> {
  const { data, error } = await supabase.from('favorite_vendors').select('vendor_id');
  if (error) throw asError(error, "Couldn't load your saved vendors.");
  return (data ?? []).map((row) => row.vendor_id as string);
}

export async function setFavoriteVendor(vendorId: string, favorite: boolean): Promise<void> {
  if (favorite) {
    const { error } = await supabase.from('favorite_vendors').insert({ vendor_id: vendorId });
    if (error) throw asError(error, "Couldn't save that vendor.");
    return;
  }
  const { error } = await supabase.from('favorite_vendors').delete().eq('vendor_id', vendorId);
  if (error) throw asError(error, "Couldn't remove that vendor.");
}

// --- Notifications ---------------------------------------------------------

export async function fetchNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, message, amount, read, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw asError(error, "Couldn't load notifications.");
  return (data ?? []).map((row) => ({
    id: row.id as number,
    title: row.title as string,
    message: row.message as string,
    amount: row.amount === null ? null : Number(row.amount),
    read: row.read as boolean,
    timestamp: row.created_at as string,
  }));
}

export async function markNotificationsRead(): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
  if (error) throw asError(error, "Couldn't update notifications.");
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferences> {
  const { data, error } = await supabase.from('notification_preferences').select('topic, push, email, sms');
  if (error) throw asError(error, "Couldn't load notification settings.");
  const preferences: NotificationPreferences = {};
  for (const row of data ?? []) {
    preferences[row.topic as string] = {
      push: row.push as boolean,
      email: row.email as boolean,
      sms: row.sms as boolean,
    };
  }
  return preferences;
}

export async function setNotificationPreference(
  topic: string,
  channels: Record<NotificationChannel, boolean>,
): Promise<void> {
  const { error } = await supabase
    .from('notification_preferences')
    .upsert({ user_id: await currentUserId(), topic, ...channels }, { onConflict: 'user_id,topic' });
  if (error) throw asError(error, "Couldn't save that setting.");
}
