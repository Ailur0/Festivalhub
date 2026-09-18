/**
 * FestivalHub palette, carried over from the web app's saffron theme.
 * `primaryStrong` is used behind white text so buttons meet WCAG AA contrast.
 */

import type { TextStyle } from 'react-native';

export const Colors = {
  light: {
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceMuted: '#F5F5F5',
    border: '#E0E0E0',
    text: '#212121',
    textMuted: '#6B6B6B',
    primary: '#E65100',
    primaryStrong: '#BF360C',
    primarySoft: '#FFF3E0',
    onPrimary: '#FFFFFF',
    accent: '#FFB300',
    success: '#2E7D32',
    successSoft: '#E8F5E9',
    warning: '#E65100',
    warningSoft: '#FFF3E0',
    danger: '#C62828',
    dangerSoft: '#FFEBEE',
    overlay: 'rgba(0, 0, 0, 0.45)',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceMuted: '#2A2A2A',
    border: '#383838',
    text: '#F2F2F2',
    textMuted: '#ABABAB',
    primary: '#FF8A50',
    primaryStrong: '#BF360C',
    primarySoft: '#3B2418',
    onPrimary: '#FFFFFF',
    accent: '#FFCA28',
    success: '#66BB6A',
    successSoft: '#1E3322',
    warning: '#FFA726',
    warningSoft: '#3A2A14',
    danger: '#EF5350',
    dangerSoft: '#3A1C1C',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
} as const;

export type TypeVariant = 'title' | 'heading' | 'body' | 'label' | 'caption' | 'amount';

export const Type: Record<TypeVariant, TextStyle> = {
  title: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  amount: { fontSize: 22, lineHeight: 28, fontWeight: '700', fontVariant: ['tabular-nums'] },
};

export const MaxContentWidth = 720;
