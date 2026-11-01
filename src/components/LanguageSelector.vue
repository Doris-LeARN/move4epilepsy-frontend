<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronDown, Globe } from 'lucide-vue-next';

const { locale, t } = useI18n();
const isOpen = ref(false);
const languageRoot = ref<HTMLElement | null>(null);
const languageTrigger = ref<HTMLButtonElement | null>(null);
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

function onPointerDown(event: PointerEvent) {
  const root = languageRoot.value;
  if (root && !event.composedPath().includes(root)) isOpen.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isOpen.value) return;
  event.preventDefault();
  isOpen.value = false;
  languageTrigger.value?.focus();
}

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
  <div ref="languageRoot" class="language-select">
    <button
      ref="languageTrigger"
      class="language-trigger"
      type="button"
      :aria-label="t('navigation.selectLanguage')"
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? 'language-options' : undefined"
      @click="isOpen = !isOpen"
    >
      <Globe :size="16" /> <span>{{ current.flag }}</span><span class="language-name">{{ current.name }}</span>
      <ChevronDown :size="16" :class="{ rotated: isOpen }" />
    </button>
    <div v-if="isOpen" id="language-options" class="language-options">
      <button v-for="language in languages" :key="language.code" type="button"
        :class="{ selected: language.code === locale }"
        :aria-pressed="language.code === locale"
        @click="selectLanguage(language.code)">
        <span>{{ language.flag }}</span>{{ language.name }}<span v-if="language.code === locale">✓</span>
      </button>
    </div>
  </div>
</template>
