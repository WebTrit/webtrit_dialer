import { shallowMount, createLocalVue } from '@vue/test-utils'
import PanelRowItem from '@/components/Layout/PanelRowItem.vue'

describe('PanelRowItem.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(PanelRowItem, {
      localVue,
      propsData: {
        items: [
          { number: '234', id: '2' },
          { number: '8595', id: '1' },
          { number: '387447', id: '5' },
        ],
        linkName: 'ContactDetails',
      },
      stubs: ['v-container', 'v-row'],
    })
  })

  it('selectItem sets selectedItem', () => {
    wrapper.vm.selectItem({ number: '8595', id: '1' })
    expect(wrapper.vm.selectedItem).toEqual({ number: '8595', id: '1' })
  })

  it('getContactId returns contact.number if linkName === "ContactDetails"', () => {
    expect(wrapper.vm.getContactId({ number: '234', id: '2' })).toBe('234')
  })

  it('getContactId returns contact.id if linkName !== "ContactDetails"', async () => {
    await wrapper.setProps({
      linkName: 'CallDetails',
    })
    expect(wrapper.vm.getContactId({ number: '234', id: '2' })).toBe('2')
  })
})
