import history from '@/store/modules/call-history'

import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

jest.mock('@/store/helpers', () => ({
  ...(jest.requireActual('@/store/helpers')),
  getInterlocutor: jest.fn().mockImplementation((item) => {
    item.interlocutor = 'interlocutor'
    return item
  }),
  getInterlocutorNumber: jest.fn().mockImplementation((item) => {
    item.number = '334'
    return item
  }),
  getContact: jest.fn().mockImplementation(() => 'contact'),
}))

describe('call-history.js getters', () => {
  it('pagination returns state.pagination', () => {
    const state = {
      pagination: 22,
    }
    expect(history.getters.pagination(state)).toBe(22)
  })

  it('missedItems returns getters.items with item.failed === true', () => {
    const getters = {
      items: [
        { id: 1, failed: true },
        { id: 2, failed: false },
        { id: 3, failed: true },
        { id: 4, failed: false },
      ],
    }
    expect(history.getters.missedItems({}, getters)).toEqual([
      { id: 1, failed: true },
      { id: 3, failed: true },
    ])
  })

  it('missedItems returns empty array if getters.items doesn\'t contain item.failed === true', () => {
    const getters = {
      items: [
        { id: 1, failed: false },
        { id: 2, failed: false },
        { id: 3, failed: false },
        { id: 4, failed: false },
      ],
    }
    expect(history.getters.missedItems({}, getters)).toEqual([])
  })

  it('items returns items with contact info', () => {
    const state = {
      items: [
        { cld: 'something', connect_time: '19-02-2020' },
      ],
    }
    const rootGetters = {
      'contacts/items': [
        { cld: 'something', connect_time: '19-02-2020' },
      ],
    }
    expect(history.getters.items(state, {}, {}, rootGetters)).toEqual([
      {
        cld: 'something',
        connect_time: '19-02-2020',
        contactInfo: 'contact',
        date: '19-02-2020',
        interlocutor: 'interlocutor',
        number: '334',
      },
    ])
  })

  it('items excludes items with item_cld === "Manual charge" || "manual credit"', () => {
    const items = [
      { cld: 'something', connect_time: '19-02-2020' },
      { cld: 'Manual charge', connect_time: '19-02-2020' },
      { cld: 'Manual credit', connect_time: '19-02-2020' },
    ]
    const state = {
      items,
    }
    const rootGetters = {
      'contacts/items': items,
    }
    expect(history.getters.items(state, {}, {}, rootGetters)).toEqual([
      {
        cld: 'something',
        connect_time: '19-02-2020',
        contactInfo: 'contact',
        date: '19-02-2020',
        interlocutor: 'interlocutor',
        number: '334',
      },
    ])
  })
})

describe('call-history.js mutations', () => {
  it('setItems sets items', () => {
    const state = {}
    history.mutations.setItems(state, [{ id: 1 }, { id: 3 }])
    expect(state.items).toEqual([
      { id: 1 }, { id: 3 },
    ])
  })

  it('setPagination sets pagination', () => {
    const state = {}
    history.mutations.setPagination(state, 12)
    expect(state.pagination).toBe(12)
  })
})

describe('call-history.js actions', () => {
  it('fetchItems gets and sets items and pagination', async (done) => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [{ id: 1 }, { id: 4 }, { id: 5 }],
        pagination: 29,
      },
    })
    const commit = jest.fn()
    await history.actions.fetchItems({ commit }, 'all')
    setTimeout(() => {
      expect(axios.get).toHaveBeenCalledWith('/account/call-history', { params: 'all' })
      expect(commit).toHaveBeenCalledWith('setItems', [{ id: 1 }, { id: 4 }, { id: 5 }])
      expect(commit).toHaveBeenCalledWith('setPagination', 29)
      done()
    }, 0)
  })

  it('getCallRecord gets and sets call record', async (done) => {
    axios.get.mockResolvedValueOnce({
      data: { id: 3 },
    })
    const res = await history.actions.getCallRecord({}, 3)
    setTimeout(() => {
      expect(axios.get).toHaveBeenCalledWith('/account/call-record/3', { responseType: 'blob' })
      expect(res).toEqual({ id: 3 })
      done()
    }, 0)
  })
})
