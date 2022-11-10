import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import ToggleAudioBtn from '@/components/Main/DialogCall/ToggleAudioBtn.vue'

config.showDeprecationWarnings = false

describe('ToggleAudioBtn.vue', () => {
  const localVue = createLocalVue()
  const mute = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ToggleAudioBtn, {
      localVue,
      data() {
        return {
          enabledSwitch: true,
        }
      },
      computed: {
        audioEnabled: {
          get() {
            return this.enabledSwitch
          },
          set(val) {
            this.enabledSwitch = val
          },
        },
      },
      methods: {
        mute,
      },
      mocks: {
        $t: (msg) => msg,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('if audio is enabled audio icon is shown', async () => {
    wrapper.vm.audioEnabled = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$microphone')
  })

  it('if audio is disabled audio-off icon is shown', async () => {
    wrapper.vm.audioEnabled = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$microphone-off')
  })

  it('if audio is enabled mute is called with enabled === false', async () => {
    wrapper.vm.audioEnabled = true
    await wrapper.vm.$nextTick()
    wrapper.find('actionbtn-stub').trigger('click')
    expect(mute).toHaveBeenCalledWith({
      enabled: false, video: false,
    })
  })

  it('if audio is disabled mute is called with enabled === true', async () => {
    wrapper.vm.audioEnabled = false
    await wrapper.vm.$nextTick()
    wrapper.find('actionbtn-stub').trigger('click')
    expect(mute).toHaveBeenCalledWith({
      enabled: true, video: false,
    })
  })
})
