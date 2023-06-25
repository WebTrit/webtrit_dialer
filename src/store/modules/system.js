/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import axios from 'axios'

const state = () => ({
  info: null,
})

const getters = {
  info(state) {
    return state.info
  },
}

const mutations = {
  updateInfo(state, info) {
    state.info = info
  },
}

const actions = {
  async getInfo({ commit }) {
    const r = await axios.get('/system-info')
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
