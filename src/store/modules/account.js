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
    return extendContactWithCalculatedProperties({ ...state.info })
  },
  login(state) {
    return state.info?.login
  },
  balance(state) {
    switch (state.info?.billing_model) {
      case 'debit':
        return `${state.info?.balance.toFixed(2)} ${state.info?.currency}` || null
      case 'credit':
        return state.info?.credit_limit && `${state.info?.credit_limit.toFixed(2)} ${state.info?.currency}` || null
      default:
        return null
    }
  },
}

const mutations = {
  updateToken(state, token) {
    state.token = token
  },
  updateInfo(state, info) {
    state.info = info
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
      commit('callHistory/setItems', [], { root: true })
      commit('contacts/setItems', [], { root: true })
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
