import type { IconName } from '@/components/icon';
import type { ExpenseCategory, FestivalType, VendorCategory } from '@/data/types';

export const festivalLabels: Record<FestivalType, string> = {
  diwali: 'Diwali',
  navratri: 'Navratri',
  holi: 'Holi',
  'ganesh-chaturthi': 'Ganesh Chaturthi',
  'durga-puja': 'Durga Puja',
  other: 'Other festival',
};

// Banner colours keep white icons readable in both light and dark mode.
export const festivalColors: Record<FestivalType, string> = {
  diwali: '#E65100',
  navratri: '#AD1457',
  holi: '#6A1B9A',
  'ganesh-chaturthi': '#00695C',
  'durga-puja': '#C62828',
  other: '#455A64',
};

export const vendorCategoryColors: Record<VendorCategory, string> = {
  Catering: '#EF6C00',
  Decoration: '#AD1457',
  'Sound & Lighting': '#283593',
  Photography: '#4527A0',
  Transportation: '#00695C',
  Supplies: '#6D4C41',
  Security: '#37474F',
  Cleaning: '#00838F',
};

export const expenseCategoryIcons: Record<ExpenseCategory, IconName> = {
  Decoration: 'decoration',
  Prasad: 'catering',
  'Pooja Items': 'flower',
  Logistics: 'truck',
  'Cultural Events': 'music',
  Miscellaneous: 'category',
};

export const vendorCategoryIcons: Record<VendorCategory, IconName> = {
  Catering: 'catering',
  Decoration: 'decoration',
  'Sound & Lighting': 'sound',
  Photography: 'camera',
  Transportation: 'truck',
  Supplies: 'box',
  Security: 'shield',
  Cleaning: 'sparkles',
};

export const vendorCategories = Object.keys(vendorCategoryIcons) as VendorCategory[];
