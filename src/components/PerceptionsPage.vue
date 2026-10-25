<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { BarChart3, Brain, CheckCircle, MessageCircle, Send, Users } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

const { t } = useI18n();
const ageRange = ref('');
const relationships = ref<string[]>([]);
const dangerLevel = ref('');
const normalLife = ref('');
const contagious = ref('');
const witnessExperience = ref('');
const suggestions = ref('');
const submitting = ref(false);
const submitError = ref('');
const showSuccess = ref(false);
let successTimer: ReturnType<typeof setTimeout> | undefined;

const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56-65', 'over65'];
const relationshipOptions = ['epileptic', 'closePerson', 'healthProfessional', 'noRelation'];
const dangerOptions = ['veryDangerous', 'moderatelyDangerous', 'slightlyDangerous', 'notDangerous'];
const normalLifeOptions = ['totally', 'withRestrictions', 'partially', 'no'];
const contagiousOptions = ['yes', 'no', 'dontKnow'];
const isValid = computed(() =>
  Boolean(ageRange.value && relationships.value.length > 0 && dangerLevel.value && normalLife.value && contagious.value),
);
const relationshipApiValues: Record<string, string> = {
  epileptic: 'epileptic',
  closePerson: 'close-person',
  healthProfessional: 'health-professional',
  noRelation: 'no-relation',
};
const dangerApiValues: Record<string, string> = {
  veryDangerous: 'very-dangerous',
  moderatelyDangerous: 'moderately-dangerous',
  slightlyDangerous: 'slightly-dangerous',
  notDangerous: 'not-dangerous',
};
const normalLifeApiValues: Record<string, string> = {
  totally: 'totally',
  withRestrictions: 'with-restrictions',
  partially: 'partially',
  no: 'no',
};

function toggleRelationship(value: string) {
  relationships.value = relationships.value.includes(value)
    ? relationships.value.filter((item) => item !== value)
    : [...relationships.value, value];
}

function resetForm() {
  ageRange.value = '';
  relationships.value = [];
  dangerLevel.value = '';
  normalLife.value = '';
  contagious.value = '';
  witnessExperience.value = '';
  suggestions.value = '';
}

async function submitSurvey() {
  if (!isValid.value || submitting.value) return;
  submitting.value = true;
  submitError.value = '';
  showSuccess.value = false;
  try {
    await apiRequest('/epilepsy-perceptions', {
      method: 'POST',
      body: JSON.stringify({
        age_range: ageRange.value === 'over65' ? 'Plus de 65 ans' : `${ageRange.value} ans`,
        relationship_types: relationships.value.map((relationship) => relationshipApiValues[relationship]),
        danger_level: dangerApiValues[dangerLevel.value],
        normal_life: normalLifeApiValues[normalLife.value],
        contagious: contagious.value,
        witness_experience: witnessExperience.value.trim() || null,
        suggestions: suggestions.value.trim() || null,
      }),
    });
    showSuccess.value = true;
    resetForm();
    if (successTimer) clearTimeout(successTimer);
    successTimer = setTimeout(() => { showSuccess.value = false; }, 5000);
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : t('perceptions.submitError');
  } finally {
    submitting.value = false;
  }
}

onUnmounted(() => {
  if (successTimer) clearTimeout(successTimer);
});
</script>

