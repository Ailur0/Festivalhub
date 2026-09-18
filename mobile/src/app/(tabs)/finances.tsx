import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, RefreshControl, Share, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button, IconButton } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { GroupSwitcher } from '@/components/group-switcher';
import { Icon } from '@/components/icon';
import { ProgressBar } from '@/components/progress-bar';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { StatCard, StatGrid } from '@/components/stat-card';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';
import type { GroupDetail } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { getGroupFinances, type Contribution, type GroupFinances } from '@/lib/finance';
import { formatCurrency, formatDate } from '@/lib/format';
import { expenseCategoryIcons } from '@/lib/labels';
import { can } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import { useDeleteExpense, useGroupDetail, useSetBudget } from '@/state/queries';
import { useUserId } from '@/state/session';

export default function FinancesScreen() {
  const colors = useTheme();
  const { activeGroupId, isLoading } = useActiveGroup();
  const groupQuery = useGroupDetail(activeGroupId);

  if (isLoading || (activeGroupId && groupQuery.isPending)) {
    return (
      <Screen title="Finances">
        <LoadingState />
      </Screen>
    );
  }

  if (groupQuery.error) {
    return (
      <Screen title="Finances">
        <ErrorState error={groupQuery.error} onRetry={() => groupQuery.refetch()} />
      </Screen>
    );
  }

  const group = groupQuery.data;
  if (!group) {
    return (
      <Screen title="Finances">
        <EmptyState icon="wallet" title="No group selected" message="Create or join a group to track its budget." />
      </Screen>
    );
  }

  if (!can(group, 'viewBudget')) {
    return (
      <Screen>
        <GroupSwitcher />
        <EmptyState
          icon="lock"
          title="Budget is private"
          message="Your role in this group can't view its finances. Ask an admin for access."
        />
      </Screen>
    );
  }

  return (
    <FinancesContent
      group={group}
      refreshing={groupQuery.isFetching && !groupQuery.isPending}
      onRefresh={() => groupQuery.refetch()}
      refreshTint={colors.primary}
    />
  );
}

function FinancesContent({
  group,
  refreshing,
  onRefresh,
  refreshTint,
}: {
  group: GroupDetail;
  refreshing: boolean;
  onRefresh: () => void;
  refreshTint: string;
}) {
  const colors = useTheme();
  const finances = getGroupFinances(group);
  const canManage = can(group, 'manageExpenses');

  const shareSummary = () => {
    const lines = [
      `${group.name} – finance summary`,
      `Budget: ${formatCurrency(finances.totalBudget)} (${formatCurrency(finances.share)} per member)`,
      `Collected: ${formatCurrency(finances.collected)} (${finances.paidCount}/${group.members.length} paid in full)`,
      `Spent: ${formatCurrency(finances.spent)}`,
      `Balance: ${formatCurrency(finances.balance)}`,
      '',
      ...finances.byCategory.filter((item) => item.total > 0).map((item) => `${item.category}: ${formatCurrency(item.total)}`),
    ];
    Share.share({ message: lines.join('\n') });
  };

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={refreshTint} />}>
      <GroupSwitcher
        action={<IconButton icon="share" accessibilityLabel="Share finance summary" onPress={shareSummary} />}
      />

      <StatGrid>
        <StatCard
          label="Budget"
          value={formatCurrency(finances.totalBudget)}
          icon="wallet"
          caption={`${group.members.length} members`}
        />
        <StatCard
          label="Collected"
          value={formatCurrency(finances.collected)}
          icon="money"
          tone="success"
          caption={`${Math.round(finances.collectedPercent)}% of budget`}
        />
        <StatCard
          label="Spent"
          value={formatCurrency(finances.spent)}
          icon="receipt"
          tone="warning"
          caption={`${Math.round(finances.spentPercent)}% of budget`}
        />
        <StatCard
          label="Balance"
          value={formatCurrency(finances.balance)}
          icon="trendingUp"
          tone={finances.balance < 0 ? 'danger' : 'success'}
          caption="Collected minus spent"
        />
      </StatGrid>

      <BudgetCard group={group} finances={finances} />

      <Section
        title="Expenses"
        action={canManage ? <Button compact label="Add" icon="plus" onPress={() => router.push('/expense/new')} /> : undefined}>
        <Card style={styles.list}>
          {finances.byCategory.map((item, index) => (
            <CategoryRow key={item.category} group={group} item={item} first={index === 0} canManage={canManage} />
          ))}
        </Card>
        {finances.balance < 0 && (
          <View style={[styles.warning, { backgroundColor: colors.dangerSoft }]}>
            <Icon name="warning" color={colors.danger} size={20} />
            <AppText color="danger" style={styles.flex}>
              Spending is {formatCurrency(-finances.balance)} more than has been collected.
            </AppText>
          </View>
        )}
      </Section>

      <Section title="Contributions">
        <AppText color="textMuted">
          {finances.paidCount} of {group.members.length} members have paid their {formatCurrency(finances.share)} share.
          {finances.formerMemberPayments > 0
            ? ` Includes ${formatCurrency(finances.formerMemberPayments)} from people who have left.`
            : ''}
        </AppText>
        <Card style={styles.list}>
          {finances.contributions.map((member, index) => (
            <ContributionRow key={member.id} group={group} member={member} first={index === 0} canManage={canManage} />
          ))}
        </Card>
      </Section>
    </Screen>
  );
}

