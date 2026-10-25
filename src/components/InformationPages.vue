<script setup lang="ts">
import { computed, type Component } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ArrowRight, BookOpen, Heart, Lightbulb, Mail, MapPin, Phone, Pill, Shield, Users,
} from 'lucide-vue-next';
import type { PageId } from '../router/routes';

const props = defineProps<{ page: PageId }>();
const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();

const cardCounts: Partial<Record<PageId, number>> = {
  about: 4,
  awareness: 3,
  medication: 3,
  resources: 4,
  rights: 4,
  team: 4,
};

const cards = computed(() => Array.from({ length: cardCounts[props.page] ?? 0 }, (_, index) => {
  const key = `${index + 1}`;
  return {
    key,
    title: t(`contentPages.${props.page}.cards.${key}.title`),
    description: t(`contentPages.${props.page}.cards.${key}.description`),
  };
}));

const values = computed(() => ['empathy', 'accuracy', 'accessibility', 'innovation'].map((key) => ({
  key,
  title: t(`contentPages.about.values.${key}.title`),
  description: t(`contentPages.about.values.${key}.description`),
})));

const milestones = computed(() => ['2023', '2024', '2025', 'future'].map((key) => ({
  key,
  title: t(`contentPages.about.milestones.${key}.title`),
  description: t(`contentPages.about.milestones.${key}.description`),
})));

const pageIcons: Partial<Record<PageId, Component>> = {
  awareness: Lightbulb,
  medication: Pill,
  resources: BookOpen,
  rights: Shield,
  team: Users,
  contact: Mail,
  about: Heart,
};
const pageIcon = computed(() => pageIcons[props.page] ?? BookOpen);
</script>

