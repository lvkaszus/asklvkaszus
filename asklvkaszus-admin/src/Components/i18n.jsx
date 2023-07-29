import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../Locales/en.json';
import translationPL from '../Locales/pl.json';

const detectBrowserLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage;

  if (userLang !== 'pl-PL' && userLang !== 'pl' && userLang !== 'en-US' && userLang !== 'en-GB' && userLang !== 'en') {
    return 'en';
  }

  return userLang;
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      pl: {
        translation: translationPL,
      },
    },
    lng: detectBrowserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;