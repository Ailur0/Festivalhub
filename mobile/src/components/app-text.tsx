import { Text, type TextProps } from 'react-native';

import { Type, type ThemeColors, type TypeVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type AppTextProps = TextProps & {
  variant?: TypeVariant;
  color?: keyof ThemeColors;
};

export function AppText({ variant = 'body', color = 'text', style, ...props }: AppTextProps) {
  const colors = useTheme();
  return <Text {...props} style={[Type[variant], { color: colors[color] }, style]} />;
}
