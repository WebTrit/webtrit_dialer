import { mount, createLocalVue, config } from '@vue/test-utils'
import Contacts from '@/components/Home-Contacts/Contacts.vue'

config.showDeprecationWarnings = false

const getContacts = jest.fn()

const contacts = {
  methods: {
    $_contacts_getContacts() {
      getContacts()
    },
  },
}

const breakpoints = {
  computed: {
    $_breakpoints_mobile() {
      return false
    },
  },
}

describe('Contacts.vue', () => {
  const localVue = createLocalVue()
  let wrapper

  beforeEach(() => {
    wrapper = mount(Contacts, {
      localVue,
      mixins: [contacts, breakpoints],
      data() {
        return {
          filter: 'favorite',
        }
      },
      computed: {
        loading() {
          return false
        },
        fetchDataError() {
          return false
        },
        accountInfo() {
          return {
            login: '1243',
          }
        },
        contactsItems() {
          return [
            { number: '1243', name: 'Werrl' },
            { number: '3434', name: 'Poek' },
            { number: '567', name: 'Peje' },
          ]
        },
        favoriteItems() {
          return [
            { number: '1433' },
            { number: '0955' },
            { number: '338' },
          ]
        },
      },
      mocks: {
        $t: (msg) => msg,
      },
      stubs: {
        'v-data-iterator': '<div></div>',
      },
    })
  })

  it('updateSearch updates search variable', () => {
    wrapper.vm.updateSearch('new search')
    expect(wrapper.vm.search).toBe('new search')
  })

  it('filterContacts assigns filter value', () => {
    wrapper.vm.filterContacts('all')
    expect(wrapper.vm.filter).toBe('all')
  })

  it('filteredContactsItems returns all contacts without current user', () => {
    expect(wrapper.vm.filteredContactsItems).toEqual([
      { number: '3434', name: 'Poek' },
      { number: '567', name: 'Peje' },
    ])
  })

  it('sortedContactsItems returns all contacts if current user is ', () => {
    expect(wrapper.vm.sortedContactsItems).toEqual([
      { number: '567', name: 'Peje' },
      { number: '3434', name: 'Poek' },
    ])
  })

  it('items returns favoriteItems if filter !== "all"', () => {
    expect(wrapper.vm.items).toEqual([
      { number: '1433' },
      { number: '0955' },
      { number: '338' },
    ])
  })

  it('items returns sortedItems if filter === "all"', async () => {
    await wrapper.setData({
      filter: 'all',
    })
    expect(wrapper.vm.items).toEqual([
      { number: '567', name: 'Peje' },
      { number: '3434', name: 'Poek' },
    ])
  })
})