<template>
  <div class="education-page perceptions-page">
    <header class="education-intro panel">
      <div class="round-icon purple"><MessageCircle :size="25" /></div>
      <h2>{{ t('perceptions.title') }}</h2>
      <p>{{ t('perceptions.intro') }}</p>
    </header>

    <section class="perception-impact">
      <h2>{{ t('perceptions.impactTitle') }}</h2>
      <div class="perception-impact-grid">
        <article class="panel"><Users :size="25" /><strong>{{ t('perceptions.impactItems.voice.title') }}</strong><p>{{ t('perceptions.impactItems.voice.description') }}</p></article>
        <article class="panel"><Brain :size="25" /><strong>{{ t('perceptions.impactItems.myths.title') }}</strong><p>{{ t('perceptions.impactItems.myths.description') }}</p></article>
        <article class="panel"><BarChart3 :size="25" /><strong>{{ t('perceptions.impactItems.actions.title') }}</strong><p>{{ t('perceptions.impactItems.actions.description') }}</p></article>
      </div>
    </section>

    <section class="panel perception-form-panel">
      <div class="education-section-heading">
        <div class="round-icon purple"><Brain :size="22" /></div>
        <div><h2>{{ t('perceptions.formTitle') }}</h2><p>{{ t('perceptions.anonymousNote') }}</p></div>
      </div>
      <form class="perception-form" @submit.prevent="submitSurvey">
        <fieldset>
          <legend><Users :size="19" />{{ t('perceptions.generalInfo') }}</legend>
          <label class="perception-field">
            {{ t('perceptions.ageLabel') }}
            <select v-model="ageRange" required>
              <option value="">{{ t('perceptions.selectAge') }}</option>
              <option v-for="range in ageRanges" :key="range" :value="range">{{ t(`perceptions.ageRanges.${range}`) }}</option>
            </select>
          </label>
          <div class="perception-field">
            <span>{{ t('perceptions.relationshipLabel') }}</span>
            <label v-for="option in relationshipOptions" :key="option" class="choice-row">
              <input type="checkbox" :checked="relationships.includes(option)" @change="toggleRelationship(option)">
              <span>{{ t(`perceptions.relationships.${option}`) }}</span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend><Brain :size="19" />{{ t('perceptions.opinionsTitle') }}</legend>
          <div class="perception-question">
            <p>{{ t('perceptions.dangerQuestion') }}</p>
            <div class="choice-grid">
              <label v-for="option in dangerOptions" :key="option" class="choice-card">
                <input v-model="dangerLevel" type="radio" name="dangerLevel" :value="option" required>
                <span>{{ t(`perceptions.dangerOptions.${option}`) }}</span>
              </label>
            </div>
          </div>
          <div class="perception-question">
            <p>{{ t('perceptions.normalLifeQuestion') }}</p>
            <div class="choice-grid">
              <label v-for="option in normalLifeOptions" :key="option" class="choice-card">
                <input v-model="normalLife" type="radio" name="normalLife" :value="option" required>
                <span>{{ t(`perceptions.normalLifeOptions.${option}`) }}</span>
              </label>
            </div>
          </div>
          <div class="perception-question">
            <p>{{ t('perceptions.contagiousQuestion') }}</p>
            <div class="choice-grid three-columns">
              <label v-for="option in contagiousOptions" :key="option" class="choice-card">
                <input v-model="contagious" type="radio" name="contagious" :value="option" required>
                <span>{{ t(`perceptions.contagiousOptions.${option}`) }}</span>
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>{{ t('perceptions.experienceTitle') }}</legend>
          <label class="perception-field">
            {{ t('perceptions.experienceQuestion') }}
            <textarea v-model="witnessExperience" rows="4" :placeholder="t('perceptions.experiencePlaceholder')"></textarea>
            <small>{{ t('perceptions.optionalNote') }}</small>
          </label>
        </fieldset>

        <fieldset>
          <legend>{{ t('perceptions.suggestionsTitle') }}</legend>
          <label class="perception-field">
            {{ t('perceptions.suggestionsQuestion') }}
            <textarea v-model="suggestions" rows="4" :placeholder="t('perceptions.suggestionsPlaceholder')"></textarea>
          </label>
        </fieldset>

        <p v-if="submitError" class="form-alert error-alert" role="alert">{{ submitError }}</p>
        <div v-if="showSuccess" class="form-alert success-alert perception-success" role="status">
          <CheckCircle :size="22" />
          <div><strong>{{ t('perceptions.successTitle') }}</strong><p>{{ t('perceptions.successMessage') }}</p></div>
        </div>
        <div class="perception-submit">
          <button class="button button-primary" type="submit" :disabled="!isValid || submitting">
            <Send :size="17" />{{ submitting ? t('perceptions.submitting') : t('perceptions.submit') }}
          </button>
          <p v-if="!isValid && !submitting">{{ t('perceptions.requiredHint') }}</p>
        </div>
      </form>
    </section>

    <section class="panel perception-research">
      <h2>{{ t('perceptions.researchTitle') }}</h2>
      <div class="perception-research-grid">
        <article><h3>{{ t('perceptions.recentFindingsTitle') }}</h3><ul><li v-for="index in 4" :key="index">{{ t(`perceptions.recentFindings.${index}`) }}</li></ul></article>
        <article><h3>{{ t('perceptions.positiveChangeTitle') }}</h3><ul><li v-for="index in 4" :key="index">{{ t(`perceptions.positiveChanges.${index}`) }}</li></ul></article>
      </div>
    </section>

    <aside class="perception-purpose">
      <h2>{{ t('perceptions.whyTitle') }}</h2>
      <ul><li v-for="index in 6" :key="index">{{ t(`perceptions.whyItems.${index}`) }}</li></ul>
    </aside>
  </div>
</template>
