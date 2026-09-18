import { TabList, TabSlot, TabTrigger, Tabs, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Icon, type IconName } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Native tabs don't run in the browser, so the web preview uses a JS tab bar with the same tabs.
const tabs: { name: string; href: '/' | '/groups' | '/finances' | '/marketplace'; label: string; icon: IconName }[] = [
  { name: 'index', href: '/', label: 'Home', icon: 'home' },
  { name: 'groups', href: '/groups', label: 'Group', icon: 'groups' },
  { name: 'finances', href: '/finances', label: 'Finances', icon: 'wallet' },
  { name: 'marketplace', href: '/marketplace', label: 'Vendors', icon: 'storefront' },
];

export default function AppTabs() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.root}>
      <TabSlot style={styles.slot} />
      <TabList
        style={[
          styles.tabList,
          { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom },
        ]}>
        {tabs.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <TabButton label={tab.label} icon={tab.icon} />
          </TabTrigger>
        ))}
      </TabList>
    </Tabs>
  );
}

function TabButton({ label, icon, isFocused, ...props }: TabTriggerSlotProps & { label: string; icon: IconName }) {
  const colors = useTheme();
  return (
    <Pressable {...props} accessibilityRole="tab" accessibilityState={{ selected: isFocused }} style={styles.tab}>
      <View style={[styles.indicator, isFocused && { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} color={isFocused ? colors.primary : colors.textMuted} size={24} />
      </View>
      <AppText variant="caption" color={isFocused ? 'text' : 'textMuted'} style={isFocused && styles.focusedLabel}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  tabList: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: 2,
  },
  indicator: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 4,
    borderRadius: 16,
  },
  focusedLabel: {
    fontWeight: '600',
  },
});
