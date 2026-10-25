<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  AlertCircle, ArrowRight, Award, Check, Globe2, Mail, MapPin, Shield,
  TrendingUp, Users,
} from 'lucide-vue-next';
import { apiRequest } from '../services/api';

type Tier = 'essential' | 'professional' | 'network';
type BillingPeriod = 'monthly' | 'annual';

interface SubscriptionPlan {
  id: string;
  name: string;
  country: string;
  monthly_price?: number | string | null;
  annual_price?: number | string | null;
  currency: string;
  features: unknown;
  is_active?: boolean;
}

const emit = defineEmits<{ navigate: [page: string] }>();
const { t, locale } = useI18n();
const plans = ref<SubscriptionPlan[]>([]);
const selectedCountry = ref('');
const billingPeriod = ref<BillingPeriod>('monthly');
const selectedPlan = ref<SubscriptionPlan | null>(null);
const loading = ref(true);
const error = ref('');
const quoteName = ref('');
const quoteCountry = ref('');
const quoteCount = ref('');
const quoteEmail = ref('');
const quoteNeeds = ref('');

const countries = computed(() => [...new Set(plans.value
  .map((plan) => normalizeCountry(plan.country))
  .filter(Boolean))].sort((a, b) => a.localeCompare(b, locale.value)));

const plansForCountry = computed(() => plans.value
  .filter((plan) => normalizeCountry(plan.country) === selectedCountry.value));

const tierPlans = computed<Record<Tier, SubscriptionPlan | undefined>>(() => {
  const result: Record<Tier, SubscriptionPlan | undefined> = {
    essential: undefined,
    professional: undefined,
    network: undefined,
  };
  for (const plan of plansForCountry.value) {
    const tier = planTier(plan.name);
    if (tier && !result[tier]) result[tier] = plan;
  }
  return result;
});

const tiers = computed(() => ([
  { id: 'essential' as const, icon: Shield, tone: 'essential' },
  { id: 'professional' as const, icon: TrendingUp, tone: 'professional' },
  { id: 'network' as const, icon: Users, tone: 'network' },
]).map((tier) => {
  const configuredFeatures = planFeatures(tierPlans.value[tier.id]?.features);
  return {
    ...tier,
    name: t(`subscriptions.tiers.${tier.id}.name`),
    tagline: t(`subscriptions.tiers.${tier.id}.tagline`),
    description: t(`subscriptions.tiers.${tier.id}.description`),
    features: configuredFeatures.length
      ? configuredFeatures.map((label) => ({ label }))
      : featureKeys[tier.id].map((key) => ({ label: t(`subscriptions.tiers.${tier.id}.features.${key}`) })),
  };
}));

const comparisonRows = computed(() => comparisonFeatureKeys.map((key) => ({
  key,
  label: t(`subscriptions.comparison.features.${key}`),
  values: {
    essential: t(`subscriptions.comparison.values.${key}.essential`),
    professional: t(`subscriptions.comparison.values.${key}.professional`),
    network: t(`subscriptions.comparison.values.${key}.network`),
  },
})));

const faqItems = computed(() => faqKeys.map((key) => ({
  key,
  question: t(`subscriptions.faq.${key}.question`),
  answer: t(`subscriptions.faq.${key}.answer`),
})));

const featureKeys: Record<Tier, string[]> = {
  essential: ['professionalProfile', 'contactLocation', 'practicalInformation', 'profileUpdates'],
  professional: ['essentialIncluded', 'enrichedProfile', 'visibilityStatistics', 'serviceInformation'],
  network: ['professionalIncluded', 'multipleLocations', 'centralManagement', 'consolidatedView'],
};

const comparisonFeatureKeys = [
  'professionalProfile', 'contactLocation', 'profileUpdates', 'serviceInformation',
  'visibilityStatistics', 'multipleLocations', 'teamRoles', 'consolidatedStatistics',
];
const faqKeys = ['eligibility', 'patientPrice', 'regionalPricing', 'currency', 'payment', 'changePlan', 'cancel', 'networkPlan', 'privacy', 'unsupportedMarket'];

