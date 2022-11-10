import { mount, createLocalVue } from '@vue/test-utils'
import Info from '@/components/Home-Info/Info.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
  contacts: {},
}))

describe('Info.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(Info, {
      localVue,
      computed: {
        contactsItems() {
          return null
        },
      },
      mocks: {
        $t: (msg) => msg,
        $router: [],
      },
      stubs: ['v-container', 'v-row', 'v-progress-linear', 'v-icon', 'v-dialog',
        'v-col', 'v-toolbar', 'v-spacer', 'v-toolbar-title'],
    })
  })

  it('close redirects to Home', () => {
    wrapper.vm.close()
    expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
  })

  it('updateLoading updates loading field', () => {
    wrapper.vm.updateLoading(true)
    expect(wrapper.vm.loading).toBe(true)
  })
})
