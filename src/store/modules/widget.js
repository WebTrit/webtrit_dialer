/* eslint-disable no-shadow */
let messageHandler = null

const state = () => ({
  isReady: false,
})

const getters = {}

const mutations = {
  setReady(state, flag) {
    state.isReady = flag
  },
}

const actions = {
  setupWidgetCommunication({ commit, dispatch, rootGetters }) {
    if (!rootGetters['settings/isWidgetMode']) return

    // Notify parent that widget iframe is ready
    window.parent.postMessage({ type: 'WIDGET_READY' }, '*')
    commit('setReady', true)

    // Listen for messages from parent
    messageHandler = (event) => {
      const { type, data, config } = event.data || {}

      switch (type) {
        case 'DIAL_NUMBER':
          if (data && data.phoneNumber) {
            dispatch('webrtc/call', {
              number: data.phoneNumber,
              name: data.phoneNumber,
              initials: '',
              video: !!data.video,
            }, { root: true })
          }
          break
        case 'WIDGET_CONFIG':
          // Config received from parent — can be used if needed
          console.log('[Widget] Config received:', config)
          break
        default:
          break
      }
    }

    window.addEventListener('message', messageHandler)
  },

  minimizeWidget({ rootGetters }) {
    if (!rootGetters['settings/isWidgetMode']) return
    window.parent.postMessage({ type: 'MINIMIZE_WIDGET' }, '*')
  },

  expandWidget({ rootGetters }) {
    if (!rootGetters['settings/isWidgetMode']) return
    window.parent.postMessage({ type: 'EXPAND_WIDGET' }, '*')
  },

  cleanup() {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler)
      messageHandler = null
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
