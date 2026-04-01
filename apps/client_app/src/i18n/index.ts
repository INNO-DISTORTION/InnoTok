import { en } from './locales/en';
import { ru } from './locales/ru';

export const LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const translations = { en, ru } satisfies Record<Locale, typeof en>;

export type { TranslationKeys } from './locales/en';
