import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Badge } from '@/components/badge';
import { Banner } from '@/components/banner';
import { IconButton } from '@/components/button';
import { EmptyState } from '@/components/empty-state';
import { Icon, type IconName } from '@/components/icon';
import { ErrorState, LoadingState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { SelectField } from '@/components/select-field';
import { TextField } from '@/components/text-field';
import { Radius, Spacing } from '@/constants/theme';
import type { Vendor, VendorCategory } from '@/data/types';
import { useTheme } from '@/hooks/use-theme';
import { formatCurrency } from '@/lib/format';
import { vendorCategories, vendorCategoryColors, vendorCategoryIcons } from '@/lib/labels';
import { useFavoriteVendors, useToggleFavoriteVendor, useVendors } from '@/state/queries';

type SortOption = 'recommended' | 'rating' | 'price-low' | 'price-high';
type Filter = 'verified' | 'community' | 'favorites';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

export default function MarketplaceScreen() {
  const colors = useTheme();
  const vendorsQuery = useVendors();
  const favoritesQuery = useFavoriteVendors();
  const toggleFavorite = useToggleFavoriteVendor();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<VendorCategory | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<Set<Filter>>(new Set());

  const favorites = favoritesQuery.data ?? [];

  const toggleFilter = (filter: Filter) =>
    setFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filtered = (vendorsQuery.data ?? []).filter((vendor) => {
      if (category !== 'all' && vendor.category !== category) return false;
      if (filters.has('verified') && !vendor.verified) return false;
      if (filters.has('community') && !vendor.recommendedBy) return false;
      if (filters.has('favorites') && !favorites.includes(vendor.id)) return false;
      if (!text) return true;
      return `${vendor.name} ${vendor.category} ${vendor.location} ${vendor.description}`.toLowerCase().includes(text);
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.priceMin - b.priceMin;
        case 'price-high':
          return b.priceMin - a.priceMin;
        default:
          // Community-recommended vendors first, then by rating
          return Number(!!b.recommendedBy) - Number(!!a.recommendedBy) || b.rating - a.rating;
      }
    });
  }, [vendorsQuery.data, query, category, sort, filters, favorites]);

  const hasFilters = category !== 'all' || filters.size > 0 || query.trim().length > 0;

  return (
    <Screen
      title="Vendors"
      subtitle="Trusted service providers for your celebrations"
      refreshControl={
        <RefreshControl
          refreshing={vendorsQuery.isFetching && !vendorsQuery.isPending}
          onRefresh={() => {
            vendorsQuery.refetch();
            favoritesQuery.refetch();
          }}
          tintColor={colors.primary}
        />
      }>
      {vendorsQuery.isPending ? (
        <LoadingState label="Loading vendors…" />
      ) : vendorsQuery.error ? (
        <ErrorState error={vendorsQuery.error} onRetry={() => vendorsQuery.refetch()} />
      ) : (
        <>
          <TextField
            label="Search vendors"
            value={query}
            onChangeText={setQuery}
            placeholder="Name, service or city"
            returnKeyType="search"
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label="All" selected={category === 'all'} onPress={() => setCategory('all')} />
            {vendorCategories.map((item) => (
              <Chip
                key={item}
                label={item}
                icon={vendorCategoryIcons[item]}
                selected={category === item}
                onPress={() => setCategory(category === item ? 'all' : item)}
              />
            ))}
          </ScrollView>

          <View style={styles.filterRow}>
            <Chip label="Verified" icon="verified" selected={filters.has('verified')} onPress={() => toggleFilter('verified')} />
            <Chip
              label="Community picks"
              icon="groups"
              selected={filters.has('community')}
              onPress={() => toggleFilter('community')}
            />
            <Chip label="Saved" icon="heart" selected={filters.has('favorites')} onPress={() => toggleFilter('favorites')} />
          </View>

          <SelectField<SortOption> label="Sort by" value={sort} options={sortOptions} onChange={setSort} />

          <AppText variant="label" color="textMuted" accessibilityLiveRegion="polite">
            {results.length === 1 ? '1 vendor' : `${results.length} vendors`}
          </AppText>

          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="No vendors found"
              message={hasFilters ? 'Try another search or clear some filters.' : undefined}
            />
          ) : (
            results.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                favorite={favorites.includes(vendor.id)}
                onToggleFavorite={() =>
                  toggleFavorite.mutate({ vendorId: vendor.id, favorite: !favorites.includes(vendor.id) })
                }
              />
            ))
          )}
        </>
      )}
    </Screen>
  );
}

function Chip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
}) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primarySoft : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}>
      {icon && <Icon name={icon} color={selected ? colors.primary : colors.textMuted} size={16} />}
      <AppText variant="label" style={{ color: selected ? colors.primary : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

function VendorCard({
  vendor,
  favorite,
  onToggleFavorite,
}: {
  vendor: Vendor;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  const colors = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        onPress={() => router.push({ pathname: '/vendor/[id]', params: { id: vendor.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${vendor.name}, ${vendor.category}, rated ${vendor.rating} from ${vendor.reviewCount} reviews, ${vendor.location}`}
        android_ripple={{ color: colors.overlay, foreground: true }}>
        <Banner icon={vendorCategoryIcons[vendor.category]} color={vendorCategoryColors[vendor.category]} height={96} />
        <View style={styles.cardBody}>
          <View style={styles.badges}>
            {vendor.verified && <Badge label="Verified" tone="success" icon="verified" />}
            {vendor.recommendedBy && <Badge label="Community pick" tone="primary" icon="groups" />}
          </View>
          <AppText variant="heading" numberOfLines={1} style={styles.titleWithAction}>
            {vendor.name}
          </AppText>
          <View style={styles.meta}>
            <Icon name="star" color={colors.accent} size={16} />
            <AppText variant="label">{vendor.rating.toFixed(1)}</AppText>
            <AppText variant="caption" color="textMuted">
              ({vendor.reviewCount}) · {vendor.category}
            </AppText>
          </View>
          <View style={styles.meta}>
            <Icon name="location" color={colors.textMuted} size={16} />
            <AppText variant="caption" color="textMuted" style={styles.flex} numberOfLines={1}>
              {vendor.location}
            </AppText>
            <AppText variant="label">
              {formatCurrency(vendor.priceMin)}–{formatCurrency(vendor.priceMax)}
            </AppText>
          </View>
        </View>
      </Pressable>
      <View style={[styles.favorite, { backgroundColor: colors.surface }]}>
        <IconButton
          icon="heart"
          color={favorite ? colors.danger : colors.textMuted}
          accessibilityLabel={favorite ? `Remove ${vendor.name} from saved` : `Save ${vendor.name}`}
          onPress={onToggleFavorite}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  chips: {
    gap: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: -Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  cardBody: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  titleWithAction: {
    paddingRight: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  favorite: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: 22,
  },
});
