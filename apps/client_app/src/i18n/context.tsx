'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, LOCALES, DEFAULT_LOCALE, type Locale } from './index';
import type { TranslationKeys } from './locales/en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'innogram-locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }
  const browserLang = navigator.language.split('-')[0];
  if (LOCALES.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = translations[locale];

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      locale: DEFAULT_LOCALE as Locale,
      setLocale: (() => {}) as (locale: Locale) => void,
      t: translations[DEFAULT_LOCALE],
    };
  }
  return context;
}
