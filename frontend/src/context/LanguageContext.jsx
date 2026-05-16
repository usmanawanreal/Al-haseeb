import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'alhaseeb_lang';

function readStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'ur' ? 'ur' : 'en';
  } catch {
    return 'en';
  }
}

function applyDocumentLang(lang) {
  const isUrdu = lang === 'ur';
  document.documentElement.lang = lang;
  document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
  document.body.classList.toggle('rtl', isUrdu);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);

  useEffect(() => {
    applyDocumentLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore storage errors */
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'ur' : 'en'));
  }, []);

  const t = useCallback(
    (section, key) => {
      const block = translations[lang]?.[section];
      if (block && block[key] != null) return block[key];
      return translations.en[section]?.[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      isUrdu: lang === 'ur',
      setLang,
      toggleLang,
      t,
    }),
    [lang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
