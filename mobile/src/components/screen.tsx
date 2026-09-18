import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type RefreshControlProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: ReactNode;
  /** Large title for tab screens, which have no navigation header */
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  /** Adds the status bar inset; turn off for screens under a stack header */
  topInset?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

export function Screen({ children, title, subtitle, headerRight, topInset = true, refreshControl }: ScreenProps) {
  const colors = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: (topInset ? insets.top : 0) + Spacing.lg, paddingBottom: insets.bottom + Spacing.xxl },
      ]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      refreshControl={refreshControl}>
      {(title || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {!!title && (
              <AppText variant="title" accessibilityRole="header">
                {title}
              </AppText>
            )}
            {!!subtitle && <AppText color="textMuted">{subtitle}</AppText>}
          </View>
          {headerRight}
        </View>
      )}
      {children}
    </ScrollView>
  );
}

export function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <AppText variant="heading" accessibilityRole="header" style={styles.headerText}>
          {title}
        </AppText>
        {action}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xl,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  section: {
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
});
