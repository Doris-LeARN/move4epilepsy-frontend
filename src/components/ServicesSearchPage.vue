<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MapPin, Phone, Search } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone?: string | null;
  city: string;
  country: string;
  stocks: { quantity: number; is_rupture: boolean }[];
}

const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();
const query = ref('');
const serviceType = ref<'pharmacy' | 'hospital'>('pharmacy');
const pharmacies = ref<Pharmacy[]>([]);
const loading = ref(true);
const error = ref('');

const results = computed(() => {
  const normalizedQuery = query.value.trim().toLocaleLowerCase();
  return pharmacies.value.filter((pharmacy) =>
    `${pharmacy.name} ${pharmacy.address} ${pharmacy.city} ${pharmacy.country}`
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
});

async function loadPharmacies() {
  loading.value = true;
  error.value = '';
  try {
    pharmacies.value = await apiRequest<Pharmacy[]>('/pharmacies/public/pharmacies-with-stocks');
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('servicesSearch.loadError');
  } finally {
    loading.value = false;
  }
}

onMounted(loadPharmacies);
</script>

<template>
  <div class="services-search-page">
    <section class="panel services-search-intro">
      <h2>{{ t('servicesSearch.title') }}</h2>
      <p>{{ t('servicesSearch.intro') }}</p>
    </section>

    <section class="panel services-search-controls" :aria-label="t('servicesSearch.title')">
      <div class="service-type-toggle" role="group" :aria-label="t('servicesSearch.type')">
        <button type="button" :class="{ selected: serviceType === 'pharmacy' }" @click="serviceType = 'pharmacy'">{{ t('servicesSearch.pharmacies') }}</button>
        <button type="button" :class="{ selected: serviceType === 'hospital' }" @click="serviceType = 'hospital'">{{ t('servicesSearch.hospitals') }}</button>
      </div>
      <label class="service-search-field">
        <Search :size="18" />
        <input v-model="query" type="search" :aria-label="t('servicesSearch.searchLabel')" :placeholder="t('servicesSearch.searchPlaceholder')">
      </label>
    </section>

    <div v-if="serviceType === 'hospital'" class="panel services-search-state">
      <p>{{ t('servicesSearch.hospitalsUnavailable') }}</p>
      <button class="button button-primary" type="button" @click="emit('navigate', 'resources')">{{ t('servicesSearch.resourcesLink') }}</button>
    </div>
    <div v-else-if="loading" class="panel services-search-state" role="status">{{ t('servicesSearch.loading') }}</div>
    <div v-else-if="error" class="panel services-search-state" role="alert">
      <p>{{ t('servicesSearch.loadError') }} {{ error }}</p>
      <button class="button button-primary" type="button" @click="loadPharmacies">{{ t('servicesSearch.retry') }}</button>
    </div>
    <div v-else-if="results.length === 0" class="panel services-search-state">{{ t('servicesSearch.empty') }}</div>
    <section v-else class="services-search-results" :aria-label="t('servicesSearch.results')">
      <article v-for="pharmacy in results" :key="pharmacy.id" class="panel service-result">
        <span class="medicine-symbol"><MapPin :size="23" /></span>
        <div class="service-result-info">
          <h3>{{ pharmacy.name }}</h3>
          <p>{{ pharmacy.address }}, {{ pharmacy.city }}<span v-if="pharmacy.country">, {{ pharmacy.country }}</span></p>
          <p class="service-result-stock">{{ t('servicesSearch.catalogueStock', { count: pharmacy.stocks.filter((stock) => !stock.is_rupture && stock.quantity > 0).length }) }}</p>
        </div>
        <a v-if="pharmacy.phone" class="service-phone" :href="`tel:${pharmacy.phone}`"><Phone :size="16" />{{ pharmacy.phone }}</a>
      </article>
    </section>

    <p class="services-search-disclaimer">{{ t('servicesSearch.disclaimer') }}</p>
  </div>
</template>