function normalizeCountry(country: string) {
  const value = country.trim();
  if (value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase() === 'benin') return 'Bénin';
  return value;
}

function planTier(name: string): Tier | undefined {
  const normalized = name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  if (normalized.includes('basic') || normalized.includes('essential') || normalized.includes('essentiel')) return 'essential';
  if (normalized.includes('professional') || normalized.includes('professionnel')) return 'professional';
  if (normalized.includes('premium') || normalized.includes('network') || normalized.includes('reseau')) return 'network';
  return undefined;
}

function planFeatures(features: unknown): string[] {
  if (Array.isArray(features)) return features.map((feature) => String(feature).trim()).filter(Boolean);
  if (typeof features !== 'string' || !features.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(features);
    if (Array.isArray(parsed)) return parsed.map((feature) => String(feature).trim()).filter(Boolean);
  } catch {
    return [features.trim()];
  }
  return [features.trim()];
}

function formattedPrice(plan: SubscriptionPlan) {
  const rawAmount = billingPeriod.value === 'monthly' ? plan.monthly_price : plan.annual_price;
  const currency = plan.currency.trim().toUpperCase();
  if (rawAmount == null || String(rawAmount).trim() === '' || !/^[A-Z]{3}$/.test(currency)) return t('subscriptions.priceUnavailable');
  const amount = Number(rawAmount);
  if (!Number.isFinite(amount)) return t('subscriptions.priceUnavailable');
  try {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString(locale.value)} ${currency}`;
  }
}

async function loadPlans() {
  loading.value = true;
  error.value = '';
  selectedPlan.value = null;
  try {
    const data = await apiRequest<SubscriptionPlan[]>('/subscriptions/plans');
    plans.value = data.filter((plan) => plan.is_active !== false);
    if (!plans.value.some((plan) => normalizeCountry(plan.country) === selectedCountry.value)) {
      selectedCountry.value = countries.value[0] ?? '';
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('subscriptions.loadError');
  } finally {
    loading.value = false;
  }
}

function selectCountry(country: string) {
  selectedCountry.value = country;
  selectedPlan.value = null;
}

function onCountryChange(event: Event) {
  if (event.target instanceof HTMLSelectElement) selectCountry(event.target.value);
}

function sendQuoteRequest() {
  const subject = t('subscriptions.quoteEmailSubject');
  const body = [
    t('subscriptions.quoteFields.organization', { value: quoteName.value.trim() }),
    t('subscriptions.quoteFields.country', { value: quoteCountry.value.trim() }),
    t('subscriptions.quoteFields.locations', { value: quoteCount.value }),
    t('subscriptions.quoteFields.email', { value: quoteEmail.value.trim() }),
    t('subscriptions.quoteFields.needs', { value: quoteNeeds.value.trim() || t('subscriptions.notProvided') }),
  ].join('\n');
  window.location.href = `mailto:move4epilepsy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

onMounted(loadPlans);
</script>

<template>
  <div class="subscription-page">
    <section class="subscription-hero">
      <div class="subscription-hero-content">
        <p class="subscription-eyebrow"><Globe2 :size="16" />{{ t('subscriptions.eyebrow') }}</p>
        <h2>{{ t('subscriptions.heroTitle') }}</h2>
        <p class="subscription-hero-copy">{{ t('subscriptions.heroDescription') }}</p>
        <div class="subscription-hero-actions">
          <a class="button button-white" href="#subscription-plans">{{ t('subscriptions.discoverPlans') }} <ArrowRight :size="17" /></a>
          <a class="subscription-hero-contact" href="mailto:move4epilepsy@gmail.com"><Mail :size="16" />{{ t('subscriptions.contactTeam') }}</a>
        </div>
      </div>
      <div class="subscription-hero-art" aria-hidden="true">
        <img class="subscription-hero-logo" src="/logo.jpeg" alt="">
        <span class="subscription-hero-badge"><MapPin :size="18" />Move4Epilepsy</span>
      </div>
    </section>

    <div class="subscription-trust-strip">
      <p><Globe2 :size="18" />{{ t('subscriptions.trustInternational') }}</p>
      <p><Award :size="18" />{{ t('subscriptions.trustMarket') }}</p>
      <p><Users :size="18" />{{ t('subscriptions.trustPatients') }}</p>
    </div>

    <section id="subscription-plans" class="subscription-offers-section">
      <header class="subscription-section-heading">
        <p class="subscription-section-kicker">{{ t('subscriptions.offersKicker') }}</p>
        <h2>{{ t('subscriptions.offersTitle') }}</h2>
        <p>{{ t('subscriptions.offersDescription') }}</p>
      </header>

      <div class="subscription-market-panel">
        <label v-if="countries.length" class="subscription-country">
          <span>{{ t('subscriptions.countryLabel') }}</span>
          <select :value="selectedCountry" @change="onCountryChange">
            <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
          </select>
        </label>
        <div v-else-if="!loading && !error" class="subscription-market-unavailable" role="status">
          <Globe2 :size="20" />
          <p>{{ t('subscriptions.noMarkets') }}</p>
        </div>
        <label class="subscription-billing" role="group" :aria-label="t('subscriptions.billingPeriod')">
          <span>{{ t('subscriptions.billingPeriod') }}</span>
          <span class="subscription-billing-controls">
            <button type="button" :class="{ selected: billingPeriod === 'monthly' }" :aria-pressed="billingPeriod === 'monthly'" @click="billingPeriod = 'monthly'">{{ t('subscriptions.monthly') }}</button>
            <button type="button" :class="{ selected: billingPeriod === 'annual' }" :aria-pressed="billingPeriod === 'annual'" @click="billingPeriod = 'annual'">{{ t('subscriptions.annual') }}</button>
          </span>
        </label>
      </div>

      <div v-if="loading" class="panel subscription-api-state" role="status">
        <span class="subscription-spinner" aria-hidden="true"></span>
        <p>{{ t('subscriptions.loading') }}</p>
      </div>
      <div v-else-if="error" class="subscription-api-state subscription-api-error" role="alert">
        <AlertCircle :size="20" />
        <p>{{ t('subscriptions.loadError') }} {{ error }}</p>
        <button class="button button-white" type="button" @click="loadPlans">{{ t('subscriptions.retry') }}</button>
      </div>

      <p class="subscription-price-note">{{ t('subscriptions.priceIntro') }}</p>

      <div class="subscription-grid">
        <article
          v-for="tier in tiers"
          :key="tier.id"
          class="subscription-card"
          :class="[`tone-${tier.tone}`, { 'is-selected': selectedPlan?.id === tierPlans[tier.id]?.id }]"
        >
          <div v-if="tier.id === 'professional'" class="subscription-badge">{{ t('subscriptions.popular') }}</div>
          <header class="subscription-card-header">
            <span class="subscription-tier-icon"><component :is="tier.icon" :size="26" /></span>
            <h3>{{ tier.name }}</h3>
            <p>{{ tier.tagline }}</p>
            <div class="subscription-price">
              <strong v-if="tierPlans[tier.id]">{{ formattedPrice(tierPlans[tier.id]!) }}</strong>
              <strong v-else>{{ t('subscriptions.priceUnavailable') }}</strong>
              <span>{{ tierPlans[tier.id] ? (billingPeriod === 'monthly' ? t('subscriptions.perMonth') : t('subscriptions.perYear')) : t('subscriptions.marketNotConfigured') }}</span>
            </div>
          </header>
          <div class="subscription-card-body">
            <p class="subscription-tier-description">{{ tier.description }}</p>
            <ul class="subscription-feature-list">
              <li v-for="(feature, index) in tier.features" :key="`${tier.id}-${index}`">
                <Check :size="17" aria-hidden="true" /><span>{{ feature.label }}</span>
              </li>
            </ul>
            <p class="subscription-planned-note">{{ t('subscriptions.featuresSubjectToAvailability') }}</p>
            <button
              v-if="tier.id !== 'network'"
              class="button subscription-choose"
              type="button"
              :disabled="!tierPlans[tier.id]"
              @click="selectedPlan = tierPlans[tier.id] ?? null"
            >{{ t(`subscriptions.tiers.${tier.id}.cta`) }} <ArrowRight :size="16" /></button>
            <a v-else class="button subscription-choose" href="#subscription-quote">{{ t('subscriptions.tiers.network.cta') }} <ArrowRight :size="16" /></a>
          </div>
        </article>
      </div>

      <aside v-if="selectedPlan" class="subscription-selection" aria-live="polite">
        <div>
          <p class="subscription-section-kicker">{{ t('subscriptions.selectionKicker') }}</p>
          <h3>{{ t('subscriptions.selectionTitle', { plan: selectedPlan.name }) }}</h3>
          <p>{{ t('subscriptions.selectionDetails', { country: selectedCountry, amount: formattedPrice(selectedPlan), period: billingPeriod === 'monthly' ? t('subscriptions.monthly') : t('subscriptions.annual') }) }}</p>
          <p class="subscription-small-note">{{ t('subscriptions.checkoutUnavailable') }}</p>
        </div>
        <div class="subscription-selection-actions">
          <a class="button button-primary" href="mailto:move4epilepsy@gmail.com">{{ t('subscriptions.contactTeam') }} <Mail :size="16" /></a>
          <button class="button button-secondary" type="button" @click="selectedPlan = null">{{ t('subscriptions.dismiss') }}</button>
        </div>
      </aside>

      <p class="subscription-final-price-note"><AlertCircle :size="17" />{{ t('subscriptions.finalPriceNotice') }}</p>
    </section>

    <section class="subscription-comparison-section">
      <header class="subscription-section-heading">
        <p class="subscription-section-kicker">{{ t('subscriptions.comparisonKicker') }}</p>
        <h2>{{ t('subscriptions.comparisonTitle') }}</h2>
        <p>{{ t('subscriptions.comparisonDescription') }}</p>
      </header>
      <div class="subscription-table-scroll">
        <table class="subscription-comparison">
          <thead><tr><th scope="col">{{ t('subscriptions.comparison.featureColumn') }}</th><th scope="col">{{ t('subscriptions.tiers.essential.name') }}</th><th scope="col">{{ t('subscriptions.tiers.professional.name') }}</th><th scope="col">{{ t('subscriptions.tiers.network.name') }}</th></tr></thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.key">
              <th scope="row">{{ row.label }}</th>
              <td>{{ row.values.essential }}</td><td>{{ row.values.professional }}</td><td>{{ row.values.network }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="subscription-small-note">{{ t('subscriptions.comparisonCaveat') }}</p>
    </section>

    <section id="subscription-how-it-works" class="subscription-process-section">
      <header class="subscription-section-heading">
        <p class="subscription-section-kicker">{{ t('subscriptions.processKicker') }}</p>
        <h2>{{ t('subscriptions.processTitle') }}</h2>
        <p>{{ t('subscriptions.processDescription') }}</p>
      </header>
      <ol class="subscription-process-list">
        <li v-for="step in 5" :key="step" class="panel subscription-process-card">
          <span>{{ step }}</span>
          <h3>{{ t(`subscriptions.process.${step}.title`) }}</h3>
          <p>{{ t(`subscriptions.process.${step}.description`) }}</p>
        </li>
      </ol>
    </section>

    <section class="subscription-benefits-section">
      <header class="subscription-section-heading">
        <p class="subscription-section-kicker">{{ t('subscriptions.benefitsKicker') }}</p>
        <h2>{{ t('subscriptions.benefitsTitle') }}</h2>
      </header>
      <div class="subscription-benefits-grid">
        <article v-for="benefit in ['presence', 'access', 'management', 'international']" :key="benefit" class="panel subscription-benefit-card">
          <span><component :is="benefit === 'presence' ? MapPin : benefit === 'access' ? Shield : benefit === 'management' ? TrendingUp : Globe2" :size="23" /></span>
          <h3>{{ t(`subscriptions.benefits.${benefit}.title`) }}</h3>
          <p>{{ t(`subscriptions.benefits.${benefit}.description`) }}</p>
        </article>
      </div>
    </section>

    <section class="subscription-faq-section">
      <header class="subscription-section-heading">
        <p class="subscription-section-kicker">{{ t('subscriptions.faqKicker') }}</p>
        <h2>{{ t('subscriptions.faqTitle') }}</h2>
      </header>
      <div class="subscription-faq-list">
        <details v-for="item in faqItems" :key="item.key" class="panel subscription-faq-item">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <section id="subscription-quote" class="subscription-quote-section">
      <div class="subscription-quote-copy">
        <p class="subscription-section-kicker">{{ t('subscriptions.quoteKicker') }}</p>
        <h2>{{ t('subscriptions.quoteTitle') }}</h2>
        <p>{{ t('subscriptions.quoteDescription') }}</p>
        <p class="subscription-small-note">{{ t('subscriptions.quotePrivacyNote') }}</p>
      </div>
      <form class="subscription-quote-form" @submit.prevent="sendQuoteRequest">
        <label>{{ t('subscriptions.quoteOrganization') }}<input v-model="quoteName" required maxlength="160"></label>
        <label>{{ t('subscriptions.quoteCountry') }}<input v-model="quoteCountry" required maxlength="100"></label>
        <label>{{ t('subscriptions.quoteLocations') }}<input v-model="quoteCount" type="number" min="1" required></label>
        <label>{{ t('subscriptions.quoteEmail') }}<input v-model="quoteEmail" type="email" required autocomplete="email"></label>
        <label class="subscription-quote-wide">{{ t('subscriptions.quoteNeeds') }}<textarea v-model="quoteNeeds" rows="3"></textarea></label>
        <button class="button button-primary subscription-quote-wide" type="submit">{{ t('subscriptions.sendQuoteRequest') }} <Mail :size="16" /></button>
        <p class="subscription-quote-wide subscription-small-note">{{ t('subscriptions.quoteMailNotice') }}</p>
      </form>
    </section>

    <section class="subscription-final-cta">
      <h2>{{ t('subscriptions.finalTitle') }}</h2>
      <p>{{ t('subscriptions.finalDescription') }}</p>
      <div>
        <a class="button button-white" href="#subscription-plans">{{ t('subscriptions.discoverPlans') }} <ArrowRight :size="16" /></a>
        <a class="button subscription-final-contact" href="mailto:move4epilepsy@gmail.com">{{ t('subscriptions.contactTeam') }} <Mail :size="16" /></a>
      </div>
    </section>

    <footer class="subscription-footer">
      <p>{{ t('subscriptions.footerTitle') }}</p>
      <nav :aria-label="t('subscriptions.footerTitle')">
        <button type="button" @click="emit('navigate', 'about')">{{ t('subscriptions.footer.about') }}</button>
        <button type="button" @click="emit('navigate', 'contact')">{{ t('subscriptions.footer.contact') }}</button>
        <button type="button" @click="emit('navigate', 'resources')">{{ t('subscriptions.footer.help') }}</button>
        <button type="button" @click="emit('navigate', 'terms')">{{ t('subscriptions.footer.terms') }}</button>
        <button type="button" @click="emit('navigate', 'privacy')">{{ t('subscriptions.footer.privacy') }}</button>
      </nav>
    </footer>
  </div>
</template>
