<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api';

interface AnalyticsItem {
  category: string;
  count: number;
}

interface AnalyticsBreakdown {
  items: AnalyticsItem[];
  has_suppressed_groups: boolean;
}

interface AnalyticsResponse {
  sample_size: number | null;
  minimum_group_size: number;
  data_suppressed?: boolean;
  breakdowns: Record<string, AnalyticsBreakdown>;
  response_coverage: Record<string, {
    answered: number | null;
    not_answered: number | null;
    suppressed?: boolean;
  }>;
  monthly_trend: Array<{ month: string; count: number }>;
  forecast: Array<{ month_offset: number; estimated_declarations: number }> | null;
}

const { t } = useI18n();
const data = ref<AnalyticsResponse | null>(null);
const loading = ref(true);
const error = ref('');
const controller = new AbortController();

const chartDefinitions = [
  { key: 'age', title: 'analytics.charts.age' },
  { key: 'sex', title: 'analytics.charts.sex' },
  { key: 'access_ease', title: 'analytics.charts.access' },
  { key: 'effectiveness', title: 'analytics.charts.effectiveness' },
  { key: 'medications', title: 'analytics.charts.medications' },
  { key: 'medication_category', title: 'analytics.charts.medicationCategory' },
  { key: 'locations', title: 'analytics.charts.locations' },
  { key: 'financial_resources', title: 'analytics.charts.finances' },
  { key: 'education', title: 'analytics.charts.education' },
  { key: 'employment', title: 'analytics.charts.employment' },
  { key: 'emotional_impact', title: 'analytics.charts.emotionalImpact' },
  { key: 'social_stigma', title: 'analytics.charts.socialStigma' },
  { key: 'professional_impact', title: 'analytics.charts.professionalImpact' },
  { key: 'social_support', title: 'analytics.charts.socialSupport' },
  { key: 'access_barriers', title: 'analytics.charts.accessBarriers' },
  { key: 'cost_related_treatment_change', title: 'analytics.charts.costRelatedTreatmentChange' },
  { key: 'discrimination_context', title: 'analytics.charts.discriminationContext' },
  { key: 'rights_support_need', title: 'analytics.charts.rightsSupportNeed' },
  { key: 'found_medication', title: 'analytics.charts.foundMedication' },
  { key: 'waiting_time', title: 'analytics.charts.waitingTime' },
  { key: 'stockout_frequency', title: 'analytics.charts.stockouts' },
  { key: 'alternative_medication', title: 'analytics.charts.alternatives' },
  { key: 'treatment_status', title: 'analytics.charts.treatmentStatus' },
  { key: 'treatment_duration', title: 'analytics.charts.treatmentDuration' },
  { key: 'pharmacies_visited', title: 'analytics.charts.pharmaciesVisited' },
  { key: 'morning_pills', title: 'analytics.charts.morningPills' },
  { key: 'noon_pills', title: 'analytics.charts.noonPills' },
  { key: 'evening_pills', title: 'analytics.charts.eveningPills' },
  { key: 'wants_alert', title: 'analytics.charts.wantsAlert' },
  { key: 'knows_restock_delay', title: 'analytics.charts.restockDelay' },
  { key: 'restock_delay_precision', title: 'analytics.charts.restockDelayPrecision' },
];

const charts = computed(() => chartDefinitions.map(({ key, title }) => {
  const items = data.value?.breakdowns[key]?.items ?? [];
  const maximum = Math.max(1, ...items.map(item => item.count));
  return {
    key,
    title,
    items: items.map(item => ({
      ...item,
      label: key === 'medications' && item.category !== 'other'
        ? item.category
        : t(`analytics.categories.${item.category}`),
      width: `${Math.max(3, (item.count / maximum) * 100)}%`,
    })),
    suppressed: data.value?.breakdowns[key]?.has_suppressed_groups ?? false,
  };
}));

const coverage = computed(() => Object.entries(data.value?.response_coverage ?? {}).map(
  ([field, result]) => ({
    field: t(`analytics.fields.${field}`),
    answered: result.answered,
    notAnswered: result.not_answered,
    suppressed: result.suppressed ?? false,
  }),
));

