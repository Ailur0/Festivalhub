import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { initials } from '@/lib/format';

// Initials are generated on-device; no member names are sent to an avatar service.
const palette = ['#BF360C', '#2E7D32', '#1565C0', '#6A1B9A', '#AD1457', '#00695C', '#4E342E'];

function colorFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <View
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: colorFor(name) }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      <AppText variant="label" style={[styles.text, { fontSize: size * 0.38 }]}>
        {initials(name)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    lineHeight: undefined,
  },
});
