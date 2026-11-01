<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeft, CheckCircle, Send } from 'lucide-vue-next';
import { apiRequest } from '../services/api';
import { medications } from '../data/medications';

type SubmissionPage = 'partner' | 'medicine-report' | 'medication-registration';
const medicationCategoryIds = [
  'antiepileptiques',
  'antidepresseurs',
  'anxiolytiques',
  'antipsychotiques',
] as const;
type MedicationCategoryId = typeof medicationCategoryIds[number];
const unlistedMedicationPrefix = 'unlisted:';
const unknownMedicationCategoryValue = `${unlistedMedicationPrefix}unknown`;
const props = defineProps<{ page: SubmissionPage }>();
const { t } = useI18n();
const submitting = ref(false);
const error = ref('');
const success = ref(false);
const submittedUnlistedMedication = ref(false);
const reviewing = ref(false);
const customMedicationName = ref('');
const medicationSearch = ref('');
const contactEmail = ref('');
const emailCode = ref('');
const emailVerificationToken = ref('');
const emailVerificationSent = ref(false);
const emailVerified = ref(false);
const consentAnalysis = ref(false);
const monthlyCostNotReported = ref(false);
const unitPriceNotReported = ref(false);
const minimumSalaryNotReported = ref(false);
const consentTextVersion = 'v3';
const treatment = reactive({
  age: '',
  sex: '',
  location: '',
  medication_name: '',
  medication_country: '',
  dosage: '',
  frequency: '',
  treatment_duration: '',
  treatment_start_date: '',
  treatment_end_date: '',
  treatment_is_ongoing: null as boolean | null,
  monthly_cost: '',
  unit_price: '',
  access_ease: '',
  effectiveness: '' as number | '',
  side_effects: '',
  difficulties: '',
  additional_comments: '',
  found_medication: '',
  pharmacies_visited: '',
  waiting_time: '',
  stockout_frequency: '',
  wants_alert: null as boolean | null,
  morning_pills: '',
  noon_pills: '',
  evening_pills: '',
  education_level: '',
  minimum_salary: '',
  employment_status: '',
  has_financial_resources: '',
  emotional_impact: '',
  social_stigma: '',
  professional_impact: '',
  social_support: '',
  access_barrier: '',
  cost_related_treatment_change: '',
  discrimination_context: '',
  rights_support_need: '',
  has_alternative_medication: null as boolean | null,
  alternative_medication_name: '',
  knows_restock_delay: null as boolean | null,
  is_restock_delay_precise: null as boolean | null,
  restock_delay_precise: '',
  action_when_delay_unknown: '',
});
const partnership = reactive({
  organization_type: '',
  organization_name: '',
  contact_person: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  city: '',
  postal_code: '',
  description: '',
  partnership_types: [] as string[],
  resources: '',
  experience: '',
  motivation: '',
});
const report = reactive({
  medicament: '',
  pharmacy_name: '',
  address: '',
  city: '',
  postal_code: '',
  price: '',
  quantity_status: '',
  reporter_name: '',
  reporter_phone: '',
});

const title = computed(() => t(`publicSubmission.${props.page}.title`));
const formDescription = computed(() => t(`publicSubmission.${props.page}.description`));
const partnershipKinds = ['health', 'data', 'financial', 'communication', 'other'];
const filteredMedications = computed(() => {
  const query = medicationSearch.value.trim().toLocaleLowerCase();
  return medications
    .map((medication, index) => ({ medication, index }))
    .filter(({ medication }) => medication.toLocaleLowerCase().includes(query));
});
const isUnlistedMedication = computed(() => treatment.medication_name.startsWith(unlistedMedicationPrefix));
const selectedMedicationCategoryId = computed<MedicationCategoryId | null>(() => {
  if (treatment.medication_name.startsWith(unlistedMedicationPrefix)) {
    const categoryId = treatment.medication_name.slice(unlistedMedicationPrefix.length);
    return medicationCategoryIds.find((knownCategory) => knownCategory === categoryId) ?? null;
  }
  return treatment.medication_name.startsWith('catalog:') ? 'antiepileptiques' : null;
});
const successMessage = computed(() => (
  props.page === 'medication-registration' && submittedUnlistedMedication.value
    ? t('publicSubmission.unlistedSuccess')
    : t(`publicSubmission.${props.page}.success`)
));

watch(() => treatment.medication_name, () => {
  customMedicationName.value = '';
});

watch(contactEmail, () => {
  emailCode.value = '';
  emailVerificationToken.value = '';
  emailVerificationSent.value = false;
  emailVerified.value = false;
});

function requiredNumericResponse(value: string, notReported: boolean) {
  return notReported ? 'prefer-not-to-say' : String(Number(value));
}

function dateTimeResponse(value: string) {
  return value ? `${value}T00:00:00` : null;
}