<template>
  <div class="information-page">
    <section class="panel information-intro" :class="{ 'awareness-intro': page === 'awareness' }">
      <div class="information-intro-copy">
        <span class="round-icon purple"><component :is="pageIcon" :size="24" /></span>
        <h2>{{ t(`contentPages.${page}.title`) }}</h2>
        <p>{{ t(`contentPages.${page}.intro`) }}</p>
      </div>
      <figure v-if="page === 'awareness'" class="awareness-visual">
        <img
          src="/images/community-health-session.jpg"
          :alt="t('contentPages.awareness.imageAlt')"
          width="960"
          height="720"
        >
        <figcaption>
          <a
            href="https://commons.wikimedia.org/wiki/File:Women_from_Community_Health_Program_(6096681680).jpg"
            target="_blank"
            rel="noopener noreferrer"
          >{{ t('contentPages.awareness.imageCredit') }}</a>
        </figcaption>
      </figure>
    </section>

    <template v-if="page === 'about'">
      <section class="panel information-feature">
        <h2>{{ t('contentPages.about.missionTitle') }}</h2>
        <p>{{ t('contentPages.about.mission') }}</p>
        <h3>{{ t('contentPages.about.objectivesTitle') }}</h3>
        <ul><li v-for="index in 3" :key="index">{{ t(`contentPages.about.objectives.${index}`) }}</li></ul>
      </section>
      <section>
        <div class="education-section-title"><Heart :size="22" /><h2>{{ t('contentPages.about.valuesTitle') }}</h2></div>
        <div class="information-grid">
          <article v-for="value in values" :key="value.key" class="panel information-card">
            <h3>{{ value.title }}</h3><p>{{ value.description }}</p>
          </article>
        </div>
      </section>
      <section>
        <div class="education-section-title"><MapPin :size="22" /><h2>{{ t('contentPages.about.journeyTitle') }}</h2></div>
        <ol class="information-timeline">
          <li v-for="milestone in milestones" :key="milestone.key">
            <span>{{ milestone.key === 'future' ? t('contentPages.about.future') : milestone.key }}</span>
            <div><h3>{{ milestone.title }}</h3><p>{{ milestone.description }}</p></div>
          </li>
        </ol>
      </section>
    </template>

    <template v-else-if="page === 'awareness'">
      <section class="information-grid">
        <article v-for="card in cards" :key="card.key" class="panel information-card">
          <Lightbulb :size="22" /><h3>{{ card.title }}</h3><p>{{ card.description }}</p>
        </article>
      </section>
      <section class="panel information-feature">
        <h2>{{ t('contentPages.awareness.quickActionsTitle') }}</h2>
        <p>{{ t('contentPages.awareness.quickActionsDescription') }}</p>
        <div class="information-actions">
          <button class="button button-primary" @click="emit('navigate', 'epilepsy-perceptions')">{{ t('navigation.perceptions') }} <ArrowRight :size="16" /></button>
          <button class="button button-white" @click="emit('navigate', 'truth')">{{ t('navigation.truth') }} <ArrowRight :size="16" /></button>
        </div>
      </section>
      <section>
        <div class="education-section-title"><BookOpen :size="22" /><h2>{{ t('contentPages.awareness.resourcesTitle') }}</h2></div>
        <div class="information-grid">
          <article v-for="index in 3" :key="index" class="panel information-card">
            <h3>{{ t(`contentPages.awareness.resources.${index}.title`) }}</h3>
            <p>{{ t(`contentPages.awareness.resources.${index}.description`) }}</p>
            <button class="text-link-button" @click="emit('navigate', index === 1 ? 'truth' : 'resources')">{{ t('contentPages.learnMore') }} <ArrowRight :size="15" /></button>
          </article>
        </div>
      </section>
    </template>

    <template v-else-if="page === 'resources'">
      <section>
        <div class="education-section-title"><BookOpen :size="22" /><h2>{{ t('contentPages.resources.onlineTitle') }}</h2></div>
        <div class="information-grid">
          <article v-for="resource in cards" :key="resource.key" class="panel information-card">
            <h3>{{ resource.title }}</h3><p>{{ resource.description }}</p>
            <a
              v-if="resource.key === '1'"
              href="https://www.who.int/news-room/fact-sheets/detail/epilepsy"
              target="_blank" rel="noopener noreferrer"
            >{{ t('contentPages.resources.openResource') }} <ArrowRight :size="15" /></a>
            <a
              v-else-if="resource.key === '2'"
              href="https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html"
              target="_blank" rel="noopener noreferrer"
            >{{ t('contentPages.resources.openResource') }} <ArrowRight :size="15" /></a>
            <a
              v-else-if="resource.key === '3'"
              href="https://www.epilepsy.com/"
              target="_blank" rel="noopener noreferrer"
            >{{ t('contentPages.resources.openResource') }} <ArrowRight :size="15" /></a>
          </article>
        </div>
      </section>
      <aside class="form-alert">{{ t('contentPages.resources.downloadNotice') }}</aside>
    </template>

    <template v-else-if="page === 'rights'">
      <section>
        <div class="education-section-title"><Shield :size="22" /><h2>{{ t('contentPages.rights.fundamentalTitle') }}</h2></div>
        <div class="information-grid">
          <article v-for="card in cards" :key="card.key" class="panel information-card">
            <Shield :size="21" /><h3>{{ card.title }}</h3><p>{{ card.description }}</p>
          </article>
        </div>
      </section>
      <section class="panel information-feature">
        <h2>{{ t('contentPages.rights.stepsTitle') }}</h2>
        <ol><li v-for="index in 4" :key="index">{{ t(`contentPages.rights.steps.${index}`) }}</li></ol>
      </section>
      <aside class="form-alert">{{ t('contentPages.rights.disclaimer') }}</aside>
    </template>

    <template v-else-if="page === 'medication'">
      <section>
        <div class="education-section-title"><Pill :size="22" /><h2>{{ t('contentPages.medication.categoriesTitle') }}</h2></div>
        <div class="information-grid">
          <article v-for="card in cards" :key="card.key" class="panel information-card">
            <Pill :size="21" /><h3>{{ card.title }}</h3><p>{{ card.description }}</p>
          </article>
        </div>
      </section>
      <aside class="form-alert error-alert">{{ t('contentPages.medication.warning') }}</aside>
      <div class="information-actions">
        <button class="button button-primary" @click="emit('navigate', 'medication-registration')">{{ t('navigation.myTreatment') }} <ArrowRight :size="16" /></button>
        <button class="button button-white" @click="emit('navigate', 'trends')">{{ t('navigation.trends') }} <ArrowRight :size="16" /></button>
      </div>
    </template>

    <template v-else-if="page === 'team'">
      <section class="information-grid">
        <article v-for="card in cards" :key="card.key" class="panel information-card team-area-card">
          <Users :size="22" /><h3>{{ card.title }}</h3><p>{{ card.description }}</p>
        </article>
      </section>
      <section class="panel information-feature">
        <h2>{{ t('contentPages.team.joinTitle') }}</h2>
        <p>{{ t('contentPages.team.joinDescription') }}</p>
        <a class="button button-primary" href="mailto:move4epilepsy@gmail.com">{{ t('contentPages.team.contact') }} <Mail :size="16" /></a>
      </section>
    </template>

    <template v-else-if="page === 'contact'">
      <section class="information-contact-grid">
        <article class="panel information-card"><Mail :size="24" /><h3>{{ t('contentPages.contact.emailTitle') }}</h3><a href="mailto:move4epilepsy@gmail.com">move4epilepsy@gmail.com</a></article>
        <article class="panel information-card"><Phone :size="24" /><h3>{{ t('contentPages.contact.phoneTitle') }}</h3><a href="tel:+2290197154241">+229 01 97 15 42 41</a></article>
        <article class="panel information-card"><MapPin :size="24" /><h3>{{ t('contentPages.contact.addressTitle') }}</h3><p>Abomey-Calavi, Bénin</p></article>
      </section>
      <aside class="form-alert">{{ t('contentPages.contact.emergencyNote') }}</aside>
    </template>
  </div>
</template>
