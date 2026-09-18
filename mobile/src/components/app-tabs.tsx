import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useTheme } from '@/hooks/use-theme';

// Native Material bottom navigation on Android (and the system tab bar on iOS).
export default function AppTabs() {
  const colors = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      indicatorColor={colors.primarySoft}
      iconColor={{ default: colors.textMuted, selected: colors.primary }}
      labelStyle={{ default: { color: colors.textMuted }, selected: { color: colors.text } }}
      labelVisibilityMode="labeled"
      tabBarRespectsIMEInsets>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="groups">
        <NativeTabs.Trigger.Icon sf="person.3.fill" md="groups" />
        <NativeTabs.Trigger.Label>Group</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="finances">
        <NativeTabs.Trigger.Icon sf="banknote" md="account_balance_wallet" />
        <NativeTabs.Trigger.Label>Finances</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="marketplace">
        <NativeTabs.Trigger.Icon sf="storefront" md="storefront" />
        <NativeTabs.Trigger.Label>Vendors</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