function selectedMedicationName() {
  if (isUnlistedMedication.value) return customMedicationName.value.trim();
  if (!treatment.medication_name.startsWith('catalog:')) return '';
  const medicationIndex = Number(treatment.medication_name.slice('catalog:'.length));
  return medications[medicationIndex] || '';
}

function goToReview() {
  reviewing.value = true;
  error.value = '';
}

function resetForms() {
  if (props.page === 'partner') Object.assign(partnership, {
    organization_type: '', organization_name: '', contact_person: '', email: '', phone: '',
    website: '', address: '', city: '', postal_code: '', description: '',
    partnership_types: [], resources: '', experience: '', motivation: '',
  });
  if (props.page === 'medicine-report') Object.assign(report, {
    medicament: '', pharmacy_name: '', address: '', city: '', postal_code: '',
    price: '', quantity_status: '', reporter_name: '', reporter_phone: '',
  });
  if (props.page === 'medication-registration') Object.assign(treatment, {
    age: '', sex: '', location: '',
    medication_name: '', medication_country: '', dosage: '', frequency: '',
    treatment_duration: '', treatment_start_date: '', treatment_end_date: '',
    treatment_is_ongoing: null, monthly_cost: '', unit_price: '', access_ease: '',
    effectiveness: '', side_effects: '', difficulties: '', additional_comments: '',
    found_medication: '', pharmacies_visited: '', waiting_time: '', stockout_frequency: '',
    wants_alert: null, morning_pills: '', noon_pills: '', evening_pills: '', education_level: '',
    minimum_salary: '', employment_status: '', has_financial_resources: '',
    emotional_impact: '', social_stigma: '', professional_impact: '',
    social_support: '', access_barrier: '', cost_related_treatment_change: '',
    discrimination_context: '', rights_support_need: '',
    has_alternative_medication: null, alternative_medication_name: '', knows_restock_delay: null,
    is_restock_delay_precise: null, restock_delay_precise: '', action_when_delay_unknown: '',
  });
  if (props.page === 'medication-registration') customMedicationName.value = '';
  if (props.page === 'medication-registration') {
    medicationSearch.value = '';
    monthlyCostNotReported.value = false;
    unitPriceNotReported.value = false;
    minimumSalaryNotReported.value = false;
  }
  if (props.page === 'medication-registration') {
    contactEmail.value = '';
    consentAnalysis.value = false;
  }
}

async function requestTreatmentEmailCode() {
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  try {
    await apiRequest('/patients/treatments/email-verification/request', {
      method: 'POST',
      body: JSON.stringify({ email: contactEmail.value, purpose: 'registration' }),
    });
    emailVerificationSent.value = true;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('publicSubmission.emailVerificationError');
  } finally {
    submitting.value = false;
  }
}

async function confirmTreatmentEmail() {
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  try {
    const result = await apiRequest<{ verification_token: string }>(
      '/patients/treatments/email-verification/confirm',
      {
        method: 'POST',
        body: JSON.stringify({
          email: contactEmail.value,
          purpose: 'registration',
          code: emailCode.value.trim(),
        }),
      },
    );
    emailVerificationToken.value = result.verification_token;
    emailVerified.value = true;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('publicSubmission.emailVerificationError');
  } finally {
    submitting.value = false;
  }
}

