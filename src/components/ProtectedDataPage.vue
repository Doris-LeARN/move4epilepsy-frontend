<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AlertCircle, Shield } from 'lucide-vue-next';

const props = defineProps<{ page: string }>();
const { t } = useI18n();

const messages: Record<string, string> = {
  'access-dashboard': 'protectedPages.accessDashboard',
  trends: 'protectedPages.trends',
  'pharmacy-dashboard': 'protectedPages.pharmacyDashboard',
  'pharmacy-stock': 'protectedPages.pharmacyStock',
  'doctor-dashboard': 'protectedPages.doctorDashboard',
  'admin-dashboard': 'protectedPages.adminDashboard',
};
</script>

<template>
  <section class="panel protected-data-notice" role="status">
    <span class="round-icon blue"><Shield :size="24" /></span>
    <AlertCircle :size="20" class="protected-data-alert" />
    <h2>{{ t('protectedPages.unavailableTitle') }}</h2>
    <p>{{ t(messages[props.page] ?? 'protectedPages.default') }}</p>
    <p class="protected-data-note">{{ t('protectedPages.noFakeData') }}</p>
  </section>
</template>
