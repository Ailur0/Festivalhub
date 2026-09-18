import type { Session } from '@supabase/supabase-js';
import { createContext, use, useEffect, useMemo, useState, type ReactNode } from 'react';

import { friendlyAuthMessage } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

type SignUpResult = { needsEmailConfirmation: boolean };

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (input: { name: string; email: string; phone?: string; password: string }) => Promise<SignUpResult>;
  sendEmailCode: (email: string) => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    // Fires on sign-in, sign-out and token refresh
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isLoading,

      async signInWithPassword(email, password) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw new Error(friendlyAuthMessage(error));
      },

      async signUp({ name, email, phone, password }) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { name: name.trim(), phone: phone?.trim() || null } },
        });
        if (error) throw new Error(friendlyAuthMessage(error));
        // Projects that require email confirmation return a user but no session
        return { needsEmailConfirmation: !data.session };
      },

      async sendEmailCode(email) {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: { shouldCreateUser: false },
        });
        if (error) throw new Error(friendlyAuthMessage(error));
      },

      async verifyEmailCode(email, code) {
        const { error } = await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: code.trim(),
          type: 'email',
        });
        if (error) throw new Error(friendlyAuthMessage(error));
      },

      async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(friendlyAuthMessage(error));
      },
    }),
    [session, isLoading],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}

/** The signed-in user's id, or null when signed out. */
export function useUserId(): string | null {
  return useSession().session?.user.id ?? null;
}
