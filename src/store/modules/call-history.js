/* eslint-disable no-shadow */
import axios from 'axios'
import {
  getInterlocutor, getContact, pickOutInitials, extendContactWithCalculatedProperties,
} from '@/store/helpers'
import i18n from '@/plugins/i18n'

// initial state
const state = () => ({
  items: undefined,
  pagination: {
    page: undefined,
    itemsPerPage: undefined,
    itemsTotal: undefined,
  },
})

// getters
const getters = {
  items(state, getters, rootState, rootGetters) {
    if (rootGetters['contacts/items']?.length > 0 && state?.items?.length > 0) {
      const initialItems = state.items.filter((item) => !(['Manual charge', 'Manual credit'].includes(item.callee)))
      const itemsWithContactInfo = []
      initialItems.forEach((item, index) => {
        const date = new Date(item.connect_time)
        date.setHours(0, 0, 0, 0)
        item.date = date.toISOString()
        item.index = index + 1
        const interlocutor = getInterlocutor(item)
        if (!interlocutor || interlocutor.number === null) {
          const name = interlocutor.display_name || i18n.t('call.Unknown')
          item.contactInfo = {
            number: '',
            number_ext: '',
            name,
            initials: pickOutInitials(name),
            registration_color: 'gray',
          }
        } else {
          const contact = getContact(interlocutor, rootGetters)
          if (contact) {
            item.contactInfo = extendContactWithCalculatedProperties(contact)
          } else {
            const name = interlocutor.display_name || interlocutor.number
            const number = interlocutor.display_name ? interlocutor.number : ''
            item.contactInfo = {
              number,
              number_ext: '',
              name,
              initials: pickOutInitials(name),
              registration_color: 'gray',
            }
          }
        }
        itemsWithContactInfo.push(item)
      })
      return itemsWithContactInfo
    } else {
      return []
    }
  },
  missedItems(state, getters) {
    let missed = []
    if (getters.items) {
      missed = getters.items.filter((item) => item.direction === 'incoming' && item.status === 'missed')
    }
    return missed.length > 0 ? missed.slice(0, 10) : []
  },
  pagination(state) {
    return state.pagination
  },
}

// mutations
const mutations = {
  setItems(state, items) {
    state.items = items
  },
  setPagination(state, pagination) {
    state.pagination = {
      page: pagination.page,
      itemsPerPage: pagination.items_per_page,
      itemsTotal: pagination.items_total,
    }
  },
}

// actions
const actions = {
  async fetchItems(context, params) {
    const r = await axios.get('/user/history', {
      params,
    })
    context.commit('setItems', r.items)
    context.commit('setPagination', r.pagination)
  },
  async getCallRecord(context, id) {
    return axios.get(`/user/recordings/${id}`, { responseType: 'blob' })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
