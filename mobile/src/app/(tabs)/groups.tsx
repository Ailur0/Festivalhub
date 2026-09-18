import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, RefreshControl, Share, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Banner } from '@/components/banner';
import { Button, IconButton } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { GroupSwitcher } from '@/components/group-switcher';
import { Icon } from '@/components/icon';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { SelectField } from '@/components/select-field';
import { StatCard, StatGrid } from '@/components/stat-card';
import { Spacing } from '@/constants/theme';
import type { GroupDetail, RoleId } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { getGroupFinances, type Contribution } from '@/lib/finance';
import { daysUntil, formatCurrency, formatDateRange, formatRelativeTime } from '@/lib/format';
import { festivalColors, festivalLabels } from '@/lib/labels';
import { can, roleLabels, roleOrder } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import {
  useActivity,
  useGroupDetail,
  useLeaveGroup,
  useRemoveMember,
  useSetMemberRole,
} from '@/state/queries';
import { useUserId } from '@/state/session';

type Segment = 'overview' | 'members';

export default function GroupScreen() {
  const colors = useTheme();
  const { activeGroupId, isLoading, error, refetch } = useActiveGroup();
  const groupQuery = useGroupDetail(activeGroupId);
  const [segment, setSegment] = useState<Segment>('overview');

  if (isLoading || (activeGroupId && groupQuery.isPending)) {
    return (
      <Screen title="Group">
        <LoadingState />
      </Screen>
    );
  }

  if (error || groupQuery.error) {
    return (
      <Screen title="Group">
        <ErrorState
          error={error ?? groupQuery.error}
          onRetry={() => {
            refetch();
            groupQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  const group = groupQuery.data;
  if (!group) {
    return (
      <Screen title="Group">
        <EmptyState
          icon="groups"
          title="You're not in a group yet"
          message="Create a group for your festival or join one with an invite code."
          action={
            <View style={styles.row}>
              <Button label="Create group" icon="plus" onPress={() => router.push('/group/create')} />
              <Button label="Join group" variant="secondary" onPress={() => router.push('/group/join')} />
            </View>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={groupQuery.isFetching && !groupQuery.isPending}
          onRefresh={() => groupQuery.refetch()}
          tintColor={colors.primary}
        />
      }>
      <GroupSwitcher
        action={
          can(group, 'editGroupDetails') ? (
            <IconButton icon="settings" accessibilityLabel="Group settings" onPress={() => router.push('/group/settings')} />
          ) : undefined
        }
      />
      <SegmentedControl
        segments={[
          { value: 'overview', label: 'Overview' },
          { value: 'members', label: `Members (${group.members.length})` },
        ]}
        value={segment}
        onChange={setSegment}
      />
      {segment === 'overview' ? <Overview group={group} /> : <Members group={group} />}
    </Screen>
  );
}

function Overview({ group }: { group: GroupDetail }) {
  const colors = useTheme();
  const userId = useUserId();
  const activityQuery = useActivity(group.id, 5);
  const leaveGroup = useLeaveGroup();
  const days = daysUntil(group.startDate);
  const ended = daysUntil(group.endDate) < 0;
  const canSeeBudget = can(group, 'viewBudget');
  const finances = canSeeBudget ? getGroupFinances(group) : null;

  const handleLeave = () => {
    confirmAction({
      title: 'Leave group?',
      message: `You will lose access to ${group.name}.`,
      confirmLabel: 'Leave',
      destructive: true,
      onConfirm: () => leaveGroup.mutate(group.id),
    });
  };

  return (
    <>
      <Card style={styles.hero}>
        <Banner icon="celebration" color={festivalColors[group.festivalType]} height={120} />
        <View style={styles.heroBody}>
          <View style={styles.badges}>
            <Badge label={festivalLabels[group.festivalType]} tone="primary" icon="celebration" />
            <Badge
              label={ended ? 'Finished' : days > 0 ? `In ${days} days` : 'Happening now'}
              tone={ended ? 'neutral' : days <= 0 ? 'success' : 'warning'}
            />
            <Badge label={`You: ${roleLabels[group.myRole]}`} />
          </View>
          <InfoRow icon="calendar" text={formatDateRange(group.startDate, group.endDate)} />
          <InfoRow icon="location" text={group.location} />
          {!!group.description && <AppText color="textMuted">{group.description}</AppText>}
        </View>
      </Card>

      {finances && (
        <Section
          title="Budget at a glance"
          action={<Button compact variant="ghost" label="Finances" onPress={() => router.navigate('/finances')} />}>
          <StatGrid>
            <StatCard
              label="Budget"
              value={formatCurrency(finances.totalBudget)}
              icon="wallet"
              caption={`${formatCurrency(finances.share)} per member`}
            />
            <StatCard
              label="Collected"
              value={formatCurrency(finances.collected)}
              icon="money"
              tone="success"
              caption={`${finances.paidCount} of ${group.members.length} paid in full`}
            />
            <StatCard
              label="Spent"
              value={formatCurrency(finances.spent)}
              icon="receipt"
              tone="warning"
              caption={`${group.expenses.length} expenses`}
            />
            <StatCard
              label="Balance"
              value={formatCurrency(finances.balance)}
              icon="trendingUp"
              tone={finances.balance < 0 ? 'danger' : 'success'}
              caption={finances.balance < 0 ? 'Spending exceeds collections' : 'Available to spend'}
            />
          </StatGrid>
        </Section>
      )}

      <Section title="Group activity">
        {activityQuery.isPending ? (
          <LoadingState />
        ) : (activityQuery.data ?? []).length === 0 ? (
          <AppText color="textMuted">No activity in this group yet.</AppText>
        ) : (
          <Card style={styles.list}>
            {(activityQuery.data ?? []).map((entry, index) => (
              <View
                key={entry.id}
                style={[
                  styles.listRow,
                  index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
                ]}>
                <View style={styles.flex}>
                  <AppText>
                    {entry.actorId === userId ? 'You' : entry.actorName} {entry.message}
                  </AppText>
                  <AppText variant="caption" color="textMuted">
                    {formatRelativeTime(entry.timestamp)}
                  </AppText>
                </View>
                {entry.amount !== null && <AppText variant="label">{formatCurrency(entry.amount)}</AppText>}
              </View>
            ))}
          </Card>
        )}
      </Section>

      {group.myRole !== 'admin' && (
        <Button
          label="Leave group"
          variant="secondary"
          icon="signOut"
          onPress={handleLeave}
          loading={leaveGroup.isPending}
        />
      )}
      {!!leaveGroup.error && <ErrorState error={leaveGroup.error} />}
    </>
  );
}

function InfoRow({ icon, text }: { icon: 'calendar' | 'location'; text: string }) {
  const colors = useTheme();
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} color={colors.textMuted} size={18} />
      <AppText style={styles.flex}>{text}</AppText>
    </View>
  );
}

function Members({ group }: { group: GroupDetail }) {
  const userId = useUserId();
  const canSeeBudget = can(group, 'viewBudget');
  const contributions = canSeeBudget ? getGroupFinances(group).contributions : null;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const shareInvite = () => {
    const invite = group.invites[0];
    const message = invite
      ? `Join "${group.name}" on FestivalHub with invite code ${invite.code}.`
      : `Join "${group.name}" on FestivalHub. Ask an admin for an invite code.`;
    Share.share({ message });
  };

  return (
    <>
      {can(group, 'inviteMembers') && (
        <Button
          label="Invite people"
          icon="personAdd"
          onPress={shareInvite}
          accessibilityHint="Opens the share sheet with an invite code"
        />
      )}
      <Card style={styles.list}>
        {group.members.map((member, index) => (
          <MemberRow
            key={member.id}
            group={group}
            member={member}
            contribution={contributions?.find((item) => item.id === member.id) ?? null}
            isMe={member.id === userId}
            first={index === 0}
            expanded={expandedId === member.id}
            onToggle={() => setExpandedId((id) => (id === member.id ? null : member.id))}
          />
        ))}
      </Card>
    </>
  );
}

function MemberRow({
  group,
  member,
  contribution,
  isMe,
  first,
  expanded,
  onToggle,
}: {
  group: GroupDetail;
  member: GroupDetail['members'][number];
  contribution: Contribution | null;
  isMe: boolean;
  first: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = useTheme();
  const setRole = useSetMemberRole(group.id);
  const removeMember = useRemoveMember(group.id);
  const iAmAdmin = group.myRole === 'admin';
  const canContact = !isMe && !!member.email;
  const hasActions = canContact || (iAmAdmin && !isMe);

  const statusTone =
    contribution?.status === 'paid' ? 'success' : contribution?.status === 'partial' ? 'warning' : 'danger';
  const statusLabel =
    contribution?.status === 'paid' ? 'Paid' : contribution?.status === 'partial' ? 'Partly paid' : 'Not paid';

  const handleRemove = () => {
    confirmAction({
      title: 'Remove member?',
      message: `${member.name} will be removed from ${group.name}.`,
      confirmLabel: 'Remove',
      destructive: true,
      onConfirm: () => removeMember.mutate(member.id),
    });
  };

  const displayName = isMe ? `${member.name} (you)` : member.name;

  return (
    <View style={[!first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
      <Pressable
        onPress={hasActions ? onToggle : undefined}
        disabled={!hasActions}
        accessibilityRole={hasActions ? 'button' : undefined}
        accessibilityState={hasActions ? { expanded } : undefined}
        accessibilityLabel={`${displayName}, ${roleLabels[member.role]}, ${member.responsibility}${
          contribution ? `, ${statusLabel}` : ''
        }`}
        style={styles.memberRow}>
        <Avatar name={member.name} />
        <View style={styles.flex}>
          <AppText variant="label" numberOfLines={1}>
            {displayName}
          </AppText>
          <AppText variant="caption" color="textMuted" numberOfLines={1}>
            {roleLabels[member.role]} · {member.responsibility}
          </AppText>
        </View>
        {contribution && <Badge label={statusLabel} tone={statusTone} />}
        {hasActions && <Icon name={expanded ? 'chevronUp' : 'chevronDown'} color={colors.textMuted} size={20} />}
      </Pressable>

      {expanded && (
        <View style={styles.memberActions}>
          {canContact && (
            <View style={styles.row}>
              {!!member.phone && (
                <Button
                  compact
                  variant="secondary"
                  icon="phone"
                  label="Call"
                  onPress={() => Linking.openURL(`tel:${member.phone}`)}
                  style={styles.flex}
                />
              )}
              <Button
                compact
                variant="secondary"
                icon="mail"
                label="Email"
                onPress={() => Linking.openURL(`mailto:${member.email}`)}
                style={styles.flex}
              />
            </View>
          )}
          {iAmAdmin && !isMe && (
            <>
              <SelectField<RoleId>
                label="Role"
                value={member.role}
                options={roleOrder.map((role) => ({ value: role, label: roleLabels[role] }))}
                onChange={(role) => setRole.mutate({ memberId: member.id, role })}
              />
              <Button
                compact
                variant="secondary"
                icon="personRemove"
                label="Remove from group"
                onPress={handleRemove}
                loading={removeMember.isPending}
              />
            </>
          )}
          {!!(setRole.error || removeMember.error) && <ErrorState error={setRole.error ?? removeMember.error} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  hero: {
    padding: 0,
    overflow: 'hidden',
  },
  heroBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  list: {
    paddingVertical: 0,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 64,
    paddingVertical: Spacing.sm,
  },
  memberActions: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
});
