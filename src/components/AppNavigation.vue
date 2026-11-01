<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  BookOpen, Building, Home, Info, Lightbulb, MapPin, Menu, MessageCircle,
  Pill, Phone, Scale, Search, Stethoscope, UserRound, X,
} from 'lucide-vue-next';
import type { PageId } from '../router/routes';

const props = defineProps<{ currentPage: PageId }>();
const emit = defineEmits<{ navigate: [page: PageId] }>();
const { t } = useI18n();
const openDropdown = ref<string | null>(null);
const mobileOpen = ref(false);
const navRoot = ref<HTMLElement | null>(null);
const mobileToggle = ref<HTMLButtonElement | null>(null);

const items = [
  { id: 'home', page: 'home', label: 'navigation.home', icon: Home },
  { id: 'search', label: 'navigation.search', icon: Search, children: [
    { id: 'search', label: 'navigation.searchServices' }, { id: 'patient-search', label: 'navigation.medicationSearch' },
  ] },
  { id: 'medication', label: 'navigation.medication', icon: Pill, children: [
    { id: 'medication', label: 'navigation.medicationOverview' },
    { id: 'medication-registration', label: 'navigation.myTreatment' },
    { id: 'medicine-report', label: 'navigation.reportMedicine' },
  ] },
  { id: 'observatory', label: 'navigation.observatory', icon: MapPin, children: [
    { id: 'locations-map', label: 'navigation.inequalityMap' }, { id: 'access-dashboard', label: 'navigation.globalDashboard' },
    { id: 'predictive-dashboard', label: 'navigation.predictiveDashboard' }, { id: 'trends', label: 'navigation.trends' },
    { id: 'opinions', label: 'navigation.opinions' }, { id: 'network-analysis', label: 'navigation.networkAnalysis' },
  ] },
  { id: 'chat', page: 'chat', label: 'navigation.chat', icon: MessageCircle },
  { id: 'pharmacy', label: 'navigation.pharmacists', icon: Building, children: [
    { id: 'pharmacy-dashboard', label: 'navigation.pharmacyDashboard' }, { id: 'pharmacy-stock', label: 'navigation.stockManagement' },
    { id: 'subscription', label: 'navigation.subscriptions' },
  ] },
  { id: 'doctor', label: 'navigation.doctors', icon: Stethoscope, children: [
    { id: 'doctor-dashboard', label: 'navigation.doctorDashboard' },
  ] },
  { id: 'awareness', label: 'navigation.awareness', icon: Lightbulb, children: [
    { id: 'awareness', label: 'navigation.awarenessOverview' },
    { id: 'epilepsy-perceptions', label: 'navigation.perceptions' }, { id: 'truth', label: 'navigation.truth' },
  ] },
  { id: 'resources', page: 'resources', label: 'navigation.resources', icon: BookOpen },
  { id: 'rights', page: 'rights', label: 'navigation.rights', icon: Scale },
  { id: 'about', label: 'navigation.about', icon: Info, children: [
    { id: 'about', label: 'navigation.aboutOverview' },
    { id: 'team', label: 'navigation.team' }, { id: 'economic-model', label: 'navigation.economicModel' },
    { id: 'partner', label: 'navigation.becomePartner' },
    { id: 'rgpd', label: 'navigation.dataProtection' }, { id: 'privacy', label: 'navigation.privacy' },
  ] },
  { id: 'contact', page: 'contact', label: 'navigation.contact', icon: Phone },
  { id: 'account', label: 'navigation.account', icon: UserRound, children: [
    { id: 'login', label: 'navigation.login' },
  ] },
] satisfies Array<{
  id: string;
  page?: PageId;
  label: string;
  icon: typeof Home;
  children?: Array<{ id: PageId; label: string }>;
}>;

function isActive(item: (typeof items)[number]) {
  return item.page === props.currentPage
    || Boolean(item.children?.some((child) => child.id === props.currentPage));
}

function closeMenus() {
  openDropdown.value = null;
  mobileOpen.value = false;
}

function activateItem(item: (typeof items)[number]) {
  if (item.children) {
    openDropdown.value = openDropdown.value === item.id ? null : item.id;
    return;
  }
  if (item.page) emit('navigate', item.page);
  closeMenus();
}

