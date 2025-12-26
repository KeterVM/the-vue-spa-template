import { nextTick } from 'vue'
import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { z } from 'zod'
import { en as zodEn, zhCN as zodZhCN } from 'zod/locales'
import en from './locales/en.json'

export type MessageSchema = typeof en

const DEFAULT_LOCALE = 'en'

export const SUPPORT_LOCALES: { lang: string; label: string; icon: string }[] = [
  { lang: 'en', label: 'English', icon: 'i-flag-us-4x3' },
  { lang: 'zh-cn', label: '简体中文', icon: 'i-flag-cn-4x3' },
  { lang: 'zh-tw', label: '繁體中文', icon: 'i-flag-tw-4x3' },
]

const ZOD_LOCALE_MAP: Record<string, () => Partial<z.core.$ZodConfig>> = {
  en: zodEn,
  zhCN: zodZhCN,
}

export function getLocale(): string {
  return i18n.global.locale.value
}

export async function setI18nLanguage(locale: Locale) {
  if (!i18n.global.availableLocales.includes(locale)) {
    await loadLocaleMessages(locale)
  }
  i18n.global.locale.value = locale
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale)
  localStorage.setItem('language', locale)
  const zodLocaleFn = ZOD_LOCALE_MAP[locale as string] ?? zodEn
  z.config(zodLocaleFn())
}

const getResourceMessages = (r: unknown) => {
  if (!r) return
  if (Reflect.get(r, 'default')) return Reflect.get(r, 'default')
  return r
}

export async function loadLocaleMessages(locale: Locale) {
  // load locale messages
  const messages = await import(`./locales/${locale}.json`).then(getResourceMessages)

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}

function getI18nLocale() {
  const locale = localStorage.getItem('language') || DEFAULT_LOCALE
  for (const l of SUPPORT_LOCALES) {
    const value = l.lang as string
    if (value === locale) {
      return locale // A language pack for the current language exists
    } else if (value.indexOf(locale) === 0) {
      return value // A language pack that exists in any locale of the current language
    }
  }
  return DEFAULT_LOCALE // Use the default language pack
}

export const i18n = createI18n<[MessageSchema], string, false>({
  locale: getI18nLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
  },
})

setI18nLanguage(getI18nLocale())
