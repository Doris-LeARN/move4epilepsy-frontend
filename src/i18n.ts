import { createI18n } from 'vue-i18n';
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import it from './locales/it/translation.json';

const supportedLanguages = ['fr', 'en', 'it'] as const;
type Language = (typeof supportedLanguages)[number];

function getInitialLanguage(): Language {
  const storedLanguage = localStorage.getItem('i18nextLng')?.slice(0, 2);
  if (supportedLanguages.includes(storedLanguage as Language)) return storedLanguage as Language;

  const browserLanguage = navigator.language.slice(0, 2);
  return supportedLanguages.includes(browserLanguage as Language) ? browserLanguage as Language : 'fr';
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: 'fr',
  messages: { fr, en, it },
});

export type { Language };
