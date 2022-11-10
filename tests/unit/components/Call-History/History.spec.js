import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import History from '@/components/Call-History/History.vue'

config.showDeprecationWarnings = false

jest.mock('@/mixins', () => ({
  breakpoints: {},
  calls: {},
  errors: {},
}))

describe('History.vue', () => {
  const localVue = createLocalVue()
  const snackbarShow = jest.fn()
  const $_errors_parse = jest.fn().mockImplementation((err) => err.response.status)
  const fetchCallHistoryItems = jest.fn().mockImplementation(() => Promise.resolve())
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(History, {
      localVue,
      data() {
        return {
          date: {
            dateFrom: '2020-10-22',
            dateTo: '2020-10-23',
          },
          dataTableOptions: {
            page: 2,
            itemsPerPage: 10,
          },
          isCallActiveSwitch: false,
        }
      },
      computed: {
        callHistoryItems() {
          return [
            { id: 1, number: '123', call_recording_exist: true },
            { id: 2, number: '456' },
            { id: 3, number: '789' },
            { id: 4, number: '1010' },
          ]
        },
        callHistoryPagination() {
          return {
            itemsTotal: 35,
            itemsPerPage: 10,
          }
        },
        isCallActive: {
          get() {
            return this.isCallActiveSwitch
          },
          set(val) {
            this.isCallActiveSwitch = val
          },
        },
      },
      methods: {
        snackbarShow,
        $_errors_parse,
        fetchCallHistoryItems,
      },
      mocks: {
        $vuetify: {
          breakpoint: {},
        },
        $t: (msg) => msg,
      },
      stubs: ['v-data-table', 'v-btn', 'v-icon', 'v-progress-linear'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('pageLength returns page count for items', () => {
    expect(wrapper.vm.pageLength).toBe(4)
  })

  it('created hook calls fetchData', () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    History.created.call(wrapper.vm)
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('fetchData success case', async (done) => {
    jest.clearAllMocks()
    const spy_getParams = jest.spyOn(wrapper.vm, 'getParams')
    const spy_createPlayProgress = jest.spyOn(wrapper.vm, 'createPlayProgress')
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.fetchDataError).toBe(false)
      expect(spy_getParams).toHaveBeenCalled()
      expect(fetchCallHistoryItems).toHaveBeenCalledWith({
        dateFrom: '2020-10-22',
        dateTo: '2020-10-23',
        page: 2,
        itemsPerPage: 10,
      })
      expect(spy_createPlayProgress).toHaveBeenCalled()
      expect(snackbarShow).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('fetchData failure case with 404', async (done) => {
    jest.clearAllMocks()
    const spy_getParams = jest.spyOn(wrapper.vm, 'getParams')
    const err = {
      response: {
        status: 404,
      },
    }
    const fetchItems = jest.fn().mockImplementation(() => Promise.reject(err))
    wrapper.setMethods({
      fetchCallHistoryItems: fetchItems,
    })
    const spy_createPlayProgress = jest.spyOn(wrapper.vm, 'createPlayProgress')
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.fetchDataError).toBe(404)
      expect(spy_getParams).toHaveBeenCalled()
      expect(wrapper.vm.fetchCallHistoryItems).toHaveBeenCalledWith({
        dateFrom: '2020-10-22',
        dateTo: '2020-10-23',
        page: 2,
        itemsPerPage: 10,
      })
      expect(spy_createPlayProgress).not.toHaveBeenCalled()
      expect($_errors_parse).toHaveBeenCalledWith(err)
      expect(snackbarShow).toHaveBeenCalledWith({
        message: 404,
      })
      done()
    }, 0)
  })

  it('fetchData failure case with 401', async (done) => {
    jest.clearAllMocks()
    const spy_getParams = jest.spyOn(wrapper.vm, 'getParams')
    const err = {
      response: {
        status: 401,
      },
    }
    const fetchItems = jest.fn().mockImplementation(() => Promise.reject(err))
    wrapper.setMethods({
      fetchCallHistoryItems: fetchItems,
    })
    const spy_createPlayProgress = jest.spyOn(wrapper.vm, 'createPlayProgress')
    wrapper.vm.fetchData()
    setTimeout(() => {
      expect(wrapper.vm.fetchDataError).toBe(401)
      expect(spy_getParams).toHaveBeenCalled()
      expect(wrapper.vm.fetchCallHistoryItems).toHaveBeenCalledWith({
        dateFrom: '2020-10-22',
        dateTo: '2020-10-23',
        page: 2,
        itemsPerPage: 10,
      })
      expect(spy_createPlayProgress).not.toHaveBeenCalled()
      expect($_errors_parse).not.toHaveBeenCalled()
      expect(snackbarShow).not.toHaveBeenCalled()
      done()
    }, 0)
  })

  it('getParams returns params for fetch request', async () => {
    const res = wrapper.vm.getParams()
    expect(res).toEqual({
      dateFrom: '2020-10-22',
      dateTo: '2020-10-23',
      page: 2,
      itemsPerPage: 10,
    })
  })

  it('updateSearch updates search and calls fetchData', () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.updateSearch('new val')
    expect(wrapper.vm.search).toBe('new val')
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('updateDate updates date and calls fetchData', () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    const date = {
      dateFrom: '2021-10-22',
      dateTo: '2021-10-23',
    }
    wrapper.vm.updateDate(date)
    expect(wrapper.vm.date).toBe(date)
    expect(wrapper.vm.dataTableOptions.page).toBe(1)
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('updatePage updates page field in dataTableOptions', () => {
    wrapper.vm.updatePage(3)
    expect(wrapper.vm.dataTableOptions.page).toBe(3)
  })

  it('createPlayProgress creates playProgress for each item', () => {
    wrapper.vm.createPlayProgress()
    expect(wrapper.vm.playProgress).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    })
  })

  it('updatePlayProgress updates playProgress of item by id', async () => {
    await wrapper.setData({
      playProgress: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
      },
    })
    wrapper.vm.updatePlayProgress({ percentage: 15, id: 3 })
    expect(wrapper.vm.playProgress).toEqual({
      1: 0,
      2: 0,
      3: 15,
      4: 0,
    })
  })

  it('dataTableOptions watcher fetches data if page changes', async () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.dataTableOptions = {
      page: 3,
    }
    await wrapper.vm.$nextTick()
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('dataTableOptions watcher fetches data if itemPerPage changes', async () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.dataTableOptions = {
      itemsPerPage: 5,
    }
    await wrapper.vm.$nextTick()
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('dataTableOptions watcher doesn\'t fetch data if dataTableOptions has no changes', async () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.dataTableOptions = {
      page: 2,
      itemsPerPage: 10,
    }
    await wrapper.vm.$nextTick()
    expect(spy_fetchData).not.toHaveBeenCalled()
  })

  it('isCallActive watcher calls fetchData if isCallActive === false', async () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.isCallActive = true
    await wrapper.vm.$nextTick()
    wrapper.vm.isCallActive = false
    await wrapper.vm.$nextTick()
    expect(spy_fetchData).toHaveBeenCalled()
  })

  it('isCallActive watcher doesn\'t call fetchData if isCallActive === true', async () => {
    const spy_fetchData = jest.spyOn(wrapper.vm, 'fetchData')
    wrapper.vm.isCallActive = true
    await wrapper.vm.$nextTick()
    expect(spy_fetchData).not.toHaveBeenCalled()
  })

  it('search-update event calls updateSearch fn', () => {
    const spy_updateSearch = jest.spyOn(wrapper.vm, 'updateSearch')
    wrapper.find('historyappbar-stub').vm.$emit('search-update', 'new search')
    expect(spy_updateSearch).toHaveBeenCalledWith('new search')
  })

  it('get-call-records event calls updateDate fn', () => {
    const spy_updateDate = jest.spyOn(wrapper.vm, 'updateDate')
    wrapper.find('historyappbar-stub').vm.$emit('get-call-records', '2021-11-10')
    expect(spy_updateDate).toHaveBeenCalledWith('2021-11-10')
  })
})