function selectPage(page: PageId) {
  emit('navigate', page);
  closeMenus();
}

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
  openDropdown.value = null;
}

function onPointerDown(event: PointerEvent) {
  const root = navRoot.value;
  if (root && !event.composedPath().includes(root)) closeMenus();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || (!mobileOpen.value && !openDropdown.value)) return;
  event.preventDefault();
  const activeGroup = openDropdown.value;
  if (mobileOpen.value && activeGroup) {
    openDropdown.value = null;
    document.getElementById(`mobile-trigger-${activeGroup}`)?.focus();
    return;
  }
  if (mobileOpen.value) {
    closeMenus();
    mobileToggle.value?.focus();
    return;
  }
  closeMenus();
  if (activeGroup) document.getElementById(`nav-trigger-${activeGroup}`)?.focus();
}

watch(() => props.currentPage, closeMenus);

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('pointerdown', onPointerDown);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <nav ref="navRoot" class="main-nav" :aria-label="t('navigation.mainMenu')">
    <div class="desktop-nav">
      <div
        v-for="item in items"
        :key="item.id"
        class="nav-item"
        :class="{ 'dropdown-open': openDropdown === item.id }"
      >
        <button
          :id="`nav-trigger-${item.id}`"
          class="nav-button"
          :class="{ active: isActive(item) }"
          :aria-label="t(item.label)"
          :aria-expanded="item.children ? openDropdown === item.id : undefined"
          :aria-haspopup="item.children ? 'true' : undefined"
          :aria-controls="item.children && openDropdown === item.id ? `nav-menu-${item.id}` : undefined"
          :aria-current="item.page === currentPage ? 'page' : undefined"
          type="button"
          @click="activateItem(item)"
        >
          <component :is="item.icon" :size="20" /><span>{{ t(item.label) }}</span>
        </button>
        <div
          v-if="item.children && openDropdown === item.id"
          :id="`nav-menu-${item.id}`"
          class="nav-dropdown"
        >
          <button
            v-for="child in item.children"
            :key="child.id"
            :class="{ active: currentPage === child.id }"
            :aria-current="currentPage === child.id ? 'page' : undefined"
            type="button"
            @click="selectPage(child.id)"
          >
            {{ t(child.label) }}
          </button>
        </div>
      </div>
    </div>
    <div class="mobile-nav">
      <div class="mobile-nav-brand"><img src="/logo.jpeg" alt=""><strong>Move4Epilepsy</strong></div>
      <button
        ref="mobileToggle"
        class="mobile-menu-toggle"
        :aria-label="mobileOpen ? t('navigation.closeMenu') : t('navigation.openMenu')"
        :aria-expanded="mobileOpen"
        :aria-controls="mobileOpen ? 'mobile-navigation-menu' : undefined"
        type="button"
        @click="toggleMobileMenu"
      >
        <X v-if="mobileOpen" :size="24" /><Menu v-else :size="24" />
      </button>
      <div v-if="mobileOpen" id="mobile-navigation-menu" class="mobile-menu">
        <div v-for="item in items" :key="item.id" class="mobile-item">
          <button
            :id="`mobile-trigger-${item.id}`"
            class="mobile-item-button"
            :class="{ active: isActive(item) }"
            :aria-expanded="item.children ? openDropdown === item.id : undefined"
            :aria-haspopup="item.children ? 'true' : undefined"
            :aria-controls="item.children && openDropdown === item.id ? `mobile-menu-${item.id}` : undefined"
            :aria-current="item.page === currentPage ? 'page' : undefined"
            type="button"
            @click="activateItem(item)"
          >
            <component :is="item.icon" :size="19" />{{ t(item.label) }}
          </button>
          <div
            v-if="item.children && openDropdown === item.id"
            :id="`mobile-menu-${item.id}`"
            class="mobile-submenu"
          >
            <button
              v-for="child in item.children"
              :key="child.id"
              :class="{ active: currentPage === child.id }"
              :aria-current="currentPage === child.id ? 'page' : undefined"
              type="button"
              @click="selectPage(child.id)"
            >{{ t(child.label) }}</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
