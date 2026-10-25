<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AlertTriangle, BookOpen, Brain, CheckCircle, Heart, Users, XCircle } from 'lucide-vue-next';

const { t } = useI18n();
const mythIds = ['contagious', 'work', 'mouth', 'mental'];
const factIds = ['prevalence', 'control', 'causes', 'treatment'];
const emergencySteps = [1, 2, 3, 4, 5, 6];
const doNotItems = [1, 2, 3, 4];
const resources = ['research', 'testimonies', 'training'];
const factIcons = [Users, CheckCircle, Brain, BookOpen];
</script>

<template>
  <div class="education-page truth-page">
    <header class="education-intro panel">
      <div class="round-icon blue"><Heart :size="25" /></div>
      <h2>{{ t('truthPage.title') }}</h2>
      <p>{{ t('truthPage.intro') }}</p>
    </header>

    <section>
      <div class="education-section-title"><XCircle :size="23" /><h2>{{ t('truthPage.mythsTitle') }}</h2></div>
      <div class="myth-list">
        <article v-for="myth in mythIds" :key="myth" class="panel myth-card">
          <div class="myth-line">
            <span class="myth-icon"><XCircle :size="19" /></span>
            <div><strong>{{ t('truthPage.mythLabel') }}</strong><p>{{ t(`truthPage.myths.${myth}.myth`) }}</p></div>
            <span class="myth-category">{{ t(`truthPage.myths.${myth}.category`) }}</span>
          </div>
          <div class="truth-line">
            <span class="truth-icon"><CheckCircle :size="19" /></span>
            <div><strong>{{ t('truthPage.factLabel') }}</strong><p>{{ t(`truthPage.myths.${myth}.truth`) }}</p></div>
          </div>
        </article>
      </div>
    </section>

    <section>
      <div class="education-section-title"><Brain :size="23" /><h2>{{ t('truthPage.factsTitle') }}</h2></div>
      <div class="truth-facts-grid">
        <article v-for="(fact, index) in factIds" :key="fact" class="panel truth-fact-card">
          <span class="truth-fact-icon"><component :is="factIcons[index]" :size="24" /></span>
          <h3>{{ t(`truthPage.facts.${fact}.title`) }}</h3>
          <p>{{ t(`truthPage.facts.${fact}.description`) }}</p>
          <span class="fact-badge">{{ t('truthPage.factLabel') }}</span>
        </article>
      </div>
    </section>

    <section class="panel first-aid-panel">
      <div class="education-section-heading">
        <div class="first-aid-icon"><AlertTriangle :size="23" /></div>
        <div><h2>{{ t('truthPage.firstAidTitle') }}</h2><p>{{ t('truthPage.firstAidIntro') }}</p></div>
      </div>
      <div class="first-aid-grid">
        <div>
          <h3>{{ t('truthPage.stepsTitle') }}</h3>
          <ol class="first-aid-steps">
            <li v-for="step in emergencySteps" :key="step">
              <span>{{ step }}</span><p>{{ t(`truthPage.steps.${step}`) }}</p>
            </li>
          </ol>
        </div>
        <aside class="first-aid-aside">
          <img
            class="first-aid-illustration"
            src="/images/first-aid-guide.svg"
            alt=""
            aria-hidden="true"
            width="640"
            height="480"
            loading="lazy"
          >
          <div class="do-not-box">
            <h3>{{ t('truthPage.doNotTitle') }}</h3>
            <ul><li v-for="item in doNotItems" :key="item">{{ t(`truthPage.doNotItems.${item}`) }}</li></ul>
            <p>{{ t('truthPage.emergencyCallout') }}</p>
          </div>
        </aside>
      </div>
      <p class="first-aid-note">{{ t('truthPage.firstAidNote') }}</p>
    </section>

    <section class="truth-resources">
      <div class="education-section-title"><BookOpen :size="23" /><h2>{{ t('truthPage.resourcesTitle') }}</h2></div>
      <div class="truth-resources-grid">
        <article v-for="resource in resources" :key="resource" class="panel">
          <h3>{{ t(`truthPage.resources.${resource}.title`) }}</h3>
          <p>{{ t(`truthPage.resources.${resource}.description`) }}</p>
        </article>
      </div>
      <div class="truth-source-links">
        <a href="https://www.who.int/news-room/fact-sheets/detail/epilepsy" target="_blank" rel="noopener noreferrer">{{ t('truthPage.whoSource') }} <span aria-hidden="true">↗</span></a>
        <a href="https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html" target="_blank" rel="noopener noreferrer">{{ t('truthPage.firstAidSource') }} <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  </div>
</template>
