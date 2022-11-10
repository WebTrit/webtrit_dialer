import { shallowMount, createLocalVue } from '@vue/test-utils'
import RecentCallsAppBar from '@/components/Home-Recent-Calls/RecentCallsAppBar.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('RecentCallsAppBar.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(RecentCallsAppBar, {
      localVue,
      mocks: {
        $t: (msg) => msg,
        $route: {
          name: 'Contacts',
        },
        $router: [],
      },
      stubs: ['v-tab'],
    })
  })

  it('filter emits event and redirects if route is not on Home', () => {
    wrapper.vm.filter('upd')
    expect(wrapper.emitted().upd).toBeTruthy()
    expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
  })

  it('filter emits event and doesn\'t redirect if route is on Home', () => {
    wrapper.vm.$route = {
      name: 'Home',
    }
    wrapper.vm.filter('upd')
    expect(wrapper.emitted().upd).toBeTruthy()
    expect(wrapper.vm.$router).toEqual([])
  })
})
