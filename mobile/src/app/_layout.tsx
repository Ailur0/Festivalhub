import { QueryClient, QueryClientProvider, focusManager, useQueryClient } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/hooks/use-theme';
import { ActiveGroupProvider } from '@/state/active-group';
import { SessionProvider, useSession } from '@/state/session';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // One client for the app's lifetime
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: true,
          },
        },
      }),
  );

  // Let React Query refetch when the app comes back to the foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') focusManager.setFocused(state === 'active');
    });
    return () => subscription.remove();
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CachePerAccount>
          <ActiveGroupProvider>
            <RootNavigator />
          </ActiveGroupProvider>
        </CachePerAccount>
      </QueryClientProvider>
    </SessionProvider>
  );
}

/**
 * Throws away cached data whenever the signed-in account changes, so nobody is
 * shown the previous person's groups after a sign-out or account switch.
 */
function CachePerAccount({ children }: { children: ReactNode }) {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const userId = session?.user.id ?? null;
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (lastUserId.current === userId) return;
    lastUserId.current = userId;
    // resetQueries (not clear) so queries already on screen fetch again for the new account;
    // clear() leaves them pending forever with nothing to show.
    queryClient.resetQueries();
  }, [userId, queryClient]);

  return children;
}

function RootNavigator() {
  const { session, isLoading } = useSession();
  const scheme = useColorScheme();
  const colors = useTheme();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  // Keep the splash screen up until we know whether someone is signed in
  if (isLoading) return null;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
          <Stack.Screen name="vendor/[id]" options={{ title: 'Vendor' }} />
          <Stack.Screen name="group/settings" options={{ title: 'Group settings' }} />
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="account" options={{ title: 'Account' }} />
          <Stack.Screen name="expense/new" options={{ title: 'Add expense', presentation: 'modal' }} />
          <Stack.Screen name="payment/[memberId]" options={{ title: 'Record payment', presentation: 'modal' }} />
          <Stack.Screen name="group/create" options={{ title: 'Create group', presentation: 'modal' }} />
          <Stack.Screen name="group/join" options={{ title: 'Join group', presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