async function submitTreatment() {
  if (submitting.value) return;
  if (!emailVerified.value || !emailVerificationToken.value) {
    error.value = t('publicSubmission.verifyEmailFirst');
    return;
  }
  submitting.value = true;
  error.value = '';
  success.value = false;

  try {
    const consent = await apiRequest<{ consent_draft_token: string }>(
      '/patients/treatments/consent',
      {
        method: 'POST',
        body: JSON.stringify({
          email: contactEmail.value,
          email_verification_token: emailVerificationToken.value,
          consent_analysis: consentAnalysis.value,
          consent_alerts: treatment.wants_alert,
          consent_text_version: consentTextVersion,
        }),
      },
    );

    const payload = {
      ...treatment,
      medication_name: selectedMedicationName(),
      medication_category_id: selectedMedicationCategoryId.value,
      medication_is_unlisted: isUnlistedMedication.value,
      medication_country: isUnlistedMedication.value ? treatment.medication_country.trim() : null,
      age: Number(treatment.age),
      treatment_duration: Number(treatment.treatment_duration),
      treatment_start_date: dateTimeResponse(treatment.treatment_start_date),
      treatment_end_date: treatment.treatment_is_ongoing ? null : dateTimeResponse(treatment.treatment_end_date),
      treatment_is_ongoing: treatment.treatment_is_ongoing,
      effectiveness: Number(treatment.effectiveness),
      monthly_cost: requiredNumericResponse(treatment.monthly_cost, monthlyCostNotReported.value),
      unit_price: requiredNumericResponse(treatment.unit_price, unitPriceNotReported.value),
      pharmacies_visited: String(Number(treatment.pharmacies_visited)),
      minimum_salary: requiredNumericResponse(treatment.minimum_salary, minimumSalaryNotReported.value),
      found_medication: treatment.found_medication,
      waiting_time: treatment.waiting_time,
      stockout_frequency: treatment.stockout_frequency,
      education_level: treatment.education_level,
      employment_status: treatment.employment_status,
      has_financial_resources: treatment.has_financial_resources,
      emotional_impact: treatment.emotional_impact,
      social_stigma: treatment.social_stigma,
      professional_impact: treatment.professional_impact,
      social_support: treatment.social_support,
      access_barrier: treatment.access_barrier,
      cost_related_treatment_change: treatment.cost_related_treatment_change,
      discrimination_context: treatment.discrimination_context,
      rights_support_need: treatment.rights_support_need,
      morning_pills: String(Number(treatment.morning_pills)),
      noon_pills: String(Number(treatment.noon_pills)),
      evening_pills: String(Number(treatment.evening_pills)),
      has_alternative_medication: treatment.has_alternative_medication,
      alternative_medication_name: treatment.has_alternative_medication
        ? treatment.alternative_medication_name || null
        : null,
      knows_restock_delay: treatment.knows_restock_delay,
      is_restock_delay_precise: treatment.knows_restock_delay ? treatment.is_restock_delay_precise : null,
      restock_delay_precise: treatment.knows_restock_delay && treatment.is_restock_delay_precise
        ? treatment.restock_delay_precise || null
        : null,
      action_when_delay_unknown: !treatment.knows_restock_delay || !treatment.is_restock_delay_precise
        ? treatment.action_when_delay_unknown
        : null,
      email: contactEmail.value,
      email_verification_token: emailVerificationToken.value,
      consent_draft_token: consent.consent_draft_token,
    };

    const result = await apiRequest<{
      unlisted_medication_submission?: { status: string } | null;
    }>('/patients/treatments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    submittedUnlistedMedication.value = result?.unlisted_medication_submission?.status === 'pending_validation';
    success.value = true;
    reviewing.value = false;
    resetForms();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('publicSubmission.submitError');
  } finally {
    submitting.value = false;
  }
}

async function submit() {
  if (props.page === 'medication-registration') {
    await submitTreatment();
    return;
  }
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  success.value = false;
  let endpoint = '';
  let payload: Record<string, unknown>;

  if (props.page === 'partner') {
    endpoint = '/partnerships';
    payload = { ...partnership };
  } else if (props.page === 'medicine-report') {
    endpoint = '/medicine-reports';
    payload = {
      ...report,
      price: report.price ? Number(report.price) : null,
    };
  } else {
    endpoint = '/patients/treatments';
    payload = {
      ...treatment,
      medication_name: selectedMedicationName(),
      medication_category_id: selectedMedicationCategoryId.value,
      medication_is_unlisted: isUnlistedMedication.value,
      medication_country: isUnlistedMedication.value ? treatment.medication_country.trim() : null,
      age: Number(treatment.age),
      treatment_duration: Number(treatment.treatment_duration),
      treatment_start_date: dateTimeResponse(treatment.treatment_start_date),
      treatment_end_date: treatment.treatment_is_ongoing ? null : dateTimeResponse(treatment.treatment_end_date),
      treatment_is_ongoing: treatment.treatment_is_ongoing,
      effectiveness: Number(treatment.effectiveness),
      monthly_cost: requiredNumericResponse(treatment.monthly_cost, monthlyCostNotReported.value),
      unit_price: requiredNumericResponse(treatment.unit_price, unitPriceNotReported.value),
      pharmacies_visited: String(Number(treatment.pharmacies_visited)),
      minimum_salary: requiredNumericResponse(treatment.minimum_salary, minimumSalaryNotReported.value),
      wants_alert: treatment.wants_alert,
      has_alternative_medication: treatment.has_alternative_medication,
      alternative_medication_name: treatment.has_alternative_medication
        ? treatment.alternative_medication_name || null
        : null,
      knows_restock_delay: treatment.knows_restock_delay,
      is_restock_delay_precise: treatment.knows_restock_delay ? treatment.is_restock_delay_precise : null,
      restock_delay_precise: treatment.knows_restock_delay && treatment.is_restock_delay_precise
        ? treatment.restock_delay_precise || null
        : null,
      action_when_delay_unknown: !treatment.knows_restock_delay || !treatment.is_restock_delay_precise
        ? treatment.action_when_delay_unknown
        : null,
      morning_pills: String(Number(treatment.morning_pills)),
      noon_pills: String(Number(treatment.noon_pills)),
      evening_pills: String(Number(treatment.evening_pills)),
    };
  }

  try {
    await apiRequest(endpoint, { method: 'POST', body: JSON.stringify(payload) });
    success.value = true;
    reviewing.value = false;
    resetForms();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('publicSubmission.submitError');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="panel public-submission-page">
    <div class="public-submission-heading">
      <h2>{{ title }}</h2>
      <p>{{ formDescription }}</p>
    </div>

    <div v-if="success" class="submission-success" role="status">
      <CheckCircle :size="26" />
      <p>{{ successMessage }}</p>
      <button class="button button-white" type="button" @click="success = false">{{ t('publicSubmission.sendAnother') }}</button>
    </div>

    <template v-else-if="page === 'partner'">
      <form class="public-submission-form" @submit.prevent="submit">
        <div class="form-grid">
          <label>{{ t('publicSubmission.organizationType') }}<select v-model="partnership.organization_type" required><option value="">{{ t('publicSubmission.choose') }}</option><option v-for="kind in partnershipKinds" :key="kind" :value="kind">{{ t(`publicSubmission.partnershipKinds.${kind}`) }}</option></select></label>
          <label>{{ t('publicSubmission.organizationName') }}<input v-model="partnership.organization_name" required maxlength="160"></label>
          <label>{{ t('publicSubmission.contactPerson') }}<input v-model="partnership.contact_person" required maxlength="160"></label>
          <label>{{ t('publicSubmission.email') }}<input v-model="partnership.email" type="email" required autocomplete="email"></label>
          <label>{{ t('publicSubmission.phone') }}<input v-model="partnership.phone" type="tel" autocomplete="tel"></label>
          <label>{{ t('publicSubmission.website') }}<input v-model="partnership.website" type="url"></label>
          <label>{{ t('publicSubmission.address') }}<input v-model="partnership.address" required></label>
          <label>{{ t('publicSubmission.city') }}<input v-model="partnership.city" required></label>
          <label>{{ t('publicSubmission.postalCode') }}<input v-model="partnership.postal_code"></label>
          <fieldset class="form-wide partnership-types">
            <legend>{{ t('publicSubmission.partnershipTypes') }}</legend>
            <label v-for="kind in partnershipKinds" :key="kind"><input v-model="partnership.partnership_types" type="checkbox" :value="kind">{{ t(`publicSubmission.partnershipKinds.${kind}`) }}</label>
          </fieldset>
          <label class="form-wide">{{ t('publicSubmission.descriptionLabel') }}<textarea v-model="partnership.description" rows="3"></textarea></label>
          <label>{{ t('publicSubmission.resourcesLabel') }}<textarea v-model="partnership.resources" rows="3"></textarea></label>
          <label>{{ t('publicSubmission.experience') }}<textarea v-model="partnership.experience" rows="3"></textarea></label>
          <label class="form-wide">{{ t('publicSubmission.motivation') }}<textarea v-model="partnership.motivation" rows="3"></textarea></label>
        </div>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <button class="button button-primary" type="submit" :disabled="submitting">{{ submitting ? t('publicSubmission.sending') : t('publicSubmission.submit') }} <Send :size="16" /></button>
      </form>
    </template>

    <template v-else-if="page === 'medicine-report'">
      <form class="public-submission-form" @submit.prevent="submit">
        <div class="form-grid">
          <label>{{ t('publicSubmission.medication') }}<input v-model="report.medicament" required></label>
          <label>{{ t('publicSubmission.pharmacyName') }}<input v-model="report.pharmacy_name" required></label>
          <label>{{ t('publicSubmission.address') }}<input v-model="report.address" required></label>
          <label>{{ t('publicSubmission.city') }}<input v-model="report.city" required></label>
          <label>{{ t('publicSubmission.postalCode') }}<input v-model="report.postal_code"></label>
          <label>{{ t('publicSubmission.price') }}<input v-model="report.price" type="number" min="0" step="0.01"></label>
          <label>{{ t('publicSubmission.quantityStatus') }}<select v-model="report.quantity_status" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="available">{{ t('publicSubmission.status.available') }}</option><option value="limited">{{ t('publicSubmission.status.limited') }}</option><option value="out-of-stock">{{ t('publicSubmission.status.outOfStock') }}</option></select></label>
          <label>{{ t('publicSubmission.reporterName') }}<input v-model="report.reporter_name" required></label>
          <label>{{ t('publicSubmission.reporterPhone') }}<input v-model="report.reporter_phone" type="tel" required></label>
        </div>
        <p class="form-alert">{{ t('publicSubmission.reportNote') }}</p>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <button class="button button-primary" type="submit" :disabled="submitting">{{ submitting ? t('publicSubmission.sending') : t('publicSubmission.submit') }} <Send :size="16" /></button>
      </form>
    </template>

    <template v-else-if="!reviewing">
      <form class="public-submission-form treatment-survey" @submit.prevent="goToReview">
        <fieldset>
          <legend>{{ t('publicSubmission.sections.personal') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.age') }}<input v-model="treatment.age" type="number" min="1" max="120" required></label>
            <label>{{ t('publicSubmission.sex') }}<select v-model="treatment.sex" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="homme">{{ t('publicSubmission.sexOptions.male') }}</option><option value="femme">{{ t('publicSubmission.sexOptions.female') }}</option><option value="autre">{{ t('publicSubmission.sexOptions.other') }}</option><option value="non-specifie">{{ t('publicSubmission.sexOptions.unspecified') }}</option></select></label>
            <label>{{ t('publicSubmission.location') }}<input v-model="treatment.location" required></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.treatment') }}</legend>
          <div class="form-grid">
            <p class="form-section-note form-wide">{{ t('publicSubmission.medicationChoiceHelp') }}</p>
            <label class="form-wide">
              {{ t('publicSubmission.searchMedication') }}
              <input v-model="medicationSearch" type="search" autocomplete="off">
            </label>
            <p v-if="!filteredMedications.length && medicationSearch.trim()" class="form-section-note form-wide">
              {{ t('publicSubmission.medicationSearchNoResults') }}
            </p>
            <label>
              {{ t('publicSubmission.medication') }}
              <select v-model="treatment.medication_name" required>
                <option value="" disabled>{{ t('publicSubmission.choose') }}</option>
                <optgroup
                  v-for="category in medicationCategoryIds"
                  :key="category"
                  :label="t(`publicSubmission.medicationCategories.${category}`)"
                >
                  <option
                    v-for="entry in category === 'antiepileptiques' ? filteredMedications : []"
                    :key="entry.index"
                    :value="`catalog:${entry.index}`"
                  >{{ entry.medication }}</option>
                  <option :value="`${unlistedMedicationPrefix}${category}`">
                    {{ t('publicSubmission.otherMedication') }}
                  </option>
                </optgroup>
                <optgroup :label="t('publicSubmission.medicationCategories.unknown')">
                  <option :value="unknownMedicationCategoryValue">
                    {{ t('publicSubmission.medicationCategories.unknownOption') }}
                  </option>
                </optgroup>
              </select>
            </label>
            <p class="form-section-note form-wide">{{ t('publicSubmission.noListedMedication') }}</p>
            <p v-if="selectedMedicationCategoryId === 'antiepileptiques' && !isUnlistedMedication" class="form-section-note form-wide">
              {{ t('publicSubmission.provisionalCatalogueNote') }}
            </p>
            <label v-if="isUnlistedMedication">
              {{ t('publicSubmission.customMedicationName') }}
              <input v-model.trim="customMedicationName" maxlength="255" required>
            </label>
            <label v-if="isUnlistedMedication">
              {{ t('publicSubmission.medicationCountry') }}
              <input v-model.trim="treatment.medication_country" maxlength="100" required>
            </label>
            <label>{{ t('publicSubmission.dosage') }}<input v-model="treatment.dosage" required></label>
            <label>{{ t('publicSubmission.frequency') }}<input v-model="treatment.frequency" required></label>
            <label>{{ t('publicSubmission.duration') }}<input v-model="treatment.treatment_duration" type="number" min="1" required></label>
            <label>{{ t('publicSubmission.startDate') }}<input v-model="treatment.treatment_start_date" type="date" required></label>
            <label>{{ t('publicSubmission.ongoing') }}<select v-model="treatment.treatment_is_ongoing" required><option :value="null">{{ t('publicSubmission.choose') }}</option><option :value="true">{{ t('publicSubmission.yes') }}</option><option :value="false">{{ t('publicSubmission.no') }}</option></select></label>
            <label>{{ t('publicSubmission.endDate') }}<input v-model="treatment.treatment_end_date" type="date" :disabled="treatment.treatment_is_ongoing !== false" :required="treatment.treatment_is_ongoing === false"></label>
            <label>{{ t('publicSubmission.wantsAlert') }}<select v-model="treatment.wants_alert" required><option :value="null">{{ t('publicSubmission.choose') }}</option><option :value="true">{{ t('publicSubmission.yes') }}</option><option :value="false">{{ t('publicSubmission.no') }}</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.access') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.accessEase') }}<select v-model="treatment.access_ease" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="easy">{{ t('publicSubmission.accessOptions.easy') }}</option><option value="difficult">{{ t('publicSubmission.accessOptions.difficult') }}</option><option value="very-difficult">{{ t('publicSubmission.accessOptions.veryDifficult') }}</option></select></label>
            <label>{{ t('publicSubmission.monthlyCost') }}<input v-model="treatment.monthly_cost" type="number" min="0" step="0.01" :required="!monthlyCostNotReported" :disabled="monthlyCostNotReported"></label>
            <label class="check-field"><input v-model="monthlyCostNotReported" type="checkbox">{{ t('publicSubmission.amountNotReported') }}</label>
            <label>{{ t('publicSubmission.unitPrice') }}<input v-model="treatment.unit_price" type="number" min="0" step="0.01" :required="!unitPriceNotReported" :disabled="unitPriceNotReported"></label>
            <label class="check-field"><input v-model="unitPriceNotReported" type="checkbox">{{ t('publicSubmission.amountNotReported') }}</label>
            <label>{{ t('publicSubmission.foundMedication') }}<select v-model="treatment.found_medication" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="yes">{{ t('publicSubmission.yes') }}</option><option value="no">{{ t('publicSubmission.no') }}</option><option value="partially">{{ t('publicSubmission.partially') }}</option><option value="unknown">{{ t('publicSubmission.unknown') }}</option></select></label>
            <label>{{ t('publicSubmission.pharmaciesVisited') }}<input v-model="treatment.pharmacies_visited" type="number" min="0" step="1" required></label>
            <label>{{ t('publicSubmission.waitingTime') }}<select v-model="treatment.waiting_time" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="same-day">{{ t('publicSubmission.waitingOptions.sameDay') }}</option><option value="1-3-days">{{ t('publicSubmission.waitingOptions.oneToThreeDays') }}</option><option value="4-7-days">{{ t('publicSubmission.waitingOptions.fourToSevenDays') }}</option><option value="more-than-7-days">{{ t('publicSubmission.waitingOptions.moreThanSevenDays') }}</option><option value="unknown">{{ t('publicSubmission.unknown') }}</option></select></label>
            <label>{{ t('publicSubmission.stockoutFrequency') }}<select v-model="treatment.stockout_frequency" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="never">{{ t('publicSubmission.stockoutOptions.never') }}</option><option value="monthly">{{ t('publicSubmission.stockoutOptions.monthly') }}</option><option value="weekly">{{ t('publicSubmission.stockoutOptions.weekly') }}</option><option value="often">{{ t('publicSubmission.stockoutOptions.often') }}</option><option value="unknown">{{ t('publicSubmission.unknown') }}</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.psychosocial') }}</legend>
          <p class="form-section-note">{{ t('publicSubmission.psychosocialNote') }}</p>
          <div class="form-grid">
            <label>{{ t('publicSubmission.educationLevel') }}<select v-model="treatment.education_level" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="no-formal-education">{{ t('publicSubmission.educationOptions.noFormal') }}</option><option value="primary">{{ t('publicSubmission.educationOptions.primary') }}</option><option value="secondary">{{ t('publicSubmission.educationOptions.secondary') }}</option><option value="higher">{{ t('publicSubmission.educationOptions.higher') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.employmentStatus') }}<select v-model="treatment.employment_status" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="employed">{{ t('publicSubmission.employmentOptions.employed') }}</option><option value="self-employed">{{ t('publicSubmission.employmentOptions.selfEmployed') }}</option><option value="unemployed">{{ t('publicSubmission.employmentOptions.unemployed') }}</option><option value="student">{{ t('publicSubmission.employmentOptions.student') }}</option><option value="retired">{{ t('publicSubmission.employmentOptions.retired') }}</option><option value="other-response">{{ t('publicSubmission.employmentOptions.other') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.financialResources') }}<select v-model="treatment.has_financial_resources" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="yes">{{ t('publicSubmission.yes') }}</option><option value="no">{{ t('publicSubmission.no') }}</option><option value="partially">{{ t('publicSubmission.partially') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.minimumSalary') }}<input v-model="treatment.minimum_salary" type="number" min="0" step="0.01" :required="!minimumSalaryNotReported" :disabled="minimumSalaryNotReported"></label>
            <label class="check-field"><input v-model="minimumSalaryNotReported" type="checkbox">{{ t('publicSubmission.amountNotReported') }}</label>
            <label>{{ t('publicSubmission.costRelatedTreatmentChange') }}<select v-model="treatment.cost_related_treatment_change" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.costTreatmentChangeOptions.none') }}</option><option value="delayed_purchase">{{ t('publicSubmission.costTreatmentChangeOptions.delayedPurchase') }}</option><option value="missed_or_reduced_doses">{{ t('publicSubmission.costTreatmentChangeOptions.missedOrReducedDoses') }}</option><option value="stopped_treatment">{{ t('publicSubmission.costTreatmentChangeOptions.stoppedTreatment') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.emotionalImpact') }}<select v-model="treatment.emotional_impact" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.impactOptions.none') }}</option><option value="mild">{{ t('publicSubmission.impactOptions.mild') }}</option><option value="moderate">{{ t('publicSubmission.impactOptions.moderate') }}</option><option value="high">{{ t('publicSubmission.impactOptions.high') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.socialStigma') }}<select v-model="treatment.social_stigma" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="never">{{ t('publicSubmission.frequencyOptions.never') }}</option><option value="sometimes">{{ t('publicSubmission.frequencyOptions.sometimes') }}</option><option value="often">{{ t('publicSubmission.frequencyOptions.often') }}</option><option value="always">{{ t('publicSubmission.frequencyOptions.always') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.professionalImpact') }}<select v-model="treatment.professional_impact" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.impactOptions.none') }}</option><option value="mild">{{ t('publicSubmission.impactOptions.mild') }}</option><option value="moderate">{{ t('publicSubmission.impactOptions.moderate') }}</option><option value="major">{{ t('publicSubmission.impactOptions.major') }}</option><option value="not-applicable">{{ t('publicSubmission.notApplicable') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.socialSupport') }}<select v-model="treatment.social_support" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="strong">{{ t('publicSubmission.supportOptions.strong') }}</option><option value="partial">{{ t('publicSubmission.supportOptions.partial') }}</option><option value="limited">{{ t('publicSubmission.supportOptions.limited') }}</option><option value="none">{{ t('publicSubmission.supportOptions.none') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.accessBarrier') }}<select v-model="treatment.access_barrier" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.barrierOptions.none') }}</option><option value="cost">{{ t('publicSubmission.barrierOptions.cost') }}</option><option value="distance">{{ t('publicSubmission.barrierOptions.distance') }}</option><option value="transport">{{ t('publicSubmission.barrierOptions.transport') }}</option><option value="stockout">{{ t('publicSubmission.barrierOptions.stockout') }}</option><option value="information">{{ t('publicSubmission.barrierOptions.information') }}</option><option value="multiple">{{ t('publicSubmission.barrierOptions.multiple') }}</option><option value="other-response">{{ t('publicSubmission.barrierOptions.other') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.discriminationContext') }}<select v-model="treatment.discrimination_context" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.discriminationContextOptions.none') }}</option><option value="healthcare">{{ t('publicSubmission.discriminationContextOptions.healthcare') }}</option><option value="work">{{ t('publicSubmission.discriminationContextOptions.work') }}</option><option value="education">{{ t('publicSubmission.discriminationContextOptions.education') }}</option><option value="family_community">{{ t('publicSubmission.discriminationContextOptions.familyCommunity') }}</option><option value="public_services">{{ t('publicSubmission.discriminationContextOptions.publicServices') }}</option><option value="multiple_contexts">{{ t('publicSubmission.discriminationContextOptions.multiple') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
            <label>{{ t('publicSubmission.rightsSupportNeed') }}<select v-model="treatment.rights_support_need" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="none">{{ t('publicSubmission.rightsSupportOptions.none') }}</option><option value="rights_information">{{ t('publicSubmission.rightsSupportOptions.rightsInformation') }}</option><option value="report_discrimination">{{ t('publicSubmission.rightsSupportOptions.reportDiscrimination') }}</option><option value="legal_support">{{ t('publicSubmission.rightsSupportOptions.legalSupport') }}</option><option value="psychological_support">{{ t('publicSubmission.rightsSupportOptions.psychologicalSupport') }}</option><option value="peer_support">{{ t('publicSubmission.rightsSupportOptions.peerSupport') }}</option><option value="other-response">{{ t('publicSubmission.rightsSupportOptions.other') }}</option><option value="prefer-not-to-say">{{ t('publicSubmission.preferNotToSay') }}</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.dosage') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.morningPills') }}<input v-model="treatment.morning_pills" type="number" min="0" required></label>
            <label>{{ t('publicSubmission.noonPills') }}<input v-model="treatment.noon_pills" type="number" min="0" required></label>
            <label>{{ t('publicSubmission.eveningPills') }}<input v-model="treatment.evening_pills" type="number" min="0" required></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.restock') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.hasAlternative') }}<select v-model="treatment.has_alternative_medication" required><option :value="null">{{ t('publicSubmission.choose') }}</option><option :value="true">{{ t('publicSubmission.yes') }}</option><option :value="false">{{ t('publicSubmission.no') }}</option></select></label>
            <label v-if="treatment.has_alternative_medication">{{ t('publicSubmission.alternativeName') }}<input v-model="treatment.alternative_medication_name" required></label>
            <label>{{ t('publicSubmission.knowsRestockDelay') }}<select v-model="treatment.knows_restock_delay" required><option :value="null">{{ t('publicSubmission.choose') }}</option><option :value="true">{{ t('publicSubmission.yes') }}</option><option :value="false">{{ t('publicSubmission.no') }}</option></select></label>
            <label v-if="treatment.knows_restock_delay">{{ t('publicSubmission.preciseRestockDelay') }}<select v-model="treatment.is_restock_delay_precise" required><option :value="null">{{ t('publicSubmission.choose') }}</option><option :value="true">{{ t('publicSubmission.yes') }}</option><option :value="false">{{ t('publicSubmission.no') }}</option></select></label>
            <label v-if="treatment.knows_restock_delay && treatment.is_restock_delay_precise">{{ t('publicSubmission.restockDelay') }}<input v-model="treatment.restock_delay_precise" required></label>
            <label v-if="!treatment.knows_restock_delay || treatment.is_restock_delay_precise === false">{{ t('publicSubmission.actionWhenDelayUnknown') }}<textarea v-model="treatment.action_when_delay_unknown" rows="2" required></textarea></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.experience') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.effectiveness') }}<input v-model.number="treatment.effectiveness" type="number" min="1" max="10" required></label>
            <label>{{ t('publicSubmission.sideEffects') }}<textarea v-model="treatment.side_effects" rows="3"></textarea></label>
            <label>{{ t('publicSubmission.difficulties') }}<textarea v-model="treatment.difficulties" rows="3"></textarea></label>
            <label class="form-wide">{{ t('publicSubmission.additionalComments') }}<textarea v-model="treatment.additional_comments" rows="3"></textarea></label>
          </div>
        </fieldset>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <p class="form-alert">{{ t('publicSubmission.anonymousNote') }}</p>
        <p class="form-section-note">{{ t('publicSubmission.requiredFieldsNote') }}</p>
        <button class="button button-primary" type="submit">{{ t('publicSubmission.review') }} <ArrowLeft :size="16" /></button>
      </form>
    </template>

    <template v-else>
      <section class="treatment-review">
        <h3>{{ t('publicSubmission.reviewTitle') }}</h3>
        <dl>
          <div><dt>{{ t('publicSubmission.medicationCategory') }}</dt><dd>{{ selectedMedicationCategoryId ? t(`publicSubmission.medicationCategories.${selectedMedicationCategoryId}`) : t('publicSubmission.medicationCategories.unknown') }}</dd></div>
          <div><dt>{{ t('publicSubmission.medication') }}</dt><dd>{{ selectedMedicationName() }} · {{ treatment.dosage }} · {{ treatment.frequency }}</dd></div>
          <div v-if="isUnlistedMedication"><dt>{{ t('publicSubmission.medicationCountry') }}</dt><dd>{{ treatment.medication_country }}</dd></div>
          <div><dt>{{ t('publicSubmission.location') }}</dt><dd>{{ treatment.location }}</dd></div>
          <div><dt>{{ t('publicSubmission.effectiveness') }}</dt><dd>{{ treatment.effectiveness }}/10</dd></div>
          <div><dt>{{ t('publicSubmission.accessEase') }}</dt><dd>{{ t(`publicSubmission.accessOptions.${treatment.access_ease}`) }}</dd></div>
          <div><dt>{{ t('publicSubmission.costRelatedTreatmentChange') }}</dt><dd>{{ t(`analytics.categories.${treatment.cost_related_treatment_change}`) }}</dd></div>
          <div><dt>{{ t('publicSubmission.discriminationContext') }}</dt><dd>{{ t(`analytics.categories.${treatment.discrimination_context}`) }}</dd></div>
          <div><dt>{{ t('publicSubmission.rightsSupportNeed') }}</dt><dd>{{ t(`analytics.categories.${treatment.rights_support_need}`) }}</dd></div>
        </dl>
        <p v-if="isUnlistedMedication" class="form-alert">{{ t('publicSubmission.unlistedMedicationNotice') }}</p>
        <p v-else-if="selectedMedicationCategoryId === 'antiepileptiques'" class="form-section-note">{{ t('publicSubmission.provisionalCatalogueNote') }}</p>
        <div class="treatment-consent-flow">
          <label>
            {{ t('publicSubmission.email') }}
            <input v-model.trim="contactEmail" type="email" autocomplete="email" required :disabled="emailVerified">
          </label>
          <button
            v-if="!emailVerificationSent && !emailVerified"
            class="button button-secondary"
            type="button"
            :disabled="submitting || !contactEmail"
            @click="requestTreatmentEmailCode"
          >{{ t('publicSubmission.sendVerificationCode') }}</button>
          <template v-if="emailVerificationSent && !emailVerified">
            <label>
              {{ t('publicSubmission.verificationCode') }}
              <input v-model.trim="emailCode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" required>
            </label>
            <button
              class="button button-secondary"
              type="button"
              :disabled="submitting || emailCode.length !== 6"
              @click="confirmTreatmentEmail"
            >{{ t('publicSubmission.verifyEmail') }}</button>
          </template>
          <p v-if="emailVerified" class="form-alert" role="status">{{ t('publicSubmission.emailVerified') }}</p>
          <label class="check-field">
            <input v-model="consentAnalysis" type="checkbox">
            {{ t('publicSubmission.analysisConsent') }}
          </label>
          <p class="form-section-note">{{ t('publicSubmission.privacyNotice') }}</p>
          <p v-if="treatment.wants_alert" class="form-section-note">{{ t('publicSubmission.alertConsentNotice') }}</p>
        </div>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <div class="information-actions">
          <button class="button button-secondary" type="button" @click="reviewing = false"><ArrowLeft :size="16" />{{ t('publicSubmission.edit') }}</button>
          <button class="button button-primary" type="button" :disabled="submitting || !emailVerified" @click="submit">{{ submitting ? t('publicSubmission.sending') : t('publicSubmission.confirm') }} <Send :size="16" /></button>
        </div>
      </section>
    </template>
  </section>
</template>
