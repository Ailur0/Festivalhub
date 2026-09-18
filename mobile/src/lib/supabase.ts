import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

/**
 * The Android emulator can't reach the host's 127.0.0.1, so a local Supabase URL
 * is rewritten to the emulator's alias for the host machine.
 */
function resolveUrl(url: string) {
  if (Platform.OS !== 'android') return url;
  return url.replace('127.0.0.1', '10.0.2.2').replace('//localhost', '//10.0.2.2');
}

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until the app is pointed at a Supabase project (see mobile/.env.example). */
export const isSupabaseConfigured = Boolean(url && publishableKey);

export const supabase = createClient(resolveUrl(url ?? 'http://127.0.0.1:54321'), publishableKey ?? 'missing-key', {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    // No URL-based sessions: the app uses password and emailed code sign-in
    detectSessionInUrl: false,
  },
});

// Refresh the session while the app is in the foreground only
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
