import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactsAppBar from '@/components/Home-Contacts/ContactsAppBar.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('ContactsAppBar.vue', () => {
  const localVue = createLocalVue()
  const commit = jest.fn()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactsAppBar, {
      localVue,
      mocks: {
        $t: (msg) => msg,
        $store: {
          commit,
        },
        $route: {
          name: 'Contacts',
        },
        $router: [],
      },
      stubs: ['v-tab', 'v-text-field', 'v-btn', 'v-icon'],
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('openKeypad calls store mutation', () => {
    wrapper.vm.openKeypad()
    expect(commit).toHaveBeenCalledWith('toggleDialogNumberVisibility', true)
  })

  it('filter emits event and redirects to Home if not there already', () => {
    wrapper.vm.filter('upd-filter')
    expect(wrapper.emitted()['upd-filter']).toBeTruthy()
    expect(wrapper.vm.$router).toEqual([{ name: 'Home' }])
  })

  it('filter emits event and doesn\'t redirect if on Home route', async () => {
    wrapper.vm.$route.name = 'Home'
    await wrapper.vm.$nextTick()
    wrapper.vm.filter('upd-filter')
    expect(wrapper.emitted()['upd-filter']).toBeTruthy()
    expect(wrapper.vm.$router).toEqual([])
  })

  it('search watcher emits event with trimmed search field', async () => {
    await wrapper.setData({
      search: 'new val ',
    })
    expect(wrapper.emitted()['search-update']).toBeTruthy()
  })
})
