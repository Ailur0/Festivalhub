import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Spacing } from '@/constants/theme';
import { getGroupFinances } from '@/lib/finance';
import { formatCurrency } from '@/lib/format';
import { can } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import { useGroupDetail, useRecordPayment } from '@/state/queries';
import { useUserId } from '@/state/session';

export default function RecordPaymentScreen() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const userId = useUserId();
  const { activeGroupId } = useActiveGroup();
  const groupQuery = useGroupDetail(activeGroupId);
  const recordPayment = useRecordPayment(activeGroupId ?? '');
  const [amount, setAmount] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  if (groupQuery.isPending) {
    return (
      <Screen topInset={false}>
        <LoadingState />
      </Screen>
    );
  }

  const group = groupQuery.data;
  const member =
    group && can(group, 'viewBudget')
      ? getGroupFinances(group).contributions.find((item) => item.id === memberId)
      : undefined;

  if (!group || !member || !can(group, 'manageExpenses')) {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="lock"
          title="Can't record this payment"
          message="The member wasn't found or your role can't manage payments."
        />
      </Screen>
    );
  }

  const remaining = Math.max(0, Math.ceil(member.share - member.paid));
  const name = member.id === userId ? 'You' : member.name;

  const save = () => {
    const value = Number((amount ?? String(remaining)).replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than zero');
      return;
    }
    setError(undefined);
    recordPayment.mutate(
      { memberId: member.id, amount: Math.round(value * 100) / 100 },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <Screen topInset={false}>
      <Card style={styles.summary}>
        <Avatar name={member.name} size={48} />
        <View style={styles.flex}>
          <AppText variant="heading">{name}</AppText>
          <AppText color="textMuted">
            Paid {formatCurrency(member.paid)} of {formatCurrency(member.share)}
          </AppText>
          <AppText variant="label">Still due: {formatCurrency(remaining)}</AppText>
        </View>
      </Card>
      <TextField
        label="Amount received"
        value={amount ?? String(remaining)}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        error={error}
        hint="Record cash, UPI or bank transfers you've received"
        required
      />
      <Button label="Record payment" icon="check" onPress={save} loading={recordPayment.isPending} />
      {!!recordPayment.error && <ErrorState error={recordPayment.error} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
});
