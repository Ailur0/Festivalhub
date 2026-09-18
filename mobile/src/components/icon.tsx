import { SymbolView, type SymbolViewProps } from 'expo-symbols';

// SF Symbols on iOS, Material Symbols on Android and web. The `satisfies` check makes
// TypeScript reject any symbol name that doesn't exist on that platform.
const icons = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  groups: { ios: 'person.3.fill', android: 'groups', web: 'groups' },
  wallet: { ios: 'banknote', android: 'account_balance_wallet', web: 'account_balance_wallet' },
  storefront: { ios: 'storefront', android: 'storefront', web: 'storefront' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  bell: { ios: 'bell', android: 'notifications', web: 'notifications' },
  plus: { ios: 'plus', android: 'add', web: 'add' },
  personAdd: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
  personRemove: { ios: 'person.badge.minus', android: 'person_remove', web: 'person_remove' },
  person: { ios: 'person.crop.circle.fill', android: 'account_circle', web: 'account_circle' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  chevronUp: { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  alert: { ios: 'exclamationmark.circle', android: 'error', web: 'error' },
  warning: { ios: 'exclamationmark.triangle', android: 'warning', web: 'warning' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  phone: { ios: 'phone.fill', android: 'call', web: 'call' },
  mail: { ios: 'envelope.fill', android: 'mail', web: 'mail' },
  message: { ios: 'message.fill', android: 'sms', web: 'sms' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  copy: { ios: 'doc.on.doc', android: 'content_copy', web: 'content_copy' },
  trash: { ios: 'trash', android: 'delete', web: 'delete' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  signOut: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  heart: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  location: { ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' },
  verified: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  filter: { ios: 'line.3.horizontal.decrease', android: 'filter_list', web: 'filter_list' },
  sort: { ios: 'arrow.up.arrow.down', android: 'sort', web: 'sort' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  calendar: { ios: 'calendar', android: 'event', web: 'event' },
  money: { ios: 'dollarsign.circle', android: 'payments', web: 'payments' },
  receipt: { ios: 'doc.text', android: 'receipt_long', web: 'receipt_long' },
  trendingUp: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up', web: 'trending_up' },
  celebration: { ios: 'party.popper', android: 'celebration', web: 'celebration' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
  globe: { ios: 'globe', android: 'public', web: 'public' },
  link: { ios: 'link', android: 'link', web: 'link' },
  key: { ios: 'key.fill', android: 'key', web: 'key' },
  history: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  refresh: { ios: 'arrow.clockwise', android: 'refresh', web: 'refresh' },
  category: { ios: 'square.grid.2x2', android: 'category', web: 'category' },
  catering: { ios: 'fork.knife', android: 'restaurant', web: 'restaurant' },
  decoration: { ios: 'paintpalette', android: 'palette', web: 'palette' },
  sound: { ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' },
  camera: { ios: 'camera.fill', android: 'photo_camera', web: 'photo_camera' },
  truck: { ios: 'box.truck.fill', android: 'local_shipping', web: 'local_shipping' },
  box: { ios: 'shippingbox.fill', android: 'inventory_2', web: 'inventory_2' },
  shield: { ios: 'shield.fill', android: 'shield', web: 'shield' },
  sparkles: { ios: 'sparkles', android: 'cleaning_services', web: 'cleaning_services' },
  flower: { ios: 'leaf.fill', android: 'local_florist', web: 'local_florist' },
  music: { ios: 'music.note', android: 'music_note', web: 'music_note' },
} satisfies Record<string, Exclude<SymbolViewProps['name'], string>>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  color: string;
  size?: number;
};

export function Icon({ name, color, size = 22 }: IconProps) {
  return (
    <SymbolView
      name={icons[name]}
      size={size}
      tintColor={color}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    />
  );
}
