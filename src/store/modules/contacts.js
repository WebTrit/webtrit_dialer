/* eslint-disable no-shadow */
import axios from 'axios'
import { extendContactWithCalculatedProperties } from '@/store/helpers'
import { envConfig } from '@/env-config'

export const DEFAULT_HOMEPAGE_CONTACTS_PER_PAGE = 10
export const DEFAULT_CONTACTS_PAGE_PER_PAGE = 25

function getCacheKey(params) {
  return `${params.page || 1}_${params.items_per_page || DEFAULT_HOMEPAGE_CONTACTS_PER_PAGE}_${params.search || ''}`
}

const state = () => ({
  items: undefined,
  favorites: JSON.parse(window.localStorage.getItem('favorites')) || {},
  loading: false,
  fetchError: false,
  updateInterval: null,
  pagination: {
    page: 1,
    itemsPerPage: 100,
    itemsTotal: undefined,
  },
  search: '',
  lookupCache: {},
  pageCache: {},
  initialized: false,
})

const getters = {
  items(state) {
    return state?.items && state.items.map((contact) => extendContactWithCalculatedProperties({ ...contact }))
  },
  pagination(state) {
    return state.pagination
  },
  search(state) {
    return state.search
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
  lookupContact(state) {
    // Capture cache reference to establish reactive dependency
    const cache = state.lookupCache
    return (number) => {
      const cached = cache[number]
      if (cached) {
        return extendContactWithCalculatedProperties({ ...cached })
      }
      return null
    }
  },
  initialized(state) {
    return state.initialized
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
  setUpdateInterval(state, ref) {
    state.updateInterval = ref
  },
  clearUpdateInterval(state) {
    if (state.updateInterval) {
      clearInterval(state.updateInterval)
      state.updateInterval = null
    }
  },
  setPagination(state, pagination) {
    state.pagination = {
      page: pagination.page,
      itemsPerPage: pagination.items_per_page,
      itemsTotal: pagination.items_total,
    }
  },
  setSearch(state, search) {
    state.search = search
  },
  addToLookupCache(state, contacts) {
    const newCache = { ...state.lookupCache }
    contacts.forEach((contact) => {
      const extended = extendContactWithCalculatedProperties({ ...contact })
      if (extended.number) {
        newCache[extended.number] = contact
      }
      if (extended.number_ext) {
        newCache[extended.number_ext] = contact
      }
    })
    state.lookupCache = newCache
  },
  addToLookupCacheByNumbers(state, { numbers, contacts }) {
    const newCache = { ...state.lookupCache }
    // Build a map of contacts by their numbers for quick lookup
    const contactsByNumber = {}
    contacts.forEach((contact) => {
      const extended = extendContactWithCalculatedProperties({ ...contact })
      if (extended.number) {
        contactsByNumber[extended.number] = contact
        newCache[extended.number] = contact
      }
      if (extended.number_ext) {
        contactsByNumber[extended.number_ext] = contact
        newCache[extended.number_ext] = contact
      }
    })
    // Mark all requested numbers as cached (null if not found)
    numbers.forEach((num) => {
      if (!(num in newCache)) {
        newCache[num] = contactsByNumber[num] || null
      }
    })
    state.lookupCache = newCache
  },
  clearLookupCache(state) {
    state.lookupCache = {}
  },
  setPageCache(state, { key, data }) {
    state.pageCache = { ...state.pageCache, [key]: data }
  },
  clearPageCache(state) {
    state.pageCache = {}
  },
  setInitialized(state) {
    state.initialized = true
  },
}

const actions = {
  async fetchItems(context, params = {}) {
    const requestParams = {
      page: params.page || 1,
      items_per_page: params.items_per_page || DEFAULT_HOMEPAGE_CONTACTS_PER_PAGE,
    }
    if (params.search) {
      requestParams.search = params.search
    }

    // Check cache first
    const cacheKey = getCacheKey(requestParams)
    const cached = context.state.pageCache[cacheKey]
    if (cached) {
      context.commit('setItems', cached.items)
      context.commit('setPagination', cached.pagination)
      if (params.search !== undefined) {
        context.commit('setSearch', params.search || '')
      }
      if (!context.state.initialized) {
        context.commit('setInitialized')
      }
      return
    }

    // Clear items only when switching views (different items_per_page)
    // Don't clear on search - it would break Recent Calls that depend on contacts
    const currentItemsPerPage = context.state.pagination.itemsPerPage
    const hasItems = context.state.items !== undefined && context.state.items.length > 0
    const viewChanged = currentItemsPerPage !== requestParams.items_per_page
    if (hasItems && viewChanged) {
      context.commit('setItems', undefined)
    }

    const r = await axios.get('/../v2/user/contacts', {
      params: requestParams,
    })
    context.commit('setItems', r.items)
    if (!context.state.initialized) {
      context.commit('setInitialized')
    }
    // Handle both paginated (v2) and non-paginated (v1) API responses
    const pagination = r.pagination || {
      page: requestParams.page,
      items_per_page: requestParams.items_per_page,
      items_total: r.items ? r.items.length : 0,
    }
    context.commit('setPagination', pagination)
    if (params.search !== undefined) {
      context.commit('setSearch', params.search || '')
    }
    if (r.items) {
      context.commit('addToLookupCache', r.items)
      // Store in cache
      context.commit('setPageCache', {
        key: cacheKey,
        data: { items: r.items, pagination },
      })
    }

    if (envConfig.updateContactsInterval > 0 && context.state.updateInterval == null) {
      const interval = setInterval(async () => {
        await context.dispatch('fetchItems', {
          page: context.state.pagination.page,
          items_per_page: context.state.pagination.itemsPerPage,
          search: context.state.search,
        })
      }, envConfig.updateContactsInterval)
      context.commit('setUpdateInterval', interval)
    }
  },
  async fetchContactsByNumbers(context, phoneNumbers) {
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return
    }
    const uncachedNumbers = phoneNumbers.filter(
      (num) => !(num in context.state.lookupCache),
    )
    if (uncachedNumbers.length === 0) {
      return
    }
    try {
      const r = await axios.get('/../v2/user/contacts', {
        params: {
          phone_numbers: uncachedNumbers.join(','),
        },
      })
      // Mark all requested numbers as cached (with null if not found)
      context.commit('addToLookupCacheByNumbers', {
        numbers: uncachedNumbers,
        contacts: r.items || [],
      })
    } catch (e) {
      // API may not support phone_numbers param yet, ignore error
      console.warn('fetchContactsByNumbers failed:', e)
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
