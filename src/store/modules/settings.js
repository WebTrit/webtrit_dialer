/* eslint-disable no-shadow */
const state = () => ({
  notificationsEnabled: false,
  soundEnabled: true,
  registerEnabled: true,
  mode: null,
})

const getters = {
  isNotificationsSupported() {
    return 'Notification' in window
  },
  isNotificationsDenied() {
    return 'Notification' in window && Notification.permission === 'denied'
  },
  isNotificationsEnabled(state) {
    return state.notificationsEnabled
  },
  isSoundEnabled(state) {
    return state.soundEnabled
  },
  isRegisterEnabled(state) {
    return state.registerEnabled
  },
  isMstMode(state) {
    return state.mode === 'mst'
  },
}

const mutations = {
  setNotificationsEnabled(state, flag) {
    state.notificationsEnabled = flag
  },
  setSoundEnabled(state, flag) {
    state.soundEnabled = flag
  },
  setRegisterEnabled(state, flag) {
    state.registerEnabled = flag
  },
  setMode(state, flag) {
    state.mode = flag
  },
}

// actions
const actions = {
  setNotificationsEnabled(context, flag) {
    context.commit('setNotificationsEnabled', flag)
    if (flag && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification requestPermission result:', permission)
      })
    }
  },
  setSoundEnabled(context, flag) {
    context.commit('setSoundEnabled', flag)
  },
  setRegisterEnabled(context, flag) {
    context.commit('setRegisterEnabled', flag)
  },
  setMode(context, mode) {
    context.commit('setMode', mode)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
