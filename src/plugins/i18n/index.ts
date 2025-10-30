import type { Locale, Composer } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import en from './locales/en.json'

export type MessageSchema = typeof en

export const SUPPORT_LOCALES = ['en', 'zh-CN'] as const
export type LocaleKey = (typeof SUPPORT_LOCALES)[number]
export const LOCALE_STORAGE_KEY = 'locale'

// create the typed i18n instance first, so helpers can use its type
export const i18n = createI18n<[MessageSchema], string>({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
} as const)

export type AppI18n = typeof i18n

export function getLocale(i18n: AppI18n): string {
  const g = i18n.global as unknown as Composer
  return g.locale.value
}

export function setLocale(i18n: AppI18n, locale: Locale): void {
  const g = i18n.global as unknown as Composer
  g.locale.value = String(locale)
}

export function setI18nLanguage(i18n: AppI18n, locale: Locale): void {
  setLocale(i18n, locale)
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */

  document.querySelector('html')!.setAttribute('lang', locale)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResourceMessages = (r: any) => r.default || r

export async function loadLocaleMessages(i18n: AppI18n, locale: Locale) {
  // load locale messages
  const messages: MessageSchema = await import(`./locales/${locale}.json`).then(getResourceMessages)

  // set locale and locale message
  const g = i18n.global as unknown as Composer
  g.setLocaleMessage(String(locale), messages)

  return nextTick()
}

export function resolveSupportedLocale(input?: string | null): LocaleKey | undefined {
  if (!input) return undefined
  const lower = input.toLowerCase()
  // exact match
  const exact = SUPPORT_LOCALES.find((l) => l.toLowerCase() === lower)
  if (exact) return exact
  // match by language base, e.g., en-US -> en, zh -> zh-CN
  const base = lower.split('-')[0]
  if (base === 'en') return 'en'
  if (base === 'zh') return 'zh-CN'
  return undefined
}

export function detectLocale(fallback: LocaleKey = 'en'): LocaleKey {
  try {
    const saved = resolveSupportedLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
    if (saved) return saved
  } catch {}
  if (typeof navigator !== 'undefined') {
    const nav = resolveSupportedLocale(navigator.language)
    if (nav) return nav
    const first = Array.isArray(navigator.languages)
      ? navigator.languages.find((l) => resolveSupportedLocale(l))
      : undefined
    if (first) return resolveSupportedLocale(first) as LocaleKey
  }
  return fallback
}

export async function switchLocale(i18n: AppI18n, locale: LocaleKey): Promise<void> {
  if (!SUPPORT_LOCALES.includes(locale)) return
  const g = i18n.global as unknown as Composer
  if (!g.availableLocales.includes(locale)) {
    await loadLocaleMessages(i18n, locale)
  }
  setI18nLanguage(i18n, locale)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {}
}
