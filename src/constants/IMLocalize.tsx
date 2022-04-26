import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
import tr from './translations/tr';

const LANGUAGES = {
  tr,
  en,
};

const LANG_CODES: any = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR: any = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem('APP_LANG', (err, lng) => {
      // Error fetching stored data or no language was stored
      if (err || !lng) {
        const bestLng = RNLocalize.findBestAvailableLanguage(LANG_CODES);

        callback(bestLng?.languageTag ?? 'tr');
        return;
      }
      callback(lng);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: any) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    compatibilityJSON: 'v3',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });
