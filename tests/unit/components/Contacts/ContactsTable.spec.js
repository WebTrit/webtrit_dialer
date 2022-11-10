import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContactsTable from '@/components/Contacts/ContactsTable.vue'

jest.mock('@/mixins', () => ({
  breakpoints: {},
  contacts: {},
}))

describe('ContactsTable.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(ContactsTable, {
      localVue,
      computed: {
        contactsItems() {
          return [
            { number: '123' },
            { number: '456' },
            { number: '789' },
            { number: '1010' },
          ]
        },
        favoriteItems() {
          return [
            { number: '123' },
          ]
        },
        accountInfo() {
          return {
            login: '789',
          }
        },
        loading() {
          return false
        },
        fetchDataError() {
          return false
        },
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: ['v-data-table', 'v-btn', 'v-icon'],
    })
  })

  it('filteredContactsItems returns all contacts except our user himself', () => {
    expect(wrapper.vm.filteredContactsItems).toEqual([
      { number: '123' },
      { number: '456' },
      { number: '1010' },
    ])
  })

  it('items retuns filteredContactsItems if filter === all', async () => {
    await wrapper.setData({
      filter: 'all',
    })
    expect(wrapper.vm.items).toEqual([
      { number: '123' },
      { number: '456' },
      { number: '1010' },
    ])
  })

  it('items returns favoriteItems if filter !== all', async () => {
    await wrapper.setData({
      filter: 'favorites',
    })
    expect(wrapper.vm.items).toEqual([
      { number: '123' },
    ])
  })

  it('updateSearch updates search field', () => {
    wrapper.vm.updateSearch('new search')
    expect(wrapper.vm.search).toBe('new search')
  })

  it('updatePage updates page field in dataTableOptions', () => {
    wrapper.vm.updatePage(3)
    expect(wrapper.vm.dataTableOptions.page).toBe(3)
  })

  it('updateSort updates sort field', () => {
    wrapper.vm.updateSort('new sort')
    expect(wrapper.vm.sort).toBe('new sort')
  })

  it('filterContacts updates filter field', () => {
    wrapper.vm.filterContacts('new filter')
    expect(wrapper.vm.filter).toBe('new filter')
  })
})
