import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button, IconButton } from '@/components/button';
import { Card } from '@/components/card';
import { DateField } from '@/components/date-field';
import { EmptyState } from '@/components/empty-state';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { SwitchRow } from '@/components/switch-row';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';
import type { EditableRoleId, GroupDetail, PermissionId, PrivacySettings } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { formatDate, isValidIsoDate, parseDate } from '@/lib/format';
import { can, editableRoles, permissionLabels, roleLabels } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import {
  useCreateInvite,
  useDeleteGroup,
  useGroupDetail,
  useRevokeInvite,
  useSetPrivacy,
  useSetRolePermission,
  useUpdateGroupDetails,
} from '@/state/queries';

const privacyOptions: { key: keyof PrivacySettings; label: string; description: string }[] = [
  { key: 'publicGroup', label: 'Public group', description: 'Anyone can find the group and see its basic details' },
  { key: 'inviteOnly', label: 'Invite only', description: 'New members need an invite code to join' },
  {
    key: 'shareFinancialSummary',
    label: 'Share financial summary',
    description: 'Members can see budget and expense totals',
  },
  { key: 'allowMemberInvites', label: 'Members can invite others', description: 'Not just admins and organizers' },
  {
    key: 'showMemberContacts',
    label: 'Show member contacts',
    description: 'Phone numbers and emails are visible in the group',
  },
];

export default function GroupSettingsScreen() {
  const { activeGroupId } = useActiveGroup();
  const groupQuery = useGroupDetail(activeGroupId);

  if (groupQuery.isPending) {
    return (
      <Screen topInset={false}>
        <LoadingState />
      </Screen>
    );
  }

  if (groupQuery.error) {
    return (
      <Screen topInset={false}>
        <ErrorState error={groupQuery.error} onRetry={() => groupQuery.refetch()} />
      </Screen>
    );
  }

  const group = groupQuery.data;
  if (!group || !can(group, 'editGroupDetails')) {
    return (
      <Screen topInset={false}>
        <EmptyState icon="lock" title="Admins only" message="Only group admins can change these settings." />
      </Screen>
    );
  }

  return (
    <Screen topInset={false}>
      <DetailsSection group={group} />
      <PrivacySection group={group} />
      {group.permissions && <PermissionsSection group={group} permissions={group.permissions} />}
      <InvitesSection group={group} />
      <DangerSection group={group} />
    </Screen>
  );
}

function DetailsSection({ group }: { group: GroupDetail }) {
  const updateDetails = useUpdateGroupDetails(group.id);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [location, setLocation] = useState(group.location);
  const [startDate, setStartDate] = useState(group.startDate);
  const [endDate, setEndDate] = useState(group.endDate);
  const [errors, setErrors] = useState<Partial<Record<'name' | 'location' | 'startDate' | 'endDate', string>>>({});
  const [saved, setSaved] = useState(false);

  const edit = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setSaved(false);
  };

  const dirty =
    name !== group.name ||
    description !== group.description ||
    location !== group.location ||
    startDate !== group.startDate ||
    endDate !== group.endDate;

  const save = () => {
    const next = {
      name: name.trim().length >= 3 ? undefined : 'Enter a group name (at least 3 characters)',
      location: location.trim() ? undefined : 'Enter a location',
      startDate: isValidIsoDate(startDate) ? undefined : 'Enter a valid start date',
      endDate:
        isValidIsoDate(endDate) && (!isValidIsoDate(startDate) || parseDate(endDate) >= parseDate(startDate))
          ? undefined
          : 'The end date must be on or after the start date',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    updateDetails.mutate(
      { name: name.trim(), description: description.trim(), location: location.trim(), startDate, endDate },
      { onSuccess: () => setSaved(true) },
    );
  };

  return (
    <Section title="Details">
      <Card style={styles.stack}>
        <TextField label="Group name" value={name} onChangeText={edit(setName)} error={errors.name} maxLength={60} required />
        <TextField label="Location" value={location} onChangeText={edit(setLocation)} error={errors.location} required />
        <DateField label="Start date" value={startDate} onChange={edit(setStartDate)} error={errors.startDate} required />
        <DateField label="End date" value={endDate} onChange={edit(setEndDate)} error={errors.endDate} required />
        <TextField label="Description" value={description} onChangeText={edit(setDescription)} multiline maxLength={300} />
        <Button
          label={saved && !dirty ? 'Saved' : 'Save details'}
          icon="check"
          onPress={save}
          disabled={!dirty}
          loading={updateDetails.isPending}
        />
        {!!updateDetails.error && <ErrorState error={updateDetails.error} />}
      </Card>
    </Section>
  );
}

