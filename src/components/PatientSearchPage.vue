<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Bell, MapPin, Phone, Search } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  form: string;
}

interface PharmacyStock {
  id: string;
  pharmacy_id: string;
  medication_id: string;
  quantity: number;
  is_rupture: boolean;
  last_update: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  city: string;
  commune: string;
  department: string;
  stocks: PharmacyStock[];
}

const { t } = useI18n();
const medications = ref<Medication[]>([]);
const pharmacies = ref<Pharmacy[]>([]);
const selectedMedication = ref('');
const selectedCity = ref('');
const contactEmail = ref('');
const contactPhone = ref('');
const loading = ref(true);
const submittingAlert = ref(false);
const error = ref('');
const alertMessage = ref('');
const alertError = ref('');

const cities = computed(() => [...new Set(pharmacies.value.map((pharmacy) => pharmacy.city).filter(Boolean))].sort());
const results = computed(() => pharmacies.value
  .filter((pharmacy) => !selectedCity.value || pharmacy.city === selectedCity.value)
  .map((pharmacy) => {
    const stock = pharmacy.stocks.find((item) => item.medication_id === selectedMedication.value);
    return { pharmacy, stock, available: Boolean(stock && !stock.is_rupture && stock.quantity > 0) };
  })
  .filter((item) => item.stock || !selectedMedication.value)
  .sort((a, b) => Number(b.available) - Number(a.available)));
const selectedMedicationRecord = computed(() => medications.value.find((item) => item.id === selectedMedication.value));

async function loadData() {
  loading.value = true;
  error.value = '';
  try {
    const [medicationData, pharmacyData] = await Promise.all([
      apiRequest<Medication[]>('/medications'),
      apiRequest<Pharmacy[]>('/pharmacies/public/pharmacies-with-stocks'),
    ]);
    medications.value = medicationData;
    pharmacies.value = pharmacyData;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('patientSearch.loadError');
  } finally {
    loading.value = false;
  }
}

async function createAlert() {
  if (!selectedMedicationRecord.value || (!contactEmail.value.trim() && !contactPhone.value.trim()) || submittingAlert.value) return;
  submittingAlert.value = true;
  alertError.value = '';
  alertMessage.value = '';
  try {
    await apiRequest('/alerts', {
      method: 'POST',
      body: JSON.stringify({
        medication_id: selectedMedicationRecord.value.id,
        department: selectedCity.value
          ? pharmacies.value.find((pharmacy) => pharmacy.city === selectedCity.value)?.department ?? ''
          : pharmacies.value[0]?.department ?? '',
        commune: selectedCity.value || null,
        contact_email: contactEmail.value.trim() || null,
        contact_phone: contactPhone.value.trim() || null,
      }),
    });
    contactEmail.value = '';
    contactPhone.value = '';
    alertMessage.value = t('patientSearch.alertSuccess');
  } catch (cause) {
    alertError.value = cause instanceof Error ? cause.message : t('patientSearch.alertError');
  } finally {
    submittingAlert.value = false;
  }
}

onMounted(loadData);
</script>

<template>
  <div class="patient-search-page">
    <section class="panel patient-search-filters">
      <div class="search-controls">
        <label>
          {{ t('patientSearch.medication') }}
          <select v-model="selectedMedication">
            <option value="">{{ t('patientSearch.chooseMedication') }}</option>
            <option v-for="medication in medications" :key="medication.id" :value="medication.id">
              {{ medication.name }} · {{ medication.dosage }} · {{ medication.form }}
            </option>
          </select>
        </label>
        <label>
          {{ t('patientSearch.city') }}
          <select v-model="selectedCity">
            <option value="">{{ t('patientSearch.allCities') }}</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </label>
      </div>
    </section>

    <p v-if="loading" class="panel empty-state" role="status">{{ t('patientSearch.loading') }}</p>
    <div v-else-if="error" class="panel empty-state" role="alert">
      <p>{{ t('patientSearch.loadError') }} {{ error }}</p>
      <button class="button button-primary" type="button" @click="loadData">{{ t('patientSearch.retry') }}</button>
    </div>
    <p v-else-if="!selectedMedication" class="panel empty-state">{{ t('patientSearch.chooseHint') }}</p>
    <p v-else-if="results.length === 0" class="panel empty-state">{{ t('patientSearch.noResults') }}</p>
    <div v-else class="patient-search-results">
      <article v-for="result in results" :key="result.pharmacy.id" class="panel pharmacy-result">
        <div class="pharmacy-result-icon"><MapPin :size="21" /></div>
        <div class="pharmacy-result-content">
          <h2>{{ result.pharmacy.name }}</h2>
          <p>{{ result.pharmacy.address }} · {{ result.pharmacy.city }}</p>
          <a v-if="result.pharmacy.phone" :href="`tel:${result.pharmacy.phone}`"><Phone :size="15" />{{ result.pharmacy.phone }}</a>
        </div>
        <div class="pharmacy-availability" :class="{ available: result.available }">
          <strong>{{ result.available ? t('patientSearch.available') : t('patientSearch.unavailable') }}</strong>
          <span v-if="result.stock">{{ t('patientSearch.quantity', { count: result.stock.quantity }) }}</span>
          <span v-else>{{ t('patientSearch.noStockDeclaration') }}</span>
        </div>
      </article>
    </div>

    <section v-if="selectedMedication" class="panel patient-alert-panel">
      <div>
        <h2><Bell :size="20" />{{ t('patientSearch.alertTitle') }}</h2>
        <p>{{ t('patientSearch.alertDescription', { medication: selectedMedicationRecord?.name ?? '' }) }}</p>
      </div>
      <form class="patient-alert-form" @submit.prevent="createAlert">
        <label>{{ t('patientSearch.email') }}<input v-model="contactEmail" type="email" autocomplete="email"></label>
        <label>{{ t('patientSearch.phone') }}<input v-model="contactPhone" type="tel" autocomplete="tel"></label>
        <button class="button button-primary" type="submit" :disabled="submittingAlert || (!contactEmail && !contactPhone)">
          {{ submittingAlert ? t('patientSearch.alertSending') : t('patientSearch.createAlert') }}
        </button>
      </form>
      <p v-if="alertMessage" class="form-alert success-alert" role="status">{{ alertMessage }}</p>
      <p v-if="alertError" class="form-alert error-alert" role="alert">{{ alertError }}</p>
    </section>
  </div>
</template>