function BudgetCard({ group, finances }: { group: GroupDetail; finances: GroupFinances }) {
  const colors = useTheme();
  const setBudget = useSetBudget(group.id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(finances.totalBudget));
  const [error, setError] = useState<string>();

  const save = () => {
    const value = Number(draft.replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a budget greater than zero');
      return;
    }
    setError(undefined);
    setBudget.mutate(Math.round(value), { onSuccess: () => setEditing(false) });
  };

  return (
    <Card style={styles.budgetCard}>
      <View style={styles.rowCenter}>
        <View style={styles.flex}>
          <AppText variant="heading">Collection progress</AppText>
          <AppText variant="caption" color="textMuted">
            Each member's share is the budget divided by {group.members.length} members
          </AppText>
        </View>
        {can(group, 'editGroupDetails') && !editing && (
          <Button
            compact
            variant="secondary"
            label="Edit budget"
            icon="edit"
            onPress={() => {
              setDraft(String(finances.totalBudget));
              setEditing(true);
            }}
          />
        )}
      </View>

      {editing ? (
        <>
          <TextField
            label="Total budget"
            value={draft}
            onChangeText={setDraft}
            keyboardType="number-pad"
            error={error ?? (setBudget.error instanceof Error ? setBudget.error.message : undefined)}
            required
          />
          <View style={styles.row}>
            <Button label="Save" onPress={save} loading={setBudget.isPending} style={styles.flex} />
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => {
                setEditing(false);
                setError(undefined);
              }}
              style={styles.flex}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.rowCenter}>
            <AppText style={styles.flex}>
              {formatCurrency(finances.collected)} of {formatCurrency(finances.totalBudget)}
            </AppText>
            <AppText variant="label">{Math.round(finances.collectedPercent)}%</AppText>
          </View>
          <ProgressBar
            percent={finances.collectedPercent}
            color={colors.success}
            label="Collected towards budget"
            height={10}
          />
          <AppText variant="caption" color="textMuted">
            Per member: {formatCurrency(finances.share)} · Still to collect:{' '}
            {formatCurrency(Math.max(0, finances.totalBudget - finances.collected))}
          </AppText>
        </>
      )}
    </Card>
  );
}

