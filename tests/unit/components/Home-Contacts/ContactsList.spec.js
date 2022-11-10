import { mount, createLocalVue } from '@vue/test-utils'
import ContactsList from '@/components/Home-Contacts/ContactsList.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('ContactsList.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(ContactsList, {
      localVue,
      propsData: {
        items: [{
          initials: 'AA',
          number: '1234',
          id: '1',
        }],
      },
      computed: {
        accountInfo() {
          return {
            login: '13874',
          }
        },
      },
      mocks: {
        $t: (msg) => msg,
        $route: {
          params: {
            number: '123',
          },
        },
      },
      stubs: ['v-container', 'v-row', 'v-col', 'v-icon', 'panelrowitemlink', 'router-link',
        'v-badge', 'v-avatar'],
    })
  })

  it('sipStatusColor returns "green" for 1', () => {
    const res = wrapper.vm.sipStatusColor(1)
    expect(res).toBe('green')
  })

  it('sipStatusColor returns "grey" for 0', () => {
    const res = wrapper.vm.sipStatusColor(0)
    expect(res).toBe('grey')
  })
})