function PrivacySection({ group }: { group: GroupDetail }) {
  const setPrivacy = useSetPrivacy(group.id);
  return (
    <Section title="Privacy">
      <Card>
        {privacyOptions.map((option) => (
          <SwitchRow
            key={option.key}
            label={option.label}
            description={option.description}
            value={group.privacy[option.key]}
            onValueChange={(value) => setPrivacy.mutate({ key: option.key, value })}
          />
        ))}
      </Card>
      {!!setPrivacy.error && <ErrorState error={setPrivacy.error} />}
    </Section>
  );
}

function PermissionsSection({
  group,
  permissions,
}: {
  group: GroupDetail;
  permissions: NonNullable<GroupDetail['permissions']>;
}) {
  const setPermission = useSetRolePermission(group.id);
  const [role, setRole] = useState<EditableRoleId>('organizer');

  return (
    <Section title="Role permissions">
      <AppText color="textMuted">Admins can always do everything. Choose what other roles can do.</AppText>
      <View style={styles.roleButtons}>
        {editableRoles.map((item) => (
          <Button
            key={item}
            compact
            label={roleLabels[item]}
            variant={item === role ? 'primary' : 'secondary'}
            onPress={() => setRole(item)}
            style={styles.flex}
          />
        ))}
      </View>
      <Card>
        {(Object.keys(permissionLabels) as PermissionId[]).map((permission) => (
          <SwitchRow
            key={permission}
            label={permissionLabels[permission]}
            value={permissions[role][permission]}
            onValueChange={(value) => setPermission.mutate({ role, permission, value })}
          />
        ))}
      </Card>
      {!!setPermission.error && <ErrorState error={setPermission.error} />}
    </Section>
  );
}

function InvitesSection({ group }: { group: GroupDetail }) {
  const colors = useTheme();
  const createInvite = useCreateInvite(group.id);
  const revokeInvite = useRevokeInvite(group.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  return (
    <Section
      title="Invite codes"
      action={<Button compact label="New code" icon="plus" onPress={() => createInvite.mutate()} loading={createInvite.isPending} />}>
      {group.invites.length === 0 ? (
        <AppText color="textMuted">No active invite codes. Create one to share with new members.</AppText>
      ) : (
        <Card style={styles.list}>
          {group.invites.map((invite, index) => (
            <View
              key={invite.id}
              style={[
                styles.inviteRow,
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              ]}>
              <View style={styles.flex}>
                <AppText variant="heading" style={styles.code} selectable>
                  {invite.code}
                </AppText>
                <AppText variant="caption" color="textMuted">
                  {invite.uses}/{invite.maxUses} used · expires {formatDate(invite.expiresAt)}
                </AppText>
                {copiedId === invite.id && (
                  <AppText variant="caption" color="success" accessibilityLiveRegion="polite">
                    Copied
                  </AppText>
                )}
              </View>
              <IconButton
                icon="copy"
                accessibilityLabel={`Copy code ${invite.code}`}
                onPress={async () => {
                  await Clipboard.setStringAsync(invite.code);
                  setCopiedId(invite.id);
                }}
              />
              <IconButton
                icon="share"
                accessibilityLabel={`Share code ${invite.code}`}
                onPress={() =>
                  Share.share({ message: `Join "${group.name}" on FestivalHub with invite code ${invite.code}.` })
                }
              />
              <IconButton
                icon="trash"
                color={colors.danger}
                accessibilityLabel={`Revoke code ${invite.code}`}
                onPress={() =>
                  confirmAction({
                    title: 'Revoke invite code?',
                    message: `${invite.code} will stop working immediately.`,
                    confirmLabel: 'Revoke',
                    destructive: true,
                    onConfirm: () => revokeInvite.mutate(invite.id),
                  })
                }
              />
            </View>
          ))}
        </Card>
      )}
      {!!(createInvite.error || revokeInvite.error) && <ErrorState error={createInvite.error ?? revokeInvite.error} />}
    </Section>
  );
}

function DangerSection({ group }: { group: GroupDetail }) {
  const deleteGroup = useDeleteGroup();

  const handleDelete = () =>
    confirmAction({
      title: 'Delete group?',
      message: `${group.name}, its members, expenses and invites will be deleted. This can't be undone.`,
      confirmLabel: 'Delete group',
      destructive: true,
      onConfirm: () => deleteGroup.mutate(group.id, { onSuccess: () => router.back() }),
    });

  return (
    <Section title="Danger zone">
      <Button label="Delete group" icon="trash" variant="danger" onPress={handleDelete} loading={deleteGroup.isPending} />
      {!!deleteGroup.error && <ErrorState error={deleteGroup.error} />}
    </Section>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  stack: {
    gap: Spacing.lg,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  list: {
    paddingVertical: 0,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  code: {
    letterSpacing: 1.5,
    fontVariant: ['tabular-nums'],
  },
});
