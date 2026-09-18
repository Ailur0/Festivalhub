import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StatCardProps = {
  label: string;
  value: string;
  icon: IconName;
  caption?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
};

export function StatCard({ label, value, icon, caption, tone = 'primary' }: StatCardProps) {
  const colors = useTheme();
  const accent = { primary: colors.primary, success: colors.success, warning: colors.warning, danger: colors.danger }[tone];

  return (
    <Card style={styles.card} accessible accessibilityLabel={`${label}: ${value}${caption ? `, ${caption}` : ''}`}>
      <View style={styles.top}>
        <AppText variant="caption" color="textMuted" style={styles.label}>
          {label}
        </AppText>
        <Icon name={icon} color={accent} size={18} />
      </View>
      <AppText variant="amount" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </AppText>
      {!!caption && (
        <AppText variant="caption" color="textMuted" numberOfLines={1}>
          {caption}
        </AppText>
      )}
    </Card>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: Spacing.xs,
    padding: Spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
});
