import { shallowMount, createLocalVue, config } from '@vue/test-utils'
import LogoutBtn from '@/components/Main/SideNavigation/LogoutBtn.vue'

config.showDeprecationWarnings = false

describe('LogoutBtn.vue', () => {
  const localVue = createLocalVue()
  const logout = jest.fn()
  const snackbarShow = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(LogoutBtn, {
      localVue,
      methods: {
        snackbarShow,
        logout,
      },
      mocks: {
        $t: (msg) => msg,
        $router: [],
      },
      stubs: ['v-list-item', 'v-list-item-action', 'v-icon', 'v-list-item-content',
        'v-list-item-title'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('logoutUser performs logout', (done) => {
    wrapper.vm.logoutUser()
    setTimeout(() => {
      expect(logout).toHaveBeenCalled()
      expect(wrapper.vm.$router).toEqual([{ name: 'Login' }])
      done()
    }, 0)
  })
})
