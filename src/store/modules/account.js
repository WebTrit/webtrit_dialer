/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import axios from 'axios'
import { extendContactWithCalculatedProperties } from '@/store/helpers'
import { envConfig } from '@/env-config'

const state = () => ({
  token: null,
  tenant_id: null,
  info: null,
  updateInterval: null,
})

const getters = {
  token(state) {
    return state.token
  },
  tenant_id(state) {
    return state.tenant_id
  },
  isLogin(state) {
    return !!state.token
  },
  isActive(state) {
    return state.info === null || state.info.status === undefined ? true : state.info.status === 'active'
  },
  info(state) {
    if (!state.info) {
      return null
    }
    return state.info
  },
  login(state) {
    return state.info?.number
  },
  balance(state) {
    let sum = '-'
    let type = '-'
    if (state.info && state.info.balance) {
      if (state.info.balance.balance_type === 'inapplicable') {
        sum = '∞'
      } else {
        sum = (`${state.info.balance.amount.toFixed(2) || ''} ${state.info.balance.currency || ''}`).trim()
      }
      type = state.info.balance.balance_type
    }
    return {
      sum,
      type,
    }
  },
}

const mutations = {
  updateToken(state, token) {
    state.token = token
  },
  updateTenantId(state, tenant_id) {
    state.tenant_id = tenant_id
  },
  updateInfo(state, info) {
    state.info = info && extendContactWithCalculatedProperties(info)
  },
  setUpdateInterval(state, ref) {
    state.updateInterval = ref
  },
  clearUpdateInterval(state) {
    if (state.updateInterval) {
      clearInterval(state.updateInterval)
      state.updateInterval = null
    }
  },
}

async function post_request(url, payload) {
  payload.bundle_id = null // getReverseLocalHost()
  return axios.post(url, payload)
}

const actions = {
  async requestOtpSignup(context, payload) {
    return post_request('/user', payload)
  },
  async requestOtpSignIn(context, payload) {
    return post_request('/session/otp-create', payload)
  },
  async requestSignIn(context, payload) {
    return post_request('/session', payload)
  },
  async requestOtpVerify(context, payload) {
    return post_request('/session/otp-verify', payload)
  },
  async storeAccessCredentials(context, data) {
    context.commit('updateToken', data.token)
    context.commit('updateTenantId', data.tenant_id)
  },
  async logout({ commit, dispatch }) {
    commit('clearUpdateInterval')
    try {
      await axios.delete('/session')
    } catch (e) {
      console.log(e.response.data)
    } finally {
      dispatch('webrtc/disconnect', { active: false }, { root: true })
      commit('callHistory/setItems', null, { root: true })
      commit('contacts/setItems', null, { root: true })
      commit('updateToken', null)
      commit('updateTenantId', null)
      commit('updateInfo', null)
    }
  },
  async initGetAccountInfo({ commit, dispatch }) {
    commit('clearUpdateInterval')
    dispatch('getAccountInfo')
    const interval = setInterval(async () => {
      dispatch('getAccountInfo')
    }, envConfig.updateAccountInfoInterval)
    commit('setUpdateInterval', interval)
  },
  async getAccountInfo({ commit }) {
    const r = await axios.get('/user')
    commit('updateInfo', r)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
