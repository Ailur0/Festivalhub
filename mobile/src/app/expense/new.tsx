import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/button';
import { DateField } from '@/components/date-field';
import { EmptyState } from '@/components/empty-state';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { SelectField } from '@/components/select-field';
import { TextField } from '@/components/text-field';
import type { ExpenseCategory } from '@/data/types';
import { expenseCategories } from '@/lib/finance';
import { isValidIsoDate, toIsoDate } from '@/lib/format';
import { can } from '@/lib/permissions';
import { useActiveGroup } from '@/state/active-group';
import { useAddExpense, useGroupDetail } from '@/state/queries';
import { useUserId } from '@/state/session';

type Errors = Partial<Record<'category' | 'description' | 'amount' | 'paidBy' | 'date', string>>;

export default function NewExpenseScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const userId = useUserId();
  const { activeGroupId } = useActiveGroup();
  const groupQuery = useGroupDetail(activeGroupId);
  const addExpense = useAddExpense(activeGroupId ?? '');

  const initialCategory = expenseCategories.find((item) => item === params.category) ?? null;
  const [category, setCategory] = useState<ExpenseCategory | null>(initialCategory);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string | null>(userId);
  const [date, setDate] = useState(toIsoDate(new Date()));
  const [errors, setErrors] = useState<Errors>({});

  if (groupQuery.isPending) {
    return (
      <Screen topInset={false}>
        <LoadingState />
      </Screen>
    );
  }

  const group = groupQuery.data;
  if (!group || !can(group, 'manageExpenses')) {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="lock"
          title="You can't add expenses"
          message="Your role in this group doesn't allow managing expenses."
        />
      </Screen>
    );
  }

  const save = () => {
    const cleanAmount = amount.replace(/,/g, '');
    const value = Number(cleanAmount);
    const next: Errors = {
      category: category ? undefined : 'Choose a category',
      description: description.trim().length >= 3 ? undefined : 'Describe the expense (at least 3 characters)',
      amount:
        Number.isFinite(value) && value > 0 && /^\d+(\.\d{1,2})?$/.test(cleanAmount)
          ? undefined
          : 'Enter an amount greater than zero, like 120 or 45.50',
      paidBy: paidById ? undefined : 'Choose who paid',
      date: isValidIsoDate(date) ? undefined : 'Enter a valid date',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean) || !category) return;

    addExpense.mutate(
      {
        groupId: group.id,
        category,
        description: description.trim(),
        amount: Math.round(value * 100) / 100,
        paidById,
        date,
      },
      { onSuccess: () => router.back() },
    );
  };

  return (
    <Screen topInset={false}>
      <SelectField<ExpenseCategory>
        label="Category"
        value={category}
        options={expenseCategories.map((item) => ({ value: item, label: item }))}
        onChange={setCategory}
        error={errors.category}
        required
      />
      <TextField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Marigold garlands"
        error={errors.description}
        maxLength={80}
        required
      />
      <TextField
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        error={errors.amount}
        required
      />
      <SelectField
        label="Paid by"
        value={paidById}
        options={group.members.map((member) => ({
          value: member.id,
          label: member.id === userId ? `${member.name} (you)` : member.name,
          description: member.responsibility,
        }))}
        onChange={setPaidById}
        error={errors.paidBy}
        required
      />
      <DateField label="Date" value={date} onChange={setDate} error={errors.date} required />
      <Button label="Save expense" icon="check" onPress={save} loading={addExpense.isPending} />
      {!!addExpense.error && <ErrorState error={addExpense.error} />}
    </Screen>
  );
}
