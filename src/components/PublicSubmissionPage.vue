<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ArrowLeft, CheckCircle, Send } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

type SubmissionPage = 'partner' | 'medicine-report' | 'medication-registration';
const props = defineProps<{ page: SubmissionPage }>();
const { t } = useI18n();
const submitting = ref(false);
const error = ref('');
const success = ref(false);
const reviewing = ref(false);
const treatment = reactive({
  name: '',
  age: '',
  sex: '',
  location: '',
  medication_name: '',
  dosage: '',
  frequency: '',
  treatment_duration: '',
  treatment_start_date: '',
  treatment_end_date: '',
  treatment_is_ongoing: true,
  monthly_cost: '',
  unit_price: '',
  access_ease: '',
  effectiveness: 5,
  side_effects: '',
  difficulties: '',
  additional_comments: '',
  found_medication: '',
  pharmacies_visited: '',
  waiting_time: '',
  stockout_frequency: '',
  wants_alert: false,
  morning_pills: '',
  noon_pills: '',
  evening_pills: '',
  education_level: '',
  minimum_salary: '',
  employment_status: '',
  has_financial_resources: '',
  has_alternative_medication: false,
  alternative_medication_name: '',
  knows_restock_delay: false,
  is_restock_delay_precise: false,
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
    name: '', age: '', sex: '', location: '', medication_name: '', dosage: '', frequency: '',
    treatment_duration: '', treatment_start_date: '', treatment_end_date: '',
    treatment_is_ongoing: true, monthly_cost: '', unit_price: '', access_ease: '',
    effectiveness: 5, side_effects: '', difficulties: '', additional_comments: '',
    found_medication: '', pharmacies_visited: '', waiting_time: '', stockout_frequency: '',
    wants_alert: false, morning_pills: '', noon_pills: '', evening_pills: '', education_level: '',
    minimum_salary: '', employment_status: '', has_financial_resources: '',
    has_alternative_medication: false, alternative_medication_name: '', knows_restock_delay: false,
    is_restock_delay_precise: false, restock_delay_precise: '', action_when_delay_unknown: '',
  });
}

