import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export function defaultLanguage() {
  return String(navigator.language).substring(0, 2)
}

export function supportedLanguages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const list = []
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      list.push(matched[1])
    }
  })
  return list
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || defaultLanguage(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || defaultLanguage(),
  messages: loadLocaleMessages(),
})
