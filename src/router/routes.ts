export const pageIds = [
  'home', 'resources', 'rights', 'contact', 'search', 'medication', 'trends', 'network-analysis',
  'awareness', 'opinions', 'truth', 'about', 'chat', 'team',
  'pharmacy-dashboard', 'privacy', 'pharmacy-stock', 'patient-search', 'partner',
  'medicine-report', 'medication-registration', 'epilepsy-perceptions',
  'doctor-dashboard', 'access-dashboard', 'predictive-dashboard', 'subscription',
  'admin-dashboard', 'locations-map', 'terms', 'rgpd',
] as const;

export type PageId = (typeof pageIds)[number];

const aliases: Record<string, PageId> = {
  'protection-des-donnees': 'privacy',
  'conditions-utilisation': 'terms',
};

export function pageFromHash(hash: string): PageId {
  const value = hash.replace(/^#/, '').trim();
  if (!value) return 'home';
  if (value === 'predictive-dashboard' || value === 'access-dashboard') return value;
  if (aliases[value]) return aliases[value];
  return pageIds.includes(value as PageId) ? value as PageId : 'home';
}

export function hashForPage(page: PageId): string {
  if (page === 'privacy') return '#protection-des-donnees';
  if (page === 'terms') return '#conditions-utilisation';
  return `#${page}`;
}
