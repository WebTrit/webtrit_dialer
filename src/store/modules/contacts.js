/* eslint-disable no-shadow */
import axios from 'axios'
import { extendContactWithCalculatedProperties } from '@/store/helpers'

const state = () => ({
  items: undefined,
  favorites: JSON.parse(window.localStorage.getItem('favorites')) || {},
  loading: false,
  fetchError: false,
})

const getters = {
  items(state) {
    return state?.items && state.items.map((contact) => extendContactWithCalculatedProperties({ ...contact }))
  },
  pagination(state) {
    return state.pagination
  },
  favoriteNumbers(state, getters, rootState, rootGetters) {
    if (Object.keys(state.favorites).length === 0) {
      return []
    }
    const login = rootGetters['account/login']
    if (state.favorites[login]) {
      return state.favorites[login]
    } else {
      return []
    }
  },
  favoriteItems(state, getters) {
    return getters.items.filter((item) => getters.favoriteNumbers.includes(item.number))
  },
}

const mutations = {
  setItems(state, items) {
    state.items = items
  },
  updateLoading(state, val) {
    state.loading = val
  },
  updateFetchError(state, val) {
    state.fetchError = val
  },
  setFavoriteNumbers(state, { nums, login }) {
    state.favorites = { ...state.favorites, [login]: nums }
    window.localStorage.setItem('favorites', JSON.stringify(state.favorites))
  },
}

const actions = {
  async fetchItems(context, params) {
    const r = await axios.get('/user/contacts', {
      params,
    })
    context.commit('setItems', r.items)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
