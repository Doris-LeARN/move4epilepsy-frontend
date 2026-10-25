<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertTriangle, MapPin, Navigation, ShieldCheck } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface PatientTreatment {
  location?: string;
}

interface Pharmacy {
  id: string;
  name: string;
  city?: string;
  commune?: string;
  address?: string;
  phone?: string | null;
}

interface ApiLocation {
  name: string;
  coordinates: [number, number];
  treatmentCount: number;
}

interface ApiPharmacy extends Pharmacy {
  coordinates: [number, number];
}

const { t } = useI18n();
const mapElement = ref<HTMLElement | null>(null);
const mode = ref<'scenario' | 'api'>('scenario');
const patientCity = ref('');
const pharmacyCity = ref('');
const apiLoading = ref(false);
const apiLoaded = ref(false);
const treatmentError = ref('');
const pharmacyError = ref('');
const unmappedLocations = ref(0);
const apiLocations = ref<ApiLocation[]>([]);
const apiPharmacies = ref<ApiPharmacy[]>([]);
const apiMarkerCount = computed(() => apiLocations.value.length + apiPharmacies.value.length);
const distanceKm = computed(() => {
  if (!patientCity.value || !pharmacyCity.value) return null;
  return calculateDistance(cityCoordinates[patientCity.value], cityCoordinates[pharmacyCity.value]);
});
const isCritical = computed(() => distanceKm.value !== null && distanceKm.value > 10);
const distanceLabel = computed(() => {
  if (distanceKm.value === null) return '';
  if (patientCity.value === pharmacyCity.value) return t('accessMap.localAccess');
  if (distanceKm.value > 50) return t('accessMap.criticalDistance');
  if (distanceKm.value > 20) return t('accessMap.longDistance');
  if (distanceKm.value > 10) return t('accessMap.moderateDistance');
  return t('accessMap.reasonableDistance');
});

const cityCoordinates: Record<string, [number, number]> = {
  Cotonou: [6.3654, 2.4184],
  'Abomey-Calavi': [6.4489, 2.3553],
  Abomey: [7.1856, 1.9914],
};
const cities = Object.keys(cityCoordinates);
const cityCenter: L.LatLngTuple = [6.55, 2.3];
let map: L.Map | null = null;
let scenarioLayer: L.LayerGroup | null = null;
let apiLayer: L.LayerGroup | null = null;
let apiController: AbortController | null = null;

function calculateDistance(from: [number, number], to: [number, number]): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = (to[0] - from[0]) * Math.PI / 180;
  const longitudeDelta = (to[1] - from[1]) * Math.PI / 180;
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(from[0] * Math.PI / 180) *
    Math.cos(to[0] * Math.PI / 180) *
    Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function popup(title: string, subtitle: string): HTMLElement {
  const content = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = title;
  const detail = document.createElement('p');
  detail.textContent = subtitle;
  content.append(heading, detail);
  return content;
}

function renderScenario() {
  if (!map || !scenarioLayer) return;
  scenarioLayer.clearLayers();
  if (mode.value !== 'scenario') return;

  for (const city of cities) {
    L.circleMarker(cityCoordinates[city], {
      radius: city === patientCity.value || city === pharmacyCity.value ? 9 : 6,
      color: city === patientCity.value ? '#2563eb' : city === pharmacyCity.value ? '#dc2626' : '#64748b',
      fillOpacity: 0.85,
      weight: 2,
    }).bindPopup(popup(city, t('accessMap.cityCenter'))).addTo(scenarioLayer);
  }

  if (!patientCity.value || !pharmacyCity.value) return;

  const patientCoordinates = cityCoordinates[patientCity.value];
  const pharmacyCoordinates = cityCoordinates[pharmacyCity.value];

  L.circleMarker(patientCoordinates, {
    radius: 10,
    color: '#1d4ed8',
    fillColor: '#3b82f6',
    fillOpacity: 1,
    weight: 3,
  }).bindPopup(popup(t('accessMap.patientLocation'), patientCity.value)).addTo(scenarioLayer);

  L.circleMarker(pharmacyCoordinates, {
    radius: 10,
    color: '#b91c1c',
    fillColor: '#ef4444',
    fillOpacity: 1,
    weight: 3,
  }).bindPopup(popup(t('accessMap.medicineLocation'), pharmacyCity.value)).addTo(scenarioLayer);

  L.polyline([patientCoordinates, pharmacyCoordinates], {
    color: isCritical.value ? '#dc2626' : '#16a34a',
    dashArray: '8 8',
    weight: 4,
    opacity: 0.85,
  }).addTo(scenarioLayer);

  map.fitBounds([patientCoordinates, pharmacyCoordinates], {
    padding: [70, 70],
    maxZoom: patientCity.value === pharmacyCity.value ? 11 : 10,
  });
}

