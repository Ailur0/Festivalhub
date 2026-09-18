import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { Radius, Spacing } from '@/constants/theme';
import type { NotificationChannel } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmAction } from '@/lib/confirm';
import { defaultChannels, notificationChannels, notificationTopics } from '@/lib/notification-topics';
import {
  useNotificationPreferences,
  useProfile,
  useSetNotificationPreference,
  useUpdateProfile,
} from '@/state/queries';
import { useSession } from '@/state/session';

export default function AccountScreen() {
  const colors = useTheme();
  const { signOut } = useSession();
  const profileQuery = useProfile();
  const updateProfile = useUpdateProfile();
  const preferencesQuery = useNotificationPreferences();
  const setPreference = useSetNotificationPreference();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();

  const profile = profileQuery.data;

  const startEditing = () => {
    setName(profile?.name ?? '');
    setPhone(profile?.phone ?? '');
    setError(undefined);
    setEditing(true);
  };

  const saveProfile = () => {
    if (name.trim().length < 2) {
      setError('Enter your name');
      return;
    }
    setError(undefined);
    updateProfile.mutate({ name: name.trim(), phone: phone.trim() || null }, { onSuccess: () => setEditing(false) });
  };

  return (
    <Screen topInset={false}>
      {profileQuery.isPending ? (
        <LoadingState />
      ) : profileQuery.error ? (
        <ErrorState error={profileQuery.error} onRetry={() => profileQuery.refetch()} />
      ) : (
        <Card style={styles.profile}>
          <View style={styles.profileTop}>
            <Avatar name={profile?.name ?? 'You'} size={56} />
            <View style={styles.flex}>
              <AppText variant="heading">{profile?.name}</AppText>
              <AppText color="textMuted">{profile?.email}</AppText>
              {!editing && !!profile?.phone && <AppText color="textMuted">{profile.phone}</AppText>}
            </View>
            {!editing && <Button compact variant="secondary" icon="edit" label="Edit" onPress={startEditing} />}
          </View>

          {editing && (
            <>
              <TextField label="Name" value={name} onChangeText={setName} error={error} required />
              <TextField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <View style={styles.row}>
                <Button label="Save" onPress={saveProfile} loading={updateProfile.isPending} style={styles.flex} />
                <Button label="Cancel" variant="secondary" onPress={() => setEditing(false)} style={styles.flex} />
              </View>
              {!!updateProfile.error && <ErrorState error={updateProfile.error} />}
            </>
          )}
        </Card>
      )}

      <Section title="Notifications">
        <AppText color="textMuted">Choose how you hear about each kind of update.</AppText>
        {preferencesQuery.isPending ? (
          <LoadingState />
        ) : preferencesQuery.error ? (
          <ErrorState error={preferencesQuery.error} onRetry={() => preferencesQuery.refetch()} />
        ) : (
          <Card style={styles.list}>
            {notificationTopics.map((topic, index) => {
              const channels = preferencesQuery.data?.[topic.id] ?? defaultChannels;
              return (
                <View
                  key={topic.id}
                  style={[
                    styles.topic,
                    index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
                  ]}>
                  <View>
                    <AppText variant="label">{topic.label}</AppText>
                    <AppText variant="caption" color="textMuted">
                      {topic.section}
                    </AppText>
                  </View>
                  <View style={styles.channelRow}>
                    {notificationChannels.map((channel) => {
                      const enabled = channels[channel.id];
                      return (
                        <Pressable
                          key={channel.id}
                          onPress={() =>
                            setPreference.mutate({
                              topic: topic.id,
                              channels: { ...channels, [channel.id]: !enabled } as Record<NotificationChannel, boolean>,
                            })
                          }
                          accessibilityRole="switch"
                          accessibilityState={{ checked: enabled }}
                          accessibilityLabel={`${topic.label} by ${channel.label}`}
                          style={[
                            styles.channel,
                            {
                              backgroundColor: enabled ? colors.primarySoft : colors.surface,
                              borderColor: enabled ? colors.primary : colors.border,
                            },
                          ]}>
                          <AppText variant="label" style={{ color: enabled ? colors.primary : colors.textMuted }}>
                            {channel.label}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </Card>
        )}
        {!!setPreference.error && <ErrorState error={setPreference.error} />}
      </Section>

      <Button
        variant="danger"
        icon="signOut"
        label="Sign out"
        onPress={() =>
          confirmAction({
            title: 'Sign out?',
            message: 'You can sign back in any time.',
            confirmLabel: 'Sign out',
            onConfirm: () => signOut(),
          })
        }
      />
      <AppText variant="caption" color="textMuted" style={styles.version}>
        FestivalHub {Constants.expoConfig?.version ?? ''}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  profile: {
    gap: Spacing.lg,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  list: {
    paddingVertical: 0,
  },
  topic: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  channelRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  channel: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  version: {
    textAlign: 'center',
  },
});
