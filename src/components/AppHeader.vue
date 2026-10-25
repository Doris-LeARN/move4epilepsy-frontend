<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Building, Globe, Heart, Shield, Users } from 'lucide-vue-next';
import LanguageSelector from './LanguageSelector.vue';

const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="brand-row">
        <div class="brand">
          <div class="brand-logo">
            <img src="/logo.jpeg" alt="Move4Epilepsy Logo">
            <span class="online-dot"></span>
          </div>
          <div>
            <h1>{{ t('header.title') }}</h1>
            <p class="brand-subtitle">{{ t('header.subtitle') }}</p>
            <p class="brand-tagline">{{ t('header.tagline') }}</p>
          </div>
        </div>
        <div class="header-tools">
          <div class="quick-stats">
            <div class="quick-stat"><Users :size="17" /><strong>50M+</strong><small>{{ t('header.stats.patientsWorld') }}</small></div>
            <div class="quick-stat"><Globe :size="17" /><strong>25+</strong><small>{{ t('header.stats.countriesCovered') }}</small></div>
            <div class="quick-stat"><Heart :size="17" /><strong>95%</strong><small>{{ t('header.stats.satisfaction') }}</small></div>
          </div>
          <div class="header-actions">
            <button class="button button-outline" @click="emit('navigate', 'partner')"><Building :size="16" />{{ t('header.becomePartner') }}</button>
            <div class="platform-active"><span class="online-dot"></span>{{ t('header.platformActive') }}</div>
            <LanguageSelector />
          </div>
        </div>
      </div>
      <div class="header-info">
        <div><span class="online-dot"></span>{{ t('header.dataCollectionActive') }}</div>
        <div><Globe :size="15" />{{ t('header.worldwideCoverage') }}</div>
        <div><Shield :size="15" />{{ t('header.dataProtection') }}</div>
        <span class="un-goal">{{ t('header.unGoal') }}</span>
      </div>
    </div>
  </header>
</template>