const monthlyMaximum = computed(() => Math.max(
  1,
  ...(data.value?.monthly_trend.map(point => point.count) ?? []),
));

async function loadAnalytics() {
  loading.value = true;
  error.value = '';
  try {
    data.value = await apiRequest<AnalyticsResponse>(
      '/patients/analytics/public',
      { signal: controller.signal },
    );
  } catch (cause) {
    if (!controller.signal.aborted) {
      error.value = cause instanceof Error ? cause.message : t('analytics.loadError');
    }
  } finally {
    if (!controller.signal.aborted) loading.value = false;
  }
}

onMounted(loadAnalytics);
onUnmounted(() => controller.abort());
</script>

<template>
  <section class="analytics-dashboard" aria-live="polite">
    <p class="analytics-intro">{{ t('analytics.publicDescription') }}</p>

    <div v-if="loading" class="panel analytics-state" role="status">
      {{ t('analytics.loading') }}
    </div>
    <div v-else-if="error" class="panel analytics-state analytics-error" role="alert">
      {{ t('analytics.loadError') }} {{ error }}
    </div>
    <div v-else-if="data?.data_suppressed" class="panel analytics-state" role="status">
      {{ t('analytics.minimumSample', { count: data.minimum_group_size }) }}
    </div>
    <template v-else-if="data">
      <div class="analytics-stat-grid">
        <article class="panel analytics-stat">
          <span>{{ t('analytics.sampleSize') }}</span>
          <strong>{{ data.sample_size }}</strong>
          <small>{{ t('analytics.consentedOnly') }}</small>
        </article>
        <article class="panel analytics-stat">
          <span>{{ t('analytics.privacyThreshold') }}</span>
          <strong>{{ data.minimum_group_size }}</strong>
          <small>{{ t('analytics.privacyNote') }}</small>
        </article>
        <article class="panel analytics-stat">
          <span>{{ t('analytics.forecastTitle') }}</span>
          <strong>{{ data.forecast ? t('analytics.available') : t('analytics.notAvailable') }}</strong>
          <small>{{ t('analytics.forecastDisclaimer') }}</small>
        </article>
      </div>

      <div class="analytics-chart-grid">
        <article v-for="chart in charts" :key="chart.key" class="panel analytics-chart">
          <h2>{{ t(chart.title) }}</h2>
          <p v-if="chart.suppressed" class="analytics-suppression">
            {{ t('analytics.suppressedGroups', { count: data.minimum_group_size }) }}
          </p>
          <ul v-if="chart.items.length" class="analytics-bars">
            <li v-for="item in chart.items" :key="item.category">
              <span class="analytics-bar-label">{{ item.label }}</span>
              <span class="analytics-bar-track">
                <span class="analytics-bar-fill" :style="{ width: item.width }"></span>
              </span>
              <strong>{{ item.count }}</strong>
            </li>
          </ul>
          <p v-else class="analytics-empty">{{ t('analytics.noBreakdown') }}</p>
        </article>
      </div>

      <article class="panel analytics-chart">
        <h2>{{ t('analytics.charts.trend') }}</h2>
        <p>{{ t('analytics.trendDescription') }}</p>
        <div v-if="data.monthly_trend.length" class="analytics-trend">
          <div v-for="point in data.monthly_trend" :key="point.month" class="analytics-trend-point">
            <span class="analytics-trend-count">{{ point.count }}</span>
            <span
              class="analytics-trend-bar"
              :style="{ height: `${Math.max(8, (point.count / monthlyMaximum) * 100)}%` }"
            ></span>
            <small>{{ point.month }}</small>
          </div>
        </div>
        <p v-else class="analytics-empty">{{ t('analytics.trendUnavailable') }}</p>
        <div v-if="data.forecast" class="analytics-forecast">
          <h3>{{ t('analytics.forecastTitle') }}</h3>
          <span v-for="point in data.forecast" :key="point.month_offset">
            {{ t('analytics.forecastMonth', { month: point.month_offset, count: point.estimated_declarations }) }}
          </span>
          <p>{{ t('analytics.forecastDisclaimer') }}</p>
        </div>
      </article>

      <article class="panel analytics-chart">
        <h2>{{ t('analytics.responseCoverage') }}</h2>
        <p>{{ t('analytics.responseCoverageDescription') }}</p>
        <ul class="analytics-coverage">
          <li v-for="item in coverage" :key="item.field">
            <span>{{ item.field }}</span>
            <template v-if="!item.suppressed">
              <strong>{{ item.answered }}</strong>
              <small>{{ t('analytics.answered') }}</small>
              <strong>{{ item.notAnswered }}</strong>
              <small>{{ t('analytics.notAnswered') }}</small>
            </template>
            <small v-else>{{ t('analytics.suppressedGroups', { count: data.minimum_group_size }) }}</small>
          </li>
        </ul>
        <p class="analytics-note">{{ t('analytics.openTextNote') }}</p>
        <p class="analytics-note">{{ t('analytics.amountComparabilityNote') }}</p>
      </article>

      <p class="analytics-note">{{ t('analytics.methodology') }}</p>
    </template>
  </section>
