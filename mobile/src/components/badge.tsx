import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon, type IconName } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  icon?: IconName;
};

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const colors = useTheme();
  const palette = {
    neutral: { background: colors.surfaceMuted, text: colors.textMuted },
    primary: { background: colors.primarySoft, text: colors.primary },
    success: { background: colors.successSoft, text: colors.success },
    warning: { background: colors.warningSoft, text: colors.warning },
    danger: { background: colors.dangerSoft, text: colors.danger },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      {icon && <Icon name={icon} color={palette.text} size={14} />}
      <AppText variant="caption" style={[styles.text, { color: palette.text }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  text: {
    fontWeight: '600',
  },
});
