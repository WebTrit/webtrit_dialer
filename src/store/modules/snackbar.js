/* eslint-disable no-shadow */
const state = () => ({
  visible: false,
  timeout: 5000,
  message: null,
})

const mutations = {
  show(state, message) {
    state.visible = true
    state.message = message
  },
  hide(state) {
    state.visible = false
    state.message = null
  },
}

const actions = {
  async show({ state, commit }, { message }) {
    if (state.visible) {
      commit('hide')
      await new Promise((r) => setTimeout(r, 200))
    }
    commit('show', message)
  },
  hide({ state, commit }) {
    if (state.visible) {
      commit('hide')
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
