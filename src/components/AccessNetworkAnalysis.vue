<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Activity, ArrowRight, Database, EyeOff, MapPinned, Network, ShieldCheck } from 'lucide-vue-next';

const { t } = useI18n();

const nodes = computed(() => ['people', 'pharmacies', 'medicines', 'locations', 'barriers'].map((key) => ({
  key,
  title: t(`networkAnalysis.nodes.${key}.title`),
  description: t(`networkAnalysis.nodes.${key}.description`),
})));

const questions = computed(() => ['where', 'which', 'who', 'whatChanges'].map((key) => ({
  key,
  title: t(`networkAnalysis.questions.${key}.title`),
  description: t(`networkAnalysis.questions.${key}.description`),
})));

const reasons = computed(() => ['findGaps', 'guideActions', 'measureChange'].map((key) => ({
  key,
  title: t(`networkAnalysis.reasons.${key}.title`),
  description: t(`networkAnalysis.reasons.${key}.description`),
})));
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
      <div class="panel network-model-panel">
        <p class="network-conceptual-label"><Network :size="16" />{{ t('networkAnalysis.conceptualLabel') }}</p>
        <div class="network-model-grid">
          <article v-for="node in nodes" :key="node.key" class="network-model-node" :class="`node-${node.key}`">
            <span class="network-node-icon">
              <component :is="node.key === 'people' ? Activity : node.key === 'pharmacies' ? MapPinned : node.key === 'medicines' ? Database : node.key === 'locations' ? Network : ShieldCheck" :size="21" />
            </span>
            <div><h3>{{ node.title }}</h3><p>{{ node.description }}</p></div>
          </article>
          <svg class="network-model-lines" viewBox="0 0 1000 460" preserveAspectRatio="none" role="img" :aria-label="t('networkAnalysis.diagramAlt')">
            <line x1="205" y1="102" x2="500" y2="102" />
            <line x1="500" y1="102" x2="795" y2="102" />
            <line x1="205" y1="102" x2="320" y2="345" />
            <line x1="500" y1="102" x2="680" y2="345" />
            <line x1="320" y1="345" x2="680" y2="345" />
            <line x1="795" y1="102" x2="680" y2="345" />
            <circle cx="205" cy="102" r="5" /><circle cx="500" cy="102" r="5" /><circle cx="795" cy="102" r="5" />
            <circle cx="320" cy="345" r="5" /><circle cx="680" cy="345" r="5" />
          </svg>
        </div>
        <p class="network-model-caption">{{ t('networkAnalysis.diagramCaption') }}</p>
      </div>
    </section>

    <section class="network-analysis-section">
      <header class="network-analysis-heading">
        <p class="network-section-kicker">{{ t('networkAnalysis.questionsKicker') }}</p>
        <h2>{{ t('networkAnalysis.questionsTitle') }}</h2>
      </header>
      <div class="network-question-grid">
        <article v-for="question in questions" :key="question.key" class="panel network-info-card">
          <h3>{{ question.title }}</h3><p>{{ question.description }}</p>
        </article>
      </div>
    </section>

    <section class="network-analysis-section">
      <header class="network-analysis-heading">
        <p class="network-section-kicker">{{ t('networkAnalysis.collectionKicker') }}</p>
        <h2>{{ t('networkAnalysis.collectionTitle') }}</h2>
        <p>{{ t('networkAnalysis.collectionDescription') }}</p>
      </header>
      <div class="network-reason-grid">
        <article v-for="reason in reasons" :key="reason.key" class="panel network-info-card">
          <h3>{{ reason.title }}</h3><p>{{ reason.description }}</p>
        </article>
      </div>
      <div class="network-privacy-note">
        <EyeOff :size="20" />
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
