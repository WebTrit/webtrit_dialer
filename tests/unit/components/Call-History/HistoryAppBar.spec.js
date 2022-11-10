import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import HistoryAppBar from '@/components/Call-History/HistoryAppBar.vue'

config.showDeprecationWarnings = false

describe('HistoryAppBar.vue', () => {
  const localVue = createLocalVue()
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(HistoryAppBar, {
      localVue,
      mocks: {
        $vuetify: { breakpoint: {} },
        $t: (msg) => msg,
      },
      stubs: ['v-tab'],
      methods: {
        snackbarShow,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('updateFromDate updates dateFrom in datePicker', () => {
    wrapper.vm.updateFromDate('2020-03-04')
    expect(wrapper.vm.date.dateFrom).toBe('2020-03-04T00:00:00.000Z')
  })

  it('updateFromDate sets dateFrom in datePicker to null in case falsy value is passed', () => {
    wrapper.vm.updateFromDate(undefined)
    expect(wrapper.vm.date.dateFrom).toBeNull()
  })

  it('updateToDate updates dateTo in datePicker', () => {
    wrapper.vm.updateToDate('2020-03-04')
    expect(wrapper.vm.date.dateTo).toBe('2020-03-04T23:59:59.999Z')
  })

  it('updateToDate sets dateTo in datePicker to null in case falsy value is passed', () => {
    wrapper.vm.updateToDate(undefined)
    expect(wrapper.vm.date.dateTo).toBeNull()
  })

  it('checkDateValidity - validation passes if only one date is passed (to or from)', () => {
    const date = {
      dateTo: '2020-03-04T23:59:59.999Z',
      dateFrom: null,
    }
    const result = wrapper.vm.checkDateValidity(date)
    expect(result).toBeTruthy()
    expect(snackbarShow).not.toHaveBeenCalled()
  })

  it(`checkDateValidity - validation passes if two dates are provided (to and from)
  and dateFrom is less than dateTo`, () => {
    const date = {
      dateTo: '2020-03-04T23:59:59.999Z',
      dateFrom: '2020-03-04T00:00:00.000Z',
    }
    const result = wrapper.vm.checkDateValidity(date)
    expect(result).toBeTruthy()
    expect(snackbarShow).not.toHaveBeenCalled()
  })

  it(`checkDateValidity - validation doesn't pass if two dates are provided (to and from)
  and dateFrom is bigger than dateTo`, () => {
    const date = {
      dateFrom: '2020-03-04T23:59:59.999Z',
      dateTo: '2020-03-04T00:00:00.000Z',
    }
    const result = wrapper.vm.checkDateValidity(date)
    expect(result).toBeFalsy()
    expect(snackbarShow).toHaveBeenCalled()
  })

  it('search watcher emits event once search gets updated', async () => {
    await wrapper.setData({
      search: 'test',
    })
    expect(wrapper.emitted()['search-update']).toBeTruthy()
  })

  it('date watcher emits event if date object changes and passes validity', async () => {
    await wrapper.setData({
      date: {
        dateTo: '2020-03-04T23:59:59.999Z',
        dateFrom: '2020-03-04T00:00:00.000Z',
      },
    })
    expect(wrapper.emitted()['get-call-records']).toBeTruthy()
  })

  it(`date watcher doesn't emit event if date object changes
  but doesn't pass validity`, async () => {
    await wrapper.setData({
      date: {
        dateFrom: '2020-03-04T23:59:59.999Z',
        dateTo: '2020-03-04T00:00:00.000Z',
      },
    })
    expect(wrapper.emitted()['get-call-records']).toBeFalsy()
  })
})
