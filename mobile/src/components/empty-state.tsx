import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon, type IconName } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message?: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const colors = useTheme();
  return (
    <View style={styles.container}>
      <Icon name={icon} color={colors.textMuted} size={40} />
      <AppText variant="heading" style={styles.center}>
        {title}
      </AppText>
      {!!message && (
        <AppText color="textMuted" style={styles.center}>
          {message}
        </AppText>
      )}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  center: {
    textAlign: 'center',
  },
});
