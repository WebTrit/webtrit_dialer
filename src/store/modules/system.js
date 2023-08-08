/* eslint-disable no-useless-catch */
/* eslint-disable no-shadow */
import axios from 'axios'

const state = () => ({
  info: null,
})

function isSupported(list, param) {
  return list ? !!(list.adapter?.supported?.includes(param)) : true
}

const getters = {
  info(state) {
    return state.info
  },
  isSupportedCallHistory(state) {
    return isSupported(state.info, 'callHistory')
  },
  isSupportedContacts(state) {
    return isSupported(state.info, 'extensions')
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
