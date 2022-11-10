import contacts from '@/store/modules/contacts'

import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

jest.mock('@/store/helpers', () => ({
  ...(jest.requireActual('@/store/helpers')),
  extendContactWithCalculatedProperties: jest.fn().mockImplementation((data) => {
    data.initials = 'AA'
    return data
  }),
}))

// eslint-disable-next-line func-names
const localStorageMock = (function () {
  let storage = {}
  return {
    getItem(key) {
      return storage[key]
    },
    setItem(key, value) {
      storage[key] = value.toString()
    },
    clear() {
      storage = {}
    },
    removeItem(key) {
      delete storage[key]
    },
  }
}())
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('contacts.js getters', () => {
  it('items returns extended items', () => {
    const state = {
      items: [
        { id: 3 },
      ],
    }
    expect(contacts.getters.items(state)).toEqual([
      { id: 3, initials: 'AA' },
    ])
  })

  it('pagination returns state.pagination', () => {
    const state = {
      pagination: 22,
    }
    expect(contacts.getters.pagination(state)).toBe(22)
  })

  it('favoriteItems returns items that are in favorite numbers', () => {
    const getters = {
      favoriteNumbers: ['3434', '7576', '7686'],
      items: [
        { id: 3, number: '3434' },
        { id: 5, number: '7686' },
        { id: 2, number: '1212' },
      ],
    }
    expect(contacts.getters.favoriteItems({}, getters)).toEqual([
      { id: 3, number: '3434' },
      { id: 5, number: '7686' },
    ])
  })

  it('favoriteNumbers gets saved favorites from localStorage', () => {
    const state = {
      favorites: {
        83948: ['3434', '656343', '9989'],
      },
    }
    const rootGetters = {
      'account/login': 83948,
    }
    expect(contacts.getters.favoriteNumbers(state, {}, {}, rootGetters)).toEqual(['3434', '656343', '9989'])
  })

  it('favoriteNumbers returns [] if there are no saved favorites', () => {
    const state = {
      favorites: {},
    }
    const rootGetters = {
      'account/login': 83948,
    }
    expect(contacts.getters.favoriteNumbers(state, {}, {}, rootGetters)).toEqual([])
  })

  it('favoriteNumbers returns [] if there are no saved favorites for current number', () => {
    const state = {
      favorites: {
        83948: ['3434', '656343', '9989'],
      },
    }
    const rootGetters = {
      'account/login': 2323,
    }
    expect(contacts.getters.favoriteNumbers(state, {}, {}, rootGetters)).toEqual([])
  })
})

describe('contacts.js mutations', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('setItems sets items', () => {
    const state = {}
    contacts.mutations.setItems(state, [{ id: 1 }, { id: 3 }])
    expect(state.items).toEqual([
      { id: 1 }, { id: 3 },
    ])
  })

  it('updateLoading sets loading', () => {
    const state = {}
    contacts.mutations.updateLoading(state, true)
    expect(state.loading).toBe(true)
  })

  it('updateFetchError sets error', () => {
    const state = {}
    contacts.mutations.updateFetchError(state, '404')
    expect(state.fetchError).toBe('404')
  })

  it(`setFavoriteNumbers sets favorite numbers to local storage -
  current user already has saved favorite numbers case`, () => {
    const state = {
      favorites: {
        938839: ['334', '65676'],
        34349: ['23232', '34343'],
      },
    }
    const nums = ['334', '65676', '3434']
    const login = '938839'
    contacts.mutations.setFavoriteNumbers(state, { nums, login })
    expect(localStorage.getItem('favorites')).toEqual(JSON.stringify({
      938839: ['334', '65676', '3434'],
      34349: ['23232', '34343'],
    }))
  })

  it(`setFavoriteNumbers sets favorite numbers to local storage -
  current user already has no saved favorite numbers case`, () => {
    const state = {
      favorites: {
        34349: ['23232', '34343'],
      },
    }
    const nums = ['334', '65676', '3434']
    const login = '938839'
    contacts.mutations.setFavoriteNumbers(state, { nums, login })
    expect(localStorage.getItem('favorites')).toEqual(JSON.stringify({
      938839: ['334', '65676', '3434'],
      34349: ['23232', '34343'],
    }))
  })
})

describe('contacts.js actions', () => {
  it('fetchItems gets and sets items', (done) => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 1 }, { id: 4 }, { id: 5 }],
      },
    })
    const commit = jest.fn()
    const context = {
      commit,
    }
    contacts.actions.fetchItems(context, 'all')
    setTimeout(() => {
      expect(axios.get).toHaveBeenCalledWith('/account/contacts', {
        params: 'all',
      })
      expect(commit).toHaveBeenCalledWith('setItems', [{ id: 1 }, { id: 4 }, { id: 5 }])
      done()
    }, 0)
  })
})
