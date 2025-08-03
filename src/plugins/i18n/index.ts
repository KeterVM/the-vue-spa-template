import type { I18n, Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

export type MessageSchema = typeof en

export const SUPPORT_LOCALES = ['en', 'cn']

export function getLocale(i18n: I18n): string {
  return (i18n.global.locale as WritableComputedRef<string, string>).value
}

export function setLocale(i18n: I18n, locale: Locale): void {
  ;(i18n.global.locale as WritableComputedRef<string, string>).value = locale
}

export function setI18nLanguage(i18n: I18n, locale: Locale): void {
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

export async function loadLocaleMessages(i18n: I18n, locale: Locale) {
  // load locale messages
  const messages = await import(`./locales/${locale}.json`).then(getResourceMessages)

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages)

  return nextTick()
}

export const i18n = createI18n<[MessageSchema], 'en'>({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
})
