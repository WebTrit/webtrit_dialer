import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import AudioCallBtn from '@/components/Shared/AudioCallBtn.vue'

config.showDeprecationWarnings = false

describe('AudioCallBtn.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(AudioCallBtn, {
      localVue,
      data() {
        return {
          registeredSwitch: true,
        }
      },
      propsData: {
        contact: {
          initials: 'AA',
          name: 'Name',
          number: '2344',
        },
        tel: '223',
      },
      computed: {
        isRegistered: {
          get() {
            return this.registeredSwitch
          },
          set(val) {
            this.registeredSwitch = val
          },
        },
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-btn', 'v-icon'],
    })
  })

  it('callContact triggers call action if contact prop is present', () => {
    const call = jest.fn().mockImplementation(() => Promise.resolve())
    const callFromKeypad = jest.fn()
    wrapper.setMethods({
      call,
      callFromKeypad,
    })
    wrapper.vm.callContact()
    expect(call).toHaveBeenCalledWith({
      number: '2344',
      name: 'Name',
      initials: 'AA',
      video: false,
    })
    expect(callFromKeypad).not.toHaveBeenCalled()
  })

  it('callContact triggers callFromKeypad if contact prop is not present', async () => {
    const call = jest.fn().mockImplementation(() => Promise.resolve())
    const callFromKeypad = jest.fn()
    wrapper.setMethods({
      call,
      callFromKeypad,
    })
    await wrapper.setProps({
      contact: null,
    })
    wrapper.vm.callContact()
    expect(callFromKeypad).toHaveBeenCalled()
    expect(call).not.toHaveBeenCalled()
  })

  it('callFromKeypad triggers call action', (done) => {
    const call = jest.fn().mockImplementation(() => Promise.resolve())
    wrapper.setMethods({
      call,
    })
    wrapper.vm.callFromKeypad()
    setTimeout(() => {
      expect(call).toHaveBeenCalledWith({
        number: '223',
        video: false,
      })
      expect(wrapper.emitted()['phone-error']).toBeFalsy()
      done()
    }, 0)
  })

  it('callFromKeypad triggers call action and hits failure case', (done) => {
    const error = {
      code: '401',
    }
    const call = jest.fn().mockImplementation(() => Promise.reject(error))
    wrapper.setMethods({
      call,
    })
    wrapper.vm.callFromKeypad()
    setTimeout(() => {
      expect(call).toHaveBeenCalledWith({
        number: '223',
        video: false,
      })
      expect(wrapper.emitted()['phone-error']).toBeTruthy()
      done()
    }, 0)
  })

  it('callFromKeypad doesn\'t trigger call action if tel is not provided', async (done) => {
    await wrapper.setProps({
      tel: '',
    })
    const call = jest.fn().mockImplementation(() => Promise.resolve())
    wrapper.setMethods({
      call,
    })
    wrapper.vm.callFromKeypad()
    setTimeout(() => {
      expect(call).not.toHaveBeenCalled()
      expect(wrapper.emitted()['phone-error']).toBeFalsy()
      done()
    }, 0)
  })

  it('callBtn is enabled if isRegistered is true', () => {
    expect(wrapper.find('v-btn-stub').attributes().disabled).toBeFalsy()
  })

  it('callBtn is disabled if isRegistered is false', async () => {
    wrapper.vm.isRegistered = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('v-btn-stub').attributes().disabled).toBeTruthy()
  })
})
