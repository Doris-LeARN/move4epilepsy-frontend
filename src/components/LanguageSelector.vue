<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDown, Globe } from 'lucide-vue-next';

const { locale } = useI18n();
const isOpen = ref(false);
const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];
const current = computed(() => languages.find((language) => language.code === locale.value) ?? languages[0]);

function selectLanguage(code: string) {
  locale.value = code;
  document.documentElement.lang = code;
  localStorage.setItem('i18nextLng', code);
  isOpen.value = false;
}
</script>

<template>
  <div class="language-select">
    <button class="language-trigger" type="button" aria-label="Select language" @click="isOpen = !isOpen">
      <Globe :size="16" /> <span>{{ current.flag }}</span><span class="language-name">{{ current.name }}</span>
      <ChevronDown :size="16" :class="{ rotated: isOpen }" />
    </button>
    <div v-if="isOpen" class="language-options">
      <button v-for="language in languages" :key="language.code" type="button"
        :class="{ selected: language.code === locale }" @click="selectLanguage(language.code)">
        <span>{{ language.flag }}</span>{{ language.name }}<span v-if="language.code === locale">✓</span>
      </button>
    </div>
  </div>
</template>
