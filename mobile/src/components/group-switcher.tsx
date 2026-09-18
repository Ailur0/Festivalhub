import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Icon } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateRange } from '@/lib/format';
import { useActiveGroup } from '@/state/active-group';

export function GroupSwitcher({ action }: { action?: React.ReactNode }) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { activeGroup, groups, setActiveGroupId } = useActiveGroup();
  const [open, setOpen] = useState(false);

  if (!activeGroup) return null;

  return (
    <>
      <View style={styles.row}>
        <Pressable
          onPress={() => setOpen(true)}
          disabled={groups.length < 2}
          accessibilityRole="button"
          accessibilityLabel={`Current group: ${activeGroup.name}`}
          accessibilityHint={groups.length > 1 ? 'Switch to another group' : undefined}
          style={styles.trigger}>
          <View style={styles.triggerText}>
            <AppText variant="caption" color="textMuted">
              Current group
            </AppText>
            <AppText variant="title" numberOfLines={2}>
              {activeGroup.name}
            </AppText>
          </View>
          {groups.length > 1 && <Icon name="chevronDown" color={colors.textMuted} size={24} />}
        </Pressable>
        {action}
      </View>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => setOpen(false)}
          accessibilityLabel="Close group list"
        />
        <View style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: insets.bottom + Spacing.lg }]}>
          <AppText variant="heading" style={styles.sheetTitle}>
            Switch group
          </AppText>
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const selected = item.id === activeGroup.id;
              return (
                <Pressable
                  onPress={() => {
                    setActiveGroupId(item.id);
                    setOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  android_ripple={{ color: colors.overlay }}
                  style={styles.option}>
                  <View style={styles.optionText}>
                    <AppText variant={selected ? 'label' : 'body'}>{item.name}</AppText>
                    <AppText variant="caption" color="textMuted">
                      {formatDateRange(item.startDate, item.endDate)} · {item.memberCount} members
                    </AppText>
                  </View>
                  {selected && <Icon name="check" color={colors.primary} />}
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  triggerText: {
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
    minHeight: 60,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
});