function renderApiData() {
  if (!map || !apiLayer) return;
  apiLayer.clearLayers();
  if (mode.value !== 'api') return;

  const bounds: L.LatLngTuple[] = [];
  for (const location of apiLocations.value) {
    const marker = L.circleMarker(location.coordinates, {
      radius: Math.min(20, 8 + Math.log2(location.treatmentCount) * 2),
      color: '#7c3aed',
      fillColor: '#7c3aed',
      fillOpacity: 0.55,
      weight: 2,
    });
    marker.bindPopup(popup(
      location.name,
      t('accessMap.treatmentCount', { count: location.treatmentCount }),
    )).addTo(apiLayer);
    bounds.push(location.coordinates);
  }

  for (const pharmacy of apiPharmacies.value) {
    const marker = L.circleMarker(pharmacy.coordinates, {
      radius: 7,
      color: '#15803d',
      fillColor: '#22c55e',
      fillOpacity: 0.9,
      weight: 2,
    });
    marker.bindPopup(popup(
      pharmacy.name || t('accessMap.pharmacy'),
      [pharmacy.city || pharmacy.commune, pharmacy.address, pharmacy.phone].filter(Boolean).join(' · '),
    )).addTo(apiLayer);
    bounds.push(pharmacy.coordinates);
  }

  if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
}

function coordinatesForLocation(location: string): [number, number] | null {
  const normalized = location.toLocaleLowerCase().trim();
  const known = Object.entries(cityCoordinates).find(([city]) => normalized.includes(city.toLocaleLowerCase()));
  return known?.[1] ?? null;
}

async function loadApiData() {
  apiController?.abort();
  apiController = new AbortController();
  const { signal } = apiController;
  apiLoading.value = true;
  treatmentError.value = '';
  pharmacyError.value = '';
  unmappedLocations.value = 0;

  try {
    const [treatmentsResult, pharmaciesResult] = await Promise.allSettled([
      apiRequest<PatientTreatment[]>('/patients/treatments?skip=0&limit=1000', { signal }),
      apiRequest<Pharmacy[]>('/pharmacies', { signal }),
    ]);
    if (signal.aborted) return;

    if (treatmentsResult.status === 'rejected') {
      treatmentError.value = treatmentsResult.reason instanceof Error
        ? treatmentsResult.reason.message
        : t('accessMap.apiError');
    }
    if (pharmaciesResult.status === 'rejected') {
      pharmacyError.value = pharmaciesResult.reason instanceof Error
        ? pharmaciesResult.reason.message
        : t('accessMap.apiError');
    }

    const grouped = new Map<string, number>();
    if (treatmentsResult.status === 'fulfilled') {
      for (const treatment of treatmentsResult.value) {
        const location = treatment.location?.trim();
        if (location) grouped.set(location, (grouped.get(location) ?? 0) + 1);
      }
    }
    const locations = [...grouped].flatMap(([name, treatmentCount]) => {
      const coordinates = coordinatesForLocation(name);
      return coordinates ? [{ name, coordinates, treatmentCount }] : [];
    });
    const pharmacies = (pharmaciesResult.status === 'fulfilled' ? pharmaciesResult.value : []).flatMap((pharmacy) => {
      const city = pharmacy.city || pharmacy.commune || '';
      const coordinates = coordinatesForLocation(city);
      return coordinates ? [{ ...pharmacy, coordinates }] : [];
    });
    if (signal.aborted) return;

    apiLocations.value = locations;
    apiPharmacies.value = pharmacies;
    unmappedLocations.value = grouped.size - locations.length +
      (pharmaciesResult.status === 'fulfilled' ? pharmaciesResult.value.length : 0) - pharmacies.length;
    apiLoaded.value = true;
    renderApiData();
  } catch (error) {
    if (!signal.aborted) {
      treatmentError.value = error instanceof Error ? error.message : t('accessMap.apiError');
      apiLocations.value = [];
      apiPharmacies.value = [];
      apiLoaded.value = false;
      renderApiData();
    }
  } finally {
    if (!signal.aborted) apiLoading.value = false;
  }
}

async function selectMode(selectedMode: 'scenario' | 'api') {
  mode.value = selectedMode;
  if (selectedMode === 'api' && !apiLoaded.value) await loadApiData();
  await nextTick();
  map?.invalidateSize();
  renderScenario();
  renderApiData();
}

watch([patientCity, pharmacyCity], renderScenario);
watch(mode, () => {
  renderScenario();
  renderApiData();
});

onMounted(() => {
  if (!mapElement.value) return;
  map = L.map(mapElement.value).setView(cityCenter, 9);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  scenarioLayer = L.layerGroup().addTo(map);
  apiLayer = L.layerGroup().addTo(map);
  renderScenario();
});

onUnmounted(() => {
  apiController?.abort();
  map?.remove();
  map = null;
});
</script>