function CategoryRow({
  group,
  item,
  first,
  canManage,
}: {
  group: GroupDetail;
  item: GroupFinances['byCategory'][number];
  first: boolean;
  canManage: boolean;
}) {
  const colors = useTheme();
  const deleteExpense = useDeleteExpense(group.id);
  const [expanded, setExpanded] = useState(false);

  const removeExpense = (expenseId: string, description: string) => {
    confirmAction({
      title: 'Delete expense?',
      message: `"${description}" will be removed from the budget.`,
      confirmLabel: 'Delete',
      destructive: true,
      onConfirm: () => deleteExpense.mutate(expenseId),
    });
  };

  return (
    <View style={!first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }}>
      <Pressable
        onPress={() => setExpanded((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${item.category}, ${item.expenses.length} expenses, ${formatCurrency(item.total)}`}
        style={styles.categoryRow}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Icon name={expenseCategoryIcons[item.category]} color={colors.primary} size={18} />
        </View>
        <View style={styles.flex}>
          <AppText variant="label">{item.category}</AppText>
          <AppText variant="caption" color="textMuted">
            {item.expenses.length === 1 ? '1 expense' : `${item.expenses.length} expenses`}
          </AppText>
        </View>
        <AppText variant="label">{formatCurrency(item.total)}</AppText>
        <Icon name={expanded ? 'chevronUp' : 'chevronDown'} color={colors.textMuted} size={20} />
      </Pressable>

      {expanded && (
        <View style={styles.expenseList}>
          {item.expenses.map((expense) => (
            <View key={expense.id} style={[styles.expenseRow, { backgroundColor: colors.surfaceMuted }]}>
              <View style={styles.flex}>
                <AppText>{expense.description}</AppText>
                <AppText variant="caption" color="textMuted">
                  {formatDate(expense.date)} · {expense.paidBy}
                </AppText>
              </View>
              <AppText variant="label">{formatCurrency(expense.amount)}</AppText>
              {canManage && (
                <IconButton
                  icon="trash"
                  accessibilityLabel={`Delete ${expense.description}`}
                  color={colors.danger}
                  onPress={() => removeExpense(expense.id, expense.description)}
                />
              )}
            </View>
          ))}
          {canManage && (
            <Button
              compact
              variant="secondary"
              icon="plus"
              label={`Add ${item.category} expense`}
              onPress={() => router.push({ pathname: '/expense/new', params: { category: item.category } })}
            />
          )}
          {!canManage && item.expenses.length === 0 && (
            <AppText variant="caption" color="textMuted">
              No expenses yet.
            </AppText>
          )}
          {!!deleteExpense.error && <ErrorState error={deleteExpense.error} />}
        </View>
      )}
    </View>
  );
}

function ContributionRow({
  group,
  member,
  first,
  canManage,
}: {
  group: GroupDetail;
  member: Contribution;
  first: boolean;
  canManage: boolean;
}) {
  const colors = useTheme();
  const userId = useUserId();
  const isMe = member.id === userId;
  const name = isMe ? 'You' : member.name;
  const remaining = Math.max(0, member.share - member.paid);
  const tone = member.status === 'paid' ? 'success' : member.status === 'partial' ? 'warning' : 'danger';
  const statusLabel = member.status === 'paid' ? 'Paid' : member.status === 'partial' ? 'Partly paid' : 'Not paid';
  const canRemind = !isMe && member.status !== 'paid' && !!member.email;

  const remind = () => {
    const subject = encodeURIComponent(`${group.name} contribution`);
    const body = encodeURIComponent(
      `Hi ${member.name.split(' ')[0]},\n\nA friendly reminder that ${formatCurrency(remaining)} of your ${formatCurrency(
        member.share,
      )} contribution to ${group.name} is still due.\n\nThank you!`,
    );
    Linking.openURL(`mailto:${member.email}?subject=${subject}&body=${body}`);
  };

  return (
    <View
      style={[styles.contribution, !first && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
      <View style={styles.rowCenter}>
        <Avatar name={member.name} size={36} />
        <View style={styles.flex}>
          <AppText variant="label">{name}</AppText>
          <AppText variant="caption" color="textMuted">
            {formatCurrency(member.paid)} of {formatCurrency(member.share)}
          </AppText>
        </View>
        <Badge label={statusLabel} tone={tone} />
      </View>
      <ProgressBar
        percent={member.share > 0 ? (member.paid / member.share) * 100 : 0}
        color={member.status === 'paid' ? colors.success : member.status === 'partial' ? colors.warning : colors.danger}
        label={`${name} contribution progress`}
        height={6}
      />
      {member.status !== 'paid' && (canManage || canRemind) && (
        <View style={styles.row}>
          {canManage && (
            <Button
              compact
              variant="secondary"
              icon="money"
              label="Record payment"
              onPress={() => router.push({ pathname: '/payment/[memberId]', params: { memberId: member.id } })}
              style={styles.flex}
            />
          )}
          {canRemind && <Button compact variant="secondary" icon="mail" label="Remind" onPress={remind} style={styles.flex} />}
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  list: {
    paddingVertical: 0,
  },
  budgetCard: {
    gap: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 64,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseList: {
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingLeft: Spacing.md,
    borderRadius: 8,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 10,
  },
  contribution: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
});
