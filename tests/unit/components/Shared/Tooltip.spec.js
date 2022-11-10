import { shallowMount, createLocalVue } from '@vue/test-utils'
import Tooltip from '@/components/Shared/Tooltip.vue'

describe('Tooltip.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Tooltip, {
      localVue,
      propsData: {
        activatorWidthLimit: 80,
        disableTooltips: false,
        bottom: false,
      },
      directives: {
        tooltip: jest.fn(),
      },
      stubs: ['v-tooltip'],
    })
  })

  it('tooltip is in top position when bottom === false', () => {
    expect(wrapper.find('v-tooltip-stub').attributes().top).toBe('true')
    expect(wrapper.find('v-tooltip-stub').attributes().bottom).toBeFalsy()
  })

  it('tooltip is in bottom position when bottom === true', async () => {
    await wrapper.setProps({
      bottom: true,
    })
    expect(wrapper.find('v-tooltip-stub').attributes().bottom).toBe('true')
    expect(wrapper.find('v-tooltip-stub').attributes().top).toBeFalsy()
  })

  it('textTruncated returns true if disableTooltips === false', () => {
    expect(wrapper.vm.textTruncated).toBe(true)
  })

  it('if textTruncated is true tooltip is not disabed', () => {
    expect(wrapper.find('v-tooltip-stub').attributes().disabled).toBeFalsy()
  })
})
