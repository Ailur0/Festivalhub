import { Stack, useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Banner } from '@/components/banner';
import { Button, IconButton } from '@/components/button';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen, Section } from '@/components/screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency, formatDate } from '@/lib/format';
import { vendorCategoryColors, vendorCategoryIcons } from '@/lib/labels';
import { useFavoriteVendors, useToggleFavoriteVendor, useVendorReviews, useVendors } from '@/state/queries';

export default function VendorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useTheme();
  const vendorsQuery = useVendors();
  const favoritesQuery = useFavoriteVendors();
  const reviewsQuery = useVendorReviews(id);
  const toggleFavorite = useToggleFavoriteVendor();

  if (vendorsQuery.isPending) {
    return (
      <Screen topInset={false}>
        <LoadingState />
      </Screen>
    );
  }

  if (vendorsQuery.error) {
    return (
      <Screen topInset={false}>
        <ErrorState error={vendorsQuery.error} onRetry={() => vendorsQuery.refetch()} />
      </Screen>
    );
  }

  const vendor = (vendorsQuery.data ?? []).find((item) => item.id === id);
  if (!vendor) {
    return (
      <Screen topInset={false}>
        <EmptyState icon="storefront" title="Vendor not found" message="This vendor may no longer be listed." />
      </Screen>
    );
  }

  const favorite = (favoritesQuery.data ?? []).includes(vendor.id);

  return (
    <>
      <Stack.Screen
        options={{
          title: vendor.name,
          headerRight: () => (
            <IconButton
              icon="heart"
              color={favorite ? colors.danger : colors.textMuted}
              accessibilityLabel={favorite ? 'Remove from saved vendors' : 'Save vendor'}
              onPress={() => toggleFavorite.mutate({ vendorId: vendor.id, favorite: !favorite })}
            />
          ),
        }}
      />
      <Screen topInset={false}>
        <Banner icon={vendorCategoryIcons[vendor.category]} color={vendorCategoryColors[vendor.category]} height={160} rounded />

        <View style={styles.header}>
          <View style={styles.badges}>
            <Badge label={vendor.category} tone="primary" />
            {vendor.verified && <Badge label="Verified" tone="success" icon="verified" />}
          </View>
          <AppText variant="title">{vendor.name}</AppText>
          <View style={styles.meta}>
            <Icon name="star" color={colors.accent} size={18} />
            <AppText variant="label">{vendor.rating.toFixed(1)}</AppText>
            <AppText color="textMuted">({vendor.reviewCount} reviews)</AppText>
          </View>
          <View style={styles.meta}>
            <Icon name="location" color={colors.textMuted} size={18} />
            <AppText color="textMuted">{vendor.location}</AppText>
          </View>
          <View style={styles.meta}>
            <Icon name="money" color={colors.textMuted} size={18} />
            <AppText color="textMuted">
              {formatCurrency(vendor.priceMin)} – {formatCurrency(vendor.priceMax)} per event
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Call" icon="phone" onPress={() => Linking.openURL(`tel:${vendor.phone}`)} style={styles.flex} />
          <Button
            label="Email"
            icon="mail"
            variant="secondary"
            onPress={() => Linking.openURL(`mailto:${vendor.email}`)}
            style={styles.flex}
          />
          <Button
            label="Text"
            icon="message"
            variant="secondary"
            onPress={() => Linking.openURL(`sms:${vendor.phone}`)}
            style={styles.flex}
          />
        </View>

        <Section title="About">
          <AppText>{vendor.description}</AppText>
          {vendor.recommendedBy && (
            <Card style={styles.recommended}>
              <Icon name="groups" color={colors.primary} />
              <AppText style={styles.flex}>
                Recommended by {vendor.recommendedBy.adminName} of {vendor.recommendedBy.groupName}
                {vendor.recommendedBy.date ? ` on ${formatDate(vendor.recommendedBy.date)}` : ''}
              </AppText>
            </Card>
          )}
        </Section>

        <Section title="Reviews">
          {reviewsQuery.isPending ? (
            <LoadingState />
          ) : (reviewsQuery.data ?? []).length === 0 ? (
            <AppText color="textMuted">No written reviews yet.</AppText>
          ) : (
            (reviewsQuery.data ?? []).map((review) => (
              <Card key={review.id} style={styles.review}>
                <View style={styles.meta}>
                  <Avatar name={review.authorName} size={32} />
                  <View style={styles.flex}>
                    <AppText variant="label">{review.authorName}</AppText>
                    <AppText variant="caption" color="textMuted">
                      {formatDate(review.date)}
                    </AppText>
                  </View>
                  <View style={styles.meta} accessible accessibilityLabel={`${review.rating} out of 5 stars`}>
                    <Icon name="star" color={colors.accent} size={16} />
                    <AppText variant="label">{review.rating}</AppText>
                  </View>
                </View>
                <AppText>{review.comment}</AppText>
              </Card>
            ))
          )}
        </Section>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    gap: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  recommended: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  review: {
    gap: Spacing.sm,
  },
});
