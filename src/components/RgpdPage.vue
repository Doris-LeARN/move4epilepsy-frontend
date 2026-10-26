<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  AlertTriangle, ClipboardList, HeartPulse, LockKeyhole, Mail, MapPin,
  Search, ShieldCheck, UserRound,
} from 'lucide-vue-next';

const { t } = useI18n();

const principles = computed(() => [
  { title: t('gdpr.principles.lawfulnessTitle'), text: t('gdpr.principles.lawfulnessText') },
  { title: t('gdpr.principles.purposeTitle'), text: t('gdpr.principles.purposeText') },
  { title: t('gdpr.principles.minimizationTitle'), text: t('gdpr.principles.minimizationText') },
  { title: t('gdpr.principles.accuracyTitle'), text: t('gdpr.principles.accuracyText') },
  { title: t('gdpr.principles.retentionTitle'), text: t('gdpr.principles.retentionText') },
  { title: t('gdpr.principles.securityTitle'), text: t('gdpr.principles.securityText') },
]);

const dataCategories = computed(() => [
  { icon: HeartPulse, title: t('gdpr.data.healthTitle'), text: t('gdpr.data.healthText') },
  { icon: MapPin, title: t('gdpr.data.locationTitle'), text: t('gdpr.data.locationText') },
  { icon: UserRound, title: t('gdpr.data.contactTitle'), text: t('gdpr.data.contactText') },
  { icon: ClipboardList, title: t('gdpr.data.contributionTitle'), text: t('gdpr.data.contributionText') },
  { icon: Search, title: t('gdpr.data.technicalTitle'), text: t('gdpr.data.technicalText') },
]);

const rights = computed(() => [
  t('gdpr.rights.access'),
  t('gdpr.rights.rectification'),
  t('gdpr.rights.erasure'),
  t('gdpr.rights.restriction'),
  t('gdpr.rights.objection'),
  t('gdpr.rights.portability'),
  t('gdpr.rights.withdrawal'),
  t('gdpr.rights.complaint'),
]);
</script>

<template>
  <div class="gdpr-page">
    <section class="panel gdpr-intro">
      <div class="gdpr-intro-copy">
        <p class="gdpr-kicker">{{ t('gdpr.eyebrow') }}</p>
        <h2>{{ t('gdpr.introTitle') }}</h2>
        <p>{{ t('gdpr.introText') }}</p>
      </div>
      <img
        class="gdpr-illustration"
        src="/images/privacy-protection.svg"
        :alt="t('gdpr.illustrationAlt')"
        width="520"
        height="390"
      >
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.whatTitle') }}</h2>
        <p>{{ t('gdpr.whatText') }}</p>
      </header>
      <div class="panel gdpr-notice">
        <ShieldCheck :size="20" />
        <p>{{ t('gdpr.scopeNote') }}</p>
      </div>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.whyTitle') }}</h2>
        <p>{{ t('gdpr.whyText') }}</p>
      </header>
      <div class="gdpr-card-grid">
        <article v-for="principle in principles" :key="principle.title" class="panel gdpr-card">
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.text }}</p>
        </article>
      </div>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.dataTitle') }}</h2>
        <p>{{ t('gdpr.dataIntro') }}</p>
      </header>
      <div class="gdpr-data-grid">
        <article v-for="category in dataCategories" :key="category.title" class="panel gdpr-data-card">
          <header><component :is="category.icon" :size="20" /><h3>{{ category.title }}</h3></header>
          <p>{{ category.text }}</p>
        </article>
      </div>
      <div class="panel gdpr-notice">
        <AlertTriangle :size="20" />
        <p>{{ t('gdpr.technicalCaveat') }}</p>
      </div>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.purposesTitle') }}</h2>
        <p>{{ t('gdpr.purposesText') }}</p>
      </header>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.rightsTitle') }}</h2>
        <p>{{ t('gdpr.rightsIntro') }}</p>
      </header>
      <article class="panel">
        <ul class="gdpr-rights-list">
          <li v-for="right in rights" :key="right">{{ right }}</li>
        </ul>
      </article>
      <div class="panel gdpr-notice">
        <LockKeyhole :size="20" />
        <p>{{ t('gdpr.rightsLimit') }}</p>
      </div>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.knownTitle') }}</h2>
        <p>{{ t('gdpr.knownText') }}</p>
      </header>
      <article class="panel gdpr-card">
        <h3>{{ t('gdpr.toConfirmTitle') }}</h3>
        <p>{{ t('gdpr.toConfirmText') }}</p>
      </article>
      <article class="panel gdpr-notice">
        <AlertTriangle :size="20" />
        <p>{{ t('gdpr.disclaimer') }}</p>
      </article>
    </section>

    <section class="gdpr-section">
      <header class="gdpr-section-heading">
        <h2>{{ t('gdpr.implementationTitle') }}</h2>
        <p>{{ t('gdpr.implementationIntro') }}</p>
      </header>
      <div class="gdpr-card-grid">
        <article class="panel gdpr-card">
          <h3>{{ t('gdpr.implementationCurrentTitle') }}</h3>
          <p>{{ t('gdpr.implementationCurrentText') }}</p>
        </article>
        <article class="panel gdpr-card">
          <h3>{{ t('gdpr.implementationPlannedTitle') }}</h3>
          <p>{{ t('gdpr.implementationPlannedText') }}</p>
        </article>
      </div>
    </section>

    <section class="panel gdpr-contact">
      <div>
        <h2>{{ t('gdpr.contactTitle') }}</h2>
        <p>{{ t('gdpr.contactText') }}</p>
      </div>
      <a href="mailto:move4epilepsy@gmail.com?subject=Protection%20des%20donn%C3%A9es">
        <Mail :size="17" /> move4epilepsy@gmail.com
      </a>
    </section>

    <p class="gdpr-source">
      {{ t('gdpr.sourceNote') }}
      <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr" target="_blank" rel="noopener noreferrer">
        {{ t('gdpr.officialText') }}
      </a>
    </p>
  </div>
</template>
