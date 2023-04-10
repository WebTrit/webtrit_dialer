/* eslint-disable no-shadow */
import axios from 'axios'
import {
  getInterlocutor, getInterlocutorNumber, getContact,
} from '@/store/helpers'

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
      const initialItems = state.items.filter((item) => item.cld !== 'Manual charge' && item.cld !== 'Manual credit')
      const itemsWithContactInfo = []
      initialItems.forEach((item) => {
        const interlocutor = getInterlocutor(item)
        const data = getInterlocutorNumber(interlocutor)
        const contact = getContact(data, rootGetters)
        const [date] = item.connect_time.match(/\S+/)
        item.date = date
        item.contactInfo = contact
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
      missed = getters.items.filter((item) => item.failed === true)
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
    state.pagination = pagination
  },
}

// actions
const actions = {
  async fetchItems(context, params) {
    const r = await axios.get('/account/call-history', {
      params,
    })
    context.commit('setItems', r.data)
    context.commit('setPagination', r.pagination)
  },
  async getCallRecord(context, id) {
    const r = await axios.get(`/account/call-record/${id}`, { responseType: 'blob' })
    return r
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
