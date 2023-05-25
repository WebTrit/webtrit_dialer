/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import axios from 'axios'
import { extendContactWithCalculatedProperties } from '@/store/helpers'

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
    state.updateInterval = null
  },
}

const actions = {
  async requestDemoOtp(context, payload) {
    const r = await axios.post('/session/otp-request-demo', payload)
    return r.otp_id
  },
  async requestOtp(context, payload) {
    const r = await axios.post('/session/otp-request', payload)
    return r.otp_id
  },
  async verifyOtp(context, payload) {
    const r = await axios.post('/session/otp-verify', payload)
    return r.token
  },
  async requestLogin(context, payload) {
    const r = await axios.post('/session', payload)
    return r.token
  },
  async storeToken(context, token) {
    context.commit('updateToken', token)
  },
  async logout({ state, commit, dispatch }) {
    if (state.updateInterval) {
      clearInterval(state.updateInterval)
      commit('clearUpdateInterval')
    }
    try {
      await axios.delete('/session')
    } catch (e) {
      console.log(e.response.data)
    } finally {
      dispatch('webrtc/disconnect', { active: false }, { root: true })
      commit('callHistory/setItems', [], { root: true })
      commit('updateToken', null)
      commit('updateInfo', null)
    }
  },
  async getInfo({ commit, dispatch }) {
    const r = await axios.get('/account/info')
    commit('updateInfo', r.data)
    dispatch('updateAccountInfo')
  },
  async updateAccountInfo({ state, commit }) {
    if (!state.updateInterval) {
      const interval = setInterval(async () => {
        const r = await axios.get('/account/info')
        commit('updateInfo', r.data)
      }, 60000)
      commit('setUpdateInterval', interval)
    } else {
      const r = await axios.get('/account/info')
      commit('updateInfo', r.data)
    }
  },
  async editInfo({ commit }, data) {
    await axios.patch('/account/info', data)
    const r = await axios.get('/account/info')
    commit('updateInfo', r.data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
