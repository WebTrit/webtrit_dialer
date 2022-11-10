import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import ToggleVideoBtn from '@/components/Main/DialogCall/ToggleVideoBtn.vue'

config.showDeprecationWarnings = false

describe('ToggleVideoBtn.vue', () => {
  const localVue = createLocalVue()
  const mute = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ToggleVideoBtn, {
      localVue,
      data() {
        return {
          enabledSwitch: true,
        }
      },
      computed: {
        videoEnabled: {
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

  it('if video is enabled video icon is shown', async () => {
    wrapper.vm.videoEnabled = true
    await wrapper.vm.$nextTick()
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$video')
  })

  it('if video is disabled video-off icon is shown', async () => {
    wrapper.vm.videoEnabled = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$video-off')
  })

  it('if video is enabled mute is called with enabled === false', async () => {
    wrapper.vm.videoEnabled = true
    await wrapper.vm.$nextTick()
    wrapper.find('actionbtn-stub').trigger('click')
    expect(mute).toHaveBeenCalledWith({
      enabled: false, video: true,
    })
  })

  it('if video is disabled mute is called with enabled === true', async () => {
    wrapper.vm.videoEnabled = false
    await wrapper.vm.$nextTick()
    wrapper.find('actionbtn-stub').trigger('click')
    expect(mute).toHaveBeenCalledWith({
      enabled: true, video: true,
    })
  })
})
