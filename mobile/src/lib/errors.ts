import { isSupabaseConfigured } from '@/lib/supabase';

type SupabaseError = { message?: string; code?: string; status?: number } | null;

const NOT_CONFIGURED = 'No backend is connected yet. Add your Supabase details to mobile/.env.local.';

/** Turns a Supabase/Postgres error into something worth showing a person. */
export function friendlyMessage(error: SupabaseError, fallback = 'Something went wrong. Please try again.'): string {
  if (!error) return fallback;
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const message = error.message ?? '';

  // Network failures surface as a generic fetch error
  if (/fetch|network|timeout/i.test(message)) {
    return "Can't reach the server. Check your connection and try again.";
  }

  switch (error.code) {
    // Raised by our database functions with a message meant for people
    case 'P0002':
    case '23505':
    case '23514':
    case '22023':
      return message;
    case '42501':
      return "You don't have permission to do that.";
    case '23503':
      return 'That item no longer exists.';
    default:
      break;
  }

  if (/row-level security/i.test(message)) return "You don't have permission to do that.";
  return message || fallback;
}

/** Sign-in and sign-up errors, which come from Supabase Auth rather than Postgres. */
export function friendlyAuthMessage(error: SupabaseError): string {
  if (!error) return 'Something went wrong. Please try again.';
  if (!isSupabaseConfigured) return NOT_CONFIGURED;

  const message = error.message ?? '';
  if (/fetch|network|timeout/i.test(message)) {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (/invalid login credentials/i.test(message)) return 'Incorrect email or password.';
  if (/email not confirmed/i.test(message)) return 'Confirm your email address first, then sign in.';
  if (/already registered/i.test(message)) return 'An account with that email already exists.';
  if (/token has expired|invalid token|otp/i.test(message)) return 'That code is not valid or has expired.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Wait a minute and try again.';
  if (/password/i.test(message) && /short|least/i.test(message)) return 'Use a password of at least 8 characters.';
  return message || 'Something went wrong. Please try again.';
}

export function asError(error: SupabaseError, fallback?: string): Error {
  return new Error(friendlyMessage(error, fallback));
}
