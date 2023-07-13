import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import transfer from '@/assets/icons/transfer.vue'
import attended from '@/assets/icons/attended.vue'
import { en, it } from 'vuetify/lib/locale'
import i18n from './i18n'

const DEFAULT_COLOR_PRIMARY = '#F5841F'
const DEFAULT_COLOR_SECONDARY = '#788D96'
const DEFAULT_COLOR_ACCENT = '#F5841F'
const DEFAULT_COLOR_SURFACE = '#4C86B7'

const paletteDefault = {
  primary: DEFAULT_COLOR_PRIMARY,
  secondary: DEFAULT_COLOR_SECONDARY,
  accent: DEFAULT_COLOR_ACCENT,
  surface: DEFAULT_COLOR_SURFACE,
}

const palette = Object.fromEntries(Object.entries({
  primary: process.env.VUE_APP_COLOR_PRIMARY,
  secondary: process.env.VUE_APP_COLOR_SECONDARY,
  accent: process.env.VUE_APP_COLOR_ACCENT,
  surface: process.env.VUE_APP_COLOR_SURFACE,
  error: process.env.VUE_APP_COLOR_ERROR,
  info: process.env.VUE_APP_COLOR_INFO,
  success: process.env.VUE_APP_COLOR_SUCCESS,
  warning: process.env.VUE_APP_COLOR_WARNING,
  anchor: process.env.VUE_APP_COLOR_ANCHOR,
}).filter((e) => e[1] != null && e[1].length > 0))

const light = { ...paletteDefault, ...palette }

/*
Inside templates:
 class="primary" === style="background-color:primary"
 class="primary--text" === style="color:primary"

Inside <style>
 background-color: var(--v-primary-base);
 color: var(--v-primary-base);
*/

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: { customProperties: true },
    themes: {
      light,
    },
  },
  icons: {
    values: {
      home: 'mdi-view-dashboard',
      contacts: 'mdi-contacts',
      'contacts-call-audio': 'mdi-phone',
      'contacts-call-video': 'mdi-video',
      'call-history': 'mdi-history',
      'call-history-accepted-incoming': 'mdi-phone-incoming',
      'call-history-accepted-outgoing': 'mdi-phone-outgoing',
      'call-history-accepted-forward': 'mdi-phone-forward',
      'call-history-declined': 'mdi-phone-cancel',
      'call-history-missed': 'mdi-phone-missed',
      'call-history-failed': 'mdi-phone-alert',
      'call-history-unknown': 'mdi-help',
      'call-history-download': 'mdi-download',
      'call-history-play': 'mdi-play',
      'call-history-pause': 'mdi-pause',
      'call-history-error': 'mdi-alert',
      'app-information': 'mdi-information-outline',
      settings: 'mdi-cog-outline',
      close: 'mdi-close',
      'contact-information': 'mdi-information',
      audio: 'mdi-phone',
      video: 'mdi-video',
      'video-off': 'mdi-video-off',
      drop: 'mdi-phone-hangup',
      'call-keypad': 'mdi-dialpad',
      refresh: 'mdi-refresh',
      star: 'mdi-star',
      edit: 'mdi-pencil',
      'three-dots': 'mdi-dots-horizontal',
      user: 'mdi-clipboard-account',
      'back-arrow': 'mdi-chevron-left',
      'arrow-down': 'mdi-menu-down',
      search: 'mdi-magnify',
      camera: 'mdi-camera',
      microphone: 'mdi-microphone',
      'microphone-off': 'mdi-microphone-off',
      circle: 'mdi-checkbox-blank-circle',
      logout: 'mdi-logout-variant',
      transfer: {
        component: transfer,
      },
      attended: {
        component: attended,
      },
      hold: 'mdi-pause',
    },
  },
  lang: {
    locales: { en, it },
    current: i18n.locale,
  },
})
