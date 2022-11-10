import { shallowMount, createLocalVue } from '@vue/test-utils'
import Keypad from '@/components/Shared/Keypad.vue'

describe('Keypad.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Keypad, {
      localVue,
      stubs: ['v-btn'],
    })
  })

  it('click emits event with chosen key', () => {
    wrapper.vm.click(2)
    expect(wrapper.emitted()['keypad-click'][0]).toEqual([2])
  })
})
