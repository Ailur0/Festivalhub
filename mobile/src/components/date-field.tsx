import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate, parseDate, toIsoDate } from '@/lib/format';

type DateFieldProps = {
  label: string;
  /** YYYY-MM-DD, or empty when nothing is picked yet */
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
  required?: boolean;
  minimumDate?: Date;
};

export function DateField({ label, value, onChange, error, required, minimumDate }: DateFieldProps) {
  const colors = useTheme();
  const [showIosPicker, setShowIosPicker] = useState(false);
  const current = value ? parseDate(value) : new Date();

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode: 'date',
        minimumDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(toIsoDate(date));
        },
      });
    } else {
      setShowIosPicker((visible) => !visible);
    }
  };

  return (
    <View style={styles.container}>
      <AppText variant="label">
        {label}
        {required && <AppText variant="label" color="danger"> *</AppText>}
      </AppText>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatDate(value) : 'not set'}`}
        accessibilityHint="Opens a date picker"
        style={[
          styles.field,
          { borderColor: error ? colors.danger : colors.border, backgroundColor: colors.surface },
        ]}>
        <AppText color={value ? 'text' : 'textMuted'} style={styles.fieldText}>
          {value ? formatDate(value) : 'Pick a date'}
        </AppText>
        <Icon name="calendar" color={colors.textMuted} size={20} />
      </Pressable>
      {showIosPicker && (
        <DateTimePicker
          value={current}
          mode="date"
          display="inline"
          minimumDate={minimumDate}
          onChange={(_, date) => date && onChange(toIsoDate(date))}
        />
      )}
      {!!error && (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  fieldText: {
    flex: 1,
  },
});
