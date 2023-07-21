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
const REQUEST_ID_PREFIX = 'DLR'
const REQUEST_ID_HEADER_NAME = 'X-Request-Id'

function generateRandomString(len = 16) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''
  for (let i = 0; i < len; i += 1) {
    const randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}

let identifier = window.localStorage.getItem(IDENTIFIER_KEY)
if (identifier === null) {
  identifier = generateRandomString()
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

const axiosInitPlugin = (store) => {
  axios.defaults.baseURL = envConfig.webtritCoreApiUrl

  axios.interceptors.request.use(
    (config) => {
      config.headers.set(REQUEST_ID_HEADER_NAME, `${REQUEST_ID_PREFIX}/${generateRandomString(24)}`, false)
      return config
    },
    (error) => {
      console.error('Request:', error)
      return Promise.reject(error)
    },
  )
  axios.interceptors.response.use(
    (response) => {
      console.log('Get response:', response)
      return response.status === 204 ? response.status : response.data
    },
    (error) => {
      console.log('Get error:', error)
      console.log('Get error1:', error.message)
      console.log('Get error2:', error.response)
      const router = require('@/router').default
      if (error.response !== undefined) {
        switch (error.response.status) {
          case 401:
            if (router.currentRoute.name !== 'Login' && !store.state.got401error) {
              store.commit('set401error', true)
              router.push({ name: 'Login' })
              store.dispatch('snackbar/show',
                { message: i18n.t('errors["not_authorized"]') },
                { root: true })
            }
            break
          case 405:
            break
          case 422:
            break
          case 500:
            break
          default:
            console.info('Error message:', error.message)
        }
      }
      throw error
    },
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
