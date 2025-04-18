/* eslint-disable no-shadow */
const state = () => ({
  visible: false,
  timeout: 7000,
  message: null,
  queue: [],
  processing: false,
})

const mutations = {
  enqueue(state, message) {
    state.queue.push(message)
  },
  dequeue(state) {
    state.queue.shift()
  },
  show(state, message) {
    state.visible = true
    state.message = message
  },
  hide(state) {
    state.visible = false
    state.message = null
  },
  setProcessing(state, status) {
    state.processing = status
  },
}

const actions = {
  async show({ state, commit }, { message }) {
    commit('enqueue', message)
    if (!state.processing) {
      const processNextMessage = async () => {
        if (state.queue.length === 0) {
          commit('setProcessing', false)
          return
        }

        const message = state.queue[0]
        commit('show', message)

        await new Promise((resolve) => setTimeout(resolve, state.timeout))

        commit('hide')
        commit('dequeue')

        await new Promise((resolve) => setTimeout(resolve, 200))

        await processNextMessage()
      }

      commit('setProcessing', true)

      await processNextMessage()
    }
  },

  hide({ commit }) {
    commit('hide')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
