<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  Activity,
  ArrowRight,
  BriefcaseMedical,
  HeartPulse,
  MapPinned,
  Pill,
  ShieldCheck,
  UsersRound,
} from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface AnalyticsItem {
  category: string;
  count: number;
}

interface AnalyticsBreakdown {
  items: AnalyticsItem[];
  has_suppressed_groups: boolean;
}

interface ResponseCoverage {
  answered: number | null;
  not_answered: number | null;
  suppressed?: boolean;
}

interface AnalyticsResponse {
  sample_size: number | null;
  minimum_group_size: number;
  data_suppressed?: boolean;
  breakdowns: Record<string, AnalyticsBreakdown>;
  response_coverage: Record<string, ResponseCoverage>;
}

type MetricKey =
  | 'age'
  | 'sex'
  | 'locations'
  | 'medication_category'
  | 'medications'
  | 'treatment_status'
  | 'treatment_duration'
  | 'effectiveness'
  | 'access_ease'
  | 'found_medication'
  | 'waiting_time'
  | 'stockout_frequency'
  | 'pharmacies_visited'
  | 'financial_resources'
  | 'employment'
  | 'cost_related_treatment_change'
  | 'emotional_impact'
  | 'social_stigma'
  | 'professional_impact'
  | 'social_support'
  | 'access_barriers'
  | 'discrimination_context'
  | 'rights_support_need';

const { t } = useI18n();
const data = ref<AnalyticsResponse | null>(null);
const loading = ref(true);
const error = ref('');
const controller = new AbortController();

const metricTitles: Record<MetricKey, string> = {
  age: 'age',
  sex: 'sex',
  locations: 'locations',
  medication_category: 'medicationCategory',
  medications: 'medications',
  treatment_status: 'treatmentStatus',
  treatment_duration: 'treatmentDuration',
  effectiveness: 'effectiveness',
  access_ease: 'access',
  found_medication: 'foundMedication',
  waiting_time: 'waitingTime',
  stockout_frequency: 'stockouts',
  pharmacies_visited: 'pharmaciesVisited',
  financial_resources: 'finances',
  employment: 'employment',
  cost_related_treatment_change: 'costRelatedTreatmentChange',
  emotional_impact: 'emotionalImpact',
  social_stigma: 'socialStigma',
  professional_impact: 'professionalImpact',
  social_support: 'socialSupport',
  access_barriers: 'accessBarriers',
  discrimination_context: 'discriminationContext',
  rights_support_need: 'rightsSupportNeed',
};

const nodeDefinitions: Array<{
  key: string;
  icon: typeof UsersRound;
  metrics: MetricKey[];
}> = [
  { key: 'profile', icon: UsersRound, metrics: ['age', 'sex', 'locations'] },
  {
    key: 'treatment',
    icon: Pill,
    metrics: ['medication_category', 'medications', 'treatment_status', 'treatment_duration'],
  },
  {
    key: 'access',
    icon: MapPinned,
    metrics: ['access_ease', 'found_medication', 'waiting_time', 'stockout_frequency', 'pharmacies_visited'],
  },
  {
    key: 'economic',
    icon: BriefcaseMedical,
    metrics: ['financial_resources', 'employment', 'cost_related_treatment_change'],
  },
  {
    key: 'experience',
    icon: HeartPulse,
    metrics: ['effectiveness', 'emotional_impact', 'social_stigma', 'professional_impact'],
  },
  {
    key: 'support',
    icon: ShieldCheck,
    metrics: ['social_support', 'access_barriers', 'discrimination_context', 'rights_support_need'],
  },
];

const nodes = computed(() => nodeDefinitions.map((node) => ({
  ...node,
  title: t(`networkAnalysis.dataNodes.${node.key}.title`),
  description: t(`networkAnalysis.dataNodes.${node.key}.description`),
  fields: node.metrics.map((key) => {
    const breakdown = data.value?.breakdowns[key];
    const items = (breakdown?.items ?? []).slice(0, 3);
    const maximum = Math.max(1, ...items.map((item) => item.count));
    const coverageKey = key === 'locations'
      ? 'location'
      : key === 'medications'
        ? 'medication_name'
        : key === 'medication_category'
          ? 'medication_category_id'
          : key;
    const coverage = data.value?.response_coverage[coverageKey];
    return {
      key,
      title: t(`analytics.charts.${metricTitles[key]}`),
      answered: coverage?.answered ?? null,
      suppressed: breakdown?.has_suppressed_groups ?? coverage?.suppressed ?? false,
      items: items.map((item) => ({
        ...item,
        label: key === 'medications'
          ? item.category
          : t(`analytics.categories.${item.category}`),
        width: `${Math.max(3, (item.count / maximum) * 100)}%`,
      })),
    };
  }),
})));

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
      error.value = cause instanceof Error ? cause.message : t('networkAnalysis.loadError');
    }
  } finally {
    if (!controller.signal.aborted) loading.value = false;
  }
}

