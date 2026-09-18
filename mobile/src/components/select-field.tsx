import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type SelectOption<T extends string> = { label: string; value: T; description?: string };

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select…',
  error,
  required,
}: SelectFieldProps<T>) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <AppText variant="label">
        {label}
        {required && <AppText variant="label" color="danger"> *</AppText>}
      </AppText>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? 'not selected'}`}
        accessibilityHint="Opens a list of options"
        style={[
          styles.field,
          { borderColor: error ? colors.danger : colors.border, backgroundColor: colors.surface },
        ]}>
        <AppText color={selected ? 'text' : 'textMuted'} style={styles.fieldText} numberOfLines={1}>
          {selected?.label ?? placeholder}
        </AppText>
        <Icon name="chevronDown" color={colors.textMuted} size={20} />
      </Pressable>
      {!!error && (
        <AppText variant="caption" color="danger">
          {error}
        </AppText>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close options"
        />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, paddingBottom: insets.bottom + Spacing.lg },
          ]}>
          <AppText variant="heading" style={styles.sheetTitle}>
            {label}
          </AppText>
          <FlatList
            data={options}
            keyExtractor={(option) => option.value}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  android_ripple={{ color: colors.overlay }}
                  style={styles.option}>
                  <View style={styles.optionText}>
                    <AppText variant={isSelected ? 'label' : 'body'}>{item.label}</AppText>
                    {!!item.description && (
                      <AppText variant="caption" color="textMuted">
                        {item.description}
                      </AppText>
                    )}
                  </View>
                  {isSelected && <Icon name="check" color={colors.primary} />}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
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
  backdrop: {
    flex: 1,
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingTop: Spacing.lg,
  },
  sheetTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
});
