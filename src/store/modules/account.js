/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import axios from 'axios'
import { extendContactWithCalculatedProperties } from '@/store/helpers'
import { envConfig } from '@/env-config'

const state = () => ({
  token: null,
  info: null,
  updateInterval: null,
})

const getters = {
  token(state) {
    return state.token
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
    if (state.info && state.info.balance) {
      if (state.info.balance.balance_type === 'inapplicable') {
        sum = '∞'
      } else {
        sum = (`${state.info.balance.amount.toFixed(2) || ''} ${state.info.balance.currency || ''}`).trim()
      }
    }
    return {
      sum,
      type: state.info.balance.balance_type,
    }
  },
}

const mutations = {
  updateToken(state, token) {
    state.token = token
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

const actions = {
  async requestOtpSignup(context, payload) {
    return axios.post('/user', payload)
  },
  async requestOtpSignIn(context, payload) {
    return axios.post('/session/otp-create', payload)
  },
  async requestSignIn(context, payload) {
    const r = await axios.post('/session', payload)
    return r.token
  },
  async requestOtpVerify(context, payload) {
    const r = await axios.post('/session/otp-verify', payload)
    return r.token
  },
  async storeToken(context, token) {
    context.commit('updateToken', token)
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