onMounted(loadAnalytics);
onUnmounted(() => controller.abort());
</script>

<template>
  <div class="network-analysis-page">
    <section class="panel network-problem-statement">
      <span class="round-icon purple"><Activity :size="24" /></span>
      <div>
        <p class="network-section-kicker">{{ t('networkAnalysis.problemKicker') }}</p>
        <h2>{{ t('networkAnalysis.problemTitle') }}</h2>
        <p>{{ t('networkAnalysis.problemDescription') }}</p>
        <a class="network-source-link" href="https://www.who.int/news-room/fact-sheets/detail/epilepsy" target="_blank" rel="noopener noreferrer">
          {{ t('networkAnalysis.whoSource') }} <ArrowRight :size="15" />
        </a>
      </div>
      <div class="network-evidence-stat">
        <strong>{{ t('networkAnalysis.globalStat') }}</strong>
        <span>{{ t('networkAnalysis.globalStatLabel') }}</span>
      </div>
    </section>

    <section class="network-analysis-section">
      <header class="network-analysis-heading">
        <p class="network-section-kicker">{{ t('networkAnalysis.modelKicker') }}</p>
        <h2>{{ t('networkAnalysis.modelTitle') }}</h2>
        <p>{{ t('networkAnalysis.modelDescription') }}</p>
      </header>

      <div v-if="loading" class="panel network-live-state" role="status">
        {{ t('networkAnalysis.loading') }}
      </div>
      <div v-else-if="error" class="panel network-live-state network-live-error" role="alert">
        <p>{{ t('networkAnalysis.loadError') }} {{ error }}</p>
        <button class="button button-primary" type="button" @click="loadAnalytics">
          {{ t('networkAnalysis.retry') }}
        </button>
      </div>
      <div v-else-if="data" class="network-live-panel">
        <div class="network-live-summary">
          <div>
            <span>{{ t('networkAnalysis.consentedSample') }}</span>
            <strong v-if="data.sample_size !== null">{{ data.sample_size }}</strong>
            <strong v-else>—</strong>
          </div>
          <p v-if="data.data_suppressed" role="status">
            {{ t('networkAnalysis.minimumSample', { count: data.minimum_group_size }) }}
          </p>
          <p v-else>
            {{ t('networkAnalysis.minimumGroup', { count: data.minimum_group_size }) }}
          </p>
        </div>

        <div class="network-live-grid">
          <article
            v-for="node in nodes"
            :key="node.key"
            class="panel network-data-node"
            :class="`network-node-${node.key}`"
          >
            <header class="network-data-node-heading">
              <span class="network-data-node-icon"><component :is="node.icon" :size="20" /></span>
              <div>
                <h3>{{ node.title }}</h3>
                <p>{{ node.description }}</p>
              </div>
            </header>

            <div class="network-data-fields">
              <section v-for="field in node.fields" :key="field.key" class="network-data-field">
                <div class="network-data-field-heading">
                  <h4>{{ field.title }}</h4>
                  <span v-if="field.answered !== null">
                    {{ t('networkAnalysis.responseCount', { count: field.answered }) }}
                  </span>
                </div>
                <ul v-if="field.items.length" class="network-data-bars">
                  <li v-for="item in field.items" :key="item.category">
                    <span class="network-data-label">{{ item.label }}</span>
                    <span class="network-data-track">
                      <span :style="{ width: item.width }"></span>
                    </span>
                    <strong>{{ item.count }}</strong>
                  </li>
                </ul>
                <p v-else-if="field.suppressed || data.data_suppressed" class="network-data-muted">
                  {{ t('networkAnalysis.suppressedGroups', { count: data.minimum_group_size }) }}
                </p>
                <p v-else class="network-data-muted">{{ t('networkAnalysis.noResponses') }}</p>
              </section>
            </div>
          </article>
        </div>

        <p class="network-model-caption">{{ t('networkAnalysis.liveCaption') }}</p>
      </div>
    </section>

    <section class="network-analysis-section">
      <header class="network-analysis-heading">
        <p class="network-section-kicker">{{ t('networkAnalysis.collectionKicker') }}</p>
        <h2>{{ t('networkAnalysis.collectionTitle') }}</h2>
        <p>{{ t('networkAnalysis.collectionDescription') }}</p>
      </header>
      <div class="network-privacy-note">
        <ShieldCheck :size="20" />
        <p><strong>{{ t('networkAnalysis.privacyTitle') }}</strong> {{ t('networkAnalysis.privacyDescription') }}</p>
      </div>
    </section>

    <section class="panel network-evidence-note">
      <ShieldCheck :size="22" />
      <div>
        <h2>{{ t('networkAnalysis.evidenceTitle') }}</h2>
        <p>{{ t('networkAnalysis.evidenceDescription') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.network-live-state,
.network-live-panel {
  padding: 1.25rem;
}

.network-live-state {
  color: #536176;
}

.network-live-error {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
  color: #8a3d32;
}

.network-live-error p {
  margin: 0;
}

.network-live-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e6dbea;
  border-radius: 0.8rem;
  background: #fbf7fc;
}

.network-live-summary > div {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
}

.network-live-summary span,
.network-live-summary p {
  color: #62566a;
  font-size: 0.88rem;
}

.network-live-summary strong {
  color: #722a8d;
  font-size: 1.5rem;
}

.network-live-summary p {
  margin: 0;
}

.network-live-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.network-data-node {
  display: grid;
  align-content: start;
  gap: 0.9rem;
  min-width: 0;
  padding: 1rem;
  border-top: 3px solid #8a4aa0;
}

.network-node-treatment { border-top-color: #536bc5; }
.network-node-access { border-top-color: #327b75; }
.network-node-economic { border-top-color: #b17a30; }
.network-node-experience { border-top-color: #a45068; }
.network-node-support { border-top-color: #627a48; }

.network-data-node-heading {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
}

.network-data-node-heading > div {
  min-width: 0;
}

.network-data-node-icon {
  display: grid;
  flex: none;
  width: 2.4rem;
  height: 2.4rem;
  place-items: center;
  border-radius: 0.7rem;
  color: #722a8d;
  background: #f5edf8;
}

.network-node-treatment .network-data-node-icon { color: #4058ae; background: #eef0fb; }
.network-node-access .network-data-node-icon { color: #276b66; background: #edf7f5; }
.network-node-economic .network-data-node-icon { color: #90611f; background: #fbf4e8; }
.network-node-experience .network-data-node-icon { color: #93435b; background: #fbf0f3; }
.network-node-support .network-data-node-icon { color: #536b3d; background: #f1f5ec; }

.network-data-node-heading h3,
.network-data-field-heading h4 {
  margin: 0;
  color: #403546;
}

.network-data-node-heading h3 {
  font-size: 1rem;
}

.network-data-node-heading p {
  margin: 0.2rem 0 0;
  color: #716a78;
  font-size: 0.78rem;
  line-height: 1.45;
}

.network-data-fields {
  display: grid;
  gap: 0.8rem;
}

.network-data-field {
  min-width: 0;
  padding-top: 0.7rem;
  border-top: 1px solid #eee9f0;
}

.network-data-field-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.network-data-field-heading h4 {
  font-size: 0.78rem;
}

.network-data-field-heading > span {
  color: #766d7b;
  font-size: 0.68rem;
  white-space: nowrap;
}

.network-data-bars {
  display: grid;
  gap: 0.45rem;
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
}

.network-data-bars li {
  display: grid;
  grid-template-columns: minmax(3.2rem, 0.9fr) minmax(2.5rem, 1.4fr) auto;
  align-items: center;
  gap: 0.45rem;
}

.network-data-label {
  overflow: hidden;
  color: #625a69;
  font-size: 0.7rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.network-data-track {
  height: 0.42rem;
  overflow: hidden;
  border-radius: 999px;
  background: #eeeaf1;
}

.network-data-track > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #8a4aa0;
}

.network-node-treatment .network-data-track > span { background: #536bc5; }
.network-node-access .network-data-track > span { background: #327b75; }
.network-node-economic .network-data-track > span { background: #b17a30; }
.network-node-experience .network-data-track > span { background: #a45068; }
.network-node-support .network-data-track > span { background: #627a48; }

.network-data-bars strong {
  color: #403546;
  font-size: 0.72rem;
}

.network-data-muted {
  margin: 0.4rem 0 0;
  color: #786f7d;
  font-size: 0.73rem;
  line-height: 1.4;
}

.network-live-panel > .network-model-caption {
  margin-bottom: 0;
}

@media (max-width: 900px) {
  .network-live-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .network-live-grid {
    grid-template-columns: 1fr;
  }

  .network-live-panel {
    padding: 0.85rem;
  }
}
</style>
