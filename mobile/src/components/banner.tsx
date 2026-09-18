import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';

type BannerProps = {
  icon: IconName;
  color: string;
  height?: number;
  rounded?: boolean;
};

// Stands in for photos until groups and vendors can upload their own. Decorative only.
export function Banner({ icon, color, height = 120, rounded = false }: BannerProps) {
  return (
    <View
      style={[styles.banner, { height, backgroundColor: color }, rounded && styles.rounded]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      <View style={[styles.ring, styles.ringLarge]} />
      <View style={[styles.ring, styles.ringSmall]} />
      <Icon name={icon} color="#FFFFFF" size={Math.round(height * 0.36)} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 14,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 18,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  ringLarge: {
    width: 260,
    height: 260,
    right: -80,
    top: -120,
  },
  ringSmall: {
    width: 140,
    height: 140,
    left: -50,
    bottom: -70,
  },
});
