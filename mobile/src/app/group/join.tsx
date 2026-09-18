import { router } from 'expo-router';
import { useState } from 'react';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useActiveGroup } from '@/state/active-group';
import { useJoinGroup } from '@/state/queries';

export default function JoinGroupScreen() {
  const joinGroup = useJoinGroup();
  const { setActiveGroupId } = useActiveGroup();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();

  const join = () => {
    if (!code.trim()) {
      setError('Enter the invite code you received');
      return;
    }
    setError(undefined);
    joinGroup.mutate(code, {
      onSuccess: (groupId) => {
        setActiveGroupId(groupId);
        router.dismissTo('/groups');
      },
      onError: (joinError) => setError(joinError instanceof Error ? joinError.message : 'Something went wrong.'),
    });
  };

  return (
    <Screen topInset={false}>
      <AppText color="textMuted">Ask a group admin for an invite code, then enter it below.</AppText>
      <TextField
        label="Invite code"
        value={code}
        onChangeText={(value) => {
          setCode(value.toUpperCase());
          setError(undefined);
        }}
        placeholder="e.g. K7MQ2XRP"
        autoCapitalize="characters"
        autoCorrect={false}
        error={error}
        onSubmitEditing={join}
        required
      />
      <Button label="Join group" icon="personAdd" onPress={join} loading={joinGroup.isPending} />
    </Screen>
  );
}
