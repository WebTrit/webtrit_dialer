import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactDetails from '@/components/Shared/ContactDetails.vue'

describe('ContactDetails.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactDetails, {
      localVue,
      propsData: {
        contact: {
          initials: 'AA',
          number: '3434',
          sip_status: 1,
          name: 'User',
        },
      },
      stubs: ['v-col', 'v-card', 'v-row', 'v-col', 'v-card-actions', 'v-card-text'],
    })
  })

  it('sipStatusColor returns green if sip_status === 1', () => {
    const res = wrapper.vm.sipStatusColor(1)
    expect(res).toBe('green')
  })

  it('sipStatusColor returns grey if sip_status === 0', () => {
    const res = wrapper.vm.sipStatusColor(0)
    expect(res).toBe('grey')
  })

  it('favoriteIcon is rendered if contact and contact.number are provided', () => {
    expect(wrapper.find('favoriteicon-stub').exists()).toBeTruthy()
  })

  it('favoriteIcon is not rendered if contact or contact.number is not provided', async () => {
    await wrapper.setProps({
      contact: {
        initials: 'AA',
        sip_status: 1,
        name: 'User',
      },
    })
    expect(wrapper.find('favoriteicon-stub').exists()).toBeFalsy()
  })

  it('ContactDetailsList is rendered if contact is provided', () => {
    expect(wrapper.find('contactdetailslist-stub').exists()).toBeTruthy()
  })
})
