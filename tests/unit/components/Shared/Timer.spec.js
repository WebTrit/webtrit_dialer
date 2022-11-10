import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import Timer from '@/components/Shared/Timer.vue'

config.showDeprecationWarnings = false

jest.useFakeTimers()

describe('Timer.vue', () => {
  const localVue = createLocalVue()
  localVue.filter('formatTime', (data) => `${data}:00:00`)
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Timer, {
      localVue,
      data() {
        return {
          callDurationTimerSwitch: null,
          callDurationInSecSwitch: null,
        }
      },
      computed: {
        callDurationTimer: {
          get() {
            return this.callDurationTimerSwitch
          },
          set(val) {
            this.callDurationTimerSwitch = val
          },
        },
        callDurationInSec: {
          get() {
            return this.callDurationInSecSwitch
          },
          set(val) {
            this.callDurationInSecSwitch = val
          },
        },
      },
    })
  })

  it('if callDurationTimer is not provided 00:00:00 is rendered', () => {
    expect(wrapper.find('p').text()).toBe('00:00:00')
  })

  it('if callDurationInSec is not provided 00:00:00 is rendered', async () => {
    wrapper.vm.callDurationTimer = 1
    await wrapper.vm.$nextTick()
    expect(wrapper.find('p').text()).toBe('00:00:00')
  })

  it('if callDurationTimer and callDurationInSec are provided formatted time is rendered', async () => {
    wrapper.vm.callDurationTimer = 1
    wrapper.vm.callDurationInSec = 23
    await wrapper.vm.$nextTick()
    expect(wrapper.find('p').text()).toBe('23:00:00')
  })
})
