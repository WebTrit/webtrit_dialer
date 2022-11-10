import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactsAppBar from '@/components/Contacts/ContactsAppBar.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
}))

describe('ContactsAppBar.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactsAppBar, {
      localVue,
      propsData: {
        headers: [
          { id: 1, sortable: true },
          { id: 2, sortable: false },
          { id: 3, sortable: true },
        ],
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-tab', 'v-text-field', 'v-select'],
    })
  })

  it('options returns only sortable headers', () => {
    expect(wrapper.vm.options).toEqual([
      { id: 1, sortable: true },
      { id: 3, sortable: true },
    ])
  })

  it('search watcher emits event when search field changes', async () => {
    await wrapper.setData({
      search: 'new val',
    })
    expect(wrapper.emitted()['search-update']).toBeTruthy()
  })

  it('select watcher emits event when select field changes', async () => {
    await wrapper.setData({
      select: 'new val',
    })
    expect(wrapper.emitted()['sort-update']).toBeTruthy()
  })
})
