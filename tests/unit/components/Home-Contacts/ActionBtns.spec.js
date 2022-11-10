import { shallowMount, createLocalVue } from '@vue/test-utils'
import ActionBtns from '@/components/Home-Contacts/ActionBtns.vue'

describe('ActionBtns.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ActionBtns, {
      localVue,
      stubs: ['v-row'],
    })
  })

  it('phone-error event emits new event for parent component', () => {
    wrapper.find('audiocallbtn-stub').vm.$emit('phone-error')
    expect(wrapper.emitted()['phone-error']).toBeTruthy()
  })
})
