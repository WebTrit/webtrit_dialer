import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const defaultLanguage = 'en'

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

export function getMainLocale() {
  const supported = supportedLanguages()
  console.log('LOCALES:', supported)
  return process.env.VUE_APP_I18N_LOCALE && supported.includes(process.env.VUE_APP_I18N_LOCALE)
    ? process.env.VUE_APP_I18N_LOCALE : defaultLanguage
}

export function getFallbackLocale() {
  const supported = supportedLanguages()
  return process.env.VUE_APP_I18N_FALLBACK_LOCALE && supported.includes(process.env.VUE_APP_I18N_FALLBACK_LOCALE)
    ? process.env.VUE_APP_I18N_FALLBACK_LOCALE : defaultLanguage
}

export default new VueI18n({
  locale: getMainLocale(),
  fallbackLocale: getFallbackLocale(),
  messages: loadLocaleMessages(),
})
