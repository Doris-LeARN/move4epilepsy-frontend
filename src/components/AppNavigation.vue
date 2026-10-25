<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  BookOpen, Building, Home, Info, Lightbulb, MapPin, Menu, MessageCircle,
  Pill, Phone, Scale, Search, Stethoscope, X,
} from 'lucide-vue-next';
import type { PageId } from '../router/routes';

const props = defineProps<{ currentPage: PageId }>();
const emit = defineEmits<{ navigate: [page: PageId] }>();
const { t } = useI18n();
const openDropdown = ref<string | null>(null);
const mobileOpen = ref(false);

const items = [
  { id: 'home', label: 'navigation.home', icon: Home },
  { id: 'search', label: 'navigation.search', icon: Search, children: [
    { id: 'search', label: 'navigation.searchServices' }, { id: 'patient-search', label: 'navigation.medicationSearch' },
  ] },
  { id: 'medication', label: 'navigation.medication', icon: Pill, children: [
    { id: 'medication-registration', label: 'navigation.myTreatment' }, { id: 'medicine-report', label: 'navigation.reportMedicine' },
  ] },
  { id: 'observatory', label: 'navigation.observatory', icon: MapPin, children: [
    { id: 'locations-map', label: 'navigation.inequalityMap' }, { id: 'access-dashboard', label: 'navigation.globalDashboard' },
    { id: 'predictive-dashboard', label: 'navigation.predictiveDashboard' }, { id: 'trends', label: 'navigation.trends' },
    { id: 'opinions', label: 'navigation.opinions' }, { id: 'network-analysis', label: 'navigation.networkAnalysis' },
  ] },
  { id: 'chat', label: 'navigation.chat', icon: MessageCircle },
  { id: 'pharmacy', label: 'navigation.pharmacists', icon: Building, children: [
    { id: 'pharmacy-dashboard', label: 'navigation.pharmacyDashboard' }, { id: 'pharmacy-stock', label: 'navigation.stockManagement' },
    { id: 'subscription', label: 'navigation.subscriptions' },
  ] },
  { id: 'doctor', label: 'navigation.doctors', icon: Stethoscope, children: [
    { id: 'doctor-dashboard', label: 'navigation.doctorDashboard' },
  ] },
  { id: 'awareness', label: 'navigation.awareness', icon: Lightbulb, children: [
    { id: 'epilepsy-perceptions', label: 'navigation.perceptions' }, { id: 'truth', label: 'navigation.truth' },
  ] },
  { id: 'resources', label: 'navigation.resources', icon: BookOpen },
  { id: 'rights', label: 'navigation.rights', icon: Scale },
  { id: 'about', label: 'navigation.about', icon: Info, children: [
    { id: 'team', label: 'navigation.team' }, { id: 'partner', label: 'navigation.becomePartner' },
    { id: 'rgpd', label: 'navigation.dataProtection' }, { id: 'privacy', label: 'navigation.privacy' },
  ] },
  { id: 'contact', label: 'navigation.contact', icon: Phone },
];

function isActive(id: string, children?: { id: string }[]) {
  return id === 'observatory' ? ['locations-map', 'access-dashboard', 'predictive-dashboard', 'trends', 'opinions', 'network-analysis'].includes(props.currentPage)
    : id === 'pharmacy' ? ['pharmacy-dashboard', 'pharmacy-stock', 'subscription'].includes(props.currentPage)
      : id === 'doctor' ? props.currentPage === 'doctor-dashboard'
        : id === 'awareness' ? ['awareness', 'epilepsy-perceptions', 'truth'].includes(props.currentPage)
          : id === 'search' ? ['search', 'patient-search'].includes(props.currentPage)
            : id === 'medication' ? ['medication', 'medication-registration', 'medicine-report'].includes(props.currentPage)
              : id === 'about' ? ['about', 'team', 'partner', 'privacy', 'rgpd'].includes(props.currentPage)
                : id === props.currentPage || Boolean(children?.some((child) => child.id === props.currentPage));
}

function navigate(id: string) {
  if ((items.find((item) => item.id === id)?.children?.length ?? 0) > 0) {
    openDropdown.value = openDropdown.value === id ? null : id;
    return;
  }
  emit('navigate', id as PageId);
  mobileOpen.value = false;
  openDropdown.value = null;
}

function selectPage(id: string) {
  emit('navigate', id as PageId);
  mobileOpen.value = false;
  openDropdown.value = null;
}
</script>

<template>
  <nav class="main-nav">
    <div class="desktop-nav">
      <div v-for="item in items" :key="item.id" class="nav-item" :class="{ 'dropdown-open': openDropdown === item.id }"
        @mouseenter="item.children && (openDropdown = item.id)" @mouseleave="openDropdown = null">
        <button class="nav-button" :class="{ active: isActive(item.id, item.children) }"
          :aria-label="t(item.label)" @click="navigate(item.id)">
          <component :is="item.icon" :size="20" /><span>{{ t(item.label) }}</span>
        </button>
        <div v-if="item.children && openDropdown === item.id" class="nav-dropdown">
          <button v-for="child in item.children" :key="child.id"
            :class="{ active: props.currentPage === child.id }" @click="selectPage(child.id)">
            {{ t(child.label) }}
          </button>
        </div>
      </div>
    </div>
    <div class="mobile-nav">
      <div class="mobile-nav-brand"><img src="/logo.jpeg" alt=""><strong>Move4Epilepsy</strong></div>
      <button class="mobile-menu-toggle" :aria-label="mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'" @click="mobileOpen = !mobileOpen">
        <X v-if="mobileOpen" :size="24" /><Menu v-else :size="24" />
      </button>
      <div v-if="mobileOpen" class="mobile-menu">
        <div v-for="item in items" :key="item.id" class="mobile-item">
          <button class="mobile-item-button" :class="{ active: isActive(item.id, item.children) }" @click="navigate(item.id)">
            <component :is="item.icon" :size="19" />{{ t(item.label) }}
          </button>
          <div v-if="item.children && openDropdown === item.id" class="mobile-submenu">
            <button v-for="child in item.children" :key="child.id" :class="{ active: props.currentPage === child.id }"
              @click="selectPage(child.id)">{{ t(child.label) }}</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