</template>

<style scoped>
.analytics-dashboard {
  display: grid;
  gap: 1rem;
}

.analytics-intro,
.analytics-note,
.analytics-chart > p {
  color: #536176;
  line-height: 1.6;
}

.analytics-stat-grid,
.analytics-chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 1rem;
}

.analytics-stat,
.analytics-chart,
.analytics-state {
  padding: 1.25rem;
}

.analytics-stat {
  display: grid;
  gap: 0.4rem;
}

.analytics-stat strong {
  color: #263c77;
  font-size: 1.8rem;
}

.analytics-stat small,
.analytics-chart small {
  color: #68758a;
}

.analytics-chart h2,
.analytics-forecast h3 {
  margin: 0 0 0.6rem;
  color: #263c77;
  font-size: 1.1rem;
}

.analytics-bars,
.analytics-coverage {
  display: grid;
  gap: 0.8rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

.analytics-bars li {
  display: grid;
  grid-template-columns: minmax(5rem, 0.8fr) minmax(4rem, 2fr) auto;
  align-items: center;
  gap: 0.65rem;
}

.analytics-bar-label {
  overflow-wrap: anywhere;
}

.analytics-bar-track {
  height: 0.65rem;
  overflow: hidden;
  border-radius: 999px;
  background: #e8edf5;
}

.analytics-bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #536bc5;
}

.analytics-suppression,
.analytics-empty,
.analytics-error {
  color: #8a4b11;
}

.analytics-trend {
  display: flex;
  align-items: end;
  gap: 0.5rem;
  min-height: 11rem;
  overflow-x: auto;
  padding: 1rem 0 0;
}

.analytics-trend-point {
  display: grid;
  flex: 1 0 3.2rem;
  grid-template-rows: auto 1fr auto;
  justify-items: center;
  gap: 0.4rem;
  height: 9rem;
}

.analytics-trend-bar {
  align-self: end;
  width: min(2rem, 70%);
  border-radius: 0.35rem 0.35rem 0 0;
  background: #536bc5;
}

.analytics-trend-count {
  font-size: 0.8rem;
  font-weight: 700;
}

.analytics-forecast {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e8edf5;
}

.analytics-forecast h3,
.analytics-forecast p {
  flex-basis: 100%;
}

.analytics-coverage li {
  display: grid;
  grid-template-columns: minmax(9rem, 2fr) repeat(4, auto);
  gap: 0.5rem;
  align-items: baseline;
  border-bottom: 1px solid #edf0f5;
  padding-bottom: 0.5rem;
}

.analytics-coverage li > small {
  color: #68758a;
}

.analytics-note {
  margin: 0;
  font-size: 0.9rem;
}

@media (max-width: 560px) {
  .analytics-coverage li {
    grid-template-columns: 1fr auto;
  }
}
</style>
