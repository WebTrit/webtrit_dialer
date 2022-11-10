import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import TimePicker from '@/components/Call-History/TimePicker.vue'

config.showDeprecationWarnings = false

describe('TimePicker.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TimePicker, {
      localVue,
      propsData: {
        title: 'Date to',
      },
      mocks: {
        $t: (msg) => msg,
        $i18n: {
          locale: 'it',
        },
      },
      stubs: ['v-dialog', 'v-text-field', 'v-date-picker', 'v-spacer', 'v-btn'],
    })
  })

  it('currentLocale returns active locale', () => {
    expect(wrapper.vm.currentLocale).toBe('it')
  })

  it('save performs date saving actions', async () => {
    await wrapper.setData({
      date: '2020-05-12',
    })
    const save = jest.fn()
    wrapper.vm.$refs = {
      dialog: {
        save,
      },
      picker: {},
    }
    const spy_setDate = jest.spyOn(wrapper.vm, 'setDate')
    wrapper.vm.save()
    expect(wrapper.vm.savedDate).toEqual('2020-05-12')
    expect(save).toHaveBeenCalledWith('2020-05-12')
    expect(wrapper.emitted()['update-date']).toBeTruthy()
    expect(spy_setDate).toHaveBeenCalled()
  })

  it('close closes modal', () => {
    wrapper.vm.$refs = {
      picker: {},
    }
    const spy_setDate = jest.spyOn(wrapper.vm, 'setDate')
    wrapper.vm.close()
    expect(wrapper.vm.modal).toBe(false)
    expect(spy_setDate).toHaveBeenCalled()
  })

  it('setDate sets date into v-dialog $refs', async () => {
    await wrapper.setData({
      date: '2020-01-07',
    })
    wrapper.vm.$refs = {
      picker: {},
    }
    wrapper.vm.setDate()
    expect(wrapper.vm.$refs.picker.inputDay).toBe(7)
    expect(wrapper.vm.$refs.picker.inputMonth).toBe(1)
    expect(wrapper.vm.$refs.picker.inputYear).toBe(2020)
    expect(wrapper.vm.$refs.picker.tableDate).toBe('2020-01')
    expect(wrapper.vm.$refs.picker.activePicker).toBe('DATE')
  })

  it('currentDate matches current date in ISO string', () => {
    const res = wrapper.vm.currentDate()
    expect(res).toBe(new Date().toISOString().substr(0, 10))
  })

  it('clear restores TimePicker to initial state', () => {
    const save = jest.fn()
    wrapper.vm.$refs = {
      dialog: {
        save,
      },
    }
    wrapper.vm.clear()
    const date = new Date().toISOString().substr(0, 10)
    expect(wrapper.vm.date).toBe(date)
    expect(wrapper.vm.savedDate).toBe(undefined)
    expect(save).toHaveBeenCalledWith(date)
    expect(wrapper.emitted()['update-date']).toBeTruthy()
  })
})
