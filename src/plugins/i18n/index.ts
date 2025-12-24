import { createI18n } from 'vue-i18n'
import { nextTick } from 'vue'
import en from './locales/en.json'

export type MessageSchema = typeof en

export const SUPPORT_LOCALES = ['en', 'zh-CN'] as const
export type LocaleKey = (typeof SUPPORT_LOCALES)[number]
export const LOCALE_STORAGE_KEY = 'locale'

// create the typed i18n instance first, so helpers can use its type
export const i18n = createI18n<[MessageSchema], string, false>({
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
  },
  legacy: false,
})

export type AppI18n = typeof i18n

/** Current language */
export const locale = computed({
  get() {
    return i18n.global.locale.value
  },
  set(language: string) {
    localStorage.setItem('language', language)
    i18n.global.locale.value = language
  },
})

export async function setI18nLanguage(locale: LocaleKey): Promise<void> {
  if (!SUPPORT_LOCALES.includes(locale)) return
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale)
  }
  i18n.global.locale.value = String(locale)
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {}

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

export async function loadLocaleMessages(locale: LocaleKey) {
  // load locale messages
  const messages: MessageSchema = await import(`./locales/${locale}.json`).then(getResourceMessages)

  // set locale and locale message
  i18n.global.setLocaleMessage(String(locale), messages)

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
