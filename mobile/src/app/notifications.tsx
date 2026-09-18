import { RefreshControl, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, formatRelativeTime } from '@/lib/format';
import { useMarkNotificationsRead, useNotifications } from '@/state/queries';

export default function NotificationsScreen() {
  const colors = useTheme();
  const notificationsQuery = useNotifications();
  const markRead = useMarkNotificationsRead();

  if (notificationsQuery.isPending) {
    return (
      <Screen topInset={false}>
        <LoadingState />
      </Screen>
    );
  }

  if (notificationsQuery.error) {
    return (
      <Screen topInset={false}>
        <ErrorState error={notificationsQuery.error} onRetry={() => notificationsQuery.refetch()} />
      </Screen>
    );
  }

  const notifications = notificationsQuery.data ?? [];
  const unread = notifications.filter((notification) => !notification.read).length;

  if (notifications.length === 0) {
    return (
      <Screen topInset={false}>
        <EmptyState
          icon="bell"
          title="No notifications"
          message="Updates about payments and your groups will appear here."
        />
      </Screen>
    );
  }

  return (
    <Screen
      topInset={false}
      refreshControl={
        <RefreshControl
          refreshing={notificationsQuery.isFetching && !notificationsQuery.isPending}
          onRefresh={() => notificationsQuery.refetch()}
          tintColor={colors.primary}
        />
      }>
      {unread > 0 && (
        <Button
          variant="secondary"
          icon="check"
          label={`Mark ${unread} as read`}
          onPress={() => markRead.mutate()}
          loading={markRead.isPending}
        />
      )}
      <Card style={styles.list}>
        {notifications.map((notification, index) => (
          <View
            key={notification.id}
            accessible
            accessibilityLabel={`${notification.read ? '' : 'Unread. '}${notification.title}. ${notification.message}. ${formatRelativeTime(notification.timestamp)}`}
            style={[
              styles.row,
              index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
            ]}>
            <View style={[styles.dot, { backgroundColor: notification.read ? 'transparent' : colors.primary }]} />
            <View style={styles.flex}>
              <AppText variant={notification.read ? 'body' : 'label'}>{notification.title}</AppText>
              <AppText color="textMuted">{notification.message}</AppText>
              <AppText variant="caption" color="textMuted">
                {formatRelativeTime(notification.timestamp)}
              </AppText>
            </View>
            {notification.amount !== null && <AppText variant="label">{formatCurrency(notification.amount)}</AppText>}
          </View>
        ))}
      </Card>
      {!!markRead.error && <ErrorState error={markRead.error} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    gap: 2,
  },
  list: {
    paddingVertical: 0,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
});
