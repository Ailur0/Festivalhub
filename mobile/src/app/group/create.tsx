import { router } from 'expo-router';
import { useState } from 'react';

import { Button } from '@/components/button';
import { DateField } from '@/components/date-field';
import { ErrorState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { SelectField } from '@/components/select-field';
import { TextField } from '@/components/text-field';
import type { FestivalType } from '@/data/types';
import { daysUntil, isValidIsoDate, parseDate } from '@/lib/format';
import { festivalLabels } from '@/lib/labels';
import { useActiveGroup } from '@/state/active-group';
import { useCreateGroup } from '@/state/queries';

type Errors = Partial<Record<'name' | 'festivalType' | 'location' | 'startDate' | 'endDate' | 'budget', string>>;

export default function CreateGroupScreen() {
  const createGroup = useCreateGroup();
  const { setActiveGroupId } = useActiveGroup();

  const [name, setName] = useState('');
  const [festivalType, setFestivalType] = useState<FestivalType | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const create = () => {
    const budgetValue = budget.trim() ? Number(budget.replace(/,/g, '')) : 0;
    const next: Errors = {
      name: name.trim().length >= 3 ? undefined : 'Enter a group name (at least 3 characters)',
      festivalType: festivalType ? undefined : 'Choose a festival',
      location: location.trim() ? undefined : 'Enter where it takes place',
      startDate: !isValidIsoDate(startDate)
        ? 'Pick a start date'
        : daysUntil(startDate) < 0
          ? 'The start date has already passed'
          : undefined,
      endDate:
        endDate && (!isValidIsoDate(endDate) || (isValidIsoDate(startDate) && parseDate(endDate) < parseDate(startDate)))
          ? 'The end date must be on or after the start date'
          : undefined,
      budget: Number.isFinite(budgetValue) && budgetValue >= 0 ? undefined : 'Enter a budget of zero or more',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean) || !festivalType) return;

    createGroup.mutate(
      {
        name: name.trim(),
        festivalType,
        description: description.trim(),
        location: location.trim(),
        startDate,
        endDate: endDate || null,
        totalBudget: Math.round(budgetValue),
      },
      {
        onSuccess: (groupId) => {
          setActiveGroupId(groupId);
          router.dismissTo('/groups');
        },
      },
    );
  };

  return (
    <Screen topInset={false}>
      <TextField
        label="Group name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Diwali 2026 Celebration"
        error={errors.name}
        maxLength={60}
        required
      />
      <SelectField<FestivalType>
        label="Festival"
        value={festivalType}
        options={(Object.keys(festivalLabels) as FestivalType[]).map((value) => ({ value, label: festivalLabels[value] }))}
        onChange={setFestivalType}
        error={errors.festivalType}
        required
      />
      <TextField
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="e.g. Community Center"
        error={errors.location}
        required
      />
      <DateField label="Start date" value={startDate} onChange={setStartDate} error={errors.startDate} minimumDate={new Date()} required />
      <DateField
        label="End date (optional)"
        value={endDate}
        onChange={setEndDate}
        error={errors.endDate}
        minimumDate={isValidIsoDate(startDate) ? parseDate(startDate) : new Date()}
      />
      <TextField
        label="Total budget (optional)"
        value={budget}
        onChangeText={setBudget}
        keyboardType="number-pad"
        placeholder="0"
        hint="Split equally between members. You can change it later."
        error={errors.budget}
      />
      <TextField label="Description (optional)" value={description} onChangeText={setDescription} multiline maxLength={300} />
      <Button label="Create group" icon="celebration" onPress={create} loading={createGroup.isPending} />
      {!!createGroup.error && <ErrorState error={createGroup.error} />}
    </Screen>
  );
}
