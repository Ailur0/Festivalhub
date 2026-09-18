import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Banner } from '@/components/banner';
import { Button, IconButton } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Icon, type IconName } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { StatCard, StatGrid } from '@/components/stat-card';
import { TextField } from '@/components/text-field';
import { Radius, Spacing } from '@/constants/theme';
import type { ActivityType, GroupSummary } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { daysUntil, formatCurrency, formatDateRange, formatRelativeTime } from '@/lib/format';
import { festivalColors, festivalLabels } from '@/lib/labels';
import { roleLabels } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import { useActivity, useMyGroups, useNotifications, useProfile } from '@/state/queries';
import { useUserId } from '@/state/session';

const activityIcons: Record<ActivityType, IconName> = {
  payment: 'money',
  'member-joined': 'personAdd',
  'expense-added': 'receipt',
  'expense-removed': 'trash',
  'budget-updated': 'trendingUp',
  'group-created': 'celebration',
};

export default function HomeScreen() {
  const colors = useTheme();
  const userId = useUserId();
  const { setActiveGroupId } = useActiveGroup();
  const [query, setQuery] = useState('');

  const groupsQuery = useMyGroups();
  const activityQuery = useActivity(undefined, 10);
  const notificationsQuery = useNotifications();
  const profileQuery = useProfile();

  const groups = groupsQuery.data ?? [];
  const unread = (notificationsQuery.data ?? []).filter((notification) => !notification.read).length;

  const totals = useMemo(() => {
    const visible = groups.filter((group) => group.canViewBudget);
    return {
      budget: visible.reduce((sum, group) => sum + (group.totalBudget ?? 0), 0),
      collected: visible.reduce((sum, group) => sum + (group.collected ?? 0), 0),
      active: groups.filter((group) => daysUntil(group.endDate) >= 0).length,
      people: groups.reduce((sum, group) => sum + group.memberCount, 0),
    };
  }, [groups]);

  const nextFestival = useMemo(
    () =>
      groups
        .filter((group) => daysUntil(group.startDate) > 0)
        .sort((a, b) => daysUntil(a.startDate) - daysUntil(b.startDate))[0],
    [groups],
  );

  const filteredGroups = groups.filter((group) => {
    const text = `${group.name} ${festivalLabels[group.festivalType]} ${group.location}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  const openGroup = (group: GroupSummary) => {
    setActiveGroupId(group.id);
    router.navigate('/groups');
  };

  const firstName = profileQuery.data?.name.split(' ')[0] ?? 'there';
  const subtitle = nextFestival
    ? `${nextFestival.name} starts in ${daysUntil(nextFestival.startDate)} days`
    : 'Plan your next celebration';

  const refreshing = groupsQuery.isFetching && !groupsQuery.isPending;
  const refreshAll = () => {
    groupsQuery.refetch();
    activityQuery.refetch();
    notificationsQuery.refetch();
  };

  return (
    <Screen
      title={`Hi, ${firstName}`}
      subtitle={subtitle}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} tintColor={colors.primary} />}
      headerRight={
        <View style={styles.headerActions}>
          <IconButton
            icon="bell"
            accessibilityLabel="Notifications"
            badge={unread}
            onPress={() => router.push('/notifications')}
          />
          <Pressable
            onPress={() => router.push('/account')}
            accessibilityRole="button"
            accessibilityLabel="Account"
            hitSlop={6}>
            <Avatar name={profileQuery.data?.name ?? 'You'} size={36} />
          </Pressable>
        </View>
      }>
      {groupsQuery.isPending ? (
        <LoadingState label="Loading your groups…" />
      ) : groupsQuery.error ? (
        <ErrorState error={groupsQuery.error} onRetry={() => groupsQuery.refetch()} />
      ) : (
        <>
          <StatGrid>
            <StatCard
              label="Total budget"
              value={formatCurrency(totals.budget)}
              icon="wallet"
              caption="Across all groups"
            />
            <StatCard
              label="Collected"
              value={formatCurrency(totals.collected)}
              icon="money"
              tone="success"
              caption={totals.budget > 0 ? `${Math.round((totals.collected / totals.budget) * 100)}% of budget` : undefined}
            />
            <StatCard
              label="Active festivals"
              value={String(totals.active)}
              icon="calendar"
              tone="warning"
              caption="Upcoming or ongoing"
            />
            <StatCard label="People" value={String(totals.people)} icon="groups" caption="In your groups" />
          </StatGrid>

          <View style={styles.actions}>
            <Button label="Create group" icon="plus" onPress={() => router.push('/group/create')} style={styles.flex} />
            <Button
              label="Join group"
              icon="personAdd"
              variant="secondary"
              onPress={() => router.push('/group/join')}
              style={styles.flex}
            />
          </View>

          <Section title={`Your groups (${groups.length})`}>
            {groups.length > 2 && (
              <TextField label="Search groups" value={query} onChangeText={setQuery} placeholder="Name, festival or place" />
            )}
            {filteredGroups.length === 0 ? (
              <EmptyState
                icon={groups.length === 0 ? 'celebration' : 'search'}
                title={groups.length === 0 ? 'No groups yet' : 'No matching groups'}
                message={
                  groups.length === 0
                    ? 'Create a group for your next festival or join one with an invite code.'
                    : `Nothing matches "${query}".`
                }
              />
            ) : (
              filteredGroups.map((group) => <GroupCard key={group.id} group={group} onPress={() => openGroup(group)} />)
            )}
          </Section>

          <Section title="Recent activity">
            {activityQuery.isPending ? (
              <LoadingState />
            ) : activityQuery.error ? (
              <ErrorState error={activityQuery.error} onRetry={() => activityQuery.refetch()} />
            ) : (activityQuery.data ?? []).length === 0 ? (
              <AppText color="textMuted">Activity from your groups will show up here.</AppText>
            ) : (
              <Card style={styles.activityCard}>
                {(activityQuery.data ?? []).slice(0, 6).map((entry, index) => (
                  <View
                    key={entry.id}
                    style={[
                      styles.activityRow,
                      index > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
                    ]}>
                    <View style={[styles.activityIcon, { backgroundColor: colors.primarySoft }]}>
                      <Icon name={activityIcons[entry.type]} color={colors.primary} size={18} />
                    </View>
                    <View style={styles.flex}>
                      <AppText>
                        {entry.actorId === userId ? 'You' : entry.actorName} {entry.message}
                      </AppText>
                      <AppText variant="caption" color="textMuted">
                        {entry.groupName} · {formatRelativeTime(entry.timestamp)}
                      </AppText>
                    </View>
                    {entry.amount !== null && <AppText variant="label">{formatCurrency(entry.amount)}</AppText>}
                  </View>
                ))}
              </Card>
            )}
          </Section>
        </>
      )}
    </Screen>
  );
}

function GroupCard({ group, onPress }: { group: GroupSummary; onPress: () => void }) {
  const colors = useTheme();
  const days = daysUntil(group.startDate);
  const ended = daysUntil(group.endDate) < 0;
  const when = ended ? 'Finished' : days > 0 ? `In ${days} days` : 'Happening now';
  const percent = group.totalBudget ? ((group.collected ?? 0) / group.totalBudget) * 100 : 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${group.name}, ${when}, ${group.memberCount} members${
        group.canViewBudget ? `, ${Math.round(percent)}% funded` : ''
      }`}
      android_ripple={{ color: colors.overlay, foreground: true }}
      style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Banner icon="celebration" color={festivalColors[group.festivalType]} height={88} />
      <View style={styles.groupBody}>
        <View style={styles.groupTitleRow}>
          <AppText variant="heading" style={styles.flex} numberOfLines={2}>
            {group.name}
          </AppText>
          <Badge label={roleLabels[group.myRole]} tone="primary" />
        </View>
        <AppText variant="caption" color="textMuted">
          {formatDateRange(group.startDate, group.endDate)} · {group.location}
        </AppText>
        <View style={styles.groupMeta}>
          <Badge label={when} tone={ended ? 'neutral' : days <= 0 ? 'success' : 'warning'} icon="calendar" />
          <Badge label={`${group.memberCount} members`} icon="groups" />
        </View>
        {group.canViewBudget && (
          <>
            <View style={styles.fundingRow}>
              <AppText variant="caption" color="textMuted" style={styles.flex}>
                {formatCurrency(group.collected ?? 0)} of {formatCurrency(group.totalBudget ?? 0)} collected
              </AppText>
              <AppText variant="caption" style={styles.bold}>
                {Math.round(percent)}%
              </AppText>
            </View>
            <ProgressBar percent={percent} color={colors.success} label="Funding progress" />
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bold: {
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  groupCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  groupBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  groupMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  fundingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  activityCard: {
    paddingVertical: 0,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
