import { shallowMount, createLocalVue } from '@vue/test-utils'
import PhoneInput from '@/components/Shared/PhoneInput.vue'

describe('PhoneInput.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PhoneInput, {
      localVue,
      propsData: {
        number: '94859',
        phoneNumberMaxLength: 11,
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-text-field'],
    })
  })

  it('phoneNumber returns number', () => {
    expect(wrapper.vm.phoneNumber).toBe('94859')
  })

  it('phoneNumber setter emits event to parent', () => {
    wrapper.vm.phoneNumber = '9088'
    expect(wrapper.emitted()['update-phone-number'][0]).toEqual(['9088'])
  })
})
