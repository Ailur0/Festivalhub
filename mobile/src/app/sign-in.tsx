import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { SegmentedControl } from '@/components/segmented-control';
import { SwitchRow } from '@/components/switch-row';
import { TextField } from '@/components/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured } from '@/lib/supabase';
import { MIN_PASSWORD_LENGTH, isValidEmail } from '@/lib/validation';
import { useSession } from '@/state/session';

// Off until the hosted project sends email through custom SMTP: on the free plan with Supabase's
// built-in sender the sign-in email template can't be changed, so it sends a link instead of the code.
const EMAIL_CODE_SIGN_IN = false;

type Mode = 'sign-in' | 'register';
type Errors = Partial<Record<'email' | 'password' | 'code' | 'name' | 'confirm' | 'terms' | 'general', string>>;

export default function SignInScreen() {
  const colors = useTheme();
  const { signInWithPassword, signUp, sendEmailCode, verifyEmailCode } = useSession();

  const [mode, setMode] = useState<Mode>('sign-in');
  const [useCode, setUseCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setErrors({});
    setNotice(undefined);
    try {
      await action();
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Something went wrong.' });
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = () => {
    const next: Errors = {
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password ? undefined : 'Enter your password',
    };
    setErrors(next);
    if (next.email || next.password) return;
    run(() => signInWithPassword(email, password));
  };

  const handleSendCode = () => {
    if (!isValidEmail(email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }
    run(async () => {
      await sendEmailCode(email);
      setCodeSent(true);
      setNotice(`We sent a 6-digit code to ${email.trim()}.`);
    });
  };

  const handleVerifyCode = () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setErrors({ code: 'Enter the 6-digit code' });
      return;
    }
    run(() => verifyEmailCode(email, code));
  };

  const handleRegister = () => {
    const next: Errors = {
      name: name.trim().length >= 2 ? undefined : 'Enter your name',
      email: isValidEmail(email) ? undefined : 'Enter a valid email address',
      password: password.length >= MIN_PASSWORD_LENGTH ? undefined : `Use at least ${MIN_PASSWORD_LENGTH} characters`,
      confirm: confirm === password ? undefined : 'Passwords do not match',
      terms: acceptedTerms ? undefined : 'Accept the terms to continue',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    run(async () => {
      const { needsEmailConfirmation } = await signUp({ name, email, phone, password });
      if (needsEmailConfirmation) {
        setMode('sign-in');
        setNotice('Check your email to confirm your account, then sign in.');
      }
    });
  };

  return (
    <Screen>
      <View style={styles.brand}>
        <View style={[styles.logo, { backgroundColor: colors.primaryStrong }]}>
          <Icon name="celebration" color={colors.onPrimary} size={32} />
        </View>
        <AppText variant="title" accessibilityRole="header">
          FestivalHub
        </AppText>
        <AppText color="textMuted" style={styles.center}>
          Plan festivals, collect contributions and track spending together.
        </AppText>
      </View>

      {!isSupabaseConfigured && (
        <View style={[styles.alert, { backgroundColor: colors.warningSoft }]}>
          <Icon name="info" color={colors.warning} size={20} />
          <AppText color="warning" style={styles.alertText}>
            No backend is connected yet. Add your Supabase URL and key to mobile/.env.local.
          </AppText>
        </View>
      )}

      <Card style={styles.form}>
        <SegmentedControl
          segments={[
            { value: 'sign-in', label: 'Sign in' },
            { value: 'register', label: 'Create account' },
          ]}
          value={mode}
          onChange={(next) => {
            setMode(next);
            setErrors({});
            setNotice(undefined);
          }}
        />

        {!!errors.general && (
          <View style={[styles.alert, { backgroundColor: colors.dangerSoft }]} accessibilityLiveRegion="assertive">
            <Icon name="alert" color={colors.danger} size={20} />
            <AppText color="danger" style={styles.alertText}>
              {errors.general}
            </AppText>
          </View>
        )}

        {!!notice && (
          <View style={[styles.alert, { backgroundColor: colors.successSoft }]} accessibilityLiveRegion="polite">
            <Icon name="checkCircle" color={colors.success} size={20} />
            <AppText color="success" style={styles.alertText}>
              {notice}
            </AppText>
          </View>
        )}

        <TextField
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setCodeSent(false);
          }}
          error={errors.email}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          required
        />

        {mode === 'sign-in' ? (
          <>
            {useCode ? (
              <>
                {codeSent && (
                  <TextField
                    label="Verification code"
                    value={code}
                    onChangeText={setCode}
                    error={errors.code}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    textContentType="oneTimeCode"
                    maxLength={6}
                    required
                  />
                )}
                <Button
                  label={codeSent ? 'Verify and sign in' : 'Email me a code'}
                  icon="mail"
                  onPress={codeSent ? handleVerifyCode : handleSendCode}
                  loading={busy}
                />
              </>
            ) : (
              <>
                <TextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  secure
                  autoCapitalize="none"
                  autoComplete="current-password"
                  textContentType="password"
                  onSubmitEditing={handleSignIn}
                  required
                />
                <Button label="Sign in" icon="key" onPress={handleSignIn} loading={busy} />
              </>
            )}

            {EMAIL_CODE_SIGN_IN && (
              <Button
                variant="ghost"
                label={useCode ? 'Use password instead' : 'Sign in with an emailed code'}
                onPress={() => {
                  setUseCode((value) => !value);
                  setCodeSent(false);
                  setCode('');
                  setErrors({});
                  setNotice(undefined);
                }}
              />
            )}
          </>
        ) : (
          <>
            <TextField label="Name" value={name} onChangeText={setName} error={errors.name} autoComplete="name" required />
            <TextField
              label="Phone (optional)"
              value={phone}
              onChangeText={setPhone}
              autoComplete="tel"
              keyboardType="phone-pad"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
              secure
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              required
            />
            <TextField
              label="Confirm password"
              value={confirm}
              onChangeText={setConfirm}
              error={errors.confirm}
              secure
              autoCapitalize="none"
              autoComplete="new-password"
              required
            />
            <View>
              <SwitchRow
                label="I agree to the Terms of Service and Privacy Policy"
                value={acceptedTerms}
                onValueChange={setAcceptedTerms}
              />
              {!!errors.terms && (
                <AppText variant="caption" color="danger">
                  {errors.terms}
                </AppText>
              )}
            </View>
            <Button label="Create account" icon="personAdd" onPress={handleRegister} loading={busy} />
          </>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.lg,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  alertText: {
    flex: 1,
  },
});
