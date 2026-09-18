import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import type {
  EditableRoleId,
  NotificationChannel,
  PermissionId,
  PrivacySettings,
  RoleId,
} from '@/data/types';
import * as api from '@/lib/api';
import { useUserId } from '@/state/session';

// Query keys are grouped so a mutation can refresh exactly what it changed.
export const keys = {
  groups: ['groups'] as const,
  group: (groupId: string) => ['group', groupId] as const,
  activity: (groupId?: string) => ['activity', groupId ?? 'all'] as const,
  profile: ['profile'] as const,
  vendors: ['vendors'] as const,
  vendorReviews: (vendorId: string) => ['vendor-reviews', vendorId] as const,
  favorites: ['favorites'] as const,
  notifications: ['notifications'] as const,
  notificationPreferences: ['notification-preferences'] as const,
};

/** Anything that changes a group's money, members or settings. */
function refreshGroup(client: QueryClient, groupId: string) {
  client.invalidateQueries({ queryKey: keys.group(groupId) });
  client.invalidateQueries({ queryKey: keys.groups });
  client.invalidateQueries({ queryKey: ['activity'] });
}

export function useMyGroups() {
  const userId = useUserId();
  return useQuery({ queryKey: keys.groups, queryFn: api.fetchMyGroups, enabled: !!userId });
}

export function useGroupDetail(groupId: string | null) {
  return useQuery({
    queryKey: keys.group(groupId ?? 'none'),
    queryFn: () => api.fetchGroupDetail(groupId as string),
    enabled: !!groupId,
  });
}

export function useActivity(groupId?: string, limit = 20) {
  const userId = useUserId();
  return useQuery({
    queryKey: keys.activity(groupId),
    queryFn: () => api.fetchActivity(groupId, limit),
    enabled: !!userId,
  });
}

export function useProfile() {
  const userId = useUserId();
  return useQuery({ queryKey: keys.profile, queryFn: api.fetchProfile, enabled: !!userId });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.profile }),
  });
}

export function useCreateGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.createGroup,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.groups });
      client.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useJoinGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.joinGroup,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.groups });
      client.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useLeaveGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.leaveGroup,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.groups });
      client.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useDeleteGroup() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.groups });
      client.invalidateQueries({ queryKey: ['activity'] });
    },
  });
}

export function useUpdateGroupDetails(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: api.GroupDetailsInput) => api.updateGroupDetails(groupId, input),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useSetBudget(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (totalBudget: number) => api.setBudget(groupId, totalBudget),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useSetPrivacy(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { key: keyof PrivacySettings; value: boolean }) =>
      api.setPrivacy(groupId, input.key, input.value),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useSetRolePermission(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { role: EditableRoleId; permission: PermissionId; value: boolean }) =>
      api.setRolePermission(groupId, input.role, input.permission, input.value),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useSetMemberRole(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { memberId: string; role: RoleId }) => api.setMemberRole(groupId, input.memberId, input.role),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useRemoveMember(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => api.removeMember(groupId, memberId),
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useAddExpense(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.addExpense,
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useDeleteExpense(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.deleteExpense,
    onSuccess: () => refreshGroup(client, groupId),
  });
}

export function useRecordPayment(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { memberId: string; amount: number }) =>
      api.recordPayment(groupId, input.memberId, input.amount),
    onSuccess: () => {
      refreshGroup(client, groupId);
      client.invalidateQueries({ queryKey: keys.notifications });
    },
  });
}

export function useCreateInvite(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => api.createInvite(groupId),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.group(groupId) }),
  });
}

export function useRevokeInvite(groupId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.revokeInvite,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.group(groupId) }),
  });
}

export function useVendors() {
  const userId = useUserId();
  return useQuery({ queryKey: keys.vendors, queryFn: api.fetchVendors, enabled: !!userId, staleTime: 5 * 60_000 });
}

export function useVendorReviews(vendorId: string) {
  return useQuery({ queryKey: keys.vendorReviews(vendorId), queryFn: () => api.fetchVendorReviews(vendorId) });
}

export function useFavoriteVendors() {
  const userId = useUserId();
  return useQuery({ queryKey: keys.favorites, queryFn: api.fetchFavoriteVendorIds, enabled: !!userId });
}

export function useToggleFavoriteVendor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { vendorId: string; favorite: boolean }) =>
      api.setFavoriteVendor(input.vendorId, input.favorite),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.favorites }),
  });
}

export function useNotifications() {
  const userId = useUserId();
  return useQuery({ queryKey: keys.notifications, queryFn: api.fetchNotifications, enabled: !!userId });
}

export function useMarkNotificationsRead() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: api.markNotificationsRead,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.notifications }),
  });
}

export function useNotificationPreferences() {
  const userId = useUserId();
  return useQuery({
    queryKey: keys.notificationPreferences,
    queryFn: api.fetchNotificationPreferences,
    enabled: !!userId,
  });
}

export function useSetNotificationPreference() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { topic: string; channels: Record<NotificationChannel, boolean> }) =>
      api.setNotificationPreference(input.topic, input.channels),
    onSuccess: () => client.invalidateQueries({ queryKey: keys.notificationPreferences }),
  });
}
