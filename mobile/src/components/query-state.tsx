import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const colors = useTheme();
  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <ActivityIndicator color={colors.primary} />
      <AppText color="textMuted">{label}</AppText>
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const colors = useTheme();
  const message = error instanceof Error ? error.message : 'Something went wrong.';

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Icon name="alert" color={colors.danger} size={32} />
      <AppText style={styles.center}>{message}</AppText>
      {onRetry && <Button label="Try again" icon="refresh" variant="secondary" onPress={onRetry} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xxl,
  },
  center: {
    textAlign: 'center',
  },
});