async function submit() {
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
      age: Number(treatment.age),
      treatment_duration: treatment.treatment_duration ? Number(treatment.treatment_duration) : null,
      treatment_start_date: treatment.treatment_start_date || null,
      treatment_end_date: treatment.treatment_end_date || null,
      treatment_is_ongoing: treatment.treatment_is_ongoing,
      effectiveness: Number(treatment.effectiveness),
      monthly_cost: treatment.monthly_cost || null,
      unit_price: treatment.unit_price || null,
      wants_alert: treatment.wants_alert,
      has_alternative_medication: treatment.has_alternative_medication,
      knows_restock_delay: treatment.knows_restock_delay,
      is_restock_delay_precise: treatment.knows_restock_delay ? treatment.is_restock_delay_precise : null,
      restock_delay_precise: treatment.restock_delay_precise || null,
      action_when_delay_unknown: treatment.action_when_delay_unknown || null,
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
      <p>{{ t(`publicSubmission.${page}.success`) }}</p>
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
            <label>{{ t('publicSubmission.nameOptional') }}<input v-model="treatment.name" maxlength="100"></label>
            <label>{{ t('publicSubmission.age') }}<input v-model="treatment.age" type="number" min="1" max="120" required></label>
            <label>{{ t('publicSubmission.sex') }}<select v-model="treatment.sex" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="homme">{{ t('publicSubmission.sexOptions.male') }}</option><option value="femme">{{ t('publicSubmission.sexOptions.female') }}</option><option value="autre">{{ t('publicSubmission.sexOptions.other') }}</option><option value="non-specifie">{{ t('publicSubmission.sexOptions.unspecified') }}</option></select></label>
            <label>{{ t('publicSubmission.location') }}<input v-model="treatment.location" required></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.treatment') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.medication') }}<input v-model="treatment.medication_name" required></label>
            <label>{{ t('publicSubmission.dosage') }}<input v-model="treatment.dosage" required></label>
            <label>{{ t('publicSubmission.frequency') }}<input v-model="treatment.frequency" required></label>
            <label>{{ t('publicSubmission.duration') }}<input v-model="treatment.treatment_duration" type="number" min="1"></label>
            <label>{{ t('publicSubmission.startDate') }}<input v-model="treatment.treatment_start_date" type="date"></label>
            <label>{{ t('publicSubmission.endDate') }}<input v-model="treatment.treatment_end_date" type="date" :disabled="treatment.treatment_is_ongoing"></label>
            <label class="check-field"><input v-model="treatment.treatment_is_ongoing" type="checkbox">{{ t('publicSubmission.ongoing') }}</label>
            <label class="check-field"><input v-model="treatment.wants_alert" type="checkbox">{{ t('publicSubmission.wantsAlert') }}</label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.access') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.accessEase') }}<select v-model="treatment.access_ease" required><option value="">{{ t('publicSubmission.choose') }}</option><option value="easy">{{ t('publicSubmission.accessOptions.easy') }}</option><option value="difficult">{{ t('publicSubmission.accessOptions.difficult') }}</option><option value="very-difficult">{{ t('publicSubmission.accessOptions.veryDifficult') }}</option></select></label>
            <label>{{ t('publicSubmission.monthlyCost') }}<input v-model="treatment.monthly_cost" type="number" min="0" step="0.01"></label>
            <label>{{ t('publicSubmission.unitPrice') }}<input v-model="treatment.unit_price" type="number" min="0" step="0.01"></label>
            <label>{{ t('publicSubmission.foundMedication') }}<input v-model="treatment.found_medication"></label>
            <label>{{ t('publicSubmission.pharmaciesVisited') }}<input v-model="treatment.pharmacies_visited"></label>
            <label>{{ t('publicSubmission.waitingTime') }}<input v-model="treatment.waiting_time"></label>
            <label>{{ t('publicSubmission.stockoutFrequency') }}<input v-model="treatment.stockout_frequency"></label>
            <label>{{ t('publicSubmission.educationLevel') }}<input v-model="treatment.education_level"></label>
            <label>{{ t('publicSubmission.employmentStatus') }}<input v-model="treatment.employment_status"></label>
            <label>{{ t('publicSubmission.minimumSalary') }}<input v-model="treatment.minimum_salary" type="number" min="0" step="0.01"></label>
            <label>{{ t('publicSubmission.financialResources') }}<select v-model="treatment.has_financial_resources"><option value="">{{ t('publicSubmission.choose') }}</option><option value="yes">{{ t('publicSubmission.yes') }}</option><option value="no">{{ t('publicSubmission.no') }}</option><option value="partially">{{ t('publicSubmission.partially') }}</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.dosage') }}</legend>
          <div class="form-grid">
            <label>{{ t('publicSubmission.morningPills') }}<input v-model="treatment.morning_pills" type="number" min="0"></label>
            <label>{{ t('publicSubmission.noonPills') }}<input v-model="treatment.noon_pills" type="number" min="0"></label>
            <label>{{ t('publicSubmission.eveningPills') }}<input v-model="treatment.evening_pills" type="number" min="0"></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>{{ t('publicSubmission.sections.restock') }}</legend>
          <div class="form-grid">
            <label class="check-field"><input v-model="treatment.has_alternative_medication" type="checkbox">{{ t('publicSubmission.hasAlternative') }}</label>
            <label v-if="treatment.has_alternative_medication">{{ t('publicSubmission.alternativeName') }}<input v-model="treatment.alternative_medication_name"></label>
            <label class="check-field"><input v-model="treatment.knows_restock_delay" type="checkbox">{{ t('publicSubmission.knowsRestockDelay') }}</label>
            <label v-if="treatment.knows_restock_delay" class="check-field"><input v-model="treatment.is_restock_delay_precise" type="checkbox">{{ t('publicSubmission.preciseRestockDelay') }}</label>
            <label v-if="treatment.knows_restock_delay && treatment.is_restock_delay_precise">{{ t('publicSubmission.restockDelay') }}<input v-model="treatment.restock_delay_precise"></label>
            <label v-if="!treatment.knows_restock_delay || !treatment.is_restock_delay_precise">{{ t('publicSubmission.actionWhenDelayUnknown') }}<textarea v-model="treatment.action_when_delay_unknown" rows="2"></textarea></label>
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
        <button class="button button-primary" type="submit">{{ t('publicSubmission.review') }} <ArrowLeft :size="16" /></button>
      </form>
    </template>

    <template v-else>
      <section class="treatment-review">
        <h3>{{ t('publicSubmission.reviewTitle') }}</h3>
        <dl>
          <div><dt>{{ t('publicSubmission.medication') }}</dt><dd>{{ treatment.medication_name }} · {{ treatment.dosage }} · {{ treatment.frequency }}</dd></div>
          <div><dt>{{ t('publicSubmission.location') }}</dt><dd>{{ treatment.location }}</dd></div>
          <div><dt>{{ t('publicSubmission.effectiveness') }}</dt><dd>{{ treatment.effectiveness }}/10</dd></div>
          <div><dt>{{ t('publicSubmission.accessEase') }}</dt><dd>{{ t(`publicSubmission.accessOptions.${treatment.access_ease}`) }}</dd></div>
        </dl>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <div class="information-actions">
          <button class="button button-secondary" type="button" @click="reviewing = false"><ArrowLeft :size="16" />{{ t('publicSubmission.edit') }}</button>
          <button class="button button-primary" type="button" :disabled="submitting" @click="submit">{{ submitting ? t('publicSubmission.sending') : t('publicSubmission.confirm') }} <Send :size="16" /></button>
        </div>
      </section>
    </template>
  </section>
</template>
