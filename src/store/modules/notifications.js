/* eslint-disable no-shadow */
import i18n from '@/plugins/i18n'

const state = () => ({
  notifications: {},
})

const getters = {
  getNotification(state) {
    return (call_id) => state.notifications[call_id]
  },
}

const mutations = {
  setNotification(state, { call_id, notification }) {
    state.notifications[call_id] = notification
  },
  deleteNotification(state, { call_id }) {
    delete state.notifications[call_id]
  },
}

const actions = {
  displayNotification(context, { call_id, number, name }) {
    if (!context.rootGetters['settings/isNotificationsEnabled']) return
    const notification = new Notification(i18n.t('call.incoming'), {
      body: number + (name ? `\n${name}` : ''),
      requireInteraction: true,
      renotify: true,
      tag: call_id,
    })
    notification.onshow = (event) => {
      const notification = event.target
      const call_id = notification.tag
      context.commit('setNotification', { call_id, notification })
    }
    notification.onclick = (event) => {
      window.focus()
      event.target.close()
    }
    notification.onclose = (event) => {
      const notification = event.target
      const call_id = notification.tag
      context.commit('deleteNotification', { call_id })
    }
    notification.onerror = (event) => {
      console.error('Error display Notification', event)
    }
  },
  closeNotification(context, { call_id }) {
    const notification = context.getters.getNotification(call_id)
    if (notification) {
      notification.close()
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