<template>
  <section class="access-map">
    <div class="access-mode-tabs" role="tablist" :aria-label="t('accessMap.title')">
      <button
        id="scenario-tab"
        type="button"
        role="tab"
        :aria-selected="mode === 'scenario'"
        :aria-controls="'scenario-panel'"
        :class="{ active: mode === 'scenario' }"
        @click="selectMode('scenario')"
      >{{ t('accessMap.scenarioTab') }}</button>
      <button
        id="api-tab"
        type="button"
        role="tab"
        :aria-selected="mode === 'api'"
        :aria-controls="'api-panel'"
        :class="{ active: mode === 'api' }"
        @click="selectMode('api')"
      >{{ t('accessMap.apiTab') }}</button>
    </div>

    <div v-if="mode === 'scenario'" id="scenario-panel" role="tabpanel" aria-labelledby="scenario-tab" class="panel access-scenario">
      <div class="access-scenario-heading">
        <AlertTriangle :size="22" />
        <div>
          <h2>{{ t('accessMap.scenarioTitle') }}</h2>
          <p>{{ t('accessMap.description') }}</p>
        </div>
      </div>
      <div class="access-scenario-fields">
        <label>
          {{ t('accessMap.patientCityLabel') }}
          <select v-model="patientCity">
            <option value="">{{ t('accessMap.chooseCity') }}</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </label>
        <label>
          {{ t('accessMap.pharmacyCityLabel') }}
          <select v-model="pharmacyCity" :disabled="!patientCity">
            <option value="">{{ t('accessMap.chooseCity') }}</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
          <small v-if="patientCity && pharmacyCity">
            {{ patientCity === pharmacyCity ? t('accessMap.sameCity') : t('accessMap.intercity') }}
          </small>
        </label>
      </div>
    </div>

    <div v-else id="api-panel" role="tabpanel" aria-labelledby="api-tab" class="access-api-panel">
      <div class="access-api-toolbar">
        <p>{{ t('accessMap.apiDescription') }}</p>
        <button class="button button-primary" type="button" :disabled="apiLoading" @click="loadApiData">
          {{ apiLoading ? t('common.loading') : t('accessMap.refresh') }}
        </button>
      </div>
      <p v-if="treatmentError" class="form-alert error-alert" role="alert">
        {{ t('accessMap.treatmentsError') }} {{ treatmentError }}
        <span>{{ t('accessMap.adminNotice') }}</span>
      </p>
      <p v-if="pharmacyError" class="form-alert error-alert" role="alert">
        {{ t('accessMap.pharmaciesError') }} {{ pharmacyError }}
      </p>
      <p v-if="unmappedLocations > 0" class="form-alert" role="status">
        {{ t('accessMap.unmappedLocations', { count: unmappedLocations }) }}
      </p>
    </div>

    <div class="panel access-map-panel">
      <div ref="mapElement" class="access-map-canvas" role="application" :aria-label="t('accessMap.title')"></div>
      <div v-if="mode === 'scenario'" class="access-map-legend">
        <span><i class="legend-dot patient-marker"></i>{{ t('accessMap.patientLocation') }} · {{ patientCity || '—' }}</span>
        <span><i class="legend-dot pharmacy-marker"></i>{{ t('accessMap.medicineLocation') }} · {{ pharmacyCity || '—' }}</span>
        <span class="access-map-count">{{ t('accessMap.mapHelp') }}</span>
      </div>
      <div v-else class="access-map-legend">
        <span><i class="legend-dot api-patient-marker"></i>{{ t('accessMap.patientLocations') }}</span>
        <span><i class="legend-dot api-pharmacy-marker"></i>{{ t('accessMap.pharmacies') }}</span>
        <span class="access-map-count">{{ t('accessMap.locationsShown', { count: apiMarkerCount }) }}</span>
      </div>
    </div>

    <p v-if="mode === 'api' && !apiLoading && apiLoaded && !apiMarkerCount" class="empty-state">
      {{ t('accessMap.noLocations') }}
    </p>
    <p v-if="mode === 'api'" class="access-map-privacy">{{ t('accessMap.apiPrivacyNotice') }}</p>

    <section v-if="mode === 'scenario' && distanceKm !== null" class="panel access-conclusion" :class="{ critical: isCritical }">
      <div class="access-conclusion-heading">
        <AlertTriangle v-if="isCritical" :size="23" />
        <ShieldCheck v-else :size="23" />
        <div>
          <h2>{{ isCritical ? t('accessMap.criticalTitle') : t('accessMap.accessibleTitle') }}</h2>
          <p>{{ distanceLabel }}</p>
        </div>
      </div>
      <div class="access-conclusion-stats">
        <article>
          <Navigation :size="19" />
          <span>{{ t('accessMap.distance') }}</span>
          <strong>{{ distanceKm.toFixed(1) }} km</strong>
        </article>
        <article>
          <MapPin :size="19" />
          <span>{{ t('accessMap.travelType') }}</span>
          <strong>{{ patientCity === pharmacyCity ? t('accessMap.withinCity') : t('accessMap.betweenCities') }}</strong>
        </article>
      </div>
      <div v-if="isCritical" class="access-recommendation">
        <h3>{{ t('accessMap.impactTitle') }}</h3>
        <p>{{ t('accessMap.impactDescription') }}</p>
        <h3>{{ t('accessMap.recommendationsTitle') }}</h3>
        <p>{{ t('accessMap.recommendationsDescription') }}</p>
      </div>
      <p class="access-distance-note">{{ t('accessMap.distanceDisclaimer') }}</p>
    </section>
  </section>
</template>
