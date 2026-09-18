import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** 0–100; values outside the range are clamped */
  percent: number;
  color?: string;
  label: string;
  height?: number;
};

export function ProgressBar({ percent, color, label, height = 8 }: ProgressBarProps) {
  const colors = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}
      style={[styles.track, { height, borderRadius: height / 2, backgroundColor: colors.surfaceMuted }]}>
      <View
        style={{
          width: `${clamped}%`,
          height,
          borderRadius: height / 2,
          backgroundColor: color ?? colors.primary,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
});
