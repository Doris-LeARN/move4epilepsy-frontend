<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api';

type RoleDashboardPage = 'pharmacy-dashboard' | 'admin-dashboard';

interface AdminAnalytics {
  total_users: number;
  total_pharmacies: number;
  total_medications: number;
  total_treatments: number;
  active_subscriptions: number;
  pending_partnerships: number;
  pending_reports: number;
  recent_messages: number;
}

interface PharmacyAnalytics {
  pharmacy_name: string;
  stock_lines: number;
  total_units: number;
  status_counts: Record<'available' | 'low_stock' | 'out_of_stock', number>;
  last_stock_update: string | null;
  stock_by_medication: Array<{
    medication: string;
    quantity: number;
    category: 'available' | 'low_stock' | 'out_of_stock';
  }>;
}

const props = defineProps<{ page: RoleDashboardPage }>();
const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();
const data = ref<AdminAnalytics | PharmacyAnalytics | null>(null);
const loading = ref(true);
const error = ref('');
const controller = new AbortController();

const isAdmin = computed(() => props.page === 'admin-dashboard');
const pharmacyData = computed(() => data.value as PharmacyAnalytics | null);
const adminData = computed(() => data.value as AdminAnalytics | null);
const pharmacyStatusItems = computed(() => {
  const counts = pharmacyData.value?.status_counts;
  if (!counts) return [];
  const maximum = Math.max(1, ...Object.values(counts));
  return (['available', 'low_stock', 'out_of_stock'] as const).map(category => ({
    category,
    count: counts[category],
    width: `${Math.max(3, (counts[category] / maximum) * 100)}%`,
  }));
});

async function loadAnalytics() {
  loading.value = true;
  error.value = '';
  try {
    data.value = isAdmin.value
      ? await apiRequest<AdminAnalytics>('/admin/dashboard/stats', { signal: controller.signal })
      : await apiRequest<PharmacyAnalytics>('/pharmacies/analytics/mine', { signal: controller.signal });
  } catch (cause) {
    if (!controller.signal.aborted) {
      error.value = cause instanceof Error ? cause.message : t('roleAnalytics.loadError');
    }
  } finally {
    if (!controller.signal.aborted) loading.value = false;
  }
}

onMounted(loadAnalytics);
onUnmounted(() => controller.abort());
</script>

<template>
  <section class="role-analytics" aria-live="polite">
    <div v-if="loading" class="panel role-analytics-state" role="status">
      {{ t('roleAnalytics.loading') }}
    </div>
    <div v-else-if="error" class="panel role-analytics-state" role="alert">
      <p>{{ t('roleAnalytics.loadError') }} {{ error }}</p>
      <button class="button button-primary" type="button" @click="emit('navigate', 'login')">
        {{ t('auth.goToLogin') }}
      </button>
    </div>
    <template v-else-if="isAdmin && adminData">
      <p class="role-analytics-note">{{ t('roleAnalytics.adminDescription') }}</p>
      <div class="role-analytics-grid">
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.totalTreatments') }}</span>
          <strong>{{ adminData.total_treatments }}</strong>
          <small>{{ t('roleAnalytics.consentedOnly') }}</small>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.totalPharmacies') }}</span>
          <strong>{{ adminData.total_pharmacies }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.totalMedications') }}</span>
          <strong>{{ adminData.total_medications }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.activeSubscriptions') }}</span>
          <strong>{{ adminData.active_subscriptions }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.pendingReports') }}</span>
          <strong>{{ adminData.pending_reports }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.pendingPartnerships') }}</span>
          <strong>{{ adminData.pending_partnerships }}</strong>
        </article>
      </div>
    </template>
    <template v-else-if="pharmacyData">
      <p class="role-analytics-note">
        {{ t('roleAnalytics.pharmacyDescription', { pharmacy: pharmacyData.pharmacy_name }) }}
      </p>
      <div class="role-analytics-grid">
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.stockLines') }}</span>
          <strong>{{ pharmacyData.stock_lines }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.totalUnits') }}</span>
          <strong>{{ pharmacyData.total_units }}</strong>
        </article>
        <article class="panel role-analytics-card">
          <span>{{ t('roleAnalytics.lastUpdate') }}</span>
          <strong class="role-analytics-date">
            {{ pharmacyData.last_stock_update ?? t('roleAnalytics.noUpdate') }}
          </strong>
        </article>
      </div>
      <article class="panel role-analytics-chart">
        <h2>{{ t('roleAnalytics.stockStatus') }}</h2>
        <ul class="role-analytics-bars">
          <li v-for="item in pharmacyStatusItems" :key="item.category">
            <span>{{ t(`roleAnalytics.categories.${item.category}`) }}</span>
            <span class="role-analytics-track">
              <span :style="{ width: item.width }"></span>
            </span>
            <strong>{{ item.count }}</strong>
          </li>
        </ul>
      </article>
      <article class="panel role-analytics-chart">
        <h2>{{ t('roleAnalytics.stockByMedication') }}</h2>
        <p v-if="!pharmacyData.stock_by_medication.length" class="role-analytics-note">
          {{ t('roleAnalytics.noStock') }}
        </p>
        <div v-else class="role-analytics-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">{{ t('roleAnalytics.medication') }}</th>
                <th scope="col">{{ t('roleAnalytics.quantity') }}</th>
                <th scope="col">{{ t('roleAnalytics.status') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in pharmacyData.stock_by_medication" :key="item.medication">
                <td>{{ item.medication }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ t(`roleAnalytics.categories.${item.category}`) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
.role-analytics {
  display: grid;
  gap: 1rem;
}

.role-analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 1rem;
}

.role-analytics-card,
.role-analytics-chart,
.role-analytics-state {
  padding: 1.25rem;
}

.role-analytics-card {
  display: grid;
  gap: 0.45rem;
}

.role-analytics-card strong {
  color: #263c77;
  font-size: 1.8rem;
  overflow-wrap: anywhere;
}

.role-analytics-date {
  font-size: 1rem !important;
}

.role-analytics-card small,
.role-analytics-note {
  color: #536176;
}

.role-analytics-bars {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.role-analytics-bars li {
  display: grid;
  grid-template-columns: minmax(7rem, 1fr) minmax(5rem, 2fr) auto;
  gap: 0.75rem;
  align-items: center;
}

.role-analytics-track {
  height: 0.7rem;
  overflow: hidden;
  border-radius: 99px;
  background: #e8edf5;
}

.role-analytics-track > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #536bc5;
}

.role-analytics-table-wrap {
  overflow-x: auto;
}

.role-analytics-table-wrap table {
  width: 100%;
  border-collapse: collapse;
}

.role-analytics-table-wrap th,
.role-analytics-table-wrap td {
  padding: 0.75rem;
  border-bottom: 1px solid #e8edf5;
  text-align: left;
}

.role-analytics-table-wrap th {
  color: #263c77;
}

@media (max-width: 560px) {
  .role-analytics-bars li {
    grid-template-columns: 1fr auto;
  }

  .role-analytics-track {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
