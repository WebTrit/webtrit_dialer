import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import HoldBtn from '@/components/Main/DialogCall/HoldBtn.vue'

config.showDeprecationWarnings = false

describe('HoldBtn.vue', () => {
  const localVue = createLocalVue()
  const hold = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(HoldBtn, {
      localVue,
      propsData: {
        holdActive: false,
      },
      methods: {
        hold,
      },
      mocks: {
        $t: (msg) => msg,
      },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('if holdActive is enabled audio icon is shown', async () => {
    await wrapper.setProps({
      holdActive: true,
    })
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$audio')
  })

  it('if holdActive is disabled hold icon is shown', async () => {
    await wrapper.setProps({
      holdActive: false,
    })
    expect(wrapper.find('actionbtn-stub').attributes().icon).toBe('$hold')
  })

  it('holdCall executes hold action', async () => {
    wrapper.vm.holdCall()
    expect(hold).toHaveBeenCalledWith({
      active: false,
    })
    expect(wrapper.emitted()['update-hold-active'][0]).toEqual([true])
  })
})
