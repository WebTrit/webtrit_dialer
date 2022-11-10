import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import i18n from '@/plugins/i18n'

import axios from 'axios'

import { envConfig } from '@/env-config'

import system from './modules/system'
import account from './modules/account'
import callHistory from './modules/call-history'
import contacts from './modules/contacts'
import ringtones from './modules/ringtones'
import settings from './modules/settings'
import snackbar from './modules/snackbar'
import webrtc from './modules/webrtc'
import callDuration from './modules/call-duration'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const IDENTIFIER_KEY = 'webtrit_ident'

function generateIdentifier() {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const len = 16
  let randomString = ''
  for (let i = 0; i < len; i += 1) {
    const randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}

let identifier = window.localStorage.getItem(IDENTIFIER_KEY)
if (identifier === null) {
  identifier = generateIdentifier()
  window.localStorage.setItem(IDENTIFIER_KEY, identifier)
}

const storePersist = new VuexPersistence({
  key: 'webtrit_dialer',
  storage: window.localStorage,
  reducer: (state) => ({
    account: { token: state.account.token },
    settings: state.settings,
  }),
  filter: (mutation) => (
    mutation.type === 'account/updateToken'
    || mutation.type.startsWith('settings')
  ),
})

function handle401Error({ error, store }) {
  const router = require('@/router').default
  if (router.currentRoute.name !== 'Login' && !store.state.got401error) {
    store.commit('set401error', true)
    router.push({ name: 'Login' })
    error.code = 'not_authorized'
    store.dispatch('snackbar/show',
      { message: i18n.t(`errors["${error.code}"]`) },
      { root: true })
  }
}

export function axiosRejectedResponseInterceptor({ error, store }) {
  function readAsText(blob) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => {
        resolve(fr.result)
      }
      fr.onerror = () => {
        reject(fr.error)
      }
      fr.readAsText(blob)
    })
  }
  if (error.message !== undefined) {
    store.dispatch('snackbar/show',
      { message: error.message },
      { root: true })
  }
  if (error.response !== undefined) {
    if (error.response.data instanceof Blob) {
      return readAsText(error.response.data)
        .then((data) => {
          if (error.response.data.type === 'application/json') {
            data = JSON.parse(data)
          }
          error.response.data = data
          return Promise.reject(error)
        })
    } else if (error.response.status === 401) {
      handle401Error({
        error,
        store,
      })
      return Promise.reject(error)
    }
  }
  return Promise.reject(error)
}

const axiosInitPlugin = (store) => {
  axios.defaults.baseURL = envConfig.webtritCoreApiUrl

  axios.interceptors.response.use(
    (response) => response,
    (error) => axiosRejectedResponseInterceptor({ error, store }),
  )

  const { token } = store.state.account
  if (token) {
    // eslint-disable-next-line dot-notation
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'account/updateToken') {
      if (mutation.payload) {
        // eslint-disable-next-line dot-notation
        axios.defaults.headers.common['Authorization'] = `Bearer ${mutation.payload}`
      } else {
        // eslint-disable-next-line dot-notation
        delete axios.defaults.headers.common['Authorization']
      }
    }
  })
}

export default new Vuex.Store({
  state: {
    dialogNumberVisibility: false,
    got401error: false,
    identifier: localStorage.getItem(IDENTIFIER_KEY),
  },
  getters: {
  },
  mutations: {
    toggleDialogNumberVisibility(state, val) {
      state.dialogNumberVisibility = val
    },
    set401error(state, val) {
      state.got401error = val
    },
  },
  actions: {
  },
  modules: {
    system,
    account,
    callHistory,
    contacts,
    ringtones,
    settings,
    snackbar,
    webrtc,
    callDuration,
  },
  plugins: [
    storePersist.plugin,
    axiosInitPlugin,
  ],
  strict: debug,
})
