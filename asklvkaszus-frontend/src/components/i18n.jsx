import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Import your locale files here
import enUS from '../locales/en-US.json';
import plPL from '../locales/pl-PL.json';
// Import your locale files here


const detectBrowserLanguage = () => {
  const userLang = navigator.language || navigator.userLanguage;

  return userLang;
};

i18n.use(initReactI18next).init({
    resources: {


      // Define your locales from locale files here
      'en-US': {
        translation: enUS,
      },
      'pl-PL': {
        translation: plPL,
      },
      'pl': {
        translation: plPL,
      },
      // Define your locales from locale files here


    },
    lng: detectBrowserLanguage(),
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
});

export default i18n;