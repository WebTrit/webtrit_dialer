import { mount, createLocalVue, config } from '@vue/test-utils'
import RecentCalls from '@/components/Home-Recent-Calls/RecentCalls.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('RecentCalls.vue', () => {
  const localVue = createLocalVue()
  const fetchCallHistoryItems = jest.fn().mockImplementation(() => Promise.resolve)
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = mount(RecentCalls, {
      localVue,
      computed: {
        callHistoryItems() {
          return [
            { id: 345, date: '20-08-2021' },
            { id: 8993, date: '20-08-2021' },
          ]
        },
        missedItems() {
          return [
            { id: 3434, date: '20-08-2021' },
            { id: 55445, date: '20-08-2021' },
          ]
        },
      },
      methods: {
        fetchCallHistoryItems,
        snackbarShow,
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: {
        'v-data-table': '<div></div>',
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('created hook calls fetchData fn', () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    RecentCalls.created.call(wrapper.vm)
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('filterHistory assings fiter to variable', () => {
    wrapper.vm.filterHistory('missed')
    expect(wrapper.vm.filter).toBe('missed')
  })

  it('historyItems returns callHistoryItems if filter === "all"', () => {
    expect(wrapper.vm.historyItems).toEqual([
      { id: 345, date: '20-08-2021' },
      { id: 8993, date: '20-08-2021' },
    ])
  })

  it('historyItems returns missedItems if filter !== "all"', async () => {
    wrapper.setData({
      filter: 'missed',
    })
    expect(wrapper.vm.historyItems).toEqual([
      { id: 3434, date: '20-08-2021' },
      { id: 55445, date: '20-08-2021' },
    ])
  })

  it('fetchData success case', async (done) => {
    fetchCallHistoryItems.mockClear()
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.fetchDataError).toBe(false)
      expect(fetchCallHistoryItems).toHaveBeenCalledWith({
        page: 1,
        itemsPerPage: 100,
      })
      expect(snackbarShow).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('fetchData fail case, error status 500', async (done) => {
    const error = {
      response: {
        status: 500,
      },
      code: 'code',
    }
    wrapper.vm.fetchCallHistoryItems = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.fetchCallHistoryItems).toHaveBeenCalledWith({
        page: 1,
        itemsPerPage: 100,
      })
      expect(wrapper.vm.fetchDataError).toBe(500)
      expect(snackbarShow).toHaveBeenCalled()
      done()
    }, 0)
  })

  it('fetchData fail case, error status 405', async (done) => {
    const error = {
      response: {
        status: 405,
      },
      code: 'code',
    }
    wrapper.vm.fetchCallHistoryItems = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.fetchCallHistoryItems).toHaveBeenCalledWith({
        page: 1,
        itemsPerPage: 100,
      })
      expect(wrapper.vm.fetchDataError).toBe(405)
      expect(snackbarShow).not.toHaveBeenCalled()
      done()
    }, 0)
  })
})
