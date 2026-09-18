import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/app-text';
import { Icon, type IconName } from '@/components/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  compact = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const colors = useTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: { background: colors.primaryStrong, border: colors.primaryStrong, text: colors.onPrimary },
    secondary: { background: colors.surface, border: colors.border, text: colors.text },
    ghost: { background: 'transparent', border: 'transparent', text: colors.primary },
    danger: { background: colors.danger, border: colors.danger, text: '#FFFFFF' },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      android_ripple={{ color: colors.overlay, foreground: true }}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.regular,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={palette.text} size="small" />
        ) : (
          icon && <Icon name={icon} color={palette.text} size={compact ? 18 : 20} />
        )}
        <AppText variant="label" style={{ color: palette.text }} numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  color?: string;
  badge?: number;
};

export function IconButton({ icon, accessibilityLabel, onPress, color, badge }: IconButtonProps) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${accessibilityLabel}, ${badge} unread` : accessibilityLabel}
      hitSlop={4}
      android_ripple={{ color: colors.overlay, borderless: true, radius: 24 }}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
      <Icon name={icon} color={color ?? colors.text} size={24} />
      {!!badge && (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <AppText variant="caption" style={styles.badgeText}>
            {badge > 9 ? '9+' : badge}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: Radius.md,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  regular: {
    minHeight: 48,
    paddingHorizontal: Spacing.lg,
  },
  compact: {
    minHeight: 40,
    paddingHorizontal: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
});
