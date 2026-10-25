<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeader from './components/AppHeader.vue';
import AppNavigation from './components/AppNavigation.vue';
import PageView from './components/PageView.vue';
import { hashForPage, pageFromHash, type PageId } from './router/routes';

const { t, locale } = useI18n();
const currentPage = ref(pageFromHash(window.location.hash));

function navigate(page: string) {
  const target = page as PageId;
  window.location.hash = hashForPage(target);
}

function syncLanguage() {
  document.documentElement.lang = locale.value;
}
watch(locale, syncLanguage, { immediate: true });

function handleHashChange() {
  const hash = window.location.hash;
  if (hash === '#partner' || hash === '#opinions') {
    currentPage.value = pageFromHash(hash);
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${hash.slice(1)}`);
    return;
  }
  const page = pageFromHash(hash);
  currentPage.value = page;
  const expectedHash = hashForPage(page);
  if (hash === '#auth') {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}${expectedHash}`);
    return;
  }
  if ((hash === '#privacy' || hash === '#rgpd') && hash !== expectedHash) window.location.hash = expectedHash;
  if ((hash === '#terms' || hash === '#conditions-utilisation') && hash !== expectedHash) window.location.hash = expectedHash;
}

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange);
  if (window.location.hash) handleHashChange();
});
onUnmounted(() => window.removeEventListener('hashchange', handleHashChange));
</script>

<template>
  <div class="app-shell">
    <AppHeader @navigate="navigate" />
    <AppNavigation :current-page="currentPage" @navigate="navigate" />
    <main class="page-container">
      <PageView :page="currentPage" @navigate="navigate" />
    </main>
    <footer class="site-footer">
      <div class="footer-grid">
        <section class="footer-about">
          <div class="footer-brand"><img src="/logo.jpeg" alt="Move4Epilepsy Logo"><h2>Move4Epilepsy</h2></div>
          <p>{{ t('footer.description') }}</p>
        </section>
        <section><h3>{{ t('footer.platform') }}</h3><button @click="navigate('access-dashboard')">{{ t('footer.dataCollection') }}</button><button @click="navigate('predictive-dashboard')">{{ t('footer.predictiveAnalysis') }}</button><button @click="navigate('trends')">{{ t('footer.research') }}</button><button @click="navigate('opinions')">{{ t('footer.community') }}</button></section>
        <section><h3>{{ t('footer.resources') }}</h3><button @click="navigate('resources')">{{ t('footer.documentation') }}</button><button @click="navigate('about')">{{ t('footer.api') }}</button><button @click="navigate('contact')">{{ t('footer.support') }}</button><button @click="navigate('awareness')">{{ t('footer.blog') }}</button></section>
        <section><h3>{{ t('footer.contact') }}</h3><a href="mailto:move4epilepsy@gmail.com">move4epilepsy@gmail.com</a><a href="tel:+2290197154241">+229 01 97 15 42 41</a><span>Abomey-Calavi, Bénin</span></section>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Move4Epilepsy. {{ t('common.allRightsReserved') }}.</span>
        <div><button @click="navigate('privacy')">{{ t('footer.privacyPolicy') }}</button><button @click="navigate('rgpd')">{{ t('footer.gdpr') }}</button><button @click="navigate('terms')">{{ t('footer.termsOfUse') }}</button></div>
      </div>
    </footer>
  </div>
</template>
