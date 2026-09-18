import type { EditableRoleId, GroupDetail, PermissionId, RoleId } from '@/data/types';

export const roleLabels: Record<RoleId, string> = {
  admin: 'Admin',
  organizer: 'Organizer',
  treasurer: 'Treasurer',
  member: 'Member',
};

export const roleOrder: RoleId[] = ['admin', 'organizer', 'treasurer', 'member'];

/** Admins always have every permission, so only these roles are editable. */
export const editableRoles: EditableRoleId[] = ['organizer', 'treasurer', 'member'];

export const permissionLabels: Record<PermissionId, string> = {
  viewBudget: 'View budget',
  manageExpenses: 'Manage expenses and payments',
  inviteMembers: 'Invite members',
  accessMarketplace: 'Access marketplace',
  editGroupDetails: 'Edit group details and settings',
  viewMemberContacts: 'View member contacts',
};

/**
 * What the signed-in person may do in this group, as decided by the database.
 * The same rules are enforced there, so a modified app can't skip them.
 */
export function can(group: GroupDetail, permission: PermissionId): boolean {
  return group.myPermissions[permission];
}
