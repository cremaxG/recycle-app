import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    compatibilityJSON: 'v4',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
