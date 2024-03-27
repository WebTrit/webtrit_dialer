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
    account: {
      token: state.account.token,
      tenant_id: state.account.tenant_id,
    },
    settings: state.settings,
  }),
  filter: (mutation) => (
    mutation.type === 'account/updateToken'
    || mutation.type === 'account/updateTenantId'
    || mutation.type.startsWith('settings')
  ),
})

const axiosInitPlugin = (store) => {
  const CORE_API_PREFIX = 'api/v1'
  const baseUrl = envConfig.webtritCoreApiUrl

  axios.interceptors.request.use(
    (config) => {
      config.headers.set(REQUEST_ID_HEADER_NAME, `${REQUEST_ID_PREFIX}/${generateRandomString(24)}`, false)
      const { tenant_id } = store.state.account
      if (tenant_id) {
        const pattern = new RegExp('(tenant)\\/([^$\\/]*)/?')
        if (pattern.test(baseUrl.pathname)) {
          baseUrl.pathname = baseUrl.pathname.replace(pattern, `$1/${tenant_id}/`)
        } else {
          baseUrl.pathname = `tenant/${tenant_id}${baseUrl.pathname}`
        }
      }
      config.baseURL = `${baseUrl}${CORE_API_PREFIX}`
      return config
    },
    (error) => {
      console.error('Request:', error)
      return Promise.reject(error)
    },
  )
  axios.interceptors.response.use(
    (response) => {
      console.log('API response:', response)
      return response.status === 204 ? response.status : response.data
    },
    async (error) => {
      console.error('API Error:', error.message, error.response)
      const router = require('@/router').default
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
          case 404:
            if (!store.state.got401error) {
              if (router.currentRoute.name === 'Login' || store.getters['account/isLogout']) {
                // Send error to next error handler
                // For errors: incorrect_credentials
                return Promise.reject(error)
              } else {
                // Terminate session for errors:
                // authorization_header_missing, bearer_credentials_missing,
                // token_invalid, token_expired, session_missing, session_issue, unknown
                store.commit('set401error', true)
                await store.dispatch('account/logout', { force: true }, { root: true })
                await router.push({ name: 'Login' })
                let message
                switch (error.response.data?.code) {
                  case 'password_change_required':
                    message = i18n.t('errors.password_has_expired')
                    break
                  case 'login_and_password_required':
                    message = i18n.t('errors.login_or_password_required')
                    break
                  default:
                    message = i18n.t('errors.not_authorized')
                }
                store.dispatch('snackbar/show', { message }, { root: true })
              }
            }
            break
          case 405:
            store.dispatch('snackbar/show',
              { message: i18n.t('errors.method_not_allowed') },
              { root: true })
            break
          case 422:
            // Send error to next error handler
            return Promise.reject(error)
          case 500:
            // Show pop-up with error and return nothing
            if (error.response.data?.code === 'external_api_issue') {
              store.dispatch('snackbar/show',
                { message: i18n.t('errors.external_api_issue') },
                { root: true })
            } else {
              store.dispatch('snackbar/show',
                { message: i18n.t('errors.internal_api_issue') },
                { root: true })
            }
            break

          default:
            store.dispatch('snackbar/show',
              { message: i18n.t('errors.unknown_error') },
              { root: true })
        }
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(null)
      } else {
        // There should be errors generated by the browser itself
        // most often it Error type
        throw error
      }
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
