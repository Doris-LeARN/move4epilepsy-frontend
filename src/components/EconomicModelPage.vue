<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowRight, Building } from 'lucide-vue-next';

const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();
const incomeSources = computed(() => [
  'pharmacySubscriptions',
  'partnershipContracts',
  'fundedProjects',
  'training',
  'studies',
].map((key) => ({
  key,
  title: t(`economicModel.sources.${key}.title`),
  clients: t(`economicModel.sources.${key}.clients`),
  range: t(`economicModel.sources.${key}.range`),
  description: t(`economicModel.sources.${key}.description`),
})));
</script>

<template>
  <div class="information-page economic-model-page">
    <section class="panel information-intro">
      <div class="information-intro-copy">
        <span class="round-icon purple"><Building :size="24" /></span>
        <h2>{{ t('economicModel.title') }}</h2>
        <p>{{ t('economicModel.intro') }}</p>
      </div>
    </section>

    <section class="panel information-feature">
      <h2>{{ t('economicModel.principleTitle') }}</h2>
      <p>{{ t('economicModel.principleText') }}</p>
    </section>

    <section>
      <div class="education-section-title">
        <Building :size="22" />
        <h2>{{ t('economicModel.sourcesTitle') }}</h2>
      </div>
      <div class="information-grid">
        <article v-for="source in incomeSources" :key="source.key" class="panel information-card">
          <h3>{{ source.title }}</h3>
          <p>{{ source.clients }}</p>
          <strong class="economic-model-range">{{ source.range }}</strong>
          <p>{{ source.description }}</p>
        </article>
      </div>
    </section>

    <aside class="form-alert economic-model-caveat">
      {{ t('economicModel.validationNote') }}
    </aside>

    <section class="panel information-feature">
      <h2>{{ t('economicModel.dataTitle') }}</h2>
      <p>{{ t('economicModel.dataText') }}</p>
      <div class="information-actions">
        <button class="button button-primary" type="button" @click="emit('navigate', 'subscription')">
          <Building :size="17" />{{ t('economicModel.subscriptionLink') }} <ArrowRight :size="16" />
        </button>
      </div>
    </section>
  </div>
</template>
