import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactsListActionBtns from '@/components/Home-Contacts/ContactsListActionBtns.vue'

describe('ContactsListActionBtns.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactsListActionBtns, {
      localVue,
      propsData: {
        contact: {
          number: '1234',
        },
        hoveredItem: '2344',
        selectedItem: '1234',
      },
      mocks: {
        $route: {
          params: {
            number: undefined,
          },
        },
      },
      stubs: ['v-col', 'v-icon'],
    })
  })

  it('action btns are rendered if $route.params.number is undefined', () => {
    expect(wrapper.find('favoriteicon-stub').exists()).toBe(true)
    expect(wrapper.find('audiocallbtn-stub').exists()).toBe(true)
    expect(wrapper.find('videocallbtn-stub').exists()).toBe(true)
  })

  it('action btns are not rendered if $route.params.number contains number', async () => {
    wrapper.vm.$route.params.number = '1234'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('favoriteicon-stub').exists()).toBe(false)
    expect(wrapper.find('audiocallbtn-stub').exists()).toBe(false)
    expect(wrapper.find('videocallbtn-stub').exists()).toBe(false)
  })
})
