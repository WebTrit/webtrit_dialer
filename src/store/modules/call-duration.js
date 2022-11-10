/* eslint-disable no-shadow */
const state = () => ({
  callDurationTimer: null,
  callDurationTimerStart: null,
  callDurationInSec: null,
})

const mutations = {
  setCallDurationTimerStart(state, data) {
    state.callDurationTimerStart = data
  },
  setCallDurationInSec(state, data) {
    state.callDurationInSec = data
  },
  setCallDurationTimer(state, data) {
    state.callDurationTimer = data
  },
}

const actions = {
  startCallDuration({ state, commit }) {
    commit('setCallDurationTimerStart', Date.now())
    const callDurationTimer = window.setInterval(() => {
      const delta = Date.now() - state.callDurationTimerStart
      commit('setCallDurationInSec', (Math.floor(delta / 1000)))
    }, 1000)
    commit('setCallDurationTimer', callDurationTimer)
  },
  stopCallDuration({ state, commit }) {
    window.clearInterval(state.callDurationTimer)
    commit('setCallDurationTimer', null)
    commit('setCallDurationTimerStart', null)
    commit('setCallDurationInSec', null)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
